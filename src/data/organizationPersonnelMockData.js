// 组织人员树模拟数据
import {
  PersonnelType,
  AnnotationStatus,
  TreeNodeType,
  TreeNode,
  PersonnelAnnotationNode,
  OrganizationCategoryNode,
  OrganizationPersonnelTreeManager,
  ResourceAnnotationNode
} from '../types/organizationPersonnelTree.js';
import { ResourceSourceType, ResourceSourceCategoryNode } from '../types/resourceAnnotationTree.js';

import { createMockResourceAnnotationTree } from './resourceAnnotationTreeMockData.js';

/**
 * 创建模拟的组织人员树数据
 */
export function createMockOrganizationPersonnelTree() {
  const manager = new OrganizationPersonnelTreeManager();

  // 1. 教学部门
  const teachingDepartment = new OrganizationCategoryNode({
    id: 'teaching_department',
    name: '教学部门',
    personnelType: PersonnelType.TEACHER,
    description: '学校教学相关部门和人员',
    icon: '🏫',
    color: '#1890ff'
  });

  // 添加数学教师
  const mathTeacher1 = new PersonnelAnnotationNode({
    id: 'teacher_math_001',
    name: '张老师',
    personnelId: 'per_math_001',
    personnelType: PersonnelType.TEACHER,
    department: '教学部门',
    position: '数学教师',
    annotationStatus: AnnotationStatus.COMPLETED,
    tags: ['数学', '高中', '函数', '导数'],
    annotations: [
      {
        id: 'ann_001',
        content: '负责高中数学教学，专长函数与导数',
        createTime: '2024-01-15T10:30:00Z',
        annotatorId: 'admin_001'
      }
    ],
    confidence: 0.95,
    quality: 4.5,
    relevance: 4.8,
    annotatorId: 'admin_001'
  });

  const physicsTeacher1 = new PersonnelAnnotationNode({
    id: 'teacher_physics_001',
    name: '李老师',
    personnelId: 'per_physics_001',
    personnelType: PersonnelType.TEACHER,
    department: '教学部门',
    position: '物理教师',
    annotationStatus: AnnotationStatus.REVIEWED,
    tags: ['物理', '实验', '电磁感应'],
    annotations: [
      {
        id: 'ann_002',
        content: '负责物理实验教学，擅长电磁学',
        createTime: '2024-01-14T16:45:00Z',
        annotatorId: 'admin_001'
      }
    ],
    confidence: 0.92,
    quality: 4.3,
    relevance: 4.6,
    annotatorId: 'admin_001'
  });

  const chineseTeacher1 = new PersonnelAnnotationNode({
    id: 'teacher_chinese_001',
    name: '王老师',
    personnelId: 'per_chinese_001',
    personnelType: PersonnelType.TEACHER,
    department: '教学部门',
    position: '语文教师',
    annotationStatus: AnnotationStatus.IN_PROGRESS,
    tags: ['语文', '古诗词', '鉴赏'],
    annotations: [
      {
        id: 'ann_003',
        content: '负责语文教学，专长古诗词鉴赏',
        createTime: '2024-01-13T09:15:00Z',
        annotatorId: 'admin_001'
      }
    ],
    confidence: 0.88,
    quality: 4.0,
    relevance: 4.4,
    annotatorId: 'admin_001'
  });

  teachingDepartment.addChild(mathTeacher1);
  teachingDepartment.addChild(physicsTeacher1);
  teachingDepartment.addChild(chineseTeacher1);

  // 2. 行政部门
  const adminDepartment = new OrganizationCategoryNode({
    id: 'admin_department',
    name: '行政部门',
    personnelType: PersonnelType.ADMIN,
    description: '学校行政管理人员',
    icon: '🏢',
    color: '#52c41a'
  });

  const adminStaff1 = new PersonnelAnnotationNode({
    id: 'admin_001',
    name: '陈主任',
    personnelId: 'per_admin_001',
    personnelType: PersonnelType.ADMIN,
    department: '行政部门',
    position: '教务主任',
    annotationStatus: AnnotationStatus.COMPLETED,
    tags: ['教务管理', '课程安排', '教学质量'],
    annotations: [
      {
        id: 'ann_004',
        content: '负责教务管理和课程安排',
        createTime: '2024-01-12T14:20:00Z',
        annotatorId: 'admin_001'
      }
    ],
    confidence: 0.96,
    quality: 4.7,
    relevance: 4.9,
    annotatorId: 'admin_001'
  });

  const adminStaff2 = new PersonnelAnnotationNode({
    id: 'admin_002',
    name: '刘秘书',
    personnelId: 'per_admin_002',
    personnelType: PersonnelType.ADMIN,
    department: '行政部门',
    position: '办公室秘书',
    annotationStatus: AnnotationStatus.PENDING,
    tags: ['文档管理', '会议安排', '对外联络'],
    annotations: [],
    confidence: 0.0,
    quality: 0.0,
    relevance: 0.0,
    annotatorId: null
  });

  adminDepartment.addChild(adminStaff1);
  adminDepartment.addChild(adminStaff2);

  // 3. 技术部门
  const techDepartment = new OrganizationCategoryNode({
    id: 'tech_department',
    name: '技术部门',
    personnelType: PersonnelType.STAFF,
    description: '学校技术支持人员',
    icon: '💻',
    color: '#722ed1'
  });

  const techStaff1 = new PersonnelAnnotationNode({
    id: 'tech_001',
    name: '赵工程师',
    personnelId: 'per_tech_001',
    personnelType: PersonnelType.STAFF,
    department: '技术部门',
    position: '网络工程师',
    annotationStatus: AnnotationStatus.REVIEWED,
    tags: ['网络维护', '系统管理', '技术支持'],
    annotations: [
      {
        id: 'ann_005',
        content: '负责校园网络和信息系统维护',
        createTime: '2024-01-11T11:30:00Z',
        annotatorId: 'admin_001'
      }
    ],
    confidence: 0.93,
    quality: 4.4,
    relevance: 4.7,
    annotatorId: 'admin_001'
  });

  techDepartment.addChild(techStaff1);

  // 4. 学生管理部门
  const studentDepartment = new OrganizationCategoryNode({
    id: 'student_department',
    name: '学生管理部门',
    personnelType: PersonnelType.STAFF,
    description: '学生事务管理人员',
    icon: '👥',
    color: '#fa8c16'
  });

  const studentManager1 = new PersonnelAnnotationNode({
    id: 'student_mgr_001',
    name: '孙老师',
    personnelId: 'per_student_001',
    personnelType: PersonnelType.STAFF,
    department: '学生管理部门',
    position: '班主任',
    annotationStatus: AnnotationStatus.COMPLETED,
    tags: ['班级管理', '学生指导', '家校沟通'],
    annotations: [
      {
        id: 'ann_006',
        content: '负责高三年级班级管理工作',
        createTime: '2024-01-10T08:45:00Z',
        annotatorId: 'admin_001'
      }
    ],
    confidence: 0.94,
    quality: 4.6,
    relevance: 4.8,
    annotatorId: 'admin_001'
  });

  studentDepartment.addChild(studentManager1);

  // 5. 新增：产品部与设计部分类
  const productDepartment = new OrganizationCategoryNode({
    id: 'product_department',
    name: '产品部',
    personnelType: PersonnelType.STAFF,
    description: '产品策划与管理',
    icon: '🧩',
    color: '#13c2c2'
  });
  const designDepartment = new OrganizationCategoryNode({
    id: 'design_department',
    name: '设计部',
    personnelType: PersonnelType.STAFF,
    description: 'UI/UX设计与规范',
    icon: '🎨',
    color: '#eb2f96'
  });

  // 批量生成多标签人员：一次性初始化
  const tagPool = [
    '技术部','产品部','设计部','教学部门',
    '数学','物理','化学','生物','英语','地理','历史',
    '高中','函数','导数','实验','电磁感应',
    '新入职','骨干','待确认','已确认','UI','交互','需求','策略','网络维护','系统管理'
  ];
  const names = ['张','李','王','赵','钱','孙','周','吴','郑','冯','陈','褚','卫','蒋','沈','韩','杨'];
  const positions = ['教师','助教','产品经理','产品策划','UI设计师','交互设计师','前端工程师','后端工程师','测试工程师','运维工程师'];

  // 生成并分配到各部门
  let seq = 1000;
  const pick = (arr, n) => {
    const res = new Set();
    while (res.size < n) res.add(arr[Math.floor(Math.random() * arr.length)]);
    return Array.from(res);
  };
  const makeNode = (dept, typeLabel) => {
    const name = `${names[Math.floor(Math.random() * names.length)]}${Math.floor(Math.random() * 100)}`;
    const pos = positions[Math.floor(Math.random() * positions.length)];
    const idBase = `per_${dept}_${seq++}`;
    return new PersonnelAnnotationNode({
      id: `node_${dept}_${seq}`,
      name,
      personnelId: idBase,
      personnelType: dept === '教学部门' ? PersonnelType.TEACHER : PersonnelType.STAFF,
      department: dept,
      position: pos,
      email: `${idBase}@company.com`,
      annotationStatus: [AnnotationStatus.PENDING, AnnotationStatus.IN_PROGRESS, AnnotationStatus.COMPLETED, AnnotationStatus.REVIEWED][Math.floor(Math.random() * 4)],
      tags: pick(tagPool, 3).concat([typeLabel]).filter(Boolean),
      annotations: [],
      confidence: 0.8 + Math.random() * 0.2,
      quality: 3.5 + Math.random() * 1.5,
      relevance: 3.5 + Math.random() * 1.5,
      annotatorId: 'system_seed'
    });
  };

  // 批量添加：每部门 15 人
  for (let i = 0; i < 15; i++) teachingDepartment.addChild(makeNode('教学部门', '教师')); 
  for (let i = 0; i < 15; i++) techDepartment.addChild(makeNode('技术部门', '技术')); 
  for (let i = 0; i < 15; i++) productDepartment.addChild(makeNode('产品部', '产品'));
  for (let i = 0; i < 15; i++) designDepartment.addChild(makeNode('设计部', '设计'));

  // 将所有部门添加到管理器
  manager.addNode(teachingDepartment);
  manager.addNode(adminDepartment);
  manager.addNode(techDepartment);
  manager.addNode(studentDepartment);
  manager.addNode(productDepartment);
  manager.addNode(designDepartment);

  // 更新所有部门的统计信息
  [teachingDepartment, adminDepartment, techDepartment, studentDepartment, productDepartment, designDepartment].forEach(department => {
    department.updateStats();
  });

  // 关键修复：重建节点映射，确保人员子节点可检索
  manager.rebuildNodeMap();
  return manager;
}

/**
 * 获取人员标注统计信息
 */
export function getPersonnelAnnotationStats(manager) {
  const stats = manager.getStatistics();
  
  // 按人员类型统计
  const personnelTypeStats = {};
  Object.values(PersonnelType).forEach(type => {
    const nodes = manager.getNodesByType(TreeNodeType.PERSONNEL).filter(node => node.personnelType === type);
    personnelTypeStats[type] = {
      count: nodes.length,
      completed: nodes.filter(node => 
        node.annotationStatus === AnnotationStatus.COMPLETED || 
        node.annotationStatus === AnnotationStatus.REVIEWED
      ).length,
      averageAnnotations: nodes.length > 0 ? 
        nodes.reduce((sum, node) => sum + node.annotations.length, 0) / nodes.length : 0
    };
  });

  // 按状态统计
  const statusStats = {};
  Object.values(AnnotationStatus).forEach(status => {
    const nodes = manager.getNodesByType(TreeNodeType.PERSONNEL).filter(node => node.annotationStatus === status);
    statusStats[status] = nodes.length;
  });

  // 按部门统计
  const departmentStats = {};
  const personnelNodes = manager.getNodesByType(TreeNodeType.PERSONNEL);
  personnelNodes.forEach(node => {
    const dept = node.department || '未分配';
    if (!departmentStats[dept]) {
      departmentStats[dept] = {
        count: 0,
        completed: 0,
        totalAnnotations: 0
      };
    }
    departmentStats[dept].count++;
    if (node.annotationStatus === AnnotationStatus.COMPLETED || 
        node.annotationStatus === AnnotationStatus.REVIEWED) {
      departmentStats[dept].completed++;
    }
    departmentStats[dept].totalAnnotations += node.annotations.length;
  });

  return {
    ...stats,
    personnelTypeStats,
    statusStats,
    departmentStats,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * 获取资源标注统计信息
 */
export function getResourceAnnotationStats(manager) {
  const stats = manager.getStatistics();
  
  // 按来源类型统计
  const sourceTypeStats = {};
  Object.values(ResourceSourceType).forEach(type => {
    const nodes = manager.getNodesByType(TreeNodeType.RESOURCE).filter(node => node.sourceType === type);
    sourceTypeStats[type] = {
      count: nodes.length,
      completed: nodes.filter(node => 
        node.annotationStatus === AnnotationStatus.COMPLETED || 
        node.annotationStatus === AnnotationStatus.REVIEWED
      ).length,
      averageQuality: nodes.length > 0 ? 
        nodes.reduce((sum, node) => sum + node.quality, 0) / nodes.length : 0
    };
  });

  // 按状态统计
  const statusStats = {};
  Object.values(AnnotationStatus).forEach(status => {
    const nodes = manager.getNodesByType(TreeNodeType.RESOURCE).filter(node => node.annotationStatus === status);
    statusStats[status] = nodes.length;
  });

  return {
    ...stats,
    sourceTypeStats,
    statusStats,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * 搜索人员标注
 */
export function searchPersonnelAnnotations(manager, query, filters = {}) {
  let results = manager.searchNodes(query, TreeNodeType.PERSONNEL);

  // 应用过滤器
  if (filters.personnelType) {
    results = results.filter(node => node.personnelType === filters.personnelType);
  }

  if (filters.status) {
    results = results.filter(node => node.annotationStatus === filters.status);
  }

  if (filters.department) {
    results = results.filter(node => node.department === filters.department);
  }

  if (filters.position) {
    results = results.filter(node => node.position && node.position.includes(filters.position));
  }

  if (filters.tags && filters.tags.length > 0) {
    results = results.filter(node => 
      filters.tags.some(tag => node.tags.includes(tag))
    );
  }

  if (filters.skills && filters.skills.length > 0) {
    results = results.filter(node => 
      filters.skills.some(skill => node.skills.includes(skill))
    );
  }

  // 按标注数量和相关性排序
  results.sort((a, b) => {
    const scoreA = a.annotations.length * 0.4 + a.tags.length * 0.3 + a.skills.length * 0.3;
    const scoreB = b.annotations.length * 0.4 + b.tags.length * 0.3 + b.skills.length * 0.3;
    return scoreB - scoreA;
  });

  return results;
}

/**
 * 搜索资源标注
 */
export function searchResourceAnnotations(manager, query, filters = {}) {
  let results = manager.searchNodes(query, TreeNodeType.RESOURCE);

  // 应用过滤器
  if (filters.sourceType) {
    results = results.filter(node => node.sourceType === filters.sourceType);
  }

  if (filters.status) {
    results = results.filter(node => node.annotationStatus === filters.status);
  }

  if (filters.minQuality) {
    results = results.filter(node => node.quality >= filters.minQuality);
  }

  if (filters.tags && filters.tags.length > 0) {
    results = results.filter(node => 
      filters.tags.some(tag => node.tags.includes(tag))
    );
  }

  // 按相关性和质量排序
  results.sort((a, b) => {
    const scoreA = a.relevance * 0.6 + a.quality * 0.4;
    const scoreB = b.relevance * 0.6 + b.quality * 0.4;
    return scoreB - scoreA;
  });

  return results;
}

/**
 * 获取热门标签
 */
export function getPopularTags(manager, limit = 20) {
  const tagCount = {};
  const resourceNodes = manager.getNodesByType(TreeNodeType.RESOURCE);

  resourceNodes.forEach(node => {
    node.tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
}

// 创建默认的树状资源标注管理器实例
export const defaultResourceAnnotationTree = createMockResourceAnnotationTree();

// 导出默认数据
export default {
  createMockOrganizationPersonnelTree,
  getPersonnelAnnotationStats,
  searchPersonnelAnnotations,
  getResourceAnnotationStats,
  searchResourceAnnotations,
  getPopularTags,
  defaultResourceAnnotationTree
};