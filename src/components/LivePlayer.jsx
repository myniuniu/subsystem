import React, { useRef, useState, useEffect } from 'react';
import { Modal, Button, Typography } from 'antd';
import { 
  CloseOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  PlayCircleOutlined,
  PauseOutlined
} from '@ant-design/icons';

const { Text } = Typography;

// 直播播放器（复制自点播播放器的结构，但改为直播播放逻辑）
// 注意：该组件为“复制版本”，未复用点播课组件。
const LivePlayer = ({ 
  visible,
  onClose,
  liveData,
  embedded = false,
  style,
  isWidescreenMode = false,
  onToggleWidescreen = null
}) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isIframeSource, setIsIframeSource] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getLiveUrl = (data) => {
    const candidates = [data?.liveUrl, data?.url, data?.replayUrl];
    const url = candidates.find(u => typeof u === 'string' && u.trim());
    return url || '/assets/2.mp4';
  };

  const url = getLiveUrl(liveData || {});

  useEffect(() => {
    // 只要不是本地 mp4，就用 iframe 嵌入（如平台直播地址或HLS播放页）
    const isMp4 = /\.mp4(\?.*)?$/i.test(url) || url.startsWith('/assets/');
    setIsIframeSource(!isMp4);
  }, [url]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleClose = () => {
    // 退出时暂停播放（仅视频标签时有效）
    try { if (videoRef.current) videoRef.current.pause(); } catch {}
    setIsPlaying(false);
    onClose && onClose();
  };

  // 嵌入模式：直接在容器内渲染播放器
  if (embedded) {
    return (
      <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', ...(style || {}) }}>
        {/* 标题栏（简化版） */}
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text strong>{liveData?.title || '直播课程'}</Text>
          <span style={{ marginLeft: 8, fontSize: 12, color: '#f5222d' }}>直播中</span>
          {onToggleWidescreen && (
            <Button type="text" icon={isWidescreenMode ? <FullscreenExitOutlined /> : <FullscreenOutlined />} onClick={onToggleWidescreen} style={{ marginLeft: 'auto' }} />
          )}
        </div>

        {/* 播放区域：mp4用video，其他地址用iframe */}
        <div style={{ position: 'relative', width: '100%', height: isWidescreenMode ? 'calc(100vh - 56px)' : '100%' }}>
          {isIframeSource ? (
            <iframe
              src={url}
              title={liveData?.title || '直播课'}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; fullscreen"
            />
          ) : (
            <video
              ref={videoRef}
              src={url}
              autoPlay
              controls
              style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          )}
        </div>
      </div>
    );
  }

  // 弹窗模式：复制点播结构但去掉进度、标注等复杂控制
  return (
    <Modal
      title={null}
      open={visible}
      onCancel={handleClose}
      footer={null}
      width="80%"
      style={{ top: 20 }}
      closeIcon={<CloseOutlined style={{ color: 'white', fontSize: 16 }} />}
    >
      <div ref={containerRef} style={{ background: '#000', position: 'relative' }}>
        {/* 头部 */}
        <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Text strong style={{ color: 'white' }}>{liveData?.title || '直播课程'}</Text>
            {liveData?.instructor && (
              <Text style={{ color: '#ccc', marginLeft: 12 }}>讲师：{liveData.instructor}</Text>
            )}
          </div>
          <div>
            <Button type="text" icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} onClick={toggleFullscreen} style={{ color: 'white' }} />
          </div>
        </div>

        {/* 播放区域 */}
        <div style={{ width: '100%', height: '60vh' }}>
          {isIframeSource ? (
            <iframe
              src={url}
              title={liveData?.title || '直播课'}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; fullscreen"
            />
          ) : (
            <video
              ref={videoRef}
              src={url}
              autoPlay
              controls
              style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          )}
        </div>

        {/* 简单控制（仅播放/暂停） */}
        {!isIframeSource && (
          <div style={{ position: 'absolute', right: 12, bottom: 12 }}>
            <Button type="primary" icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />} onClick={() => {
              try {
                if (!videoRef.current) return;
                if (videoRef.current.paused) {
                  videoRef.current.play();
                  setIsPlaying(true);
                } else {
                  videoRef.current.pause();
                  setIsPlaying(false);
                }
              } catch {}
            }}>
              {isPlaying ? '暂停' : '播放'}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LivePlayer;