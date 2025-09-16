import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Video, FileText, Download, Star, Eye, Clock, Tag, ChevronRight, ArrowLeft, Play } from 'lucide-react';
import './ResourceLibrary.css';
import resourceLibraryService from '../services/resourceLibraryService.js';
import { generateMockResourceData } from '../data/resourceLibraryMockData.js';
import {
  ResourceType,
  ResourceCategory,
  DifficultyLevel,
  TargetAudience,
  AgeGroup
} from '../types/resourceLibrary.js';

const ResourceLibrary = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [selectedResource, setSelectedResource] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [viewHistory, setViewHistory] = useState([]);
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);

  // 初始化数据
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // 生成模拟数据
      const mockData = generateMockResourceData();
      
      // 更新服务中的数据
      resourceLibraryService.storage.resources = mockData.resources;
      resourceLibraryService.storage.categories = mockData.categories;
      
      // 获取资源和分类
      const [resourcesResult, categoriesResult, statsResult] = await Promise.all([
        resourceLibraryService.getAllResources(),
        resourceLibraryService.getCategories(),
        resourceLibraryService.getStatistics()
      ]);
      
      if (resourcesResult.success) {
        setResources(resourcesResult.data);
      }
      
      if (categoriesResult.success) {
        setCategories(categoriesResult.data);
      }
      
      if (statsResult.success) {
        setStatistics(statsResult.data);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 动态生成分类数据
  const categoryOptions = [
    { id: 'all', name: '全部', count: resources.length },
    ...categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      count: cat.resourceCount || 0
    }))
  ];

  // 资源类型
  const types = [
    { id: 'all', name: '全部类型', icon: '📚' },
    { id: ResourceType.GUIDE, name: '指导手册', icon: '📖' },
    { id: ResourceType.VIDEO, name: '视频教程', icon: '🎥' },
    { id: ResourceType.AUDIO, name: '音频资源', icon: '🎵' },
    { id: ResourceType.DOCUMENT, name: '文档资料', icon: '📄' },
    { id: ResourceType.TOOL, name: '工具软件', icon: '🔧' },
    { id: ResourceType.CASE_STUDY, name: '案例研究', icon: '🧪' }
  ];

  // 难度等级选项
  const difficultyOptions = [
    { id: 'all', name: '全部难度' },
    { id: DifficultyLevel.EASY, name: '简单' },
    { id: DifficultyLevel.MEDIUM, name: '中等' },
    { id: DifficultyLevel.HARD, name: '困难' }
  ];

  // 目标受众选项
  const audienceOptions = [
    { id: 'all', name: '全部受众' },
    ...Object.values(TargetAudience).map(audience => ({
      id: audience,
      name: audience
    }))
  ];

  // 过滤资源
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         resource.keywords?.some(kw => kw.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.resourceType === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty;
    const matchesAudience = selectedAudience === 'all' || resource.targetAudience?.includes(selectedAudience);
    
    return matchesSearch && matchesCategory && matchesType && matchesDifficulty && matchesAudience;
  });

  // 切换收藏
  const toggleFavorite = async (resourceId) => {
    try {
      const result = await resourceLibraryService.likeResource(resourceId);
      if (result.success) {
        setFavorites(prev => 
          prev.includes(resourceId) 
            ? prev.filter(id => id !== resourceId)
            : [...prev, resourceId]
        );
        
        // 更新资源数据中的点赞数
        setResources(prev => prev.map(resource => 
          resource.id === resourceId 
            ? { ...resource, stats: { ...resource.stats, likes: result.data.likes } }
            : resource
        ));
      }
    } catch (error) {
      console.error('切换收藏失败:', error);
    }
  };

  // 查看资源
  const viewResource = async (resource) => {
    setSelectedResource(resource);
    setViewHistory(prev => {
      const newHistory = prev.filter(id => id !== resource.id);
      return [resource.id, ...newHistory].slice(0, 10);
    });
    
    // 增加浏览量
    try {
      const result = await resourceLibraryService.getResourceById(resource.id);
      if (result.success) {
        // 更新资源数据中的浏览量
        setResources(prev => prev.map(r => 
          r.id === resource.id 
            ? { ...r, stats: { ...r.stats, views: result.data.stats.views } }
            : r
        ));
      }
    } catch (error) {
      console.error('更新浏览量失败:', error);
    }
  };

  // 获取类型图标
  const getTypeIcon = (type) => {
    const typeObj = types.find(t => t.id === type);
    return typeObj ? typeObj.icon : '📄';
  };

  // 获取类型名称
  const getTypeName = (type) => {
    const typeObj = types.find(t => t.id === type);
    const typeMap = {
      'video': '视频',
      'article': '文章',
      'course': '课程',
      'tool': '工具',
      'book': '书籍',
      'document': '文档',
      'audio': '音频',
      'interactive': '互动',
      'assessment': '评估',
      'template': '模板'
    };
    return typeObj ? typeObj.name : (typeMap[type] || '其他');
  };

  // 获取难度颜色
  const getDifficultyColor = (difficulty) => {
    const colorMap = {
      'beginner': '#4CAF50',
      'intermediate': '#FF9800',
      'advanced': '#F44336',
      'expert': '#9C27B0'
    };
    switch (difficulty) {
      case DifficultyLevel.EASY: return '#52c41a';
      case DifficultyLevel.MEDIUM: return '#faad14';
      case DifficultyLevel.HARD: return '#f5222d';
      default: return colorMap[difficulty] || '#d9d9d9';
    }
  };

  // 获取难度文本
  const getDifficultyText = (difficulty) => {
    const textMap = {
      'beginner': '初级',
      'intermediate': '中级',
      'advanced': '高级',
      'expert': '专家'
    };
    switch (difficulty) {
      case DifficultyLevel.EASY: return '简单';
      case DifficultyLevel.MEDIUM: return '中等';
      case DifficultyLevel.HARD: return '困难';
      default: return textMap[difficulty] || '未知';
    }
  };

  // 下载资源
  const downloadResource = async (resource, event) => {
    event.stopPropagation();
    try {
      const result = await resourceLibraryService.incrementDownloads(resource.id);
      if (result.success) {
        // 更新资源数据中的下载量
        setResources(prev => prev.map(r => 
          r.id === resource.id 
            ? { ...r, stats: { ...r.stats, downloads: result.data.downloads } }
            : r
        ));
        
        // 模拟下载
        const link = document.createElement('a');
        link.href = resource.content?.mainFile || '#';
        link.download = resource.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('下载失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="resource-library loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>正在加载资源库...</p>
        </div>
      </div>
    );
  }

  if (selectedResource) {
    return (
      <div className="resource-detail">
        <div className="detail-header">
          <button className="back-button" onClick={() => setSelectedResource(null)}>
            <ArrowLeft size={20} />
            返回资源库
          </button>
          
          <div className="detail-actions">
            <button 
              className={`favorite-btn ${favorites.includes(selectedResource.id) ? 'favorited' : ''}`}
              onClick={() => toggleFavorite(selectedResource.id)}
            >
              <Star size={20} fill={favorites.includes(selectedResource.id) ? 'currentColor' : 'none'} />
              {favorites.includes(selectedResource.id) ? '已收藏' : '收藏'}
            </button>
            
            <button 
              className="download-btn"
              onClick={(e) => downloadResource(selectedResource, e)}
            >
              <Download size={20} />
              下载
            </button>
          </div>
        </div>
        
        <div className="detail-content">
          <div className="detail-meta">
            <h1 className="detail-title">{selectedResource.title}</h1>
            
            <div className="meta-info">
              <div className="meta-item">
                <span className="type-icon">{getTypeIcon(selectedResource.type)}</span>
                <span>{getTypeName(selectedResource.type)}</span>
              </div>
              <div className="meta-item">
                <Clock size={16} />
                <span>{selectedResource.duration || selectedResource.readTime}</span>
              </div>
              <div className="meta-item">
                <Eye size={16} />
                <span>{selectedResource.stats?.views || selectedResource.views} 次浏览</span>
              </div>
              <div className="meta-item">
                <Star size={16} />
                <span>{selectedResource.stats?.rating || selectedResource.rating} 分</span>
              </div>
              {selectedResource.stats?.downloads && (
                <div className="meta-item">
                  <Download size={16} />
                  <span>{selectedResource.stats.downloads} 次下载</span>
                </div>
              )}
              {selectedResource.difficulty && (
                <div className="meta-item">
                  <span 
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(selectedResource.difficulty) }}
                  >
                    {getDifficultyText(selectedResource.difficulty)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="detail-tags">
              {selectedResource.tags.map((tag, index) => (
                <span key={index} className="detail-tag">
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="author-info">
              <span>作者：{selectedResource.author?.name || selectedResource.author}</span>
              {selectedResource.author?.organization && (
                <span>机构：{selectedResource.author.organization}</span>
              )}
              <span>发布时间：{selectedResource.createTime || selectedResource.publishDate}</span>
              {selectedResource.updateTime && selectedResource.updateTime !== selectedResource.createTime && (
                <span>更新时间：{selectedResource.updateTime}</span>
              )}
            </div>
            
            {selectedResource.targetAudience && selectedResource.targetAudience.length > 0 && (
              <div className="target-audience">
                <h4>目标受众：</h4>
                <div className="audience-tags">
                  {selectedResource.targetAudience.map((audience, index) => (
                    <span key={index} className="audience-tag">{audience}</span>
                  ))}
                </div>
              </div>
            )}
            
            {selectedResource.ageGroup && selectedResource.ageGroup.length > 0 && (
              <div className="age-group">
                <h4>适用年龄：</h4>
                <div className="age-tags">
                  {selectedResource.ageGroup.map((age, index) => (
                    <span key={index} className="age-tag">{age}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="detail-body">
            {selectedResource.type === 'video' ? (
              <div className="video-placeholder">
                <div className="video-icon">
                  <Video size={48} />
                </div>
                <h3>视频教程</h3>
                <p>{selectedResource.description}</p>
                <button className="play-btn">
                  <Play size={20} />
                  播放视频
                </button>
              </div>
            ) : (
              <div className="text-content">
                <div className="content-text">{selectedResource.content}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resource-library">
      {/* 头部 */}
      <div className="library-header">
        <div className="header-nav">
          <h1 className="library-title">
            <BookOpen size={24} />
            资源库
          </h1>
        </div>
        
        {/* 搜索栏 */}
        <div className="search-section">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="搜索资源、案例、技巧..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-section">
              <div className="category-filters">
                {categoryOptions.map(category => (
                  <button
                    key={category.id}
                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                    <span className="count">({category.count})</span>
                  </button>
                ))}
              </div>
              
              <div className="type-filters">
                {types.map(type => (
                  <button
                    key={type.id}
                    className={`type-btn ${selectedType === type.id ? 'active' : ''}`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <span className="type-icon">{type.icon}</span>
                    {type.name}
                  </button>
                ))}
              </div>
              
              <div className="additional-filters">
                <select 
                  value={selectedDifficulty} 
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="difficulty-select"
                >
                  {difficultyOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
                
                <select 
                  value={selectedAudience} 
                  onChange={(e) => setSelectedAudience(e.target.value)}
                  className="audience-select"
                >
                  {audienceOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
              </div>
            </div>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="library-content">
        <div className="content-grid">
          {/* 资源列表 */}
          <div className="resources-section">
            <div className="section-header">
              <h2>资源列表</h2>
              <span className="result-count">共 {filteredResources.length} 个资源</span>
            </div>
            
            <div className="resources-grid">
              {filteredResources.map((resource, index) => (
                <div 
                  key={resource.id} 
                  className="resource-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => viewResource(resource)}
                >
                  <div className="card-header">
                    <div className="resource-type">
                    <span className="type-icon">{getTypeIcon(resource.resourceType || resource.type)}</span>
                    <span className="type-name">{getTypeName(resource.resourceType || resource.type)}</span>
                  </div>
                    
                    <button 
                      className={`favorite-btn ${favorites.includes(resource.id) ? 'favorited' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(resource.id);
                      }}
                    >
                      <Star size={16} fill={favorites.includes(resource.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  
                  <h3 className="resource-title">{resource.title}</h3>
                  <p className="resource-description">{resource.description}</p>
                  
                  <div className="resource-meta">
                    <div className="meta-item">
                      <Clock size={14} />
                      <span>{resource.duration || resource.readTime}</span>
                    </div>
                    <div className="meta-item">
                      <Eye size={14} />
                      <span>{resource.stats?.views || resource.views}</span>
                    </div>
                    <div className="meta-item">
                      <Star size={14} />
                      <span>{resource.stats?.rating || resource.rating}</span>
                    </div>
                    {resource.difficulty && (
                      <div className="meta-item difficulty">
                        <span 
                          className="difficulty-badge"
                          style={{ backgroundColor: getDifficultyColor(resource.difficulty) }}
                        >
                          {getDifficultyText(resource.difficulty)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="resource-tags">
                    {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span key={tagIndex} className="tag">{tag}</span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="tag more">+{resource.tags.length - 3}</span>
                    )}
                  </div>
                  
                  <div className="card-footer">
                    <span className="author">{resource.author?.name || resource.author}</span>
                    <div className="card-actions">
                      <button 
                        className="download-btn-small"
                        onClick={(e) => downloadResource(resource, e)}
                        title="下载资源"
                      >
                        <Download size={14} />
                        <span>{resource.stats?.downloads || 0}</span>
                      </button>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredResources.length === 0 && (
              <div className="no-results">
                <div className="no-results-icon">
                  <Search size={48} />
                </div>
                <h3>未找到相关资源</h3>
                <p>尝试调整搜索条件或浏览其他分类</p>
              </div>
            )}
          </div>
          
          {/* 侧边栏 */}
          <div className="sidebar">
            {/* 我的收藏 */}
            {favorites.length > 0 && (
              <div className="sidebar-section">
                <h3 className="sidebar-title">
                  <Star size={18} />
                  我的收藏
                </h3>
                <div className="favorite-list">
                  {resources
                    .filter(r => favorites.includes(r.id))
                    .slice(0, 5)
                    .map(resource => (
                      <div 
                        key={resource.id} 
                        className="favorite-item"
                        onClick={() => viewResource(resource)}
                      >
                        <span className="type-icon">{getTypeIcon(resource.type)}</span>
                        <span className="title">{resource.title}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
            
            {/* 最近浏览 */}
            {viewHistory.length > 0 && (
              <div className="sidebar-section">
                <h3 className="sidebar-title">
                  <Clock size={18} />
                  最近浏览
                </h3>
                <div className="history-list">
                  {viewHistory
                    .map(id => resources.find(r => r.id === id))
                    .filter(Boolean)
                    .slice(0, 5)
                    .map(resource => (
                      <div 
                        key={resource.id} 
                        className="history-item"
                        onClick={() => viewResource(resource)}
                      >
                        <span className="type-icon">{getTypeIcon(resource.type)}</span>
                        <span className="title">{resource.title}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
            
            {/* 热门资源 */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">
                <Eye size={18} />
                热门资源
              </h3>
              <div className="popular-list">
                {resources
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map(resource => (
                    <div 
                      key={resource.id} 
                      className="popular-item"
                      onClick={() => viewResource(resource)}
                    >
                      <span className="type-icon">{getTypeIcon(resource.type)}</span>
                      <div className="item-info">
                        <span className="title">{resource.title}</span>
                        <span className="views">{resource.views} 次浏览</span>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceLibrary;