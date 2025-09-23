// 组织人员树数据模型定义
// 定义人员标注的树状结构和相关类型

/**
 * 人员类型枚举
 */
export const PersonnelType = {
  TEACHER: 'teacher',       // 教师
  STUDENT: 'student',       // 学生
  ADMIN: 'admin',          // 管理员
  STAFF: 'staff',          // 职工
  GUEST: 'guest',          // 访客
  EXTERNAL: 'external'     // 外部人员
};

/**
 * 标注状态枚举
 */
export const AnnotationStatus = {
  PENDING: 'pending',       // 待标注
  IN_PROGRESS: 'in_progress', // 标注中
  COMPLETED: 'completed',   // 已完成
  REVIEWED: 'reviewed',     // 已审核
  REJECTED: 'rejected'      // 已拒绝
};

/**
 * 树节点类型枚举
 */
export const TreeNodeType = {
  ROOT: 'root',             // 根节点
  CATEGORY: 'category',     // 分类节点
  SUBCATEGORY: 'subcategory', // 子分类节点
  PERSONNEL: 'personnel',   // 人员节点
  TAG: 'tag',              // 标签节点
  ANNOTATION: 'annotation'  // 标注节点
};

/**
 * 树状节点基础类
 */
export class TreeNode {
  constructor({
    id = '',
    name = '',
    type = TreeNodeType.CATEGORY,
    parentId = null,
    children = [],
    level = 0,
    path = [],
    isExpanded = false,
    isSelected = false,
    isVisible = true,
    metadata = {},
    createTime = new Date().toISOString(),
    updateTime = new Date().toISOString()
  } = {}) {
    this.id = id;                     // 节点ID
    this.name = name;                 // 节点名称
    this.type = type;                 // 节点类型
    this.parentId = parentId;         // 父节点ID
    this.children = children;         // 子节点列表
    this.level = level;               // 层级深度
    this.path = path;                 // 路径数组
    this.isExpanded = isExpanded;     // 是否展开
    this.isSelected = isSelected;     // 是否选中
    this.isVisible = isVisible;       // 是否可见
    this.metadata = metadata;         // 元数据
    this.createTime = createTime;     // 创建时间
    this.updateTime = updateTime;     // 更新时间
  }

  // 添加子节点
  addChild(child) {
    if (child instanceof TreeNode) {
      child.parentId = this.id;
      child.level = this.level + 1;
      child.path = [...this.path, this.id];
      this.children.push(child);
      this.updateTime = new Date().toISOString();
    }
  }

  // 移除子节点
  removeChild(childId) {
    this.children = this.children.filter(child => child.id !== childId);
    this.updateTime = new Date().toISOString();
  }

  // 查找子节点
  findChild(childId) {
    return this.children.find(child => child.id === childId);
  }

  // 获取所有后代节点
  getAllDescendants() {
    let descendants = [];
    for (const child of this.children) {
      descendants.push(child);
      descendants = descendants.concat(child.getAllDescendants());
    }
    return descendants;
  }

  // 获取节点路径字符串
  getPathString() {
    return this.path.concat(this.id).join(' > ');
  }

  // 切换展开状态
  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.updateTime = new Date().toISOString();
  }

  // 设置选中状态
  setSelected(selected) {
    this.isSelected = selected;
    this.updateTime = new Date().toISOString();
  }
}

/**
 * 资源标注节点类
 */
export class ResourceAnnotationNode extends TreeNode {
  constructor({
    resourceId = '',
    sourceType = ResourceSourceType.INTERNAL,
    sourceUrl = '',
    sourceName = '',
    annotationStatus = AnnotationStatus.PENDING,
    tags = [],
    annotations = [],
    confidence = 1.0,
    quality = 1.0,
    relevance = 1.0,
    annotatorId = '',
    reviewerId = '',
    reviewTime = null,
    reviewComments = '',
    ...baseProps
  } = {}) {
    super({ ...baseProps, type: TreeNodeType.RESOURCE });
    
    this.resourceId = resourceId;           // 关联的资源ID
    this.sourceType = sourceType;           // 来源类型
    this.sourceUrl = sourceUrl;             // 来源URL
    this.sourceName = sourceName;           // 来源名称
    this.annotationStatus = annotationStatus; // 标注状态
    this.tags = tags;                       // 标签列表
    this.annotations = annotations;         // 标注内容
    this.confidence = confidence;           // 置信度
    this.quality = quality;                 // 质量评分
    this.relevance = relevance;             // 相关性评分
    this.annotatorId = annotatorId;         // 标注者ID
    this.reviewerId = reviewerId;           // 审核者ID
    this.reviewTime = reviewTime;           // 审核时间
    this.reviewComments = reviewComments;   // 审核意见
  }

  // 添加标注
  addAnnotation(annotation) {
    this.annotations.push({
      id: Date.now().toString(),
      content: annotation,
      createTime: new Date().toISOString(),
      annotatorId: this.annotatorId
    });
    this.updateTime = new Date().toISOString();
  }

  // 添加标签
  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updateTime = new Date().toISOString();
    }
  }

  // 移除标签
  removeTag(tag) {
    this.tags = this.tags.filter(t => t !== tag);
    this.updateTime = new Date().toISOString();
  }

  // 更新状态
  updateStatus(status) {
    this.annotationStatus = status;
    this.updateTime = new Date().toISOString();
  }

  // 设置审核信息
  setReview(reviewerId, comments, approved = true) {
    this.reviewerId = reviewerId;
    this.reviewComments = comments;
    this.reviewTime = new Date().toISOString();
    this.annotationStatus = approved ? AnnotationStatus.REVIEWED : AnnotationStatus.REJECTED;
    this.updateTime = new Date().toISOString();
  }
}

/**
 * 人员标注节点类
 */
export class PersonnelAnnotationNode extends TreeNode {
  constructor({
    personnelId = '',
    personnelType = PersonnelType.STUDENT,
    department = '',
    position = '',
    email = '',
    phone = '',
    annotationStatus = AnnotationStatus.PENDING,
    tags = [],
    annotations = [],
    skills = [],
    experience = '',
    notes = '',
    annotatorId = '',
    reviewerId = '',
    reviewTime = null,
    reviewComments = '',
    ...baseProps
  } = {}) {
    super({ ...baseProps, type: TreeNodeType.PERSONNEL });
    
    this.personnelId = personnelId;         // 人员ID
    this.personnelType = personnelType;     // 人员类型
    this.department = department;           // 部门
    this.position = position;               // 职位
    this.email = email;                     // 邮箱
    this.phone = phone;                     // 电话
    this.annotationStatus = annotationStatus; // 标注状态
    this.tags = tags;                       // 标签列表
    this.annotations = annotations;         // 标注内容
    this.skills = skills;                   // 技能列表
    this.experience = experience;           // 经验描述
    this.notes = notes;                     // 备注
    this.annotatorId = annotatorId;         // 标注者ID
    this.reviewerId = reviewerId;           // 审核者ID
    this.reviewTime = reviewTime;           // 审核时间
    this.reviewComments = reviewComments;   // 审核意见
  }

  // 添加标注
  addAnnotation(annotation) {
    this.annotations.push({
      id: Date.now().toString(),
      content: annotation,
      createTime: new Date().toISOString(),
      annotatorId: this.annotatorId
    });
    this.updateTime = new Date().toISOString();
  }

  // 添加标签
  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updateTime = new Date().toISOString();
    }
  }

  // 移除标签
  removeTag(tag) {
    this.tags = this.tags.filter(t => t !== tag);
    this.updateTime = new Date().toISOString();
  }

  // 添加技能
  addSkill(skill) {
    if (!this.skills.includes(skill)) {
      this.skills.push(skill);
      this.updateTime = new Date().toISOString();
    }
  }

  // 更新状态
  updateStatus(status) {
    this.annotationStatus = status;
    this.updateTime = new Date().toISOString();
  }

  // 设置审核信息
  setReview(reviewerId, comments, approved = true) {
    this.reviewerId = reviewerId;
    this.reviewComments = comments;
    this.reviewTime = new Date().toISOString();
    this.annotationStatus = approved ? AnnotationStatus.REVIEWED : AnnotationStatus.REJECTED;
    this.updateTime = new Date().toISOString();
  }

  // 获取人员信息摘要
  getPersonnelSummary() {
    return {
      id: this.personnelId,
      name: this.name,
      type: this.personnelType,
      department: this.department,
      position: this.position,
      status: this.annotationStatus,
      tagCount: this.tags.length,
      annotationCount: this.annotations.length,
      skillCount: this.skills.length
    };
  }
}

/**
 * 组织分类节点类
 */
export class OrganizationCategoryNode extends TreeNode {
  constructor({
    organizationType = PersonnelType.TEACHER,
    description = '',
    icon = '',
    color = '#1890ff',
    personnelCount = 0,
    annotationCount = 0,
    completionRate = 0,
    averageQuality = 0,
    ...baseProps
  } = {}) {
    super({ ...baseProps, type: TreeNodeType.CATEGORY });
    
    this.organizationType = organizationType; // 组织类型
    this.description = description;           // 描述
    this.icon = icon;                        // 图标
    this.color = color;                      // 颜色
    this.personnelCount = personnelCount;    // 人员数量
    this.annotationCount = annotationCount;  // 标注数量
    this.completionRate = completionRate;    // 完成率
    this.averageQuality = averageQuality;    // 平均质量
  }

  // 更新统计信息
  updateStats() {
    const descendants = this.getAllDescendants();
    const personnelNodes = descendants.filter(node => node.type === TreeNodeType.PERSONNEL);
    
    this.personnelCount = personnelNodes.length;
    this.annotationCount = personnelNodes.reduce((sum, node) => sum + (node.annotations ? node.annotations.length : 0), 0);
    
    const completedNodes = personnelNodes.filter(node => 
      node.annotationStatus === AnnotationStatus.COMPLETED || 
      node.annotationStatus === AnnotationStatus.REVIEWED
    );
    this.completionRate = personnelNodes.length > 0 ? completedNodes.length / personnelNodes.length : 0;
    
    const qualitySum = personnelNodes.reduce((sum, node) => sum + (node.quality || 0), 0);
    this.averageQuality = personnelNodes.length > 0 ? qualitySum / personnelNodes.length : 0;
    
    this.updateTime = new Date().toISOString();
  }
}

/**
 * 资源来源分类节点类
 */
export class ResourceSourceCategoryNode extends TreeNode {
  constructor({
    sourceType = ResourceSourceType.INTERNAL,
    description = '',
    icon = '',
    color = '#1890ff',
    resourceCount = 0,
    annotationCount = 0,
    completionRate = 0,
    averageQuality = 0,
    ...baseProps
  } = {}) {
    super({ ...baseProps, type: TreeNodeType.CATEGORY });
    
    this.sourceType = sourceType;         // 来源类型
    this.description = description;       // 描述
    this.icon = icon;                     // 图标
    this.color = color;                   // 颜色
    this.resourceCount = resourceCount;   // 资源数量
    this.annotationCount = annotationCount; // 标注数量
    this.completionRate = completionRate; // 完成率
    this.averageQuality = averageQuality; // 平均质量
  }

  // 更新统计信息
  updateStats() {
    const descendants = this.getAllDescendants();
    const resourceNodes = descendants.filter(node => node.type === TreeNodeType.RESOURCE);
    
    this.resourceCount = resourceNodes.length;
    this.annotationCount = resourceNodes.reduce((sum, node) => sum + node.annotations.length, 0);
    
    const completedNodes = resourceNodes.filter(node => 
      node.annotationStatus === AnnotationStatus.COMPLETED || 
      node.annotationStatus === AnnotationStatus.REVIEWED
    );
    this.completionRate = resourceNodes.length > 0 ? completedNodes.length / resourceNodes.length : 0;
    
    const qualitySum = resourceNodes.reduce((sum, node) => sum + node.quality, 0);
    this.averageQuality = resourceNodes.length > 0 ? qualitySum / resourceNodes.length : 0;
    
    this.updateTime = new Date().toISOString();
  }
}

/**
 * 树状资源标注管理器类
 */
export class ResourceAnnotationTreeManager {
  constructor() {
    this.root = new TreeNode({
      id: 'root',
      name: '资源标注根目录',
      type: TreeNodeType.ROOT,
      level: 0,
      path: [],
      isExpanded: true
    });
    this.nodeMap = new Map(); // 节点ID映射
    this.nodeMap.set('root', this.root);
  }

  // 添加节点
  addNode(node, parentId = 'root') {
    const parent = this.nodeMap.get(parentId);
    if (parent) {
      parent.addChild(node);
      this.nodeMap.set(node.id, node);
      
      // 更新父节点统计信息
      if (parent instanceof ResourceSourceCategoryNode) {
        parent.updateStats();
      }
      
      return true;
    }
    return false;
  }

