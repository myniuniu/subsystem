import React, { useState, useEffect } from 'react';
import { Modal, Steps, Card, Progress, Button, Form, Input, Select, Tag, Row, Col, Statistic, List, Space, Divider } from 'antd';
import { BookOutlined, ClockCircleOutlined, TrophyOutlined, SettingOutlined, PlayCircleOutlined, FileTextOutlined } from '@ant-design/icons';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const LearningPlanModal = ({ visible, onConfirm, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [analysisData, setAnalysisData] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [selectedHabits, setSelectedHabits] = useState([]);
  const [customPlan, setCustomPlan] = useState('');

  // 模拟课程数据分析
  const mockCourseAnalysis = {
    totalCourses: 24,
    totalHours: 156,
    categories: [
      { name: 'JavaScript基础', count: 8, hours: 48 },
      { name: 'React框架', count: 10, hours: 72 },
      { name: '项目实战', count: 6, hours: 36 }
    ],
    difficulty: {
      beginner: 8,
      intermediate: 12,
      advanced: 4
    },
    progress: {
      completed: 6,
      inProgress: 3,
      notStarted: 15
    }
  };

  // 学习习惯快捷选项
  const habitOptions = [
    { key: 'morning', label: '早晨学习', desc: '每天早上7-9点学习2小时' },
    { key: 'evening', label: '晚间学习', desc: '每天晚上8-10点学习2小时' },
    { key: 'weekend', label: '周末集中', desc: '周末集中学习，每次4-6小时' },
    { key: 'fragmented', label: '碎片化学习', desc: '利用碎片时间，每次30分钟' },
    { key: 'intensive', label: '密集学习', desc: '连续学习3-4小时，间隔休息' },
    { key: 'gradual', label: '循序渐进', desc: '每天固定1小时，持续稳定学习' }
  ];

  useEffect(() => {
    if (visible && currentStep === 0 && !analysisData) {
      // 模拟分析过程
      setTimeout(() => {
        setAnalysisData(mockCourseAnalysis);
      }, 1000);
    }
  }, [visible, currentStep, analysisData]);

  const generateLearningPlan = () => {
    const plan = {
      duration: '12周',
      weeklyHours: 12,
      phases: [
        {
          phase: '第1-4周：基础夯实',
          tasks: [
            'JavaScript ES6+语法掌握',
            'DOM操作与事件处理',
            '异步编程基础'
          ],
          milestone: '完成基础测试，正确率达到85%'
        },
        {
          phase: '第5-8周：React进阶',
          tasks: [
            'React组件开发',
            '状态管理与生命周期',
            'React Hooks深入'
          ],
          milestone: '独立完成Todo应用项目'
        },
        {
          phase: '第9-12周：项目实战',
          tasks: [
            '完整项目架构设计',
            'API集成与数据处理',
            '项目部署与优化'
          ],
          milestone: '完成个人作品集项目'
        }
      ],
      recommendations: [
        '建议每周安排2-3次编程练习',
        '建立学习笔记和知识点总结',
        '加入学习小组进行讨论交流'
      ]
    };
    setGeneratedPlan(plan);
    setCurrentStep(1);
  };

  const handleHabitSelect = (habitKey) => {
    if (selectedHabits.includes(habitKey)) {
      setSelectedHabits(selectedHabits.filter(h => h !== habitKey));
    } else {
      setSelectedHabits([...selectedHabits, habitKey]);
    }
  };

  const adjustPlanWithHabits = () => {
    let adjustedPlan = { ...generatedPlan };
    
    // 根据选择的习惯调整计划
    if (selectedHabits.includes('morning')) {
      adjustedPlan.schedule = '每日早晨7:00-9:00学习时段';
    } else if (selectedHabits.includes('evening')) {
      adjustedPlan.schedule = '每日晚间8:00-10:00学习时段';
    } else if (selectedHabits.includes('weekend')) {
      adjustedPlan.weeklyHours = 16;
      adjustedPlan.schedule = '周末集中学习，周六日各8小时';
    }

    if (selectedHabits.includes('intensive')) {
      adjustedPlan.sessionLength = '3-4小时连续学习，中间休息15分钟';
    } else if (selectedHabits.includes('fragmented')) {
      adjustedPlan.sessionLength = '30分钟碎片化学习';
      adjustedPlan.weeklyHours = 8;
    }

    setGeneratedPlan(adjustedPlan);
  };

  // 处理弹窗关闭
  const handleCancel = () => {
    // 重置状态
    setCurrentStep(0);
    setAnalysisData(null);
    setGeneratedPlan(null);
    setSelectedHabits([]);
    setCustomPlan('');
    form.resetFields();
    
    // 调用父组件的取消回调
    onCancel();
  };

  const handleConfirm = () => {
    const planData = {
      analysis: analysisData,
      plan: generatedPlan,
      habits: selectedHabits,
      customContent: customPlan
    };
    
    // 调用父组件的确认回调
    onConfirm(planData);
    
    // 重置状态
    setCurrentStep(0);
    setAnalysisData(null);
    setGeneratedPlan(null);
    setSelectedHabits([]);
    setCustomPlan('');
    form.resetFields();
  };

  const renderAnalysisStep = () => (
    <div>
      <h3 style={{ marginBottom: 20 }}>📊 课程资源分析</h3>
      {!analysisData ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Progress type="circle" percent={75} />
          <p style={{ marginTop: 16 }}>正在分析您的课程资源...</p>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <Statistic
                title="总课程数"
                value={analysisData.totalCourses}
                prefix={<BookOutlined />}
                suffix="门"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="总学时"
                value={analysisData.totalHours}
                prefix={<ClockCircleOutlined />}
                suffix="小时"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="完成进度"
                value={Math.round((analysisData.progress.completed / analysisData.totalCourses) * 100)}
                prefix={<TrophyOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
          
          <Col span={12}>
            <Card title="课程分类分布" size="small">
              <List
                size="small"
                dataSource={analysisData.categories}
                renderItem={item => (
                  <List.Item>
                    <Space>
                      <Tag color="blue">{item.name}</Tag>
                      <span>{item.count}门课程</span>
                      <span>{item.hours}小时</span>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          
          <Col span={12}>
            <Card title="难度分布" size="small">
              <div>
                <div style={{ marginBottom: 8 }}>
                  <span>初级：</span>
                  <Progress percent={(analysisData.difficulty.beginner / analysisData.totalCourses) * 100} size="small" />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span>中级：</span>
                  <Progress percent={(analysisData.difficulty.intermediate / analysisData.totalCourses) * 100} size="small" />
                </div>
                <div>
                  <span>高级：</span>
                  <Progress percent={(analysisData.difficulty.advanced / analysisData.totalCourses) * 100} size="small" />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      )}
      
      {analysisData && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button type="primary" onClick={generateLearningPlan}>
            生成学习计划
          </Button>
        </div>
      )}
    </div>
  );

  const renderPlanStep = () => (
    <div>
      <h3 style={{ marginBottom: 20 }}>📋 智能学习计划</h3>
      {generatedPlan && (
        <>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={8}>
              <Card size="small">
                <Statistic title="计划周期" value={generatedPlan.duration} />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Statistic title="每周学时" value={generatedPlan.weeklyHours} suffix="小时" />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Statistic title="学习阶段" value={generatedPlan.phases.length} suffix="个" />
              </Card>
            </Col>
          </Row>

          {generatedPlan.schedule && (
            <Card size="small" style={{ marginBottom: 16 }}>
              <strong>学习时间安排：</strong> {generatedPlan.schedule}
            </Card>
          )}

          <Card title="学习路径规划" size="small" style={{ marginBottom: 16 }}>
            {generatedPlan.phases.map((phase, index) => (
              <div key={index} style={{ marginBottom: 16 }}>
                <h4>{phase.phase}</h4>
                <List
                  size="small"
                  dataSource={phase.tasks}
                  renderItem={task => (
                    <List.Item>
                      <PlayCircleOutlined style={{ marginRight: 8 }} />
                      {task}
                    </List.Item>
                  )}
                />
                <p style={{ fontStyle: 'italic', color: '#666' }}>
                  🎯 {phase.milestone}
                </p>
              </div>
            ))}
          </Card>

          <Divider>快捷习惯配置</Divider>
          <div style={{ marginBottom: 16 }}>
            <p>选择您的学习习惯，系统将动态调整学习计划：</p>
            <Row gutter={[8, 8]}>
              {habitOptions.map(habit => (
                <Col span={12} key={habit.key}>
                  <Card
                    size="small"
                    hoverable
                    onClick={() => handleHabitSelect(habit.key)}
                    style={{
                      border: selectedHabits.includes(habit.key) ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      backgroundColor: selectedHabits.includes(habit.key) ? '#f0f8ff' : '#fff'
                    }}
                  >
                    <Space direction="vertical" size="small">
                      <strong>{habit.label}</strong>
                      <span style={{ fontSize: '12px', color: '#666' }}>{habit.desc}</span>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {selectedHabits.length > 0 && (
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Button onClick={adjustPlanWithHabits}>
                根据习惯调整计划
              </Button>
            </div>
          )}

          <Card title="个性化建议" size="small">
            <List
              size="small"
              dataSource={generatedPlan.recommendations}
              renderItem={rec => (
                <List.Item>
                  <FileTextOutlined style={{ marginRight: 8 }} />
                  {rec}
                </List.Item>
              )}
            />
          </Card>
        </>
      )}
    </div>
  );

  const renderCustomStep = () => (
    <div>
      <h3 style={{ marginBottom: 20 }}>✏️ 自定义调整</h3>
      <Form form={form} layout="vertical">
        <Form.Item label="补充说明或特殊要求">
          <TextArea
            rows={4}
            placeholder="请描述您的特殊学习需求、时间安排或其他要求..."
            value={customPlan}
            onChange={(e) => setCustomPlan(e.target.value)}
          />
        </Form.Item>
      </Form>
      
      <Card title="当前计划总结" size="small" style={{ marginTop: 16 }}>
        <p><strong>学习周期：</strong>{generatedPlan?.duration}</p>
        <p><strong>每周学时：</strong>{generatedPlan?.weeklyHours}小时</p>
        <p><strong>选择习惯：</strong>{selectedHabits.map(h => habitOptions.find(opt => opt.key === h)?.label).join('、') || '未选择'}</p>
        {generatedPlan?.schedule && <p><strong>时间安排：</strong>{generatedPlan.schedule}</p>}
      </Card>
    </div>
  );

  return (
    <Modal
      title="🎯 智能学习计划"
      open={visible}
      onCancel={handleCancel}
      width={800}
      footer={
        <Space>
          <Button onClick={handleCancel}>取消</Button>
          {currentStep > 0 && (
            <Button onClick={() => setCurrentStep(currentStep - 1)}>
              上一步
            </Button>
          )}
          {currentStep < 2 && analysisData && generatedPlan && (
            <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
              下一步
            </Button>
          )}
          {currentStep === 2 && (
            <Button type="primary" onClick={handleConfirm}>
              确认生成
            </Button>
          )}
        </Space>
      }
    >
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="资源分析" icon={<BookOutlined />} />
        <Step title="计划生成" icon={<SettingOutlined />} />
        <Step title="自定义调整" icon={<FileTextOutlined />} />
      </Steps>

      {currentStep === 0 && renderAnalysisStep()}
      {currentStep === 1 && renderPlanStep()}
      {currentStep === 2 && renderCustomStep()}
    </Modal>
  );
};

export default LearningPlanModal;