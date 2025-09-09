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
  Progress,
  Tabs,
  List,
  Timeline,
  Rate,
  DatePicker,
  Upload,
  Image,
  Descriptions,
  Badge
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  BookOutlined,
  SearchOutlined,
  EyeOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  DownloadOutlined,
  StarOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import './StudentManagement.css';

const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const StudentManagement = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: '张小明',
      studentId: '2024001',
      grade: '五年级',
      class: '五年级1班',
      gender: '男',
      age: 11,
      phone: '13800138001',
      email: 'zhangxiaoming@example.com',
      address: '北京市朝阳区xxx街道',
      avatar: null,
      status: 'active',
      enrollDate: '2024-01-15',
      totalScore: 95,
      attendance: 98,
      homeworkCompletion: 96,
      subjects: [
        { name: '数学', score: 95, rank: 2, progress: 85 },
        { name: '语文', score: 88, rank: 5, progress: 78 },
        { name: '英语', score: 92, rank: 3, progress: 82 }
      ],
      homeworks: [
        { id: 1, title: '数学练习册第一章', subject: '数学', status: 'completed', score: 95, submitTime: '2024-01-20', deadline: '2024-01-21' },
        { id: 2, title: '语文阅读理解', subject: '语文', status: 'completed', score: 88, submitTime: '2024-01-19', deadline: '2024-01-20' },
        { id: 3, title: '英语口语练习', subject: '英语', status: 'pending', score: null, submitTime: null, deadline: '2024-01-25' }
      ],
      learningProgress: [
        { date: '2024-01-15', activity: '加入五年级1班', type: 'info' },
        { date: '2024-01-18', activity: '完成数学第一单元测试，得分95分', type: 'success' },
        { date: '2024-01-20', activity: '提交语文作业', type: 'success' },
        { date: '2024-01-22', activity: '英语口语练习待完成', type: 'warning' }
      ]
    },
    {
      id: 2,
      name: '李小红',
      studentId: '2024002',
      grade: '五年级',
      class: '五年级1班',
      gender: '女',
      age: 10,
      phone: '13800138002',
      email: 'lixiaohong@example.com',
      address: '北京市海淀区xxx街道',
      avatar: null,
      status: 'active',
      enrollDate: '2024-01-15',
      totalScore: 88,
      attendance: 95,
      homeworkCompletion: 92,
      subjects: [
        { name: '数学', score: 88, rank: 8, progress: 75 },
        { name: '语文', score: 92, rank: 3, progress: 88 },
        { name: '英语', score: 85, rank: 12, progress: 70 }
      ],
      homeworks: [
        { id: 4, title: '数学练习册第一章', subject: '数学', status: 'completed', score: 88, submitTime: '2024-01-20', deadline: '2024-01-21' },
        { id: 5, title: '语文阅读理解', subject: '语文', status: 'completed', score: 92, submitTime: '2024-01-19', deadline: '2024-01-20' }
      ],
      learningProgress: [
        { date: '2024-01-15', activity: '加入五年级1班', type: 'info' },
        { date: '2024-01-19', activity: '完成语文阅读理解，得分92分', type: 'success' },
        { date: '2024-01-20', activity: '提交数学作业', type: 'success' }
      ]
    },
    {
      id: 3,
      name: '王小强',
      studentId: '2024003',
      grade: '五年级',
      class: '五年级1班',
      gender: '男',
      age: 11,
      phone: '13800138003',
      email: 'wangxiaoqiang@example.com',
      address: '北京市西城区xxx街道',
      avatar: null,
      status: 'inactive',
      enrollDate: '2024-01-15',
      totalScore: 92,
      attendance: 90,
      homeworkCompletion: 88,
      subjects: [
        { name: '数学', score: 92, rank: 4, progress: 80 },
        { name: '语文', score: 90, rank: 4, progress: 85 },
        { name: '英语', score: 94, rank: 1, progress: 90 }
      ],
      homeworks: [
        { id: 6, title: '数学练习册第一章', subject: '数学', status: 'completed', score: 92, submitTime: '2024-01-20', deadline: '2024-01-21' }
      ],
      learningProgress: [
        { date: '2024-01-15', activity: '加入五年级1班', type: 'info' },
        { date: '2024-01-20', activity: '完成数学练习，得分92分', type: 'success' },
        { date: '2024-01-22', activity: '请假一周', type: 'warning' }
      ]
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // 年级选项
  const grades = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级'];
  
  // 班级选项
  const classes = ['五年级1班', '五年级2班', '六年级A班', '六年级B班', '四年级语文班'];

  // 统计数据
  const statistics = {
    total: students.length,
    active: students.filter(student => student.status === 'active').length,
    inactive: students.filter(student => student.status === 'inactive').length,
    avgScore: Math.round(students.reduce((sum, student) => sum + student.totalScore, 0) / students.length) || 0,
    avgAttendance: Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / students.length) || 0,
    avgHomework: Math.round(students.reduce((sum, student) => sum + student.homeworkCompletion, 0) / students.length) || 0
  };

  // 过滤学生
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchText.toLowerCase()) ||
                         student.class.toLowerCase().includes(searchText.toLowerCase());
    const matchesGrade = !filterGrade || student.grade === filterGrade;
    const matchesClass = !filterClass || student.class === filterClass;
    const matchesStatus = !filterStatus || student.status === filterStatus;
    
    return matchesSearch && matchesGrade && matchesClass && matchesStatus;
  });

  // 显示创建/编辑学生模态框
  const showModal = (student = null) => {
    setEditingStudent(student);
    setIsModalVisible(true);
    if (student) {
      form.setFieldsValue(student);
    } else {
      form.resetFields();
    }
  };

  // 显示学生详情模态框
  const showDetailModal = (student) => {
    setSelectedStudent(student);
    setIsDetailModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsDetailModalVisible(false);
    setEditingStudent(null);
    setSelectedStudent(null);
    form.resetFields();
  };

  // 保存学生
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingStudent) {
        // 编辑学生
        setStudents(students.map(student => 
          student.id === editingStudent.id 
            ? { ...student, ...values }
            : student
        ));
        message.success('学生信息更新成功！');
      } else {
        // 创建新学生
        const newStudent = {
          id: Date.now(),
          ...values,
          status: 'active',
          enrollDate: new Date().toISOString().split('T')[0],
          totalScore: 0,
          attendance: 100,
          homeworkCompletion: 0,
          subjects: [],
          homeworks: [],
          learningProgress: [
            { 
              date: new Date().toISOString().split('T')[0], 
              activity: `加入${values.class}`, 
              type: 'info' 
            }
          ]
        };
        setStudents([...students, newStudent]);
        message.success('学生创建成功！');
      }
      
      handleCancel();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 删除学生
  const handleDelete = (studentId) => {
    setStudents(students.filter(student => student.id !== studentId));
    message.success('学生删除成功！');
  };

  // 切换学生状态
  const toggleStatus = (studentId) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, status: student.status === 'active' ? 'inactive' : 'active' }
        : student
    ));
    message.success('学生状态更新成功！');
  };

  // 获取成绩等级颜色
  const getScoreColor = (score) => {
    if (score >= 90) return '#52c41a';
    if (score >= 80) return '#faad14';
    if (score >= 70) return '#1890ff';
    return '#ff4d4f';
  };

  // 获取作业状态
  const getHomeworkStatus = (status) => {
    const statusMap = {
      completed: { color: 'success', text: '已完成' },
      pending: { color: 'warning', text: '待完成' },
      overdue: { color: 'error', text: '已逾期' }
    };
    return statusMap[status] || { color: 'default', text: '未知' };
  };

  // 学生表格列定义
  const columns = [
    {
      title: '学生信息',
      key: 'student_info',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            size={50} 
            src={record.avatar} 
            style={{ backgroundColor: '#1890ff', marginRight: 12 }}
          >
            {record.name.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: 4 }}>
              {record.name}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: 2 }}>
              学号: {record.studentId}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.grade} · {record.class}
            </div>
          </div>
        </div>
      )
    },
    {
      title: '综合成绩',
      key: 'total_score',
      render: (_, record) => (
        <div>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '18px', 
            color: getScoreColor(record.totalScore),
            marginBottom: 4 
          }}>
            {record.totalScore}分
          </div>
          <Progress 
            percent={record.totalScore} 
            size="small" 
            strokeColor={getScoreColor(record.totalScore)}
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
          <div style={{ 
            fontWeight: 'bold', 
            color: attendance >= 95 ? '#52c41a' : attendance >= 85 ? '#faad14' : '#ff4d4f',
            marginBottom: 4 
          }}>
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
      title: '作业完成率',
      dataIndex: 'homeworkCompletion',
      key: 'homeworkCompletion',
      render: (completion) => (
        <div>
          <div style={{ 
            fontWeight: 'bold', 
            color: completion >= 95 ? '#52c41a' : completion >= 85 ? '#faad14' : '#ff4d4f',
            marginBottom: 4 
          }}>
            {completion}%
          </div>
          <Progress 
            percent={completion} 
            size="small" 
            status={completion >= 95 ? 'success' : completion >= 85 ? 'active' : 'exception'}
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
      title: '入学时间',
      dataIndex: 'enrollDate',
      key: 'enrollDate',
      render: (date) => (
        <span>
          <CalendarOutlined style={{ marginRight: 4 }} />
          {date}
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
            icon={<EyeOutlined />}
            onClick={() => showDetailModal(record)}
          >
            详情
          </Button>
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
            {record.status === 'active' ? '休学' : '复学'}
          </Button>
          <Popconfirm
            title="确定要删除这个学生吗？"
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
    <div className="student-management">
      {/* 页面头部 */}
      <div className="student-header">
        <div className="header-title">
          <UserOutlined className="title-icon" />
          <span>学生管理</span>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          className="create-btn"
        >
          添加学生
        </Button>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} className="statistics-row">
        <Col span={4}>
          <Card>
            <Statistic
              title="总学生数"
              value={statistics.total}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="在读学生"
              value={statistics.active}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="休学学生"
              value={statistics.inactive}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="平均成绩"
              value={statistics.avgScore}
              suffix="分"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="平均出勤率"
              value={statistics.avgAttendance}
              suffix="%"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="平均作业完成率"
              value={statistics.avgHomework}
              suffix="%"
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索和筛选 */}
      <Card className="filter-card">
        <Row gutter={16}>
          <Col span={8}>
            <Input
              placeholder="搜索学生姓名、学号或班级"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
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
              placeholder="选择班级"
              value={filterClass}
              onChange={setFilterClass}
              allowClear
              style={{ width: '100%' }}
            >
              {classes.map(cls => (
                <Option key={cls} value={cls}>{cls}</Option>
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
              <Option value="active">在读</Option>
              <Option value="inactive">休学</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* 学生表格 */}
      <Card className="table-card">
        <Table
          columns={columns}
          dataSource={filteredStudents}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 创建/编辑学生模态框 */}
      <Modal
        title={editingStudent ? '编辑学生' : '添加学生'}
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
            gender: '男',
            age: 10
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="学生姓名"
                rules={[{ required: true, message: '请输入学生姓名' }]}
              >
                <Input placeholder="请输入学生姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="studentId"
                label="学号"
                rules={[{ required: true, message: '请输入学号' }]}
              >
                <Input placeholder="请输入学号" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
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
            <Col span={8}>
              <Form.Item
                name="class"
                label="班级"
                rules={[{ required: true, message: '请选择班级' }]}
              >
                <Select placeholder="请选择班级">
                  {classes.map(cls => (
                    <Option key={cls} value={cls}>{cls}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="gender"
                label="性别"
                rules={[{ required: true, message: '请选择性别' }]}
              >
                <Select placeholder="请选择性别">
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="age"
                label="年龄"
                rules={[{ required: true, message: '请输入年龄' }]}
              >
                <Input type="number" placeholder="请输入年龄" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name="phone"
                label="联系电话"
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="email"
            label="邮箱"
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          
          <Form.Item
            name="address"
            label="家庭住址"
          >
            <Input.TextArea
              rows={2}
              placeholder="请输入家庭住址"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 学生详情模态框 */}
      <Modal
        title={`学生详情 - ${selectedStudent?.name}`}
        open={isDetailModalVisible}
        onCancel={handleCancel}
        width={1200}
        footer={[
          <Button key="close" onClick={handleCancel}>
            关闭
          </Button>
        ]}
      >
        {selectedStudent && (
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
              <Row gutter={24}>
                <Col span={8}>
                  <Card title="个人信息" size="small">
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                      <Avatar size={80} src={selectedStudent.avatar} style={{ backgroundColor: '#1890ff' }}>
                        {selectedStudent.name.charAt(0)}
                      </Avatar>
                    </div>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="姓名">{selectedStudent.name}</Descriptions.Item>
                      <Descriptions.Item label="学号">{selectedStudent.studentId}</Descriptions.Item>
                      <Descriptions.Item label="年级">{selectedStudent.grade}</Descriptions.Item>
                      <Descriptions.Item label="班级">{selectedStudent.class}</Descriptions.Item>
                      <Descriptions.Item label="性别">{selectedStudent.gender}</Descriptions.Item>
                      <Descriptions.Item label="年龄">{selectedStudent.age}岁</Descriptions.Item>
                      <Descriptions.Item label="状态">
                        <Tag color={selectedStudent.status === 'active' ? 'success' : 'default'}>
                          {selectedStudent.status === 'active' ? '在读' : '休学'}
                        </Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="联系信息" size="small">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="联系电话">{selectedStudent.phone}</Descriptions.Item>
                      <Descriptions.Item label="邮箱">{selectedStudent.email}</Descriptions.Item>
                      <Descriptions.Item label="家庭住址">{selectedStudent.address}</Descriptions.Item>
                      <Descriptions.Item label="入学时间">{selectedStudent.enrollDate}</Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="学习概况" size="small">
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ marginBottom: 8 }}>综合成绩</div>
                      <Progress 
                        percent={selectedStudent.totalScore} 
                        strokeColor={getScoreColor(selectedStudent.totalScore)}
                        format={percent => `${percent}分`}
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ marginBottom: 8 }}>出勤率</div>
                      <Progress 
                        percent={selectedStudent.attendance} 
                        status={selectedStudent.attendance >= 95 ? 'success' : selectedStudent.attendance >= 85 ? 'active' : 'exception'}
                        format={percent => `${percent}%`}
                      />
                    </div>
                    <div>
                      <div style={{ marginBottom: 8 }}>作业完成率</div>
                      <Progress 
                        percent={selectedStudent.homeworkCompletion} 
                        status={selectedStudent.homeworkCompletion >= 95 ? 'success' : selectedStudent.homeworkCompletion >= 85 ? 'active' : 'exception'}
                        format={percent => `${percent}%`}
                      />
                    </div>
                  </Card>
                </Col>
              </Row>
            </TabPane>
            
            <TabPane tab="学科成绩" key="2">
              <Row gutter={16}>
                {selectedStudent.subjects.map((subject, index) => (
                  <Col span={8} key={index}>
                    <Card title={subject.name} size="small" style={{ marginBottom: 16 }}>
                      <div style={{ textAlign: 'center', marginBottom: 16 }}>
                        <div style={{ 
                          fontSize: '24px', 
                          fontWeight: 'bold', 
                          color: getScoreColor(subject.score),
                          marginBottom: 8 
                        }}>
                          {subject.score}分
                        </div>
                        <div style={{ color: '#666' }}>班级排名: 第{subject.rank}名</div>
                      </div>
                      <div style={{ marginBottom: 8 }}>学习进度</div>
                      <Progress 
                        percent={subject.progress} 
                        size="small"
                        strokeColor={getScoreColor(subject.progress)}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </TabPane>
            
            <TabPane tab="作业情况" key="3">
              <List
                dataSource={selectedStudent.homeworks}
                renderItem={(homework) => {
                  const status = getHomeworkStatus(homework.status);
                  return (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<FileTextOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                        title={
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{homework.title}</span>
                            <Tag color={status.color}>{status.text}</Tag>
                          </div>
                        }
                        description={
                          <div>
                            <div style={{ marginBottom: 4 }}>
                              <Tag color="blue">{homework.subject}</Tag>
                              {homework.score && (
                                <span style={{ marginLeft: 8, color: getScoreColor(homework.score), fontWeight: 'bold' }}>
                                  得分: {homework.score}分
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              截止时间: {homework.deadline}
                              {homework.submitTime && (
                                <span style={{ marginLeft: 16 }}>提交时间: {homework.submitTime}</span>
                              )}
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </TabPane>
            
            <TabPane tab="学习轨迹" key="4">
              <Timeline>
                {selectedStudent.learningProgress.map((progress, index) => {
                  const iconMap = {
                    info: <ClockCircleOutlined />,
                    success: <CheckCircleOutlined />,
                    warning: <ExclamationCircleOutlined />
                  };
                  const colorMap = {
                    info: 'blue',
                    success: 'green',
                    warning: 'orange'
                  };
                  return (
                    <Timeline.Item 
                      key={index}
                      dot={iconMap[progress.type]}
                      color={colorMap[progress.type]}
                    >
                      <div style={{ marginBottom: 4, fontWeight: 'bold' }}>{progress.date}</div>
                      <div>{progress.activity}</div>
                    </Timeline.Item>
                  );
                })}
              </Timeline>
            </TabPane>
          </Tabs>
        )}
      </Modal>
    </div>
  );
};

export default StudentManagement;