  // 移除节点
  removeNode(nodeId) {
    const node = this.nodeMap.get(nodeId);
    if (node && node.parentId) {
      const parent = this.nodeMap.get(node.parentId);
      if (parent) {
        parent.removeChild(nodeId);
        
        // 递归移除所有子节点
        const descendants = node.getAllDescendants();
        descendants.forEach(descendant => {
          this.nodeMap.delete(descendant.id);
        });
        
        this.nodeMap.delete(nodeId);
        
        // 更新父节点统计信息
        if (parent instanceof ResourceSourceCategoryNode) {
          parent.updateStats();
        }
        
        return true;
      }
    }
    return false;
  }

  // 查找节点
  findNode(nodeId) {
    return this.nodeMap.get(nodeId);
  }

  // 搜索节点
  searchNodes(query, type = null) {
    const results = [];
    for (const [id, node] of this.nodeMap) {
      if (id === 'root') continue;
      
      const matchesQuery = node.name.toLowerCase().includes(query.toLowerCase()) ||
                          (node.tags && node.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())));
      const matchesType = !type || node.type === type;
      
      if (matchesQuery && matchesType) {
        results.push(node);
      }
    }
    return results;
  }

  // 获取树状结构数据
  getTreeData() {
    return this.root;
  }

  // 获取扁平化节点列表
  getFlatNodes() {
    return Array.from(this.nodeMap.values()).filter(node => node.id !== 'root');
  }

  // 获取指定类型的节点
  getNodesByType(type) {
    return this.getFlatNodes().filter(node => node.type === type);
  }

  // 获取统计信息
  getStatistics() {
    const allNodes = this.getFlatNodes();
    const resourceNodes = allNodes.filter(node => node.type === TreeNodeType.RESOURCE);
    const categoryNodes = allNodes.filter(node => node.type === TreeNodeType.CATEGORY);
    
    const completedResources = resourceNodes.filter(node => 
      node.annotationStatus === AnnotationStatus.COMPLETED || 
      node.annotationStatus === AnnotationStatus.REVIEWED
    );
    
    return {
      totalNodes: allNodes.length,
      totalResources: resourceNodes.length,
      totalCategories: categoryNodes.length,
      completedResources: completedResources.length,
      completionRate: resourceNodes.length > 0 ? completedResources.length / resourceNodes.length : 0,
      totalAnnotations: resourceNodes.reduce((sum, node) => sum + node.annotations.length, 0),
      averageQuality: resourceNodes.length > 0 ? 
        resourceNodes.reduce((sum, node) => sum + node.quality, 0) / resourceNodes.length : 0
    };
  }

  // 导出树状数据
  exportTree() {
    return JSON.stringify(this.root, null, 2);
  }

  // 导入树状数据
  importTree(treeData) {
    try {
      const data = typeof treeData === 'string' ? JSON.parse(treeData) : treeData;
      this.root = this.reconstructNode(data);
      this.rebuildNodeMap();
      return true;
    } catch (error) {
      console.error('导入树状数据失败:', error);
      return false;
    }
  }

  // 重建节点（用于导入）
  reconstructNode(data) {
    let node;
    
    switch (data.type) {
      case TreeNodeType.RESOURCE:
        node = new ResourceAnnotationNode(data);
        break;
      case TreeNodeType.CATEGORY:
        node = new ResourceSourceCategoryNode(data);
        break;
      default:
        node = new TreeNode(data);
        break;
    }
    
    // 递归重建子节点
    node.children = data.children.map(childData => this.reconstructNode(childData));
    
    return node;
  }

  // 重建节点映射
  rebuildNodeMap() {
    this.nodeMap.clear();
    this.nodeMap.set('root', this.root);
    
    const addToMap = (node) => {
      this.nodeMap.set(node.id, node);
      node.children.forEach(child => addToMap(child));
    };
    
    this.root.children.forEach(child => addToMap(child));
  }
}

/**
 * 组织人员树管理器类
 */
export class OrganizationPersonnelTreeManager {
  constructor() {
    this.root = new TreeNode({
      id: 'root',
      name: '组织人员根目录',
      type: TreeNodeType.ROOT,
      level: 0,
      path: [],
      isExpanded: true
    });
    this.nodeMap = new Map(); // 节点ID映射
    this.nodeMap.set('root', this.root);
  }

  // 添加节点
  addNode(node, parentId = 'root') {
    const parent = this.nodeMap.get(parentId);
    if (parent) {
      parent.addChild(node);
      this.nodeMap.set(node.id, node);
      
      // 更新父节点统计信息
      if (parent instanceof OrganizationCategoryNode) {
        parent.updateStats();
      }
      
      return true;
    }
    return false;
  }

  // 移除节点
  removeNode(nodeId) {
    const node = this.nodeMap.get(nodeId);
    if (node && node.parentId) {
      const parent = this.nodeMap.get(node.parentId);
      if (parent) {
        parent.removeChild(nodeId);
        
        // 递归移除所有子节点
        const descendants = node.getAllDescendants();
        descendants.forEach(descendant => {
          this.nodeMap.delete(descendant.id);
        });
        
        this.nodeMap.delete(nodeId);
        
        // 更新父节点统计信息
        if (parent instanceof OrganizationCategoryNode) {
          parent.updateStats();
        }
        
        return true;
      }
    }
    return false;
  }

  // 查找节点
  findNode(nodeId) {
    return this.nodeMap.get(nodeId);
  }

  // 搜索节点
  searchNodes(query, type = null) {
    const results = [];
    for (const [id, node] of this.nodeMap) {
      if (id === 'root') continue;
      
      const matchesQuery = node.name.toLowerCase().includes(query.toLowerCase()) ||
                          (node.tags && node.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())));
      const matchesType = !type || node.type === type;
      
      if (matchesQuery && matchesType) {
        results.push(node);
      }
    }
    return results;
  }

  // 获取树状结构数据
  getTreeData() {
    return this.root;
  }

  // 获取扁平化节点列表
  getFlatNodes() {
    return Array.from(this.nodeMap.values()).filter(node => node.id !== 'root');
  }

  // 获取指定类型的节点
  getNodesByType(type) {
    return this.getFlatNodes().filter(node => node.type === type);
  }

  // 获取统计信息
  getStatistics() {
    const allNodes = this.getFlatNodes();
    const personnelNodes = allNodes.filter(node => node.type === TreeNodeType.PERSONNEL);
    const categoryNodes = allNodes.filter(node => node.type === TreeNodeType.CATEGORY);
    
    const completedPersonnel = personnelNodes.filter(node => 
      node.annotationStatus === AnnotationStatus.COMPLETED || 
      node.annotationStatus === AnnotationStatus.REVIEWED
    );
    
    return {
      totalNodes: allNodes.length,
      totalPersonnel: personnelNodes.length,
      totalCategories: categoryNodes.length,
      completedPersonnel: completedPersonnel.length,
      completionRate: personnelNodes.length > 0 ? completedPersonnel.length / personnelNodes.length : 0,
      totalAnnotations: personnelNodes.reduce((sum, node) => sum + (node.annotations ? node.annotations.length : 0), 0),
      averageQuality: personnelNodes.length > 0 ? 
        personnelNodes.reduce((sum, node) => sum + (node.quality || 0), 0) / personnelNodes.length : 0
    };
  }

  // 导出树状数据
  exportTree() {
    return JSON.stringify(this.root, null, 2);
  }

  // 导入树状数据
  importTree(treeData) {
    try {
      const data = typeof treeData === 'string' ? JSON.parse(treeData) : treeData;
      this.root = this.reconstructNode(data);
      this.rebuildNodeMap();
      return true;
    } catch (error) {
      console.error('导入树状数据失败:', error);
      return false;
    }
  }

  // 重建节点（用于导入）
  reconstructNode(data) {
    let node;
    
    switch (data.type) {
      case TreeNodeType.PERSONNEL:
        node = new TreeNode(data); // 可以后续创建PersonnelNode类
        break;
      case TreeNodeType.CATEGORY:
        node = new OrganizationCategoryNode(data);
        break;
      default:
        node = new TreeNode(data);
        break;
    }
    
    // 递归重建子节点
    node.children = data.children.map(childData => this.reconstructNode(childData));
    
    return node;
  }

  // 重建节点映射
  rebuildNodeMap() {
    this.nodeMap.clear();
    this.nodeMap.set('root', this.root);
    
    const addToMap = (node) => {
      this.nodeMap.set(node.id, node);
      node.children.forEach(child => addToMap(child));
    };
    
    this.root.children.forEach(child => addToMap(child));
  }
}

// 导出所有类和枚举
export default {
  PersonnelType,
  AnnotationStatus,
  TreeNodeType,
  TreeNode,
  PersonnelAnnotationNode,
  OrganizationCategoryNode,
  OrganizationPersonnelTreeManager
};