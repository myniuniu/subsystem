// 模拟仿真开放平台场景服务
// 提供场景的创建、发布、管理等功能

// 模拟数据存储
let scenarioStorage = {
  scenarios: [
    {
      id: 'user-1',
      title: '小学数学几何图形认知',
      description: '通过3D模型帮助小学生理解基本几何图形的特征和关系',
      category: 'science_demo',
      subject: 'math',
      author: '张老师',
      authorId: 'teacher-001',
      createTime: '2024-01-15',
      updateTime: '2024-01-15',
      status: 'published', // draft, review, published, rejected
      views: 245,
      likes: 18,
      downloads: 32,
      difficulty: 'easy',
      duration: '20分钟',
      tags: ['数学', '几何', '3D模型', '小学'],
      thumbnail: '/assets/模拟仿真封面/生成主题封面 (1).png',
      rating: 4.5,
      reviewCount: 12,
      isOriginal: true,
      license: 'CC BY-SA 4.0',
      learningObjectives: '学生能够识别和描述基本几何图形的特征，理解图形之间的关系',
      prerequisites: '基本的数学概念，能够使用电脑进行简单操作',
      publishNote: '首次发布，包含完整的3D交互模型',
      allowComments: true,
      allowDerivatives: true,
      notifyOnUpdate: true,
      content: {
        htmlFile: '/scenarios/math-geometry/index.html',
        assets: ['/scenarios/math-geometry/models/', '/scenarios/math-geometry/textures/'],
        config: {
          interactionMode: '3d',
          supportedDevices: ['desktop', 'tablet'],
          minSystemRequirements: 'WebGL 2.0'
        }
      },
      // 互动仿真相关字段
      simulationUrl: 'https://demo.simulation.com/math-geometry', // 互动仿真地址
      sourceAttachment: null, // 源码附件信息
      deploymentStatus: 'deployed' // 部署状态: pending, deploying, deployed, failed
    },
    {
      id: 'user-2', 
      title: '化学分子结构可视化',
      description: '通过交互式3D分子模型学习化学分子结构和化学键',
      category: 'science_demo',
      subject: 'chemistry',
      author: '李教授',
      authorId: 'teacher-002',
      createTime: '2024-01-10',
      updateTime: '2024-01-12',
      status: 'review',
      views: 0,
      likes: 0,
      downloads: 0,
      difficulty: 'medium',
      duration: '35分钟',
      tags: ['化学', '分子结构', '3D可视化', '高中'],
      thumbnail: '/assets/模拟仿真封面/生成主题封面 (2).png',
      rating: 0,
      reviewCount: 0,
      isOriginal: true,
      license: 'CC BY-NC 4.0',
      learningObjectives: '理解分子结构的基本概念，掌握化学键的类型和特点',
      prerequisites: '高中化学基础知识，了解原子结构',
      publishNote: '更新了分子动画效果，增加了更多化学键类型',
      allowComments: true,
      allowDerivatives: false,
      notifyOnUpdate: true,
      content: {
        htmlFile: '/scenarios/chemistry-molecules/index.html',
        assets: ['/scenarios/chemistry-molecules/models/', '/scenarios/chemistry-molecules/data/'],
        config: {
          interactionMode: '3d',
          supportedDevices: ['desktop'],
          minSystemRequirements: 'WebGL 2.0, 4GB RAM'
        }
      },
      // 互动仿真相关字段
      simulationUrl: null, // 互动仿真地址
      sourceAttachment: {
        fileName: 'chemistry-molecules-v2.zip',
        fileSize: '15.2MB',
        uploadTime: '2024-01-12',
        deploymentUrl: 'https://auto-deploy.simulation.com/chemistry-molecules'
      }, // 源码附件信息
      deploymentStatus: 'deploying' // 部署状态: pending, deploying, deployed, failed
    },
    {
      id: 'user-3',
      title: '物理光学实验仿真',
      description: '通过虚拟实验环境学习光的折射、反射和干涉现象',
      category: 'science_demo',
      subject: 'physics',
      author: '王教授',
      authorId: 'teacher-003',
      createTime: '2024-01-20',
      updateTime: '2024-01-20',
      status: 'published',
      views: 189,
      likes: 25,
      downloads: 41,
      difficulty: 'medium',
      duration: '45分钟',
      tags: ['物理', '光学', '实验仿真', '高中'],
      thumbnail: '/assets/模拟仿真封面/生成主题封面 (3).png',
      rating: 4.7,
      reviewCount: 18,
      isOriginal: true,
      license: 'CC BY 4.0',
      learningObjectives: '理解光的基本性质，掌握光学实验的基本原理和方法',
      prerequisites: '高中物理基础，了解波动理论',
      publishNote: '包含多个经典光学实验的仿真',
      allowComments: true,
      allowDerivatives: true,
      notifyOnUpdate: true,
      content: {
        htmlFile: '/scenarios/physics-optics/index.html',
        assets: ['/scenarios/physics-optics/simulations/', '/scenarios/physics-optics/data/'],
        config: {
          interactionMode: '3d',
          supportedDevices: ['desktop', 'tablet'],
          minSystemRequirements: 'WebGL 2.0'
        }
      },
      simulationUrl: 'https://demo.simulation.com/physics-optics',
      sourceAttachment: null,
      deploymentStatus: 'deployed'
    },
    {
      id: 'user-4',
      title: '生物细胞结构探索',
      description: '通过3D细胞模型深入了解细胞的内部结构和功能',
      category: 'science_demo',
      subject: 'biology',
      author: '陈博士',
      authorId: 'teacher-004',
      createTime: '2024-01-18',
      updateTime: '2024-01-18',
      status: 'published',
      views: 312,
      likes: 34,
      downloads: 58,
      difficulty: 'easy',
      duration: '30分钟',
      tags: ['生物', '细胞结构', '3D模型', '初中'],
      thumbnail: '/assets/模拟仿真封面/生成主题封面 (4).png',
      rating: 4.6,
      reviewCount: 22,
      isOriginal: true,
      license: 'CC BY-SA 4.0',
      learningObjectives: '认识细胞的基本结构，理解各细胞器的功能',
      prerequisites: '初中生物基础知识',
      publishNote: '高清3D细胞模型，支持多角度观察',
      allowComments: true,
      allowDerivatives: true,
      notifyOnUpdate: true,
      content: {
        htmlFile: '/scenarios/biology-cell/index.html',
        assets: ['/scenarios/biology-cell/models/', '/scenarios/biology-cell/textures/'],
        config: {
          interactionMode: '3d',
          supportedDevices: ['desktop', 'tablet', 'mobile'],
          minSystemRequirements: 'WebGL 1.0'
        }
      },
      simulationUrl: 'https://demo.simulation.com/biology-cell',
      sourceAttachment: null,
      deploymentStatus: 'deployed'
    },
    {
      id: 'user-5',
      title: '地理信息系统实践',
      description: '学习GIS基础操作，掌握地理数据的采集、处理和分析方法',
      category: 'science_demo',
      subject: 'geography',
      author: '刘教授',
      authorId: 'teacher-005',
      createTime: '2024-01-22',
      updateTime: '2024-01-22',
      status: 'published',
      views: 156,
      likes: 19,
      downloads: 28,
      difficulty: 'hard',
      duration: '60分钟',
      tags: ['地理', 'GIS', '数据分析', '大学'],
      thumbnail: '/assets/模拟仿真封面/生成主题封面 (5).png',
      rating: 4.4,
      reviewCount: 15,
      isOriginal: true,
      license: 'CC BY-NC 4.0',
      learningObjectives: '掌握GIS软件的基本操作，能够进行简单的地理数据分析',
      prerequisites: '地理学基础，计算机操作能力',
      publishNote: '包含真实地理数据案例',
      allowComments: true,
      allowDerivatives: false,
      notifyOnUpdate: true,
      content: {
        htmlFile: '/scenarios/geography-gis/index.html',
        assets: ['/scenarios/geography-gis/data/', '/scenarios/geography-gis/tools/'],
        config: {
          interactionMode: '2d',
          supportedDevices: ['desktop'],
          minSystemRequirements: '4GB RAM, 现代浏览器'
        }
      },
      simulationUrl: 'https://demo.simulation.com/geography-gis',
      sourceAttachment: null,
      deploymentStatus: 'deployed'
    },
    {
      id: 'user-6',
      title: '认知心理学实验设计',
      description: '通过虚拟实验环境学习认知心理学的经典实验设计和数据分析',
      category: 'psychology',
      subject: 'other',
      author: '赵博士',
      authorId: 'teacher-006',
      createTime: '2024-01-25',
      updateTime: '2024-01-25',
      status: 'published',
      views: 98,
      likes: 12,
      downloads: 15,
      difficulty: 'medium',
      duration: '50分钟',
      tags: ['心理学', '实验设计', '认知科学', '大学'],
      thumbnail: '/assets/模拟仿真封面/生成主题封面.png',
      rating: 4.3,
      reviewCount: 8,
      isOriginal: true,
      license: 'CC BY 4.0',
      learningObjectives: '理解认知心理学实验的基本原理，掌握实验设计方法',
      prerequisites: '心理学基础，统计学知识',
      publishNote: '包含多个经典认知实验的仿真',
      allowComments: true,
      allowDerivatives: true,
      notifyOnUpdate: true,
      content: {
        htmlFile: '/scenarios/psychology-cognitive/index.html',
        assets: ['/scenarios/psychology-cognitive/experiments/', '/scenarios/psychology-cognitive/data/'],
        config: {
          interactionMode: '2d',
          supportedDevices: ['desktop', 'tablet'],
          minSystemRequirements: '现代浏览器'
        }
      },
      simulationUrl: 'https://demo.simulation.com/psychology-cognitive',
      sourceAttachment: null,
      deploymentStatus: 'deployed'
    },
    {
      id: 'user-7',
      title: '网页设计基础教程',
      description: '从零开始学习HTML、CSS和JavaScript，创建响应式网页',
      category: 'teacher',
      subject: 'other',
      author: '孙老师',
      authorId: 'teacher-007',
      createTime: '2024-01-28',
      updateTime: '2024-01-28',
      status: 'published',
      views: 267,
      likes: 31,
      downloads: 45,
      difficulty: 'easy',
      duration: '90分钟',
      tags: ['网页设计', 'HTML', 'CSS', 'JavaScript'],
      thumbnail: '/images/web-design-thumb.svg',
      rating: 4.8,
      reviewCount: 25,
      isOriginal: true,
      license: 'CC BY-SA 4.0',
      learningObjectives: '掌握网页设计的基本技能，能够创建简单的响应式网页',
      prerequisites: '计算机基础操作',
      publishNote: '包含完整的代码示例和练习',
      allowComments: true,
      allowDerivatives: true,
      notifyOnUpdate: true,
      content: {
        htmlFile: '/scenarios/web-design/index.html',
        assets: ['/scenarios/web-design/examples/', '/scenarios/web-design/resources/'],
        config: {
          interactionMode: 'code',
          supportedDevices: ['desktop'],
          minSystemRequirements: '现代浏览器，代码编辑器'
        }
      },
      simulationUrl: 'https://demo.simulation.com/web-design',
      sourceAttachment: null,
      deploymentStatus: 'deployed'
    },
    {
      id: 'user-8',
      title: '机器学习算法可视化',
      description: '通过交互式图表和动画展示常见机器学习算法的工作原理',
      category: 'science_demo',
      subject: 'other',
      author: '张老师',
      authorId: 'teacher-008',
      createTime: '2024-01-30',
      updateTime: '2024-01-30',
      status: 'published',
      views: 156,
      likes: 23,
      downloads: 18,
      difficulty: 'hard',
      duration: '75分钟',
      tags: ['机器学习', '算法', '可视化', '人工智能'],
      thumbnail: '/images/default-scenario.svg',
      rating: 4.6,
      reviewCount: 14,
      isOriginal: true,
      license: 'CC BY 4.0',
      learningObjectives: '理解机器学习算法的基本原理，掌握算法选择和应用方法',
      prerequisites: '数学基础，编程基础',
      publishNote: '包含决策树、神经网络等多种算法的可视化演示',
      allowComments: true,
      allowDerivatives: true,
      notifyOnUpdate: true,
      content: {
        htmlFile: '/scenarios/ml-algorithms/index.html',
        assets: ['/scenarios/ml-algorithms/visualizations/', '/scenarios/ml-algorithms/datasets/'],
        config: {
          interactionMode: '2d',
          supportedDevices: ['desktop', 'tablet'],
          minSystemRequirements: '现代浏览器，4GB RAM'
        }
      },
      simulationUrl: 'https://demo.simulation.com/ml-algorithms',
      sourceAttachment: null,
      deploymentStatus: 'deployed'
    },
    {
      id: 'user-9',
      title: '古代历史文明探索',
      description: '通过3D重建技术探索古代文明的建筑、文化和社会生活',
      category: 'science_demo',
      subject: 'history',
      author: '历史学教授',
      authorId: 'teacher-009',
      createTime: '2024-02-01',
      updateTime: '2024-02-01',
      status: 'review',
      views: 0,
      likes: 0,
      downloads: 0,
      difficulty: 'medium',
      duration: '60分钟',
      tags: ['历史', '古代文明', '3D重建', '文化'],
      thumbnail: '/images/default-scenario.svg',
      rating: 0,
      reviewCount: 0,
      isOriginal: true,
      license: 'CC BY-SA 4.0',
      learningObjectives: '了解古代文明的发展历程，理解历史文化的传承',
      prerequisites: '历史基础知识',
      publishNote: '首次提交，包含埃及、希腊、罗马等文明的3D场景',
      allowComments: true,
      allowDerivatives: true,
      notifyOnUpdate: true,
      content: {
        htmlFile: '/scenarios/ancient-civilizations/index.html',
        assets: ['/scenarios/ancient-civilizations/models/', '/scenarios/ancient-civilizations/textures/'],
        config: {
          interactionMode: '3d',
          supportedDevices: ['desktop'],
          minSystemRequirements: 'WebGL 2.0, 8GB RAM'
        }
      },
      simulationUrl: null,
      sourceAttachment: {
        fileName: 'ancient-civilizations-v1.zip',
        fileSize: '45.8MB',
        uploadTime: '2024-02-01',
        deploymentUrl: 'https://auto-deploy.simulation.com/ancient-civilizations'
      },
      deploymentStatus: 'pending'
    }
  ],
  nextId: 10
}

// 模拟用户数据
const currentUser = {
  id: 'teacher-001', // 修改为与场景数据匹配的ID
  name: '张老师',
  role: 'teacher',
  permissions: ['create', 'publish', 'manage']
}

// 场景状态枚举
const SCENARIO_STATUS = {
  DRAFT: 'draft',
  REVIEW: 'review', 
  PUBLISHED: 'published',
  REJECTED: 'rejected'
}

// 难度等级枚举
const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
}

// 场景分类枚举
const SCENARIO_CATEGORIES = {
  SCIENCE_DEMO: 'science_demo',
  PSYCHOLOGY: 'psychology',
  FAMILY: 'family',
  TEACHER: 'teacher',
  MANAGEMENT: 'management',
  LEADERSHIP: 'leadership',
  SPECIAL: 'special'
}

// 学科枚举
const SUBJECTS = {
  MATH: 'math',
  PHYSICS: 'physics',
  CHEMISTRY: 'chemistry',
  BIOLOGY: 'biology',
  GEOGRAPHY: 'geography',
  HISTORY: 'history',
  LANGUAGE: 'language',
  ART: 'art',
  OTHER: 'other'
}

// 模拟API延迟
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// 生成唯一ID
const generateId = () => {
  return `user-${scenarioStorage.nextId++}`
}

