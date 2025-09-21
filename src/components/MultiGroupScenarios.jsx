import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Space,
  List,
  Tag,
  Avatar,
  Switch,
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  Radio,
  Slider,
  message,
  Tabs,
  Badge,
  Tooltip,
  Divider,
  Alert,
  Progress,
  Statistic
} from 'antd';
import {
  TeamOutlined,
  BookOutlined,
  HeartOutlined,
  UserOutlined,
  SettingOutlined,
  BankOutlined,
  ReadOutlined,
  SmileOutlined,
  HomeOutlined,
  CrownOutlined,
  SafetyOutlined,
  ExperimentOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  StarOutlined,
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const MultiGroupScenarios = ({ currentGroup, onGroupChange, onScenarioSelect }) => {
  const [selectedGroup, setSelectedGroup] = useState(currentGroup || 'enterprise');
  const [customizationModal, setCustomizationModal] = useState(false);
  const [groupSettings, setGroupSettings] = useState({});
  const [scenarios, setScenarios] = useState([]);

  // 群体配置
  const groupConfigs = {
    enterprise: {
      name: '企业培训',
      icon: <BankOutlined />,
      color: '#1890ff',
      description: '面向企业员工的专业技能培训和管理能力提升',
      features: ['合规培训', '技能认证', '绩效考核', '团队协作'],
      themes: ['安全生产', '质量管理', '领导力发展', '数字化转型', '客户服务'],
      learningModes: ['强制培训', '选修课程', '项目实战', '导师制'],
      assessmentTypes: ['在线考试', '实操评估', '360度评价', '项目答辩']
    },
    education: {
      name: '教育教学',
      icon: <ReadOutlined />,
      color: '#52c41a',
      description: '支持教师专业发展和教学能力提升',
      features: ['新课标解读', '教学方法', '学生管理', '家校沟通'],
      themes: ['分层教学', '信息化教学', '班级管理', '心理健康', '家校合作'],
      learningModes: ['研修课程', '案例分析', '同伴互助', '专家指导'],
      assessmentTypes: ['教学设计', '课堂观察', '学生反馈', '同行评议']
    },
    elderly: {
      name: '老年学习',
      icon: <SmileOutlined />,
      color: '#faad14',
      description: '为老年人提供生活技能和兴趣爱好学习',
      features: ['生活技能', '健康养生', '兴趣爱好', '社交互动'],
      themes: ['智能手机', '健康养生', '书法绘画', '摄影修图', '广场舞'],
      learningModes: ['面授课程', '视频教学', '实践体验', '社群学习'],
      assessmentTypes: ['作品展示', '技能演示', '心得分享', '互动交流']
    },
    parent: {
      name: '家长教育',
      icon: <HomeOutlined />,
      color: '#eb2f96',
      description: '帮助家长提升育儿技能和家庭教育水平',
      features: ['育儿知识', '心理健康', '学习辅导', '亲子关系'],
      themes: ['儿童心理', '学习方法', '沟通技巧', '行为管理', '青春期教育'],
      learningModes: ['专题讲座', '案例讨论', '经验分享', '专家咨询'],
      assessmentTypes: ['知识测试', '案例分析', '实践记录', '反思总结']
    }
  };

  // 场景化学习方案
  const scenarioTemplates = {
    enterprise: [
      {
        id: 'safety-compliance',
        title: '安全生产合规培训',
        description: '全员安全意识提升和合规操作培训',
        duration: '2周',
        participants: '全体员工',
        resources: ['安全法规解读', '事故案例分析', '应急处理演练', '合规操作指南'],
        assessments: ['法规知识考试', '应急演练评估', '安全操作认证'],
        features: ['强制学习', '进度跟踪', '证书管理', '定期复训']
      },
      {
        id: 'leadership-development',
        title: '中层管理者领导力发展',
        description: '提升管理者的领导能力和团队管理技能',
        duration: '6周',
        participants: '中层管理者',
        resources: ['领导力理论', '管理实战案例', '团队建设活动', '360度反馈'],
        assessments: ['领导力测评', '管理项目实践', '团队绩效评估'],
        features: ['分层培训', '导师制', '项目实战', '持续跟踪']
      }
    ],
    education: [
      {
        id: 'new-curriculum-standards',
        title: '新课标落地实施',
        description: '帮助教师理解和实施新课程标准',
        duration: '4周',
        participants: '学科教师',
        resources: ['课标解读视频', '教学设计案例', '评价方式指导', '实施经验分享'],
        assessments: ['课标理解测试', '教学设计作业', '课堂实践评估'],
        features: ['学科分组', '案例研讨', '同伴互助', '专家指导']
      },
      {
        id: 'differentiated-teaching',
        title: '分层教学技巧培训',
        description: '掌握因材施教的分层教学方法',
        duration: '3周',
        participants: '班主任教师',
        resources: ['分层理论基础', '学情分析方法', '教学策略设计', '效果评估工具'],
        assessments: ['理论知识考核', '教学方案设计', '实施效果评价'],
        features: ['理论学习', '实践操作', '反思改进', '经验交流']
      }
    ],
    elderly: [
      {
        id: 'smartphone-skills',
        title: '智能手机使用技巧',
        description: '帮助老年人掌握智能手机的基本操作',
        duration: '2周',
        participants: '初学老年人',
        resources: ['基础操作视频', '常用APP介绍', '安全使用指南', '实操练习'],
        assessments: ['操作演示', '功能使用测试', '安全知识问答'],
        features: ['循序渐进', '重复练习', '个别指导', '家属协助']
      },
      {
        id: 'photography-editing',
        title: '手机拍照修图课程',
        description: '学习手机摄影技巧和照片美化方法',
        duration: '3周',
        participants: '有基础老年人',
        resources: ['摄影构图技巧', '光线运用方法', '修图软件教程', '作品欣赏'],
        assessments: ['摄影作品提交', '修图技能展示', '创意表达评价'],
        features: ['兴趣导向', '作品展示', '互相学习', '成就激励']
      }
    ],
    parent: [
      {
        id: 'child-psychology',
        title: '儿童心理发展与教育',
        description: '了解儿童心理发展规律，提升教育效果',
        duration: '4周',
        participants: '幼儿家长',
        resources: ['发展心理学基础', '年龄特点分析', '教育方法指导', '问题解决策略'],
        assessments: ['心理知识测试', '案例分析报告', '教育实践记录'],
        features: ['理论学习', '案例讨论', '实践指导', '专家答疑']
      },
      {
        id: 'learning-guidance',
        title: '家庭学习辅导技巧',
        description: '掌握有效的家庭学习辅导方法',
        duration: '3周',
        participants: '小学生家长',
        resources: ['学习心理学', '辅导方法技巧', '学习环境营造', '激励机制设计'],
        assessments: ['方法运用测试', '辅导效果记录', '经验分享交流'],
        features: ['方法学习', '实践应用', '效果跟踪', '经验交流']
      }
    ]
  };

  useEffect(() => {
    setScenarios(scenarioTemplates[selectedGroup] || []);
  }, [selectedGroup]);

  const handleGroupChange = (group) => {
    setSelectedGroup(group);
    onGroupChange && onGroupChange(group);
    message.success(`已切换到${groupConfigs[group].name}模式`);
  };

  const handleCustomization = () => {
    setCustomizationModal(true);
  };

  const handleScenarioSelect = (scenario) => {
    onScenarioSelect && onScenarioSelect(scenario);
    message.success(`已选择场景：${scenario.title}`);
  };

  const renderGroupCard = (groupKey, config) => (
    <Card
      key={groupKey}
      hoverable
      className={selectedGroup === groupKey ? 'selected-group' : ''}
      style={{
        border: selectedGroup === groupKey ? `2px solid ${config.color}` : '1px solid #d9d9d9',
        cursor: 'pointer'
      }}
      onClick={() => handleGroupChange(groupKey)}
    >
      <div style={{ textAlign: 'center' }}>
        <Avatar
          size={48}
          style={{ backgroundColor: config.color, marginBottom: 12 }}
          icon={config.icon}
        />
        <Title level={5} style={{ marginBottom: 8 }}>
          {config.name}
        </Title>
        <Paragraph
          type="secondary"
          ellipsis={{ rows: 2 }}
          style={{ fontSize: 12, minHeight: 32 }}
        >
          {config.description}
        </Paragraph>
        <div style={{ marginTop: 12 }}>
          {config.features.slice(0, 2).map(feature => (
            <Tag key={feature} size="small" style={{ marginBottom: 4 }}>
              {feature}
            </Tag>
          ))}
          {config.features.length > 2 && (
            <Tag size="small" style={{ marginBottom: 4 }}>
              +{config.features.length - 2}
            </Tag>
          )}
        </div>
      </div>
    </Card>
  );

  const renderScenarioCard = (scenario) => (
    <Card
      key={scenario.id}
      title={
        <Space>
          <Text strong>{scenario.title}</Text>
          <Tag color="blue">{scenario.duration}</Tag>
        </Space>
      }
      extra={
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            size="small"
          >
            预览
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => handleScenarioSelect(scenario)}
          >
            选择
          </Button>
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 16 }}>
        {scenario.description}
      </Paragraph>
      
      <Row gutter={[16, 8]}>
        <Col span={12}>
          <Text type="secondary">参与对象：</Text>
          <Text>{scenario.participants}</Text>
        </Col>
        <Col span={12}>
          <Text type="secondary">学习时长：</Text>
          <Text>{scenario.duration}</Text>
        </Col>
      </Row>
      
      <Divider style={{ margin: '12px 0' }} />
      
      <div style={{ marginBottom: 12 }}>
        <Text type="secondary">学习资源：</Text>
        <div style={{ marginTop: 4 }}>
          {scenario.resources.map((resource, index) => (
            <Tag key={index} style={{ marginBottom: 4 }}>
              {resource}
            </Tag>
          ))}
        </div>
      </div>
      
      <div style={{ marginBottom: 12 }}>
        <Text type="secondary">考核方式：</Text>
        <div style={{ marginTop: 4 }}>
          {scenario.assessments.map((assessment, index) => (
            <Tag key={index} color="green" style={{ marginBottom: 4 }}>
              {assessment}
            </Tag>
          ))}
        </div>
      </div>
      
      <div>
        <Text type="secondary">特色功能：</Text>
        <div style={{ marginTop: 4 }}>
          {scenario.features.map((feature, index) => (
            <Tag key={index} color="orange" style={{ marginBottom: 4 }}>
              {feature}
            </Tag>
          ))}
        </div>
      </div>
    </Card>
  );

  return (
    <div>
      {/* 群体选择 */}
      <Card
        title={
          <Space>
            <TeamOutlined />
            <span>选择目标群体</span>
          </Space>
        }
        extra={
          <Button
            type="link"
            icon={<SettingOutlined />}
            onClick={handleCustomization}
          >
            自定义配置
          </Button>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[16, 16]}>
          {Object.entries(groupConfigs).map(([key, config]) => (
            <Col key={key} xs={24} sm={12} md={6}>
              {renderGroupCard(key, config)}
            </Col>
          ))}
        </Row>
      </Card>

      {/* 当前群体信息 */}
      <Card
        title={
          <Space>
            {groupConfigs[selectedGroup].icon}
            <span>{groupConfigs[selectedGroup].name}配置</span>
            <Badge
              count="已选择"
              style={{ backgroundColor: groupConfigs[selectedGroup].color }}
            />
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[24, 16]}>
          <Col span={24}>
            <Alert
              message={groupConfigs[selectedGroup].description}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          </Col>
          
          <Col xs={24} md={8}>
            <Card size="small" title="核心功能">
              <List
                size="small"
                dataSource={groupConfigs[selectedGroup].features}
                renderItem={(item) => (
                  <List.Item>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                    {item}
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card size="small" title="热门主题">
              <div>
                {groupConfigs[selectedGroup].themes.map(theme => (
                  <Tag key={theme} style={{ marginBottom: 8 }}>
                    {theme}
                  </Tag>
                ))}
              </div>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card size="small" title="学习模式">
              <List
                size="small"
                dataSource={groupConfigs[selectedGroup].learningModes}
                renderItem={(item) => (
                  <List.Item>
                    <StarOutlined style={{ color: '#faad14', marginRight: 8 }} />
                    {item}
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 场景化方案 */}
      <Card
        title={
          <Space>
            <ExperimentOutlined />
            <span>场景化学习方案</span>
            <Badge count={scenarios.length} style={{ backgroundColor: '#52c41a' }} />
          </Space>
        }
      >
        <Row gutter={[16, 16]}>
          {scenarios.map(scenario => (
            <Col key={scenario.id} xs={24} lg={12}>
              {renderScenarioCard(scenario)}
            </Col>
          ))}
        </Row>
        
        {scenarios.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Text type="secondary">暂无适用的场景化方案</Text>
          </div>
        )}
      </Card>

      {/* 自定义配置模态框 */}
      <Modal
        title="群体配置自定义"
        open={customizationModal}
        onCancel={() => setCustomizationModal(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setCustomizationModal(false)}>
            取消
          </Button>,
          <Button key="save" type="primary">
            保存配置
          </Button>
        ]}
      >
        <Tabs defaultActiveKey="basic">
          <TabPane tab="基础设置" key="basic">
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="群体名称">
                    <Input placeholder="输入自定义群体名称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="主题色彩">
                    <Select placeholder="选择主题色彩">
                      <Option value="#1890ff">蓝色</Option>
                      <Option value="#52c41a">绿色</Option>
                      <Option value="#faad14">橙色</Option>
                      <Option value="#eb2f96">粉色</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item label="群体描述">
                <Input.TextArea
                  rows={3}
                  placeholder="描述该群体的特点和学习需求"
                />
              </Form.Item>
              
              <Form.Item label="核心功能">
                <Checkbox.Group>
                  <Row>
                    <Col span={8}><Checkbox value="skill">技能培训</Checkbox></Col>
                    <Col span={8}><Checkbox value="knowledge">知识学习</Checkbox></Col>
                    <Col span={8}><Checkbox value="assessment">能力评估</Checkbox></Col>
                    <Col span={8}><Checkbox value="certification">认证管理</Checkbox></Col>
                    <Col span={8}><Checkbox value="social">社交学习</Checkbox></Col>
                    <Col span={8}><Checkbox value="gamification">游戏化</Checkbox></Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="学习偏好" key="preference">
            <Form layout="vertical">
              <Form.Item label="学习时长偏好">
                <Radio.Group>
                  <Radio value="short">短时学习（10-30分钟）</Radio>
                  <Radio value="medium">中等时长（30-60分钟）</Radio>
                  <Radio value="long">长时学习（60分钟以上）</Radio>
                </Radio.Group>
              </Form.Item>
              
              <Form.Item label="内容难度">
                <Slider
                  marks={{
                    0: '入门',
                    25: '初级',
                    50: '中级',
                    75: '高级',
                    100: '专家'
                  }}
                  defaultValue={50}
                />
              </Form.Item>
              
              <Form.Item label="互动程度">
                <Slider
                  marks={{
                    0: '被动学习',
                    50: '适度互动',
                    100: '高度互动'
                  }}
                  defaultValue={50}
                />
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="评估方式" key="assessment">
            <Form layout="vertical">
              <Form.Item label="评估类型">
                <Checkbox.Group>
                  <Row>
                    <Col span={12}><Checkbox value="quiz">在线测试</Checkbox></Col>
                    <Col span={12}><Checkbox value="project">项目作业</Checkbox></Col>
                    <Col span={12}><Checkbox value="peer">同伴评价</Checkbox></Col>
                    <Col span={12}><Checkbox value="self">自我评估</Checkbox></Col>
                    <Col span={12}><Checkbox value="practical">实操考核</Checkbox></Col>
                    <Col span={12}><Checkbox value="portfolio">作品集</Checkbox></Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
              
              <Form.Item label="评估频率">
                <Select placeholder="选择评估频率">
                  <Option value="immediate">即时反馈</Option>
                  <Option value="weekly">每周评估</Option>
                  <Option value="monthly">每月评估</Option>
                  <Option value="milestone">里程碑评估</Option>
                </Select>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default MultiGroupScenarios;