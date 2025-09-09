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
  Avatar,
  List,
  Transfer,
  Tabs,
  Progress,
  Tooltip,
  Badge
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  SearchOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  EyeOutlined,
  TrophyOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import './ClassManagement.css';

const { Option } = Select;
const { TabPane } = Tabs;

const ClassManagement = () => {
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: '五年级1班',
      course: '数学五年级上册',
      teacher: '张老师',
      studentCount: 45,
      maxStudents: 50,
      status: 'active',
      createTime: '2024-01-15',
      description: '五年级数学重点班，注重基础知识和思维训练',
      students: [
        { id: 1, name: '张小明', studentId: '2024001', score: 95, attendance: 98, status: 'active' },
        { id: 2, name: '李小红', studentId: '2024002', score: 88, attendance: 95, status: 'active' },
        { id: 3, name: '王小强', studentId: '2024003', score: 92, attendance: 90, status: 'active' }
      ]
    },
    {
      id: 2,
      name: '六年级英语A班',
      course: '英语口语练习班',
      teacher: '李老师',
      studentCount: 38,
      maxStudents: 40,
      status: 'active',
      createTime: '2024-01-20',
      description: '专注英语口语和听力训练的精品小班',
      students: [
        { id: 4, name: '陈小华', studentId: '2024004', score: 90, attendance: 92, status: 'active' },
        { id: 5, name: '刘小芳', studentId: '2024005', score: 85, attendance: 88, status: 'active' }
      ]
    },
    {
      id: 3,
      name: '四年级语文班',
      course: '语文阅读理解',
      teacher: '王老师',
      studentCount: 42,
      maxStudents: 45,
      status: 'inactive',
      createTime: '2024-01-10',
      description: '提升阅读理解能力和写作水平',
      students: [
        { id: 6, name: '赵小军', studentId: '2024006', score: 87, attendance: 85, status: 'active' }
      ]
    }
  ]);

  // 可选学生池（用于添加学生）
  const [availableStudents] = useState([
    { id: 7, name: '孙小丽', studentId: '2024007', grade: '五年级', class: '未分班' },
    { id: 8, name: '周小伟', studentId: '2024008', grade: '五年级', class: '未分班' },
    { id: 9, name: '吴小燕', studentId: '2024009', grade: '六年级', class: '未分班' },
    { id: 10, name: '郑小龙', studentId: '2024010', grade: '四年级', class: '未分班' }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [transferTargetKeys, setTransferTargetKeys] = useState([]);

  // 统计数据
  const statistics = {
    total: classes.length,
    active: classes.filter(cls => cls.status === 'active').length,
    inactive: classes.filter(cls => cls.status === 'inactive').length,
    totalStudents: classes.reduce((sum, cls) => sum + cls.studentCount, 0),
    avgStudents: Math.round(classes.reduce((sum, cls) => sum + cls.studentCount, 0) / classes.length) || 0
  };

  // 过滤班级
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         cls.teacher.toLowerCase().includes(searchText.toLowerCase()) ||
                         cls.course.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || cls.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // 显示创建/编辑班级模态框
  const showModal = (classItem = null) => {
    setEditingClass(classItem);
    setIsModalVisible(true);
    if (classItem) {
      form.setFieldsValue(classItem);
    } else {
      form.resetFields();
    }
  };

  // 显示学生管理模态框
  const showStudentModal = (classItem) => {
    setSelectedClass(classItem);
    setIsStudentModalVisible(true);
    // 设置已选中的学生
    setTransferTargetKeys(classItem.students.map(student => student.id.toString()));
  };

  // 显示班级详情模态框
  const showDetailModal = (classItem) => {
    setSelectedClass(classItem);
    setIsDetailModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsStudentModalVisible(false);
    setIsDetailModalVisible(false);
    setEditingClass(null);
    setSelectedClass(null);
    form.resetFields();
    setTransferTargetKeys([]);
  };

  // 保存班级
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingClass) {
        // 编辑班级
        setClasses(classes.map(cls => 
          cls.id === editingClass.id 
            ? { ...cls, ...values }
            : cls
        ));
        message.success('班级更新成功！');
      } else {
        // 创建新班级
        const newClass = {
          id: Date.now(),
          ...values,
          studentCount: 0,
          status: 'active',
          createTime: new Date().toISOString().split('T')[0],
          students: []
        };
        setClasses([...classes, newClass]);
        message.success('班级创建成功！');
      }
      
      handleCancel();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 保存学生分配
  const handleStudentSave = () => {
    if (!selectedClass) return;
    
    // 获取选中的学生
    const selectedStudentIds = transferTargetKeys.map(key => parseInt(key));
    const selectedStudents = [...selectedClass.students, ...availableStudents]
      .filter(student => selectedStudentIds.includes(student.id))
      .map(student => ({
        ...student,
        score: student.score || 0,
        attendance: student.attendance || 100,
        status: 'active'
      }));
    
    // 更新班级学生信息
    setClasses(classes.map(cls => 
      cls.id === selectedClass.id 
        ? { 
            ...cls, 
            students: selectedStudents,
            studentCount: selectedStudents.length
          }
        : cls
    ));
    
    message.success('学生分配更新成功！');
    handleCancel();
  };

  // 删除班级
  const handleDelete = (classId) => {
    setClasses(classes.filter(cls => cls.id !== classId));
    message.success('班级删除成功！');
  };

  // 切换班级状态
  const toggleStatus = (classId) => {
    setClasses(classes.map(cls => 
      cls.id === classId 
        ? { ...cls, status: cls.status === 'active' ? 'inactive' : 'active' }
        : cls
    ));
    message.success('班级状态更新成功！');
  };

  // 移除学生
  const removeStudent = (classId, studentId) => {
    setClasses(classes.map(cls => 
      cls.id === classId 
        ? { 
            ...cls, 
            students: cls.students.filter(student => student.id !== studentId),
            studentCount: cls.students.filter(student => student.id !== studentId).length
          }
        : cls
    ));
    message.success('学生移除成功！');
  };

  // 班级表格列定义
  const columns = [
    {
      title: '班级信息',
      key: 'class_info',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: '16px' }}>
            <TeamOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            {record.name}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: 4 }}>
            <BookOutlined style={{ marginRight: 4 }} />
            {record.course}
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            {record.description}
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
      key: 'student_count',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Badge count={record.studentCount} showZero color="#1890ff" />
            <span style={{ marginLeft: 8 }}>/ {record.maxStudents}</span>
          </div>
          <Progress 
            percent={Math.round((record.studentCount / record.maxStudents) * 100)} 
            size="small"
            status={record.studentCount >= record.maxStudents ? 'exception' : 'active'}
          />
        </div>
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
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {time}
        </span>
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => showDetailModal(record)}
            >
              详情
            </Button>
          </Tooltip>
          <Tooltip title="管理学生">
            <Button
              type="link"
              icon={<UserAddOutlined />}
              onClick={() => showStudentModal(record)}
            >
              学生
            </Button>
          </Tooltip>
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
            title="确定要删除这个班级吗？"
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

  // 学生表格列定义
  const studentColumns = [
    {
      title: '学生信息',
      key: 'student_info',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size={40} style={{ backgroundColor: '#1890ff', marginRight: 12 }}>
            {record.name.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>学号: {record.studentId}</div>
          </div>
        </div>
      )
    },
    {
      title: '平均成绩',
      dataIndex: 'score',
      key: 'score',
      render: (score) => (
        <div>
          <div style={{ fontWeight: 'bold', color: score >= 90 ? '#52c41a' : score >= 80 ? '#faad14' : '#ff4d4f' }}>
            {score}分
          </div>
          <Progress 
            percent={score} 
            size="small" 
            status={score >= 90 ? 'success' : score >= 80 ? 'active' : 'exception'}
            showInfo={false}
          />
        </div>
      )
    },
    {
      title: '出勤率',
      dataIndex: 'attendance',
      key: 'attendance',
      render: (attendance) => (
        <div>
          <div style={{ fontWeight: 'bold', color: attendance >= 95 ? '#52c41a' : attendance >= 85 ? '#faad14' : '#ff4d4f' }}>
            {attendance}%
          </div>
          <Progress 
            percent={attendance} 
            size="small" 
            status={attendance >= 95 ? 'success' : attendance >= 85 ? 'active' : 'exception'}
            showInfo={false}
          />
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '在读' : '休学'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="确定要移除这个学生吗？"
          onConfirm={() => removeStudent(selectedClass?.id, record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type="link"
            danger
            icon={<UserDeleteOutlined />}
            size="small"
          >
            移除
          </Button>
        </Popconfirm>
      )
    }
  ];

  return (
    <div className="class-management">
      {/* 页面头部 */}
      <div className="class-header">
        <div className="header-title">
          <TeamOutlined className="title-icon" />
          <span>班级管理</span>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          className="create-btn"
        >
          创建班级
        </Button>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} className="statistics-row">
        <Col span={5}>
          <Card>
            <Statistic
              title="总班级数"
              value={statistics.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="进行中"
              value={statistics.active}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="已结束"
              value={statistics.inactive}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="总学生数"
              value={statistics.totalStudents}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="平均班级人数"
              value={statistics.avgStudents}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索和筛选 */}
      <Card className="filter-card">
        <Row gutter={16}>
          <Col span={12}>
            <Input
              placeholder="搜索班级名称、教师或课程"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={6}>
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

      {/* 班级表格 */}
      <Card className="table-card">
        <Table
          columns={columns}
          dataSource={filteredClasses}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 创建/编辑班级模态框 */}
      <Modal
        title={editingClass ? '编辑班级' : '创建班级'}
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
            status: 'active',
            maxStudents: 50
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="班级名称"
                rules={[{ required: true, message: '请输入班级名称' }]}
              >
                <Input placeholder="请输入班级名称" />
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
                name="course"
                label="关联课程"
                rules={[{ required: true, message: '请输入关联课程' }]}
              >
                <Input placeholder="请输入关联课程" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxStudents"
                label="最大学生数"
                rules={[{ required: true, message: '请输入最大学生数' }]}
              >
                <Input type="number" placeholder="请输入最大学生数" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="班级描述"
          >
            <Input.TextArea
              rows={3}
              placeholder="请输入班级描述"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 学生管理模态框 */}
      <Modal
        title={`管理学生 - ${selectedClass?.name}`}
        open={isStudentModalVisible}
        onOk={handleStudentSave}
        onCancel={handleCancel}
        width={800}
        okText="保存"
        cancelText="取消"
      >
        <Transfer
          dataSource={[...availableStudents, ...(selectedClass?.students || [])]
            .filter((student, index, self) => 
              index === self.findIndex(s => s.id === student.id)
            )
            .map(student => ({
              key: student.id.toString(),
              title: `${student.name} (${student.studentId})`,
              description: student.grade || '已在班级中'
            }))}
          targetKeys={transferTargetKeys}
          onChange={setTransferTargetKeys}
          render={item => item.title}
          titles={['可选学生', '班级学生']}
          showSearch
          searchPlaceholder="搜索学生"
          style={{ marginBottom: 16 }}
        />
      </Modal>

      {/* 班级详情模态框 */}
      <Modal
        title={`班级详情 - ${selectedClass?.name}`}
        open={isDetailModalVisible}
        onCancel={handleCancel}
        width={1000}
        footer={[
          <Button key="close" onClick={handleCancel}>
            关闭
          </Button>
        ]}
      >
        {selectedClass && (
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
              <Row gutter={16}>
                <Col span={12}>
                  <Card title="班级信息" size="small">
                    <p><strong>班级名称：</strong>{selectedClass.name}</p>
                    <p><strong>关联课程：</strong>{selectedClass.course}</p>
                    <p><strong>授课教师：</strong>{selectedClass.teacher}</p>
                    <p><strong>学生人数：</strong>{selectedClass.studentCount} / {selectedClass.maxStudents}</p>
                    <p><strong>创建时间：</strong>{selectedClass.createTime}</p>
                    <p><strong>状态：</strong>
                      <Tag color={selectedClass.status === 'active' ? 'success' : 'default'}>
                        {selectedClass.status === 'active' ? '进行中' : '已结束'}
                      </Tag>
                    </p>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="班级描述" size="small">
                    <p>{selectedClass.description || '暂无描述'}</p>
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="学生列表" key="2">
              <Table
                columns={studentColumns}
                dataSource={selectedClass.students}
                rowKey="id"
                size="small"
                pagination={false}
              />
            </TabPane>
          </Tabs>
        )}
      </Modal>
    </div>
  );
};

export default ClassManagement;