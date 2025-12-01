import React, { useState } from 'react';
import { Button, Typography, Card, Row, Col, Progress, List, Tag, Rate, Divider } from 'antd';
import { ArrowLeftOutlined, FileTextOutlined, StarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { RIGHT_PANEL_VIEWS } from '../../constants/noteEditConstants';

const { Text, Title } = Typography;

const ClassroomEvaluationViewer = ({
  rightPanelNoteRecord,
  rightPanelNoteContent,
  setRightPanelView,
  setRightPanelNoteRecord,
  setRightPanelNoteContent
}) => {
  const [viewMode, setViewMode] = useState('report'); // 'report', 'raw'
  
  // 从记录中获取评价配置
  const evaluationConfig = rightPanelNoteRecord?.evaluationConfig;
  
  // 模拟生成的评价报告数据
  const generateEvaluationReport = () => {
    if (!evaluationConfig) return null;
    
    return {
      overall: {
        score: 85,
        level: '良好',
        summary: '本次课堂教学整体表现良好，教学目标明确，教学方法得当，学生参与度较高。'
      },
      dimensions: [
        {
          name: '教学准备',
          score: 90,
          items: [
            { name: '教案设计', score: 92, comment: '教案结构清晰，目标明确' },
            { name: '教学资源', score: 88, comment: '多媒体资源丰富，使用恰当' },
            { name: '课前准备', score: 90, comment: '准备充分，材料齐全' }
          ]
        },
        {
          name: '教学实施',
          score: 82,
          items: [
            { name: '教学方法', score: 85, comment: '方法多样，但可进一步优化' },
            { name: '课堂组织', score: 80, comment: '组织有序，时间分配合理' },
            { name: '师生互动', score: 81, comment: '互动较好，可增加学生参与' }
          ]
        },
        {
          name: '教学效果',
          score: 83,
          items: [
            { name: '知识传授', score: 85, comment: '知识点讲解清晰' },
            { name: '能力培养', score: 82, comment: '注重能力培养' },
            { name: '学生反馈', score: 82, comment: '学生反应积极' }
          ]
        }
      ],
      strengths: [
        '教学目标明确，重点突出',
        '教学方法多样，形式活泼',
        '师生关系融洽，课堂氛围好',
        '教学资源丰富，使用恰当'
      ],
      improvements: [
        '可增加更多互动环节，提高学生参与度',
        '适当调整教学节奏，给学生更多思考时间',
        '加强对学困生的关注和指导',
        '可尝试更多创新教学方法'
      ],
      recommendations: [
        '建议在下次课程中增加小组讨论环节',
        '可以设计更多实践性的教学活动',
        '建议关注学生的个体差异，因材施教',
        '可以引入更多现代化教学技术'
      ]
    };
  };
  
  const reportData = generateEvaluationReport();
  
  // 获取分数对应的颜色
  const getScoreColor = (score) => {
    if (score >= 90) return '#52c41a';
    if (score >= 80) return '#1890ff';
    if (score >= 70) return '#faad14';
    return '#f5222d';
  };
  
  // 获取等级
  const getLevel = (score) => {
    if (score >= 90) return '优秀';
    if (score >= 80) return '良好';
    if (score >= 70) return '中等';
    return '需改进';
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 查看器头部 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>📊</span>
          <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>
            课堂评价报告查看器
          </Text>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* 视图切换按钮 */}
          <Button.Group size="small">
            <Button 
              type={viewMode === 'report' ? 'primary' : 'default'}
              onClick={() => setViewMode('report')}
            >
              评价报告
            </Button>
            <Button 
              type={viewMode === 'raw' ? 'primary' : 'default'}
              onClick={() => setViewMode('raw')}
            >
              原始内容
            </Button>
          </Button.Group>
          
          <Button
            size="small"
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
              setRightPanelNoteRecord(null);
              setRightPanelNoteContent('');
            }}
          >
            返回
          </Button>
        </div>
      </div>

      {/* 内容区域 */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {viewMode === 'report' && reportData ? (
          <div>
            {/* 基本信息 */}
            <Card style={{ marginBottom: '16px' }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>评价科目：</Text>
                  <Text>{evaluationConfig?.subject || '未指定'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>年级：</Text>
                  <Text>{evaluationConfig?.grade || '未指定'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>评价类型：</Text>
                  <Text>{evaluationConfig?.evaluationType || '未指定'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>评价时间：</Text>
                  <Text>{rightPanelNoteRecord?.time || '未知'}</Text>
                </Col>
              </Row>
            </Card>

            {/* 总体评价 */}
            <Card title="总体评价" style={{ marginBottom: '16px' }}>
              <Row gutter={[24, 16]} align="middle">
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '48px', 
                      fontWeight: 'bold', 
                      color: getScoreColor(reportData.overall.score),
                      lineHeight: 1
                    }}>
                      {reportData.overall.score}
                    </div>
                    <div style={{ fontSize: '16px', color: '#666', marginTop: '8px' }}>
                      总分
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <Tag 
                      color={getScoreColor(reportData.overall.score)} 
                      style={{ fontSize: '16px', padding: '8px 16px' }}
                    >
                      {reportData.overall.level}
                    </Tag>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                      评价等级
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <Rate 
                    disabled 
                    value={Math.round(reportData.overall.score / 20)} 
                    style={{ fontSize: '24px' }}
                  />
                  <div style={{ fontSize: '14px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
                    星级评价
                  </div>
                </Col>
              </Row>
              <Divider />
              <Text>{reportData.overall.summary}</Text>
            </Card>

            {/* 各维度评价 */}
            <Card title="各维度评价" style={{ marginBottom: '16px' }}>
              {reportData.dimensions.map((dimension, index) => (
                <div key={index} style={{ marginBottom: index < reportData.dimensions.length - 1 ? '24px' : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <Title level={5} style={{ margin: 0, marginRight: '16px' }}>
                      {dimension.name}
                    </Title>
                    <Progress 
                      percent={dimension.score} 
                      strokeColor={getScoreColor(dimension.score)}
                      style={{ flex: 1, marginRight: '16px' }}
                    />
                    <Text strong style={{ color: getScoreColor(dimension.score) }}>
                      {dimension.score}分
                    </Text>
                  </div>
                  <List
                    size="small"
                    dataSource={dimension.items}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Text>{item.name}</Text>
                              <Tag color={getScoreColor(item.score)}>
                                {item.score}分 · {getLevel(item.score)}
                              </Tag>
                            </div>
                          }
                          description={item.comment}
                        />
                      </List.Item>
                    )}
                  />
                  {index < reportData.dimensions.length - 1 && <Divider />}
                </div>
              ))}
            </Card>

            {/* 优点与建议 */}
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="教学优点" size="small">
                  <List
                    size="small"
                    dataSource={reportData.strengths}
                    renderItem={(item, index) => (
                      <List.Item>
                        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                        {item}
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="改进建议" size="small">
                  <List
                    size="small"
                    dataSource={reportData.improvements}
                    renderItem={(item, index) => (
                      <List.Item>
                        <StarOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                        {item}
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>

            {/* 专家建议 */}
            <Card title="专家建议" style={{ marginTop: '16px' }}>
              <List
                dataSource={reportData.recommendations}
                renderItem={(item, index) => (
                  <List.Item>
                    <span style={{ 
                      display: 'inline-block',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#1890ff',
                      color: 'white',
                      textAlign: 'center',
                      lineHeight: '24px',
                      fontSize: '12px',
                      marginRight: '12px'
                    }}>
                      {index + 1}
                    </span>
                    {item}
                  </List.Item>
                )}
              />
            </Card>
          </div>
        ) : (
          // 显示原始内容
          <div 
            style={{ 
              padding: '16px',
              overflow: 'auto',
              height: '100%',
              lineHeight: '1.6',
              fontSize: '14px',
              color: '#333'
            }}
            dangerouslySetInnerHTML={{
              __html: rightPanelNoteContent || '暂无课堂评价内容'
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ClassroomEvaluationViewer;
