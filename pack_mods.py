import os
import json
import zipfile
import shutil
import sys

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass
if hasattr(sys.stderr, 'reconfigure'):
    try:
        sys.stderr.reconfigure(encoding='utf-8')
    except:
        pass

CATEGORIES = ["必装前置", "功能类", "玩法扩展类", "皮肤美化类", "角色扩展类"]
MANIFEST_PATH = "web_portal/public/manifest.json"
OUTPUT_DIR = "dist_zips"

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

def find_mod_jsons_fast(base_path):
    json_files = []
    try:
        with os.scandir(base_path) as entries:
            for entry in entries:
                if entry.is_file() and entry.name.endswith('.json') and not entry.name.startswith('.'):
                    if entry.stat().st_size <= 50 * 1024:
                        json_files.append(entry.path)
    except Exception:
        return []
    
    if json_files:
        return json_files
        
    try:
        with os.scandir(base_path) as entries:
            for entry in entries:
                if entry.is_dir() and entry.name.lower() not in ["assets", "lib", "libs", "src", "bin", "obj"]:
                    with os.scandir(entry.path) as sub_entries:
                        for sub_entry in sub_entries:
                            if sub_entry.is_file() and sub_entry.name.endswith('.json') and not sub_entry.name.startswith('.'):
                                if sub_entry.stat().st_size <= 50 * 1024:
                                    json_files.append(sub_entry.path)
    except Exception:
        pass
    return json_files

def scan_local_mods():
    local_mods = {} # id.lower() -> (folder_path, folder_name)
    for cat in CATEGORIES:
        cat_path = cat
        if not os.path.exists(cat_path):
            continue
        try:
            for mod_dir in os.listdir(cat_path):
                mod_path = os.path.join(cat_path, mod_dir)
                if not os.path.isdir(mod_path):
                    continue
                
                json_files = find_mod_jsons_fast(mod_path)
                m_id = mod_dir
                
                if json_files:
                    for j_file in json_files:
                        try:
                            with open(j_file, 'r', encoding='utf-8-sig') as f:
                                raw_content = f.read()
                            cleaned_content = clean_json_comments(raw_content)
                            data = json.loads(cleaned_content)
                            if isinstance(data, dict) and ('id' in data or 'name' in data):
                                m_id = data.get('id', mod_dir)
                                break
                        except Exception:
                            pass
                
                local_mods[m_id.lower()] = (mod_path, mod_dir)
        except Exception as e:
            print(f"掃描 {cat} 出錯: {e}")
    return local_mods

def main():
    if not os.path.exists(MANIFEST_PATH):
        print(f"找不到 manifest.json：{MANIFEST_PATH}，請確認路徑。")
        return
        
    with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
        manifest = json.load(f)
        
    online_mods = manifest.get("mods", [])
    local_mods = scan_local_mods()
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    else:
        # Clear output dir
        shutil.rmtree(OUTPUT_DIR)
        os.makedirs(OUTPUT_DIR)
        
    success_count = 0
    missing_count = 0
    
    print("開始打包模組...")
    
    for om in online_mods:
        om_id = om.get("id")
        if not om_id:
            continue
        
        om_id_lower = om_id.lower()
        download_url = om.get("download_url", "")
        if not download_url:
            continue
            
        zip_filename = os.path.basename(download_url)
        
        if om_id_lower in local_mods:
            mod_path, original_dir = local_mods[om_id_lower]
            zip_path = os.path.join(OUTPUT_DIR, zip_filename)
            
            # Pack directory to zip file, with a root directory inside the zip named after om_id
            print(f"正在打包: {om_id} -> {zip_filename}")
            try:
                with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
                    for root, dirs, files in os.walk(mod_path):
                        for file in files:
                            file_abs_path = os.path.join(root, file)
                            # Relative path inside the source folder
                            rel_path = os.path.relpath(file_abs_path, mod_path)
                            # Target path inside zip (nested inside the mod_id folder)
                            zip_internal_path = os.path.join(om_id, rel_path)
                            z.write(file_abs_path, zip_internal_path)
                success_count += 1
            except Exception as e:
                print(f"打包 {om_id} 失敗: {e}")
        else:
            print(f"本地缺少模組: {om_id}，無法進行打包。")
            missing_count += 1
            
    print("\n==================================================")
    print(f"打包完成！共成功打包 {success_count} 個模組至 '{OUTPUT_DIR}' 資料夾。")
    if missing_count > 0:
        print(f"有 {missing_count} 個模組在本地分類資料夾中未找到，已跳過。")
    print("==================================================")
    print("【操作指引】:")
    print(f"請打開瀏覽器，至 GitHub spire-dark-mod-manager 的 v1.0.0 Release 頁面：")
    print("https://github.com/Door3172/spire-dark-mod-manager/releases/edit/v1.0.0")
    print(f"然後將 '{OUTPUT_DIR}' 資料夾下所有的 .zip 檔案全部拖拽上傳至 release 附件中並儲存即可！")
    print("==================================================")

if __name__ == "__main__":
    main()
