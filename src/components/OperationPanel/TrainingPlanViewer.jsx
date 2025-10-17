import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  Timeline, 
  List, 
  Tag, 
  message,
  Tabs,
  Space,
  Table,
  Modal,
  Input
} from 'antd';
import { 
  ReloadOutlined, 
  DownloadOutlined, 
  BookOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
  PaperClipOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import { RIGHT_PANEL_VIEWS, VIEW_MODES } from '../../constants/noteEditConstants';
import { generateComprehensiveTrainingPlan, generateTrainingPlanMarkdown } from '../../utils/trainingPlanGenerator';
import SimpleTrainingPlanDetailView from '../SimpleTrainingPlanDetailView';

const { Text, Title } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const TrainingPlanViewer = ({
  rightPanelTrainingPlanRecord,
  rightPanelTrainingPlanContent,
  setRightPanelView,
  setRightPanelTrainingPlanRecord,
  setRightPanelTrainingPlanContent,
  isFullscreen = false,
  setCurrentView
}) => {
  // 编辑模式状态
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  // 下载培训人员清单
  const handleDownloadParticipantsList = () => {
    // 模拟生成培训人员清单数据
    const participants = [
      { name: '张三', department: '数学组', position: '教师', phone: '13800138001', email: 'zhangsan@school.edu' },
      { name: '李四', department: '语文组', position: '教师', phone: '13800138002', email: 'lisi@school.edu' },
      { name: '王五', department: '英语组', position: '教师', phone: '13800138003', email: 'wangwu@school.edu' },
      { name: '赵六', department: '物理组', position: '教师', phone: '13800138004', email: 'zhaoliu@school.edu' },
      { name: '孙七', department: '化学组', position: '教师', phone: '13800138005', email: 'sunqi@school.edu' },
      { name: '周八', department: '生物组', position: '教师', phone: '13800138006', email: 'zhouba@school.edu' },
      { name: '吴九', department: '历史组', position: '教师', phone: '13800138007', email: 'wujiu@school.edu' },
      { name: '郑十', department: '地理组', position: '教师', phone: '13800138008', email: 'zhengshi@school.edu' }
    ];

    // 生成CSV格式的内容
    let csvContent = '\uFEFF'; // 添加BOM头，确保Excel正确识别UTF-8编码
    csvContent += '姓名,部门,职位,联系电话,电子邮箱\n';
    participants.forEach(p => {
      csvContent += `${p.name},${p.department},${p.position},${p.phone},${p.email}\n`;
    });

    // 创建Blob并下载
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', '新教师入职培训-培训人员清单.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success('培训人员清单已下载');
  };

  // 返回上一级
  const handleBack = () => {
    if (isFullscreen && setCurrentView) {
      setCurrentView(VIEW_MODES.MATERIALS);
    } else {
      setRightPanelView(RIGHT_PANEL_VIEWS.TRAINING_PLAN_LIST);
    }
  };

  // 将培训方案转换为 Markdown 格式
  const convertToMarkdown = (plan) => {
    let markdown = `# ${plan.title}\n\n`;
    
    // 一、培训概述
    markdown += `## 一、培训概述\n\n`;
    markdown += `**培训背景：**${plan.overview.background}\n\n`;
    markdown += `**培训目标：**\n`;
    plan.overview.objectives.forEach(obj => {
      markdown += `- ${obj}\n`;
    });
    markdown += `\n**培训周期：**${plan.overview.duration}\n\n`;
    markdown += `**培训对象：**${plan.overview.participants}\n\n`;
    markdown += `**培训形式：**${plan.overview.format}\n\n`;

    // 二、培训阶段与内容
    markdown += `## 二、培训阶段与内容\n\n`;
    plan.phases.forEach((phase, idx) => {
      markdown += `### ${phase.name}\n\n`;
      markdown += `**培训重点：**${phase.focus}\n\n`;
      phase.modules.forEach(module => {
        markdown += `#### ${module.title}（${module.duration}）\n\n`;
        markdown += `**培训内容：**\n`;
        module.content.forEach(item => {
          markdown += `- ${item}\n`;
        });
        markdown += `\n**培训形式：**${module.format}\n\n`;
        markdown += `**考核方式：**${module.assessment}\n\n`;
      });
    });

    // 三、培训进度安排
    markdown += `## 三、培训进度安排\n\n`;
    markdown += `| 周次 | 培训内容 | 培训形式 | 学时 |\n`;
    markdown += `|------|----------|----------|------|\n`;
    plan.schedule.forEach(item => {
      markdown += `| ${item.week} | ${item.content} | ${item.type} | ${item.hours}学时 |\n`;
    });
    markdown += `\n`;

    // 四、实施方式
    markdown += `## 四、实施方式\n\n`;
    markdown += `**培训平台：**${plan.implementation.platform}\n\n`;
    markdown += `**培训方法：**\n`;
    plan.implementation.methods.forEach(method => {
      markdown += `- ${method}\n`;
    });
    markdown += `\n**支持保障：**\n`;
    plan.implementation.support.forEach(item => {
      markdown += `- ${item}\n`;
    });
    markdown += `\n`;

    // 五、考核评价
    markdown += `## 五、考核评价\n\n`;
    markdown += `**考核方式：**${plan.assessment.method}\n\n`;
    markdown += `**考核组成：**\n`;
    plan.assessment.components.forEach(comp => {
      markdown += `- ${comp.name}（${comp.weight}）：${comp.description}\n`;
    });
    markdown += `\n**评价标准：**\n`;
    plan.assessment.standards.forEach(standard => {
      markdown += `- ${standard}\n`;
    });
    markdown += `\n`;

    // 六、保障措施
    markdown += `## 六、保障措施\n\n`;
    markdown += `**组织保障：**\n`;
    plan.guarantee.organization.forEach(item => {
      markdown += `- ${item}\n`;
    });
    markdown += `\n**资源保障：**\n`;
    plan.guarantee.resources.forEach(item => {
      markdown += `- ${item}\n`;
    });
    markdown += `\n**质量保障：**\n`;
    plan.guarantee.quality.forEach(item => {
      markdown += `- ${item}\n`;
    });

    return markdown;
  };

  // 打开编辑器
  const handleEdit = () => {
    const markdown = convertToMarkdown(newTeacherTrainingPlan);
    setEditContent(markdown);
    setIsEditing(true);
  };

  // 保存编辑
  const handleSave = () => {
    // 这里可以添加保存逻辑，例如解析 markdown 并更新数据
    message.success('培训方案已保存');
    setIsEditing(false);
    // TODO: 实际应用中需要将 markdown 解析回数据结构并保存
  };

  // 取消编辑
  const handleCancelEdit = () => {
    Modal.confirm({
      title: '确认取消编辑？',
      content: '未保存的修改将会丢失',
      okText: '确认',
      cancelText: '继续编辑',
      onOk: () => {
        setIsEditing(false);
        setEditContent('');
      }
    });
  };

  // 新教师入职线上培训方案数据
  const newTeacherTrainingPlan = {
    title: '新教师入职线上培训具体方案',
    overview: {
      background: '为帮助新入职教师尽快适应教学工作，提升专业素养，特制定本线上培训方案。',
      objectives: [
        '帮助新教师了解学校文化、规章制度和教学要求',
        '提升新教师的教学基本功和课堂管理能力',
        '培养新教师的教育教学研究意识',
        '促进新教师快速融入教师团队'
      ],
      duration: '3个月（12周）',
      participants: '本学年新入职教师',
      format: '线上直播课程 + 录播视频 + 在线研讨 + 实践作业'
    },
    phases: [
      {
        name: '第一阶段：入职适应期（第1-4周）',
        focus: '帮助新教师了解学校、熟悉环境、建立基本认知',
        modules: [
          {
            title: '学校文化与制度',
            duration: '1周',
            content: [
              '学校发展历程与办学理念',
              '学校组织架构与部门职能',
              '教师职业道德与行为规范',
              '学校规章制度解读'
            ],
            format: '直播讲座 + 在线测试',
            assessment: '在线测试（100分）'
          },
          {
            title: '教学基本规范',
            duration: '1周',
            content: [
              '教学计划制定与执行',
              '备课要求与教案编写',
              '课堂教学基本流程',
              '作业布置与批改规范'
            ],
            format: '录播视频 + 案例分析',
            assessment: '教案设计作业（100分）'
          },
          {
            title: '学生管理基础',
            duration: '1周',
            content: [
              '学生心理特点分析',
              '课堂纪律管理策略',
              '师生沟通技巧',
              '问题学生应对方法'
            ],
            format: '直播课程 + 情景模拟',
            assessment: '案例分析报告（100分）'
          },
          {
            title: '教育技术应用',
            duration: '1周',
            content: [
              '多媒体教学设备使用',
              '线上教学平台操作',
              '数字化教学资源获取',
              '教学软件工具应用'
            ],
            format: '操作演示 + 实践练习',
            assessment: '实操考核（100分）'
          }
        ]
      },
      {
        name: '第二阶段：能力提升期（第5-8周）',
        focus: '提升新教师的教学设计能力和课堂实施能力',
        modules: [
          {
            title: '教学设计进阶',
            duration: '1周',
            content: [
              '教学目标的制定与分解',
              '教学内容的选择与组织',
              '教学方法的选择与运用',
              '教学评价的设计与实施'
            ],
            format: '专题讲座 + 同伴互评',
            assessment: '完整教学设计（100分）'
          },
          {
            title: '课堂教学技能',
            duration: '1周',
            content: [
              '导入技能与情境创设',
              '讲解技能与语言表达',
              '提问技能与互动设计',
              '板书技能与媒体运用'
            ],
            format: '示范课观摩 + 微格教学',
            assessment: '模拟授课（100分）'
          },
          {
            title: '差异化教学',
            duration: '1周',
            content: [
              '学生个体差异识别',
              '分层教学策略设计',
              '个性化辅导方法',
              '特殊学生教育支持'
            ],
            format: '案例研讨 + 方案设计',
            assessment: '差异化教学方案（100分）'
          },
          {
            title: '教学反思与改进',
            duration: '1周',
            content: [
              '教学反思的意义与方法',
              '课堂观察与自我诊断',
              '教学问题分析与解决',
              '教学经验总结与分享'
            ],
            format: '反思写作 + 经验交流',
            assessment: '教学反思报告（100分）'
          }
        ]
      },
      {
        name: '第三阶段：专业发展期（第9-12周）',
        focus: '培养新教师的教研能力和持续发展意识',
        modules: [
          {
            title: '教育科研入门',
            duration: '1周',
            content: [
              '教育科研的基本概念',
              '教育研究方法介绍',
              '课题选择与申报',
              '教育论文写作规范'
            ],
            format: '理论学习 + 文献阅读',
            assessment: '研究计划书（100分）'
          },
          {
            title: '校本课程开发',
            duration: '1周',
            content: [
              '校本课程的理念与特点',
              '课程资源的开发与整合',
              '校本教材的编写',
              '特色课程的设计'
            ],
            format: '项目学习 + 团队协作',
            assessment: '课程开发方案（100分）'
          },
          {
            title: '家校沟通艺术',
            duration: '1周',
            content: [
              '家校合作的重要性',
              '家长会组织与实施',
              '家访技巧与注意事项',
              '家校矛盾化解策略'
            ],
            format: '情景演练 + 经验分享',
            assessment: '家校沟通案例分析（100分）'
          },
          {
            title: '教师职业规划',
            duration: '1周',
            content: [
              '教师专业发展阶段',
              '个人成长目标设定',
              '专业发展路径选择',
              '终身学习习惯养成'
            ],
            format: '导师指导 + 规划撰写',
            assessment: '个人发展规划（100分）'
          }
        ]
      }
    ],
    schedule: [
      { week: '第1周', content: '学校文化与制度', type: '直播讲座', hours: 6 },
      { week: '第2周', content: '教学基本规范', type: '录播视频', hours: 6 },
      { week: '第3周', content: '学生管理基础', type: '直播课程', hours: 6 },
      { week: '第4周', content: '教育技术应用', type: '操作演示', hours: 6 },
      { week: '第5周', content: '教学设计进阶', type: '专题讲座', hours: 8 },
      { week: '第6周', content: '课堂教学技能', type: '示范课观摩', hours: 8 },
      { week: '第7周', content: '差异化教学', type: '案例研讨', hours: 8 },
      { week: '第8周', content: '教学反思与改进', type: '反思写作', hours: 8 },
      { week: '第9周', content: '教育科研入门', type: '理论学习', hours: 8 },
      { week: '第10周', content: '校本课程开发', type: '项目学习', hours: 8 },
      { week: '第11周', content: '家校沟通艺术', type: '情景演练', hours: 8 },
      { week: '第12周', content: '教师职业规划', type: '导师指导', hours: 8 }
    ],
    implementation: {
      platform: '学校在线培训平台',
      methods: [
        '直播课程：每周固定时间进行，支持回放',
        '录播视频：学员可自主安排学习时间',
        '在线研讨：通过讨论区、小组会议等形式开展',
        '实践作业：结合教学实际完成各项任务',
        '导师指导：配备资深教师一对一辅导'
      ],
      support: [
        '提供完整的学习资料和参考文献',
        '建立新教师学习交流群',
        '安排定期的答疑时间',
        '提供教学观摩和实践机会'
      ]
    },
    assessment: {
      method: '过程性评价与终结性评价相结合',
      components: [
        {
          name: '在线学习',
          weight: '30%',
          description: '课程观看完成度、参与度'
        },
        {
          name: '作业考核',
          weight: '40%',
          description: '各模块作业完成质量'
        },
        {
          name: '实践表现',
          weight: '20%',
          description: '教学实践、课堂表现'
        },
        {
          name: '综合评价',
          weight: '10%',
          description: '导师评价、同伴互评'
        }
      ],
      standards: [
        '优秀（90分及以上）：全面掌握培训内容，教学能力突出',
        '良好（80-89分）：较好掌握培训内容，教学能力较强',
        '合格（60-79分）：基本掌握培训内容，能够独立开展教学',
        '不合格（60分以下）：需要继续学习和提升'
      ]
    },
    guarantee: {
      organization: [
        '成立新教师培训领导小组',
        '明确各部门职责分工',
        '建立培训档案管理制度'
      ],
      resources: [
        '配备专业的培训师资团队',
        '提供充足的学习资源',
        '保障培训经费投入'
      ],
      quality: [
        '定期收集学员反馈',
        '持续优化培训内容',
        '加强过程监督管理'
      ]
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 头部操作栏 */}
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #f0f0f0',
        background: '#fff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
              type="text"
            >
              返回
            </Button>
            <Title level={4} style={{ margin: 0 }}>{newTeacherTrainingPlan.title}</Title>
          </div>
          <Button 
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEdit}
          >
            编辑
          </Button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div style={{ 
        flex: 1, 
        padding: '24px',
        overflow: 'auto',
        background: '#f5f5f5'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#fff',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {/* 方案概述 */}
          <div style={{ marginBottom: '32px' }}>
            <Title level={3}>一、培训概述</Title>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>培训背景：</Text>
              <Text>{newTeacherTrainingPlan.overview.background}</Text>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>培训目标：</Text>
              <ul style={{ marginTop: '8px', paddingLeft: '24px' }}>
                {newTeacherTrainingPlan.overview.objectives.map((obj, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>
                    <Text>{obj}</Text>
                  </li>
                ))}
              </ul>
            </div>
            <Row gutter={16} style={{ marginTop: '16px' }}>
              <Col span={6}>
                <Card size="small">
                  <Statistic 
                    title="培训周期" 
                    value={newTeacherTrainingPlan.overview.duration}
                    valueStyle={{ fontSize: '16px' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic 
                    title="培训对象" 
                    value={newTeacherTrainingPlan.overview.participants}
                    valueStyle={{ fontSize: '16px' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Text strong>培训形式：</Text>
                  <br />
                  <Text style={{ fontSize: '14px' }}>{newTeacherTrainingPlan.overview.format}</Text>
                </Card>
              </Col>
            </Row>
            
            {/* 培训人员清单附件 */}
            <Card 
              size="small" 
              style={{ marginTop: '16px', background: '#fafafa' }}
              title={
                <Space>
                  <PaperClipOutlined style={{ color: '#1890ff' }} />
                  <Text strong>培训人员清单</Text>
                </Space>
              }
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <FileExcelOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
                    <div>
                      <Text strong>新教师入职培训-培训人员清单.csv</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>包含8名培训人员的详细信息（姓名、部门、职位、联系方式）</Text>
                    </div>
                  </Space>
                  <Button 
                    type="primary" 
                    icon={<DownloadOutlined />}
                    onClick={handleDownloadParticipantsList}
                  >
                    下载清单
                  </Button>
                </div>
              </Space>
            </Card>
          </div>

          {/* 培训阶段 */}
          <div style={{ marginBottom: '32px' }}>
            <Title level={3}>二、培训阶段与内容</Title>
            {newTeacherTrainingPlan.phases.map((phase, phaseIdx) => (
              <div key={phaseIdx} style={{ marginBottom: '24px' }}>
                <Title level={4}>{phase.name}</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                  培训重点：{phase.focus}
                </Text>
                {phase.modules.map((module, moduleIdx) => (
                  <Card 
                    key={moduleIdx}
                    size="small" 
                    title={
                      <Space>
                        <BookOutlined style={{ color: '#1890ff' }} />
                        <Text strong>{module.title}</Text>
                        <Tag color="blue">{module.duration}</Tag>
                      </Space>
                    }
                    style={{ marginBottom: '12px' }}
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <Text strong>培训内容：</Text>
                      <ul style={{ marginTop: '8px', paddingLeft: '24px' }}>
                        {module.content.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>
                            <Text>{item}</Text>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <Text strong>培训形式：</Text>
                      <Text> {module.format}</Text>
                    </div>
                    <div>
                      <Text strong>考核方式：</Text>
                      <Text> {module.assessment}</Text>
                    </div>
                  </Card>
                ))}
              </div>
            ))}
          </div>

          {/* 培训进度安排 */}
          <div style={{ marginBottom: '32px' }}>
            <Title level={3}>三、培训进度安排</Title>
            <Table 
              dataSource={newTeacherTrainingPlan.schedule}
              columns={[
                {
                  title: '周次',
                  dataIndex: 'week',
                  key: 'week',
                  width: '15%'
                },
                {
                  title: '培训内容',
                  dataIndex: 'content',
                  key: 'content',
                  width: '40%'
                },
                {
                  title: '培训形式',
                  dataIndex: 'type',
                  key: 'type',
                  width: '25%'
                },
                {
                  title: '学时',
                  dataIndex: 'hours',
                  key: 'hours',
                  width: '20%',
                  render: (hours) => `${hours}学时`
                }
              ]}
              pagination={false}
              size="small"
            />
          </div>

          {/* 实施方式 */}
          <div style={{ marginBottom: '32px' }}>
            <Title level={3}>四、实施方式</Title>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>培训平台：</Text>
              <Text>{newTeacherTrainingPlan.implementation.platform}</Text>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>培训方法：</Text>
              <ul style={{ marginTop: '8px', paddingLeft: '24px' }}>
                {newTeacherTrainingPlan.implementation.methods.map((method, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>
                    <Text>{method}</Text>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Text strong>支持保障：</Text>
              <ul style={{ marginTop: '8px', paddingLeft: '24px' }}>
                {newTeacherTrainingPlan.implementation.support.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>
                    <Text>{item}</Text>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 考核评价 */}
          <div style={{ marginBottom: '32px' }}>
            <Title level={3}>五、考核评价</Title>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>考核方式：</Text>
              <Text>{newTeacherTrainingPlan.assessment.method}</Text>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>考核组成：</Text>
              <Row gutter={16} style={{ marginTop: '12px' }}>
                {newTeacherTrainingPlan.assessment.components.map((comp, idx) => (
                  <Col span={6} key={idx}>
                    <Card size="small">
                      <Statistic 
                        title={comp.name}
                        value={comp.weight}
                        valueStyle={{ fontSize: '20px', color: '#1890ff' }}
                      />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {comp.description}
                      </Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
            <div>
              <Text strong>评价标准：</Text>
              <ul style={{ marginTop: '8px', paddingLeft: '24px' }}>
                {newTeacherTrainingPlan.assessment.standards.map((standard, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>
                    <Text>{standard}</Text>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 保障措施 */}
          <div>
            <Title level={3}>六、保障措施</Title>
            <Row gutter={16}>
              <Col span={8}>
                <Card 
                  size="small" 
                  title="组织保障"
                  headStyle={{ background: '#f0f0f0' }}
                >
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {newTeacherTrainingPlan.guarantee.organization.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '8px' }}>
                        <Text>{item}</Text>
                      </li>
                    ))}
                  </ul>
                </Card>
              </Col>
              <Col span={8}>
                <Card 
                  size="small" 
                  title="资源保障"
                  headStyle={{ background: '#f0f0f0' }}
                >
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {newTeacherTrainingPlan.guarantee.resources.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '8px' }}>
                        <Text>{item}</Text>
                      </li>
                    ))}
                  </ul>
                </Card>
              </Col>
              <Col span={8}>
                <Card 
                  size="small" 
                  title="质量保障"
                  headStyle={{ background: '#f0f0f0' }}
                >
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {newTeacherTrainingPlan.guarantee.quality.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '8px' }}>
                        <Text>{item}</Text>
                      </li>
                    ))}
                  </ul>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      {/* Markdown 编辑器 Modal */}
      <Modal
        title="编辑培训方案"
        open={isEditing}
        onOk={handleSave}
        onCancel={handleCancelEdit}
        width={1000}
        okText="保存"
        cancelText="取消"
        okButtonProps={{ icon: <SaveOutlined /> }}
        bodyStyle={{ padding: '24px' }}
      >
        <div style={{ marginBottom: '12px' }}>
          <Text type="secondary">
            使用 Markdown 语法编辑培训方案内容，支持标题、列表、表格等格式。
          </Text>
        </div>
        <TextArea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="请输入培训方案内容..."
          style={{
            minHeight: '500px',
            fontSize: '14px',
            lineHeight: '1.6',
            fontFamily: 'Monaco, Consolas, "Courier New", monospace'
          }}
          autoSize={{ minRows: 20, maxRows: 30 }}
        />
        <div style={{ marginTop: '12px' }}>
          <Space>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              快捷键：
            </Text>
            <Tag>标题：# ## ###</Tag>
            <Tag>列表：- 或 1.</Tag>
            <Tag>粗体：**文字**</Tag>
            <Tag>表格：| 列1 | 列2 |</Tag>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default TrainingPlanViewer;