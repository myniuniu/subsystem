import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Progress, Slider, Space, Typography, message } from 'antd';
import {
  PlayCircleOutlined,
  PauseOutlined,
  SoundOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  CloseOutlined
} from '@ant-design/icons';
import './VideoPlayer.css';

const { Text } = Typography;

const VideoPlayer = ({ 
  visible, 
  onClose, 
  videoData, 
  onProgressUpdate 
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);

  // 控制条自动隐藏
  useEffect(() => {
    let timer;
    if (isPlaying && showControls) {
      timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, showControls]);

  // 视频加载完成
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      // 如果有保存的进度，跳转到对应位置
      if (videoData?.progress && videoData.progress > 0) {
        const savedTime = (videoData.progress / 100) * videoRef.current.duration;
        videoRef.current.currentTime = savedTime;
        setCurrentTime(savedTime);
      }
    }
  };

  // 时间更新
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      
      if (total > 0) {
        const newProgress = Math.round((current / total) * 100);
        setProgress(newProgress);
        
        // 每10秒更新一次进度到父组件
        if (Math.floor(current) % 10 === 0 && onProgressUpdate) {
          onProgressUpdate(videoData.id, newProgress);
        }
      }
    }
  };

  // 播放/暂停
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

  // 进度条拖拽
  const handleSeek = (value) => {
    if (videoRef.current && duration > 0) {
      const newTime = (value / 100) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(value);
    }
  };

  // 音量调节
  const handleVolumeChange = (value) => {
    const newVolume = value / 100;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // 全屏切换
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // 格式化时间
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 获取视频源URL
  const getVideoUrl = (videoData) => {
    if (!videoData) return '';
    
    // 如果有直接的视频URL
    if (videoData.videoUrl) {
      return videoData.videoUrl;
    }
    
    // 如果是B站链接，提取视频ID（实际项目中需要B站API）
    if (videoData.url && videoData.url.includes('bilibili.com')) {
      // 这里应该调用B站API获取真实播放地址
      // 暂时返回示例视频
      return 'https://www.w3schools.com/html/mov_bbb.mp4';
    }
    
    // 如果是YouTube链接（实际项目中需要YouTube API）
    if (videoData.url && videoData.url.includes('youtube.com')) {
      // 这里应该调用YouTube API获取真实播放地址
      return 'https://www.w3schools.com/html/mov_bbb.mp4';
    }
    
    // 默认示例视频
    return 'https://www.w3schools.com/html/mov_bbb.mp4';
  };

  // 关闭播放器时保存进度
  const handleClose = () => {
    if (onProgressUpdate && progress > 0) {
      onProgressUpdate(videoData.id, progress);
    }
    setIsPlaying(false);
    onClose();
  };

  if (!videoData) return null;

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={handleClose}
      footer={null}
      width="80%"
      style={{ top: 20 }}
      className="video-player-modal"
      closeIcon={<CloseOutlined style={{ color: 'white', fontSize: 16 }} />}
    >
      <div 
        className="video-player-container"
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* 视频标题 */}
        <div className="video-header">
          <Text strong style={{ color: 'white', fontSize: 16 }}>
            {videoData.title}
          </Text>
          {videoData.instructor && (
            <Text style={{ color: '#ccc', marginLeft: 16 }}>
              讲师：{videoData.instructor}
            </Text>
          )}
        </div>

        {/* 视频播放器 */}
        <video
          ref={videoRef}
          className="video-element"
          src={getVideoUrl(videoData)}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            setProgress(100);
            if (onProgressUpdate) {
              onProgressUpdate(videoData.id, 100);
            }
          }}
          onClick={togglePlay}
        />

        {/* 播放控制条 */}
        {showControls && (
          <div className="video-controls">
            {/* 进度条 */}
            <div className="progress-container">
              <Slider
                value={progress}
                onChange={handleSeek}
                tooltip={{ formatter: null }}
                className="progress-slider"
              />
            </div>

            {/* 控制按钮 */}
            <div className="controls-bar">
              <Space>
                {/* 播放/暂停 */}
                <Button
                  type="text"
                  icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
                  onClick={togglePlay}
                  style={{ color: 'white' }}
                />

                {/* 时间显示 */}
                <Text style={{ color: 'white', fontSize: 12 }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Text>
              </Space>

              <Space>
                {/* 音量控制 */}
                <SoundOutlined style={{ color: 'white' }} />
                <Slider
                  value={volume * 100}
                  onChange={handleVolumeChange}
                  style={{ width: 80 }}
                  tooltip={{ formatter: null }}
                />

                {/* 全屏按钮 */}
                <Button
                  type="text"
                  icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                  onClick={toggleFullscreen}
                  style={{ color: 'white' }}
                />
              </Space>
            </div>
          </div>
        )}

        {/* 播放进度提示 */}
        {progress > 0 && (
          <div className="progress-indicator">
            <Text style={{ color: 'white', fontSize: 12 }}>
              观看进度：{progress}%
            </Text>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default VideoPlayer;