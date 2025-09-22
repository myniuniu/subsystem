/**
 * 资源标注数据服务
 * 提供资源标注的CRUD操作和本地存储管理
 */

const STORAGE_KEY = 'resource_annotation_data';
const CATEGORIES_KEY = 'resource_annotation_categories';
const TAGS_KEY = 'resource_annotation_tags';

// 默认分类 - 基于资源标注类型体系
const DEFAULT_CATEGORIES = [
  { id: 'all', name: '全部标注', icon: 'FileTextOutlined', color: '#1890ff' },
  { id: 'image_annotation', name: '图像标注', icon: 'PictureOutlined', color: '#52c41a' },
  { id: 'video_annotation', name: '视频标注', icon: 'PlayCircleOutlined', color: '#722ed1' },
  { id: 'text_annotation', name: '文本标注', icon: 'FileTextOutlined', color: '#fa8c16' },
  { id: 'audio_annotation', name: '音频标注', icon: 'SoundOutlined', color: '#13c2c2' },
  { id: 'document_annotation', name: '文档标注', icon: 'FilePdfOutlined', color: '#eb2f96' },
  { id: 'dataset_annotation', name: '数据集标注', icon: 'DatabaseOutlined', color: '#f5222d' },
  { id: 'model_annotation', name: '模型标注', icon: 'ExperimentOutlined', color: '#1890ff' },
  { id: 'quality_check', name: '质量检查', icon: 'CheckCircleOutlined', color: '#faad14' }
];

// 默认标签
const DEFAULT_TAGS = [
  '待标注', '已完成', '需审核', '已批准', '草稿', '模板', '参考', '总结'
];

// 导入模拟数据
import { 
  DEFAULT_MOCK_ANNOTATION_DATA, 
  ANNOTATION_SOURCE_INIT_DATA,
  generateAllMockAnnotationData,
  generateRoleSpecificData,
  generateAnnotationStats
} from '../data/mockAnnotationData.js';

class AnnotationService {
  constructor() {
    this.initializeStorage();
  }

  // 初始化存储
  initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      // 初始化时包含资源标注数据
      const initialData = [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      console.log('已初始化资源标注数据到存储中');
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

  // 获取所有资源标注
  getAllAnnotations() {
    try {
      const annotations = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return annotations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } catch (error) {
      console.error('获取资源标注失败:', error);
      return [];
    }
  }

  // 别名方法：为了兼容ResourceAnnotation组件中的调用
  getAllNotes() {
    return this.getAllAnnotations();
  }

  // 根据ID获取资源标注
  getAnnotationById(id) {
    try {
      const annotations = this.getAllAnnotations();
      return annotations.find(annotation => annotation.id === id) || null;
    } catch (error) {
      console.error('获取资源标注失败:', error);
      return null;
    }
  }

  // 创建资源标注
  createAnnotation(annotationData) {
    try {
      const annotations = this.getAllAnnotations();
      const newAnnotation = {
        id: this.generateId(),
        title: annotationData.title || '无标题资源标注',
        content: annotationData.content || '',
        category: annotationData.category || 'image_annotation',
        tags: annotationData.tags || [],
        priority: annotationData.priority || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        wordCount: this.getWordCount(annotationData.content || ''),
        readTime: this.calculateReadTime(annotationData.content || '')
      };
      
      annotations.unshift(newAnnotation);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
      
      // 更新标签列表
      this.updateTagsList(annotationData.tags || []);
      
      return newAnnotation;
    } catch (error) {
      console.error('创建资源标注失败:', error);
      throw new Error('创建资源标注失败');
    }
  }

  // 更新资源标注
  updateAnnotation(id, annotationData) {
    try {
      const annotations = this.getAllAnnotations();
      const annotationIndex = annotations.findIndex(annotation => annotation.id === id);
      
      if (annotationIndex === -1) {
        throw new Error('资源标注不存在');
      }
      
      const updatedAnnotation = {
        ...annotations[annotationIndex],
        ...annotationData,
        updatedAt: new Date().toISOString(),
        wordCount: this.getWordCount(annotationData.content || annotations[annotationIndex].content),
        readTime: this.calculateReadTime(annotationData.content || annotations[annotationIndex].content)
      };
      
      annotations[annotationIndex] = updatedAnnotation;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
      
      // 更新标签列表
      this.updateTagsList(updatedAnnotation.tags || []);
      
      return updatedAnnotation;
    } catch (error) {
      console.error('更新资源标注失败:', error);
      throw new Error('更新资源标注失败');
    }
  }

  // 删除资源标注
  deleteAnnotation(id) {
    try {
      const annotations = this.getAllAnnotations();
      const filteredAnnotations = annotations.filter(annotation => annotation.id !== id);
      
      if (annotations.length === filteredAnnotations.length) {
        throw new Error('资源标注不存在');
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredAnnotations));
      return true;
    } catch (error) {
      console.error('删除资源标注失败:', error);
      throw new Error('删除资源标注失败');
    }
  }

