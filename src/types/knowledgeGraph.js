// 知识图谱数据结构定义

// 知识图谱分类枚举
export const KNOWLEDGE_GRAPH_CATEGORIES = {
  EDUCATION: {
    name: '教育学科',
    color: '#667eea',
    icon: '🎓'
  },
  TECHNOLOGY: {
    name: '技术领域',
    color: '#4facfe',
    icon: '💻'
  },
  SCIENCE: {
    name: '科学研究',
    color: '#f093fb',
    icon: '🔬'
  },
  BUSINESS: {
    name: '商业管理',
    color: '#a8edea',
    icon: '💼'
  },
  CULTURE: {
    name: '文化艺术',
    color: '#ffd89b',
    icon: '🎨'
  }
};

// 知识节点类
export class KnowledgeNode {
  constructor({
    id,
    name,
    description,
    category,
    position = { x: 0, y: 0 },
    color = '#667eea',
    icon = '📝',
    parentId = null,
    children = [],
    relatedResources = [],
    keywords = [],
    importance = 'medium', // low, medium, high
    complexity = 'medium' // simple, medium, complex
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.position = position;
    this.color = color;
    this.icon = icon;
    this.parentId = parentId;
    this.children = children;
    this.relatedResources = relatedResources;
    this.keywords = keywords;
    this.importance = importance;
    this.complexity = complexity;
  }
}

// 知识资源类
export class KnowledgeResource {
  constructor({
    id,
    title,
    description,
    type = 'document', // document, video, link, course
    url = '',
    thumbnail = '',
    author = '',
    publishDate = null,
    tags = [],
    nodeIds = []
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.type = type;
    this.url = url;
    this.thumbnail = thumbnail;
    this.author = author;
    this.publishDate = publishDate;
    this.tags = tags;
    this.nodeIds = nodeIds;
  }
}

// 知识图谱类
export class KnowledgeGraph {
  constructor({
    id,
    name,
    description,
    nodes = [],
    connections = [],
    metadata = {}
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.nodes = nodes;
    this.connections = connections;
    this.metadata = metadata;
  }

  // 添加节点
  addNode(node) {
    this.nodes.push(node);
  }

  // 添加连接
  addConnection(from, to, type = 'relates', label = '') {
    this.connections.push({
      id: `${from}-${to}`,
      from,
      to,
      type,
      label
    });
  }

  // 查找节点
  findNode(id) {
    return this.nodes.find(node => node.id === id);
  }

  // 获取节点的相关资源
  getNodeResources(nodeId) {
    const node = this.findNode(nodeId);
    return node ? node.relatedResources : [];
  }
}