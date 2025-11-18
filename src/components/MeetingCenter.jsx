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
  Dropdown,
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
  Slider,
  message,
  Popover
} from 'antd';
import { 
  VideoCameraOutlined, 
  AudioOutlined, 
  ShareAltOutlined, 
  MenuOutlined, 
  MessageOutlined, 
  SettingOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  InfoCircleOutlined,
  TeamOutlined, 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  StopOutlined,
  SearchOutlined,
  DownOutlined,
  LikeOutlined,
  PushpinOutlined,
  SafetyOutlined,
  MoreOutlined,
  TranslationOutlined,
  PhoneOutlined,
  LockOutlined,
  CloseOutlined,
  FullscreenOutlined,
  FileTextOutlined,
  
} from '@ant-design/icons';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './MeetingCenter.css';

const MeetingCenter = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('meetings');
  const [startMeetingOpen, setStartMeetingOpen] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('张洪磊的视频会议');
  const [inMeetingOpen, setInMeetingOpen] = useState(false);
  const [aiSummaryOn, setAiSummaryOn] = useState(false);
  const [showAIView, setShowAIView] = useState(true);
  const [showParticipantsPanel, setShowParticipantsPanel] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [currentCaption, setCurrentCaption] = useState('be bay.');
  const [showCaptionsPanel, setShowCaptionsPanel] = useState(false);
  const [historySelected, setHistorySelected] = useState(null);
  const [participantsExpanded, setParticipantsExpanded] = useState(false);
  const [recordingOpen, setRecordingOpen] = useState(false);
  const [meetings, setMeetings] = useState([
    {
      id: 101,
      title: '数学教研组周例会',
      type: '教研会议',
      organizer: '教研处',
      participants: ['张老师','李老师','王老师','陈老师','刘老师'],
      startTime: '2025-11-16 09:30',
      endTime: '2025-11-16 11:00',
      status: '进行中',
      agenda: '期末复习策略与课堂教学改进',
      meetingRoom: '在线会议室',
      isOnline: true,
      recordingEnabled: true,
      attendanceCount: 12,
      totalInvited: 15
    },
    {
      id: 102,
      title: '信息技术应用培训',
      type: '培训会议',
      organizer: '信息中心',
      participants: ['全体教师'],
      startTime: '2025-11-17 14:00',
      endTime: '2025-11-17 15:30',
      status: '即将开始',
      agenda: '智慧教室设备与在线平台操作',
      meetingRoom: '多功能厅',
      isOnline: false,
      recordingEnabled: true,
      attendanceCount: 0,
      totalInvited: 60
    },
    {
      id: 103,
      title: '班主任工作协调会（音频）',
      type: '工作交流',
      organizer: '德育处',
      participants: ['各班班主任'],
      startTime: '2025-11-14 16:00',
      endTime: '2025-11-14 17:00',
      status: '已结束',
      agenda: '学生管理、家校沟通与心理辅导',
      meetingRoom: '在线会议室',
      isOnline: true,
      recordingEnabled: true,
      attendanceCount: 24,
      totalInvited: 30
    },
    {
      id: 104,
      title: '新课标实施研讨',
      type: '学术研讨',
      organizer: '教务处',
      participants: ['学科负责人','骨干教师'],
      startTime: '2025-11-20 09:00',
      endTime: '2025-11-20 11:30',
      status: '即将开始',
      agenda: '新课程标准导入与课堂案例分享',
      meetingRoom: '会议室A',
      isOnline: false,
      recordingEnabled: true,
      attendanceCount: 0,
      totalInvited: 25
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
      id: 201,
      meetingId: 103,
      title: '班主任工作协调会（音频）',
      date: '2025-11-14',
      duration: '60分钟',
      recordingUrl: '/recordings/meeting_103.m4a',
      transcriptUrl: '/transcripts/meeting_103.txt',
      summary: '交流班级管理策略与家校沟通方法，提出心理辅导注意事项与跟进计划。',
      keyPoints: ['班级规则共识与执行','重点学生个案跟进','家校沟通渠道优化'],
      participants: 24,
      fileSize: '128MB'
    },
    {
      id: 202,
      meetingId: 101,
      title: '数学教研组周例会',
      date: '2025-11-09',
      duration: '90分钟',
      recordingUrl: '/recordings/meeting_101.mp4',
      transcriptUrl: '/transcripts/meeting_101.txt',
      summary: '确定期末复习重点，优化课堂练习与作业设计。',
      keyPoints: ['核心知识点清单','分层作业布置','学困生辅导计划'],
      participants: 12,
      fileSize: '320MB'
    },
    {
      id: 203,
      meetingId: 102,
      title: '信息技术应用培训',
      date: '2025-11-01',
      duration: '75分钟',
      recordingUrl: '/recordings/meeting_102.mp4',
      transcriptUrl: '/transcripts/meeting_102.txt',
      summary: '演示智慧教室设备使用与在线教学平台操作流程。',
      keyPoints: ['设备连接与调试','平台功能与权限','课堂互动与数据统计'],
      participants: 58,
      fileSize: '280MB'
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
      <div className="meeting-layout">
        <div className="left-panel">
          <div className="left-header">
            <div className="left-title">视频会议</div>
            <Space>
              <Button type="text" icon={<SearchOutlined />} />
              <Button type="text" icon={<SettingOutlined />} />
            </Space>
          </div>
          <div className="tile-grid">
            {[
              { key: 'start', label: '发起会议', icon: <VideoCameraOutlined />, color: '#6C8EF2' },
              { key: 'join', label: '加入会议', icon: <UserOutlined />, color: '#58B2A3' },
              { key: 'notes', label: '妙记', icon: <SettingOutlined />, color: '#6C8EF2' },
              { key: 'summary', label: '智能纪要', icon: <MessageOutlined />, color: '#A0B2FF' }
            ].map(t => (
              <button
                key={t.key}
                className="tile-item"
                onClick={() => {
                  if (t.key === 'start') setStartMeetingOpen(true);
                }}
              >
                <div className="tile-icon" style={{ background: t.color }}>
                  {t.icon}
                </div>
                <div className="tile-text">{t.label}</div>
              </button>
            ))}
          </div>
          <div className="quota-card">
            <div className="quota-header">
              <span className="quota-title">本月智能会议剩余用量</span>
              <Button type="link" size="small">扩容</Button>
            </div>
            <div className="quota-item">
              <span>智能纪要</span>
              <Tag color="red">已用尽</Tag>
            </div>
            <div className="quota-subheader">
              <span>语音转文字</span>
              <span>300 / 300 分钟</span>
            </div>
            <Progress percent={100} showInfo={false} />
          </div>
        </div>
        <div className="main-panel">
          <Card className="banner">
            <div className="banner-content">
              <div className="banner-left">
                <div className="banner-icon"><MenuOutlined /></div>
                <div className="banner-text">
                  <div className="banner-title">智能生成纪要，快速沉淀关键信息</div>
                  <div className="banner-subtitle">全新：上传与复盘功能，支持上传文件生成智能纪要，提炼要点，待办与关键结论</div>
                </div>
              </div>
              <div className="banner-actions">
                <Button type="primary" shape="round" icon={<UploadOutlined />}>立即上传</Button>
                <Button type="primary" shape="round" icon={<AudioOutlined />}>录音</Button>
              </div>
            </div>
          </Card>
          <Card className="section-card" title="即将开始" extra={<Button type="link">在日历中查看全部</Button>}>
            <List
              dataSource={[
                { id: 1, title: '信息技术应用培训', date: '11月17日', time: '14:00 - 15:30', idText: 'ID: 730 111 222' },
                { id: 2, title: '新课标实施研讨', date: '11月20日', time: '09:00 - 11:30', idText: 'ID: 905 876 543' },
                { id: 3, title: '教研组晨会（音频）', date: '11月18日', time: '08:30 - 09:00', idText: 'ID: 801 234 567' }
              ]}
              renderItem={m => (
                <List.Item>
                  <div className="upcoming-item">
                    <div className="list-icon"><VideoCameraOutlined /></div>
                    <div className="upcoming-content">
                      <div className="upcoming-title">{m.title}</div>
                      <div className="upcoming-meta">
                        <span>{m.date} {m.time}</span>
                        <span>{m.idText}</span>
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
          <Card className="section-card" title="历史记录">
            {(() => {
              const historyData = [
                { id: 'h3', type: 'video', title: '6.0产品的视频会议', time: '2024年9月3日 16:27',
                  dateText: '2024年9月3日（周二）', rangeText: '15:44 - 16:02', durationText: '18分29秒',
                  meetingId: '935 177 719',
                  participants: ['守','宝','张','李','王'],
                  participantsFull: ['盈守宝','张洪磊','李明','王芳','赵强','陈伟','刘洁'],
                  recording: { title: '6.0产品的视频会议', owner: '盈守宝' },
                  ownerName: 'AJ',
                  createdText: '2024年5月10日 下午8:01',
                  summaryTitle: '5月10日 罗文分享「夸学校闪活动」 AI Agent篇 认识插件',
                  events: [
                    { t: '16:02', label: '离开会议' },
                    { t: '15:45', label: '加入会议' }
                  ]
                },
                { id: 'h4', type: 'phone', title: '班主任工作答疑（音频）', time: '2025年11月14日 17:30',
                  dateText: '2025年11月14日（周五）', rangeText: '17:30 - 18:10', durationText: '40分00秒',
                  meetingId: '801 234 567',
                  participants: ['班','主','任','李','王'],
                  participantsFull: ['德育处','一中班主任群','李明','王芳','赵强'],
                  recording: { title: '班主任工作答疑（音频）', owner: '德育处' },
                  ownerName: '德育处',
                  createdText: '2025年11月14日 下午5:28',
                  summaryTitle: '班主任工作问答与跟进事项',
                  events: [
                    { t: '18:10', label: '结束答疑' },
                    { t: '17:30', label: '开始答疑' }
                  ]
                },
                { id: 'h5', type: 'video', title: '信息技术应用培训（视频）', time: '2025年11月01日 15:00',
                  dateText: '2025年11月1日（周六）', rangeText: '15:00 - 16:15', durationText: '1时15分',
                  meetingId: '730 111 222',
                  participants: ['信','息','中','心'],
                  participantsFull: ['信息中心','张洪磊','技术支持团队'],
                  recording: { title: '信息技术应用培训（视频）', owner: '信息中心' },
                  ownerName: '信息中心',
                  createdText: '2025年11月01日 下午3:00',
                  summaryTitle: '智慧教室设备与平台使用要点',
                  events: [
                    { t: '16:15', label: '结束培训' },
                    { t: '15:00', label: '开始培训' }
                  ]
                },
                { id: 'h6', type: 'phone', title: '教研组晨会（音频）', time: '2025年11月18日 08:30',
                  dateText: '2025年11月18日（周二）', rangeText: '08:30 - 09:00', durationText: '30分00秒',
                  meetingId: '900 555 321',
                  participants: ['教','研','组'],
                  participantsFull: ['教研处','数学组','语文组','英语组'],
                  recording: { title: '教研组晨会（音频）', owner: '教研处' },
                  ownerName: '教研处',
                  createdText: '2025年11月18日 上午8:00',
                  summaryTitle: '本周教学安排与复习要点',
                  events: [
                    { t: '09:00', label: '结束晨会' },
                    { t: '08:30', label: '开始晨会' }
                  ]
                }
              ];
              return (
                <List
                  dataSource={historyData}
                  renderItem={item => (
                    <List.Item onClick={() => setHistorySelected(item)}>
                      <div className={`history-item${historySelected?.id === item.id ? ' selected' : ''}`}>
                        <div className="history-icon">
                          {item.type === 'phone' ? <AudioOutlined /> : <VideoCameraOutlined />}
                        </div>
                        <div className="history-content">
                          <div className={`history-title${item.danger ? ' danger' : ''}`}>{item.title}</div>
                          <div className="history-time">{item.time}</div>
                          {Array.isArray(item.links) && item.links.length > 0 && (
                            <div className="history-links">
                              {item.links.map((l, idx) => (
                                <a key={idx} className="history-link">{l}</a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              );
            })()}
          </Card>
        </div>
      </div>

      {historySelected && historySelected.type === 'video' && (
        <div className="record-detail-panel">
          <div className="record-detail-header">
            <div className="record-detail-title">{historySelected.title}</div>
            <Button type="text" icon={<CloseOutlined />} onClick={() => setHistorySelected(null)} />
          </div>
          <div className="record-detail-body">
            <div className="history-detail-card">
              <div className="detail-row">
                <ClockCircleOutlined className="detail-icon" />
                <span className="detail-text">{historySelected.dateText}  {historySelected.rangeText}  |  {historySelected.durationText}</span>
              </div>
              <div className="detail-row">
                <InfoCircleOutlined className="detail-icon" />
                <span className="detail-text">会议 ID：{historySelected.meetingId}</span>
              </div>
              <Popover
                overlayClassName="participants-popover"
                placement="bottomLeft"
                open={participantsExpanded}
                content={(
                  <div className="pp-list">
                    <div className="pp-item">
                      <span className="pp-chip">守宝</span>
                      <span className="pp-name">盈守宝</span>
                      <span className="pp-role">发起人</span>
                    </div>
                    {(historySelected.participantsFull || historySelected.participants || []).slice(1).map((name, idx) => (
                      <div key={idx} className="pp-item">
                        <Avatar size={28} style={{ background: '#e6f0ff', color: '#1f2937' }}>{name[0]}</Avatar>
                        <span className="pp-name">{name}</span>
                      </div>
                    ))}
                  </div>
                )}
              >
                <div className="detail-row participants-row" onClick={() => setParticipantsExpanded(v => !v)}>
                  <TeamOutlined className="detail-icon" />
                  <div className="avatar-list">
                    {(historySelected.participants || []).map((p, idx) => (
                      <Avatar key={idx} size={28}>{p}</Avatar>
                    ))}
                  </div>
                </div>
              </Popover>
            </div>
            <div className="recording-header">录制文件（妙记）</div>
            <div className="recording-item" onClick={() => setRecordingOpen(true)}>
              <div className="recording-thumb">
                <div className="recording-lock"><LockOutlined /></div>
                <div className="recording-watermark">w</div>
              </div>
              <div className="recording-info">
                <div className="recording-title">{historySelected.recording?.title}</div>
                <div className="recording-sub">所有者：{historySelected.recording?.owner}</div>
              </div>
            </div>
            <div className="timeline-date">{historySelected.dateText}</div>
            <div className="timeline-list">
              {(historySelected.events || []).map((ev, idx) => (
                <div key={idx} className="timeline-row">
                  <div className="timeline-time">{ev.t}</div>
                  <div className="timeline-label">{ev.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {recordingOpen && historySelected && (
        <div className="recording-overlay">
          <div className="recording-overlay-header">
            <div className="overlay-title">{historySelected.recording?.title || historySelected.title}</div>
            <Space>
              <Button type="default" icon={<ShareAltOutlined />}>分享</Button>
              <Button type="text" icon={<CloseOutlined />} onClick={() => setRecordingOpen(false)} />
            </Space>
          </div>
          <div className="recording-overlay-body">
            <div className="recording-left">
              <div className="left-top">
                <div className="recording-player">
                  <div className="player-watermark">w</div>
                  <div className="player-center">
                    <PlayCircleOutlined />
                  </div>
                  <div className="player-controls">
                    <Space>
                      <Button type="text" icon={<PlayCircleOutlined />} />
                      <Button type="text" icon={<PauseCircleOutlined />} />
                      <Button type="text" icon={<StopOutlined />} />
                    </Space>
                    <div className="progress-bar"><div className="progress-fill" /></div>
                    <div className="time-text">00:00 / {historySelected.durationText || '00:00'}</div>
                  </div>
                </div>
              </div>
              <div className="left-bottom">
                <Tabs
                  items={[
                    {
                      key: 'speakers',
                      label: `发言人(${(historySelected.participantsFull || []).length})`,
                      children: (
                        <div className="speaker-table">
                          {((historySelected.participantsFull || [])).map((name, idx) => {
                            const percents = [84, 14, 7, 3, 2, 1, 1, 1, 1];
                            const percent = percents[idx] || 1;
                            const colors = ['#5b8def','#22c55e','#8b5cf6','#f59e0b','#06b6d4','#ef4444','#a855f7','#10b981','#3b82f6'];
                            const color = colors[idx % colors.length];
                            const segmentCount = Math.max(2, Math.min(10, Math.round(percent / 10)));
                            const segments = Array.from({ length: segmentCount }).map((_, j) => {
                              const base = (j + 1) * (100 / (segmentCount + 1));
                              const jitter = ((idx * 13 + j * 7) % 10) - 5;
                              let left = Math.max(1, Math.min(99, base + jitter));
                              const width = Math.max(4, Math.min(18, Math.round(percent * 0.12) + (j % 5)));
                              left = Math.max(1, Math.min(99 - width, left));
                              return { left, width };
                            });
                            return (
                              <div key={idx} className="speaker-row">
                                <div className="speaker-id">
                                  <Avatar size={28} style={{ background: '#eef2ff', color: '#1f2937' }}>{name[0]}</Avatar>
                                  <div className="speaker-meta">
                                    <div className="speaker-name">{name}</div>
                                    <div className="speaker-percent">{percent}%</div>
                                  </div>
                                </div>
                                <div className="speaker-track">
                                  <div className="speaker-line" />
                                  {segments.map((s, j) => (
                                    <span key={j} className="speaker-block" style={{ left: `${s.left}%`, width: `${s.width}%`, background: color }} />
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )
                    },
                    {
                      key: 'meeting',
                      label: '会议信息',
                      children: (
                        <div className="meeting-info">
                          <div className="info-row">
                            <div className="info-label">所有者</div>
                            <div className="info-value">
                              <Avatar size={28} style={{ background: '#f0f3ff', color: '#1f2937' }}>{(historySelected.ownerName || historySelected.recording?.owner || 'A')[0]}</Avatar>
                              <span className="info-name">{historySelected.ownerName || historySelected.recording?.owner}</span>
                            </div>
                          </div>
                          <div className="info-row">
                            <div className="info-label">创建时间</div>
                            <div className="info-value">{historySelected.createdText || historySelected.dateText}</div>
                          </div>
                          <div className="info-row">
                            <div className="info-label">会议纪要</div>
                            <div className="info-value">
                              <FileTextOutlined className="info-icon" />
                              <a className="info-link">{historySelected.summaryTitle || (historySelected.recording?.title || historySelected.title)}</a>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  ]}
                />
              </div>
            </div>
            <div className="recording-side">
              <Tabs
                className="side-tabs"
                items={[
                  {
                    key: 'smart',
                    label: '智能纪要',
                    children: (
                      <div className="smart-summary">
                        <div className="smart-block">
                          <div className="smart-desc">会议讨论了 AI 工具的使用方法、工具流和工作效率的改进，以及如何使用 voagi 和 AI agent 智能体的相关问题，主要内容包括：</div>
                          <ol className="smart-list-numbered">
                            <li>罗文介绍了使用插件的方式、如何使用工具、插件的安装、如何使用集体标示和提醒需遵守等。</li>
                            <li>讨论了如何使用工作流和工具提高工作效率，包含了使用屏幕录入和操作的方式、流程的创建副本、设置可编辑权限、调阅稽核等操作。</li>
                            <li>还讨论了如何使用 voagi，以及 AI agent 智能体的相关问题，包含 host 暂留目录位置，以及如何找到知识和活动的获取等。</li>
                          </ol>
                          <div className="smart-checks">
                            {[
                              { text: '罗文将插件文档链接发送到群里', t: '00:24:00' },
                              { text: '大圣整理会中的同学发言截图', t: '00:49:04' },
                              { text: '罗文发送总结地址', t: '01:10:12' },
                              { text: 'AJ将插件中的一份到voagi的知识库', t: '02:01:37' }
                            ].map((row, idx) => (
                              <div key={idx} className="smart-check-row">
                                <div className="smart-check">
                                  <span className="check-box" />
                                  <span className="check-text">{row.text}</span>
                                </div>
                                <div className="smart-right">
                                  <div className="smart-time">{row.t}</div>
                                  <Tooltip title="查看原文">
                                    <div className="smart-action"><FileTextOutlined /></div>
                                  </Tooltip>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="smart-block">
                          <div className="smart-title">章节纪要</div>
                          <div className="chapter-list">
                            {[
                              { t: '00:00:00', title: '罗文分享如何使用插件一键生成标题', text: '讨论了插件自动生成标题、标签、并分析了团队内的首标题的特点。随后，还提到了敦促分享插件的使用方法。' },
                              { t: '00:02:23', title: '罗文分享使用插件替换智能体的方式与流程', text: '介绍了如何使用插件替换智能体的方式与流程，包含自我介绍、产品经历以及个人经验分享。' },
                              { t: '00:05:48', title: '罗文分享 AI 智能体的用法及相关设置和调阅', text: '介绍了 AI 工具的使用方法，如何利用 AI 工具提高团队以及个人的知识库内容。演示了如何使用 AI 工具执行“文档梳理、标签、分类与解析、翻译、编辑”等操作。' },
                              { t: '00:18:30', title: '罗文讲解了智能体的定义、方法设定和示范', text: '展示了如何设置智能体和方法，包含方法论配置和流程图的示范。' },
                              { t: '00:26:10', title: '如何使用插件提升工作效率', text: '分享如何使用插件提升工作效率，包含示例、流程与规范。' },
                              { t: '00:42:44', title: '如何快速了解插件的用途及使用的因素', text: '通过快速了解插件的用途和使用的因素，介绍插件“发送这个是做什么”，可以编辑并添加内容。' }
                            ].map((c, idx) => (
                              <div key={idx} className="chapter-item">
                                <div className="chapter-left">{c.t}</div>
                                <div className="chapter-center"><span className="chapter-dot" /></div>
                                <div className="chapter-right">
                                  <div className="chapter-title">{c.title}</div>
                                  <div className="chapter-text">{c.text}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  },
                  {
                    key: 'text',
                    label: '文字记录',
                    children: (
                      <div className="transcript-page">
                        <div className="transcript-toolbar">
                          <Input prefix={<SearchOutlined />} placeholder="搜索" allowClear />
                        </div>
                        <div className="transcript-list">
                          {[
                            { time: '00:48:52', name: '罗文', color: '#ef4444', text: '你看我的工作清晰度会详增了，所以说我只是举个例子，大家，实际上我们可以做个回顾？谁谁，要不要做个回顾？就是一个多维框架，现在同时间人在糅。' },
                            { time: '00:49:06', name: 'A小J', color: '#f59e0b', text: '我已经好了，刚才就在做。' },
                            { time: '00:49:10', name: '罗文', color: '#ef4444', text: '哈哈，可以从这些同学节奏再看一下。' },
                            { time: '00:49:13', name: '大圣', color: '#3b82f6', text: '给他们供使用，加入一个。' },
                            { time: '00:49:15', name: '罗文', color: '#ef4444', text: '对，看着有节吗慢，确有个从就是那场，你看他也还是有人从聊聊 开开完，我不会这么传啊，OK，先列举在上面的问题的，我还有输出自填式更现实分享啊。你或是讲讲什么，什么时候，对吧 这个就配合到那个小标其实某某是一样的，有时候你不该满足标准，他按照自己的边的标准，我们不应该必须要实现这个了，所以说我们要到列对说的这个，理在意，就是我大家尽量把这一下，因为人为弱势，这个没办法这个方法。安住没有办法哈。' },
                            { time: '00:50:12', name: '罗文', color: '#ef4444', text: '那重置做的内容，重置的就查扣一下，准备化了。' },
                            { time: '00:50:49', name: 'A小J', color: '#f59e0b', text: '没事，我觉得你要想的对象就选一下就好。' },
                            { time: '00:51:49', name: '罗文', color: '#ef4444', text: '嗯，罗文取个大标题，顺个和句子再帮写个下，把它改下一下，后台的小伙伴我说我们没次下。哈哈哈。' },
                            { time: '00:52:16', name: '大圣', color: '#3b82f6', text: 'ha ha，我差不多也要。' },
                            { time: '00:52:46', name: '罗文', color: '#ef4444', text: '好，大家有没有提写完的问号？' }
                          ].map((m, idx) => (
                            <div key={idx} className="transcript-item">
                              <div className="trans-left">
                                <Avatar size={32} style={{ backgroundColor: m.color }}>{m.name[0]}</Avatar>
                              </div>
                              <div className="trans-content">
                                <div className="trans-head">
                                  <span className="trans-name">{m.name}</span>
                                  <span className="trans-time">{m.time}</span>
                                </div>
                                <div className="trans-text">{m.text}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  }
                ]}
              />
            </div>
          </div>
        </div>
      )}

      <Modal
        open={startMeetingOpen}
        onCancel={() => setStartMeetingOpen(false)}
        footer={null}
        width={880}
        closable={false}
        className="start-meeting-modal"
      >
        <div className="start-meeting-title">
          <Input
            className="meeting-title-input"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            bordered={false}
            spellCheck={false}
            size="large"
          />
        </div>
        <div className="preview-area">
          <button className="preview-settings"><SettingOutlined /></button>
          <div
            className="avatar-circle"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=600&auto=format&fit=crop)'
            }}
          />
        </div>
        <div className="controls-bar">
          <div className="controls-left">
            <Button icon={<AudioOutlined style={{ color: '#ff4d4f' }} />}>麦克风 <DownOutlined /></Button>
            <Button icon={<VideoCameraOutlined style={{ color: '#ff4d4f' }} />}>摄像头 <DownOutlined /></Button>
          </div>
          <div className="controls-volume">
            <AudioOutlined />
            <Slider style={{ width: 220 }} />
            <DownOutlined />
          </div>
          <div className="controls-right">
            <Button
              type="primary"
              size="large"
              shape="round"
              onClick={() => { setStartMeetingOpen(false); setInMeetingOpen(true); }}
            >
              开始会议
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={inMeetingOpen}
        onCancel={() => setInMeetingOpen(false)}
        footer={null}
        width={'95vw'}
        closable={false}
        className="in-meeting-modal"
      >
        <div className="meeting-topbar">
          <div className="topbar-left">
            <span className="meeting-name">{meetingTitle}</span>
            <span className="meeting-time">00:17（60 分钟）</span>
            <span className="signal">▮▮▮</span>
          </div>
          <div className="topbar-right">田 常用</div>
        </div>
        <div className="meeting-main" style={{ gridTemplateColumns: (showParticipantsPanel || showCaptionsPanel) ? (showAIView ? '1fr 1fr 320px' : '1fr 320px') : (showAIView ? '1fr 1fr' : '1fr') }}>
          {showAIView && (
          <div className="ai-card">
            <div className="ai-card-actions">
              <Button className="ai-action-btn" icon={<FullscreenOutlined />} />
              <Button className="ai-action-btn" icon={<MoreOutlined />} />
            </div>
            <div className="ai-mind">
              <div className="ai-center-line"></div>
              <div className="branch primary">会议主题一</div>
              <div className="branch light"></div>
              <div className="branch light"></div>
              <div className="branch secondary">会议主题二</div>
              <div className="branch light"></div>
              <div className="branch light"></div>
            </div>
            <div className="ai-card-label">AI 视图</div>
          </div>
          )}
          <div className="preview-card">
            <div
              className="avatar-octagon"
              style={{
                backgroundImage:
                  'url(https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=600&auto=format&fit=crop)'
              }}
            />
            <div className="preview-name"><AudioOutlined style={{ color: '#ff4d4f' }} /> 张洪磊（我）</div>
          </div>
          {showParticipantsPanel && (
            <div className="participants-panel">
              <div className="pp-header">
                <div className="pp-title">参会人</div>
                <Space>
                  <Button type="text" icon={<UserOutlined />} />
                  <Button type="text" icon={<MoreOutlined />} />
                  <Button type="text" icon={<CloseOutlined />} onClick={() => setShowParticipantsPanel(false)} />
                </Space>
              </div>
              <div className="pp-search">
                <Input prefix={<SearchOutlined />} placeholder="搜索或呼叫" allowClear />
                <Button>邀请</Button>
              </div>
              <div className="pp-tabs">
                <Button type="link" className="active">全部 (1)</Button>
                <Button type="link">建议参会 (0)</Button>
              </div>
              <div className="pp-list">
                <div className="pp-item">
                  <Avatar size={28} style={{ background: '#eef2ff', color: '#1f2937' }}>张</Avatar>
                  <div className="pp-info">
                    <div className="pp-name">张洪磊 <span className="pp-me">我</span></div>
                    <div className="pp-role">主持人</div>
                  </div>
                  <Space className="pp-status">
                    <AudioOutlined style={{ color: '#ff4d4f' }} />
                    <VideoCameraOutlined style={{ color: '#ff4d4f' }} />
                  </Space>
                </div>
              </div>
              <div className="pp-actions">
                <Button>全员静音</Button>
                <Button>请求全员开麦</Button>
              </div>
            </div>
          )}
          {showCaptionsPanel && (
            <div className="captions-panel">
              <div className="cp-header">
                <div className="cp-title">字幕</div>
                <Space>
                  <Button type="text" icon={<MoreOutlined />} />
                  <Button type="text" icon={<CloseOutlined />} onClick={() => setShowCaptionsPanel(false)} />
                </Space>
              </div>
              <div className="cp-search">
                <Input prefix={<SearchOutlined />} placeholder="搜索" allowClear />
              </div>
              <div className="cp-list">
                {[
                  { time: '09:22:45', name: '张洪磊', text: '这个点在市办一个专家的这个部门，知道吗？然后这个是相的问题。' }
                ].map((l, idx) => (
                  <div key={idx} className="cp-item">
                    <Avatar size={24} style={{ background: '#eef2ff', color: '#1f2937' }}>{l.name[0]}</Avatar>
                    <div className="cp-content">
                      <div className="cp-head">
                        <span className="cp-name">{l.name}</span>
                        <span className="cp-time">{l.time}</span>
                      </div>
                      <div className="cp-text">{l.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="meeting-toolbar" style={{ right: (showParticipantsPanel || showCaptionsPanel) ? 336 : 16 }}>
          <div className="toolbar-group left-group">
            <Button className="toolbar-btn" icon={<LikeOutlined />} />
            <Button className="toolbar-btn">OK</Button>
            <Button className="toolbar-btn">+1</Button>
            <Button className="toolbar-btn">@</Button>
            <Button className="toolbar-btn" icon={<PushpinOutlined />} />
          </div>
          <div className="toolbar-group center-group">
            <Button className="toolbar-btn" icon={<AudioOutlined />}>麦克风 <DownOutlined /></Button>
            <span className="toolbar-divider" />
            <Button className="toolbar-btn" icon={<VideoCameraOutlined />}>摄像头 <DownOutlined /></Button>
            <span className="toolbar-divider" />
            <Button className="toolbar-btn" icon={<ShareAltOutlined />}>共享 <DownOutlined /></Button>
            <span className="toolbar-divider" />
            <Button className="toolbar-btn record-btn"><span className="record-dot" /> 录制 <DownOutlined /></Button>
            <div className="toolbar-toggle"><span>AI 总结</span><Switch size="small" checked={aiSummaryOn} onChange={setAiSummaryOn} /></div>
            <Button className="hangup-btn" type="primary" danger shape="round" icon={<PhoneOutlined />} onClick={() => setInMeetingOpen(false)} />
          </div>
          <div className="toolbar-group right-group">
            <Button className="toolbar-btn" icon={<TeamOutlined />} onClick={() => setShowParticipantsPanel(true)}>1 <DownOutlined /></Button>
            <Button className="toolbar-btn" icon={<SafetyOutlined />}>安全</Button>
            <Button className="toolbar-btn" icon={<TranslationOutlined />} onClick={() => { setShowCaptions(true); setShowCaptionsPanel(false); }}>字幕</Button>
            <Dropdown menu={{ items: [{ key: 'close-ai', label: '关闭AI视图' }], onClick: ({ key }) => { if (key === 'close-ai') setShowAIView(false); } }}>
              <Button className="toolbar-btn" icon={<MoreOutlined />} />
            </Dropdown>
          </div>
        </div>
        {showCaptions && (
          <div className="captions-overlay">
            <div className="captions-header">
              <div className="cap-left">
                <Avatar size={24} style={{ background: '#1f2937', color: '#fff' }}>张</Avatar>
                <span className="cap-name">张洪磊</span>
              </div>
              <div className="cap-actions">
                <Tooltip title="查看完整字幕">
                  <div className="cap-icon" onClick={() => { setShowCaptionsPanel(true); setShowParticipantsPanel(false); }}>
                    CC
                  </div>
                </Tooltip>
                <div className="cap-icon">a</div>
                <Button type="text" icon={<MoreOutlined />} />
                <Button type="text" icon={<CloseOutlined />} onClick={() => setShowCaptions(false)} />
              </div>
            </div>
            <div className="captions-text">{currentCaption}</div>
          </div>
        )}
      </Modal>

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