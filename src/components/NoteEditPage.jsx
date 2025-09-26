import React from 'react';
import React from 'react';
import {
  Layout,
  Button,
  Typography,
  message,
  Modal,
  Card,
  Checkbox,
  Row,
  Col,
  Select
} from 'antd';

// 导入重构后的组件
import MaterialManagement from './MaterialManagement';
import AIChat from './AIChat';
import OperationPanel from './OperationPanel';
import VideoView from './VideoView';

// 导入原有组件
import MaterialAddPage from './MaterialAddPage';
import ExploreModal from './ExploreModal';
import VideoPlayer from './VideoPlayer';
import CapabilityMindMap from './CapabilityMindMap.jsx';
import KnowledgeGraphMindMap from './KnowledgeGraphMindMap.jsx';

// 导入hooks和工具
import { useNoteEditState } from '../hooks/useNoteEditState';
import {
  VIEW_MODES,
  RIGHT_PANEL_VIEWS,
  MORE_MENU_ACTIONS,
  OPERATION_TYPES,
  TOOL_CATEGORIES
} from '../constants/noteEditConstants';
import {
  getLiveStreamStatus,
  createNewScenario,
  getRecommendedScenarios,
  initializeAvailableTools,
  createMarkContent,
  createNewNoteRecord,
  convertTimeToLinks
} from '../utils/noteEditUtils';
import scenarioService from '../services/scenarioService';

const { Title, Text } = Typography;
const { Option } = Select;

