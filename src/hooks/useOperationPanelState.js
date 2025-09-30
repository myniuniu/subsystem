import { useState, useEffect } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { OPERATION_CARDS } from '../constants/noteEditConstants';

// 操作面板状态管理Hook
export const useOperationPanelState = (noteCategory = null) => {
  console.log('=== useOperationPanelState 调用 ===');
  console.log('接收到的 noteCategory:', noteCategory);
  console.log('noteCategory 类型:', typeof noteCategory);
  console.log('================================');

  // 根据分类过滤工具的函数
  const getFilteredCards = (category) => {
    console.log('getFilteredCards 被调用，分类:', category);
    
    // 如果是培训需求与管理分类，返回培训相关工具
    if (category === 'training_needs_management') {
      // 只显示指定的四个工具：培训方案、课表、培训报告、培训报表
      const trainingCards = OPERATION_CARDS.filter(card => 
        card.key === 'training-plan' || 
        card.key === 'schedule' || 
        card.key === 'training-report' ||
        card.key === 'training-dashboard'
      );
      
      console.log('培训需求管理分类，返回的卡片:', trainingCards);
      return trainingCards;
    }
    
    // 如果是培训产品研发分类，显示课程研发工具和视频切片工具
    if (category === 'training_product_development') {
      // 获取AI工具配置
      const aiToolsConfig = JSON.parse(localStorage.getItem('aiToolsConfig') || '{}');
      const addedAITools = JSON.parse(localStorage.getItem('addedAITools') || '[]');
      
      console.log('localStorage aiToolsConfig:', aiToolsConfig);
      console.log('localStorage addedAITools:', addedAITools);
      
      // 如果课程研发工具不存在，自动创建并添加
      if (!addedAITools.includes('course-development')) {
        console.log('课程研发工具不存在，自动创建...');
        
        // 创建课程研发工具配置
        const courseDevConfig = {
          key: 'course-development',
          title: '课程研发',
          icon: '📚',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        };
        
        // 更新配置
        aiToolsConfig['course-development'] = courseDevConfig;
        addedAITools.push('course-development');
        
        // 保存到localStorage
        localStorage.setItem('aiToolsConfig', JSON.stringify(aiToolsConfig));
        localStorage.setItem('addedAITools', JSON.stringify(addedAITools));
        
        console.log('课程研发工具已自动创建并添加');
      }
      
      // 如果视频切片工具不存在，自动创建并添加
      if (!addedAITools.includes('video-slice')) {
        console.log('视频切片工具不存在，自动创建...');
        
        // 创建视频切片工具配置
        const videoSliceConfig = {
          key: 'video-slice',
          title: '视频切片',
          icon: '🎬',
          gradient: 'linear-gradient(135deg, #fff2e8 0%, #ffd8bf 100%)',
          color: '#fa8c16'
        };
        
        // 更新配置
        aiToolsConfig['video-slice'] = videoSliceConfig;
        addedAITools.push('video-slice');
        
        // 保存到localStorage
        localStorage.setItem('aiToolsConfig', JSON.stringify(aiToolsConfig));
        localStorage.setItem('addedAITools', JSON.stringify(addedAITools));
        
        console.log('视频切片工具已自动创建并添加');
      }
      
      // 查找培训产品研发相关的AI工具
      const trainingProductDevCards = [];
      
      // 添加课程研发工具
      if (addedAITools.includes('course-development') && aiToolsConfig['course-development']) {
        const config = aiToolsConfig['course-development'];
        const aiCard = {
          key: 'course-development',
          title: config.title,
          icon: config.icon,
          gradient: config.gradient,
          color: config.color,
          isAITool: true
        };
        trainingProductDevCards.push(aiCard);
        console.log('找到课程研发AI工具:', aiCard);
      }
      
      // 添加视频切片工具
      if (addedAITools.includes('video-slice') && aiToolsConfig['video-slice']) {
        const config = aiToolsConfig['video-slice'];
        const aiCard = {
          key: 'video-slice',
          title: config.title,
          icon: config.icon,
          gradient: config.gradient,
          color: config.color,
          isAITool: true
        };
        trainingProductDevCards.push(aiCard);
        console.log('找到视频切片AI工具:', aiCard);
      }
      
      console.log('培训产品研发分类，返回的卡片:', trainingProductDevCards);
      return trainingProductDevCards;
    }
    
    // 其他分类返回所有工具（保持原有逻辑）
    const defaultCards = OPERATION_CARDS.filter(card => card.key !== 'addTool');
    
    // 获取AI工具配置
    const aiToolsConfig = JSON.parse(localStorage.getItem('aiToolsConfig') || '{}');
    const addedAITools = JSON.parse(localStorage.getItem('addedAITools') || '[]');
    
    // 创建AI工具卡片
    const aiToolCards = addedAITools.map(toolId => {
      const config = aiToolsConfig[toolId];
      if (config) {
        const aiCard = {
          key: toolId,
          title: config.title,
          icon: config.icon,
          gradient: config.gradient,
          color: config.color,
          isAITool: true
        };
        return aiCard;
      }
      return null;
    }).filter(Boolean);
    
    const allCards = [...defaultCards, ...aiToolCards];
    
    // 确保知识图谱在第一位，试题在第二位，学习计划在第三位，阅卷工具在第四位
    const knowledgeGraphCard = allCards.find(card => card.key === 'knowledge-graph');
    const questionCard = allCards.find(card => card.key === 'question');
    const learningPlanCard = allCards.find(card => card.key === 'learning-plan');
    const gradingCard = allCards.find(card => card.key === 'grading');
    
    // 分离AI工具卡片和其他基础工具卡片
    const aiCards = allCards.filter(card => card.isAITool);
    const otherBasicCards = allCards.filter(card => 
      card.key !== 'knowledge-graph' && 
      card.key !== 'question' &&
      card.key !== 'learning-plan' &&
      card.key !== 'grading' &&
      !card.isAITool
    );
    
    const orderedCards = [];
    if (knowledgeGraphCard) orderedCards.push(knowledgeGraphCard);
    if (questionCard) orderedCards.push(questionCard);
    if (learningPlanCard) orderedCards.push(learningPlanCard);
    if (gradingCard) orderedCards.push(gradingCard);
    
    // AI工具卡片优先显示在基础工具之后，其他工具之前
    orderedCards.push(...aiCards);
    orderedCards.push(...otherBasicCards);
    
    // 确保返回的工具数量不超过9个
    return orderedCards.slice(0, 9);
  };

  // 可见工具卡片状态 - 初始化默认工具
  const [visibleCards, setVisibleCards] = useState(() => {
    return getFilteredCards(noteCategory);
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [showCardSelector, setShowCardSelector] = useState(false);
  
  // 加载状态管理
  const [loadingCards, setLoadingCards] = useState([]);
  
  // 添加加载状态
  const addLoadingCard = (cardKey) => {
    setLoadingCards(prev => [...prev, cardKey]);
  };
  
  // 移除加载状态
  const removeLoadingCard = (cardKey) => {
    setLoadingCards(prev => prev.filter(key => key !== cardKey));
  };
  
  // 监听AI工具添加事件，实时更新操作面板
  useEffect(() => {
    const handleAIToolsChange = () => {
      setVisibleCards(getFilteredCards(noteCategory));
    };
    
    // 监听 storage 事件
    window.addEventListener('storage', handleAIToolsChange);
    // 监听自定义事件
    window.addEventListener('aiToolsChanged', handleAIToolsChange);
    
    return () => {
      window.removeEventListener('storage', handleAIToolsChange);
      window.removeEventListener('aiToolsChanged', handleAIToolsChange);
    };
  }, [noteCategory]);

  // 当分类变化时，更新可见工具卡片
  useEffect(() => {
    setVisibleCards(getFilteredCards(noteCategory));
  }, [noteCategory]);
  
  // 练习模式相关状态
  const [practiceMode, setPracticeMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  
  // 学习计划查看器状态
  const [planViewMode, setPlanViewMode] = useState('summary');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  
  // 阅卷查看器状态
  const [gradingViewMode, setGradingViewMode] = useState('summary');
  const [selectedStudent, setSelectedStudent] = useState(null);

  return {
    visibleCards,
    setVisibleCards,
    isEditMode,
    setIsEditMode,
    showCardSelector,
    setShowCardSelector,
    loadingCards,
    addLoadingCard,
    removeLoadingCard,
    practiceMode,
    setPracticeMode,
    userAnswers,
    setUserAnswers,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    showResults,
    setShowResults,
    score,
    setScore,
    planViewMode,
    setPlanViewMode,
    selectedDate,
    setSelectedDate,
    gradingViewMode,
    setGradingViewMode,
    selectedStudent,
    setSelectedStudent
  };
};

// 模态框状态管理Hook
export const useModalState = () => {
  const [questionConfigVisible, setQuestionConfigVisible] = useState(false);
  const [learningPlanModalVisible, setLearningPlanModalVisible] = useState(false);
  const [reportSelectionVisible, setReportSelectionVisible] = useState(false);
  const [showThemeSelectModal, setShowThemeSelectModal] = useState(false);
  const [classroomEvaluationVisible, setClassroomEvaluationVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [currentActionType, setCurrentActionType] = useState(null);

  return {
    questionConfigVisible,
    setQuestionConfigVisible,
    learningPlanModalVisible,
    setLearningPlanModalVisible,
    reportSelectionVisible,
    setReportSelectionVisible,
    showThemeSelectModal,
    setShowThemeSelectModal,
    classroomEvaluationVisible,
    setClassroomEvaluationVisible,
    currentRecord,
    setCurrentRecord,
    currentActionType,
    setCurrentActionType
  };
};

// 数据源检查Hook
export const useSourceDataCheck = ({ uploadedFiles, addedTexts, courseVideos, links }) => {
  const hasSourceData = Boolean(
    (uploadedFiles && uploadedFiles.length > 0) ||
    (addedTexts && addedTexts.length > 0) ||
    (courseVideos && courseVideos.length > 0) ||
    (links && links.length > 0)
  );

  const sourceInfo = {
    total: (uploadedFiles?.length || 0) + (addedTexts?.length || 0) + (courseVideos?.length || 0) + (links?.length || 0),
    details: hasSourceData ? 
      `已添加${(uploadedFiles?.length || 0)}个文件、${(addedTexts?.length || 0)}段文本、${(courseVideos?.length || 0)}个视频、${(links?.length || 0)}个链接` : 
      '暂无数据源'
  };

  return {
    hasSourceData,
    sourceInfo
  };
};