// 获取当前时间字符串
const getCurrentTime = () => {
  return new Date().toISOString().split('T')[0]
}

// 验证场景数据
const validateScenarioData = (data) => {
  const required = ['title', 'description', 'category', 'subject', 'difficulty', 'duration', 'license']
  const missing = required.filter(field => !data[field])
  
  if (missing.length > 0) {
    throw new Error(`缺少必填字段: ${missing.join(', ')}`)
  }
  
  if (data.title.length < 5 || data.title.length > 100) {
    throw new Error('标题长度应在5-100字符之间')
  }
  
  if (data.description.length < 20 || data.description.length > 500) {
    throw new Error('描述长度应在20-500字符之间')
  }
  
  if (!Object.values(SCENARIO_CATEGORIES).includes(data.category)) {
    throw new Error('无效的场景分类')
  }
  
  if (!Object.values(SUBJECTS).includes(data.subject)) {
    throw new Error('无效的学科领域')
  }
  
  if (!Object.values(DIFFICULTY_LEVELS).includes(data.difficulty)) {
    throw new Error('无效的难度等级')
  }
  
  // 验证互动仿真相关字段
  if (!data.simulationUrl && !data.sourceAttachment) {
    throw new Error('必须提供互动仿真地址或源码附件')
  }
  
  if (data.simulationUrl) {
    const urlPattern = /^https?:\/\/.+/
    if (!urlPattern.test(data.simulationUrl)) {
      throw new Error('互动仿真地址格式不正确，必须以http://或https://开头')
    }
  }
  
  if (data.sourceAttachment) {
    const allowedExtensions = ['.zip', '.rar', '.tar.gz', '.7z']
    const fileName = data.sourceAttachment.fileName || ''
    const hasValidExtension = allowedExtensions.some(ext => fileName.toLowerCase().endsWith(ext))
    
    if (!hasValidExtension) {
      throw new Error('源码附件必须是压缩文件格式（.zip, .rar, .tar.gz, .7z）')
    }
    
    // 检查文件大小（假设以MB为单位）
    const fileSize = parseFloat(data.sourceAttachment.fileSize)
    if (fileSize > 100) {
      throw new Error('源码附件大小不能超过100MB')
    }
  }
  
  return true
}

