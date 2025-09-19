import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Tag,
  Space,
  Switch,
  Divider,
  message,
  Tooltip,
  Row,
  Col,
  Typography
} from 'antd';
import {
  SaveOutlined,
  CloseOutlined,
  StarOutlined,
  StarFilled,
  EyeOutlined,
  EditOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  PictureOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { EDUCATION_LEVELS, ROLES, TRAINING_TYPES, TRAINING_SOURCES, PRIORITY_LEVELS, TRAINING_STATUS } from '../data/trainingDataTemplates';
import './NeedEditor.css';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const NeedEditor = ({
  visible,
  need,
  categories,
  tags,
  onSave,
  onCancel,
  mode = 'create' // 'create' | 'edit' | 'view'
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const textAreaRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  // 初始化表单数据
  useEffect(() => {
    if (visible) {
      if (need && mode !== 'create') {
        form.setFieldsValue({
          title: need.title,
          content: need.content,
          category: need.category,
          tags: need.tags,
          starred: need.starred,
          educationLevel: need.educationLevel,
          role: need.role,
          trainingType: need.trainingType,
          source: need.source,
          priority: need.priority,
          status: need.status
        });
        setSelectedTags(need.tags || []);
        setWordCount(getWordCount(need.content || ''));
        setPreviewMode(mode === 'view'); // 查看模式默认为预览
      } else {
        form.resetFields();
        form.setFieldsValue({
          priority: PRIORITY_LEVELS.MEDIUM,
          status: TRAINING_STATUS.PENDING,
          starred: false
        });
        setSelectedTags([]);
        setWordCount(0);
        setPreviewMode(false);
      }
    }
  }, [visible, need, mode, form]);

  // 计算字数
  const getWordCount = (content) => {
    if (!content) return 0;
    const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
    return chineseChars + englishWords;
  };

  // 内容变化处理
  const handleContentChange = (e) => {
    const content = e.target.value;
    setWordCount(getWordCount(content));
    setCursorPosition(e.target.selectionStart);
  };

  // 保存培训需求
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const needData = {
        ...values,
        tags: selectedTags
      };
      
      await onSave(needData);
      message.success(mode === 'create' ? '培训需求创建成功' : '培训需求更新成功');
      form.resetFields();
      setSelectedTags([]);
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 添加标签
  const handleAddTag = () => {
    if (newTag && !selectedTags.includes(newTag)) {
      setSelectedTags([...selectedTags, newTag]);
      setNewTag('');
    }
  };

  // 移除标签
  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  // 插入文本格式
  const insertFormat = (prefix, suffix = '') => {
    const textArea = textAreaRef.current?.resizableTextArea?.textArea;
    if (!textArea) return;

    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selectedText = textArea.value.substring(start, end);
    const beforeText = textArea.value.substring(0, start);
    const afterText = textArea.value.substring(end);
    
    const newText = beforeText + prefix + selectedText + suffix + afterText;
    const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
    
    form.setFieldValue('content', newText);
    setWordCount(getWordCount(newText));
    
    // 重新聚焦并设置光标位置
    setTimeout(() => {
      textArea.focus();
      textArea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // 格式化工具栏
  const formatToolbar = [
    {
      icon: <BoldOutlined />,
      title: '粗体',
      action: () => insertFormat('**', '**')
    },
    {
      icon: <ItalicOutlined />,
      title: '斜体',
      action: () => insertFormat('*', '*')
    },
    {
      icon: <UnderlineOutlined />,
      title: '下划线',
      action: () => insertFormat('<u>', '</u>')
    },
    {
      icon: <CodeOutlined />,
      title: '代码',
      action: () => insertFormat('`', '`')
    },
    {
      icon: <UnorderedListOutlined />,
      title: '无序列表',
      action: () => insertFormat('- ')
    },
    {
      icon: <OrderedListOutlined />,
      title: '有序列表',
      action: () => insertFormat('1. ')
    },
    {
      icon: <LinkOutlined />,
      title: '链接',
      action: () => insertFormat('[链接文本](', ')')
    },
    {
      icon: <PictureOutlined />,
      title: '图片',
      action: () => insertFormat('![图片描述](', ')')
    }
  ];

  // 渲染预览内容
  const renderPreview = (content) => {
    if (!content) return '暂无内容';
    
    // 简单的 Markdown 渲染
    let html = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />')
      .replace(/\n/g, '<br />');
    
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const modalTitle = (
    <div className="editor-header">
      <Space>
        {mode === 'create' && '创建培训需求'}
        {mode === 'edit' && '编辑培训需求'}
        {mode === 'view' && '查看培训需求'}
        {mode !== 'view' && (
          <Tooltip title={previewMode ? '编辑模式' : '预览模式'}>
            <Button
              type="text"
              icon={previewMode ? <EditOutlined /> : <EyeOutlined />}
              onClick={() => setPreviewMode(!previewMode)}
            />
          </Tooltip>
        )}
      </Space>
      <Space>
        <Text type="secondary">字数: {wordCount}</Text>
        {wordCount > 0 && (
          <Text type="secondary">
            预计阅读: {Math.max(1, Math.ceil(wordCount / 250))} 分钟
          </Text>
        )}
      </Space>
    </div>
  );

  return (
    <Modal
      title={modalTitle}
      open={visible}
      onCancel={onCancel}
      width={800}
      className="need-editor-modal"
      footer={[
        <Button key="cancel" onClick={onCancel}>
          <CloseOutlined /> 取消
        </Button>,
        mode !== 'view' && (
          <Button
            key="save"
            type="primary"
            loading={loading}
            onClick={handleSave}
            icon={<SaveOutlined />}
          >
            保存
          </Button>
        )
      ].filter(Boolean)}
    >
      <Form
        form={form}
        layout="vertical"
        className="need-editor-form"
      >
        {/* 标题 */}
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入培训需求标题' }]}
        >
          <Input
            placeholder="请输入培训需求标题"
            disabled={mode === 'view'}
            size="large"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            {/* 分类 */}
            <Form.Item
              name="category"
              label="分类"
              rules={[{ required: true, message: '请选择分类' }]}
            >
              <Select
                placeholder="选择分类"
                disabled={mode === 'view'}
              >
                {categories
                  .filter(cat => cat.id !== 'all' && cat.id !== 'starred')
                  .map(category => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* 收藏 */}
            <Form.Item
              name="starred"
              label="收藏"
              valuePropName="checked"
            >
              <Switch
                disabled={mode === 'view'}
                checkedChildren={<StarFilled />}
                unCheckedChildren={<StarOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            {/* 教育层次 */}
            <Form.Item
              name="educationLevel"
              label="教育层次"
              rules={[{ required: true, message: '请选择教育层次' }]}
            >
              <Select
                placeholder="选择教育层次"
                disabled={mode === 'view'}
              >
                {Object.entries(EDUCATION_LEVELS).map(([key, value]) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            {/* 角色 */}
            <Form.Item
              name="role"
              label="角色"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select
                placeholder="选择角色"
                disabled={mode === 'view'}
              >
                {Object.entries(ROLES).map(([key, value]) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            {/* 培训类型 */}
            <Form.Item
              name="trainingType"
              label="培训类型"
              rules={[{ required: true, message: '请选择培训类型' }]}
            >
              <Select
                placeholder="选择培训类型"
                disabled={mode === 'view'}
              >
                {Object.entries(TRAINING_TYPES).map(([key, value]) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            {/* 培训来源 */}
            <Form.Item
              name="source"
              label="培训来源"
              rules={[{ required: true, message: '请选择培训来源' }]}
            >
              <Select
                placeholder="选择培训来源"
                disabled={mode === 'view'}
              >
                {Object.entries(TRAINING_SOURCES).map(([key, value]) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            {/* 优先级 */}
            <Form.Item
              name="priority"
              label="优先级"
              rules={[{ required: true, message: '请选择优先级' }]}
            >
              <Select
                placeholder="选择优先级"
                disabled={mode === 'view'}
              >
                {Object.entries(PRIORITY_LEVELS).map(([key, value]) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            {/* 状态 */}
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select
                placeholder="选择状态"
                disabled={mode === 'view'}
              >
                {Object.entries(TRAINING_STATUS).map(([key, value]) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* 标签 */}
        <Form.Item label="标签">
          <div className="tags-input">
            <div className="selected-tags">
              {selectedTags.map(tag => (
                <Tag
                  key={tag}
                  closable={mode !== 'view'}
                  onClose={() => handleRemoveTag(tag)}
                  color="blue"
                >
                  {tag}
                </Tag>
              ))}
            </div>
            {mode !== 'view' && (
              <div className="tag-input-row">
                <Input
                  placeholder="添加标签"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onPressEnter={handleAddTag}
                  style={{ width: 120 }}
                  size="small"
                />
                <Button
                  type="dashed"
                  size="small"
                  onClick={handleAddTag}
                  disabled={!newTag}
                >
                  添加
                </Button>
                <Select
                  placeholder="选择已有标签"
                  style={{ width: 150 }}
                  size="small"
                  value={undefined}
                  onChange={(value) => {
                    if (value && !selectedTags.includes(value)) {
                      setSelectedTags([...selectedTags, value]);
                    }
                  }}
                >
                  {tags
                    .filter(tag => !selectedTags.includes(tag))
                    .map(tag => (
                      <Option key={tag} value={tag}>{tag}</Option>
                    ))
                  }
                </Select>
              </div>
            )}
          </div>
        </Form.Item>

        <Divider />

        {/* 格式化工具栏 */}
        {mode !== 'view' && !previewMode && (
          <div className="format-toolbar">
            <Space wrap>
              {formatToolbar.map((tool, index) => (
                <Tooltip key={index} title={tool.title}>
                  <Button
                    type="text"
                    icon={tool.icon}
                    onClick={tool.action}
                    size="small"
                  />
                </Tooltip>
              ))}
            </Space>
            <Divider />
          </div>
        )}

        {/* 内容编辑区 */}
        <Form.Item
          name="content"
          label="内容"
          rules={[{ required: true, message: '请输入培训需求内容' }]}
        >
          {previewMode ? (
            <div className="content-preview">
              {renderPreview(form.getFieldValue('content'))}
            </div>
          ) : (
            <TextArea
              ref={textAreaRef}
              placeholder="详细描述培训需求..."
              disabled={mode === 'view'}
              rows={12}
              onChange={handleContentChange}
              className="content-editor"
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NeedEditor;