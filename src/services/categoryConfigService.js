// 系统分类配置服务：负责系统分类分组与一级分组模板绑定

const STORAGE_KEY = 'smartnotes_system_category_config';

// 默认系统分类分组配置（不包含组织培训）
export const DEFAULT_SYSTEM_CATEGORY_CONFIG = {
  groups: [
    { key: 'group_learning', title: '学习相关', templateId: null, icon: 'FolderOpenOutlined', childrenValues: ['study', 'learning_square', 'learning_analytics'], groups: [] },
    { key: 'group_teaching', title: '教学相关', templateId: null, icon: 'FolderOpenOutlined', childrenValues: ['teaching_design', 'my_evaluation', 'classroom_integration', 'homework_system', 'teaching_research_office', 'e_pbl'], groups: [] },
    { key: 'group_research', title: '科研与教育', templateId: null, icon: 'FolderOpenOutlined', childrenValues: ['research', 'educational_topics'], groups: [] },
    { key: 'group_general', title: '通用主题', templateId: null, icon: 'FolderOpenOutlined', childrenValues: ['work', 'personal', 'ideas', 'meeting'], groups: [] },
    { key: 'group_management', title: '管理与培训', templateId: null, icon: 'FolderOpenOutlined', childrenValues: ['training_needs_management', 'training_product_development'], groups: [] }
  ],
  extraCategories: [
    { value: 'e_pbl', label: 'E-PBL', icon: 'BookOutlined', type: 'system', pinned: true },
    { value: 'teaching_research_office', label: '教研室', icon: 'BookOutlined', type: 'custom', pinned: true },
    { value: 'my_evaluation', label: '我的评阅', icon: 'FileTextOutlined', type: 'system', pinned: true }
  ]
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
      type: item.type || 'system',  // 保留原有的type，默认为system
      // 保留置顶相关属性
      ...(item.pinned !== undefined && { pinned: Boolean(item.pinned) }),
      ...(item.pinnedAt && { pinnedAt: item.pinnedAt })
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
    // 基础配置（默认或归一化后的用户配置）
    let baseConfig;
    if (!raw) {
      baseConfig = DEFAULT_SYSTEM_CATEGORY_CONFIG;
    } else {
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.groups)) {
        baseConfig = DEFAULT_SYSTEM_CATEGORY_CONFIG;
      } else {
        baseConfig = normalizeConfig(parsed);
      }
    }

    // 确保 e_pbl 在“教学相关”一级分组下
    const ensureGroups = (groups = []) => groups.map(g => {
      if (g.key === 'group_teaching') {
        const setChildren = new Set(g.childrenValues || []);
        // 强制包含 e_pbl 与 my_evaluation 两个系统分类
        setChildren.add('e_pbl');
        setChildren.add('my_evaluation');
        return { ...g, childrenValues: Array.from(setChildren), groups: ensureGroups(g.groups || []) };
      }
      return { ...g, groups: ensureGroups(g.groups || []) };
    });

    // 确保 e_pbl 与 my_evaluation 分类默认置顶（extraCategories）
    const extra = Array.isArray(baseConfig.extraCategories) ? baseConfig.extraCategories : [];
    const hasEPBL = extra.some(c => c.value === 'e_pbl');
    const hasMyEvaluation = extra.some(c => c.value === 'my_evaluation');
    let nextExtra = extra;
    // 处理 e_pbl
    nextExtra = hasEPBL
      ? nextExtra.map(c => c.value === 'e_pbl' ? { ...c, pinned: true } : c)
      : [{ value: 'e_pbl', label: 'E-PBL', icon: 'BookOutlined', type: 'system', pinned: true }, ...nextExtra];
    // 处理 my_evaluation
    nextExtra = hasMyEvaluation
      ? nextExtra.map(c => c.value === 'my_evaluation' ? { ...c, pinned: true } : c)
      : [{ value: 'my_evaluation', label: '我的评阅', icon: 'FileTextOutlined', type: 'system', pinned: true }, ...nextExtra];

    const ensured = {
      groups: ensureGroups(baseConfig.groups || []),
      extraCategories: nextExtra
    };

    return ensured;
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