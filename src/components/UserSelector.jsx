import React, { useState, useEffect } from 'react';
import {
  Select,
  Avatar,
  Tag,
  Space,
  Input,
  Empty,
  Spin,
  Badge
} from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  CloseOutlined
} from '@ant-design/icons';
import userService from '../services/userService';

const { Option } = Select;
const { Search } = Input;

const UserSelector = ({ 
  value = [], 
  onChange, 
  placeholder = "搜索并选择用户...",
  maxCount = 10,
  disabled = false,
  showOnlineStatus = true,
  excludeCurrentUser = true,
  filterByRole = null // 可以是 'student', 'teacher', 'admin' 或 null
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState(value);

  useEffect(() => {
    loadUsers();
  }, [searchQuery, filterByRole]);

  useEffect(() => {
    setSelectedUsers(value);
  }, [value]);

  // 加载用户列表
  const loadUsers = async () => {
    setLoading(true);
    try {
      let allUsers = userService.searchUsers(searchQuery);
      
      // 排除当前用户
      if (excludeCurrentUser) {
        const currentUser = userService.getCurrentUser();
        if (currentUser) {
          allUsers = allUsers.filter(user => user.id !== currentUser.id);
        }
      }
      
      // 按角色过滤
      if (filterByRole) {
        allUsers = allUsers.filter(user => user.role === filterByRole);
      }
      
      // 排除已选择的用户
      allUsers = allUsers.filter(user => 
        !selectedUsers.some(selected => selected.id === user.id)
      );
      
      setUsers(allUsers);
    } catch (error) {
      console.error('加载用户列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理用户选择
  const handleUserSelect = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user && selectedUsers.length < maxCount) {
      const newSelectedUsers = [...selectedUsers, user];
      setSelectedUsers(newSelectedUsers);
      onChange && onChange(newSelectedUsers);
    }
  };

  // 处理用户移除
  const handleUserRemove = (userId) => {
    const newSelectedUsers = selectedUsers.filter(user => user.id !== userId);
    setSelectedUsers(newSelectedUsers);
    onChange && onChange(newSelectedUsers);
  };

  // 处理搜索
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  // 获取角色颜色
  const getRoleColor = (role) => {
    const colors = {
      admin: 'red',
      teacher: 'blue',
      student: 'green'
    };
    return colors[role] || 'default';
  };

  // 获取角色标签
  const getRoleLabel = (role) => {
    const labels = {
      admin: '管理员',
      teacher: '教师',
      student: '学生'
    };
    return labels[role] || role;
  };

  return (
    <div style={{ width: '100%' }}>
      {/* 搜索框 */}
      <Search
        placeholder="搜索用户..."
        allowClear
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: '12px' }}
        prefix={<SearchOutlined />}
        disabled={disabled}
      />
      
      {/* 已选择的用户 */}
      {selectedUsers.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginBottom: '8px' 
          }}>
            已选择 ({selectedUsers.length}/{maxCount})
          </div>
          <Space wrap>
            {selectedUsers.map(user => (
              <Tag
                key={user.id}
                closable={!disabled}
                onClose={() => handleUserRemove(user.id)}
                style={{ 
                  padding: '4px 8px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Badge 
                  dot 
                  status={user.isOnline ? 'success' : 'default'}
                  style={{ display: showOnlineStatus ? 'inline' : 'none' }}
                >
                  <Avatar 
                    size="small" 
                    src={user.avatar}
                    style={{ backgroundColor: '#87d068' }}
                  >
                    {user.avatar ? null : user.username[0]}
                  </Avatar>
                </Badge>
                <span>{user.username}</span>
                <Tag 
                  size="small" 
                  color={getRoleColor(user.role)}
                  style={{ margin: 0, fontSize: '10px' }}
                >
                  {getRoleLabel(user.role)}
                </Tag>
              </Tag>
            ))}
          </Space>
        </div>
      )}
      
      {/* 用户选择下拉框 */}
      <Select
        showSearch
        placeholder={placeholder}
        style={{ width: '100%' }}
        loading={loading}
        disabled={disabled || selectedUsers.length >= maxCount}
        onSelect={handleUserSelect}
        value={null} // 保持为空，因为我们用Tag显示选中的用户
        dropdownRender={menu => (
          <div>
            {users.length === 0 ? (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无用户"
                style={{ padding: '20px' }}
              />
            ) : (
              menu
            )}
          </div>
        )}
        filterOption={false} // 禁用内置过滤，使用我们的搜索
      >
        {users.map(user => (
          <Option key={user.id} value={user.id}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '4px 0'
            }}>
              <Badge 
                dot 
                status={user.isOnline ? 'success' : 'default'}
                style={{ display: showOnlineStatus ? 'inline' : 'none' }}
              >
                <Avatar 
                  size="small" 
                  src={user.avatar}
                  style={{ backgroundColor: '#87d068' }}
                >
                  {user.avatar ? null : user.username[0]}
                </Avatar>
              </Badge>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{user.username}</div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>{user.email}</span>
                  <Tag 
                    size="small" 
                    color={getRoleColor(user.role)}
                  >
                    {getRoleLabel(user.role)}
                  </Tag>
                  {showOnlineStatus && (
                    <span style={{ 
                      color: user.isOnline ? '#52c41a' : '#999',
                      fontSize: '10px'
                    }}>
                      {user.isOnline ? '在线' : '离线'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Option>
        ))}
      </Select>
      
      {/* 提示信息 */}
      {selectedUsers.length >= maxCount && (
        <div style={{ 
          fontSize: '12px', 
          color: '#ff4d4f', 
          marginTop: '8px' 
        }}>
          最多只能选择 {maxCount} 个用户
        </div>
      )}
    </div>
  );
};

export default UserSelector;