// 场景服务类
class ScenarioService {
  
  // 模拟部署过程
  simulateDeployment(deploymentId, fileName) {
    console.log(`开始自动部署源码附件: ${fileName} (部署ID: ${deploymentId})`)
    
    // 模拟部署过程：3-8秒后完成部署
    const deploymentTime = Math.random() * 5000 + 3000 // 3-8秒
    
    setTimeout(() => {
      // 查找对应的场景并更新部署状态
      const scenario = scenarioStorage.scenarios.find(s => 
        s.sourceAttachment && s.sourceAttachment.deploymentId === deploymentId
      )
      
      if (scenario) {
        // 模拟部署成功/失败（90%成功率）
        const deploymentSuccess = Math.random() > 0.1
        
        if (deploymentSuccess) {
          scenario.deploymentStatus = 'deployed'
          scenario.simulationUrl = scenario.sourceAttachment.deploymentUrl
          console.log(`部署成功: ${fileName} -> ${scenario.simulationUrl}`)
        } else {
          scenario.deploymentStatus = 'failed'
          console.log(`部署失败: ${fileName}`)
        }
        
        scenario.updateTime = getCurrentTime()
      }
    }, deploymentTime)
  }
  
  // 获取所有场景
  async getAllScenarios(filters = {}) {
    await simulateDelay()
    
    let scenarios = [...scenarioStorage.scenarios]
    
    // 应用过滤器
    if (filters.status) {
      scenarios = scenarios.filter(s => s.status === filters.status)
    }
    
    if (filters.category) {
      scenarios = scenarios.filter(s => s.category === filters.category)
    }
    
    if (filters.subject) {
      scenarios = scenarios.filter(s => s.subject === filters.subject)
    }
    
    if (filters.difficulty) {
      scenarios = scenarios.filter(s => s.difficulty === filters.difficulty)
    }
    
    if (filters.authorId) {
      scenarios = scenarios.filter(s => s.authorId === filters.authorId)
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      scenarios = scenarios.filter(s => 
        s.title.toLowerCase().includes(searchTerm) ||
        s.description.toLowerCase().includes(searchTerm) ||
        s.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }
    
    // 排序
    if (filters.sortBy) {
      scenarios.sort((a, b) => {
        switch (filters.sortBy) {
          case 'createTime':
            return new Date(b.createTime) - new Date(a.createTime)
          case 'updateTime':
            return new Date(b.updateTime) - new Date(a.updateTime)
          case 'views':
            return b.views - a.views
          case 'likes':
            return b.likes - a.likes
          case 'rating':
            return b.rating - a.rating
          case 'title':
            return a.title.localeCompare(b.title)
          default:
            return 0
        }
      })
    }
    
    return {
      success: true,
      data: scenarios,
      total: scenarios.length
    }
  }
  
  // 获取用户的场景
  async getUserScenarios(userId = currentUser.id, filters = {}) {
    await simulateDelay()
    
    const userFilters = { ...filters, authorId: userId }
    return this.getAllScenarios(userFilters)
  }
  
  // 获取单个场景详情
  async getScenarioById(id) {
    await simulateDelay()
    
    const scenario = scenarioStorage.scenarios.find(s => s.id === id)
    
    if (!scenario) {
      return {
        success: false,
        error: '场景不存在'
      }
    }
    
    return {
      success: true,
      data: scenario
    }
  }
  
  // 创建新场景
  async createScenario(scenarioData) {
    await simulateDelay(800)
    
    try {
      // 验证数据
      validateScenarioData(scenarioData)
      
      // 处理互动仿真相关字段
      let deploymentStatus = 'pending'
      let finalSimulationUrl = scenarioData.simulationUrl
      let processedSourceAttachment = scenarioData.sourceAttachment
      
      // 如果提供了源码附件，启动自动部署流程
      if (scenarioData.sourceAttachment) {
        deploymentStatus = 'deploying'
        
        // 生成部署URL
        const deploymentId = generateId()
        const deploymentUrl = `https://auto-deploy.simulation.com/${deploymentId}`
        
        // 更新源码附件信息，添加部署URL
        processedSourceAttachment = {
          ...scenarioData.sourceAttachment,
          deploymentUrl: deploymentUrl,
          deploymentId: deploymentId
        }
        
        // 模拟自动部署过程
        this.simulateDeployment(deploymentId, scenarioData.sourceAttachment.fileName)
        
        // 如果没有提供仿真地址，使用部署后的地址
        if (!finalSimulationUrl) {
          finalSimulationUrl = deploymentUrl
        }
      } else if (scenarioData.simulationUrl) {
        deploymentStatus = 'deployed'
      }
      
      // 创建场景对象
      const newScenario = {
        id: generateId(),
        ...scenarioData,
        author: currentUser.name,
        authorId: currentUser.id,
        createTime: getCurrentTime(),
        updateTime: getCurrentTime(),
        status: SCENARIO_STATUS.DRAFT,
        views: 0,
        likes: 0,
        downloads: 0,
        rating: 0,
        reviewCount: 0,
        isOriginal: true,
        // 默认设置
        allowComments: true,
        allowDerivatives: true,
        notifyOnUpdate: true,
        // 互动仿真相关字段
        simulationUrl: finalSimulationUrl || null,
        sourceAttachment: processedSourceAttachment || null,
        deploymentStatus: deploymentStatus
      }
      
      // 保存到存储
      scenarioStorage.scenarios.unshift(newScenario)
      
      return {
        success: true,
        data: newScenario,
        message: '场景创建成功'
      }
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // 更新场景
  async updateScenario(id, updateData) {
    await simulateDelay(600)
    
    try {
      const scenarioIndex = scenarioStorage.scenarios.findIndex(s => s.id === id)
      
      if (scenarioIndex === -1) {
        return {
          success: false,
          error: '场景不存在'
        }
      }
      
      const scenario = scenarioStorage.scenarios[scenarioIndex]
      
      // 检查权限
      if (scenario.authorId !== currentUser.id && !currentUser.permissions.includes('admin')) {
        return {
          success: false,
          error: '没有权限修改此场景'
        }
      }
      
      // 验证更新数据
      if (updateData.title || updateData.description || updateData.category) {
        validateScenarioData({ ...scenario, ...updateData })
      }
      
      // 更新场景
      const updatedScenario = {
        ...scenario,
        ...updateData,
        updateTime: getCurrentTime()
      }
      
      scenarioStorage.scenarios[scenarioIndex] = updatedScenario
      
      return {
        success: true,
        data: updatedScenario,
        message: '场景更新成功'
      }
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // 发布场景（提交审核）
  async publishScenario(id, publishData = {}) {
    await simulateDelay(1000)
    
    try {
      const scenarioIndex = scenarioStorage.scenarios.findIndex(s => s.id === id)
      
      if (scenarioIndex === -1) {
        return {
          success: false,
          error: '场景不存在'
        }
      }
      
      const scenario = scenarioStorage.scenarios[scenarioIndex]
      
      // 检查权限
      if (scenario.authorId !== currentUser.id) {
        return {
          success: false,
          error: '没有权限发布此场景'
        }
      }
      
      // 检查状态
      if (scenario.status !== SCENARIO_STATUS.DRAFT && scenario.status !== SCENARIO_STATUS.REJECTED) {
        return {
          success: false,
          error: '只能发布草稿状态或被拒绝的场景'
        }
      }
      
      // 更新场景状态
      const updatedScenario = {
        ...scenario,
        ...publishData,
        status: SCENARIO_STATUS.REVIEW,
        updateTime: getCurrentTime()
      }
      
      scenarioStorage.scenarios[scenarioIndex] = updatedScenario
      
      // 模拟自动审核通过（实际应该是人工审核）
      setTimeout(() => {
        const currentScenario = scenarioStorage.scenarios.find(s => s.id === id)
        if (currentScenario && currentScenario.status === SCENARIO_STATUS.REVIEW) {
          currentScenario.status = SCENARIO_STATUS.PUBLISHED
          currentScenario.updateTime = getCurrentTime()
        }
      }, 3000) // 3秒后自动通过审核
      
      return {
        success: true,
        data: updatedScenario,
        message: '场景已提交审核'
      }
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // 删除场景
  async deleteScenario(id) {
    await simulateDelay(400)
    
    try {
      const scenarioIndex = scenarioStorage.scenarios.findIndex(s => s.id === id)
      
      if (scenarioIndex === -1) {
        return {
          success: false,
          error: '场景不存在'
        }
      }
      
      const scenario = scenarioStorage.scenarios[scenarioIndex]
      
      // 检查权限
      if (scenario.authorId !== currentUser.id && !currentUser.permissions.includes('admin')) {
        return {
          success: false,
          error: '没有权限删除此场景'
        }
      }
      
      // 检查状态（已发布的场景不能删除，只能下架）
      if (scenario.status === SCENARIO_STATUS.PUBLISHED) {
        return {
          success: false,
          error: '已发布的场景不能删除，请联系管理员下架'
        }
      }
      
      // 删除场景
      scenarioStorage.scenarios.splice(scenarioIndex, 1)
      
      return {
        success: true,
        message: '场景删除成功'
      }
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // 点赞场景
  async likeScenario(id) {
    await simulateDelay(200)
    
    const scenarioIndex = scenarioStorage.scenarios.findIndex(s => s.id === id)
    
    if (scenarioIndex === -1) {
      return {
        success: false,
        error: '场景不存在'
      }
    }
    
    scenarioStorage.scenarios[scenarioIndex].likes += 1
    
    return {
      success: true,
      data: {
        likes: scenarioStorage.scenarios[scenarioIndex].likes
      },
      message: '点赞成功'
    }
  }
  
  // 增加浏览量
  async incrementViews(id) {
    await simulateDelay(100)
    
    const scenarioIndex = scenarioStorage.scenarios.findIndex(s => s.id === id)
    
    if (scenarioIndex !== -1) {
      scenarioStorage.scenarios[scenarioIndex].views += 1
    }
    
    return {
      success: true,
      data: {
        views: scenarioStorage.scenarios[scenarioIndex]?.views || 0
      }
    }
  }
  
  // 增加下载量
  async incrementDownloads(id) {
    await simulateDelay(100)
    
    const scenarioIndex = scenarioStorage.scenarios.findIndex(s => s.id === id)
    
    if (scenarioIndex !== -1) {
      scenarioStorage.scenarios[scenarioIndex].downloads += 1
    }
    
    return {
      success: true,
      data: {
        downloads: scenarioStorage.scenarios[scenarioIndex]?.downloads || 0
      }
    }
  }
  
  // 获取平台统计数据
  async getPlatformStats() {
    await simulateDelay(300)
    
    const scenarios = scenarioStorage.scenarios
    const publishedScenarios = scenarios.filter(s => s.status === SCENARIO_STATUS.PUBLISHED)
    
    const stats = {
      totalScenarios: publishedScenarios.length,
      totalContributors: new Set(scenarios.map(s => s.authorId)).size,
      totalDownloads: scenarios.reduce((sum, s) => sum + s.downloads, 0),
      totalViews: scenarios.reduce((sum, s) => sum + s.views, 0),
      totalLikes: scenarios.reduce((sum, s) => sum + s.likes, 0),
      averageRating: scenarios.length > 0 
        ? scenarios.reduce((sum, s) => sum + s.rating, 0) / scenarios.length 
        : 0,
      monthlyActive: Math.floor(Math.random() * 50) + 20, // 模拟数据
      categoryStats: {},
      subjectStats: {},
      difficultyStats: {}
    }
    
    // 统计各分类数量
    Object.values(SCENARIO_CATEGORIES).forEach(category => {
      stats.categoryStats[category] = publishedScenarios.filter(s => s.category === category).length
    })
    
    // 统计各学科数量
    Object.values(SUBJECTS).forEach(subject => {
      stats.subjectStats[subject] = publishedScenarios.filter(s => s.subject === subject).length
    })
    
    // 统计各难度数量
    Object.values(DIFFICULTY_LEVELS).forEach(difficulty => {
      stats.difficultyStats[difficulty] = publishedScenarios.filter(s => s.difficulty === difficulty).length
    })
    
    return {
      success: true,
      data: stats
    }
  }
  
  // 获取贡献者排行榜
  async getTopContributors(limit = 10) {
    await simulateDelay(200)
    
    const contributorMap = new Map()
    
    // 贡献者基础信息映射
    const contributorProfiles = {
      'teacher-001': {
        name: '张老师',
        avatar: '👨‍🏫',
        institution: '北京师范大学',
        specialty: '数学教育',
        joinDate: '2023-09-01',
        bio: '专注于小学数学教学方法研究，擅长3D可视化教学'
      },
      'teacher-002': {
        name: '李教授',
        avatar: '👩‍🔬',
        institution: '清华大学',
        specialty: '化学实验',
        joinDate: '2023-08-15',
        bio: '化学教育专家，致力于分子结构可视化研究'
      },
      'teacher-003': {
        name: '王教授',
        avatar: '🔬',
        institution: '中科院',
        specialty: '物理仿真',
        joinDate: '2023-10-01',
        bio: '物理实验仿真领域资深专家，光学研究权威'
      },
      'teacher-004': {
        name: '陈博士',
        avatar: '🧬',
        institution: '复旦大学',
        specialty: '生物科学',
        joinDate: '2023-09-20',
        bio: '生物教学创新者，细胞结构3D建模专家'
      },
      'teacher-005': {
        name: '刘教授',
        avatar: '🌍',
        institution: '北京大学',
        specialty: '地理信息',
        joinDate: '2023-07-10',
        bio: 'GIS技术应用专家，地理教育数字化先驱'
      },
      'teacher-006': {
        name: '赵博士',
        avatar: '🧠',
        institution: '华东师范大学',
        specialty: '心理学',
        joinDate: '2023-11-05',
        bio: '认知心理学研究者，实验设计方法专家'
      },
      'teacher-007': {
        name: '孙老师',
        avatar: '💻',
        institution: '上海交通大学',
        specialty: '计算机教育',
        joinDate: '2023-06-01',
        bio: '前端开发教学专家，响应式设计倡导者'
      }
    }
    
    // 统计每个贡献者的数据
    scenarioStorage.scenarios.forEach(scenario => {
      if (!contributorMap.has(scenario.authorId)) {
        const profile = contributorProfiles[scenario.authorId] || {
          name: scenario.author,
          avatar: '👤',
          institution: '未知机构',
          specialty: '通用教育',
          joinDate: '2024-01-01',
          bio: '教育工作者'
        }
        
        contributorMap.set(scenario.authorId, {
          id: scenario.authorId,
          name: profile.name,
          avatar: profile.avatar,
          institution: profile.institution,
          specialty: profile.specialty,
          joinDate: profile.joinDate,
          bio: profile.bio,
          scenarios: 0,
          publishedScenarios: 0,
          downloads: 0,
          likes: 0,
          views: 0,
          totalRating: 0,
          ratingCount: 0,
          subjects: new Set(),
          categories: new Set(),
          difficultyDistribution: { easy: 0, medium: 0, hard: 0 },
          level: 'beginner',
          badges: [],
          lastActiveDate: scenario.updateTime
        })
      }
      
      const contributor = contributorMap.get(scenario.authorId)
      contributor.scenarios += 1
      
      if (scenario.status === 'published') {
        contributor.publishedScenarios += 1
        contributor.downloads += scenario.downloads
        contributor.likes += scenario.likes
        contributor.views += scenario.views
        
        if (scenario.rating > 0) {
          contributor.totalRating += scenario.rating
          contributor.ratingCount += 1
        }
      }
      
      // 收集专业领域和类别
      contributor.subjects.add(scenario.subject)
      contributor.categories.add(scenario.category)
      contributor.difficultyDistribution[scenario.difficulty] += 1
      
      // 更新最后活跃时间
      if (scenario.updateTime > contributor.lastActiveDate) {
        contributor.lastActiveDate = scenario.updateTime
      }
    })
    
    // 计算综合评分和等级
    const contributors = Array.from(contributorMap.values()).map(contributor => {
      // 平均评分
      contributor.rating = contributor.ratingCount > 0 
        ? contributor.totalRating / contributor.ratingCount 
        : 0
      
      // 转换Set为Array
      contributor.subjects = Array.from(contributor.subjects)
      contributor.categories = Array.from(contributor.categories)
      
      // 计算活跃度（基于最后活跃时间）
      const daysSinceLastActive = Math.floor(
        (new Date() - new Date(contributor.lastActiveDate)) / (1000 * 60 * 60 * 24)
      )
      contributor.activityScore = Math.max(0, 100 - daysSinceLastActive * 2)
      
      // 综合评分算法
      const scenarioScore = contributor.publishedScenarios * 10 // 发布场景基础分
      const popularityScore = Math.log(contributor.downloads + 1) * 5 + contributor.likes * 2 // 人气分
      const qualityScore = contributor.rating * contributor.ratingCount * 3 // 质量分
      const diversityScore = (contributor.subjects.length + contributor.categories.length) * 2 // 多样性分
      const activityBonus = contributor.activityScore * 0.5 // 活跃度奖励
      
      contributor.totalScore = Math.round(
        scenarioScore + popularityScore + qualityScore + diversityScore + activityBonus
      )
      
      // 根据综合评分确定等级和徽章
      contributor.badges = []
      
      if (contributor.totalScore >= 500) {
        contributor.level = 'expert'
        contributor.badges.push('🏆 平台专家')
      } else if (contributor.totalScore >= 300) {
        contributor.level = 'advanced'
        contributor.badges.push('⭐ 高级贡献者')
      } else if (contributor.totalScore >= 150) {
        contributor.level = 'intermediate'
        contributor.badges.push('📈 进阶作者')
      } else {
        contributor.level = 'beginner'
        contributor.badges.push('🌱 新手作者')
      }
      
      // 特殊成就徽章
      if (contributor.publishedScenarios >= 5) {
        contributor.badges.push('📚 多产作者')
      }
      if (contributor.rating >= 4.5 && contributor.ratingCount >= 10) {
        contributor.badges.push('⭐ 高质量作者')
      }
      if (contributor.downloads >= 200) {
        contributor.badges.push('🔥 人气作者')
      }
      if (contributor.subjects.length >= 3) {
        contributor.badges.push('🎯 全能教师')
      }
      if (contributor.activityScore >= 90) {
        contributor.badges.push('💪 活跃贡献者')
      }
      
      return contributor
    })
    
    // 按综合评分排序
    contributors.sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore
      }
      // 评分相同时按发布场景数排序
      if (b.publishedScenarios !== a.publishedScenarios) {
        return b.publishedScenarios - a.publishedScenarios
      }
      // 再按下载量排序
      return b.downloads - a.downloads
    })
    
    return {
      success: true,
      data: contributors.slice(0, limit)
    }
  }
}

// 创建服务实例
const scenarioService = new ScenarioService()

// 导出服务实例和常量
export default scenarioService
export {
  SCENARIO_STATUS,
  DIFFICULTY_LEVELS,
  SCENARIO_CATEGORIES,
  SUBJECTS
}