const NoteEditPage = ({ onBack, onViewChange, note = null, mode = 'create' }) => {
  // 使用统一的状态管理hook
  const state = useNoteEditState(note, mode);
  
  const {
    // 基本状态
    currentView,
    setCurrentView,
    selectedMaterial,
    setSelectedMaterial,
    videoStartTime,
    setVideoStartTime,
    currentSubtitle,
    setCurrentSubtitle,
    videoProgress,
    setVideoProgress,
    liveStreams,
    
    // 操作记录状态
    operationRecords,
    setOperationRecords,
    
    // 场景模拟状态
    scenarioModalVisible,
    setScenarioModalVisible,
    selectedScenarios,
    setSelectedScenarios,
    
    // 工具相关状态
    addToolModalVisible,
    setAddToolModalVisible,
    availableTools,
    setAvailableTools,
    selectedTools,
    setSelectedTools,
    toolCategories,
    setToolCategories,
    selectedToolCategory,
    setSelectedToolCategory,
    
    // 编辑器状态
    showNoteEditor,
    setShowNoteEditor,
    editingNote,
    setEditingNote,
    noteEditorContent,
    setNoteEditorContent,
    
    // 能力模型和知识图谱状态
    showCapabilityMapModal,
    setShowCapabilityMapModal,
    showKnowledgeGraphModal,
    setShowKnowledgeGraphModal,
    
    // 视频播放器状态
    showVideoPlayer,
    setShowVideoPlayer,
    currentVideo,
    setCurrentVideo
  } = state;

  // 初始化可用工具数据
  React.useEffect(() => {
    const { tools, categories } = initializeAvailableTools();
    setAvailableTools(tools);
    setToolCategories(categories);
  }, []);
  
  // 加载场景数据的状态
  const [availableScenarios, setAvailableScenarios] = React.useState([]);
  const [scenarioLoading, setScenarioLoading] = React.useState(false);
  const [scenarioCategories, setScenarioCategories] = React.useState([]);
  
  // 加载场景数据
  const loadScenarios = React.useCallback(async () => {
    setScenarioLoading(true);
    try {
      // 获取已发布的场景
      const response = await scenarioService.getAllScenarios({ 
        status: 'published' 
      });
      
      if (response.success && response.data) {
        setAvailableScenarios(response.data);
      }
    } catch (error) {
      console.error('加载场景数据失败:', error);
      message.error('加载场景数据失败');
    } finally {
      setScenarioLoading(false);
    }
  }, []);
  
  // 组件加载时获取场景数据
  React.useEffect(() => {
    loadScenarios();
  }, [loadScenarios]);

  // 调试：监控 currentView 变化
  React.useEffect(() => {
    console.log('currentView 变化为:', currentView);
  }, [currentView]);

  // 调试：监控 selectedScenarios 变化
  React.useEffect(() => {
    console.log('selectedScenarios 变化为:', selectedScenarios);
  }, [selectedScenarios]);

  // 事件处理函数集合
  const materialHandlers = {
    onPlayVideo: (material) => {
      setSelectedMaterial(material);
      setCurrentView(VIEW_MODES.VIDEO);
      setVideoStartTime(0);
      
      // 自动选中当前播放的视频记录
      const videoId = `video-${material.id}`;
      if (!state.selectedMaterials.includes(videoId)) {
        state.setSelectedMaterials(prev => [...prev, videoId]);
      }
      
      message.success(`正在播放视频：${material.title}`);
    },
    onViewMaterial: (material, type) => {
      if (type === 'video') {
        materialHandlers.onPlayVideo(material);
        return;
      }
      // 其他类型的查看逻辑
    },
    onCapabilityNodeClick: (node) => {
      console.log('点击能力节点:', node);
    },
    onCapabilityVideoClick: (video) => {
      console.log('点击能力视频:', video);
    },
    onKnowledgeNodeClick: (node) => {
      console.log('点击知识节点:', node);
    },
    onKnowledgeResourceClick: (resource) => {
      console.log('点击知识资源:', resource);
    },
    onExplore: (exploreData) => {
      console.log('探索数据:', exploreData);
      message.success('探索功能完成');
    }
  };

  const aiChatHandlers = {
    onSaveToNote: (content, userQuestion) => {
      const newRecord = {
        id: Date.now(),
        title: userQuestion || `AI问答笔记 - ${new Date().toLocaleString()}`,
        source: 'AI智能问答',
        time: '刚刚',
        type: 'note',
        content: content
      };

      setOperationRecords(prev => ({
        ...prev,
        note: [newRecord, ...prev.note]
      }));

      message.success('AI回复已保存到笔记');
    }
  };

  const operationHandlers = {
    onOperationClick: (operationType) => {
      const operationTitles = {
        [OPERATION_TYPES.AUDIO]: '音频概览',
        [OPERATION_TYPES.VIDEO]: '视频概览',
        [OPERATION_TYPES.MINDMAP]: '思维导图',
        [OPERATION_TYPES.REPORT]: '分析报告',
        [OPERATION_TYPES.PPT]: 'PPT演示',
        [OPERATION_TYPES.WEBCODE]: '网页代码',
        [OPERATION_TYPES.SCENARIO]: '场景模拟',
        [OPERATION_TYPES.NOTE]: '笔记'
      };

      const totalMaterials = state.uploadedFiles.length + state.addedTexts.length + state.courseVideos.length + state.links.length;
      const newRecord = {
        id: Date.now(),
        title: `基于${totalMaterials}个资料生成${operationTitles[operationType]}`,
        source: `${totalMaterials}个来源`,
        time: '刚刚',
        type: operationType
      };

      setOperationRecords(prev => ({
        ...prev,
        [operationType]: [newRecord, ...prev[operationType]]
      }));

      message.success(`${operationTitles[operationType]}已生成并添加到操作记录`);
    },
    
    onAddTool: () => {
      setAddToolModalVisible(true);
    },
    
    onScenarioClick: () => {
      setScenarioModalVisible(true);
    },
    
    onRecordClick: (record) => {
      if (record.type === 'note') {
        state.setRightPanelEditingNote(record);
        const initialContent = record.content || '<p>请在此处编写您的笔记内容...</p>';
        const contentWithLinks = convertTimeToLinks(initialContent);
        state.setRightPanelNoteContent(contentWithLinks);
        state.setRightPanelView(RIGHT_PANEL_VIEWS.NOTE_EDITOR);
        return;
      }
      
      if (record.type === 'scenario') {
        // 处理场景模拟记录点击 - 在三栏区域内显示场景主页
        console.log('选择场景模拟:', record);
        console.log('当前 currentView:', currentView);
        console.log('当前 VIEW_MODES:', VIEW_MODES);
        
        // 先强制重置为 materials 视图，然后再切换到场景视图
        setCurrentView(VIEW_MODES.MATERIALS);
        
        // 使用 setTimeout 确保状态更新
        setTimeout(() => {
          // 设置选中的场景并在三栏布局中显示
          setSelectedScenarios([record]);
          console.log('设置 selectedScenarios:', [record]);
          console.log('场景路径 thumbnail:', record.thumbnail);
          
          // 切换到场景显示视图
          setCurrentView(VIEW_MODES.SCENARIO_VIEW);
          console.log('切换到 VIEW_MODES.SCENARIO_VIEW:', VIEW_MODES.SCENARIO_VIEW);
          
          message.success(`正在加载场景：${record.title}`);
        }, 100);
        
        return;
      }
      
      // 其他记录类型的处理逻辑
      console.log('点击了其他类型记录:', record);
    },
    
    onMoreAction: (action, record) => {
      switch (action) {
        case MORE_MENU_ACTIONS.MARK_STUDY_RESULT:
          setOperationRecords(prev => ({
            ...prev,
            note: prev.note.map(note => 
              note.id === record.id 
                ? { 
                    ...note, 
                    isStudyResult: true,
                    studyResultInfo: {
                      markTime: new Date().toISOString(),
                      resultType: '学习成果',
                      importance: 'high'
                    },
                    tags: [...(note.tags || []), '研修成果']
                  }
                : note
            )
          }));
          message.success(`笔记"${record.title}"已标记为研修成果！`);
          break;
        case MORE_MENU_ACTIONS.DELETE:
          setOperationRecords(prev => {
            const newRecords = { ...prev };
            Object.keys(newRecords).forEach(type => {
              newRecords[type] = newRecords[type].filter(r => r.id !== record.id);
            });
            return newRecords;
          });
          message.success(`已删除"${record.title}"`);
          break;
        default:
          break;
      }
    }
  };

  const videoHandlers = {
    onBackToMaterials: () => {
      setCurrentView(VIEW_MODES.MATERIALS);
      setCurrentSubtitle('');
      setVideoProgress(0);
    },
    
    onVideoTimeUpdate: (currentTime, duration) => {
      setVideoProgress(duration > 0 ? (currentTime / duration) * 100 : 0);
      
      const subtitle = state.subtitleData.find(sub => 
        currentTime >= sub.start && currentTime <= sub.end
      );
      
      if (subtitle) {
        setCurrentSubtitle(subtitle.text);
      } else {
        setCurrentSubtitle('');
      }
    },
    
    onNoteCreated: (operationRecord) => {
      setOperationRecords(prev => ({
        ...prev,
        note: [operationRecord, ...prev.note]
      }));
    },
    
    onToggleWidescreen: () => {
      // 切换宽屏模式
      const newMode = !state.isWidescreenMode;
      state.setIsWidescreenMode(newMode);
      
      if (newMode) {
        // 进入宽屏模式
        setCurrentView(VIEW_MODES.WIDESCREEN_VIDEO);
        message.success('已开启宽屏模式');
      } else {
        // 退出宽屏模式
        setCurrentView(VIEW_MODES.VIDEO);
        message.success('已退出宽屏模式');
      }
    }
  };

  return (
    <>
      {/* 直播中提示条 */}
      {liveStreams.some(stream => getLiveStreamStatus(stream) === 'live') && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
          color: 'white',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          animation: 'pulse 2s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              background: 'white',
              animation: 'blink 1.5s infinite'
            }} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              🎥 现在有直播课正在进行中！
            </span>
            <Button 
              type="default"
              size="small"
              onClick={() => {
                const liveStream = liveStreams.find(stream => getLiveStreamStatus(stream) === 'live');
                if (liveStream?.url) {
                  window.open(liveStream.url, '_blank');
                }
              }}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                fontSize: 12,
                height: 28
              }}
            >
              点击进入直播间
            </Button>
          </div>
        </div>
      )}
      
      <style>
        {`
          .subtitle-menu-item:hover {
            background: #f8f9fa !important;
          }
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.8; }
            100% { opacity: 1; }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `}
      </style>
      
      <div style={{ 
        display: 'flex', 
        height: liveStreams.some(stream => getLiveStreamStatus(stream) === 'live') 
          ? 'calc(100vh - 64px - 52px)' 
          : 'calc(100vh - 64px)', 
        background: '#f5f5f5',
        marginTop: liveStreams.some(stream => getLiveStreamStatus(stream) === 'live') ? '52px' : '0px',
        transition: 'margin-top 0.3s ease, height 0.3s ease',
        overflow: 'hidden'
      }}>
        {/* 宽屏模式：视频播放器占满整个宽度 */}
        {currentView === VIEW_MODES.WIDESCREEN_VIDEO ? (
          <div style={{ 
            flex: 1, 
            background: '#fff', 
            margin: '16px', 
            borderRadius: '8px', 
            overflow: 'hidden', 
            display: 'flex', 
            flexDirection: 'column'
          }}>
            <VideoView 
              state={state}
              handlers={videoHandlers}
            />
          </div>
        ) : currentView === VIEW_MODES.SCENARIO_VIEW ? (
          /* 场景视图模式：占据全部三栏区域 */
          <div style={{ 
            flex: 1, 
            background: '#fff', 
            margin: '16px', 
            borderRadius: '8px', 
            overflow: 'hidden', 
            display: 'flex', 
            flexDirection: 'column'
          }}>
            {/* 场景主页内容 */}
            {console.log('渲染全屏场景视图 - currentView:', currentView, 'selectedScenarios:', selectedScenarios)}
            {selectedScenarios.length > 0 ? (
              <>
                <div style={{ 
                  padding: '12px 16px', 
                  background: '#f0f9ff', 
                  borderBottom: '1px solid #e8e8e8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>场</span>
                    <Text strong style={{ color: '#1890ff' }}>
                      场景模拟：{selectedScenarios[0].title}
                    </Text>
                  </div>
                  <Button 
                    type="text" 
                    size="small"
                    icon={<span style={{ fontSize: '14px' }}>✕</span>}
                    onClick={() => {
                      console.log('退出场景视图');
                      setCurrentView(VIEW_MODES.MATERIALS);
                      setSelectedScenarios([]);
                      message.info('已退出场景模拟');
                    }}
                    style={{
                      color: '#666',
                      padding: '4px 8px',
                      height: 'auto'
                    }}
                  >
                    退出
                  </Button>
                </div>
                <div style={{ 
                  flex: 1, 
                  position: 'relative',
                  background: '#f5f5f5'
                }}>
                  <iframe 
                    src={selectedScenarios[0].thumbnail}
                    title={selectedScenarios[0].title}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      border: 'none',
                      position: 'absolute',
                      top: 0,
                      left: 0
                    }}
                    onLoad={() => console.log('iframe已加载:', selectedScenarios[0].thumbnail)}
                    onError={() => console.error('iframe加载失败:', selectedScenarios[0].thumbnail)}
                  />
                </div>
              </>
            ) : (
              <div style={{ 
                padding: '40px', 
                textAlign: 'center', 
                color: '#999',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '400px'
              }}>
                <span style={{ fontSize: '48px', marginBottom: '16px' }}>场</span>
                <Text style={{ fontSize: '16px' }}>未选择场景</Text>
              </div>
            )}
          </div>
        ) : (
          /* 普通三栏布局模式 */
          <>
            {/* 左侧区域：根据当前视图显示资料收集或视频播放 */}
            {currentView === VIEW_MODES.MATERIALS ? (
              <MaterialManagement 
                state={state}
                handlers={materialHandlers}
                onBack={onBack}
                mode={mode}
              />
            ) : (
              <div style={{ 
                flex: 4, 
                background: '#fff', 
                margin: '16px 0 16px 16px', 
                borderRadius: '8px', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'flex 0.3s ease'
              }}>
                <VideoView 
                  state={state}
                  handlers={videoHandlers}
                />
              </div>
            )}

            {/* 中间问答区域 */}
            <AIChat 
              state={state}
              handlers={aiChatHandlers}
            />

            {/* 右侧操作区域 */}
            <div style={{ 
              flex: currentView === VIEW_MODES.VIDEO ? 3 : (state.viewMode === VIEW_MODES.MAP ? 3 : 2.5), 
              background: '#fff', 
              margin: '16px 16px 16px 0', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'flex 0.3s ease'
            }}>
              <OperationPanel 
                state={state}
                handlers={operationHandlers}
              />
            </div>
          </>
        )}
      </div>
      
      {/* 添加工具弹窗 */}
      <Modal
        title="添加工具"
        open={addToolModalVisible}
        onCancel={() => setAddToolModalVisible(false)}
        footer={null}
        width={600}
        centered
      >
        <div style={{ padding: '20px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {[
              { key: 'audio', icon: '🎵', title: '音频概览' },
              { key: 'video', icon: '📹', title: '视频概览' },
              { key: 'mindmap', icon: '🧠', title: '思维导图' },
              { key: 'report', icon: '📊', title: '报告' },
              { key: 'ppt', icon: '📽️', title: 'PPT概览' },
              { key: 'webcode', icon: '💻', title: '网页代码' }
            ].map(tool => (
              <Card
                key={tool.key}
                size="small"
                hoverable
                onClick={() => {
                  console.log('添加工具:', tool.title);
                  message.success(`已添加${tool.title}工具`);
                  setAddToolModalVisible(false);
                }}
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  borderRadius: '8px',
                  border: '1px solid #e8e8e8',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '20px 16px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{tool.icon}</div>
                  <Text style={{ fontSize: '14px', fontWeight: 500 }}>{tool.title}</Text>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Modal>
      
      {/* 场景模拟选择弹窗 */}
      <Modal
        title="选择场景模拟"
        open={scenarioModalVisible}
        onCancel={() => setScenarioModalVisible(false)}
        footer={null}
        width={1000}
        centered
      >
        <div style={{ padding: '20px 0' }}>
          {/* 顶部操作栏 */}
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            {/* 筛选器 */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Text strong>筛选条件：</Text>
              <Select
                defaultValue="all"
                style={{ width: 120 }}
                placeholder="所有难度"
              >
                <Select.Option value="all">所有难度</Select.Option>
                <Select.Option value="easy">初级</Select.Option>
                <Select.Option value="medium">中级</Select.Option>
                <Select.Option value="hard">高级</Select.Option>
              </Select>
              <Select
                defaultValue="all"
                style={{ width: 140 }}
                placeholder="所有分类"
              >
                <Select.Option value="all">所有分类</Select.Option>
                <Select.Option value="psychology">学生心理</Select.Option>
                <Select.Option value="family">家庭教育</Select.Option>
                <Select.Option value="teacher">教师培训</Select.Option>
                <Select.Option value="management">班级管理</Select.Option>
                <Select.Option value="leadership">学校管理</Select.Option>
                <Select.Option value="special">特殊教育</Select.Option>
                <Select.Option value="science_demo">教学科学演示</Select.Option>
              </Select>
              <Button 
                type="link" 
                onClick={loadScenarios}
                loading={scenarioLoading}
                style={{ padding: 0 }}
              >
                🔄 刷新
              </Button>
            </div>
            
            {/* AI创建场景按钮 */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button 
                type="primary"
                icon={<span style={{ fontSize: '16px', marginRight: '4px' }}>🤖</span>}
                onClick={() => {
                  // 处理AI创建场景逻辑
                  Modal.confirm({
                    title: 'AI智能创建场景',
                    width: 600,
                    content: (
                      <div style={{ padding: '16px 0' }}>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖✨</div>
                          <Text style={{ fontSize: '16px', color: '#1890ff', fontWeight: 'bold' }}>AI场景创建助手</Text>
                        </div>
                        
                        <div style={{ marginBottom: '20px' }}>
                          <Text style={{ fontSize: '14px', lineHeight: '1.6', color: '#666' }}>
                            AI将基于您当前的学习资料和需求，智能生成个性化的场景模拟。
                          </Text>
                        </div>
                        
                        <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                          <Text style={{ fontSize: '13px', color: '#666' }}>
                            <strong>🎯 AI将分析以下内容：</strong>
                          </Text>
                          <ul style={{ margin: '8px 0 0 0', padding: '0 0 0 20px', color: '#666', fontSize: '13px' }}>
                            <li>您已上传的{state.uploadedFiles?.length || 0}个文件资料</li>
                            <li>您添加的{state.addedTexts?.length || 0}个文本内容</li>
                            <li>您收集的{state.courseVideos?.length || 0}个视频资源</li>
                            <li>您保存的{state.links?.length || 0}个网页链接</li>
                          </ul>
                        </div>
                        
                        <div style={{ background: '#e6f7ff', padding: '16px', borderRadius: '8px', border: '1px solid #91d5ff' }}>
                          <Text style={{ fontSize: '13px', color: '#0050b3' }}>
                            <strong>🚀 生成内容包括：</strong>
                          </Text>
                          <ul style={{ margin: '8px 0 0 0', padding: '0 0 0 20px', color: '#0050b3', fontSize: '13px' }}>
                            <li>个性化场景标题和描述</li>
                            <li>适合的难度等级和时长设定</li>
                            <li>针对性的学习目标和技能标签</li>
                            <li>基于资料的交互式场景内容</li>
                          </ul>
                        </div>
                      </div>
                    ),
                    okText: '🎨 开始AI创建',
                    cancelText: '取消',
                    icon: null,
                    onOk: () => {
                      // 关闭场景选择弹窗
                      setScenarioModalVisible(false);
                      
                      // 在操作记录中创建AI创建场景的记录
                      const totalMaterials = (state.uploadedFiles?.length || 0) + 
                                             (state.addedTexts?.length || 0) + 
                                             (state.courseVideos?.length || 0) + 
                                             (state.links?.length || 0);
                      
                      const aiCreationRecord = {
                        id: Date.now(),
                        title: `AI智能创建场景：基于${totalMaterials}个资料生成`,
                        source: 'AI智能助手',
                        time: '刚刚',
                        type: 'scenario',
                        status: 'creating', // 创建中状态
                        progress: 0, // 初始进度
                        description: 'AI正在分析您的学习资料并智能生成个性化场景模拟...',
                        isAIGenerated: true,
                        materialCount: totalMaterials
                      };
                      
                      // 添加到操作记录
                      setOperationRecords(prev => ({
                        ...prev,
                        scenario: [aiCreationRecord, ...prev.scenario]
                      }));
                      
                      message.success('AI创建任务已启动，请在操作记录中查看进度');
                      
                      // 模拟AI创建进度
                      let currentProgress = 0;
                      const progressInterval = setInterval(() => {
                        currentProgress += Math.random() * 15 + 5; // 每次增加5-20%
                        
                        if (currentProgress >= 100) {
                          currentProgress = 100;
                          clearInterval(progressInterval);
                          
                          // 创建完成，更新记录状态
                          setTimeout(() => {
                            const completedScenario = {
                              id: `ai-${Date.now()}`,
                              title: `【AI生成】智能场景：基于${totalMaterials}个资料的个性化训练`,
                              description: `AI基于您的学习资料智能生成的个性化场景模拟，包含针对性的训练内容和交互式学习体验。`,
                              category: 'ai_generated',
                              difficulty: 'medium',
                              duration: '30-45分钟',
                              author: 'AI助手',
                              tags: ['AI生成', '个性化', '智能场景', '数据驱动'],
                              views: 0,
                              rating: 5.0,
                              thumbnail: '/gen-html/ai-mental-health-scenario.html',
                              learningObjectives: '通过AI分析的个性化学习目标，提升实际应用能力',
                              isAIGenerated: true,
                              createTime: new Date().toISOString(),
                              status: 'completed',
                              progress: 100,
                              source: 'AI智能助手',
                              time: '刚刚',
                              type: 'scenario',
                              materialCount: totalMaterials
                            };
                            
                            // 更新操作记录，将创建中的记录替换为完成的记录
                            setOperationRecords(prev => ({
                              ...prev,
                              scenario: prev.scenario.map(record => 
                                record.id === aiCreationRecord.id ? completedScenario : record
                              )
                            }));
                            
                            // 同时添加到可用场景列表
                            setAvailableScenarios(prev => [completedScenario, ...prev]);
                            
                            message.success('🎉 AI场景创建完成！您可以在操作记录中查看和运行新场景');
                          }, 500);
                        } else {
                          // 更新进度
                          setOperationRecords(prev => ({
                            ...prev,
                            scenario: prev.scenario.map(record => 
                              record.id === aiCreationRecord.id 
                                ? { ...record, progress: Math.round(currentProgress) }
                                : record
                            )
                          }));
                        }
                      }, 300); // 每300ms更新一次进度
                    }
                  });
                }}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  height: '36px',
                  fontWeight: 'bold'
                }}
              >
                AI创建场景
              </Button>
              
              <Button 
                icon={<span style={{ fontSize: '16px', marginRight: '4px' }}>➕</span>}
                onClick={() => {
                  message.info('手动创建场景功能开发中...');
                }}
                style={{
                  borderColor: '#d9d9d9',
                  color: '#666',
                  borderRadius: '6px',
                  height: '36px'
                }}
              >
                手动创建
              </Button>
            </div>
          </div>
          
          {/* 场景列表 */}
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {scenarioLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔄</div>
                <Text>正在加载圼景数据...</Text>
              </div>
            ) : availableScenarios.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                {availableScenarios.map(scenario => {
                  // 难度级别映射
                  const difficultyMap = {
                    'easy': '初级',
                    'medium': '中级', 
                    'hard': '高级'
                  };
                  const difficultyText = difficultyMap[scenario.difficulty] || scenario.difficulty;
                  
                  // 分类映射
                  const categoryMap = {
                    'psychology': '学生心理',
                    'family': '家庭教育',
                    'teacher': '教师培训',
                    'management': '班级管理',
                    'leadership': '学校管理',
                    'special': '特殊教育',
                    'science_demo': '教学科学演示'
                  };
                  const categoryText = categoryMap[scenario.category] || scenario.category;
                  
                  return (
                    <Card
                      key={scenario.id}
                      hoverable
                      onClick={() => {
                        // 创建场景选择的操作记录
                        const scenarioRecord = {
                          id: `scenario-${Date.now()}`,
                          title: scenario.title,
                          description: scenario.description,
                          category: scenario.category,
                          difficulty: scenario.difficulty,
                          duration: scenario.duration,
                          author: scenario.author,
                          tags: scenario.tags || [],
                          views: scenario.views || 0,
                          rating: scenario.rating || 0,
                          thumbnail: scenario.thumbnail,
                          learningObjectives: scenario.learningObjectives,
                          source: '场景库选择',
                          time: '刚刚',
                          type: 'scenario',
                          status: 'selected',
                          createTime: new Date().toISOString()
                        };
                        
                        // 添加到操作记录
                        setOperationRecords(prev => ({
                          ...prev,
                          scenario: [scenarioRecord, ...prev.scenario]
                        }));
                        
                        setSelectedScenarios([scenarioRecord]);
                        message.success(`已选择场景：${scenario.title}`);
                        setScenarioModalVisible(false);
                        
                        // 显示场景详情
                        Modal.info({
                          title: `场景模拟：${scenario.title}`,
                          width: 700,
                          content: (
                            <div style={{ padding: '16px 0' }}>
                              <div style={{ marginBottom: '16px' }}>
                                <div style={{ 
                                  width: '100%', 
                                  height: '200px', 
                                  marginBottom: '16px',
                                  border: '1px solid #d9d9d9',
                                  borderRadius: '6px',
                                  overflow: 'hidden'
                                }}>
                                  <iframe 
                                    src={scenario.thumbnail}
                                    title={scenario.title}
                                    style={{ 
                                      width: '100%', 
                                      height: '100%', 
                                      border: 'none'
                                    }}
                                  />
                                </div>
                                <p style={{ marginBottom: '12px', color: '#666', lineHeight: '1.6' }}>
                                  <strong>描述：</strong>{scenario.description}
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                                  <p style={{ margin: 0 }}>
                                    <strong>难度等级：</strong>
                                    <span style={{ 
                                      color: scenario.difficulty === 'easy' ? '#52c41a' : 
                                             scenario.difficulty === 'medium' ? '#fa8c16' : '#f5222d'
                                    }}>
                                      {difficultyText}
                                    </span>
                                  </p>
                                  <p style={{ margin: 0 }}>
                                    <strong>预计时长：</strong>{scenario.duration}
                                  </p>
                                  <p style={{ margin: 0 }}>
                                    <strong>作者：</strong>{scenario.author}
                                  </p>
                                  <p style={{ margin: 0 }}>
                                    <strong>分类：</strong>{categoryText}
                                  </p>
                                  <p style={{ margin: 0 }}>
                                    <strong>浏览次数：</strong>{scenario.views || 0}
                                  </p>
                                  <p style={{ margin: 0 }}>
                                    <strong>评分：</strong>⭐ {scenario.rating || 0}
                                  </p>
                                </div>
                                {scenario.learningObjectives && (
                                  <p style={{ marginBottom: '12px' }}>
                                    <strong>学习目标：</strong>{scenario.learningObjectives}
                                  </p>
                                )}
                                {scenario.tags && scenario.tags.length > 0 && (
                                  <div>
                                    <strong>标签：</strong>
                                    <div style={{ marginTop: '4px' }}>
                                      {scenario.tags.map(tag => (
                                        <span key={tag} style={{
                                          display: 'inline-block',
                                          background: '#f0f0f0',
                                          padding: '2px 8px',
                                          borderRadius: '12px',
                                          fontSize: '12px',
                                          margin: '2px 4px 2px 0'
                                        }}>
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ),
                          okText: '运行场景',
                          onOk: () => {
                            // 在新窗口中打开场景
                            if (scenario.thumbnail) {
                              window.open(scenario.thumbnail, '_blank');
                              message.success('场景已在新窗口中打开');
                            } else {
                              message.error('场景文件不存在');
                            }
                          }
                        });
                      }}
                      style={{
                        cursor: 'pointer',
                        border: '1px solid #e8e8e8',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '16px' }}>
                        {/* 左侧缩略图 */}
                        <div style={{ 
                          width: '120px',
                          height: '80px',
                          border: '1px solid #d9d9d9',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}>
                          <iframe 
                            src={scenario.thumbnail}
                            title={scenario.title}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              border: 'none',
                              pointerEvents: 'none',
                              transform: 'scale(0.8)',
                              transformOrigin: 'top left'
                            }}
                          />
                        </div>
                        
                        {/* 中间内容 */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <Title level={5} style={{ margin: 0, color: '#1890ff' }}>
                              {scenario.title}
                            </Title>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                background: scenario.difficulty === 'easy' ? '#f6ffed' : 
                                           scenario.difficulty === 'medium' ? '#fff7e6' : '#fff2f0',
                                color: scenario.difficulty === 'easy' ? '#52c41a' : 
                                       scenario.difficulty === 'medium' ? '#fa8c16' : '#f5222d',
                                border: `1px solid ${scenario.difficulty === 'easy' ? '#b7eb8f' : 
                                                      scenario.difficulty === 'medium' ? '#ffd591' : '#ffccc7'}`
                              }}>
                                {difficultyText}
                              </span>
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                background: '#f0f0f0',
                                color: '#666'
                              }}>
                                {scenario.duration}
                              </span>
                            </div>
                          </div>
                          
                          <Text style={{ color: '#666', fontSize: '13px', lineHeight: '1.4', display: 'block', marginBottom: '8px' }}>
                            {scenario.description}
                          </Text>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <span style={{
                                padding: '1px 6px',
                                borderRadius: '8px',
                                fontSize: '11px',
                                background: 'rgba(24, 144, 255, 0.1)',
                                color: '#1890ff'
                              }}>
                                {categoryText}
                              </span>
                              <Text style={{ fontSize: '12px', color: '#999' }}>
                                👤 {scenario.author}
                              </Text>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <Text style={{ fontSize: '12px', color: '#999' }}>
                                👁 {scenario.views || 0}
                              </Text>
                              <Text style={{ fontSize: '12px', color: '#999' }}>
                                ⭐ {scenario.rating || 0}
                              </Text>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>场</div>
                <Text style={{ fontSize: '16px' }}>暂无可用的场景模拟</Text>
                <br />
                <Text style={{ fontSize: '14px', color: '#ccc' }}>请先在“场景模拟”模块中创建一些场景</Text>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NoteEditPage;