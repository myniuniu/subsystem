import React, { useState } from 'react';
import { Button, Typography, Card, Progress, Row, Col, Statistic, Tag, message } from 'antd';
import { ArrowLeftOutlined, FileTextOutlined } from '@ant-design/icons';
import { RIGHT_PANEL_VIEWS } from '../../constants/noteEditConstants';

const { Text } = Typography;

const QuestionViewer = ({
  rightPanelQuestionRecord,
  setRightPanelView,
  setRightPanelQuestionRecord,
  setRightPanelQuestionContent
}) => {
  // 练习模式相关状态
  const [practiceMode, setPracticeMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  
  // 解析试题结构化数据
  const questions = rightPanelQuestionRecord?.questions || [];
  
  // 处理答题
  const handleAnswer = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  // 计算得分
  const calculateScore = () => {
    let totalScore = 0;
    let earnedScore = 0;
    
    questions.forEach((q, index) => {
      totalScore += q.score || 1;
      const userAnswer = userAnswers[index];
      
      if (q.type === '单选题' && userAnswer === q.answer) {
        earnedScore += q.score || 1;
      } else if (q.type === '多选题' && Array.isArray(userAnswer) && Array.isArray(q.answer)) {
        const correct = q.answer.every(ans => userAnswer.includes(ans)) && 
                       userAnswer.every(ans => q.answer.includes(ans));
        if (correct) earnedScore += q.score || 1;
      } else if (q.type === '判断题' && userAnswer === q.answer) {
        earnedScore += q.score || 1;
      } else if (q.type === '填空题' && userAnswer && 
                userAnswer.trim().toLowerCase() === (q.answer || '').trim().toLowerCase()) {
        earnedScore += q.score || 1;
      }
    });
    
    return { earnedScore, totalScore, percentage: totalScore > 0 ? (earnedScore / totalScore * 100).toFixed(1) : 0 };
  };
  
  // 提交答案
  const handleSubmit = () => {
    const result = calculateScore();
    setScore(result);
    setShowResults(true);
    message.success(`答题完成！得分：${result.earnedScore}/${result.totalScore} (${result.percentage}%)`);
  };
  
  // 重新开始
  const handleRestart = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setScore(0);
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
          <span style={{ fontSize: '16px' }}>📋</span>
          <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>
            试题查看器
          </Text>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* 练习模式切换 */}
          <Button
            type={practiceMode ? 'primary' : 'default'}
            size="small"
            onClick={() => {
              setPracticeMode(!practiceMode);
              if (!practiceMode) {
                handleRestart();
              }
            }}
            icon={<div style={{ fontSize: '12px' }}>🎯</div>}
          >
            {practiceMode ? '退出练习' : '练习模式'}
          </Button>
          
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
              setRightPanelQuestionRecord(null);
              setRightPanelQuestionContent('');
              setPracticeMode(false);
              handleRestart();
            }}
            style={{ color: '#666' }}
          >
            返回
          </Button>
        </div>
      </div>

      {/* 试题信息 */}
      {rightPanelQuestionRecord && (
        <div style={{
          background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid #00695c'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ color: '#00695c', fontWeight: 'bold' }}>{rightPanelQuestionRecord.title}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#666', display: 'flex', gap: '12px' }}>
            <span>{rightPanelQuestionRecord.source}</span>
            <span>{rightPanelQuestionRecord.time}</span>
            <span>{questions.length} 道题目</span>
            {practiceMode && (
              <span style={{ color: '#00695c', fontWeight: 'bold' }}>练习模式已启用</span>
            )}
          </div>
        </div>
      )}
      
      {/* 试题内容显示区域 */}
      <div style={{ 
        flex: 1,
        border: '1px solid #d9d9d9', 
        borderRadius: '8px',
        background: '#fff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {practiceMode ? (
          // 练习模式界面
          <div style={{ padding: '16px', overflow: 'auto', height: '100%' }}>
            {!showResults ? (
              <div>
                {/* 进度显示 */}
                <div style={{ marginBottom: '20px' }}>
                  <Progress 
                    percent={Math.round(((currentQuestionIndex + 1) / questions.length) * 100)} 
                    strokeColor={{
                      '0%': '#00695c',
                      '100%': '#4caf50',
                    }}
                    format={() => `${currentQuestionIndex + 1}/${questions.length}`}
                  />
                </div>
                
                {/* 当前题目 */}
                {questions[currentQuestionIndex] && (
                  <Card style={{ marginBottom: '20px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <Tag color="blue" style={{ marginBottom: '8px' }}>
                        {questions[currentQuestionIndex].type}
                      </Tag>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                        第 {currentQuestionIndex + 1} 题 ({questions[currentQuestionIndex].score || 1}分)
                      </div>
                      <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                        {questions[currentQuestionIndex].question}
                      </div>
                    </div>
                    
                    {/* 答题区域 */}
                    <div style={{ marginBottom: '16px' }}>
                      {questions[currentQuestionIndex].options?.map((option, index) => (
                        <div key={index} style={{ marginBottom: '8px' }}>
                          <Button
                            type={userAnswers[currentQuestionIndex] === option.key ? 'primary' : 'default'}
                            onClick={() => handleAnswer(currentQuestionIndex, option.key)}
                            style={{ width: '100%', textAlign: 'left' }}
                          >
                            {option.key}. {option.text}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
                
                {/* 导航按钮 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button 
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  >
                    上一题
                  </Button>
                  
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    已答题：{Object.keys(userAnswers).length}/{questions.length}
                  </div>
                  
                  {currentQuestionIndex < questions.length - 1 ? (
                    <Button 
                      type="primary"
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    >
                      下一题
                    </Button>
                  ) : (
                    <Button 
                      type="primary"
                      onClick={handleSubmit}
                      disabled={Object.keys(userAnswers).length === 0}
                    >
                      提交答案
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              // 结果显示
              <div>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                    练习完成！
                  </div>
                  <div style={{ fontSize: '16px', color: '#666' }}>
                    得分：{score.earnedScore}/{score.totalScore} ({score.percentage}%)
                  </div>
                </div>
                
                <Row gutter={16} style={{ marginBottom: '24px' }}>
                  <Col span={8}>
                    <Card style={{ textAlign: 'center' }}>
                      <Statistic title="总题数" value={questions.length} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card style={{ textAlign: 'center' }}>
                      <Statistic title="正确题数" value={score.earnedScore} valueStyle={{ color: '#52c41a' }} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card style={{ textAlign: 'center' }}>
                      <Statistic title="正确率" value={score.percentage} suffix="%" valueStyle={{ color: '#1890ff' }} />
                    </Card>
                  </Col>
                </Row>
                
                <div style={{ textAlign: 'center' }}>
                  <Button type="primary" onClick={handleRestart} style={{ marginRight: '8px' }}>
                    重新练习
                  </Button>
                  <Button onClick={() => setPracticeMode(false)}>
                    查看试题
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // 查看模式 - 显示所有试题
          <div 
            style={{ 
              padding: '16px',
              overflow: 'auto',
              height: '100%',
              lineHeight: '1.6',
              fontSize: '14px',
              color: '#333'
            }}
          >
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <Card key={index} style={{ marginBottom: '16px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <Tag color="blue" style={{ marginBottom: '8px' }}>
                      {question.type}
                    </Tag>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                      第 {index + 1} 题 ({question.score || 1}分)
                    </div>
                    <div style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' }}>
                      {question.question}
                    </div>
                  </div>
                  
                  {question.options && (
                    <div style={{ marginBottom: '12px' }}>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} style={{ 
                          padding: '4px 0', 
                          color: option.key === question.answer ? '#52c41a' : '#333',
                          fontWeight: option.key === question.answer ? 'bold' : 'normal'
                        }}>
                          {option.key}. {option.text}
                          {option.key === question.answer && <span style={{ color: '#52c41a', marginLeft: '8px' }}>✓</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div style={{ 
                    padding: '8px', 
                    background: '#f6ffed', 
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    <strong>答案：</strong> {question.answer}
                    {question.explanation && (
                      <div style={{ marginTop: '4px' }}>
                        <strong>解析：</strong> {question.explanation}
                      </div>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                暂无试题内容
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionViewer;