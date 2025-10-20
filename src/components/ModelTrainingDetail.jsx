import React, { useMemo } from 'react';
import { Card, Row, Col, Space, Tag, Typography, Tabs, Button, Divider } from 'antd';
import { Line } from '@ant-design/charts';
import './ModelTrainingDetail.css';

const { Title, Text } = Typography;

const readDetail = () => {
  try {
    const raw = localStorage.getItem('model-detail');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const buildSeries = (len = 20, base = 3.0, noise = 0.15) => {
  const L = Math.max(8, Math.min(60, len));
  const data = [];
  let current = base;
  for (let i = 1; i <= L; i++) {
    // 模拟逐步下降的损失曲线
    current = Math.max(0.02, current * (0.96 + Math.random() * 0.02));
    const jitter = (Math.random() - 0.5) * noise;
    data.push({ step: i, value: Math.max(0.01, current + jitter) });
  }
  return data;
};

const buildAccSeries = (len = 20, start = 0.3, noise = 0.02) => {
  const L = Math.max(8, Math.min(60, len));
  const data = [];
  let current = start;
  for (let i = 1; i <= L; i++) {
    // 模拟逐步上升的准确率
    current = Math.min(0.99, current + (0.03 + Math.random() * 0.01));
    const jitter = (Math.random() - 0.5) * noise;
    data.push({ step: i, value: Math.min(0.99, Math.max(0.01, current + jitter)) });
  }
  return data;
};

const LineCard = ({ title, data, color = '#1890ff' }) => {
  const config = {
    data,
    xField: 'step',
    yField: 'value',
    smooth: true,
    autoFit: true,
    color,
    yAxis: {
      label: { formatter: (v) => Number(v).toFixed(2) },
    },
    tooltip: {
      showTitle: true,
      title: (d) => `Step ${d.step}`,
      formatter: (d) => ({ name: title, value: Number(d.value).toFixed(4) })
    },
    animation: { appear: { animation: 'path-in', duration: 600 } },
    padding: 'auto'
  };
  return (
    <Card size="small" className="td-chart-card">
      <div className="td-chart-title">{title}</div>
      <Line {...config} />
    </Card>
  );
};

export default function ModelTrainingDetail() {
  const detail = readDetail();

  const tokens = useMemo(() => {
    const t = (detail?.sampleCount || 0) * 512;
    return t > 0 ? t : null;
  }, [detail]);

  const acc = detail?.metrics?.accuracy;
  const steps = Math.max(20, Math.min(60, Math.floor((detail?.sampleCount || 100) / 5)));

  const trainingLoss = useMemo(() => buildSeries(steps, 3.2, 0.12), [steps]);
  const valLoss = useMemo(() => buildSeries(steps, 3.6, 0.12), [steps]);
  const valAcc = useMemo(() => buildAccSeries(steps, acc || 0.35, 0.02), [steps, acc]);

  if (!detail) {
    return (
      <div className="training-detail-root">
        <div className="td-header">
          <Space size="middle">
            <Title level={3}>训练详情</Title>
            <Button type="link" onClick={() => { window.location.hash = 'model-registry'; }}>返回模型管理</Button>
          </Space>
        </div>
        <Card>
          <Text type="secondary">未找到模型详情。请从“模型管理”重新进入。</Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="training-detail-root">
      <div className="td-header">
        <Space size="small" wrap>
          <Title level={3} style={{ marginBottom: 0 }}>{detail.name || '训练详情'}</Title>
          <Tag color={detail.type === 'image' ? 'blue' : 'green'}>{detail.type || 'unknown'}</Tag>
          <Tag color="geekblue">{detail.task === 'classification' ? '分类' : (detail.task || '训练')}</Tag>
        </Space>
        <Space size="middle">
          <Button onClick={() => window.location.hash = 'model-registry'}>返回</Button>
          <Button type="primary">导出报告</Button>
        </Space>
      </div>

      <Card className="td-summary-card">
        <Row gutter={[16, 12]}>
          <Col xs={24} md={12} lg={8}>
            <Space>
              <Text type="secondary">模型：</Text>
              <Text strong>{detail.selectedModel || '-'}</Text>
            </Space>
            <div className="td-subtext">Code：<Tag>{detail.id}</Tag></div>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Space>
              <Text type="secondary">标签数：</Text>
              <Text strong>{detail.labels?.length || 0}</Text>
            </Space>
            <div className="td-subtext">样本数：<Text strong>{detail.sampleCount || 0}</Text></div>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Space>
              <Text type="secondary">状态：</Text>
              {detail.status === 'terminated' ? <Tag color='red'>已终止</Tag> : (detail.status === 'running' ? <Tag color='geekblue'>训练中</Tag> : <Tag color='green'>已评估</Tag>)}
            </Space>
            <div className="td-subtext">创建：{detail.createdAt ? new Date(detail.createdAt).toLocaleString() : '-'}</div>
          </Col>
        </Row>
        <Divider style={{ margin: '12px 0' }} />
        <Row gutter={[16, 12]}>
          <Col xs={24} md={12} lg={8}>
            <Space>
              <Tag color="blue">Acc {detail.metrics ? (detail.metrics.accuracy * 100).toFixed(1) : '--'}%</Tag>
              {tokens ? <Tag>≈ {tokens.toLocaleString()} tokens</Tag> : null}
            </Space>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Text type="secondary">最近更新：{detail.updatedAt ? new Date(detail.updatedAt).toLocaleString() : '—'}</Text>
          </Col>
          <Col xs={24} md={12} lg={8} style={{ textAlign: 'right' }}>
            <Space>
              <Button size="small">下载日志</Button>
              <Button size="small">保存快照</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Tabs defaultActiveKey="train" className="td-tabs">
        <Tabs.TabPane tab="Training Loss" key="train">
          <LineCard title="Training Loss" data={trainingLoss} color="#5B8FF9" />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Validation Loss" key="val">
          <LineCard title="Validation Loss" data={valLoss} color="#5AD8A6" />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Validation Token Accuracy" key="acc">
          <LineCard title="Validation Token Accuracy" data={valAcc.map(d => ({ ...d, value: Number((d.value * 100).toFixed(2)) }))} color="#F6BD16" />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}