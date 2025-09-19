/**
 * 培训需求数据服务
 * 提供培训需求的CRUD操作和本地存储管理
 */

const STORAGE_KEY = 'training_needs_data';
const CATEGORIES_KEY = 'training_needs_categories';
const TAGS_KEY = 'training_needs_tags';

// 默认分类 - 基于新的培训类型体系
const DEFAULT_CATEGORIES = [
  { id: 'all', name: '全部需求', icon: 'FileTextOutlined', color: '#1890ff' },
  { id: 'teaching_methods', name: '教学方法', icon: 'BookOutlined', color: '#52c41a' },
  { id: 'curriculum_design', name: '课程设计', icon: 'DesktopOutlined', color: '#722ed1' },
  { id: 'student_management', name: '学生管理', icon: 'TeamOutlined', color: '#fa8c16' },
  { id: 'educational_tech', name: '教育技术', icon: 'LaptopOutlined', color: '#13c2c2' },
  { id: 'mental_health', name: '心理健康', icon: 'HeartOutlined', color: '#eb2f96' },
  { id: 'policy_compliance', name: '政策合规', icon: 'SafetyCertificateOutlined', color: '#f5222d' },
  { id: 'research_innovation', name: '研究创新', icon: 'ExperimentOutlined', color: '#1890ff' },
  { id: 'professional_dev', name: '专业发展', icon: 'RiseOutlined', color: '#faad14' }
];

// 默认标签
const DEFAULT_TAGS = [
  '紧急', '重要', '待评估', '已批准', '草稿', '模板', '参考', '总结'
];

// 导入模拟数据
import { 
  DEFAULT_MOCK_TRAINING_DATA, 
  TRAINING_SOURCE_INIT_DATA,
  generateAllMockTrainingData,
  generateRoleSpecificData,
  generateTrainingStats
} from '../data/mockTrainingData.js';
import {
  EDUCATION_LEVELS,
  ROLES
} from '../data/trainingDataTemplates.js';

class NeedsService {
  constructor() {
    this.initializeStorage();
  }

  // 初始化存储
  initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(CATEGORIES_KEY)) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem(TAGS_KEY)) {
      localStorage.setItem(TAGS_KEY, JSON.stringify(DEFAULT_TAGS));
    }
  }

  // 生成唯一ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 获取所有培训需求
  getAllNeeds() {
    try {
      const needs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return needs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } catch (error) {
      console.error('获取培训需求失败:', error);
      return [];
    }
  }

  // 别名方法：为了兼容TrainingNeeds组件中的调用
  getAllNotes() {
    return this.getAllNeeds();
  }

  // 根据ID获取培训需求
  getNeedById(id) {
    try {
      const needs = this.getAllNeeds();
      return needs.find(need => need.id === id) || null;
    } catch (error) {
      console.error('获取培训需求失败:', error);
      return null;
    }
  }

  // 创建培训需求
  createNeed(needData) {
    try {
      const needs = this.getAllNeeds();
      const newNeed = {
        id: this.generateId(),
        title: needData.title || '无标题培训需求',
        content: needData.content || '',
        category: needData.category || 'skill',
        tags: needData.tags || [],
        priority: needData.priority || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        wordCount: this.getWordCount(needData.content || ''),
        readTime: this.calculateReadTime(needData.content || '')
      };
      
      needs.unshift(newNeed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(needs));
      
      // 更新标签列表
      this.updateTagsList(needData.tags || []);
      
      return newNeed;
    } catch (error) {
      console.error('创建培训需求失败:', error);
      throw new Error('创建培训需求失败');
    }
  }

  // 更新培训需求
  updateNeed(id, needData) {
    try {
      const needs = this.getAllNeeds();
      const needIndex = needs.findIndex(need => need.id === id);
      
      if (needIndex === -1) {
        throw new Error('培训需求不存在');
      }
      
      const updatedNeed = {
        ...needs[needIndex],
        ...needData,
        updatedAt: new Date().toISOString(),
        wordCount: this.getWordCount(needData.content || needs[needIndex].content),
        readTime: this.calculateReadTime(needData.content || needs[needIndex].content)
      };
      
      needs[needIndex] = updatedNeed;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(needs));
      
      // 更新标签列表
      this.updateTagsList(updatedNeed.tags || []);
      
      return updatedNeed;
    } catch (error) {
      console.error('更新培训需求失败:', error);
      throw new Error('更新培训需求失败');
    }
  }

  // 删除培训需求
  deleteNeed(id) {
    try {
      const needs = this.getAllNeeds();
      const filteredNeeds = needs.filter(need => need.id !== id);
      
      if (needs.length === filteredNeeds.length) {
        throw new Error('培训需求不存在');
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNeeds));
      return true;
    } catch (error) {
      console.error('删除培训需求失败:', error);
      throw new Error('删除培训需求失败');
    }
  }

  // 批量删除培训需求
  deleteNeeds(ids) {
    try {
      const needs = this.getAllNeeds();
      const filteredNeeds = needs.filter(need => !ids.includes(need.id));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNeeds));
      return true;
    } catch (error) {
      console.error('批量删除培训需求失败:', error);
      throw new Error('批量删除培训需求失败');
    }
  }

  // 搜索培训需求
  searchNeeds(query, filters = {}) {
    try {
      let needs = this.getAllNeeds();
      
      // 文本搜索
      if (query && query.trim()) {
        const searchTerm = query.toLowerCase().trim();
        needs = needs.filter(need => 
          need.title.toLowerCase().includes(searchTerm) ||
          need.content.toLowerCase().includes(searchTerm) ||
          need.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      // 分类过滤
      if (filters.category && filters.category !== 'all') {
        if (filters.category === 'priority') {
          needs = needs.filter(need => need.priority);
        } else {
          needs = needs.filter(need => need.category === filters.category);
        }
      }
      
      // 标签过滤
      if (filters.tags && filters.tags.length > 0) {
        needs = needs.filter(need => 
          filters.tags.some(tag => need.tags.includes(tag))
        );
      }
      
      // 日期范围过滤
      if (filters.dateRange) {
        const { start, end } = filters.dateRange;
        needs = needs.filter(need => {
          const needDate = new Date(need.createdAt);
          return needDate >= start && needDate <= end;
        });
      }
      
      return needs;
    } catch (error) {
      console.error('搜索培训需求失败:', error);
      return [];
    }
  }

  // 获取分类列表
  getCategories() {
    try {
      return JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]');
    } catch (error) {
      console.error('获取分类失败:', error);
      return DEFAULT_CATEGORIES;
    }
  }

  // 获取标签列表
  getTags() {
    try {
      return JSON.parse(localStorage.getItem(TAGS_KEY) || '[]');
    } catch (error) {
      console.error('获取标签失败:', error);
      return DEFAULT_TAGS;
    }
  }

  // 更新标签列表
  updateTagsList(newTags) {
    try {
      const existingTags = this.getTags();
      const uniqueTags = [...new Set([...existingTags, ...newTags])];
      localStorage.setItem(TAGS_KEY, JSON.stringify(uniqueTags));
    } catch (error) {
      console.error('更新标签列表失败:', error);
    }
  }

  // 重命名标签
  renameTag(oldTag, newTag) {
    try {
      // 更新标签列表
      const existingTags = this.getTags();
      const tagIndex = existingTags.indexOf(oldTag);
      if (tagIndex !== -1) {
        existingTags[tagIndex] = newTag;
        localStorage.setItem(TAGS_KEY, JSON.stringify(existingTags));
      }

      // 更新所有培训需求中的标签
      const needs = this.getAllNeeds();
      const updatedNeeds = needs.map(need => {
        if (need.tags && need.tags.includes(oldTag)) {
          const updatedTags = need.tags.map(tag => tag === oldTag ? newTag : tag);
          return { ...need, tags: updatedTags };
        }
        return need;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNeeds));
      
      return true;
    } catch (error) {
      console.error('重命名标签失败:', error);
      return false;
    }
  }

  // 获取培训需求统计信息
  getNeedsStats() {
    try {
      const needs = this.getAllNeeds();
      const categories = this.getCategories();
      
      const stats = {
        total: needs.length,
        priority: needs.filter(need => need.priority).length,
        categories: {},
        tags: {},
        totalWords: needs.reduce((sum, need) => sum + need.wordCount, 0),
        recentNeeds: needs.slice(0, 5)
      };
      
      // 统计各分类培训需求数量
      categories.forEach(category => {
        if (category.id === 'all') {
          stats.categories[category.id] = needs.length;
        } else if (category.id === 'priority') {
          stats.categories[category.id] = needs.filter(need => need.priority).length;
        } else {
          stats.categories[category.id] = needs.filter(need => need.category === category.id).length;
        }
      });
      
      // 统计标签使用频率
      needs.forEach(need => {
        need.tags.forEach(tag => {
          stats.tags[tag] = (stats.tags[tag] || 0) + 1;
        });
      });
      
      return stats;
    } catch (error) {
      console.error('获取统计信息失败:', error);
      return {
        total: 0,
        priority: 0,
        categories: {},
        tags: {},
        totalWords: 0,
        recentNeeds: []
      };
    }
  }

  // 计算字数
  getWordCount(content) {
    if (!content) return 0;
    // 中文字符 + 英文单词
    const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
    return chineseChars + englishWords;
  }

  // 计算阅读时间（分钟）
  calculateReadTime(content) {
    const wordCount = this.getWordCount(content);
    // 假设中文阅读速度为300字/分钟，英文为200词/分钟
    const readingSpeed = 250;
    return Math.max(1, Math.ceil(wordCount / readingSpeed));
  }

  // 导出培训需求数据
  exportNeeds(format = 'json') {
    try {
      const needs = this.getAllNeeds();
      const categories = this.getCategories();
      const tags = this.getTags();
      
      const exportData = {
        needs,
        categories,
        tags,
        exportTime: new Date().toISOString(),
        version: '1.0'
      };
      
      if (format === 'json') {
        return JSON.stringify(exportData, null, 2);
      }
      
      // 可以扩展其他格式
      return exportData;
    } catch (error) {
      console.error('导出培训需求失败:', error);
      throw new Error('导出培训需求失败');
    }
  }

  // 导入培训需求数据
  importNeeds(data, options = { merge: true }) {
    try {
      let importData;
      
      if (typeof data === 'string') {
        importData = JSON.parse(data);
      } else {
        importData = data;
      }
      
      if (!importData.needs || !Array.isArray(importData.needs)) {
        throw new Error('无效的导入数据格式');
      }
      
      if (options.merge) {
        // 合并模式：保留现有数据，添加新数据
        const existingNeeds = this.getAllNeeds();
        const existingIds = new Set(existingNeeds.map(need => need.id));
        
        const newNeeds = importData.needs.filter(need => !existingIds.has(need.id));
        const mergedNeeds = [...existingNeeds, ...newNeeds];
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedNeeds));
        
        // 合并分类和标签
        if (importData.categories) {
          const existingCategories = this.getCategories();
          const mergedCategories = [...existingCategories];
          importData.categories.forEach(category => {
            if (!mergedCategories.find(c => c.id === category.id)) {
              mergedCategories.push(category);
            }
          });
          localStorage.setItem(CATEGORIES_KEY, JSON.stringify(mergedCategories));
        }
        
        if (importData.tags) {
          const existingTags = this.getTags();
          const mergedTags = [...new Set([...existingTags, ...importData.tags])];
          localStorage.setItem(TAGS_KEY, JSON.stringify(mergedTags));
        }
        
        return {
          imported: newNeeds.length,
          skipped: importData.needs.length - newNeeds.length,
          total: mergedNeeds.length
        };
      } else {
        // 替换模式：完全替换现有数据
        localStorage.setItem(STORAGE_KEY, JSON.stringify(importData.needs));
        
        if (importData.categories) {
          localStorage.setItem(CATEGORIES_KEY, JSON.stringify(importData.categories));
        }
        
        if (importData.tags) {
          localStorage.setItem(TAGS_KEY, JSON.stringify(importData.tags));
        }
        
        return {
          imported: importData.needs.length,
          skipped: 0,
          total: importData.needs.length
        };
      }
    } catch (error) {
      console.error('导入培训需求失败:', error);
      throw new Error('导入培训需求失败: ' + error.message);
    }
  }

  // 清空所有数据
  clearAllData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CATEGORIES_KEY);
      localStorage.removeItem(TAGS_KEY);
      this.initializeStorage();
      return true;
    } catch (error) {
      console.error('清空数据失败:', error);
      throw new Error('清空数据失败');
    }
  }

  // 高级搜索
  advancedSearch(criteria) {
    return this.searchNeeds(criteria);
  }

  // 统计相关别名方法
  getNotesStats() {
    return this.getNeedsStats();
  }

  // 保存搜索条件
  saveSearch(name, criteria) {
    const savedSearches = JSON.parse(localStorage.getItem('saved_searches') || '[]');
    const newSearch = {
      id: this.generateId(),
      name,
      criteria,
      createdAt: new Date().toISOString()
    };
    
    savedSearches.push(newSearch);
    localStorage.setItem('saved_searches', JSON.stringify(savedSearches));
    return newSearch;
  }

  // 获取保存的搜索
  getSavedSearches() {
    return JSON.parse(localStorage.getItem('saved_searches') || '[]');
  }

  // 删除保存的搜索
  deleteSavedSearch(id) {
    const savedSearches = JSON.parse(localStorage.getItem('saved_searches') || '[]');
    const filtered = savedSearches.filter(search => search.id !== id);
    localStorage.setItem('saved_searches', JSON.stringify(filtered));
    return true;
  }

  // 保存搜索历史
  saveSearchHistory(keyword) {
    // 确保keyword是字符串类型
    if (!keyword || typeof keyword !== 'string' || !keyword.trim()) return;
    
    const history = JSON.parse(localStorage.getItem('search_history') || '[]');
    const filtered = history.filter(item => item !== keyword);
    filtered.unshift(keyword);
    
    // 只保留最近20条搜索历史
    const limited = filtered.slice(0, 20);
    localStorage.setItem('search_history', JSON.stringify(limited));
  }

  // 获取搜索历史
  getSearchHistory() {
    return JSON.parse(localStorage.getItem('search_history') || '[]');
  }

  // 清空搜索历史
  clearSearchHistory() {
    localStorage.removeItem('search_history');
    return true;
  }

  // 别名方法：为了兼容TrainingNeeds组件中的调用
  searchNotes(query, filters = {}) {
    // 将简单的查询字符串转换为搜索条件
    const criteria = {
      keyword: query,
      ...filters
    };
    return this.searchNeeds(criteria);
  }

  // 更多别名方法
  createNote(noteData) {
    return this.createNeed(noteData);
  }

  updateNote(id, noteData) {
    return this.updateNeed(id, noteData);
  }

  deleteNote(id) {
    return this.deleteNeed(id);
  }

  toggleStar(id) {
    return this.togglePriority(id);
  }

  exportNotes() {
    return this.exportNeeds();
  }

  importNotes(data, options) {
    return this.importNeeds(data, options);
  }

  advancedSearch(criteria) {
    return this.searchNeeds(criteria);
  }

  // 初始化模拟培训数据
  initializeMockTrainingData() {
    try {
      const existingData = this.getAllNeeds();
      if (existingData.length === 0) {
        const mockData = generateAllMockTrainingData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
        console.log(`已初始化 ${mockData.length} 条模拟培训数据`);
        return mockData;
      }
      return existingData;
    } catch (error) {
      console.error('初始化模拟数据失败:', error);
      return [];
    }
  }

  // 生成特定角色的培训数据
  generateRoleTrainingData(educationLevel, role, count = 10) {
    try {
      const roleData = generateRoleSpecificData(educationLevel, role, count);
      const existingData = this.getAllNeeds();
      const newData = [...existingData, ...roleData];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      console.log(`为${role}角色生成了 ${roleData.length} 条培训数据`);
      return roleData;
    } catch (error) {
      console.error('生成角色培训数据失败:', error);
      return [];
    }
  }

  // 获取培训统计数据
  getTrainingStats() {
    try {
      const needs = this.getAllNeeds();
      return generateTrainingStats(needs);
    } catch (error) {
      console.error('获取培训统计失败:', error);
      return {
        total: 0,
        byStatus: {},
        byType: {},
        byPriority: {},
        bySource: {},
        byEducationLevel: {},
        byRole: {},
        recentActivity: []
      };
    }
  }

  // 初始化培训来源数据
  initializeTrainingSources() {
    const SOURCES_KEY = 'training_sources_data';
    try {
      if (!localStorage.getItem(SOURCES_KEY)) {
        localStorage.setItem(SOURCES_KEY, JSON.stringify(TRAINING_SOURCE_INIT_DATA));
        console.log(`已初始化 ${TRAINING_SOURCE_INIT_DATA.length} 个培训来源`);
      }
      return JSON.parse(localStorage.getItem(SOURCES_KEY) || '[]');
    } catch (error) {
      console.error('初始化培训来源失败:', error);
      return [];
    }
  }

  // 获取所有培训来源
  getTrainingSources() {
    const SOURCES_KEY = 'training_sources_data';
    try {
      return JSON.parse(localStorage.getItem(SOURCES_KEY) || '[]');
    } catch (error) {
      console.error('获取培训来源失败:', error);
      return [];
    }
  }

  // 添加培训来源
  addTrainingSource(sourceData) {
    const SOURCES_KEY = 'training_sources_data';
    try {
      const sources = this.getTrainingSources();
      const newSource = {
        id: this.generateId(),
        ...sourceData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      sources.push(newSource);
      localStorage.setItem(SOURCES_KEY, JSON.stringify(sources));
      return newSource;
    } catch (error) {
      console.error('添加培训来源失败:', error);
      throw new Error('添加培训来源失败');
    }
  }

  // 更新培训来源
  updateTrainingSource(id, sourceData) {
    const SOURCES_KEY = 'training_sources_data';
    try {
      const sources = this.getTrainingSources();
      const sourceIndex = sources.findIndex(source => source.id === id);
      
      if (sourceIndex === -1) {
        throw new Error('培训来源不存在');
      }
      
      sources[sourceIndex] = {
        ...sources[sourceIndex],
        ...sourceData,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(SOURCES_KEY, JSON.stringify(sources));
      return sources[sourceIndex];
    } catch (error) {
      console.error('更新培训来源失败:', error);
      throw new Error('更新培训来源失败');
    }
  }

  // 删除培训来源
  deleteTrainingSource(id) {
    const SOURCES_KEY = 'training_sources_data';
    try {
      const sources = this.getTrainingSources();
      const filteredSources = sources.filter(source => source.id !== id);
      
      if (sources.length === filteredSources.length) {
        throw new Error('培训来源不存在');
      }
      
      localStorage.setItem(SOURCES_KEY, JSON.stringify(filteredSources));
      return true;
    } catch (error) {
      console.error('删除培训来源失败:', error);
      throw new Error('删除培训来源失败');
    }
  }

  // 获取教育层次选项
  getEducationLevelOptions() {
    return [
      { value: EDUCATION_LEVELS.HIGHER_ED, label: '高等教育' },
      { value: EDUCATION_LEVELS.VOCATIONAL, label: '职业教育' },
      { value: EDUCATION_LEVELS.BASIC_ED, label: '基础教育' }
    ];
  }

  // 获取角色选项
  getRoleOptions() {
    return [
      { value: ROLES.TEACHER, label: '教师' },
      { value: ROLES.CLASS_TEACHER, label: '班主任' },
      { value: ROLES.COUNSELOR, label: '辅导员' },
      { value: ROLES.PRINCIPAL, label: '校长' },
      { value: ROLES.DEAN, label: '院长/系主任' },
      { value: ROLES.DEPARTMENT_HEAD, label: '教研室主任' },
      { value: ROLES.LIBRARIAN, label: '图书管理员' },
      { value: ROLES.IT_SUPPORT, label: '技术支持' },
      { value: ROLES.ADMIN_STAFF, label: '行政人员' }
    ];
  }

  // 重置所有数据（开发调试用）
  resetAllData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CATEGORIES_KEY);
      localStorage.removeItem(TAGS_KEY);
      localStorage.removeItem('training_sources_data');
      this.initializeStorage();
      console.log('所有数据已重置');
      return true;
    } catch (error) {
      console.error('重置数据失败:', error);
      return false;
    }
  }
}

// 创建单例实例
const needsService = new NeedsService();

export default needsService;

// 导出类以便测试
export { NeedsService };