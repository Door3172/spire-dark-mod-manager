// Spire Dark Mod Manager Frontend Logic (Pivoted to REST API)

// Custom API Client using fetch
const api = {
    async get_config() {
        const res = await fetch('/api/config');
        return await res.json();
    },
    async save_config(cfg) {
        const res = await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cfg)
        });
        return await res.json();
    },
    async scan_mods() {
        const res = await fetch('/api/mods');
        return await res.json();
    },
    async apply_profile(profileName) {
        const res = await fetch('/api/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile: profileName })
        });
        return await res.json();
    },
    async add_profile(name) {
        const res = await fetch('/api/profile/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        return await res.json();
    },
    async delete_profile(name) {
        const res = await fetch('/api/profile/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        return await res.json();
    },
    async launch_game() {
        const res = await fetch('/api/launch', { method: 'POST' });
        return await res.json();
    },
    async auto_detect_path() {
        const res = await fetch('/api/detect_path', { method: 'POST' });
        return await res.json();
    },
    async browse_path() {
        const res = await fetch('/api/select_folder', { method: 'POST' });
        return await res.json();
    },
    async check_update() {
        const res = await fetch('/api/check_update');
        return await res.json();
    },
    async perform_update(downloadUrl) {
        const res = await fetch('/api/perform_update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ download_url: downloadUrl })
        });
        return await res.json();
    },
    async install_mod(downloadUrl, category, id) {
        const res = await fetch('/api/install_mod', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ download_url: downloadUrl, category: category, id: id })
        });
        return await res.json();
    }
};

let allMods = [];
let appConfig = {
    game_path: "",
    active_profile: "Default",
    profiles: {
        "Default": []
    }
};

let currentCategory = "all";
let currentStatus = "all";
let hideLocalMods = false;
let searchQuery = "";
let selectedModId = null;

// Initialize on DOM ready (no longer pywebviewready)
window.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM Loaded! Connecting to Python REST Server...");
    await initApp();
});

// Primary initialization
async function initApp() {
    try {
        // Load config from REST API
        appConfig = await api.get_config();
        
        // Update game path display
        updateGamePathUI();
        
        // Populate profile dropdown
        renderProfileSelect();
        
        // Bind event listeners immediately so the UI is responsive!
        bindEvents();
        
        // Scan all mods asynchronously
        await loadModsAsync();
        
        // Quietly check for updates on startup
        checkUpdate(false);
    } catch (e) {
        console.error("Initialization failed:", e);
    }
}

async function loadModsAsync() {
    const grid = document.getElementById("mods-grid");
    grid.innerHTML = `
        <div class="loading-state">
            <i class="fa-solid fa-circle-notch fa-spin"></i> 正在載入模組列表...
        </div>`;
    
    try {
        allMods = await api.scan_mods();
        renderModsGrid();
    } catch (e) {
        console.error("Failed to load mods:", e);
        grid.innerHTML = `
            <div class="empty-state" style="color: var(--danger);">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 32px; margin-bottom: 8px;"></i>
                載入模組列表失敗，請確認後端服務已啟動。
            </div>`;
    }
}

// Update game path UI
function updateGamePathUI() {
    const display = document.getElementById("game-path-display");
    const bar = document.getElementById("game-status-bar");
    const input = document.getElementById("input-game-path");
    
    if (appConfig.game_path) {
        input.value = appConfig.game_path;
        display.innerHTML = `遊戲路徑已設定：<strong>${appConfig.game_path}</strong>`;
        bar.className = "game-status-bar alert-success";
    } else {
        input.value = "";
        display.innerText = "尚未設定遊戲路徑，請至「設定與路徑」填寫。";
        bar.className = "game-status-bar alert-warning";
    }
}

