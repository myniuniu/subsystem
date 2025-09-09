import React from 'react'
import { X, ChevronDown, ChevronRight } from 'lucide-react'
import './PermissionModal.css'

const PermissionModal = ({ 
  isOpen, 
  onClose, 
  permissionSettings,
  onPermissionChange,
  onToggleAdvancedSettings
}) => {
  if (!isOpen) return null

  const handlePermissionChange = (key, value) => {
    if (onPermissionChange) {
      onPermissionChange(key, value)
    }
  }

  const handleToggleAdvancedSettings = () => {
    if (onToggleAdvancedSettings) {
      onToggleAdvancedSettings()
    } else {
      handlePermissionChange('showAdvancedSettings', !permissionSettings.showAdvancedSettings)
    }
  }

  return (
    <div className="permission-modal-overlay">
      <div className="permission-modal">
        <div className="permission-modal-header">
          <h3 className="permission-modal-title">权限设置</h3>
          <button 
            className="permission-modal-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="permission-modal-content">
          {/* 对外分享 */}
          <div className="permission-section">
            <h4 className="permission-section-title">对外分享</h4>
            
            <div className="permission-option">
              <label className="permission-checkbox">
                <input 
                  type="checkbox" 
                  checked={permissionSettings.allowExternalShare || false}
                  onChange={(e) => handlePermissionChange('allowExternalShare', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="permission-label">允许内容被分享到组织外</span>
              </label>
            </div>
            
            <div className="permission-option">
              <label className="permission-checkbox">
                <input 
                  type="checkbox" 
                  checked={permissionSettings.onlyManagerCanShareExternal || false}
                  onChange={(e) => handlePermissionChange('onlyManagerCanShareExternal', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="permission-label">仅"可管理权限"可以将内容分享到组织外</span>
              </label>
            </div>
          </div>
          
          {/* 谁可以查看、添加、移除协作者 */}
          <div className="permission-section">
            <h4 className="permission-subsection-title">谁可以查看、添加、移除协作者</h4>
            
            <div className="permission-dropdown-container">
              <select 
                className="permission-dropdown"
                value={permissionSettings.whoCanViewAddRemove || 'readable_users'}
                onChange={(e) => handlePermissionChange('whoCanViewAddRemove', e.target.value)}
              >
                <option value="readable_users">可阅读的用户</option>
                <option value="editable_users">可编辑的用户</option>
                <option value="managers_only">仅管理员</option>
              </select>
            </div>
            
            <div className="permission-option">
              <label className="permission-checkbox">
                <input 
                  type="checkbox" 
                  checked={permissionSettings.onlyOrgUsersCanManageCollaborators || false}
                  onChange={(e) => handlePermissionChange('onlyOrgUsersCanManageCollaborators', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="permission-label">仅组织内的用户可以查看、添加、移除协作者</span>
              </label>
            </div>
          </div>
          
          {/* 谁可以复制内容 */}
          <div className="permission-section">
            <h4 className="permission-subsection-title">谁可以复制内容</h4>
            
            <div className="permission-dropdown-container">
              <select 
                className="permission-dropdown"
                value={permissionSettings.whoCanCopy || 'readable_users'}
                onChange={(e) => handlePermissionChange('whoCanCopy', e.target.value)}
              >
                <option value="readable_users">可阅读的用户</option>
                <option value="editable_users">可编辑的用户</option>
                <option value="managers_only">仅管理员</option>
              </select>
            </div>
          </div>
          
          {/* 谁可以创建副本、打印和下载 */}
          <div className="permission-section">
            <h4 className="permission-subsection-title">谁可以创建副本、打印和下载</h4>
            
            <div className="permission-dropdown-container">
              <select 
                className="permission-dropdown"
                value={permissionSettings.whoCanCreateCopy || 'readable_users'}
                onChange={(e) => handlePermissionChange('whoCanCreateCopy', e.target.value)}
              >
                <option value="readable_users">可阅读的用户</option>
                <option value="editable_users">可编辑的用户</option>
                <option value="managers_only">仅管理员</option>
              </select>
            </div>
          </div>
          
          {/* 谁可以评论 */}
          <div className="permission-section">
            <h4 className="permission-subsection-title">谁可以评论</h4>
            
            <div className="permission-dropdown-container">
              <select 
                className="permission-dropdown"
                value={permissionSettings.whoCanComment || 'readable_users'}
                onChange={(e) => handlePermissionChange('whoCanComment', e.target.value)}
              >
                <option value="readable_users">可阅读的用户</option>
                <option value="editable_users">可编辑的用户</option>
                <option value="managers_only">仅管理员</option>
              </select>
            </div>
          </div>
          
          {/* 更多高级设置 */}
          <div className="permission-section">
            <button 
              className="advanced-settings-toggle"
              onClick={handleToggleAdvancedSettings}
            >
              {permissionSettings.showAdvancedSettings ? (
                <ChevronDown className="toggle-arrow" size={16} />
              ) : (
                <ChevronRight className="toggle-arrow" size={16} />
              )}
              更多高级设置
            </button>
            
            {permissionSettings.showAdvancedSettings && (
              <div className="advanced-settings-content">
                {/* 谁可以查看访问者头像和访问者数量 */}
                <div className="permission-subsection">
                  <h4 className="permission-subsection-title">谁可以查看访问者头像和访问者数量</h4>
                  
                  <div className="permission-dropdown-container">
                    <select 
                      className="permission-dropdown"
                      value={permissionSettings.whoCanViewVisitors || 'readable_users'}
                      onChange={(e) => handlePermissionChange('whoCanViewVisitors', e.target.value)}
                    >
                      <option value="readable_users">可阅读的用户</option>
                      <option value="editable_users">可编辑的用户</option>
                      <option value="managers_only">仅管理员</option>
                    </select>
                  </div>
                </div>
                
                {/* 谁可以在文档内申请引用文档访问权限 */}
                <div className="permission-subsection">
                  <h4 className="permission-subsection-title">谁可以在文档内申请引用文档访问权限</h4>
                  
                  <div className="permission-option">
                    <label className="permission-checkbox">
                      <input 
                        type="checkbox" 
                        checked={permissionSettings.allowRequestAccess || false}
                        onChange={(e) => handlePermissionChange('allowRequestAccess', e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      <span className="permission-label">仅可管理权限的用户可以申请</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PermissionModal