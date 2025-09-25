// 能力模型的模拟数据
// 定义具体的能力节点和关联的课程视频

import {
  CapabilityNode,
  CourseVideo,
  CapabilityMap,
  CapabilityCategory,
  CapabilityLevel
} from '../types/capabilityModel.js';

// 生成能力节点的模拟数据
export const generateCapabilityNodes = () => {
  const nodes = [
    // 认知能力分支
    new CapabilityNode({
      id: 'cognitive-root',
      name: '认知能力',
      description: '学习、记忆、理解和应用知识的核心能力',
      category: CapabilityCategory.COGNITIVE,
      level: CapabilityLevel.INTERMEDIATE,
      position: { x: 0, y: 0 },
      color: '#667eea',
      icon: '🧠',
      children: ['logical-thinking', 'memory-skills', 'problem-solving']
    }),
    new CapabilityNode({
      id: 'logical-thinking',
      name: '逻辑思维',
      description: '运用逻辑推理分析问题的能力',
      category: CapabilityCategory.COGNITIVE,
      level: CapabilityLevel.INTERMEDIATE,
      parentId: 'cognitive-root',
      position: { x: -200, y: 150 },
      color: '#667eea',
      icon: '🔍',
      relatedVideos: ['logic-001', 'logic-002'],
      keywords: ['逻辑推理', '分析能力', '思维训练']
    }),
    new CapabilityNode({
      id: 'memory-skills',
      name: '记忆技能',
      description: '有效记忆和回忆信息的能力',
      category: CapabilityCategory.COGNITIVE,
      level: CapabilityLevel.BEGINNER,
      parentId: 'cognitive-root',
      position: { x: 0, y: 150 },
      color: '#667eea',
      icon: '🧩',
      relatedVideos: ['memory-001', 'memory-002'],
      keywords: ['记忆方法', '信息存储', '记忆宫殿']
    }),
    new CapabilityNode({
      id: 'problem-solving',
      name: '问题解决',
      description: '识别、分析和解决复杂问题的能力',
      category: CapabilityCategory.COGNITIVE,
      level: CapabilityLevel.ADVANCED,
      parentId: 'cognitive-root',
      position: { x: 200, y: 150 },
      color: '#667eea',
      icon: '⚡',
      relatedVideos: ['problem-001', 'problem-002', 'problem-003'],
      keywords: ['问题分析', '解决方案', '创新思维']
    }),

    // 情感能力分支
    new CapabilityNode({
      id: 'emotional-root',
      name: '情感能力',
      description: '理解和管理情绪的能力',
      category: CapabilityCategory.EMOTIONAL,
      level: CapabilityLevel.INTERMEDIATE,
      position: { x: 300, y: -200 },
      color: '#f093fb',
      icon: '❤️',
      children: ['emotional-intelligence', 'empathy', 'self-regulation']
    }),
    new CapabilityNode({
      id: 'emotional-intelligence',
      name: '情商',
      description: '识别、理解和管理情绪的能力',
      category: CapabilityCategory.EMOTIONAL,
      level: CapabilityLevel.INTERMEDIATE,
      parentId: 'emotional-root',
      position: { x: 200, y: -50 },
      color: '#f093fb',
      icon: '🎭',
      relatedVideos: ['eq-001', 'eq-002'],
      keywords: ['情绪管理', '自我认知', '情感智慧']
    }),
    new CapabilityNode({
      id: 'empathy',
      name: '同理心',
      description: '理解和感受他人情感的能力',
      category: CapabilityCategory.EMOTIONAL,
      level: CapabilityLevel.BEGINNER,
      parentId: 'emotional-root',
      position: { x: 350, y: -50 },
      color: '#f093fb',
      icon: '🤝',
      relatedVideos: ['empathy-001'],
      keywords: ['共情能力', '人际理解', '情感连接']
    }),
    new CapabilityNode({
      id: 'self-regulation',
      name: '自我调节',
      description: '控制和调节自己情绪和行为的能力',
      category: CapabilityCategory.EMOTIONAL,
      level: CapabilityLevel.ADVANCED,
      parentId: 'emotional-root',
      position: { x: 450, y: -50 },
      color: '#f093fb',
      icon: '⚖️',
      relatedVideos: ['regulation-001', 'regulation-002'],
      keywords: ['情绪控制', '自律', '心理调节']
    }),

    // 社交能力分支
    new CapabilityNode({
      id: 'social-root',
      name: '社交能力',
      description: '与他人有效互动和合作的能力',
      category: CapabilityCategory.SOCIAL,
      level: CapabilityLevel.INTERMEDIATE,
      position: { x: -300, y: -200 },
      color: '#4facfe',
      icon: '👥',
      children: ['teamwork', 'networking', 'conflict-resolution']
    }),
    new CapabilityNode({
      id: 'teamwork',
      name: '团队合作',
      description: '在团队中有效协作的能力',
      category: CapabilityCategory.SOCIAL,
      level: CapabilityLevel.INTERMEDIATE,
      parentId: 'social-root',
      position: { x: -450, y: -50 },
      color: '#4facfe',
      icon: '🤝',
      relatedVideos: ['team-001', 'team-002'],
      keywords: ['协作', '团队精神', '集体目标']
    }),
    new CapabilityNode({
      id: 'networking',
      name: '人脉建设',
      description: '建立和维护人际关系网络的能力',
      category: CapabilityCategory.SOCIAL,
      level: CapabilityLevel.ADVANCED,
      parentId: 'social-root',
      position: { x: -300, y: -50 },
      color: '#4facfe',
      icon: '🌐',
      relatedVideos: ['network-001'],
      keywords: ['人际关系', '社交网络', '关系维护']
    }),
    new CapabilityNode({
      id: 'conflict-resolution',
      name: '冲突解决',
      description: '处理和解决人际冲突的能力',
      category: CapabilityCategory.SOCIAL,
      level: CapabilityLevel.ADVANCED,
      parentId: 'social-root',
      position: { x: -150, y: -50 },
      color: '#4facfe',
      icon: '⚖️',
      relatedVideos: ['conflict-001', 'conflict-002'],
      keywords: ['冲突管理', '调解', '协商']
    }),

    // 沟通能力分支
    new CapabilityNode({
      id: 'communication-root',
      name: '沟通能力',
      description: '有效表达和理解信息的能力',
      category: CapabilityCategory.COMMUNICATION,
      level: CapabilityLevel.INTERMEDIATE,
      position: { x: 0, y: -400 },
      color: '#a8edea',
      icon: '💬',
      children: ['verbal-communication', 'written-communication', 'presentation']
    }),
    new CapabilityNode({
      id: 'verbal-communication',
      name: '口语表达',
      description: '清晰有效地口头表达想法的能力',
      category: CapabilityCategory.COMMUNICATION,
      level: CapabilityLevel.INTERMEDIATE,
      parentId: 'communication-root',
      position: { x: -150, y: -250 },
      color: '#a8edea',
      icon: '🗣️',
      relatedVideos: ['verbal-001', 'verbal-002'],
      keywords: ['口语表达', '演讲技巧', '言语沟通']
    }),
    new CapabilityNode({
      id: 'written-communication',
      name: '书面表达',
      description: '通过文字清晰表达想法的能力',
      category: CapabilityCategory.COMMUNICATION,
      level: CapabilityLevel.BEGINNER,
      parentId: 'communication-root',
      position: { x: 0, y: -250 },
      color: '#a8edea',
      icon: '✍️',
      relatedVideos: ['writing-001'],
      keywords: ['写作技巧', '文字表达', '文档撰写']
    }),
    new CapabilityNode({
      id: 'presentation',
      name: '演示技能',
      description: '有效进行演示和展示的能力',
      category: CapabilityCategory.COMMUNICATION,
      level: CapabilityLevel.ADVANCED,
      parentId: 'communication-root',
      position: { x: 150, y: -250 },
      color: '#a8edea',
      icon: '📊',
      relatedVideos: ['presentation-001', 'presentation-002'],
      keywords: ['演示技巧', 'PPT制作', '公众演讲']
    })
  ];

  return nodes;
};

