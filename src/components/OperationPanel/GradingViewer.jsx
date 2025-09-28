import React, { useState } from 'react';
import { Button, Typography, Card, Row, Col, Statistic, List, Tag } from 'antd';
import { ArrowLeftOutlined, FileTextOutlined } from '@ant-design/icons';
import { RIGHT_PANEL_VIEWS } from '../../constants/noteEditConstants';

const { Text } = Typography;

const GradingViewer = ({
  rightPanelGradingRecord,
  rightPanelGradingContent,
  setRightPanelView,
  setRightPanelGradingRecord,
  setRightPanelGradingContent
}) => {
  // 阅卷查看器状态
  const [gradingViewMode, setGradingViewMode] = useState('summary'); // 'summary', 'students'
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // 从 gradingData 中获取阅卷数据
  const gradingData = rightPanelGradingRecord?.gradingData;

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
            阅卷报告查看器
          </Text>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* 视图切换按钮 */}
          <Button.Group size="small">
            <Button 
              type={gradingViewMode === 'summary' ? 'primary' : 'default'}
              onClick={() => {
                setGradingViewMode('summary');
                setSelectedStudent(null);
              }}
              icon={<FileTextOutlined />}
            >
              统计概览
            </Button>
            <Button 
              type={gradingViewMode === 'students' ? 'primary' : 'default'}
              onClick={() => setGradingViewMode('students')}
              icon={<div style={{ fontSize: '12px' }}>👥</div>}
            >
              学生详情
            </Button>
          </Button.Group>
          
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
              setRightPanelGradingRecord(null);
              setRightPanelGradingContent('');
              setGradingViewMode('summary');
              setSelectedStudent(null);
            }}
            style={{ color: '#666' }}
          >
            返回
          </Button>
        </div>
      </div>

      {/* 阅卷报告信息 */}
      {rightPanelGradingRecord && (
        <div style={{
          background: 'linear-gradient(135deg, #fff0f6 0%, #ffd6e7 100%)',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid #c41d7f'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ color: '#c41d7f', fontWeight: 'bold' }}>{rightPanelGradingRecord.title}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#666', display: 'flex', gap: '12px' }}>
            <span>{rightPanelGradingRecord.source}</span>
            <span>{rightPanelGradingRecord.time}</span>
            {gradingData && (
              <span>批改试卷 {gradingData.totalPapers} 份</span>
            )}
          </div>
        </div>
      )}
      
      {/* 阅卷报告内容显示区域 */}
      <div style={{ 
        flex: 1,
        border: '1px solid #d9d9d9', 
        borderRadius: '8px',
        background: '#fff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {gradingViewMode === 'summary' ? (
          // 统计概览模式
          gradingData ? (
            <div style={{ padding: '16px', overflow: 'auto', height: '100%' }}>
              {/* 成绩统计概览 */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: '#c41d7f', marginBottom: '12px' }}>📊 成绩统计概览</h4>
                <Row gutter={[12, 12]}>
                  <Col span={6}>
                    <Card size="small" style={{ textAlign: 'center' }}>
                      <Statistic title="试卷数量" value={gradingData.totalPapers} suffix="份" />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card size="small" style={{ textAlign: 'center' }}>
                      <Statistic title="平均分" value={gradingData.averageScore} suffix="分" precision={1} />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card size="small" style={{ textAlign: 'center' }}>
                      <Statistic title="最高分" value={gradingData.maxScore} suffix="分" />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card size="small" style={{ textAlign: 'center' }}>
                      <Statistic title="最低分" value={gradingData.minScore} suffix="分" />
                    </Card>
                  </Col>
                </Row>
              </div>
              
              {/* 分数分布 */}
              {gradingData.scoreDistribution && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ color: '#1890ff', marginBottom: '12px' }}>📈 分数分布</h4>
                  <Row gutter={[12, 12]}>
                    <Col span={6}>
                      <Card size="small" style={{ textAlign: 'center', background: '#f6ffed' }}>
                        <Statistic 
                          title="优秀 (90-100分)" 
                          value={gradingData.scoreDistribution.A} 
                          suffix="%" 
                          valueStyle={{ color: '#52c41a' }}
                        />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card size="small" style={{ textAlign: 'center', background: '#e6f7ff' }}>
                        <Statistic 
                          title="良好 (80-89分)" 
                          value={gradingData.scoreDistribution.B} 
                          suffix="%" 
                          valueStyle={{ color: '#1890ff' }}
                        />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card size="small" style={{ textAlign: 'center', background: '#fff7e6' }}>
                        <Statistic 
                          title="中等 (70-79分)" 
                          value={gradingData.scoreDistribution.C} 
                          suffix="%" 
                          valueStyle={{ color: '#fa8c16' }}
                        />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card size="small" style={{ textAlign: 'center', background: '#fff2e8' }}>
                        <Statistic 
                          title="及格 (60-69分)" 
                          value={gradingData.scoreDistribution.D} 
                          suffix="%" 
                          valueStyle={{ color: '#fa541c' }}
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}
              
              {/* 标准差 */}
              {gradingData.standardDeviation && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ color: '#722ed1', marginBottom: '12px' }}>🔍 数据分析</h4>
                  <Card size="small">
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Statistic 
                          title="标准差" 
                          value={gradingData.standardDeviation} 
                          precision={1}
                          prefix={<span style={{ fontSize: '14px' }}>σ =</span>}
                        />
                      </Col>
                      <Col span={12}>
                        <div style={{ padding: '8px 0' }}>
                          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>成绩离散度</div>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', color: gradingData.standardDeviation > 10 ? '#fa541c' : gradingData.standardDeviation > 5 ? '#fa8c16' : '#52c41a' }}>
                            {gradingData.standardDeviation > 10 ? '较高' : gradingData.standardDeviation > 5 ? '中等' : '较低'}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </div>
              )}
              
              {/* 阅卷建议 */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ color: '#eb2f96', marginBottom: '12px' }}>💡 教学建议</h4>
                <List
                  size="small"
                  dataSource={[
                    '针对难点题目进行专项讲解',
                    '对得分率低于70%的题目增加练习',
                    '建议对后20%的学生进行个别辅导',
                    '加强基础知识的巩固与练习'
                  ]}
                  renderItem={(item, index) => (
                    <List.Item>
                      <span style={{ marginRight: 8, color: '#eb2f96' }}>{index + 1}.</span>
                      {item}
                    </List.Item>
                  )}
                />
              </div>
            </div>
          ) : (
            // 显示原始Markdown内容
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
                __html: rightPanelGradingContent || '暂无阅卷报告内容'
              }}
            />
          )
        ) : gradingViewMode === 'students' ? (
          // 学生详情模式
          <div style={{ display: 'flex', height: '100%' }}>
            {/* 学生列表 */}
            <div style={{ width: '200px', borderRight: '1px solid #f0f0f0', background: '#fafafa' }}>
              <div style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontWeight: 'bold', fontSize: '14px' }}>
                👥 学生列表 ({gradingData?.studentDetails?.length || 0}人)
              </div>
              <div style={{ maxHeight: 'calc(100% - 48px)', overflow: 'auto' }}>
                {gradingData?.studentDetails?.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer',
                      background: selectedStudent?.id === student.id ? '#e6f7ff' : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedStudent?.id !== student.id) {
                        e.target.style.background = '#f5f5f5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedStudent?.id !== student.id) {
                        e.target.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{student.name}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{student.studentId}</div>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: 'bold',
                      color: student.totalScore >= 90 ? '#52c41a' : student.totalScore >= 80 ? '#1890ff' : student.totalScore >= 70 ? '#fa8c16' : '#fa541c'
                    }}>
                      {student.totalScore}分
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 学生详情 */}
            <div style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
              {selectedStudent ? (
                <div>
                  {/* 学生信息 */}
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ color: '#1890ff', marginBottom: '12px' }}>
                      👤 {selectedStudent.name} 的答题情况
                    </h3>
                    <Row gutter={[16, 8]}>
                      <Col span={6}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                          <Statistic title="学号" value={selectedStudent.studentId} />
                        </Card>
                      </Col>
                      <Col span={6}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                          <Statistic 
                            title="总得分" 
                            value={selectedStudent.totalScore || 0} 
                            suffix="分"
                            valueStyle={{ 
                              color: (selectedStudent.totalScore || 0) >= 90 ? '#52c41a' : 
                                     (selectedStudent.totalScore || 0) >= 80 ? '#1890ff' : 
                                     (selectedStudent.totalScore || 0) >= 70 ? '#fa8c16' : '#fa541c'
                            }}
                          />
                        </Card>
                      </Col>
                      <Col span={6}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                          <Statistic title="答题时长" value={selectedStudent.answerTime || '未知'} />
                        </Card>
                      </Col>
                      <Col span={6}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '12px', color: '#666' }}>提交时间</div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                            {selectedStudent.submitTime ? selectedStudent.submitTime.split(' ')[1] : '未知'}
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                  
                  {/* 题目详情 */}
                  <div>
                    <h4 style={{ color: '#722ed1', marginBottom: '16px' }}>📋 题目详细分析</h4>
                    {(selectedStudent.answers || []).map((answer) => (
                      <Card 
                        key={answer.questionId}
                        size="small" 
                        style={{ 
                          marginBottom: '16px',
                          border: answer.isCorrect ? '1px solid #52c41a' : '1px solid #ff7875'
                        }}
                      >
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                              第{answer.questionId}题 ({answer.type})
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ 
                                color: answer.isCorrect ? '#52c41a' : '#ff7875',
                                fontWeight: 'bold'
                              }}>
                                {answer.score}/{answer.maxScore}分
                              </span>
                              {answer.isCorrect ? 
                                <Tag color="success">✓ 正确</Tag> : 
                                <Tag color="error">✗ 错误</Tag>
                              }
                            </div>
                          </div>
                          <div style={{ color: '#333', marginBottom: '8px' }}>
                            <strong>题目：</strong> {answer.question}
                          </div>
                        </div>
                        
                        <Row gutter={[16, 8]}>
                          <Col span={12}>
                            <div style={{ 
                              background: '#f6f6f6', 
                              padding: '8px', 
                              borderRadius: '4px',
                              border: answer.isCorrect ? '1px solid #52c41a' : '1px solid #ff7875'
                            }}>
                              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>学生答案</div>
                              <div style={{ 
                                fontWeight: 'bold',
                                color: answer.isCorrect ? '#52c41a' : '#ff7875'
                              }}>
                                {answer.userAnswer || '未作答'}
                              </div>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div style={{ 
                              background: '#e6f7ff', 
                              padding: '8px', 
                              borderRadius: '4px',
                              border: '1px solid #91d5ff'
                            }}>
                              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>正确答案</div>
                              <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
                                {answer.correctAnswer}
                              </div>
                            </div>
                          </Col>
                        </Row>
                        
                        {answer.comment && (
                          <div style={{ 
                            marginTop: '12px',
                            padding: '8px',
                            background: '#fffbe6',
                            borderRadius: '4px',
                            border: '1px solid #ffe58f'
                          }}>
                            <div style={{ fontSize: '12px', color: '#ad6800', marginBottom: '4px' }}>
                              📝 批改意见
                            </div>
                            <div style={{ color: '#ad6800' }}>{answer.comment}</div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px', 
                  color: '#999',
                  fontSize: '16px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                  <div>请在左侧选择一个学生查看详细答题情况</div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GradingViewer;