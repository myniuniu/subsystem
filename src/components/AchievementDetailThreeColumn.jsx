import React, { useMemo, useEffect, useState } from 'react';
import { Button, Typography, Card, message, Table, Tag, InputNumber, Input, Radio, Divider, Modal, Tooltip, Popover } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { VIEW_MODES } from '../constants/noteEditConstants';

const { Text } = Typography;

// 研修成果评阅三栏布局：左（基本信息与关联选择）、中（评阅清单）、右（附件预览）
const AchievementDetailThreeColumn = ({ state }) => {
  const achievement = state.leftPanelAchievementRecord;
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [leftViewMode, setLeftViewMode] = useState('cards');
  
  const assoc = state.achievementAssociations || {};
  const currentAssoc = achievement ? assoc[achievement.id] || { linkedOperationIds: [], linkedSourceIds: [] } : { linkedOperationIds: [], linkedSourceIds: [] };

  // 构建操作记录选项（来自右侧操作面板的 operationRecords）
  // 注意：应你的需求，左栏仅显示评阅清单，去除左栏的“基本信息/关联选择”块

  const submissions = useMemo(() => {
    const map = state.evaluationSubmissions || {};
    return Array.isArray(map[achievement?.id]) ? map[achievement.id] : [];
  }, [state.evaluationSubmissions, achievement]);

  // 评阅统计信息
  const totalCount = Array.isArray(submissions) ? submissions.length : 0;
  const scoredCount = Array.isArray(submissions) ? submissions.filter(s => typeof s.score === 'number').length : 0;

  useEffect(() => {
    if (!achievement) return;
    const map = state.evaluationSubmissions || {};
    const list = Array.isArray(map[achievement.id]) ? map[achievement.id] : [];
    if (list.length === 0) {
      const defaults = [
        {
          id: 'stu_001',
          name: '张三',
          attachments: [
            { id: 'att_001', type: 'text', name: '情景模拟反思：学生冲突管理', url: '' },
            { id: 'att_002', type: 'exam', name: '学生管理基础｜情景处置方案设计（100分）.pdf', url: '' },
            { id: 'att_003', type: 'link', name: '班级突发事件处置指引', url: '' },
            { id: 'att_004', type: 'live', name: '情景模拟：班级突发事件处置（直播演练）', url: '' }
          ],
          score: null,
          comment: '',
          reviewer: 'AI'
        },
        {
          id: 'stu_002',
          name: '李四',
          attachments: [
            { id: 'att_101', type: 'text', name: '课堂管理要点摘录', url: '' },
            { id: 'att_102', type: 'exam', name: '班级管理技巧测验（100分）.pdf', url: '' },
            { id: 'att_103', type: 'link', name: '家校沟通手册链接', url: '' }
          ],
          score: 85,
          comment: '整体较好，注意细节',
          reviewer: '人工'
        },
        {
          id: 'stu_003',
          name: '王五',
          attachments: [
            { id: 'att_201', type: 'live', name: '线上演示：课堂秩序维护', url: '' },
            { id: 'att_202', type: 'text', name: '反思日志：课堂秩序维护心得', url: '' }
          ],
          score: null,
          comment: '',
          reviewer: 'AI'
        }
      ];
      state.setEvaluationSubmissions(prev => ({ ...prev, [achievement.id]: defaults }));
    }
  }, [achievement]);

  const getAttachmentMeta = (type) => {
    switch(type) {
      case 'text': return { label: '文本', icon: '📝', color: 'gold' };
    case 'exam': return { label: '考试', icon: '🧪', color: 'green' };
      case 'link': return { label: '链接', icon: '🔗', color: 'geekblue' };
      case 'live': return { label: '直播', icon: '📡', color: 'volcano' };
      default: return { label: '附件', icon: '📄', color: 'blue' };
    }
  };

  const updateScore = (studentId, value) => {
    const num = typeof value === 'number' ? Math.max(0, Math.min(100, value)) : null;
    state.setEvaluationSubmissions(prev => {
      const next = {
        ...prev,
        [achievement.id]: (prev[achievement.id] || []).map(s => s.id === studentId ? { ...s, score: num, reviewer: '人工' } : s)
      };
      try { localStorage.setItem('evaluationSubmissions', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const updateComment = (studentId, value) => {
    state.setEvaluationSubmissions(prev => {
      const next = {
        ...prev,
        [achievement.id]: (prev[achievement.id] || []).map(s => s.id === studentId ? { ...s, comment: value } : s)
      };
      try { localStorage.setItem('evaluationSubmissions', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const handlePreviewAttachment = (studentId, attachment) => {
    setSelectedAttachment({ studentId, attachment });
    message.info(`打开附件预览：${attachment.name}`);
  };

  // 附件评语实时保存
  const updateAttachmentComment = (studentId, attachmentId, value) => {
    state.setEvaluationSubmissions(prev => {
      const list = prev[achievement.id] || [];
      const nextList = list.map(s => {
        if (s.id !== studentId) return s;
        const nextAtts = (s.attachments || []).map(a => a.id === attachmentId ? { ...a, comment: value } : a);
        return { ...s, attachments: nextAtts };
      });
      const next = { ...prev, [achievement.id]: nextList };
      try { localStorage.setItem('evaluationSubmissions', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // 评语弹窗
  const [commentModal, setCommentModal] = useState({ open: false, studentId: null, value: '' });
  const [openCommentPopover, setOpenCommentPopover] = useState(null); // { studentId, attachmentId }
  const openCommentModal = (record) => {
    setCommentModal({ open: true, studentId: record.id, value: record.comment || '' });
  };
  const closeCommentModal = () => setCommentModal({ open: false, studentId: null, value: '' });
  const confirmCommentModal = () => {
    if (commentModal.studentId) {
      updateComment(commentModal.studentId, commentModal.value);
      message.success('评语已保存');
    }
    closeCommentModal();
  };

  // 取消单独保存：评分与评语均实时保存

  const handleBack = () => {
    state.setLeftPanelAchievementRecord(null);
    state.setCurrentView(VIEW_MODES.MATERIALS);
  };

  if (!achievement) {
    return (
      <div style={{ flex: 1, background: '#fff', margin: '16px', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text type="secondary">未选择研修成果</Text>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 0, flex: 1 }}>
      {/* 左侧：评阅与提交清单 */}
      <div style={{ flex: 4.5, background: '#fff', margin: '16px 0 0 16px', borderRadius: 8, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: 12, borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8, background: '#fafafa' }}>
          <Button size="small" icon={<ArrowLeftOutlined />} onClick={handleBack}>返回</Button>
          <Text strong style={{ marginLeft: 8 }}>评阅与提交清单</Text>
          <div style={{ marginLeft: 'auto' }}>
            <Radio.Group
              size="small"
              value={leftViewMode}
              onChange={(e) => setLeftViewMode(e.target.value)}
            >
              <Radio.Button value="table">列表</Radio.Button>
              <Radio.Button value="cards">卡片</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div style={{ padding: 12, flex: 1 }}>
          <Card 
            size="small" 
            title={<span>评阅与提交清单</span>}
            extra={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Tag color="blue">共 {totalCount} 人</Tag>
                <Tag color="green">已评分 {scoredCount}</Tag>
              </div>
            }
          >
              {submissions && submissions.length > 0 ? (
                leftViewMode === 'table' ? (
                  <Table
                    size="small"
                    pagination={false}
                    rowKey={(r) => r.id}
                    dataSource={submissions}
                    columns={[
                      {
                        title: '学员',
                        dataIndex: 'name',
                        key: 'name',
                        width: 180,
                        render: (value, record) => (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Text>{record.name}</Text>
                            <Tag color={record.reviewer === 'AI' ? 'purple' : 'default'}>
                              {record.reviewer === 'AI' ? 'AI评阅' : '人工评阅'}
                            </Tag>
                          </div>
                        )
                      },
                      {
                        title: '附件',
                        key: 'attachments',
                        render: (_, record) => (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {(record.attachments || []).map(att => {
                              const meta = getAttachmentMeta(att.type);
                              const label = `${meta.icon} ${meta.label}｜${att.name}`;
                              const isActive = !!(selectedAttachment && selectedAttachment.studentId === record.id && selectedAttachment.attachment && selectedAttachment.attachment.id === att.id);
                              return (
                                <Tag
                                  key={att.id}
                                  color={isActive ? undefined : meta.color}
                                  style={{
                                    cursor: 'pointer',
                                    border: '1px solid #d9d9d9',
                                    background: isActive ? '#e6f7ff' : undefined,
                                    boxShadow: 'none'
                                  }}
                                  onClick={() => handlePreviewAttachment(record.id, att)}
                                >{label}</Tag>
                              );
                            })}
                          </div>
                        )
                      },
                      {
                        title: '评分',
                        dataIndex: 'score',
                        key: 'score',
                        width: 120,
                        render: (value, record) => (
                          <InputNumber
                            min={0}
                            max={100}
                            value={typeof value === 'number' ? value : undefined}
                            placeholder="0-100"
                            onChange={(v) => updateScore(record.id, v)}
                            style={{ width: '100%' }}
                          />
                        )
                      },
                      {
                        title: '评语',
                        key: 'comment_action',
                        render: (_, record) => (
                          <Tooltip title="填写评语">
                            <Button size="small" icon={<EditOutlined />} onClick={() => openCommentModal(record)}>
                              评语
                            </Button>
                          </Tooltip>
                        )
                      }
                    ]}
                  />
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                    {submissions.map((record) => (
                      <Card
                        key={record.id}
                        size="small"
                        style={{
                          border: '1px solid #f0f0f0',
                          boxShadow: 'none'
                        }}
                        title={(
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Text>{record.name}</Text>
                            <Tag color={record.reviewer === 'AI' ? 'purple' : 'default'}>
                              {record.reviewer === 'AI' ? 'AI评阅' : '人工评阅'}
                            </Tag>
                          </div>
                        )}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 220 }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, flex: 1 }}>
                            {(record.attachments || []).map(att => {
                              const meta = getAttachmentMeta(att.type);
                              const isActive = !!(selectedAttachment && selectedAttachment.studentId === record.id && selectedAttachment.attachment && selectedAttachment.attachment.id === att.id);
                              return (
                                <Card
                                  key={att.id}
                                  size="small"
                                  hoverable
                                  onClick={() => handlePreviewAttachment(record.id, att)}
                                  bodyStyle={{ padding: 10 }}
                                  style={{
                                    border: '1px solid #f0f0f0',
                                    boxShadow: 'none',
                                    background: isActive ? '#e6f7ff' : '#fff'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 18 }}>{meta.icon}</span>
                                    <div style={{ overflow: 'hidden', flex: 1 }}>
                                      <div style={{ fontWeight: 500 }}>{meta.label}</div>
                                      <div style={{ fontSize: 12, color: '#666', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                        {att.name}
                                      </div>
                                    </div>
                                    <Popover
                                      trigger="click"
                                      placement="right"
                                      open={!!openCommentPopover && openCommentPopover.studentId === record.id && openCommentPopover.attachmentId === att.id}
                                      onOpenChange={(open) => setOpenCommentPopover(open ? { studentId: record.id, attachmentId: att.id } : null)}
                                      content={
                                        <div style={{ width: 280 }}>
                                          <Input.TextArea
                                            autoSize={{ minRows: 3, maxRows: 6 }}
                                            maxLength={1000}
                                            showCount
                                            placeholder="添加附件评语（最多1000字）"
                                            value={(record.attachments || []).find(a => a.id === att.id)?.comment || ''}
                                            onChange={(e) => updateAttachmentComment(record.id, att.id, e.target.value)}
                                          />
                                        </div>
                                      }
                                    >
                                      <Tooltip title="附件评语">
                                        <Button type="text" size="small" icon={<EditOutlined />} onClick={(e) => e.stopPropagation()} />
                                      </Tooltip>
                                    </Popover>
                                  </div>
                                </Card>
                              );
                            })}
                          </div>
                          <Divider style={{ margin: '10px 0' }} />
                          <div style={{ marginTop: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Text>评分</Text>
                              <InputNumber
                                min={0}
                                max={100}
                                value={typeof record.score === 'number' ? record.score : undefined}
                                placeholder="0-100"
                                onChange={(v) => updateScore(record.id, v)}
                                style={{ width: 120 }}
                              />
                            </div>
                            <div style={{ marginTop: 8 }}>
                              <Input.TextArea
                                value={record.comment}
                                placeholder="添加评语或说明（最多1000字）"
                                onChange={(e) => updateComment(record.id, e.target.value)}
                                maxLength={1000}
                                showCount
                                autoSize={{ minRows: 2, maxRows: 4 }}
                                status={record.comment && record.comment.length >= 1000 ? 'error' : (record.comment && record.comment.length >= 950 ? 'warning' : undefined)}
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )
              ) : (
                <Text type="secondary">暂无学员提交清单，已为你准备示例数据，会自动初始化。</Text>
              )}
            </Card>
            <Modal
              open={commentModal.open}
              title="填写评语"
              onOk={confirmCommentModal}
              onCancel={closeCommentModal}
              okText="保存"
              cancelText="取消"
            >
              <Input.TextArea
                value={commentModal.value}
                onChange={(e) => {
                  const v = e.target.value;
                  setCommentModal(prev => ({ ...prev, value: v }));
                  if (commentModal.studentId) {
                    updateComment(commentModal.studentId, v);
                  }
                }}
                placeholder="请输入评语（最多1000字）"
                maxLength={1000}
                showCount
                autoSize={{ minRows: 4, maxRows: 8 }}
                status={commentModal.value && commentModal.value.length >= 1000 ? 'error' : (commentModal.value && commentModal.value.length >= 950 ? 'warning' : undefined)}
              />
            </Modal>
          </div>
        </div>
      

      {/* 右侧（合并中+右）：附件预览区 */}
      <div style={{ flex: 7, background: '#fff', margin: '16px 16px 0 16px', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 12, borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
          <Text strong>附件预览区</Text>
        </div>
        <div style={{ padding: 12, flex: 1 }}>
          {selectedAttachment ? (
            <Card size="small">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Text strong>附件预览：</Text>
                  {(() => {
                    const a = selectedAttachment.attachment || {};
                    const meta = getAttachmentMeta(a.type);
                    const stu = (submissions || []).find(s => s.id === selectedAttachment.studentId);
                    return (
                      <>
                        <Text>{`${meta.icon} ${meta.label}｜${a.name || ''}`}</Text>
                        <Tag>{`学员：${stu?.name || selectedAttachment.studentId}`}</Tag>
                      </>
                    );
                  })()}
                </div>
                <Button size="small" onClick={() => setSelectedAttachment(null)}>关闭预览</Button>
              </div>
              <div style={{ marginTop: 8, color: '#666' }}>
                <Text type="secondary">这是示例预览区域。若对接真实文件，可在此嵌入预览。</Text>
              </div>
            </Card>
          ) : (
            <Text type="secondary">点击左侧清单中的附件标签，将在此显示预览。</Text>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementDetailThreeColumn;