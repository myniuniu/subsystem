import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Input, Tag, Space, Divider, Tooltip, Button } from 'antd';
import { SearchOutlined, FilterOutlined, CloseOutlined } from '@ant-design/icons';

// 模块列表（结合本项目已有模块，示例标签可调整）
const MODULES = [
  { key: 'global', label: '全局' },
  { key: 'notes', label: '笔记' },
  { key: 'smartNotes', label: '智能笔记' },
  { key: 'docs', label: '云文档' },
  { key: 'apps', label: '应用' },
  { key: 'contacts', label: '联系人' },
  { key: 'groups', label: '群组' },
  { key: 'calendar', label: '日程' },
  { key: 'video', label: '视频' },
  { key: 'data', label: '数据分析' },
  { key: 'ai', label: 'AI助手' },
];

const LS_KEY = 'global_search_history_v1';

const GlobalSearchModal = ({ open, onClose, defaultQuery = '' }) => {
  const [query, setQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('global');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelectedModule('global');
    }
  }, [open]);

  // 新增：打开时预填默认查询
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

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    saveHistory(q);
    // 触发全局事件，供模块接入监听
    const detail = { query: q, module: selectedModule, time: Date.now() };
    window.dispatchEvent(new CustomEvent('globalSearch', { detail }));
    // 反馈并关闭
    // 注意：数据来源由各模块决定，这里不内置数据
    onClose?.();
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

        {/* 模块快速筛选标签 */}
        <div style={{ marginTop: 12 }}>{renderModulesChips()}</div>

        <Divider style={{ margin: '12px 0' }} />

        {/* 搜索历史 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 600, color: '#666' }}>搜索历史</div>
            {history.length > 0 && (
              <Tooltip title="清空历史">
                <Button type="text" size="small" icon={<CloseOutlined />} onClick={clearHistory} />
              </Tooltip>
            )}
          </div>
          <Space wrap style={{ marginTop: 8 }}>
            {history.length === 0 ? (
              <span style={{ color: '#999', fontSize: 12 }}>暂无历史</span>
            ) : (
              history.map(h => (
                <Tag
                  key={h}
                  style={{ borderRadius: 16, padding: '4px 10px', cursor: 'pointer' }}
                  onClick={() => setQuery(h)}
                >
                  {h}
                </Tag>
              ))
            )}
          </Space>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* 结果区域占位（数据由各模块提供，这里不展示演示数据）*/}
        <div>
          <div style={{ fontWeight: 600, color: '#666' }}>搜索结果</div>
          <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
            {query ? `将在「${MODULES.find(m => m.key === selectedModule)?.label || '全局'}」范围执行搜索` : '请输入关键词以开始搜索'}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GlobalSearchModal;