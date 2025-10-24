import React, { useState, useEffect, useMemo } from 'react';
import { Tree, Checkbox, Input, Button, Space, Tag, Tooltip, Empty, Card, Badge, Rate, Typography, Divider, Modal } from 'antd';
import { 
  SearchOutlined, 
  FileTextOutlined, 
  VideoCameraOutlined, 
  LinkOutlined,
  DownOutlined,
  RightOutlined,
  UpOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  PlayCircleOutlined,
  BookOutlined,
  ExperimentOutlined,
  ToolOutlined,
  FileSearchOutlined,
  FormOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EyeOutlined,
  DownloadOutlined,
  StarOutlined,
  TrophyOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { trainingCategories, ResourceType, DifficultyLevel } from '../data/trainingCourseMockData';

const { Search } = Input;
const { Text, Title } = Typography;

// 资源类型图标映射 - 使用更现代的图标和渐变色
const resourceTypeIcons = {
  [ResourceType.COURSE]: <BookOutlined style={{ color: '#1890ff', fontSize: '16px' }} />,
  [ResourceType.VIDEO]: <PlayCircleOutlined style={{ color: '#f5222d', fontSize: '16px' }} />,
  [ResourceType.DOCUMENT]: <FileTextOutlined style={{ color: '#52c41a', fontSize: '16px' }} />,
  [ResourceType.CASE_STUDY]: <ExperimentOutlined style={{ color: '#fa8c16', fontSize: '16px' }} />,
  [ResourceType.TOOL]: <ToolOutlined style={{ color: '#722ed1', fontSize: '16px' }} />,
  [ResourceType.ASSESSMENT]: <FileSearchOutlined style={{ color: '#13c2c2', fontSize: '16px' }} />,
  [ResourceType.TEMPLATE]: <FormOutlined style={{ color: '#eb2f96', fontSize: '16px' }} />,
  [ResourceType.RESEARCH]: <BulbOutlined style={{ color: '#faad14', fontSize: '16px' }} />
};

// 分类图标映射 - 为不同分类添加特色图标
const categoryIcons = {
  'math-methods': <BulbOutlined style={{ color: '#1890ff', fontSize: '18px' }} />,
  'interactive-tools': <ExperimentOutlined style={{ color: '#722ed1', fontSize: '18px' }} />,
  'design-guides': <FormOutlined style={{ color: '#52c41a', fontSize: '18px' }} />,
  'management-skills': <ToolOutlined style={{ color: '#fa8c16', fontSize: '18px' }} />,
  'default': <FolderOutlined style={{ color: '#8c8c8c', fontSize: '18px' }} />
};

// 难度等级颜色映射 - 使用更丰富的颜色方案
const difficultyColors = {
  [DifficultyLevel.BEGINNER]: '#52c41a',
  [DifficultyLevel.INTERMEDIATE]: '#faad14', 
  [DifficultyLevel.ADVANCED]: '#f5222d'
};

// 难度等级标签映射
const difficultyLabels = {
  [DifficultyLevel.BEGINNER]: '初级',
  [DifficultyLevel.INTERMEDIATE]: '中级',
  [DifficultyLevel.ADVANCED]: '高级'
};

// 资源缩略图（简单映射）：视频用课堂讲解，其它用微缩
const getResourceThumbnail = (res) => {
  if (!res) return '/微缩.png';
  if (res.type === ResourceType.VIDEO) return '/课堂讲解.png';
  return '/微缩.png';
};

// 视频嵌入地址转换（支持 B 站、YouTube），其他直链回退
const getVideoEmbedUrl = (url = '') => {
  if (!url) return '';
  if (url.includes('bilibili.com')) {
    const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
    if (bvMatch) {
      return `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}&autoplay=0`;
    }
  }
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId[1]}`;
    }
  }
  return url; // 直链或其他平台
};

// 渲染视频预览
const renderVideoPreview = (video) => {
  const src = getVideoEmbedUrl(video?.url);
  if (!src) {
    return (
      <div style={{ textAlign: 'center', color: '#999', padding: 12 }}>
        当前数据无在线视频链接，暂不支持内嵌播放
      </div>
    );
  }
  return (
    <div style={{ height: 360, width: '100%' }}>
      <iframe
        src={src}
        style={{ width: '100%', height: '100%', border: 'none', borderRadius: 8 }}
        title={video?.title || '视频预览'}
        allowFullScreen
      />
    </div>
  );
};

// 渲染 PDF/文档预览（通过 Google Docs Viewer）
const renderFilePreview = (file) => {
  const url = file?.url;
  if (!url) {
    return (
      <div style={{ textAlign: 'center', color: '#999', padding: 12 }}>
        当前数据无文件链接，暂不支持在线预览
      </div>
    );
  }
  return (
    <div style={{ height: 480, width: '100%' }}>
      <iframe
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
        style={{ width: '100%', height: '100%', border: 'none', borderRadius: 8 }}
        title={file?.title || file?.name || '文件预览'}
      />
    </div>
  );
};

// 渲染音频预览
const renderAudioPreview = (audio) => {
  const url = audio?.url;
  if (!url) {
    return (
      <div style={{ textAlign: 'center', color: '#999', padding: 12 }}>
        当前数据无音频链接，暂不支持在线播放
      </div>
    );
  }
  return (
    <div style={{ width: '100%' }}>
      <audio controls style={{ width: '100%' }} src={url} />
    </div>
  );
};

const ResourceTreeView = ({ 
  onResourceSelect, 
  selectedResources = [], 
  showCheckbox = true,
  expandAll = false,
  searchable = true,
  recommendedResources = [], // 新增：推荐的资源列表
  isRefreshing = false, // 新增：刷新状态
  enableQuickPreview = true, // 新增：是否启用快速预览
  onQuickPreview // 新增：外部处理快速预览
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState(selectedResources);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [quickPreviewVisible, setQuickPreviewVisible] = useState(false); // 新增：预览弹窗
  const [previewResource, setPreviewResource] = useState(null); // 新增：当前预览资源

  // 初始化展开状态
  useEffect(() => {
    if (expandAll) {
      const allKeys = trainingCategories.map(category => category.id);
      setExpandedKeys(allKeys);
    }
  }, [expandAll]);

  // 构建树形数据
  const treeData = useMemo(() => {
    const filterResources = (resources, searchTerm) => {
      if (!searchTerm) return resources;
      
      return resources.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    };

    return trainingCategories.map(category => {
      const filteredResources = filterResources(category.resources, searchValue);
      
      // 如果搜索后该分类下没有资源，且有搜索条件，则不显示该分类
      if (searchValue && filteredResources.length === 0) {
        return null;
      }

      return {
        title: (
          <div className="category-node">
            <span className="category-icon">
              {categoryIcons[category.id] || categoryIcons['default']}
            </span>
            <span className="category-name">
              {category.name}
            </span>
            <span className="resource-count">
              ({filteredResources.length})
            </span>
          </div>
        ),
        key: category.id,
        children: filteredResources.map(resource => {
          // 检查是否为推荐资源
          const isRecommended = recommendedResources.some(rec => rec.id === resource.id);
          
          return {
            title: (
              <div className={`resource-node ${isRecommended ? 'recommended' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 4, overflow: 'hidden', background: '#fafafa', border: '1px solid #f0f0f0' }}>
                    <img src={getResourceThumbnail(resource)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </span>
                  <span className="resource-icon">
                    {resourceTypeIcons[resource.type]}
                  </span>
                  <span className="resource-title">
                    {resource.title}
                  </span>
                  {isRecommended && (
                    <span className="recommended-badge">
                      ⭐ 推荐
                    </span>
                  )}
                </span>
                {enableQuickPreview && (
                  <Tooltip title="快速预览">
                    <Button
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onQuickPreview) {
                          onQuickPreview(resource, mapPreviewType(resource.type));
                        } else {
                          setPreviewResource({ ...resource, categoryName: category.name });
                          setQuickPreviewVisible(true);
                        }
                      }}
                    />
                  </Tooltip>
                )}
              </div>
            ),
            key: `${category.id}-${resource.id}`,
            isLeaf: true,
            resourceData: resource,
            categoryData: category
          };
        })
      };
    }).filter(Boolean);
  }, [searchValue, recommendedResources, enableQuickPreview, onQuickPreview]);

  // 预览类型映射
  const mapPreviewType = (type) => {
    switch (type) {
      case ResourceType.VIDEO:
        return 'video';
      case ResourceType.DOCUMENT:
      case ResourceType.TEMPLATE:
        return 'file';
      case ResourceType.CASE_STUDY:
        return 'case';
      case ResourceType.RESEARCH:
        return 'paper';
      case ResourceType.ASSESSMENT:
        return 'survey';
      default:
        return 'text';
    }
  };

  // 处理展开/收起
  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  // 处理选择
  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
    
    // 获取选中的资源数据
    const selectedResourceData = [];
    const flattenTree = (nodes) => {
      nodes.forEach(node => {
        if (node.isLeaf && checkedKeysValue.includes(node.key)) {
          selectedResourceData.push({
            ...node.resourceData,
            categoryId: node.categoryData.id,
            categoryName: node.categoryData.name
          });
        }
        if (node.children) {
          flattenTree(node.children);
        }
      });
    };
    
    flattenTree(treeData);
    
    if (onResourceSelect) {
      onResourceSelect(selectedResourceData);
    }
  };

  // 处理节点选择（单击）
  const onSelect = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
    
    if (info.node.isLeaf && info.node.resourceData) {
      // 可以在这里处理单个资源的选择事件
      console.log('Selected resource:', info.node.resourceData);
    }
  };

  // 搜索时自动展开匹配的节点
  useEffect(() => {
    if (searchValue) {
      const expandedKeysForSearch = trainingCategories
        .filter(category => 
          category.resources.some(resource =>
            resource.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchValue.toLowerCase()) ||
            resource.tags.some(tag => tag.toLowerCase().includes(searchValue.toLowerCase()))
          )
        )
        .map(category => category.id);
      
      setExpandedKeys(expandedKeysForSearch);
      setAutoExpandParent(true);
    }
  }, [searchValue]);

  // 快速预览内容渲染（加入内容播放器）
  const renderQuickPreviewContent = (res) => {
    if (!res) return null;
    const type = res.type;
  
    const section = (title, children) => (
      <div style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>{title}</div>
        <div style={{ color: '#555' }}>{children}</div>
      </div>
    );
  
    return (
      <div>
        <div style={{ width: '100%', height: 160, borderRadius: 6, overflow: 'hidden', background: '#fafafa', border: '1px solid #f0f0f0', marginBottom: 8 }}>
          <img src={getResourceThumbnail(res)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          {resourceTypeIcons[type]}
          <span style={{ fontSize: 16, fontWeight: 600 }}>{res.title}</span>
          <Tag color={difficultyColors[res.difficulty] || '#999'}>
            {difficultyLabels[res.difficulty] || '未知难度'}
          </Tag>
        </div>
        <div style={{ color: '#666', marginBottom: 8 }}>{res.description}</div>
  
        {/* 元数据区 */}
        {type === ResourceType.COURSE && (
          <>
            {section('课程信息', (
              <span>
                时长：{res.duration || '未知'}； 讲师：{res.instructor || '未知'}； 评分：{res.rating || '暂无'}； 报名：{res.enrollments || 0}
              </span>
            ))}
          </>
        )}
        {type === ResourceType.DOCUMENT && (
          <>
            {section('文档信息', (
              <span>
                页数：{res.pages || '未知'}； 作者：{res.author || '未知'}； 下载：{res.downloads || 0}
              </span>
            ))}
          </>
        )}
        {type === ResourceType.VIDEO && (
          <>
            {section('视频信息', (
              <span>
                时长：{res.duration || '未知'}； 讲师：{res.instructor || '未知'}； 播放：{res.views || 0}； 点赞：{res.likes || 0}
              </span>
            ))}
          </>
        )}
  
        {/* 内容预览区 */}
        <Divider style={{ margin: '12px 0' }} />
        <div style={{ marginTop: 8 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>内容预览</div>
          {type === ResourceType.VIDEO && renderVideoPreview({ title: res.title, url: res.url })}
          {(type === ResourceType.DOCUMENT || type === ResourceType.TEMPLATE) && renderFilePreview({ title: res.title, url: res.url })}
          {/* 如后续新增音频类型，可直接启用下面一行 */}
          {/* {type === ResourceType.AUDIO && renderAudioPreview({ title: res.title, url: res.url })} */}
          {/* 其他类型暂以说明文字展示 */}
          {![ResourceType.VIDEO, ResourceType.DOCUMENT, ResourceType.TEMPLATE].includes(type) && (
            <div style={{ padding: 12, background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0', color: '#666' }}>
              当前类型暂不支持内容内嵌预览，可在详情页查看
            </div>
          )}
        </div>
      </div>
    );
  };

  // 计算选中状态
  const treeCheckable = showCheckbox;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {searchable && (
        <div style={{ marginBottom: '8px' }}>
          <Search
            placeholder="搜索资源标题/描述/标签"
            allowClear
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            style={{ width: '100%' }}
          />
        </div>
      )}

      <Tree
        checkable={treeCheckable}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={treeData}
        showIcon
      />

      {/* 快速预览弹窗 */}
      <Modal
        title={`快速预览 - ${previewResource?.title || ''}`}
        open={quickPreviewVisible}
        onCancel={() => setQuickPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setQuickPreviewVisible(false)}>
            关闭
          </Button>
        ]}
        width={640}
      >
        {renderQuickPreviewContent(previewResource)}
      </Modal>
    </div>
  );
};

export default ResourceTreeView;