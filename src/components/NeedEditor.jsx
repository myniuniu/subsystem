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
import './NeedEditor.css';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const NeedEditor = ({
  visible,
  note,
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
      if (note && mode !== 'create') {
        form.setFieldsValue({
          title: note.title,
          content: note.content,
          category: note.category,
          tags: note.tags,
          starred: note.starred
        });
        setSelectedTags(note.tags || []);
        setWordCount(getWordCount(note.content || ''));
      } else {
        form.resetFields();
        setSelectedTags([]);
        setWordCount(0);
      }
      setPreviewMode(mode === 'view');
    }
  }, [visible, note, mode, form]);

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

  // 保存需求
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const noteData = {
        ...values,
        tags: selectedTags
      };
      
      await onSave(noteData);
      message.success(mode === 'create' ? '需求创建成功' : '需求更新成功');
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
        {mode === 'create' && '创建需求'}
        {mode === 'edit' && '编辑需求'}
        {mode === 'view' && '查看需求'}
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
      title={null}
      open={visible}
      onCancel={onCancel}
      width={800}
      className="need-editor-modal"
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
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
      {/* 自定义头部 */}
      <div className="custom-modal-header">
        <div className="header-content">
          <h3 className="header-title">编辑需求</h3>
          <div className="header-info">
            <span>字数: {wordCount} 预计阅读: {Math.max(1, Math.ceil(wordCount / 250))} 分钟</span>
          </div>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        className="need-editor-form"
      >
        {/* 标题 */}
        <Form.Item
          name="title"
          label={<span className="form-label">标题</span>}
          rules={[{ required: true, message: '请输入需求标题' }]}
        >
          <Input
            placeholder="请输入需求标题"
            disabled={mode === 'view'}
            size="large"
            className="title-input"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            {/* 分类 */}
            <Form.Item
              name="category"
              label={<span className="form-label">分类</span>}
              rules={[{ required: true, message: '请选择分类' }]}
            >
              <Select
                placeholder="选择分类"
                disabled={mode === 'view'}
                className="category-select"
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
              label={<span className="form-label">收藏</span>}
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

        {/* 标签 */}
        <Form.Item label={<span className="form-label">标签</span>}>
          <div className="tags-section">
            <div className="selected-tags">
              {selectedTags.map(tag => (
                <Tag
                  key={tag}
                  closable={mode !== 'view'}
                  onClose={() => handleRemoveTag(tag)}
                  className="custom-tag"
                >
                  {tag}
                </Tag>
              ))}
            </div>
            {mode !== 'view' && (
              <div className="tag-input-section">
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
          </div>
        )}

        {/* 内容编辑区 */}
        <Form.Item
          name="content"
          label={<span className="form-label">内容</span>}
          rules={[{ required: true, message: '请输入需求内容' }]}
        >
          {previewMode ? (
            <div className="content-preview">
              {renderPreview(form.getFieldValue('content'))}
            </div>
          ) : (
            <TextArea
              ref={textAreaRef}
              placeholder="开始写下你的想法..."
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