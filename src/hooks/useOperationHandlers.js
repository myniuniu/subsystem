import { message, Modal } from 'antd';
import { OPERATION_TYPES, RIGHT_PANEL_VIEWS } from '../constants/noteEditConstants';

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
  
  // 通用函数：添加记录并模拟生成过程
  const addRecordWithGenerating = (recordType, record, callbacks = {}) => {
    // 添加生成中状态
    const recordWithGenerating = {
      ...record,
      isGenerating: true
    };
    
    // 添加到记录中
    const newRecords = { ...operationRecords };
    if (!newRecords[recordType]) {
      newRecords[recordType] = [];
    }
    newRecords[recordType].unshift(recordWithGenerating);
    setOperationRecords(newRecords);
    
    // 3秒后取消生成中状态
    setTimeout(() => {
      setOperationRecords(prev => {
        const updated = { ...prev };
        if (updated[recordType]) {
          updated[recordType] = updated[recordType].map(r => 
            r.id === record.id ? { ...r, isGenerating: false } : r
          );
        }
        return updated;
      });
      
      // 执行回调
      if (callbacks.onComplete) {
        callbacks.onComplete();
      }
    }, 3000);
    
    return recordWithGenerating;
  };
  
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

    // 使用通用函数添加记录
    addRecordWithGenerating('grading', gradingRecord, {
      onComplete: () => {
        // 生成完成，不自动打开右侧面板
        message.success('智能阅卷完成，记录已添加。点击查看详情');
      }
    });
  };

  // 处理培训报表工具
  const handleTrainingDashboardToolAction = () => {
    // 直接切换到培训报表视图
    setRightPanelView(RIGHT_PANEL_VIEWS.TRAINING_DASHBOARD_VIEWER);
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

    // 使用通用函数添加记录
    addRecordWithGenerating('training-report', trainingReportRecord, {
      onComplete: () => {
        // 生成完成，不自动打开右侧面板
        message.success('培训报告生成成功，记录已添加。点击查看详情');
      }
    });
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
      // 直接生成试题记录，不弹出配置窗口
      const questionRecord = {
        id: `question_${Date.now()}`,
        type: OPERATION_TYPES.QUESTION,
        title: '智能试题',
        source: sourceInfo?.details || '基于当前数据源',
        time: new Date().toLocaleString('zh-CN'),
        content: `<div style="padding: 20px; text-align: center;">
          <h3>📝 智能试题</h3>
          <p style="color: #666;">基于${sourceInfo?.total || 1}个数据源生成的智能试题</p>
          <p style="color: #999; font-size: 14px;">${sourceInfo?.details || '数据源分析'} • ${new Date().toLocaleString('zh-CN')}</p>
        </div>`,
        config: { auto: true }
      };
      addRecordWithGenerating(OPERATION_TYPES.QUESTION, questionRecord, {
        onComplete: () => {
          message.success('试题生成成功，记录已添加。点击查看详情');
        }
      });
    } else if (card.key === 'learning-plan') {
      // 直接生成学习计划记录，不弹出配置窗口
      const learningPlanRecord = {
        id: `learning_plan_${Date.now()}`,
        type: OPERATION_TYPES.LEARNING_PLAN,
        title: '智能学习计划',
        source: sourceInfo?.details || '基于当前数据源',
        time: new Date().toLocaleString('zh-CN'),
        content: `<div style="padding: 20px; text-align: center;">
          <h3>🎯 智能学习计划</h3>
          <p style="color: #666;">基于${sourceInfo?.total || 1}个数据源生成的个性化学习计划</p>
          <p style="color: #999; font-size: 14px;">${sourceInfo?.details || '数据源分析'} • ${new Date().toLocaleString('zh-CN')}</p>
        </div>`,
        planData: {
          startDate: new Date().toLocaleDateString('zh-CN'),
          endDate: new Date(Date.now() + 84 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN')
        }
      };
      addRecordWithGenerating(OPERATION_TYPES.LEARNING_PLAN, learningPlanRecord, {
        onComplete: () => {
          message.success('学习计划生成成功，记录已添加。点击查看详情');
        }
      });
    } else if (card.key === 'report') {
      // 直接生成报告记录，不弹出格式选择窗口
      const reportRecord = {
        id: `report_${Date.now()}`,
        type: OPERATION_TYPES.REPORT,
        title: '智能报告',
        source: sourceInfo?.details || '基于当前数据源',
        time: new Date().toLocaleString('zh-CN'),
        content: `<div style="padding: 20px; text-align: center;">
          <h3>📄 智能报告</h3>
          <p style="color: #666;">基于${sourceInfo?.total || 1}个数据源生成的报告</p>
          <p style="color: #999; font-size: 14px;">${sourceInfo?.details || '数据源分析'} • ${new Date().toLocaleString('zh-CN')}</p>
        </div>`
      };
      addRecordWithGenerating(OPERATION_TYPES.REPORT, reportRecord, {
        onComplete: () => {
          message.success('报告已生成，记录已添加。点击查看详情');
        }
      });
    } else if (card.key === 'grading') {
      // 阅卷工具处理
      handleGradingToolAction();
    } else if (card.key === OPERATION_TYPES.CLASSROOM_EVALUATION) {
      // 直接生成课堂评价记录，不弹出配置窗口
      const evaluationRecord = {
        id: `classroom_evaluation_${Date.now()}`,
        type: OPERATION_TYPES.CLASSROOM_EVALUATION,
        title: '课堂评价',
        source: sourceInfo?.details || '基于当前数据源',
        time: new Date().toLocaleString('zh-CN'),
        content: `<div style="padding: 20px; text-align: center;">
          <h3>📊 课堂评价报告</h3>
          <p style="color: #666;">基于评价量表生成的课堂表现评价</p>
          <p style="color: #999; font-size: 14px;">${new Date().toLocaleString('zh-CN')}</p>
        </div>`,
        evaluationConfig: { auto: true }
      };
      addRecordWithGenerating(OPERATION_TYPES.CLASSROOM_EVALUATION, evaluationRecord, {
        onComplete: () => {
          message.success('课堂评价记录已生成，点击操作记录查看详情');
        }
      });
    } else if (card.key === OPERATION_TYPES.CLASSROOM_BEHAVIOR_ANALYSIS) {
      // 课堂行为分析工具处理：生成一条操作记录并打开查看器
      const behaviorRecord = {
        id: `behavior_${Date.now()}`,
        type: OPERATION_TYPES.CLASSROOM_BEHAVIOR_ANALYSIS,
        title: '课堂行为分析',
        source: sourceInfo?.details || '基于当前数据源',
        time: new Date().toLocaleString('zh-CN'),
        content: `<div style="padding: 20px; text-align: center;">
          <h3>🎯 课堂行为分析</h3>
          <p style="color: #666;">基于${sourceInfo?.total || 1}个数据源生成的行为分析</p>
          <p style="color: #999; font-size: 14px;">${sourceInfo?.details || '数据源分析'} • ${new Date().toLocaleString('zh-CN')}</p>
        </div>`,
        analysisData: {
          activity: 76,
          participation: 68,
          focus: 82,
          disciplineEvents: 5
        }
      };
      addRecordWithGenerating(OPERATION_TYPES.CLASSROOM_BEHAVIOR_ANALYSIS, behaviorRecord, {
        onComplete: () => {
          // 生成完成，不自动打开右侧面板
          message.success('课堂行为分析已生成，记录已添加。点击查看详情');
        }
      });
    } else if (card.key === 'training-report') {
      // 培训报告工具处理
      handleTrainingReportToolAction();
    } else if (card.key === OPERATION_TYPES.TRAINING_PLAN) {
      // 直接生成培训方案记录，不弹出配置窗口
      const trainingPlanRecord = {
        id: `training_plan_${Date.now()}`,
        type: OPERATION_TYPES.TRAINING_PLAN,
        title: '培训方案',
        source: sourceInfo?.details || '基于当前数据源',
        time: new Date().toLocaleString('zh-CN'),
        content: `<div style="padding: 20px; text-align: center;">
          <h3>📋 培训方案</h3>
          <p style="color: #666;">基于${sourceInfo?.total || 1}个数据源生成的培训方案</p>
          <p style="color: #999; font-size: 14px;">${sourceInfo?.details || '数据源分析'} • ${new Date().toLocaleString('zh-CN')}</p>
        </div>`,
        trainingConfig: { auto: true }
      };
      addRecordWithGenerating(OPERATION_TYPES.TRAINING_PLAN, trainingPlanRecord, {
        onComplete: () => {
          message.success('培训方案生成成功，记录已添加。点击查看详情');
        }
      });
    }
  };

  return {
    handleToolClick,
    handleGradingToolAction,
    handleTrainingReportToolAction,
    handleTrainingDashboardToolAction
  };
};