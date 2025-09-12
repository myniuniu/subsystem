/**
 * 智能笔记数据服务
 * 提供笔记的CRUD操作和本地存储管理
 */

const STORAGE_KEY = 'smart_notes_data';
const CATEGORIES_KEY = 'smart_notes_categories';
const TAGS_KEY = 'smart_notes_tags';

// 默认分类
const DEFAULT_CATEGORIES = [
  { id: 'all', name: '全部笔记', icon: 'FileTextOutlined', color: '#1890ff' },
  { id: 'work', name: '工作笔记', icon: 'BriefcaseOutlined', color: '#52c41a' },
  { id: 'study', name: '学习笔记', icon: 'BookOutlined', color: '#722ed1' },
  { id: 'personal', name: '个人笔记', icon: 'UserOutlined', color: '#fa8c16' },
  { id: 'ideas', name: '想法灵感', icon: 'BulbOutlined', color: '#eb2f96' },
  { id: 'starred', name: '收藏笔记', icon: 'StarOutlined', color: '#faad14' }
];

// 默认标签
const DEFAULT_TAGS = [
  '重要', '紧急', '待办', '已完成', '草稿', '模板', '参考', '总结'
];

class NotesService {
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

  // 获取所有笔记
  getAllNotes() {
    try {
      const notes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } catch (error) {
      console.error('获取笔记失败:', error);
      return [];
    }
  }

  // 根据ID获取笔记
  getNoteById(id) {
    try {
      const notes = this.getAllNotes();
      return notes.find(note => note.id === id) || null;
    } catch (error) {
      console.error('获取笔记失败:', error);
      return null;
    }
  }

  // 创建笔记
  createNote(noteData) {
    try {
      const notes = this.getAllNotes();
      const newNote = {
        id: this.generateId(),
        title: noteData.title || '无标题笔记',
        content: noteData.content || '',
        category: noteData.category || 'personal',
        tags: noteData.tags || [],
        starred: noteData.starred || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        wordCount: this.getWordCount(noteData.content || ''),
        readTime: this.calculateReadTime(noteData.content || '')
      };
      
      notes.unshift(newNote);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      
      // 更新标签列表
      this.updateTagsList(noteData.tags || []);
      
      return newNote;
    } catch (error) {
      console.error('创建笔记失败:', error);
      throw new Error('创建笔记失败');
    }
  }

  // 更新笔记
  updateNote(id, noteData) {
    try {
      const notes = this.getAllNotes();
      const noteIndex = notes.findIndex(note => note.id === id);
      
      if (noteIndex === -1) {
        throw new Error('笔记不存在');
      }
      
      const updatedNote = {
        ...notes[noteIndex],
        ...noteData,
        updatedAt: new Date().toISOString(),
        wordCount: this.getWordCount(noteData.content || notes[noteIndex].content),
        readTime: this.calculateReadTime(noteData.content || notes[noteIndex].content)
      };
      
      notes[noteIndex] = updatedNote;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      
      // 更新标签列表
      this.updateTagsList(updatedNote.tags || []);
      
      return updatedNote;
    } catch (error) {
      console.error('更新笔记失败:', error);
      throw new Error('更新笔记失败');
    }
  }

