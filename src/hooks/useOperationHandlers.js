import { message, Modal } from 'antd';
import { OPERATION_TYPES, RIGHT_PANEL_VIEWS } from '../constants/noteEditConstants';

// 操作处理逻辑Hook
export const useOperationHandlers = ({
  hasSourceData,
  sourceInfo,
  uploadedFiles,
  addedTexts,
  courseVideos,
  links,
  selectedMaterials,
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

  // 收集当前来源快照（文件、文本、视频、链接）
  const getSourceRefs = () => {
    const refs = [];
    try {
      (uploadedFiles || []).forEach(f => refs.push({ type: 'file', id: f.id, title: f.name || f.title || String(f.id) }));
      (addedTexts || []).forEach(t => refs.push({ type: 'text', id: t.id, title: t.title || t.name || String(t.id) }));
      (courseVideos || []).forEach(v => refs.push({ type: 'video', id: v.id, title: v.title || v.name || String(v.id) }));
      (links || []).forEach(l => refs.push({ type: 'link', id: l.id, title: l.title || l.url || String(l.id) }));
    } catch (e) {}
    return refs;
  };

  // 仅基于“当下勾选”的来源生成快照
  const getSelectedSourceRefs = () => {
    const list = Array.isArray(selectedMaterials) ? selectedMaterials : [];
    const key = list[0];
    if (typeof key !== 'string' || !key.includes('-')) return [];
    const [prefix, id] = key.split('-');
    let item = null;
    if (prefix === 'file') {
      item = (uploadedFiles || []).find(f => String(f.id) === String(id));
      return item ? [{ type: 'file', id: item.id, title: item.name || item.title || String(item.id) }] : [];
    } else if (prefix === 'text') {
      item = (addedTexts || []).find(t => String(t.id) === String(id));
      return item ? [{ type: 'text', id: item.id, title: item.title || item.name || String(item.id) }] : [];
    } else if (prefix === 'video') {
      item = (courseVideos || []).find(v => String(v.id) === String(id));
      return item ? [{ type: 'video', id: item.id, title: item.title || item.name || String(item.id) }] : [];
    } else if (prefix === 'link') {
      item = (links || []).find(l => String(l.id) === String(id));
      return item ? [{ type: 'link', id: item.id, title: item.title || item.url || String(item.id) }] : [];
    }
    return [];
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
      sourceRefs: getSourceRefs(),
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
    // 生成培训报表操作记录，名称同当前选中的培训项目
    const selectedTitle = (typeof window !== 'undefined' && window.__selected_project_title__) || '培训报表';
    const dashboardRecord = {
      id: `training_dashboard_${Date.now()}`,
      type: OPERATION_TYPES.TRAINING_DASHBOARD,
      title: selectedTitle,
      source: sourceInfo?.details || '基于当前数据源',
      time: new Date().toLocaleString('zh-CN'),
      isAIGenerated: true,
      sourceRefs: getSourceRefs(),
      content: `<div style="padding: 12px; color:#666;">培训报表 - ${selectedTitle}</div>`
    };

    addRecordWithGenerating(OPERATION_TYPES.TRAINING_DASHBOARD, dashboardRecord, {
      onComplete: () => {
        message.success(`培训报表已生成：${selectedTitle}`);
        // 全屏显示培训报表
        try { window.dispatchEvent(new Event('openTrainingDashboardFullscreen')); } catch {}
      }
    });
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
      isAIGenerated: true,
      content: `<div style="padding: 20px; text-align: center;">
        <h3>📊 培训需求与管理系统整体培训报告</h3>
        <p style="color: #666;">基于${sourceInfo?.total || 1}个数据源生成的综合培训分析报告</p>
        <p style="color: #999; font-size: 14px;">${sourceInfo?.details || '数据源分析'} • ${new Date().toLocaleString('zh-CN')}</p>
      </div>`,
      sourceRefs: getSourceRefs(),
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
        isAIGenerated: true,
        sourceRefs: getSourceRefs(),
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
      const cfg = (() => {
        try { return JSON.parse(localStorage.getItem('learning_plan_config') || '{}'); } catch { return {}; }
      })();
      const minutes = Number(cfg.dailyStudyMinutes) > 0 ? Number(cfg.dailyStudyMinutes) : 60;
      const weekend = !!cfg.weekendStudy;
      const daysPerWeek = weekend ? 7 : 5;
      const weeklyHours = Math.round(((minutes * daysPerWeek) / 60) * 10) / 10;
      const style = cfg.learningStyle || '阅读';
      const slots = Array.isArray(cfg.preferredTimeSlots) ? cfg.preferredTimeSlots : [];
      const habits = [
        `每日学习${minutes}分钟`,
        `偏好时段：${slots.length ? slots.join('、') : '未设置'}`,
        `学习风格：${style}`,
        `休息间隔：${Number(cfg.breakInterval) > 0 ? cfg.breakInterval : 25}分钟`,
        `周末学习：${weekend ? '是' : '否'}`
      ];
      const learningPlanRecord = {
        id: `learning_plan_${Date.now()}`,
        type: OPERATION_TYPES.LEARNING_PLAN,
        title: '智能学习计划',
        source: sourceInfo?.details || '基于当前数据源',
        time: new Date().toLocaleString('zh-CN'),
        isAIGenerated: true,
        sourceRefs: getSourceRefs(),
        content: `<div style="padding: 20px; text-align: center;">
          <h3>🎯 智能学习计划</h3>
          <p style="color: #666;">基于${sourceInfo?.total || 1}个数据源生成的个性化学习计划</p>
          <p style="color: #999; font-size: 14px;">${sourceInfo?.details || '数据源分析'} • ${new Date().toLocaleString('zh-CN')}</p>
        </div>`,
        planData: {
          startDate: new Date().toLocaleDateString('zh-CN'),
          endDate: new Date(Date.now() + 84 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN'),
          analysis: {
            duration: 12,
            weeklyHours
          },
          plan: {
            phases: [
              { name: '基础阶段', content: '核心概念与入门知识', duration: '第1-4周', tasks: [style === '视频' ? '观看课程视频' : (style === '实践' ? '动手实践练习' : (style === '讨论' ? '参与学习讨论' : '阅读学习材料'))] },
              { name: '巩固阶段', content: '练习与应用，巩固所学', duration: '第5-8周', tasks: ['阶段总结与测验', '错题回顾与复盘'] },
              { name: '提升阶段', content: '深化理解，扩展应用', duration: '第9-12周', tasks: ['项目实践', '成果展示'] }
            ]
          },
          habits
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
        isAIGenerated: true,
        sourceRefs: getSourceRefs(),
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
        isAIGenerated: true,
        sourceRefs: getSourceRefs(),
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
        isAIGenerated: true,
        sourceRefs: getSourceRefs(),
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
    } else if (card.key === OPERATION_TYPES.SITE_ANALYSIS) {
      // 现场分析：根据勾选来源生成分析报告（每条记录对应一个督导对象）
      const count = (Array.isArray(selectedMaterials) ? selectedMaterials.length : 0) || (sourceInfo?.total || 0);
      const refs = getSelectedSourceRefs();
      const firstTitle = (refs[0]?.title || '').trim();
      const target = (() => {
        if (!firstTitle) return '';
        const parts = firstTitle.split('｜');
        return parts.length > 1 ? parts[parts.length - 1] : firstTitle;
      })();
      const siteRecord = {
        id: `site_analysis_${Date.now()}`,
        type: OPERATION_TYPES.SITE_ANALYSIS,
        title: `现场分析报告${target ? `｜${target}` : ''}`,
        source: sourceInfo?.details || '基于当前数据源',
        time: new Date().toLocaleString('zh-CN'),
        isAIGenerated: true,
        sourceRefs: refs,
        content: `<div style=\"padding: 16px; font-family: system-ui;\">\n          <h3>📋 现场分析报告${target ? `（督导对象：${target}）` : ''}</h3>\n          <p style=\"color:#374151\">依据 ${count} 项取证数据（文件/文本/链接/视频），对校园安全相关检查项进行聚类与要点提取，形成问题与整改建议。</p>\n          <h4>重点问题</h4>\n          <ul>\n            <li>消防设施台账记录不完整（建议：补齐巡检记录，明确责任人）。</li>\n            <li>食堂留样标签缺少日期（建议：按规范粘贴并留存48小时）。</li>\n            <li>门卫登记缺少访客佩证照片（建议：完善入校流程与留痕）。</li>\n          </ul>\n          <h4>整改建议</h4>\n          <ol>\n            <li>制定每周巡检清单并张贴，检查人签名留档。</li>\n            <li>按批次记录留样标签：时间/责任人/批次。</li>\n            <li>完善访客登记字段：证件号、进出时间、随行照片。</li>\n          </ol>\n          <div style=\"margin-top:8px;color:#6b7280;font-size:12px\">自动生成 · 现场分析</div>\n        </div>`
      };
      addRecordWithGenerating(OPERATION_TYPES.SITE_ANALYSIS, siteRecord, {
        onComplete: () => {
          message.success('现场分析报告已生成，记录已添加。点击查看详情');
        }
      });
    } else if (card.key === 'smart-evaluation') {
      // 智能评阅：生成一条操作记录，点击记录进入三栏评阅视图
      const selectedList = Array.isArray(selectedMaterials) ? selectedMaterials : [];
      if (selectedList.length !== 1) {
        message.warning('智能评阅需基于一个来源，请仅勾选1项');
        return;
      }

      const evalRecord = {
        id: `smart_evaluation_${Date.now()}`,
        type: 'smart-evaluation',
        title: '智能评阅清单',
        source: sourceInfo?.details || '基于当前数据源',
        time: new Date().toLocaleString('zh-CN'),
        isAIGenerated: true,
        // 仅使用点击当下勾选的来源作为快照
        sourceRefs: getSelectedSourceRefs(),
        content: `<div style="padding: 20px; text-align: center;">
          <h3>🤖 智能评阅</h3>
          <p style="color: #666;">系统将根据当前资料生成评阅与提交清单</p>
          <p style="color: #999; font-size: 14px;">${sourceInfo?.details || '数据源分析'} • ${new Date().toLocaleString('zh-CN')}</p>
        </div>`
      };

      addRecordWithGenerating('smart-evaluation', evalRecord, {
        onComplete: () => {
          message.success('智能评阅记录已生成，点击操作记录查看评阅清单');
        }
      });
    } else if (card.key === 'training-report') {
      // 培训报告工具处理
      handleTrainingReportToolAction();
    } else if (card.key === 'training-dashboard') {
      // 培训报表工具处理：生成记录并全屏展示
      handleTrainingDashboardToolAction();
    } else if (card.key === 'e-pbl-planning') {
      // E-PBL教学设计：生成文档型记录
      const designRecord = {
        id: `epbl_design_${Date.now()}`,
        type: 'note',
        subType: 'document',
        title: 'EPBL教学设计',
        source: sourceInfo?.details || '基于当前数据源',
        time: new Date().toLocaleString('zh-CN'),
        sourceRefs: getSourceRefs(),
        isAIGenerated: true,
        content: `<div style="padding: 20px; text-align: center;">
          <h3>📄 EPBL教学设计</h3>
          <p style="color: #666;">基于${sourceInfo?.total || 1}个数据源生成的教学设计文档</p>
          <p style="color: #999; font-size: 14px;">${sourceInfo?.details || '数据源分析'} • ${new Date().toLocaleString('zh-CN')}</p>
        </div>`
      };
      addRecordWithGenerating('note', designRecord, {
        onComplete: () => {
          message.success('EPBL教学设计已生成，记录已添加。点击查看详情');
        }
      });
    } else if (card.key === 'supervision-task') {
      // 督学任务：生成一条操作记录，点击记录进入督学模块的督导任务编辑器（全屏）
      const plan = {
        id: `plan_${Date.now()}`,
        title: '安全专项督导（2025年开学季）',
        description: '围绕消防设施、食堂卫生等安全要点，排查隐患并督促整改',
        type: 'special',
        typeLabel: '专项督导',
        date: new Date().toLocaleDateString('zh-CN'),
        tags: ['安全', '开学季']
      };
      const record = {
        id: `supervision_task_${Date.now()}`,
        type: 'supervision-task',
        title: plan.title,
        source: sourceInfo?.details || '基于当前数据源',
        time: new Date().toLocaleString('zh-CN'),
        isAIGenerated: true,
        sourceRefs: getSourceRefs(),
        content: `<div style="padding: 12px; color:#666;">督学任务：${plan.title}。点击记录进入督学任务编辑器。</div>`,
        supervisionPlan: plan
      };
      addRecordWithGenerating('supervision-task', record, {
        onComplete: () => {
          message.success('督学任务记录已生成，点击操作记录进入编辑页面');
        }
      });
    } else if (card.key === 'supervision-report') {
      // 督学报告：汇总现场分析与执行进展，生成报告型操作记录
      const record = {
        id: `supervision_report_${Date.now()}`,
        type: 'supervision-report',
        title: '督学报告',
        source: sourceInfo?.details || '基于当前数据源',
        time: new Date().toLocaleString('zh-CN'),
        isAIGenerated: true,
        sourceRefs: getSourceRefs(),
        content: `<div style="padding: 20px;">
          <h3>📄 督学报告</h3>
          <p style="color:#666;">自动汇总现场分析与督导执行进展，形成督学阶段性报告。</p>
          <ul style="color:#666;">
            <li>现场分析要点与整改建议</li>
            <li>督导执行进展（完成项/待整改项）</li>
            <li>下一步安排与责任分工</li>
          </ul>
          <p style="color:#999; font-size:12px;">${sourceInfo?.details || '数据源分析'} • ${new Date().toLocaleString('zh-CN')}</p>
        </div>`
      };
      addRecordWithGenerating('supervision-report', record, {
        onComplete: () => {
          message.success('督学报告已生成，记录已添加。点击查看详情');
        }
      });
    } else if (card.key === OPERATION_TYPES.TRAINING_PLAN) {
      // 直接生成培训方案记录，不弹出配置窗口
      const trainingPlanRecord = {
        id: `training_plan_${Date.now()}`,
        type: OPERATION_TYPES.TRAINING_PLAN,
        title: '培训方案',
        source: sourceInfo?.details || '基于当前数据源',
        time: new Date().toLocaleString('zh-CN'),
        isAIGenerated: true,
        sourceRefs: getSourceRefs(),
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
