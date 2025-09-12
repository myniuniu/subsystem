import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  List,
  Tag,
  Space,
  Popconfirm,
  message,
  Tabs,
  ColorPicker,
  Select,
  Typography,
  Divider,
  Card,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  FolderOutlined,
  TagOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  BookOutlined,
  UserOutlined,
  BulbOutlined,
  StarOutlined,
  HeartOutlined,
  HomeOutlined,
  SettingOutlined
} from '@ant-design/icons';
import './CategoryTagManager.css';

const { TabPane } = Tabs;
const { Text } = Typography;

// 可选图标列表
const ICON_OPTIONS = [
  { value: 'FileTextOutlined', label: '文档', icon: <FileTextOutlined /> },
  { value: 'FolderOpenOutlined', label: '工作', icon: <FolderOpenOutlined /> },
  { value: 'BookOutlined', label: '学习', icon: <BookOutlined /> },
  { value: 'UserOutlined', label: '个人', icon: <UserOutlined /> },
  { value: 'BulbOutlined', label: '想法', icon: <BulbOutlined /> },
  { value: 'StarOutlined', label: '收藏', icon: <StarOutlined /> },
  { value: 'HeartOutlined', label: '喜欢', icon: <HeartOutlined /> },
  { value: 'HomeOutlined', label: '家庭', icon: <HomeOutlined /> },
  { value: 'SettingOutlined', label: '设置', icon: <SettingOutlined /> },
  { value: 'FolderOutlined', label: '文件夹', icon: <FolderOutlined /> }
];

// 预设颜色
const PRESET_COLORS = [
  '#1890ff', '#52c41a', '#722ed1', '#fa8c16', '#eb2f96',
  '#13c2c2', '#faad14', '#f5222d', '#2f54eb', '#a0d911'
];

const CategoryTagManager = ({
  visible,
  onCancel,
  onSave,
  categories = [],
  tags = [],
  stats = {}
}) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('categories');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingTag, setEditingTag] = useState(null);
  const [localCategories, setLocalCategories] = useState([]);
  const [localTags, setLocalTags] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (visible) {
      setLocalCategories([...categories]);
      setLocalTags([...tags]);
      setEditingCategory(null);
      setEditingTag(null);
      setIsEditing(false);
      form.resetFields();
    }
  }, [visible, categories, tags, form]);

  // 添加分类
  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsEditing(true);
    form.setFieldsValue({
      name: '',
      icon: 'FileTextOutlined',
      color: '#1890ff'
    });
  };

  // 编辑分类
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsEditing(true);
    form.setFieldsValue({
      name: category.name,
      icon: category.icon,
      color: category.color
    });
  };

  // 保存分类
  const handleSaveCategory = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingCategory) {
        // 更新分类
        const updatedCategories = localCategories.map(cat => 
          cat.id === editingCategory.id 
            ? { ...cat, ...values }
            : cat
        );
        setLocalCategories(updatedCategories);
        message.success('分类更新成功');
      } else {
        // 添加新分类
        const newCategory = {
          id: `custom_${Date.now()}`,
          ...values
        };
        setLocalCategories([...localCategories, newCategory]);
        message.success('分类添加成功');
      }
      
      setIsEditing(false);
      setEditingCategory(null);
      form.resetFields();
    } catch (error) {
      console.error('保存分类失败:', error);
    }
  };

  // 删除分类
  const handleDeleteCategory = (categoryId) => {
    // 检查是否为系统默认分类
    const systemCategories = ['all', 'work', 'study', 'personal', 'ideas', 'starred'];
    if (systemCategories.includes(categoryId)) {
      message.warning('系统默认分类不能删除');
      return;
    }

    const updatedCategories = localCategories.filter(cat => cat.id !== categoryId);
    setLocalCategories(updatedCategories);
    message.success('分类删除成功');
  };

  // 添加标签
  const handleAddTag = () => {
    setEditingTag(null);
    setIsEditing(true);
    form.setFieldsValue({
      name: '',
      color: '#1890ff'
    });
  };

  // 编辑标签
  const handleEditTag = (tag) => {
    setEditingTag(tag);
    setIsEditing(true);
    form.setFieldsValue({
      name: typeof tag === 'string' ? tag : tag.name,
      color: typeof tag === 'string' ? '#1890ff' : (tag.color || '#1890ff')
    });
  };

  // 保存标签
  const handleSaveTag = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingTag) {
        // 更新标签
        const tagIndex = localTags.findIndex(tag => 
          (typeof tag === 'string' ? tag : tag.name) === 
          (typeof editingTag === 'string' ? editingTag : editingTag.name)
        );
        
        if (tagIndex !== -1) {
          const updatedTags = [...localTags];
          updatedTags[tagIndex] = typeof localTags[tagIndex] === 'string' 
            ? values.name 
            : { ...localTags[tagIndex], ...values };
          setLocalTags(updatedTags);
        }
        message.success('标签更新成功');
      } else {
        // 添加新标签
        if (localTags.some(tag => 
          (typeof tag === 'string' ? tag : tag.name) === values.name
        )) {
          message.warning('标签已存在');
          return;
        }
        
        setLocalTags([...localTags, values.name]);
        message.success('标签添加成功');
      }
      
      setIsEditing(false);
      setEditingTag(null);
      form.resetFields();
    } catch (error) {
      console.error('保存标签失败:', error);
    }
  };

  // 删除标签
  const handleDeleteTag = (tagToDelete) => {
    const updatedTags = localTags.filter(tag => 
      (typeof tag === 'string' ? tag : tag.name) !== 
      (typeof tagToDelete === 'string' ? tagToDelete : tagToDelete.name)
    );
    setLocalTags(updatedTags);
    message.success('标签删除成功');
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCategory(null);
    setEditingTag(null);
    form.resetFields();
  };

  // 保存所有更改
  const handleSaveAll = () => {
    onSave({
      categories: localCategories,
      tags: localTags
    });
  };

  // 获取图标组件
  const getIconComponent = (iconName) => {
    const iconMap = {
      FileTextOutlined: <FileTextOutlined />,
      FolderOpenOutlined: <FolderOpenOutlined />,
      BookOutlined: <BookOutlined />,
      UserOutlined: <UserOutlined />,
      BulbOutlined: <BulbOutlined />,
      StarOutlined: <StarOutlined />,
      HeartOutlined: <HeartOutlined />,
      HomeOutlined: <HomeOutlined />,
      SettingOutlined: <SettingOutlined />,
      FolderOutlined: <FolderOutlined />
    };
    return iconMap[iconName] || <FileTextOutlined />;
  };

  // 渲染分类列表
  const renderCategoryList = () => (
    <div className="category-manager">
      <div className="manager-header">
        <Text strong>分类管理</Text>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddCategory}
          disabled={isEditing}
        >
          添加分类
        </Button>
      </div>
      
      <List
        className="category-list"
        dataSource={localCategories}
        renderItem={(category) => {
          const count = stats.categories?.[category.id] || 0;
          const isSystemCategory = ['all', 'work', 'study', 'personal', 'ideas', 'starred'].includes(category.id);
          
          return (
            <List.Item
              className="category-item"
              actions={[
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEditCategory(category)}
                  disabled={isEditing || isSystemCategory}
                  title={isSystemCategory ? '系统分类不可编辑' : '编辑分类'}
                />,
                <Popconfirm
                  title="确定要删除这个分类吗？"
                  onConfirm={() => handleDeleteCategory(category.id)}
                  okText="确定"
                  cancelText="取消"
                  disabled={isSystemCategory}
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    disabled={isEditing || isSystemCategory}
                    title={isSystemCategory ? '系统分类不可删除' : '删除分类'}
                  />
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div 
                    className="category-avatar"
                    style={{ backgroundColor: category.color }}
                  >
                    {getIconComponent(category.icon)}
                  </div>
                }
                title={
                  <Space>
                    <span>{category.name}</span>
                    {isSystemCategory && <Tag size="small">系统</Tag>}
                  </Space>
                }
                description={`${count} 篇笔记`}
              />
            </List.Item>
          );
        }}
      />
    </div>
  );

  // 渲染标签列表
  const renderTagList = () => (
    <div className="tag-manager">
      <div className="manager-header">
        <Text strong>标签管理</Text>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddTag}
          disabled={isEditing}
        >
          添加标签
        </Button>
      </div>
      
      <div className="tag-grid">
        {localTags.map((tag, index) => {
          const tagName = typeof tag === 'string' ? tag : tag.name;
          const tagColor = typeof tag === 'string' ? '#1890ff' : (tag.color || '#1890ff');
          const count = stats.tags?.[tagName] || 0;
          
          return (
            <Card
              key={index}
              className="tag-card"
              size="small"
              actions={[
                <EditOutlined 
                  onClick={() => handleEditTag(tag)}
                  disabled={isEditing}
                />,
                <Popconfirm
                  title="确定要删除这个标签吗？"
                  onConfirm={() => handleDeleteTag(tag)}
                  okText="确定"
                  cancelText="取消"
                >
                  <DeleteOutlined disabled={isEditing} />
                </Popconfirm>
              ]}
            >
              <div className="tag-content">
                <Tag color={tagColor} className="tag-preview">
                  <TagOutlined /> {tagName}
                </Tag>
                <Text type="secondary" className="tag-count">
                  {count} 次使用
                </Text>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // 渲染编辑表单
  const renderEditForm = () => {
    if (!isEditing) return null;
    
    const isCategory = activeTab === 'categories';
    
    return (
      <Card className="edit-form-card" title={`${editingCategory || editingTag ? '编辑' : '添加'}${isCategory ? '分类' : '标签'}`}>
        <Form
          form={form}
          layout="vertical"
          onFinish={isCategory ? handleSaveCategory : handleSaveTag}
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: `请输入${isCategory ? '分类' : '标签'}名称` }]}
          >
            <Input placeholder={`输入${isCategory ? '分类' : '标签'}名称`} />
          </Form.Item>
          
          {isCategory && (
            <Form.Item
              name="icon"
              label="图标"
              rules={[{ required: true, message: '请选择图标' }]}
            >
              <Select placeholder="选择图标">
                {ICON_OPTIONS.map(option => (
                  <Select.Option key={option.value} value={option.value}>
                    <Space>
                      {option.icon}
                      {option.label}
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          
          <Form.Item
            name="color"
            label="颜色"
            rules={[{ required: true, message: '请选择颜色' }]}
          >
            <div className="color-picker-container">
              <ColorPicker
                presets={[
                  {
                    label: '推荐颜色',
                    colors: PRESET_COLORS
                  }
                ]}
                showText
              />
            </div>
          </Form.Item>
          
          <Form.Item className="form-actions">
            <Space>
              <Button onClick={handleCancelEdit}>
                <CloseOutlined /> 取消
              </Button>
              <Button type="primary" htmlType="submit">
                <SaveOutlined /> 保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    );
  };

  return (
    <Modal
      title="分类和标签管理"
      open={visible}
      onCancel={onCancel}
      width={800}
      className="category-tag-manager-modal"
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={handleSaveAll}>
          保存更改
        </Button>
      ]}
    >
      <div className="manager-content">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          className="manager-tabs"
        >
          <TabPane 
            tab={
              <span>
                <FolderOutlined />
                分类管理
              </span>
            } 
            key="categories"
          >
            <Row gutter={16}>
              <Col span={isEditing ? 12 : 24}>
                {renderCategoryList()}
              </Col>
              {isEditing && (
                <Col span={12}>
                  {renderEditForm()}
                </Col>
              )}
            </Row>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <TagOutlined />
                标签管理
              </span>
            } 
            key="tags"
          >
            <Row gutter={16}>
              <Col span={isEditing ? 12 : 24}>
                {renderTagList()}
              </Col>
              {isEditing && (
                <Col span={12}>
                  {renderEditForm()}
                </Col>
              )}
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default CategoryTagManager;