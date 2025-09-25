// 操作类型常量
export const OPERATION_TYPES = {
  AUDIO: 'audio',
  VIDEO: 'video',
  MINDMAP: 'mindmap',
  REPORT: 'report',
  PPT: 'ppt',
  WEBCODE: 'webcode',
  SCENARIO: 'scenario',
  TRAINING_PLAN: 'training-plan',
  SCHEDULE: 'schedule',
  PARTICIPANTS: 'participants',
  NOTE: 'note',
  FILE: 'file',
  TEXT: 'text',
  LINK: 'link',
  COURSE: 'course',
  STUDY_RESULT: 'study-result',
  TOOL: 'tool'
};

// 操作按钮标题映射
export const OPERATION_TITLES = {
  [OPERATION_TYPES.AUDIO]: '音频概览',
  [OPERATION_TYPES.VIDEO]: '视频概览',
  [OPERATION_TYPES.MINDMAP]: '思维导图',
  [OPERATION_TYPES.REPORT]: '分析报告',
  [OPERATION_TYPES.PPT]: 'PPT演示',
  [OPERATION_TYPES.WEBCODE]: '网页代码',
  [OPERATION_TYPES.SCENARIO]: '场景模拟',
  [OPERATION_TYPES.TRAINING_PLAN]: '培训方案',
  [OPERATION_TYPES.SCHEDULE]: '课表',
  [OPERATION_TYPES.PARTICIPANTS]: '参训人员清单',
  [OPERATION_TYPES.NOTE]: '笔记'
};

// 材料类型图标映射
export const MATERIAL_ICONS = {
  file: '📄',
  text: '📝',
  video: '🎥',
  link: '🔗',
  course: '📚',
  [OPERATION_TYPES.AUDIO]: '🎵',
  [OPERATION_TYPES.VIDEO]: '📹',
  [OPERATION_TYPES.MINDMAP]: '🧠',
  [OPERATION_TYPES.REPORT]: '📊',
  [OPERATION_TYPES.PPT]: '📽️',
  [OPERATION_TYPES.WEBCODE]: '💻',
  [OPERATION_TYPES.SCENARIO]: '🎭',
  [OPERATION_TYPES.NOTE]: '📝',
  [OPERATION_TYPES.STUDY_RESULT]: '🏆',
  [OPERATION_TYPES.TOOL]: '🛠️'
};

// 网站类型常量
export const WEBSITE_TYPES = {
  NORMAL: 'normal',
  VIDEO: 'video'
};

// 视图模式常量
export const VIEW_MODES = {
  MATERIALS: 'materials',
  VIDEO: 'video',
  WIDESCREEN_VIDEO: 'widescreen_video',
  CARD: 'card',
  MAP: 'map'
};

// 右侧面板视图常量
export const RIGHT_PANEL_VIEWS = {
  OPERATIONS: 'operations',
  NOTE_EDITOR: 'noteEditor'
};

// 直播状态常量
export const LIVE_STREAM_STATUS = {
  PENDING: 'pending',
  LIVE: 'live',
  ENDED: 'ended'
};

// 标记颜色常量
export const MARK_COLORS = {
  blue: '#1890ff',
  pink: '#eb2f96',
  yellow: '#faad14',
  gray: '#8c8c8c'
};

// 标记名称常量
export const MARK_NAMES = {
  blue: '重要',
  pink: '疑问',
  yellow: '精彩',
  gray: '备注'
};

// 标记图标常量
export const MARK_ICONS = {
  blue: '❗',
  pink: '❓',
  yellow: '⭐',
  gray: '📝'
};

// 工具分类常量
export const TOOL_CATEGORIES = {
  ALL: 'all',
  DATA_ANALYSIS: 'data_analysis',
  COLLABORATION: 'collaboration',
  LEARNING: 'learning',
  CREATION: 'creation',
  PRODUCTIVITY: 'productivity'
};

// 工具分类标签
export const TOOL_CATEGORY_LABELS = {
  [TOOL_CATEGORIES.ALL]: { label: '全部工具', icon: '🛠️' },
  [TOOL_CATEGORIES.DATA_ANALYSIS]: { label: '数据分析', icon: '📈' },
  [TOOL_CATEGORIES.COLLABORATION]: { label: '协作工具', icon: '🤝' },
  [TOOL_CATEGORIES.LEARNING]: { label: '学习工具', icon: '📚' },
  [TOOL_CATEGORIES.CREATION]: { label: '创作工具', icon: '✍️' },
  [TOOL_CATEGORIES.PRODUCTIVITY]: { label: '实用工具', icon: '⚙️' }
};

// 支持的文件类型
export const SUPPORTED_FILE_TYPES = ['.pdf', '.doc', '.docx', '.txt', '.md'];

// 快捷操作常量
export const QUICK_ACTIONS = [
  { key: 'summarize', label: '内容总结', icon: '📄' },
  { key: 'extract', label: '关键信息提取', icon: '📝' },
  { key: 'translate', label: '翻译', icon: '🔄' },
  { key: 'analyze', label: '深度分析', icon: '🤖' }
];

// 消息类型常量
export const MESSAGE_TYPES = {
  USER: 'user',
  ASSISTANT: 'assistant'
};

// 操作菜单项常量
export const MORE_MENU_ACTIONS = {
  MARK_STUDY_RESULT: 'markStudyResult',
  UNMARK_STUDY_RESULT: 'unmarkStudyResult',
  CONVERT_TO_SOURCE: 'convertToSource',
  DELETE: 'delete',
  RENAME: 'rename',
  VIEW: 'view'
};

// 时间格式正则表达式
export const TIME_REGEX = /\b(\d{1,2}):(\d{2})(?::(\d{2}))?\b/g;

// 字幕菜单项样式类名
export const SUBTITLE_MENU_ITEM_CLASS = 'subtitle-menu-item';

// 默认示例数据
export const DEFAULT_COURSE_VIDEOS = [
  { id: 101, title: '数据结构与算法基础', url: 'https://edu.example.com/course/data-structure', addTime: '2024-01-15 10:30', duration: '45分钟', instructor: '张教授', progress: 75 },
  { id: 102, title: 'React前端开发实战', url: 'https://edu.example.com/course/react-dev', addTime: '2024-01-16 14:20', duration: '60分钟', instructor: '李老师', progress: 45 },
  { id: 103, title: 'Python机器学习入门', url: 'https://edu.example.com/course/python-ml', addTime: '2024-01-17 09:15', duration: '75分钟', instructor: '王博士', progress: 90 },
  { id: 104, title: '数据库设计与优化', url: 'https://edu.example.com/course/database-design', addTime: '2024-01-18 16:45', duration: '50分钟', instructor: '陈工程师', progress: 20 },
  { id: 105, title: '云计算架构设计', url: 'https://edu.example.com/course/cloud-architecture', addTime: '2024-01-19 11:00', duration: '90分钟', instructor: '刘架构师', progress: 100 },
  { id: 106, title: '【直播课回放】深度学习实战应用', url: 'https://live.example.com/replay/deep-learning', addTime: '2024-01-20 14:30', duration: '120分钟', instructor: '赵专家', progress: 60, type: 'live_replay', liveDate: '2024-01-20', audience: 1280 },
  { id: 107, title: '【直播课预约】AI技术前沿讲座', url: 'https://live.example.com/upcoming/ai-frontier', addTime: '2024-01-21 09:00', duration: '90分钟', instructor: '孙院士', progress: 0, type: 'live_scheduled', scheduleDate: '2024-01-25 19:00', maxAudience: 2000, registered: 876 }
];

// 常见问题按钮
export const COMMON_QUESTIONS = [
  { key: 'feature', text: '川菜特色？', message: '川菜特色？' },
  { key: 'cooking', text: '火锅做法？', message: '火锅做法？' },
  { key: 'snacks', text: '小吃推荐？', message: '小吃推荐？' }
];

// 操作卡片配置
export const OPERATION_CARDS = [
  {
    key: OPERATION_TYPES.AUDIO,
    title: '音频概览',
    icon: '🎵',
    gradient: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    color: '#1565c0'
  },
  {
    key: OPERATION_TYPES.VIDEO,
    title: '视频概览',
    icon: '📹',
    gradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
    color: '#2e7d32'
  },
  {
    key: OPERATION_TYPES.MINDMAP,
    title: '思维导图',
    icon: '🧠',
    gradient: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
    color: '#c2185b'
  },
  {
    key: OPERATION_TYPES.REPORT,
    title: '报告',
    icon: '📊',
    gradient: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
    color: '#ef6c00'
  },
  {
    key: OPERATION_TYPES.PPT,
    title: 'PPT概览',
    icon: '📽️',
    gradient: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
    color: '#d32f2f'
  },
  {
    key: OPERATION_TYPES.SCENARIO,
    title: '场景模拟',
    icon: '🎭',
    gradient: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
    color: '#7b1fa2'
  },
  {
    key: 'addTool',
    title: '添加工具',
    icon: '🛠️',
    gradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
    color: '#2e7d32'
  }
];

// 报告下拉菜单项
export const REPORT_DROPDOWN_ITEMS = [
  {
    key: 'brief',
    label: '简报文档',
    icon: '📄'
  },
  {
    key: 'guide',
    label: '学习指南',
    icon: '📖'
  },
  {
    key: 'faq',
    label: '常见问题解答',
    icon: '❓'
  },
  {
    key: 'timeline',
    label: '时间轴',
    icon: '⏰'
  }
];