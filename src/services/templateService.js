// 主题模版服务
import { message } from 'antd';

// 默认模版数据
const DEFAULT_TEMPLATES = [
  {
    id: 'teaching-research',
    name: '教研智能体',
    description: '面向教学与教研场景的通用智能体',
    category: 'teaching_research',
    sourceTypes: ['文档', '视频', '链接'],
    smartTools: ['教学方案', '知识图谱', '智能写作'],
    usageCount: 156,
    createdAt: '2024-01-15',
    icon: 'BookOutlined',
    color: '#1890ff'
  },
  {
    id: 'class-teacher',
    name: '班主任智能体',
    description: '面向班级管理与家校沟通的班主任辅助智能体',
    category: 'class_management',
    sourceTypes: ['文档', '表格', '链接'],
    smartTools: ['班级管理', '阅卷工具', '教学助手'],
    usageCount: 120,
    createdAt: '2024-01-20',
    icon: 'TeamOutlined',
    color: '#52c41a'
  },
  {
    id: 'counselor',
    name: '辅导员智能体',
    description: '面向学生思想政治与事务管理的辅导员智能体',
    category: 'student_affairs',
    sourceTypes: ['文档', '链接', '音频'],
    smartTools: ['学生关怀', '智能写作', '效率提升'],
    usageCount: 234,
    createdAt: '2024-01-10',
    icon: 'UserOutlined',
    color: '#722ed1'
  },
  {
    id: 'supervisor',
    name: '督学智能体',
    description: '面向督导评估与质量监测的督学智能体',
    category: 'supervision',
    sourceTypes: ['文档', '链接', '表格'],
    smartTools: ['督导评估', '数据分析', '效率提升'],
    usageCount: 178,
    createdAt: '2024-01-25',
    icon: 'SettingOutlined',
    color: '#fa8c16'
  },
  {
    id: 'principal',
    name: '校长智能体',
    description: '面向学校治理与决策支持的校长智能体',
    category: 'governance',
    sourceTypes: ['文档', '视频', '链接'],
    smartTools: ['决策支持', '数据分析', '智能写作'],
    usageCount: 145,
    createdAt: '2024-01-30',
    icon: 'BulbOutlined',
    color: '#eb2f96'
  },
  {
    id: 'scientific-research',
    name: '科研智能体',
    description: '面向课题研究与成果管理的科研智能体',
    category: 'scientific_research',
    sourceTypes: ['文档', '链接', '图片'],
    smartTools: ['科研助手', '数据分析', '知识图谱'],
    usageCount: 198,
    createdAt: '2024-02-05',
    icon: 'BookOutlined',
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
    
    // 如果没有数据，使用默认
    if (templates.length === 0) {
      templates = DEFAULT_TEMPLATES;
      saveTemplatesToStorage(templates);
    }
    
    return {
      success: true,
      data: templates,
      message: '获取智能体列表成功'
    };
  } catch (error) {
    console.error('获取智能体列表失败:', error);
    return {
      success: false,
      data: [],
      message: '获取智能体列表失败'
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
        message: '获取智能体详情成功'
      };
    } else {
      return {
        success: false,
        data: null,
        message: '智能体不存在'
      };
    }
  } catch (error) {
    console.error('获取智能体详情失败:', error);
    return {
      success: false,
      data: null,
      message: '获取智能体详情失败'
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