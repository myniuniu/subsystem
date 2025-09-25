import React from 'react';
import {
  Layout,
  Input,
  Button,
  Typography,
  Space,
  message,
  Upload,
  Card,
  Divider,
  Tag,
  Tooltip,
  Select,
  Modal,
  Checkbox,
  Popconfirm,
  Dropdown,
  Progress
} from 'antd';
import MaterialAddPage from './MaterialAddPage';
import ExploreModal from './ExploreModal';
import CapabilityMindMap from './CapabilityMindMap.jsx';
import KnowledgeGraphMindMap from './KnowledgeGraphMindMap.jsx';
import courseSelectionService from '../services/courseSelectionService';
import {
  ArrowLeftOutlined,
  UploadOutlined,
  FileTextOutlined,
  LinkOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  RobotOutlined,
  NodeIndexOutlined
} from '@ant-design/icons';
import { Grid, Map } from 'lucide-react';
import { VIEW_MODES, DEFAULT_COURSE_VIDEOS } from '../constants/noteEditConstants';
import { 
  generateSmartNote, 
  getLiveStreamStatus, 
  getVideoEmbedUrl,
  validateUrl,
  checkVideoWebsiteType
} from '../utils/noteEditUtils';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const MaterialManagement = ({ state, handlers, onBack, mode }) => {
  const {
    uploadedFiles,
    setUploadedFiles,
    organizationalCourses,
    setOrganizationalCourses,
    selectedMaterials,
    setSelectedMaterials,
    links,
    setLinks,
    newLink,
    setNewLink,
    showUploadModal,
    setShowUploadModal,
    showMaterialAddModal,
    setShowMaterialAddModal,
    websiteType,
    setWebsiteType,
    websiteUrl,
    setWebsiteUrl,
    textContent,
    setTextContent,
    addedTexts,
    setAddedTexts,
    videoTitle,
    setVideoTitle,
    videoUrl,
    setVideoUrl,
    courseVideos,
    setCourseVideos,
    selectedCourses,
    setSelectedCourses,
    hoveredItems,
    setHoveredItems,
    viewMode,
    setViewMode,
    selectedCapabilityCategory,
    setSelectedCapabilityCategory,
    selectedKnowledgeCategory,
    setSelectedKnowledgeCategory,
    showCapabilityMapModal,
    setShowCapabilityMapModal,
    showKnowledgeGraphModal,
    setShowKnowledgeGraphModal,
    capabilityMap,
    capabilityVideos,
    knowledgeGraph,
    capabilityCategories,
    knowledgeCategories,
    currentView,
    liveStreams,
    showExploreModal,
    setShowExploreModal,
    materials
  } = state;

  const {
    onPlayVideo,
    onViewMaterial,
    onCapabilityNodeClick,
    onCapabilityVideoClick,
    onKnowledgeNodeClick,
    onKnowledgeResourceClick,
    onExplore
  } = handlers;

  // 文件上传处理
  const handleFileUpload = (info) => {
    const { status, originFileObj } = info.file;
    
    if (status === 'done') {
      const newFile = {
        id: Date.now(),
        name: originFileObj.name,
        size: originFileObj.size,
        type: originFileObj.type,
        uploadTime: new Date().toISOString(),
        content: '文件内容预览...'
      };
      setUploadedFiles(prev => [...prev, newFile]);
      message.success(`${originFileObj.name} 上传成功`);
    } else if (status === 'error') {
      message.error(`${originFileObj.name} 上传失败`);
    }
  };

  // 添加链接
  const handleAddLink = () => {
    if (!newLink.trim()) {
      message.warning('请输入有效的链接地址');
      return;
    }
    
    const linkObj = {
      id: Date.now(),
      url: newLink,
      title: '链接标题',
      addTime: new Date().toISOString()
    };
    
    setLinks(prev => [...prev, linkObj]);
    setNewLink('');
    message.success('链接添加成功');
  };

  // 添加网站地址处理函数
  const handleAddWebsite = () => {
    if (!websiteUrl.trim()) {
      message.warning('请输入有效的网站地址');
      return;
    }

    // 验证视频网站地址
    if (websiteType === 'video') {
      const { isBilibili, isXiaohongshu } = checkVideoWebsiteType(websiteUrl);
      
      if (!isBilibili && !isXiaohongshu) {
        message.warning('视频地址仅支持B站和小红书链接');
        return;
      }
    }
    
    const websiteObj = {
      id: Date.now(),
      url: websiteUrl,
      type: websiteType,
      title: websiteType === 'video' ? '视频链接' : '网站链接',
      platform: websiteType === 'video' ? 
        (websiteUrl.includes('bilibili.com') || websiteUrl.includes('b23.tv') ? 'B站' : '小红书') : 
        '普通网站',
      addTime: new Date().toISOString()
    };
    
    setLinks(prev => [...prev, websiteObj]);
    setWebsiteUrl('');
    message.success(`${websiteType === 'video' ? '视频' : '网站'}地址添加成功`);
  };

  // 添加文字内容处理函数
  const handleAddText = () => {
    if (!textContent.trim()) {
      message.warning('请输入文字内容');
      return;
    }

    const textObj = {
      id: Date.now(),
      content: textContent.trim(),
      type: 'text',
      title: textContent.trim().length > 20 ? textContent.trim().substring(0, 20) + '...' : textContent.trim(),
      addTime: new Date().toISOString()
    };

    setAddedTexts(prev => [...prev, textObj]);
    setTextContent('');
    message.success('文字内容添加成功');
  };

  // 删除文字内容
  const handleDeleteText = (textId) => {
    setAddedTexts(prev => prev.filter(text => text.id !== textId));
    message.success('文字内容删除成功');
  };

  // 添加课程视频
  const handleAddVideo = () => {
    if (!videoTitle.trim()) {
      message.error('请输入视频标题');
      return;
    }
    if (!videoUrl.trim()) {
      message.error('请输入视频链接');
      return;
    }

    if (!validateUrl(videoUrl)) {
      message.error('请输入有效的视频链接');
      return;
    }

    const videoObj = {
      id: Date.now(),
      title: videoTitle.trim(),
      url: videoUrl.trim(),
      addedAt: new Date().toLocaleString()
    };

    setCourseVideos(prev => [...prev, videoObj]);
    setVideoTitle('');
    setVideoUrl('');
    message.success('课程视频添加成功');
  };

  // 添加选课
  const handleAddCourse = (course) => {
    const isAlreadyAdded = selectedCourses.some(c => c.id === course.id);
    if (isAlreadyAdded) {
      message.warning('该课程已经添加过了');
      return;
    }

    const courseObj = {
      id: course.id || Date.now(),
      title: course.title,
      instructor: course.instructor,
      duration: course.duration,
      description: course.description || '',
      addedAt: new Date().toLocaleString(),
      type: 'course'
    };

    setSelectedCourses(prev => [...prev, courseObj]);
    message.success(`已添加课程：${course.title}`);
  };

  // 删除课程视频
  const handleDeleteVideo = (videoId) => {
    setCourseVideos(prev => prev.filter(video => video.id !== videoId));
    message.success('课程视频删除成功');
  };

  // 删除文件
  const handleDeleteFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    message.success('文件删除成功');
  };

  // 删除链接
  const handleDeleteLink = (linkId) => {
    setLinks(links.filter(link => link.id !== linkId));
    message.success('链接删除成功');
  };

  // 多选功能处理函数
  const handleSelectMaterial = (materialId, checked) => {
    if (checked) {
      setSelectedMaterials([...selectedMaterials, materialId]);
    } else {
      setSelectedMaterials(selectedMaterials.filter(id => id !== materialId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allMaterialIds = [
        ...uploadedFiles.map(file => `file-${file.id}`),
        ...addedTexts.map(text => `text-${text.id}`),
        ...courseVideos.map(video => `video-${video.id}`),
        ...links.map(link => `link-${link.id}`),
        ...organizationalCourses.map(course => `course-${course.id}`)
      ];
      setSelectedMaterials(allMaterialIds);
    } else {
      setSelectedMaterials([]);
    }
  };

  const handleBatchDelete = () => {
    selectedMaterials.forEach(materialId => {
      const [type, id] = materialId.split('-');
      const numId = parseInt(id);
      
      switch (type) {
        case 'file':
          setUploadedFiles(prev => prev.filter(file => file.id !== numId));
          break;
        case 'text':
          setAddedTexts(prev => prev.filter(text => text.id !== numId));
          break;
        case 'video':
          setCourseVideos(prev => prev.filter(video => video.id !== numId));
          break;
        case 'link':
          setLinks(prev => prev.filter(link => link.id !== numId));
          break;
        case 'course':
          setOrganizationalCourses(prev => prev.filter(course => course.id !== numId));
          break;
      }
    });
    setSelectedMaterials([]);
    message.success(`已删除 ${selectedMaterials.length} 个资料`);
  };

  return (
    <div style={{ 
      flex: currentView === 'video' ? 4 : (viewMode === 'map' ? 4 : 2.5), 
      background: '#fff', 
      margin: '16px 0 16px 16px', 
      borderRadius: '8px', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'flex 0.3s ease'
    }}>
      <div style={{ padding: '20px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>
              {mode === 'create' ? '📚 资料收集' : mode === 'edit' ? '📝 编辑主题' : '👁️ 查看主题'}
            </Title>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {selectedMaterials.length > 0 && (
              <Popconfirm
                title="确认删除"
                description={`确定要删除选中的 ${selectedMaterials.length} 个资料吗？`}
                onConfirm={handleBatchDelete}
                okText="确定"
                cancelText="取消"
              >
                <Button 
                  type="text" 
                  icon={<DeleteOutlined />}
                  danger
                  size="small"
                >
                  删除选中
                </Button>
              </Popconfirm>
            )}
            {onBack && (
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={onBack}
                style={{ color: '#666' }}
              >
                返回
              </Button>
            )}
          </div>
        </div>
        
        {/* 操作按钮区域 */}
        <div style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            style={{ flex: 1 }}
            onClick={() => setShowMaterialAddModal(true)}
          >
            添加
          </Button>
          <Button 
            type="default" 
            style={{ flex: 1 }}
            onClick={() => setShowExploreModal(true)}
          >
            探索
          </Button>
        </div>
        
        {/* 视图模式切换 - 仅在有知识图谱或能力模型相关资料时显示 */}
        {((capabilityMap && showCapabilityMapModal) || (knowledgeGraph && showKnowledgeGraphModal)) && (
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
            <Button.Group>
              <Button 
                type={viewMode === 'card' ? 'primary' : 'default'}
                icon={<Grid size={16} />}
                onClick={() => setViewMode('card')}
                size="small"
              >
                卡片模式
              </Button>
              <Button 
                type={viewMode === 'map' ? 'primary' : 'default'}
                icon={<Map size={16} />}
                onClick={() => setViewMode('map')}
                size="small"
              >
                地图模式
              </Button>
            </Button.Group>
          </div>
        )}
        
        <Divider style={{ margin: '16px 0' }} />
        
        {/* 选择所有来源 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          marginBottom: 12,
          border: '1px solid #e9ecef'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#495057', fontSize: '14px' }}>选择所有来源</span>
            <Tooltip title="重新加载示例数据">
              <Button 
                type="text" 
                size="small"
                icon={<RobotOutlined />}
                onClick={() => {
                  setCourseVideos(DEFAULT_COURSE_VIDEOS);
                  message.success('已重新加载5条视频课程记录');
                }}
                style={{ color: '#666' }}
              >
                初始化
              </Button>
            </Tooltip>
          </div>
          <Checkbox 
            style={{ marginLeft: 'auto' }}
            checked={selectedMaterials.length > 0 && selectedMaterials.length === (
              uploadedFiles.length + addedTexts.length + courseVideos.length + links.length + organizationalCourses.length
            )}
            indeterminate={selectedMaterials.length > 0 && selectedMaterials.length < (
              uploadedFiles.length + addedTexts.length + courseVideos.length + links.length + organizationalCourses.length
            )}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
        </div>

        {/* 资料列表内容区域 */}
        <div style={{ 
          height: liveStreams.some(stream => getLiveStreamStatus(stream) === 'live')
            ? 'calc(100vh - 332px)' 
            : 'calc(100vh - 280px)',
          overflowY: 'auto'
        }}>
          {/* 根据视图模式显示不同内容 */}
          {viewMode === 'map' ? (
            /* 地图模式 - 根据资料类型显示对应地图 */
            <div style={{ height: '100%' }}>
              {/* 能力模型地图 - 当有能力模型资料时显示 */}
              {capabilityMap && showCapabilityMapModal && (
                <div style={{ height: '100%' }}>
                  <div style={{ 
                    height: 'calc(100% - 12px)', 
                    border: '1px solid #e8e8e8', 
                    borderRadius: '8px',
                    background: '#fafafa',
                    position: 'relative'
                  }}>
                    <CapabilityMindMap 
                      capabilityMap={capabilityMap}
                      selectedCategory={'all'}
                      onNodeClick={onCapabilityNodeClick}
                      onVideoClick={onCapabilityVideoClick}
                    />
                  </div>
                </div>
              )}
              
              {/* 知识图谱地图 - 当有知识图谱资料时显示 */}
              {knowledgeGraph && showKnowledgeGraphModal && (
                <div style={{ height: '100%' }}>
                  <div style={{ 
                    height: 'calc(100% - 12px)', 
                    border: '1px solid #e8e8e8', 
                    borderRadius: '8px',
                    background: '#fafafa',
                    position: 'relative'
                  }}>
                    <KnowledgeGraphMindMap 
                      knowledgeGraph={knowledgeGraph}
                      selectedCategory={'all'}
                      onNodeClick={onKnowledgeNodeClick}
                      onResourceClick={onKnowledgeResourceClick}
                    />
                  </div>
                </div>
              )}
              
              {/* 地图模式下的空状态 */}
              {(!capabilityMap || !showCapabilityMapModal) && (!knowledgeGraph || !showKnowledgeGraphModal) && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                  <NodeIndexOutlined style={{ fontSize: 48, marginBottom: 16, color: '#ccc' }} />
                  <div style={{ fontSize: 16, marginBottom: 8 }}>暂无地图数据</div>
                  <div style={{ fontSize: 12 }}>请先添加能力模型或知识图谱相关资料</div>
                </div>
              )}
            </div>
          ) : (
            /* 卡片模式 - 原有的资料列表显示 */
            <div>
              {/* 课程视频列表 */}
              {courseVideos.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ fontSize: '12px', color: '#666', marginBottom: 8, display: 'block' }}>
                    📹 课程视频 ({courseVideos.length})
                  </Text>
                  {courseVideos.map(video => (
                    <Card 
                      key={`video-${video.id}`}
                      size="small" 
                      style={{ 
                        marginBottom: 8,
                        cursor: 'pointer',
                        border: '1px solid #e8e8e8'
                      }}
                      bodyStyle={{ padding: '8px 12px' }}
                      onClick={() => onPlayVideo(video)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                          <PlayCircleOutlined style={{ color: '#1890ff', marginRight: 8, fontSize: 16 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>
                              {video.title}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 10 }}>
                              {video.addTime} • {video.instructor || '未知讲师'}
                            </Text>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Checkbox
                            checked={selectedMaterials.includes(`video-${video.id}`)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectMaterial(`video-${video.id}`, e.target.checked);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* 文件列表 */}
              {uploadedFiles.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ fontSize: '12px', color: '#666', marginBottom: 8, display: 'block' }}>
                    📄 文件 ({uploadedFiles.length})
                  </Text>
                  {uploadedFiles.map(file => (
                    <Card 
                      key={`file-${file.id}`}
                      size="small" 
                      style={{ 
                        marginBottom: 8,
                        border: '1px solid #e8e8e8'
                      }}
                      bodyStyle={{ padding: '8px 12px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                          <FileTextOutlined style={{ color: '#52c41a', marginRight: 8, fontSize: 16 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>
                              {file.name}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 10 }}>
                              {file.uploadTime}
                            </Text>
                          </div>
                        </div>
                        <Checkbox
                          checked={selectedMaterials.includes(`file-${file.id}`)}
                          onChange={(e) => handleSelectMaterial(`file-${file.id}`, e.target.checked)}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* 链接列表 */}
              {links.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ fontSize: '12px', color: '#666', marginBottom: 8, display: 'block' }}>
                    🔗 链接 ({links.length})
                  </Text>
                  {links.map(link => (
                    <Card 
                      key={`link-${link.id}`}
                      size="small" 
                      style={{ 
                        marginBottom: 8,
                        border: '1px solid #e8e8e8'
                      }}
                      bodyStyle={{ padding: '8px 12px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                          <LinkOutlined style={{ color: '#1890ff', marginRight: 8, fontSize: 16 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>
                              {link.title}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 10 }}>
                              {link.addTime}
                            </Text>
                          </div>
                        </div>
                        <Checkbox
                          checked={selectedMaterials.includes(`link-${link.id}`)}
                          onChange={(e) => handleSelectMaterial(`link-${link.id}`, e.target.checked)}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* 文本内容列表 */}
              {addedTexts.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ fontSize: '12px', color: '#666', marginBottom: 8, display: 'block' }}>
                    📝 文本 ({addedTexts.length})
                  </Text>
                  {addedTexts.map(text => (
                    <Card 
                      key={`text-${text.id}`}
                      size="small" 
                      style={{ 
                        marginBottom: 8,
                        border: '1px solid #e8e8e8'
                      }}
                      bodyStyle={{ padding: '8px 12px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                          <FileTextOutlined style={{ color: '#faad14', marginRight: 8, fontSize: 16 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Text strong ellipsis style={{ fontSize: 12, display: 'block' }}>
                              {text.title}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 10 }}>
                              {text.addTime}
                            </Text>
                          </div>
                        </div>
                        <Checkbox
                          checked={selectedMaterials.includes(`text-${text.id}`)}
                          onChange={(e) => handleSelectMaterial(`text-${text.id}`, e.target.checked)}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* 空状态显示 */}
              {courseVideos.length === 0 && uploadedFiles.length === 0 && links.length === 0 && addedTexts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
                  <FileTextOutlined style={{ fontSize: 32, marginBottom: 16, color: '#ccc' }} />
                  <div style={{ fontSize: 14 }}>暂无资料</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>点击上方"添加"按钮添加资料，或点击"初始化"加载示例数据</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 资料添加弹窗 */}
      <MaterialAddPage 
        visible={showMaterialAddModal}
        onClose={() => setShowMaterialAddModal(false)}
        onCapabilityModelAdded={() => setShowCapabilityMapModal(true)}
        onKnowledgeGraphAdded={() => setShowKnowledgeGraphModal(true)}
      />
      
      {/* 探索弹窗 */}
      <ExploreModal
        visible={showExploreModal}
        onClose={() => setShowExploreModal(false)}
        onExplore={onExplore}
      />
    </div>
  );
};

export default MaterialManagement;