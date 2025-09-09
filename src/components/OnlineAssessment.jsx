import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Steps,
  Form,
  Radio,
  Checkbox,
  Input,
  Progress,
  Modal,
  Result,
  Space,
  Typography,
  Row,
  Col,
  Tag,
  Alert,
  Divider,
  Statistic,
  List,
  Avatar
} from 'antd';
import {
  PlayCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  BarChartOutlined,
  EditOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Step } = Steps;

const OnlineAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [form] = Form.useForm();

  // 测评模板数据
  const assessmentTemplates = [
    {
      id: 1,
      title: '数字素养基础测评',
      description: '评估基本的数字技能和素养水平',
      duration: 30,
      questionCount: 20,
      difficulty: 'easy',
      categories: ['数字素养', '信息处理'],
      participants: 1250,
      averageScore: 78.5,
      icon: '📱',
      color: '#1890ff'
    },
    {
      id: 2,
      title: '信息安全能力测评',
      description: '测试网络安全意识和防护能力',
      duration: 45,
      questionCount: 30,
      difficulty: 'medium',
      categories: ['数字安全', '网络防护'],
      participants: 890,
      averageScore: 72.3,
      icon: '🔒',
      color: '#52c41a'
    },
    {
      id: 3,
      title: '数字创作综合测评',
      description: '评估数字内容创作和编辑能力',
      duration: 60,
      questionCount: 25,
      difficulty: 'hard',
      categories: ['数字创作', '多媒体处理'],
      participants: 567,
      averageScore: 65.8,
      icon: '🎨',
      color: '#722ed1'
    },
    {
      id: 4,
      title: '数字沟通协作测评',
      description: '测试在线协作和数字化沟通技能',
      duration: 40,
      questionCount: 22,
      difficulty: 'medium',
      categories: ['数字沟通', '在线协作'],
      participants: 734,
      averageScore: 81.2,
      icon: '💬',
      color: '#fa8c16'
    }
  ];

  // 示例题目数据
  const sampleQuestions = [
    {
      id: 1,
      type: 'single',
      title: '以下哪个是最安全的密码设置方式？',
      options: [
        '使用生日作为密码',
        '使用复杂的字母数字组合',
        '使用简单易记的单词',
        '使用手机号码'
      ],
      correctAnswer: 1,
      explanation: '复杂的字母数字组合能够提供更好的安全性'
    },
    {
      id: 2,
      type: 'multiple',
      title: '以下哪些是有效的数据备份方式？',
      options: [
        '云存储备份',
        '外部硬盘备份',
        '只保存在本地',
        '定期备份重要文件'
      ],
      correctAnswer: [0, 1, 3],
      explanation: '多种备份方式结合使用能够确保数据安全'
    },
    {
      id: 3,
      type: 'judge',
      title: '在公共WiFi环境下进行网上银行操作是安全的。',
      correctAnswer: false,
      explanation: '公共WiFi存在安全风险，不建议进行敏感操作'
    },
    {
      id: 4,
      type: 'fill',
      title: '请填写：常见的图片格式包括JPEG、PNG和____。',
      correctAnswer: 'GIF',
      explanation: 'GIF是常见的图片格式之一，支持动画效果'
    }
  ];

  // 计时器
  useEffect(() => {
    let timer;
    if (isAssessing && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isAssessing, timeLeft]);

  // 格式化时间显示
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 开始测评
  const handleStartAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setCurrentStep(1);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(assessment.duration * 60);
    setIsAssessing(true);
    setAssessmentResult(null);
  };

  // 回答问题
  const handleAnswerQuestion = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // 下一题
  const handleNextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmitAssessment();
    }
  };

  // 上一题
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // 提交测评
  const handleSubmitAssessment = () => {
    setIsAssessing(false);
    
    // 计算得分
    let correctCount = 0;
    let totalQuestions = sampleQuestions.length;
    
    sampleQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      if (question.type === 'single' || question.type === 'judge') {
        if (userAnswer === question.correctAnswer) {
          correctCount++;
        }
      } else if (question.type === 'multiple') {
        if (Array.isArray(userAnswer) && Array.isArray(question.correctAnswer)) {
          if (userAnswer.length === question.correctAnswer.length &&
              userAnswer.every(ans => question.correctAnswer.includes(ans))) {
            correctCount++;
          }
        }
      } else if (question.type === 'fill') {
        if (userAnswer && userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase()) {
          correctCount++;
        }
      }
    });
    
    const score = Math.round((correctCount / totalQuestions) * 100);
    const result = {
      score,
      correctCount,
      totalQuestions,
      timeUsed: selectedAssessment.duration * 60 - timeLeft,
      level: score >= 90 ? '优秀' : score >= 80 ? '良好' : score >= 70 ? '中等' : score >= 60 ? '及格' : '不及格',
      suggestions: generateSuggestions(score)
    };
    
    setAssessmentResult(result);
    setCurrentStep(2);
  };

  // 生成建议
  const generateSuggestions = (score) => {
    if (score >= 90) {
      return [
        '您的数字素养水平优秀，建议继续保持',
        '可以尝试更高难度的测评挑战',
        '考虑成为数字素养培训的导师'
      ];
    } else if (score >= 80) {
      return [
        '您的数字素养水平良好，还有提升空间',
        '建议加强薄弱环节的学习',
        '多参与实践项目提升技能'
      ];
    } else if (score >= 60) {
      return [
        '您的数字素养水平需要提升',
        '建议系统学习相关课程',
        '多练习基础操作技能'
      ];
    } else {
      return [
        '建议从基础知识开始学习',
        '参加入门级培训课程',
        '多向他人请教和学习'
      ];
    }
  };

  // 重新开始
  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedAssessment(null);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(0);
    setIsAssessing(false);
    setAssessmentResult(null);
  };

  // 渲染测评选择页面
  const renderAssessmentSelection = () => (
    <div className="assessment-selection">
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={3}>选择测评项目</Title>
        <Text type="secondary">请选择适合您的测评项目，系统将根据您的表现生成个性化报告</Text>
      </div>
      
      <Row gutter={[24, 24]}>
        {assessmentTemplates.map(assessment => (
          <Col xs={24} lg={12} key={assessment.id}>
            <Card
              className="assessment-card"
              hoverable
              style={{ height: '100%' }}
              bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <Avatar 
                    size={48} 
                    style={{ backgroundColor: assessment.color, fontSize: 24 }}
                  >
                    {assessment.icon}
                  </Avatar>
                  <div style={{ marginLeft: 16 }}>
                    <Title level={4} style={{ margin: 0 }}>{assessment.title}</Title>
                    <Text type="secondary">{assessment.description}</Text>
                  </div>
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  {assessment.categories.map(category => (
                    <Tag key={category} color={assessment.color}>{category}</Tag>
                  ))}
                </div>
                
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={8}>
                    <Statistic
                      title="时长"
                      value={assessment.duration}
                      suffix="分钟"
                      valueStyle={{ fontSize: 16 }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="题数"
                      value={assessment.questionCount}
                      suffix="题"
                      valueStyle={{ fontSize: 16 }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="平均分"
                      value={assessment.averageScore}
                      precision={1}
                      valueStyle={{ fontSize: 16 }}
                    />
                  </Col>
                </Row>
                
                <Text type="secondary">
                  已有 {assessment.participants} 人参与测评
                </Text>
              </div>
              
              <Button
                type="primary"
                size="large"
                block
                style={{ marginTop: 16, backgroundColor: assessment.color, borderColor: assessment.color }}
                onClick={() => handleStartAssessment(assessment)}
                icon={<PlayCircleOutlined />}
              >
                开始测评
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  // 渲染测评进行页面
  const renderAssessmentProgress = () => {
    const question = sampleQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;
    
    return (
      <div className="assessment-progress">
        <Card>
          <div style={{ marginBottom: 24 }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={4} style={{ margin: 0 }}>
                  {selectedAssessment?.title}
                </Title>
                <Text type="secondary">
                  第 {currentQuestion + 1} 题 / 共 {sampleQuestions.length} 题
                </Text>
              </Col>
              <Col>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: timeLeft < 300 ? '#ff4d4f' : '#1890ff' }}>
                    <ClockCircleOutlined /> {formatTime(timeLeft)}
                  </div>
                  <Text type="secondary">剩余时间</Text>
                </div>
              </Col>
            </Row>
            
            <Progress 
              percent={progress} 
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              style={{ marginTop: 16 }}
            />
          </div>
          
          {timeLeft < 300 && (
            <Alert
              message="时间不足5分钟"
              description="请抓紧时间完成剩余题目"
              type="warning"
              showIcon
              style={{ marginBottom: 24 }}
            />
          )}
          
          <Card className="question-card">
            <Title level={5}>
              {currentQuestion + 1}. {question.title}
            </Title>
            
            <Form form={form} layout="vertical">
              {question.type === 'single' && (
                <Form.Item>
                  <Radio.Group
                    value={answers[question.id]}
                    onChange={(e) => handleAnswerQuestion(question.id, e.target.value)}
                  >
                    <Space direction="vertical">
                      {question.options.map((option, index) => (
                        <Radio key={index} value={index}>
                          {option}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                </Form.Item>
              )}
              
              {question.type === 'multiple' && (
                <Form.Item>
                  <Checkbox.Group
                    value={answers[question.id] || []}
                    onChange={(values) => handleAnswerQuestion(question.id, values)}
                  >
                    <Space direction="vertical">
                      {question.options.map((option, index) => (
                        <Checkbox key={index} value={index}>
                          {option}
                        </Checkbox>
                      ))}
                    </Space>
                  </Checkbox.Group>
                </Form.Item>
              )}
              
              {question.type === 'judge' && (
                <Form.Item>
                  <Radio.Group
                    value={answers[question.id]}
                    onChange={(e) => handleAnswerQuestion(question.id, e.target.value)}
                  >
                    <Space>
                      <Radio value={true}>正确</Radio>
                      <Radio value={false}>错误</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              )}
              
              {question.type === 'fill' && (
                <Form.Item>
                  <Input
                    placeholder="请输入答案"
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerQuestion(question.id, e.target.value)}
                  />
                </Form.Item>
              )}
            </Form>
          </Card>
          
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Space>
              <Button
                disabled={currentQuestion === 0}
                onClick={handlePrevQuestion}
              >
                上一题
              </Button>
              <Button
                type="primary"
                onClick={handleNextQuestion}
                disabled={!answers[question.id]}
              >
                {currentQuestion === sampleQuestions.length - 1 ? '提交测评' : '下一题'}
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    );
  };

  // 渲染测评结果页面
  const renderAssessmentResult = () => (
    <div className="assessment-result">
      <Result
        icon={<TrophyOutlined style={{ color: '#1890ff' }} />}
        title="测评完成！"
        subTitle={`您在「${selectedAssessment?.title}」中的表现`}
      />
      
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={6}>
          <Card className="result-stat">
            <Statistic
              title="总分"
              value={assessmentResult?.score}
              suffix="分"
              valueStyle={{ color: '#1890ff', fontSize: 32 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="result-stat">
            <Statistic
              title="等级"
              value={assessmentResult?.level}
              valueStyle={{ color: '#52c41a', fontSize: 24 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="result-stat">
            <Statistic
              title="正确率"
              value={Math.round((assessmentResult?.correctCount / assessmentResult?.totalQuestions) * 100)}
              suffix="%"
              valueStyle={{ color: '#722ed1', fontSize: 24 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="result-stat">
            <Statistic
              title="用时"
              value={Math.floor(assessmentResult?.timeUsed / 60)}
              suffix="分钟"
              valueStyle={{ color: '#fa8c16', fontSize: 24 }}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="详细分析" className="analysis-card">
            <div style={{ marginBottom: 16 }}>
              <Text strong>答题情况：</Text>
              <div style={{ marginTop: 8 }}>
                <Text>正确：{assessmentResult?.correctCount} 题</Text>
                <br />
                <Text>错误：{assessmentResult?.totalQuestions - assessmentResult?.correctCount} 题</Text>
                <br />
                <Text>总计：{assessmentResult?.totalQuestions} 题</Text>
              </div>
            </div>
            
            <Progress
              type="circle"
              percent={Math.round((assessmentResult?.correctCount / assessmentResult?.totalQuestions) * 100)}
              format={percent => `${percent}%`}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="学习建议" className="suggestions-card">
            <List
              dataSource={assessmentResult?.suggestions || []}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{index + 1}</Avatar>}
                    description={item}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
      
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Space>
          <Button size="large" onClick={handleRestart}>
            重新测评
          </Button>
          <Button type="primary" size="large" icon={<BarChartOutlined />}>
            查看详细报告
          </Button>
          <Button size="large" icon={<FileTextOutlined />}>
            下载证书
          </Button>
        </Space>
      </div>
    </div>
  );

  return (
    <div className="online-assessment">
      <Steps current={currentStep} style={{ marginBottom: 32 }}>
        <Step title="选择测评" icon={<FileTextOutlined />} />
        <Step title="进行测评" icon={<EditOutlined />} />
        <Step title="查看结果" icon={<TrophyOutlined />} />
      </Steps>
      
      {currentStep === 0 && renderAssessmentSelection()}
      {currentStep === 1 && renderAssessmentProgress()}
      {currentStep === 2 && renderAssessmentResult()}
    </div>
  );
};

export default OnlineAssessment;