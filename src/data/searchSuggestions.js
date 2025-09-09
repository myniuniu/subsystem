// 通用搜索建议数据
// 用于ShareModal组件的协作者搜索功能

export const searchSuggestions = [
  {
    id: 1,
    type: 'user',
    name: '张志超',
    department: '大数据部',
    initials: 'ZZ',
    avatar: '👨‍💼',
    email: 'zhangzhichao@company.com'
  },
  {
    id: 2,
    type: 'user',
    name: '李明华',
    department: '产品部',
    initials: 'LM',
    avatar: '👩‍💼',
    email: 'liminghua@company.com'
  },
  {
    id: 3,
    type: 'user',
    name: '王小红',
    department: '设计部',
    initials: 'WX',
    avatar: '👩‍🎨',
    email: 'wangxiaohong@company.com'
  },
  {
    id: 4,
    type: 'user',
    name: '陈建国',
    department: '技术部',
    initials: 'CJ',
    avatar: '👨‍💻',
    email: 'chenjianguo@company.com'
  },
  {
    id: 5,
    type: 'user',
    name: '刘思雨',
    department: '运营部',
    initials: 'LS',
    avatar: '👩‍💼',
    email: 'liusiyu@company.com'
  },
  {
    id: 6,
    type: 'user',
    name: '赵文博',
    department: '市场部',
    initials: 'ZW',
    avatar: '👨‍💼',
    email: 'zhaowenbo@company.com'
  },
  {
    id: 7,
    type: 'group',
    name: '项目组A',
    department: '跨部门协作',
    initials: 'PA',
    avatar: '👥',
    memberCount: 8,
    description: '负责核心产品开发'
  },
  {
    id: 8,
    type: 'group',
    name: '设计团队',
    department: '创意设计',
    initials: 'DT',
    avatar: '🎨',
    memberCount: 5,
    description: 'UI/UX设计团队'
  },
  {
    id: 9,
    type: 'group',
    name: '技术委员会',
    department: '技术决策',
    initials: 'TC',
    avatar: '⚙️',
    memberCount: 12,
    description: '技术架构与标准制定'
  },
  {
    id: 10,
    type: 'department',
    name: '研发中心',
    department: '技术研发',
    initials: 'RD',
    avatar: '🔬',
    memberCount: 25,
    description: '产品研发与技术创新'
  },
  {
    id: 11,
    type: 'user',
    name: '孙美丽',
    department: '人事部',
    initials: 'SM',
    avatar: '👩‍💼',
    email: 'sunmeili@company.com'
  },
  {
    id: 12,
    type: 'user',
    name: '周强',
    department: '财务部',
    initials: 'ZQ',
    avatar: '👨‍💼',
    email: 'zhouqiang@company.com'
  }
]

// 根据搜索词过滤建议
export const filterSuggestions = (suggestions, searchTerm, excludeIds = []) => {
  if (!searchTerm) return []
  
  return suggestions.filter(suggestion => {
    // 排除已选择的项目
    if (excludeIds.includes(suggestion.id)) return false
    
    // 搜索匹配逻辑
    const term = searchTerm.toLowerCase()
    return (
      suggestion.name.toLowerCase().includes(term) ||
      suggestion.department.toLowerCase().includes(term) ||
      (suggestion.email && suggestion.email.toLowerCase().includes(term)) ||
      (suggestion.description && suggestion.description.toLowerCase().includes(term))
    )
  })
}

// 获取建议项的显示信息
export const getSuggestionDisplayInfo = (suggestion) => {
  const displayInfo = {
    name: suggestion.name,
    avatar: suggestion.initials,
    avatarClass: suggestion.type === 'user' ? 'user-avatar' : 
                 suggestion.type === 'group' ? 'group-avatar' : 'department-avatar'
  }
  
  // 根据类型设置详细信息
  switch (suggestion.type) {
    case 'user':
      displayInfo.detail = suggestion.department
      break
    case 'group':
    case 'department':
      displayInfo.detail = `${suggestion.memberCount} 成员`
      break
    default:
      displayInfo.detail = suggestion.department
  }
  
  return displayInfo
}