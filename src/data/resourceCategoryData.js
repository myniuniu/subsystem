// 资源分类模拟数据
// 为ResourceCategorySidebar组件提供丰富的分类数据

export const resourceCategoryData = [
  // 内容类型分类
  {
    value: 'documents',
    label: '文档资料',
    icon: 'FileTextOutlined',
    type: 'system',
    pinned: false,
    count: 0 // 将由组件动态计算
  },
  {
    value: 'videos',
    label: '视频资源',
    icon: 'VideoCameraOutlined',
    type: 'system',
    pinned: false,
    count: 0
  },
  {
    value: 'images',
    label: '图片素材',
    icon: 'PictureOutlined',
    type: 'system',
    pinned: false,
    count: 0
  },
  {
    value: 'audio',
    label: '音频资源',
    icon: 'AudioOutlined',
    type: 'system',
    pinned: false,
    count: 0
  },
  {
    value: 'presentations',
    label: '演示文稿',
    icon: 'FilePptOutlined',
    type: 'system',
    pinned: false,
    count: 0
  },

  // 学科分类
  {
    value: 'chinese',
    label: '语文',
    icon: '📖',
    type: 'system',
    pinned: false,
    count: 0
  },
  {
    value: 'math',
    label: '数学',
    icon: '🔢',
    type: 'system',
    pinned: false,
    count: 0
  },
  {
    value: 'english',
    label: '英语',
    icon: '🌍',
    type: 'system',
    pinned: false,
    count: 0
  },
  {
    value: 'science',
    label: '科学',
    icon: '🔬',
    type: 'system',
    pinned: false,
    count: 0
  },
  {
    value: 'history',
    label: '历史',
    icon: '📜',
    type: 'system',
    pinned: false,
    count: 0
  },
  {
    value: 'geography',
    label: '地理',
    icon: '🌏',
    type: 'system',
    pinned: false,
    count: 0
  },

  // 年级分类
  {
    value: 'elementary',
    label: '小学',
    icon: '🎒',
    type: 'system',
    pinned: false,
    count: 0
  },
  {
    value: 'middle_school',
    label: '初中',
    icon: '📚',
    type: 'system',
    pinned: false,
    count: 0
  },
  {
    value: 'high_school',
    label: '高中',
    icon: '🎓',
    type: 'system',
    pinned: false,
    count: 0
  },
  {
    value: 'university',
    label: '大学',
    icon: '🏛️',
    type: 'system',
    pinned: false,
    count: 0
  },

  // 难度等级
  {
    value: 'beginner',
    label: '入门级',
    icon: '⭐',
    type: 'system',
    pinned: false,
    count: 0
  },
  {
    value: 'intermediate',
    label: '中级',
    icon: '⭐⭐',
    type: 'system',
    pinned: false,
    count: 0
  },
  {
    value: 'advanced',
    label: '高级',
    icon: '⭐⭐⭐',
    type: 'system',
    pinned: false,
    count: 0
  },
  {
    value: 'expert',
    label: '专家级',
    icon: '💎',
    type: 'system',
    pinned: false,
    count: 0
  },

  // 特殊分类
  {
    value: 'all',
    label: '全部资源',
    icon: 'DatabaseOutlined',
    type: 'system',
    pinned: true,
    count: 0
  },
  {
    value: 'starred',
    label: '收藏资源',
    icon: 'StarOutlined',
    type: 'system',
    pinned: true,
    count: 0
  },
  {
    value: 'recent',
    label: '最近访问',
    icon: 'ClockCircleOutlined',
    type: 'system',
    pinned: true,
    count: 0
  },
  {
    value: 'shared',
    label: '共享资源',
    icon: 'ShareAltOutlined',
    type: 'system',
    pinned: true,
    count: 0
  }
];

// 模拟资源数据，用于计算分类数量
export const mockResourcesForCategories = [
  {
    id: 'res-001',
    title: '小学数学分数教学课件',
    category: 'math',
    type: 'presentations',
    grade: 'elementary',
    difficulty: 'beginner',
    starred: true,
    isRecent: true,
    isShared: true
  },
  {
    id: 'res-002',
    title: '初中语文古诗词鉴赏',
    category: 'chinese',
    type: 'documents',
    grade: 'middle_school',
    difficulty: 'intermediate',
    starred: false,
    isRecent: true,
    isShared: true
  },
  {
    id: 'res-003',
    title: '高中英语语法教学视频',
    category: 'english',
    type: 'videos',
    grade: 'high_school',
    difficulty: 'advanced',
    starred: true,
    isRecent: false,
    isShared: false
  },
  {
    id: 'res-004',
    title: '物理实验演示动画',
    category: 'science',
    type: 'videos',
    grade: 'high_school',
    difficulty: 'advanced',
    starred: false,
    isRecent: true,
    isShared: true
  },
  {
    id: 'res-005',
    title: '历史时间轴图表',
    category: 'history',
    type: 'images',
    grade: 'middle_school',
    difficulty: 'intermediate',
    starred: true,
    isRecent: false,
    isShared: true
  },
  {
    id: 'res-006',
    title: '地理地图集合',
    category: 'geography',
    type: 'images',
    grade: 'elementary',
    difficulty: 'beginner',
    starred: false,
    isRecent: true,
    isShared: false
  },
  {
    id: 'res-007',
    title: '英语听力练习音频',
    category: 'english',
    type: 'audio',
    grade: 'middle_school',
    difficulty: 'intermediate',
    starred: true,
    isRecent: false,
    isShared: true
  },
  {
    id: 'res-008',
    title: '数学公式推导文档',
    category: 'math',
    type: 'documents',
    grade: 'high_school',
    difficulty: 'expert',
    starred: false,
    isRecent: true,
    isShared: false
  },
  {
    id: 'res-009',
    title: '科学实验报告模板',
    category: 'science',
    type: 'documents',
    grade: 'university',
    difficulty: 'advanced',
    starred: true,
    isRecent: false,
    isShared: true
  },
  {
    id: 'res-010',
    title: '语文作文指导课件',
    category: 'chinese',
    type: 'presentations',
    grade: 'elementary',
    difficulty: 'beginner',
    starred: false,
    isRecent: true,
    isShared: true
  },
  {
    id: 'res-011',
    title: '历史纪录片片段',
    category: 'history',
    type: 'videos',
    grade: 'university',
    difficulty: 'expert',
    starred: true,
    isRecent: false,
    isShared: false
  },
  {
    id: 'res-012',
    title: '地理气候图解',
    category: 'geography',
    type: 'images',
    grade: 'high_school',
    difficulty: 'advanced',
    starred: false,
    isRecent: true,
    isShared: true
  },
  {
    id: 'res-013',
    title: '数学概念解释动画',
    category: 'math',
    type: 'videos',
    grade: 'middle_school',
    difficulty: 'intermediate',
    starred: true,
    isRecent: true,
    isShared: true
  },
  {
    id: 'res-014',
    title: '英语单词记忆卡片',
    category: 'english',
    type: 'images',
    grade: 'elementary',
    difficulty: 'beginner',
    starred: false,
    isRecent: false,
    isShared: true
  },
  {
    id: 'res-015',
    title: '科学探究活动指南',
    category: 'science',
    type: 'documents',
    grade: 'middle_school',
    difficulty: 'intermediate',
    starred: true,
    isRecent: true,
    isShared: false
  }
];

// 导出默认配置
export default {
  categories: resourceCategoryData,
  mockResources: mockResourcesForCategories
};