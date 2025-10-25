import './KnowledgeSpaceSettingsModal.css'
import { useState } from 'react'

export default function KnowledgeSpaceSettingsModal({ open, onClose, currentSpace, onSave }) {
  if (!open) return null

  const [activeTab, setActiveTab] = useState('members')
  const [scope, setScope] = useState('membersOnly') // membersOnly | company
  const [roleTab, setRoleTab] = useState('admin') // admin | editor | reader
  const [searchUser, setSearchUser] = useState('')
  const [managers, setManagers] = useState([
    { id: 'u1', name: '张洪磊', team: '架构组', avatar: '' }
  ])

  const addManager = () => {
    const id = `u${Date.now()}`
    setManagers(prev => [...prev, { id, name: `新管理员${prev.length + 1}`, team: '未分组', avatar: '' }])
  }

  const removeManager = (id) => {
    setManagers(prev => prev.filter(m => m.id !== id))
  }

  return (
    <div className="ks-settings-modal-backdrop" onClick={onClose}>
      <div className="ks-settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ks-settings-header">
          <div className="tabs">
            <button className={`tab ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>基础信息</button>
            <button className={`tab ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')}>成员设置</button>
            <button className={`tab ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>安全设置</button>
            <button className={`tab ${activeTab === 'more' ? 'active' : ''}`} onClick={() => setActiveTab('more')}>更多</button>
          </div>
          <button className="close" onClick={onClose}>×</button>
        </div>

        <div className="ks-settings-body">
          {activeTab === 'basic' && (
            <div>
              <div className="form-row">
                <label>名称</label>
                <input defaultValue={currentSpace} />
              </div>
              <div className="form-row">
                <label>简介</label>
                <textarea placeholder="请输入简介" />
              </div>
              <div className="cover-section">
                <div className="section-title">设置封面</div>
                <div className="cover-toolbar">
                  <button className="toolbar-btn active">全部</button>
                  <button className="toolbar-btn">色彩</button>
                  <button className="toolbar-btn">办公</button>
                  <button className="toolbar-btn">科技</button>
                  <button className="toolbar-btn">风景</button>
                  <div className="toolbar-spacer" />
                  <button className="toolbar-btn">随机封面</button>
                  <button className="toolbar-btn">上传</button>
                </div>
                <div className="cover-grid">
                  {new Array(20).fill(0).map((_, i) => (
                    <div key={i} className="cover-item" />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="member-settings">
              <div className="section-title">知识库公开范围</div>
              <div className="scope-card">
                <label className="radio-line" onClick={() => setScope('membersOnly')}>
                  <span className={`radio-circle ${scope === 'membersOnly' ? 'active' : ''}`}></span>
                  <span>仅当前知识库成员可见</span>
                </label>
                <label className="radio-line" onClick={() => setScope('company')}>
                  <span className={`radio-circle ${scope === 'company' ? 'active' : ''}`}></span>
                  <span>北京国人通教育科技有限公司所有人和知识库成员可见</span>
                </label>
              </div>

              <div className="section-title with-extra">角色与权限 <span className="muted">页面默认权限：可管理</span></div>
              <div className="role-toolbar">
                <div className="role-tabs">
                  <button className={`role-tab ${roleTab === 'admin' ? 'active' : ''}`} onClick={() => setRoleTab('admin')}>管理员</button>
                  <button className={`role-tab ${roleTab === 'editor' ? 'active' : ''}`} onClick={() => setRoleTab('editor')}>可编辑的成员</button>
                  <button className={`role-tab ${roleTab === 'reader' ? 'active' : ''}`} onClick={() => setRoleTab('reader')}>可阅读的成员</button>
                </div>
                <div className="role-actions">
                  <div className="search-input">
                    <span className="search-icon">🔍</span>
                    <input placeholder="搜索已有用户" value={searchUser} onChange={(e) => setSearchUser(e.target.value)} />
                  </div>
                  {roleTab === 'admin' && (
                    <button className="add-btn" onClick={addManager}>＋ 添加管理员</button>
                  )}
                </div>
              </div>

              {roleTab === 'admin' && (
                <div className="member-list">
                  {managers.filter(m => !searchUser || m.name.includes(searchUser)).map(m => (
                    <div key={m.id} className="member-item">
                      <div className="avatar" aria-hidden>{m.name[0]}</div>
                      <div className="member-info">
                        <div className="name-row">{m.name}</div>
                        <div className="team-tag">{m.team}</div>
                      </div>
                      <div className="member-actions">
                        <button className="link" onClick={() => removeManager(m.id)}>移除</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {roleTab !== 'admin' && (
                <div className="placeholder">暂未添加{roleTab === 'editor' ? '可编辑成员' : '可阅读成员'}</div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="placeholder">安全设置内容占位</div>
          )}
          {activeTab === 'more' && (
            <div className="placeholder">更多设置内容占位</div>
          )}
        </div>

        <div className="ks-settings-footer">
          <button className="primary" onClick={() => onSave?.({ name: currentSpace, scope, roleTab })}>保存设置</button>
        </div>
      </div>
    </div>
  )
}