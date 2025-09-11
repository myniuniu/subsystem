import React, { useState, useEffect } from 'react';
import { Play, Users, BookOpen, BarChart3, Settings, Award, Clock, Target } from 'lucide-react';
import CounselorTraining from './CounselorTraining';
import ResourceLibrary from './ResourceLibrary';
import AssessmentSystem from './AssessmentSystem';
import './SimulationCenter.css';
import './Animations.css';

const SimulationCenter = () => {
  const [currentModule, setCurrentModule] = useState('overview'); // overview, training, resources, assessment
  const [userProgress, setUserProgress] = useState({
    completedScenarios: 0,
    totalScore: 0,
    skillLevels: {
      empathy: 65,
      listening: 78,
      problemIdentification: 72,
      intervention: 58,
      ethics: 85
    },
    achievements: [
      { id: 1, name: '初级咨询师', description: '完成5个基础场景', unlocked: true },
      { id: 2, name: '共情专家', description: '共情技能达到80分', unlocked: false },
      { id: 3, name: '危机干预师', description: '成功处理3个危机场景', unlocked: false }
    ]
  });

  const modules = [
    {
      id: 'training',
      title: '技能训练',
      description: '心理健康辅导技能实战训练',
      icon: Users,
      color: 'from-blue-500 to-purple-600',
      features: ['情景模拟', '智能对话', '实时反馈']
    },
    {
      id: 'resources',
      title: '资源库',
      description: '心理健康知识与案例资源',
      icon: BookOpen,
      color: 'from-green-500 to-teal-600',
      features: ['知识库', '案例库', '工具库']
    },
    {
      id: 'assessment',
      title: '评估系统',
      description: '技能水平评估与分析报告',
      icon: BarChart3,
      color: 'from-orange-500 to-red-600',
      features: ['技能评估', '进度跟踪', '个性化建议']
    }
  ];

  // 模拟评估结果数据
  const mockAssessmentResults = {
    score: 82,
    duration: 1200, // 20分钟，以秒为单位
    scenarioId: 'scenario_001',
    completedAt: new Date().toISOString(),
    skillScores: {
      empathy: 8.5,
      listening: 7.8,
      problemIdentification: 7.2,
      intervention: 6.8,
      ethics: 9.0
    },
    responses: [
      {
        step: 0,
        choice: '我理解你现在的感受，这确实是一个困难的情况。',
        type: 'empathy',
        score: 8
      },
      {
        step: 1,
        choice: '能告诉我更多关于这个问题的细节吗？',
        type: 'listening',
        score: 7
      },
      {
        step: 2,
        choice: '让我们一起分析一下可能的解决方案。',
        type: 'intervention',
        score: 6
      }
    ]
  };

  const renderModuleContent = () => {
    switch (currentModule) {
      case 'training':
        return <CounselorTraining onBack={() => setCurrentModule('overview')} />;
      case 'resources':
        return <ResourceLibrary onBack={() => setCurrentModule('overview')} />;
      case 'assessment':
        return <AssessmentSystem 
          results={mockAssessmentResults}
          onBack={() => setCurrentModule('overview')} 
          onRetry={() => setCurrentModule('training')}
        />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="simulation-overview animate-fade-in">
      {/* 系统标题 */}
      <div className="system-header animate-fade-in-down">
        <div className="header-content">
          <div className="title-section">
            <h1 className="system-title gradient-text">
              场景模拟仿真系统
            </h1>
            <p className="system-subtitle">
              基于人工智能的心理健康辅导技能训练平台
            </p>
          </div>
          <div className="system-stats">
            <div className="stat-item hover-scale">
              <Target className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">{userProgress.completedScenarios}</span>
                <span className="stat-label">完成场景</span>
              </div>
            </div>
            <div className="stat-item hover-scale">
              <Award className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">{userProgress.totalScore}</span>
                <span className="stat-label">总分</span>
              </div>
            </div>
            <div className="stat-item hover-scale">
              <Clock className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">24</span>
                <span className="stat-label">学习时长(h)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 功能模块 */}
      <div className="modules-grid">
        {modules.map((module, index) => {
          const IconComponent = module.icon;
          return (
            <div 
              key={module.id} 
              className={`module-card hover-lift animate-slide-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setCurrentModule(module.id)}
            >
              <div className="module-header">
                <div className={`module-icon bg-gradient-to-br ${module.color}`}>
                  <IconComponent size={32} />
                </div>
                <div className="module-info">
                  <h3 className="module-title">{module.title}</h3>
                  <p className="module-description">{module.description}</p>
                </div>
              </div>
              
              <div className="module-features">
                {module.features.map((feature, idx) => (
                  <span key={idx} className="feature-tag">
                    {feature}
                  </span>
                ))}
              </div>
              
              <div className="module-action">
                <button className="enter-module-btn">
                  <Play size={16} />
                  进入模块
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 技能雷达图 */}
      <div className="skills-overview animate-fade-in-up">
        <h2 className="section-title gradient-text">技能水平概览</h2>
        <div className="skills-grid">
          {Object.entries(userProgress.skillLevels).map(([skill, level]) => {
            const skillNames = {
              empathy: '共情能力',
              listening: '倾听技巧',
              problemIdentification: '问题识别',
              intervention: '干预技巧',
              ethics: '职业伦理'
            };
            
            return (
              <div key={skill} className="skill-item hover-scale">
                <div className="skill-header">
                  <span className="skill-name">{skillNames[skill]}</span>
                  <span className="skill-score">{level}%</span>
                </div>
                <div className="skill-progress">
                  <div 
                    className="skill-progress-fill"
                    style={{ width: `${level}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 成就系统 */}
      <div className="achievements-section animate-fade-in-up">
        <h2 className="section-title gradient-text">成就徽章</h2>
        <div className="achievements-grid">
          {userProgress.achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'} hover-scale`}
            >
              <div className="achievement-icon">
                <Award size={24} />
              </div>
              <div className="achievement-info">
                <h4 className="achievement-name">{achievement.name}</h4>
                <p className="achievement-description">{achievement.description}</p>
              </div>
              {achievement.unlocked && (
                <div className="achievement-badge">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="simulation-center">
      {renderModuleContent()}
    </div>
  );
};

export default SimulationCenter;