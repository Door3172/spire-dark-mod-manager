import os
import json
import sys
import re
import subprocess
import webbrowser
import shutil
from bottle import route, run, static_file, request, response

# Base paths
if getattr(sys, 'frozen', False):
    # PyInstaller execution environment
    EXE_DIR = os.path.dirname(sys.executable)
    GUI_DIR = os.path.join(sys._MEIPASS, "gui")
else:
    # Development source execution environment
    EXE_DIR = os.path.dirname(__file__)
    GUI_DIR = os.path.join(os.path.dirname(__file__), "gui")

CONFIG_FILE = os.path.join(EXE_DIR, "config.json")

# Adaptive workspace detection: use EXE_DIR if folders like '必装前置' exist, else use parent directory
if os.path.exists(os.path.join(EXE_DIR, "必装前置")):
    WORKSPACE_DIR = os.path.abspath(EXE_DIR)
else:
    WORKSPACE_DIR = os.path.abspath(os.path.join(EXE_DIR, ".."))

CATEGORIES = ["必装前置", "功能类", "玩法扩展类", "皮肤美化类", "角色扩展类"]

# Exclude directories that are known to contain assets, builds, or source files
EXCLUDE_DIRS = {
    '.git', '.import', 'images', 'assets', 'sounds', 'audio', 'music', 
    'locales', 'localization', 'src', 'bin', 'obj', 'properties', 'scenes'
}

# Helper to check if a directory is a Windows Directory Junction or Symlink
def is_junction_path(path):
    try:
        # FILE_ATTRIBUTE_REPARSE_POINT = 0x400 (1024)
        return bool(os.path.isdir(path) and (os.stat(path).st_file_attributes & 0x400))
    except Exception:
        return False

# Sync all true local physical mods to the Default configuration
def sync_local_mods_to_default(config):
    game_path = config.get("game_path")
    if not game_path or not is_path_safe_to_check(game_path):
        return False
        
    default_list = config["profiles"].get("Default")
    if default_list is None:
        config["profiles"]["Default"] = []
        default_list = config["profiles"]["Default"]
        
    changed = False
    
    # 1. Scan mods/ (both physical folders and junctions should be active)
    mods_dir = os.path.join(game_path, "mods")
    if os.path.exists(mods_dir):
        try:
            for item in os.listdir(mods_dir):
                if item.lower() in EXCLUDE_DIRS:
                    continue
                item_path = os.path.join(mods_dir, item)
                if os.path.isdir(item_path):
                    mod_id = item
                    json_files = find_mod_jsons_fast(item_path)
                    if json_files:
                        for j_file in json_files:
                            try:
                                if os.path.getsize(j_file) <= 50 * 1024:
                                    with open(j_file, 'r', encoding='utf-8-sig') as f:
                                        raw_content = f.read()
                                    cleaned = clean_json_comments(raw_content)
                                    data = json.loads(cleaned)
                                    if isinstance(data, dict) and 'id' in data:
                                        mod_id = data['id']
                                        break
                            except Exception:
                                pass
                    if mod_id not in default_list:
                        default_list.append(mod_id)
                        changed = True
        except Exception as e:
            print(f"Error syncing active mods to Default: {e}")
            
    # 2. Scan mods_disabled/ (only physical folders should be imported as active, ignore junctions)
    disabled_dir = os.path.join(game_path, "mods_disabled")
    if os.path.exists(disabled_dir):
        try:
            for item in os.listdir(disabled_dir):
                if item.lower() in EXCLUDE_DIRS:
                    continue
                item_path = os.path.join(disabled_dir, item)
                if os.path.isdir(item_path) and not is_junction_path(item_path):
                    mod_id = item
                    json_files = find_mod_jsons_fast(item_path)
                    if json_files:
                        for j_file in json_files:
                            try:
                                if os.path.getsize(j_file) <= 50 * 1024:
                                    with open(j_file, 'r', encoding='utf-8-sig') as f:
                                        raw_content = f.read()
                                    cleaned = clean_json_comments(raw_content)
                                    data = json.loads(cleaned)
                                    if isinstance(data, dict) and 'id' in data:
                                        mod_id = data['id']
                                        break
                            except Exception:
                                pass
                    if mod_id not in default_list:
                        default_list.append(mod_id)
                        changed = True
        except Exception as e:
            print(f"Error syncing disabled physical mods to Default: {e}")
            
    if changed:
        config["profiles"]["Default"] = default_list
        return True
    return False

# Standard HTTP CORS helper
def enable_cors(fn):
    def _enable_cors(*args, **kwargs):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With'
        if request.method == 'OPTIONS':
            return {}
        return fn(*args, **kwargs)
    return _enable_cors

def clean_json_comments(text):
    lines = text.split('\n')
    cleaned = []
    for line in lines:
        in_string = False
        comment_start = -1
        i = 0
        while i < len(line):
            c = line[i]
            if c == '"' and (i == 0 or line[i-1] != '\\'):
                in_string = not in_string
            elif c == '/' and i + 1 < len(line) and line[i+1] == '/' and not in_string:
                comment_start = i
                break
            i += 1
        if comment_start != -1:
            line = line[:comment_start]
        cleaned.append(line)
    return '\n'.join(cleaned)

# Win32 helper to check if a drive is connected and ready to avoid network hangs
def is_path_safe_to_check(path):
    if not path:
        return False
    try:
        # Fast exit for UNC network paths to avoid long network timeout hangs
        if path.startswith('\\\\'):
            return False
            
        import ctypes
        drive = os.path.splitdrive(path)[0]
        if drive:
            drive_letter = drive + "\\"
            # GetDriveTypeW: returns <= 1 if the drive does not exist, is disconnected, or has no root directory
            dtype = ctypes.windll.kernel32.GetDriveTypeW(drive_letter)
            if dtype <= 1:
                return False
    except Exception:
        pass
    return True

# FAST JSON FINDER: Scans only depth 0 and depth 1 (pruning asset directories)
def find_mod_jsons_fast(base_path):
    json_files = []
    
    # Depth 0: check direct files
    try:
        with os.scandir(base_path) as entries:
            for entry in entries:
                if entry.is_file() and entry.name.endswith('.json') and not entry.name.startswith('.'):
                    try:
                        # Skip files larger than 50KB (definitely not mod config metadata JSON)
                        if entry.stat().st_size <= 50 * 1024:
                            json_files.append(entry.path)
                    except Exception:
                        pass
    except Exception:
        return []
        
    if json_files:
        return json_files
        
    # Depth 1: check direct subfolders (excluding assets/builds)
    extended_excludes = EXCLUDE_DIRS.union({
        'node_modules', 'content', 'art', 'videos', 'texture', 'textures', 
        'fonts', 'lib', 'libs', 'docs', 'packages', 'build', 'dist', 'bin', 'obj'
    })
    
    try:
        with os.scandir(base_path) as entries:
            for entry in entries:
                if entry.is_dir() and not entry.is_symlink():
                    if entry.name.lower() in extended_excludes:
                        continue
                    try:
                        with os.scandir(entry.path) as sub_entries:
                            for sub_entry in sub_entries:
                                if sub_entry.is_file() and sub_entry.name.endswith('.json') and not sub_entry.name.startswith('.'):
                                    try:
                                        if sub_entry.stat().st_size <= 50 * 1024:
                                            json_files.append(sub_entry.path)
                                    except Exception:
                                        pass
                    except Exception:
                        pass
    except Exception:
        pass
        
    return json_files

def auto_detect_sts2_path():
    try:
        import winreg
        key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Valve\Steam")
        steam_path, _ = winreg.QueryValueEx(key, "SteamPath")
        winreg.CloseKey(key)
        
        steam_path = os.path.abspath(steam_path)
        vdf_path = os.path.join(steam_path, "steamapps", "libraryfolders.vdf")
        if os.path.exists(vdf_path):
            libraries = [steam_path]
            with open(vdf_path, 'r', encoding='utf-8') as f:
                content = f.read()
            paths = re.findall(r'"path"\s+"([^"]+)"', content)
            for p in paths:
                p_clean = p.replace("\\\\", "\\")
                # Safety check: avoid scanning disconnected external drives/network shares
                if is_path_safe_to_check(p_clean) and p_clean not in libraries and os.path.exists(p_clean):
                    libraries.append(p_clean)
            
            for lib in libraries:
                sts2_dir = os.path.join(lib, "steamapps", "common", "Slay the Spire 2")
                if is_path_safe_to_check(sts2_dir) and os.path.exists(sts2_dir):
                    return sts2_dir
    except Exception as e:
        print("Auto detect failed:", e)
    return ""

def import_all_local_mods(config, profile_name):
    game_path = config.get("game_path")
    if not game_path or not is_path_safe_to_check(game_path):
        return False
        
    enabled_list = config["profiles"].get(profile_name, [])
    import_dirs = [
        os.path.join(game_path, "mods"),
        os.path.join(game_path, "mods_disabled")
    ]
    changed = False
    
    for mods_dir in import_dirs:
        if os.path.exists(mods_dir):
            try:
                for item in os.listdir(mods_dir):
                    if item.lower() in EXCLUDE_DIRS:
                        continue
                    item_path = os.path.join(mods_dir, item)
                    if os.path.isdir(item_path):
                        mod_id = item
                        json_files = find_mod_jsons_fast(item_path)
                        if json_files:
                            try:
                                if os.path.getsize(json_files[0]) <= 50 * 1024:
                                    with open(json_files[0], 'r', encoding='utf-8-sig') as f:
                                        raw_content = f.read()
                                    cleaned = clean_json_comments(raw_content)
                                    data = json.loads(cleaned)
                                    if isinstance(data, dict) and 'id' in data:
                                        mod_id = data['id']
                            except Exception:
                                pass
                        if mod_id not in enabled_list:
                            enabled_list.append(mod_id)
                            changed = True
            except Exception as e:
                print(f"Error scanning {mods_dir}: {e}")
                
    if changed:
        config["profiles"][profile_name] = enabled_list
        return True
    return False

# Config Manager (Pivoted to prevent repeated auto-detection loops)
def load_config():
    config = None
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                config = json.load(f)
        except Exception:
            pass
            
    if not config:
        config = {
            "game_path": "",
            "active_profile": "Default",
            "profiles": {
                "Default": []
            }
        }
        
    # If game_path is empty, attempt auto-detection once and save it
    if not config.get("game_path"):
        detected = auto_detect_sts2_path()
        if detected:
            config["game_path"] = detected
            save_config_to_file(config)
            
    # Sync local mods to the Default configuration
    if sync_local_mods_to_default(config):
        save_config_to_file(config)
            
    return config
            
    return config

def save_config_to_file(config):
    try:
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=4, ensure_ascii=False)
    except Exception as e:
        print(f"Failed to save config: {e}")

# Scan original local mods present in game's mods/ and mods_disabled/
def scan_game_local_mods(game_path):
    if not game_path or not is_path_safe_to_check(game_path):
        return []
    
    local_mods = []
    paths_to_scan = [
        ("mods", os.path.join(game_path, "mods")),
        ("mods_disabled", os.path.join(game_path, "mods_disabled"))
    ]
    
    for status, dir_path in paths_to_scan:
        if not os.path.exists(dir_path):
            continue
        
        try:
            for item in os.listdir(dir_path):
                if item.lower() in EXCLUDE_DIRS:
                    continue
                item_path = os.path.join(dir_path, item)
                if not os.path.isdir(item_path) or os.path.islink(item_path) or is_junction_path(item_path):
                    continue
                    
                json_files = find_mod_jsons_fast(item_path)
                
                if not json_files:
                    local_mods.append({
                        "id": item,
                        "name": item,
                        "author": "本地",
                        "version": "-",
                        "dependencies": [],
                        "affects_gameplay": True,
                        "description": "本地安裝的模組（未找到描述檔）",
                        "category": "原本模組",
                        "folder_name": item,
                        "target_link_dir": item_path,
                        "is_local_game_mod": True,
                        "local_status": status
                    })
                else:
                    found_valid = False
                    for j_file in json_files:
                        try:
                            with open(j_file, 'r', encoding='utf-8-sig') as f:
                                raw_content = f.read()
                            
                            cleaned_content = clean_json_comments(raw_content)
                            data = json.loads(cleaned_content)
                            
                            if not isinstance(data, dict) or ('id' not in data and 'name' not in data):
                                continue
                                
                            m_id = data.get('id', item)
                            m_name = data.get('name', item)
                            m_author = data.get('author', "本地")
                            m_ver = data.get('version', "-")
                            
                            deps = data.get('dependencies', [])
                            deps_list = []
                            if isinstance(deps, list):
                                for dep in deps:
                                    if isinstance(dep, dict):
                                        item_id = dep.get('id', '-')
                                        item_ver = dep.get('min_version')
                                        deps_list.append(f"{item_id} (>={item_ver})" if item_ver else item_id)
                                    else:
                                        deps_list.append(str(dep))
                            else:
                                deps_list.append(str(deps))
                                
                            m_gameplay = bool(data.get('affects_gameplay', True))
                            m_desc = data.get('description', "本地安裝的模組").replace('\r', '').replace('\n', ' ')
                            
                            local_mods.append({
                                "id": m_id,
                                "name": m_name,
                                "author": m_author,
                                "version": m_ver,
                                "dependencies": deps_list,
                                "affects_gameplay": m_gameplay,
                                "description": m_desc,
                                "category": "原本模組",
                                "folder_name": item,
                                "target_link_dir": os.path.dirname(j_file),
                                "is_local_game_mod": True,
                                "local_status": status
                            })
                            found_valid = True
                            break
                        except Exception:
                            pass
                            
                    if not found_valid:
                        local_mods.append({
                            "id": item,
                            "name": f"{item} (解析失敗)",
                            "author": "本地",
                            "version": "-",
                            "dependencies": [],
                            "affects_gameplay": True,
                            "description": "本地模組 JSON 解析出錯或未找到合法描述檔",
                            "category": "原本模組",
                            "folder_name": item,
                            "target_link_dir": item_path,
                            "is_local_game_mod": True,
                            "local_status": status
                        })
        except Exception as e:
            print(f"Error scanning local mods in {dir_path}: {e}")
            
    return local_mods

# Static Routes
@route('/')
def serve_index():
    return static_file('index.html', root=GUI_DIR)

@route('/<filename:path>')
def serve_static(filename):
    return static_file(filename, root=GUI_DIR)

# API Routes
@route('/api/config', method=['GET', 'POST', 'OPTIONS'])
@enable_cors
def api_config():
    config = load_config()
    if request.method == 'POST':
        new_data = request.json
        config.update(new_data)
        
        # If game_path is being updated, sync local mods to the Default configuration
        if "game_path" in new_data:
            sync_local_mods_to_default(config)
                        
        save_config_to_file(config)
        return {"status": "success", "config": config}
    return config

@route('/api/detect_path', method=['POST', 'OPTIONS'])
@enable_cors
def api_detect_path():
    detected = auto_detect_sts2_path()
    if detected:
        return {"status": "success", "path": detected}
    return {"status": "error", "message": "無法自動偵測到遊戲路徑，請手動輸入。"}

@route('/api/select_folder', method=['POST', 'OPTIONS'])
@enable_cors
def api_select_folder():
    try:
        import tkinter as tk
        from tkinter import filedialog
        
        config = load_config()
        initial_dir = config.get("game_path")
        if not initial_dir or not os.path.exists(initial_dir):
            initial_dir = WORKSPACE_DIR
            
        root = tk.Tk()
        root.withdraw()
        root.attributes('-topmost', True)
        folder_path = filedialog.askdirectory(
            title="選擇《殺戮尖塔 2》遊戲安裝資料夾",
            initialdir=initial_dir
        )
        root.destroy()
        
        if folder_path:
            # Normalize path delimiters for Windows
            folder_path = os.path.abspath(folder_path)
            return {"status": "success", "path": folder_path}
        else:
            return {"status": "cancelled"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@route('/api/mods', method=['GET', 'OPTIONS'])
@enable_cors
def api_mods():
    config = load_config()
    mods_list = []
    
    # 1. Scan compilation pack categories
    for cat in CATEGORIES:
        cat_path = os.path.join(WORKSPACE_DIR, cat)
        if not os.path.exists(cat_path):
            continue
        
        try:
            for mod_dir in sorted(os.listdir(cat_path)):
                mod_path = os.path.join(cat_path, mod_dir)
                if not os.path.isdir(mod_path):
                    continue
                
                json_files = find_mod_jsons_fast(mod_path)
                
                if not json_files:
                    mods_list.append({
                        "id": mod_dir,
                        "name": mod_dir,
                        "author": "未知",
                        "version": "-",
                        "dependencies": [],
                        "affects_gameplay": True,
                        "description": "無模組描述資訊（未找到 JSON）",
                        "category": cat,
                        "folder_name": mod_dir,
                        "target_link_dir": mod_path
                    })
                else:
                    found_valid = False
                    for j_file in json_files:
                        try:
                            with open(j_file, 'r', encoding='utf-8-sig') as f:
                                raw_content = f.read()
                            
                            cleaned_content = clean_json_comments(raw_content)
                            data = json.loads(cleaned_content)
                            
                            if not isinstance(data, dict) or ('id' not in data and 'name' not in data):
                                continue
                                
                            m_id = data.get('id', mod_dir)
                            m_name = data.get('name', mod_dir)
                            m_author = data.get('author', "未知")
                            m_ver = data.get('version', "-")
                            
                            deps = data.get('dependencies', [])
                            deps_list = []
                            if isinstance(deps, list):
                                for item in deps:
                                    if isinstance(item, dict):
                                        item_id = item.get('id', '-')
                                        item_ver = item.get('min_version')
                                        deps_list.append(f"{item_id} (>={item_ver})" if item_ver else item_id)
                                    else:
                                        deps_list.append(str(item))
                            else:
                                deps_list.append(str(deps))
                                
                            m_gameplay = bool(data.get('affects_gameplay', True))
                            m_desc = data.get('description', "無模組描述").replace('\r', '').replace('\n', ' ')
                            
                            mods_list.append({
                                "id": m_id,
                                "name": m_name,
                                "author": m_author,
                                "version": m_ver,
                                "dependencies": deps_list,
                                "affects_gameplay": m_gameplay,
                                "description": m_desc,
                                "category": cat,
                                "folder_name": mod_dir,
                                "target_link_dir": os.path.dirname(j_file)
                            })
                            found_valid = True
                            break
                        except Exception:
                            pass
                    if not found_valid:
                        mods_list.append({
                            "id": mod_dir,
                            "name": f"{mod_dir} (解析失敗)",
                            "author": "未知",
                            "version": "-",
                            "dependencies": [],
                            "affects_gameplay": True,
                            "description": "JSON 解析出錯或未找到合法描述檔",
                            "category": cat,
                            "folder_name": mod_dir,
                            "target_link_dir": mod_path
                        })
        except Exception as e:
            print(f"Error scanning category {cat}: {e}")
            
    # 2. Scan game path's local mods (mods/ and mods_disabled/)
    game_path = config.get("game_path")
    if game_path and is_path_safe_to_check(game_path):
        local_mods = scan_game_local_mods(game_path)
        # Filter out local mods that have the same ID as any compilation pack mod to prevent duplication
        compilation_ids = {m["id"].lower() for m in mods_list}
        filtered_local_mods = [lm for lm in local_mods if lm["id"].lower() not in compilation_ids]
        mods_list.extend(filtered_local_mods)
        
    return json.dumps(mods_list, ensure_ascii=False)

@route('/api/apply', method=['POST', 'OPTIONS'])
@enable_cors
def api_apply():
    config = load_config()
    profile_name = request.json.get("profile")
    
    if not config["game_path"]:
        return {"status": "error", "message": "請先設定《殺戮尖塔 2》遊戲路徑"}
    
    game_path = config["game_path"]
    mods_dir = os.path.join(game_path, "mods")
    disabled_dir = os.path.join(game_path, "mods_disabled")
    
    if not os.path.exists(mods_dir):
        try:
            os.makedirs(mods_dir)
        except Exception as e:
            return {"status": "error", "message": f"無法建立遊戲 mods 資料夾: {str(e)}"}
            
    if not os.path.exists(disabled_dir):
        try:
            os.makedirs(disabled_dir)
        except Exception:
            pass
    
    # 1. Clear existing symlinks / junctions ONLY (preserve real folders!)
    for item in os.listdir(mods_dir):
        item_path = os.path.join(mods_dir, item)
        is_junction = False
        try:
            is_junction = bool(os.path.isdir(item_path) and (os.stat(item_path).st_file_attributes & 0x400))
        except Exception:
            pass
            
        if os.path.islink(item_path) or is_junction:
            try:
                os.rmdir(item_path)
            except Exception:
                try:
                    os.remove(item_path)
                except Exception as ex:
                    print(f"Failed to remove link {item_path}: {ex}")

    enabled_ids = config["profiles"].get(profile_name, [])
    all_mods = json.loads(api_mods())
    
    success_count = 0
    failed_mods = []
    
    for mod in all_mods:
        is_enabled = mod["id"] in enabled_ids
        folder_name = mod["folder_name"]
        
        # Handle original local game mods (moving between mods/ and mods_disabled/)
        if mod.get("is_local_game_mod"):
            if is_enabled:
                src = os.path.join(disabled_dir, folder_name)
                dst = os.path.join(mods_dir, folder_name)
                if os.path.exists(src) and not os.path.exists(dst):
                    try:
                        shutil.move(src, dst)
                        success_count += 1
                    except Exception as e:
                        failed_mods.append(f"{mod['name']} (移動失敗: {str(e)})")
                elif os.path.exists(dst):
                    success_count += 1
            else:
                src = os.path.join(mods_dir, folder_name)
                dst = os.path.join(disabled_dir, folder_name)
                if os.path.exists(src) and not os.path.exists(dst):
                    try:
                        shutil.move(src, dst)
                    except Exception as e:
                        print(f"Failed to move local mod to disabled: {e}")
                        
        # Handle compilation pack mods (creating junctions or moving physical folders if they exist)
        else:
            source_dir = mod["target_link_dir"]
            link_name = os.path.basename(source_dir)
            link_path = os.path.join(mods_dir, link_name)
            disabled_path = os.path.join(disabled_dir, link_name)
            
            alt_link_path = os.path.join(mods_dir, folder_name)
            alt_disabled_path = os.path.join(disabled_dir, folder_name)
            
            # Check junction status for both possible paths
            is_junction = False
            is_alt_junction = False
            try:
                if os.path.exists(link_path):
                    is_junction = bool(os.stat(link_path).st_file_attributes & 0x400) or os.path.islink(link_path)
                if os.path.exists(alt_link_path):
                    is_alt_junction = bool(os.stat(alt_link_path).st_file_attributes & 0x400) or os.path.islink(alt_link_path)
            except Exception:
                pass
                
            if is_enabled:
                # If there's a physical folder in disabled_dir (either alt or standard), move it to mods_dir
                if os.path.exists(alt_disabled_path) and not os.path.exists(alt_link_path):
                    try:
                        shutil.move(alt_disabled_path, alt_link_path)
                        success_count += 1
                    except Exception as e:
                        failed_mods.append(f"{mod['name']} (移動實體失敗: {str(e)})")
                elif os.path.exists(disabled_path) and not os.path.exists(link_path):
                    try:
                        shutil.move(disabled_path, link_path)
                        success_count += 1
                    except Exception as e:
                        failed_mods.append(f"{mod['name']} (移動實體失敗: {str(e)})")
                # If it already exists in mods_dir (either standard or alt)
                elif os.path.exists(link_path) or os.path.exists(alt_link_path):
                    success_count += 1
                # Otherwise, create a junction pointing to compilation pack directory
                else:
                    cmd = f'mklink /J "{os.path.abspath(link_path)}" "{os.path.abspath(source_dir)}"'
                    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
                    if result.returncode == 0:
                        success_count += 1
                    else:
                        failed_mods.append(mod["name"])
            else:
                # If disabled, and exists as physical folder (not junction) in mods_dir, move to disabled_dir
                if os.path.exists(alt_link_path) and not is_alt_junction:
                    if not os.path.exists(alt_disabled_path):
                        try:
                            shutil.move(alt_link_path, alt_disabled_path)
                        except Exception as e:
                            print(f"Failed to move physical compilation mod to disabled: {e}")
                elif os.path.exists(link_path) and not is_junction:
                    if not os.path.exists(disabled_path):
                        try:
                            shutil.move(link_path, disabled_path)
                        except Exception as e:
                            print(f"Failed to move physical compilation mod to disabled: {e}")
                else:
                    success_count += 1
            
    config["active_profile"] = profile_name
    save_config_to_file(config)
    
    if failed_mods:
        return {
            "status": "warning",
            "message": f"設定完成，但有 {len(failed_mods)} 個模組連結或啟用失敗：{', '.join(failed_mods)}"
        }
    
    return {"status": "success", "message": f"成功啟用配置「{profile_name}」，已載入 {success_count} 個模組。"}

@route('/api/profile/add', method=['POST', 'OPTIONS'])
@enable_cors
def api_profile_add():
    config = load_config()
    name = request.json.get("name")
    if not name or name in config["profiles"]:
        return {"status": "error", "message": "配置名稱無效或已存在"}
    config["profiles"][name] = []
    save_config_to_file(config)
    return {"status": "success", "profiles": list(config["profiles"].keys())}

@route('/api/profile/delete', method=['POST', 'OPTIONS'])
@enable_cors
def api_profile_delete():
    config = load_config()
    name = request.json.get("name")
    if name == "Default":
        return {"status": "error", "message": "不能刪除預設配置 (Default)"}
    if name in config["profiles"]:
        del config["profiles"][name]
        if config["active_profile"] == name:
            config["active_profile"] = "Default"
        save_config_to_file(config)
    return {"status": "success", "config": config}

@route('/api/launch', method=['POST', 'OPTIONS'])
@enable_cors
def api_launch():
    config = load_config()
    try:
        subprocess.Popen("start steam://run/2868840", shell=True)
        return {"status": "success", "message": "已發送 Steam 啟動請求"}
    except Exception:
        pass
        
    game_path = config["game_path"]
    if game_path:
        exe_path = os.path.join(game_path, "SlayTheSpire2.exe")
        if os.path.exists(exe_path):
            try:
                subprocess.Popen(f'"{exe_path}"', shell=True, cwd=game_path)
                return {"status": "success", "message": "直接啟動遊戲成功"}
            except Exception as e:
                return {"status": "error", "message": f"直接啟動失敗: {str(e)}"}
                
    return {"status": "error", "message": "無法啟動遊戲，請確認 Steam 是否開啟，或重新設定遊戲路徑。"}

# --- Auto-Update System ---
CURRENT_VERSION = "1.0.0"
MANIFEST_URL = "https://spire-dark-mod-manager.vercel.app/manifest.json"

def compare_versions(v1, v2):
    def parse(v):
        return [int(x) for x in re.sub(r'[^0-9.]', '', v).split('.')]
    try:
        return parse(v1) > parse(v2)
    except:
        return v1 != v2

@route('/api/check_update', method=['GET', 'OPTIONS'])
@enable_cors
def api_check_update():
    import urllib.request
    try:
        req = urllib.request.Request(MANIFEST_URL, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
        
        latest_version = data["manager"]["version"]
        has_update = compare_versions(latest_version, CURRENT_VERSION)
        
        return {
            "status": "success",
            "has_update": has_update,
            "current_version": CURRENT_VERSION,
            "latest_version": latest_version,
            "changelog": data["manager"]["changelog"],
            "download_url": data["manager"]["download_url"]
        }
    except Exception as e:
        return {"status": "error", "message": f"無法獲取線上更新資訊: {str(e)}"}

@route('/api/perform_update', method=['POST', 'OPTIONS'])
@enable_cors
def api_perform_update():
    import urllib.request
    download_url = request.json.get("download_url")
    if not download_url:
        return {"status": "error", "message": "無效的下載網址"}
        
    try:
        if not getattr(sys, 'frozen', False):
            return {"status": "error", "message": "開發調試環境不支援自動更新"}
            
        current_exe = sys.executable
        temp_new_exe = current_exe + ".tmp"
        
        # Download the new file
        req = urllib.request.Request(download_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=60) as response:
            with open(temp_new_exe, 'wb') as f:
                f.write(response.read())
                
        # Generate batch script to replace exe
        bat_content = f"""@echo off
:wait
tasklist | find /i "{os.path.basename(current_exe)}" >nul
if %errorlevel% equ 0 (
    timeout /t 1 /nobreak >nul
    goto wait
)
del /f /q "{current_exe}"
ren "{temp_new_exe}" "{os.path.basename(current_exe)}"
start "" "{current_exe}"
del "%~f0"
"""
        bat_path = os.path.join(os.path.dirname(current_exe), "updater.bat")
        with open(bat_path, 'w', encoding='ansi') as f:
            f.write(bat_content)
            
        # Spawn batch script and terminate python process
        subprocess.Popen(f'"{bat_path}"', shell=True)
        webview.active_window().destroy()
        sys.exit(0)
        
    except Exception as e:
        if os.path.exists(temp_new_exe):
            try: os.remove(temp_new_exe)
            except: pass
        return {"status": "error", "message": f"執行更新時發生錯誤: {str(e)}"}

if __name__ == "__main__":
    PORT = 18690
    print(f"Starting server on http://127.0.0.1:{PORT} ...")
    
    # Use standard library ThreadingMixIn to run Bottle server in multi-threaded mode
    from wsgiref.simple_server import WSGIServer
    from socketserver import ThreadingMixIn
    from bottle import ServerAdapter
    import threading
    import time
    import webview
    
    class ThreadedWSGIServer(ThreadingMixIn, WSGIServer):
        daemon_threads = True

    class ThreadedServer(ServerAdapter):
        def run(self, handler):
            from wsgiref.simple_server import make_server
            srv = make_server(self.host, self.port, handler, server_class=ThreadedWSGIServer)
            srv.serve_forever()

    # Run Bottle in a background thread
    def start_server():
        run(server=ThreadedServer, host='127.0.0.1', port=PORT, quiet=True)

    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    
    # Wait briefly for Bottle to start
    time.sleep(0.3)
    
    # Create Native Webview window
    webview.create_window(
        title="Spire Dark Mod Manager",
        url=f"http://127.0.0.1:{PORT}/",
        width=1280,
        height=768,
        resizable=True,
        min_size=(1000, 600)
    )
    webview.start()
