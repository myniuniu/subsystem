import React, { useMemo, useState } from 'react';
import { Card, Typography, Radio, Row, Col, Space, Select, Input, InputNumber, Button, Divider, Tag, Form, Switch, message } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import './ModelTrainingTemplate.css';

const { Title, Text } = Typography;
const { Option } = Select;

export default function ModelTrainingTemplate() {
  // 顶部：训练方式选择
  const [trainMode, setTrainMode] = useState('sft'); // sft | dpo | cpt
  // 选择模型
  const [modelSource, setModelSource] = useState('preset'); // preset | custom
  const [selectedModel, setSelectedModel] = useState('qwen-turbo-2024-06-24');
  // 训练方式
  const [fineTuneType, setFineTuneType] = useState('partial'); // partial | full
  // 基础信息
  const [modelName, setModelName] = useState('qwen-turbo-0624_202510021534_387x3620');
  const usedChars = useMemo(() => (modelName?.length || 0), [modelName]);
  // 数据集
  const [trainDataset, setTrainDataset] = useState('默认训练集');
  const [valMode, setValMode] = useState('auto'); // auto | select
  const [valDataset, setValDataset] = useState('默认验证集');
  // 混合训练权重
  const [mixWeights, setMixWeights] = useState({
    cn_comp: 0,
    cn_review: 0,
    cn_reading: 0,
    cn_math: 0,
    nlp: 0,
    real_world: 0
  });
  // 数据增强
  const [augment, setAugment] = useState({
    shuffle: false,
    noise: false,
    dropout: false
  });
  // 超参
  const [epochs, setEpochs] = useState(3);
  const [learningRate, setLearningRate] = useState(1e-5);
  const [batchSize, setBatchSize] = useState(16);

  // 记录持久化助手
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

  const handleCancel = () => {
    // 不生成记录，返回上一页（不刷新）
    window.history.back();
  };

  const handleStart = () => {
    // 生成模型记录并保存到本地
    const inferType = trainDataset.includes('图像') ? 'image' : (trainDataset.includes('语音') ? 'audio' : 'text');
    const now = new Date().toISOString();
    const record = {
      id: `mt-${Date.now().toString(36)}`,
      name: modelName || '未命名模型',
      type: inferType,
      task: 'classification',
      selectedModel,
      labels: [],
      sampleCount: Math.max(epochs * batchSize * 64, 64),
      params: { trainMode, fineTuneType, epochs, learningRate, batchSize, augment, mixWeights },
      datasets: { trainDataset, valMode, valDataset },
      metrics: null,
      status: 'running',
      createdAt: now,
      updatedAt: now
    };
    const list = loadRegistry();
    saveRegistry([record, ...list]);
    message.success('已生成模型记录（模拟训练已开始）');
    // 跳转至模型库查看
    window.location.hash = 'model-registry';
  };

  const OptionCard = ({ value, title, desc }) => (
    <div className={`mtpl-option-card ${trainMode === value ? 'active' : ''}`} onClick={() => setTrainMode(value)}>
      <div className="mtpl-option-check">{trainMode === value ? <CheckCircleTwoTone twoToneColor="#7c61ff" /> : null}</div>
      <div className="mtpl-option-title">{title}</div>
      <div className="mtpl-option-desc">{desc}</div>
    </div>
  );

  return (
    <div className="model-training-template-root">
      <Title level={4} style={{ marginBottom: 12 }}>选择模型训练方式</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}><OptionCard value="sft" title="SFT微调" desc="通过有监督微调，快速适配特定数据与任务场景" /></Col>
        <Col xs={24} md={8}><OptionCard value="dpo" title="DPO偏好训练" desc="引入人类偏好样本，提升模型输出的自然与人类偏好" /></Col>
        <Col xs={24} md={8}><OptionCard value="cpt" title="CPT连续预训练" desc="通过大规模无监督语料持续训练，强化通用能力" /></Col>
      </Row>

      <Divider />

      <Row gutter={16}>
        <Col span={24}>
          <Card className="mtpl-card" bordered>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div className="mtpl-subtitle">选择模型</div>
              <Space>
                <Radio.Group value={modelSource} onChange={(e) => setModelSource(e.target.value)}>
                  <Radio value="preset">预置模型</Radio>
                  <Radio value="custom">自定义模型</Radio>
                </Radio.Group>
              </Space>
              {modelSource === 'preset' && (
                <Select value={selectedModel} onChange={setSelectedModel} style={{ width: 280 }}>
                  <Option value="qwen-turbo-2024-06-24">qwen-turbo-2024-06-24</Option>
                  <Option value="qwen-plus-2024-07-01">qwen-plus-2024-07-01</Option>
                  <Option value="custom-mobile-net">MobileNet V3</Option>
                </Select>
              )}

              <div className="mtpl-subtitle">训练方式</div>
              <Radio.Group value={fineTuneType} onChange={(e) => setFineTuneType(e.target.value)}>
                <Radio value="partial">微调训练</Radio>
                <Radio value="full">全参训练</Radio>
              </Radio.Group>

              <div className="mtpl-subtitle">模型名称</div>
              <Input value={modelName} onChange={(e) => setModelName(e.target.value)} suffix={<span style={{ color: '#999' }}>{usedChars} / 50</span>} />

              <div className="mtpl-subtitle">选择训练数据</div>
              <Space>
                <Select value={trainDataset} onChange={setTrainDataset} style={{ width: 320 }}>
                  <Option value="默认训练集">默认训练集</Option>
                  <Option value="课堂图像集A">课堂图像集A</Option>
                  <Option value="语音数据集B">语音数据集B</Option>
                </Select>
                <Button type="link" onClick={() => { window.location.hash = 'note-edit-page'; }}>管理训练集</Button>
              </Space>

              <div className="mtpl-subtitle">选择验证数据</div>
              <Radio.Group value={valMode} onChange={(e) => setValMode(e.target.value)}>
                <Radio value="auto">自动划分</Radio>
                <Radio value="select">选择验证集</Radio>
              </Radio.Group>
              {valMode === 'select' && (
                <Select value={valDataset} onChange={setValDataset} style={{ width: 320 }}>
                  <Option value="默认验证集">默认验证集</Option>
                  <Option value="课堂图像验证集">课堂图像验证集</Option>
                </Select>
              )}

              <div className="mtpl-subtitle">混合训练</div>
              <Row gutter={[12, 12]}>
                <Col xs={12} md={6}><Form.Item label="中文作文"><InputNumber value={mixWeights.cn_comp} min={0} max={1} step={0.1} onChange={(v) => setMixWeights({ ...mixWeights, cn_comp: Number(v) })} /></Form.Item></Col>
                <Col xs={12} md={6}><Form.Item label="中文文评"><InputNumber value={mixWeights.cn_review} min={0} max={1} step={0.1} onChange={(v) => setMixWeights({ ...mixWeights, cn_review: Number(v) })} /></Form.Item></Col>
                <Col xs={12} md={6}><Form.Item label="中文阅读"><InputNumber value={mixWeights.cn_reading} min={0} max={1} step={0.1} onChange={(v) => setMixWeights({ ...mixWeights, cn_reading: Number(v) })} /></Form.Item></Col>
                <Col xs={12} md={6}><Form.Item label="中文数学"><InputNumber value={mixWeights.cn_math} min={0} max={1} step={0.1} onChange={(v) => setMixWeights({ ...mixWeights, cn_math: Number(v) })} /></Form.Item></Col>
                <Col xs={12} md={6}><Form.Item label="NLP样例"><InputNumber value={mixWeights.nlp} min={0} max={1} step={0.1} onChange={(v) => setMixWeights({ ...mixWeights, nlp: Number(v) })} /></Form.Item></Col>
                <Col xs={12} md={6}><Form.Item label="真实对话"><InputNumber value={mixWeights.real_world} min={0} max={1} step={0.1} onChange={(v) => setMixWeights({ ...mixWeights, real_world: Number(v) })} /></Form.Item></Col>
              </Row>

              <div className="mtpl-subtitle">数据增强</div>
              <Space wrap>
                <Tag color={augment.shuffle ? 'blue' : ''} onClick={() => setAugment(a => ({ ...a, shuffle: !a.shuffle }))}>随机打乱</Tag>
                <Tag color={augment.noise ? 'blue' : ''} onClick={() => setAugment(a => ({ ...a, noise: !a.noise }))}>噪声注入</Tag>
                <Tag color={augment.dropout ? 'blue' : ''} onClick={() => setAugment(a => ({ ...a, dropout: !a.dropout }))}>Dropout预处理</Tag>
              </Space>

              <div className="mtpl-subtitle">超参数</div>
              <Row gutter={[12, 12]}>
                <Col xs={24} md={8}><Form.Item label="迭代次数"><InputNumber value={epochs} min={1} max={20} onChange={(v) => setEpochs(Number(v))} /></Form.Item></Col>
                <Col xs={24} md={8}><Form.Item label="学习率"><InputNumber value={learningRate} step={1e-6} onChange={(v) => setLearningRate(Number(v))} /></Form.Item></Col>
                <Col xs={24} md={8}><Form.Item label="批量大小"><InputNumber value={batchSize} min={1} max={64} onChange={(v) => setBatchSize(Number(v))} /></Form.Item></Col>
              </Row>

              <Divider />
              <Space>
                <Button type="primary" onClick={handleStart}>开始训练</Button>
                <Button onClick={handleCancel}>取消</Button>
                <Button type="link">计算详情</Button>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}