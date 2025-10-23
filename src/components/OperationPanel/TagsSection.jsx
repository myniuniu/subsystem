import React, { useMemo, useState } from 'react';
import { Typography, Card, Button, Space, Modal, Table, Tag, Input, Select, message } from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;

// 该组件封装“标签清单”和“管理标签”相关逻辑
const TagsSection = ({ participantsList }) => {
  const [managerOpen, setManagerOpen] = useState(false);
  const [editingTagKey, setEditingTagKey] = useState(null);
  const [tagMap, setTagMap] = useState(() => {
    // 初始为各部门标签
    const init = {};
    participantsList.forEach(p => {
      if (!init[p.department]) init[p.department] = p.department;
    });
    // 增加一个通用标签
    init['重点关注'] = '重点关注';
    return init;
  });
  const [tagAssignments, setTagAssignments] = useState(() => {
    const map = {};
    Object.keys(tagMap).forEach(key => { map[key] = []; });
    return map;
  });
  const [newTagName, setNewTagName] = useState('');

  const departmentCounts = useMemo(() => {
    const counts = {};
    participantsList.forEach(p => {
      counts[p.department] = (counts[p.department] || 0) + 1;
    });
    return counts;
  }, [participantsList]);

  const participantColumns = [
    { title: '姓名', dataIndex: 'name', key: 'name', width: 120 },
    { title: '部门', dataIndex: 'department', key: 'department', width: 140 },
    { title: '职位', dataIndex: 'position', key: 'position', width: 140 },
    { title: '资历', dataIndex: 'experience', key: 'experience', width: 120 },
    { title: '联系方式', dataIndex: 'contact', key: 'contact', width: 180 },
  ];

  const handleDownloadCSV = () => {
    const headers = ['姓名','部门','职位','资历','联系方式'];
    const rows = participantsList.map(p => [p.name, p.department, p.position, p.experience, p.contact]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'participants.csv'; a.click();
    URL.revokeObjectURL(url);
    message.success('已下载参与人员清单 CSV');
  };

  const availableTags = Object.keys(tagMap);
  const participantNames = participantsList.map(p => p.name);

  const handleAssignTag = (tagKey, names) => {
    setTagAssignments(prev => ({ ...prev, [tagKey]: names }));
  };

  const handleAddTag = () => {
    const name = (newTagName || '').trim();
    if (!name) return;
    setTagMap(prev => ({ ...prev, [name]: name }));
    setTagAssignments(prev => ({ ...prev, [name]: [] }));
    setNewTagName('');
    message.success('已新增标签');
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <Title level={3}>标签清单</Title>
      <Card size="small" style={{ marginBottom: '16px' }}>
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
          {Object.entries(departmentCounts).map(([dept, count]) => (
            <Tag key={dept} color="blue">{dept}：{count}人</Tag>
          ))}
        </div>
        <div style={{ marginTop:'12px' }}>
          <Space>
            <Button onClick={() => setManagerOpen(true)}>管理标签</Button>
            <Button onClick={handleDownloadCSV}>下载清单</Button>
          </Space>
        </div>
      </Card>

      <Modal
        open={managerOpen}
        title="管理标签"
        width={900}
        onCancel={() => setManagerOpen(false)}
        onOk={() => setManagerOpen(false)}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text strong>现有标签：</Text>
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {availableTags.map(tag => (
                <Tag key={tag} color={editingTagKey === tag ? 'processing' : 'default'} onClick={() => setEditingTagKey(tag)} style={{ cursor:'pointer' }}>{tag}</Tag>
              ))}
            </div>
          </div>
          <div>
            <Text strong>新增标签：</Text>
            <Space style={{ marginTop: '8px' }}>
              <Input value={newTagName} onChange={(e) => setNewTagName(e.target.value)} placeholder="输入标签名" style={{ width: 240 }} />
              <Button type="primary" onClick={handleAddTag}>新增</Button>
            </Space>
          </div>
          <div>
            <Text strong>人员列表：</Text>
            <Table 
              columns={participantColumns}
              dataSource={participantsList}
              size="small"
              pagination={{ pageSize: 5 }}
              rowKey={(r, i) => i}
              style={{ marginTop: '8px' }}
            />
          </div>
          <div>
            <Text strong>为标签分配人员：</Text>
            <Space style={{ marginTop: '8px' }}>
              <Select
                placeholder="选择标签"
                value={editingTagKey}
                onChange={(v) => setEditingTagKey(v)}
                options={availableTags.map(k => ({ label: k, value: k }))}
                style={{ width: 200 }}
              />
              <Select
                mode="multiple"
                allowClear
                style={{ minWidth: 360 }}
                placeholder="选择人员"
                value={editingTagKey ? tagAssignments[editingTagKey] : []}
                onChange={(names) => editingTagKey && handleAssignTag(editingTagKey, names)}
                options={participantNames.map(n => ({ label: n, value: n }))}
              />
            </Space>
            {editingTagKey && (
              <div style={{ marginTop: '12px' }}>
                <Text type="secondary">已分配：{(tagAssignments[editingTagKey] || []).join('、') || '无'}</Text>
              </div>
            )}
          </div>
        </Space>
      </Modal>
    </div>
  );
};

export default TagsSection;