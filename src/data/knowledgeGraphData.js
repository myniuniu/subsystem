// 知识图谱模拟数据生成器

import {
  KnowledgeNode,
  KnowledgeResource,
  KnowledgeGraph,
  KNOWLEDGE_GRAPH_CATEGORIES
} from '../types/knowledgeGraph.js';

// 生成知识节点数据
export const generateKnowledgeNodes = () => {
  const nodes = [
    // 教育学科根节点
    new KnowledgeNode({
      id: 'education-root',
      name: '教育学科体系',
      description: '涵盖教育理论、实践、技术等多个方面的综合知识体系',
      category: 'EDUCATION',
      position: { x: 0, y: 0 },
      color: '#667eea',
      icon: '🎓',
      children: ['pedagogy', 'educational-tech', 'assessment'],
      importance: 'high'
    }),
    new KnowledgeNode({
      id: 'pedagogy',
      name: '教学法',
      description: '研究教学过程和教学方法的科学',
      category: 'EDUCATION',
      position: { x: -200, y: 150 },
      color: '#667eea',
      icon: '📚',
      parentId: 'education-root',
      relatedResources: ['pedagogy-001', 'pedagogy-002'],
      keywords: ['教学设计', '课堂管理', '学习策略'],
      importance: 'high'
    }),
    new KnowledgeNode({
      id: 'educational-tech',
      name: '教育技术',
      description: '运用现代技术手段改进教育教学的理论与实践',
      category: 'EDUCATION',
      position: { x: 0, y: 150 },
      color: '#667eea',
      icon: '💻',
      parentId: 'education-root',
      relatedResources: ['edtech-001', 'edtech-002'],
      keywords: ['数字化教学', 'AI教育', '在线学习'],
      importance: 'high'
    }),
    new KnowledgeNode({
      id: 'assessment',
      name: '教育评价',
      description: '对教育活动、过程和结果进行价值判断的理论与方法',
      category: 'EDUCATION',
      position: { x: 200, y: 150 },
      color: '#667eea',
      icon: '📊',
      parentId: 'education-root',
      relatedResources: ['assessment-001'],
      keywords: ['形成性评价', '总结性评价', '多元评价'],
      importance: 'medium'
    }),

    // 技术领域根节点
    new KnowledgeNode({
      id: 'technology-root',
      name: '信息技术',
      description: '计算机科学与技术的核心知识领域',
      category: 'TECHNOLOGY',
      position: { x: 400, y: -200 },
      color: '#4facfe',
      icon: '💻',
      children: ['programming', 'data-science', 'ai-ml'],
      importance: 'high'
    }),
    new KnowledgeNode({
      id: 'programming',
      name: '程序设计',
      description: '编写计算机程序的理论、方法和实践',
      category: 'TECHNOLOGY',
      position: { x: 250, y: -50 },
      color: '#4facfe',
      icon: '⌨️',
      parentId: 'technology-root',
      relatedResources: ['programming-001', 'programming-002'],
      keywords: ['算法', '数据结构', '软件工程'],
      importance: 'high'
    }),
    new KnowledgeNode({
      id: 'data-science',
      name: '数据科学',
      description: '从数据中提取知识和洞察的跨学科领域',
      category: 'TECHNOLOGY',
      position: { x: 400, y: -50 },
      color: '#4facfe',
      icon: '📈',
      parentId: 'technology-root',
      relatedResources: ['data-science-001'],
      keywords: ['数据分析', '机器学习', '数据可视化'],
      importance: 'high'
    }),
    new KnowledgeNode({
      id: 'ai-ml',
      name: '人工智能',
      description: '模拟人类智能的计算机系统的理论与技术',
      category: 'TECHNOLOGY',
      position: { x: 550, y: -50 },
      color: '#4facfe',
      icon: '🤖',
      parentId: 'technology-root',
      relatedResources: ['ai-001', 'ai-002'],
      keywords: ['机器学习', '深度学习', '神经网络'],
      importance: 'high'
    }),

    // 科学研究根节点
    new KnowledgeNode({
      id: 'science-root',
      name: '科学研究方法',
      description: '进行科学研究的系统性方法和原则',
      category: 'SCIENCE',
      position: { x: -400, y: -200 },
      color: '#f093fb',
      icon: '🔬',
      children: ['research-design', 'data-analysis', 'academic-writing'],
      importance: 'high'
    }),
    new KnowledgeNode({
      id: 'research-design',
      name: '研究设计',
      description: '制定科学研究计划和实施方案的方法',
      category: 'SCIENCE',
      position: { x: -550, y: -50 },
      color: '#f093fb',
      icon: '📋',
      parentId: 'science-root',
      relatedResources: ['research-001'],
      keywords: ['实验设计', '调查研究', '定性研究'],
      importance: 'high'
    }),
    new KnowledgeNode({
      id: 'data-analysis',
      name: '数据分析',
      description: '对收集的数据进行统计分析和解释的方法',
      category: 'SCIENCE',
      position: { x: -400, y: -50 },
      color: '#f093fb',
      icon: '📊',
      parentId: 'science-root',
      relatedResources: ['analysis-001'],
      keywords: ['统计分析', 'SPSS', 'R语言'],
      importance: 'medium'
    }),
    new KnowledgeNode({
      id: 'academic-writing',
      name: '学术写作',
      description: '撰写学术论文和研究报告的规范与技巧',
      category: 'SCIENCE',
      position: { x: -250, y: -50 },
      color: '#f093fb',
      icon: '✍️',
      parentId: 'science-root',
      relatedResources: ['writing-001'],
      keywords: ['论文写作', '文献综述', '引用规范'],
      importance: 'medium'
    }),

    // 商业管理根节点
    new KnowledgeNode({
      id: 'business-root',
      name: '商业管理',
      description: '企业经营和管理的理论与实践',
      category: 'BUSINESS',
      position: { x: 0, y: -400 },
      color: '#a8edea',
      icon: '💼',
      children: ['strategic-management', 'project-management', 'team-leadership'],
      importance: 'high'
    }),
    new KnowledgeNode({
      id: 'strategic-management',
      name: '战略管理',
      description: '制定和实施企业长期发展战略的管理活动',
      category: 'BUSINESS',
      position: { x: -150, y: -250 },
      color: '#a8edea',
      icon: '🎯',
      parentId: 'business-root',
      relatedResources: ['strategy-001'],
      keywords: ['战略规划', '竞争分析', '商业模式'],
      importance: 'high'
    }),
    new KnowledgeNode({
      id: 'project-management',
      name: '项目管理',
      description: '计划、组织和控制项目资源以达成目标的管理过程',
      category: 'BUSINESS',
      position: { x: 0, y: -250 },
      color: '#a8edea',
      icon: '📋',
      parentId: 'business-root',
      relatedResources: ['pm-001', 'pm-002'],
      keywords: ['项目计划', '风险管理', '敏捷开发'],
      importance: 'high'
    }),
    new KnowledgeNode({
      id: 'team-leadership',
      name: '团队领导',
      description: '引导和激励团队成员实现共同目标的能力',
      category: 'BUSINESS',
      position: { x: 150, y: -250 },
      color: '#a8edea',
      icon: '👥',
      parentId: 'business-root',
      relatedResources: ['leadership-001'],
      keywords: ['领导力', '团队建设', '沟通协调'],
      importance: 'medium'
    })
  ];

  return nodes;
};

