import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Space,
  Tag,
  Progress,
  Tabs,
  Row,
  Col,
  Statistic,
  List,
  Avatar,
  Tooltip,
  Divider,
  Alert,
  Steps,
  Spin,
  Result
} from 'antd'
import {
  RobotOutlined,
  UploadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  BulbOutlined,
  StarOutlined
} from '@ant-design/icons'
import './AIGradingCenter.css'

const { TextArea } = Input
const { Option } = Select
const { Step } = Steps
const { Dragger } = Upload

const AIGradingCenter = () => {
  const [gradingTasks, setGradingTasks] = useState([
    {
      id: 1,
      homeworkTitle: '数学作业 - 二次函数练习',
      subject: '数学',
      totalFiles: 25,
      gradedFiles: 25,
      status: 'completed',
      avgScore: 85.5,
      startTime: '2024-01-15 10:00',
      endTime: '2024-01-15 10:15',
      aiModel: 'GPT-4',
      accuracy: 95.2
    },
    {
      id: 2,
      homeworkTitle: '英语作文 - My Dream',
      subject: '英语',
      totalFiles: 18,
      gradedFiles: 12,
      status: 'processing',
      avgScore: 78.2,
      startTime: '2024-01-16 14:30',
      endTime: null,
      aiModel: 'Claude-3',
      accuracy: null
    },
    {
      id: 3,
      homeworkTitle: '化学选择题测试',
      subject: '化学',
      totalFiles: 30,
      gradedFiles: 0,
      status: 'pending',
      avgScore: 0,
      startTime: null,
      endTime: null,
      aiModel: 'GPT-4',
      accuracy: null
    }
  ])

  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      studentName: '张三',
      studentId: '2024001',
      fileName: '数学作业_张三.pdf',
      submitTime: '2024-01-15 09:30',
      aiScore: 88,
      aiComments: '解题思路清晰，计算准确。建议在第3题中注意函数图像的对称轴。',
      manualScore: null,
      manualComments: '',
      status: 'ai_graded',
      confidence: 92.5
    },
    {
      id: 2,
      studentName: '李四',
      studentId: '2024002',
      fileName: '数学作业_李四.pdf',
      submitTime: '2024-01-15 08:45',
      aiScore: 76,
      aiComments: '基础概念掌握良好，但在复杂计算中存在错误。需要加强练习。',
      manualScore: 78,
      manualComments: '老师补充：步骤完整，但要注意计算细节。',
      status: 'manual_reviewed',
      confidence: 88.3
    },
    {
      id: 3,
      studentName: '王五',
      studentId: '2024003',
      fileName: '数学作业_王五.pdf',
      submitTime: '2024-01-15 10:20',
      aiScore: 95,
      aiComments: '优秀！解题方法多样，思路创新，计算准确无误。',
      manualScore: null,
      manualComments: '',
      status: 'ai_graded',
      confidence: 96.8
    }
  ])

  const [activeTab, setActiveTab] = useState('tasks')
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false)
  const [uploadForm] = Form.useForm()
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  // 统计数据
  const stats = {
    totalTasks: gradingTasks.length,
    completedTasks: gradingTasks.filter(t => t.status === 'completed').length,
    processingTasks: gradingTasks.filter(t => t.status === 'processing').length,
    totalGraded: gradingTasks.reduce((sum, t) => sum + t.gradedFiles, 0),
    avgAccuracy: gradingTasks.filter(t => t.accuracy).length > 0 ? 
      gradingTasks.filter(t => t.accuracy).reduce((sum, t) => sum + t.accuracy, 0) / 
      gradingTasks.filter(t => t.accuracy).length : 0
  }

  const handleStartGrading = () => {
    setIsUploadModalVisible(true)
    uploadForm.resetFields()
  }

  const handleUploadModalOk = async () => {
    try {
      const values = await uploadForm.validateFields()
      setIsProcessing(true)
      
      // 模拟上传和处理过程
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setUploadProgress(i)
      }
      
      // 创建新的批改任务
      const newTask = {
        id: Date.now(),
        homeworkTitle: values.homeworkTitle,
        subject: values.subject,
        totalFiles: values.fileList?.length || 0,
        gradedFiles: 0,
        status: 'processing',
        avgScore: 0,
        startTime: new Date().toLocaleString(),
        endTime: null,
        aiModel: values.aiModel,
        accuracy: null
      }
      
      setGradingTasks(prev => [...prev, newTask])
      
      // 模拟批改过程
      setTimeout(() => {
        setGradingTasks(prev => prev.map(task => 
          task.id === newTask.id ? {
            ...task,
            gradedFiles: task.totalFiles,
            status: 'completed',
            avgScore: 82.5,
            endTime: new Date().toLocaleString(),
            accuracy: 94.3
          } : task
        ))
        message.success('批改完成！')
      }, 3000)
      
      setIsUploadModalVisible(false)
      setIsProcessing(false)
      setUploadProgress(0)
      message.success('批改任务已启动')
    } catch (error) {
      console.error('表单验证失败:', error)
      setIsProcessing(false)
    }
  }

  const handleUploadModalCancel = () => {
    setIsUploadModalVisible(false)
    setIsProcessing(false)
    setUploadProgress(0)
    uploadForm.resetFields()
  }

  const getStatusTag = (status) => {
    const statusMap = {
      completed: { color: 'green', text: '已完成', icon: <CheckCircleOutlined /> },
      processing: { color: 'blue', text: '批改中', icon: <ClockCircleOutlined /> },
      pending: { color: 'orange', text: '待处理', icon: <ExclamationCircleOutlined /> },
      failed: { color: 'red', text: '失败', icon: <ExclamationCircleOutlined /> }
    }
    const config = statusMap[status] || statusMap.pending
    return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>
  }

  const getSubmissionStatusTag = (status) => {
    const statusMap = {
      ai_graded: { color: 'blue', text: 'AI已批改', icon: <RobotOutlined /> },
      manual_reviewed: { color: 'green', text: '人工已审核', icon: <CheckCircleOutlined /> },
      pending: { color: 'orange', text: '待批改', icon: <ClockCircleOutlined /> }
    }
    const config = statusMap[status] || statusMap.pending
    return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>
  }

  const taskColumns = [
    {
      title: '作业信息',
      key: 'homework',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{record.homeworkTitle}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.subject} • {record.aiModel}
          </div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status)
    },
    {
      title: '批改进度',
      key: 'progress',
      width: 150,
      render: (_, record) => {
        const percentage = record.totalFiles > 0 ? (record.gradedFiles / record.totalFiles) * 100 : 0
        return (
          <div>
            <div style={{ fontSize: '12px', marginBottom: 2 }}>
              {record.gradedFiles}/{record.totalFiles}
            </div>
            <Progress 
              percent={percentage} 
              size="small" 
              showInfo={false}
              strokeColor={percentage === 100 ? '#52c41a' : '#1890ff'}
            />
          </div>
        )
      }
    },
    {
      title: '平均分',
      dataIndex: 'avgScore',
      key: 'avgScore',
      width: 80,
      render: (score) => score > 0 ? score.toFixed(1) : '-'
    },
    {
      title: '准确率',
      dataIndex: 'accuracy',
      key: 'accuracy',
      width: 80,
      render: (accuracy) => accuracy ? `${accuracy.toFixed(1)}%` : '-'
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 120,
      render: (time) => time ? time.split(' ')[1] : '-'
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => {
                setSelectedTask(record)
                setActiveTab('submissions')
              }}
            />
          </Tooltip>
          <Tooltip title="重新批改">
            <Button 
              type="text" 
              icon={<ReloadOutlined />} 
              size="small"
              disabled={record.status === 'processing'}
            />
          </Tooltip>
          <Tooltip title="导出结果">
            <Button 
              type="text" 
              icon={<DownloadOutlined />} 
              size="small"
              disabled={record.status !== 'completed'}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  const submissionColumns = [
    {
      title: '学生信息',
      key: 'student',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.studentName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.studentId}</div>
        </div>
      )
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      width: 200,
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => getSubmissionStatusTag(status)
    },
    {
      title: 'AI分数',
      dataIndex: 'aiScore',
      key: 'aiScore',
      width: 80,
      render: (score, record) => (
        <div>
          <div style={{ fontWeight: 'bold', color: score >= 90 ? '#52c41a' : score >= 70 ? '#faad14' : '#ff4d4f' }}>
            {score}
          </div>
          <div style={{ fontSize: '10px', color: '#999' }}>
            置信度: {record.confidence}%
          </div>
        </div>
      )
    },
    {
      title: '人工分数',
      dataIndex: 'manualScore',
      key: 'manualScore',
      width: 80,
      render: (score) => score || '-'
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 120,
      render: (time) => time.split(' ')[1]
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="人工审核">
            <Button type="text" icon={<CheckCircleOutlined />} size="small" />
          </Tooltip>
        </Space>
      )
    }
  ]

  const uploadProps = {
    name: 'file',
    multiple: true,
    accept: '.pdf,.doc,.docx,.txt,.jpg,.png',
    beforeUpload: () => false, // 阻止自动上传
    onChange(info) {
      const { fileList } = info
      uploadForm.setFieldsValue({ fileList })
    }
  }

  return (
    <div className="ai-grading-center">
      <div className="grading-header">
        <div className="header-title">
          <h2><RobotOutlined /> 智能批改中心</h2>
          <p>AI驱动的自动批改系统，提高批改效率和准确性</p>
        </div>
        <Button 
          type="primary" 
          icon={<ThunderboltOutlined />}
          onClick={handleStartGrading}
          size="large"
        >
          开始批改
        </Button>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        className="grading-tabs"
        items={[
          {
            key: 'tasks',
            label: '批改任务',
            children: (
              <div>
                {/* 统计卡片 */}
                <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总任务数"
                  value={stats.totalTasks}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="已完成"
                  value={stats.completedTasks}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="已批改数量"
                  value={stats.totalGraded}
                  prefix={<RobotOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="平均准确率"
                  value={stats.avgAccuracy}
                  precision={1}
                  suffix="%"
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<StarOutlined />}
                />
              </Card>
            </Col>
          </Row>

                {/* 任务表格 */}
                <Card>
                  <Table
                    columns={taskColumns}
                    dataSource={gradingTasks}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                    }}
                  />
                </Card>
              </div>
            )
          },
          {
            key: 'submissions',
            label: '批改结果',
            children: (
              <Card>
                <div style={{ marginBottom: 16 }}>
                  <Space>
                    <Select defaultValue="all" style={{ width: 120 }}>
                      <Option value="all">全部状态</Option>
                      <Option value="ai_graded">AI已批改</Option>
                      <Option value="manual_reviewed">人工已审核</Option>
                      <Option value="pending">待批改</Option>
                    </Select>
                    <Select defaultValue="all" style={{ width: 120 }}>
                      <Option value="all">全部学科</Option>
                      <Option value="数学">数学</Option>
                      <Option value="语文">语文</Option>
                      <Option value="英语">英语</Option>
                    </Select>
                    <Button icon={<DownloadOutlined />}>批量导出</Button>
                  </Space>
                </div>
                <Table
                  columns={submissionColumns}
                  dataSource={submissions}
                  rowKey="id"
                  expandable={{
                    expandedRowRender: (record) => (
                      <div style={{ padding: '16px', background: '#fafafa' }}>
                        <Row gutter={16}>
                          <Col span={12}>
                            <h4><BulbOutlined /> AI评语</h4>
                            <p style={{ margin: 0, padding: '8px', background: 'white', borderRadius: '6px' }}>
                              {record.aiComments}
                            </p>
                          </Col>
                          <Col span={12}>
                            <h4><CheckCircleOutlined /> 人工评语</h4>
                            <p style={{ margin: 0, padding: '8px', background: 'white', borderRadius: '6px' }}>
                              {record.manualComments || '暂无人工评语'}
                            </p>
                          </Col>
                        </Row>
                      </div>
                    ),
                    rowExpandable: (record) => true
                  }}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                  }}
                />
              </Card>
            )
          },
          {
            key: 'analytics',
            label: '批改统计',
            children: (
              <Row gutter={16}>
                <Col span={12}>
                  <Card title={<><BarChartOutlined /> 分数分布</>}>
                    <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Result
                        icon={<BarChartOutlined />}
                        title="图表组件"
                        subTitle="分数分布统计图表待实现"
                      />
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title={<><RobotOutlined /> AI准确率趋势</>}>
                    <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Result
                        icon={<RobotOutlined />}
                        title="图表组件"
                        subTitle="AI准确率趋势图表待实现"
                      />
                    </div>
                  </Card>
                </Col>
              </Row>
            )
          }
        ]}
      />

      {/* 批改任务创建模态框 */}
      <Modal
        title={<><ThunderboltOutlined /> 创建批改任务</>}
        open={isUploadModalVisible}
        onOk={handleUploadModalOk}
        onCancel={handleUploadModalCancel}
        width={600}
        okText="开始批改"
        cancelText="取消"
        confirmLoading={isProcessing}
      >
        {isProcessing ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Progress percent={uploadProgress} />
              <p style={{ marginTop: 8, color: '#666' }}>正在上传和处理文件...</p>
            </div>
          </div>
        ) : (
          <Form form={uploadForm} layout="vertical" initialValues={{ aiModel: "GPT-4" }}>
            <Alert
              message="智能批改说明"
              description="系统支持多种文件格式的自动批改，包括PDF、Word文档、图片等。AI将根据作业类型和评分标准进行智能评分。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Form.Item
              name="homeworkTitle"
              label="作业标题"
              rules={[{ required: true, message: '请输入作业标题' }]}
            >
              <Input placeholder="请输入作业标题" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="subject"
                  label="学科"
                  rules={[{ required: true, message: '请选择学科' }]}
                >
                  <Select placeholder="请选择学科">
                    <Option value="数学">数学</Option>
                    <Option value="语文">语文</Option>
                    <Option value="英语">英语</Option>
                    <Option value="物理">物理</Option>
                    <Option value="化学">化学</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="aiModel"
                  label="AI模型"
                  rules={[{ required: true, message: '请选择AI模型' }]}
                >
                  <Select placeholder="请选择AI模型">
                    <Option value="GPT-4">GPT-4 (推荐)</Option>
                    <Option value="Claude-3">Claude-3</Option>
                    <Option value="Gemini">Gemini</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="fileList"
              label="上传作业文件"
              rules={[{ required: true, message: '请上传作业文件' }]}
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
            >
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">
                  支持单个或批量上传。支持PDF、Word、图片等格式。
                </p>
              </Dragger>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  )
}

export default AIGradingCenter