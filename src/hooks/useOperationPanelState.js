import { useState, useEffect } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { OPERATION_CARDS } from '../constants/noteEditConstants';

// 操作面板状态管理Hook
export const useOperationPanelState = () => {
  // 可见工具卡片状态 - 初始化默认工具
  const [visibleCards, setVisibleCards] = useState(() => {
    // 从 localStorage 获取已添加的 AI 工具
    const addedAITools = JSON.parse(localStorage.getItem('added-ai-tools-to-panel') || '[]');
    
    // 获取 AI 工具配置
    const aiToolsConfig = JSON.parse(localStorage.getItem('ai-tools-config') || '{}');
    
    // 获取默认基础工具（排除添加工具按钮、试卷、思维导图和视频概览）
    const defaultCards = OPERATION_CARDS.filter(card => 
      card.key !== 'addTool' && 
      card.key !== 'exam-paper' &&
      card.key !== 'mindmap' &&
      card.key !== 'video'
    );
    
    // 添加 AI 工具到默认卡片列表
    const aiToolCards = addedAITools.map(toolId => {
      const toolConfig = aiToolsConfig[toolId];
      if (toolConfig) {
        return {
          key: toolConfig.key,
          title: toolConfig.title,
          icon: toolConfig.icon,
          gradient: toolConfig.gradient,
          color: toolConfig.color,
          isAITool: true // 标记为AI工具
        };
      }
      return null;
    }).filter(Boolean);
    
    const allCards = [...defaultCards, ...aiToolCards];
    
    // 确保知识图谱在第一位，试题在第二位，学习计划在第三位，阅卷工具在第四位
    const knowledgeGraphCard = allCards.find(card => card.key === 'knowledge-graph');
    const questionCard = allCards.find(card => card.key === 'question');
    const learningPlanCard = allCards.find(card => card.key === 'learning-plan');
    const gradingCard = allCards.find(card => card.key === 'grading');
    const otherCards = allCards.filter(card => 
      card.key !== 'knowledge-graph' && 
      card.key !== 'question' &&
      card.key !== 'learning-plan' &&
      card.key !== 'grading'
    );
    const orderedCards = [];
    if (knowledgeGraphCard) orderedCards.push(knowledgeGraphCard);
    if (questionCard) orderedCards.push(questionCard);
    if (learningPlanCard) orderedCards.push(learningPlanCard);
    if (gradingCard) orderedCards.push(gradingCard);
    orderedCards.push(...otherCards);
    
    return orderedCards;
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [showCardSelector, setShowCardSelector] = useState(false);
  
  // 监听AI工具添加事件，实时更新操作面板
  useEffect(() => {
    const handleAIToolsChange = () => {
      const addedAITools = JSON.parse(localStorage.getItem('added-ai-tools-to-panel') || '[]');
      const aiToolsConfig = JSON.parse(localStorage.getItem('ai-tools-config') || '{}');
      
      const defaultCards = OPERATION_CARDS.filter(card => 
        card.key !== 'addTool' && 
        card.key !== 'exam-paper' &&
        card.key !== 'mindmap' &&
        card.key !== 'video'
      );
      
      const aiToolCards = addedAITools.map(toolId => {
        const toolConfig = aiToolsConfig[toolId];
        if (toolConfig) {
          return {
            key: toolConfig.key,
            title: toolConfig.title,
            icon: toolConfig.icon,
            gradient: toolConfig.gradient,
            color: toolConfig.color,
            isAITool: true
          };
        }
        return null;
      }).filter(Boolean);
      
      const allCards = [...defaultCards, ...aiToolCards];
      
      const knowledgeGraphCard = allCards.find(card => card.key === 'knowledge-graph');
      const questionCard = allCards.find(card => card.key === 'question');
      const learningPlanCard = allCards.find(card => card.key === 'learning-plan');
      const gradingCard = allCards.find(card => card.key === 'grading');
      const otherCards = allCards.filter(card => 
        card.key !== 'knowledge-graph' && 
        card.key !== 'question' &&
        card.key !== 'learning-plan' &&
        card.key !== 'grading'
      );
      const orderedCards = [];
      if (knowledgeGraphCard) orderedCards.push(knowledgeGraphCard);
      if (questionCard) orderedCards.push(questionCard);
      if (learningPlanCard) orderedCards.push(learningPlanCard);
      if (gradingCard) orderedCards.push(gradingCard);
      orderedCards.push(...otherCards);
      
      setVisibleCards(orderedCards);
    };
    
    // 监听 storage 事件
    window.addEventListener('storage', handleAIToolsChange);
    // 监听自定义事件
    window.addEventListener('aiToolsChanged', handleAIToolsChange);
    
    return () => {
      window.removeEventListener('storage', handleAIToolsChange);
      window.removeEventListener('aiToolsChanged', handleAIToolsChange);
    };
  }, []);
  
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