  // 批量删除资源标注
  deleteAnnotations(ids) {
    try {
      const annotations = this.getAllAnnotations();
      const filteredAnnotations = annotations.filter(annotation => !ids.includes(annotation.id));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredAnnotations));
      return true;
    } catch (error) {
      console.error('批量删除资源标注失败:', error);
      throw new Error('批量删除资源标注失败');
    }
  }

  // 搜索资源标注
  searchAnnotations(query, filters = {}) {
    try {
      let annotations = this.getAllAnnotations();
      
      // 文本搜索
      if (query && query.trim()) {
        const searchTerm = query.toLowerCase().trim();
        annotations = annotations.filter(annotation => 
          annotation.title.toLowerCase().includes(searchTerm) ||
          annotation.content.toLowerCase().includes(searchTerm) ||
          annotation.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      // 分类过滤
      if (filters.category && filters.category !== 'all') {
        if (filters.category === 'priority') {
          annotations = annotations.filter(annotation => annotation.priority);
        } else {
          annotations = annotations.filter(annotation => annotation.category === filters.category);
        }
      }
      
      // 标签过滤
      if (filters.tags && filters.tags.length > 0) {
        annotations = annotations.filter(annotation => 
          filters.tags.some(tag => annotation.tags.includes(tag))
        );
      }
      
      // 日期范围过滤
      if (filters.dateRange) {
        const { start, end } = filters.dateRange;
        annotations = annotations.filter(annotation => {
          const annotationDate = new Date(annotation.createdAt);
          return annotationDate >= start && annotationDate <= end;
        });
      }
      
      return annotations;
    } catch (error) {
      console.error('搜索资源标注失败:', error);
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

      // 更新所有资源标注中的标签
      const annotations = this.getAllAnnotations();
      const updatedAnnotations = annotations.map(annotation => {
        if (annotation.tags && annotation.tags.includes(oldTag)) {
          const updatedTags = annotation.tags.map(tag => tag === oldTag ? newTag : tag);
          return { ...annotation, tags: updatedTags };
        }
        return annotation;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnnotations));
      
      return true;
    } catch (error) {
      console.error('重命名标签失败:', error);
      return false;
    }
  }

  // 获取资源标注统计信息
  getAnnotationStats() {
    try {
      const annotations = this.getAllAnnotations();
      const categories = this.getCategories();
      
      const stats = {
        total: annotations.length,
        priority: annotations.filter(annotation => annotation.priority).length,
        categories: {},
        tags: {},
        totalWords: annotations.reduce((sum, annotation) => sum + annotation.wordCount, 0),
        recentAnnotations: annotations.slice(0, 5)
      };
      
      // 统计各分类资源标注数量
      categories.forEach(category => {
        if (category.id === 'all') {
          stats.categories[category.id] = annotations.length;
        } else if (category.id === 'priority') {
          stats.categories[category.id] = annotations.filter(annotation => annotation.priority).length;
        } else {
          stats.categories[category.id] = annotations.filter(annotation => annotation.category === category.id).length;
        }
      });
      
      // 为了兼容ResourceAnnotation组件中使用的category.value，也添加相同的统计数据
      const uiCategories = [
        { value: 'all', id: 'all' },
        { value: 'image_annotation', id: 'image_annotation' },
        { value: 'text_annotation', id: 'text_annotation' },
        { value: 'video_annotation', id: 'video_annotation' },
        { value: 'audio_annotation', id: 'audio_annotation' },
        { value: 'document_annotation', id: 'document_annotation' },
        { value: 'web_annotation', id: 'web_annotation' },
        { value: 'code_annotation', id: 'code_annotation' },
        { value: 'data_annotation', id: 'data_annotation' }
      ];
      
      uiCategories.forEach(category => {
        if (category.value === 'all') {
          stats.categories[category.value] = annotations.length;
        } else {
          stats.categories[category.value] = annotations.filter(annotation => annotation.category === category.value).length;
        }
      });
      
      // 统计标签使用频率
      annotations.forEach(annotation => {
        annotation.tags.forEach(tag => {
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
        recentAnnotations: []
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

  // 导出资源标注数据
  exportAnnotations(format = 'json') {
    try {
      const annotations = this.getAllAnnotations();
      const categories = this.getCategories();
      const tags = this.getTags();
      
      const exportData = {
        annotations,
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
      console.error('导出资源标注失败:', error);
      throw new Error('导出资源标注失败');
    }
  }

  // 导入资源标注数据
  importAnnotations(data, options = { merge: true }) {
    try {
      let importData;
      
      if (typeof data === 'string') {
        importData = JSON.parse(data);
      } else {
        importData = data;
      }
      
      if (!importData.annotations || !Array.isArray(importData.annotations)) {
        throw new Error('无效的导入数据格式');
      }
      
      if (options.merge) {
        // 合并模式：保留现有数据，添加新数据
        const existingAnnotations = this.getAllAnnotations();
        const existingIds = new Set(existingAnnotations.map(annotation => annotation.id));
        
        const newAnnotations = importData.annotations.filter(annotation => !existingIds.has(annotation.id));
        const mergedAnnotations = [...existingAnnotations, ...newAnnotations];
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedAnnotations));
        
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
          imported: newAnnotations.length,
          skipped: importData.annotations.length - newAnnotations.length,
          total: mergedAnnotations.length
        };
      } else {
        // 替换模式：完全替换现有数据
        localStorage.setItem(STORAGE_KEY, JSON.stringify(importData.annotations));
        
        if (importData.categories) {
          localStorage.setItem(CATEGORIES_KEY, JSON.stringify(importData.categories));
        }
        
        if (importData.tags) {
          localStorage.setItem(TAGS_KEY, JSON.stringify(importData.tags));
        }
        
        return {
          imported: importData.annotations.length,
          skipped: 0,
          total: importData.annotations.length
        };
      }
    } catch (error) {
      console.error('导入资源标注失败:', error);
      throw new Error('导入资源标注失败: ' + error.message);
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
    return this.searchAnnotations(criteria);
  }

  // 统计相关别名方法
  getNotesStats() {
    return this.getAnnotationStats();
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

  // 别名方法：为了兼容ResourceAnnotation组件中的调用
  searchNotes(query, filters = {}) {
    // 将简单的查询字符串转换为搜索条件
    const criteria = {
      keyword: query,
      ...filters
    };
    return this.searchAnnotations(criteria);
  }

  // 更多别名方法
  createNote(noteData) {
    return this.createAnnotation(noteData);
  }

  updateNote(id, noteData) {
    return this.updateAnnotation(id, noteData);
  }

  deleteNote(id) {
    return this.deleteAnnotation(id);
  }

  toggleStar(id) {
    return this.togglePriority(id);
  }

  exportNotes() {
    return this.exportAnnotations();
  }

  importNotes(data, options) {
    return this.importAnnotations(data, options);
  }

  advancedSearch(criteria) {
    return this.searchAnnotations(criteria);
  }

  // 初始化模拟资源标注数据
  initializeMockAnnotationData() {
    try {
      const existingData = this.getAllAnnotations();
      if (existingData.length === 0) {
        const mockData = generateAllMockAnnotationData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
        console.log(`已初始化 ${mockData.length} 条模拟资源标注数据`);
        return mockData;
      }
      return existingData;
    } catch (error) {
      console.error('初始化模拟数据失败:', error);
      return [];
    }
  }

  // 生成特定类型的资源标注数据
  generateTypeAnnotationData(annotationType, category, count = 10) {
    try {
      const typeData = generateTypeSpecificData(annotationType, category, count);
      const existingData = this.getAllAnnotations();
      const newData = [...existingData, ...typeData];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      console.log(`为${category}类型生成了 ${typeData.length} 条资源标注数据`);
      return typeData;
    } catch (error) {
      console.error('生成类型资源标注数据失败:', error);
      return [];
    }
  }

  // 生成图像标注数据
  generateImageAnnotationData() {
    try {
      // 直接使用导入的IMAGE_ANNOTATION_DATA，避免递归调用
      const imageAnnotationData = [...IMAGE_ANNOTATION_DATA];
      const existingData = this.getAllAnnotations();
      
      // 检查是否已存在图像标注数据，避免重复添加
      const hasImageAnnotationData = existingData.some(item => 
        item.tags && item.tags.includes('图像标注')
      );
      
      if (!hasImageAnnotationData) {
        const newData = [...existingData, ...imageAnnotationData];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        console.log(`生成了 ${imageAnnotationData.length} 条图像标注数据`);
        return imageAnnotationData;
      } else {
        console.log('图像标注数据已存在，跳过生成');
        return existingData.filter(item => 
          item.tags && item.tags.includes('图像标注')
        );
      }
    } catch (error) {
      console.error('生成图像标注数据失败:', error);
      return [];
    }
  }

  // 获取图像标注统计数据
  getImageAnnotationStats() {
    try {
      const allAnnotations = this.getAllAnnotations();
      const imageAnnotations = allAnnotations.filter(item => 
        item.tags && item.tags.includes('图像标注')
      );
      
      if (imageAnnotations.length === 0) {
        return getImageAnnotationStats();
      }
      
      return {
        total: imageAnnotations.length,
        byType: imageAnnotations.reduce((acc, item) => {
          acc[item.type] = (acc[item.type] || 0) + 1;
          return acc;
        }, {}),
        byStatus: imageAnnotations.reduce((acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {}),
        byPriority: imageAnnotations.reduce((acc, item) => {
          acc[item.priorityLevel] = (acc[item.priorityLevel] || 0) + 1;
          return acc;
        }, {}),
        highPriorityCount: imageAnnotations.filter(item => item.priority).length,
        completedCount: imageAnnotations.filter(item => item.status === 'completed').length
      };
    } catch (error) {
      console.error('获取图像标注统计失败:', error);
      return getImageAnnotationStats();
    }
  }

  // 获取资源标注统计数据
  getAnnotationStatsData() {
    try {
      const annotations = this.getAllAnnotations();
      return generateAnnotationStats(annotations);
    } catch (error) {
      console.error('获取资源标注统计失败:', error);
      return {
        total: 0,
        byStatus: {},
        byType: {},
        byPriority: {},
        bySource: {},
        byCategory: {},
        byFormat: {},
        recentActivity: []
      };
    }
  }

  // 初始化资源标注来源数据
  initializeAnnotationSources() {
    const SOURCES_KEY = 'annotation_sources_data';
    try {
      if (!localStorage.getItem(SOURCES_KEY)) {
        localStorage.setItem(SOURCES_KEY, JSON.stringify(ANNOTATION_SOURCE_INIT_DATA));
        console.log(`已初始化 ${ANNOTATION_SOURCE_INIT_DATA.length} 个资源标注来源`);
      }
      return JSON.parse(localStorage.getItem(SOURCES_KEY) || '[]');
    } catch (error) {
      console.error('初始化资源标注来源失败:', error);
      return [];
    }
  }

  // 获取所有资源标注来源
  getAnnotationSources() {
    const SOURCES_KEY = 'annotation_sources_data';
    try {
      return JSON.parse(localStorage.getItem(SOURCES_KEY) || '[]');
    } catch (error) {
      console.error('获取资源标注来源失败:', error);
      return [];
    }
  }

  // 添加资源标注来源
  addAnnotationSource(sourceData) {
    const SOURCES_KEY = 'annotation_sources_data';
    try {
      const sources = this.getAnnotationSources();
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
      console.error('添加资源标注来源失败:', error);
      throw new Error('添加资源标注来源失败');
    }
  }

  // 更新资源标注来源
  updateAnnotationSource(id, sourceData) {
    const SOURCES_KEY = 'annotation_sources_data';
    try {
      const sources = this.getAnnotationSources();
      const sourceIndex = sources.findIndex(source => source.id === id);
      
      if (sourceIndex === -1) {
        throw new Error('资源标注来源不存在');
      }
      
      sources[sourceIndex] = {
        ...sources[sourceIndex],
        ...sourceData,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(SOURCES_KEY, JSON.stringify(sources));
      return sources[sourceIndex];
    } catch (error) {
      console.error('更新资源标注来源失败:', error);
      throw new Error('更新资源标注来源失败');
    }
  }

  // 删除资源标注来源
  deleteAnnotationSource(id) {
    const SOURCES_KEY = 'annotation_sources_data';
    try {
      const sources = this.getAnnotationSources();
      const filteredSources = sources.filter(source => source.id !== id);
      
      if (sources.length === filteredSources.length) {
        throw new Error('资源标注来源不存在');
      }
      
      localStorage.setItem(SOURCES_KEY, JSON.stringify(filteredSources));
      return true;
    } catch (error) {
      console.error('删除资源标注来源失败:', error);
      throw new Error('删除资源标注来源失败');
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
      localStorage.removeItem('annotation_sources_data');
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
const annotationService = new AnnotationService();

export default annotationService;

// 导出类以便测试
export { AnnotationService };