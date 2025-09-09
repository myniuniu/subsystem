import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  message,
  Space,
  Tag,
  Popconfirm,
  Tabs,
  Row,
  Col,
  Statistic,
  Progress,
  Tooltip,
  Divider,
  InputNumber,
  Checkbox
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  CloudUploadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CopyOutlined,
  FileOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import './HomeworkCenter.css'

const { TextArea } = Input
const { Option } = Select
const { RangePicker } = DatePicker

const HomeworkCenter = () => {
  // 作业类型选项
  const homeworkTypes = [
    { value: 'text', label: '文本作业', icon: '📝', description: '学生提交文字答案' },
    { value: 'file', label: '文件上传', icon: '📎', description: '学生上传文档、图片等文件' },
    { value: 'quiz', label: '在线答题', icon: '❓', description: '选择题、填空题等在线测试' },
    { value: 'mixed', label: '综合作业', icon: '📋', description: '包含多种提交方式的综合作业' },
    { value: 'video', label: '视频作业', icon: '🎥', description: '学生录制并提交视频' },
    { value: 'audio', label: '音频作业', icon: '🎵', description: '学生录制并提交音频' }
  ]

  const [homeworks, setHomeworks] = useState([
    {
      id: 1,
      title: '数学第五章练习题',
      subject: '数学',
      type: 'text',
      description: '完成教材第五章课后练习题1-20题，要求写出详细解题过程。',
      dueDate: '2024-01-20',
      status: 'published',
      class: '高一(1)班',
      totalStudents: 45,
      submitted: 38,
      graded: 35,
      avgScore: 85.2,
      createdAt: '2024-01-15 09:00',
      updatedAt: '2024-01-15 09:00',
      attachments: [],
      allowedFileTypes: [],
      maxFileSize: 0,
      questions: []
    },
    {
      id: 2,
      title: '英语口语练习视频',
      subject: '英语',
      type: 'video',
      description: '录制一段3-5分钟的英语自我介绍视频，要求发音清晰，语法正确。',
      dueDate: '2024-01-25',
      status: 'draft',
      class: '高一(2)班',
      totalStudents: 42,
      submitted: 0,
      graded: 0,
      avgScore: 0,
      createdAt: '2024-01-16 14:30',
      updatedAt: '2024-01-16 14:30',
      attachments: [],
      allowedFileTypes: ['mp4', 'avi', 'mov'],
      maxFileSize: 100,
      questions: []
    },
    {
      id: 3,
      title: '物理实验在线测试',
      subject: '物理',
      type: 'quiz',
      description: '完成牛顿第二定律相关选择题和计算题。',
      dueDate: '2024-01-18',
      status: 'published',
      class: '高一(1)班',
      totalStudents: 45,
      submitted: 45,
      graded: 45,
      avgScore: 78.9,
      createdAt: '2024-01-10 10:15',
      updatedAt: '2024-01-17 16:20',
      attachments: [],
      allowedFileTypes: [],
      maxFileSize: 0,
      questions: [
        {
          id: 1,
          type: 'single',
          question: '牛顿第二定律的数学表达式是？',
          options: ['F=ma', 'F=mv', 'F=mg', 'F=mgh'],
          correctAnswer: 0,
          score: 10
        },
        {
          id: 2,
          type: 'multiple',
          question: '影响物体加速度的因素有哪些？',
          options: ['质量', '作用力', '摩擦力', '重力'],
          correctAnswer: [0, 1],
          score: 15
        }
      ]
    },
    {
      id: 4,
      title: '语文作文写作',
      subject: '语文',
      type: 'file',
      description: '以"我的理想"为题，写一篇不少于800字的议论文，要求观点明确，论证充分。',
      dueDate: '2024-01-22',
      status: 'published',
      class: '高一(3)班',
      totalStudents: 40,
      submitted: 25,
      graded: 20,
      avgScore: 82.5,
      createdAt: '2024-01-12 11:00',
      updatedAt: '2024-01-18 15:30',
      attachments: [{
        name: '作文写作要求.pdf',
        url: '/files/writing-requirements.pdf',
        size: '2.5MB'
      }],
      allowedFileTypes: ['doc', 'docx', 'pdf'],
      maxFileSize: 10,
      questions: []
    },
    {
      id: 5,
      title: '化学实验综合作业',
      subject: '化学',
      type: 'mixed',
      description: '完成酸碱中和实验，提交实验报告和实验视频，并回答相关理论问题。',
      dueDate: '2024-01-28',
      status: 'published',
      class: '高一(1)班',
      totalStudents: 45,
      submitted: 12,
      graded: 8,
      avgScore: 88.7,
      createdAt: '2024-01-14 16:20',
      updatedAt: '2024-01-19 10:45',
      attachments: [{
        name: '实验指导书.pdf',
        url: '/files/experiment-guide.pdf',
        size: '5.2MB'
      }],
      allowedFileTypes: ['doc', 'docx', 'pdf', 'mp4', 'avi'],
      maxFileSize: 50,
      questions: [
        {
          id: 1,
          type: 'single',
          question: '酸碱中和反应的本质是什么？',
          options: ['H+与OH-结合生成H2O', '酸与碱混合', '产生盐和水', '温度升高'],
          correctAnswer: 0,
          score: 10
        },
        {
          id: 2,
          type: 'text',
          question: '请描述实验过程中观察到的现象，并解释原因。',
          score: 20
        }
      ]
    },
    {
      id: 6,
      title: '英语听力练习',
      subject: '英语',
      type: 'audio',
      description: '听录音材料，录制复述内容，要求语音语调自然，内容完整。',
      dueDate: '2024-01-24',
      status: 'published',
      class: '高一(2)班',
      totalStudents: 42,
      submitted: 30,
      graded: 25,
      avgScore: 79.3,
      createdAt: '2024-01-13 09:30',
      updatedAt: '2024-01-18 14:15',
      attachments: [{
        name: '听力材料.mp3',
        url: '/files/listening-material.mp3',
        size: '8.5MB'
      }],
      allowedFileTypes: ['mp3', 'wav', 'm4a'],
      maxFileSize: 20,
      questions: []
    }
  ])

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingHomework, setEditingHomework] = useState(null)
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState('list')
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [selectedHomework, setSelectedHomework] = useState(null)
  const [studentSubmissions, setStudentSubmissions] = useState([])

  const [isAIGradingModalVisible, setIsAIGradingModalVisible] = useState(false)
  const [aiGradingProgress, setAiGradingProgress] = useState(0)
  const [isAIGrading, setIsAIGrading] = useState(false)
  const [isUploadHomeworkModalVisible, setIsUploadHomeworkModalVisible] = useState(false)
  const [uploadHomeworkForm] = Form.useForm()
  const [currentUploadHomework, setCurrentUploadHomework] = useState(null)
  const [homeworkFiles, setHomeworkFiles] = useState([])

  // 统计数据
  const stats = {
    total: homeworks.length,
    published: homeworks.filter(h => h.status === 'published').length,
    draft: homeworks.filter(h => h.status === 'draft').length,
    overdue: homeworks.filter(h => h.status === 'published' && dayjs(h.dueDate).isBefore(dayjs())).length,
    totalSubmissions: homeworks.reduce((sum, h) => sum + h.submissions, 0),
    avgGradingProgress: homeworks.length > 0 ? 
      homeworks.reduce((sum, h) => sum + (h.graded / Math.max(h.submissions, 1)), 0) / homeworks.length * 100 : 0
  }

  const handleCreateHomework = () => {
    setEditingHomework(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEditHomework = (homework) => {
    setEditingHomework(homework)
    form.setFieldsValue({
      ...homework,
      dueDate: dayjs(homework.dueDate),
      class: Array.isArray(homework.class) ? homework.class : []
    })
    setIsModalVisible(true)
  }

  const handleDeleteHomework = (id) => {
    setHomeworks(prev => prev.filter(h => h.id !== id))
    message.success('作业删除成功')
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      const homeworkData = {
        ...values,
        dueDate: values.dueDate.format('YYYY-MM-DD'),
        createTime: editingHomework ? editingHomework.createTime : dayjs().format('YYYY-MM-DD HH:mm'),
        submissions: editingHomework ? editingHomework.submissions : 0,
        graded: editingHomework ? editingHomework.graded : 0,
        avgScore: editingHomework ? editingHomework.avgScore : 0
      }

      if (editingHomework) {
        setHomeworks(prev => prev.map(h => 
          h.id === editingHomework.id ? { ...h, ...homeworkData } : h
        ))
        message.success('作业更新成功')
      } else {
        const newHomework = {
          id: Date.now(),
          ...homeworkData,
          totalStudents: 30 // 默认值
        }
        setHomeworks(prev => [...prev, newHomework])
        message.success('作业创建成功')
      }

      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  // 查看作业详情
  const handleViewHomeworkDetail = (homework) => {
    setSelectedHomework(homework)
    // 模拟学生提交数据
    const mockSubmissions = [
      {
        id: 1,
        studentId: 'S001',
        studentName: '张三',
        submitTime: '2024-01-19 14:30',
        status: 'submitted',
        score: 85,
        content: '这是学生张三提交的作业内容...',
        attachments: [{ name: '作业答案.pdf', size: '2.3MB' }],
        feedback: '作业完成质量较好，但第3题解答过程需要更详细。'
      },
      {
        id: 2,
        studentId: 'S002',
        studentName: '李四',
        submitTime: '2024-01-19 16:45',
        status: 'submitted',
        score: 92,
        content: '这是学生李四提交的作业内容...',
        attachments: [{ name: '数学作业.docx', size: '1.8MB' }],
        feedback: '作业完成得很好，解题思路清晰，步骤完整。'
      },
      {
        id: 3,
        studentId: 'S003',
        studentName: '王五',
        submitTime: null,
        status: 'pending',
        score: null,
        content: null,
        attachments: [],
        feedback: null
      },
      {
        id: 4,
        studentId: 'S004',
        studentName: '赵六',
        submitTime: '2024-01-20 09:15',
        status: 'late',
        score: 78,
        content: '这是学生赵六提交的作业内容（逾期提交）...',
        attachments: [{ name: '作业.txt', size: '0.5MB' }],
        feedback: '虽然逾期提交，但作业质量尚可。'
      }
    ]
    setStudentSubmissions(mockSubmissions)
    setIsDetailModalVisible(true)
  }

  // 上传作业处理函数
  const handleUploadHomework = (homework) => {
    setCurrentUploadHomework(homework)
    setIsUploadHomeworkModalVisible(true)
    uploadHomeworkForm.resetFields()
    setHomeworkFiles([])
  }

  const handleUploadHomeworkSubmit = async () => {
    try {
      const values = await uploadHomeworkForm.validateFields()
      
      if (homeworkFiles.length === 0) {
        message.error('请至少上传一个文件')
        return
      }

      // 模拟上传处理
      message.loading('正在上传附件...', 2)
      
      setTimeout(() => {
        // 更新作业的附件信息
        const updatedAttachments = homeworkFiles.map(file => ({
          name: file.name,
          url: `/files/${file.name}`,
          size: `${(file.size / 1024 / 1024).toFixed(1)}MB`
        }))
        
        setHomeworks(prev => prev.map(hw => 
          hw.id === currentUploadHomework.id ? {
            ...hw,
            attachments: [...(hw.attachments || []), ...updatedAttachments],
            type: hw.type === 'text' ? 'file' : hw.type, // 如果原来是文本作业，改为文件作业
            allowedFileTypes: ['doc', 'docx', 'pdf', 'jpg', 'png'],
            maxFileSize: 10,
            updatedAt: dayjs().format('YYYY-MM-DD HH:mm')
          } : hw
        ))
        
        setIsUploadHomeworkModalVisible(false)
        message.success(`成功为作业"${currentUploadHomework.title}"上传 ${homeworkFiles.length} 个附件`)
      }, 2000)
    } catch (error) {
      console.error('上传失败:', error)
    }
  }



  // AI批改处理函数
  const handleAIGrading = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要进行AI批改的作业')
      return
    }
    setIsAIGradingModalVisible(true)
  }

  const startAIGrading = async () => {
    setIsAIGrading(true)
    setAiGradingProgress(0)
    setIsAIGradingModalVisible(false)
    
    // 模拟AI批改进度
    const interval = setInterval(() => {
      setAiGradingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAIGrading(false)
          
          // 更新作业状态
          setHomeworks(prevHomeworks => 
            prevHomeworks.map(homework => {
              if (selectedRowKeys.includes(homework.id)) {
                return {
                  ...homework,
                  graded: homework.submitted,
                  avgScore: Math.floor(Math.random() * 30) + 70 // 模拟70-100分的随机分数
                }
              }
              return homework
            })
          )
          
          message.success(`AI批改完成！已批改 ${selectedRowKeys.length} 个作业`)
          setSelectedRowKeys([])
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 500)
  }

  const getStatusTag = (status) => {
    const statusMap = {
      published: { color: 'green', text: '已发布', icon: <CheckCircleOutlined /> },
      draft: { color: 'orange', text: '草稿', icon: <EditOutlined /> },
      overdue: { color: 'red', text: '已过期', icon: <ExclamationCircleOutlined /> }
    }
    const config = statusMap[status] || statusMap.draft
    return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>
  }

  const getTypeTag = (type) => {
    const typeMap = {
      text: { color: 'blue', text: '文本作业', icon: <FileTextOutlined /> },
      file: { color: 'purple', text: '文件作业', icon: <UploadOutlined /> },
      online: { color: 'cyan', text: '在线答题', icon: <QuestionCircleOutlined /> }
    }
    const config = typeMap[type] || typeMap.text
    return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>
  }

  const columns = [
    {
      title: '作业信息',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: '14px' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: 4 }}>
            {getTypeTag(record.type)} • {record.subject} • {record.class}
          </div>
          <div style={{ fontSize: '11px', color: '#999' }}>
            创建时间: {dayjs(record.createdAt).format('MM-DD HH:mm')}
          </div>
        </div>
      )
    },
    {
      title: '截止时间',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
      render: (date) => {
        const isOverdue = dayjs(date).isBefore(dayjs(), 'day')
        const isNearDue = dayjs(date).diff(dayjs(), 'day') <= 1 && !isOverdue
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              color: isOverdue ? '#ff4d4f' : isNearDue ? '#faad14' : '#666',
              fontWeight: isOverdue || isNearDue ? 'bold' : 'normal'
            }}>
              {dayjs(date).format('MM-DD')}
            </div>
            <div style={{ fontSize: '11px', color: '#999' }}>
              {dayjs(date).format('HH:mm')}
            </div>
            {isOverdue && <div style={{ fontSize: '10px', color: '#ff4d4f' }}>已逾期</div>}
            {isNearDue && <div style={{ fontSize: '10px', color: '#faad14' }}>即将到期</div>}
          </div>
        )
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status, record) => {
        const isOverdue = status === 'published' && dayjs(record.dueDate).isBefore(dayjs())
        return getStatusTag(isOverdue ? 'overdue' : status)
      }
    },
    {
      title: '提交情况',
      key: 'submissions',
      width: 140,
      render: (_, record) => {
        const submitRate = Math.round((record.submitted / record.totalStudents) * 100)
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: '12px', color: '#666' }}>提交率</span>
              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                {record.submitted}/{record.totalStudents}
              </span>
            </div>
            <Progress 
              percent={submitRate} 
              size="small" 
              showInfo={false}
              strokeColor={{
                '0%': '#ff4d4f',
                '50%': '#faad14',
                '100%': '#52c41a',
              }}
            />
            <div style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: 2 }}>
              {submitRate}%
            </div>
          </div>
        )
      }
    },
    {
      title: '批改进度',
      key: 'grading',
      width: 140,
      render: (_, record) => {
        const gradeRate = record.submitted > 0 ? Math.round((record.graded / record.submitted) * 100) : 0
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: '12px', color: '#666' }}>批改率</span>
              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                {record.graded}/{record.submitted}
              </span>
            </div>
            <Progress 
              percent={gradeRate} 
              size="small" 
              showInfo={false}
              strokeColor={{
                '0%': '#faad14',
                '100%': '#52c41a',
              }}
            />
            <div style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: 2 }}>
              {gradeRate}%
            </div>
          </div>
        )
      }
    },
    {
      title: '平均分',
      dataIndex: 'avgScore',
      key: 'avgScore',
      width: 80,
      render: (score) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontWeight: 'bold',
            fontSize: '16px',
            color: score >= 90 ? '#52c41a' : score >= 80 ? '#faad14' : score >= 60 ? '#fa8c16' : '#ff4d4f'
          }}>
            {score > 0 ? score.toFixed(1) : '-'}
          </div>
          {score > 0 && (
            <div style={{ fontSize: '10px', color: '#999' }}>
              {score >= 90 ? '优秀' : score >= 80 ? '良好' : score >= 60 ? '及格' : '不及格'}
            </div>
          )}
        </div>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleViewHomeworkDetail(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEditHomework(record)}
            />
          </Tooltip>
          <Tooltip title="上传作业">
            <Button 
              type="text" 
              icon={<UploadOutlined />} 
              size="small"
              onClick={() => handleUploadHomework(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个作业吗？"
              onConfirm={() => handleDeleteHomework(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="text" icon={<DeleteOutlined />} size="small" danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  }

  return (
    <div className="homework-center">
      <div className="homework-header">
        <div className="header-title">
          <h2>作业管理中心</h2>
          <p>管理和跟踪学生作业的完成情况</p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleCreateHomework}
          size="large"
        >
          创建作业
        </Button>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        className="homework-tabs"
        items={[
          {
            key: 'list',
            label: '作业列表',
            children: (
              <>


                {/* 作业表格 */}
                <Card>
                  <div style={{ marginBottom: 16 }}>
                    <Space wrap>
                      <Button 
                        disabled={selectedRowKeys.length === 0}
                        onClick={() => {
                          message.info(`批量操作 ${selectedRowKeys.length} 个作业`)
                        }}
                      >
                        批量发布
                      </Button>
                      <Button 
                        disabled={selectedRowKeys.length === 0}
                        onClick={() => {
                          message.info(`批量删除 ${selectedRowKeys.length} 个作业`)
                        }}
                      >
                        批量删除
                      </Button>

                      <Button 
                        type="primary"
                        ghost
                        icon={<CheckCircleOutlined />}
                        disabled={selectedRowKeys.length === 0}
                        onClick={handleAIGrading}
                        loading={isAIGrading}
                      >
                        AI批改 ({selectedRowKeys.length})
                      </Button>
                      {isAIGrading && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Progress 
                            type="circle" 
                            size="small" 
                            percent={Math.round(aiGradingProgress)} 
                          />
                          <span>AI批改中...</span>
                        </div>
                      )}
                      <Divider type="vertical" />
                      <Select defaultValue="all" style={{ width: 120 }}>
                        <Option value="all">全部状态</Option>
                        <Option value="published">已发布</Option>
                        <Option value="draft">草稿</Option>
                      </Select>
                      <Select defaultValue="all" style={{ width: 120 }}>
                        <Option value="all">全部类型</Option>
                        <Option value="text">文本作业</Option>
                        <Option value="file">文件作业</Option>
                        <Option value="online">在线答题</Option>
                      </Select>
                    </Space>
                  </div>
                  <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={homeworks}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                    }}
                  />
                </Card>
              </>
            )
          },
          {
            key: 'stats',
            label: '数据统计',
            children: (
              <Row gutter={16}>
                <Col span={12}>
                  <Card title="作业完成率统计">
                    <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <p>图表组件待实现</p>
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="学科分布">
                    <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <p>图表组件待实现</p>
                    </div>
                  </Card>
                </Col>
              </Row>
            )
          }
        ]}
      />

      {/* 创建/编辑作业模态框 */}
      <Modal
        title={editingHomework ? '编辑作业' : '创建作业'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'draft',
            type: 'text',
            totalStudents: 30,
            totalScore: 100,
            difficulty: 'medium',
            maxSubmissions: 1,
            autoGrading: false,
            allowLateSubmission: false,
            showScoreToStudent: true,
            class: []
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="作业标题"
                rules={[{ required: true, message: '请输入作业标题' }]}
              >
                <Input placeholder="请输入作业标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="subject"
                label="科目"
                rules={[{ required: true, message: '请选择科目' }]}
              >
                <Select placeholder="请选择科目">
                  <Option value="语文">语文</Option>
                  <Option value="数学">数学</Option>
                  <Option value="英语">英语</Option>
                  <Option value="物理">物理</Option>
                  <Option value="化学">化学</Option>
                  <Option value="生物">生物</Option>
                  <Option value="历史">历史</Option>
                  <Option value="地理">地理</Option>
                  <Option value="政治">政治</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="作业类型"
                rules={[{ required: true, message: '请选择作业类型' }]}
              >
                <Select 
                  placeholder="请选择作业类型"
                  onChange={(value) => {
                    const selectedType = homeworkTypes.find(t => t.value === value)
                    if (selectedType) {
                      form.setFieldsValue({ typeDescription: selectedType.description })
                    }
                  }}
                >
                  {homeworkTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: 8 }}>{type.icon}</span>
                        <div>
                          <div>{type.label}</div>
                          <div style={{ fontSize: '11px', color: '#999' }}>{type.description}</div>
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="class"
                label="班级"
                rules={[{ required: true, message: '请选择班级' }]}
              >
                <Select placeholder="请选择班级" mode="multiple">
                  <Option value="高一(1)班">高一(1)班</Option>
                  <Option value="高一(2)班">高一(2)班</Option>
                  <Option value="高一(3)班">高一(3)班</Option>
                  <Option value="高二(1)班">高二(1)班</Option>
                  <Option value="高二(2)班">高二(2)班</Option>
                  <Option value="高三(1)班">高三(1)班</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="作业描述"
            rules={[{ required: true, message: '请输入作业描述' }]}
          >
            <TextArea rows={4} placeholder="请详细描述作业要求、注意事项等" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="dueDate"
                label="截止时间"
                rules={[{ required: true, message: '请选择截止时间' }]}
              >
                <DatePicker 
                  showTime 
                  style={{ width: '100%' }} 
                  placeholder="请选择截止时间"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="totalScore"
                label="总分"
                rules={[{ required: true, message: '请输入总分' }]}
              >
                <InputNumber 
                  min={1} 
                  max={200} 
                  style={{ width: '100%' }} 
                  placeholder="请输入总分"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="difficulty"
                label="难度等级"
                rules={[{ required: true, message: '请选择难度等级' }]}
              >
                <Select placeholder="请选择难度">
                  <Option value="easy">简单</Option>
                  <Option value="medium">中等</Option>
                  <Option value="hard">困难</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="allowedFileTypes"
            label="允许的文件类型"
            tooltip="学生可以上传的文件格式，多个格式用逗号分隔"
          >
            <Input placeholder="如：.pdf,.doc,.docx,.jpg,.png" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="maxFileSize"
                label="最大文件大小(MB)"
              >
                <InputNumber 
                  min={1} 
                  max={100} 
                  style={{ width: '100%' }} 
                  placeholder="请输入最大文件大小"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="maxSubmissions"
                label="最大提交次数"
                tooltip="学生可以重复提交的次数，0表示不限制"
              >
                <InputNumber 
                  min={0} 
                  max={10} 
                  style={{ width: '100%' }} 
                  placeholder="0表示不限制"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="draft">草稿</Option>
                  <Option value="published">发布</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="attachments"
            label="作业附件"
            tooltip="上传作业相关的参考资料、模板等"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload.Dragger
              multiple
              beforeUpload={() => false}
              onChange={(info) => {
                console.log('文件上传:', info.fileList)
              }}
            >
              <p className="ant-upload-drag-icon">
                <FileOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">支持单个或批量上传作业相关附件</p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item
            name="questions"
            label="题目设置"
            tooltip="适用于在线答题类型的作业"
          >
            <TextArea 
              rows={6} 
              placeholder="请输入题目内容，每行一题，格式如：\n1. 题目内容？\nA. 选项A B. 选项B C. 选项C D. 选项D\n答案：A"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Form.Item name="autoGrading" valuePropName="checked" noStyle>
                <Checkbox>启用自动批改</Checkbox>
              </Form.Item>
              <Form.Item name="allowLateSubmission" valuePropName="checked" noStyle>
                <Checkbox>允许逾期提交</Checkbox>
              </Form.Item>
              <Form.Item name="showScoreToStudent" valuePropName="checked" noStyle>
                <Checkbox>向学生显示分数</Checkbox>
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item
            name="totalStudents"
            label="班级人数"
            rules={[{ required: true, message: '请输入班级人数' }]}
          >
            <InputNumber min={1} max={100} style={{ width: '100%' }} placeholder="请输入班级总人数" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 学生作业详情模态框 */}
      <Modal
        title={`作业详情 - ${selectedHomework?.title}`}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedHomework && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic title="总人数" value={selectedHomework.totalStudents} />
                </Col>
                <Col span={6}>
                  <Statistic title="已提交" value={selectedHomework.submitted} />
                </Col>
                <Col span={6}>
                  <Statistic title="已批改" value={selectedHomework.graded} />
                </Col>
                <Col span={6}>
                  <Statistic 
                    title="平均分" 
                    value={selectedHomework.avgScore} 
                    precision={1}
                    suffix="分"
                  />
                </Col>
              </Row>
            </Card>

            <Table
              dataSource={studentSubmissions}
              rowKey="id"
              pagination={false}
              columns={[
                {
                  title: '学号',
                  dataIndex: 'studentId',
                  width: 80
                },
                {
                  title: '姓名',
                  dataIndex: 'studentName',
                  width: 100
                },
                {
                  title: '提交时间',
                  dataIndex: 'submitTime',
                  width: 150,
                  render: (time) => time || '-'
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  width: 100,
                  render: (status) => {
                    const statusMap = {
                      submitted: { color: 'green', text: '已提交' },
                      pending: { color: 'orange', text: '未提交' },
                      late: { color: 'red', text: '逾期提交' },
                      graded: { color: 'blue', text: '已批改' }
                    }
                    const config = statusMap[status] || { color: 'default', text: status }
                    return <Tag color={config.color}>{config.text}</Tag>
                  }
                },
                {
                  title: '分数',
                  dataIndex: 'score',
                  width: 80,
                  render: (score) => score ? `${score}分` : '-'
                },
                {
                  title: '附件',
                  dataIndex: 'attachments',
                  width: 120,
                  render: (attachments) => (
                    <div>
                      {attachments.map((file, index) => (
                        <div key={index} style={{ fontSize: '12px' }}>
                          <FileOutlined /> {file.name}
                        </div>
                      ))}
                      {attachments.length === 0 && '-'}
                    </div>
                  )
                },
                {
                  title: '操作',
                  width: 120,
                  render: (_, record) => (
                    <Space size="small">
                      {record.status !== 'pending' && (
                        <Button size="small" type="link">
                          查看内容
                        </Button>
                      )}
                      {record.status === 'submitted' && (
                        <Button size="small" type="link">
                          批改
                        </Button>
                      )}
                    </Space>
                  )
                }
              ]}
            />
          </div>
        )}
      </Modal>



      {/* AI批改确认模态框 */}
      <Modal
        title="AI批改确认"
        open={isAIGradingModalVisible}
        onOk={startAIGrading}
        onCancel={() => setIsAIGradingModalVisible(false)}
        okText="开始AI批改"
        cancelText="取消"
      >
        <div>
          <p>您即将对以下 <strong>{selectedRowKeys.length}</strong> 个作业进行AI批改：</p>
          <ul style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 16 }}>
            {homeworks
              .filter(hw => selectedRowKeys.includes(hw.id))
              .map(hw => (
                <li key={hw.id}>
                  <strong>{hw.title}</strong> - {hw.class} ({hw.submitted} 份提交)
                </li>
              ))
            }
          </ul>
          <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6, padding: 12 }}>
            <h4 style={{ margin: 0, color: '#52c41a' }}>AI批改说明：</h4>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
              <li>AI将自动分析学生提交的作业内容</li>
              <li>根据作业要求和评分标准进行智能评分</li>
              <li>生成详细的批改意见和建议</li>
              <li>批改完成后您可以进一步调整分数和评语</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* 上传作业模态框 */}
      <Modal
        title={`为作业"${currentUploadHomework?.title}"上传附件`}
        open={isUploadHomeworkModalVisible}
        onOk={handleUploadHomeworkSubmit}
        onCancel={() => setIsUploadHomeworkModalVisible(false)}
        width={600}
        okText="确定上传"
        cancelText="取消"
      >
        <Form
          form={uploadHomeworkForm}
          layout="vertical"
        >
          <div style={{ marginBottom: 16, padding: 12, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6 }}>
            <h4 style={{ margin: 0, color: '#52c41a' }}>作业信息：</h4>
            <p style={{ margin: '8px 0 0 0' }}>
              <strong>标题：</strong>{currentUploadHomework?.title}<br/>
              <strong>科目：</strong>{currentUploadHomework?.subject}<br/>
              <strong>类型：</strong>{currentUploadHomework?.type === 'text' ? '文本作业' : '文件作业'}<br/>
              <strong>截止时间：</strong>{currentUploadHomework?.dueDate}
            </p>
          </div>

          <Form.Item
            name="description"
            label="上传说明"
          >
            <TextArea 
              rows={3} 
              placeholder="请输入上传附件的说明（可选）"
            />
          </Form.Item>

          <Form.Item
            label="上传附件"
            required
          >
            <Upload.Dragger
              multiple
              beforeUpload={(file) => {
                setHomeworkFiles(prev => [...prev, file])
                return false
              }}
              onRemove={(file) => {
                setHomeworkFiles(prev => prev.filter(f => f.uid !== file.uid))
              }}
              fileList={homeworkFiles}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">
                支持 PDF、Word、PPT、Excel、图片等格式，上传后可进行AI批改
              </p>
            </Upload.Dragger>
          </Form.Item>

          {homeworkFiles.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <p><strong>已选择 {homeworkFiles.length} 个文件：</strong></p>
              <ul style={{ maxHeight: 150, overflowY: 'auto' }}>
                {homeworkFiles.map((file, index) => (
                  <li key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{file.name}</span>
                    <span style={{ color: '#999', fontSize: '12px' }}>
                      {(file.size / 1024 / 1024).toFixed(1)}MB
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginTop: 16, padding: 12, background: '#fff7e6', border: '1px solid #ffd591', borderRadius: 6 }}>
            <h4 style={{ margin: 0, color: '#fa8c16' }}>温馨提示：</h4>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: 20, fontSize: '12px' }}>
              <li>上传附件后，作业类型将自动调整为文件作业</li>
              <li>学生可以基于这些附件进行作业提交</li>
              <li>上传完成后可以使用AI批改功能对学生提交进行自动评分</li>
            </ul>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default HomeworkCenter