import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Clock, Users, Target, Award, Star, BookOpen, ChevronRight } from 'lucide-react';
import DialogueEngine from './DialogueEngine';
import AssessmentSystem from './AssessmentSystem';
import './CounselorTraining.css';

const CounselorTraining = ({ onBack }) => {
  const [currentView, setCurrentView] = useState('overview'); // overview, training, assessment
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [gameState, setGameState] = useState({
    isActive: false,
    currentStep: 0,
    score: 0,
    timeElapsed: 0
  });
  const [userProgress, setUserProgress] = useState({
    completedScenarios: [],
    totalScore: 0,
    skillLevels: {
      empathy: 0,
      listening: 0,
      problemSolving: 0,
      communication: 0
    }
  });
  const [assessmentResults, setAssessmentResults] = useState(null);

  // 场景数据
  const scenarios = [
    {
      id: 'academic-stress',
      title: '学业压力咨询',
      description: '帮助学生处理学业焦虑和考试压力，学习有效的压力管理技巧。',
      difficulty: '初级',
      duration: '15-20分钟',
      skills: ['共情倾听', '压力评估', '放松技巧'],
      initialMessage: "老师，我最近总是睡不着觉，一想到期末考试就很焦虑，感觉压力特别大。",
      studentProfile: {
        name: "小王",
        grade: "大二",
        major: "计算机科学",
        background: "平时成绩中等，家庭期望较高"
      }
    },
    {
      id: 'social-anxiety',
      title: '社交焦虑辅导',
      description: '协助学生克服社交恐惧，建立健康的人际关系和社交技能。',
      difficulty: '中级',
      duration: '20-25分钟',
      skills: ['社交技能', '自信建立', '认知重构'],
      initialMessage: "我在班级里总感觉格格不入，不知道怎么和同学们交流，很害怕在人前说话。",
      studentProfile: {
        name: "小李",
        grade: "大一",
        major: "心理学",
        background: "性格内向，缺乏自信"
      }
    },
    {
      id: 'relationship-issues',
      title: '恋爱关系困扰',
      description: '处理学生的情感问题，提供健康的恋爱观念和沟通技巧指导。',
      difficulty: '中级',
      duration: '25-30分钟',
      skills: ['情感支持', '沟通技巧', '边界设定'],
      initialMessage: "老师，我和男朋友总是吵架，我觉得很累，不知道这段关系还要不要继续下去。",
      studentProfile: {
        name: "小张",
        grade: "大三",
        major: "文学",
        background: "情感经历较少，容易情绪化"
      }
    },
    {
      id: 'family-conflict',
      title: '家庭关系冲突',
      description: '帮助学生处理与家人的矛盾，改善家庭沟通模式。',
      difficulty: '高级',
      duration: '30-35分钟',
      skills: ['家庭治疗', '冲突调解', '系统思维'],
      initialMessage: "我和父母的关系越来越糟糕，他们总是不理解我，我感觉在家里很压抑。",
      studentProfile: {
        name: "小刘",
        grade: "大四",
        major: "工程学",
        background: "家庭期望与个人理想存在冲突"
      }
    },
    {
      id: 'depression-support',
      title: '抑郁情绪支持',
      description: '识别和支持有抑郁倾向的学生，提供专业的心理支持。',
      difficulty: '高级',
      duration: '35-40分钟',
      skills: ['抑郁识别', '危机干预', '资源转介'],
      initialMessage: "最近我总是感觉很累，对什么都提不起兴趣，觉得生活没有意义。",
      studentProfile: {
        name: "小陈",
        grade: "研一",
        major: "生物学",
        background: "学业压力大，社交圈子小"
      }
    }
  ];

  const startScenario = (scenario) => {
    setSelectedScenario(scenario);
    setCurrentView('training');
    setGameState({
      isActive: true,
      currentStep: 0,
      score: 0,
      timeElapsed: 0
    });
  };

  const handleTrainingComplete = (results) => {
    setAssessmentResults(results);
    setCurrentView('assessment');
    
    // 更新用户进度
    setUserProgress(prev => ({
      ...prev,
      completedScenarios: [...prev.completedScenarios, results.scenarioId],
      totalScore: prev.totalScore + results.score
    }));
  };

  const handleRetryScenario = () => {
    setCurrentView('training');
    setAssessmentResults(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '初级': return 'difficulty-beginner';
      case '中级': return 'difficulty-intermediate';
      case '高级': return 'difficulty-advanced';
      default: return 'difficulty-beginner';
    }
  };

  const isScenarioCompleted = (scenarioId) => {
    return userProgress.completedScenarios.includes(scenarioId);
  };

  return (
    <div className="counselor-training">
      {currentView === 'overview' && (
        <>
          {/* 头部 */}
          <div className="counselor-header">
            <div className="header-nav">
              <button className="back-button" onClick={onBack}>
                <ArrowLeft size={20} />
                返回
              </button>
              
              <div className="nav-tabs">
                <div className="nav-tab active">
                  <Target size={16} />
                  场景训练
                </div>
              </div>
            </div>
          </div>

          {/* 训练信息栏 */}
          <div className="training-info">
            <div className="info-content">
              <h1 className="training-title">辅导员心理健康技能训练</h1>
              <p className="training-description">
                通过真实场景模拟，提升心理健康辅导技能。每个场景都基于实际案例设计，
                帮助你在安全的环境中练习和改进辅导技巧。
              </p>
              
              <div className="training-stats">
                <div className="stat-item">
                  <div className="stat-number">{scenarios.length}</div>
                  <div className="stat-label">训练场景</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{userProgress.completedScenarios.length}</div>
                  <div className="stat-label">已完成</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{Math.round(userProgress.totalScore / Math.max(userProgress.completedScenarios.length, 1))}</div>
                  <div className="stat-label">平均分</div>
                </div>
              </div>
            </div>
          </div>

          {/* 场景列表 */}
          <div className="content-area">
            <div className="scenarios-grid">
              {scenarios.map((scenario, index) => (
                <div 
                  key={scenario.id} 
                  className={`scenario-card ${isScenarioCompleted(scenario.id) ? 'completed' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="scenario-header">
                    <h3 className="scenario-title">{scenario.title}</h3>
                    <div className={`difficulty-badge ${getDifficultyColor(scenario.difficulty)}`}>
                      {scenario.difficulty}
                    </div>
                  </div>
                  
                  <div className="scenario-description">
                    {scenario.description}
                  </div>
                  
                  <div className="scenario-meta">
                    <div className="meta-item">
                      <Clock size={14} />
                      <span>{scenario.duration}</span>
                    </div>
                    <div className="meta-item">
                      <Users size={14} />
                      <span>{scenario.studentProfile.name}</span>
                    </div>
                  </div>
                  
                  <div className="scenario-skills">
                    {scenario.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <div className="scenario-student">
                    <div className="student-info">
                      <div className="student-avatar">👤</div>
                      <div className="student-details">
                        <div className="student-name">{scenario.studentProfile.name}</div>
                        <div className="student-grade">{scenario.studentProfile.grade} · {scenario.studentProfile.major}</div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="start-scenario-btn"
                    onClick={() => startScenario(scenario)}
                  >
                    <Play size={16} />
                    {isScenarioCompleted(scenario.id) ? '重新训练' : '开始训练'}
                    <ChevronRight size={16} />
                  </button>
                  
                  {isScenarioCompleted(scenario.id) && (
                    <div className="completion-badge">
                      <Award size={16} />
                      已完成
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {currentView === 'training' && selectedScenario && (
        <DialogueEngine 
          scenario={selectedScenario}
          onComplete={handleTrainingComplete}
          onBack={() => setCurrentView('overview')}
        />
      )}
      
      {currentView === 'assessment' && assessmentResults && (
        <AssessmentSystem 
          results={assessmentResults}
          onBack={() => setCurrentView('overview')}
          onRetry={handleRetryScenario}
        />
      )}
    </div>
  );
};

export default CounselorTraining;