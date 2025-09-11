import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  List,
  Space,
  Popconfirm,
  message,
  Tag,
  Typography,
  Divider,
  Card
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  TagOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const CategoryManagement = ({ visible, onClose, categories, onCategoriesChange }) => {
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);
  const [localCategories, setLocalCategories] = useState(categories || []);

  useEffect(() => {
    setLocalCategories(categories || []);
  }, [categories]);

  const handleAddCategory = async (values) => {
    try {
      const newCategory = {
        id: Date.now().toString(),
        name: values.name,
        description: values.description || '',
        color: getRandomColor(),
        scenarioCount: 0,
        createdAt: new Date().toISOString()
      };
      
      const updatedCategories = [...localCategories, newCategory];
      setLocalCategories(updatedCategories);
      onCategoriesChange(updatedCategories);
      
      form.resetFields();
      message.success('分类添加成功');
    } catch (error) {
      message.error('添加分类失败');
    }
  };

  const handleEditCategory = async (values) => {
    try {
      const updatedCategories = localCategories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: values.name, description: values.description || '' }
          : cat
      );
      
      setLocalCategories(updatedCategories);
      onCategoriesChange(updatedCategories);
      
      setEditingCategory(null);
      form.resetFields();
      message.success('分类更新成功');
    } catch (error) {
      message.error('更新分类失败');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const updatedCategories = localCategories.filter(cat => cat.id !== categoryId);
      setLocalCategories(updatedCategories);
      onCategoriesChange(updatedCategories);
      message.success('分类删除成功');
    } catch (error) {
      message.error('删除分类失败');
    }
  };

  const startEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description
    });
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    form.resetFields();
  };

  const getRandomColor = () => {
    const colors = [
      '#f50', '#2db7f5', '#87d068', '#108ee9',
      '#f56a00', '#722ed1', '#eb2f96', '#52c41a',
      '#13c2c2', '#1890ff', '#fa541c', '#faad14'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const onFinish = (values) => {
    if (editingCategory) {
      handleEditCategory(values);
    } else {
      handleAddCategory(values);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <FolderOutlined />
          <span>场景分类管理</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
      destroyOnClose
    >
      <div style={{ marginBottom: 24 }}>
        <Card size="small">
          <Title level={5} style={{ margin: 0, marginBottom: 16 }}>
            {editingCategory ? '编辑分类' : '添加新分类'}
          </Title>
          
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="name"
              label="分类名称"
              rules={[
                { required: true, message: '请输入分类名称' },
                { max: 20, message: '分类名称不能超过20个字符' }
              ]}
            >
              <Input 
                placeholder="请输入分类名称"
                prefix={<TagOutlined />}
              />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="分类描述"
              rules={[
                { max: 100, message: '描述不能超过100个字符' }
              ]}
            >
              <Input.TextArea 
                placeholder="请输入分类描述（可选）"
                rows={3}
                showCount
                maxLength={100}
              />
            </Form.Item>
            
            <Form.Item style={{ marginBottom: 0 }}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                  {editingCategory ? '更新分类' : '添加分类'}
                </Button>
                {editingCategory && (
                  <Button onClick={cancelEdit}>
                    取消编辑
                  </Button>
                )}
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <Divider orientation="left">现有分类</Divider>
      
      {localCategories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          <FolderOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <div>暂无分类，请添加第一个分类</div>
        </div>
      ) : (
        <List
          dataSource={localCategories}
          renderItem={(category) => (
            <List.Item
              actions={[
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => startEdit(category)}
                  size="small"
                >
                  编辑
                </Button>,
                <Popconfirm
                  title="确认删除"
                  description={`确定要删除分类"${category.name}"吗？`}
                  onConfirm={() => handleDeleteCategory(category.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                  >
                    删除
                  </Button>
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Tag color={category.color} style={{ margin: 0 }}>
                    <FolderOutlined />
                  </Tag>
                }
                title={
                  <Space>
                    <span>{category.name}</span>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      ({category.scenarioCount || 0} 个场景)
                    </Text>
                  </Space>
                }
                description={
                  <div>
                    {category.description && (
                      <div style={{ marginBottom: 4 }}>
                        {category.description}
                      </div>
                    )}
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      创建时间: {new Date(category.createdAt).toLocaleString()}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};

export default CategoryManagement;