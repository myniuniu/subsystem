// 简易的内存标签服务，提供CRUD、搜索、校验、关系与统计
// 注意：该服务为前端模拟，后续可替换为真实后端API调用
import { initialResources } from '../data/resourceLibraryData';

let _idCounter = 1000;

// 简易实体库（演示用）：实体包含标题与关联的标签ID列表
const entitiesDB = [
  { id: 2001, title: '混合式教学实践案例', tags: [18, 19] },
  { id: 2002, title: '家校沟通工作指南', tags: [23] },
  { id: 2003, title: '课堂纪律提升方案', tags: [21] },
  { id: 2004, title: '项目式学习设计样例', tags: [17] },
  { id: 2005, title: 'PPT课件制作规范', tags: [24, 30] },
];

const tagsDB = [
  // 顶层：教育培训
  { id: 1, name: '教育培训', aliases: [], parentId: null, enabled: true, weight: 80, entityCount: 500, synonyms: [], mutex: [] },
  // 一级分类
  { id: 2, name: '教师发展', aliases: [], parentId: 1, enabled: true, weight: 70, entityCount: 220, synonyms: [], mutex: [] },
  { id: 3, name: '教研活动', aliases: [], parentId: 1, enabled: true, weight: 65, entityCount: 200, synonyms: [], mutex: [] },
  { id: 4, name: '课程设计', aliases: [], parentId: 1, enabled: true, weight: 60, entityCount: 260, synonyms: [], mutex: [] },
  { id: 5, name: '课堂管理', aliases: [], parentId: 1, enabled: true, weight: 55, entityCount: 180, synonyms: [], mutex: [] },
  { id: 6, name: '教学工具', aliases: [], parentId: 1, enabled: true, weight: 50, entityCount: 190, synonyms: [], mutex: [] },

  // 教师发展子类
  { id: 7, name: '继续教育', aliases: [], parentId: 2, enabled: true, weight: 60, entityCount: 120, synonyms: [], mutex: [] },
  { id: 8, name: '校本研修', aliases: [], parentId: 2, enabled: true, weight: 58, entityCount: 110, synonyms: [], mutex: [] },
  { id: 9, name: '职称评审', aliases: [], parentId: 2, enabled: true, weight: 40, entityCount: 90, synonyms: [], mutex: [] },
  { id: 10, name: '教师资格', aliases: [], parentId: 2, enabled: true, weight: 40, entityCount: 85, synonyms: [], mutex: [] },

  // 教研活动子类
  { id: 11, name: '听课评课', aliases: [], parentId: 3, enabled: true, weight: 55, entityCount: 100, synonyms: [], mutex: [] },
  { id: 12, name: '说课', aliases: [], parentId: 3, enabled: true, weight: 50, entityCount: 95, synonyms: [], mutex: [] },
  { id: 13, name: '备课', aliases: [], parentId: 3, enabled: true, weight: 60, entityCount: 150, synonyms: [], mutex: [] },
  { id: 14, name: '教学反思', aliases: [], parentId: 3, enabled: true, weight: 52, entityCount: 130, synonyms: [], mutex: [] },

  // 课程设计子类
  { id: 15, name: '教学目标', aliases: [], parentId: 4, enabled: true, weight: 60, entityCount: 140, synonyms: [], mutex: [] },
  { id: 16, name: '学情分析', aliases: [], parentId: 4, enabled: true, weight: 55, entityCount: 125, synonyms: [], mutex: [] },
  { id: 17, name: '项目式学习', aliases: ['pbl','项目化学习'], parentId: 4, enabled: true, weight: 62, entityCount: 115, synonyms: [], mutex: [] },
  { id: 18, name: '混合式教学', aliases: [], parentId: 4, enabled: true, weight: 58, entityCount: 120, synonyms: [], mutex: [] },
  { id: 19, name: '线上教学', aliases: ['online'], parentId: 4, enabled: true, weight: 50, entityCount: 160, synonyms: [], mutex: [20] },
  { id: 20, name: '线下教学', aliases: ['offline'], parentId: 4, enabled: true, weight: 50, entityCount: 155, synonyms: [], mutex: [19] },

  // 课堂管理子类
  { id: 21, name: '课堂纪律', aliases: [], parentId: 5, enabled: true, weight: 50, entityCount: 130, synonyms: [], mutex: [] },
  { id: 22, name: '作业批改', aliases: [], parentId: 5, enabled: true, weight: 55, entityCount: 140, synonyms: [], mutex: [] },
  { id: 23, name: '家校沟通', aliases: [], parentId: 5, enabled: true, weight: 52, entityCount: 125, synonyms: [], mutex: [] },

  // 教学工具子类
  { id: 24, name: 'PPT', aliases: [], parentId: 6, enabled: true, weight: 45, entityCount: 170, synonyms: [], mutex: [] },
  { id: 25, name: '白板', aliases: [], parentId: 6, enabled: true, weight: 40, entityCount: 90, synonyms: [], mutex: [] },
  { id: 26, name: 'LMS', aliases: ['学习管理系统'], parentId: 6, enabled: true, weight: 55, entityCount: 105, synonyms: [], mutex: [] },
  { id: 27, name: 'MOOC', aliases: [], parentId: 6, enabled: true, weight: 48, entityCount: 95, synonyms: [], mutex: [] },
  { id: 28, name: '题库', aliases: [], parentId: 6, enabled: true, weight: 50, entityCount: 160, synonyms: [], mutex: [] },
  { id: 29, name: '微课制作', aliases: [], parentId: 6, enabled: true, weight: 47, entityCount: 100, synonyms: [], mutex: [] },
  { id: 30, name: '课件制作', aliases: [], parentId: 6, enabled: true, weight: 49, entityCount: 150, synonyms: [], mutex: [] },
];

