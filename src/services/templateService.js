// 主题模版服务
import { message } from 'antd';

// 默认模版数据
const DEFAULT_TEMPLATES = [
  {
    id: 'training-management',
    name: '培训需求与培训管理',
    description: '专为教师培训需求分析和培训管理设计的主题模版',
    category: 'training',
    sourceTypes: ['文档', '视频', '链接'],
    smartTools: ['AI总结', '知识图谱', '学习路径规划'],
    usageCount: 156,
    createdAt: '2024-01-15',
    icon: 'TeamOutlined',
    color: '#1890ff'
  },
  {
    id: 'personal-organization',
    name: '个人组织培训',
    description: '个人组织和参与培训活动的管理模版',
    category: 'organization',
    sourceTypes: ['文档', '表格', '视频'],
    smartTools: ['进度跟踪', '效果评估', '反馈收集'],
    usageCount: 89,
    createdAt: '2024-01-20',
    icon: 'UserOutlined',
    color: '#52c41a'
  },
  {
    id: 'personal-work',
    name: '个人工作管理',
    description: '教师个人工作任务和项目管理模版',
    category: 'work',
    sourceTypes: ['文档', '表格', '链接', '图片'],
    smartTools: ['任务规划', '时间管理', '工作总结'],
    usageCount: 234,
    createdAt: '2024-01-10',
    icon: 'SettingOutlined',
    color: '#722ed1'
  },
  {
    id: 'personal-study',
    name: '个人学习提升',
    description: '教师个人专业发展和学习提升模版',
    category: 'study',
    sourceTypes: ['文档', '视频', '链接', '音频'],
    smartTools: ['学习笔记', '知识整理', '复习提醒'],
    usageCount: 178,
    createdAt: '2024-01-25',
    icon: 'BookOutlined',
    color: '#fa8c16'
  },
  {
    id: 'comprehensive-development',
    name: '教师综合能力发展',
    description: '教师综合素质和能力全面发展模版',
    category: 'comprehensive',
    sourceTypes: ['文档', '视频', '链接', '表格', '图片'],
    smartTools: ['能力评估', '发展规划', '成长记录', '反思总结'],
    usageCount: 145,
    createdAt: '2024-01-30',
    icon: 'BulbOutlined',
    color: '#eb2f96'
  }
];

// 从localStorage获取模版数据
export const getTemplatesFromStorage = () => {
  try {
    const savedTemplates = localStorage.getItem('theme-templates');
    if (savedTemplates) {
      return JSON.parse(savedTemplates);
    }
    return [];
  } catch (error) {
    console.error('获取模版数据失败:', error);
    return [];
  }
};

// 保存模版数据到localStorage
export const saveTemplatesToStorage = (templates) => {
  try {
    localStorage.setItem('theme-templates', JSON.stringify(templates));
    return true;
  } catch (error) {
    console.error('保存模版数据失败:', error);
    return false;
  }
};

// 获取所有可用模版
export const getAvailableTemplates = async () => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 首先尝试从localStorage获取
    let templates = getTemplatesFromStorage();
    
    // 如果没有数据，使用默认模版
    if (templates.length === 0) {
      templates = DEFAULT_TEMPLATES;
      saveTemplatesToStorage(templates);
    }
    
    return {
      success: true,
      data: templates,
      message: '获取模版列表成功'
    };
  } catch (error) {
    console.error('获取模版列表失败:', error);
    return {
      success: false,
      data: [],
      message: '获取模版列表失败'
    };
  }
};

// 根据ID获取特定模版
export const getTemplateById = async (templateId) => {
  try {
    const templates = getTemplatesFromStorage();
    const template = templates.find(t => t.id === templateId);
    
    if (template) {
      return {
        success: true,
        data: template,
        message: '获取模版详情成功'
      };
    } else {
      return {
        success: false,
        data: null,
        message: '模版不存在'
      };
    }
  } catch (error) {
    console.error('获取模版详情失败:', error);
    return {
      success: false,
      data: null,
      message: '获取模版详情失败'
    };
  }
};

// 创建新模版
export const createTemplate = async (templateData) => {
  try {
    const templates = getTemplatesFromStorage();
    const newTemplate = {
      id: `template-${Date.now()}`,
      ...templateData,
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    const updatedTemplates = [...templates, newTemplate];
    const saved = saveTemplatesToStorage(updatedTemplates);
    
    if (saved) {
      return {
        success: true,
        data: newTemplate,
        message: '创建模版成功'
      };
    } else {
      return {
        success: false,
        data: null,
        message: '保存模版失败'
      };
    }
  } catch (error) {
    console.error('创建模版失败:', error);
    return {
      success: false,
      data: null,
      message: '创建模版失败'
    };
  }
};

// 更新模版使用次数
export const updateTemplateUsage = async (templateId) => {
  try {
    const templates = getTemplatesFromStorage();
    const updatedTemplates = templates.map(template => {
      if (template.id === templateId) {
        return {
          ...template,
          usageCount: (template.usageCount || 0) + 1
        };
      }
      return template;
    });
    
    const saved = saveTemplatesToStorage(updatedTemplates);
    
    if (saved) {
      return {
        success: true,
        message: '更新使用次数成功'
      };
    } else {
      return {
        success: false,
        message: '更新使用次数失败'
      };
    }
  } catch (error) {
    console.error('更新模版使用次数失败:', error);
    return {
      success: false,
      message: '更新使用次数失败'
    };
  }
};

// 获取热门模版（按使用次数排序）
export const getPopularTemplates = async (limit = 5) => {
  try {
    const result = await getAvailableTemplates();
    if (result.success) {
      const sortedTemplates = result.data
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        .slice(0, limit);
      
      return {
        success: true,
        data: sortedTemplates,
        message: '获取热门模版成功'
      };
    } else {
      return result;
    }
  } catch (error) {
    console.error('获取热门模版失败:', error);
    return {
      success: false,
      data: [],
      message: '获取热门模版失败'
    };
  }
};

// 搜索模版
export const searchTemplates = async (keyword) => {
  try {
    const result = await getAvailableTemplates();
    if (result.success) {
      const filteredTemplates = result.data.filter(template => 
        template.name.toLowerCase().includes(keyword.toLowerCase()) ||
        template.description.toLowerCase().includes(keyword.toLowerCase()) ||
        template.category.toLowerCase().includes(keyword.toLowerCase())
      );
      
      return {
        success: true,
        data: filteredTemplates,
        message: '搜索模版成功'
      };
    } else {
      return result;
    }
  } catch (error) {
    console.error('搜索模版失败:', error);
    return {
      success: false,
      data: [],
      message: '搜索模版失败'
    };
  }
};