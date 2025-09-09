import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  Space,
  Tag,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
  Divider,
  Upload,
  Typography
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ImportOutlined,
  ExportOutlined,
  SearchOutlined,
  BookOutlined,
  QuestionCircleOutlined,
  UploadOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const QuestionBankManager = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  // 题目类型配置
  const questionTypes = {
    single: '单选题',
    multiple: '多选题',
    judge: '判断题',
    fill: '填空题',
    essay: '问答题'
  };

  // 难度等级配置
  const difficultyLevels = {
    easy: { label: '简单', color: 'green' },
    medium: { label: '中等', color: 'orange' },
    hard: { label: '困难', color: 'red' }
  };

  // 能力维度配置
  const categories = {
    digital_literacy: '数字素养',
    information_processing: '信息处理',
    digital_creation: '数字创作',
    digital_communication: '数字沟通',
    digital_security: '数字安全',
    digital_ethics: '数字伦理'
  };

  // 初始化示例数据
  useEffect(() => {
    const sampleQuestions = [
      {
        id: 1,
        title: '以下哪个是常见的数字化办公软件？',
        type: 'single',
        category: 'digital_literacy',
        difficulty: 'easy',
        options: ['Microsoft Office', '记事本', '计算器', '画图'],
        correctAnswer: ['Microsoft Office'],
        explanation: 'Microsoft Office是最常用的数字化办公软件套件',
        tags: ['办公软件', '基础知识'],
        createTime: '2024-01-15',
        updateTime: '2024-01-15'
      },
      {
        id: 2,
        title: '在网络安全中，以下哪些是强密码的特征？',
        type: 'multiple',
        category: 'digital_security',
        difficulty: 'medium',
        options: ['包含大小写字母', '包含数字', '包含特殊字符', '长度至少8位'],
        correctAnswer: ['包含大小写字母', '包含数字', '包含特殊字符', '长度至少8位'],
        explanation: '强密码应该包含多种字符类型且有足够的长度',
        tags: ['网络安全', '密码管理'],
        createTime: '2024-01-16',
        updateTime: '2024-01-16'
      },
      {
        id: 3,
        title: '云计算是一种通过网络提供计算资源的服务模式。',
        type: 'judge',
        category: 'digital_literacy',
        difficulty: 'easy',
        correctAnswer: [true],
        explanation: '云计算确实是通过网络提供各种计算资源和服务的模式',
        tags: ['云计算', '基础概念'],
        createTime: '2024-01-17',
        updateTime: '2024-01-17'
      }
    ];
    setQuestions(sampleQuestions);
  }, []);

  // 统计数据
  const getStatistics = () => {
    const total = questions.length;
    const byType = {};
    const byDifficulty = {};
    const byCategory = {};

    questions.forEach(q => {
      byType[q.type] = (byType[q.type] || 0) + 1;
      byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1;
      byCategory[q.category] = (byCategory[q.category] || 0) + 1;
    });

    return { total, byType, byDifficulty, byCategory };
  };

  const stats = getStatistics();

  // 过滤题目
  const getFilteredQuestions = () => {
    return questions.filter(question => {
      const matchSearch = !searchText || 
        question.title.toLowerCase().includes(searchText.toLowerCase()) ||
        question.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
      
      const matchCategory = filterCategory === 'all' || question.category === filterCategory;
      const matchDifficulty = filterDifficulty === 'all' || question.difficulty === filterDifficulty;
      
      return matchSearch && matchCategory && matchDifficulty;
    });
  };

  // 添加/编辑题目
  const handleSaveQuestion = async (values) => {
    try {
      setLoading(true);
      
      const questionData = {
        ...values,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
        updateTime: new Date().toISOString().split('T')[0]
      };

      if (editingQuestion) {
        // 编辑
        setQuestions(prev => prev.map(q => 
          q.id === editingQuestion.id 
            ? { ...q, ...questionData }
            : q
        ));
        message.success('题目更新成功');
      } else {
        // 新增
        const newQuestion = {
          id: Date.now(),
          ...questionData,
          createTime: new Date().toISOString().split('T')[0]
        };
        setQuestions(prev => [...prev, newQuestion]);
        message.success('题目添加成功');
      }
      
      setModalVisible(false);
      setEditingQuestion(null);
      form.resetFields();
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除题目
  const handleDeleteQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    message.success('题目删除成功');
  };

  // 编辑题目
  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    form.setFieldsValue({
      ...question,
      tags: question.tags.join(', ')
    });
    setModalVisible(true);
  };

  // 表格列配置
  const columns = [
    {
      title: '题目',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: '30%'
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: '10%',
      render: (type) => (
        <Tag color="blue">{questionTypes[type]}</Tag>
      )
    },
    {
      title: '能力维度',
      dataIndex: 'category',
      key: 'category',
      width: '15%',
      render: (category) => (
        <Tag color="purple">{categories[category]}</Tag>
      )
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: '10%',
      render: (difficulty) => (
        <Tag color={difficultyLevels[difficulty].color}>
          {difficultyLevels[difficulty].label}
        </Tag>
      )
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: '15%',
      render: (tags) => (
        <>
          {tags.map(tag => (
            <Tag key={tag} size="small">{tag}</Tag>
          ))}
        </>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: '10%'
    },
    {
      title: '操作',
      key: 'action',
      width: '10%',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditQuestion(record)}
          />
          <Popconfirm
            title="确定删除这道题目吗？"
            onConfirm={() => handleDeleteQuestion(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="question-bank-manager">
      {/* 统计概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="题目总数"
              value={stats.total}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="单选题"
              value={stats.byType.single || 0}
              prefix={<QuestionCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="多选题"
              value={stats.byType.multiple || 0}
              prefix={<QuestionCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="判断题"
              value={stats.byType.judge || 0}
              prefix={<QuestionCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 操作栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Input
              placeholder="搜索题目或标签"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="能力维度"
              value={filterCategory}
              onChange={setFilterCategory}
              style={{ width: '100%' }}
            >
              <Option value="all">全部维度</Option>
              {Object.entries(categories).map(([key, label]) => (
                <Option key={key} value={key}>{label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="难度等级"
              value={filterDifficulty}
              onChange={setFilterDifficulty}
              style={{ width: '100%' }}
            >
              <Option value="all">全部难度</Option>
              {Object.entries(difficultyLevels).map(([key, config]) => (
                <Option key={key} value={key}>{config.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingQuestion(null);
                  form.resetFields();
                  setModalVisible(true);
                }}
              >
                添加题目
              </Button>
              <Button icon={<ImportOutlined />}>
                批量导入
              </Button>
              <Button icon={<ExportOutlined />}>
                导出题库
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 题目列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={getFilteredQuestions()}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 道题目`
          }}
        />
      </Card>

      {/* 添加/编辑题目模态框 */}
      <Modal
        title={editingQuestion ? '编辑题目' : '添加题目'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingQuestion(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveQuestion}
          initialValues={{
            options: []
          }}
        >
          <Form.Item
            name="title"
            label="题目内容"
            rules={[{ required: true, message: '请输入题目内容' }]}
          >
            <TextArea rows={3} placeholder="请输入题目内容" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="type"
                label="题目类型"
                rules={[{ required: true, message: '请选择题目类型' }]}
              >
                <Select placeholder="选择题目类型">
                  {Object.entries(questionTypes).map(([key, label]) => (
                    <Option key={key} value={key}>{label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="category"
                label="能力维度"
                rules={[{ required: true, message: '请选择能力维度' }]}
              >
                <Select placeholder="选择能力维度">
                  {Object.entries(categories).map(([key, label]) => (
                    <Option key={key} value={key}>{label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="difficulty"
                label="难度等级"
                rules={[{ required: true, message: '请选择难度等级' }]}
              >
                <Select placeholder="选择难度等级">
                  {Object.entries(difficultyLevels).map(([key, config]) => (
                    <Option key={key} value={key}>{config.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.type !== currentValues.type
            }
          >
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              
              if (type === 'single' || type === 'multiple') {
                return (
                  <>
                    <Form.Item
                      name="options"
                      label="选项"
                      rules={[{ required: true, message: '请输入选项' }]}
                    >
                      <Select
                        mode="tags"
                        placeholder="输入选项内容，按回车添加"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="correctAnswer"
                      label="正确答案"
                      rules={[{ required: true, message: '请选择正确答案' }]}
                    >
                      {type === 'single' ? (
                        <Radio.Group>
                          {(getFieldValue('options') || []).map((option, index) => (
                            <Radio key={index} value={option}>{option}</Radio>
                          ))}
                        </Radio.Group>
                      ) : (
                        <Checkbox.Group>
                          {(getFieldValue('options') || []).map((option, index) => (
                            <Checkbox key={index} value={option}>{option}</Checkbox>
                          ))}
                        </Checkbox.Group>
                      )}
                    </Form.Item>
                  </>
                );
              }
              
              if (type === 'judge') {
                return (
                  <Form.Item
                    name="correctAnswer"
                    label="正确答案"
                    rules={[{ required: true, message: '请选择正确答案' }]}
                  >
                    <Radio.Group>
                      <Radio value={true}>正确</Radio>
                      <Radio value={false}>错误</Radio>
                    </Radio.Group>
                  </Form.Item>
                );
              }
              
              if (type === 'fill' || type === 'essay') {
                return (
                  <Form.Item
                    name="correctAnswer"
                    label="参考答案"
                    rules={[{ required: true, message: '请输入参考答案' }]}
                  >
                    <TextArea rows={3} placeholder="请输入参考答案" />
                  </Form.Item>
                );
              }
              
              return null;
            }}
          </Form.Item>

          <Form.Item
            name="explanation"
            label="答案解析"
          >
            <TextArea rows={2} placeholder="请输入答案解析（可选）" />
          </Form.Item>

          <Form.Item
            name="tags"
            label="标签"
          >
            <Input placeholder="请输入标签，多个标签用逗号分隔" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingQuestion ? '更新' : '添加'}
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingQuestion(null);
                form.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuestionBankManager;