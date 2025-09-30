import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  Button,
  Upload,
  Progress,
  List,
  Tag,
  Space,
  Input,
  Slider,
  Row,
  Col,
  Typography,
  message,
  Modal,
  Tooltip,
  Divider,
  Select,
  InputNumber,
  Switch,
  Alert
} from 'antd';
import {
  UploadOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ScissorOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
  SoundOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import './VideoSlicing.css';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const VideoSlicing = ({ onOperationRecord }) => {
  // 状态管理
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [slices, setSlices] = useState([]);
  const [isSlicing, setIsSlicing] = useState(false);
  const [sliceModalVisible, setSliceModalVisible] = useState(false);
  const [currentSlice, setCurrentSlice] = useState({ start: 0, end: 0, title: '', description: '' });
  const [autoSliceSettings, setAutoSliceSettings] = useState({
    enabled: false,
    duration: 30, // 默认30秒一段
    overlap: 5,   // 重叠5秒
    minDuration: 10 // 最小片段时长
  });
  const [processingProgress, setProcessingProgress] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 视频上传处理
  const handleVideoUpload = (file) => {
    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setSlices([]);
    message.success('视频上传成功');
    return false; // 阻止默认上传行为
  };

  // 视频播放控制
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 时间更新处理
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // 视频加载完成
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // 跳转到指定时间
  const seekTo = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // 格式化时间显示
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 手动添加切片
  const addSlice = () => {
    setCurrentSlice({
      start: currentTime,
      end: Math.min(currentTime + 30, duration),
      title: `片段 ${slices.length + 1}`,
      description: ''
    });
    setSliceModalVisible(true);
  };

  // 保存切片
  const saveSlice = () => {
    if (currentSlice.start >= currentSlice.end) {
      message.error('结束时间必须大于开始时间');
      return;
    }

    const newSlice = {
      id: Date.now(),
      ...currentSlice,
      duration: currentSlice.end - currentSlice.start,
      status: 'pending'
    };

    setSlices(prev => [...prev, newSlice]);
    setSliceModalVisible(false);
    message.success('切片添加成功');

    // 记录操作
    if (onOperationRecord) {
      onOperationRecord('video-slicing', {
        id: Date.now(),
        title: `视频切片：${newSlice.title}`,
        source: '视频切片工具',
        time: '刚刚',
        type: 'video-slicing',
        details: {
          start: newSlice.start,
          end: newSlice.end,
          duration: newSlice.duration
        }
      });
    }
  };

  // 自动切片
  const autoSlice = () => {
    if (!duration) {
      message.error('请先上传视频');
      return;
    }

    setIsSlicing(true);
    setProcessingProgress(0);

    const { duration: sliceDuration, overlap, minDuration } = autoSliceSettings;
    const newSlices = [];
    let start = 0;

    // 模拟处理进度
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      while (start < duration) {
        const end = Math.min(start + sliceDuration, duration);
        
        if (end - start >= minDuration) {
          newSlices.push({
            id: Date.now() + Math.random(),
            start,
            end,
            title: `自动切片 ${newSlices.length + 1}`,
            description: `${formatTime(start)} - ${formatTime(end)}`,
            duration: end - start,
            status: 'completed'
          });
        }

        start = end - overlap;
        if (start >= duration - minDuration) break;
      }

      setSlices(newSlices);
      setProcessingProgress(100);
      setIsSlicing(false);
      message.success(`自动切片完成，共生成 ${newSlices.length} 个片段`);

      // 记录操作
      if (onOperationRecord) {
        onOperationRecord('video-slicing', {
          id: Date.now(),
          title: `自动视频切片 - ${newSlices.length}个片段`,
          source: '视频切片工具',
          time: '刚刚',
          type: 'video-slicing',
          details: {
            totalSlices: newSlices.length,
            totalDuration: duration,
            sliceDuration
          }
        });
      }
    }, 2000);
  };

  // 删除切片
  const deleteSlice = (id) => {
    setSlices(prev => prev.filter(slice => slice.id !== id));
    message.success('切片删除成功');
  };

  // 预览切片
  const previewSlice = (slice) => {
    seekTo(slice.start);
    if (!isPlaying) {
      togglePlay();
    }
  };

  // 导出切片（模拟）
  const exportSlice = (slice) => {
    message.info(`正在导出切片：${slice.title}...`);
    
    // 模拟导出过程
    setTimeout(() => {
      message.success(`切片 "${slice.title}" 导出成功`);
      
      // 更新切片状态
      setSlices(prev => prev.map(s => 
        s.id === slice.id ? { ...s, status: 'exported' } : s
      ));
    }, 1500);
  };

  return (
    <div className="video-slicing-container">
      <Card title={
        <Space>
          <VideoCameraOutlined />
          <span>视频切片工具</span>
        </Space>
      }>
        {/* 视频上传区域 */}
        <div className="upload-section">
          <Upload.Dragger
            accept="video/*"
            beforeUpload={handleVideoUpload}
            showUploadList={false}
            disabled={isSlicing}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽视频文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持 MP4、AVI、MOV 等常见视频格式
            </p>
          </Upload.Dragger>
        </div>

        {/* 视频播放器 */}
        {videoUrl && (
          <div className="video-player-section">
            <div className="video-container">
              <video
                ref={videoRef}
                src={videoUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                style={{ width: '100%', maxHeight: '400px' }}
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            {/* 播放控制 */}
            <div className="player-controls">
              <Row gutter={16} align="middle">
                <Col>
                  <Button
                    type="primary"
                    icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                    onClick={togglePlay}
                  >
                    {isPlaying ? '暂停' : '播放'}
                  </Button>
                </Col>
                <Col flex={1}>
                  <Slider
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={seekTo}
                    tooltip={{ formatter: formatTime }}
                    step={0.1}
                  />
                </Col>
                <Col>
                  <Text>{formatTime(currentTime)} / {formatTime(duration)}</Text>
                </Col>
              </Row>
            </div>

            {/* 切片操作区域 */}
            <Divider />
            <div className="slicing-controls">
              <Row gutter={16}>
                <Col span={12}>
                  <Card size="small" title="手动切片">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Button
                        type="primary"
                        icon={<ScissorOutlined />}
                        onClick={addSlice}
                        block
                        disabled={isSlicing}
                      >
                        添加切片点
                      </Button>
                      <Text type="secondary">
                        当前时间：{formatTime(currentTime)}
                      </Text>
                    </Space>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" title="自动切片">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Row gutter={8}>
                        <Col span={12}>
                          <Text>片段时长(秒):</Text>
                          <InputNumber
                            min={10}
                            max={300}
                            value={autoSliceSettings.duration}
                            onChange={(value) => setAutoSliceSettings(prev => ({ ...prev, duration: value }))}
                            style={{ width: '100%' }}
                          />
                        </Col>
                        <Col span={12}>
                          <Text>重叠时长(秒):</Text>
                          <InputNumber
                            min={0}
                            max={30}
                            value={autoSliceSettings.overlap}
                            onChange={(value) => setAutoSliceSettings(prev => ({ ...prev, overlap: value }))}
                            style={{ width: '100%' }}
                          />
                        </Col>
                      </Row>
                      <Button
                        type="primary"
                        icon={isSlicing ? <LoadingOutlined /> : <SettingOutlined />}
                        onClick={autoSlice}
                        loading={isSlicing}
                        block
                      >
                        {isSlicing ? '处理中...' : '自动切片'}
                      </Button>
                      {isSlicing && (
                        <Progress percent={processingProgress} size="small" />
                      )}
                    </Space>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        )}

        {/* 切片列表 */}
        {slices.length > 0 && (
          <div className="slices-section">
            <Divider />
            <Title level={4}>切片列表 ({slices.length})</Title>
            <List
              dataSource={slices}
              renderItem={(slice) => (
                <List.Item
                  actions={[
                    <Tooltip title="预览">
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => previewSlice(slice)}
                      />
                    </Tooltip>,
                    <Tooltip title="导出">
                      <Button
                        type="text"
                        icon={<DownloadOutlined />}
                        onClick={() => exportSlice(slice)}
                        disabled={slice.status === 'exported'}
                      />
                    </Tooltip>,
                    <Tooltip title="删除">
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteSlice(slice.id)}
                      />
                    </Tooltip>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div className="slice-preview">
                        <VideoCameraOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                      </div>
                    }
                    title={
                      <Space>
                        <span>{slice.title}</span>
                        <Tag color={slice.status === 'exported' ? 'green' : 'blue'}>
                          {slice.status === 'exported' ? '已导出' : '待处理'}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <Text type="secondary">{slice.description}</Text>
                        <Space>
                          <ClockCircleOutlined />
                          <Text>{formatTime(slice.start)} - {formatTime(slice.end)}</Text>
                          <Text type="secondary">({formatTime(slice.duration)})</Text>
                        </Space>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Card>

      {/* 添加切片模态框 */}
      <Modal
        title="添加视频切片"
        open={sliceModalVisible}
        onOk={saveSlice}
        onCancel={() => setSliceModalVisible(false)}
        width={600}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Text>开始时间 (秒):</Text>
              <InputNumber
                min={0}
                max={duration}
                value={currentSlice.start}
                onChange={(value) => setCurrentSlice(prev => ({ ...prev, start: value }))}
                style={{ width: '100%' }}
                formatter={(value) => formatTime(value)}
              />
            </Col>
            <Col span={12}>
              <Text>结束时间 (秒):</Text>
              <InputNumber
                min={0}
                max={duration}
                value={currentSlice.end}
                onChange={(value) => setCurrentSlice(prev => ({ ...prev, end: value }))}
                style={{ width: '100%' }}
                formatter={(value) => formatTime(value)}
              />
            </Col>
          </Row>
          <div>
            <Text>切片标题:</Text>
            <Input
              value={currentSlice.title}
              onChange={(e) => setCurrentSlice(prev => ({ ...prev, title: e.target.value }))}
              placeholder="请输入切片标题"
            />
          </div>
          <div>
            <Text>切片描述:</Text>
            <TextArea
              value={currentSlice.description}
              onChange={(e) => setCurrentSlice(prev => ({ ...prev, description: e.target.value }))}
              placeholder="请输入切片描述（可选）"
              rows={3}
            />
          </div>
          <Alert
            message={`切片时长: ${formatTime(currentSlice.end - currentSlice.start)}`}
            type="info"
            showIcon
          />
        </Space>
      </Modal>
    </div>
  );
};

export default VideoSlicing;