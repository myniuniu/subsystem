import React, { useMemo } from 'react';
import { Button, Typography, Card, Select, Upload, List, message } from 'antd';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { VIEW_MODES, OPERATION_TYPES, OPERATION_TITLES } from '../constants/noteEditConstants';

const { Title, Text } = Typography;

// 研修成果详情左侧面板：支持关联操作记录与上传附件（内联展示）
const AchievementDetailPanel = ({ state }) => {
  const achievement = state.leftPanelAchievementRecord;

  const assoc = state.achievementAssociations || {};
  const currentAssoc = achievement ? assoc[achievement.id] || { linkedOperationIds: [], attachments: [] } : { linkedOperationIds: [], attachments: [] };

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

  const beforeUpload = (file) => {
    state.setAchievementAssociations(prev => ({
      ...prev,
      [achievement.id]: {
        ...(prev[achievement.id] || { linkedOperationIds: [], attachments: [] }),
        attachments: [ ...(prev[achievement.id]?.attachments || []), file ]
      }
    }));
    message.success(`已添加附件：${file.name}`);
    return false; // 阻止上传，改为本地状态管理
  };

  const attachments = currentAssoc.attachments || [];

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
      default: return '📄';
    }
  };

  const handleSave = () => {
    try {
      const data = state.achievementAssociations || {};
      // 持久化到本地存储（前端示例保存）
      localStorage.setItem('achievementAssociations', JSON.stringify(data));
      message.success('研修成果关联与附件已保存');
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
      <div style={{ padding: 12, borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8, background: '#fafafa', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button size="small" icon={<ArrowLeftOutlined />} onClick={handleBack}>返回</Button>
          <Text strong style={{ marginLeft: 8 }}>研修成果详情</Text>
        </div>
        <div>
          <Button type="primary" size="small" onClick={handleSave}>保存</Button>
        </div>
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

        <Card size="small" title={<span>上传附件</span>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Upload beforeUpload={beforeUpload} multiple showUploadList={false}>
              <Button icon={<UploadOutlined />}>选择文件添加附件</Button>
            </Upload>
            <List
              size="small"
              bordered
              dataSource={attachments}
              renderItem={(f) => (
                <List.Item>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>{f.name}</span>
                    <span style={{ color: '#999' }}>{typeof f.size === 'number' ? `${Math.round(f.size/1024)}KB` : ''}</span>
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: '暂无附件' }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AchievementDetailPanel;