// Render profile selector options
function renderProfileSelect() {
    const select = document.getElementById("profile-select");
    const activeSpan = document.getElementById("active-profile-name");
    select.innerHTML = "";
    
    Object.keys(appConfig.profiles).forEach(pName => {
        const option = document.createElement("option");
        option.value = pName;
        option.innerText = pName;
        if (pName === appConfig.active_profile) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    activeSpan.innerText = appConfig.active_profile;
}

// Render mod cards grid
function renderModsGrid() {
    const grid = document.getElementById("mods-grid");
    grid.innerHTML = "";
    
    const activeProfile = appConfig.active_profile;
    const enabledModIds = appConfig.profiles[activeProfile] || [];
    
    const filteredMods = allMods.filter(mod => {
        // Hide local mods if checkbox is checked
        if (hideLocalMods && mod.category === "原本模組") {
            return false;
        }
        
        const matchesCategory = currentCategory === "all" || mod.category === currentCategory;
        const matchesSearch = searchQuery === "" || 
            mod.name.toLowerCase().includes(searchQuery) ||
            mod.author.toLowerCase().includes(searchQuery) ||
            mod.description.toLowerCase().includes(searchQuery) ||
            mod.id.toLowerCase().includes(searchQuery);
            
        const isEnabled = enabledModIds.includes(mod.id);
        
        let matchesStatus = true;
        if (currentStatus === "enabled") {
            matchesStatus = (mod.installed !== false) && isEnabled;
        } else if (currentStatus === "disabled") {
            matchesStatus = (mod.installed !== false) && !isEnabled;
        } else if (currentStatus === "not_installed") {
            matchesStatus = (mod.installed === false);
        }
            
        return matchesCategory && matchesSearch && matchesStatus;
    });
    
    const totalCount = allMods.length;
    const enabledCount = allMods.filter(m => m.installed !== false && enabledModIds.includes(m.id)).length;
    document.getElementById("active-count").innerText = `${enabledCount} / ${totalCount}`;

    if (filteredMods.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-folder-open" style="font-size: 32px; margin-bottom: 8px;"></i>
                沒有找到符合篩選條件的模組
            </div>`;
        detectConflicts();
        return;
    }
    
    filteredMods.forEach(mod => {
        const isEnabled = enabledModIds.includes(mod.id);
        const isInstalled = mod.installed !== false;
        const card = document.createElement("div");
        card.className = `mod-card${isInstalled ? '' : ' not-installed'}`;
        card.setAttribute("data-id", mod.id);
        card.setAttribute("data-cat-tag", mod.category);
        
        let catShort = mod.category.replace("类", "");
        let badgeClass = "badge-pre";
        if (mod.category === "功能类") badgeClass = "badge-func";
        else if (mod.category === "玩法扩展类") badgeClass = "badge-game";
        else if (mod.category === "皮肤美化类") badgeClass = "badge-skin";
        else if (mod.category === "角色扩展类") badgeClass = "badge-char";
        else if (mod.category === "原本模組") badgeClass = "badge-local";

        let footerContent = "";
        if (isInstalled) {
            const targetLinkDir = mod.target_link_dir ? mod.target_link_dir.replace(/\\/g, '/') : "";
            footerContent = `
                <div class="card-actions" style="display: flex; align-items: center; gap: 8px;">
                    <button class="btn-delete" title="刪除此模組" onclick="event.stopPropagation(); window.confirmDeleteMod('${mod.id}', '${mod.name}', '${targetLinkDir}')">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                    <label class="switch" onclick="event.stopPropagation();">
                        <input type="checkbox" class="mod-toggle" data-id="${mod.id}" ${isEnabled ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
            `;
        } else {
            footerContent = `
                <button class="btn btn-download-mod" onclick="event.stopPropagation();" data-id="${mod.id}" data-url="${mod.download_url}" data-cat="${mod.category}">
                    <i class="fa-solid fa-cloud-arrow-down"></i> 下載安裝
                </button>
            `;
        }

        card.innerHTML = `
            <div class="card-header">
                <div class="card-title-area">
                    <div class="card-title" title="${mod.name}">${mod.name}</div>
                    <div class="card-author">${mod.author}</div>
                </div>
                <span class="badge ${badgeClass}">${catShort}</span>
            </div>
            <div class="card-desc">${mod.description || '無描述資訊'}</div>
            <div class="card-footer">
                <span class="card-version">V ${mod.version}</span>
                ${footerContent}
            </div>
        `;
        
        card.addEventListener("click", () => openDrawer(mod.id));
        grid.appendChild(card);
    });
    
    // Toggle active state
    document.querySelectorAll(".mod-toggle").forEach(toggle => {
        toggle.addEventListener("change", async (e) => {
            const mId = e.target.getAttribute("data-id");
            const checked = e.target.checked;
            await toggleModState(mId, checked);
        });
    });
    
    // Download online mod
    document.querySelectorAll(".btn-download-mod").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const mId = btn.getAttribute("data-id");
            const dUrl = btn.getAttribute("data-url");
            const cat = btn.getAttribute("data-cat");
            
            btn.disabled = true;
            btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> 下載中...`;
            
            try {
                const res = await api.install_mod(dUrl, cat, mId);
                if (res.status === "success") {
                    btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> 已完成`;
                    // Refresh mods list asynchronously
                    await loadModsAsync();
                } else {
                    alert("安裝失敗: " + res.message);
                    btn.disabled = false;
                    btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-down"></i> 下載安裝`;
                }
            } catch (err) {
                alert("安裝過程中出錯: " + err);
                btn.disabled = false;
                btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-down"></i> 下載安裝`;
            }
        });
    });
    
    // Auto detect conflicts
    detectConflicts();
}

window.confirmDeleteMod = async function(id, name, targetLinkDir) {
    if (!targetLinkDir) {
        alert("無法獲取此模組的本地路徑，無法刪除。");
        return;
    }
    if (!confirm(`確定要永久刪除模組「${name}」嗎？\n這將會刪除其本地檔案。`)) {
        return;
    }
    
    try {
        const res = await fetch('/api/delete_mod', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, target_link_dir: targetLinkDir })
        });
        const data = await res.json();
        if (data.status === "success") {
            alert("刪除成功！");
            await loadModsAsync();
        } else {
            alert("刪除失敗：" + data.message);
        }
    } catch (e) {
        alert("刪除過程中發生網路異常錯誤：" + e);
    }
};

// Detect conflicts and dependencies warnings
function detectConflicts() {
    const activeProfile = appConfig.active_profile;
    const enabledIds = appConfig.profiles[activeProfile] || [];
    const conflicts = [];
    
    const enabledMods = allMods.filter(m => m.installed !== false && enabledIds.includes(m.id));
    
    // 1. Check duplicate IDs
    const idMap = {};
    enabledMods.forEach(mod => {
        if (!idMap[mod.id]) {
            idMap[mod.id] = [];
        }
        idMap[mod.id].push(mod);
    });
    
    Object.keys(idMap).forEach(id => {
        if (idMap[id].length > 1) {
            const paths = idMap[id].map(m => m.category + "/" + m.folder_name).join(" 與 ");
            conflicts.push({
                type: "duplicate",
                message: `重複啟用相同 ID 的模組 <strong>${id}</strong>。<br><small>來源資料夾：${paths}</small>`
            });
        }
    });
    
    // 2. Check missing dependencies
    enabledMods.forEach(mod => {
        if (mod.dependencies && mod.dependencies.length > 0) {
            mod.dependencies.forEach(dep => {
                const cleanDepId = dep.split(" ")[0];
                const isDepEnabled = enabledIds.some(id => id === cleanDepId || id.toLowerCase() === cleanDepId.toLowerCase());
                if (!isDepEnabled) {
                    const isDepInstalled = allMods.some(m => m.id === cleanDepId || m.id.toLowerCase() === cleanDepId.toLowerCase());
                    if (isDepInstalled) {
                        conflicts.push({
                            type: "dependency_disabled",
                            message: `模組 <strong>${mod.name}</strong> 缺少相依模組 <strong>${cleanDepId}</strong>（已安裝，但未啟用）。`
                        });
                    } else {
                        conflicts.push({
                            type: "dependency_missing",
                            message: `模組 <strong>${mod.name}</strong> 缺少相依模組 <strong>${cleanDepId}</strong>（尚未安裝）。`
                        });
                    }
                }
            });
        }
    });
    
    // Update Warning Bar
    const warningBar = document.getElementById("conflict-warning-bar");
    const warningText = document.getElementById("conflict-warning-text");
    
    if (conflicts.length > 0) {
        warningText.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> 偵測到 <strong>${conflicts.length}</strong> 個模組衝突或相依性問題！`;
        warningBar.style.display = "flex";
        window.currentConflicts = conflicts;
    } else {
        warningBar.style.display = "none";
        window.currentConflicts = [];
    }
}

// Toggle mod state helper
async function toggleModState(modId, enabled) {
    const activeProfile = appConfig.active_profile;
    let enabledList = appConfig.profiles[activeProfile] || [];
    
    if (enabled) {
        if (!enabledList.includes(modId)) {
            enabledList.push(modId);
            
            const mod = allMods.find(m => m.id === modId);
            if (mod && mod.dependencies) {
                for (const depId of mod.dependencies) {
                    const cleanDepId = depId.split(" ")[0]; 
                    const depMod = allMods.find(m => m.id === cleanDepId || m.id.toLowerCase() === cleanDepId.toLowerCase());
                    if (depMod && !enabledList.includes(depMod.id)) {
                        enabledList.push(depMod.id);
                    }
                }
            }
        }
    } else {
        enabledList = enabledList.filter(id => id !== modId);
    }
    
    appConfig.profiles[activeProfile] = enabledList;
    
    // Save to Python config
    await api.save_config({ profiles: appConfig.profiles });
    
    renderModsGrid();
    if (selectedModId === modId) {
        updateDrawerUI(modId);
    }
}

// Open Detail Drawer
function openDrawer(modId) {
    selectedModId = modId;
    updateDrawerUI(modId);
    
    document.getElementById("detail-drawer").classList.add("open");
    document.getElementById("overlay").classList.add("visible");
}

// Close Detail Drawer
function closeDrawer() {
    selectedModId = null;
    document.getElementById("detail-drawer").classList.remove("open");
    document.getElementById("overlay").classList.remove("visible");
}

// Update Detail Drawer details
function updateDrawerUI(modId) {
    const mod = allMods.find(m => m.id === modId);
    if (!mod) return;
    
    document.getElementById("drawer-badge").innerText = mod.category;
    document.getElementById("drawer-title").innerText = mod.name;
    document.getElementById("drawer-id").innerText = mod.id;
    document.getElementById("drawer-version").innerText = mod.version;
    document.getElementById("drawer-author").innerText = mod.author;
    document.getElementById("drawer-gameplay").innerText = mod.affects_gameplay ? "是 (影響聯機)" : "否 (純外觀/音效)";
    document.getElementById("drawer-desc").innerText = mod.description || "無詳細描述。";
    
    const depContainer = document.getElementById("drawer-dependencies");
    depContainer.innerHTML = "";
    
    if (mod.dependencies && mod.dependencies.length > 0) {
        mod.dependencies.forEach(dep => {
            const cleanDepId = dep.split(" ")[0];
            const isInstalled = allMods.some(m => m.id === cleanDepId || m.id.toLowerCase() === cleanDepId.toLowerCase());
            
            const tag = document.createElement("span");
            tag.className = `dep-tag ${isInstalled ? '' : 'missing'}`;
            tag.innerText = dep + (isInstalled ? "" : " (缺失)");
            depContainer.appendChild(tag);
        });
    } else {
        depContainer.innerHTML = '<span style="color: var(--text-muted); font-size: 13px;">無依賴項</span>';
    }
    
    const activeProfile = appConfig.active_profile;
    const isEnabled = (appConfig.profiles[activeProfile] || []).includes(modId);
    const isInstalled = mod.installed !== false;
    
    const btn = document.getElementById("btn-drawer-toggle");
    if (!isInstalled) {
        btn.innerText = "下載並安裝此模組";
        btn.className = "btn btn-drawer-toggle";
    } else if (isEnabled) {
        btn.innerText = "禁用此模組";
        btn.className = "btn btn-drawer-toggle enabled";
    } else {
        btn.innerText = "啟用此模組";
        btn.className = "btn btn-drawer-toggle";
    }
}

// Bind all UI interaction events
function bindEvents() {
    // 1. Sidebar tab navigation
    document.querySelectorAll(".nav-item").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
            
            btn.classList.add("active");
            const tabId = btn.getAttribute("data-tab");
            document.getElementById(tabId).classList.add("active");
        });
    });
    
    // 2. Category filter buttons
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            currentCategory = btn.getAttribute("data-category");
            renderModsGrid();
        });
    });
    
    // 3. Search Box input
    document.getElementById("search-input").addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderModsGrid();
    });
    
    // 3.1 Status Filter select
    document.getElementById("status-filter").addEventListener("change", (e) => {
        currentStatus = e.target.value;
        renderModsGrid();
    });
    
    // 3.2 Hide Local Mod checkbox
    document.getElementById("hide-local-checkbox").addEventListener("change", (e) => {
        hideLocalMods = e.target.checked;
        renderModsGrid();
    });
    
    // 3.3 Conflict Details Modal triggers
    const conflictModal = document.getElementById("conflict-modal");
    const modalBackdrop = document.getElementById("modal-backdrop");
    
    document.getElementById("btn-show-conflicts").addEventListener("click", () => {
        const listDiv = document.getElementById("conflict-list");
        listDiv.innerHTML = "";
        
        const list = window.currentConflicts || [];
        if (list.length === 0) {
            listDiv.innerHTML = `<div style="color: var(--text-muted); text-align: center; padding: 20px;">無任何衝突問題！</div>`;
        } else {
            list.forEach(c => {
                const item = document.createElement("div");
                item.className = `conflict-item ${c.type}`;
                item.innerHTML = c.message;
                listDiv.appendChild(item);
            });
        }
        
        conflictModal.classList.add("visible");
        modalBackdrop.classList.add("visible");
    });
    
    document.getElementById("conflict-btn-close").addEventListener("click", () => {
        conflictModal.classList.remove("visible");
        modalBackdrop.classList.remove("visible");
    });
    
    // 4. Close Drawer
    document.getElementById("btn-close-drawer").addEventListener("click", closeDrawer);
    document.getElementById("overlay").addEventListener("click", closeDrawer);
    
    // 5. Drawer Action toggle button
    document.getElementById("btn-drawer-toggle").addEventListener("click", async () => {
        if (!selectedModId) return;
        const mod = allMods.find(m => m.id === selectedModId);
        if (!mod) return;
        
        const isInstalled = mod.installed !== false;
        if (!isInstalled) {
            const btn = document.getElementById("btn-drawer-toggle");
            btn.disabled = true;
            btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> 下載中...`;
            try {
                const res = await api.install_mod(mod.download_url, mod.category, mod.id);
                if (res.status === "success") {
                    btn.disabled = false;
                    btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> 安裝成功`;
                    await loadModsAsync();
                    closeDrawer();
                } else {
                    alert("安裝失敗: " + res.message);
                    btn.disabled = false;
                    btn.innerText = "下載並安裝此模組";
                }
            } catch (err) {
                alert("下載失敗: " + err);
                btn.disabled = false;
                btn.innerText = "下載並安裝此模組";
            }
        } else {
            const activeProfile = appConfig.active_profile;
            const isEnabled = (appConfig.profiles[activeProfile] || []).includes(selectedModId);
            await toggleModState(selectedModId, !isEnabled);
        }
    });
    
    // 6. Select profile dropdown
    document.getElementById("profile-select").addEventListener("change", async (e) => {
        const val = e.target.value;
        appConfig.active_profile = val;
        await api.save_config({ active_profile: val });
        renderProfileSelect();
        renderModsGrid();
    });
    
    // 7. Add Profile Modal actions
    const modal = document.getElementById("profile-modal");
    const backdrop = document.getElementById("modal-backdrop");
    
    document.getElementById("btn-add-profile").addEventListener("click", () => {
        document.getElementById("modal-profile-name").value = "";
        modal.classList.add("visible");
        backdrop.classList.add("visible");
    });
    
    document.getElementById("modal-btn-cancel").addEventListener("click", () => {
        modal.classList.remove("visible");
        backdrop.classList.remove("visible");
    });
    
    document.getElementById("modal-btn-confirm").addEventListener("click", async () => {
        const name = document.getElementById("modal-profile-name").value.trim();
        if (!name) return;
        
        const res = await api.add_profile(name);
        if (res.status === "success") {
            appConfig.profiles[name] = [];
            appConfig.active_profile = name;
            await api.save_config({ active_profile: name, profiles: appConfig.profiles });
            
            renderProfileSelect();
            renderModsGrid();
            
            modal.classList.remove("visible");
            backdrop.classList.remove("visible");
        } else {
            alert(res.message);
        }
    });
    
    // 8. Delete Profile
    document.getElementById("btn-delete-profile").addEventListener("click", async () => {
        const activeProfile = appConfig.active_profile;
        if (activeProfile === "Default") {
            alert("不能刪除預設配置 (Default)！");
            return;
        }
        
        if (confirm(`確定要刪除配置「${activeProfile}」嗎？`)) {
            const res = await api.delete_profile(activeProfile);
            if (res.status === "success") {
                appConfig = res.config;
                renderProfileSelect();
                renderModsGrid();
            } else {
                alert(res.message);
            }
        }
    });
    
    // 9. Manual Game Path Input save on change/blur
    const pathInput = document.getElementById("input-game-path");
    const savePathFunc = async () => {
        const val = pathInput.value.trim();
        if (val !== appConfig.game_path) {
            appConfig.game_path = val;
            await api.save_config({ game_path: val });
            updateGamePathUI();
            
            // Rescan mods to load local mods from the newly configured path
            loadModsAsync();
        }
    };
    pathInput.addEventListener("blur", savePathFunc);
    pathInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            savePathFunc();
            pathInput.blur();
        }
    });
    
    // 9.1 Manual Browse Path button
    document.getElementById("btn-browse-path").addEventListener("click", async () => {
        const btn = document.getElementById("btn-browse-path");
        const origHtml = btn.innerHTML;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> 選擇中...`;
        btn.disabled = true;
        
        try {
            const res = await api.browse_path();
            if (res.status === "success") {
                appConfig.game_path = res.path;
                updateGamePathUI();
                
                // Save config to Python
                await api.save_config({ game_path: res.path });
                
                // Rescan mods to load local mods from the newly configured path
                loadModsAsync();
                alert(`設定成功！已更新遊戲路徑：\n${res.path}`);
            } else if (res.status === "error") {
                alert("選擇資料夾時出錯: " + res.message);
            }
        } catch (err) {
            alert("選擇資料夾失敗: " + err);
        } finally {
            btn.innerHTML = origHtml;
            btn.disabled = false;
        }
    });
    
    // 10. Auto-Detect Path button
    document.getElementById("btn-select-path").addEventListener("click", async () => {
        const btn = document.getElementById("btn-select-path");
        const origHtml = btn.innerHTML;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> 偵測中...`;
        btn.disabled = true;
        
        try {
            const res = await api.auto_detect_path();
            if (res.status === "success") {
                appConfig.game_path = res.path;
                updateGamePathUI();
                
                // Rescan mods to load local mods from the auto-detected path
                loadModsAsync();
                alert(`偵測成功！已定位遊戲路徑：\n${res.path}`);
            } else {
                alert(res.message);
            }
        } catch (err) {
            alert("自動偵測過程中出錯: " + err);
        } finally {
            btn.innerHTML = origHtml;
            btn.disabled = false;
        }
    });
    
    // 11. Apply Configuration
    document.getElementById("btn-apply").addEventListener("click", async () => {
        const btn = document.getElementById("btn-apply");
        const origHtml = btn.innerHTML;
        
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> 應用中...`;
        btn.disabled = true;
        
        try {
            const activeProfile = appConfig.active_profile;
            const res = await api.apply_profile(activeProfile);
            alert(res.message);
        } catch (err) {
            alert("應用配置失敗: " + err);
        } finally {
            btn.innerHTML = origHtml;
            btn.disabled = false;
        }
    });
    
    // 12. Play Game
    document.getElementById("btn-play").addEventListener("click", async () => {
        try {
            const res = await api.launch_game();
            if (res.status === "error") {
                alert(res.message);
            }
        } catch (err) {
            alert("啟動遊戲失敗: " + err);
        }
    });

    // 13. Auto-Update event listeners
    document.getElementById("btn-check-update").addEventListener("click", () => checkUpdate(true));
    document.getElementById("update-btn-cancel").addEventListener("click", closeUpdateModal);
    document.getElementById("update-btn-confirm").addEventListener("click", startUpdateProcess);
}

// --- Auto-Update Frontend System ---
let updateInfo = null;

async function checkUpdate(isManual = false) {
    const statusText = document.getElementById("update-status-text");
    if (isManual) {
        statusText.innerText = " 正在檢查更新...";
        statusText.style.color = "var(--text-muted)";
    }
    
    try {
        const res = await api.check_update();
        if (res.status === "success") {
            // Display current version retrieved from python
            document.getElementById("label-current-version").innerText = `v${res.current_version}`;
            
            if (res.has_update) {
                updateInfo = res;
                showUpdateModal(res);
                if (isManual) {
                    statusText.innerText = " 偵測到新版本！";
                    statusText.style.color = "#a78bfa";
                }
            } else {
                if (isManual) {
                    statusText.innerText = " 已是最新版本";
                    statusText.style.color = "var(--success)";
                }
            }
        } else {
            if (isManual) {
                statusText.innerText = ` 檢查失敗: ${res.message}`;
                statusText.style.color = "var(--danger)";
            }
        }
    } catch (e) {
        if (isManual) {
            statusText.innerText = " 無會連接更新伺服器";
            statusText.style.color = "var(--danger)";
        }
    }
}

function showUpdateModal(info) {
    document.getElementById("update-version-label").innerText = `v${info.latest_version}`;
    document.getElementById("update-changelog-text").innerText = info.changelog || "無更新說明。";
    
    // Reset progress UI
    document.getElementById("update-progress-container").style.display = "none";
    document.getElementById("update-modal-actions").style.display = "flex";
    
    const modal = document.getElementById("update-modal");
    const backdrop = document.getElementById("modal-backdrop");
    modal.classList.add("visible");
    backdrop.classList.add("visible");
}

function closeUpdateModal() {
    const modal = document.getElementById("update-modal");
    const backdrop = document.getElementById("modal-backdrop");
    modal.classList.remove("visible");
    backdrop.classList.remove("visible");
}

async function startUpdateProcess() {
    if (!updateInfo || !updateInfo.download_url) return;
    
    const actions = document.getElementById("update-modal-actions");
    const progressContainer = document.getElementById("update-progress-container");
    const statusText = document.getElementById("update-progress-status");
    const percentText = document.getElementById("update-progress-percent");
    const progressBar = document.getElementById("update-progress-bar");
    
    actions.style.display = "none";
    progressContainer.style.display = "block";
    statusText.innerText = "正在下載更新檔...";
    
    // Animate fake progress to provide smooth feedback
    let percent = 0;
    progressBar.style.width = "0%";
    percentText.innerText = "0%";
    
    const progressInterval = setInterval(() => {
        if (percent < 90) {
            percent += Math.floor(Math.random() * 8) + 2;
        } else if (percent < 98) {
            percent += 1;
        }
        if (percent > 98) percent = 98;
        progressBar.style.width = `${percent}%`;
        percentText.innerText = `${percent}%`;
    }, 450);
    
    try {
        const res = await api.perform_update(updateInfo.download_url);
        clearInterval(progressInterval);
        
        if (res.status === "error") {
            alert("更新執行失敗: " + res.message);
            actions.style.display = "flex";
            progressContainer.style.display = "none";
        } else {
            progressBar.style.width = "100%";
            percentText.innerText = "100%";
            statusText.innerText = "下載完成！程式即將重啟...";
        }
    } catch (e) {
        clearInterval(progressInterval);
        alert("更新過程中發生異常連線錯誤，請稍後再試。");
        actions.style.display = "flex";
        progressContainer.style.display = "none";
    }
}
