import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Space, message, Modal } from 'antd';
import { 
  User, 
  LogOut, 
  Settings, 
  Palette,
  CheckCircle,
  Share2,
  Users,
  Shield,
  Search,
  FileText
} from 'lucide-react';
import { getCurrentTheme, setTheme, getThemeList } from '../utils/themeManager';
import ThemeShareModal from './ThemeShareModal';
import LoginMoreModal from './LoginMoreModal';
import DesktopDownloadModal from './DesktopDownloadModal';
import './SidebarAvatar.css';
import { getTotalMedalCount } from '../data/medalsData';
import GlobalSearchModal from './GlobalSearchModal.jsx';
import notesService from '../services/notesService';
import { searchSuggestions } from '../data/searchSuggestions';

const SidebarAvatar = ({ onThemeChange, isCollapsed }) => {
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [loginMoreModalVisible, setLoginMoreModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 模拟登录状态
  const [userInfo, setUserInfo] = useState({
    name: '张老师',
    email: 'zhang.teacher@edu.cn',
    avatar: null
  });
  const [currentSpace, setCurrentSpace] = useState(() => {
    try { return localStorage.getItem('current_knowledge_space') || '技术部-研发'; } catch { return '技术部-研发'; }
  });
  // 新增：全局搜索弹窗状态
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  // 新增：展开态内联搜索框状态与快捷键
  const [searchInlineValue, setSearchInlineValue] = useState('');
  const inputRef = useRef(null);
  // 清理缓存弹窗
  const [clearCacheModalVisible, setClearCacheModalVisible] = useState(false);
  const LS_KEY = 'global_search_history_v1';
  const FREQ_KEY = 'global_search_freq_v1';
  // 版本说明弹窗
  const [versionModalVisible, setVersionModalVisible] = useState(false);

  const pushHistory = (text) => {
    if (!text) return;
    try {
      const raw = localStorage.getItem(LS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      const next = [text, ...arr.filter(h => h !== text)].slice(0, 10);
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      const freqRaw = localStorage.getItem(FREQ_KEY);
      const freq = freqRaw ? JSON.parse(freqRaw) : {};
      freq[text] = (freq[text] || 0) + 1;
      localStorage.setItem(FREQ_KEY, JSON.stringify(freq));
    } catch {}
  };

  const triggerGlobalSearch = (q) => {
    const detail = { query: q, module: 'global', time: Date.now() };
    window.dispatchEvent(new CustomEvent('globalSearch', { detail }));
  };

  const [inlineResults, setInlineResults] = useState(null);
  const [topFrequentTerms, setTopFrequentTerms] = useState([]);

  useEffect(() => {
    try {
      const freqRaw = localStorage.getItem(FREQ_KEY);
      if (!freqRaw) { setTopFrequentTerms([]); return; }
      const freq = JSON.parse(freqRaw);
      const sorted = Object.entries(freq)
        .sort((a,b)=>b[1]-a[1])
        .slice(0,8)
        .map(([term])=>term);
      setTopFrequentTerms(sorted);
    } catch {
      setTopFrequentTerms([]);
    }
  }, [searchInlineValue, inlineResults]);

  const performInlineSearch = async (q) => {
    const query = q.trim();
    if (!query) return;
    pushHistory(query);
    triggerGlobalSearch(query);
    // 笔记
    let notes = [];
    try {
      const allNotes = await notesService.getAllNotes();
      const term = query.toLowerCase();
      notes = (allNotes || []).filter(n => {
        const t = (n.title || '').toLowerCase();
        const c = (n.content || '').toLowerCase();
        const tags = Array.isArray(n.tags) ? n.tags.join(' ').toLowerCase() : '';
        return t.includes(term) || c.includes(term) || tags.includes(term);
      }).slice(0, 8);
    } catch {}
    // 联系人与群组
    const term = query.toLowerCase();
    const contacts = searchSuggestions.filter(s => s.type === 'user' && s.name.toLowerCase().includes(term)).slice(0, 8);
    const groups = searchSuggestions.filter(s => s.type === 'group' && s.name.toLowerCase().includes(term)).slice(0, 8);
    setInlineResults({
      query,
      groups: [
        { key: 'notes', title: '笔记', items: notes.map(n => ({ id: n.id, title: n.title })) },
        { key: 'contacts', title: '联系人', items: contacts.map(u => ({ id: u.id, title: u.name })) },
        { key: 'groups', title: '群组', items: groups.map(g => ({ id: g.id, title: g.name })) }
      ]
    });
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isCollapsed) {
          setSearchModalVisible(true);
        } else {
          inputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCollapsed]);

  useEffect(() => {
    // 监听主题变更事件
    const handleThemeChange = (event) => {
      setCurrentTheme(event.detail.theme);
      if (onThemeChange) {
        onThemeChange(event.detail.theme, event.detail.colors);
      }
    };

    const handleSpaceChanged = (event) => {
      const name = event?.detail?.name;
      if (name) setCurrentSpace(name);
    };

    window.addEventListener('themeChanged', handleThemeChange);
    window.addEventListener('knowledgeSpaceChanged', handleSpaceChanged);
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
      window.removeEventListener('knowledgeSpaceChanged', handleSpaceChanged);
    }
  }, [onThemeChange]);

  const handleThemeSelect = (themeName) => {
    if (setTheme(themeName)) {
      setCurrentTheme(themeName);
      message.success(`已切换到${getThemeList().find(t => t.key === themeName)?.name}主题`);
    }
  };

  const handleLogin = () => {
    // 模拟登录逻辑
    message.info('跳转到登录页面...');
    // 这里可以添加实际的登录逻辑
  };

  const handleLogout = () => {
    // 模拟退出逻辑
    setIsLoggedIn(false);
    message.success('已成功退出登录');
    // 这里可以添加实际的退出逻辑，如清除token等
  };

  const handleShareTheme = () => {
    setShareModalVisible(true);
  };

  const handleLoginMore = () => {
    setLoginMoreModalVisible(true);
  };

  const handleOpenAdminCenter = () => {
    const adminUrl = `${window.location.origin}${window.location.pathname}#admin-center`;
    window.open(adminUrl, '_blank');
  };

  // 下载到桌面弹窗
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);

  // PWA 安装相关逻辑：通过全局隐藏的按钮触发 beforeinstallprompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const triggerPWAInstall = async () => {
    if (!deferredPrompt) {
      message.info('当前浏览器暂不支持或暂不可安装PWA');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      message.success('已添加到桌面');
      setDownloadModalVisible(false);
    } else {
      message.warning('已取消安装');
    }
    setDeferredPrompt(null);
  };

  const getCurrentThemeData = () => {
    const themeList = getThemeList();
    return themeList.find(theme => theme.key === currentTheme) || themeList[0];
  };

  const themeList = getThemeList();

  // 主题选择子菜单
  const themeMenuItems = themeList.map(theme => ({
    key: `theme-${theme.key}`,
    label: (
      <div className="theme-option" onClick={() => handleThemeSelect(theme.key)}>
        <Space>
          <div className="theme-preview">
            <div 
              className="theme-color-dot" 
              style={{ backgroundColor: theme.colors.primary }}
            />
            <div 
              className="theme-color-dot" 
              style={{ backgroundColor: theme.colors.textPrimary }}
            />
            <div 
              className="theme-color-dot" 
              style={{ background: theme.colors.background }}
            />
          </div>
          <span className="theme-name">{theme.name}</span>
          {currentTheme === theme.key && (
            <CheckCircle size={16} style={{ color: theme.colors.primary }} />
          )}
        </Space>
      </div>
    )
  }));

  // 用户菜单项
  const userMenuItems = [
    // 用户信息
    {
      key: 'user-info',
      label: (
        <div className="sidebar-user-info-section">
          <div className="sidebar-user-name">{userInfo.name}</div>
          <div className="sidebar-user-email">{userInfo.email}</div>
          <div className="sidebar-user-space">知识空间【{currentSpace}】</div>
        </div>
      ),
      disabled: true
    },
    {
      type: 'divider'
    },
    // 版本号
    {
      key: 'app-version',
      label: (
        <Space>
          <FileText size={16} />
          <span>版本号</span>
          <span style={{ marginLeft: 6, fontSize: 12, color: 'var(--theme-primary)' }}>0.21.13</span>
        </Space>
      ),
      onClick: () => setVersionModalVisible(true)
    },
    {
      type: 'divider'
    },
    // 清理缓存
    {
      key: 'clear-cache',
      label: (
        <Space>
          <Shield size={16} />
          <span>清理缓存</span>
        </Space>
      ),
      onClick: () => {
        setClearCacheModalVisible(true);
      }
    },
    {
      type: 'divider'
    },
    // 我的勋章
    {
      key: 'my-medals',
      label: (
        <Space>
          <CheckCircle size={16} />
          <span>我的勋章</span>
          <span style={{ marginLeft: 6, fontSize: 12, color: 'var(--theme-primary)' }}>{getTotalMedalCount()} 枚</span>
        </Space>
      ),
      onClick: () => {
        const url = `${window.location.origin}${window.location.pathname}#my-medals`;
        window.open(url, '_blank');
      }
    },
    {
      type: 'divider'
    },
    // 主题设置
    {
      key: 'theme-settings',
      label: (
        <Space>
          <Palette size={16} />
          <span>主题设置</span>
        </Space>
      ),
      children: [
        ...themeMenuItems,
        {
          type: 'divider'
        },
        {
          key: 'share-theme',
          label: (
            <Space>
              <Share2 size={16} />
              <span>分享主题</span>
            </Space>
          ),
          onClick: handleShareTheme
        }
      ]
    },
    // 个人设置
    {
      key: 'settings',
      label: (
        <Space>
          <Settings size={16} />
          <span>个人设置</span>
        </Space>
      ),
      onClick: () => message.info('个人设置功能开发中...')
    },
    // 知识空间
    {
      key: 'knowledge-space',
      label: (
        <Space>
          <FileText size={16} />
          <span>知识空间</span>
        </Space>
      ),
      onClick: () => { window.location.hash = 'knowledge-space'; }
    },
    {
      type: 'divider'
    },
    // 登录/退出
    isLoggedIn ? {
      key: 'logout',
      label: (
        <Space>
          <LogOut size={16} />
          <span>退出登录</span>
        </Space>
      ),
      onClick: handleLogout
    } : {
      key: 'login',
      label: (
        <Space>
          <User size={16} />
          <span>登录</span>
        </Space>
      ),
      onClick: handleLogin
    },
    // 下载到桌面（位于退出登录与登录更多账号之间）
    {
      key: 'download-desktop',
      label: (
        <Space>
          <CheckCircle size={16} />
          <span>下载到桌面</span>
        </Space>
      ),
      children: [
        {
          key: 'pwa-install',
          label: (
            <Space>
              <Palette size={16} />
              <span>添加到电脑桌面</span>
            </Space>
          ),
          onClick: () => setDownloadModalVisible(true)
        },
        {
          key: 'wechat-qr',
          label: (
            <Space>
              <Palette size={16} />
              <span>微信扫码即可体验</span>
            </Space>
          ),
          onClick: () => setDownloadModalVisible(true)
        }
      ]
    },
    // 登录更多账号
    {
      key: 'login-more',
      label: (
        <Space>
          <Users size={16} />
          <span>登录更多账号</span>
        </Space>
      ),
      onClick: handleLoginMore
    },
    // 管理后台（位于最后）
    {
      key: 'admin-center',
      label: (
        <Space>
          <Shield size={16} />
          <span>管理后台</span>
        </Space>
      ),
      onClick: handleOpenAdminCenter
    }
  ];

  return (
    <>
      <div className={`sidebar-avatar-stack ${isCollapsed ? 'collapsed' : ''}`}>
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomLeft"
          trigger={['click']}
          overlayClassName="sidebar-avatar-dropdown"
        >
          <div className={`sidebar-title-with-avatar clickable ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-avatar">
              <User size={20} />
            </div>
            {!isCollapsed && <h4 className="sidebar-title">张老师</h4>}
          </div>
        </Dropdown>

        {/* 搜索入口：折叠显示图标，展开显示输入框 */}
        {isCollapsed ? (
          <div 
            className={`sidebar-search-trigger collapsed`}
            onClick={() => setSearchModalVisible(true)}
            title="搜索"
          >
            <Search size={24} />
          </div>
        ) : (
          <>
            <div className="sidebar-search-input-row" title="搜索">
              <Search size={18} className="sidebar-search-input-icon" />
              <input
                ref={inputRef}
                className="sidebar-search-input"
                type="text"
                placeholder="搜索 (⌘+K)"
                value={searchInlineValue}
                onChange={(e) => setSearchInlineValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    performInlineSearch(searchInlineValue);
                  }
                }}
              />
            </div>
            <div className="sidebar-inline-panel" style={{ marginTop: 8 }}>
              {!inlineResults ? (
                <div>
                  <div style={{ fontSize: 12, color: 'var(--theme-text-secondary)', marginBottom: 6 }}>常用</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {topFrequentTerms.length === 0 ? (
                      <span style={{ fontSize: 12, color: 'var(--theme-text-tertiary)' }}>暂无数据</span>
                    ) : topFrequentTerms.map(term => (
                      <button
                        key={term}
                        className="chip"
                        style={{ padding: '4px 8px', borderRadius: 12, border: '1px solid var(--theme-border)', background: 'transparent', cursor: 'pointer' }}
                        onClick={() => { setSearchInlineValue(term); performInlineSearch(term); }}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  {inlineResults.groups.map(group => (
                    <div key={group.key} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, color: 'var(--theme-text-secondary)', marginBottom: 6 }}>{group.title}</div>
                      {group.items.length === 0 ? (
                        <div style={{ fontSize: 12, color: 'var(--theme-text-tertiary)' }}>无匹配结果</div>
                      ) : (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {group.items.map(item => (
                            <li key={item.id} style={{ padding: '6px 0', borderBottom: '1px dashed var(--theme-border-light)' }}>
                              <span style={{ fontSize: 13 }}>{item.title}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <DesktopDownloadModal
        open={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
        onInstallPWA={triggerPWAInstall}
        qrUrl={window.location.origin}
      />

      <ThemeShareModal
        visible={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        currentTheme={getCurrentThemeData()}
      />

      {/* 清理缓存弹窗 */}
      <Modal
        title="清理缓存"
        open={clearCacheModalVisible}
        onCancel={() => setClearCacheModalVisible(false)}
        footer={null}
        width={880}
        styles={{ body: { padding: 0, overflow: 'hidden' } }}
      >
        <iframe
          title="clear-site-data"
          src={`${window.location.origin}/clear-site-data.html`}
          style={{ width: '100%', height: '70vh', border: 'none' }}
        />
      </Modal>

      <LoginMoreModal
        open={loginMoreModalVisible}
        onCancel={() => setLoginMoreModalVisible(false)}
      />

      {/* 全局搜索弹窗 */}
      <GlobalSearchModal 
        open={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        defaultQuery={searchInlineValue}
      />

      {/* 版本说明弹窗 */}
      <Modal
        title="版本说明"
        open={versionModalVisible}
        onCancel={() => setVersionModalVisible(false)}
        footer={null}
        width={720}
      >
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>0.21.13</div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>组织培训分类主题内：</div>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 6 }}>模块3，研修成果上传功能</li>
            <li>模块6，配置选修课</li>
          </ul>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>组织需求管理分类主题内：</div>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 6 }}>智能工具：新增“培训方案”工具</li>
            <li>操作记录，“培训方案”文档配置等</li>
          </ul>
        </div>
      </Modal>
    </>
  );
};

export default SidebarAvatar;