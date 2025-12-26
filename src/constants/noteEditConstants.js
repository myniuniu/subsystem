// 操作类型常量
export const OPERATION_TYPES = {
  KNOWLEDGE_GRAPH: 'knowledge-graph',
  AUDIO: 'audio',
  VIDEO: 'video',
  MINDMAP: 'mindmap',
  REPORT: 'report',
  PPT: 'ppt',
  WEBCODE: 'webcode',
  SCENARIO: 'scenario',
  TRAINING_PLAN: 'training-plan',
  PERSONAL_LEARNING: 'personal-learning',
  SCHEDULE: 'schedule',
  PARTICIPANTS: 'participants',
  NOTE: 'note',
  FILE: 'file',
  TEXT: 'text',
  LINK: 'link',
  COURSE: 'course',
  STUDY_RESULT: 'study-result',
  TOOL: 'tool',
  QUESTION: 'question',
  EXAM_PAPER: 'exam-paper',
  LEARNING_PLAN: 'learning-plan',
  GRADING: 'grading',
  CLASSROOM_EVALUATION: 'classroom-evaluation',
  TRAINING_DASHBOARD: 'training-dashboard',
  WORKSHOP_DASHBOARD: 'workshop-dashboard',
  WORKSHOP_REPORT: 'workshop-report',
  CLASSROOM_BEHAVIOR_ANALYSIS: 'classroom-behavior-analysis',
  SITE_ANALYSIS: 'site-analysis',
  SUPERVISION_REPORT: 'supervision-report',
  MEMORY_CARDS: 'memory-cards',
  QUIZ: 'quiz'
};

// 操作按钮标题映射
export const OPERATION_TITLES = {
  [OPERATION_TYPES.AUDIO]: '音频播客',
  [OPERATION_TYPES.VIDEO]: '视频概览',
  [OPERATION_TYPES.MINDMAP]: '思维导图',
  [OPERATION_TYPES.REPORT]: '分析报告',
  [OPERATION_TYPES.PPT]: 'PPT演示',
  [OPERATION_TYPES.WEBCODE]: '网页代码',
  [OPERATION_TYPES.SCENARIO]: '场景模拟',
  [OPERATION_TYPES.TRAINING_PLAN]: '培训方案',
  [OPERATION_TYPES.SCHEDULE]: '课表',
  [OPERATION_TYPES.PARTICIPANTS]: '参训人员清单',
  [OPERATION_TYPES.NOTE]: '笔记',
  [OPERATION_TYPES.QUESTION]: '试题',
  [OPERATION_TYPES.EXAM_PAPER]: '试卷设计',
  [OPERATION_TYPES.LEARNING_PLAN]: '学习计划',
  [OPERATION_TYPES.GRADING]: '阅卷工具',
  [OPERATION_TYPES.CLASSROOM_EVALUATION]: '课堂评价',
  [OPERATION_TYPES.TRAINING_DASHBOARD]: '培训报表',
  [OPERATION_TYPES.WORKSHOP_DASHBOARD]: '工作坊报表',
  [OPERATION_TYPES.WORKSHOP_REPORT]: '工作坊报告',
  [OPERATION_TYPES.CLASSROOM_BEHAVIOR_ANALYSIS]: '课堂行为分析'
  , [OPERATION_TYPES.SITE_ANALYSIS]: '现场分析'
  , [OPERATION_TYPES.SUPERVISION_REPORT]: '督学报告'
  , [OPERATION_TYPES.MEMORY_CARDS]: '记忆卡片'
  , [OPERATION_TYPES.QUIZ]: '测验'
};

// 材料类型图标映射
export const MATERIAL_ICONS = {
  file: '📄',
  text: '📝',
  video: '🎥',
  link: '🔗',
  course: '📚',
  // 智能评阅操作记录图标
  'smart-evaluation': '评',
  [OPERATION_TYPES.KNOWLEDGE_GRAPH]: '🧠',
  [OPERATION_TYPES.AUDIO]: '音',
  [OPERATION_TYPES.VIDEO]: '视',
  [OPERATION_TYPES.MINDMAP]: '思',
  [OPERATION_TYPES.REPORT]: '报',
  [OPERATION_TYPES.PPT]: 'PPT',
  [OPERATION_TYPES.WEBCODE]: '💻',
  [OPERATION_TYPES.SCENARIO]: '场',
  [OPERATION_TYPES.NOTE]: '笔',
  [OPERATION_TYPES.STUDY_RESULT]: '🏆',
  [OPERATION_TYPES.TOOL]: '🛠️',
  [OPERATION_TYPES.QUESTION]: '试',
  [OPERATION_TYPES.EXAM_PAPER]: '卷',
  [OPERATION_TYPES.LEARNING_PLAN]: '计',
  [OPERATION_TYPES.GRADING]: '阅',
  [OPERATION_TYPES.CLASSROOM_EVALUATION]: '评',
  [OPERATION_TYPES.TRAINING_DASHBOARD]: '报',
  [OPERATION_TYPES.WORKSHOP_DASHBOARD]: '报',
  [OPERATION_TYPES.WORKSHOP_REPORT]: '报',
  [OPERATION_TYPES.CLASSROOM_BEHAVIOR_ANALYSIS]: '行'
  , [OPERATION_TYPES.SUPERVISION_REPORT]: '报'
  , [OPERATION_TYPES.MEMORY_CARDS]: '卡'
  , [OPERATION_TYPES.QUIZ]: '测'
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
  DOCUMENT: 'document',
  DOCUMENT_FULLSCREEN: 'document_fullscreen',
  WIDESCREEN_VIDEO: 'widescreen_video',
  CARD: 'card',
  MAP: 'map',
  SCENARIO_VIEW: 'scenario_view',
  LEARNING_PLAN_CALENDAR: 'learning_plan_calendar',
  LEARNING_PLAN_THREE_COLUMN: 'learning_plan_three_column',
  CLASSROOM_EVALUATION_FULLSCREEN: 'classroom_evaluation_fullscreen',
  TRAINING_PLAN_FULLSCREEN: 'training_plan_fullscreen',
  TRAINING_DASHBOARD_FULLSCREEN: 'training_dashboard_fullscreen',
  EPBL_FLOWCHART_FULLSCREEN: 'epbl_flowchart_fullscreen',
  TRAINING_PLAN_THREE_COLUMN: 'training_plan_three_column',
  LEARNING_PLAN_FULLSCREEN: 'learning_plan_fullscreen',
  CLASSROOM_BEHAVIOR_ANALYSIS_FULLSCREEN: 'classroom_behavior_analysis_fullscreen',
  // 研修成果详情（左侧面板内联显示）
  ACHIEVEMENT_DETAIL: 'achievement_detail',
  // 研修成果评阅（三栏布局显示）
  ACHIEVEMENT_DETAIL_THREE_COLUMN: 'achievement_detail_three_column',
  // 督学任务编辑器全屏
  SUPERVISION_TASK_FULLSCREEN: 'supervision_task_fullscreen',
  SUPERVISION_EXECUTION_FULLSCREEN: 'supervision_execution_fullscreen'
};

// 新增：心理健康辅导场景训练页（全屏）
// 用于 MaterialManagement 中点击“情景模拟：心理健康辅导场景训练”记录时的跳转
export const MENTAL_HEALTH_VIEW_MODES = {
  MENTAL_HEALTH_COACHING_FULLSCREEN: 'mental_health_coaching_fullscreen'
};

// 新增：考试评阅占位页（全屏，占据 NoteEditPage 左中右区域）
export const EXAM_VIEW_MODES = {
  EXAM_REVIEW_FULLSCREEN: 'exam_review_fullscreen',
  EXAM_FORM_FULLSCREEN: 'exam_form_fullscreen'
};

// 右侧面板视图常量
export const RIGHT_PANEL_VIEWS = {
  OPERATIONS: 'operations',
  NOTE_EDITOR: 'noteEditor',
  QUESTION_VIEWER: 'questionViewer',
  LEARNING_PLAN_VIEWER: 'learningPlanViewer',
  GRADING_VIEWER: 'gradingViewer',
  CLASSROOM_EVALUATION_VIEWER: 'classroomEvaluationViewer',
  TRAINING_PLAN_VIEWER: 'training_plan_viewer',
  TRAINING_REPORT_VIEWER: 'training_report_viewer',
  TRAINING_DASHBOARD_VIEWER: 'training_dashboard_viewer',
  TRAINING_SETTINGS_VIEWER: 'training_settings_viewer',
  CLASSROOM_BEHAVIOR_ANALYSIS_VIEWER: 'classroomBehaviorAnalysisViewer',
  VIDEO_PLAYER: 'video_player',
  LIVE_PLAYER: 'live_player',
  EXAM_FORM_VIEWER: 'exam_form_viewer',
  // 新增：课程选择视图（占用中间 + 右侧）
  COURSE_SELECTION_VIEWER: 'course_selection_viewer',
  MEMORY_CARD_VIEWER: 'memory_card_viewer',
  QUIZ_VIEWER: 'quiz_viewer',
  REPORT_VIEWER: 'report_viewer'
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
  RENAME: 'rename',
  CONVERT_TO_SOURCE: 'convertToSource',
  LINK_SOURCE: 'linkSource',
  OPEN_IN_NEW_WINDOW: 'openInNewWindow',
  MARK_STUDY_RESULT: 'markStudyResult',
  UNMARK_STUDY_RESULT: 'unmarkStudyResult',
  COPY_TO: 'copyTo',
  MOVE_TO: 'moveTo',
  DELETE: 'delete',
  OPEN_TRAINING_SETTINGS: 'openTrainingSettings'
};

// 时间格式正则表达式
export const TIME_REGEX = /\b(\d{1,2}):(\d{2})(?::(\d{2}))?\b/g;

// 字幕菜单项样式类名
export const SUBTITLE_MENU_ITEM_CLASS = 'subtitle-menu-item';

// 默认示例数据
export const DEFAULT_COURSE_VIDEOS = [
  { 
    id: 101, 
    title: '数据结构与算法基础', 
    courseId: 201,
    courseTitle: '数据结构与算法基础',
    url: 'https://edu.example.com/course/data-structure', 
    addTime: '2024-01-15 10:30', 
    duration: '45分钟', 
    instructor: '张教授', 
    progress: 75, 
    plannedStartTime: '今天 14:00',
    videoInfo: {
      type: 'single_video',
      progress: 75,
      duration: 2700, // 45分钟 = 2700秒
      instructor: '张教授'
    }
  },
  { 
    id: 108, 
    title: '数据结构与算法基础（进阶）', 
    courseId: 201,
    courseTitle: '数据结构与算法基础',
    url: 'https://edu.example.com/course/data-structure-advanced', 
    addTime: '2024-02-01 10:00', 
    duration: '40分钟', 
    instructor: '张教授', 
    progress: 30, 
    videoInfo: {
      type: 'single_video',
      progress: 30,
      duration: 2400,
      instructor: '张教授'
    }
  },
  { 
    id: 102, 
    title: 'React前端开发实战', 
    courseId: 202,
    courseTitle: 'React前端开发实战',
    url: 'https://edu.example.com/course/react-dev', 
    addTime: '2024-01-16 14:20', 
    duration: '60分钟', 
    instructor: '李老师', 
    progress: 45, 
    plannedStartTime: '明天 09:30',
    videoInfo: {
      type: 'multi_video',
      totalVideos: 4,
      totalDuration: 3600, // 60分钟
      watchedDuration: 1620, // 45%进度
      overallProgress: 45
    }
  },
  { 
    id: 103, 
    title: 'Python机器学习入门', 
    courseId: 203,
    courseTitle: 'Python机器学习入门',
    url: 'https://edu.example.com/course/python-ml', 
    addTime: '2024-01-17 09:15', 
    duration: '75分钟', 
    instructor: '王博士', 
    progress: 90,
    videoInfo: {
      type: 'multi_video',
      totalVideos: 5,
      totalDuration: 4500, // 75分钟
      watchedDuration: 4050, // 90%进度
      overallProgress: 90
    }
  },
  { 
    id: 104, 
    title: '数据库设计与优化', 
    courseId: 204,
    courseTitle: '数据库设计与优化',
    url: 'https://edu.example.com/course/database-design', 
    addTime: '2024-01-18 16:45', 
    duration: '50分钟', 
    instructor: '陈工程师', 
    progress: 20, 
    plannedStartTime: '1月20日 10:00',
    videoInfo: {
      type: 'single_video',
      progress: 20,
      duration: 3000, // 50分钟
      instructor: '陈工程师'
    }
  },
  { 
    id: 109, 
    title: '数据库索引与查询优化', 
    courseId: 204,
    courseTitle: '数据库设计与优化',
    url: 'https://edu.example.com/course/database-optimization-advanced', 
    addTime: '2024-02-02 09:30', 
    duration: '55分钟', 
    instructor: '陈工程师', 
    progress: 10, 
    videoInfo: {
      type: 'single_video',
      progress: 10,
      duration: 3300,
      instructor: '陈工程师'
    }
  },
  { 
    id: 105, 
    title: '云计算架构设计', 
    courseId: 205,
    courseTitle: '云计算架构设计',
    url: 'https://edu.example.com/course/cloud-architecture', 
    addTime: '2024-01-19 11:00', 
    duration: '90分钟', 
    instructor: '刘架构师', 
    progress: 100,
    videoInfo: {
      type: 'multi_video',
      totalVideos: 6,
      totalDuration: 5400, // 90分钟
      watchedDuration: 5400, // 100%进度
      overallProgress: 100
    }
  },
  { 
    id: 106, 
    title: '【直播课回放】深度学习实战应用', 
    courseId: 206,
    courseTitle: '深度学习实战应用',
    url: 'https://live.example.com/replay/deep-learning', 
    addTime: '2024-01-20 14:30', 
    duration: '120分钟', 
    instructor: '赵专家', 
    progress: 60, 
    type: 'live_replay', 
    liveDate: '2024-01-20', 
    audience: 1280, 
    plannedStartTime: '周末 15:00',
    videoInfo: {
      type: 'single_video',
      progress: 60,
      duration: 7200, // 120分钟
      instructor: '赵专家'
    }
  },
  { 
    id: 107, 
    title: '【直播课预约】AI技术前沿讲座', 
    courseId: 207,
    courseTitle: 'AI技术前沿讲座',
    url: 'https://live.example.com/upcoming/ai-frontier', 
    addTime: '2024-01-21 09:00', 
    duration: '90分钟', 
    instructor: '孙院士', 
    progress: 0, 
    type: 'live_scheduled', 
    scheduleDate: '2024-01-25 19:00', 
    maxAudience: 2000, 
    registered: 876,
    videoInfo: {
      type: 'multi_video',
      totalVideos: 3,
      totalDuration: 5400, // 90分钟
      watchedDuration: 0, // 0%进度
      overallProgress: 0
    }
  }
];

// 常见问题按钮
export const COMMON_QUESTIONS = [
  { key: 'ds_basic', text: '常见数据结构有哪些？', message: '常见数据结构有哪些？' },
  { key: 'algo_complexity', text: '算法时间复杂度怎么计算？', message: '算法时间复杂度怎么计算？' },
  { key: 'react_state', text: 'React 状态管理怎么做？', message: 'React 状态管理怎么做？' }
];

// 新增：按分类的常见问题映射（保持向后兼容）
export const CATEGORY_COMMON_QUESTIONS = {
  teaching_research_office: [
    { key: 'pe_goal', text: '游戏化教学的核心目标是什么？', message: '游戏化教学的核心目标是什么？' },
    { key: 'low_grade_design', text: '如何设计适合低年级的体育游戏？', message: '如何设计适合低年级的体育游戏？' },
    { key: 'effect_evaluation', text: '如何评估游戏化教学效果？', message: '如何评估游戏化教学效果？' }
  ],
  training_needs_management: [
    { key: 'mh_symptoms', text: '教师常见心理困扰有哪些课堂表现？', message: '教师常见心理困扰有哪些课堂表现？' },
    { key: 'mh_modules', text: '如何设计教师心理健康培训的核心模块？', message: '如何设计教师心理健康培训的核心模块？' },
    { key: 'mh_stress_training', text: '压力管理与情绪调节的训练如何开展？', message: '压力管理与情绪调节的训练如何开展？' },
    { key: 'mh_crisis_referral', text: '如何建立校内危机识别与转介流程？', message: '如何建立校内危机识别与转介流程？' },
    { key: 'mh_evaluation', text: '培训效果如何评估与持续跟踪？', message: '培训效果如何评估与持续跟踪？' }
  ],
  organizational_training: [
    { key: 'mh_focus', text: '组织层面如何推动教师心理健康培训？', message: '组织层面如何推动教师心理健康培训？' },
    { key: 'mh_support', text: '如何建立同伴支持与校内心理支持体系？', message: '如何建立同伴支持与校内心理支持体系？' },
    { key: 'mh_policy', text: '心理危机应对与政策流程如何落实？', message: '心理危机应对与政策流程如何落实？' }
  ],
  supervision: [
    { key: 'sv_checklist', text: '如何制定开学季安全专项督导清单？', message: '如何制定开学季安全专项督导清单（消防、食堂、安保）？' },
    { key: 'sv_evidence', text: '督导取证材料如何规范整理留痕？', message: '督导取证材料如何规范整理（照片、台账、整改单）并留痕？' },
    { key: 'sv_followup', text: '整改跟踪与复查要怎么做？', message: '整改跟踪与复查要怎么做（责任人、完成时限、复查记录）？' }
  ],
  youth_aigc_workshop: [
    { key: 'aigc_painting_practice', text: '如何为青少年设计AI绘画练习？', message: '如何为青少年设计安全且有趣的AI绘画练习？' },
    { key: 'aigc_music_workflow', text: 'AI音乐创作课堂怎么组织？', message: 'AI音乐创作的课堂活动流程怎么组织更高效？' }
  ],
  default: COMMON_QUESTIONS
};

// AI工具分类常量
export const AI_TOOL_CATEGORIES = {
  ALL: 'all',
  WRITING: 'writing',
  ANALYSIS: 'analysis',
  TEACHING: 'teaching',
  CREATIVE: 'creative',
  PRODUCTIVITY: 'productivity',
  RESEARCH: 'research'
};

// AI工具分类标签
export const AI_TOOL_CATEGORY_LABELS = {
  [AI_TOOL_CATEGORIES.ALL]: { label: '全部工具', icon: '🤖', color: '#1890ff' },
  [AI_TOOL_CATEGORIES.WRITING]: { label: '写作助手', icon: '✍️', color: '#52c41a' },
  [AI_TOOL_CATEGORIES.ANALYSIS]: { label: '数据分析', icon: '📊', color: '#722ed1' },
  [AI_TOOL_CATEGORIES.TEACHING]: { label: '教学辅助', icon: '🎓', color: '#fa8c16' },
  [AI_TOOL_CATEGORIES.CREATIVE]: { label: '创意工具', icon: '🎨', color: '#eb2f96' },
  [AI_TOOL_CATEGORIES.PRODUCTIVITY]: { label: '效率工具', icon: '⚡', color: '#13c2c2' },
  [AI_TOOL_CATEGORIES.RESEARCH]: { label: '研究工具', icon: '🔬', color: '#f5222d' }
};

// AI工具状态常量
export const AI_TOOL_STATUS = {
  ACTIVE: 'active',
  BETA: 'beta',
  NEW: 'new',
  DEPRECATED: 'deprecated'
};

// AI工具评级常量
export const AI_TOOL_RATINGS = {
  EXCELLENT: 5,
  GOOD: 4,
  AVERAGE: 3,
  FAIR: 2,
  POOR: 1
};

