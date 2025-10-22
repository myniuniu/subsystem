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
  TagOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  BookOutlined,
  UserOutlined,
  BulbOutlined,
  NodeIndexOutlined,
  RadarChartOutlined,
  ExperimentOutlined,
  PushpinOutlined,
  PushpinFilled
} from '@ant-design/icons';
import { TRAINING_STATUS, getTrainingStatusInfo, parseTimeString } from '../utils/trainingStatusUtils';
import certificateService from '../services/certificateService';

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

  // 组织培训排序：进行中优先，其次未开始，其次无安排，最后已结束
  const sortOrganizationalNotes = (notes) => {
    return [...notes].sort((a, b) => {
      const aInfo = getTrainingStatusInfo(a);
      const bInfo = getTrainingStatusInfo(b);

      const getPriority = (info) => {
        if (info?.isInProgress) return 0;
        if (info?.isNotStarted) return 1;
        if (!info) return 2; // 无安排其次
        if (info?.isCompleted) return 3; // 已结束固定最后
        return 2;
      };

      const pa = getPriority(aInfo);
      const pb = getPriority(bInfo);
      if (pa !== pb) return pa - pb;

      // 二级排序：进行中组内按结束时间升序（更早截止更靠前），再按开始时间倒序
      const isInProgressGroup = (info) => {
        return info && info.status === TRAINING_STATUS.IN_PROGRESS;
      };
      if (isInProgressGroup(aInfo) && isInProgressGroup(bInfo)) {
        const aEnd = parseTimeString(a?.learningSchedule?.endTime);
        const bEnd = parseTimeString(b?.learningSchedule?.endTime);
        const aEndTime = aEnd ? aEnd.getTime() : Infinity;
        const bEndTime = bEnd ? bEnd.getTime() : Infinity;
        if (aEndTime !== bEndTime) return aEndTime - bEndTime; // 结束时间越早越靠前

        const aStart = parseTimeString(a?.learningSchedule?.startTime);
        const bStart = parseTimeString(b?.learningSchedule?.startTime);
        const aStartTime = aStart ? aStart.getTime() : -Infinity;
        const bStartTime = bStart ? bStart.getTime() : -Infinity;
        if (bStartTime !== aStartTime) return bStartTime - aStartTime; // 开始时间越晚越靠前
      }

      // 二级排序：在未开始和已结束组内，按开始时间倒序（最近的在前）
      const isGroupRequiringStartSort = (info) => {
        if (!info) return false;
        return info.status === TRAINING_STATUS.NOT_STARTED || info.status === TRAINING_STATUS.COMPLETED;
      };

      if (isGroupRequiringStartSort(aInfo) && isGroupRequiringStartSort(bInfo)) {
        const aStart = parseTimeString(a?.learningSchedule?.startTime);
        const bStart = parseTimeString(b?.learningSchedule?.startTime);
        const aTime = aStart ? aStart.getTime() : -Infinity;
        const bTime = bStart ? bStart.getTime() : -Infinity;
        // 倒序：更晚的开始时间在前
        if (bTime !== aTime) return bTime - aTime;
      }

      // 其他情况保持稳定或按标题作为最后兜底排序（避免闪动）
      const aTitle = String(a?.title || '').toLowerCase();
      const bTitle = String(b?.title || '').toLowerCase();
      if (aTitle < bTitle) return -1;
      if (aTitle > bTitle) return 1;
      return 0;
    });
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
    const sortedNotes = sortOrganizationalNotes(filteredNotes);
    return (
      <div className="learning-center-layout">
        {sortedNotes.map(note => {
          const trainingStatus = getTrainingStatusInfo(note);
          const isCompleted = trainingStatus && trainingStatus.isCompleted;
          
          return (
            <div key={note.id} className="learning-center-card" style={{
              background: isCompleted ? 'linear-gradient(135deg, #3a3a3a 0%, #1f1f1f 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '20px',
              color: 'white',
              boxShadow: isCompleted ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(102, 126, 234, 0.3)',
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
                {(() => {
                  const vi = note.videoInfo;
                  const hasVideoPercent = vi && (
                    (vi.type === 'single_video' && typeof vi.progress === 'number') ||
                    (vi.type === 'multi_video' && typeof vi.overallProgress === 'number')
                  );
                  const rawPercent = hasVideoPercent
                    ? (vi.type === 'single_video' ? vi.progress : vi.overallProgress)
                    : (typeof trainingStatus?.currentProgress === 'number' ? trainingStatus.currentProgress : 0);
                  const percent = Math.round(rawPercent);
                  const isAchieved = percent === 100;
                  const hasCert = !!certificateService.getCertificateByTopic(note.id);
                  if (!isAchieved || !hasCert) return null;
                  return (
                    <Button 
                      ghost
                      size="small"
                      icon={<FileTextOutlined />}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        window.location.hash = 'my-certificates';
                      }}
                      style={{ borderColor: 'rgba(255,255,255,0.8)', color: 'white', marginLeft: 8 }}
                    >
                      查看证书
                    </Button>
                  );
                })()}
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
                    background: note.pinned ? 'rgba(250,140,22,0.3)' : 'rgba(255,255,255,0.2)', 
                    border: 'none', 
                    color: 'white'
                  }}
                  onClick={(e) => { e.stopPropagation(); handleToggleStar(note.id); }}
                >
                  {note.pinned ? '📌 已置顶' : '📌 置顶'}
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
      {(() => {
        const notesToRender = selectedCategory === 'organizational_training'
          ? sortOrganizationalNotes(filteredNotes)
          : filteredNotes;
        return notesToRender;
      })().map(note => {
        const categoryInfo = getCategoryInfo(note.category);
        const isOrgTraining = (
          selectedCategory === 'organizational_training' ||
          note.category === 'organizational_training' ||
          note.courseType === 'organizational_training'
        );
        // 固定分类统一显示（知识图谱、能力模型、微专业）
        const fixedCategories = ['knowledge_graph', 'capability_model', 'micro_specialization'];
        const useSelectedFixed = fixedCategories.includes(selectedCategory);
        const targetCategory = isOrgTraining
          ? 'organizational_training'
          : (useSelectedFixed ? selectedCategory : (note.category || selectedCategory));

        const targetInfo = isOrgTraining ? null : getCategoryInfo(targetCategory);
        const displayLabel = isOrgTraining ? '组织培训' : (targetInfo?.label || categoryInfo.label);
        const iconName = isOrgTraining ? '🏢' : (targetInfo?.icon || categoryInfo.icon);

        const iconMap = {
          FileTextOutlined,
          FolderOpenOutlined,
          BookOutlined,
          UserOutlined,
          BulbOutlined,
          StarOutlined,
          NodeIndexOutlined,
          RadarChartOutlined,
          ExperimentOutlined
        };
        const isEmojiIcon = typeof iconName === 'string' && iconName.length <= 2;
        const IconComponent = !isEmojiIcon && typeof iconName === 'string' ? iconMap[iconName] : null;
        const trainingStatus = isOrgTraining ? getTrainingStatusInfo(note) : null;
        const isCompleted = trainingStatus && trainingStatus.status === TRAINING_STATUS.COMPLETED;
        
        // 培训需求管理分类的状态处理
        const isTrainingNeedsManagement = (
          selectedCategory === 'training_needs_management' ||
          note.category === 'training_needs_management'
        );
        
        // 培训需求管理状态配置
        const trainingNeedsStatusConfig = {
          planning: { label: '制定中', icon: '📋', color: '#1890ff' },
          implementing: { label: '实施中', icon: '🔄', color: '#52c41a' },
          completed: { label: '已结束', icon: '✅', color: '#8c8c8c' }
        };
        
        const needsStatus = isTrainingNeedsManagement && note.trainingStatus 
          ? trainingNeedsStatusConfig[note.trainingStatus] 
          : null;
        
        // 调试信息
        if (isTrainingNeedsManagement) {
          console.log('培训需求管理卡片:', {
            title: note.title,
            category: note.category,
            trainingStatus: note.trainingStatus,
            needsStatus: needsStatus
          });
        }
        return (
          <Col xs={24} sm={12} lg={8} xl={6} key={note.id}>
            <Card
              className="note-card"
              data-source={note.source}
              data-training-status={trainingStatus ? trainingStatus.status : undefined}
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
                <Tooltip title={note.pinned ? '取消置顶' : '置顶'}>
                  {note.pinned ? (
                    <PushpinFilled 
                      className="pin-filled"
                      onClick={(e) => { e.stopPropagation(); handleToggleStar(note.id); }} 
                    />
                  ) : (
                    <PushpinOutlined 
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
              {isOrgTraining && (() => {
                try {
                  const vi = note.videoInfo;
                  const percent = vi
                    ? (vi.type === 'single_video' ? (vi.progress || 0) : (vi.overallProgress || 0))
                    : (typeof getTrainingStatusInfo(note)?.currentProgress === 'number' ? getTrainingStatusInfo(note).currentProgress : 0);
                  const ts = getTrainingStatusInfo(note);
                  const hasCert = !!certificateService.getCertificateByTopic(note.id);
                  const isCompleted = ts?.isCompleted;
                  const p = Math.round(percent);
                  return (
                    <>
                      {isCompleted && p === 100 && hasCert && (
                        <div className="achieved-seal">已颁证</div>
                      )}
                      {isCompleted && p === 100 && !hasCert && (
                        <div className="achieved-seal">已达标</div>
                      )}
                      {isCompleted && p < 100 && (
                        <div className="not-achieved-seal">未达标</div>
                      )}
                    </>
                  );
                } catch (e) {
                  return null;
                }
              })()}
              <div className="note-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="note-category">
                  {isOrgTraining ? (
                    <span className="category-icon">🏢</span>
                  ) : isEmojiIcon ? (
                    <span className="category-icon">{iconName}</span>
                  ) : IconComponent ? (
                    <IconComponent className="category-icon" />
                  ) : (
                    <FileTextOutlined className="category-icon" />
                  )}
                  <Text type="secondary" className="category-text">
                    {displayLabel}
                  </Text>
                  {isOrgTraining && (() => {
                    try {
                      const ts = getTrainingStatusInfo(note);
                      return ts ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
                          <span style={{ fontSize: '12px' }}>{ts.statusConfig.icon}</span>
                          <Text style={{ fontSize: '12px', color: ts.statusConfig.color, fontWeight: 'bold' }}>
                            {ts.statusConfig.label}
                          </Text>
                        </div>
                      ) : null;
                    } catch (error) {
                      console.error('获取培训状态失败:', error);
                      return null;
                    }
                  })()}
                  {isOrgTraining && (() => {
                    const vi = note.videoInfo;
                    const percent = vi
                      ? (vi.type === 'single_video' ? (vi.progress || 0) : (vi.overallProgress || 0))
                      : (typeof getTrainingStatusInfo(note)?.currentProgress === 'number' ? getTrainingStatusInfo(note).currentProgress : 0);
                    return (
                      <div style={{ marginLeft: 8 }}>
                        <div style={{ width: 110 }}>
                          <Progress percent={Math.round(percent)} size="small" />
                        </div>
                      </div>
                    );
                  })()}
                </div>
                {/* 进度条与状态紧挨显示：移至左侧分类区域中 */}
                  {isOrgTraining && (() => {
                    const schedule = note.learningSchedule || {};
                    const ts = getTrainingStatusInfo(note);
                    const s = parseTimeString(schedule.startTime);
                    const e = parseTimeString(schedule.endTime);
                    const fmt = (d) => d ? `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}` : '';
                    const vi = note.videoInfo;
                    const percent = vi
                      ? (vi.type === 'single_video' ? (vi.progress || 0) : (vi.overallProgress || 0))
                      : (typeof ts?.currentProgress === 'number' ? ts.currentProgress : 0);
                    const isAchieved = Math.round(percent) === 100;
                    const hasCert = !!certificateService.getCertificateByTopic(note.id);
                    // 第二行元素：时间段、仅进行中显示剩余天数、查看证书
                    if (!s && !e && !(ts && ts.isInProgress && ts.remainingDays > 0) && !(isAchieved && hasCert)) return null;
                    const dateStr = `${s ? fmt(s) : ''}${s && e ? ' 至 ' : ''}${e ? fmt(e) : ''}`;
                    const showRemain = ts && ts.isInProgress && ts.remainingDays > 0;
                    return (
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 6 }}>
                        {dateStr && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 14 }}>⏰</span>
                            <Text type="secondary" style={{ fontSize: 12 }}>{dateStr}</Text>
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {showRemain && (
                            <Text style={{ fontSize: 12, color: '#f5222d' }}>
                              剩余{ts.remainingDays}天
                            </Text>
                          )}
                          {(isAchieved && hasCert) && (
                            <Button 
                              type="link"
                              size="small"
                              icon={<FileTextOutlined />}
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                window.location.hash = 'my-certificates';
                              }}
                            >
                              查看证书
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
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
              
              {/* 视频进度已移动到标题栏（组织培训分类） */}
              
              {/* 组织学习时间显示 - 已移动到标题栏第二行，删除正文区域 */}
              {/* 原区域已移除 */}
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