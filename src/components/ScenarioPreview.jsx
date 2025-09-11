import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Space,
  Typography,
  Tag,
  Rate,
  Divider,
  Descriptions,
  Spin,
  Alert,
  Tabs,
  Card,
  Avatar,
  Statistic,
  Row,
  Col
} from 'antd';
import {
  PlayCircleOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  StarOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  HeartOutlined,
  MessageOutlined,
  FullscreenOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ScenarioPreview = ({ visible, onClose, scenario, onRun }) => {
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (scenario) {
      setLikeCount(Math.floor(Math.random() * 100) + 50);
      // 模拟预览加载
      setPreviewLoading(true);
      setTimeout(() => {
        setPreviewLoading(false);
      }, 1500);
    }
  }, [scenario]);

  const handleRun = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRun && onRun(scenario);
      onClose();
    }, 1000);
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    // 模拟分享功能
    navigator.clipboard.writeText(`${window.location.origin}/scenario/${scenario?.id}`);
    // 这里可以添加分享链接的逻辑
  };

  const handleDownload = () => {
    // 模拟下载功能
    const link = document.createElement('a');
    link.href = scenario?.thumbnail || '#';
    link.download = `${scenario?.title}.html`;
    link.click();
  };

  if (!scenario) return null;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '初级': return 'green';
      case '中级': return 'orange';
      case '高级': return 'red';
      default: return 'blue';
    }
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={null}
      destroyOnClose
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        {/* 头部信息 */}
        <div style={{ padding: '24px 24px 0', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <Title level={3} style={{ margin: 0, marginBottom: 8 }}>
                {scenario.title}
              </Title>
              <Space size={12} wrap>
                <Tag color={getDifficultyColor(scenario.difficulty)}>
                  {scenario.difficulty}
                </Tag>
                <Tag color="blue">{scenario.categoryName}</Tag>
                <Space size={4}>
                  <ClockCircleOutlined />
                  <Text type="secondary">{scenario.duration}</Text>
                </Space>
                <Space size={4}>
                  <UserOutlined />
                  <Text type="secondary">{scenario.author}</Text>
                </Space>
                <Space size={4}>
                  <EyeOutlined />
                  <Text type="secondary">{scenario.viewCount} 次浏览</Text>
                </Space>
              </Space>
            </div>
            
            <Space>
              <Button 
                icon={liked ? <HeartOutlined style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                onClick={handleLike}
                type={liked ? 'primary' : 'default'}
                danger={liked}
              >
                {likeCount}
              </Button>
              <Button icon={<ShareAltOutlined />} onClick={handleShare}>
                分享
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                下载
              </Button>
              <Button 
                type="primary" 
                icon={<PlayCircleOutlined />}
                loading={loading}
                onClick={handleRun}
                size="large"
              >
                运行场景
              </Button>
            </Space>
          </div>
          
          <Tabs defaultActiveKey="preview" style={{ marginTop: 16 }}>
            <TabPane tab="场景预览" key="preview" />
            <TabPane tab="详细信息" key="details" />
            <TabPane tab="使用说明" key="instructions" />
            <TabPane tab="评价反馈" key="feedback" />
          </Tabs>
        </div>

        {/* 内容区域 */}
        <div style={{ flex: 1, padding: 24, overflow: 'auto' }}>
          <Tabs defaultActiveKey="preview" style={{ height: '100%' }}>
            <TabPane tab="场景预览" key="preview">
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {previewLoading ? (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: 400,
                    background: '#fafafa',
                    borderRadius: 8
                  }}>
                    <Spin size="large" tip="正在加载场景预览..." />
                  </div>
                ) : (
                  <div style={{ 
                    height: 400, 
                    border: '1px solid #d9d9d9', 
                    borderRadius: 8,
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <iframe
                      src={scenario.thumbnail}
                      style={{ 
                        width: '125%', 
                        height: '125%', 
                        border: 'none',
                        transform: 'scale(0.8)',
                        transformOrigin: 'top left'
                      }}
                      title={`${scenario.title} 预览`}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'rgba(0, 0, 0, 0.6)',
                      borderRadius: 4,
                      padding: '4px 8px'
                    }}>
                      <Button 
                        type="text" 
                        icon={<FullscreenOutlined />} 
                        size="small"
                        style={{ color: 'white' }}
                        onClick={handleRun}
                      >
                        全屏运行
                      </Button>
                    </div>
                  </div>
                )}
                
                <Alert
                  message="预览提示"
                  description="这是场景的缩略预览，点击'运行场景'按钮可以体验完整的交互功能。"
                  type="info"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              </div>
            </TabPane>
            
            <TabPane tab="详细信息" key="details">
              <Row gutter={[24, 24]}>
                <Col span={16}>
                  <Card title="场景描述" size="small">
                    <Paragraph>{scenario.description}</Paragraph>
                    
                    <Divider orientation="left" plain>学习目标</Divider>
                    <ul>
                      <li>理解相关理论概念和原理</li>
                      <li>掌握实际操作技能和方法</li>
                      <li>培养分析问题和解决问题的能力</li>
                      <li>提升实践应用和创新思维</li>
                    </ul>
                    
                    <Divider orientation="left" plain>适用对象</Divider>
                    <Text>适合中学生及以上学习者使用，建议在教师指导下进行。</Text>
                  </Card>
                </Col>
                
                <Col span={8}>
                  <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    <Card size="small">
                      <Statistic
                        title="用户评分"
                        value={scenario.rating}
                        precision={1}
                        suffix={<Rate disabled defaultValue={scenario.rating} style={{ fontSize: 14 }} />}
                      />
                    </Card>
                    
                    <Card size="small">
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="创建时间">{scenario.createdAt}</Descriptions.Item>
                        <Descriptions.Item label="更新时间">{scenario.createdAt}</Descriptions.Item>
                        <Descriptions.Item label="文件大小">2.3 MB</Descriptions.Item>
                        <Descriptions.Item label="版本号">v1.0.0</Descriptions.Item>
                      </Descriptions>
                    </Card>
                    
                    <Card title="标签" size="small">
                      <Space size={[0, 8]} wrap>
                        {scenario.tags.map(tag => (
                          <Tag key={tag} color="processing">{tag}</Tag>
                        ))}
                      </Space>
                    </Card>
                  </Space>
                </Col>
              </Row>
            </TabPane>
            
            <TabPane tab="使用说明" key="instructions">
              <Card>
                <Title level={5}>操作指南</Title>
                <ol>
                  <li>点击"运行场景"按钮启动模拟器</li>
                  <li>根据界面提示进行相关参数设置</li>
                  <li>观察实验现象并记录数据</li>
                  <li>分析结果并得出结论</li>
                </ol>
                
                <Divider />
                
                <Title level={5}>注意事项</Title>
                <ul>
                  <li>建议使用Chrome或Firefox浏览器以获得最佳体验</li>
                  <li>确保网络连接稳定，避免加载中断</li>
                  <li>如遇到问题，请刷新页面重新加载</li>
                  <li>建议在教师指导下使用，以确保学习效果</li>
                </ul>
                
                <Alert
                  message="技术支持"
                  description="如果在使用过程中遇到技术问题，请联系技术支持团队获取帮助。"
                  type="warning"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              </Card>
            </TabPane>
            
            <TabPane tab="评价反馈" key="feedback">
              <Row gutter={[24, 24]}>
                <Col span={8}>
                  <Card title="评分统计" size="small">
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                      <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1890ff' }}>
                        {scenario.rating}
                      </div>
                      <Rate disabled defaultValue={scenario.rating} />
                      <div style={{ color: '#666', marginTop: 8 }}>基于 {Math.floor(Math.random() * 50) + 20} 个评价</div>
                    </div>
                  </Card>
                </Col>
                
                <Col span={16}>
                  <Card title="用户评价" size="small">
                    <Space direction="vertical" size={16} style={{ width: '100%' }}>
                      {[
                        { user: '张同学', rating: 5, comment: '非常好用的模拟器，帮助我更好地理解了相关概念。', time: '2024-01-15' },
                        { user: '李老师', rating: 4, comment: '界面友好，功能完善，适合课堂教学使用。', time: '2024-01-12' },
                        { user: '王同学', rating: 5, comment: '交互性很强，比传统教学方式更有趣。', time: '2024-01-10' }
                      ].map((review, index) => (
                        <div key={index} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Space>
                              <Avatar size="small" icon={<UserOutlined />} />
                              <Text strong>{review.user}</Text>
                              <Rate disabled defaultValue={review.rating} size="small" />
                            </Space>
                            <Text type="secondary" style={{ fontSize: 12 }}>{review.time}</Text>
                          </div>
                          <Text>{review.comment}</Text>
                        </div>
                      ))}
                    </Space>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Modal>
  );
};

export default ScenarioPreview;