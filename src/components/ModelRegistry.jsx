import React, { useEffect, useMemo, useState } from 'react';
import { Card, Table, Segmented, Space, Tag, Button, Modal, Input, Select, Typography, Row, Col, Divider, message } from 'antd';
import { Layers, Eye, ThumbsUp, FileText, Database, Copy, LayoutGrid, List } from 'lucide-react';
import './ModelRegistry.css';

const { Title, Text } = Typography;
const { Option } = Select;

// 读取与持久化模型库
const loadRegistry = () => {
  try {
    const list = JSON.parse(localStorage.getItem('model-registry') || '[]');
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
};
const saveRegistry = (list) => {
  localStorage.setItem('model-registry', JSON.stringify(list));
};

export default function ModelRegistry() {
  // 默认进入卡片视图
  const [view, setView] = useState('cards'); // cards | list
  const [registry, setRegistry] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all | image | audio
  const [detailModel, setDetailModel] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // 初始化：若本地无数据，注入模拟条目
  useEffect(() => {
    const init = loadRegistry();
    if (!init || init.length === 0) {
      const defaults = [
        {
          id: 'trn_img_cls_20251020_001',
          name: '课堂手势识别',
          type: 'image',
          task: 'classification',
          selectedModel: 'MobileNet V3',
          labels: ['举手', '书写', '站立'],
          sampleCount: 580,
          status: 'running',
          metrics: { accuracy: 0.78 },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'trn_img_det_20251019_002',
          name: '课堂事件检测',
          type: 'image',
          task: 'bbox',
          selectedModel: 'qwen-plus-2024-07-01',
          labels: ['举手', '跑跳', '离座'],
          sampleCount: 960,
          status: 'terminated',
          metrics: { accuracy: 0.81 },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        },
        {
          id: 'trn_audio_cls_20251018_003',
          name: '课堂音频情绪识别',
          type: 'audio',
          task: 'classification',
          selectedModel: 'qwen-turbo-2024-06-24',
          labels: ['积极', '中性', '消极'],
          sampleCount: 420,
          status: 'evaluated',
          metrics: { accuracy: 0.86 },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        },
      ];
      saveRegistry(defaults);
      setRegistry(defaults);
    } else {
      setRegistry(init);
    }
  }, []);

  const filtered = useMemo(() => {
    return registry.filter(m => {
      const matchType = typeFilter === 'all' || m.type === typeFilter;
      const matchKeyword = !keyword || (m.name || '').toLowerCase().includes(keyword.toLowerCase());
      return matchType && matchKeyword;
    });
  }, [registry, keyword, typeFilter]);

  const openDetail = (record) => {
    try {
      localStorage.setItem('model-detail', JSON.stringify(record));
    } catch (e) {}
    window.location.hash = 'model-training-detail';
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除该模型？',
      content: '删除后不可恢复。',
      onOk: () => {
        const next = registry.filter(m => m.id !== id);
        setRegistry(next);
        saveRegistry(next);
        message.success('已删除');
      },
    });
  };

  const handleTerminate = (record) => {
    if (record.status === 'terminated') {
      message.info('该模型已终止训练');
      return;
    }
    Modal.confirm({
      title: '确认终止训练？',
      content: '终止后状态将标记为已终止。',
      onOk: () => {
        const next = registry.map(m => m.id === record.id ? { ...m, status: 'terminated', updatedAt: new Date().toISOString() } : m);
        setRegistry(next);
        saveRegistry(next);
        message.success('已终止训练');
      },
    });
  };

  const copyCode = (code) => {
    try {
      navigator.clipboard.writeText(code);
      message.success('已复制模型任务Code');
    } catch (e) {}
  };

  const taskLabel = (m) => {
    if (m.type === 'image' && m.task === 'classification') return '图像分类';
    if (m.type === 'audio' && m.task === 'classification') return '音频分类';
    if (m.task === 'bbox') return '目标检测';
    return '训练任务';
  };
  const estimateTokens = (m) => {
    // 粗略估算：每样本约512 tokens（仅为展示用）
    const t = (m.sampleCount || 0) * 512;
    return t > 0 ? t : null;
  };

  const statusTag = (m) => {
    if (m.status === 'running') return <Tag color='geekblue'>训练中</Tag>;
    if (m.status === 'terminated') return <Tag color='red'>已终止</Tag>;
    if (m.metrics) return <Tag color='green'>已评估</Tag>;
    return <Tag color='orange'>未评估</Tag>;
  };

  // 列表视图列定义
  const listColumns = [
    { title: '模型名称', dataIndex: 'name', key: 'name', render: (v, r) => <Space><Text strong>{v}</Text><Tag>{r.selectedModel}</Tag></Space> },
    { title: '任务类型', key: 'task', render: (_, r) => <Tag color='geekblue'>{taskLabel(r)}</Tag> },
    { title: '模型任务Code', dataIndex: 'id', key: 'id', render: (v) => (
      <Space>
        <Tag color='default'>{v}</Tag>
        <Button size='small' type='link' icon={<Copy size={14} />} onClick={() => copyCode(v)}>复制</Button>
      </Space>
    ) },
    { title: '最新精度', key: 'acc', render: (_, r) => r.metrics ? <Tag color='blue'>{(r.metrics.accuracy * 100).toFixed(2)}%</Tag> : <Text type='secondary'>--</Text> },
    { title: '训练状态', key: 'status', render: (_, r) => statusTag(r) },
    { title: '训练Token量', key: 'tokens', render: (_, r) => {
      const t = estimateTokens(r);
      return t ? <Text>约 {t.toLocaleString()}</Text> : <Text type='secondary'>--</Text>;
    } },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', render: (v) => v ? new Date(v).toLocaleString() : '-' },
    { title: '操作', key: 'action', render: (_, r) => (
      <Space>
        <Button size='small' onClick={() => openDetail(r)}>查看</Button>
        <Button danger size='small' onClick={() => handleDelete(r.id)}>删除</Button>
        <Button size='small' onClick={() => handleTerminate(r)} disabled={r.status === 'terminated'}>终止训练</Button>
      </Space>
    ) },
  ];

  return (
    <div className='model-registry-root'>
      <div className='mr-header'>
        <Title level={3}>模型管理</Title>
        <Space size='middle'>
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { label: <LayoutGrid size={16} />, value: 'cards' },
              { label: <List size={16} />, value: 'list' },
            ]}
          />
          <Button type='link' icon={<FileText size={16} />} onClick={() => Modal.info({ title: '使用须知', content: '本页为原型演示：模型条目的训练状态与 Token 为估算值。' })}>使用须知</Button>
          <Button type='link' icon={<Database size={16} />} onClick={() => { window.location.hash = 'note-edit-page'; }}>数据集管理</Button>
          <Input allowClear placeholder='搜索名称' value={keyword} onChange={(e) => setKeyword(e.target.value)} style={{ width: 220 }} />
          <Select value={typeFilter} onChange={setTypeFilter} style={{ width: 140 }}>
            <Option value='all'>全部类型</Option>
            <Option value='image'>图像</Option>
            <Option value='audio'>音频</Option>
          </Select>
          <Button type='primary' onClick={() => { window.location.hash = 'model-training-template'; }}>训练新模型</Button>
        </Space>
      </div>

      {view === 'cards' ? (
        <div className='mr-card-grid'>
          <Row gutter={[16, 16]}>
            {filtered.length === 0 ? (
              <>
                <Col xs={24} sm={12} md={8}>
                  <Card className='mr-empty-card'>
                    <div className='mr-empty-icon'><Layers size={36} color='#8898aa' /></div>
                    <div className='mr-empty-title'>多模训练</div>
                    <div className='mr-empty-desc'>多源数据融合，提升识别与推理能力；支持图像、音频等多类型数据的联合优化。</div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card className='mr-empty-card'>
                    <div className='mr-empty-icon'><Eye size={36} color='#8898aa' /></div>
                    <div className='mr-empty-title'>视觉训练</div>
                    <div className='mr-empty-desc'>适用于图像分类、姿态与手势识别等场景；轻量化模型适配多设备部署。</div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card className='mr-empty-card'>
                    <div className='mr-empty-icon'><ThumbsUp size={36} color='#8898aa' /></div>
                    <div className='mr-empty-title'>RLHF训练</div>
                    <div className='mr-empty-desc'>结合人类偏好优化生成式模型行为，适配问答辅导与教学交互场景。</div>
                  </Card>
                </Col>
                <Col span={24}>
                  <div className='mr-empty-bottom'>
                    <Button type='primary' size='middle' className='mr-empty-full-action' onClick={() => { window.location.hash = 'model-training-template'; }}>
                      训练新模型
                    </Button>
                  </div>
                </Col>
              </>
            ) : null}
            {filtered.map((m) => (
              <Col xs={24} sm={12} md={8} lg={6} key={m.id}>
                <Card className='mr-card' hoverable style={{ cursor: 'pointer' }} title={<Space><Text strong>{m.name}</Text><Tag color='geekblue'>{taskLabel(m)}</Tag></Space>} extra={<Tag color={m.type === 'image' ? 'blue' : 'green'}>{m.type}</Tag>} onClick={() => openDetail(m)}>
                  <Space direction='vertical' size='small' style={{ width: '100%' }}>
                    <Space>
                      <Text type='secondary'>模型：</Text>
                      <Text strong>{m.selectedModel}</Text>
                    </Space>
                    <Space>
                      <Text type='secondary'>Code：</Text>
                      <Tag>{m.id}</Tag>
                      <Button size='small' type='link' onClick={() => copyCode(m.id)}>复制</Button>
                    </Space>
                    <Space>
                      <Text type='secondary'>标签数：</Text>
                      <Text strong>{m.labels?.length || 0}</Text>
                    </Space>
                    <Space>
                      <Text type='secondary'>样本数：</Text>
                      <Text strong>{m.sampleCount || 0}</Text>
                    </Space>
                    <Divider style={{ margin: '8px 0' }} />
                    <Space>
                      <Tag color='blue'>Acc {(m.metrics ? (m.metrics.accuracy * 100).toFixed(1) : '--')}%</Tag>
                      {statusTag(m)}
                      {estimateTokens(m) ? <Tag>≈ {estimateTokens(m).toLocaleString()} tokens</Tag> : null}
                    </Space>
                    <Text type='secondary'>创建：{m.createdAt ? new Date(m.createdAt).toLocaleString() : '-'}</Text>
                    <Space style={{ marginTop: 8 }}>
                      <Button size='small' onClick={(e) => { e.stopPropagation(); openDetail(m); }}>查看</Button>
                      <Button danger size='small' onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }}>删除</Button>
                      <Button size='small' onClick={(e) => { e.stopPropagation(); handleTerminate(m); }} disabled={m.status === 'terminated'}>终止训练</Button>
                    </Space>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <Card className='mr-list-card'>
          <Table rowKey='id' dataSource={filtered} columns={listColumns} pagination={false} />
        </Card>
      )}

      {null}
    </div>
  );
}