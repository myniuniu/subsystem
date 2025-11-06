// 统一的稳定分类键常量与 AI 元数据（不依赖中文名称）
// 使用 public 目录中的静态资源，构建后路径稳定为 /assets/...
const assistantStudentIcon = '/assets/果仁学伴.png';
const trainingAssistantIcon = '/assets/培训助理.png';
const researchAssistantIcon = '/assets/教研助理.png';
const evaluationAssistantIcon = '/assets/评阅助手.png';

// 所有逻辑仅以稳定的分类 key（value/slug）为准
export const CATEGORY_META = {
  organizational_training: {
    aiTitle: '小果仁',
    aiIcon: assistantStudentIcon
  },
  teaching_research_office: {
    aiTitle: '教研助手',
    aiIcon: researchAssistantIcon
  },
  training_needs_management: {
    aiTitle: '培训助理',
    aiIcon: trainingAssistantIcon
  },
  // 督学分类：显示“督学专家”与对应头像
  supervision: {
    aiTitle: '督学专家',
    aiIcon: '/assets/督学专家.png'
  },
  // E-PBL 课程融合
  e_pbl: {
    aiTitle: '课程融合',
    aiIcon: trainingAssistantIcon
  },
  // 我的评阅分类：AI标题改为“评阅助手”
  my_evaluation: {
    aiTitle: '评阅助手',
    aiIcon: evaluationAssistantIcon
  }
};

export const getCategoryKey = (noteCategory, selectedCategory) => {
  // 归一化中文名称为稳定 key，并优先使用 selectedCategory
  const normalize = (key) => {
    if (!key) return null;
    const map = {
      '组织培训': 'organizational_training',
      '培训需求管理': 'training_needs_management',
      '教学研究室': 'teaching_research_office',
      'E-PBL': 'e_pbl',
      '我的评阅': 'my_evaluation',
      '学习广场': 'learning_square',
      // 系统固定分类中文 -> 稳定 key
      '工作主题': 'work',
      '学习主题': 'study',
      '个人主题': 'personal',
      '想法灵感': 'ideas',
      '收藏主题': 'starred',
      '能力模型': 'capability_model',
      '知识图谱': 'knowledge_graph',
      '微专业': 'micro_major'
    };
    return map[key] || key;
  };
  const selected = normalize(selectedCategory);
  const note = normalize(noteCategory);
  return selected || note || null;
};

export const getAiTitleForCategory = (key) => {
  if (!key) return '智能问答';
  return CATEGORY_META[key]?.aiTitle || '智能问答';
};

export const getAiIconForCategory = (key) => {
  if (!key) return null;
  return CATEGORY_META[key]?.aiIcon || null;
};