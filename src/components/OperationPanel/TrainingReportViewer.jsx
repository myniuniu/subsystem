import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  List, 
  Tag, 
  message,
  Tabs,
  Space,
  Divider,
  Table,
  Alert,
  Spin
} from 'antd';
import { 
  ReloadOutlined, 
  DownloadOutlined, 
  FileTextOutlined,
  ArrowLeftOutlined,
  BarChartOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { RIGHT_PANEL_VIEWS, VIEW_MODES } from '../../constants/noteEditConstants';

const { Text, Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const TrainingReportViewer = ({
  rightPanelTrainingReportRecord,
  rightPanelTrainingReportContent,
  setRightPanelView,
  setRightPanelTrainingReportRecord,
  setRightPanelTrainingReportContent,
  isFullscreen = false,
  setCurrentView
}) => {
  // 状态管理
  const [generatedReports, setGeneratedReports] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);

  // 初始化报告数据
  useEffect(() => {
    if (rightPanelTrainingReportContent && rightPanelTrainingReportRecord) {
      setReportData(rightPanelTrainingReportContent);
      setActiveTab('overview');
    } else {
      // 生成默认报告数据
      generateDefaultReport();
    }
  }, [rightPanelTrainingReportContent, rightPanelTrainingReportRecord]);

  // 生成默认培训报告数据
  const generateDefaultReport = () => {
    const defaultReport = {
      metadata: {
        title: '培训需求与管理系统整体培训报告',
        reportType: '综合培训报告',
        generatedAt: new Date().toLocaleString(),
        reportPeriod: '2024年第一季度',
        version: '1.0'
      },
      summary: {
        totalTrainingPrograms: 12,
        totalParticipants: 156,
        completionRate: 87.5,
        satisfactionRate: 92.3,
        totalTrainingHours: 480,
        averageScore: 85.6
      },
      trainingNeeds: {
        identified: 25,
        addressed: 22,
        pending: 3,
        categories: [
          { name: '教学方法提升', count: 8, priority: '高' },
          { name: '技术应用培训', count: 6, priority: '中' },
          { name: '管理能力培训', count: 5, priority: '高' },
          { name: '专业技能培训', count: 4, priority: '中' },
          { name: '其他培训需求', count: 2, priority: '低' }
        ]
      },
      trainingPrograms: [
        {
          id: 1,
          name: '现代教学方法与技能提升',
          participants: 25,
          duration: '6周',
          status: '已完成',
          completionRate: 96,
          satisfaction: 94.5,
          startDate: '2024-01-15',
          endDate: '2024-02-26'
        },
        {
          id: 2,
          name: '数字化教学工具应用',
          participants: 20,
          duration: '4周',
          status: '进行中',
          completionRate: 75,
          satisfaction: 89.2,
          startDate: '2024-02-01',
          endDate: '2024-02-29'
        },
        {
          id: 3,
          name: '学生管理与班级建设',
          participants: 18,
          duration: '5周',
          status: '已完成',
          completionRate: 89,
          satisfaction: 91.8,
          startDate: '2024-01-08',
          endDate: '2024-02-12'
        }
      ],
      effectiveness: {
        knowledgeImprovement: 88.5,
        skillEnhancement: 85.2,
        attitudinalChange: 90.1,
        behavioralChange: 82.7,
        overallEffectiveness: 86.6
      },
      feedback: {
        positive: [
          '培训内容实用性强，能够直接应用到教学实践中',
          '培训师专业水平高，讲解清晰易懂',
          '培训形式多样，理论与实践结合紧密',
          '培训时间安排合理，不影响正常教学工作'
        ],
        improvements: [
          '希望增加更多实践操作环节',
          '建议提供更多案例分析',
          '期望有更多同行交流机会',
          '希望培训资料能够数字化提供'
        ]
      },
      recommendations: [
        '继续加强实践性培训内容的设计',
        '建立培训效果跟踪评估机制',
        '完善培训资源库建设',
        '加强培训师队伍建设',
        '优化培训时间安排和频次'
      ]
    };
    
    setReportData(defaultReport);
  };

  // 返回上一级
  const handleBack = () => {
    if (isFullscreen && setCurrentView) {
      setCurrentView(VIEW_MODES.NORMAL);
    } else {
      setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
    }
  };

  // 重新生成报告
  const handleRegenerateReport = async () => {
    setIsGenerating(true);
    try {
      // 模拟报告生成过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 更新报告数据
      const updatedReport = {
        ...reportData,
        metadata: {
          ...reportData.metadata,
          generatedAt: new Date().toLocaleString(),
          version: (parseFloat(reportData.metadata.version) + 0.1).toFixed(1)
        }
      };
      
      setReportData(updatedReport);
      message.success('培训报告重新生成成功！');
    } catch (error) {
      console.error('生成培训报告失败:', error);
      message.error('生成培训报告失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  // 导出报告
  const handleExportReport = () => {
    const reportContent = generateReportMarkdown(reportData);
    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportData.metadata.title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('报告导出成功！');
  };

  // 生成报告Markdown内容
  const generateReportMarkdown = (data) => {
    return `# ${data.metadata.title}

## 报告概览
- **报告类型**: ${data.metadata.reportType}
- **报告周期**: ${data.metadata.reportPeriod}
- **生成时间**: ${data.metadata.generatedAt}
- **版本**: ${data.metadata.version}

## 培训概况统计
- **培训项目总数**: ${data.summary.totalTrainingPrograms}个
- **参训人员总数**: ${data.summary.totalParticipants}人
- **完成率**: ${data.summary.completionRate}%
- **满意度**: ${data.summary.satisfactionRate}%
- **总培训时长**: ${data.summary.totalTrainingHours}小时
- **平均成绩**: ${data.summary.averageScore}分

## 培训需求分析
### 需求识别情况
- **已识别需求**: ${data.trainingNeeds.identified}项
- **已解决需求**: ${data.trainingNeeds.addressed}项
- **待处理需求**: ${data.trainingNeeds.pending}项

### 需求分类统计
${data.trainingNeeds.categories.map(cat => `- **${cat.name}**: ${cat.count}项 (优先级: ${cat.priority})`).join('\n')}

## 培训项目执行情况
${data.trainingPrograms.map(program => `
### ${program.name}
- **参训人数**: ${program.participants}人
- **培训周期**: ${program.duration}
- **执行状态**: ${program.status}
- **完成率**: ${program.completionRate}%
- **满意度**: ${program.satisfaction}%
- **开始时间**: ${program.startDate}
- **结束时间**: ${program.endDate}
`).join('\n')}

## 培训效果评估
- **知识提升**: ${data.effectiveness.knowledgeImprovement}%
- **技能增强**: ${data.effectiveness.skillEnhancement}%
- **态度转变**: ${data.effectiveness.attitudinalChange}%
- **行为改变**: ${data.effectiveness.behavioralChange}%
- **整体效果**: ${data.effectiveness.overallEffectiveness}%

## 反馈意见
### 积极反馈
${data.feedback.positive.map(item => `- ${item}`).join('\n')}

### 改进建议
${data.feedback.improvements.map(item => `- ${item}`).join('\n')}

## 改进建议
${data.recommendations.map(item => `- ${item}`).join('\n')}

---
*此报告由培训需求与管理系统自动生成*`;
  };

  // 渲染概览页签
  const renderOverview = () => (
    <div>
      <Alert
        message="培训报告概览"
        description={`本报告涵盖了${reportData.metadata.reportPeriod}的整体培训情况，包括培训需求分析、项目执行情况、效果评估等内容。`}
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="培训项目"
              value={reportData.summary.totalTrainingPrograms}
              suffix="个"
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="参训人员"
              value={reportData.summary.totalParticipants}
              suffix="人"
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="完成率"
              value={reportData.summary.completionRate}
              suffix="%"
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="满意度"
              value={reportData.summary.satisfactionRate}
              suffix="%"
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="培训需求分析" size="small">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="已识别"
                  value={reportData.trainingNeeds.identified}
                  suffix="项"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="已解决"
                  value={reportData.trainingNeeds.addressed}
                  suffix="项"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="待处理"
                  value={reportData.trainingNeeds.pending}
                  suffix="项"
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="培训效果" size="small">
            <div style={{ padding: '8px 0' }}>
              <div style={{ marginBottom: 8 }}>
                <Text>整体效果: </Text>
                <Progress 
                  percent={reportData.effectiveness.overallEffectiveness} 
                  size="small" 
                  status="active"
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text>知识提升: </Text>
                <Progress 
                  percent={reportData.effectiveness.knowledgeImprovement} 
                  size="small"
                />
              </div>
              <div>
                <Text>技能增强: </Text>
                <Progress 
                  percent={reportData.effectiveness.skillEnhancement} 
                  size="small"
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 渲染培训项目页签
  const renderTrainingPrograms = () => {
    const columns = [
      {
        title: '项目名称',
        dataIndex: 'name',
        key: 'name',
        width: '30%'
      },
      {
        title: '参训人数',
        dataIndex: 'participants',
        key: 'participants',
        render: (text) => `${text}人`
      },
      {
        title: '培训周期',
        dataIndex: 'duration',
        key: 'duration'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={status === '已完成' ? 'green' : status === '进行中' ? 'blue' : 'orange'}>
            {status}
          </Tag>
        )
      },
      {
        title: '完成率',
        dataIndex: 'completionRate',
        key: 'completionRate',
        render: (rate) => (
          <Progress percent={rate} size="small" />
        )
      },
      {
        title: '满意度',
        dataIndex: 'satisfaction',
        key: 'satisfaction',
        render: (rate) => `${rate}%`
      }
    ];

    return (
      <div>
        <Card title="培训项目执行情况" style={{ marginBottom: 16 }}>
          <Table
            columns={columns}
            dataSource={reportData.trainingPrograms}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </Card>

        <Card title="需求分类统计">
          <List
            dataSource={reportData.trainingNeeds.categories}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={item.name}
                  description={`需求数量: ${item.count}项`}
                />
                <Tag color={item.priority === '高' ? 'red' : item.priority === '中' ? 'orange' : 'green'}>
                  {item.priority}优先级
                </Tag>
              </List.Item>
            )}
          />
        </Card>
      </div>
    );
  };

  // 渲染效果分析页签
  const renderEffectiveness = () => (
    <div>
      <Card title="培训效果综合评估" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>知识提升效果</Text>
              <Progress 
                percent={reportData.effectiveness.knowledgeImprovement} 
                strokeColor="#52c41a"
                style={{ marginTop: 8 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>技能增强效果</Text>
              <Progress 
                percent={reportData.effectiveness.skillEnhancement} 
                strokeColor="#1890ff"
                style={{ marginTop: 8 }}
              />
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>态度转变效果</Text>
              <Progress 
                percent={reportData.effectiveness.attitudinalChange} 
                strokeColor="#722ed1"
                style={{ marginTop: 8 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>行为改变效果</Text>
              <Progress 
                percent={reportData.effectiveness.behavioralChange} 
                strokeColor="#fa8c16"
                style={{ marginTop: 8 }}
              />
            </div>
          </Col>
        </Row>
        
        <Divider />
        
        <div style={{ textAlign: 'center' }}>
          <Statistic
            title="整体培训效果评分"
            value={reportData.effectiveness.overallEffectiveness}
            suffix="分"
            precision={1}
            valueStyle={{ color: '#3f8600', fontSize: '32px' }}
          />
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="积极反馈" size="small">
            <List
              dataSource={reportData.feedback.positive}
              renderItem={item => (
                <List.Item>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="改进建议" size="small">
            <List
              dataSource={reportData.feedback.improvements}
              renderItem={item => (
                <List.Item>
                  <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 渲染建议页签
  const renderRecommendations = () => (
    <Card title="改进建议与发展方向">
      <List
        dataSource={reportData.recommendations}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<div style={{ 
                width: 24, 
                height: 24, 
                borderRadius: '50%', 
                backgroundColor: '#1890ff', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '12px'
              }}>
                {index + 1}
              </div>}
              title={item}
              description="基于培训数据分析和反馈意见提出的改进建议"
            />
          </List.Item>
        )}
      />
    </Card>
  );

  if (!reportData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>正在加载培训报告...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 头部工具栏 */}
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #f0f0f0',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
              type="text"
            />
            <div>
              <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileTextOutlined style={{ color: '#d46b08' }} />
                {reportData.metadata.title}
              </Title>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {reportData.metadata.reportPeriod} | 生成时间: {reportData.metadata.generatedAt}
              </Text>
            </div>
          </div>
          
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRegenerateReport}
              loading={isGenerating}
            >
              重新生成
            </Button>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={handleExportReport}
            >
              导出报告
            </Button>
          </Space>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="概览" key="overview">
            {renderOverview()}
          </TabPane>
          <TabPane tab="培训项目" key="programs">
            {renderTrainingPrograms()}
          </TabPane>
          <TabPane tab="效果分析" key="effectiveness">
            {renderEffectiveness()}
          </TabPane>
          <TabPane tab="改进建议" key="recommendations">
            {renderRecommendations()}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default TrainingReportViewer;