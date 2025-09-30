import React, { useState } from 'react';
import { Modal, Avatar, Button, Space, Divider } from 'antd';
import { 
  User, 
  Plus, 
  UserPlus, 
  Smartphone, 
  ChevronRight,
  Building2
} from 'lucide-react';
import './LoginMoreModal.css';

const LoginMoreModal = ({ open, onCancel }) => {
  // 模拟账号数据
  const [accounts] = useState([
    {
      id: 1,
      name: '国人通教育科技有限公司',
      username: '张洪磊',
      phone: '+8615313950356',
      avatar: null,
      type: 'company',
      isActive: true
    },
    {
      id: 3,
      name: '个人用户',
      username: '张洪磊',
      phone: '+8615313950356',
      avatar: null,
      type: 'personal',
      isActive: false
    }
  ]);

  // 处理账号切换
  const handleSwitchAccount = (accountId) => {
    console.log('切换到账号:', accountId);
    // 这里可以添加实际的账号切换逻辑
    onCancel();
  };

  // 处理加入企业
  const handleJoinCompany = () => {
    console.log('加入已有企业');
    // 这里可以添加加入企业的逻辑
  };

  // 处理创建账号
  const handleCreateAccount = () => {
    console.log('创建新账号');
    // 这里可以添加创建账号的逻辑
  };

  // 处理其他登录方式
  const handleOtherLoginMethods = () => {
    console.log('使用其他手机号或邮箱登录');
    // 这里可以添加其他登录方式的逻辑
  };

  // 获取账号图标
  const getAccountIcon = (account) => {
    const iconProps = { size: 20, color: '#fff' };
    
    switch (account.type) {
      case 'company':
        return <Building2 {...iconProps} />;
      case 'test':
        return <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>T</span>;
      case 'personal':
        return <User {...iconProps} />;
      case 'developer':
        return <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>飞</span>;
      default:
        return <User {...iconProps} />;
    }
  };

  // 获取账号背景色
  const getAccountColor = (account) => {
    const colors = {
      company: '#1890ff',
      test: '#52c41a', 
      personal: '#13c2c2',
      developer: '#722ed1'
    };
    return colors[account.type] || '#1890ff';
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={400}
      className="login-more-modal"
      destroyOnHidden={true}
    >
      <div className="login-more-content">
        {/* 标题 */}
        <div className="login-more-header">
          <h3>登录更多账号</h3>
        </div>

        {/* 当前登录提示 */}
        <div className="current-login-tip">
          +8615313950356 已在以下企业或组织绑定了账号
        </div>

        {/* 账号列表 */}
        <div className="account-list">
          {accounts.map((account) => (
            <div 
              key={account.id} 
              className={`account-item ${account.isActive ? 'active' : ''}`}
              onClick={() => handleSwitchAccount(account.id)}
            >
              <div className="account-info">
                <Avatar 
                  size={40}
                  style={{ 
                    backgroundColor: getAccountColor(account),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {getAccountIcon(account)}
                </Avatar>
                <div className="account-details">
                  <div className="account-name">{account.name}</div>
                  <div className="account-username">{account.username}</div>
                </div>
              </div>
              <ChevronRight size={16} className="account-arrow" />
            </div>
          ))}
        </div>

        <Divider style={{ margin: '20px 0' }} />

        {/* 操作按钮 */}
        <div className="action-buttons">
          <div className="action-item" onClick={handleJoinCompany}>
            <div className="action-icon">
              <Building2 size={20} />
            </div>
            <span>加入已有企业</span>
            <ChevronRight size={16} className="action-arrow" />
          </div>

          <div className="action-item" onClick={handleCreateAccount}>
            <div className="action-icon">
              <UserPlus size={20} />
            </div>
            <span>创建新账号</span>
            <ChevronRight size={16} className="action-arrow" />
          </div>
        </div>

        <Divider style={{ margin: '20px 0' }} />

        {/* 其他登录方式 */}
        <div className="other-login" onClick={handleOtherLoginMethods}>
          <Smartphone size={16} />
          <span>使用其他手机号或邮箱登录</span>
          <ChevronRight size={16} />
        </div>
      </div>
    </Modal>
  );
};

export default LoginMoreModal;