// 用户管理服务
class UserService {
  constructor() {
    this.storageKey = 'app_users';
    this.currentUserKey = 'current_user';
    this.initializeUsers();
  }

  // 初始化用户数据
  initializeUsers() {
    const users = this.getAllUsers();
    if (users.length === 0) {
      // 创建一些示例用户
      const defaultUsers = [
        {
          id: 'user_1',
          username: '张三',
          email: 'zhangsan@example.com',
          avatar: null,
          role: 'student',
          joinDate: new Date().toISOString(),
          isOnline: true
        },
        {
          id: 'user_2',
          username: '李四',
          email: 'lisi@example.com',
          avatar: null,
          role: 'teacher',
          joinDate: new Date().toISOString(),
          isOnline: false
        },
        {
          id: 'user_3',
          username: '王五',
          email: 'wangwu@example.com',
          avatar: null,
          role: 'student',
          joinDate: new Date().toISOString(),
          isOnline: true
        },
        {
          id: 'user_4',
          username: '赵六',
          email: 'zhaoliu@example.com',
          avatar: null,
          role: 'admin',
          joinDate: new Date().toISOString(),
          isOnline: false
        }
      ];
      
      localStorage.setItem(this.storageKey, JSON.stringify(defaultUsers));
      
      // 设置当前用户为第一个用户
      this.setCurrentUser(defaultUsers[0]);
    }
  }

  // 获取所有用户
  getAllUsers() {
    try {
      const users = localStorage.getItem(this.storageKey);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('获取用户列表失败:', error);
      return [];
    }
  }

  // 根据ID获取用户
  getUserById(userId) {
    const users = this.getAllUsers();
    return users.find(user => user.id === userId);
  }

  // 根据用户名搜索用户
  searchUsers(query) {
    if (!query || query.trim() === '') {
      return this.getAllUsers();
    }
    
    const users = this.getAllUsers();
    const searchTerm = query.toLowerCase().trim();
    
    return users.filter(user => 
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  }

  // 获取当前用户
  getCurrentUser() {
    try {
      const currentUser = localStorage.getItem(this.currentUserKey);
      return currentUser ? JSON.parse(currentUser) : null;
    } catch (error) {
      console.error('获取当前用户失败:', error);
      return null;
    }
  }

  // 设置当前用户
  setCurrentUser(user) {
    try {
      localStorage.setItem(this.currentUserKey, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('设置当前用户失败:', error);
      return false;
    }
  }

  // 添加新用户
  addUser(userData) {
    try {
      const users = this.getAllUsers();
      const newUser = {
        id: `user_${Date.now()}`,
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar || null,
        role: userData.role || 'student',
        joinDate: new Date().toISOString(),
        isOnline: false,
        ...userData
      };
      
      users.push(newUser);
      localStorage.setItem(this.storageKey, JSON.stringify(users));
      return newUser;
    } catch (error) {
      console.error('添加用户失败:', error);
      return null;
    }
  }

  // 更新用户信息
  updateUser(userId, updateData) {
    try {
      const users = this.getAllUsers();
      const userIndex = users.findIndex(user => user.id === userId);
      
      if (userIndex === -1) {
        return null;
      }
      
      users[userIndex] = { ...users[userIndex], ...updateData };
      localStorage.setItem(this.storageKey, JSON.stringify(users));
      
      // 如果更新的是当前用户，同时更新当前用户信息
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        this.setCurrentUser(users[userIndex]);
      }
      
      return users[userIndex];
    } catch (error) {
      console.error('更新用户失败:', error);
      return null;
    }
  }

  // 删除用户
  deleteUser(userId) {
    try {
      const users = this.getAllUsers();
      const filteredUsers = users.filter(user => user.id !== userId);
      
      if (filteredUsers.length === users.length) {
        return false; // 用户不存在
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(filteredUsers));
      return true;
    } catch (error) {
      console.error('删除用户失败:', error);
      return false;
    }
  }

  // 获取在线用户
  getOnlineUsers() {
    const users = this.getAllUsers();
    return users.filter(user => user.isOnline);
  }

  // 设置用户在线状态
  setUserOnlineStatus(userId, isOnline) {
    return this.updateUser(userId, { isOnline });
  }

  // 获取用户统计信息
  getUserStats() {
    const users = this.getAllUsers();
    const onlineUsers = users.filter(user => user.isOnline);
    
    return {
      totalUsers: users.length,
      onlineUsers: onlineUsers.length,
      offlineUsers: users.length - onlineUsers.length,
      studentCount: users.filter(user => user.role === 'student').length,
      teacherCount: users.filter(user => user.role === 'teacher').length,
      adminCount: users.filter(user => user.role === 'admin').length
    };
  }

  // 验证用户权限
  hasPermission(userId, permission) {
    const user = this.getUserById(userId);
    if (!user) return false;
    
    // 简单的权限系统
    const permissions = {
      admin: ['read', 'write', 'delete', 'share', 'manage'],
      teacher: ['read', 'write', 'share'],
      student: ['read', 'share']
    };
    
    const userPermissions = permissions[user.role] || [];
    return userPermissions.includes(permission);
  }

  // 获取用户的分享权限
  getSharePermissions(userId) {
    const user = this.getUserById(userId);
    if (!user) return [];
    
    const basePermissions = ['view'];
    
    switch (user.role) {
      case 'admin':
        return [...basePermissions, 'edit', 'delete', 'manage'];
      case 'teacher':
        return [...basePermissions, 'edit', 'comment'];
      case 'student':
      default:
        return [...basePermissions, 'comment'];
    }
  }
}

// 创建并导出服务实例
const userService = new UserService();
export default userService;