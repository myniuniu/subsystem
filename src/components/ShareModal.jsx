import React, { useState, useEffect } from 'react'
import { X, Link, QrCode, Mail, MessageCircle, Settings, Users } from 'lucide-react'
import { filterSuggestions, getSuggestionDisplayInfo } from '../data/searchSuggestions'
import './ShareModal.css'

const ShareModal = ({ 
  isOpen, 
  onClose, 
  document, 
  onCopyLink,
  onGenerateQRCode,
  onSocialShare
}) => {



  if (!isOpen || !document) return null



  const handleCopyLinkClick = () => {
    if (onCopyLink) {
      onCopyLink(document)
    } else {
      const shareUrl = `${window.location.origin}/docs/${document.id}`
      navigator.clipboard.writeText(shareUrl)
      alert('分享链接已复制到剪贴板')
    }
  }

  const handleGenerateQRCodeClick = () => {
    if (onGenerateQRCode) {
      onGenerateQRCode(document)
    } else {
      alert('二维码生成功能（实际项目中可集成QR码生成库）')
    }
  }

  const handleSocialShareClick = (platform) => {
    if (onSocialShare) {
      onSocialShare(platform, document)
    } else {
      const shareUrl = `${window.location.origin}/docs/${document.id}`
      const shareText = `分享文档：${document.title}`
      
      let url = ''
      switch (platform) {
        case 'wechat':
          alert('微信分享功能（实际项目中需要集成微信SDK）')
          break
        case 'qq':
          url = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`
          break
        case 'weibo':
          url = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`
          break
        case 'email':
          url = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`
          break
        default:
          return
      }
      
      if (url) {
        window.open(url, '_blank')
      }
    }
  }

  return (
    <div className="share-modal-overlay">
      <div className="share-modal">
        <div className="share-modal-header">
          <div className="share-modal-title">
            <h3 className="modal-title">分享文档</h3>
            <div className="help-icon">?</div>
          </div>
          <div className="header-actions">
            <button 
              className="permission-settings-btn"
              onClick={onOpenPermissionModal}
              title="权限设置"
            >
              <Settings size={16} />
              权限设置
            </button>
            <button 
              className="share-modal-close"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="share-modal-content">
          {/* 邀请协作者部分 */}
          <div className="invite-section">
            <h4 className="section-title">
              <Users size={16} />
              邀请协作者
            </h4>
            
            <div className="invite-input-container">
              <input
                type="text"
                className="invite-input"
                placeholder="搜索用户、群组、部门或用户组"
                value={inviteSearchTerm}
                onChange={(e) => handleInviteSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="add-btn">+</button>
            </div>
            
            {/* 搜索建议 */}
            {showSearchSuggestions && filteredSuggestions.length > 0 && (
              <div className="search-suggestions">
                {filteredSuggestions.map((suggestion, index) => (
                  <div 
                    key={suggestion.id}
                    className={`suggestion-item ${
                      index === selectedSuggestionIndex ? 'selected' : ''
                    }`}
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    {(() => {
                      const displayInfo = getSuggestionDisplayInfo(suggestion)
                      return (
                        <>
                          <div className={displayInfo.avatarClass}>
                            {displayInfo.avatar}
                          </div>
                          <div className="suggestion-info">
                            <div className="suggestion-name">
                              {highlightText(displayInfo.name, inviteSearchTerm)}
                            </div>
                            <div className="suggestion-detail">
                              {displayInfo.detail}
                            </div>
                          </div>
                        </>
                      )
                    })()} 
                  </div>
                ))}
              </div>
            )}
            
            {/* 已选择的协作者 */}
            {selectedCollaborators.length > 0 && (
              <div className="collaborators-list">
                {selectedCollaborators.map(collaborator => (
                  <div key={collaborator.id} className="added-collaborator">
                    {(() => {
                      const displayInfo = getSuggestionDisplayInfo(collaborator)
                      return (
                        <>
                          <div className={`collaborator-avatar ${displayInfo.avatarClass}`}>
                            {displayInfo.avatar}
                          </div>
                          <span className="collaborator-name">{displayInfo.name}</span>
                          <button 
                            className="remove-collaborator"
                            onClick={() => handleRemoveCollaborator(collaborator.id)}
                          >
                            <X size={14} />
                          </button>
                        </>
                      )
                    })()} 
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 链接分享部分 */}
          <div className="link-share-section">
            <h4 className="section-title">
              链接分享
            </h4>
            
            <div className="organization-share">
              <div className="org-avatar">🏢</div>
              <div className="org-info">
                <div className="org-name">北京国人通教育科技有限公司</div>
                <div className="org-description">组织内获得链接的人可阅读</div>
              </div>
              <div className="permission-dropdown">
                <select className="permission-select">
                  <option value="readable">可阅读</option>
                  <option value="editable">可编辑</option>
                  <option value="comment">可评论</option>
                </select>
              </div>
            </div>
            
            <div className="share-actions">
              <button 
                className="share-action-btn copy-link"
                onClick={handleCopyLinkClick}
              >
                <Link size={16} />
                复制链接
              </button>
              
              <button 
                className="share-action-btn twitter"
                onClick={() => handleSocialShareClick('twitter')}
              >
                <MessageCircle size={16} />
              </button>
              
              <button 
                className="share-action-btn bookmark"
                onClick={() => handleSocialShareClick('bookmark')}
              >
                <QrCode size={16} />
              </button>
              
              <button 
                className="share-action-btn android"
                onClick={() => handleSocialShareClick('android')}
              >
                <Mail size={16} />
              </button>
              
              <button 
                className="share-action-btn qr"
                onClick={() => handleSocialShareClick('qr')}
              >
                <QrCode size={16} />
              </button>
              
              <button 
                className="share-action-btn more"
                onClick={() => handleSocialShareClick('more')}
              >
                <MessageCircle size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareModal