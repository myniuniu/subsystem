// 能力模型数据结构和分类体系
// 用于地图模式下的思维导图展示

/**
 * 能力分类枚举
 */
export const CapabilityCategory = {
  COGNITIVE: 'cognitive',           // 认知能力
  EMOTIONAL: 'emotional',          // 情感能力
  SOCIAL: 'social',               // 社交能力
  PRACTICAL: 'practical',         // 实践能力
  CREATIVE: 'creative',           // 创造能力
  CRITICAL_THINKING: 'critical_thinking', // 批判性思维
  COMMUNICATION: 'communication',  // 沟通能力
  LEADERSHIP: 'leadership'        // 领导能力
};

/**
 * 能力等级枚举
 */
export const CapabilityLevel = {
  BEGINNER: 'beginner',     // 初学者
  INTERMEDIATE: 'intermediate', // 中级
  ADVANCED: 'advanced',     // 高级
  EXPERT: 'expert'         // 专家
};

/**
 * 能力节点类
 */
export class CapabilityNode {
  constructor({
    id = '',
    name = '',
    description = '',
    category = CapabilityCategory.COGNITIVE,
    level = CapabilityLevel.BEGINNER,
    parentId = null,
    children = [],
    relatedVideos = [],
    keywords = [],
    weight = 1,
    position = { x: 0, y: 0 },
    color = '#667eea',
    icon = '🎯'
  } = {}) {
    this.id = id;                    // 节点ID
    this.name = name;                // 能力名称
    this.description = description;   // 能力描述
    this.category = category;        // 能力分类
    this.level = level;             // 能力等级
    this.parentId = parentId;       // 父节点ID
    this.children = children;       // 子节点列表
    this.relatedVideos = relatedVideos; // 关联的课程视频
    this.keywords = keywords;       // 关键词
    this.weight = weight;           // 权重
    this.position = position;       // 在思维导图中的位置
    this.color = color;            // 节点颜色
    this.icon = icon;              // 节点图标
  }
}

/**
 * 课程视频信息类
 */
export class CourseVideo {
  constructor({
    id = '',
    title = '',
    description = '',
    duration = '',
    thumbnail = '',
    url = '',
    author = '',
    difficulty = CapabilityLevel.BEGINNER,
    tags = [],
    capabilityIds = []
  } = {}) {
    this.id = id;                   // 视频ID
    this.title = title;             // 视频标题
    this.description = description;  // 视频描述
    this.duration = duration;       // 视频时长
    this.thumbnail = thumbnail;     // 缩略图
    this.url = url;                // 视频链接
    this.author = author;          // 讲师
    this.difficulty = difficulty;   // 难度等级
    this.tags = tags;              // 标签
    this.capabilityIds = capabilityIds; // 关联的能力ID列表
  }
}

/**
 * 能力地图类
 */
export class CapabilityMap {
  constructor({
    id = '',
    name = '',
    description = '',
    nodes = [],
    connections = [],
    metadata = {}
  } = {}) {
    this.id = id;                   // 地图ID
    this.name = name;               // 地图名称
    this.description = description;  // 地图描述
    this.nodes = nodes;             // 能力节点列表
    this.connections = connections;  // 节点连接关系
    this.metadata = metadata;       // 元数据
  }

  // 添加节点
  addNode(node) {
    if (!(node instanceof CapabilityNode)) {
      throw new Error('节点必须是 CapabilityNode 实例');
    }
    this.nodes.push(node);
  }

  // 删除节点
  removeNode(nodeId) {
    this.nodes = this.nodes.filter(node => node.id !== nodeId);
    this.connections = this.connections.filter(
      conn => conn.from !== nodeId && conn.to !== nodeId
    );
  }

  // 添加连接
  addConnection(from, to, type = 'dependency') {
    this.connections.push({
      id: `${from}-${to}`,
      from,
      to,
      type
    });
  }

  // 获取节点的子节点
  getChildNodes(nodeId) {
    return this.nodes.filter(node => node.parentId === nodeId);
  }

  // 获取根节点
  getRootNodes() {
    return this.nodes.filter(node => !node.parentId);
  }

  // 根据分类获取节点
  getNodesByCategory(category) {
    return this.nodes.filter(node => node.category === category);
  }
}

// 预定义的能力分类配置
export const CAPABILITY_CATEGORIES = {
  [CapabilityCategory.COGNITIVE]: {
    name: '认知能力',
    description: '学习、记忆、理解和应用知识的能力',
    color: '#667eea',
    icon: '🧠'
  },
  [CapabilityCategory.EMOTIONAL]: {
    name: '情感能力',
    description: '理解和管理情绪，与他人建立情感连接的能力',
    color: '#f093fb',
    icon: '❤️'
  },
  [CapabilityCategory.SOCIAL]: {
    name: '社交能力',
    description: '与他人有效互动、合作和建立关系的能力',
    color: '#4facfe',
    icon: '👥'
  },
  [CapabilityCategory.PRACTICAL]: {
    name: '实践能力',
    description: '应用知识解决实际问题的能力',
    color: '#43e97b',
    icon: '🔧'
  },
  [CapabilityCategory.CREATIVE]: {
    name: '创造能力',
    description: '产生新想法、创新解决方案的能力',
    color: '#fa709a',
    icon: '🎨'
  },
  [CapabilityCategory.CRITICAL_THINKING]: {
    name: '批判性思维',
    description: '分析、评估和合理判断的能力',
    color: '#ffecd2',
    icon: '🤔'
  },
  [CapabilityCategory.COMMUNICATION]: {
    name: '沟通能力',
    description: '有效表达和理解信息的能力',
    color: '#a8edea',
    icon: '💬'
  },
  [CapabilityCategory.LEADERSHIP]: {
    name: '领导能力',
    description: '影响、激励和指导他人的能力',
    color: '#fed6e3',
    icon: '👑'
  }
};

// 能力等级配置
export const CAPABILITY_LEVELS = {
  [CapabilityLevel.BEGINNER]: {
    name: '初学者',
    description: '刚开始学习该能力',
    color: '#52c41a',
    order: 1
  },
  [CapabilityLevel.INTERMEDIATE]: {
    name: '中级',
    description: '具有一定的能力基础',
    color: '#faad14',
    order: 2
  },
  [CapabilityLevel.ADVANCED]: {
    name: '高级',
    description: '能力较为熟练',
    color: '#f5222d',
    order: 3
  },
  [CapabilityLevel.EXPERT]: {
    name: '专家',
    description: '在该能力领域具有专业水平',
    color: '#722ed1',
    order: 4
  }
};