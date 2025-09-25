import React from 'react';
import {
  Button,
  Typography,
  Progress,
  message
} from 'antd';
import VideoPlayer from './VideoPlayer';
import {
  ArrowLeftOutlined
} from '@ant-design/icons';
import { formatTime, convertTimeToLinks } from '../utils/noteEditUtils';

const { Text } = Typography;

const VideoView = ({ state, handlers }) => {
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
    setOperationRecords
  } = state;

  const {
    onBackToMaterials,
    onVideoTimeUpdate,
    onNoteCreated
  } = handlers;

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
  const handleQuickExtract = () => {
    const timeText = formatTime(selectedSubtitleTime);
    
    // 如果右侧栏正在编辑主题，则添加到当前编辑的主题中
    if (rightPanelView === 'noteEditor' && rightPanelEditingNote) {
      const extractContent = `<p><strong>📝 [${timeText}]</strong> ${selectedSubtitleText}</p>`;
      const updatedContent = rightPanelNoteContent + extractContent;
      setRightPanelNoteContent(updatedContent);
      
      setSubtitleMenuVisible(false);
      message.success('内容已添加到当前笔记');
      return;
    }
    
    // 如果弹窗编辑器正在使用，则添加到弹窗编辑器中
    if (showNoteEditor && editingNote) {
      const extractContent = `<p><strong>📝 [${timeText}]</strong> ${selectedSubtitleText}</p>`;
      const updatedContent = noteEditorContent + extractContent;
      setNoteEditorContent(updatedContent);
      
      setSubtitleMenuVisible(false);
      message.success('内容已添加到当前笔记');
      return;
    }
    
    // 如果没有打开的笔记编辑器，则创建新笔记
    const newNote = {
      id: Date.now(),
      title: `【视频摘取】${selectedSubtitleText.length > 20 ? selectedSubtitleText.substring(0, 20) + '...' : selectedSubtitleText}`,
      source: `视频摘取 - ${selectedMaterial?.title || '视频'}`,
      time: '刚刚',
      type: 'note',
      content: `<p><strong>摘取内容：</strong>${selectedSubtitleText}</p><p><strong>时间点：</strong>${timeText}</p><p><strong>来源：</strong>${selectedMaterial?.title || '视频'}</p>`,
      videoId: selectedMaterial?.id,
      annotationTime: selectedSubtitleTime
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
    message.success('内容已摘取到新笔记');
  };

  // 处理标记操作
  const handleMarkSubtitle = (markType) => {
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
    
    // 如果右侧栏正在编辑主题，则添加到当前编辑的主题中
    if (rightPanelView === 'noteEditor' && rightPanelEditingNote) {
      const markContent = `<div style="background-color: ${markColors[markType]}20; padding: 8px; border-left: 4px solid ${markColors[markType]}; border-radius: 4px; margin: 8px 0;"><strong>${markIcon[markType]} [${timeText}] ${markNames[markType]}：</strong>${selectedSubtitleText}</div>`;
      const updatedContent = rightPanelNoteContent + markContent;
      setRightPanelNoteContent(updatedContent);
      
      setSubtitleMenuVisible(false);
      message.success(`${markNames[markType]}标记已添加到当前笔记`);
      return;
    }
    
    // 如果弹窗编辑器正在使用，则添加到弹窗编辑器中
    if (showNoteEditor && editingNote) {
      const markContent = `<div style="background-color: ${markColors[markType]}20; padding: 8px; border-left: 4px solid ${markColors[markType]}; border-radius: 4px; margin: 8px 0;"><strong>${markIcon[markType]} [${timeText}] ${markNames[markType]}：</strong>${selectedSubtitleText}</div>`;
      const updatedContent = noteEditorContent + markContent;
      setNoteEditorContent(updatedContent);
      
      setSubtitleMenuVisible(false);
      message.success(`${markNames[markType]}标记已添加到当前笔记`);
      return;
    }
    
    // 如果没有打开的笔记编辑器，则创建新笔记
    const newNote = {
      id: Date.now(),
      title: `【${markNames[markType]}标记】${selectedSubtitleText.length > 15 ? selectedSubtitleText.substring(0, 15) + '...' : selectedSubtitleText}`,
      source: `${markNames[markType]}标记 - ${selectedMaterial?.title || '视频'}`,
      time: '刚刚',
      type: 'note',
      content: `<p style="background-color: ${markColors[markType]}20; padding: 8px; border-left: 4px solid ${markColors[markType]}; border-radius: 4px;"><strong>【${markNames[markType]}标记】</strong>${selectedSubtitleText}</p><p><strong>时间点：</strong>${timeText}</p><p><strong>来源：</strong>${selectedMaterial?.title || '视频'}</p>`,
      videoId: selectedMaterial?.id,
      annotationTime: selectedSubtitleTime,
      markType: markType,
      markColor: markColors[markType]
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
    message.success(`已成功添加${markNames[markType]}标记`);
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 标题栏 */}
      <div style={{ 
        padding: '16px 20px', 
        borderBottom: '1px solid #f0f0f0',
        background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={onBackToMaterials}
              style={{ color: 'white', padding: '4px 8px' }}
              size="small"
            />
            <div>
              <Text style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                {selectedMaterial?.title || '视频标题'}
              </Text>
              {selectedMaterial?.instructor && (
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '2px' }}>
                  📚 讲师：{selectedMaterial.instructor}
                </div>
              )}
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
            {selectedMaterial?.duration && `时长：${selectedMaterial.duration}`}
          </div>
        </div>
      </div>

      {/* 摘要区域 */}
      <div style={{ 
        padding: '16px 20px', 
        borderBottom: '1px solid #f0f0f0',
        background: '#f8f9fa'
      }}>
        <Text style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
          📝 视频摘要：本视频主要介绍了{selectedMaterial?.title || '相关内容'}，包含了重要的学习要点和实际示例。适合初学者和进阶学习者观看。
        </Text>
      </div>

      {/* 视频播放器区域 */}
      <div style={{ 
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent'
      }}>
        {selectedMaterial && (
          <VideoPlayer
            visible={false}
            videoData={{
              ...selectedMaterial,
              startTime: videoStartTime
            }}
            embedded={true}
            style={{
              width: '100%'
            }}
            onTimeUpdate={onVideoTimeUpdate}
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
        )}
      </div>

      {/* 跟随字幕区域 */}
      <div style={{ 
        padding: '16px 20px', 
        borderTop: '1px solid #f0f0f0',
        background: '#fff',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>📄</span>
            <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#1890ff' }}>
              原文
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
            <span>进度: {Math.round(videoProgress)}%</span>
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
                  if (selectedMaterial) {
                    // 这里可以添加实际的视频跳转逻辑
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
              <Text style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                一键摘取
              </Text>
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
              <Text style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                标记
              </Text>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                {/* 标记颜色按钮 */}
                {['blue', 'pink', 'yellow', 'gray'].map(color => (
                  <div
                    key={color}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: color === 'blue' ? '#1890ff' : color === 'pink' ? '#eb2f96' : color === 'yellow' ? '#faad14' : '#8c8c8c',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      transition: 'transform 0.2s ease'
                    }}
                    title={color === 'blue' ? '重要' : color === 'pink' ? '疑问' : color === 'yellow' ? '精彩' : '备注'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkSubtitle(color);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
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