const getAll = () => [...tagsDB];

const getTree = () => {
  const nodes = getAll();
  const byParent = new Map();
  nodes.forEach(t => {
    const list = byParent.get(t.parentId) || [];
    list.push(t);
    byParent.set(t.parentId, list);
  });
  const build = (parentId, level = 0) => {
    const children = (byParent.get(parentId) || []).sort((a, b) => (b.weight || 0) - (a.weight || 0));
    return children.map(c => ({
      ...c,
      level,
      children: build(c.id, level + 1)
    }));
  };
  return build(null, 0);
};

const findById = (id) => tagsDB.find(t => t.id === id) || null;

const validateNameUnique = (name, excludeId = null) => {
  const normalized = name.trim().toLowerCase();
  return !tagsDB.some(t => t.name.trim().toLowerCase() === normalized && t.id !== excludeId);
};

const normalizeAliases = (aliasesInput = '') => {
  const arr = aliasesInput.split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.toLowerCase());
  // 去重：大小写不敏感，以首个形态为准
  const seen = new Set();
  const out = [];
  for (const a of arr) {
    if (!seen.has(a)) {
      seen.add(a);
      out.push(a);
    }
  }
  // 保持首字母大写的常用形式，如 js -> JS
  return out.map(a => a === 'js' ? 'JS' : a);
};

const search = (q) => {
  const query = (q || '').trim().toLowerCase();
  if (!query) return getAll();
  return tagsDB.filter(t => {
    const inName = t.name.toLowerCase().includes(query);
    const inAlias = (t.aliases || []).some(a => (a || '').toLowerCase().includes(query));
    return inName || inAlias;
  });
};

const create = ({ name, aliases = '', parentId = null, enabled = true, weight = 0 }) => {
  const trimmed = (name || '').trim();
  if (!trimmed) throw new Error('标签名称必填');
  if (!validateNameUnique(trimmed)) throw new Error('该标签已存在');
  const id = ++_idCounter;
  const newTag = {
    id,
    name: trimmed,
    aliases: normalizeAliases(aliases),
    parentId: parentId || null,
    enabled: !!enabled,
    weight: Number(weight) || 0,
    entityCount: 0,
    synonyms: [],
    mutex: []
  };
  tagsDB.push(newTag);
  return newTag;
};

const update = (id, updates) => {
  const tag = findById(id);
  if (!tag) throw new Error('标签不存在');
  if (updates.name) {
    const trimmed = updates.name.trim();
    if (!validateNameUnique(trimmed, id)) throw new Error('该标签已存在');
    tag.name = trimmed;
  }
  if (typeof updates.aliases === 'string') tag.aliases = normalizeAliases(updates.aliases);
  if (updates.parentId !== undefined) tag.parentId = updates.parentId || null;
  if (updates.enabled !== undefined) tag.enabled = !!updates.enabled;
  if (updates.weight !== undefined) tag.weight = Number(updates.weight) || 0;
  return { ...tag };
};

