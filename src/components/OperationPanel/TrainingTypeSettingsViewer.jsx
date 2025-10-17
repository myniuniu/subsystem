import React, { useEffect, useMemo, useState } from 'react';
import { Card, Typography, Switch, Checkbox, Space, Button, Divider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { RIGHT_PANEL_VIEWS } from '../../constants/noteEditConstants';

const { Title, Text } = Typography;

// 本地存储键构造
const getSettingsKey = (recordId) => `training-plan-settings:${recordId || 'global'}`;

const defaultSettings = {
  antiCheat: {
    afkVerification: false,
    disableSeekOnFirstPlay: false,
    restrictSpeedUntilCompletion: false,
    allowedSpeeds: ['1x']
  },
  contentProtection: {
    watermarkEnabled: false
  }
};

const speedOptions = [
  { label: '0.75X', value: '0.75x' },
  { label: '1X', value: '1x' },
  { label: '1.25X', value: '1.25x' },
  { label: '1.5X', value: '1.5x' },
  { label: '2X', value: '2x' }
];

export default function TrainingTypeSettingsViewer({ record, setRightPanelView }) {
  const storageKey = useMemo(() => getSettingsKey(record?.id), [record?.id]);
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch {}
  }, [storageKey, settings]);

  const updateSetting = (path, value) => {
    setSettings(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let cursor = next;
      for (let i = 0; i < keys.length - 1; i++) cursor = cursor[keys[i]];
      cursor[keys[keys.length - 1]] = value;
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS)}>返回</Button>
        <Text style={{ fontWeight: 600 }}>方案配置</Text>
        <Text type="secondary" style={{ marginLeft: 8 }}>（{record?.title || '培训方案'}）</Text>
      </div>
      <div style={{ padding: 16, overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 720 }}>
          <Card bordered={false} style={{ marginBottom: 16, borderRadius: 12 }}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Title level={5} style={{ margin: 0 }}>视频防作弊</Title>

              <div style={{ padding: '8px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', columnGap: 12 }}>
                  <Text>防挂机验证</Text>
                  <Switch
                    style={{ justifySelf: 'end' }}
                    checked={settings.antiCheat.afkVerification}
                    onChange={(v) => updateSetting('antiCheat.afkVerification', v)}
                  />
                </div>
                <Text type="secondary" style={{ marginTop: 6 }}>开启后，将在播放视频时，随机出现用户行为验证操作，通过后可继续观看视频</Text>
              </div>

              <div style={{ padding: '8px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', columnGap: 12 }}>
                  <Text>防快进设置</Text>
                  <Switch
                    style={{ justifySelf: 'end' }}
                    checked={settings.antiCheat.disableSeekOnFirstPlay}
                    onChange={(v) => updateSetting('antiCheat.disableSeekOnFirstPlay', v)}
                  />
                </div>
                <Text type="secondary" style={{ marginTop: 6 }}>开启后，用户在首次播放视频时不能拖动进度条</Text>
              </div>

              <div style={{ padding: '8px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', columnGap: 12 }}>
                  <Text>防倍速设置</Text>
                  <Switch
                    style={{ justifySelf: 'end' }}
                    checked={settings.antiCheat.restrictSpeedUntilCompletion}
                    onChange={(v) => updateSetting('antiCheat.restrictSpeedUntilCompletion', v)}
                  />
                </div>
                <Text type="secondary" style={{ marginTop: 6 }}>开启后，课程播放进度达成或完成教学活动考核后才可以倍速</Text>
              </div>

              <div style={{ padding: '8px 0' }}>
                <Text>倍速比例</Text>
                <Checkbox.Group
                  style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8 }}
                  disabled={!settings.antiCheat.restrictSpeedUntilCompletion}
                  value={settings.antiCheat.allowedSpeeds}
                  onChange={(values) => updateSetting('antiCheat.allowedSpeeds', values)}
                  options={speedOptions}
                />
              </div>
            </Space>
          </Card>

          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Title level={5} style={{ margin: 0 }}>内容保护配置</Title>
              <div style={{ padding: '8px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', columnGap: 12 }}>
                  <Text>开启防录屏跑马灯</Text>
                  <Switch
                    style={{ justifySelf: 'end' }}
                    checked={settings.contentProtection.watermarkEnabled}
                    onChange={(v) => updateSetting('contentProtection.watermarkEnabled', v)}
                  />
                </div>
                <Text type="secondary" style={{ marginTop: 6 }}>开启后，用户观看视频会滚动显示个人ID信息，有效防止录屏</Text>
              </div>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
}