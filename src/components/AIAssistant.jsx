import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Input,
  Select,
  Space,
  Typography,
  Spin,
  Alert,
  Divider,
  Tag,
  List,
  Tooltip,
  Modal,
  message,
  Progress,
  Collapse,
  Badge,
  Avatar,
  Rate,
  Row,
  Col,
  Statistic,
  Timeline,
  Steps,
  Empty
} from 'antd';
import resourceRecommendationService from '../services/resourceRecommendationService.js';
import {
  RobotOutlined,
  BulbOutlined,
  FileTextOutlined,
  TagOutlined,
  SearchOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  EditOutlined,
  CopyOutlined,
  DownloadOutlined,
  BookOutlined,
  StarOutlined,
  SendOutlined,
  MessageOutlined,

  TrophyOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PlayCircleOutlined,
  HeartOutlined,
  SettingOutlined,
  ReloadOutlined,
  CommentOutlined,
  FireOutlined,
  GiftOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Title, Paragraph } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

// 模拟AI服务
class MockAIService {
  // 生成智能摘要
  static async generateSummary(content, options = {}) {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { length = 'medium' } = options;
    const sentences = content.split(/[。！？.!?]/).filter(s => s.trim().length > 0);
    
    let summaryLength;
    switch (length) {
      case 'short':
        summaryLength = Math.min(2, Math.ceil(sentences.length * 0.2));
        break;
      case 'long':
        summaryLength = Math.min(5, Math.ceil(sentences.length * 0.5));
        break;
      default:
        summaryLength = Math.min(3, Math.ceil(sentences.length * 0.3));
    }
    
    const selectedSentences = sentences
      .slice(0, summaryLength)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    return {
      summary: selectedSentences.join('。') + '。',
      keyPoints: [
        '主要观点1：' + (selectedSentences[0] || '内容要点'),
        '主要观点2：' + (selectedSentences[1] || '核心思想'),
        '主要观点3：' + (selectedSentences[2] || '关键信息')
      ].slice(0, selectedSentences.length),
      confidence: 0.85
    };
  }
  
  // 生成标签建议
  static async suggestTags(content) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const keywords = [
      '工作', '学习', '生活', '技术', '思考', '计划', '总结', '想法',
      '项目', '会议', '笔记', '资料', '经验', '心得', '方法', '工具'
    ];
    
    // 简单的关键词匹配
    const suggestedTags = keywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    ).slice(0, 5);
    
    return {
      tags: suggestedTags.length > 0 ? suggestedTags : ['笔记', '记录'],
      confidence: 0.75
    };
  }
  
  // 生成内容建议
  static async generateContentSuggestions(content, type = 'expand') {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const suggestions = {
      expand: [
        '可以添加具体的实例来支持你的观点',
        '建议补充相关的数据或统计信息',
        '可以从不同角度分析这个问题',
        '添加个人的思考和见解会更有价值'
      ],
      improve: [
        '建议使用更清晰的段落结构',
        '可以添加小标题来组织内容',
        '某些表述可以更加简洁明了',
        '建议检查语法和标点符号'
      ],
      related: [
        '相关主题：项目管理最佳实践',
        '延伸阅读：团队协作工具对比',
        '参考资料：行业发展趋势报告',
        '相关笔记：上次会议记录'
      ]
    };
    
    return {
      suggestions: suggestions[type] || suggestions.expand,
      type,
      confidence: 0.80
    };
  }
  
  // 智能问答
  static async askQuestion(content, question) {
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    const responses = [
      '根据你的笔记内容，这个问题的答案可能是...',
      '从文中可以看出，相关信息包括...',
      '基于你提供的信息，我的理解是...',
      '这是一个很好的问题，让我从几个角度来分析...'
    ];
    
    return {
      answer: responses[Math.floor(Math.random() * responses.length)] + '（这是基于AI分析的建议回答）',
      confidence: 0.70,
      sources: ['笔记第1段', '笔记第3段']
    };
  }
}

const AIAssistant = ({ 
  note, 
  visible, 
  onClose, 
  onApplySuggestion,
  // 新增学习配课相关参数
  userProfile = {}, 
  learningHistory = [], 
  currentTopics = [],
  onRecommendCourse,
  onCreateLearningPath,
  onResourceRecommend, // 新增：资源推荐回调
  mode = 'note' // 'note' 或 'learning'
}) => {
  const [activeFeature, setActiveFeature] = useState(mode === 'learning' ? 'chat' : 'summary');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [question, setQuestion] = useState('');
  const [summaryOptions, setSummaryOptions] = useState({ length: 'medium' });
  const [suggestionType, setSuggestionType] = useState('expand');
  
  // 学习配课相关状态
  const [activeTab, setActiveTab] = useState('chat');
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [learningInsights, setLearningInsights] = useState(null);

  // 重置状态
  useEffect(() => {
    if (visible) {
      if (mode === 'note' && note) {
        setResults({});
        setQuestion('');
        setActiveFeature('summary');
      } else if (mode === 'learning') {
        initializeLearningAI();
      }
    }
  }, [visible, note, mode]);

  // 初始化学习AI助手
  const initializeLearningAI = () => {
    // 生成个性化推荐
    generateRecommendations();
    
    // 分析学习洞察
    generateLearningInsights();
    
    // 初始化欢迎消息
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: `您好！我是您的AI学习助手 🤖\n\n基于您的学习历史和兴趣，我为您准备了一些个性化建议。有什么学习问题都可以问我哦！`,
      timestamp: new Date(),
      suggestions: [
        '推荐适合我的课程',
        '制定学习计划',
        '分析我的学习进度',
        '优化学习路径'
      ]
    };
    
    setChatMessages([welcomeMessage]);
  };

  // 生成课程推荐
  const generateRecommendations = () => {
    const sampleRecommendations = [
      {
        id: 'rec-001',
        title: 'React 高级开发技巧',
        reason: '基于您对前端开发的兴趣',
        match: 95,
        difficulty: '中级',
        duration: '25学时',
        rating: 4.8,
        tags: ['React', '前端开发', '组件设计'],
        instructor: '李老师',
        learners: 1250,
        description: '深入学习React高级特性，包括Hooks、性能优化、状态管理等'
      },
      {
        id: 'rec-002',
        title: 'Python 机器学习实战',
        reason: '您最近关注数据分析领域',
        match: 88,
        difficulty: '中级',
        duration: '40学时',
        rating: 4.9,
        tags: ['Python', '机器学习', '数据科学'],
        instructor: '王博士',
        learners: 890,
        description: '从基础到实战，掌握机器学习核心算法和应用'
      }
    ];
    
    setRecommendations(sampleRecommendations);
  };

  // 生成学习洞察
  const generateLearningInsights = () => {
    const insights = {
      totalHours: 156,
      completedCourses: 8,
      averageRating: 4.6,
      strongAreas: ['前端开发', '编程基础', '项目管理'],
      improvementAreas: ['数据分析', '算法设计', '系统架构'],
      learningPattern: {
        preferredTime: '晚上 19:00-21:00',
        averageSession: '45分钟',
        consistency: '85%'
      },
      nextMilestone: {
        title: '全栈开发者',
        progress: 65,
        requirements: ['完成后端开发课程', '掌握数据库设计', '项目实战经验']
      }
    };
    
    setLearningInsights(insights);
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // 模拟AI回复
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(inputMessage);
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // 生成AI回复
  const generateAIResponse = async (userInput) => {
    const input = userInput.toLowerCase();
    let response = '';
    let suggestions = [];
    let recommendedResources = [];

    try {
      // 检查是否是资源推荐请求
      if (input.includes('推荐') || input.includes('资源') || input.includes('材料') || 
          input.includes('找') || input.includes('需要') || input.includes('学习')) {
        
        // 调用资源推荐服务
        const recommendationResult = await resourceRecommendationService.recommendResources(userInput, { limit: 5 });
        
        if (recommendationResult.success && recommendationResult.data.recommendations.length > 0) {
          const recommendations = recommendationResult.data.recommendations;
          recommendedResources = recommendations.map(rec => rec.resource);
          
          response = `根据您的需求"${userInput}"，我为您推荐以下资源：\n\n`;
          
          recommendations.slice(0, 3).forEach((rec, index) => {
            const resource = rec.resource;
            response += `${index + 1}. **${resource.title}**\n`;
            response += `   类型：${getResourceTypeName(resource.resourceType)} | 难度：${getDifficultyName(resource.difficulty)}\n`;
            response += `   匹配度：${rec.score}% | ${resource.description.substring(0, 50)}...\n`;
            if (rec.reasons.length > 0) {
              response += `   推荐理由：${rec.reasons[0]}\n`;
            }
            response += '\n';
          });
          
          if (recommendations.length > 3) {
            response += `还有 ${recommendations.length - 3} 个相关资源，点击"查看更多"了解详情。`;
          }
          
          suggestions = ['查看资源详情', '添加到学习计划', '查看更多推荐', '优化搜索条件'];
          
          // 通知父组件更新资源树
          if (onResourceRecommend) {
            onResourceRecommend(recommendedResources);
          }
        } else {
          response = `抱歉，没有找到与"${userInput}"完全匹配的资源。\n\n建议您：\n- 尝试使用更具体的关键词\n- 指定资源类型（如"视频教程"、"文档资料"）\n- 说明目标受众（如"教师"、"学生"、"家长"）\n- 指定难度等级（如"简单"、"中等"、"困难"）`;
          suggestions = ['重新描述需求', '浏览热门资源', '查看分类资源', '获取搜索建议'];
        }
      } else if (input.includes('课程')) {
        response = `根据您的学习历史和兴趣，我为您推荐以下课程：\n\n1. **React 高级开发技巧** - 匹配度95%\n   适合您当前的前端开发水平\n\n2. **Python 机器学习实战** - 匹配度88%\n   扩展您的技能栈到数据科学领域\n\n这些课程都有很好的评价，您可以查看详细信息。`;
        suggestions = ['查看课程详情', '制定学习计划', '了解学习路径'];
      } else if (input.includes('计划') || input.includes('规划')) {
        response = `我来为您制定个性化学习计划：\n\n**短期目标（1-2个月）**\n- 完成React高级特性学习\n- 掌握状态管理和性能优化\n\n**中期目标（3-6个月）**\n- 学习后端开发技术\n- 完成全栈项目实战\n\n**长期目标（6-12个月）**\n- 成为全栈开发者\n- 具备独立项目开发能力`;
        suggestions = ['调整计划', '查看详细步骤', '设置学习提醒'];
      } else if (input.includes('进度') || input.includes('分析')) {
        response = `让我分析一下您的学习情况：\n\n📊 **学习统计**\n- 总学习时长：156小时\n- 完成课程：8门\n- 平均评分：4.6/5.0\n\n🎯 **优势领域**\n前端开发、编程基础、项目管理\n\n📈 **提升空间**\n数据分析、算法设计、系统架构\n\n您的学习一致性很好，建议继续保持！`;
        suggestions = ['查看详细报告', '优化学习方法', '设定新目标'];
      } else {
        response = `我理解您的问题。作为您的AI学习助手，我可以帮您：\n\n🎯 个性化资源推荐\n📚 制定学习计划\n📊 分析学习进度\n🛤️ 优化学习路径\n💡 解答学习疑问\n\n请告诉我您具体需要什么帮助？`;
        suggestions = ['推荐学习资源', '制定计划', '分析进度', '学习建议'];
      }
    } catch (error) {
      console.error('生成AI回复失败:', error);
      response = '抱歉，处理您的请求时出现了问题，请稍后重试。';
      suggestions = ['重新提问', '查看帮助'];
    }

    return {
      id: Date.now(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      suggestions,
      recommendedResources
    };
  };

  // 获取资源类型名称
  const getResourceTypeName = (type) => {
    const typeNames = {
      'guide': '指导手册',
      'video': '视频教程',
      'audio': '音频资源',
      'document': '文档资料',
      'tool': '工具软件',
      'case_study': '案例研究'
    };
    return typeNames[type] || type;
  };

  // 获取难度等级名称
  const getDifficultyName = (difficulty) => {
    const difficultyNames = {
      'easy': '简单',
      'medium': '中等',
      'hard': '困难'
    };
    return difficultyNames[difficulty] || difficulty;
  };

  // 处理建议点击
  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    handleSendMessage();
  };

  // 生成智能摘要
  const handleGenerateSummary = async () => {
    if (!note?.content) {
      message.warning('请先选择要分析的笔记');
      return;
    }

    setLoading(true);
    try {
      const result = await MockAIService.generateSummary(note.content, summaryOptions);
      setResults(prev => ({ ...prev, summary: result }));
      message.success('智能摘要生成成功');
    } catch (error) {
      message.error('生成摘要失败');
    } finally {
      setLoading(false);
    }
  };

  // 生成标签建议
  const handleSuggestTags = async () => {
    if (!note?.content) {
      message.warning('请先选择要分析的笔记');
      return;
    }

    setLoading(true);
    try {
      const result = await MockAIService.suggestTags(note.content);
      setResults(prev => ({ ...prev, tags: result }));
      message.success('标签建议生成成功');
    } catch (error) {
      message.error('生成标签建议失败');
    } finally {
      setLoading(false);
    }
  };

  // 生成内容建议
  const handleGenerateContentSuggestions = async () => {
    if (!note?.content) {
      message.warning('请先选择要分析的笔记');
      return;
    }

    setLoading(true);
    try {
      const result = await MockAIService.generateContentSuggestions(note.content, suggestionType);
      setResults(prev => ({ ...prev, contentSuggestions: result }));
      message.success('内容建议生成成功');
    } catch (error) {
      message.error('生成内容建议失败');
    } finally {
      setLoading(false);
    }
  };

  // 智能问答
  const handleAskQuestion = async () => {
    if (!note?.content) {
      message.warning('请先选择要分析的笔记');
      return;
    }
    if (!question.trim()) {
      message.warning('请输入问题');
      return;
    }

    setLoading(true);
    try {
      const result = await MockAIService.askQuestion(note.content, question);
      setResults(prev => ({ ...prev, qa: result }));
      message.success('问题分析完成');
    } catch (error) {
      message.error('问题分析失败');
    } finally {
      setLoading(false);
    }
  };

  // 应用建议
  const handleApplySuggestion = (type, data) => {
    if (onApplySuggestion) {
      onApplySuggestion(type, data);
    }
    message.success('建议已应用');
  };

  // 复制内容
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  // 渲染功能选项卡
  const renderFeatureTabs = () => (
    <div className="ai-feature-tabs">
      <Button
        type={activeFeature === 'summary' ? 'primary' : 'default'}
        icon={<FileTextOutlined />}
        onClick={() => setActiveFeature('summary')}
      >
        智能摘要
      </Button>
      <Button
        type={activeFeature === 'tags' ? 'primary' : 'default'}
        icon={<TagOutlined />}
        onClick={() => setActiveFeature('tags')}
      >
        标签建议
      </Button>
      <Button
        type={activeFeature === 'suggestions' ? 'primary' : 'default'}
        icon={<BulbOutlined />}
        onClick={() => setActiveFeature('suggestions')}
      >
        内容建议
      </Button>
      <Button
        type={activeFeature === 'qa' ? 'primary' : 'default'}
        icon={<QuestionCircleOutlined />}
        onClick={() => setActiveFeature('qa')}
      >
        智能问答
      </Button>
    </div>
  );

  // 渲染智能摘要
  const renderSummaryFeature = () => (
    <div className="ai-feature-content">
      <div className="feature-controls">
        <Space>
          <Text>摘要长度：</Text>
          <Select
            value={summaryOptions.length}
            onChange={(value) => setSummaryOptions({ ...summaryOptions, length: value })}
            style={{ width: 120 }}
          >
            <Option value="short">简短</Option>
            <Option value="medium">中等</Option>
            <Option value="long">详细</Option>
          </Select>
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            onClick={handleGenerateSummary}
            loading={loading}
          >
            生成摘要
          </Button>
        </Space>
      </div>

      {results.summary && (
        <Card className="ai-result-card" title="智能摘要">
          <div className="summary-content">
            <Paragraph>
              <Text strong>摘要内容：</Text>
            </Paragraph>
            <Paragraph className="summary-text">
              {results.summary.summary}
            </Paragraph>
            
            <Divider />
            
            <Paragraph>
              <Text strong>关键要点：</Text>
            </Paragraph>
            <List
              size="small"
              dataSource={results.summary.keyPoints}
              renderItem={(item, index) => (
                <List.Item>
                  <Badge count={index + 1} size="small" />
                  <span style={{ marginLeft: 8 }}>{item}</span>
                </List.Item>
              )}
            />
            
            <div className="result-actions">
              <Space>
                <Text type="secondary">
                  置信度: {(results.summary.confidence * 100).toFixed(0)}%
                </Text>
                <Button
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopy(results.summary.summary)}
                >
                  复制摘要
                </Button>
                <Button
                  size="small"
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => handleApplySuggestion('summary', results.summary.summary)}
                >
                  应用到笔记
                </Button>
              </Space>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  // 渲染标签建议
  const renderTagsFeature = () => (
    <div className="ai-feature-content">
      <div className="feature-controls">
        <Button
          type="primary"
          icon={<TagOutlined />}
          onClick={handleSuggestTags}
          loading={loading}
        >
          生成标签建议
        </Button>
      </div>

      {results.tags && (
        <Card className="ai-result-card" title="标签建议">
          <div className="tags-content">
            <Paragraph>
              <Text strong>推荐标签：</Text>
            </Paragraph>
            <div className="suggested-tags">
              {results.tags.tags.map((tag, index) => (
                <Tag
                  key={index}
                  color="blue"
                  className="suggested-tag"
                  onClick={() => handleApplySuggestion('tag', tag)}
                >
                  {tag}
                </Tag>
              ))}
            </div>
            
            <div className="result-actions">
              <Space>
                <Text type="secondary">
                  置信度: {(results.tags.confidence * 100).toFixed(0)}%
                </Text>
                <Button
                  size="small"
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleApplySuggestion('tags', results.tags.tags)}
                >
                  应用所有标签
                </Button>
              </Space>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  // 渲染内容建议
  const renderSuggestionsFeature = () => (
    <div className="ai-feature-content">
      <div className="feature-controls">
        <Space>
          <Text>建议类型：</Text>
          <Select
            value={suggestionType}
            onChange={setSuggestionType}
            style={{ width: 120 }}
          >
            <Option value="expand">扩展内容</Option>
            <Option value="improve">改进建议</Option>
            <Option value="related">相关内容</Option>
          </Select>
          <Button
            type="primary"
            icon={<BulbOutlined />}
            onClick={handleGenerateContentSuggestions}
            loading={loading}
          >
            生成建议
          </Button>
        </Space>
      </div>

      {results.contentSuggestions && (
        <Card className="ai-result-card" title="内容建议">
          <List
            dataSource={results.contentSuggestions.suggestions}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <Button
                    size="small"
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleApplySuggestion('suggestion', item)}
                  >
                    应用
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Badge count={index + 1} size="small" />}
                  description={item}
                />
              </List.Item>
            )}
          />
          
          <div className="result-actions">
            <Text type="secondary">
              置信度: {(results.contentSuggestions.confidence * 100).toFixed(0)}%
            </Text>
          </div>
        </Card>
      )}
    </div>
  );

  // 推荐问题列表
  const suggestedQuestions = note?.category === 'teaching_research_office'
    ? [
        '小学体育游戏化教学的核心目标是什么？',
        '如何为低年级设计安全、参与度高的体育游戏？',
        '如何评估游戏化教学的课堂效果和体能提升？'
      ]
    : note?.category === 'training_needs_management'
    ? [
        '教师常见心理困扰有哪些课堂表现？',
        '如何设计教师心理健康培训的核心模块？',
        '压力管理与情绪调节的训练如何开展？',
        '如何建立校内危机识别与转介流程？',
        '培训效果如何评估与持续跟踪？'
      ]
    : [
        '主要观点？',
        '关键概念？',
        '如何应用？'
      ];
  
  // 处理推荐问题点击
  const handleSuggestedQuestion = (suggestedQ) => {
    setQuestion(suggestedQ);
    handleAskQuestion();
  };

  // 渲染智能问答
  const renderQAFeature = () => (
    <div className="ai-feature-content">
      <div className="feature-controls">
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="输入你想了解的问题..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onPressEnter={handleAskQuestion}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleAskQuestion}
            loading={loading}
          >
            提问
          </Button>
        </Space.Compact>
        
        <div style={{ marginTop: '12px' }}>
          <Text type="secondary" style={{ fontSize: '12px', marginBottom: '8px', display: 'block' }}>
            推荐问题：
          </Text>
          <div style={{ display: 'flex', gap: '8px', width: '100%', overflow: 'hidden' }}>
            {suggestedQuestions.map((q, index) => (
              <Button
                key={index}
                size="small"
                type="text"
                onClick={() => handleSuggestedQuestion(q)}
                style={{
                  fontSize: '11px',
                  height: '24px',
                  padding: '0 6px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '12px',
                  backgroundColor: '#fafafa',
                  color: '#666',
                  whiteSpace: 'nowrap',
                  flex: '1 1 0',
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={q}
              >
                {q}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {results.qa && (
        <Card className="ai-result-card" title="AI回答">
          <div className="qa-content">
            <Paragraph>
              <Text strong>问题：</Text>{question}
            </Paragraph>
            <Paragraph className="qa-answer">
              <Text strong>回答：</Text>
              <br />
              {results.qa.answer}
            </Paragraph>
            
            {results.qa.sources && results.qa.sources.length > 0 && (
              <>
                <Divider />
                <Paragraph>
                  <Text strong>参考来源：</Text>
                </Paragraph>
                <div className="qa-sources">
                  {results.qa.sources.map((source, index) => (
                    <Tag key={index} color="green">{source}</Tag>
                  ))}
                </div>
              </>
            )}
            
            <div className="result-actions">
              <Space>
                <Text type="secondary">
                  置信度: {(results.qa.confidence * 100).toFixed(0)}%
                </Text>
                <Button
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopy(results.qa.answer)}
                >
                  复制回答
                </Button>
              </Space>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  // 渲染学习模式的聊天界面
  const renderLearningChat = () => (
    <div className="learning-chat-container">
      <div className="chat-messages" style={{ height: '300px', overflowY: 'auto', marginBottom: '16px' }}>
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`chat-message ${msg.type}`} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Avatar 
                size="small" 
                icon={msg.type === 'ai' ? <RobotOutlined /> : <UserOutlined />}
                style={{ backgroundColor: msg.type === 'ai' ? '#1890ff' : '#52c41a' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ 
                  background: msg.type === 'ai' ? '#f6f8fa' : '#e6f7ff',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  whiteSpace: 'pre-line'
                }}>
                  {msg.content}
                </div>
                {msg.suggestions && (
                  <div style={{ marginTop: '8px' }}>
                    <Space wrap>
                      {msg.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          size="small"
                          type="link"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </Space>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-message ai" style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Avatar size="small" icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
              <div style={{ background: '#f6f8fa', padding: '8px 12px', borderRadius: '8px' }}>
                <Spin size="small" /> AI正在思考...
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="chat-input">
        <Input.Group compact>
          <Input
            style={{ width: 'calc(100% - 80px)' }}
            placeholder="请输入您的问题..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onPressEnter={handleSendMessage}
          />
          <Button 
            type="primary" 
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
          >
            发送
          </Button>
        </Input.Group>
      </div>
    </div>
  );

  // 渲染课程推荐
  const renderRecommendations = () => (
    <div className="recommendations-container">
      <Title level={4}>
        <BookOutlined /> 为您推荐的课程
      </Title>
      {recommendations.length === 0 ? (
        <Empty description="暂无推荐课程" />
      ) : (
        <Row gutter={[16, 16]}>
          {recommendations.map((course) => (
            <Col span={24} key={course.id}>
              <Card
                hoverable
                style={{ borderLeft: `4px solid ${course.match >= 90 ? '#52c41a' : '#1890ff'}` }}
                actions={[
                  <Button type="link" icon={<EyeOutlined />}>查看详情</Button>,
                  <Button type="link" icon={<PlayCircleOutlined />}>开始学习</Button>,
                  <Button type="link" icon={<HeartOutlined />}>收藏</Button>
                ]}
              >
                <Card.Meta
                  avatar={<Avatar size={48} style={{ backgroundColor: '#1890ff' }}>{course.title[0]}</Avatar>}
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{course.title}</span>
                      <Badge count={`${course.match}%匹配`} style={{ backgroundColor: '#52c41a' }} />
                    </div>
                  }
                  description={
                    <div>
                      <Paragraph ellipsis={{ rows: 2 }}>{course.description}</Paragraph>
                      <div style={{ marginTop: '8px' }}>
                        <Space wrap>
                          <Text type="secondary">
                            <StarOutlined /> {course.rating}
                          </Text>
                          <Text type="secondary">
                            <ClockCircleOutlined /> {course.duration}
                          </Text>
                          <Text type="secondary">
                            <UserOutlined /> {course.learners}人学习
                          </Text>
                          <Text type="secondary">难度: {course.difficulty}</Text>
                        </Space>
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <Space wrap>
                          {course.tags.map((tag, index) => (
                            <Tag key={index} color="blue">{tag}</Tag>
                          ))}
                        </Space>
                      </div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        推荐理由: {course.reason}
                      </Text>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );

  // 渲染学习洞察
  const renderLearningInsights = () => (
    <div className="learning-insights-container">
      <Title level={4}>
        <TrophyOutlined /> 学习洞察分析
      </Title>
      
      {learningInsights ? (
        <Row gutter={[16, 16]}>
          {/* 学习统计 */}
          <Col span={24}>
            <Card title="学习统计" size="small">
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic title="总学习时长" value={learningInsights.totalHours} suffix="小时" />
                </Col>
                <Col span={6}>
                  <Statistic title="完成课程" value={learningInsights.completedCourses} suffix="门" />
                </Col>
                <Col span={6}>
                  <Statistic title="平均评分" value={learningInsights.averageRating} precision={1} suffix="/5.0" />
                </Col>
                <Col span={6}>
                  <Statistic title="学习一致性" value={learningInsights.learningPattern.consistency} suffix="%" />
                </Col>
              </Row>
            </Card>
          </Col>

          {/* 优势与提升 */}
          <Col span={12}>
            <Card title="优势领域" size="small">
              <Space wrap>
                {learningInsights.strongAreas.map((area, index) => (
                  <Tag key={index} color="green" icon={<CheckCircleOutlined />}>{area}</Tag>
                ))}
              </Space>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="提升空间" size="small">
              <Space wrap>
                {learningInsights.improvementAreas.map((area, index) => (
                  <Tag key={index} color="orange" icon={<ExclamationCircleOutlined />}>{area}</Tag>
                ))}
              </Space>
            </Card>
          </Col>

          {/* 学习模式 */}
          <Col span={12}>
            <Card title="学习模式分析" size="small">
              <div style={{ marginBottom: '8px' }}>
                <Text strong>偏好时间: </Text>
                <Text>{learningInsights.learningPattern.preferredTime}</Text>
              </div>
              <div>
                <Text strong>平均时长: </Text>
                <Text>{learningInsights.learningPattern.averageSession}</Text>
              </div>
            </Card>
          </Col>

          {/* 下一个里程碑 */}
          <Col span={12}>
            <Card title="下一个里程碑" size="small">
              <div style={{ marginBottom: '12px' }}>
                <Text strong>{learningInsights.nextMilestone.title}</Text>
                <Progress 
                  percent={learningInsights.nextMilestone.progress} 
                  size="small" 
                  style={{ marginTop: '4px' }}
                />
              </div>
              <div>
                <Text type="secondary">还需要:</Text>
                <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
                  {learningInsights.nextMilestone.requirements.map((req, index) => (
                    <li key={index} style={{ fontSize: '12px', color: '#666' }}>{req}</li>
                  ))}
                </ul>
              </div>
            </Card>
          </Col>
        </Row>
      ) : (
        <Empty description="暂无学习数据" />
      )}
    </div>
  );

  // 渲染学习模式的标签页
  const renderLearningTabs = () => (
    <div className="learning-tabs">
      <Space size="large">
        <Button
          type={activeTab === 'chat' ? 'primary' : 'default'}
          icon={<MessageOutlined />}
          onClick={() => setActiveTab('chat')}
        >
          AI对话
        </Button>
        <Button
          type={activeTab === 'recommendations' ? 'primary' : 'default'}
          icon={<BookOutlined />}
          onClick={() => setActiveTab('recommendations')}
        >
          课程推荐
        </Button>
        <Button
          type={activeTab === 'insights' ? 'primary' : 'default'}
          icon={<TrophyOutlined />}
          onClick={() => setActiveTab('insights')}
        >
          学习洞察
        </Button>
      </Space>
    </div>
  );

  // 渲染学习模式内容
  const renderLearningContent = () => {
    switch (activeTab) {
      case 'chat':
        return renderLearningChat();
      case 'recommendations':
        return renderRecommendations();
      case 'insights':
        return renderLearningInsights();
      default:
        return renderLearningChat();
    }
  };

  // 渲染当前功能内容
  const renderCurrentFeature = () => {
    if (mode === 'learning') {
      return (
        <div className="learning-mode-content">
          {renderLearningTabs()}
          <Divider />
          {renderLearningContent()}
        </div>
      );
    }
    
    switch (activeFeature) {
      case 'summary':
        return renderSummaryFeature();
      case 'tags':
        return renderTagsFeature();
      case 'suggestions':
        return renderSuggestionsFeature();
      case 'qa':
        return renderQAFeature();
      default:
        return renderSummaryFeature();
    }
  };

  return (
    <Modal
      title={
        <Space>
          <RobotOutlined />
          {mode === 'learning' ? 'AI学习助手' : 'AI智能助手'}
          {note && mode !== 'learning' && <Text type="secondary">- {note.title}</Text>}
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={mode === 'learning' ? 900 : 800}
      className="ai-assistant-modal"
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>
      ]}
    >
      <Spin spinning={loading}>
        <div className="ai-assistant-content">
          {mode === 'learning' ? (
            renderCurrentFeature()
          ) : !note ? (
            <Alert
              message="请先选择一篇笔记"
              description="AI助手需要分析笔记内容才能提供智能建议"
              type="info"
              showIcon
            />
          ) : (
            <>
              {renderFeatureTabs()}
              <Divider />
              {renderCurrentFeature()}
            </>
          )}
        </div>
      </Spin>
    </Modal>
  );
};

export default AIAssistant;