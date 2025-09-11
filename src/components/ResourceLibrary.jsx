import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Video, FileText, Download, Star, Eye, Clock, Tag, ChevronRight, ArrowLeft } from 'lucide-react';
import './ResourceLibrary.css';

const ResourceLibrary = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedResource, setSelectedResource] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [viewHistory, setViewHistory] = useState([]);

  // 资源数据
  const resources = [
    {
      id: 'anxiety-guide',
      title: '大学生焦虑症识别与干预指南',
      type: 'guide',
      category: 'anxiety',
      description: '详细介绍大学生焦虑症的症状识别、评估方法和干预策略，包含实用的咨询技巧和案例分析。',
      content: '这是一个详细的焦虑症识别与干预指南，包含理论知识和实践技巧。',
      author: '心理健康教育中心',
      publishDate: '2024-01-15',
      readTime: '25分钟',
      views: 1245,
      rating: 4.8,
      tags: ['焦虑症', '识别', '干预', 'CBT', '大学生']
    },
    {
      id: 'depression-case',
      title: '抑郁症大学生咨询案例集',
      type: 'case',
      category: 'depression',
      description: '收录了10个典型的大学生抑郁症咨询案例，详细记录了咨询过程、技术运用和效果评估。',
      content: '这是一个包含多个抑郁症咨询案例的资源集合。',
      author: '临床心理学专家组',
      publishDate: '2024-01-20',
      readTime: '45分钟',
      views: 892,
      rating: 4.9,
      tags: ['抑郁症', '案例分析', '咨询技术', '大学生', '治疗过程']
    },
    {
      id: 'crisis-intervention',
      title: '大学生心理危机干预操作手册',
      type: 'manual',
      category: 'crisis',
      description: '针对大学生心理危机的识别、评估和干预的标准化操作流程，包含紧急情况处理预案。',
      content: '这是一个完整的心理危机干预操作手册。',
      author: '心理危机干预专家委员会',
      publishDate: '2024-01-10',
      readTime: '60分钟',
      views: 2156,
      rating: 4.9,
      tags: ['心理危机', '干预流程', '自杀预防', '操作手册', '应急处理']
    },
    {
      id: 'communication-skills',
      title: '心理咨询沟通技巧视频教程',
      type: 'video',
      category: 'skills',
      description: '通过实际案例演示，学习心理咨询中的基本沟通技巧，包括倾听、共情、提问等核心技能。',
      content: '这是一个视频资源，包含12个模块的沟通技巧训练内容。',
      author: '心理咨询技能培训中心',
      publishDate: '2024-01-25',
      readTime: '120分钟',
      views: 3421,
      rating: 4.7,
      tags: ['沟通技巧', '视频教程', '实践演示', '咨询技能', '培训']
    },
    {
      id: 'group-therapy',
      title: '大学生团体心理辅导方案集',
      type: 'program',
      category: 'group',
      description: '针对不同主题设计的团体心理辅导方案，包括人际关系、情绪管理、自我成长等主题。',
      content: '这是一个包含多个团体辅导方案的资源集合。',
      author: '团体心理辅导专家组',
      publishDate: '2024-01-18',
      readTime: '40分钟',
      views: 1567,
      rating: 4.6,
      tags: ['团体辅导', '方案设计', '人际关系', '情绪管理', '自我成长']
    }
  ];

  // 分类数据
  const categories = [
    { id: 'all', name: '全部', count: resources.length },
    { id: 'anxiety', name: '焦虑相关', count: resources.filter(r => r.category === 'anxiety').length },
    { id: 'depression', name: '抑郁相关', count: resources.filter(r => r.category === 'depression').length },
    { id: 'crisis', name: '危机干预', count: resources.filter(r => r.category === 'crisis').length },
    { id: 'skills', name: '咨询技能', count: resources.filter(r => r.category === 'skills').length },
    { id: 'group', name: '团体辅导', count: resources.filter(r => r.category === 'group').length }
  ];

  // 资源类型
  const types = [
    { id: 'all', name: '全部类型', icon: '📚' },
    { id: 'guide', name: '指导手册', icon: '📖' },
    { id: 'case', name: '案例分析', icon: '📋' },
    { id: 'manual', name: '操作手册', icon: '📝' },
    { id: 'video', name: '视频教程', icon: '🎥' },
    { id: 'program', name: '辅导方案', icon: '📊' }
  ];

  // 过滤资源
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  // 切换收藏
  const toggleFavorite = (resourceId) => {
    setFavorites(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  // 查看资源
  const viewResource = (resource) => {
    setSelectedResource(resource);
    setViewHistory(prev => {
      const newHistory = prev.filter(id => id !== resource.id);
      return [resource.id, ...newHistory].slice(0, 10);
    });
  };

  // 获取类型图标
  const getTypeIcon = (type) => {
    const typeObj = types.find(t => t.id === type);
    return typeObj ? typeObj.icon : '📄';
  };

  // 获取类型名称
  const getTypeName = (type) => {
    const typeObj = types.find(t => t.id === type);
    return typeObj ? typeObj.name : '未知类型';
  };

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
            
            <button className="download-btn">
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
                <span>{selectedResource.readTime}</span>
              </div>
              <div className="meta-item">
                <Eye size={16} />
                <span>{selectedResource.views} 次浏览</span>
              </div>
              <div className="meta-item">
                <Star size={16} />
                <span>{selectedResource.rating} 分</span>
              </div>
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
              <span>作者：{selectedResource.author}</span>
              <span>发布时间：{selectedResource.publishDate}</span>
            </div>
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
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={20} />
            返回
          </button>
          
          <h1 className="library-title">
            <BookOpen size={24} />
            心理健康资源库
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
              {categories.map(category => (
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
                      <span className="type-icon">{getTypeIcon(resource.type)}</span>
                      <span className="type-name">{getTypeName(resource.type)}</span>
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
                      <span>{resource.readTime}</span>
                    </div>
                    <div className="meta-item">
                      <Eye size={14} />
                      <span>{resource.views}</span>
                    </div>
                    <div className="meta-item">
                      <Star size={14} />
                      <span>{resource.rating}</span>
                    </div>
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
                    <span className="author">{resource.author}</span>
                    <ChevronRight size={16} />
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