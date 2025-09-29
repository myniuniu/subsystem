import React from 'react';
import { Card, Typography, Divider, List, Tag, Row, Col, Statistic, Timeline, Table, Progress } from 'antd';
import { 
  BookOutlined, 
  CalendarOutlined, 
  TeamOutlined, 
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  StarOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const TrainingPlanDetailView = ({ plan }) => {
  if (!plan) return null;

  const { metadata, needsAnalysis, objectives, content, implementation, evaluation, expectedOutcomes, resourceRequirements } = plan;

  // 渲染需求分析部分
  const renderNeedsAnalysis = () => (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ExclamationCircleOutlined style={{ color: '#faad14' }} />
          <span>培训需求分析</span>
        </div>
      }
      style={{ marginBottom: '16px' }}
    >
      <div style={{ marginBottom: '16px' }}>
        <Title level={5}>目标群体分析</Title>
        <Paragraph>{needsAnalysis.targetGroup.description}</Paragraph>
        
        <Text strong>群体特征：</Text>
        <List
          size="small"
          dataSource={needsAnalysis.targetGroup.characteristics}
          renderItem={item => (
            <List.Item>
              <Text>• {item}</Text>
            </List.Item>
          )}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <Title level={5}>能力差距分析</Title>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card size="small" title="知识差距">
              <List
                size="small"
                dataSource={needsAnalysis.gapAnalysis.knowledgeGaps}
                renderItem={gap => <List.Item><Text type="secondary">• {gap}</Text></List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="技能差距">
              <List
                size="small"
                dataSource={needsAnalysis.gapAnalysis.skillGaps}
                renderItem={gap => <List.Item><Text type="secondary">• {gap}</Text></List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="态度差距">
              <List
                size="small"
                dataSource={needsAnalysis.gapAnalysis.attitudeGaps}
                renderItem={gap => <List.Item><Text type="secondary">• {gap}</Text></List.Item>}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <div>
        <Title level={5}>优先需求</Title>
        <List
          dataSource={needsAnalysis.priorityNeeds}
          renderItem={need => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text strong>{need.need}</Text>
                    <Tag color={need.urgency === '高' ? 'red' : need.urgency === '中' ? 'orange' : 'blue'}>
                      紧迫性: {need.urgency}
                    </Tag>
                    <Tag color={need.importance === '高' ? 'red' : need.importance === '中' ? 'orange' : 'blue'}>
                      重要性: {need.importance}
                    </Tag>
                  </div>
                }
                description={need.description}
              />
            </List.Item>
          )}
        />
      </div>
    </Card>
  );

  // 渲染培训目标部分
  const renderObjectives = () => (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StarOutlined style={{ color: '#52c41a' }} />
          <span>培训目标</span>
        </div>
      }
      style={{ marginBottom: '16px' }}
    >
      <div style={{ marginBottom: '16px' }}>
        <Title level={5}>总体目标</Title>
        <Paragraph>{objectives.overallObjective}</Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card size="small" title={objectives.specificObjectives.knowledge.title} bordered={false}>
            <List
              size="small"
              dataSource={objectives.specificObjectives.knowledge.objectives}
              renderItem={obj => <List.Item><Text>• {obj}</Text></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" title={objectives.specificObjectives.skills.title} bordered={false}>
            <List
              size="small"
              dataSource={objectives.specificObjectives.skills.objectives}
              renderItem={obj => <List.Item><Text>• {obj}</Text></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" title={objectives.specificObjectives.attitudes.title} bordered={false}>
            <List
              size="small"
              dataSource={objectives.specificObjectives.attitudes.objectives}
              renderItem={obj => <List.Item><Text>• {obj}</Text></List.Item>}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: '16px' }}>
        <Title level={5}>预期学习成果</Title>
        <List
          dataSource={objectives.learningOutcomes}
          renderItem={outcome => (
            <List.Item>
              <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
              <Text>{outcome}</Text>
            </List.Item>
          )}
        />
      </div>
    </Card>
  );

  // 渲染培训内容部分
  const renderContent = () => (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOutlined style={{ color: '#1890ff' }} />
          <span>培训内容设计</span>
        </div>
      }
      style={{ marginBottom: '16px' }}
    >
      <div style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 8]}>
          <Col span={6}>
            <Statistic title="总学时" value={content.contentFramework.totalDuration} />
          </Col>
          <Col span={6}>
            <Statistic title="模块数量" value={content.contentFramework.moduleCount} suffix="个" />
          </Col>
          <Col span={12}>
            <div>
              <Text strong>结构安排：</Text>
              <Text>{content.contentFramework.structure}</Text>
            </div>
          </Col>
        </Row>
      </div>

      <Title level={5}>培训模块</Title>
      <List
        dataSource={content.modules}
        renderItem={module => (
          <List.Item>
            <Card 
              size="small" 
              title={`模块${module.sequence}：${module.module}`}
              extra={<Tag color="blue">{module.duration}</Tag>}
              style={{ width: '100%' }}
            >
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <div>
                    <Text strong>学习目标：</Text>
                    <List
                      size="small"
                      dataSource={module.objectives}
                      renderItem={obj => <List.Item style={{ padding: '2px 0' }}><Text type="secondary">• {obj}</Text></List.Item>}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <Text strong>主要内容：</Text>
                    <List
                      size="small"
                      dataSource={module.content}
                      renderItem={item => <List.Item style={{ padding: '2px 0' }}><Text type="secondary">• {item}</Text></List.Item>}
                    />
                  </div>
                </Col>
              </Row>
              <div style={{ marginTop: '8px' }}>
                <Text strong>教学方法：</Text>
                {module.methods.map(method => (
                  <Tag key={method} style={{ margin: '2px' }}>{method}</Tag>
                ))}
              </div>
            </Card>
          </List.Item>
        )}
      />
    </Card>
  );

  // 渲染实施计划部分
  const renderImplementation = () => (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarOutlined style={{ color: '#722ed1' }} />
          <span>实施计划</span>
        </div>
      }
      style={{ marginBottom: '16px' }}
    >
      <div style={{ marginBottom: '16px' }}>
        <Title level={5}>时间安排</Title>
        <Text strong>总体周期：</Text>
        <Text>{implementation.timeline.totalDuration}</Text>
      </div>

      <Timeline>
        {implementation.timeline.phases.map((phase, index) => (
          <Timeline.Item 
            key={index}
            color={index === 0 ? 'green' : index === 1 ? 'blue' : index === 2 ? 'orange' : 'gray'}
          >
            <Card size="small" title={`${phase.phase}（${phase.duration}）`}>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <div>
                    <Text strong>主要活动：</Text>
                    <List
                      size="small"
                      dataSource={phase.activities}
                      renderItem={activity => <List.Item style={{ padding: '2px 0' }}><Text type="secondary">• {activity}</Text></List.Item>}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <Text strong>交付成果：</Text>
                    <List
                      size="small"
                      dataSource={phase.deliverables}
                      renderItem={deliverable => <List.Item style={{ padding: '2px 0' }}><Text type="secondary">• {deliverable}</Text></List.Item>}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Timeline.Item>
        ))}
      </Timeline>

      <div style={{ marginTop: '16px' }}>
        <Title level={5}>培训安排</Title>
        <Row gutter={[16, 8]}>
          <Col span={6}>
            <div>
              <Text strong>培训频次：</Text>
              <Text>{implementation.schedule.frequency}</Text>
            </div>
          </Col>
          <Col span={6}>
            <div>
              <Text strong>单次时长：</Text>
              <Text>{implementation.schedule.duration}</Text>
            </div>
          </Col>
          <Col span={6}>
            <div>
              <Text strong>培训形式：</Text>
              <Text>{implementation.schedule.format}</Text>
            </div>
          </Col>
          <Col span={6}>
            <div>
              <Text strong>时间选择：</Text>
              <Text>{implementation.schedule.timeSlots.join('、')}</Text>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );

  // 渲染评估体系部分
  const renderEvaluation = () => (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileTextOutlined style={{ color: '#fa8c16' }} />
          <span>评估体系</span>
        </div>
      }
      style={{ marginBottom: '16px' }}
    >
      <Title level={5}>评估框架</Title>
      <List
        dataSource={evaluation.framework.levels}
        renderItem={level => (
          <List.Item>
            <Card size="small" title={level.level} style={{ width: '100%' }}>
              <Paragraph>{level.description}</Paragraph>
              <div style={{ marginBottom: '8px' }}>
                <Text strong>评估方法：</Text>
                {level.methods.map(method => (
                  <Tag key={method} style={{ margin: '2px' }}>{method}</Tag>
                ))}
              </div>
              <div>
                <Text strong>关键指标：</Text>
                {level.indicators.map(indicator => (
                  <Tag key={indicator} color="blue" style={{ margin: '2px' }}>{indicator}</Tag>
                ))}
              </div>
            </Card>
          </List.Item>
        )}
      />

      <div style={{ marginTop: '16px' }}>
        <Title level={5}>质量保障</Title>
        <Row gutter={[16, 8]}>
          <Col span={8}>
            <Card size="small" title="质量标准" bordered={false}>
              <List
                size="small"
                dataSource={evaluation.qualityAssurance.standards}
                renderItem={standard => <List.Item><Text type="secondary">• {standard}</Text></List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="监控机制" bordered={false}>
              <List
                size="small"
                dataSource={evaluation.qualityAssurance.monitoring}
                renderItem={method => <List.Item><Text type="secondary">• {method}</Text></List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="改进措施" bordered={false}>
              <List
                size="small"
                dataSource={evaluation.qualityAssurance.improvement}
                renderItem={measure => <List.Item><Text type="secondary">• {measure}</Text></List.Item>}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Card>
  );

  // 渲染预期成果部分
  const renderExpectedOutcomes = () => (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircleOutlined style={{ color: '#52c41a' }} />
          <span>预期成果</span>
        </div>
      }
      style={{ marginBottom: '16px' }}
    >
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card size="small" title="即时成果" bordered={false}>
            <List
              size="small"
              dataSource={expectedOutcomes.immediate}
              renderItem={outcome => <List.Item><Text>• {outcome}</Text></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" title="短期成果" bordered={false}>
            <List
              size="small"
              dataSource={expectedOutcomes.shortTerm}
              renderItem={outcome => <List.Item><Text>• {outcome}</Text></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" title="长期成果" bordered={false}>
            <List
              size="small"
              dataSource={expectedOutcomes.longTerm}
              renderItem={outcome => <List.Item><Text>• {outcome}</Text></List.Item>}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );

  // 渲染资源需求部分
  const renderResourceRequirements = () => (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TeamOutlined style={{ color: '#13c2c2' }} />
          <span>资源需求</span>
        </div>
      }
    >
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card size="small" title="人力资源" bordered={false}>
            <div style={{ marginBottom: '8px' }}>
              <Text strong>培训师资：</Text>
              <Text>{resourceRequirements.human.trainers}</Text>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <Text strong>技术支持：</Text>
              <Text>{resourceRequirements.human.support}</Text>
            </div>
            <div>
              <Text strong>管理人员：</Text>
              <Text>{resourceRequirements.human.management}</Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" title="物质资源" bordered={false}>
            <div style={{ marginBottom: '8px' }}>
              <Text strong>培训场地：</Text>
              <Text>{resourceRequirements.material.venue}</Text>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <Text strong>设备器材：</Text>
              <Text>{resourceRequirements.material.equipment}</Text>
            </div>
            <div>
              <Text strong>学习用品：</Text>
              <Text>{resourceRequirements.material.supplies}</Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" title="财务预算" bordered={false}>
            <div style={{ marginBottom: '8px' }}>
              <Text strong>师资费用：</Text>
              <Text>{resourceRequirements.financial.trainerFees}</Text>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <Text strong>材料费用：</Text>
              <Text>{resourceRequirements.financial.materials}</Text>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <Text strong>场地费用：</Text>
              <Text>{resourceRequirements.financial.venue}</Text>
            </div>
            <div>
              <Text strong>其他费用：</Text>
              <Text>{resourceRequirements.financial.other}</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
  );

  return (
    <div style={{ padding: '16px' }}>
      {/* 方案概述 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <Title level={2}>{metadata.title}</Title>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px' }}>
            <Tag color="blue">{metadata.type}</Tag>
            <Tag color="green">{metadata.targetAudience}</Tag>
            <Tag color="orange">{metadata.duration}</Tag>
            <Tag color="purple">版本 {metadata.version}</Tag>
          </div>
          <Text type="secondary">生成时间：{metadata.generatedAt}</Text>
        </div>
      </Card>

      {/* 各个部分 */}
      {renderNeedsAnalysis()}
      {renderObjectives()}
      {renderContent()}
      {renderImplementation()}
      {renderEvaluation()}
      {renderExpectedOutcomes()}
      {renderResourceRequirements()}
    </div>
  );
};

export default TrainingPlanDetailView;