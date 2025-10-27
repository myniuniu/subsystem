import React, { useMemo, useState } from 'react';
import { Form, Switch, Radio, Alert, Button, Table, Space, Tag, Modal, Input, message } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const ReviewSettingsTab = ({ draft, updateDraft }) => {
  const inlineRow = { display: 'inline-flex', alignItems: 'center', gap: 8 };

  const manual = !!draft?.grading?.manual;
  const assignmentMethod = draft?.grading?.assignmentMethod || 'exam_unified';
  const distributionMode = draft?.grading?.distributionMode || 'equal_ratio';
  const submittedCount = draft?.stats?.submittedCount || draft?.submittedCount || 0;
  const cannotChange = submittedCount > 0;
  const confirmed = !!draft?.grading?.confirmed;

  const modeDesc = distributionMode === 'equal_ratio'
    ? '系统依次分配试卷，各评阅老师被分配到的试卷数量基本一致'
    : '所有试卷进入公共评阅池，评阅老师从队列领取试卷进行评阅';

  const reviewers = draft?.grading?.reviewers || [];

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newReviewer, setNewReviewer] = useState({ name: '', phone: '' });

  const modeLabel = useMemo(() => (
    distributionMode === 'equal_ratio' ? '等比例分配试卷' : '公共评阅模式'
  ), [distributionMode]);

  const handleConfirm = () => {
    if (!manual) {
      message.warning('请先开启人工评阅');
      return;
    }
    updateDraft('grading.confirmed', true);
    message.success('已确认评阅设置方案，可继续配置评阅老师');
  };

  const handleEditSettings = () => {
    updateDraft('grading.confirmed', false);
    message.info('已切换为可编辑设置方案');
  };

  const addReviewer = () => {
    const name = (newReviewer.name || '').trim();
    const phone = (newReviewer.phone || '').trim();
    if (!name) {
      message.error('请输入评阅老师姓名');
      return;
    }
    const entry = {
      id: Date.now(),
      name,
      phone,
      joinStatus: 'invited',
      method: distributionMode, // 展示用途
    };
    const next = [...reviewers, entry];
    updateDraft('grading.reviewers', next);
    setAddModalVisible(false);
    setNewReviewer({ name: '', phone: '' });
    message.success('已添加评阅老师');
  };

  const removeReviewer = (id) => {
    const next = reviewers.filter(r => r.id !== id);
    updateDraft('grading.reviewers', next);
    message.success('已移除评阅老师');
  };

  const columns = [
    { title: '评阅老师', dataIndex: 'name', key: 'name' },
    { title: '联系手机号', dataIndex: 'phone', key: 'phone', render: (v) => v || '-' },
    { 
      title: '加入状态', key: 'joinStatus', 
      render: (_, r) => {
        const map = { invited: { color: 'blue', text: '已邀请' }, joined: { color: 'green', text: '已加入' }, inactive: { color: 'default', text: '未激活' } };
        const cfg = map[r.joinStatus] || map.invited;
        return <Tag color={cfg.color}>{cfg.text}</Tag>;
      }
    },
    { title: '评审方式', key: 'method', render: () => modeLabel },
    { 
      title: '操作', key: 'actions',
      render: (_, r) => (
        <Space>
          <Button danger size="small" icon={<DeleteOutlined />} onClick={() => removeReviewer(r.id)}>删除</Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* 顶部提示 */}
      <Alert
        type="warning"
        showIcon
        style={{ marginBottom: 12 }}
        message={
          <span style={{ color: '#cf1322' }}>
            若有学员提交了试卷，将无法修改此设置！
          </span>
        }
      />

      {/* 评阅设置 */}
      <div style={{ fontWeight: 600, margin: '16px 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#d9d9d9' }}>●</span>
        <span>评阅设置</span>
      </div>
      <Form.Item label="是否人工评阅：" colon={false} style={{ marginBottom: 12 }}>
        <div style={inlineRow}>
          <Switch
            checked={manual}
            onChange={(checked) => updateDraft('grading.manual', checked)}
          />
          <span style={{ color: '#666' }}>
            开启人工评阅后，试卷内所有主观题（填空/问答/作文/文件上传等）将不会自动评阅
          </span>
        </div>
      </Form.Item>

      {!manual && (
        <div style={{ color: '#999', marginBottom: 12 }}>
          当前为自动评阅模式，以下配置不生效。
        </div>
      )}

      {/* 设置方式 */}
      {manual && !confirmed && (
        <div style={{ color: '#cf1322', background: '#fff', borderRadius: 6, padding: '8px 12px', border: '1px solid #ffe7ba', marginBottom: 8 }}>
          <div style={{ marginBottom: 6 }}>· 若您更换了设置方式，此前已经设置的评阅老师将清空！</div>
          <div>· 若有学员提交了试卷，将无法修改此设置！</div>
        </div>
      )}

      {manual && !confirmed && (
        <Form.Item label="设置方式：" colon={false} style={{ marginBottom: 16 }}>
          <Radio.Group
            value={assignmentMethod}
            onChange={(e) => updateDraft('grading.assignmentMethod', e.target.value)}
            disabled={cannotChange}
          >
            <div style={{ display: 'grid', gap: 10 }}>
              <Radio value="exam_unified">由考试统一配置评阅老师</Radio>
              <Radio value="per_project">对引用此考试的项目分别配置评阅老师</Radio>
              <Radio value="per_class">对项目的不同的班级分别配置评阅老师</Radio>
            </div>
          </Radio.Group>
        </Form.Item>
      )}

      {/* 试卷分配模式 */}
      {manual && !confirmed && (
        <Form.Item label="试卷分配模式：" colon={false} style={{ marginBottom: 6 }}>
          <Radio.Group
            value={distributionMode}
            onChange={(e) => updateDraft('grading.distributionMode', e.target.value)}
            buttonStyle="solid"
            disabled={cannotChange}
          >
            <Radio.Button value="equal_ratio">等比例分配试卷</Radio.Button>
            <Radio.Button value="public_pool">公共评阅模式</Radio.Button>
          </Radio.Group>
        </Form.Item>
      )}

      {manual && !confirmed && (
        <div style={{ color: '#666', marginBottom: 12 }}>
          模式说明：{modeDesc}
        </div>
      )}

      {/* 确认设置方案 */}
      {manual && !confirmed && (
        <div style={{ marginTop: 12 }}>
          <Button type="primary" onClick={handleConfirm}>确认评阅设置方案</Button>
        </div>
      )}

      {/* 已确认后的评阅老师配置区块 - 满宽布局 */}
      {manual && confirmed && (
        <div style={{ marginTop: 16, marginLeft: -16, marginRight: -16, marginBottom: -12 }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f5f7fa', border: '1px solid #e6e9ef', borderRadius: 0, padding: '8px 16px', marginBottom: 0 }}>
             <Space size={8}>
               <span>统一设置评阅老师</span>
               <Tag color="geekblue">{modeLabel}</Tag>
               <Button type="link" size="small" icon={<EditOutlined />} onClick={handleEditSettings}>编辑</Button>
             </Space>
             <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalVisible(true)}>添加评阅老师</Button>
           </div>

          <div style={{ padding: '0 16px 12px' }}>
             <Table
               size="small"
               rowKey="id"
               dataSource={reviewers}
               columns={columns}
               pagination={false}
               style={{ width: '100%' }}
               tableLayout="fixed"
               locale={{ emptyText: '暂时为空' }}
             />
           </div>
         </div>
       )}

      {/* 添加评阅老师弹窗 */}
      <Modal
        title="添加评阅老师"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onOk={addReviewer}
        okText="添加"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="请输入姓名"
            value={newReviewer.name}
            onChange={(e) => setNewReviewer(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input
            placeholder="请输入手机号（可选）"
            value={newReviewer.phone}
            onChange={(e) => setNewReviewer(prev => ({ ...prev, phone: e.target.value }))}
          />
        </Space>
      </Modal>
    </div>
  );
};

export default ReviewSettingsTab;