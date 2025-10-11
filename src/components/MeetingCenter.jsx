import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  Card, 
  Button, 
  Table, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Switch, 
  Space, 
  Avatar, 
  Badge, 
  Tooltip, 
  Progress, 
  Statistic, 
  Row, 
  Col, 
  List, 
  Typography, 
  Divider,
  message
} from 'antd';
import { 
  VideoCameraOutlined, 
  AudioOutlined, 
  ShareAltOutlined, 
  MessageOutlined, 
  SettingOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  TeamOutlined, 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  StopOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './MeetingCenter.css';

const MeetingCenter = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('meetings');
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: '数学教研组周例会',
      type: '教研会议',
      organizer: '张主任',
      participants: ['李老师', '王老师', '陈老师', '刘老师'],
      startTime: '2024-01-20 14:00',
      endTime: '2024-01-20 15:30',
      status: '进行中',
      agenda: '讨论期末考试安排和下学期教学计划',
      meetingRoom: '会议室A',
      isOnline: true,
      recordingEnabled: true,
      attendanceCount: 8,
      totalInvited: 10
    },
    {
      id: 2,
      title: '新课程标准研讨会',
      type: '学术研讨',
      organizer: '王校长',
      participants: ['全体教师'],
      startTime: '2024-01-22 09:00',
      endTime: '2024-01-22 11:00',
      status: '即将开始',
      agenda: '学习新课程标准，讨论教学改革方向',
      meetingRoom: '多功能厅',
      isOnline: false,
      recordingEnabled: true,
      attendanceCount: 0,
      totalInvited: 45
    },
    {
      id: 3,
      title: '班主任工作交流会',
      type: '工作交流',
      organizer: '德育处',
      participants: ['各班班主任'],
      startTime: '2024-01-18 16:00',
      endTime: '2024-01-18 17:00',
      status: '已结束',
      agenda: '分享班级管理经验，讨论学生问题',
      meetingRoom: '会议室B',
      isOnline: true,
      recordingEnabled: true,
      attendanceCount: 12,
      totalInvited: 15
    },
    {
      id: 4,
      title: '语文教研组月度总结',
      type: '教研会议',
      organizer: '赵主任',
      participants: ['语文组全体教师'],
      startTime: '2024-01-25 15:00',
      endTime: '2024-01-25 16:30',
      status: '即将开始',
      agenda: '总结本月教学工作，制定下月计划',
      meetingRoom: '会议室C',
      isOnline: false,
      recordingEnabled: true,
      attendanceCount: 0,
      totalInvited: 12
    },
    {
      id: 5,
      title: '信息技术培训会',
      type: '培训会议',
      organizer: '信息中心',
      participants: ['全体教师'],
      startTime: '2024-01-26 09:00',
      endTime: '2024-01-26 11:30',
      status: '即将开始',
      agenda: '智慧教室设备使用培训',
      meetingRoom: '计算机教室',
      isOnline: true,
      recordingEnabled: true,
      attendanceCount: 0,
      totalInvited: 50
    }
  ]);

  const [currentMeeting, setCurrentMeeting] = useState(
    meetings.find(meeting => meeting.status === '进行中') || null
  );
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    type: '',
    startTime: '',
    endTime: '',
    agenda: '',
    meetingRoom: '',
    isOnline: false,
    recordingEnabled: false,
    participants: []
  });

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      user: '张主任',
      message: '大家好，今天我们主要讨论期末考试的安排',
      timestamp: '14:05',
      type: 'text'
    },
    {
      id: 2,
      user: '李老师',
      message: '建议数学考试时间延长到120分钟',
      timestamp: '14:08',
      type: 'text'
    },
    {
      id: 3,
      user: '王老师',
      message: '我同意李老师的建议',
      timestamp: '14:10',
      type: 'text'
    },
    {
      id: 4,
      user: '系统',
      message: '陈老师加入了会议',
      timestamp: '14:12',
      type: 'system'
    },
    {
      id: 5,
      user: '陈老师',
      message: '抱歉迟到了，刚才在处理学生问题',
      timestamp: '14:13',
      type: 'text'
    },
    {
      id: 6,
      user: '刘老师',
      message: '关于英语考试，我觉得听力部分需要加强',
      timestamp: '14:15',
      type: 'text'
    },
    {
      id: 7,
      user: '赵老师',
      message: '同意，学生的听力水平确实需要提升',
      timestamp: '14:16',
      type: 'text'
    },
    {
      id: 8,
      user: '系统',
      message: '孙老师加入了会议',
      timestamp: '14:18',
      type: 'system'
    },
    {
      id: 9,
      user: '孙老师',
      message: '大家好！刚看到会议通知就赶紧进来了',
      timestamp: '14:19',
      type: 'text'
    },
    {
      id: 10,
      user: '周老师',
      message: '物理实验考试的设备准备情况如何？',
      timestamp: '14:21',
      type: 'text'
    },
    {
      id: 11,
      user: '吴老师',
      message: '实验室设备已经检查完毕，都可以正常使用',
      timestamp: '14:23',
      type: 'text'
    },
    {
      id: 12,
      user: '张主任',
      message: '很好，那我们开始讨论具体的考试时间安排',
      timestamp: '14:25',
      type: 'text'
    },
    {
      id: 13,
      user: '郑老师',
      message: '建议语文考试安排在上午，学生精神状态更好',
      timestamp: '14:27',
      type: 'text'
    },
    {
      id: 14,
      user: '冯老师',
      message: '👍 赞同郑老师的建议',
      timestamp: '14:28',
      type: 'text'
    },
    {
      id: 15,
      user: '系统',
      message: '会议录制已开始',
      timestamp: '14:30',
      type: 'system'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const [meetingRecords, setMeetingRecords] = useState([
    {
      id: 1,
      meetingId: 3,
      title: '班主任工作交流会',
      date: '2024-01-18',
      duration: '60分钟',
      recordingUrl: '/recordings/meeting_3.mp4',
      transcriptUrl: '/transcripts/meeting_3.txt',
      summary: '讨论了班级管理的有效方法，分享了处理学生问题的经验',
      keyPoints: ['建立良好师生关系', '家校沟通重要性', '个性化教育方法'],
      participants: 12,
      fileSize: '245MB'
    },
    {
      id: 2,
      meetingId: 1,
      title: '数学教研组周例会',
      date: '2024-01-13',
      duration: '90分钟',
      recordingUrl: '/recordings/meeting_1.mp4',
      transcriptUrl: '/transcripts/meeting_1.txt',
      summary: '制定了期末复习计划，讨论了教学进度安排',
      keyPoints: ['期末复习重点', '作业布置策略', '学困生帮扶措施'],
      participants: 8,
      fileSize: '312MB'
    }
  ]);

  const [analytics, setAnalytics] = useState({
    totalMeetings: 48,
    thisMonth: 15,
    averageDuration: 82,
    participationRate: 92,
    onlineMeetings: 35,
    offlineMeetings: 13,
    recordedMeetings: 41,
    totalParticipants: 156,
    activeUsers: 28,
    screenShareSessions: 23,
    chatMessages: 1247,
    averageRating: 4.6,
    topicsCovered: 89,
    documentsShared: 67
  });

  // 会议详情模态框状态
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showMeetingDetail, setShowMeetingDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);

  const handleCreateMeeting = () => {
    if (!meetingForm.title || !meetingForm.startTime || !meetingForm.endTime) {
      alert('请填写必要的会议信息');
      return;
    }

    const newMeeting = {
      id: Date.now(),
      ...meetingForm,
      organizer: '当前用户',
      status: '即将开始',
      attendanceCount: 0,
      totalInvited: meetingForm.participants.length
    };

    setMeetings(prev => [newMeeting, ...prev]);
    
    // 重置表单
    setMeetingForm({
      title: '',
      type: '',
      startTime: '',
      endTime: '',
      agenda: '',
      meetingRoom: '',
      isOnline: false,
      recordingEnabled: false,
      participants: []
    });

    alert('会议创建成功！');
  };

  const handleJoinMeeting = (meeting) => {
    setCurrentMeeting(meeting);
    setActiveTab('live');
  };

  const handlePrepareMeeting = (meeting) => {
    // 模拟准备会议功能
    alert(`正在为会议 "${meeting.title}" 做准备...\n\n准备内容包括：\n- 检查设备连接\n- 准备会议资料\n- 通知参会人员\n- 设置会议环境`);
    
    // 可以在这里添加更多准备逻辑，比如：
    // - 打开会议准备清单
    // - 检查网络连接
    // - 预加载会议资料等
  };

  const handleViewRecording = (meeting) => {
    // 模拟查看录像功能
    if (meeting.recordingEnabled) {
      alert(`正在加载会议 "${meeting.title}" 的录像...\n\n录像信息：\n- 会议时长：${calculateMeetingDuration(meeting.startTime, meeting.endTime)}\n- 参与人数：${meeting.attendanceCount}人\n- 录制质量：高清`);
      
      // 实际项目中这里可以：
      // - 打开视频播放器
      // - 加载录像文件
      // - 显示录像详情等
    } else {
      alert('该会议未开启录制功能，无法查看录像。');
    }
  };

  // 计算会议时长的辅助函数
  const calculateMeetingDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.abs(end - start) / (1000 * 60); // 转换为分钟
    const hours = Math.floor(duration / 60);
    const minutes = Math.floor(duration % 60);
    return hours > 0 ? `${hours}小时${minutes}分钟` : `${minutes}分钟`;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      user: '当前用户',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const handleViewMeetingDetail = (meeting) => {
    setSelectedMeeting(meeting);
    setShowMeetingDetail(true);
  };

  const closeMeetingDetail = () => {
    setShowMeetingDetail(false);
    setSelectedMeeting(null);
  };

  const handleEditMeeting = (meeting) => {
    setEditingMeeting({
      ...meeting,
      participants: Array.isArray(meeting.participants) ? meeting.participants.join(', ') : meeting.participants
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingMeeting(null);
  };

  const handleUpdateMeeting = () => {
    if (!editingMeeting.title || !editingMeeting.startTime || !editingMeeting.endTime) {
      alert('请填写完整的会议信息');
      return;
    }

    const updatedMeetings = meetings.map(meeting => 
      meeting.id === editingMeeting.id 
        ? {
            ...editingMeeting,
            participants: editingMeeting.participants.split(',').map(p => p.trim()).filter(p => p)
          }
        : meeting
    );
    
    setMeetings(updatedMeetings);
    closeEditModal();
    alert('会议信息已更新');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '进行中': return '#27ae60';
      case '即将开始': return '#f39c12';
      case '已结束': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const getMeetingTypeColor = (type) => {
    switch (type) {
      case '教研会议': return '#3498db';
      case '学术研讨': return '#9b59b6';
      case '工作交流': return '#e67e22';
      case '培训会议': return '#1abc9c';
      default: return '#95a5a6';
    }
  };

  const renderMeetingsList = () => {
    const columns = [
      {
        title: '会议信息',
        key: 'info',
        render: (_, meeting) => (
          <div>
            <Typography.Title level={5} style={{ margin: 0, marginBottom: 4 }}>{meeting.title}</Typography.Title>
            <Space size={[0, 4]} wrap>
              <Tag color={getMeetingTypeColor(meeting.type)}>{meeting.type}</Tag>
              <Typography.Text type="secondary">
                <UserOutlined /> {meeting.organizer}
              </Typography.Text>
              <Typography.Text type="secondary">
                <CalendarOutlined /> {meeting.startTime}
              </Typography.Text>
            </Space>
          </div>
        )
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (status) => {
          let color = 'default';
          if (status === '进行中') color = 'green';
          else if (status === '即将开始') color = 'orange';
          else if (status === '已结束') color = 'default';
          return <Tag color={color}>{status}</Tag>;
        }
      },
      {
        title: '参与情况',
        key: 'participants',
        width: 120,
        render: (_, meeting) => (
          <div>
            <Typography.Text>
              <TeamOutlined /> {meeting.attendanceCount}/{meeting.totalInvited}
            </Typography.Text>
            <br />
            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
              {meeting.meetingRoom}
            </Typography.Text>
          </div>
        )
      },
      {
        title: '会议特性',
        key: 'features',
        width: 100,
        render: (_, meeting) => (
          <Space>
            {meeting.isOnline && <Tag color="blue">在线</Tag>}
            {meeting.recordingEnabled && <Tag color="red">录制</Tag>}
          </Space>
        )
      },
      {
        title: '操作',
        key: 'actions',
        width: 200,
        render: (_, meeting) => (
          <Space>
            {meeting.status === '进行中' && (
              <Button 
                type="primary" 
                size="small"
                icon={<VideoCameraOutlined />}
                onClick={() => handleJoinMeeting(meeting)}
              >
                加入
              </Button>
            )}
            {meeting.status === '即将开始' && (
              <Button 
                type="default" 
                size="small"
                onClick={() => handlePrepareMeeting(meeting)}
              >
                准备
              </Button>
            )}
            {meeting.status === '已结束' && (
              <Button 
                type="default" 
                size="small"
                icon={<PlayCircleOutlined />}
                onClick={() => handleViewRecording(meeting)}
              >
                录像
              </Button>
            )}
            <Button 
              size="small"
              onClick={() => handleEditMeeting(meeting)}
            >
              编辑
            </Button>
          </Space>
        )
      }
    ];

    return (
      <div className="meetings-list">
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Select
              placeholder="选择会议状态"
              style={{ width: '100%' }}
              allowClear
            >
              <Select.Option value="进行中">进行中</Select.Option>
              <Select.Option value="即将开始">即将开始</Select.Option>
              <Select.Option value="已结束">已结束</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select
              placeholder="选择会议类型"
              style={{ width: '100%' }}
              allowClear
            >
              <Select.Option value="教研会议">教研会议</Select.Option>
              <Select.Option value="学术研讨">学术研讨</Select.Option>
              <Select.Option value="工作交流">工作交流</Select.Option>
              <Select.Option value="培训会议">培训会议</Select.Option>
            </Select>
          </Col>
        </Row>
        
        <Table
          columns={columns}
          dataSource={meetings}
          rowKey="id"
          pagination={false}
          tableLayout="fixed"
          onRow={(meeting) => ({
            onClick: () => handleViewMeetingDetail(meeting)
          })}
          style={{ cursor: 'pointer', width: '100%' }}
        />
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'meetings':
        return renderMeetingsList();

      case 'create':
        return (
          <Card title="创建会议" style={{ margin: '16px 0' }}>
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="会议标题" required>
                    <Input
                      value={meetingForm.title}
                      onChange={(e) => setMeetingForm({...meetingForm, title: e.target.value})}
                      placeholder="请输入会议标题"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="会议类型" required>
                    <Select
                      value={meetingForm.type}
                      onChange={(value) => setMeetingForm({...meetingForm, type: value})}
                      placeholder="请选择会议类型"
                    >
                      <Select.Option value="教研会议">教研会议</Select.Option>
                      <Select.Option value="学术研讨">学术研讨</Select.Option>
                      <Select.Option value="工作交流">工作交流</Select.Option>
                      <Select.Option value="培训会议">培训会议</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="开始时间" required>
                    <DatePicker
                      showTime
                      value={meetingForm.startTime ? dayjs(meetingForm.startTime) : null}
                      onChange={(date) => setMeetingForm({...meetingForm, startTime: date ? date.format('YYYY-MM-DD HH:mm') : ''})}
                      placeholder="选择开始时间"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="结束时间" required>
                    <DatePicker
                      showTime
                      value={meetingForm.endTime ? dayjs(meetingForm.endTime) : null}
                      onChange={(date) => setMeetingForm({...meetingForm, endTime: date ? date.format('YYYY-MM-DD HH:mm') : ''})}
                      placeholder="选择结束时间"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="会议室">
                    <Select
                      value={meetingForm.meetingRoom}
                      onChange={(value) => setMeetingForm({...meetingForm, meetingRoom: value})}
                      placeholder="请选择会议室"
                    >
                      <Select.Option value="会议室A">会议室A</Select.Option>
                      <Select.Option value="会议室B">会议室B</Select.Option>
                      <Select.Option value="多功能厅">多功能厅</Select.Option>
                      <Select.Option value="在线会议室">在线会议室</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item label="会议议程">
                <Input.TextArea
                  value={meetingForm.agenda}
                  onChange={(e) => setMeetingForm({...meetingForm, agenda: e.target.value})}
                  placeholder="请描述会议议程和主要内容"
                  rows={4}
                />
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item>
                    <Space>
                      <Switch
                        checked={meetingForm.isOnline}
                        onChange={(checked) => setMeetingForm({...meetingForm, isOnline: checked})}
                      />
                      <span>在线会议</span>
                    </Space>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item>
                    <Space>
                      <Switch
                        checked={meetingForm.recordingEnabled}
                        onChange={(checked) => setMeetingForm({...meetingForm, recordingEnabled: checked})}
                      />
                      <span>开启录制</span>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item>
                <Button type="primary" onClick={handleCreateMeeting} size="large">
                  创建会议
                </Button>
              </Form.Item>
            </Form>
          </Card>
        );

      case 'live':
        return (
          <div>
            {currentMeeting ? (
              <>
                <Card 
                  title={currentMeeting.title} 
                  extra={
                    <Space>
                      <Badge count={12} showZero color="green">
                        <TeamOutlined /> 参与人数
                      </Badge>
                      <Badge count="45分钟" color="blue">
                        <ClockCircleOutlined /> 会议时长
                      </Badge>
                      <Badge count="录制中" color="red" />
                    </Space>
                  }
                >
                  <Row gutter={16}>
                    <Col span={16}>
                      <Card title="主视频区域" size="small" style={{ marginBottom: 16 }}>
                        <div style={{ 
                          height: '300px', 
                          background: '#f0f0f0', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexDirection: 'column'
                        }}>
                          {isScreenSharing ? (
                            <>
                              <ShareAltOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                              <Typography.Title level={4}>屏幕共享中</Typography.Title>
                              <Typography.Text>张主任正在共享屏幕</Typography.Text>
                            </>
                          ) : (
                            <>
                              <Avatar size={64} icon={<UserOutlined />} />
                              <Typography.Title level={4}>张主任</Typography.Title>
                              <Typography.Text>主讲人</Typography.Text>
                            </>
                          )}
                        </div>
                      </Card>
                      
                      <Card title="参与者" size="small">
                        <Row gutter={[8, 8]}>
                          {['李老师', '王老师', '陈老师', '刘老师', '赵老师', '孙老师', '周老师', '吴老师', '郑老师', '冯老师', '陈主任', '林老师'].map((name, index) => (
                            <Col span={6} key={index}>
                              <Card size="small" style={{ textAlign: 'center' }}>
                                <Avatar icon={<UserOutlined />} />
                                <div style={{ marginTop: 8 }}>
                                  <Typography.Text style={{ fontSize: '12px' }}>{name}</Typography.Text>
                                  <div>
                                    {index < 8 ? 
                                      <AudioOutlined style={{ color: '#52c41a' }} /> : 
                                      <AudioOutlined style={{ color: '#ff4d4f' }} />
                                    }
                                    {index % 3 === 0 ? 
                                      <VideoCameraOutlined style={{ color: '#52c41a', marginLeft: 4 }} /> : 
                                      <VideoCameraOutlined style={{ color: '#ff4d4f', marginLeft: 4 }} />
                                    }
                                  </div>
                                </div>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </Card>
                    </Col>
                    
                    <Col span={8}>
                      <Card title="会议聊天" size="small">
                        <div style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
                            <List
                              dataSource={chatMessages}
                              renderItem={(msg) => (
                                <List.Item style={{ padding: '8px 0' }}>
                                  <div style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                      <Typography.Text strong style={{ fontSize: '12px' }}>{msg.user}</Typography.Text>
                                      <Typography.Text type="secondary" style={{ fontSize: '10px' }}>{msg.timestamp}</Typography.Text>
                                    </div>
                                    <Typography.Text style={{ fontSize: '12px' }}>{msg.message}</Typography.Text>
                                  </div>
                                </List.Item>
                              )}
                            />
                          </div>
                          <Space.Compact style={{ width: '100%' }}>
                            <Input
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onPressEnter={handleSendMessage}
                              placeholder="输入消息..."
                            />
                            <Button type="primary" onClick={handleSendMessage}>
                              发送
                            </Button>
                          </Space.Compact>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </Card>
                
                <Card style={{ marginTop: 16 }}>
                  <Space size="large" style={{ width: '100%', justifyContent: 'center' }}>
                    <Button 
                      type={isMuted ? "danger" : "default"}
                      icon={isMuted ? <AudioOutlined /> : <AudioOutlined />}
                      onClick={toggleMute}
                    >
                      {isMuted ? '取消静音' : '静音'}
                    </Button>
                    <Button 
                      type={!isVideoOn ? "danger" : "default"}
                      icon={<VideoCameraOutlined />}
                      onClick={toggleVideo}
                    >
                      {isVideoOn ? '关闭视频' : '开启视频'}
                    </Button>
                    <Button 
                      type={isScreenSharing ? "primary" : "default"}
                      icon={<ShareAltOutlined />}
                      onClick={toggleScreenShare}
                    >
                      {isScreenSharing ? '停止共享' : '共享屏幕'}
                    </Button>
                    <Button type="default" danger>
                      录制
                    </Button>
                    <Button type="primary" danger>
                      离开会议
                    </Button>
                  </Space>
                </Card>
              </>
            ) : (
              <Card>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <VideoCameraOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />
                  <Typography.Title level={3} style={{ marginTop: 16 }}>当前没有进行中的会议</Typography.Title>
                  <Typography.Text type="secondary">请从会议列表中加入一个会议</Typography.Text>
                </div>
              </Card>
            )}
          </div>
        );

      case 'records':
        return (
          <div>
            <Typography.Title level={3}>会议录像</Typography.Title>
            <List
              dataSource={meetingRecords}
              renderItem={(record) => (
                <List.Item>
                  <Card 
                    style={{ width: '100%' }}
                    title={record.title}
                    extra={
                      <Space>
                        <Button type="primary" icon={<PlayCircleOutlined />}>播放</Button>
                        <Button icon={<ShareAltOutlined />}>分享</Button>
                      </Space>
                    }
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <div>
                            <Typography.Text strong>日期: </Typography.Text>
                            <Typography.Text>{record.date}</Typography.Text>
                          </div>
                          <div>
                            <Typography.Text strong>时长: </Typography.Text>
                            <Typography.Text>{record.duration}</Typography.Text>
                          </div>
                          <div>
                            <Typography.Text strong>参与人数: </Typography.Text>
                            <Typography.Text>{record.participants}人</Typography.Text>
                          </div>
                          <div>
                            <Typography.Text strong>文件大小: </Typography.Text>
                            <Typography.Text>{record.fileSize}</Typography.Text>
                          </div>
                        </Space>
                      </Col>
                      <Col span={12}>
                        <div>
                          <Typography.Text strong>会议摘要:</Typography.Text>
                          <Typography.Paragraph style={{ marginTop: 8 }}>
                            {record.summary}
                          </Typography.Paragraph>
                        </div>
                        <div>
                          <Typography.Text strong>关键要点:</Typography.Text>
                          <ul style={{ marginTop: 8 }}>
                            {record.keyPoints.map((point, index) => (
                              <li key={index}>
                                <Typography.Text>{point}</Typography.Text>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Col>
                    </Row>
                    <Divider />
                    <Space>
                      <Button type="default" icon={<PlayCircleOutlined />}>播放</Button>
                      <Button type="default">下载</Button>
                      <Button type="default">转录文本</Button>
                      <Button type="default" icon={<ShareAltOutlined />}>分享</Button>
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        );

      case 'analytics':
        return (
          <div>
            <Typography.Title level={3}>会议统计</Typography.Title>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="总会议数"
                    value={analytics.totalMeetings}
                    suffix="场会议"
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="本月会议"
                    value={analytics.thisMonth}
                    suffix="场会议"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="平均时长"
                    value={analytics.averageDuration}
                    suffix="分钟"
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="参与率"
                    value={analytics.participationRate}
                    suffix="%"
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Card>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Card title="会议类型分布">
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Typography.Text>在线会议</Typography.Text>
                      <Typography.Text strong>{analytics.onlineMeetings}</Typography.Text>
                    </div>
                    <Progress percent={75} strokeColor="#52c41a" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Typography.Text>线下会议</Typography.Text>
                      <Typography.Text strong>{analytics.offlineMeetings}</Typography.Text>
                    </div>
                    <Progress percent={25} strokeColor="#1890ff" />
                  </div>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card title="录制情况">
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Typography.Text>已录制</Typography.Text>
                      <Typography.Text strong>{analytics.recordedMeetings}</Typography.Text>
                    </div>
                    <Progress percent={83} strokeColor="#f5222d" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Typography.Text>未录制</Typography.Text>
                      <Typography.Text strong>{analytics.totalMeetings - analytics.recordedMeetings}</Typography.Text>
                    </div>
                    <Progress percent={17} strokeColor="#d9d9d9" />
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        );

      default:
        return null;
    }
  };

  const { Title, Text } = Typography;
  const { Option } = Select;
  const { RangePicker } = DatePicker;

  const tabItems = [
    {
      key: 'meetings',
      label: (
        <span>
          <CalendarOutlined />
          会议列表
        </span>
      ),
      children: renderTabContent()
    },
    {
      key: 'create',
      label: (
        <span>
          <UserOutlined />
          创建会议
        </span>
      ),
      children: renderTabContent()
    },
    {
      key: 'live',
      label: (
        <span>
          <VideoCameraOutlined />
          实时会议
        </span>
      ),
      children: renderTabContent()
    },
    {
      key: 'records',
      label: (
        <span>
          <PlayCircleOutlined />
          会议录像
        </span>
      ),
      children: renderTabContent()
    },
    {
      key: 'analytics',
      label: (
        <span>
          <SettingOutlined />
          统计分析
        </span>
      ),
      children: renderTabContent()
    }
  ];

  return (
    <div className="meeting-center">
      <div className="meeting-header" style={{ marginBottom: 24 }}>
        <Title level={2}>会议中心</Title>
        <Text type="secondary">虚拟会议与研讨平台</Text>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />

      {/* 会议详情模态框 */}
      {showMeetingDetail && selectedMeeting && (
        <div className="meeting-detail-modal" onClick={closeMeetingDetail}>
          <div className="meeting-detail-content" onClick={(e) => e.stopPropagation()}>
            <div className="meeting-detail-header">
              <h3>{selectedMeeting.title}</h3>
              <button className="close-btn" onClick={closeMeetingDetail}>×</button>
            </div>
            <div className="meeting-detail-body">
              <div className="detail-section">
                <h4>基本信息</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>会议类型:</label>
                    <span style={{ color: getMeetingTypeColor(selectedMeeting.type) }}>
                      {selectedMeeting.type}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>会议状态:</label>
                    <span style={{ color: getStatusColor(selectedMeeting.status) }}>
                      {selectedMeeting.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>组织者:</label>
                    <span>{selectedMeeting.organizer}</span>
                  </div>
                  <div className="detail-item">
                    <label>会议室:</label>
                    <span>{selectedMeeting.meetingRoom}</span>
                  </div>
                  <div className="detail-item">
                    <label>开始时间:</label>
                    <span>{selectedMeeting.startTime}</span>
                  </div>
                  <div className="detail-item">
                    <label>结束时间:</label>
                    <span>{selectedMeeting.endTime}</span>
                  </div>
                  <div className="detail-item">
                    <label>参与人数:</label>
                    <span>{selectedMeeting.attendanceCount}/{selectedMeeting.totalInvited}人</span>
                  </div>
                  <div className="detail-item">
                    <label>会议形式:</label>
                    <span>{selectedMeeting.isOnline ? '在线会议' : '线下会议'}</span>
                  </div>
                  <div className="detail-item">
                    <label>录制状态:</label>
                    <span>{selectedMeeting.recordingEnabled ? '已开启录制' : '未开启录制'}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h4>会议议程</h4>
                <p className="agenda-text">{selectedMeeting.agenda}</p>
              </div>
              
              <div className="detail-section">
                <h4>参与人员</h4>
                <div className="participants-list">
                  {Array.isArray(selectedMeeting.participants) ? 
                    selectedMeeting.participants.map((participant, index) => (
                      <span key={index} className="participant-tag">{participant}</span>
                    )) : 
                    <span className="participant-tag">{selectedMeeting.participants}</span>
                  }
                </div>
              </div>
            </div>
            <div className="meeting-detail-footer">
              {selectedMeeting.status === '进行中' && (
                <button 
                  onClick={() => {
                    handleJoinMeeting(selectedMeeting);
                    closeMeetingDetail();
                  }}
                  className="join-btn"
                >
                  加入会议
                </button>
              )}
              {selectedMeeting.status === '即将开始' && (
                <button 
                  className="prepare-btn"
                  onClick={() => {
                    handlePrepareMeeting(selectedMeeting);
                    closeMeetingDetail();
                  }}
                >
                  准备会议
                </button>
              )}
              {selectedMeeting.status === '已结束' && (
                <button 
                  className="view-record-btn"
                  onClick={() => {
                    handleViewRecording(selectedMeeting);
                    closeMeetingDetail();
                  }}
                >
                  查看录像
                </button>
              )}
              <button 
                className="edit-btn"
                onClick={() => {
                  handleEditMeeting(selectedMeeting);
                  closeMeetingDetail();
                }}
              >
                编辑会议
              </button>
              <button className="cancel-btn" onClick={closeMeetingDetail}>关闭</button>
            </div>
          </div>
        </div>
      )}
      
      {/* 编辑会议模态框 */}
      {showEditModal && editingMeeting && (
        <div className="edit-meeting-modal" onClick={closeEditModal}>
          <div className="edit-meeting-content" onClick={(e) => e.stopPropagation()}>
            <div className="edit-meeting-header">
              <h3>编辑会议</h3>
              <button className="close-btn" onClick={closeEditModal}>×</button>
            </div>
            <div className="edit-meeting-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>会议标题</label>
                  <input
                    type="text"
                    value={editingMeeting.title}
                    onChange={(e) => setEditingMeeting({...editingMeeting, title: e.target.value})}
                    placeholder="请输入会议标题"
                  />
                </div>
                <div className="form-group">
                  <label>会议类型</label>
                  <select
                    value={editingMeeting.type}
                    onChange={(e) => setEditingMeeting({...editingMeeting, type: e.target.value})}
                  >
                    <option value="教研会议">教研会议</option>
                    <option value="学术研讨">学术研讨</option>
                    <option value="工作交流">工作交流</option>
                    <option value="培训会议">培训会议</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>组织者</label>
                  <input
                    type="text"
                    value={editingMeeting.organizer}
                    onChange={(e) => setEditingMeeting({...editingMeeting, organizer: e.target.value})}
                    placeholder="请输入组织者"
                  />
                </div>
                <div className="form-group">
                  <label>会议室</label>
                  <input
                    type="text"
                    value={editingMeeting.meetingRoom}
                    onChange={(e) => setEditingMeeting({...editingMeeting, meetingRoom: e.target.value})}
                    placeholder="请输入会议室"
                  />
                </div>
                <div className="form-group">
                  <label>开始时间</label>
                  <input
                    type="datetime-local"
                    value={editingMeeting.startTime.replace(' ', 'T')}
                    onChange={(e) => setEditingMeeting({...editingMeeting, startTime: e.target.value.replace('T', ' ')})}
                  />
                </div>
                <div className="form-group">
                  <label>结束时间</label>
                  <input
                    type="datetime-local"
                    value={editingMeeting.endTime.replace(' ', 'T')}
                    onChange={(e) => setEditingMeeting({...editingMeeting, endTime: e.target.value.replace('T', ' ')})}
                  />
                </div>
                <div className="form-group">
                  <label>会议状态</label>
                  <select
                    value={editingMeeting.status}
                    onChange={(e) => setEditingMeeting({...editingMeeting, status: e.target.value})}
                  >
                    <option value="即将开始">即将开始</option>
                    <option value="进行中">进行中</option>
                    <option value="已结束">已结束</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>总邀请人数</label>
                  <input
                    type="number"
                    value={editingMeeting.totalInvited}
                    onChange={(e) => setEditingMeeting({...editingMeeting, totalInvited: parseInt(e.target.value) || 0})}
                    placeholder="请输入总邀请人数"
                  />
                </div>
                <div className="form-group full-width">
                  <label>参与人员</label>
                  <input
                    type="text"
                    value={editingMeeting.participants}
                    onChange={(e) => setEditingMeeting({...editingMeeting, participants: e.target.value})}
                    placeholder="请输入参与人员，用逗号分隔"
                  />
                </div>
                <div className="form-group full-width">
                  <label>会议议程</label>
                  <textarea
                    value={editingMeeting.agenda}
                    onChange={(e) => setEditingMeeting({...editingMeeting, agenda: e.target.value})}
                    placeholder="请输入会议议程"
                    rows="3"
                  />
                </div>
                <div className="form-group full-width">
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={editingMeeting.isOnline}
                        onChange={(e) => setEditingMeeting({...editingMeeting, isOnline: e.target.checked})}
                      />
                      在线会议
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={editingMeeting.recordingEnabled}
                        onChange={(e) => setEditingMeeting({...editingMeeting, recordingEnabled: e.target.checked})}
                      />
                      开启录制
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="edit-meeting-footer">
              <button onClick={handleUpdateMeeting} className="update-meeting-btn">
                更新会议
              </button>
              <button onClick={closeEditModal} className="cancel-btn">
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingCenter;