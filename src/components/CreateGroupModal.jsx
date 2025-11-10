import React, { useState, useEffect } from 'react';
import { Modal, Input, Radio, Button, Popover } from 'antd';
import { Users, User, Layers, ChevronRight, Image as ImageIcon, Info } from 'lucide-react';
import './CreateGroupModal.css';

const tabs = ['群', '部门群'];

const CreateGroupModal = ({ open, onCancel, onCreate, contacts = [] }) => {
  const [activeTab, setActiveTab] = useState('群');
  const [groupMode, setGroupMode] = useState('对话');
  const [groupName, setGroupName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [memberQuery, setMemberQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    if (!open) {
      setActiveTab('群');
      setGroupMode('对话');
      setGroupName('');
      setAvatar('');
      setMemberQuery('');
      setSelectedMembers([]);
    }
  }, [open]);

  const categories = [
    { key: 'org', icon: <Users size={16} color="#22c55e" />, label: '组织内联系人' },
    { key: 'external', icon: <User size={16} color="#4c8df8" />, label: '外部联系人' },
    { key: 'managed', icon: <Layers size={16} color="#22c55e" />, label: '我管理的群组' },
  ];

  const handleCreate = () => {
    const payload = {
      tab: activeTab,
      mode: groupMode,
      name: groupName.trim(),
      avatar,
      members: selectedMembers,
    };
    if (typeof onCreate === 'function') onCreate(payload);
  };

  return (
    <Modal 
      open={open}
      onCancel={onCancel}
      footer={null}
      title={null}
      width={800}
      className="create-group-modal"
      destroyOnClose
    >
      <div className="cgm-root">
        {/* 顶部标签 */}
        <div className="cgm-tabs">
          {tabs.map(t => (
            <button key={t} className={`cgm-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
          ))}
        </div>

        {/* 群模式 */}
        <div className="cgm-row">
          <div className="cgm-label">群模式</div>
          <div className="cgm-field">
            <Radio.Group value={groupMode} onChange={(e)=>setGroupMode(e.target.value)}>
              <Radio value="对话">对话</Radio>
              <Radio value="话题">
                话题
                <Popover
                  placement="right"
                  trigger="hover"
                  overlayClassName="topic-info-popover"
                  content={(
                    <div className="topic-info-content">
                      <div className="topic-info-title">发布话题，在群内开展讨论</div>
                      <img src="/assets/话题示例.png" alt="话题示例" className="topic-info-image" />
                    </div>
                  )}
                >
                  <span className="topic-info-icon"><Info size={14} /></span>
                </Popover>
              </Radio>
            </Radio.Group>
          </div>
        </div>

        {/* 群名称 */}
        <div className="cgm-row">
          <div className="cgm-label">群名称</div>
          <div className="cgm-field">
            <Input placeholder="输入群名称（选填）" value={groupName} onChange={(e)=>setGroupName(e.target.value)} />
          </div>
        </div>

        {/* 群头像 */}
        <div className="cgm-row">
          <div className="cgm-label">群头像</div>
          <div className="cgm-field">
            <button className="cgm-avatar-btn" onClick={()=>setAvatar('🧑‍🏫')}><ImageIcon size={16} /><span>点击修改</span></button>
          </div>
        </div>

        {/* 群成员选择 */}
        <div className="cgm-row cgm-members">
          <div className="cgm-label">群成员</div>
          <div className="cgm-field">
            <div className="cgm-members-grid">
              <div className="cgm-members-left">
                <div className="cgm-members-search">
                  <Input placeholder="搜索联系人、部门和我管理的群组" value={memberQuery} onChange={(e)=>setMemberQuery(e.target.value)} />
                </div>
                <div className="cgm-category-list">
                  {categories.map(cat => (
                    <button className="cgm-category-item" key={cat.key}>
                      <div className="cgm-cat-left">{cat.icon}<span>{cat.label}</span></div>
                      <ChevronRight size={16} className="cgm-cat-right" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="cgm-members-right">
                <div className="cgm-selected-title">已选：{selectedMembers.length} 人</div>
                <div className="cgm-selected-list">
                  {selectedMembers.length === 0 ? (
                    <div className="cgm-empty">暂无选择</div>
                  ) : (
                    selectedMembers.map((m, idx) => (
                      <div key={`${m.id}-${idx}`} className="cgm-selected-item">{m.name}</div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="cgm-footer">
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={handleCreate}>创建(⌘+Enter)</Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateGroupModal;