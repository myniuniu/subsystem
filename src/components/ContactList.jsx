import React from 'react';
import { Search } from 'lucide-react';
import './ContactList.css';

const ContactList = ({ 
  contacts, 
  activeContact, 
  onContactSelect, 
  searchTerm, 
  onSearchChange,
  totalUnreadCount 
}) => {
  // 获取过滤后的联系人
  const getFilteredContacts = () => {
    if (!searchTerm) return contacts;
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="contacts-panel">
      <div className="contacts-header">
        <h2>消息</h2>
        {totalUnreadCount > 0 && (
          <span className="unread-badge">{totalUnreadCount}</span>
        )}
      </div>
      
      <div className="search-box">
        <Search size={16} />
        <input
          type="text"
          placeholder="搜索联系人..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="contacts-list">
        {getFilteredContacts().map(contact => (
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
              {contact.online && <div className="online-indicator"></div>}
            </div>
            
            <div className="contact-info">
              <div className="contact-name">{contact.name}</div>
              <div className="last-message">{contact.lastMessage}</div>
            </div>
            
            <div className="contact-meta">
              <div className="last-time">{contact.lastTime}</div>
              {contact.unreadCount > 0 && (
                <div className="unread-count">{contact.unreadCount}</div>
              )}
            </div>
          </div>
        ))}
        
        {getFilteredContacts().length === 0 && (
          <div className="empty-contacts">
            <div className="empty-icon">👥</div>
            <p>未找到联系人</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactList;