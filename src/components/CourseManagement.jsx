import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  message,
  Tag,
  Row,
  Col,
  Statistic,
  DatePicker
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  UserOutlined,
  CalendarOutlined,
  SearchOutlined
} from '@ant-design/icons';
import './CourseManagement.css';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const CourseManagement = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: '数学五年级上册',
      subject: '数学',
      grade: '五年级',
      version: '人教版',
      volume: '上册',
      teacher: '张老师',
      studentCount: 45,
      status: 'active',
      createTime: '2024-01-15',
      description: '五年级数学上册课程，包含小数、分数、几何等内容'
    },
    {
      id: 2,
      name: '英语口语练习班',
      subject: '英语',
      grade: '六年级',
      version: '外研版',
      volume: '下册',
      teacher: '李老师',
      studentCount: 38,
      status: 'active',
      createTime: '2024-01-20',
      description: '专注于提高学生英语口语表达能力'
    },
    {
      id: 3,
      name: '语文阅读理解',
      subject: '语文',
      grade: '四年级',
      version: '部编版',
      volume: '上册',
      teacher: '王老师',
      studentCount: 42,
      status: 'inactive',
      createTime: '2024-01-10',
      description: '提高学生阅读理解能力和文学素养'
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // 学科选项
  const subjects = ['数学', '语文', '英语', '物理', '化学', '生物', '历史', '地理', '政治'];
  
  // 年级选项
  const grades = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级'];
  
  // 版本选项
  const versions = ['人教版', '部编版', '外研版', '北师大版', '苏教版', '沪教版'];
  
  // 册次选项
  const volumes = ['上册', '下册', '全册'];

  // 统计数据
  const statistics = {
    total: courses.length,
    active: courses.filter(course => course.status === 'active').length,
    inactive: courses.filter(course => course.status === 'inactive').length,
    totalStudents: courses.reduce((sum, course) => sum + course.studentCount, 0)
  };

  // 过滤课程
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         course.teacher.toLowerCase().includes(searchText.toLowerCase());
    const matchesSubject = !filterSubject || course.subject === filterSubject;
    const matchesGrade = !filterGrade || course.grade === filterGrade;
    const matchesStatus = !filterStatus || course.status === filterStatus;
    
    return matchesSearch && matchesSubject && matchesGrade && matchesStatus;
  });

  // 显示创建/编辑模态框
  const showModal = (course = null) => {
    setEditingCourse(course);
    setIsModalVisible(true);
    if (course) {
      form.setFieldsValue(course);
    } else {
      form.resetFields();
    }
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCourse(null);
    form.resetFields();
  };

  // 保存课程
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingCourse) {
        // 编辑课程
        setCourses(courses.map(course => 
          course.id === editingCourse.id 
            ? { ...course, ...values }
            : course
        ));
        message.success('课程更新成功！');
      } else {
        // 创建新课程
        const newCourse = {
          id: Date.now(),
          ...values,
          studentCount: 0,
          status: 'active',
          createTime: new Date().toISOString().split('T')[0]
        };
        setCourses([...courses, newCourse]);
        message.success('课程创建成功！');
      }
      
      handleCancel();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 删除课程
  const handleDelete = (courseId) => {
    setCourses(courses.filter(course => course.id !== courseId));
    message.success('课程删除成功！');
  };

  // 切换课程状态
  const toggleStatus = (courseId) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, status: course.status === 'active' ? 'inactive' : 'active' }
        : course
    ));
    message.success('课程状态更新成功！');
  };

  // 表格列定义
  const columns = [
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
            <BookOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            {text}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.description}
          </div>
        </div>
      )
    },
    {
      title: '学科信息',
      key: 'subject_info',
      render: (_, record) => (
        <div>
          <Tag color="blue">{record.subject}</Tag>
          <Tag color="green">{record.grade}</Tag>
          <div style={{ marginTop: 4, fontSize: '12px', color: '#666' }}>
            {record.version} · {record.volume}
          </div>
        </div>
      )
    },
    {
      title: '授课教师',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (text) => (
        <span>
          <UserOutlined style={{ marginRight: 4 }} />
          {text}
        </span>
      )
    },
    {
      title: '学生人数',
      dataIndex: 'studentCount',
      key: 'studentCount',
      render: (count) => (
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
          {count} 人
        </span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '进行中' : '已结束'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time) => (
        <span>
          <CalendarOutlined style={{ marginRight: 4 }} />
          {time}
        </span>
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            onClick={() => toggleStatus(record.id)}
          >
            {record.status === 'active' ? '结束' : '激活'}
          </Button>
          <Popconfirm
            title="确定要删除这个课程吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="course-management">
      {/* 页面头部 */}
      <div className="course-header">
        <div className="header-title">
          <BookOutlined className="title-icon" />
          <span>课程管理</span>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          className="create-btn"
        >
          创建课程
        </Button>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} className="statistics-row">
        <Col span={6}>
          <Card>
            <Statistic
              title="总课程数"
              value={statistics.total}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="进行中"
              value={statistics.active}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已结束"
              value={statistics.inactive}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总学生数"
              value={statistics.totalStudents}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索和筛选 */}
      <Card className="filter-card">
        <Row gutter={16}>
          <Col span={8}>
            <Input
              placeholder="搜索课程名称或教师"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="选择学科"
              value={filterSubject}
              onChange={setFilterSubject}
              allowClear
              style={{ width: '100%' }}
            >
              {subjects.map(subject => (
                <Option key={subject} value={subject}>{subject}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="选择年级"
              value={filterGrade}
              onChange={setFilterGrade}
              allowClear
              style={{ width: '100%' }}
            >
              {grades.map(grade => (
                <Option key={grade} value={grade}>{grade}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="选择状态"
              value={filterStatus}
              onChange={setFilterStatus}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="active">进行中</Option>
              <Option value="inactive">已结束</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* 课程表格 */}
      <Card className="table-card">
        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 创建/编辑课程模态框 */}
      <Modal
        title={editingCourse ? '编辑课程' : '创建课程'}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'active'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="课程名称"
                rules={[{ required: true, message: '请输入课程名称' }]}
              >
                <Input placeholder="请输入课程名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="teacher"
                label="授课教师"
                rules={[{ required: true, message: '请输入授课教师' }]}
              >
                <Input placeholder="请输入授课教师" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="subject"
                label="学科"
                rules={[{ required: true, message: '请选择学科' }]}
              >
                <Select placeholder="请选择学科">
                  {subjects.map(subject => (
                    <Option key={subject} value={subject}>{subject}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="grade"
                label="年级"
                rules={[{ required: true, message: '请选择年级' }]}
              >
                <Select placeholder="请选择年级">
                  {grades.map(grade => (
                    <Option key={grade} value={grade}>{grade}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="version"
                label="版本"
                rules={[{ required: true, message: '请选择版本' }]}
              >
                <Select placeholder="请选择版本">
                  {versions.map(version => (
                    <Option key={version} value={version}>{version}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="volume"
                label="册次"
                rules={[{ required: true, message: '请选择册次' }]}
              >
                <Select placeholder="请选择册次">
                  {volumes.map(volume => (
                    <Option key={volume} value={volume}>{volume}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="课程描述"
          >
            <TextArea
              rows={3}
              placeholder="请输入课程描述"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseManagement;