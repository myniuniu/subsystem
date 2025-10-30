import React, { useMemo, useEffect, useState } from 'react';
import { Button, Typography, Card, Select, message, Table, Tag, InputNumber, Input } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { VIEW_MODES, OPERATION_TYPES, OPERATION_TITLES } from '../constants/noteEditConstants';

const { Title, Text } = Typography;

// 研修成果详情左侧面板：支持关联操作记录与关联来源（未分类）
const AchievementDetailPanel = ({ state }) => {
  const achievement = state.leftPanelAchievementRecord;
  const isAttachmentsMode = !!(achievement && achievement.preferredView === 'attachments');
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  const assoc = state.achievementAssociations || {};
  const currentAssoc = achievement ? assoc[achievement.id] || { linkedOperationIds: [], linkedSourceIds: [] } : { linkedOperationIds: [], linkedSourceIds: [] };

  // 构建操作记录选项（来自右侧操作面板的 operationRecords）
  const operationOptions = useMemo(() => {
    const records = state.operationRecords || {};
    const items = [];
    const typeLabel = (type) => OPERATION_TITLES[type] || type;
    Object.keys(records).forEach(type => {
      const arr = Array.isArray(records[type]) ? records[type] : [];
      arr.forEach(r => {
        const id = r.id;
        const title = r.title || `未命名记录 ${id}`;
        items.push({ value: `${type}:${id}`, label: `${typeLabel(type)}｜${title}` });
      });
    });
    return items;
  }, [state.operationRecords]);

  const selectedValues = useMemo(() => {
    return (currentAssoc.linkedOperationIds || []).map(v => {
      // 值形如 `${type}:${id}`；若旧数据仅为id则尝试匹配类型
      return String(v);
    });
  }, [achievement, currentAssoc]);

  const handleBack = () => {
    state.setLeftPanelAchievementRecord(null);
    state.setCurrentView(VIEW_MODES.MATERIALS);
  };

  const updateLinkedOps = (values) => {
    // values: ["type:id", ...]
    state.setAchievementAssociations(prev => ({
      ...prev,
      [achievement.id]: {
        ...(prev[achievement.id] || { linkedOperationIds: [], attachments: [] }),
        // 记录研修成果标题，便于右侧操作记录卡片展示“被谁关联”
        title: achievement.title,
        linkedOperationIds: values
      }
    }));
    message.success('已更新关联的操作记录');
  };

  // 关联来源（未分类）选项构建（严格仅允许未分类模块）
  const sourceOptions = useMemo(() => {
    const options = [];
    const add = (type, id, labelText, raw) => options.push({ value: `${type}:${id}`, label: labelText, raw: { ...raw, type } });
    try {
      (state.addedTexts || []).forEach(t => add('text', t.id, `📝 文本｜${t.title || t.name || t.id}`, t));
      // 试卷统一按 exam 类型处理，便于与模块映射匹配
      (state.uploadedFiles || []).forEach(f => add('exam', f.id, `🧪 试卷｜${f.name || f.title || f.id}`, f));
      (state.courseVideos || []).forEach(v => add('video', v.id, `🎥 视频｜${v.title || v.name || v.id}`, v));
      (state.links || []).forEach(l => add('link', l.id, `🔗 链接｜${l.title || l.name || l.url || l.id}`, l));
      // 课程不参与未分类来源关联
      // (state.selectedCourses || []).forEach(c => add('course', c.id, `📚 课程｜${c.title || c.courseTitle || c.name || c.id}`, c));
      (state.liveStreams || []).forEach(s => add('live', s.id, `📡 直播｜${s.title || s.id}`, s));
      (state.examFiles || []).forEach(f => add('exam', f.id, `🧪 试卷｜${f.name || f.title || f.id}`, f));
      (state.trainingProjects || []).forEach(p => add('project', p.id, `📁 项目｜${p.title || p.name || p.id}`, p));
    } catch (e) {
      // no-op
    }
    // 若存在有效的模块归属映射，则仅过滤未分类模块的来源；若不存在映射，则回退显示全部
    const m = state.moduleAssignments || null;
    const hasValidAssignments = !!m && typeof m === 'object' && Object.values(m).some(map => map && Object.keys(map).length > 0);
    if (!hasValidAssignments) {
      return options;
    }
    const filtered = options.filter(opt => {
      const [type, id] = String(opt.value).split(':');
      const mapByType =
        type === 'live' ? m.live :
        type === 'video' ? m.videos :
        type === 'exam' ? m.exam :
        type === 'link' ? m.links :
        type === 'text' ? m.texts :
        type === 'project' ? m.projects : null;
      return !!mapByType && mapByType[id] === 'uncategorized';
    });
    return filtered;
  }, [state.addedTexts, state.uploadedFiles, state.courseVideos, state.links, state.selectedCourses, state.liveStreams, state.examFiles, state.trainingProjects, state.moduleAssignments]);

  const selectedSourceValues = useMemo(() => {
    return (currentAssoc.linkedSourceIds || []).map(v => String(v));
  }, [currentAssoc.linkedSourceIds]);

  const updateLinkedSources = (values) => {
    state.setAchievementAssociations(prev => ({
      ...prev,
      [achievement.id]: {
        ...(prev[achievement.id] || { linkedOperationIds: [], linkedSourceIds: [] }),
        title: achievement.title,
        linkedSourceIds: values
      }
    }));
    message.success('已更新关联来源');
  };

  const linkedRecords = useMemo(() => {
    const recordsMap = state.operationRecords || {};
    const values = Array.isArray(currentAssoc.linkedOperationIds) ? currentAssoc.linkedOperationIds : [];
    const result = [];
    values.forEach(v => {
      const str = String(v);
      let type = null; let id = null;
      if (str.includes(':')) {
        const parts = str.split(':');
        type = parts[0];
        id = parts[1];
      } else {
        id = str;
      }
      let record = null;
      if (type && Array.isArray(recordsMap[type])) {
        record = recordsMap[type].find(r => String(r.id) === String(id));
      } else {
        // 兼容旧数据：仅有id时，遍历所有类型查找
        for (const t of Object.keys(recordsMap)) {
          const arr = recordsMap[t] || [];
          const found = arr.find(r => String(r.id) === String(id));
          if (found) { record = found; type = t; break; }
        }
      }
      if (record) result.push({ ...record, type: record.type || type });
    });
    return result;
  }, [currentAssoc.linkedOperationIds, state.operationRecords]);

  // 已选择的来源数据（从 sourceOptions 反查 raw）
  const selectedSourceItems = useMemo(() => {
    const index = {};
    (Array.isArray(sourceOptions) ? sourceOptions : []).forEach(opt => { index[String(opt.value)] = opt.raw; });
    const values = Array.isArray(selectedSourceValues) ? selectedSourceValues : [];
    const list = values.map(v => {
      const raw = index[String(v)] || null;
      if (!raw) return null;
      const parts = String(v).split(':');
      const type = parts[0];
      const id = parts[1];
      return { ...raw, type, id };
    }).filter(Boolean);
    return list;
  }, [selectedSourceValues, sourceOptions]);

  const getIcon = (type) => {
    switch(type) {
      case 'audio': return '音';
      case 'video': return '视';
      case 'mindmap': return '思';
      case 'report': return '报';
      case 'ppt': return 'PPT';
      case 'webcode': return '💻';
      case 'scenario': return '场';
      case 'note': return '笔';
      case 'question': return '题';
      case 'learning-plan': return '计';
      case 'grading': return '阅';
      case 'knowledge-graph': return '知';
      case 'training-plan': return '培';
      // 来源类型图标
      case 'text': return '文';
      case 'file': return '📄';
      case 'link': return '链';
      case 'course': return '课';
      case 'live': return '播';
      case 'exam': return '卷';
      case 'project': return '项';
      default: return '📄';
    }
  };

  const handleSave = () => {
    try {
      const data = state.achievementAssociations || {};
      // 持久化到本地存储（前端示例保存）
      localStorage.setItem('achievementAssociations', JSON.stringify(data));
      message.success('研修成果关联已保存');
    } catch (e) {
      message.error('保存失败');
    }
  };

  // 附件类型元数据（用于图标与颜色）
  const getAttachmentMeta = (type) => {
    switch(type) {
      case 'text': return { label: '文本', icon: '📝', color: 'gold' };
      case 'exam': return { label: '试卷', icon: '🧪', color: 'green' };
      case 'link': return { label: '链接', icon: '🔗', color: 'geekblue' };
      case 'live': return { label: '直播', icon: '📡', color: 'volcano' };
      default: return { label: '附件', icon: '📄', color: 'blue' };
    }
  };

  // 初始化评阅清单（示例数据），仅当当前成果没有评阅数据时
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
            { id: 'att_005', type: 'text', name: '课堂管理反思：规则与激励', url: '' },
            { id: 'att_006', type: 'exam', name: '班级管理｜课堂秩序维护方案（80分）.pdf', url: '' },
            { id: 'att_007', type: 'link', name: '家校沟通要点清单', url: '' }
          ],
          score: null,
          comment: '',
          reviewer: 'AI'
        },
        {
          id: 'stu_003',
          name: '王五',
          attachments: [
            { id: 'att_008', type: 'live', name: '直播演练：课堂突发情况应对', url: '' },
            { id: 'att_009', type: 'text', name: '班级突发事件复盘记录', url: '' }
          ],
          score: null,
          comment: '',
          reviewer: 'AI'
        },
        {
          id: 'stu_004',
          name: '赵六',
          attachments: [
            { id: 'att_010', type: 'exam', name: '学生冲突管理｜情境判断题（95分）.pdf', url: '' },
            { id: 'att_011', type: 'link', name: '心理辅导资源汇总', url: '' }
          ],
          score: null,
          comment: '',
          reviewer: 'AI'
        }
      ];
      state.setEvaluationSubmissions(prev => ({
        ...prev,
        [achievement.id]: defaults
      }));
    }
  }, [achievement]);

  const submissions = useMemo(() => {
    const map = state.evaluationSubmissions || {};
    return Array.isArray(map[achievement?.id]) ? map[achievement.id] : [];
  }, [state.evaluationSubmissions, achievement]);

  const updateScore = (studentId, value) => {
    const num = typeof value === 'number' ? Math.max(0, Math.min(100, value)) : null;
    state.setEvaluationSubmissions(prev => ({
      ...prev,
      [achievement.id]: (prev[achievement.id] || []).map(s => s.id === studentId ? { ...s, score: num, reviewer: '人工' } : s)
    }));
  };

  const updateComment = (studentId, value) => {
    state.setEvaluationSubmissions(prev => ({
      ...prev,
      [achievement.id]: (prev[achievement.id] || []).map(s => s.id === studentId ? { ...s, comment: value } : s)
    }));
  };

  const handlePreviewAttachment = (studentId, attachment) => {
    setSelectedAttachment({ studentId, attachment });
    message.info(`打开附件预览：${attachment.name}`);
  };

  const handleSaveEvaluations = () => {
    try {
      const map = state.evaluationSubmissions || {};
      localStorage.setItem('evaluationSubmissions', JSON.stringify(map));
      message.success('评分与备注已保存');
    } catch (e) {
      message.error('保存评分失败');
    }
  };

  if (!achievement) {
    return (
      <div style={{ flex: 4, background: '#fff', margin: '16px 0 0 16px', borderRadius: 8, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 12, borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
          <Button size="small" icon={<ArrowLeftOutlined />} onClick={handleBack}>返回</Button>
        </div>
        <div style={{ padding: 24 }}>
          <Text type="secondary">未选择研修成果</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 4, background: '#fff', margin: '16px 0 0 16px', borderRadius: 8, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 12, borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8, background: '#fafafa' }}>
        <Button size="small" icon={<ArrowLeftOutlined />} onClick={handleBack}>返回</Button>
        <Text strong style={{ marginLeft: 8 }}>研修成果详情</Text>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {(() => { console.log('📄 AchievementDetailPanel 渲染', { achievementTitle: achievement?.title, achievementId: achievement?.id }); })()}
        {/* 基本信息 */}
        <Card size="small" title={<span>基本信息</span>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Text>成果标题：{achievement.title || '未命名成果'}</Text>
            {achievement.description && <Text type="secondary">说明：{achievement.description}</Text>}
            <Text type="secondary">ID：{String(achievement.id)}</Text>
          </div>
        </Card>

        {/* 关联操作记录 */}
        <Card size="small" title={<span>关联操作记录</span>}>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="选择需要关联的操作记录"
            value={selectedValues}
            options={operationOptions}
            onChange={updateLinkedOps}
          />
          {/* 已关联的操作记录卡片显示 */}
          {Array.isArray(linkedRecords) && linkedRecords.length > 0 && (
            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
              {linkedRecords.map(r => (
                <Card key={`linked-op-${r.id}`} size="small" styles={{ body: { padding: '8px 12px' } }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <span style={{ fontSize: 12, color: '#999' }}>{getIcon(r.type)}</span>
                      <Text strong style={{ fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</Text>
                    </div>
                    <Tag color="blue">{OPERATION_TITLES[r.type] || r.type}</Tag>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* 关联来源（未分类） */}
        <Card size="small" title={<span>关联来源（仅未分类模块）</span>}>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="选择作为来源的资料（来自未分类模块）"
            value={selectedSourceValues}
            options={sourceOptions}
            onChange={updateLinkedSources}
          />
          {/* 已关联的来源数据卡片显示 */}
          {Array.isArray(selectedSourceItems) && selectedSourceItems.length > 0 && (
            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
              {selectedSourceItems.map(item => {
                const meta = getAttachmentMeta(item.type);
                const label = `${meta.icon} ${meta.label}`;
                return (
                  <Card key={`linked-src-${item.type}-${item.id}`} size="small" styles={{ body: { padding: '8px 12px' } }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <Tag color={meta.color}>{label}</Tag>
                        <Text strong style={{ fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title || item.name || item.url || String(item.id)}</Text>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Card>

        {/* 评阅与提交清单（左侧内联显示） - 仅在非附件模式下显示 */}
        {!isAttachmentsMode && (
        <Card size="small" title={<span>评阅与提交清单（左侧内联显示）</span>} extra={
          <Button size="small" type="primary" onClick={handleSaveEvaluations}>保存评分</Button>
        }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {submissions && submissions.length > 0 ? (
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
                          return (
                            <Tag
                              key={att.id}
                              color={meta.color}
                              style={{ cursor: 'pointer' }}
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
                    title: '备注',
                    dataIndex: 'comment',
                    key: 'comment',
                    render: (value, record) => (
                      <Input
                        value={value}
                        placeholder="添加评语或说明"
                        onChange={(e) => updateComment(record.id, e.target.value)}
                      />
                    )
                  }
                ]}
              />
            ) : (
              <Text type="secondary">暂无学员提交清单，已为你准备示例数据，会自动初始化。</Text>
            )}

            {selectedAttachment && (
              <Card size="small" styles={{ body: { padding: '8px 12px' } }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text strong>附件预览：</Text>
                    {(() => {
                      const a = selectedAttachment.attachment || {};
                      const meta = getAttachmentMeta(a.type);
                      return <Text>{`${meta.icon} ${meta.label}｜${a.name || ''}`}</Text>;
                    })()}
                  </div>
                  <Button size="small" onClick={() => setSelectedAttachment(null)}>关闭预览</Button>
                </div>
                <div style={{ marginTop: 8, color: '#666' }}>
                  <Text type="secondary">这是示例预览区域。若对接真实文件，可在此嵌入预览。</Text>
                </div>
              </Card>
            )}
          </div>
        </Card>
        )}
      </div>
    </div>
  );
};

export default AchievementDetailPanel;