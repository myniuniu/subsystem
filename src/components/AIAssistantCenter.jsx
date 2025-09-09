import React, { useState, useRef, useEffect } from 'react';
import './AIAssistantCenter.css';

const AIAssistantCenter = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: '您好！我是您的AI教研助手，可以帮助您进行课程设计、教学资源生成、学情分析等工作。请问今天需要什么帮助？',
      timestamp: '09:00:15'
    },
    {
      id: 2,
      type: 'user',
      content: '我需要为初中数学设计一节关于二次函数的课程',
      timestamp: '09:01:22'
    },
    {
      id: 3,
      type: 'assistant',
      content: '好的！二次函数是初中数学的重要内容。我建议从以下几个方面来设计：\n1. 从实际问题引入二次函数概念\n2. 讲解二次函数的图像特征\n3. 分析顶点、对称轴等关键要素\n4. 结合实际应用加深理解\n\n您希望重点讲解哪个方面？',
      timestamp: '09:01:45'
    },
    {
      id: 4,
      type: 'user',
      content: '重点讲解二次函数的图像特征和性质',
      timestamp: '09:02:10'
    },
    {
      id: 5,
      type: 'assistant',
      content: '很好的选择！二次函数图像特征教学建议：\n\n**教学重点：**\n- 抛物线的开口方向与a的关系\n- 顶点坐标的求法\n- 对称轴方程\n- 函数的增减性\n\n**教学方法：**\n- 使用几何画板动态演示\n- 让学生观察参数变化对图像的影响\n- 通过对比不同函数图像加深理解\n\n需要我为您生成完整的教案吗？',
      timestamp: '09:02:35'
    },
    {
      id: 6,
      type: 'user',
      content: '如何提高学生的课堂参与度？',
      timestamp: '09:15:20'
    },
    {
      id: 7,
      type: 'assistant',
      content: '提高课堂参与度的有效策略：\n\n**互动技巧：**\n- 设置小组讨论环节\n- 使用问答抢答形式\n- 引入游戏化教学元素\n\n**技术辅助：**\n- 使用投票器或手机APP实时反馈\n- 多媒体展示增加视觉吸引力\n\n**激励机制：**\n- 建立积分奖励系统\n- 及时给予正面反馈\n- 鼓励学生提出问题',
      timestamp: '09:15:42'
    },
    {
      id: 8,
      type: 'user',
      content: '帮我分析一下这次期中考试的成绩分布',
      timestamp: '10:30:15'
    },
    {
      id: 9,
      type: 'assistant',
      content: '根据您提供的数据分析：\n\n**成绩分布：**\n- 优秀(90-100分): 25%\n- 良好(80-89分): 35%\n- 中等(70-79分): 30%\n- 待提高(60-69分): 10%\n\n**分析建议：**\n- 整体成绩良好，大部分学生达到预期\n- 需要关注待提高学生群体\n- 可以实施分层教学策略\n- 建议加强基础知识巩固',
      timestamp: '10:30:38'
    },
    {
      id: 10,
      type: 'user',
      content: '推荐一些适合高中生物课的实验教学资源',
      timestamp: '14:20:10'
    },
    {
      id: 11,
      type: 'assistant',
      content: '为您推荐以下生物实验教学资源：\n\n**虚拟实验平台：**\n- 细胞分裂观察模拟实验\n- DNA提取虚拟实验\n- 酶活性测定仿真实验\n\n**实体实验套件：**\n- 显微镜观察标本制作\n- 植物组织培养实验\n- 微生物培养实验\n\n**多媒体资源：**\n- 3D细胞结构动画\n- 生理过程演示视频\n- 互动式实验操作指南',
      timestamp: '14:20:35'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [lessonPlanForm, setLessonPlanForm] = useState({
    subject: '',
    grade: '',
    topic: '',
    duration: '45',
    objectives: '',
    keyPoints: ''
  });

  const [analysisData, setAnalysisData] = useState({
    studentPerformance: [
      { name: '优秀', value: 25, color: '#4CAF50' },
      { name: '良好', value: 35, color: '#2196F3' },
      { name: '中等', value: 30, color: '#FF9800' },
      { name: '待提高', value: 10, color: '#F44336' }
    ],
    subjectAnalysis: [
      { subject: '数学', score: 85 },
      { subject: '语文', score: 78 },
      { subject: '英语', score: 82 },
      { subject: '科学', score: 79 }
    ]
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // 模拟AI响应
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (input) => {
    const responses = {
      '课程设计': '我可以帮您设计课程大纲。请告诉我具体的学科、年级和教学目标，我会为您生成详细的课程设计方案。',
      '教案': '我来帮您生成教案。请在左侧的"教案生成"标签页中填写相关信息，我会为您创建完整的教案模板。',
      '学情分析': '根据当前数据分析，建议重点关注待提高学生群体，可以通过差异化教学策略来提升整体教学效果。',
      '资源推荐': '基于您的教学需求，我推荐以下资源：多媒体课件、互动练习题库、教学视频素材等。'
    };

    for (const [key, response] of Object.entries(responses)) {
      if (input.includes(key)) {
        return response;
      }
    }

    return '感谢您的提问！我正在分析您的需求，请稍等片刻。如果您需要帮助，可以询问关于课程设计、教案生成、学情分析或资源推荐等方面的问题。';
  };

  const handleGenerateLessonPlan = () => {
    const { subject, grade, topic, duration, objectives, keyPoints } = lessonPlanForm;
    
    if (!subject || !grade || !topic) {
      alert('请填写必要的课程信息');
      return;
    }

    const generatedPlan = `
# ${subject} 教案 - ${topic}

## 基本信息
- **年级**: ${grade}
- **课时**: ${duration}分钟
- **主题**: ${topic}

## 教学目标
${objectives || '培养学生对' + topic + '的理解和应用能力'}

## 重点难点
${keyPoints || topic + '的核心概念和实际应用'}

## 教学过程

### 1. 导入环节 (5分钟)
- 复习相关知识点
- 引入新课主题

### 2. 新课讲授 (25分钟)
- 概念讲解
- 示例演示
- 互动讨论

### 3. 练习巩固 (10分钟)
- 课堂练习
- 学生展示

### 4. 总结反思 (5分钟)
- 知识梳理
- 布置作业

## 教学反思
待课后补充...
    `;

    const aiMessage = {
      id: Date.now(),
      type: 'assistant',
      content: `已为您生成${subject}教案：\n\n${generatedPlan}`,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, aiMessage]);
    setActiveTab('chat');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="chat-container">
            <div className="messages-container">
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.type}`}>
                  <div className="message-content">
                    <div className="message-text">{message.content}</div>
                    <div className="message-time">{message.timestamp}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message assistant">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="input-container">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="请输入您的问题..."
                className="message-input"
              />
              <button onClick={handleSendMessage} className="send-button">
                发送
              </button>
            </div>
          </div>
        );

      case 'lesson-plan':
        return (
          <div className="lesson-plan-generator">
            <h3>AI教案生成器</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>学科 *</label>
                <select
                  value={lessonPlanForm.subject}
                  onChange={(e) => setLessonPlanForm({...lessonPlanForm, subject: e.target.value})}
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
                <label>年级 *</label>
                <select
                  value={lessonPlanForm.grade}
                  onChange={(e) => setLessonPlanForm({...lessonPlanForm, grade: e.target.value})}
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
                  value={lessonPlanForm.topic}
                  onChange={(e) => setLessonPlanForm({...lessonPlanForm, topic: e.target.value})}
                  placeholder="请输入课程主题"
                />
              </div>
              <div className="form-group">
                <label>课时时长</label>
                <select
                  value={lessonPlanForm.duration}
                  onChange={(e) => setLessonPlanForm({...lessonPlanForm, duration: e.target.value})}
                >
                  <option value="40">40分钟</option>
                  <option value="45">45分钟</option>
                  <option value="50">50分钟</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>教学目标</label>
                <textarea
                  value={lessonPlanForm.objectives}
                  onChange={(e) => setLessonPlanForm({...lessonPlanForm, objectives: e.target.value})}
                  placeholder="请描述本课的教学目标"
                  rows="3"
                />
              </div>
              <div className="form-group full-width">
                <label>重点难点</label>
                <textarea
                  value={lessonPlanForm.keyPoints}
                  onChange={(e) => setLessonPlanForm({...lessonPlanForm, keyPoints: e.target.value})}
                  placeholder="请描述本课的重点和难点"
                  rows="3"
                />
              </div>
            </div>
            <button onClick={handleGenerateLessonPlan} className="generate-button">
              生成教案
            </button>
          </div>
        );

      case 'analysis':
        return (
          <div className="analysis-dashboard">
            <h3>学情分析报告</h3>
            <div className="analysis-grid">
              <div className="analysis-card">
                <h4>学生表现分布</h4>
                <div className="performance-chart">
                  {analysisData.studentPerformance.map((item, index) => (
                    <div key={index} className="performance-item">
                      <div className="performance-bar">
                        <div 
                          className="performance-fill"
                          style={{ 
                            width: `${item.value}%`, 
                            backgroundColor: item.color 
                          }}
                        ></div>
                      </div>
                      <div className="performance-label">
                        <span>{item.name}</span>
                        <span>{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="analysis-card">
                <h4>各科成绩分析</h4>
                <div className="subject-scores">
                  {analysisData.subjectAnalysis.map((item, index) => (
                    <div key={index} className="subject-item">
                      <span className="subject-name">{item.subject}</span>
                      <div className="score-bar">
                        <div 
                          className="score-fill"
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                      <span className="score-value">{item.score}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="analysis-card full-width">
                <h4>AI分析建议</h4>
                <div className="suggestions">
                  <div className="suggestion-item">
                    <strong>教学策略建议：</strong>
                    <p>建议采用分层教学方法，针对不同水平的学生制定个性化学习计划。</p>
                  </div>
                  <div className="suggestion-item">
                    <strong>重点关注：</strong>
                    <p>10%的待提高学生需要额外辅导，建议增加课后答疑时间。</p>
                  </div>
                  <div className="suggestion-item">
                    <strong>优化方向：</strong>
                    <p>数学成绩相对较高，可作为优势学科带动其他学科发展。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="resources-recommendation">
            <h3>智能资源推荐</h3>
            <div className="resources-grid">
              <div className="resource-category">
                <h4>课件模板</h4>
                <div className="resource-list">
                  <div className="resource-item">
                    <div className="resource-icon">📊</div>
                    <div className="resource-info">
                      <h5>数学函数课件模板</h5>
                      <p>适用于高中数学函数教学</p>
                    </div>
                    <button className="download-btn">下载</button>
                  </div>
                  <div className="resource-item">
                    <div className="resource-icon">📝</div>
                    <div className="resource-info">
                      <h5>语文阅读理解模板</h5>
                      <p>提升学生阅读分析能力</p>
                    </div>
                    <button className="download-btn">下载</button>
                  </div>
                </div>
              </div>
              <div className="resource-category">
                <h4>教学视频</h4>
                <div className="resource-list">
                  <div className="resource-item">
                    <div className="resource-icon">🎥</div>
                    <div className="resource-info">
                      <h5>物理实验演示视频</h5>
                      <p>生动展示物理实验过程</p>
                    </div>
                    <button className="download-btn">观看</button>
                  </div>
                  <div className="resource-item">
                    <div className="resource-icon">🎬</div>
                    <div className="resource-info">
                      <h5>历史纪录片片段</h5>
                      <p>增强历史教学的趣味性</p>
                    </div>
                    <button className="download-btn">观看</button>
                  </div>
                </div>
              </div>
              <div className="resource-category">
                <h4>练习题库</h4>
                <div className="resource-list">
                  <div className="resource-item">
                    <div className="resource-icon">📋</div>
                    <div className="resource-info">
                      <h5>英语语法练习题</h5>
                      <p>分级难度，自动批改</p>
                    </div>
                    <button className="download-btn">使用</button>
                  </div>
                  <div className="resource-item">
                    <div className="resource-icon">🧮</div>
                    <div className="resource-info">
                      <h5>数学应用题集</h5>
                      <p>贴近生活的实际应用</p>
                    </div>
                    <button className="download-btn">使用</button>
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
    <div className="ai-assistant-center">
      <div className="ai-header">
        <h2>AI辅助中心</h2>
        <p>智能教研工具，提升教学效率</p>
      </div>

      <div className="ai-tabs">
        <button 
          className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          智能对话
        </button>
        <button 
          className={`tab-button ${activeTab === 'lesson-plan' ? 'active' : ''}`}
          onClick={() => setActiveTab('lesson-plan')}
        >
          教案生成
        </button>
        <button 
          className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          学情分析
        </button>
        <button 
          className={`tab-button ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          资源推荐
        </button>
      </div>

      <div className="ai-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AIAssistantCenter;