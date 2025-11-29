import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Progress,
  message
} from 'antd';
import VideoPlayer from './VideoPlayer';
import {
  ArrowLeftOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons';
import { formatTime, convertTimeToLinks } from '../utils/noteEditUtils';

const { Text, Title } = Typography;

const VideoView = ({ state, handlers, isWidescreen = false }) => {
  const {
    selectedMaterial,
    videoStartTime,
    currentSubtitle,
    videoProgress,
    subtitleMenuVisible,
    setSubtitleMenuVisible,
    subtitleMenuPosition,
    setSubtitleMenuPosition,
    selectedSubtitleText,
    setSelectedSubtitleText,
    selectedSubtitleTime,
    setSelectedSubtitleTime,
    subtitleData,
    rightPanelView,
    rightPanelEditingNote,
    rightPanelNoteContent,
    setRightPanelNoteContent,
    showNoteEditor,
    editingNote,
    noteEditorContent,
    setNoteEditorContent,
    operationRecords,
    setOperationRecords,
    currentView,
    isWidescreenMode
  } = state;

  const {
    onBackToMaterials,
    onVideoTimeUpdate,
    onNoteCreated,
    onToggleWidescreen,
    onVideoProgressUpdate
  } = handlers;

  // 直播模拟：弹幕、观众数、延迟、直播时长
  const isLive = selectedMaterial?.type === 'live';
  const [showDanmu, setShowDanmu] = useState(isLive);
  const [viewerCount, setViewerCount] = useState(() => 1000 + Math.floor(Math.random() * 500));
  const [latency, setLatency] = useState(() => (0.8 + Math.random() * 1.2).toFixed(1));
  const [liveElapsed, setLiveElapsed] = useState(0);
  const [danmuList, setDanmuList] = useState([]);

  useEffect(() => {
    // 直播时长计时器（模拟）
    if (!isLive) return;
    const start = Date.now();
    const timer = setInterval(() => {
      setLiveElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [isLive]);

  useEffect(() => {
    // 观众数与延迟随机波动（模拟）
    if (!isLive) return;
    const timer = setInterval(() => {
      setViewerCount(v => v + Math.floor(Math.random() * 15));
      setLatency((0.8 + Math.random() * 1.2).toFixed(1));
    }, 5000);
    return () => clearInterval(timer);
  }, [isLive]);

  useEffect(() => {
    // 弹幕生成（模拟）
    if (!isLive || !showDanmu) return;
    const messages = [
      '讲得太好了！',
      '这知识点刚好不懂～',
      '点赞点赞👍',
      '老师能再举个例子吗？',
      '录屏了，回看～',
      '弹幕测试：hello world',
      '这段笔记记一下',
      '直播质量很清晰',
      '同事也在看～',
      'PPT很漂亮！'
    ];
    const timer = setInterval(() => {
      const idx = Math.floor(Math.random() * messages.length);
      const top = 10 + Math.floor(Math.random() * 60); // 相对顶部百分比
      setDanmuList(prev => [...prev, { id: Date.now(), text: messages[idx], top: `${top}%` }].slice(-20));
    }, 1500);
    return () => clearInterval(timer);
  }, [isLive, showDanmu]);

  // 宽屏模式下禁用body滚动
  useEffect(() => {
    if (isWidescreenMode) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
    
    // 清理函数
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isWidescreenMode]);

  // 宽屏模式下按 ESC 退出宽屏
  useEffect(() => {
    if (!isWidescreenMode) return;

    const handleKeyDown = (e) => {
      const isEsc = e.key === 'Escape' || e.keyCode === 27;
      if (isEsc) {
        try {
          onToggleWidescreen && onToggleWidescreen();
        } catch (err) {
          console.error('退出宽屏失败:', err);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isWidescreenMode, onToggleWidescreen]);

  // 处理字幕文字选中
  const handleSubtitleTextSelection = (e, subtitle) => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText && selectedText.length > 0) {
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      setSelectedSubtitleText(selectedText);
      setSelectedSubtitleTime(subtitle.start);
      setSubtitleMenuPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      setSubtitleMenuVisible(true);
    }
  };

  // 处理一键摘取
  const handleQuickExtract = async () => {
    const timeText = formatTime(selectedSubtitleTime);
    
    // 获取当前视频截图
    let screenshotDataUrl = null;
    try {
      const videoElement = document.querySelector('video');
      if (videoElement && videoElement.readyState >= 2) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = videoElement.videoWidth || 640;
        canvas.height = videoElement.videoHeight || 360;
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        screenshotDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        console.log('一键摘取时成功截取视频帧');
      } else {
        console.warn('无法获取视频元素或视频未加载完成，使用占位符截图');
        // 生成占位符截图
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 640;
        canvas.height = 360;
        
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#999';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${timeText} 时刻截图`, canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillText(selectedMaterial?.title || '视频', canvas.width / 2, canvas.height / 2 + 20);
        
        screenshotDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      }
    } catch (error) {
      console.error('摘取截图失败:', error);
    }
    
    // 创建带截图的摘取内容
    let extractContent = `<div style="background-color: #f8f9fa; padding: 12px; border-left: 4px solid #1890ff; border-radius: 8px; margin: 12px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">`;
    extractContent += `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;"><strong style="color: #1890ff; font-size: 14px;">📝 [${timeText}] 视频摘取</strong></div>`;
    extractContent += `<div style="font-size: 14px; line-height: 1.6; margin-bottom: 8px; background: rgba(255,255,255,0.8); padding: 8px; border-radius: 4px;">${selectedSubtitleText}</div>`;
    
    if (screenshotDataUrl) {
      extractContent += `<div style="margin: 8px 0;"><div style="font-size: 12px; color: #666; margin-bottom: 4px;">📸 视频截图 (${timeText}):</div><img src="${screenshotDataUrl}" alt="${timeText}时刻截图" style="max-width: 100%; height: auto; border-radius: 4px; border: 1px solid #e0e0e0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" /></div>`;
    }
    
    extractContent += `<div style="font-size: 12px; color: #999; margin-top: 8px; border-top: 1px solid #eee; padding-top: 6px;">📺 来源：${selectedMaterial?.title || '视频'}</div>`;
    extractContent += `</div>`;
    
    // 如果右侧栏正在编辑主题，则添加到当前编辑的主题中
    if (rightPanelView === 'noteEditor' && rightPanelEditingNote) {
      const updatedContent = rightPanelNoteContent + extractContent;
      setRightPanelNoteContent(updatedContent);
      
      setSubtitleMenuVisible(false);
      message.success('内容已添加到当前笔记（含截图）');
      return;
    }
    
    // 如果弹窗编辑器正在使用，则添加到弹窗编辑器中
    if (showNoteEditor && editingNote) {
      const updatedContent = noteEditorContent + extractContent;
      setNoteEditorContent(updatedContent);
      
      setSubtitleMenuVisible(false);
      message.success('内容已添加到当前笔记（含截图）');
      return;
    }
    
    // 如果没有打开的笔记编辑器，则创建新笔记
    const newNote = {
      id: Date.now(),
      title: `【视频摘取】${selectedSubtitleText.length > 20 ? selectedSubtitleText.substring(0, 20) + '...' : selectedSubtitleText}`,
      source: `视频摘取 - ${selectedMaterial?.title || '视频'}`,
      time: '刚刚',
      type: 'note',
      content: extractContent,
      videoId: selectedMaterial?.id,
      annotationTime: selectedSubtitleTime,
      hasScreenshot: !!screenshotDataUrl,
      screenshot: screenshotDataUrl,
      subtitleText: selectedSubtitleText
    };
    
    if (onNoteCreated) {
      onNoteCreated(newNote);
    } else {
      setOperationRecords(prev => ({
        ...prev,
        note: [newNote, ...prev.note]
      }));
    }
    
    setSubtitleMenuVisible(false);
    message.success('内容已摘取到新笔记（含截图）');
  };

  // 处理标记操作
  const handleMarkSubtitle = async (markType) => {
    const markColors = {
      blue: '#1890ff',
      pink: '#eb2f96', 
      yellow: '#faad14',
      gray: '#8c8c8c'
    };
    
    const markNames = {
      blue: '重要',
      pink: '疑问',
      yellow: '精彩',
      gray: '备注'
    };
    
    const timeText = formatTime(selectedSubtitleTime);
    const markIcon = {
      blue: '❗',
      pink: '❓', 
      yellow: '⭐',
      gray: '📝'
    };
    
    // 获取当前视频截图
    let screenshotDataUrl = null;
    try {
      // 尝试从VideoPlayer组件中获取视频元素进行截图
      const videoElement = document.querySelector('video');
      if (videoElement && videoElement.readyState >= 2) {
        // 创建canvas元素
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置canvas尺寸为视频尺寸
        canvas.width = videoElement.videoWidth || 640;
        canvas.height = videoElement.videoHeight || 360;
        
        // 将当前视频帧绘制到canvas
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        // 转换为base64图片数据
        screenshotDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        console.log('字幕标记时成功截取视频帧');
      } else {
        console.warn('无法获取视频元素或视频未加载完成，使用占位符截图');
        // 生成占位符截图
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 640;
        canvas.height = 360;
        
        // 绘制占位符
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#999';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${timeText} 时刻截图`, canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillText(selectedMaterial?.title || '视频', canvas.width / 2, canvas.height / 2 + 20);
        
        screenshotDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      }
    } catch (error) {
      console.error('截图失败:', error);
      screenshotDataUrl = null;
    }
    
    // 创建带截图的标记内容
    let markContent = `<div style="background-color: ${markColors[markType]}20; padding: 12px; border-left: 4px solid ${markColors[markType]}; border-radius: 8px; margin: 12px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">`;
    
    // 添加标记头部信息
    markContent += `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;"><strong style="color: ${markColors[markType]}; font-size: 14px;">${markIcon[markType]} [${timeText}] ${markNames[markType]}标记</strong></div>`;
    
    // 添加选中的字幕内容
    markContent += `<div style="font-size: 14px; line-height: 1.6; margin-bottom: 8px; background: rgba(255,255,255,0.8); padding: 8px; border-radius: 4px;">"${selectedSubtitleText}"</div>`;
    
    // 如果有截图，添加截图
    if (screenshotDataUrl) {
      markContent += `<div style="margin: 8px 0;"><div style="font-size: 12px; color: #666; margin-bottom: 4px;">📸 视频截图 (${timeText}):</div><img src="${screenshotDataUrl}" alt="${timeText}时刻截图" style="max-width: 100%; height: auto; border-radius: 4px; border: 1px solid #e0e0e0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" /></div>`;
    }
    
    // 添加来源信息
    markContent += `<div style="font-size: 12px; color: #999; margin-top: 8px; border-top: 1px solid #eee; padding-top: 6px;">📺 来源：${selectedMaterial?.title || '视频'}</div>`;
    
    markContent += `</div>`;
    
    // 如果右侧栏正在编辑主题，则添加到当前编辑的主题中
    if (rightPanelView === 'noteEditor' && rightPanelEditingNote) {
      const updatedContent = rightPanelNoteContent + markContent;
      setRightPanelNoteContent(updatedContent);
      
      setSubtitleMenuVisible(false);
      message.success(`${markNames[markType]}标记已添加到当前笔记（含截图）`);
      return;
    }
    
    // 如果弹窗编辑器正在使用，则添加到弹窗编辑器中
    if (showNoteEditor && editingNote) {
      const updatedContent = noteEditorContent + markContent;
      setNoteEditorContent(updatedContent);
      
      setSubtitleMenuVisible(false);
      message.success(`${markNames[markType]}标记已添加到当前笔记（含截图）`);
      return;
    }
    
    // 如果没有打开的笔记编辑器，则创建新笔记
    const newNote = {
      id: Date.now(),
      title: `【${markNames[markType]}标记】${selectedSubtitleText.length > 15 ? selectedSubtitleText.substring(0, 15) + '...' : selectedSubtitleText}`,
      source: `${markNames[markType]}标记 - ${selectedMaterial?.title || '视频'}`,
      time: '刚刚',
      type: 'note',
      content: markContent,
      videoId: selectedMaterial?.id,
      annotationTime: selectedSubtitleTime,
      markType: markType,
      markColor: markColors[markType],
      hasScreenshot: !!screenshotDataUrl,
      screenshot: screenshotDataUrl,
      subtitleText: selectedSubtitleText // 保存原始字幕文本
    };
    
    if (onNoteCreated) {
      onNoteCreated(newNote);
    } else {
      setOperationRecords(prev => ({
        ...prev,
        note: [newNote, ...prev.note]
      }));
    }
    
    setSubtitleMenuVisible(false);
    message.success(`已成功添加${markNames[markType]}标记（含截图和字幕内容）`);
  };

  // 处理播放音频
  const handlePlayAudio = () => {
    const newRecord = {
      id: Date.now(),
      title: `音频片段：${selectedSubtitleText.length > 20 ? selectedSubtitleText.substring(0, 20) + '...' : selectedSubtitleText}`,
      source: `音频提取 - ${selectedMaterial?.title || '视频'}`,
      time: '刚刚',
      type: 'audio',
      content: selectedSubtitleText,
      startTime: selectedSubtitleTime,
      endTime: selectedSubtitleTime + 10
    };
    
    setOperationRecords(prev => ({
      ...prev,
      audio: [newRecord, ...prev.audio]
    }));
    
    setSubtitleMenuVisible(false);
    message.success('音频片段已生成');
  };

  // 点击其他区域隐藏菜单
  const handleClickOutside = () => {
    setSubtitleMenuVisible(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: isWidescreenMode ? '100vh' : '100%',
      width: isWidescreenMode ? '100%' : '100%',
      background: isWidescreenMode ? '#000' : 'inherit',
      overflow: 'hidden',
      position: isWidescreenMode ? 'fixed' : 'static',
      top: isWidescreenMode ? 0 : 'auto',
      left: isWidescreenMode ? 0 : 'auto',
      right: isWidescreenMode ? 0 : 'auto',
      zIndex: isWidescreenMode ? 1000 : 'auto'
    }}>
      {/* 标题栏 - 宽屏模式下隐藏 */}
      {!isWidescreenMode && (
        <div style={{ 
          padding: '16px 20px', 
          borderBottom: '1px solid #f0f0f0',
          background: '#fff',
          color: '#1f1f1f',
          marginTop: 28
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={onBackToMaterials}
                style={{ color: '#4b5563', padding: '4px 8px' }}
                size="small"
              />
              <div>
                <Title level={4} style={{ margin: 0, color: '#1f1f1f' }}>
                  {selectedMaterial?.title || '视频标题'}
                </Title>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {selectedMaterial?.duration && `时长：${selectedMaterial.duration}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 摘要区域 - 宽屏模式下隐藏 */}
      {!isWidescreenMode && (
        <div style={{ 
          padding: '16px 20px', 
          borderBottom: '1px solid #f0f0f0',
          background: '#f8f9fa'
        }}>
          <Text style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
            📝 {selectedMaterial?.type === 'live' ? '会议摘要' : '视频摘要'}：本{selectedMaterial?.type === 'live' ? '会议' : '视频'}主要介绍了{selectedMaterial?.title || '相关内容'}，包含了重要的学习要点和实际示例。适合初学者和进阶学习者观看。
          </Text>
        </div>
      )}

      {/* 视频播放器区域 */}
      <div style={{ 
        padding: '0',
        margin: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isWidescreenMode ? '#000' : 'transparent',
        flex: isWidescreenMode ? 1 : '0 0 auto',
        minHeight: isWidescreenMode ? '100vh' : '180px',
        maxHeight: isWidescreenMode ? '100vh' : '280px',
        height: isWidescreenMode ? '100vh' : 'auto',
      width: '100%',
      overflow: 'hidden'
      , position: 'relative' }}>
        {isLive && (
          <>
            {/* 弹幕动画样式 */}
            <style>{`
              @keyframes danmu-move {
                0% { transform: translateX(0); opacity: 1; }
                100% { transform: translateX(-120vw); opacity: 0.9; }
              }
            `}</style>
            {/* 左上角直播信息条 */}
            <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 3, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255, 77, 79, 0.9)', color: '#fff', padding: '4px 10px', borderRadius: 16, fontSize: 12 }}>
              <span style={{ fontWeight: 600 }}>直播中</span>
              <span style={{ opacity: 0.9 }}>观众 {viewerCount}</span>
              <span style={{ opacity: 0.9 }}>延迟 {latency}s</span>
              <span style={{ opacity: 0.9 }}>时长 {formatTime(liveElapsed)}</span>
            </div>
            {/* 右上角操作 */}
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button size="small" onClick={() => setShowDanmu(s => !s)}>{showDanmu ? '关闭弹幕' : '开启弹幕'}</Button>
            </div>
            {/* 弹幕流 */}
            {showDanmu && danmuList.map(dm => (
              <div key={dm.id} style={{ position: 'absolute', top: dm.top, left: '100%', zIndex: 2, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.6)', whiteSpace: 'nowrap', fontSize: 14, animation: 'danmu-move 8s linear forwards' }}>
                {dm.text}
              </div>
            ))}
          </>
        )}
        {selectedMaterial && selectedMaterial.type === 'pdf' ? (
          <iframe
            src={selectedMaterial.url}
            title={selectedMaterial.title || 'PDF 预览'}
            style={{ width: '100%', height: isWidescreenMode ? '100vh' : '280px', border: 'none', background: '#fff', zIndex: 1 }}
          />
        ) : selectedMaterial ? (
          <VideoPlayer
            visible={false}
            videoData={{
              ...selectedMaterial,
              startTime: videoStartTime
            }}
            embedded={true}
            style={{
              width: '100%',
              height: isWidescreenMode ? '100vh' : 'auto',
              maxWidth: '100%',
              maxHeight: '100%',
              position: 'relative',
              zIndex: 1
            }}
            onTimeUpdate={onVideoTimeUpdate}
            onProgressUpdate={onVideoProgressUpdate}
            isWidescreenMode={isWidescreenMode}
            onToggleWidescreen={onToggleWidescreen}
            currentEditorState={{
              isEditing: rightPanelView === 'noteEditor' || (showNoteEditor && editingNote),
              noteTitle: rightPanelView === 'noteEditor' 
                ? rightPanelEditingNote?.title || '当前笔记'
                : editingNote?.title || '当前笔记',
              onContentUpdate: (content) => {
                if (rightPanelView === 'noteEditor' && rightPanelEditingNote) {
                  setRightPanelNoteContent(prev => prev + content);
                } else if (showNoteEditor && editingNote) {
                  setNoteEditorContent(prev => prev + content);
                }
              }
            }}
            onNoteCreated={onNoteCreated}
          />
        ) : null}
      </div>

      {/* 跟随字幕区域 - 宽屏模式下隐藏 */}
      {!isWidescreenMode && (
        <div style={{ 
          padding: '16px 20px', 
          borderTop: '1px solid #f0f0f0',
          background: '#fff',
          flex: 3,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          minHeight: '500px'
        }}>


          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📄</span>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#1890ff' }}>
                {selectedMaterial?.type === 'live' ? '实时字幕' : '原文'}
              </Text>
            </div>
            <div style={{ 
              marginLeft: 'auto', 
              fontSize: '12px', 
              color: '#999',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>记时进度: {Math.round(videoProgress)}%</span>
              <div style={{
                width: '60px',
                height: '4px',
                background: '#f0f0f0',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${videoProgress}%`,
                  height: '100%',
                  background: '#1890ff',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          </div>
          
          {/* 字幕时间轴列表 */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            flex: 1,
            overflowY: 'auto',
            paddingRight: '4px'
          }}>
            {Array.isArray(subtitleData) && subtitleData.length > 0 && (
              console.log('[VideoView] subtitleData length:', subtitleData.length, 'last end:', subtitleData[subtitleData.length - 1].end)
            )}
            {subtitleData.map((subtitle, index) => {
              const isActive = currentSubtitle === subtitle.text;
              
              return (
                <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  {/* 时间轴标记 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: isActive ? '#1890ff' : '#d9d9d9',
                      marginBottom: '4px'
                    }} />
                    <Text style={{ 
                      fontSize: '12px', 
                      color: isActive ? '#1890ff' : '#999',
                      fontWeight: isActive ? 'bold' : 'normal'
                    }}>
                      {formatTime(subtitle.start)}
                    </Text>
                  </div>
                  
                  {/* 字幕内容 */}
                  <div style={{ 
                    flex: 1,
                    padding: '12px 16px',
                    background: isActive ? '#e6f3ff' : '#f8f9fa',
                    borderRadius: '8px',
                    border: isActive ? '1px solid #1890ff' : '1px solid #e8e8e8',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    userSelect: 'text'
                  }}
                  onClick={() => {
                    // 点击跳转到对应时间点
                    try {
                      const videoElement = document.querySelector('video');
                      if (videoElement) {
                        const targetTime = subtitle.start || 0;
                        videoElement.currentTime = targetTime;
                        // 若暂停则尝试播放，保证联动高亮
                        if (videoElement.paused) {
                          videoElement.play().catch(() => {});
                        }
                      } else {
                        message.warning('未找到视频播放器，请先打开视频');
                      }
                    } catch (err) {
                      console.error('跳转到字幕时间失败:', err);
                      message.error('跳转失败，请稍后重试');
                    }
                  }}
                  onMouseUp={(e) => handleSubtitleTextSelection(e, subtitle)}
                  >
                    <Text style={{ 
                      fontSize: '13px', 
                      lineHeight: '1.5',
                      color: isActive ? '#1890ff' : '#333',
                      fontWeight: isActive ? '500' : 'normal'
                    }}>
                      {subtitle.text}
                    </Text>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* 当前播放状态提示 */}
          {!currentSubtitle && (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: '#999',
              fontSize: '13px',
              fontStyle: 'italic'
            }}>
              字幕将在视频播放时自动跟随显示...
            </div>
          )}
        </div>
      )}

      {/* 字幕选择菜单 */}
      {subtitleMenuVisible && (
        <div
          style={{
            position: 'fixed',
            left: subtitleMenuPosition.x - 150,
            top: subtitleMenuPosition.y - 200,
            width: '300px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid #f0f0f0',
            zIndex: 1000,
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 菜单头部 */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <Text style={{ 
              fontSize: '14px', 
              color: '#0369a1',
              fontWeight: '500',
              display: 'block',
              marginBottom: '4px'
            }}>
              已选中内容
            </Text>
            <Text style={{ 
              fontSize: '12px', 
              color: '#666',
              lineHeight: '1.4',
              display: 'block',
              wordBreak: 'break-all'
            }}>
              "{selectedSubtitleText}"
            </Text>
          </div>

          {/* 菜单选项 */}
          <div style={{ padding: '8px' }}>
            {/* 一键摘取 */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '4px'
              }}
              className="subtitle-menu-item"
              onMouseEnter={(e) => {
                e.target.style.background = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
              onClick={handleQuickExtract}
            >
              <div style={{ fontSize: '20px' }}>📋</div>
              <div style={{ flex: 1 }}>
                <Text style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                  一键摘取
                </Text>
                <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '2px' }}>
                  📸 自动包含当前时刻截图
                </div>
              </div>
            </div>

            {/* 标记选项 */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '4px'
              }}
              className="subtitle-menu-item"
              onMouseEnter={(e) => {
                e.target.style.background = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
            >
              <div style={{ fontSize: '20px' }}>📌</div>
              <div style={{ flex: 1 }}>
                <Text style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                  标记
                </Text>
                <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '2px' }}>
                  📸 选择标记类型，自动截图保存
                </div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                {/* 标记颜色按钮 */}
                {['blue', 'pink', 'yellow', 'gray'].map(color => (
                  <div
                    key={color}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: color === 'blue' ? '#1890ff' : color === 'pink' ? '#eb2f96' : color === 'yellow' ? '#faad14' : '#8c8c8c',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    title={`${color === 'blue' ? '重要' : color === 'pink' ? '疑问' : color === 'yellow' ? '精彩' : '备注'}标记（含截图）`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkSubtitle(color);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.15) translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1) translateY(0)';
                      e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    }}
                  >
                    {color === 'blue' ? '!' : color === 'pink' ? '?' : color === 'yellow' ? '☆' : '●'}
                  </div>
                ))}
              </div>
            </div>

            {/* 播放音频 */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="subtitle-menu-item"
              onMouseEnter={(e) => {
                e.target.style.background = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
              onClick={handlePlayAudio}
            >
              <div style={{ fontSize: '20px' }}>▶️</div>
              <Text style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                播放音频
              </Text>
            </div>
          </div>
        </div>
      )}

      {/* 全局点击事件监听器 */}
      {subtitleMenuVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={handleClickOutside}
        />
      )}
    </div>
  );
};

export default VideoView;