// 生成课程视频的模拟数据
export const generateCourseVideos = () => {
  const videos = [
    // 逻辑思维相关视频
    new CourseVideo({
      id: 'logic-001',
      title: '逻辑思维训练基础',
      description: '掌握基本的逻辑推理方法和思维模式',
      duration: '45分钟',
      thumbnail: '/thumbnails/logic-basic.jpg',
      url: '/videos/logic-thinking-basic.mp4',
      author: '张教授',
      difficulty: CapabilityLevel.BEGINNER,
      tags: ['逻辑思维', '基础训练', '推理能力'],
      capabilityIds: ['logical-thinking']
    }),
    new CourseVideo({
      id: 'logic-002',
      title: '高级逻辑分析技巧',
      description: '学习复杂问题的逻辑分析方法',
      duration: '60分钟',
      thumbnail: '/thumbnails/logic-advanced.jpg',
      url: '/videos/logic-thinking-advanced.mp4',
      author: '李博士',
      difficulty: CapabilityLevel.ADVANCED,
      tags: ['逻辑分析', '高级技巧', '复杂推理'],
      capabilityIds: ['logical-thinking', 'problem-solving']
    }),

    // 记忆技能相关视频
    new CourseVideo({
      id: 'memory-001',
      title: '记忆宫殿法入门',
      description: '学习古老而有效的记忆宫殿记忆法',
      duration: '35分钟',
      thumbnail: '/thumbnails/memory-palace.jpg',
      url: '/videos/memory-palace.mp4',
      author: '王老师',
      difficulty: CapabilityLevel.BEGINNER,
      tags: ['记忆宫殿', '记忆方法', '学习技巧'],
      capabilityIds: ['memory-skills']
    }),
    new CourseVideo({
      id: 'memory-002',
      title: '联想记忆技巧',
      description: '通过联想建立强大的记忆网络',
      duration: '40分钟',
      thumbnail: '/thumbnails/memory-association.jpg',
      url: '/videos/memory-association.mp4',
      author: '陈专家',
      difficulty: CapabilityLevel.INTERMEDIATE,
      tags: ['联想记忆', '记忆网络', '思维导图'],
      capabilityIds: ['memory-skills']
    }),

    // 问题解决相关视频
    new CourseVideo({
      id: 'problem-001',
      title: '问题解决框架',
      description: '系统性问题解决的思维框架和方法',
      duration: '50分钟',
      thumbnail: '/thumbnails/problem-framework.jpg',
      url: '/videos/problem-solving-framework.mp4',
      author: '刘教授',
      difficulty: CapabilityLevel.INTERMEDIATE,
      tags: ['问题解决', '思维框架', '系统思维'],
      capabilityIds: ['problem-solving']
    }),
    new CourseVideo({
      id: 'problem-002',
      title: '创新解决方案设计',
      description: '设计创新和突破性解决方案的方法',
      duration: '55分钟',
      thumbnail: '/thumbnails/creative-solutions.jpg',
      url: '/videos/creative-problem-solving.mp4',
      author: '赵博士',
      difficulty: CapabilityLevel.ADVANCED,
      tags: ['创新思维', '解决方案', '设计思维'],
      capabilityIds: ['problem-solving', 'creative-root']
    }),
    new CourseVideo({
      id: 'problem-003',
      title: '复杂问题分解技巧',
      description: '将复杂问题分解为可管理的小问题',
      duration: '45分钟',
      thumbnail: '/thumbnails/problem-decomposition.jpg',
      url: '/videos/problem-decomposition.mp4',
      author: '孙老师',
      difficulty: CapabilityLevel.INTERMEDIATE,
      tags: ['问题分解', '系统分析', '结构化思维'],
      capabilityIds: ['problem-solving', 'logical-thinking']
    }),

    // 情商相关视频
    new CourseVideo({
      id: 'eq-001',
      title: '情商基础训练',
      description: '提升情绪识别和管理的基础能力',
      duration: '40分钟',
      thumbnail: '/thumbnails/eq-basic.jpg',
      url: '/videos/emotional-intelligence-basic.mp4',
      author: '马心理师',
      difficulty: CapabilityLevel.BEGINNER,
      tags: ['情商', '情绪管理', '自我认知'],
      capabilityIds: ['emotional-intelligence']
    }),
    new CourseVideo({
      id: 'eq-002',
      title: '高级情商应用',
      description: '在工作和生活中应用情商的高级技巧',
      duration: '60分钟',
      thumbnail: '/thumbnails/eq-advanced.jpg',
      url: '/videos/emotional-intelligence-advanced.mp4',
      author: '周专家',
      difficulty: CapabilityLevel.ADVANCED,
      tags: ['情商应用', '人际关系', '领导力'],
      capabilityIds: ['emotional-intelligence', 'leadership-root']
    }),

    // 团队合作相关视频
    new CourseVideo({
      id: 'team-001',
      title: '高效团队协作',
      description: '建立和维护高效团队协作的方法',
      duration: '50分钟',
      thumbnail: '/thumbnails/teamwork.jpg',
      url: '/videos/effective-teamwork.mp4',
      author: '吴经理',
      difficulty: CapabilityLevel.INTERMEDIATE,
      tags: ['团队合作', '协作技巧', '团队建设'],
      capabilityIds: ['teamwork']
    }),
    new CourseVideo({
      id: 'team-002',
      title: '跨文化团队管理',
      description: '在多元文化环境中管理团队的技巧',
      duration: '55分钟',
      thumbnail: '/thumbnails/cross-cultural-team.jpg',
      url: '/videos/cross-cultural-teamwork.mp4',
      author: '林主管',
      difficulty: CapabilityLevel.ADVANCED,
      tags: ['跨文化', '团队管理', '多元化'],
      capabilityIds: ['teamwork', 'leadership-root']
    })
  ];

  return videos;
};

