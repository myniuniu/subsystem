// 系统分类配置服务：负责系统分类分组与一级分组模板绑定

const STORAGE_KEY = 'smartnotes_system_category_config';

// 默认系统分类分组配置（不包含组织培训）
export const DEFAULT_SYSTEM_CATEGORY_CONFIG = {
  groups: [
    { key: 'group_learning', title: '学习相关', templateId: null, icon: 'FolderOpenOutlined', childrenValues: ['study', 'learning_square', 'learning_analytics'], groups: [] },
    { key: 'group_teaching', title: '教学相关', templateId: null, icon: 'FolderOpenOutlined', childrenValues: ['teaching_design', 'classroom_integration', 'homework_system', 'teaching_research_office'], groups: [] },
    { key: 'group_research', title: '科研与教育', templateId: null, icon: 'FolderOpenOutlined', childrenValues: ['research', 'educational_topics'], groups: [] },
    { key: 'group_general', title: '通用主题', templateId: null, icon: 'FolderOpenOutlined', childrenValues: ['work', 'personal', 'ideas', 'meeting'], groups: [] },
    { key: 'group_management', title: '管理与培训', templateId: null, icon: 'FolderOpenOutlined', childrenValues: ['training_needs_management', 'training_product_development'], groups: [] }
  ],
  extraCategories: []
};

// 归一化补全分组结构：仅一级分组允许 templateId，其余层级强制为 null
const normalizeConfig = (config) => {
  const normalizeGroups = (groups = [], depth = 1) => groups.map(g => ({
    key: g.key,
    title: g.title,
    templateId: depth === 1 ? (g.templateId ?? null) : null,
    icon: typeof g.icon === 'string' ? g.icon : null,
    childrenValues: Array.isArray(g.childrenValues) ? g.childrenValues : [],
    groups: normalizeGroups(g.groups || [], depth + 1)
  }));
  const normalizeExtra = (extra = []) => {
    return (Array.isArray(extra) ? extra : []).map(item => ({
      value: String(item.value || '').trim(),
      label: String(item.label || '').trim() || String(item.value || '').trim(),
      icon: typeof item.icon === 'string' ? item.icon : 'FileTextOutlined',
      type: 'system'
    })).filter(item => item.value);
  };
  return {
    groups: normalizeGroups(config?.groups || [], 1),
    extraCategories: normalizeExtra(config?.extraCategories || [])
  };
};

export const getSystemCategoryConfig = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SYSTEM_CATEGORY_CONFIG;
    const parsed = JSON.parse(raw);
    // 结构容错与归一化
    if (!parsed || !Array.isArray(parsed.groups)) {
      return DEFAULT_SYSTEM_CATEGORY_CONFIG;
    }
    return normalizeConfig(parsed);
  } catch (e) {
    console.error('读取系统分类配置失败:', e);
    return DEFAULT_SYSTEM_CATEGORY_CONFIG;
  }
};

export const saveSystemCategoryConfig = (config) => {
  try {
    const normalized = normalizeConfig(config);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return true;
  } catch (e) {
    console.error('保存系统分类配置失败:', e);
    return false;
  }
};

export const resetSystemCategoryConfig = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('重置系统分类配置失败:', e);
    return false;
  }
};