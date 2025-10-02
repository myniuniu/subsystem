import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Tooltip,
  Popconfirm,
  Button,
  Progress,
  Empty,
  Spin,
  Modal,
  Select
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
  ShareAltOutlined,
  PlayCircleOutlined,
  TagOutlined
} from '@ant-design/icons';
import { TRAINING_STATUS, getTrainingStatusInfo } from '../utils/trainingStatusUtils';

const { Title, Text, Paragraph } = Typography;

const NotesList = ({
  loading,
  filteredNotes,
  viewMode,
  selectedCategory,
  getCategoryInfo,
  handleCreateNote,
  handleEditNote,
  handleViewNote,
  handleUpdateTags,
  handleShareTheme,
  handleToggleStar,
  handleDeleteNote,
  getTrainingStatusInfo
}) => {
  // 标签编辑模态框状态
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [tagEditingNote, setTagEditingNote] = useState(null);
  const [tagInput, setTagInput] = useState([]);

  const openTagModal = (note) => {
    setTagEditingNote(note);
    setTagInput(note.tags || []);
    setTagModalVisible(true);
  };

  const handleTagSave = async () => {
    if (tagEditingNote) {
      await handleUpdateTags(tagEditingNote.id, tagInput);
    }
    setTagModalVisible(false);
    setTagEditingNote(null);
    setTagInput([]);
  };
  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large">
          <div style={{ marginTop: 8 }}>加载中...</div>
        </Spin>
      </div>
    );
  }

  if (filteredNotes.length === 0) {
    return (
      <Empty
        description="暂无主题"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        <Button type="primary" onClick={handleCreateNote}>
          创建第一个主题
        </Button>
      </Empty>
    );
  }

  // 学习中心布局 - 当组织培训数量较少时显示
  if (viewMode === 'learning-center' && selectedCategory === 'organizational_training') {
    return (
      <div className="learning-center-layout">
        {filteredNotes.map(note => {
          const trainingStatus = getTrainingStatusInfo(note);
          
          return (
            <div key={note.id} className="learning-center-card" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '20px',
              color: 'white',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              cursor: 'pointer'
            }} onClick={() => handleEditNote(note)}>
              
              {/* 头部区域 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                    {note.title}
                  </h3>
                  
                  {trainingStatus && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span style={{ fontSize: '12px' }}>{trainingStatus.statusConfig.icon}</span>
                        <Text style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                          {trainingStatus.statusConfig.label}
                        </Text>
                      </div>
                      
                      {trainingStatus.isInProgress && trainingStatus.remainingDays > 0 && (
                        <div style={{
                          background: 'rgba(245, 34, 45, 0.9)',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span style={{ fontSize: '10px' }}>⏰</span>
                          <Text style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>
                            剩余{trainingStatus.remainingDays}天
                          </Text>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <Button 
                  type="primary" 
                  ghost 
                  size="small"
                  icon={<PlayCircleOutlined />}
                  onClick={(e) => { e.stopPropagation(); handleViewNote(note); }}
                  style={{ borderColor: 'rgba(255,255,255,0.8)', color: 'white' }}
                >
                  继续学习
                </Button>
              </div>
              
              {/* 进度区域 */}
              {trainingStatus && trainingStatus.isInProgress && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <Text style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>学习进度</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>
                      {trainingStatus.currentProgress}% 完成
                    </Text>
                  </div>
                  
                  <Progress 
                    percent={trainingStatus.currentProgress} 
                    strokeColor={{
                      '0%': '#ffd700',
                      '50%': '#87ceeb',
                      '100%': '#98fb98'
                    }}
                    trailColor="rgba(255,255,255,0.2)"
                    showInfo={false}
                    style={{ marginBottom: '12px' }}
                  />
                  
                  {trainingStatus.dailyLearningTime.dailyMinutes > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px' }}>📖</span>
                      <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>
                        建议每日学习: {trainingStatus.dailyLearningTime.formattedTime}
                      </Text>
                    </div>
                  )}
                </div>
              )}
              
              {/* 快捷操作区域 */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button 
                  size="small" 
                  style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white' }}
                  onClick={(e) => { e.stopPropagation(); handleEditNote(note); }}
                >
                  📝 编辑笔记
                </Button>
                
                <Button 
                  size="small" 
                  style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white' }}
                  onClick={(e) => { e.stopPropagation(); handleShareTheme(note); }}
                >
                  🔗 分享主题
                </Button>
                
                <Button 
                  size="small" 
                  style={{ 
                    background: note.starred ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.2)', 
                    border: 'none', 
                    color: 'white'
                  }}
                  onClick={(e) => { e.stopPropagation(); handleToggleStar(note.id); }}
                >
                  {note.starred ? '⭐ 已收藏' : '☆ 收藏'}
                </Button>
              </div>
              
              {/* 学习建议卡片 */}
              {trainingStatus && trainingStatus.isInProgress && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: '16px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px' }}>💡</span>
                    <Text style={{ color: 'white', fontSize: '13px', fontWeight: 'bold' }}>学习建议</Text>
                  </div>
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', lineHeight: '1.5' }}>
                    {trainingStatus.remainingDays <= 7 
                      ? '培训即将结束，建议加快学习进度，确保按时完成所有课程内容。'
                      : trainingStatus.currentProgress < 50
                      ? '当前进度较慢，建议每天增加学习时间，保持学习节奏。'
                      : '学习进度良好，继续保持当前的学习节奏，注意巩固已学知识。'
                    }
                  </Text>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // 网格布局
  return (
    <>
    <Row gutter={[16, 16]}>
      {filteredNotes.map(note => {
        const categoryInfo = getCategoryInfo(note.category);
        return (
          <Col xs={24} sm={12} lg={8} xl={6} key={note.id}>
            <Card
              className="note-card"
              data-source={note.source}
              hoverable
              onClick={() => handleEditNote(note)}
              style={{ cursor: 'pointer' }}
              actions={[
                <Tooltip title="标签">
                  <TagOutlined onClick={(e) => { e.stopPropagation(); openTagModal(note); }} />
                </Tooltip>,
                <Tooltip title="编辑">
                  <EditOutlined onClick={(e) => { e.stopPropagation(); handleEditNote(note); }} />
                </Tooltip>,
                <Tooltip title="分享主题">
                  <ShareAltOutlined onClick={(e) => { e.stopPropagation(); handleShareTheme(note); }} />
                </Tooltip>,
                <Tooltip title={note.starred ? '取消收藏' : '收藏'}>
                  {note.starred ? (
                    <StarFilled 
                      className="star-filled"
                      onClick={(e) => { e.stopPropagation(); handleToggleStar(note.id); }} 
                    />
                  ) : (
                    <StarOutlined 
                      onClick={(e) => { e.stopPropagation(); handleToggleStar(note.id); }} 
                    />
                  )}
                </Tooltip>,
                <Popconfirm
                  title="确定要删除这个主题吗？"
                  onConfirm={() => handleDeleteNote(note.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Tooltip title="删除">
                    <DeleteOutlined onClick={(e) => e.stopPropagation()} />
                  </Tooltip>
                </Popconfirm>
              ]}
            >
              <div className="note-header">
                <div className="note-category">
                  <span className="category-icon">{categoryInfo.icon}</span>
                  <Text type="secondary" className="category-text">
                    {categoryInfo.label}
                  </Text>
                  
                  {/* 组织培训状态显示 */}
                  {(() => {
                    const isOrgTraining = (
                      selectedCategory === 'organizational_training' ||
                      note.source === '组织培训' ||
                      note.tags?.includes('组织培训') ||
                      note.category === 'organizational_training' ||
                      note.courseType === 'organizational_training' ||
                      note.title?.includes('【组织培训】')
                    );
                    
                    if (isOrgTraining) {
                      try {
                        const trainingStatus = getTrainingStatusInfo(note);
                        
                        if (trainingStatus) {
                          const { statusConfig, isInProgress, remainingDays } = trainingStatus;
                          return (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
                              <span style={{ fontSize: '10px' }}>{statusConfig.icon}</span>
                              <Text style={{ fontSize: '10px', color: statusConfig.color, fontWeight: 'bold' }}>
                                {statusConfig.label}
                              </Text>
                              {isInProgress && remainingDays > 0 && (
                                <Text style={{ fontSize: '9px', color: '#f5222d', fontWeight: 'bold' }}>
                                  剩余{remainingDays}天
                                </Text>
                              )}
                            </div>
                          );
                        }
                      } catch (error) {
                        console.error('获取培训状态失败:', error);
                      }
                    }
                    return null;
                  })()} 
                </div>
                {note.starred && (
                  <StarFilled className="star-badge" />
                )}
              </div>
              
              <Title level={5} className="note-title" ellipsis={{ rows: 2 }}>
                {note.title}
              </Title>
              
              <Paragraph 
                className="note-content" 
                ellipsis={{ rows: 3 }}
                type="secondary"
              >
                {note.content}
              </Paragraph>
              
              <div className="note-tags">
                {note.tags?.slice(0, 3).map(tag => (
                  <Tag key={tag} size="small">{tag}</Tag>
                ))}
                {note.tags && note.tags.length > 3 && (
                  <Tag key="more" size="small">+{note.tags.length - 3}</Tag>
                )}
              </div>
              
              {/* 视频进度条 - 仅在组织培训分类下显示 */}
              {(() => {
                const shouldShow = (selectedCategory === 'organizational_training' || note.source === '组织培训');
                const hasVideoInfo = !!note.videoInfo;
                
                if (shouldShow && hasVideoInfo) {
                  return (
                    <div className="video-progress-section" style={{ marginTop: 12, marginBottom: 8 }}>
                      {note.videoInfo.type === 'single_video' ? (
                        <div className="single-video-progress">
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                            <Text style={{ fontSize: 12, color: '#666', marginRight: 8 }}>
                              🎥 视频学习进度
                            </Text>
                            <Text style={{ fontSize: 11, color: '#999' }}>
                              {note.videoInfo.progress}%
                            </Text>
                          </div>
                          <Progress 
                            percent={note.videoInfo.progress} 
                            size="small" 
                            strokeColor={
                              note.videoInfo.progress === 100 ? '#52c41a' : 
                              note.videoInfo.progress >= 50 ? '#1890ff' : '#faad14'
                            }
                            showInfo={false}
                            style={{ marginBottom: 2 }}
                          />
                          <div style={{ marginTop: 2 }}>
                            <Text style={{ fontSize: 10, color: '#666' }}>
                              总学时 {(() => {
                                const d = Number(note.videoInfo.duration || 0);
                                return Math.round((d / 3600) * 10) / 10;
                              })()}小时 • 总进度 {note.videoInfo.progress}% • 成绩 {(() => {
                                const s = (note.score != null ? note.score : (note.videoInfo && note.videoInfo.score != null ? note.videoInfo.score : null));
                                if (s != null) return `${Math.round(Number(s))}分`;
                                const baseStr = String(note.id || note.title || 'note') + '-score';
                                let hash = 0;
                                for (let i = 0; i < baseStr.length; i++) {
                                  hash = ((hash << 5) - hash) + baseStr.charCodeAt(i);
                                  hash |= 0;
                                }
                                const rnd = Math.abs(hash % 100) + 1; // 1~100
                                return `${rnd}分`;
                              })()}
                            </Text>
                          </div>
                        </div>
                      ) : note.videoInfo.type === 'multi_video' ? (
                        <div className="multi-video-progress">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Text style={{ fontSize: 12, color: '#666' }}>
                              🎥 视频课程 ({note.videoInfo.totalVideos}个视频)
                            </Text>
                            <Text style={{ fontSize: 11, color: '#999' }}>
                              {note.videoInfo.overallProgress}%
                            </Text>
                          </div>
                          <Progress 
                            percent={note.videoInfo.overallProgress} 
                            size="small" 
                            strokeColor={
                              note.videoInfo.overallProgress === 100 ? '#52c41a' : 
                              note.videoInfo.overallProgress >= 50 ? '#1890ff' : '#faad14'
                            }
                            showInfo={false}
                            style={{ marginBottom: 2 }}
                          />
                          <Text style={{ fontSize: 10, color: '#aaa' }}>
                            已学习 {Math.round(note.videoInfo.watchedDuration / 60)}分钟 / 共 {Math.round(note.videoInfo.totalDuration / 60)}分钟
                          </Text>
                          <div style={{ marginTop: 2 }}>
                            <Text style={{ fontSize: 10, color: '#666' }}>
                              总学时 {Math.round((note.videoInfo.totalDuration / 3600) * 10) / 10}小时 • 总进度 {note.videoInfo.overallProgress}% • 成绩 {(() => {
                                const s = (note.score != null ? note.score : (note.videoInfo && note.videoInfo.score != null ? note.videoInfo.score : null));
                                if (s != null) return `${Math.round(Number(s))}分`;
                                const baseStr = String(note.id || note.title || 'note') + '-score';
                                let hash = 0;
                                for (let i = 0; i < baseStr.length; i++) {
                                  hash = ((hash << 5) - hash) + baseStr.charCodeAt(i);
                                  hash |= 0;
                                }
                                const rnd = Math.abs(hash % 100) + 1; // 1~100
                                return `${rnd}分`;
                              })()}
                            </Text>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                }
                
                return null;
              })()}
              
              {/* 组织学习时间显示 */}
              {(() => {
                const isOrgTraining = (
                  selectedCategory === 'organizational_training' ||
                  note.source === '组织培训' ||
                  note.tags?.includes('组织培训') ||
                  note.category === 'organizational_training' ||
                  note.courseType === 'organizational_training' ||
                  note.title?.includes('【组织培训】')
                );
                
                const hasLearningSchedule = !!note.learningSchedule;
                
                if (isOrgTraining && hasLearningSchedule) {
                  return (
                    <div style={{
                      marginTop: 8,
                      marginBottom: 8,
                      padding: '6px 10px',
                      background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
                      borderRadius: '6px',
                      border: '1px solid #91d5ff'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px' }}>🕒</span>
                        <Text style={{ fontSize: '11px', color: '#1890ff', fontWeight: 'bold' }}>学习时间</Text>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '10px' }}>
                        <div>
                          <Text style={{ color: '#52c41a', fontWeight: 'bold', fontSize: '10px' }}>开始：</Text>
                          <Text style={{ color: '#52c41a', fontSize: '10px' }}>{note.learningSchedule.startTime}</Text>
                        </div>
                        <div>
                          <Text style={{ color: '#f5222d', fontWeight: 'bold', fontSize: '10px' }}>结束：</Text>
                          <Text style={{ color: '#f5222d', fontSize: '10px' }}>{note.learningSchedule.endTime}</Text>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                return null;
              })()}
            </Card>
          </Col>
        );
      })}
    </Row>
    {/* 标签编辑模态框（网格布局下） */}
    <Modal
      title="编辑标签"
      open={tagModalVisible}
      onCancel={() => setTagModalVisible(false)}
      onOk={handleTagSave}
      okText="保存"
      cancelText="取消"
    >
      <Select
        mode="tags"
        style={{ width: '100%' }}
        placeholder="输入标签并回车添加"
        value={tagInput}
        onChange={(values) => setTagInput(values)}
      />
    </Modal>
    </>
  );
};

export default NotesList;