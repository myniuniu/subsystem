import React from 'react';
import {
  Layout,
  Button,
  Typography,
  message,
  Modal,
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

  // 事件处理函数集合
  const materialHandlers = {
    onPlayVideo: (material) => {
      setSelectedMaterial(material);
      setCurrentView(VIEW_MODES.VIDEO);
      setVideoStartTime(0);
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
      // 其他记录类型的处理逻辑
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
      </div>
    </>
  );
};

export default NoteEditPage;