// 操作卡片配置
export const OPERATION_CARDS = [
  {
    key: OPERATION_TYPES.KNOWLEDGE_GRAPH,
    title: '知识图谱',
    icon: '知',
    gradient: 'linear-gradient(135deg, #e8f4f8 0%, #d1ecf1 100%)',
    color: '#0369a1'
  },
  {
    key: OPERATION_TYPES.PERSONAL_LEARNING,
    title: '自主选学',
    icon: '自',
    gradient: 'linear-gradient(135deg, #eef7ff 0%, #d9ecff 100%)',
    color: '#1677ff'
  },
  {
    key: OPERATION_TYPES.AUDIO,
    title: '音频播客',
    icon: '音',
    gradient: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    color: '#1565c0'
  },
  {
    key: OPERATION_TYPES.VIDEO,
    title: '视频概览',
    icon: '视',
    gradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
    color: '#2e7d32'
  },
  {
    key: OPERATION_TYPES.MINDMAP,
    title: '思维导图',
    icon: '思',
    gradient: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
    color: '#c2185b'
  },
  {
    key: OPERATION_TYPES.REPORT,
    title: '报告',
    icon: '报',
    gradient: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
    color: '#ef6c00'
  },
  {
    key: OPERATION_TYPES.PPT,
    title: 'PPT概览',
    icon: 'PPT',
    gradient: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
    color: '#d32f2f'
  },
  {
    key: OPERATION_TYPES.SCENARIO,
    title: '场景模拟',
    icon: '场',
    gradient: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
    color: '#7b1fa2'
  },
  {
    key: OPERATION_TYPES.CLASSROOM_BEHAVIOR_ANALYSIS,
    title: '课堂行为分析',
    icon: '行',
    gradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    color: '#1d4ed8'
  },
  {
    key: OPERATION_TYPES.QUESTION,
    title: '试题',
    icon: '题',
    gradient: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
    color: '#00695c'
  },
  {
    key: OPERATION_TYPES.LEARNING_PLAN,
    title: '学习计划',
    icon: '计',
    gradient: 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)',
    color: '#1890ff'
  },
  {
    key: OPERATION_TYPES.GRADING,
    title: '阅卷工具',
    icon: '阅',
    gradient: 'linear-gradient(135deg, #fff0f6 0%, #ffd6e7 100%)',
    color: '#c41d7f'
  },
  {
    key: OPERATION_TYPES.CLASSROOM_EVALUATION,
    title: '课堂评价',
    icon: '评',
    gradient: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
    color: '#389e0d'
  },
  {
    key: OPERATION_TYPES.EXAM_PAPER,
    title: '试卷设计',
    icon: '卷',
    gradient: 'linear-gradient(135deg, #fdf8e1 0%, #f9e79f 100%)',
    color: '#b7950b'
  },
  {
    key: OPERATION_TYPES.TRAINING_PLAN,
    title: '培训方案',
    icon: '培',
    gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
    color: '#0958d9'
  },
  {
    key: OPERATION_TYPES.SCHEDULE,
    title: '课表',
    icon: '课',
    gradient: 'linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%)',
    color: '#2f54eb'
  },
  {
    key: 'training-report',
    title: '培训报告',
    icon: '训',
    gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
    color: '#d46b08'
  },
  {
    key: OPERATION_TYPES.TRAINING_DASHBOARD,
    title: '培训报表',
    icon: '报',
    gradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    color: '#0369a1'
  },
  {
    key: OPERATION_TYPES.SITE_ANALYSIS,
    title: '现场分析',
    icon: '现',
    gradient: 'linear-gradient(135deg, #e8f5fe 0%, #c7e9ff 100%)',
    color: '#1d4ed8'
  },
  {
    key: OPERATION_TYPES.SUPERVISION_REPORT,
    title: '督学报告',
    icon: '报',
    gradient: 'linear-gradient(135deg, #f5f7ff 0%, #e6ebff 100%)',
    color: '#2f54eb'
  },
  // 新增：组织培训专用 - 记忆卡片 / 测验
  {
    key: OPERATION_TYPES.MEMORY_CARDS,
    title: '记忆卡片',
    icon: '卡',
    gradient: 'linear-gradient(135deg, #fff1f0 0%, #ffd6d5 100%)',
    color: '#a8071a'
  },
  {
    key: OPERATION_TYPES.QUIZ,
    title: '测验',
    icon: '测',
    gradient: 'linear-gradient(135deg, #e6f7ff 0%, #c9ebff 100%)',
    color: '#096dd9'
  },
  // 新增：E-PBL策划卡片
  {
    key: 'e-pbl-planning',
    title: 'E-PBL教学设计',
    icon: '策',
    gradient: 'linear-gradient(135deg, #fffbe6 0%, #ffe58f 100%)',
    color: '#faad14'
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