const removeMany = (ids = []) => {
  const idSet = new Set(ids);
  for (let i = tagsDB.length - 1; i >= 0; i--) {
    if (idSet.has(tagsDB[i].id)) tagsDB.splice(i, 1);
  }
};

const setEnabledMany = (ids = [], enabled = true) => {
  const idSet = new Set(ids);
  tagsDB.forEach(t => { if (idSet.has(t.id)) t.enabled = !!enabled; });
};

const linkSynonym = (id, synonymId) => {
  const tag = findById(id);
  const syn = findById(synonymId);
  if (!tag || !syn) throw new Error('标签不存在');
  // 防止一个标签成为自己同义词
  if (id === synonymId) throw new Error('不能设置自身为同义词');
  // 防止同义词已绑定其他标签（简化规则：若对方已有同义词则提示）
  if ((syn.synonyms || []).length > 0 && !(syn.synonyms || []).includes(id)) throw new Error('该同义词已关联其他标签');
  tag.synonyms = Array.from(new Set([...(tag.synonyms || []), synonymId]));
  syn.synonyms = Array.from(new Set([...(syn.synonyms || []), id]));
  return { ...tag };
};

const unlinkSynonym = (id, synonymId) => {
  const tag = findById(id);
  const syn = findById(synonymId);
  if (!tag || !syn) return;
  tag.synonyms = (tag.synonyms || []).filter(s => s !== synonymId);
  syn.synonyms = (syn.synonyms || []).filter(s => s !== id);
};

const setMutex = (id, mutexId, on = true) => {
  const tag = findById(id);
  const other = findById(mutexId);
  if (!tag || !other) throw new Error('标签不存在');
  if (id === mutexId) throw new Error('不能设置自身为互斥');
  if (on) {
    tag.mutex = Array.from(new Set([...(tag.mutex || []), mutexId]));
    other.mutex = Array.from(new Set([...(other.mutex || []), id]));
  } else {
    tag.mutex = (tag.mutex || []).filter(s => s !== mutexId);
    other.mutex = (other.mutex || []).filter(s => s !== id);
  }
  return { ...tag };
};

const suggestTagsForEntity = (text = '', history = []) => {
  const lower = (text || '').toLowerCase();
  const byContent = tagsDB.filter(t => lower.includes(t.name.toLowerCase())).slice(0, 5);
  const byHistory = (history || []).map(h => findById(h)).filter(Boolean).slice(0, 5);
  // 合并去重，按权重与实体数排序
  const merged = Array.from(new Set([...byContent.map(t => t.id), ...byHistory.map(t => t.id)]))
    .map(id => findById(id))
    .filter(Boolean)
    .sort((a, b) => (b.entityCount || 0) - (a.entityCount || 0));
  return merged.slice(0, 8);
};

const getStats = () => {
  const all = getAll();
  const total = all.length;
  const enabled = all.filter(t => t.enabled).length;
  const todayNew = 3; // demo数据
  const entityTotal = all.reduce((sum, t) => sum + (t.entityCount || 0), 0);
  const top10 = [...all].sort((a, b) => (b.entityCount || 0) - (a.entityCount || 0)).slice(0, 10);
  const levelCounts = () => {
    const tree = getTree();
    const counts = {};
    const walk = (nodes, level = 0) => {
      nodes.forEach(n => {
        counts[level] = (counts[level] || 0) + 1;
        walk(n.children || [], level + 1);
      });
    };
    walk(tree, 0);
    return counts;
  };
  return { total, enabled, todayNew, entityTotal, top10, levelCounts: levelCounts() };
};

// === 标签实体关系相关（演示用） ===
const getEntitiesByTag = (tagId) => entitiesDB.filter(e => (e.tags || []).includes(tagId));

const attachTagToEntity = (entityId, tagId) => {
  const e = entitiesDB.find(x => x.id === entityId);
  const t = findById(tagId);
  if (!e || !t) throw new Error('实体或标签不存在');
  if (!(e.tags || []).includes(tagId)) {
    e.tags = [...(e.tags || []), tagId];
    t.entityCount = (t.entityCount || 0) + 1;
  }
  return { ...e };
};

const detachTagFromEntity = (entityId, tagId) => {
  const e = entitiesDB.find(x => x.id === entityId);
  const t = findById(tagId);
  if (!e || !t) throw new Error('实体或标签不存在');
  if ((e.tags || []).includes(tagId)) {
    e.tags = (e.tags || []).filter(x => x !== tagId);
    t.entityCount = Math.max(0, (t.entityCount || 0) - 1);
  }
  return { ...e };
};

const createEntity = (title) => {
  const id = ++_idCounter;
  const e = { id, title: (title || '').trim() || `未命名实体${id}`, tags: [] };
  entitiesDB.push(e);
  return e;
};

const attachTagToEntityByTitle = (title, tagId) => {
  const trimmed = (title || '').trim().toLowerCase();
  let e = entitiesDB.find(x => x.title.trim().toLowerCase() === trimmed);
  if (!e) e = createEntity(title);
  attachTagToEntity(e.id, tagId);
  return e;
};

// === 资料库模拟关联：基于资源库数据按标签生成实体 ===
function findTagIdsByText(text = '') {
  const lower = (text || '').toLowerCase();
  return getAll()
    .filter(t => {
      const nameHit = (t.name || '').toLowerCase().includes(lower);
      const aliasHit = (t.aliases || []).some(a => (a || '').toLowerCase().includes(lower));
      return nameHit || aliasHit;
    })
    .map(t => t.id);
}

function seedEntitiesForTagFromLibrary(tagId, limit = 5) {
  const tag = findById(tagId);
  if (!tag) return [];
  // 从资料库里找与标签名称或别名匹配的资源
  const name = (tag.name || '').trim();
  const nameLower = name.toLowerCase();
  const resources = (initialResources || []).filter(r => {
    const inTags = (r.tags || []).some(x => (x || '').toLowerCase().includes(nameLower));
    const inTitle = (r.title || '').toLowerCase().includes(nameLower);
    const inDesc = (r.description || '').toLowerCase().includes(nameLower);
    return inTags || inTitle || inDesc;
  }).slice(0, limit);

  const created = [];
  resources.forEach(r => {
    // 若已有同名实体则重用，否则创建
    let e = entitiesDB.find(x => x.title.trim().toLowerCase() === (r.title || '').trim().toLowerCase());
    if (!e) {
      e = createEntity(r.title);
      // 记录来源（演示字段，不影响现有逻辑）
      e.sourceId = r.id;
      e.sourceCategory = r.category;
      e.sourceType = r.type;
    }
    // 先关联当前标签
    attachTagToEntity(e.id, tagId);
    // 再基于资源的标签尝试关联更多标签（提升演示效果）
    (r.tags || []).forEach(txt => {
      const ids = findTagIdsByText(txt);
      ids.forEach(id => attachTagToEntity(e.id, id));
    });
    created.push(e);
  });
  return created;
}

export default {
  getAll,
  getTree,
  findById,
  validateNameUnique,
  search,
  create,
  update,
  removeMany,
  setEnabledMany,
  linkSynonym,
  unlinkSynonym,
  setMutex,
  suggestTagsForEntity,
  getStats,
  // 实体关系API（演示）
  getEntitiesByTag,
  attachTagToEntity,
  detachTagFromEntity,
  attachTagToEntityByTitle,
  seedEntitiesForTagFromLibrary,
  // 初始化/模拟：为某分类生成子标签（若为空）
  ensureChildrenForParent(parentId) {
    const parent = findById(parentId);
    if (!parent) return [];
    const hasChildren = getAll().some(t => t.parentId === parentId);
    if (hasChildren) return getAll().filter(t => t.parentId === parentId);
    // 基于父标签名称生成示例子标签
    const base = (parent.name || '子标签').trim();
    const names = [
      `${base}·基础`,
      `${base}·进阶`,
      `${base}·案例`,
      `${base}·工具`,
      `${base}·指南`
    ];
    const weights = [60, 55, 50, 45, 40];
    const created = names.map((n, idx) => create({ name: n, parentId, enabled: true, weight: weights[idx] }));
    return created;
  }
};