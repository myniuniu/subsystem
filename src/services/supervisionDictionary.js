// 督学模板字典：存储“必查大类”和“具体子项”候选项，并支持动态扩充

const STORAGE_KEY = 'supervision_dictionary_v1';

const DEFAULT_DICT = {
  categories: ['校园设施安全', '校园管理安全', '师生安全管理', '教学计划执行', '学生学习效果', '教学过程评估', '作业负担管控', '校外培训治理', '课后服务质量', '考试管理规范'],
  itemsByCategory: {
    '校园设施安全': ['消防设施', '校舍建筑'],
    '校园管理安全': ['校园安保', '食堂卫生'],
    '师生安全管理': ['安全培训与演练', '校园欺凌防控'],
    '教学计划执行': ['课程进度', '备课与教案'],
    '学生学习效果': ['考试成绩分析', '作业完成与反馈'],
    '教学过程评估': ['课堂教学观察', '教研活动开展'],
    '作业负担管控': ['作业时长', '作业设计与批改'],
    '校外培训治理': ['学校违规培训', '培训广告管控'],
    '课后服务质量': ['课后服务覆盖', '课后服务内容'],
    '考试管理规范': ['考试次数与难度', '成绩公布与排名']
  }
};

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DICT };
    const parsed = JSON.parse(raw);
    return {
      categories: Array.isArray(parsed?.categories) ? parsed.categories : [...DEFAULT_DICT.categories],
      itemsByCategory: typeof parsed?.itemsByCategory === 'object' && parsed.itemsByCategory ? parsed.itemsByCategory : { ...DEFAULT_DICT.itemsByCategory }
    };
  } catch (e) {
    return { ...DEFAULT_DICT };
  }
}

function write(dict) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dict));
  } catch (e) {
    // no-op
  }
}

const supervisionDictionary = {
  getDict() {
    return read();
  },
  getCategories() {
    return read().categories;
  },
  getItems(category) {
    const d = read();
    return d.itemsByCategory[category] || [];
  },
  ensureCategory(name) {
    const n = String(name || '').trim();
    if (!n) return this.getDict();
    const d = read();
    if (!d.categories.includes(n)) d.categories.push(n);
    if (!d.itemsByCategory[n]) d.itemsByCategory[n] = [];
    write(d);
    return d;
  },
  addItem(category, item) {
    const c = String(category || '').trim();
    const i = String(item || '').trim();
    if (!c || !i) return this.getDict();
    const d = read();
    if (!d.itemsByCategory[c]) d.itemsByCategory[c] = [];
    if (!d.itemsByCategory[c].includes(i)) d.itemsByCategory[c].push(i);
    // 同步保证分类存在
    if (!d.categories.includes(c)) d.categories.push(c);
    write(d);
    return d;
  }
};

export default supervisionDictionary;