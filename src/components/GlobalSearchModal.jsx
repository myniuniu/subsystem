import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Input, Tag, Space, Divider, Tooltip, Button } from 'antd';
import { SearchOutlined, FilterOutlined, CloseOutlined } from '@ant-design/icons';
import notesService from '../services/notesService';
import { searchSuggestions } from '../data/searchSuggestions';

// 模块列表：同步侧栏收缩模式的一级菜单 shortLabel
const MODULES = [
  { key: 'global', label: '全局' },
  { key: 'smart-notes', label: '果仁空间' },
  { key: 'ai-assistant', label: 'AI工具' },
  { key: 'message-center', label: '消息' },
  { key: 'docs-center', label: '云盘' },
  { key: 'calendar-center', label: '日历' },
  { key: 'learning-square', label: '学习广场' },
  { key: 'ai-tool-house', label: '工具屋' },
  { key: 'theme-template-center', label: '智能体' },
  { key: 'resource-annotation', label: '资源标注' },
  { key: 'student-annotation', label: '学员标注' },
  { key: 'simulation-system', label: '仿真' },
  { key: 'meeting-center', label: '会议' },
  { key: 'download-center', label: '下载' },
  { key: 'app-center', label: '应用中心' },
];

const LS_KEY = 'global_search_history_v1';
const FREQ_KEY = 'global_search_freq_v1';

const GlobalSearchModal = ({ open, onClose, defaultQuery = '' }) => {
  const [query, setQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('global');
  const [history, setHistory] = useState([]);
  const [topFrequent, setTopFrequent] = useState([]);
  const [results, setResults] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const freqRaw = localStorage.getItem(FREQ_KEY);
      if (!freqRaw) { setTopFrequent([]); return; }
      const freq = JSON.parse(freqRaw);
      const sorted = Object.entries(freq)
        .sort((a,b)=>b[1]-a[1])
        .slice(0,10)
        .map(([term])=>term);
      setTopFrequent(sorted);
    } catch { setTopFrequent([]); }
  }, [open, query]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelectedModule('global');
      setResults(null);
    }
  }, [open]);

  // 打开时预填默认查询
  useEffect(() => {
    if (open && defaultQuery) {
      setQuery(defaultQuery);
    }
  }, [open, defaultQuery]);

  const saveHistory = (text) => {
    if (!text) return;
    const next = [text, ...history.filter(h => h !== text)].slice(0, 10);
    setHistory(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
  };

  const clearHistory = () => {
    setHistory([]);
    try { localStorage.removeItem(LS_KEY); } catch {}
  };

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    saveHistory(q);
    // 记录词频
    try {
      const freqRaw = localStorage.getItem(FREQ_KEY);
      const freq = freqRaw ? JSON.parse(freqRaw) : {};
      freq[q] = (freq[q] || 0) + 1;
      localStorage.setItem(FREQ_KEY, JSON.stringify(freq));
    } catch {}
    // 构造分组结果
    const groups = [];
    try {
      const allNotes = await notesService.getAllNotes();
      const term = q.toLowerCase();
      const notes = (allNotes || []).filter(n => {
        const t = (n.title || '').toLowerCase();
        const c = (n.content || '').toLowerCase();
        const tags = Array.isArray(n.tags) ? n.tags.join(' ').toLowerCase() : '';
        return t.includes(term) || c.includes(term) || tags.includes(term);
      }).slice(0, 8);
      groups.push({ key: 'notes', title: '笔记', items: notes.map(n => ({ id: n.id, title: n.title })) });
    } catch {}
    const termLower = q.toLowerCase();
    const contacts = searchSuggestions.filter(s => s.type === 'user' && s.name.toLowerCase().includes(termLower)).slice(0, 8);
    const groupItems = searchSuggestions.filter(s => s.type === 'group' && s.name.toLowerCase().includes(termLower)).slice(0, 8);
    groups.push({ key: 'contacts', title: '联系人', items: contacts.map(u => ({ id: u.id, title: u.name })) });
    groups.push({ key: 'groups', title: '群组', items: groupItems.map(g => ({ id: g.id, title: g.name })) });
    setResults({ query: q, groups });
    // 触发事件但不关闭弹窗
    const detail = { query: q, module: selectedModule, time: Date.now() };
    window.dispatchEvent(new CustomEvent('globalSearch', { detail }));
  };

  const renderModulesChips = () => (
    <Space wrap style={{ marginTop: 8 }}>
      {MODULES.map(m => (
        <Tag
          key={m.key}
          color={selectedModule === m.key ? 'blue' : 'default'}
          style={{
            borderRadius: 16,
            padding: '4px 10px',
            cursor: 'pointer',
            fontSize: 12
          }}
          onClick={() => setSelectedModule(m.key)}
        >
          {m.label}
        </Tag>
      ))}
      <Tooltip title="筛选">
        <Tag style={{ borderRadius: 16, padding: '4px 10px', cursor: 'pointer' }}>
          <FilterOutlined />
        </Tag>
      </Tooltip>
    </Space>
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      title={null}
      centered
      styles={{ body: { padding: 0 } }}
    >
      <div style={{ padding: 16 }}>
        {/* 顶部搜索输入区 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Input
            size="large"
            allowClear
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onPressEnter={handleSearch}
            placeholder="你想搜的问题，或搜索关键词"
            prefix={<SearchOutlined style={{ color: '#999' }} />}
            style={{ flex: 1 }}
          />
          <Button type="primary" size="large" onClick={handleSearch}>搜索</Button>
        </div>

        {/* 模块快速筛选标签：始终显示，表示可搜索的范围 */}
        <div style={{ marginTop: 12 }}>{renderModulesChips()}</div>

        {/* 未有结果时显示 搜索历史 与 常用关键词 */}
        {!results && (
          <div style={{ marginTop: 12 }}>
            {/* 搜索历史 */}
            {history.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 600, color: '#666' }}>搜索历史</div>
                  <a style={{ fontSize: 12 }} onClick={clearHistory}>清空</a>
                </div>
                <Space wrap style={{ marginTop: 8 }}>
                  {history.map(h => (
                    <Tag
                      key={h}
                      style={{ borderRadius: 16, padding: '4px 10px', cursor: 'pointer' }}
                      onClick={() => { setQuery(h); setTimeout(handleSearch, 0); }}
                    >
                      {h}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}

            {/* 常用关键词 */}
            {topFrequent.length > 0 && (
              <div>
                <div style={{ fontWeight: 600, color: '#666' }}>常用</div>
                <Space wrap style={{ marginTop: 8 }}>
                  {topFrequent.map(t => (
                    <Tag
                      key={t}
                      color="processing"
                      style={{ borderRadius: 16, padding: '4px 10px', cursor: 'pointer' }}
                      onClick={() => { setQuery(t); setTimeout(handleSearch, 0); }}
                    >
                      {t}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}
          </div>
        )}

        {/* 有结果时在模块标签下方显示分组结果 */}
        {results && (
          <div style={{ marginTop: 12 }}>
            {results.groups.map(group => (
              <div key={group.key} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 600, color: '#666' }}>{group.title}</div>
                {group.items.length === 0 ? (
                  <div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>无匹配结果</div>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0 0' }}>
                    {group.items.map(item => (
                      <li key={item.id} style={{ padding: '6px 0', borderBottom: '1px dashed #eee' }}>
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
    </Modal>
  );
};

export default GlobalSearchModal;