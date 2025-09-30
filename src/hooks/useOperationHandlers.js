import { message, Modal } from 'antd';
import { OPERATION_TYPES } from '../constants/noteEditConstants';

// 操作处理逻辑Hook
export const useOperationHandlers = ({
  hasSourceData,
  sourceInfo,
  operationRecords,
  setOperationRecords,
  setRightPanelView,
  setRightPanelQuestionRecord,
  setRightPanelQuestionContent,
  setRightPanelLearningPlanRecord,
  setRightPanelLearningPlanContent,
  setRightPanelGradingRecord,
  setRightPanelGradingContent,
  setRightPanelTrainingReportRecord,
  setRightPanelTrainingReportContent,
  setQuestionConfigVisible,
  setClassroomEvaluationVisible,
  setLearningPlanModalVisible,
  setReportSelectionVisible,
  onOperationClick,
  onAddTool,
  onScenarioClick,
  onRecordClick,
  onMoreAction
}) => {
  
  // 处理阅卷工具
  const handleGradingToolAction = () => {
    // 生成阅卷记录
    const gradingRecord = {
      id: `grading_${Date.now()}`,
      type: 'grading',
      title: '智能阅卷报告',
      source: sourceInfo?.details || '基于当前数据源',
      time: new Date().toLocaleString('zh-CN'),
      content: `<div style="padding: 20px; text-align: center;">
        <h3>📊 智能阅卷报告</h3>
        <p style="color: #666;">基于${sourceInfo?.total || 1}个数据源生成的阅卷分析</p>
        <p style="color: #999; font-size: 14px;">${sourceInfo?.details || '数据源分析'} • ${new Date().toLocaleString('zh-CN')}</p>
      </div>`,
      gradingData: {
        totalPapers: 45,
        averageScore: 82.3,
        highestScore: 98,
        lowestScore: 45,
        passRate: 88.9,
        standardDeviation: 12.5,
        scoreDistribution: {
          A: 24.4, // 90-100分
          B: 35.6, // 80-89分
          C: 28.9, // 70-79分
          D: 11.1  // 60-69分
        },
        teachingSuggestions: [
          { text: '重点关注函数定义和调用的语法规范', type: 'warning' },
          { text: '加强学生对循环结构的理解和应用', type: 'info' },
          { text: '继续保持良好的代码注释习惯', type: 'success' }
        ],
        studentDetails: [
          {
            id: 'student_001',
            name: '张三',
            studentId: '2023001',
            score: 92,
            rank: 3,
            answers: [
              { questionId: 1, question: '什么是函数？', answer: '函数是一段可重复使用的代码块...', score: 18, fullScore: 20, correct: true, comment: '理解正确，表达清晰' },
              { questionId: 2, question: '编写一个求和函数', answer: 'def sum_nums(a, b): return a + b', score: 20, fullScore: 20, correct: true },
              { questionId: 3, question: '什么是循环？', answer: '循环是重复执行代码的结构...', score: 16, fullScore: 20, correct: true, comment: '概念理解较好，可以补充更多细节' }
            ]
          },
          {
            id: 'student_002', 
            name: '李四',
            studentId: '2023002',
            score: 78,
            rank: 15,
            answers: [
              { questionId: 1, question: '什么是函数？', answer: '函数就是一个程序...', score: 14, fullScore: 20, correct: false, comment: '理解有偏差，需要更准确的表达' },
              { questionId: 2, question: '编写一个求和函数', answer: 'def add(x, y): print(x + y)', score: 16, fullScore: 20, correct: false, comment: '应该返回结果而不是打印' },
              { questionId: 3, question: '什么是循环？', answer: '循环就是for和while...', score: 15, fullScore: 20, correct: true, comment: '基本概念正确，可以更深入' }
            ]
          }
        ]
      }
    };

    // 添加到记录中
    const newRecords = { ...operationRecords };
    if (!newRecords.grading) {
      newRecords.grading = [];
    }
    newRecords.grading.unshift(gradingRecord);
    setOperationRecords(newRecords);
    
    // 设置右侧面板显示
    setRightPanelGradingRecord(gradingRecord);
    setRightPanelGradingContent(gradingRecord.content);
    setRightPanelView('GRADING_VIEWER');
    
    message.success('智能阅卷完成，已生成详细报告！');
  };

  // 处理培训报表工具
  const handleTrainingDashboardToolAction = () => {
    // 直接切换到培训报表视图
    setRightPanelView('TRAINING_DASHBOARD_VIEWER');
    message.success('培训报表工具已启动！');
  };

  // 处理培训报告工具
  const handleTrainingReportToolAction = () => {
    // 生成培训报告记录
    const trainingReportRecord = {
      id: `training_report_${Date.now()}`,
      type: 'training-report',
      title: '培训需求与管理系统整体培训报告',
      source: sourceInfo?.details || '基于当前数据源',
      time: new Date().toLocaleString('zh-CN'),
      content: `<div style="padding: 20px; text-align: center;">
        <h3>📊 培训需求与管理系统整体培训报告</h3>
        <p style="color: #666;">基于${sourceInfo?.total || 1}个数据源生成的综合培训分析报告</p>
        <p style="color: #999; font-size: 14px;">${sourceInfo?.details || '数据源分析'} • ${new Date().toLocaleString('zh-CN')}</p>
      </div>`,
      reportData: {
        reportType: '综合培训报告',
        generatedAt: new Date().toISOString(),
        dataSource: sourceInfo?.details || '基于当前数据源',
        totalDataSources: sourceInfo?.total || 1
      }
    };

    // 添加到记录中
    const newRecords = { ...operationRecords };
    if (!newRecords['training-report']) {
      newRecords['training-report'] = [];
    }
    newRecords['training-report'].unshift(trainingReportRecord);
    setOperationRecords(newRecords);
    
    // 设置右侧面板显示
    setRightPanelTrainingReportRecord(trainingReportRecord);
    setRightPanelTrainingReportContent(trainingReportRecord.content);
    setRightPanelView('TRAINING_REPORT_VIEWER');
    
    message.success('培训报告生成成功！');
  };

  // 处理工具点击
  const handleToolClick = (card) => {
    // 添加工具不需要数据源限制
    if (card.key === 'addTool') {
      return;
    }

    // 检查来源数据
    if (!hasSourceData) {
      Modal.warning({
        title: '需要添加数据源',
        content: '操作面板上的所有工具都需要基于来源数据作为依据。当前数据源状态：' + (sourceInfo?.details || '暂无数据源') + '。请先添加文件、文本、视频或链接资源，然后再使用工具。',
        okText: '我知道了',
        width: 400
      });
      return;
    }

    // 如果有来源数据，正常执行工具操作
    if (card.key === 'scenario') {
      onScenarioClick();
    } else if (card.key === 'question') {
      // 试题工具弹出配置窗口
      setQuestionConfigVisible(true);
    } else if (card.key === 'learning-plan') {
      // 学习计划工具弹出配置窗口
      setLearningPlanModalVisible(true);
    } else if (card.key === 'report') {
      // 报告工具弹出格式选择窗口
      setReportSelectionVisible(true);
    } else if (card.key === 'grading') {
      // 阅卷工具处理
      handleGradingToolAction();
    } else if (card.key === 'classroom-evaluation') {
      // 课堂评价工具处理
      message.info(`正在启动课堂评价工具（基于${sourceInfo?.total || 0}个数据源）`);
      setClassroomEvaluationVisible(true);
    } else if (card.key === 'training-report') {
      // 培训报告工具处理
      handleTrainingReportToolAction();
    } else if (card.key === OPERATION_TYPES.TRAINING_DASHBOARD) {
      // 培训报表工具处理
      handleTrainingDashboardToolAction();
    } else if (card.isAITool) {
      // AI工具点击处理
      message.info(`您点击了AI工具：${card.title}（基于${sourceInfo?.total || 0}个数据源）`);
    } else {
      onOperationClick(card.key);
    }
  };

  return {
    handleToolClick,
    handleGradingToolAction,
    handleTrainingReportToolAction,
    handleTrainingDashboardToolAction
  };
};