import React, { useState } from 'react';
import { Play, Clock, User, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import './ScenarioSelector.css';

const ScenarioSelector = ({ onSelectScenario, completedScenarios = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const scenarios = [
    {
      id: 'academic-stress',
      title: '学业压力过大',
      description: '学生因期末考试压力导致焦虑和失眠，需要进行心理疏导和压力管理指导。',
      category: 'stress',
      difficulty: '初级',
      duration: '15-20分钟',
      skills: ['倾听技巧', '共情能力', '压力管理'],
      studentProfile: {
        name: '小李',
        grade: '大二',
        major: '计算机科学',
        background: '成绩优秀但对自己要求过高，容易焦虑'
      },
      objectives: [
        '识别学生的压力源',
        '运用共情技巧建立信任',
        '提供有效的压力管理策略',
        '制定可行的学习计划'
      ],
      initialMessage: '老师，我最近感觉压力特别大，马上要期末考试了，我担心考不好，晚上总是睡不着觉。'
    },
    {
      id: 'social-anxiety',
      title: '社交焦虑障碍',
      description: '学生在社交场合感到极度不安和恐惧，影响正常的学习和生活。',
      category: 'anxiety',
      difficulty: '中级',
      duration: '20-25分钟',
      skills: ['心理评估', '认知重构', '行为干预'],
      studentProfile: {
        name: '小王',
        grade: '大一',
        major: '心理学',
        background: '性格内向，害怕在人前表现，有社交回避倾向'
      },
      objectives: [
        '评估社交焦虑的严重程度',
        '识别认知偏差和负性思维',
        '制定渐进式暴露计划',
        '教授放松技巧'
      ],
      initialMessage: '老师，我在班级里总是不敢发言，每次要做presentation就紧张得要命，感觉大家都在看我的笑话。'
    },
    {
      id: 'depression',
      title: '抑郁倾向识别',
      description: '识别和处理学生的抑郁情绪和自伤倾向，需要高度的专业技能。',
      category: 'depression',
      difficulty: '高级',
      duration: '25-30分钟',
      skills: ['危机识别', '自杀评估', '转介技巧'],
      studentProfile: {
        name: '小张',
        grade: '大三',
        major: '文学',
        background: '最近情绪低落，有自我伤害想法，需要紧急关注'
      },
      objectives: [
        '评估自杀风险等级',
        '建立安全计划',
        '提供情感支持',
        '安排专业转介'
      ],
      initialMessage: '老师，我觉得活着没什么意思，每天都很累，什么都不想做...'
    },
    {
      id: 'family-issues',
      title: '家庭关系问题',
      description: '学生因家庭矛盾影响学习和生活，需要家庭治疗技巧。',
      category: 'family',
      difficulty: '中级',
      duration: '20-25分钟',
      skills: ['家庭治疗', '边界设定', '资源整合'],
      studentProfile: {
        name: '小陈',
        grade: '大二',
        major: '经济学',
        background: '父母离异，与继父关系紧张，情绪不稳定'
      },
      objectives: [
        '了解家庭动力学',
        '帮助设定健康边界',
        '提供情感支持',
        '整合社会资源'
      ],
      initialMessage: '老师，我爸妈离婚后，我妈又找了新的男朋友，我觉得在家里很不自在，不知道该怎么办。'
    },
    {
      id: 'identity-crisis',
      title: '自我认同危机',
      description: '学生对专业选择和未来发展感到迷茫，需要生涯规划指导。',
      category: 'identity',
      difficulty: '中级',
      duration: '20-25分钟',
      skills: ['生涯规划', '价值澄清', '决策支持'],
      studentProfile: {
        name: '小刘',
        grade: '大二',
        major: '工程学',
        background: '对专业不感兴趣，对未来职业发展感到困惑'
      },
      objectives: [
        '探索个人兴趣和价值观',
        '分析专业和职业匹配度',
        '制定生涯发展计划',
        '提升决策能力'
      ],
      initialMessage: '老师，我觉得我选错专业了，对现在学的东西一点兴趣都没有，不知道以后能做什么工作。'
    },
    {
      id: 'relationship-conflict',
      title: '人际关系冲突',
      description: '学生在宿舍或班级中遇到人际关系问题，影响心理健康。',
      category: 'relationship',
      difficulty: '初级',
      duration: '15-20分钟',
      skills: ['沟通技巧', '冲突解决', '情绪管理'],
      studentProfile: {
        name: '小赵',
        grade: '大一',
        major: '管理学',
        background: '与室友关系紧张，经常发生争执'
      },
      objectives: [
        '分析冲突的根本原因',
        '教授有效沟通技巧',
        '制定冲突解决策略',
        '提升情绪管理能力'
      ],
      initialMessage: '老师，我和室友总是吵架，她们好像都不喜欢我，我觉得很孤独。'
    }
  ];

  const categories = [
    { id: 'all', name: '全部场景', icon: '🎯' },
    { id: 'stress', name: '压力管理', icon: '😰' },
    { id: 'anxiety', name: '焦虑障碍', icon: '😨' },
    { id: 'depression', name: '抑郁情绪', icon: '😔' },
    { id: 'family', name: '家庭问题', icon: '👨‍👩‍👧‍👦' },
    { id: 'identity', name: '认同危机', icon: '🤔' },
    { id: 'relationship', name: '人际关系', icon: '👥' }
  ];

  const difficulties = [
    { id: 'all', name: '全部难度' },
    { id: '初级', name: '初级' },
    { id: '中级', name: '中级' },
    { id: '高级', name: '高级' }
  ];

  const filteredScenarios = scenarios.filter(scenario => {
    const categoryMatch = selectedCategory === 'all' || scenario.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || scenario.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '初级': return 'from-green-500 to-emerald-600';
      case '中级': return 'from-yellow-500 to-orange-600';
      case '高级': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const isCompleted = (scenarioId) => completedScenarios.includes(scenarioId);

  return (
    <div className="scenario-selector">
      <div className="selector-header">
        <h2 className="selector-title gradient-text">选择训练场景</h2>
        <p className="selector-subtitle">
          选择一个心理健康辅导场景开始训练，每个场景都有不同的挑战和学习目标
        </p>
      </div>

      {/* 筛选器 */}
      <div className="filters-section">
        <div className="filter-group">
          <label className="filter-label">场景类别</label>
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${
                  selectedCategory === category.id ? 'active' : ''
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">难度等级</label>
          <div className="difficulty-filters">
            {difficulties.map(difficulty => (
              <button
                key={difficulty.id}
                className={`difficulty-btn ${
                  selectedDifficulty === difficulty.id ? 'active' : ''
                }`}
                onClick={() => setSelectedDifficulty(difficulty.id)}
              >
                {difficulty.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 场景列表 */}
      <div className="scenarios-list">
        {filteredScenarios.map((scenario, index) => (
          <div 
            key={scenario.id} 
            className={`scenario-item ${
              isCompleted(scenario.id) ? 'completed' : ''
            } animate-slide-in-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="scenario-header">
              <div className="scenario-title-section">
                <h3 className="scenario-title">{scenario.title}</h3>
                <div className="scenario-meta">
                  <span className={`difficulty-badge bg-gradient-to-r ${getDifficultyColor(scenario.difficulty)}`}>
                    {scenario.difficulty}
                  </span>
                  <div className="duration-info">
                    <Clock size={16} />
                    <span>{scenario.duration}</span>
                  </div>
                  {isCompleted(scenario.id) && (
                    <div className="completed-badge">
                      <CheckCircle size={16} />
                      <span>已完成</span>
                    </div>
                  )}
                </div>
              </div>
              
              {scenario.difficulty === '高级' && (
                <div className="warning-badge">
                  <AlertTriangle size={16} />
                  <span>高风险场景</span>
                </div>
              )}
            </div>

            <p className="scenario-description">{scenario.description}</p>

            <div className="scenario-details">
              <div className="student-info">
                <div className="info-header">
                  <User size={16} />
                  <span>学生信息</span>
                </div>
                <div className="student-profile">
                  <div className="profile-item">
                    <span className="profile-label">姓名:</span>
                    <span className="profile-value">{scenario.studentProfile.name}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">年级:</span>
                    <span className="profile-value">{scenario.studentProfile.grade}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">专业:</span>
                    <span className="profile-value">{scenario.studentProfile.major}</span>
                  </div>
                  <div className="profile-background">
                    <span className="profile-label">背景:</span>
                    <span className="profile-value">{scenario.studentProfile.background}</span>
                  </div>
                </div>
              </div>

              <div className="skills-section">
                <div className="skills-header">
                  <Star size={16} />
                  <span>训练技能</span>
                </div>
                <div className="skills-tags">
                  {scenario.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="objectives-section">
                <div className="objectives-header">
                  <span>学习目标</span>
                </div>
                <ul className="objectives-list">
                  {scenario.objectives.map((objective, idx) => (
                    <li key={idx} className="objective-item">
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="scenario-actions">
              <button 
                className="start-scenario-btn hover-scale"
                onClick={() => onSelectScenario(scenario)}
              >
                <Play size={18} />
                <span>{isCompleted(scenario.id) ? '重新开始' : '开始训练'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredScenarios.length === 0 && (
        <div className="no-scenarios">
          <div className="no-scenarios-icon">🔍</div>
          <h3>没有找到匹配的场景</h3>
          <p>请尝试调整筛选条件</p>
        </div>
      )}
    </div>
  );
};

export default ScenarioSelector;