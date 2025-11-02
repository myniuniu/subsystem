import React, { useState, useEffect } from 'react';
import {
  Modal,
  Tabs,
  Form,
  Input,
  Select,
  Button,
  Tag,
  Space,
  Card,
  List,
  Avatar,
  Typography,
  DatePicker,
  Switch,
  Radio,
  message,
  Divider,
  Empty,
  Checkbox,
  Collapse,
  Tooltip
} from 'antd';
import {
  ShareAltOutlined,
  UserOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  HistoryOutlined,
  LinkOutlined,
  FileOutlined,
  VideoCameraOutlined,
  BookOutlined,
  SettingOutlined,
  DatabaseOutlined,
  RightOutlined,
  LeftOutlined
} from '@ant-design/icons';
import themeShareService from '../services/themeShareService';
import userService from '../services/userService';
import UserSelector from './UserSelector';
import './ThemeShareModal.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const ThemeShareModal = ({ 
  visible, 
  onCancel, 
  theme,
  onShareSuccess,
  shareTargetSquareSection,
  // 新增：来源区和操作记录区数据
  sourceData = {
    uploadedFiles: [],
    links: [],
    addedTexts: [],
    courseVideos: [],
    organizationalCourses: []
  },
  operationRecords = {}
}) => {
  const [activeTab, setActiveTab] = useState('learning-square'); // 默认选择学习广场
  const [loading, setLoading] = useState(false);
  
  // 学习广场分享相关状态
  const [shareTitle, setShareTitle] = useState('');
  const [shareDescription, setShareDescription] = useState('');
  const [shareTags, setShareTags] = useState([]);
  const [shareCategory, setShareCategory] = useState('');
  
  // 个人分享相关状态
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [shareMessage, setShareMessage] = useState('');
  const [sharePermissions, setSharePermissions] = useState('view');
  const [shareExpiry, setShareExpiry] = useState(null);
  
  // 新增：来源区和操作记录区选择状态
  const [selectedSources, setSelectedSources] = useState({
    uploadedFiles: [],
    links: [],
    addedTexts: [],
    courseVideos: [],
    organizationalCourses: []
  });
  const [selectedOperations, setSelectedOperations] = useState({});
  const [showDataSelection, setShowDataSelection] = useState(true); // 默认显示数据选择界面
  const [currentStep, setCurrentStep] = useState(1); // 1: 内容选择, 2: 分享目标选择
  
  // 表单实例
  const [squareForm] = Form.useForm();
  const [userShareForm] = Form.useForm();
  
  // 可用标签
  const availableTags = ['主题', '界面', '美化', '深色', '浅色', '简约', '炫酷', '专业', '学习', '工作'];

  useEffect(() => {
    if (visible && theme) {
      // 初始化表单数据
      setShareTitle(theme.name || '');
      setShareDescription('');
      setShareTags([]);
      setShareCategory('');
      setSelectedUsers([]);
      setShareMessage('');
      setSharePermissions('view');
      setShareExpiry(null);
      
      // 重置步骤状态
      setShowDataSelection(true);
      setCurrentStep(1);
      
      // 默认全选所有来源数据
      const defaultSelectedSources = {};
      Object.keys(sourceData).forEach(sourceType => {
        if (sourceData[sourceType] && Array.isArray(sourceData[sourceType])) {
          defaultSelectedSources[sourceType] = sourceData[sourceType].map(item => item.id);
        }
      });
      setSelectedSources(defaultSelectedSources);
      
      // 默认全选所有操作记录
      const defaultSelectedOperations = {};
      Object.entries(operationRecords).forEach(([recordType, records]) => {
        if (records && Array.isArray(records)) {
          records.forEach(record => {
            defaultSelectedOperations[record.id] = true;
          });
        }
      });
      setSelectedOperations(defaultSelectedOperations);
    }
  }, [visible, theme, sourceData, operationRecords]);

  // 处理学习广场分享
  const handleLearningSquareShare = async () => {
    if (!shareTitle.trim()) {
      message.error('请输入分享标题');
      return;
    }

    setLoading(true);
    try {
      const shareOptions = {
        title: shareTitle,
        description: shareDescription,
        tags: shareTags,
        category: shareCategory,
        sharedBy: '当前用户'
      };

      const result = shareTargetSquareSection === 'training-projects'
        ? themeShareService.shareTrainingProjectToLearningSquare(theme, shareOptions)
        : themeShareService.shareToLearningSquare(theme, shareOptions);
      
      if (result) {
        message.success('主题已成功分享到学习广场！');
        if (onShareSuccess) {
          const target = shareTargetSquareSection === 'training-projects' ? 'learning-square-training-projects' : 'learning-square'
          onShareSuccess(target, result);
        }
        onCancel();
      }
    } catch (error) {
      console.error('分享失败:', error);
      message.error('分享失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 分享给其他人的表单处理
  const handleUserShare = async (values) => {
    try {
      setLoading(true);
      
      const currentUser = userService.getCurrentUser();
      if (!currentUser) {
        message.error('请先登录');
        return;
      }

      const shareData = {
        themeId: theme.id,
        themeData: theme,
        recipients: selectedUsers,
        permissions: values.permissions || 'view',
        message: values.message || '',
        expiryDate: values.expiryDate ? values.expiryDate.toISOString() : null,
        allowForward: values.allowForward || false,
        author: currentUser.username,
        authorId: currentUser.id
      };

      const result = await themeShareService.shareToUsers(shareData);
      
      if (result.success) {
        message.success(`主题已成功分享给 ${selectedUsers.length} 个用户！`);
        // 重置表单
        userShareForm.resetFields();
        setSelectedUsers([]);
      } else {
        message.error(result.message || '分享失败，请重试');
      }
    } catch (error) {
      console.error('分享失败:', error);
      message.error('分享失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理私人分享
  const handlePrivateShare = async () => {
    if (selectedUsers.length === 0) {
      message.error('请选择要分享的用户');
      return;
    }

    setLoading(true);
    try {
      const currentUser = userService.getCurrentUser();
      if (!currentUser) {
        message.error('请先登录');
        return;
      }

      const shareOptions = {
        message: shareMessage,
        permissions: sharePermissions,
        expiresAt: shareExpiry?.toISOString(),
        sharedBy: currentUser.username,
        authorId: currentUser.id
      };

      const result = themeShareService.shareToUsers(theme, selectedUsers, shareOptions);
      
      if (result) {
        message.success(`主题已成功分享给 ${selectedUsers.length} 个用户！`);
        if (onShareSuccess) {
          onShareSuccess('private', result);
        }
        onCancel();
      }
    } catch (error) {
      console.error('分享失败:', error);
      message.error('分享失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 生成分享链接
  const handleGenerateLink = () => {
    const shareLink = themeShareService.generateShareLink(theme, 'public');
    navigator.clipboard.writeText(shareLink);
    message.success('分享链接已复制到剪贴板');
  };

  // 添加标签
  const handleAddTag = (tag) => {
    if (!shareTags.includes(tag)) {
      setShareTags([...shareTags, tag]);
    }
  };

  // 移除标签
  const handleRemoveTag = (tagToRemove) => {
    setShareTags(shareTags.filter(tag => tag !== tagToRemove));
  };

  // 进入下一步（分享目标选择）
  const handleNextStep = () => {
    setShowDataSelection(false);
    setCurrentStep(2);
  };

  // 返回上一步（内容选择）
  const handlePrevStep = () => {
    setShowDataSelection(true);
    setCurrentStep(1);
  };

  // 处理来源区数据选择
  const handleSourceSelection = (sourceType, itemId, checked) => {
    setSelectedSources(prev => ({
      ...prev,
      [sourceType]: checked 
        ? [...(prev[sourceType] || []), itemId]
        : (prev[sourceType] || []).filter(id => id !== itemId)
    }));
  };

  // 处理操作记录选择
  const handleOperationSelection = (recordId, checked) => {
    setSelectedOperations(prev => ({
      ...prev,
      [recordId]: checked
    }));
  };

  // 获取来源区图标
  const getSourceIcon = (sourceType) => {
    const iconMap = {
      uploadedFiles: <FileOutlined />,
      links: <LinkOutlined />,
      addedTexts: <BookOutlined />,
      courseVideos: <VideoCameraOutlined />,
      organizationalCourses: <DatabaseOutlined />
    };
    return iconMap[sourceType] || <FileOutlined />;
  };

  // 获取操作记录图标
  const getOperationIcon = (operationType) => {
    const iconMap = {
      audio: '🎵',
      video: '📹',
      ppt: '📊',
      mindmap: '🧠',
      report: '📋',
      'training-plan': '📚',
      scenario: '🎭',
      text: '📝',
      note: '✏️',
      webcode: '💻'
    };
    return <span style={{ fontSize: '16px', marginRight: 8 }}>{iconMap[operationType] || '⚙️'}</span>;
  };

  // 获取来源区标题
  const getSourceTitle = (sourceType) => {
    const titleMap = {
      uploadedFiles: '上传文件',
      links: '链接资源',
      addedTexts: '添加文本',
      courseVideos: '课程视频',
      organizationalCourses: '组织课程'
    };
    return titleMap[sourceType] || sourceType;
  };

  // 渲染数据选择界面
  const renderDataSelection = () => (
    <div className="data-selection-container">
      {/* 步骤指示器 */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '8px 16px', 
            backgroundColor: '#1890ff', 
            color: 'white', 
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            <span>1</span>
            <span style={{ marginLeft: 8 }}>选择内容</span>
          </div>
          <RightOutlined style={{ margin: '0 16px', color: '#d9d9d9' }} />
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '8px 16px', 
            backgroundColor: '#f5f5f5', 
            color: '#999', 
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            <span>2</span>
            <span style={{ marginLeft: 8 }}>选择分享目标</span>
          </div>
        </div>
      </div>

      <Title level={4}>选择要分享的内容</Title>
      
      {/* 来源区数据选择 */}
      <Card title="来源区数据" size="small" style={{ marginBottom: 16 }}>
        <Collapse size="small">
          {Object.entries(sourceData).map(([sourceType, items]) => (
            items.length > 0 && (
              <Panel 
                header={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {getSourceIcon(sourceType)}
                    <span style={{ marginLeft: 8 }}>{getSourceTitle(sourceType)} ({items.length})</span>
                  </div>
                }
                key={sourceType}
              >
                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                  {items.map((item, index) => (
                    <div key={item.id || index} style={{ marginBottom: 8 }}>
                      <Checkbox
                        checked={selectedSources[sourceType] && selectedSources[sourceType].includes(item.id || index)}
                        onChange={(e) => handleSourceSelection(sourceType, item.id || index, e.target.checked)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Text ellipsis style={{ maxWidth: 300 }}>
                            {item.name || item.title || item.url || `${sourceType}_${index + 1}`}
                          </Text>
                          {item.size && (
                            <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
                              ({item.size})
                            </Text>
                          )}
                        </div>
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </Panel>
            )
          ))}
        </Collapse>
      </Card>

      {/* 操作记录区数据选择 */}
      <Card title="操作记录" size="small">
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {Object.values(operationRecords).flat().length === 0 ? (
            <Empty description="暂无操作记录" />
          ) : (
            Object.entries(operationRecords).map(([recordType, records]) => 
              Array.isArray(records) ? records.map((record) => (
                <div key={record.id} style={{ marginBottom: 12, padding: 8, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                  <Checkbox
                    checked={selectedOperations[record.id] || false}
                    onChange={(e) => handleOperationSelection(record.id, e.target.checked)}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                        {getOperationIcon(record.type)}
                        <Text strong style={{ marginLeft: 8 }}>{record.title}</Text>
                        <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
                          {record.time}
                        </Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {record.source}
                      </Text>
                      {record.isAIGenerated && (
                        <Text type="secondary" style={{ fontSize: '10px', color: '#1890ff' }}>
                          🤖 AI生成
                        </Text>
                      )}
                    </div>
                  </Checkbox>
                </div>
              )) : []
            ).flat()
          )}
        </div>
      </Card>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Space>
          <Button onClick={onCancel}>
            取消
          </Button>
          <Button 
            type="primary" 
            onClick={handleNextStep}
            disabled={
              Object.values(selectedSources).every(arr => arr.length === 0) && 
              Object.values(selectedOperations).every(val => !val)
            }
          >
            下一步 <RightOutlined />
          </Button>
        </Space>
      </div>
    </div>
  );

  // 渲染学习广场分享标签页
  const renderLearningSquareTab = () => (
    <div className="share-tab-content">
      <div className="theme-preview">
        <Card size="small">
          <div className="theme-preview-header">
            <div className="theme-colors">
              <div 
                className="color-dot" 
                style={{ backgroundColor: theme.colors.primary }}
              />
              <div 
                className="color-dot" 
                style={{ backgroundColor: theme.colors.textPrimary }}
              />
              <div 
                className="color-dot" 
                style={{ background: theme.colors.background }}
              />
            </div>
            <Text strong>{theme.name}</Text>
          </div>
        </Card>
      </div>

      <Form layout="vertical">
        <Form.Item label="分享标题" required>
          <Input
            value={shareTitle}
            onChange={(e) => setShareTitle(e.target.value)}
            placeholder="为您的主题分享起个标题"
            maxLength={50}
          />
        </Form.Item>

        <Form.Item label="分享描述">
          <TextArea
            value={shareDescription}
            onChange={(e) => setShareDescription(e.target.value)}
            placeholder="描述一下这个主题的特色..."
            rows={3}
            maxLength={200}
          />
        </Form.Item>

        <Form.Item label="标签">
          <div className="tags-container">
            <div className="selected-tags">
              {shareTags.map(tag => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => handleRemoveTag(tag)}
                  color="blue"
                >
                  {tag}
                </Tag>
              ))}
            </div>
            <div className="available-tags">
              <Text type="secondary" style={{ fontSize: '12px' }}>推荐标签：</Text>
              <Space wrap size="small">
                {availableTags
                  .filter(tag => !shareTags.includes(tag))
                  .map(tag => (
                    <Tag
                      key={tag}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleAddTag(tag)}
                    >
                      + {tag}
                    </Tag>
                  ))}
              </Space>
            </div>
          </div>
        </Form.Item>

        <Form.Item label="分类">
          <Select
            value={shareCategory}
            onChange={setShareCategory}
            style={{ width: '100%' }}
          >
            <Option value="theme">主题美化</Option>
            <Option value="ui">界面设计</Option>
            <Option value="productivity">效率工具</Option>
            <Option value="learning">学习资源</Option>
          </Select>
        </Form.Item>

        {/* 数据选择区域 */}
        <Form.Item label="分享内容">
          <Card size="small" style={{ backgroundColor: '#fafafa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text>选择要分享的来源数据和操作记录</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  已选择: {
                    Object.values(selectedSources).reduce((sum, arr) => sum + arr.length, 0) +
                    Object.values(selectedOperations).filter(Boolean).length
                  } 项内容
                </Text>
              </div>
              <Button 
                type="dashed" 
                icon={<SettingOutlined />}
                onClick={() => setShowDataSelection(true)}
              >
                选择内容
              </Button>
            </div>
          </Card>
        </Form.Item>
      </Form>

      <div className="share-actions">
        <Button
          type="primary"
          icon={<GlobalOutlined />}
          loading={loading}
          onClick={handleLearningSquareShare}
          size="large"
          block
        >
          分享到学习广场
        </Button>
      </div>
    </div>
  );

  // 渲染私人分享标签页
  const renderPrivateShareTab = () => (
    <div className="share-tab-content">
      <Form layout="vertical">
        <Form.Item 
          label="选择用户" 
          name="recipients"
          rules={[{ required: true, message: '请选择至少一个用户' }]}
        >
          <UserSelector
            value={selectedUsers}
            onChange={setSelectedUsers}
            placeholder="搜索并选择要分享的用户..."
            maxCount={20}
            showOnlineStatus={true}
            excludeCurrentUser={true}
          />
        </Form.Item>

        <Form.Item label="分享消息">
          <TextArea
            value={shareMessage}
            onChange={(e) => setShareMessage(e.target.value)}
            placeholder="给接收者留个消息..."
            rows={3}
            maxLength={200}
          />
        </Form.Item>

        <Form.Item label="权限设置">
          <Radio.Group
            value={sharePermissions}
            onChange={(e) => setSharePermissions(e.target.value)}
          >
            <Radio value="view">仅查看</Radio>
            <Radio value="download">可下载</Radio>
            <Radio value="edit">可编辑</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="过期时间">
          <DatePicker
            value={shareExpiry}
            onChange={setShareExpiry}
            placeholder="选择过期时间（可选）"
            style={{ width: '100%' }}
            showTime
          />
        </Form.Item>

        {/* 数据选择区域 */}
        <Form.Item label="分享内容">
          <Card size="small" style={{ backgroundColor: '#fafafa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text>选择要分享的来源数据和操作记录</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  已选择: {
                    Object.values(selectedSources).reduce((sum, arr) => sum + arr.length, 0) +
                    Object.values(selectedOperations).filter(Boolean).length
                  } 项内容
                </Text>
              </div>
              <Button 
                type="dashed" 
                icon={<SettingOutlined />}
                onClick={() => setShowDataSelection(true)}
              >
                选择内容
              </Button>
            </div>
          </Card>
        </Form.Item>
      </Form>

      <div className="share-actions">
        <Space style={{ width: '100%' }}>
          <Button
            type="primary"
            icon={<ShareAltOutlined />}
            loading={loading}
            onClick={handlePrivateShare}
            size="large"
            style={{ flex: 1 }}
          >
            发送分享
          </Button>
          <Button
            icon={<LinkOutlined />}
            onClick={handleGenerateLink}
            size="large"
          >
            生成链接
          </Button>
        </Space>
      </div>
    </div>
  );

  if (!theme) return null;

  return (
    <Modal
      title={
        <div className="modal-title">
          <ShareAltOutlined style={{ marginRight: '8px' }} />
          {showDataSelection ? '选择分享内容' : `分享主题 - ${theme.name}`}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={showDataSelection ? 800 : 600}
      className="theme-share-modal"
    >
      {showDataSelection ? (
        renderDataSelection()
      ) : (
        <div>
          {/* 步骤指示器 */}
          <div style={{ marginBottom: 24, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '8px 16px', 
                backgroundColor: '#52c41a', 
                color: 'white', 
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                <span>1</span>
                <span style={{ marginLeft: 8 }}>选择内容</span>
              </div>
              <RightOutlined style={{ margin: '0 16px', color: '#52c41a' }} />
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '8px 16px', 
                backgroundColor: '#1890ff', 
                color: 'white', 
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                <span>2</span>
                <span style={{ marginLeft: 8 }}>选择分享目标</span>
              </div>
            </div>
          </div>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
          >
            <TabPane
              tab={
                <span>
                  <GlobalOutlined />
                  学习广场
                </span>
              }
              key="learning-square"
            >
              {renderLearningSquareTab()}
            </TabPane>
          
          <TabPane
            tab={
              <span>
                <UserOutlined />
                分享给好友
              </span>
            }
            key="private"
          >
            {renderPrivateShareTab()}
          </TabPane>
        </Tabs>

        {/* 返回按钮 */}
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Button onClick={handlePrevStep} icon={<LeftOutlined />}>
            返回上一步
          </Button>
        </div>
      </div>
      )}
    </Modal>
  );
};

export default ThemeShareModal;