import React, { useMemo, useState } from 'react';
import { Typography, Card, Button, Space, Modal, Table, Tag, Input, Select, message } from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;

// 该组件封装“标签清单”和“管理标签”相关逻辑
const TagsSection = ({ participantsList, tags }) => {
  const [managerOpen, setManagerOpen] = useState(false);
  const [editingTagKey, setEditingTagKey] = useState(null);
  const [tagMap, setTagMap] = useState(() => {
    // 初始为各部门标签
    const init = {};
    (participantsList || []).forEach(p => {
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
    (participantsList || []).forEach(p => {
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
    const rows = (participantsList || []).map(p => [p.name, p.department, p.position, p.experience, p.contact]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'participants.csv'; a.click();
    URL.revokeObjectURL(url);
    message.success('已下载参与人员清单 CSV');
  };

  const availableTags = Object.keys(tagMap);
  const displayTags = (Array.isArray(tags) && tags.length) ? tags : availableTags;
  const participantNames = (participantsList || []).map(p => p.name);

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
      <Title level={3}>参训人员</Title>
      <Card size="small" style={{ marginBottom: '16px' }}>
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
          {displayTags.map(tag => (
            <Tag key={tag} color="blue">{tag}</Tag>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TagsSection;