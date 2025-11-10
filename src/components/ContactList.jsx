import React, { useState, useEffect } from 'react';
import { MoreVertical, Pin, Bell, X, Search as SearchIcon, Plus } from 'lucide-react';
import { Dropdown, Tooltip } from 'antd';
import './ContactList.css';

const ContactList = ({ 
  contacts, 
  activeContact, 
  onContactSelect,
  totalUnreadCount,
  width
}) => {
  // 置顶会话状态管理
  const [pinnedContacts, setPinnedContacts] = useState([]);

  // 监听置顶事件
  useEffect(() => {
    const handleContactPin = (event) => {
      const { contactId } = event.detail;
      const contact = contacts.find(c => c.id === contactId);
      if (contact && !pinnedContacts.find(p => p.id === contactId)) {
        setPinnedContacts(prev => [...prev, contact]);
      }
    };

    window.addEventListener('contactPin', handleContactPin);
    return () => window.removeEventListener('contactPin', handleContactPin);
  }, [contacts, pinnedContacts]);

  // 初始化默认置顶：系统消息与张老师
  useEffect(() => {
    if (!contacts || contacts.length === 0) return;
    if (pinnedContacts.length > 0) return; // 避免覆盖用户操作
    const defaultPinnedIds = ['system', 'user1'];
    const initialPinned = contacts.filter(c => defaultPinnedIds.includes(c.id));
    if (initialPinned.length) {
      setPinnedContacts(initialPinned);
    }
  }, [contacts]);

  // 取消置顶
  const unpinContact = (contactId) => {
    setPinnedContacts(prev => prev.filter(c => c.id !== contactId));
  };

  // 获取联系人（保留置顶会话在列表中）
  const getUnpinnedContacts = () => {
    return contacts;
  };

  // 显示为 MM/DD 的时间格式
  const formatMonthDay = (s) => {
    try {
      const str = String(s || '').trim();
      if (!str) return '';
      const m = /([0-9]{1,2})[\/\-.]([0-9]{1,2})/.exec(str);
      if (m) {
        const mm = m[1].padStart(2, '0');
        const dd = m[2].padStart(2, '0');
        return `${mm}/${dd}`;
      }
      const d = new Date(str);
      if (!isNaN(d.getTime())) {
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${mm}/${dd}`;
      }
      return str;
    } catch (e) {
      return s;
    }
  };

  // 事件派发辅助（交互占位，便于后续接入真实逻辑）
  const dispatchAction = (type, contact) => {
    window.dispatchEvent(new CustomEvent(type, { detail: { contactId: contact.id } }));
  };

  // 更多菜单项（按截图配置）
  const getMoreMenuItems = (contact) => ([
    { key: 'pin', label: '置顶', icon: <Pin size={16} />, onClick: () => dispatchAction('contactPin', contact) },
    { key: 'clearUnread', label: '清除未读', icon: <Bell size={16} />, onClick: () => dispatchAction('contactClearUnread', contact) },
    { key: 'mark', label: '标记', icon: <span className="menu-icon-flag" /> },
    {
      key: 'tags',
      label: '标签',
      icon: <span className="menu-icon-tag" />,
      children: [
        { key: 'tag-study', label: '学习', onClick: () => dispatchAction('contactTagStudy', contact) },
        { key: 'tag-work', label: '工作', onClick: () => dispatchAction('contactTagWork', contact) },
        { key: 'tag-important', label: '重要', onClick: () => dispatchAction('contactTagImportant', contact) },
      ]
    },
    { key: 'notify', label: '允许消息通知', icon: <Bell size={16} />, onClick: () => dispatchAction('contactAllowNotify', contact) },
    { key: 'collapse', label: '移入“折叠的会话”', icon: <span className="menu-icon-archive" />, onClick: () => dispatchAction('contactMoveToCollapsed', contact) },
    { key: 'complete', label: '完成', icon: <span className="menu-icon-check" />, onClick: () => dispatchAction('contactComplete', contact) },
    { type: 'divider' },
    { key: 'openSidebar', label: '在导航栏打开', icon: <span className="menu-icon-sidebar" />, onClick: () => dispatchAction('contactOpenInSidebar', contact) },
    { key: 'openWindow', label: '在独立窗口打开', icon: <span className="menu-icon-external" />, onClick: () => dispatchAction('contactOpenInWindow', contact) },
  ]);

  // 置顶区用的“更多”菜单：将“置顶”替换为“取消置顶”
  const getMoreMenuItemsPinned = (contact) => {
    const items = getMoreMenuItems(contact).filter(item => item.key !== 'pin');
    return [
      { key: 'unpin', label: '取消置顶', icon: <X size={16} />, onClick: () => unpinContact(contact.id) },
      ...items,
    ];
  };

  return (
    <div className="contacts-panel" style={width ? { width } : undefined}>
      <div className="contacts-header">
        <h2>消息</h2>
        <div className="header-tools">
          <div className="header-search">
            <input
              type="text"
              placeholder="搜索会话..."
              onFocus={() => window.dispatchEvent(new CustomEvent('conversationSearchOpen', { detail: { chatId: activeContact } }))}
              onChange={(e)=>{ /* 占位：可接入左侧过滤 */ }}
            />
            <SearchIcon size={16} />
          </div>
          <button className="header-plus" title="新建" onClick={()=>window.dispatchEvent(new CustomEvent('openNewConversation',{}))}><Plus size={16} /></button>
        </div>
      </div>
      
      {/* 置顶区域 */}
      {pinnedContacts.length > 0 && (
        <div className="pinned-section">
          <div className="pinned-grid">
            {pinnedContacts.map(contact => {
              const displayName = contact.name && contact.name.length > 4 
                ? `${contact.name.slice(0, 4)}…` 
                : contact.name;
              return (
                <div 
                  key={`pinned-${contact.id}`}
                  className={`pinned-item ${activeContact === contact.id ? 'active' : ''}`}
                  onClick={() => onContactSelect(contact.id)}
                >
                  <div className="pinned-icon">
                    {contact.avatar ? (
                      contact.avatar.startsWith('http') || contact.avatar.startsWith('/') ? (
                        <img src={contact.avatar} alt={contact.name} />
                      ) : (
                        <div className="avatar-placeholder emoji-avatar">
                          {contact.avatar}
                        </div>
                      )
                    ) : (
                      <div className="avatar-placeholder">
                        {contact.name?.charAt(0)}
                      </div>
                    )}
                    {/* 悬停显示更多 */}
                    <div className="pinned-actions" onClick={(e) => e.stopPropagation()}>
                      <Dropdown
                        trigger={["click"]}
                        placement="bottomRight"
                        menu={{ items: getMoreMenuItemsPinned(contact) }}
                      >
                        <button className="pinned-more-btn" title="更多">
                          <MoreVertical size={16} />
                        </button>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="pinned-name">{displayName}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="contacts-list">
        {getUnpinnedContacts().map(contact => (
          <div 
            key={contact.id}
            className={`contact-item ${activeContact === contact.id ? 'active' : ''}`}
            onClick={() => onContactSelect(contact.id)}
          >
            {contact.id === 'new_teacher_training' && (
              <span className="category-ribbon">组织</span>
            )}
            <div className="contact-avatar">
              {contact.avatar ? (
                // 检查是否是emoji或图片URL
                contact.avatar.startsWith('http') || contact.avatar.startsWith('/') ? (
                  <img src={contact.avatar} alt={contact.name} />
                ) : (
                  <div className="avatar-placeholder emoji-avatar">
                    {contact.avatar}
                  </div>
                )
              ) : (
                <div className="avatar-placeholder">
                  {contact.name.charAt(0)}
                </div>
              )}
              {/* 订阅话题的井号角标 */}
              {contact.type === 'topic' && contact.isSubscribed && (
                <span className="hashtag-badge">#</span>
              )}
              {contact.online && <div className="online-indicator"></div>}
            </div>
            
            <div className="contact-info">
              <div className="contact-name">{contact.name}</div>
              <div className="last-message">{contact.lastMessage}</div>
            </div>

            <div className="contact-meta">
              {contact.type === 'topic' && (
                <div className="type-row"><span className="type-badge topic">话题</span></div>
              )}
              <div className="last-time">
                {formatMonthDay(contact.lastTime)}
              </div>
              {contact.unreadCount > 0 && (
                <div className="unread-count">{contact.unreadCount}</div>
              )}
            </div>

            {/* 悬停操作区：置顶、通知、更多 */}
            <div className="contact-actions" onClick={(e) => e.stopPropagation()}>
              <Tooltip title="置顶">
                <button className="action-icon" onClick={() => dispatchAction('contactPin', contact)}>
                  <Pin size={16} />
                </button>
              </Tooltip>
              <Tooltip title="允许消息通知">
                <button className="action-icon" onClick={() => dispatchAction('contactAllowNotify', contact)}>
                  <Bell size={16} />
                </button>
              </Tooltip>
              <Dropdown
                trigger={["click"]}
                placement="bottomRight"
                menu={{ items: getMoreMenuItems(contact) }}
              >
                <button className="action-icon" title="更多">
                  <MoreVertical size={16} />
                </button>
              </Dropdown>
            </div>
          </div>
        ))}
        
        {getUnpinnedContacts().length === 0 && pinnedContacts.length === 0 && (
          <div className="empty-contacts">
            <div className="empty-icon">👥</div>
            <p>暂无会话</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactList;
