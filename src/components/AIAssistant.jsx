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
  Badge
} from 'antd';
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
  DownloadOutlined
} from '@ant-design/icons';
import './AIAssistant.css';

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

const AIAssistant = ({ note, visible, onClose, onApplySuggestion }) => {
  const [activeFeature, setActiveFeature] = useState('summary');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [question, setQuestion] = useState('');
  const [summaryOptions, setSummaryOptions] = useState({ length: 'medium' });
  const [suggestionType, setSuggestionType] = useState('expand');

  // 重置状态
  useEffect(() => {
    if (visible && note) {
      setResults({});
      setQuestion('');
      setActiveFeature('summary');
    }
  }, [visible, note]);

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
  const suggestedQuestions = [
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

  // 渲染当前功能内容
  const renderCurrentFeature = () => {
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
          AI智能助手
          {note && <Text type="secondary">- {note.title}</Text>}
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={800}
      className="ai-assistant-modal"
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>
      ]}
    >
      <Spin spinning={loading}>
        <div className="ai-assistant-content">
          {!note ? (
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