// 生成完整的能力地图
export const generateCapabilityMap = () => {
  const nodes = generateCapabilityNodes();
  const videos = generateCourseVideos();
  
  // 建立视频与节点的关联
  nodes.forEach(node => {
    if (node.relatedVideos && node.relatedVideos.length > 0) {
      node.relatedVideos = node.relatedVideos.map(videoId => 
        videos.find(video => video.id === videoId)
      ).filter(Boolean);
    }
  });

  const map = new CapabilityMap({
    id: 'default-capability-map',
    name: '综合能力发展地图',
    description: '涵盖认知、情感、社交、沟通等多维度能力的发展路径',
    nodes: nodes,
    connections: [
      // 根节点之间的连接
      { id: 'cognitive-emotional', from: 'cognitive-root', to: 'emotional-root', type: 'synergy' },
      { id: 'emotional-social', from: 'emotional-root', to: 'social-root', type: 'synergy' },
      { id: 'social-communication', from: 'social-root', to: 'communication-root', type: 'synergy' },
      { id: 'communication-cognitive', from: 'communication-root', to: 'cognitive-root', type: 'synergy' },
      
      // 具体能力之间的连接
      { id: 'logic-problem', from: 'logical-thinking', to: 'problem-solving', type: 'dependency' },
      { id: 'empathy-team', from: 'empathy', to: 'teamwork', type: 'support' },
      { id: 'eq-regulation', from: 'emotional-intelligence', to: 'self-regulation', type: 'dependency' },
      { id: 'verbal-presentation', from: 'verbal-communication', to: 'presentation', type: 'dependency' }
    ],
    metadata: {
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      totalNodes: nodes.length,
      totalVideos: videos.length
    }
  });

  return {
    map,
    videos
  };
};