import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Slider, Space, message, Input, Typography, Image } from 'antd';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined,
  PauseOutlined,
  SoundOutlined, 
  FullscreenOutlined,
  FullscreenExitOutlined,
  CloseOutlined,
  EditOutlined
} from '@ant-design/icons';
import './VideoPlayer.css';

const { TextArea } = Input;
const { Text } = Typography;

const VideoPlayer = ({ 
  visible, 
  onClose, 
  videoData, 
  onNoteCreated, 
  embedded = false, 
  style, 
  onTimeUpdate,
  onProgressUpdate,
  currentEditorState = null, // 新增参数：当前编辑器状态
  isWidescreenMode = false, // 新增参数：是否为宽屏模式
  onToggleWidescreen = null // 新增参数：宽屏模式切换回调
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [annotationText, setAnnotationText] = useState('');
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [capturedScreenshot, setCapturedScreenshot] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

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
      setVideoLoading(false);
      setVideoError(false);
      // 如果有保存的进度，跳转到对应位置
      if (videoData?.progress && videoData.progress > 0) {
        const savedTime = (videoData.progress / 100) * videoRef.current.duration;
        videoRef.current.currentTime = savedTime;
        setCurrentTime(savedTime);
        // 元数据加载完成后立即触发一次时间更新回调，确保字幕与进度初始同步
        if (onTimeUpdate) {
          onTimeUpdate(savedTime, videoRef.current.duration);
        }
      }
      // 如果有起始时间（用于时刻标注跳转），跳转到对应位置
      else if (videoData?.startTime !== undefined && videoData.startTime > 0) {
        videoRef.current.currentTime = videoData.startTime;
        setCurrentTime(videoData.startTime);
        // 元数据加载完成后立即触发一次时间更新回调，确保字幕与进度初始同步
        if (onTimeUpdate) {
          onTimeUpdate(videoData.startTime, videoRef.current.duration);
        }
      } else {
        // 无保存进度或起始时间时，也触发一次回调用于初始化
        if (onTimeUpdate) {
          onTimeUpdate(videoRef.current.currentTime || 0, videoRef.current.duration);
        }
      }
    }
  };

  // 视频加载错误处理
  const handleVideoError = (e) => {
    console.error('视频加载失败:', e);
    setVideoLoading(false);
    setVideoError(true);
    message.error('视频加载失败，请检查网络连接或视频源');
  };

  // 视频开始加载
  const handleLoadStart = () => {
    setVideoLoading(true);
    setVideoError(false);
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
        
        // 调用父组件的时间更新回调（用于字幕显示等）
        if (onTimeUpdate) {
          onTimeUpdate(current, total);
        }
        
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

  // 监听 fullscreenchange 事件以同步全屏状态，并支持 ESC 键退出
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
    };

    const handleKeyDown = (e) => {
      // 当按下 ESC 键时，如果处于全屏则退出并同步状态
      if (e.key === 'Escape' || e.keyCode === 27) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    };

    // 仅在播放器可见时监听，避免全局污染
    if (visible) {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible]);

  // 格式化时间
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 获取视频源URL
  const getVideoUrl = (videoData) => {
    // 允许的资源：本地 assets 路径或直接 mp4 文件
    const isPlayableAsset = (u) => {
      if (typeof u !== 'string' || !u) return false;
    // 允许 '/assets/xxx.mp4' 或 'http(s)://...mp4' 直链
      return u.startsWith('/assets/') || /^https?:\/\/.*\.mp4(\?.*)?$/i.test(u);
    };

    // 候选来源：videoUrl → url → src
    const candidates = [videoData?.videoUrl, videoData?.url, videoData?.src];
    const picked = candidates.find(isPlayableAsset);
    
    // 找到可播放资源则使用；否则回退到 demo1.mp4
    return picked || '/assets/demo1.mp4';
  };

  // 关闭播放器时保存进度
  const handleClose = () => {
    // 暂停视频播放
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
    setIsPlaying(false);
    onClose();
  };

  // 时刻标注按钮点击处理
  const handleAnnotationClick = () => {
    // 首先截取当前视频帧
    captureVideoScreenshot();
    
    // 生成当前时间段的默认总结
    const currentTimeFormatted = formatTime(currentTime);
    const defaultSummary = `在 ${currentTimeFormatted} 时刻的内容总结：\n\n这是一个重要的学习要点，值得记录和回顾。`;
    
    setAnnotationText(defaultSummary);
    setShowAnnotationModal(true);
  };

  // 截取视频截图
  const captureVideoScreenshot = () => {
    if (videoRef.current) {
      try {
        // 创建canvas元素
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置canvas尺寸为视频尺寸
        const video = videoRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        
        // 检查视频是否加载完成
        if (video.readyState < 2) {
          message.warning('视频还未加载完成，请稍后再试');
          return;
        }
        
        // 将当前视频帧绘制到canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // 转换为base64图片数据
        const screenshotDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // 检查是否成功生成截图
        if (screenshotDataUrl === 'data:,') {
          throw new Error('无法捕获视频帧，可能由于跨域限制');
        }
        
        // 保存截图数据
        setCapturedScreenshot(screenshotDataUrl);
        
        message.success('视频截图已捕获，可在标注中使用');
        console.log('视频截图已捕获');
      } catch (error) {
        console.error('截图失败:', error);
        
        // 生成备用的占位符图片
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 640;
        canvas.height = 360;
        
        // 绘制占位符背景
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制播放图标
        ctx.fillStyle = '#1890ff';
        ctx.beginPath();
        ctx.arc(320, 180, 60, 0, 2 * Math.PI);
        ctx.fill();
        
        // 绘制三角形播放按钮
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(300, 160);
        ctx.lineTo(300, 200);
        ctx.lineTo(340, 180);
        ctx.closePath();
        ctx.fill();
        
        // 添加文字说明
        ctx.fillStyle = '#666';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('视频截图占位符', 320, 280);
        ctx.fillText(`时间: ${formatTime(currentTime)}`, 320, 300);
        ctx.fillText(videoData?.title || '视频', 320, 320);
        
        const placeholderDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedScreenshot(placeholderDataUrl);
        
        message.warning('无法捕获视频截图（可能由于跨域限制），已生成占位符图片');
      }
    } else {
      message.error('视频未加载，无法截图');
    }
  };

  // 仅保存截图到笔记
  const saveScreenshotOnly = async () => {
    if (!capturedScreenshot) {
      message.warning('请先截取视频截图');
      return;
    }

    try {
      const { default: notesService } = await import('../services/notesService');
      
      const noteContent = `## 视频截图

**截图时间：** ${formatTime(currentTime)}
**视频标题：** ${videoData?.title || '未知视频'}

![${formatTime(currentTime)}时刻截图](${capturedScreenshot})`;
      
      const noteData = {
        title: `【视频截图】${videoData?.title || '视频截图'} - ${formatTime(currentTime)}`,
        content: noteContent,
        category: 'study',
        tags: ['视频截图', '时刻记录'],
        source: '视频播放器',
        videoId: videoData?.id,
        annotationTime: currentTime,
        screenshot: capturedScreenshot,
        starred: false
      };
      
      notesService.createNote(noteData);
      message.success('截图已保存为笔记');
      setCapturedScreenshot(null);
      
    } catch (error) {
      console.error('保存截图失败:', error);
      message.error('保存截图失败，请重试');
    }
  };

  // 确认创建时刻标注
  const handleAnnotationConfirm = async () => {
    try {
      // 检查是否有正在编辑的笔记
      if (currentEditorState && currentEditorState.isEditing) {
        // 如果有正在编辑的笔记，将内容添加到当前笔记中
        await addContentToCurrentNote();
        return;
      }
      
      // 如果没有正在编辑的笔记，则创建新笔记
      await createNewNote();
    } catch (error) {
      console.error('保存时刻标注失败:', error);
      message.error('保存时刻标注失败，请重试');
    }
  };

  // 添加内容到当前正在编辑的笔记中
  const addContentToCurrentNote = async () => {
    const timeText = formatTime(currentTime);
    let annotationContent = `

## 📝 时刻标注 [${timeText}]

`;
    
    // 如果有截图，添加截图
    if (capturedScreenshot) {
      // 将base64图片转换为HTML img标签，确保在笔记中正确显示
      annotationContent += `### 📷 视频截图

<img src="${capturedScreenshot}" alt="${timeText}时刻截图" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 8px 0;" />

`;
    }
    
    // 添加标注内容
    annotationContent += `### 📋 内容标注

${annotationText}

`;
    annotationContent += `**视频源：** ${videoData?.title || '未知视频'}\n`;
    annotationContent += `**标注时间：** ${timeText}`;
    
    // 通过回调函数更新当前编辑器内容
    if (currentEditorState.onContentUpdate) {
      currentEditorState.onContentUpdate(annotationContent);
    }
    
    message.success('时刻标注已添加到当前笔记中');
    setShowAnnotationModal(false);
    setAnnotationText('');
    setCapturedScreenshot(null);
  };

  // 创建新笔记
  const createNewNote = async () => {
    // 导入笔记服务
    const { default: notesService } = await import('../services/notesService');
    
    // 构建笔记内容，包含截图
    let noteContent = `## 时刻标注

**标注时间：** ${formatTime(currentTime)}
**视频标题：** ${videoData?.title || '未知视频'}

`;
    
    // 如果有截图，添加到笔记中
    if (capturedScreenshot) {
      noteContent += `### 视频截图

<img src="${capturedScreenshot}" alt="${formatTime(currentTime)}时刻截图" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 8px 0;" />

`;
    }
    
    // 添加用户输入的标注内容
    noteContent += `### 内容标注\n\n${annotationText}`;
    
    // 创建新的笔记记录
    const noteData = {
      title: `【视频标注】${videoData?.title || '视频笔记'}`,
      content: noteContent,
      category: 'study',
      tags: ['视频标注', '时刻笔记', '截图记录'],
      source: '视频播放器',
      videoId: videoData?.id,
      annotationTime: currentTime,
      screenshot: capturedScreenshot, // 保存截图数据
      starred: false
    };
    
    const newNote = notesService.createNote(noteData);
    
    message.success('时刻标注和截图已保存为新笔记');
    setShowAnnotationModal(false);
    setAnnotationText('');
    setCapturedScreenshot(null);
    
    // 如果有回调函数，通知父组件有新笔记创建
    if (onNoteCreated) {
      const operationRecord = {
        id: Date.now(),
        title: `【视频标注】${videoData?.title || '视频笔记'}`,
        source: '视频播放器',
        time: formatTime(currentTime),
        type: 'note',
        content: noteContent,
        videoId: videoData?.id,
        annotationTime: currentTime,
        hasScreenshot: !!capturedScreenshot
      };
      onNoteCreated(operationRecord);
    }
    
    console.log('创建的时刻标注笔记:', newNote);
  };

  // 取消时刻标注
  const handleAnnotationCancel = () => {
    setShowAnnotationModal(false);
    setAnnotationText('');
    setCapturedScreenshot(null);
  };

  if (!videoData) return null;

  // 嵌入模式直接渲染视频播放器
  if (embedded) {
    return (
      <div 
        className={`video-player-container embedded${isWidescreenMode ? ' widescreen' : ''}`}
        style={style}
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* 视频播放器 */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <video
            ref={videoRef}
            className="video-element"
            src={getVideoUrl(videoData)}
            crossOrigin="anonymous"
            onLoadStart={handleLoadStart}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={handleVideoError}
            onEnded={() => {
              setIsPlaying(false);
              setProgress(100);
              if (onProgressUpdate) {
                onProgressUpdate(videoData.id, 100);
              }
            }}
            onClick={togglePlay}
            style={{ 
              display: videoLoading || videoError ? 'none' : 'block',
              ...(isWidescreenMode ? {
                width: '100%',
                height: '100vh',
                maxHeight: 'none',
                objectFit: 'contain'
              } : {})
            }}
          />
          
          {/* 加载状态 */}
          {videoLoading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'white'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                borderTop: '3px solid #1890ff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '12px'
              }} />
              <p style={{ margin: 0, fontSize: '14px' }}>加载中...</p>
            </div>
          )}
          
          {/* 错误状态 */}
          {videoError && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'white'
            }}>
              <div style={{
                fontSize: '32px',
                marginBottom: '12px',
                opacity: 0.6
              }}>⚠️</div>
              <p style={{ margin: 0, fontSize: '14px' }}>加载失败</p>
              <Button 
                type="primary" 
                size="small"
                onClick={() => {
                  setVideoError(false);
                  setVideoLoading(true);
                  if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
                style={{ marginTop: '8px', fontSize: '12px' }}
              >
                重试
              </Button>
            </div>
          )}
        </div>

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
                  icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                  onClick={togglePlay}
                  style={{ color: 'white' }}
                />

                {/* 时间显示 */}
                <Text style={{ color: 'white', fontSize: 12 }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Text>

                {/* 时刻标注按钮 */}
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={handleAnnotationClick}
                  style={{ color: 'white' }}
                  title="时刻标注（含截图）"
                />
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

                {/* 宽屏模式按钮 */}
                {embedded && onToggleWidescreen && (
                  <Button
                    type="text"
                    icon={isWidescreenMode ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                    onClick={onToggleWidescreen}
                    style={{ color: 'white' }}
                    title={isWidescreenMode ? '退出宽屏模式' : '开启宽屏模式'}
                  />
                )}

                {/* 全屏按钮 - 非嵌入模式下显示 */}
                {!embedded && (
                  <Button
                    type="text"
                    icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                    onClick={toggleFullscreen}
                    style={{ color: 'white' }}
                    title={isFullscreen ? '退出全屏' : '进入全屏'}
                  />
                )}
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

        {/* 时刻标注对话框 */}
        <Modal
          title="时刻标注"
          open={showAnnotationModal}
          onOk={handleAnnotationConfirm}
          onCancel={handleAnnotationCancel}
          okText="确定"
          cancelText="取消"
          width={600}
          destroyOnHidden
        >
          <div style={{ marginBottom: 16 }}>
            <p style={{ marginBottom: 8, color: '#666' }}>
              当前时间：{formatTime(currentTime)} | 视频：{videoData?.title || '未知视频'}
            </p>
            
            {/* 显示截图预览 */}
            {capturedScreenshot && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ marginBottom: 8, fontWeight: 'bold' }}>视频截图：</p>
                <Image
                  src={capturedScreenshot}
                  alt="视频截图"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px'
                  }}
                  preview={{
                    mask: '点击放大查看'
                  }}
                />
              </div>
            )}
            
            <TextArea
              value={annotationText}
              onChange={(e) => setAnnotationText(e.target.value)}
              placeholder="请输入您的标注内容..."
              rows={6}
              style={{ resize: 'vertical' }}
            />
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <>
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
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <video
            ref={videoRef}
            className="video-element"
            src={getVideoUrl(videoData)}
            crossOrigin="anonymous"
            onLoadStart={handleLoadStart}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={handleVideoError}
            onEnded={() => {
              setIsPlaying(false);
              setProgress(100);
              if (onProgressUpdate) {
                onProgressUpdate(videoData.id, 100);
              }
            }}
            onClick={togglePlay}
            style={{ display: videoLoading || videoError ? 'none' : 'block' }}
          />
          
          {/* 加载状态 */}
          {videoLoading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'white'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                borderTop: '4px solid #1890ff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '16px'
              }} />
              <p style={{ margin: 0, fontSize: '16px' }}>视频加载中...</p>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: 0.7 }}>{videoData?.title || '视频'}</p>
            </div>
          )}
          
          {/* 错误状态 */}
          {videoError && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'white'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
                opacity: 0.6
              }}>⚠️</div>
              <p style={{ margin: 0, fontSize: '16px' }}>视频加载失败</p>
              <p style={{ margin: '8px 0', fontSize: '14px', opacity: 0.7 }}>请检查网络连接或视频源</p>
              <Button 
                type="primary" 
                size="small"
                onClick={() => {
                  setVideoError(false);
                  setVideoLoading(true);
                  // 重新加载视频
                  if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
                style={{ marginTop: '12px' }}
              >
                重试加载
              </Button>
            </div>
          )}
        </div>

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

                {/* 时刻标注按钮 */}
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={handleAnnotationClick}
                  style={{ color: 'white' }}
                  title="时刻标注（含截图）"
                />
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

                {/* 宽屏模式按钮 */}
                {embedded && onToggleWidescreen && (
                  <Button
                    type="text"
                    icon={isWidescreenMode ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                    onClick={onToggleWidescreen}
                    style={{ color: 'white' }}
                    title={isWidescreenMode ? '退出宽屏模式' : '开启宽屏模式'}
                  />
                )}

                {/* 全屏按钮 - 非嵌入模式下显示 */}
                {!embedded && (
                  <Button
                    type="text"
                    icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                    onClick={toggleFullscreen}
                    style={{ color: 'white' }}
                    title={isFullscreen ? '退出全屏' : '进入全屏'}
                  />
                )}
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

    {/* 时刻标注对话框 */}
    <Modal
      title="时刻标注"
      open={showAnnotationModal}
      onOk={handleAnnotationConfirm}
      onCancel={handleAnnotationCancel}
      okText="确定"
      cancelText="取消"
      width={600}
      destroyOnHidden
    >
      <div style={{ marginBottom: 16 }}>
        <p style={{ marginBottom: 8, color: '#666' }}>
          当前时间：{formatTime(currentTime)} | 视频：{videoData?.title || '未知视频'}
        </p>
        
        {/* 显示当前编辑状态 */}
        {currentEditorState && currentEditorState.isEditing && (
          <div style={{ 
            marginBottom: 12, 
            padding: '8px 12px', 
            background: '#e6f7ff', 
            border: '1px solid #91d5ff',
            borderRadius: '6px',
            fontSize: '13px'
          }}>
            📝 检测到正在编辑的笔记：<strong>{currentEditorState.noteTitle || '当前笔记'}</strong>
            <br />
            标注内容将直接添加到当前笔记中
          </div>
        )}
        
        {/* 显示截图预览 */}
        {capturedScreenshot && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ marginBottom: 8, fontWeight: 'bold' }}>视频截图：</p>
            <Image
              src={capturedScreenshot}
              alt="视频截图"
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px'
              }}
              preview={{
                mask: '点击放大查看'
              }}
            />
          </div>
        )}
        
        <TextArea
          value={annotationText}
          onChange={(e) => setAnnotationText(e.target.value)}
          placeholder={currentEditorState && currentEditorState.isEditing 
            ? "请输入要添加到当前笔记的标注内容..." 
            : "请输入您的标注内容..."}
          rows={6}
          style={{ resize: 'vertical' }}
        />
      </div>
    </Modal>
    </>
  );
};

export default VideoPlayer;
