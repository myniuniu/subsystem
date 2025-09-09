import React, { useState, useEffect } from 'react';
import './LessonObservation.css';

const LessonObservation = () => {
  const [activeTab, setActiveTab] = useState('observation');
  const [currentObservation, setCurrentObservation] = useState(null);
  const [observations, setObservations] = useState([
    {
      id: 1,
      teacher: '张老师',
      subject: '数学',
      grade: '五年级',
      topic: '分数的加减法',
      date: '2024-01-15',
      time: '09:00-09:45',
      status: '已完成',
      score: 85,
      observer: '李主任'
    },
    {
      id: 2,
      teacher: '王老师',
      subject: '语文',
      grade: '三年级',
      topic: '古诗词鉴赏',
      date: '2024-01-14',
      time: '14:00-14:45',
      status: '进行中',
      score: null,
      observer: '陈校长'
    }
  ]);

  const [observationForm, setObservationForm] = useState({
    teacher: '',
    subject: '',
    grade: '',
    topic: '',
    date: '',
    time: '',
    observer: ''
  });

  const [evaluationCriteria] = useState([
    {
      category: '教学目标',
      items: [
        { id: 'goal_clarity', name: '目标明确性', weight: 10, score: 0 },
        { id: 'goal_achievability', name: '目标可达性', weight: 10, score: 0 }
      ]
    },
    {
      category: '教学内容',
      items: [
        { id: 'content_accuracy', name: '内容准确性', weight: 15, score: 0 },
        { id: 'content_logic', name: '逻辑性', weight: 10, score: 0 },
        { id: 'content_depth', name: '深度适宜', weight: 10, score: 0 }
      ]
    },
    {
      category: '教学方法',
      items: [
        { id: 'method_diversity', name: '方法多样性', weight: 15, score: 0 },
        { id: 'method_effectiveness', name: '方法有效性', weight: 15, score: 0 }
      ]
    },
    {
      category: '师生互动',
      items: [
        { id: 'interaction_frequency', name: '互动频率', weight: 10, score: 0 },
        { id: 'interaction_quality', name: '互动质量', weight: 15, score: 0 }
      ]
    }
  ]);

  const [currentEvaluation, setCurrentEvaluation] = useState(evaluationCriteria);
  const [observationNotes, setObservationNotes] = useState('');
  const [suggestions, setSuggestions] = useState('');

  const handleStartObservation = () => {
    if (!observationForm.teacher || !observationForm.subject || !observationForm.topic) {
      alert('请填写必要的听课信息');
      return;
    }

    const newObservation = {
      id: Date.now(),
      ...observationForm,
      status: '进行中',
      score: null
    };

    setObservations(prev => [newObservation, ...prev]);
    setCurrentObservation(newObservation);
    setActiveTab('evaluation');
    
    // 重置表单
    setObservationForm({
      teacher: '',
      subject: '',
      grade: '',
      topic: '',
      date: '',
      time: '',
      observer: ''
    });
  };

  const handleScoreChange = (categoryIndex, itemIndex, score) => {
    const updatedEvaluation = [...currentEvaluation];
    updatedEvaluation[categoryIndex].items[itemIndex].score = parseInt(score);
    setCurrentEvaluation(updatedEvaluation);
  };

  const calculateTotalScore = () => {
    let totalScore = 0;
    currentEvaluation.forEach(category => {
      category.items.forEach(item => {
        totalScore += (item.score * item.weight) / 100;
      });
    });
    return Math.round(totalScore);
  };

  const handleCompleteEvaluation = () => {
    if (!currentObservation) return;

    const totalScore = calculateTotalScore();
    const updatedObservations = observations.map(obs => 
      obs.id === currentObservation.id 
        ? { ...obs, status: '已完成', score: totalScore }
        : obs
    );

    setObservations(updatedObservations);
    setCurrentObservation(null);
    
    // 重置评价表单
    setCurrentEvaluation(evaluationCriteria.map(category => ({
      ...category,
      items: category.items.map(item => ({ ...item, score: 0 }))
    })));
    setObservationNotes('');
    setSuggestions('');
    
    alert('听课评价已完成！');
    setActiveTab('history');
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#27ae60';
    if (score >= 80) return '#f39c12';
    if (score >= 70) return '#e67e22';
    return '#e74c3c';
  };

  const getScoreLevel = (score) => {
    if (score >= 90) return '优秀';
    if (score >= 80) return '良好';
    if (score >= 70) return '中等';
    return '待改进';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'observation':
        return (
          <div className="observation-setup">
            <h3>新建听课记录</h3>
            <div className="setup-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>授课教师 *</label>
                  <input
                    type="text"
                    value={observationForm.teacher}
                    onChange={(e) => setObservationForm({...observationForm, teacher: e.target.value})}
                    placeholder="请输入教师姓名"
                  />
                </div>
                <div className="form-group">
                  <label>学科 *</label>
                  <select
                    value={observationForm.subject}
                    onChange={(e) => setObservationForm({...observationForm, subject: e.target.value})}
                  >
                    <option value="">请选择学科</option>
                    <option value="语文">语文</option>
                    <option value="数学">数学</option>
                    <option value="英语">英语</option>
                    <option value="物理">物理</option>
                    <option value="化学">化学</option>
                    <option value="生物">生物</option>
                    <option value="历史">历史</option>
                    <option value="地理">地理</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>年级</label>
                  <select
                    value={observationForm.grade}
                    onChange={(e) => setObservationForm({...observationForm, grade: e.target.value})}
                  >
                    <option value="">请选择年级</option>
                    <option value="一年级">一年级</option>
                    <option value="二年级">二年级</option>
                    <option value="三年级">三年级</option>
                    <option value="四年级">四年级</option>
                    <option value="五年级">五年级</option>
                    <option value="六年级">六年级</option>
                    <option value="七年级">七年级</option>
                    <option value="八年级">八年级</option>
                    <option value="九年级">九年级</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>课程主题 *</label>
                  <input
                    type="text"
                    value={observationForm.topic}
                    onChange={(e) => setObservationForm({...observationForm, topic: e.target.value})}
                    placeholder="请输入课程主题"
                  />
                </div>
                <div className="form-group">
                  <label>听课日期</label>
                  <input
                    type="date"
                    value={observationForm.date}
                    onChange={(e) => setObservationForm({...observationForm, date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>听课时间</label>
                  <input
                    type="text"
                    value={observationForm.time}
                    onChange={(e) => setObservationForm({...observationForm, time: e.target.value})}
                    placeholder="如：09:00-09:45"
                  />
                </div>
                <div className="form-group">
                  <label>听课人</label>
                  <input
                    type="text"
                    value={observationForm.observer}
                    onChange={(e) => setObservationForm({...observationForm, observer: e.target.value})}
                    placeholder="请输入听课人姓名"
                  />
                </div>
              </div>
              <button onClick={handleStartObservation} className="start-observation-btn">
                开始听课
              </button>
            </div>
          </div>
        );

      case 'evaluation':
        return (
          <div className="evaluation-form">
            <h3>课堂评价</h3>
            {currentObservation && (
              <div className="current-lesson-info">
                <h4>{currentObservation.teacher} - {currentObservation.subject} - {currentObservation.topic}</h4>
              </div>
            )}
            
            <div className="evaluation-criteria">
              {currentEvaluation.map((category, categoryIndex) => (
                <div key={categoryIndex} className="criteria-category">
                  <h4>{category.category}</h4>
                  <div className="criteria-items">
                    {category.items.map((item, itemIndex) => (
                      <div key={item.id} className="criteria-item">
                        <div className="item-info">
                          <span className="item-name">{item.name}</span>
                          <span className="item-weight">权重: {item.weight}%</span>
                        </div>
                        <div className="score-input">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={item.score}
                            onChange={(e) => handleScoreChange(categoryIndex, itemIndex, e.target.value)}
                            className="score-slider"
                          />
                          <span className="score-value">{item.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="observation-notes">
              <h4>听课记录</h4>
              <textarea
                value={observationNotes}
                onChange={(e) => setObservationNotes(e.target.value)}
                placeholder="请记录课堂观察要点、教学亮点、学生反应等..."
                rows="6"
              />
            </div>

            <div className="suggestions">
              <h4>改进建议</h4>
              <textarea
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="请提出具体的教学改进建议..."
                rows="4"
              />
            </div>

            <div className="evaluation-summary">
              <div className="total-score">
                <span>总分: </span>
                <span className="score" style={{ color: getScoreColor(calculateTotalScore()) }}>
                  {calculateTotalScore()}
                </span>
                <span className="level">({getScoreLevel(calculateTotalScore())})</span>
              </div>
              <button onClick={handleCompleteEvaluation} className="complete-btn">
                完成评价
              </button>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="observation-history">
            <h3>听课记录</h3>
            <div className="history-list">
              {observations.map((obs) => (
                <div key={obs.id} className="history-item">
                  <div className="lesson-info">
                    <div className="lesson-header">
                      <h4>{obs.teacher} - {obs.subject}</h4>
                      <span className={`status ${obs.status === '已完成' ? 'completed' : 'in-progress'}`}>
                        {obs.status}
                      </span>
                    </div>
                    <div className="lesson-details">
                      <p><strong>年级:</strong> {obs.grade}</p>
                      <p><strong>主题:</strong> {obs.topic}</p>
                      <p><strong>时间:</strong> {obs.date} {obs.time}</p>
                      <p><strong>听课人:</strong> {obs.observer}</p>
                    </div>
                  </div>
                  {obs.score !== null && (
                    <div className="lesson-score">
                      <div 
                        className="score-circle"
                        style={{ borderColor: getScoreColor(obs.score) }}
                      >
                        <span style={{ color: getScoreColor(obs.score) }}>{obs.score}</span>
                      </div>
                      <span className="score-level">{getScoreLevel(obs.score)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="observation-analytics">
            <h3>听课分析报告</h3>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h4>听课统计</h4>
                <div className="stats">
                  <div className="stat-item">
                    <span className="stat-number">{observations.length}</span>
                    <span className="stat-label">总听课次数</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {observations.filter(obs => obs.status === '已完成').length}
                    </span>
                    <span className="stat-label">已完成评价</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {observations.filter(obs => obs.score >= 85).length}
                    </span>
                    <span className="stat-label">优秀课程</span>
                  </div>
                </div>
              </div>
              
              <div className="analytics-card">
                <h4>平均分数趋势</h4>
                <div className="trend-chart">
                  {observations.filter(obs => obs.score !== null).map((obs, index) => (
                    <div key={obs.id} className="trend-item">
                      <div className="trend-bar">
                        <div 
                          className="trend-fill"
                          style={{ 
                            height: `${obs.score}%`,
                            backgroundColor: getScoreColor(obs.score)
                          }}
                        ></div>
                      </div>
                      <span className="trend-label">{obs.teacher}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="analytics-card full-width">
                <h4>改进建议汇总</h4>
                <div className="improvement-suggestions">
                  <div className="suggestion-category">
                    <h5>教学方法优化</h5>
                    <ul>
                      <li>增加互动环节，提高学生参与度</li>
                      <li>运用多媒体教学，丰富教学手段</li>
                      <li>关注学生个体差异，实施分层教学</li>
                    </ul>
                  </div>
                  <div className="suggestion-category">
                    <h5>课堂管理提升</h5>
                    <ul>
                      <li>合理安排教学时间，确保重点突出</li>
                      <li>加强课堂纪律管理，营造良好学习氛围</li>
                      <li>及时反馈学生表现，激发学习积极性</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="lesson-observation">
      <div className="observation-header">
        <h2>听课评课</h2>
        <p>专业的课堂观察与教学评价工具</p>
      </div>

      <div className="observation-tabs">
        <button 
          className={`tab-button ${activeTab === 'observation' ? 'active' : ''}`}
          onClick={() => setActiveTab('observation')}
        >
          新建听课
        </button>
        <button 
          className={`tab-button ${activeTab === 'evaluation' ? 'active' : ''}`}
          onClick={() => setActiveTab('evaluation')}
          disabled={!currentObservation}
        >
          课堂评价
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          听课记录
        </button>
        <button 
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          分析报告
        </button>
      </div>

      <div className="observation-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default LessonObservation;