  // 删除笔记
  deleteNote(id) {
    try {
      const notes = this.getAllNotes();
      const filteredNotes = notes.filter(note => note.id !== id);
      
      if (notes.length === filteredNotes.length) {
        throw new Error('笔记不存在');
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotes));
      return true;
    } catch (error) {
      console.error('删除笔记失败:', error);
      throw new Error('删除笔记失败');
    }
  }

  // 批量删除笔记
  deleteNotes(ids) {
    try {
      const notes = this.getAllNotes();
      const filteredNotes = notes.filter(note => !ids.includes(note.id));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotes));
      return true;
    } catch (error) {
      console.error('批量删除笔记失败:', error);
      throw new Error('批量删除笔记失败');
    }
  }

  // 切换收藏状态
  toggleStar(id) {
    try {
      const notes = this.getAllNotes();
      const noteIndex = notes.findIndex(note => note.id === id);
      
      if (noteIndex === -1) {
        throw new Error('笔记不存在');
      }
      
      notes[noteIndex].starred = !notes[noteIndex].starred;
      notes[noteIndex].updatedAt = new Date().toISOString();
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      return notes[noteIndex];
    } catch (error) {
      console.error('切换收藏状态失败:', error);
      throw new Error('切换收藏状态失败');
    }
  }

  // 搜索笔记
  searchNotes(query, filters = {}) {
    try {
      let notes = this.getAllNotes();
      
      // 文本搜索
      if (query && query.trim()) {
        const searchTerm = query.toLowerCase().trim();
        notes = notes.filter(note => 
          note.title.toLowerCase().includes(searchTerm) ||
          note.content.toLowerCase().includes(searchTerm) ||
          note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      // 分类过滤
      if (filters.category && filters.category !== 'all') {
        if (filters.category === 'starred') {
          notes = notes.filter(note => note.starred);
        } else {
          notes = notes.filter(note => note.category === filters.category);
        }
      }
      
      // 标签过滤
      if (filters.tags && filters.tags.length > 0) {
        notes = notes.filter(note => 
          filters.tags.some(tag => note.tags.includes(tag))
        );
      }
      
      // 日期范围过滤
      if (filters.dateRange) {
        const { start, end } = filters.dateRange;
        notes = notes.filter(note => {
          const noteDate = new Date(note.createdAt);
          return noteDate >= start && noteDate <= end;
        });
      }
      
      return notes;
    } catch (error) {
      console.error('搜索笔记失败:', error);
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

  // 添加新标签
  addTag(tag) {
    try {
      const existingTags = this.getTags();
      if (!existingTags.includes(tag)) {
        existingTags.push(tag);
        localStorage.setItem(TAGS_KEY, JSON.stringify(existingTags));
      }
      return true;
    } catch (error) {
      console.error('添加标签失败:', error);
      return false;
    }
  }

  // 删除标签
  removeTag(tag) {
    try {
      const existingTags = this.getTags();
      const filteredTags = existingTags.filter(t => t !== tag);
      localStorage.setItem(TAGS_KEY, JSON.stringify(filteredTags));
      return true;
    } catch (error) {
      console.error('删除标签失败:', error);
      return false;
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

      // 更新所有笔记中的标签
      const notes = this.getAllNotes();
      const updatedNotes = notes.map(note => {
        if (note.tags && note.tags.includes(oldTag)) {
          const updatedTags = note.tags.map(tag => tag === oldTag ? newTag : tag);
          return { ...note, tags: updatedTags };
        }
        return note;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      
      return true;
    } catch (error) {
      console.error('重命名标签失败:', error);
      return false;
    }
  }

  // 获取笔记统计信息
  getNotesStats() {
    try {
      const notes = this.getAllNotes();
      const categories = this.getCategories();
      
      const stats = {
        total: notes.length,
        starred: notes.filter(note => note.starred).length,
        categories: {},
        tags: {},
        totalWords: notes.reduce((sum, note) => sum + note.wordCount, 0),
        recentNotes: notes.slice(0, 5)
      };
      
      // 统计各分类笔记数量
      categories.forEach(category => {
        if (category.id === 'all') {
          stats.categories[category.id] = notes.length;
        } else if (category.id === 'starred') {
          stats.categories[category.id] = notes.filter(note => note.starred).length;
        } else {
          stats.categories[category.id] = notes.filter(note => note.category === category.id).length;
        }
      });
      
      // 统计标签使用频率
      notes.forEach(note => {
        note.tags.forEach(tag => {
          stats.tags[tag] = (stats.tags[tag] || 0) + 1;
        });
      });
      
      return stats;
    } catch (error) {
      console.error('获取统计信息失败:', error);
      return {
        total: 0,
        starred: 0,
        categories: {},
        tags: {},
        totalWords: 0,
        recentNotes: []
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

  // 导出笔记数据
  exportNotes(format = 'json') {
    try {
      const notes = this.getAllNotes();
      const categories = this.getCategories();
      const tags = this.getTags();
      
      const exportData = {
        notes,
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
      console.error('导出笔记失败:', error);
      throw new Error('导出笔记失败');
    }
  }

  // 导入笔记数据
  importNotes(data, options = { merge: true }) {
    try {
      let importData;
      
      if (typeof data === 'string') {
        importData = JSON.parse(data);
      } else {
        importData = data;
      }
      
      if (!importData.notes || !Array.isArray(importData.notes)) {
        throw new Error('无效的导入数据格式');
      }
      
      if (options.merge) {
        // 合并模式：保留现有数据，添加新数据
        const existingNotes = this.getAllNotes();
        const existingIds = new Set(existingNotes.map(note => note.id));
        
        const newNotes = importData.notes.filter(note => !existingIds.has(note.id));
        const mergedNotes = [...existingNotes, ...newNotes];
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedNotes));
        
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
          imported: newNotes.length,
          skipped: importData.notes.length - newNotes.length,
          total: mergedNotes.length
        };
      } else {
        // 替换模式：完全替换现有数据
        localStorage.setItem(STORAGE_KEY, JSON.stringify(importData.notes));
        
        if (importData.categories) {
          localStorage.setItem(CATEGORIES_KEY, JSON.stringify(importData.categories));
        }
        
        if (importData.tags) {
          localStorage.setItem(TAGS_KEY, JSON.stringify(importData.tags));
        }
        
        return {
          imported: importData.notes.length,
          skipped: 0,
          total: importData.notes.length
        };
      }
    } catch (error) {
      console.error('导入笔记失败:', error);
      throw new Error('导入笔记失败: ' + error.message);
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
    const notes = this.getAllNotes();
    
    return notes.filter(note => {
      // 关键词搜索
      if (criteria.keyword) {
        const keyword = criteria.keyword.toLowerCase();
        const matchesKeyword = 
          note.title.toLowerCase().includes(keyword) ||
          note.content.toLowerCase().includes(keyword) ||
          note.tags.some(tag => tag.toLowerCase().includes(keyword));
        
        if (!matchesKeyword) return false;
      }
      
      // 分类过滤
      if (criteria.categories && criteria.categories.length > 0) {
        if (!criteria.categories.includes(note.category)) return false;
      }
      
      // 标签过滤
      if (criteria.tags && criteria.tags.length > 0) {
        const hasMatchingTag = criteria.tags.some(tag => note.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }
      
      // 日期范围过滤
      if (criteria.dateRange && criteria.dateRange.length === 2) {
        const noteDate = new Date(note.createdAt);
        const startDate = new Date(criteria.dateRange[0]);
        const endDate = new Date(criteria.dateRange[1]);
        endDate.setHours(23, 59, 59, 999); // 包含结束日期的整天
        
        if (noteDate < startDate || noteDate > endDate) return false;
      }
      
      // 字数范围过滤
      if (criteria.wordCountRange && criteria.wordCountRange.length === 2) {
        const wordCount = this.getWordCount(note.content);
        const [minWords, maxWords] = criteria.wordCountRange;
        
        if (wordCount < minWords || wordCount > maxWords) return false;
      }
      
      // 收藏状态过滤
      if (criteria.onlyFavorites && !note.starred) return false;
      
      // 内容类型过滤
      if (criteria.contentType) {
        switch (criteria.contentType) {
          case 'text':
            // 纯文本笔记（不包含特殊格式）
            if (note.content.includes('**') || note.content.includes('##') || 
                note.content.includes('- ') || note.content.includes('1. ')) {
              return false;
            }
            break;
          case 'markdown':
            // Markdown格式笔记
            if (!(note.content.includes('**') || note.content.includes('##') || 
                  note.content.includes('- ') || note.content.includes('1. '))) {
              return false;
            }
            break;
          case 'list':
            // 列表格式笔记
            if (!(note.content.includes('- ') || note.content.includes('1. '))) {
              return false;
            }
            break;
        }
      }
      
      return true;
    }).sort((a, b) => {
      // 排序
      switch (criteria.sortBy) {
        case 'title':
          return criteria.sortOrder === 'asc' ? 
            a.title.localeCompare(b.title) : 
            b.title.localeCompare(a.title);
        case 'createdAt':
          return criteria.sortOrder === 'asc' ? 
            new Date(a.createdAt) - new Date(b.createdAt) : 
            new Date(b.createdAt) - new Date(a.createdAt);
        case 'updatedAt':
          return criteria.sortOrder === 'asc' ? 
            new Date(a.updatedAt) - new Date(b.updatedAt) : 
            new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'wordCount':
          const aWords = this.getWordCount(a.content);
          const bWords = this.getWordCount(b.content);
          return criteria.sortOrder === 'asc' ? aWords - bWords : bWords - aWords;
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });
  }

  // 保存搜索条件
  saveSearchCriteria(name, criteria) {
    const savedSearches = JSON.parse(localStorage.getItem('saved_searches') || '[]');
    const newSearch = {
      id: Date.now().toString(),
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
    if (!keyword.trim()) return;
    
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
}

// 创建单例实例
const notesService = new NotesService();

export default notesService;

// 导出类以便测试
export { NotesService };