// 生成知识资源数据
export const generateKnowledgeResources = () => {
  const resources = [
    // 教学法相关资源
    new KnowledgeResource({
      id: 'pedagogy-001',
      title: '现代教学法概论',
      description: '系统介绍各种现代教学方法和理论',
      type: 'document',
      author: '张教授',
      tags: ['教学法', '教育理论'],
      nodeIds: ['pedagogy']
    }),
    new KnowledgeResource({
      id: 'pedagogy-002',
      title: '互动式教学实践指南',
      description: '如何在课堂中实施互动式教学的实用指南',
      type: 'video',
      author: '李老师',
      tags: ['互动教学', '课堂实践'],
      nodeIds: ['pedagogy']
    }),

    // 教育技术相关资源
    new KnowledgeResource({
      id: 'edtech-001',
      title: '数字化教学工具应用',
      description: '介绍各种数字化教学工具的特点和使用方法',
      type: 'course',
      author: '王博士',
      tags: ['教育技术', '数字化教学'],
      nodeIds: ['educational-tech']
    }),
    new KnowledgeResource({
      id: 'edtech-002',
      title: 'AI在教育中的应用案例',
      description: '人工智能技术在教育领域的具体应用实例',
      type: 'document',
      author: '陈专家',
      tags: ['AI教育', '技术应用'],
      nodeIds: ['educational-tech', 'ai-ml']
    }),

    // 程序设计相关资源
    new KnowledgeResource({
      id: 'programming-001',
      title: 'Python编程入门教程',
      description: '零基础学习Python编程的完整教程',
      type: 'video',
      author: '刘工程师',
      tags: ['Python', '编程入门'],
      nodeIds: ['programming']
    }),
    new KnowledgeResource({
      id: 'programming-002',
      title: '数据结构与算法精讲',
      description: '深入讲解常用数据结构和算法的实现与应用',
      type: 'course',
      author: '赵教授',
      tags: ['数据结构', '算法'],
      nodeIds: ['programming']
    }),

    // 人工智能相关资源
    new KnowledgeResource({
      id: 'ai-001',
      title: '机器学习基础理论',
      description: '机器学习的基本概念、算法和应用',
      type: 'document',
      author: '孙研究员',
      tags: ['机器学习', 'AI基础'],
      nodeIds: ['ai-ml']
    }),
    new KnowledgeResource({
      id: 'ai-002',
      title: '深度学习实战项目',
      description: '通过实际项目学习深度学习技术',
      type: 'course',
      author: '周博士',
      tags: ['深度学习', '实战项目'],
      nodeIds: ['ai-ml']
    }),

    // 其他资源
    new KnowledgeResource({
      id: 'assessment-001',
      title: '多元评价体系构建指南',
      description: '如何建立科学的多元化教育评价体系',
      type: 'document',
      author: '马教授',
      tags: ['教育评价', '多元评价'],
      nodeIds: ['assessment']
    }),
    new KnowledgeResource({
      id: 'research-001',
      title: '教育研究方法与设计',
      description: '教育科学研究的方法论和实践技巧',
      type: 'document',
      author: '吴教授',
      tags: ['研究方法', '教育研究'],
      nodeIds: ['research-design']
    })
  ];

  return resources;
};

// 生成完整的知识图谱
export const generateKnowledgeGraph = () => {
  const nodes = generateKnowledgeNodes();
  const resources = generateKnowledgeResources();
  
  // 建立资源与节点的关联
  nodes.forEach(node => {
    if (node.relatedResources && node.relatedResources.length > 0) {
      node.relatedResources = node.relatedResources.map(resourceId => 
        resources.find(resource => resource.id === resourceId)
      ).filter(Boolean);
    }
  });

  const graph = new KnowledgeGraph({
    id: 'comprehensive-knowledge-graph',
    name: '综合知识图谱',
    description: '涵盖教育、技术、科研、管理等多个领域的知识体系',
    nodes: nodes,
    connections: [
      // 主要分类间的连接
      { id: 'edu-tech', from: 'education-root', to: 'technology-root', type: 'integration', label: '教育技术融合' },
      { id: 'tech-science', from: 'technology-root', to: 'science-root', type: 'methodology', label: '技术研究方法' },
      { id: 'science-business', from: 'science-root', to: 'business-root', type: 'application', label: '研究成果应用' },
      { id: 'business-edu', from: 'business-root', to: 'education-root', type: 'management', label: '教育管理' },
      
      // 教育学科内部的丰富关系
      // 融合关系（粉色线）
      { id: 'pedagogy-tech', from: 'pedagogy', to: 'educational-tech', type: 'integration', label: '教学技术融合' },
      { id: 'tech-assessment', from: 'educational-tech', to: 'assessment', type: 'integration', label: '技术驱动评价' },
      { id: 'pedagogy-assessment', from: 'pedagogy', to: 'assessment', type: 'integration', label: '教学评价一体化' },
      
      // 方法论关系（蓝色线）
      { id: 'root-pedagogy', from: 'education-root', to: 'pedagogy', type: 'methodology', label: '教学方法理论' },
      { id: 'root-tech', from: 'education-root', to: 'educational-tech', type: 'methodology', label: '技术应用方法' },
      { id: 'assessment-pedagogy', from: 'assessment', to: 'pedagogy', type: 'methodology', label: '评价指导教学' },
      
      // 应用关系（浅蓝色线）
      { id: 'root-assessment', from: 'education-root', to: 'assessment', type: 'application', label: '教育质量保障' },
      { id: 'tech-pedagogy', from: 'educational-tech', to: 'pedagogy', type: 'application', label: '技术强化教学' },
      
      // 具体知识点间的连接
      { id: 'edtech-ai', from: 'educational-tech', to: 'ai-ml', type: 'application', label: 'AI教育应用' },
      { id: 'programming-data', from: 'programming', to: 'data-science', type: 'foundation', label: '编程基础' },
      { id: 'research-analysis', from: 'research-design', to: 'data-analysis', type: 'process', label: '研究流程' },
      { id: 'strategy-leadership', from: 'strategic-management', to: 'team-leadership', type: 'implementation', label: '战略执行' }
    ],
    metadata: {
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      totalNodes: nodes.length,
      totalResources: resources.length,
      categories: Object.keys(KNOWLEDGE_GRAPH_CATEGORIES).length
    }
  });

  return {
    graph,
    resources
  };
};