import React, { useState, useEffect } from 'react';
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
  Select,
  List,
  Input,
  Badge
} from 'antd';
import { ArrowLeftOutlined, MessageOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

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

// 导入场景仿真组件
import ScenarioSimulation from './ScenarioSimulation';
import ScenarioView from './ScenarioView';
import LearningPlanCalendarFullscreen from './LearningPlanCalendarFullscreen';
import LearningPlanCalendar from './LearningPlanCalendar';
import CalendarCenter from './CalendarCenter';
import ClassroomEvaluationFullscreen from './ClassroomEvaluationFullscreen';
import ThemeSelectModal from './ThemeSelectModal';
import TrainingPlanViewer from './OperationPanel/TrainingPlanViewer';

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

const NoteEditPage = ({ onBack, onViewChange, note = null, mode = 'create', selectedTemplate = null, selectedCategory = null }) => {
  // 使用统一的状态管理hook
  const state = useNoteEditState(note, mode, selectedTemplate, selectedCategory);
  
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
    showContentModal,
    setShowContentModal,
    modalContent,
    setModalContent,
    
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
    setCurrentVideo,
    
    // 主题选择模态框状态
    showThemeSelectModal,
    setShowThemeSelectModal,
    currentRecord,
    setCurrentRecord,
    currentActionType,
    setCurrentActionType
  } = state;

  // 消息中心相关状态
  const [showMessageCenter, setShowMessageCenter] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(3); // 模拟未读消息数量
  const [discussionMessages, setDiscussionMessages] = useState([
    {
      id: 1,
      senderId: 'user1',
      senderName: '张老师',
      content: '这个主题的内容很有深度，值得深入讨论',
      time: '2024-01-15 14:30',
      type: 'text'
    },
    {
      id: 2,
      senderId: 'user2',
      senderName: '李主任',
      content: '同意张老师的观点，建议增加实践案例',
      time: '2024-01-15 15:15',
      type: 'text'
    },
    {
      id: 3,
      senderId: 'user3',
      senderName: '王同事',
      content: '我这里有一些相关资料，可以分享给大家',
      time: '2024-01-15 16:20',
      type: 'text'
    }
  ]);

  // 初始化可用工具数据
  useEffect(() => {
    const { tools, categories } = initializeAvailableTools();
    setAvailableTools(tools);
    setToolCategories(categories);
  }, []);

  // 调试：监控 currentView 变化
  useEffect(() => {
    console.log('currentView 变化为:', currentView);
  }, [currentView]);

  // 调试：监控 selectedScenarios 变化
  useEffect(() => {
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

  // 数据源检查函数 - 检查是否有勾选的来源数据
  const checkSourceData = () => {
    // 检查用户是否勾选了任何资料
    return state.selectedMaterials && state.selectedMaterials.length > 0;
  };

  // 获取数据源信息
  const getSourceDataInfo = () => {
    const selectedCount = state.selectedMaterials?.length || 0;
    const totalAvailable = (
      (state.uploadedFiles?.length || 0) +
      (state.addedTexts?.length || 0) +
      (state.courseVideos?.length || 0) +
      (state.links?.length || 0)
    );

    if (selectedCount === 0) {
      if (totalAvailable === 0) {
        return {
          total: 0,
          details: '尚未添加任何数据源'
        };
      } else {
        return {
          total: 0,
          details: `有${totalAvailable}个可用资料，但尚未勾选`
        };
      }
    }

    return {
      total: selectedCount,
      details: `已勾选${selectedCount}个资料`
    };
  };

  const operationHandlers = {
    onOperationClick: (operationType) => {
      // 检查来源数据
      if (!checkSourceData()) {
        const sourceInfo = getSourceDataInfo();
        Modal.warning({
          title: '需要添加数据源',
          content: (
            <div>
              <p style={{ marginBottom: '12px' }}>
                操作面板上的所有工具都需要基于来源数据作为依据。
              </p>
              <p style={{ marginBottom: '12px', color: '#666' }}>
                当前数据源状态：<span style={{ color: '#999' }}>{sourceInfo.details}</span>
              </p>
              <p style={{ color: '#1890ff', fontSize: '14px' }}>
                请先添加文件、文本、视频或链接资源，然后再使用工具。
              </p>
            </div>
          ),
          okText: '我知道了',
          width: 400
        });
        return;
      }

      const operationTitles = {
        [OPERATION_TYPES.KNOWLEDGE_GRAPH]: '知识图谱',
        [OPERATION_TYPES.AUDIO]: '音频概览',
        [OPERATION_TYPES.VIDEO]: '视频概览',
        [OPERATION_TYPES.MINDMAP]: '思维导图',
        [OPERATION_TYPES.REPORT]: '分析报告',
        [OPERATION_TYPES.PPT]: 'PPT演示',
        [OPERATION_TYPES.WEBCODE]: '网页代码',
        [OPERATION_TYPES.SCENARIO]: '场景模拟',
        [OPERATION_TYPES.NOTE]: '笔记',
        'training-plan': '培训方案',
        'schedule': '课表',
        'participants': '参训人员清单',
        'question': '试题',
        'exam-paper': '试卷'
      };

      const totalMaterials = state.selectedMaterials?.length || 0;
      const newRecord = {
        id: Date.now(),
        title: `基于${totalMaterials}个资料生成${operationTitles[operationType]}`,
        source: `${totalMaterials}个来源`,
        time: '刚刚',
        type: operationType
      };

      // 对于培训方案，使用专门的生成逻辑
      if (operationType === 'training-plan') {
        // 导入培训方案生成器
        import('../utils/trainingPlanGenerator').then(({ generateComprehensiveTrainingPlan }) => {
          try {
            // 构建培训数据
            const trainingData = {
              title: `基于${totalMaterials}个资料的培训方案`,
              category: 'teaching_methods', // 默认类别
              targetAudience: '全体教师',
              duration: '6周',
              description: `基于${totalMaterials}个资料生成的综合培训方案`
            };

            // 生成完整的培训方案
            const comprehensivePlan = generateComprehensiveTrainingPlan(trainingData);
            
            // 创建包含完整内容的记录
            const trainingPlanRecord = {
              ...newRecord,
              content: comprehensivePlan,
              id: `training_plan_${Date.now()}`,
              timestamp: new Date().toISOString()
            };

            setOperationRecords(prev => ({
              ...prev,
              [operationType]: [trainingPlanRecord, ...(prev[operationType] || [])]
            }));
            
            message.success(`${operationTitles[operationType]}已生成并添加到操作记录`);
          } catch (error) {
            console.error('生成培训方案失败:', error);
            message.error('生成培训方案失败，请重试');
          }
        });
      } else if (['schedule', 'participants', 'question', 'exam-paper'].includes(operationType)) {
        // 对于其他工具，保持原有逻辑
        setOperationRecords(prev => ({
          ...prev,
          [operationType]: [newRecord, ...(prev[operationType] || [])]
        }));
        message.success(`${operationTitles[operationType]}已生成并添加到操作记录`);
      } else {
        // 其他工具保持原有的进度效果
        message.loading(`正在生成${operationTitles[operationType]}...`, 3);
        setTimeout(() => {
          setOperationRecords(prev => ({
            ...prev,
            [operationType]: [newRecord, ...(prev[operationType] || [])]
          }));
          message.success(`${operationTitles[operationType]}已生成并添加到操作记录`);
        }, 3000);
      }
    },
    
    onAddTool: () => {
      setAddToolModalVisible(true);
    },
    
    onScenarioClick: () => {
      setScenarioModalVisible(true);
    },
    
    // 添加视图切换处理函数
    onViewChange: (viewMode) => {
      setCurrentView(viewMode);
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
      if (record.type === 'question') {
        console.log('试题记录点击，record.content存在:', !!record.content);
        console.log('record.content类型:', typeof record.content);
        console.log('record.content长度:', record.content ? record.content.length : 0);
        
        // 设置试题查看状态并在右侧面板显示
        state.setRightPanelQuestionRecord(record);
        
        if (record.content) {
          state.setRightPanelQuestionContent(record.content);
        } else {
          // 如果没有content，生成默认内容
          const defaultContent = `
            <div style="padding: 20px; text-align: center;">
              <h3>📝 ${record.title}</h3>
              <p style="color: #666;">暂无具体试题内容</p>
              <p style="color: #999; font-size: 14px;">${record.source} • ${record.time}</p>
            </div>
          `;
          state.setRightPanelQuestionContent(defaultContent);
        }
        
        // 切换到试题查看视图
        state.setRightPanelView(RIGHT_PANEL_VIEWS.QUESTION_VIEWER);
        console.log('在右侧面板显示试题内容:', record.title);
        return;
      }
      
      if (record.type === 'learning-plan') {
        console.log('学习计划记录点击，record.content存在:', !!record.content);
        console.log('record.metadata存在:', !!record.metadata);
        
        // 设置学习计划查看状态并在右侧面板显示
        state.setRightPanelLearningPlanRecord(record);
        
        if (record.content) {
          state.setRightPanelLearningPlanContent(record.content);
        } else {
          // 如果没有content，生成默认内容
          const defaultContent = `
            <div style="padding: 20px; text-align: center;">
              <h3>🎯 ${record.title}</h3>
              <p style="color: #666;">智能学习计划已生成</p>
              <p style="color: #999; font-size: 14px;">${record.source} • ${record.time}</p>
            </div>
          `;
          state.setRightPanelLearningPlanContent(defaultContent);
        }
        
        // 切换到学习计划查看视图
        state.setRightPanelView(RIGHT_PANEL_VIEWS.LEARNING_PLAN_VIEWER);
        console.log('在右侧面板显示学习计划内容:', record.title);
        return;
      }
      
      if (record.type === 'training-plan') {
        console.log('培训方案记录点击，切换到全屏模式');
        
        // 设置培训方案查看状态
        state.setRightPanelTrainingPlanRecord(record);
        
        // 使用记录中的content，如果没有则生成默认内容
        if (record.content) {
          state.setRightPanelTrainingPlanContent(record.content);
        } else {
          // 如果没有content，生成默认的培训方案内容
          const defaultContent = {
            title: record.title,
            overview: '本培训方案旨在提升参训人员的专业技能和综合素质。',
            schedule: [
              {
                id: 1,
                title: '基础理论学习',
                duration: '2小时',
                type: 'video',
                description: '学习相关理论知识和基础概念',
                videos: [
                  { id: 'v1', title: '理论基础第一讲', duration: '30分钟' },
                  { id: 'v2', title: '理论基础第二讲', duration: '30分钟' },
                  { id: 'v3', title: '案例分析', duration: '60分钟' }
                ]
              },
              {
                id: 2,
                title: '实践操作训练',
                duration: '3小时',
                type: 'practice',
                description: '通过实际操作加深理解',
                videos: [
                  { id: 'v4', title: '操作演示', duration: '90分钟' },
                  { id: 'v5', title: '实践指导', duration: '90分钟' }
                ]
              },
              {
                id: 3,
                title: '综合评估',
                duration: '1小时',
                type: 'assessment',
                description: '对学习成果进行综合评估',
                videos: [
                  { id: 'v6', title: '评估说明', duration: '60分钟' }
                ]
              }
            ],
            participants: [
              { id: 1, name: '张三', department: '技术部', position: '工程师', status: '已报名' },
              { id: 2, name: '李四', department: '产品部', position: '产品经理', status: '已报名' },
              { id: 3, name: '王五', department: '设计部', position: 'UI设计师', status: '待确认' },
              { id: 4, name: '赵六', department: '运营部', position: '运营专员', status: '已报名' }
            ],
            totalDuration: '6小时',
            startDate: '2024-01-15',
            endDate: '2024-01-17',
            location: '培训中心A座201室'
          };
          state.setRightPanelTrainingPlanContent(defaultContent);
        }
        
        // 切换到培训方案全屏模式
        setCurrentView(VIEW_MODES.TRAINING_PLAN_FULLSCREEN);
        console.log('切换到培训方案全屏模式:', record.title);
        return;
      }
      
      if (record.type === 'grading') {
        console.log('阅卷报告记录点击，record.content存在:', !!record.content);
        console.log('record.gradingData存在:', !!record.gradingData);
        
        // 设置阅卷报告查看状态并在右侧面板显示
        state.setRightPanelGradingRecord(record);
        
        if (record.content) {
          state.setRightPanelGradingContent(record.content);
        } else {
          // 如果没有content，生成默认内容
          const defaultContent = `
            <div style="padding: 20px; text-align: center;">
              <h3>📊 ${record.title}</h3>
              <p style="color: #666;">智能阅卷报告已生成</p>
              <p style="color: #999; font-size: 14px;">${record.source} • ${record.time}</p>
            </div>
          `;
          state.setRightPanelGradingContent(defaultContent);
        }
        
        // 切换到阅卷报告查看视图
        state.setRightPanelView(RIGHT_PANEL_VIEWS.GRADING_VIEWER);
        console.log('在右侧面板显示阅卷报告内容:', record.title);
        return;
      }
      
      if (record.type === 'classroom-evaluation') {
        console.log('课堂评价记录点击，record.content存在:', !!record.content);
        console.log('record.evaluationConfig存在:', !!record.evaluationConfig);
        
        // 设置课堂评价记录数据
        state.setRightPanelEditingNote(record);
        
        if (record.content) {
          state.setRightPanelNoteContent(record.content);
        } else {
          // 如果没有content，生成默认内容
          const defaultContent = `
            <div style="padding: 20px; text-align: center;">
              <h3>📊 ${record.title}</h3>
              <p style="color: #666;">课堂评价报告已生成</p>
              <p style="color: #999; font-size: 14px;">${record.source} • ${record.time}</p>
            </div>
          `;
          state.setRightPanelNoteContent(defaultContent);
        }
        
        // 切换到课堂评价记录全屏模式
        setCurrentView(VIEW_MODES.CLASSROOM_EVALUATION_FULLSCREEN);
        console.log('切换到课堂评价记录全屏模式:', record.title);
        return;
      }
      
      // 其他有内容的记录类型
      if (record.content) {
        setCurrentRecord(record);
        setModalContent(record.content);
        setShowContentModal(true);
        console.log('显示记录内容:', record.title);
        return;
      }
      
      console.log('点击了其他类型记录:', record);
    },
    
    onMoreAction: (action, record) => {
      switch (action) {
        case 'submit':
          // 提交培训方案
          message.loading('正在提交培训方案...', 1);
          setTimeout(() => {
            // 更新记录状态为已提交
            setOperationRecords(prev => {
              const newRecords = { ...prev };
              Object.keys(newRecords).forEach(type => {
                if (Array.isArray(newRecords[type])) {
                  newRecords[type] = newRecords[type].map(r => 
                    r.id === record.id ? { ...r, isSubmitted: true, submitTime: new Date().toLocaleString('zh-CN') } : r
                  );
                }
              });
              return newRecords;
            });
            message.success(`培训方案"${record.title}"已成功提交！`);
            // 这里可以添加实际的提交逻辑，比如调用API
            console.log('提交培训方案:', record);
          }, 1000);
          break;
        case MORE_MENU_ACTIONS.MARK_STUDY_RESULT:
          setOperationRecords(prev => ({
            ...prev,
            note: (prev.note || []).map(note => 
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
        case MORE_MENU_ACTIONS.UNMARK_STUDY_RESULT:
          setOperationRecords(prev => ({
            ...prev,
            note: (prev.note || []).map(note => 
              note.id === record.id 
                ? { 
                    ...note, 
                    isStudyResult: false,
                    studyResultInfo: null,
                    tags: (note.tags || []).filter(tag => tag !== '研修成果')
                  }
                : note
            )
          }));
          message.success(`笔记"${record.title}"已取消标记为研修成果！`);
          break;
        case MORE_MENU_ACTIONS.COPY_TO:
          // 显示主题选择弹窗进行复制操作
          setShowThemeSelectModal(true);
          setCurrentRecord(record);
          setCurrentActionType('copy');
          break;
        case MORE_MENU_ACTIONS.MOVE_TO:
          // 显示主题选择弹窗进行移动操作
          setShowThemeSelectModal(true);
          setCurrentRecord(record);
          setCurrentActionType('move');
          break;
        case MORE_MENU_ACTIONS.DELETE:
          setOperationRecords(prev => {
            const newRecords = { ...prev };
            Object.keys(newRecords).forEach(type => {
              if (Array.isArray(newRecords[type])) {
                newRecords[type] = newRecords[type].filter(r => r.id !== record.id);
              }
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
        note: [operationRecord, ...(prev.note || [])]
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
        {/* 孕屏模式：视频播放器占满整个宽度 */}
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
          <ScenarioView 
            selectedScenarios={selectedScenarios}
            setSelectedScenarios={setSelectedScenarios}
            setCurrentView={setCurrentView}
          />
        ) : currentView === VIEW_MODES.LEARNING_PLAN_CALENDAR ? (
          /* 日历演示全屏模式：占据全部三栏区域 */
          <div style={{ 
            flex: 1, 
            background: '#f0f2f5', 
            margin: '16px', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            display: 'flex', 
            flexDirection: 'column',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}>
            {/* 返回按钮 - 放置在右上角 */}
            <Button 
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                setCurrentView(VIEW_MODES.MATERIALS);
                message.info('已退出日历演示全屏模式');
              }}
              style={{ 
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 1000,
                color: '#666',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}
            >
              返回三栏视图
            </Button>

            {/* 日历演示内容区域 */}
            <div style={{ 
              flex: 1, 
              background: '#fff',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <CalendarCenter />
            </div>
          </div>
        ) : currentView === VIEW_MODES.CLASSROOM_EVALUATION_FULLSCREEN ? (
          /* 课堂评价记录全屏模式：占据全部三栏区域 */
          <ClassroomEvaluationFullscreen 
            state={state}
            setCurrentView={setCurrentView}
          />
        ) : currentView === VIEW_MODES.TRAINING_PLAN_FULLSCREEN ? (
          /* 培训方案全屏模式：占据全部三栏区域 */
          <div style={{ 
            flex: 1, 
            background: '#f0f2f5', 
            margin: '16px', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            display: 'flex', 
            flexDirection: 'column',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}>
            {/* 培训方案内容区域 */}
            <div style={{ 
              flex: 1, 
              background: '#fff',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <TrainingPlanViewer 
                rightPanelTrainingPlanRecord={state.rightPanelTrainingPlanRecord}
                rightPanelTrainingPlanContent={state.rightPanelTrainingPlanContent}
                setRightPanelView={state.setRightPanelView}
                setRightPanelTrainingPlanRecord={state.setRightPanelTrainingPlanRecord}
                setRightPanelTrainingPlanContent={state.setRightPanelTrainingPlanContent}
                isFullscreen={true}
                setCurrentView={state.setCurrentView}
              />
            </div>
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
                note={note}
              />
            ) : currentView === VIEW_MODES.LEARNING_PLAN_THREE_COLUMN ? (
              /* 学习计划日历三栏模式：占据左侧区域 */
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
                <LearningPlanCalendar 
                  planData={state.rightPanelLearningPlanRecord}
                  plan={state.rightPanelLearningPlanRecord?.metadata || {}}
                  habits={['morning', 'evening']}
                  selectedDate={dayjs()}
                  onDateChange={(date) => console.log('日期变更:', date)}
                />
              </div>
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
            <div style={{
              flex: (state.rightPanelView === RIGHT_PANEL_VIEWS.NOTE_EDITOR || state.rightPanelView === RIGHT_PANEL_VIEWS.QUESTION_VIEWER || state.rightPanelView === RIGHT_PANEL_VIEWS.GRADING_VIEWER) ? 3.5 : 5,
              transition: 'flex 0.3s ease'
            }}>
              <AIChat 
                state={state}
                handlers={aiChatHandlers}
              />
            </div>

            {/* 右侧操作区域 */}
            <div style={{ 
              flex: (() => {
                // 笔记编辑、试题查看或阅卷报告查看状态时进一步增加右侧宽度
                if (state.rightPanelView === RIGHT_PANEL_VIEWS.NOTE_EDITOR || state.rightPanelView === RIGHT_PANEL_VIEWS.QUESTION_VIEWER || state.rightPanelView === RIGHT_PANEL_VIEWS.GRADING_VIEWER) {
                  const baseRatio = currentView === VIEW_MODES.VIDEO ? 3 : (state.viewMode === VIEW_MODES.MAP ? 3 : 2.5);
                  return baseRatio * 1.5; // 增加50%，比之前的20%更宽
                }
                return currentView === VIEW_MODES.VIDEO ? 3 : (state.viewMode === VIEW_MODES.MAP ? 3 : 2.5);
              })(), 
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
      
      {/* 场景仿真组件 */}
      <ScenarioSimulation 
        scenarioModalVisible={scenarioModalVisible}
        setScenarioModalVisible={setScenarioModalVisible}
        selectedScenarios={selectedScenarios}
        setSelectedScenarios={setSelectedScenarios}
        operationRecords={operationRecords}
        setOperationRecords={setOperationRecords}
        state={state}
      />
      
      {/* 主题选择模态框 */}
      <ThemeSelectModal
        open={showThemeSelectModal}
        onCancel={() => setShowThemeSelectModal(false)}
        currentRecord={currentRecord}
        actionType={currentActionType}
        onConfirm={(selectedTheme) => {
          console.log(`${currentActionType === 'copy' ? '复制' : '移动'}到主题:`, selectedTheme);
          message.success(`已${currentActionType === 'copy' ? '复制' : '移动'}到主题: ${selectedTheme}`);
          setShowThemeSelectModal(false);
        }}
      />
      
      {/* 内容查看弹窗 */}
      <Modal
        title={currentRecord?.title || '查看内容'}
        open={showContentModal}
        onCancel={() => setShowContentModal(false)}
        footer={null}
        width={800}
        centered
      >
        <div 
          style={{ 
            padding: '20px 0',
            maxHeight: '60vh',
            overflowY: 'auto'
          }}
          dangerouslySetInnerHTML={{ __html: modalContent }}
        />
      </Modal>
      
      {/* 悬浮消息图标 */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          cursor: 'pointer'
        }}
        onClick={() => setShowMessageCenter(true)}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            backgroundColor: '#1890ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.4)',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 16px rgba(24, 144, 255, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.4)';
          }}
        >
          <MessageOutlined style={{ fontSize: '24px', color: 'white' }} />
          {unreadMessageCount > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#ff4d4f',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                border: '2px solid white'
              }}
            >
              {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
            </div>
          )}
        </div>
       </div>
       
       {/* 消息讨论弹窗 */}
       <div
         style={{
           position: 'fixed',
           bottom: '90px', // 在悬浮图标上方
           right: '24px',
           width: '400px',
           height: '500px',
           backgroundColor: 'white',
           borderRadius: '12px',
           boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
           border: '1px solid #e8e8e8',
           zIndex: 1001,
           display: showMessageCenter ? 'flex' : 'none',
           flexDirection: 'column',
           overflow: 'hidden'
         }}
       >
         {/* 标题栏 */}
         <div style={{
           padding: '16px 20px',
           borderBottom: '1px solid #f0f0f0',
           backgroundColor: '#fafafa',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'space-between'
         }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <MessageOutlined style={{ color: '#1890ff' }} />
             <span style={{ fontWeight: 'bold' }}>主题讨论</span>
             <Badge count={unreadMessageCount} size="small" />
           </div>
           <Button 
             type="text" 
             size="small"
             onClick={() => {
               setShowMessageCenter(false);
               setUnreadMessageCount(0);
             }}
             style={{ color: '#999' }}
           >
             ✕
           </Button>
         </div>
          {/* 消息列表区域 */}
          <div style={{ 
            flex: 1, 
            padding: '16px', 
            overflowY: 'auto',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <List
              dataSource={discussionMessages}
              renderItem={(msg) => (
                <List.Item style={{ padding: '12px 0', border: 'none' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '8px' 
                    }}>
                      <Typography.Text strong style={{ color: '#1890ff' }}>
                        {msg.senderName}
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                        {msg.time}
                      </Typography.Text>
                    </div>
                    <Typography.Text style={{ 
                      fontSize: '14px', 
                      lineHeight: '1.5',
                      display: 'block',
                      padding: '8px 12px',
                      backgroundColor: '#f6f8ff',
                      borderRadius: '8px',
                      border: '1px solid #e6f0ff'
                    }}>
                      {msg.content}
                    </Typography.Text>
                  </div>
                </List.Item>
              )}
            />
          </div>
          
          {/* 消息输入区域 */}
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#fafafa',
            borderTop: '1px solid #f0f0f0'
          }}>
            <Input.Group compact>
              <Input
                style={{ width: 'calc(100% - 80px)' }}
                placeholder="输入您的讨论内容..."
                onPressEnter={(e) => {
                  if (e.target.value.trim()) {
                    const newMessage = {
                      id: Date.now(),
                      senderId: 'me',
                      senderName: '我',
                      content: e.target.value,
                      time: new Date().toLocaleString('zh-CN', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      }),
                      type: 'text'
                    };
                    setDiscussionMessages(prev => [...prev, newMessage]);
                    e.target.value = '';
                    message.success('消息发送成功');
                  }
                }}
              />
              <Button 
                type="primary" 
                style={{ width: '80px' }}
                onClick={(e) => {
                  const input = e.target.parentElement.querySelector('input');
                  if (input && input.value.trim()) {
                    const newMessage = {
                      id: Date.now(),
                      senderId: 'me',
                      senderName: '我',
                      content: input.value,
                      time: new Date().toLocaleString('zh-CN', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      }),
                      type: 'text'
                    };
                    setDiscussionMessages(prev => [...prev, newMessage]);
                    input.value = '';
                    message.success('消息发送成功');
                  }
                }}
              >
                发送
              </Button>
            </Input.Group>
          </div>
        </div>
     </>
   );
 };

 export default NoteEditPage;