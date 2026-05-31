import { useState, useEffect } from 'react'

function App() {
  const [activeTab, setActiveTab] = useState('mods')
  const [mods, setMods] = useState([])
  const [managerInfo, setManagerInfo] = useState({
    version: '1.0.0',
    downloadUrl: '',
    changelog: ''
  })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedMod, setSelectedMod] = useState(null)
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch manifest.json from the public directory
    fetch('/manifest.json')
      .then((res) => res.json())
      .then((data) => {
        if (data.manager) {
          setManagerInfo({
            version: data.manager.version,
            downloadUrl: data.manager.download_url,
            changelog: data.manager.changelog
          })
        }
        if (data.mods) {
          setMods(data.mods)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load mods manifest:', err)
        setLoading(false)
      })
  }, [])

  // Filter mods based on category and search query
  const filteredMods = mods.filter((mod) => {
    const matchesCategory = selectedCategory === 'all' || mod.category === selectedCategory
    const matchesSearch =
      searchQuery === '' ||
      mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div>
      {/* Background glowing blobs */}
      <div className="glow-blob-1"></div>
      <div className="glow-blob-2"></div>

      {/* FontAwesome for Icons */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      {/* Header / Navbar */}
      <header className="navbar">
        <div className="container nav-container">
          <div className="brand">
            <i className="fa-solid fa-ghost brand-icon"></i>
            <div className="brand-name">
              <span className="spire">SPIRE</span>
              <span className="dark">DARK</span>
            </div>
          </div>
          <nav className="nav-links">
            <span
              className={`nav-link ${activeTab === 'mods' ? 'active' : ''}`}
              onClick={() => setActiveTab('mods')}
              style={{ color: activeTab === 'mods' ? 'var(--primary-color)' : '' }}
            >
              模組瀏覽
            </span>
            <span
              className={`nav-link ${activeTab === 'docs' ? 'active' : ''}`}
              onClick={() => setActiveTab('docs')}
              style={{ color: activeTab === 'docs' ? 'var(--primary-color)' : '' }}
            >
              安裝與使用說明
            </span>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero container">
        <span className="hero-tag">《殺戮尖塔 2》模組平台</span>
        <h1 className="hero-title">
          讓你的尖塔體驗 <span>無界擴展</span>
        </h1>
        <p className="hero-desc">
          Spire Dark Mod Manager
          是一款專為《Slay the Spire 2》打造的免費、開源、輕量化模組管理軟體。秒速掛載，無損更替！
        </p>
        <a href={managerInfo.downloadUrl} className="btn-cta">
          <i className="fa-solid fa-download"></i> 下載模組管理器 (v{managerInfo.version})
        </a>
      </section>

      {/* Main Tabs Container */}
      <main className="container">
        {activeTab === 'mods' ? (
          /* Tab 1: Mods Browser */
          <section className="mods-section">
            <div className="section-header">
              <div className="section-info">
                <h2>探索玩家創作</h2>
                <p>熱門模組已就緒，可通過管理器一鍵裝載</p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-container">
              <div className="filter-row-1">
                <div className="search-wrapper">
                  <i className="fa-solid fa-magnifying-glass search-icon"></i>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="搜尋模組、作者或簡介..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-row-2">
                {[
                  { id: 'all', label: '全部' },
                  { id: '必裝前置', label: '前置' },
                  { id: '功能類', label: '功能' },
                  { id: '玩法擴展類', label: '玩法' },
                  { id: '皮膚美化類', label: '美化' },
                  { id: '角色擴展類', label: '角色' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid display */}
            {loading ? (
              <div className="loading-state" style={{ color: 'var(--text-secondary)' }}>
                <i className="fa-solid fa-circle-notch fa-spin"></i> 正在載入線上模組清單...
              </div>
            ) : filteredMods.length === 0 ? (
              <div className="empty-state" style={{ color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-face-frown" style={{ fontSize: '36px' }}></i>
                沒有符合當前條件的模組
              </div>
            ) : (
              <div className="mods-grid">
                {filteredMods.map((mod) => (
                  <div
                    key={mod.id}
                    className="mod-card"
                    data-category={mod.category}
                    onClick={() => setSelectedMod(mod)}
                  >
                    <div className="card-header">
                      <div>
                        <h3 className="card-title" title={mod.name}>
                          {mod.name}
                        </h3>
                        <span className="card-author">By {mod.author}</span>
                      </div>
                      <span
                        className={`badge ${
                          mod.category === '必裝前置'
                            ? 'badge-pre'
                            : mod.category === '功能類'
                            ? 'badge-func'
                            : mod.category === '玩法擴展類'
                            ? 'badge-game'
                            : mod.category === '皮膚美化類'
                            ? 'badge-skin'
                            : 'badge-char'
                        }`}
                      >
                        {mod.category.replace('類', '')}
                      </span>
                    </div>
                    <p className="card-desc">{mod.description || '無詳細描述。'}</p>
                    <div className="card-footer">
                      <span className="card-version">v{mod.version}</span>
                      <button
                        className="btn-card-dl"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.location.href = mod.download_url
                        }}
                      >
                        <i className="fa-solid fa-download"></i> 下載
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          /* Tab 2: Manual Installation Documentation */
          <section className="doc-section">
            <div className="doc-grid">
              <div className="doc-card">
                <h2>
                  <i className="fa-solid fa-book-open"></i> 安裝與使用指南
                </h2>

                <div className="doc-step">
                  <div className="step-num">1</div>
                  <div className="step-content">
                    <h3>下載並解壓模組管理器</h3>
                    <p>
                      點擊頁面頂部的下載按鈕，獲得最新版本的{' '}
                      <code>SpireDarkModManager.exe</code>，將其放到任何您想存放整合包的專屬目錄。
                    </p>
                  </div>
                </div>

                <div className="doc-step">
                  <div className="step-num">2</div>
                  <div className="step-content">
                    <h3>設定遊戲路徑</h3>
                    <p>
                      啟動程式，在「設定與路徑」分頁中，貼上您的《Slay the Spire 2》安裝目錄（或點擊自動偵測）。程式會自動載入該目錄下的模組。
                    </p>
                  </div>
                </div>

                <div className="doc-step">
                  <div className="step-num">3</div>
                  <div className="step-content">
                    <h3>一鍵切換，開心遊玩</h3>
                    <p>
                      在左側下拉菜單選定或新建您的模組存檔，勾選想要啟用的模組後，點擊「應用當前配置」，接著點擊「啟動遊戲」即可直接加載模組遊玩。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Mod Detail Modal dialog */}
      {selectedMod && (
        <div className="modal-overlay" onClick={() => setSelectedMod(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="btn-modal-close" onClick={() => setSelectedMod(null)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="modal-header">
              <span
                className={`badge modal-badge ${
                  selectedMod.category === '必裝前置'
                    ? 'badge-pre'
                    : selectedMod.category === '功能類'
                    ? 'badge-func'
                    : selectedMod.category === '玩法擴展類'
                    ? 'badge-game'
                    : selectedMod.category === '皮膚美化類'
                    ? 'badge-skin'
                    : 'badge-char'
                }`}
              >
                {selectedMod.category}
              </span>
              <h2 className="modal-title">{selectedMod.name}</h2>
            </div>

            <div className="modal-meta-grid">
              <div className="meta-item">
                <span className="meta-label">模組 ID</span>
                <span className="meta-val">{selectedMod.id}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">版本號</span>
                <span className="meta-val">v{selectedMod.version}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">創作者</span>
                <span className="meta-val">{selectedMod.author}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">分類</span>
                <span className="meta-val">{selectedMod.category}</span>
              </div>
            </div>

            <div className="modal-desc-section">
              <h3>模組介紹說明</h3>
              <p className="modal-desc">{selectedMod.description || '這個作者很懶，什麼都沒寫。'}</p>
            </div>

            <div className="modal-actions">
              <button
                className="btn-modal-dl"
                onClick={() => {
                  window.location.href = selectedMod.download_url
                }}
              >
                <i className="fa-solid fa-download"></i> 立即下載安裝檔
              </button>
              <button className="btn-modal-cancel" onClick={() => setSelectedMod(null)}>
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer container">
        <div className="footer-brand">SPIRE DARK MODS</div>
        <p>© 2026 Spire Dark Community. All rights reserved. 殺戮尖塔 2 整合平台專用</p>
      </footer>
    </div>
  )
}

export default App
