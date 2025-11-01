import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Card, Typography, Input, Radio, Checkbox, Space, Button, message, 
  Progress, Modal, Upload, Alert, Drawer, Divider, Tag, Tooltip,
  notification, Affix, Slider, Switch, FloatButton
} from 'antd';
import { 
  ClockCircleOutlined, StarOutlined, StarFilled, EditOutlined,
  UploadOutlined, CodeOutlined, ExclamationCircleOutlined,
  EyeInvisibleOutlined, FullscreenOutlined, FullscreenExitOutlined,
  QuestionCircleOutlined, SaveOutlined, SettingOutlined, 
  CustomerServiceOutlined, FontSizeOutlined, EyeOutlined,
  PlusOutlined, MinusOutlined, MenuUnfoldOutlined, ColumnWidthOutlined,
  ProfileOutlined, CheckCircleOutlined, CheckSquareOutlined, FormOutlined, FileTextOutlined
} from '@ant-design/icons';
import { RIGHT_PANEL_VIEWS, VIEW_MODES } from '../constants/noteEditConstants';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// 生成模拟试卷：40题，100分，覆盖多题型
const generateMockExam = (count = 40, totalScore = 100) => {
  const types = ['single_choice', 'multiple_choice', 'true_false', 'fill_blank', 'short_answer', 'essay', 'code'];
  const distribution = [18, 8, 6, 4, 2, 1, 1]; // 合计40
  const questions = [];
  let idx = 0;
  for (let t = 0; t < types.length; t++) {
    const n = distribution[t];
    for (let i = 0; i < n; i++) {
      const qid = `q${idx + 1}`;
      const type = types[t];
      const base = {
        id: qid,
        type,
        title: `模拟题目 ${idx + 1}（${type}）`
      };
      if (type === 'single_choice' || type === 'multiple_choice') {
        base.options = [
          { key: 'A', text: '选项A' },
          { key: 'B', text: '选项B' },
          { key: 'C', text: '选项C' },
          { key: 'D', text: '选项D' }
        ];
      } else if (type === 'fill_blank') {
        base.blanks = 2;
      } else if (type === 'short_answer') {
        base.minWords = 80; base.maxWords = 300;
      } else if (type === 'essay') {
        base.minWords = 300; base.maxWords = 800;
      } else if (type === 'code') {
        base.language = 'javascript';
        base.template = '// 在此编写代码\nfunction solve() {\n  // TODO\n}';
      }
      questions.push(base);
      idx++;
    }
  }
  // 均分分值并四舍五入，最后一题补齐
  const per = Math.round((totalScore / count) * 10) / 10; // 保留1位小数
  let assigned = 0;
  questions.forEach((q, i) => {
    if (i < count - 1) {
      q.score = per;
      assigned += per;
    } else {
      q.score = Math.round((totalScore - assigned) * 10) / 10;
    }
  });
  return {
    id: 'exam_mock_40_100',
    title: '模拟试卷（40题，满分100分）',
    duration: 120,
    totalQuestions: count,
    questions
  };
};

const mockExamData = generateMockExam(40, 100);

const ExamForm = ({ state }) => {
  const [paper, setPaper] = useState(mockExamData);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(7200); // 120分钟 = 7200秒
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [markedQuestions, setMarkedQuestions] = useState(new Set());
  const [showNavigation, setShowNavigation] = useState(false);
  const [showDraftPaper, setShowDraftPaper] = useState(false);
  const [draftContent, setDraftContent] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState('已保存');
  const [warningCount, setWarningCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toolsCollapsed, setToolsCollapsed] = useState(false); // 右侧工具面板收起状态
  const [wholePaperMode, setWholePaperMode] = useState(true); // 整卷显示模式默认开启
  
  // 防作弊相关状态
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const [showAntiCheatWarning, setShowAntiCheatWarning] = useState(false);

  // 辅助功能状态
  const [fontSize, setFontSize] = useState(16); // 字体大小
  const [isHighContrast, setIsHighContrast] = useState(false); // 高对比度模式
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false); // 辅助功能面板
  const [showHelpCenter, setShowHelpCenter] = useState(false); // 帮助中心
  
  const timerRef = useRef(null);
  const autoSaveRef = useRef(null);
  const examContainerRef = useRef(null);
  const navPanelRef = useRef(null);
  const [navColumns, setNavColumns] = useState(4);

  // 初始化考试数据
  useEffect(() => {
    try {
      const raw = localStorage.getItem('current_exam_file');
      if (raw) {
        const fileData = JSON.parse(raw);
        if (fileData && Array.isArray(fileData.questions) && fileData.questions.length > 0) {
          setPaper(fileData);
        } else {
          setPaper({ ...mockExamData, title: fileData?.name || fileData?.title || mockExamData.title });
        }
      } else {
        setPaper(mockExamData);
      }
      
      // 恢复答题状态
      const savedAnswers = localStorage.getItem('exam_answers');
      const savedTime = localStorage.getItem('exam_time_left');
      const savedMarked = localStorage.getItem('exam_marked');
      const savedDraft = localStorage.getItem('exam_draft');
      
      if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
      if (savedTime) setTimeLeft(parseInt(savedTime));
      if (savedMarked) setMarkedQuestions(new Set(JSON.parse(savedMarked)));
      if (savedDraft) setDraftContent(savedDraft);

      // 初始化辅助功能设置
      const savedFontSize = localStorage.getItem('examFontSize');
      if (savedFontSize) {
        setFontSize(parseInt(savedFontSize));
      }
      
      const savedHighContrast = localStorage.getItem('examHighContrast');
      if (savedHighContrast) {
        setIsHighContrast(savedHighContrast === 'true');
      }

      // 考试进行中不显示设备提示气泡，避免干扰
    } catch (error) {
      console.error('恢复考试状态失败:', error);
    }
  }, []);

  // 时间管理
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        
        // 时间预警
        if (newTime === 600) { // 10分钟
          notification.warning({
            message: '时间提醒',
            description: '考试剩余时间：10分钟，请注意时间安排！',
            duration: 5
          });
        } else if (newTime === 300) { // 5分钟
          notification.error({
            message: '紧急提醒',
            description: '考试剩余时间：5分钟，请尽快完成答题！',
            duration: 0
          });
        }
        
        // 超时自动提交
        if (newTime <= 0) {
          handleAutoSubmit();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 自动保存
  useEffect(() => {
    setAutoSaveStatus('保存中...');
    
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    
    autoSaveRef.current = setTimeout(() => {
      try {
        localStorage.setItem('exam_answers', JSON.stringify(answers));
        localStorage.setItem('exam_time_left', timeLeft.toString());
        localStorage.setItem('exam_marked', JSON.stringify([...markedQuestions]));
        localStorage.setItem('exam_draft', draftContent);
        setAutoSaveStatus('已保存');
      } catch (error) {
        setAutoSaveStatus('保存失败');
        console.error('自动保存失败:', error);
      }
    }, 2000);

    return () => {
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    };
  }, [answers, timeLeft, markedQuestions, draftContent]);

  // 防作弊监控
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarningCount(prev => {
          const newCount = prev + 1;
          notification.warning({
            message: '切屏警告',
            description: `检测到切换窗口行为，警告次数：${newCount}/3`,
            duration: 3
          });
          
          if (newCount >= 3) {
            Modal.confirm({
              title: '违规操作检测',
              content: '检测到多次切屏行为，系统将自动提交试卷。',
              okText: '确认提交',
              cancelText: '继续考试',
              onOk: handleAutoSubmit
            });
          }
          
          return newCount;
        });
      }
    };

    const handleKeyDown = (e) => {
      // 字体大小调整快捷键
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          handleFontSizeChange(Math.min(24, fontSize + 2));
          return;
        } else if (e.key === '-') {
          e.preventDefault();
          handleFontSizeChange(Math.max(12, fontSize - 2));
          return;
        }
      }
      
      // F11 全屏切换
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
        return;
      }
      
      // Tab 键题目导航
      if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey) {
        e.preventDefault();
        const total = Array.isArray(paper?.questions) ? paper.questions.length : mockExamData.questions.length;
        const nextIndex = (currentQuestion + 1) % total;
        setCurrentQuestion(nextIndex);
        return;
      }
      
      // Shift+Tab 反向导航
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        const total = Array.isArray(paper?.questions) ? paper.questions.length : mockExamData.questions.length;
        const prevIndex = currentQuestion === 0 ? total - 1 : currentQuestion - 1;
        setCurrentQuestion(prevIndex);
        return;
      }
      
      // 禁用常见作弊快捷键
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'a')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I')
      ) {
        e.preventDefault();
        message.warning('考试期间禁用此操作');
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      message.warning('考试期间禁用右键菜单');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // 全屏控制
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      if (examContainerRef.current?.requestFullscreen) {
        examContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, [isFullscreen]);

  // 格式化时间显示
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 答案处理
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // 题目标记
  const toggleQuestionMark = (questionId) => {
    setMarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // 导航跳转
  const jumpToQuestion = (index) => {
    setCurrentQuestion(index);
    setShowNavigation(false);
    // 整卷模式：滚动到对应题目卡片
    if (wholePaperMode) {
      try {
        const el = document.getElementById(`q-${index}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (e) {}
    }
  };

  // 获取题目状态
  const getQuestionStatus = (question) => {
    const hasAnswer = answers[question.id] !== undefined && answers[question.id] !== '';
    const isMarked = markedQuestions.has(question.id);
    
    if (isMarked) return 'marked';
    if (hasAnswer) return 'answered';
    return 'unanswered';
  };

  // 计算进度（容错：无题目时回退到示例题目）
  const getProgress = () => {
    const qList = Array.isArray(paper?.questions) ? paper.questions : mockExamData.questions;
    const answeredCount = qList.filter(q => (
      answers[q.id] !== undefined && answers[q.id] !== ''
    )).length;
    return qList.length > 0 ? Math.round((answeredCount / qList.length) * 100) : 0;
  };

  // 显示标题：去掉文件扩展名（如 .pdf）
  const getDisplayTitle = (t) => {
    const s = String(t || '').trim();
    return s.replace(/\.(pdf|PDF)$/,'');
  };

  // 题型中文标签
  const getTypeLabel = (t) => {
    switch (t) {
      case 'single_choice': return '单选';
      case 'multiple_choice': return '多选';
      case 'true_false': return '判断';
      case 'fill_blank': return '填空';
      case 'short_answer': return '简答';
      case 'essay': return '论述';
      case 'code': return '编程';
      default: return '题目';
    }
  };

  // 题型图标
  const getTypeIcon = (t) => {
    const style = { fontSize: 12, color: '#999' };
    switch (t) {
      case 'single_choice': return <CheckCircleOutlined style={style} />;
      case 'multiple_choice': return <CheckSquareOutlined style={style} />;
      case 'true_false': return <ExclamationCircleOutlined style={style} />;
      case 'fill_blank': return <FormOutlined style={style} />;
      case 'short_answer': return <FileTextOutlined style={style} />;
      case 'essay': return <EditOutlined style={style} />;
      case 'code': return <CodeOutlined style={style} />;
      default: return <QuestionCircleOutlined style={style} />;
    }
  };

  // 自适应导航列数：基于面板宽度估算（目标卡宽约72px）
  useEffect(() => {
    const el = navPanelRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width || el.clientWidth || 240;
        const cols = Math.max(3, Math.min(6, Math.floor(w / 72)));
        setNavColumns(cols);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 辅助功能处理函数
  const handleFontSizeChange = (value) => {
    setFontSize(value);
    localStorage.setItem('examFontSize', value);
  };

  const handleHighContrastToggle = (checked) => {
    setIsHighContrast(checked);
    localStorage.setItem('examHighContrast', checked);
  };

  // 帮助中心功能
  const helpCenterItems = [
    {
      title: '考试操作指南',
      content: '1. 点击题目序号可快速跳转\n2. 使用标记功能标记重要题目\n3. 答案会自动保存，无需担心丢失'
    },
    {
      title: '技术支持',
      content: '如遇到技术问题，请联系：\n电话：400-123-4567\n邮箱：support@exam.com'
    },
    {
      title: '考试规则',
      content: '1. 考试期间请保持全屏状态\n2. 禁止切换到其他应用程序\n3. 时间结束后将自动提交'
    }
  ];

  // 自动提交
  const handleAutoSubmit = () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    const record = {
      id: Date.now(),
      type: 'exam',
      title: `考试提交：${paper?.title || '试卷'}`,
      source: '组织培训 · 考试',
      time: new Date().toLocaleString('zh-CN'),
      content: `<div style="padding:16px;">\n<h3>🎓 考试提交</h3>\n<p style="color:#666;">试卷：${paper?.title || ''}</p>\n<p style="color:#999;font-size:12px;">${new Date().toLocaleString('zh-CN')}</p>\n<p style="color:#f5222d;">自动提交（时间到）</p>\n</div>`,
      examRef: paper || null,
      answers,
      submitType: 'auto',
      timeUsed: paper.duration * 60 - timeLeft
    };

    state.setOperationRecords(prev => ({
      ...prev,
      exam: [record, ...((prev && prev.exam) ? prev.exam : [])]
    }));

    // 清除本地存储
    localStorage.removeItem('exam_answers');
    localStorage.removeItem('exam_time_left');
    localStorage.removeItem('exam_marked');
    localStorage.removeItem('exam_draft');

    message.success('考试已自动提交');
    state.setRightPanelView && state.setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
    state.setCurrentView && state.setCurrentView(VIEW_MODES.MATERIALS);
  };

  // 手动提交
  const handleSubmit = () => {
    const qList = Array.isArray(paper?.questions) ? paper.questions : mockExamData.questions;
    const unansweredCount = qList.filter(q => (
      !answers[q.id] || answers[q.id] === ''
    )).length;

    if (unansweredCount > 0) {
      Modal.confirm({
        title: '确认提交',
        content: `还有 ${unansweredCount} 道题未作答，确定要提交吗？`,
        okText: '确认提交',
        cancelText: '继续答题',
        onOk: () => doSubmit()
      });
    } else {
      Modal.confirm({
        title: '确认提交',
        content: '确定要提交试卷吗？提交后将无法修改。',
        okText: '确认提交',
        cancelText: '再检查一下',
        onOk: () => doSubmit()
      });
    }
  };

  const doSubmit = () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    const record = {
      id: Date.now(),
      type: 'exam',
      title: `考试提交：${paper?.title || '试卷'}`,
      source: '组织培训 · 考试',
      time: new Date().toLocaleString('zh-CN'),
      content: `<div style="padding:16px;">\n<h3>🎓 考试提交</h3>\n<p style="color:#666;">试卷：${paper?.title || ''}</p>\n<p style="color:#999;font-size:12px;">${new Date().toLocaleString('zh-CN')}</p>\n<p style="color:#52c41a;">正常提交</p>\n</div>`,
      examRef: paper || null,
      answers,
      submitType: 'manual',
      timeUsed: paper.duration * 60 - timeLeft
    };

    state.setOperationRecords(prev => ({
      ...prev,
      exam: [record, ...((prev && prev.exam) ? prev.exam : [])]
    }));

    // 清除本地存储
    localStorage.removeItem('exam_answers');
    localStorage.removeItem('exam_time_left');
    localStorage.removeItem('exam_marked');
    localStorage.removeItem('exam_draft');

    message.success('考试已提交');
    state.setRightPanelView && state.setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
    state.setCurrentView && state.setCurrentView(VIEW_MODES.MATERIALS);
  };

  // 取消考试
  const handleCancel = () => {
    Modal.confirm({
      title: '确认退出',
      content: '退出考试将丢失当前答题进度，确定要退出吗？',
      okText: '确认退出',
      cancelText: '继续考试',
      onOk: () => {
        // 清除本地存储
        localStorage.removeItem('exam_answers');
        localStorage.removeItem('exam_time_left');
        localStorage.removeItem('exam_marked');
        localStorage.removeItem('exam_draft');
        // 返回三栏页面
        state.setRightPanelView && state.setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
        state.setCurrentView && state.setCurrentView(VIEW_MODES.MATERIALS);
      }
    });
  };

  // 渲染题目内容
  const renderQuestion = (question) => {
    const answer = answers[question.id];

    switch (question.type) {
      case 'single_choice':
        return (
          <div>
            <Paragraph>{question.title}</Paragraph>
            <Radio.Group 
              value={answer} 
              onChange={e => handleAnswerChange(question.id, e.target.value)}
            >
              <Space direction="vertical">
                {question.options.map(option => (
                  <Radio key={option.key} value={option.key}>
                    {option.key}. {option.text}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
        );

      case 'multiple_choice':
        return (
          <div>
            <Paragraph>{question.title}</Paragraph>
            <Checkbox.Group 
              value={answer || []} 
              onChange={value => handleAnswerChange(question.id, value)}
            >
              <Space direction="vertical">
                {question.options.map(option => (
                  <Checkbox key={option.key} value={option.key}>
                    {option.key}. {option.text}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </div>
        );

      case 'true_false':
        return (
          <div>
            <Paragraph>{question.title}</Paragraph>
            <Radio.Group 
              value={answer} 
              onChange={e => handleAnswerChange(question.id, e.target.value)}
            >
              <Space>
                <Radio value="true">对</Radio>
                <Radio value="false">错</Radio>
              </Space>
            </Radio.Group>
          </div>
        );

      case 'fill_blank':
        return (
          <div>
            <Paragraph>{question.title}</Paragraph>
            <Space direction="vertical" style={{ width: '100%' }}>
              {Array.from({ length: question.blanks }, (_, index) => (
                <Input
                  key={index}
                  placeholder={`填空 ${index + 1}`}
                  value={answer?.[index] || ''}
                  onChange={e => {
                    const newAnswer = [...(answer || [])];
                    newAnswer[index] = e.target.value;
                    handleAnswerChange(question.id, newAnswer);
                  }}
                />
              ))}
            </Space>
          </div>
        );

      case 'short_answer':
        return (
          <div>
            <Paragraph>{question.title}</Paragraph>
            <TextArea
              rows={6}
              value={answer || ''}
              onChange={e => handleAnswerChange(question.id, e.target.value)}
              placeholder="请在此作答"
              showCount
              maxLength={question.maxWords}
            />
            {question.minWords && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                最少 {question.minWords} 字，最多 {question.maxWords} 字
              </Text>
            )}
          </div>
        );

      case 'essay':
        return (
          <div>
            <Paragraph>{question.title}</Paragraph>
            <TextArea
              rows={12}
              value={answer || ''}
              onChange={e => handleAnswerChange(question.id, e.target.value)}
              placeholder="请在此作答"
              showCount
              maxLength={question.maxWords}
            />
            {question.minWords && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                最少 {question.minWords} 字，最多 {question.maxWords} 字
              </Text>
            )}
          </div>
        );

      case 'code':
        return (
          <div>
            <Paragraph>{question.title}</Paragraph>
            <TextArea
              rows={15}
              value={answer || question.template || ''}
              onChange={e => handleAnswerChange(question.id, e.target.value)}
              placeholder="请在此编写代码"
              style={{ fontFamily: 'Monaco, Consolas, monospace' }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="blue">语言：{question.language}</Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>
                支持语法高亮和基本代码检查
              </Text>
            </div>
          </div>
        );

      default:
        return <div>未知题型</div>;
    }
  };

  if (!paper) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <Text>加载考试数据中...</Text>
      </div>
    );
  }

  // 安全的题目列表引用，避免空对象导致渲染报错
  const questions = Array.isArray(paper?.questions) ? paper.questions : mockExamData.questions;
  const currentQ = questions[currentQuestion] || questions[0];
  const progress = getProgress();

  // 响应式样式（答题区与工具区 7:3）
  const getResponsiveStyles = () => {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    // 严格 7:3（桌面端），移动端改为纵向堆叠
    const leftFlex = isMobile ? 1 : 7;
    const rightFlex = isMobile ? '1 1 auto' : (toolsCollapsed ? '0 0 52px' : 3);
    
    return {
      container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isHighContrast ? '#000000' : '#f5f5f5',
        color: isHighContrast ? '#ffffff' : 'inherit',
        fontSize: `${fontSize}px`,
        transition: 'all 0.3s ease',
        padding: isMobile ? '8px' : '16px'
      },
      mainContent: {
        display: 'flex',
        flex: 1,
        gap: isMobile ? '8px' : '16px',
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: 0, // 允许子项滚动
        alignItems: 'stretch',
        overflow: 'hidden'
      },
      navigationPanel: {
        width: isMobile ? '100%' : isTablet ? '200px' : '250px',
        minWidth: isMobile ? 'auto' : '200px',
        order: isMobile ? 2 : 1,
        overflowY: 'auto'
      },
      questionPanel: {
        flex: leftFlex,
        order: isMobile ? 1 : 2,
        minHeight: 0,
        height: '100%',
        overflowY: 'auto'
      },
      toolsPanel: {
        order: isMobile ? 3 : 3,
        flex: rightFlex,
        background: '#fff',
        borderRadius: 8,
        overflowY: 'auto',
        minHeight: 0,
        height: '100%',
        transition: 'all 0.3s ease'
      }
    };
  };

  const styles = getResponsiveStyles();

  return (
    <div ref={examContainerRef} style={styles.container}>
      {/* 顶部工具栏 */}
      <Affix offsetTop={0}>
        <Card size="small" style={{ marginBottom: 8 }} bodyStyle={{ padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Title level={5} style={{ margin: 0 }}>
                🎓 {getDisplayTitle(paper?.title || mockExamData.title)}
              </Title>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ClockCircleOutlined style={{ color: timeLeft < 600 ? '#ff4d4f' : '#1890ff' }} />
                <Text strong style={{ color: timeLeft < 600 ? '#ff4d4f' : '#1890ff' }}>
                  {formatTime(timeLeft)}
                </Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text type="secondary">进度：</Text>
                <Progress 
                  percent={progress} 
                  size="small" 
                  style={{ width: 100 }} 
                  strokeColor={progress === 100 ? '#52c41a' : '#1890ff'}
                />
                <Text type="secondary">{progress}%</Text>
              </div>
              <Tag color="blue">{autoSaveStatus}</Tag>
            </div>
            
            <Space>
              
              <Tooltip title={isFullscreen ? "退出全屏" : "进入全屏"}>
                <Button 
                  icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                  onClick={toggleFullscreen}
                />
              </Tooltip>
              <Tooltip title={wholePaperMode ? '切换到单题模式' : '整张试卷显示'}>
                <Button 
                  icon={<ProfileOutlined />}
                  onClick={() => setWholePaperMode(!wholePaperMode)}
                >
                  {wholePaperMode ? '单题' : '整卷'}
                </Button>
              </Tooltip>
              <Button onClick={handleCancel}>退出</Button>
              <Button type="primary" onClick={handleSubmit} loading={isSubmitting}>
                提交试卷
              </Button>
            </Space>
          </div>
        </Card>
      </Affix>

      {/* 主要内容区域 */}
      <div style={styles.mainContent}>
        {/* 左侧导航栏 */}
        <div style={styles.navigationPanel} ref={navPanelRef}>
          <Card size="small" title="题目导航" style={{ height: '100%' }}>
            {/* 导航题卡 */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${navColumns}, 1fr)`, gap: 4 }}>
              {questions.map((q, index) => {
                const status = getQuestionStatus(q);
                const isCurrent = index === currentQuestion;
                
                return (
                  <Button
                    key={q.id}
                    size="small"
                    type={isCurrent ? 'primary' : 'default'}
                    style={{
                      backgroundColor: 
                        status === 'answered' ? '#f6ffed' :
                        status === 'marked' ? '#fff7e6' : 
                        isCurrent ? '#1890ff' : '#fafafa',
                      borderColor:
                        status === 'answered' ? '#b7eb8f' :
                        status === 'marked' ? '#ffd591' :
                        isCurrent ? '#1890ff' : '#d9d9d9',
                      color:
                        status === 'answered' ? '#52c41a' :
                        status === 'marked' ? '#fa8c16' :
                        isCurrent ? '#fff' : '#666',
                      height: 56,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'center'
                    }}
                    onClick={() => jumpToQuestion(index)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ fontWeight: 600 }}>{index + 1}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {markedQuestions.has(q.id) && <StarFilled style={{ fontSize: 10 }} />}
                        {getTypeIcon(q.type)}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, opacity: 0.9 }}>
                      {q.score}分
                    </div>
                  </Button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* 中部答题区域（7） */}
        <div style={styles.questionPanel}>
          {wholePaperMode ? (
            <div>
              <Card size="small" title="整张试卷">
                <Text type="secondary">共 {questions.length} 题 · 满分 {questions.reduce((s, q) => s + (q.score || 0), 0)} 分</Text>
              </Card>
              {questions.map((q, index) => (
                <Card 
                  key={q.id}
                  id={`q-${index}`}
                  size="small"
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>第 {index + 1} 题 ({q.score} 分)</span>
                      <Space>
                        <Button
                          size="small"
                          icon={markedQuestions.has(q.id) ? <StarFilled /> : <StarOutlined />}
                          onClick={() => toggleQuestionMark(q.id)}
                          type={markedQuestions.has(q.id) ? 'primary' : 'default'}
                        >
                          {markedQuestions.has(q.id) ? '已标记' : '标记'}
                        </Button>
                      </Space>
                    </div>
                  }
                  style={{ marginBottom: 16 }}
                >
                  {renderQuestion(q)}
                </Card>
              ))}
              <div style={{ textAlign: 'right' }}>
                <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>回到顶部</Button>
              </div>
            </div>
          ) : (
            <>
              <Card 
                size="small" 
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>第 {currentQuestion + 1} 题 ({currentQ.score} 分)</span>
                    <Space>
                      <Button
                        size="small"
                        icon={markedQuestions.has(currentQ.id) ? <StarFilled /> : <StarOutlined />}
                        onClick={() => toggleQuestionMark(currentQ.id)}
                        type={markedQuestions.has(currentQ.id) ? 'primary' : 'default'}
                      >
                        {markedQuestions.has(currentQ.id) ? '已标记' : '标记'}
                      </Button>
                    </Space>
                  </div>
                }
                style={{ marginBottom: 16 }}
              >
                {renderQuestion(currentQ)}
              </Card>

              {/* 导航按钮 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                <Button 
                  disabled={currentQuestion === 0}
                  onClick={() => setCurrentQuestion(prev => prev - 1)}
                >
                  上一题
                </Button>
                
                <Space>
                  <Text type="secondary">
                    {currentQuestion + 1} / {questions.length}
                  </Text>
                </Space>
                
                <Button 
                  disabled={currentQuestion === questions.length - 1}
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                >
                  下一题
                </Button>
              </div>
            </>
          )}
        </div>

        {/* 右侧工具面板（3） 可收起/展开 */}
        <div style={styles.toolsPanel}>
          {!toolsCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottom: '1px solid #f0f0f0' }}>
              <Space>
                <Typography.Text strong>草稿纸 · 辅助功能</Typography.Text>
              </Space>
              <Tooltip title="收起">
                <Button
                  type="text"
                  icon={<ColumnWidthOutlined />}
                  onClick={() => setToolsCollapsed(true)}
                />
              </Tooltip>
            </div>
          )}

          {/* 收起后仅显示窄侧栏 */}
          {toolsCollapsed ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8 }}>
              <Tooltip title="展开">
                <Button type="text" icon={<MenuUnfoldOutlined />} onClick={() => setToolsCollapsed(false)} />
              </Tooltip>
            </div>
          ) : (
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* 草稿纸 */}
              <Card size="small" title="虚拟草稿纸">
                <Input.TextArea
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  placeholder="在这里记录您的计算过程和思路..."
                  rows={10}
                  style={{ resize: 'none' }}
                />
                <div style={{ marginTop: 8, textAlign: 'right' }}>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />}
                    onClick={() => {
                      try {
                        localStorage.setItem(`examDraft_${paper?.id || 'mock'}`, draftContent);
                        message.success('草稿已保存');
                      } catch (e) {}
                    }}
                  >
                    保存草稿
                  </Button>
                </div>
              </Card>

              {/* 辅助功能 */}
              <Card size="small" title="辅助功能">
                <div style={{ marginBottom: 24 }}>
                  <Typography.Title level={5} style={{ marginTop: 0 }}>
                    <FontSizeOutlined /> 字体大小调整
                  </Typography.Title>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Button 
                      icon={<MinusOutlined />} 
                      size="small"
                      onClick={() => handleFontSizeChange(Math.max(12, fontSize - 2))}
                      disabled={fontSize <= 12}
                    />
                    <Slider
                      min={12}
                      max={24}
                      value={fontSize}
                      onChange={handleFontSizeChange}
                      style={{ flex: 1 }}
                      marks={{
                        12: '小',
                        16: '中',
                        20: '大',
                        24: '特大'
                      }}
                    />
                    <Button 
                      icon={<PlusOutlined />} 
                      size="small"
                      onClick={() => handleFontSizeChange(Math.min(24, fontSize + 2))}
                      disabled={fontSize >= 24}
                    />
                  </div>
                  <Typography.Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                    当前字体大小：{fontSize}px
                  </Typography.Text>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <Typography.Title level={5} style={{ marginTop: 0 }}>
                    <EyeOutlined /> 高对比度模式
                  </Typography.Title>
                  <Switch
                    checked={isHighContrast}
                    onChange={handleHighContrastToggle}
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                  />
                  <div style={{ marginTop: 8 }}>
                    <Typography.Text type="secondary">
                      适合视力不佳的用户，提供更清晰的视觉对比
                    </Typography.Text>
                  </div>
                </div>

              </Card>

              {/* 说明模块：答题卡说明在上，快捷键说明在下 */}
              <Card size="small" title="说明">
                <div>
                  <Typography.Title level={5} style={{ marginTop: 0 }}>
                    答题卡说明
                  </Typography.Title>
                  <div style={{ fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ width: 14, height: 14, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', marginRight: 8, borderRadius: 2 }}></div>
                      <Text type="secondary">已答题</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ width: 14, height: 14, backgroundColor: '#fff7e6', border: '1px solid #ffd591', marginRight: 8, borderRadius: 2 }}></div>
                      <Text type="secondary">已标记</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: 14, height: 14, backgroundColor: '#fafafa', border: '1px solid #d9d9d9', marginRight: 8, borderRadius: 2 }}></div>
                      <Text type="secondary">未作答</Text>
                    </div>
                  </div>
                </div>

                <Divider style={{ margin: '12px 0' }} />
                <div>
                  <Typography.Title level={5} style={{ marginTop: 0 }}>
                    快捷键说明
                  </Typography.Title>
                  <ul style={{ paddingLeft: 20 }}>
                    <li>Ctrl + 加号 (=)：增大字体</li>
                    <li>Ctrl + 减号 (-)：减小字体</li>
                    <li>F11：切换全屏模式</li>
                    <li>Tab：跳转到下一题</li>
                    <li>Shift + Tab：跳转到上一题</li>
                    <li>Ctrl + S：保存草稿（已自动保存）</li>
                  </ul>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* 草稿纸抽屉 */}
      <Drawer
        title="虚拟草稿纸"
        placement="right"
        width={400}
        open={showDraftPaper}
        onClose={() => setShowDraftPaper(false)}
        extra={
          <Button 
            icon={<SaveOutlined />} 
            size="small"
            onClick={() => message.success('草稿已保存')}
          >
            保存
          </Button>
        }
      >
        <TextArea
          rows={20}
          value={draftContent}
          onChange={e => setDraftContent(e.target.value)}
          placeholder="在此记录计算过程、思路等..."
          style={{ resize: 'none' }}
        />
      </Drawer>

      {/* 辅助功能面板 */}
      <Modal
        title="辅助功能设置"
        open={showAccessibilityPanel}
        onCancel={() => setShowAccessibilityPanel(false)}
        footer={null}
        width={500}
      >
        <div style={{ padding: '20px 0' }}>
          <div style={{ marginBottom: 24 }}>
            <Typography.Title level={5}>
              <FontSizeOutlined /> 字体大小调整
            </Typography.Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Button 
                icon={<MinusOutlined />} 
                onClick={() => handleFontSizeChange(Math.max(12, fontSize - 2))}
                disabled={fontSize <= 12}
              />
              <Slider
                min={12}
                max={24}
                value={fontSize}
                onChange={handleFontSizeChange}
                style={{ flex: 1 }}
                marks={{
                  12: '小',
                  16: '中',
                  20: '大',
                  24: '特大'
                }}
              />
              <Button 
                icon={<PlusOutlined />} 
                onClick={() => handleFontSizeChange(Math.min(24, fontSize + 2))}
                disabled={fontSize >= 24}
              />
            </div>
            <Typography.Text type="secondary">
              当前字体大小：{fontSize}px
            </Typography.Text>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Typography.Title level={5}>
              <EyeOutlined /> 高对比度模式
            </Typography.Title>
            <Switch
              checked={isHighContrast}
              onChange={handleHighContrastToggle}
              checkedChildren="开启"
              unCheckedChildren="关闭"
            />
            <div style={{ marginTop: 8 }}>
              <Typography.Text type="secondary">
                适合视力不佳的用户，提供更清晰的视觉对比
              </Typography.Text>
            </div>
          </div>

          <div>
            <Typography.Title level={5}>快捷键说明</Typography.Title>
            <ul style={{ paddingLeft: 20 }}>
              <li>Ctrl + 加号 (=)：增大字体</li>
              <li>Ctrl + 减号 (-)：减小字体</li>
              <li>F11：切换全屏模式</li>
              <li>Tab：跳转到下一题</li>
              <li>Shift + Tab：跳转到上一题</li>
              <li>Ctrl + S：保存草稿（已自动保存）</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* 帮助中心 */}
      <Modal
        title="帮助中心"
        open={showHelpCenter}
        onCancel={() => setShowHelpCenter(false)}
        footer={null}
        width={600}
      >
        <div style={{ padding: '20px 0' }}>
          {helpCenterItems.map((item, index) => (
            <Card key={index} style={{ marginBottom: 16 }}>
              <Typography.Title level={5}>{item.title}</Typography.Title>
              <Typography.Paragraph style={{ whiteSpace: 'pre-line' }}>
                {item.content}
              </Typography.Paragraph>
            </Card>
          ))}
          
          <Alert
            message="紧急联系方式"
            description="如遇紧急技术问题无法继续考试，请立即联系监考老师或拨打技术支持热线：400-123-4567"
            type="warning"
            showIcon
          />
        </div>
      </Modal>

      {/* 悬浮帮助按钮：考试进行中隐藏以避免干扰 */}

      {/* 题目导航模态框 */}
      <Modal
        title="题目导航"
        open={showNavigation}
        onCancel={() => setShowNavigation(false)}
        footer={null}
        width={600}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
          {questions.map((q, index) => {
            const status = getQuestionStatus(q);
            const isCurrent = index === currentQuestion;
            
            return (
              <Button
                key={q.id}
                type={isCurrent ? 'primary' : 'default'}
                style={{
                  height: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  backgroundColor: 
                    status === 'answered' ? '#f6ffed' :
                    status === 'marked' ? '#fff7e6' : 
                    isCurrent ? '#1890ff' : '#fafafa',
                  borderColor:
                    status === 'answered' ? '#b7eb8f' :
                    status === 'marked' ? '#ffd591' :
                    isCurrent ? '#1890ff' : '#d9d9d9'
                }}
                onClick={() => jumpToQuestion(index)}
              >
                <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                  {index + 1}
                </div>
                <div style={{ fontSize: 10 }}>
                  {q.score}分
                </div>
                {markedQuestions.has(q.id) && (
                  <StarFilled style={{ fontSize: 10, color: '#fa8c16' }} />
                )}
              </Button>
            );
          })}
        </div>
        
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Space>
            <Text>已答：{questions.filter(q => getQuestionStatus(q) === 'answered').length}</Text>
            <Text>已标记：{markedQuestions.size}</Text>
            <Text>未答：{questions.filter(q => getQuestionStatus(q) === 'unanswered').length}</Text>
          </Space>
        </div>
      </Modal>

      {/* 警告提示 */}
      {warningCount > 0 && (
        <Alert
          message={`切屏警告：${warningCount}/3 次`}
          description="多次切屏将导致自动提交试卷"
          type="warning"
          showIcon
          style={{ position: 'fixed', top: 80, right: 20, zIndex: 1000 }}
        />
      )}
    </div>
  );
};

export default ExamForm;