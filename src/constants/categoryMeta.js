// 统一的稳定分类键常量与 AI 元数据（不依赖中文名称）
import peanutIcon from '../../assets/果仁学伴.png';

// 所有逻辑仅以稳定的分类 key（value/slug）为准
export const CATEGORY_META = {
  organizational_training: {
    aiTitle: '小果仁',
    aiIcon: peanutIcon
  },
  teaching_research_office: {
    aiTitle: '教研助手'
  },
  training_needs_management: {
    aiTitle: '培训助理'
  }
};

export const getCategoryKey = (noteCategory, selectedCategory) => {
  // 坚持只用稳定 key，避免名称匹配；直接优先 note.category，否则使用 selectedCategory
  return noteCategory || selectedCategory || null;
};

export const getAiTitleForCategory = (key) => {
  if (!key) return '智能问答';
  return CATEGORY_META[key]?.aiTitle || '智能问答';
};

export const getAiIconForCategory = (key) => {
  if (!key) return null;
  return CATEGORY_META[key]?.aiIcon || null;
};