import React, { useMemo } from 'react';
import { Button, Typography, Card, Select, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { VIEW_MODES, OPERATION_TYPES, OPERATION_TITLES } from '../constants/noteEditConstants';

const { Title, Text } = Typography;

// 研修成果详情左侧面板：支持关联操作记录与关联来源（未分类）
const AchievementDetailPanel = ({ state }) => {
  const achievement = state.leftPanelAchievementRecord;

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
        <Card size="small" title={<span>基本信息</span>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <Text strong>标题：</Text>
              <Text>{achievement.title}</Text>
            </div>
            {achievement.description && (
              <div>
                <Text strong>描述：</Text>
                <Text type="secondary">{achievement.description}</Text>
              </div>
            )}
            {typeof achievement.score !== 'undefined' && (
              <div>
                <Text strong>成绩：</Text>
                <Text>{achievement.score}</Text>
              </div>
            )}
          </div>
        </Card>

        <Card size="small" title={<span>关联操作记录</span>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Text type="secondary">从右侧操作面板生成的记录中选择要关联的项（内联，不弹窗）。</Text>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="选择要关联的操作记录"
              value={selectedValues}
              onChange={updateLinkedOps}
              options={operationOptions}
              optionFilterProp="label"
              showSearch
            />
            {/* 已关联的操作记录卡片展示 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {linkedRecords.length > 0 ? linkedRecords.map(rec => (
                <Card key={`linked-${rec.type}-${rec.id}`} size="small" styles={{ body: { padding: '8px 12px' } }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        marginRight: '8px',
                        flexShrink: 0
                      }}>
                        {getIcon(rec.type)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
                        <Text ellipsis style={{ fontSize: '12px', fontWeight: 500 }}>{rec.title}</Text>
                        <Text style={{ fontSize: '10px', color: '#999' }}>{rec.source}</Text>
                        <Text style={{ fontSize: '10px', color: '#999' }}>{rec.time}</Text>
                      </div>
                    </div>
                  </div>
                </Card>
              )) : (
                <Text type="secondary" style={{ fontSize: 12 }}>暂无关联的操作记录</Text>
              )}
            </div>
          </div>
        </Card>

        <Card size="small" title={<span>关联来源（未分类）</span>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Text type="secondary">从未分类模块中的来源选择要关联的项（内联选择）。</Text>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="选择要关联的来源"
              value={selectedSourceValues}
              onChange={updateLinkedSources}
              options={sourceOptions}
              optionFilterProp="label"
              showSearch
            />
            {/* 已关联的来源卡片展示 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {(() => {
                // 根据选中的值映射到原始来源数据
                const values = Array.isArray(currentAssoc.linkedSourceIds) ? currentAssoc.linkedSourceIds : [];
                const sourceMap = {};
                sourceOptions.forEach(opt => { sourceMap[String(opt.value)] = opt.raw; });
                const linked = values.map(v => ({
                  key: String(v),
                  raw: sourceMap[String(v)]
                })).filter(item => !!item.raw);
                return linked.length > 0 ? linked.map(item => (
                  <Card key={`source-${item.key}`} size="small" styles={{ body: { padding: '8px 12px' } }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          marginRight: '8px',
                          flexShrink: 0
                        }}>
                          {getIcon(item.raw.type)}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
                          <Text ellipsis style={{ fontSize: '12px', fontWeight: 500 }}>{item.raw.title || item.raw.name || item.raw.url || item.key}</Text>
                          {item.raw.source && (<Text style={{ fontSize: '10px', color: '#999' }}>{item.raw.source}</Text>)}
                          {item.raw.addTime && (<Text style={{ fontSize: '10px', color: '#999' }}>{item.raw.addTime}</Text>)}
                        </div>
                      </div>
                    </div>
                  </Card>
                )) : (
                  <Text type="secondary" style={{ fontSize: 12 }}>暂无关联的来源</Text>
                );
              })()}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AchievementDetailPanel;