import React, { useMemo, useState } from 'react';
import { Typography, Card, Switch, Button, Modal, Input, Tag, Space } from 'antd';

const { Text } = Typography;

// 分组: 考试通知 + 评阅通知
const EXAM_TEMPLATES = [
  {
    key: 'pre_day',
    name: '准考提醒',
    timing: '考试前1天 09:00',
    channels: ['公众号', '短信'],
    audience: '业务内全部学员',
    defaultTitle: '准考提醒：{examName}',
    defaultContent: '您报名的考试将于{startTime}开始，请合理安排时间并按时参加。'
  },
  {
    key: 'start_30m',
    name: '开考倒计时30分钟提醒',
    timing: '开考前30分钟',
    channels: ['公众号', '短信'],
    audience: '业务内全部学员',
    defaultTitle: '开考倒计时：30分钟',
    defaultContent: '考试即将开始，请提前检查设备与网络，进入考试入口做好准备。'
  },
  {
    key: 'start_10m',
    name: '开考倒计时10分钟提醒',
    timing: '开考前10分钟',
    channels: ['公众号', '短信'],
    audience: '业务内全部学员',
    defaultTitle: '开考倒计时：10分钟',
    defaultContent: '考试即将开始，请尽快进入考试页面，避免迟到影响考试。'
  },
  {
    key: 'result_publish',
    name: '成绩公布通知',
    timing: '评分完成后',
    channels: ['公众号', '短信'],
    audience: '业务内全部学员',
    defaultTitle: '成绩公布：{examName}',
    defaultContent: '您的考试成绩已发布，请前往成绩页面查看详情。'
  },
  {
    key: 'not_submitted',
    name: '未交通知',
    timing: '考试结束后未交卷',
    channels: ['公众号', '短信'],
    audience: '业务内全部学员',
    defaultTitle: '考试未提交提醒：{examName}',
    defaultContent: '系统检测到您未提交试卷，如有疑问请联系管理员。'
  },
  {
    key: 'retake_open',
    name: '重考开启提醒',
    timing: '允许重考开启时',
    channels: ['公众号', '短信'],
    audience: '业务内全部学员',
    defaultTitle: '重考开启：{examName}',
    defaultContent: '本次考试已开启重考机会，请在规定时间内重新参加考试。'
  }
];

const REVIEW_TEMPLATES = [
  {
    key: 'review_assign',
    name: '评阅分派通知',
    timing: '即时发送',
    channels: ['短信', '公众号'],
    audience: '评阅老师/助教',
    defaultTitle: '评阅任务分派：{paperName}',
    defaultContent: '您被分派评阅任务：{paperName}，待评数量：{pendingCount}，请在{deadline}前完成。'
  },
  {
    key: 'review_reminder',
    name: '评阅提醒',
    timing: '距离截止前1天',
    channels: ['短信', '公众号'],
    audience: '评阅老师/助教',
    defaultTitle: '评阅提醒：{paperName}',
    defaultContent: '评阅任务即将到期，请尽快在{deadline}前完成评阅。'
  },
  {
    key: 'review_complete_student',
    name: '评阅完成通知（学员）',
    timing: '评分完成后',
    channels: ['短信', '公众号'],
    audience: '业务内全部学员',
    defaultTitle: '评阅完成：{examName}',
    defaultContent: '您的试卷评阅已完成，成绩：{score}分，请前往成绩页面查看详情。'
  },
  {
    key: 'review_overdue',
    name: '逾期未评提醒',
    timing: '超过截止未完成',
    channels: ['短信', '公众号'],
    audience: '评阅老师/助教',
    defaultTitle: '逾期未评：{paperName}',
    defaultContent: '您有评阅任务已超过截止时间仍未完成，请及时处理。'
  }
];

const fieldRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  alignItems: 'center',
  gap: 12,
  padding: '10px 12px',
  borderBottom: '1px solid #f0f0f0'
};

const SectionList = ({ title, specs, notify, updateDraft, openEdit, openPreview, toggleEnabled }) => {
  return (
    <Card size="small" bodyStyle={{ padding: 0 }} style={{ marginBottom: 12 }}>
      <div style={{ fontWeight: 600, margin: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#d9d9d9' }}>●</span>
        <span>{title}</span>
      </div>
      {specs.map((spec) => {
        const cfg = notify[spec.key] || {};
        const cur = {
          enabled: !!cfg.enabled,
          title: cfg.title || spec.defaultTitle,
          content: cfg.content || spec.defaultContent,
          channels: Array.isArray(cfg.channels) ? cfg.channels : spec.channels,
          audience: cfg.audience || spec.audience,
          timing: cfg.timing || spec.timing
        };
        return (
          <div key={spec.key} style={fieldRowStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {cur.enabled ? (
                <Tag color="blue" style={{ marginRight: 0 }}>开启推送</Tag>
              ) : (
                <Tag color="default" style={{ marginRight: 0 }}>未开启</Tag>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Text strong>{spec.name}</Text>
                <Tag>{cur.timing}</Tag>
                <Tag>{cur.audience}</Tag>
                <Tag>{cur.channels.join(' / ')}</Tag>
              </div>
              <div style={{ color: '#666' }}>标题：{cur.title}</div>
              <div style={{ color: '#666' }}>内容：{cur.content}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Switch checked={cur.enabled} onChange={(checked) => toggleEnabled(spec.key, checked)} />
              <Space size={4}>
                <Button type="link" onClick={() => openPreview(spec.key)}>详情</Button>
                <Button type="link" onClick={() => openEdit(spec.key)}>编辑</Button>
              </Space>
            </div>
          </div>
        );
      })}
    </Card>
  );
};

const ExamNotifyTab = ({ draft, updateDraft }) => {
  const [editInfo, setEditInfo] = useState(null); // { key, title, content }
  const [previewInfo, setPreviewInfo] = useState(null); // { key, title, content }

  const notify = useMemo(() => draft?.notify || {}, [draft]);

  const toggleEnabled = (key, checked) => {
    const next = { ...notify, [key]: { ...(notify[key] || {}), enabled: checked } };
    updateDraft('notify', next);
  };

  const openEdit = (key) => {
    const spec = [...EXAM_TEMPLATES, ...REVIEW_TEMPLATES].find(s => s.key === key);
    const cfg = notify[key] || {};
    setEditInfo({ key, title: cfg.title || spec.defaultTitle, content: cfg.content || spec.defaultContent });
  };

  const saveEdit = () => {
    if (!editInfo) return;
    const spec = [...EXAM_TEMPLATES, ...REVIEW_TEMPLATES].find(s => s.key === editInfo.key);
    const cur = notify[editInfo.key] || {};
    const next = {
      ...notify,
      [editInfo.key]: {
        ...cur,
        enabled: cur.enabled ?? false,
        title: editInfo.title,
        content: editInfo.content,
        channels: Array.isArray(cur.channels) ? cur.channels : spec.channels,
        audience: cur.audience || spec.audience,
        timing: cur.timing || spec.timing
      }
    };
    updateDraft('notify', next);
    setEditInfo(null);
  };

  const openPreview = (key) => {
    const spec = [...EXAM_TEMPLATES, ...REVIEW_TEMPLATES].find(s => s.key === key);
    const cfg = notify[key] || {};
    setPreviewInfo({ key, title: cfg.title || spec.defaultTitle, content: cfg.content || spec.defaultContent });
  };

  return (
    <div>
      <div style={{ fontWeight: 600, margin: '8px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#d9d9d9' }}>●</span>
        <span>通知</span>
      </div>

      <SectionList
        title="考试通知"
        specs={EXAM_TEMPLATES}
        notify={notify}
        updateDraft={updateDraft}
        openEdit={openEdit}
        openPreview={openPreview}
        toggleEnabled={toggleEnabled}
      />

      <SectionList
        title="评阅通知"
        specs={REVIEW_TEMPLATES}
        notify={notify}
        updateDraft={updateDraft}
        openEdit={openEdit}
        openPreview={openPreview}
        toggleEnabled={toggleEnabled}
      />

      {/* 详情预览 */}
      <Modal
        open={!!previewInfo}
        title="通知预览"
        onCancel={() => setPreviewInfo(null)}
        footer={<Button onClick={() => setPreviewInfo(null)}>关闭</Button>}
      >
        {previewInfo && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Text strong>标题</Text>
            <div>{previewInfo.title}</div>
            <Text strong>内容</Text>
            <div style={{ whiteSpace: 'pre-wrap' }}>{previewInfo.content}</div>
          </div>
        )}
      </Modal>

      {/* 编辑弹窗 */}
      <Modal
        open={!!editInfo}
        title="编辑通知内容"
        onCancel={() => setEditInfo(null)}
        onOk={saveEdit}
      >
        {editInfo && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Text strong>标题</Text>
            <Input
              value={editInfo.title}
              onChange={(e) => setEditInfo({ ...editInfo, title: e.target.value })}
            />
            <Text strong>内容</Text>
            <Input.TextArea
              value={editInfo.content}
              autoSize={{ minRows: 3 }}
              onChange={(e) => setEditInfo({ ...editInfo, content: e.target.value })}
            />
            <div style={{ color: '#999', fontSize: 12 }}>提示：可使用变量如 {`{examName}`}, {`{startTime}`}, {`{paperName}`}, {`{pendingCount}`}, {`{deadline}`}, {`{score}`}</div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExamNotifyTab;