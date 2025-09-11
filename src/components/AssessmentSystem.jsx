import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { Trophy, Target, TrendingUp, Award, BookOpen, Users, Clock, Star, ChevronRight, Download, Share2 } from 'lucide-react';
import './AssessmentSystem.css';

const AssessmentSystem = ({ results, onBack, onRetry }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    // 动画步骤控制
    const timer = setInterval(() => {
      setAnimationStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 500);

    return () => clearInterval(timer);
  }, []);

  // 计算总体评级
  const calculateOverallGrade = (score) => {
    if (score >= 90) return { grade: 'A+', label: '优秀', color: '#4caf50' };
    if (score >= 80) return { grade: 'A', label: '良好', color: '#8bc34a' };
    if (score >= 70) return { grade: 'B+', label: '中等偏上', color: '#ffc107' };
    if (score >= 60) return { grade: 'B', label: '中等', color: '#ff9800' };
    return { grade: 'C', label: '需要改进', color: '#f44336' };
  };

  // 技能数据转换
  const skillData = Object.entries(results.skillScores).map(([skill, score]) => ({
    skill: getSkillName(skill),
    score: Math.round((score / 10) * 100), // 转换为百分比
    fullMark: 100
  }));

  const barData = skillData.map(item => ({
    name: item.skill,
    score: item.score,
    target: 80 // 目标分数
  }));

  function getSkillName(skill) {
    const skillNames = {
      empathy: '共情能力',
      listening: '倾听技巧',
      problemIdentification: '问题识别',
      intervention: '干预策略',
      ethics: '职业伦理'
    };
    return skillNames[skill] || skill;
  }

  // 生成建议
  const generateRecommendations = () => {
    const recommendations = [];
    
    Object.entries(results.skillScores).forEach(([skill, score]) => {
      const percentage = Math.round((score / 10) * 100);
      if (percentage < 70) {
        recommendations.push({
          skill: getSkillName(skill),
          level: 'improvement',
          suggestion: getImprovementSuggestion(skill)
        });
      } else if (percentage < 85) {
        recommendations.push({
          skill: getSkillName(skill),
          level: 'enhancement',
          suggestion: getEnhancementSuggestion(skill)
        });
      }
    });

    return recommendations;
  };

  function getImprovementSuggestion(skill) {
    const suggestions = {
      empathy: '建议多练习情感反映技巧，学习识别和回应学生的情绪状态。',
      listening: '加强积极倾听训练，注意非言语信息的捕捉和理解。',
      problemIdentification: '提升问题分析能力，学习使用结构化的评估工具。',
      intervention: '学习更多干预技巧，包括认知行为疗法和解决问题的策略。',
      ethics: '深入学习心理咨询伦理规范，加强边界意识和保密原则。'
    };
    return suggestions[skill] || '需要进一步提升该技能。';
  }

  function getEnhancementSuggestion(skill) {
    const suggestions = {
      empathy: '继续深化共情技巧，可以尝试更高级的情感调节策略。',
      listening: '在现有基础上，可以学习更精细的倾听技巧和反馈方法。',
      problemIdentification: '可以学习更复杂案例的分析方法，提升诊断准确性。',
      intervention: '探索更多元化的干预方法，适应不同类型的心理问题。',
      ethics: '可以参与更多伦理案例讨论，提升伦理决策能力。'
    };
    return suggestions[skill] || '继续保持并进一步提升。';
  }

  const overallGrade = calculateOverallGrade(results.score);
  const recommendations = generateRecommendations();
  const duration = Math.round(results.duration / 60); // 转换为分钟

  // 成就徽章
  const achievements = [
    {
      id: 'first_completion',
      name: '初次完成',
      description: '完成第一个场景训练',
      icon: '🎯',
      earned: true
    },
    {
      id: 'empathy_master',
      name: '共情大师',
      description: '共情能力达到85分以上',
      icon: '❤️',
      earned: skillData.find(s => s.skill === '共情能力')?.score >= 85
    },
    {
      id: 'quick_responder',
      name: '快速响应',
      description: '在10分钟内完成场景',
      icon: '⚡',
      earned: duration <= 10
    },
    {
      id: 'perfect_score',
      name: '完美表现',
      description: '获得90分以上总分',
      icon: '🏆',
      earned: results.score >= 90
    }
  ];

  const exportReport = () => {
    const reportData = {
      scenario: results.scenarioId,
      completedAt: results.completedAt,
      score: results.score,
      duration: results.duration,
      skillScores: results.skillScores,
      grade: overallGrade,
      recommendations
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `assessment-report-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="assessment-system">
      {/* 头部 */}
      <div className="assessment-header">
        <div className="header-content">
          <h1 className="assessment-title">训练评估报告</h1>
          <div className="assessment-meta">
            <div className="meta-item">
              <Clock size={16} />
              <span>用时: {duration}分钟</span>
            </div>
            <div className="meta-item">
              <Target size={16} />
              <span>场景: {results.scenarioId}</span>
            </div>
            <div className="meta-item">
              <Trophy size={16} />
              <span>等级: {overallGrade.grade}</span>
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="export-btn" onClick={exportReport}>
            <Download size={16} />
            导出报告
          </button>
          <button className="share-btn">
            <Share2 size={16} />
            分享
          </button>
          <button className="back-btn" onClick={onBack}>
            返回
          </button>
        </div>
      </div>

      {/* 总体评分卡片 */}
      <div className={`overall-score-card ${animationStep >= 1 ? 'animate' : ''}`}>
        <div className="score-display">
          <div className="score-circle" style={{ '--score-color': overallGrade.color }}>
            <div className="score-number">{results.score}</div>
            <div className="score-total">/100</div>
          </div>
          <div className="score-info">
            <div className="score-grade" style={{ color: overallGrade.color }}>
              {overallGrade.grade}
            </div>
            <div className="score-label">{overallGrade.label}</div>
          </div>
        </div>
        
        <div className="score-breakdown">
          <div className="breakdown-item">
            <span className="breakdown-label">回应质量</span>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill" 
                style={{ width: `${(results.score / 100) * 100}%`, backgroundColor: overallGrade.color }}
              ></div>
            </div>
            <span className="breakdown-value">{results.score}%</span>
          </div>
        </div>
      </div>

      {/* 标签导航 */}
      <div className="assessment-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart size={16} />
          技能分析
        </button>
        <button 
          className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          <BookOpen size={16} />
          详细反馈
        </button>
        <button 
          className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          <Award size={16} />
          成就徽章
        </button>
      </div>

      {/* 内容区域 */}
      <div className="assessment-content">
        {activeTab === 'overview' && (
          <div className={`overview-tab ${animationStep >= 2 ? 'animate' : ''}`}>
            {/* 技能雷达图 */}
            <div className="chart-section">
              <h3 className="section-title">技能雷达图</h3>
              <div className="radar-chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={skillData}>
                    <PolarGrid gridType="polygon" />
                    <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: '#666' }} />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fontSize: 10, fill: '#999' }}
                    />
                    <Radar
                      name="当前水平"
                      dataKey="score"
                      stroke="#4facfe"
                      fill="#4facfe"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="目标水平"
                      dataKey="fullMark"
                      stroke="#e0e0e0"
                      fill="transparent"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 技能条形图 */}
            <div className="chart-section">
              <h3 className="section-title">技能详细分析</h3>
              <div className="bar-chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: '#666' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                    <Tooltip 
                      formatter={(value, name) => [value + '%', name === 'score' ? '当前得分' : '目标分数']}
                    />
                    <Bar dataKey="target" fill="#e0e0e0" name="目标分数" />
                    <Bar dataKey="score" fill="#4facfe" name="当前得分" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className={`details-tab ${animationStep >= 3 ? 'animate' : ''}`}>
            {/* 改进建议 */}
            <div className="recommendations-section">
              <h3 className="section-title">个性化改进建议</h3>
              <div className="recommendations-list">
                {recommendations.length > 0 ? recommendations.map((rec, index) => (
                  <div key={index} className={`recommendation-card ${rec.level}`}>
                    <div className="recommendation-header">
                      <div className="recommendation-skill">{rec.skill}</div>
                      <div className={`recommendation-level ${rec.level}`}>
                        {rec.level === 'improvement' ? '需要改进' : '继续提升'}
                      </div>
                    </div>
                    <div className="recommendation-text">{rec.suggestion}</div>
                  </div>
                )) : (
                  <div className="no-recommendations">
                    <Star size={48} className="no-rec-icon" />
                    <h4>表现优秀！</h4>
                    <p>您在所有技能方面都表现出色，继续保持这种水平。</p>
                  </div>
                )}
              </div>
            </div>

            {/* 回应历史 */}
            <div className="response-history">
              <h3 className="section-title">回应历史分析</h3>
              <div className="history-list">
                {results.responses.map((response, index) => (
                  <div key={index} className="history-item">
                    <div className="history-step">步骤 {response.step + 1}</div>
                    <div className="history-content">
                      <div className="history-response">{response.choice}</div>
                      <div className="history-meta">
                        <span className={`history-type ${response.type}`}>{response.type}</span>
                        <span className={`history-score score-${response.score >= 8 ? 'high' : response.score >= 6 ? 'medium' : 'low'}`}>
                          +{response.score}分
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className={`achievements-tab ${animationStep >= 4 ? 'animate' : ''}`}>
            <div className="achievements-section">
              <h3 className="section-title">获得的成就徽章</h3>
              <div className="achievements-grid">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}>
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-info">
                      <div className="achievement-name">{achievement.name}</div>
                      <div className="achievement-description">{achievement.description}</div>
                    </div>
                    {achievement.earned && (
                      <div className="achievement-badge">
                        <Trophy size={16} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 下一步行动 */}
            <div className="next-actions">
              <h3 className="section-title">继续学习</h3>
              <div className="actions-grid">
                <button className="action-card" onClick={onRetry}>
                  <div className="action-icon">
                    <Target size={24} />
                  </div>
                  <div className="action-content">
                    <div className="action-title">重新挑战</div>
                    <div className="action-description">再次尝试这个场景，争取更高分数</div>
                  </div>
                  <ChevronRight size={16} className="action-arrow" />
                </button>
                
                <button className="action-card">
                  <div className="action-icon">
                    <Users size={24} />
                  </div>
                  <div className="action-content">
                    <div className="action-title">新场景训练</div>
                    <div className="action-description">尝试其他心理咨询场景</div>
                  </div>
                  <ChevronRight size={16} className="action-arrow" />
                </button>
                
                <button className="action-card">
                  <div className="action-icon">
                    <BookOpen size={24} />
                  </div>
                  <div className="action-content">
                    <div className="action-title">学习资源</div>
                    <div className="action-description">查看相关理论知识和案例</div>
                  </div>
                  <ChevronRight size={16} className="action-arrow" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentSystem;