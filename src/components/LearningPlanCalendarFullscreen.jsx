import React, { useState } from 'react';
import { Button, Typography, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { VIEW_MODES } from '../constants/noteEditConstants';
import LearningPlanCalendar from './LearningPlanCalendar';
import dayjs from 'dayjs';

const { Title } = Typography;

const LearningPlanCalendarFullscreen = ({ state, setCurrentView }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  
  // 获取学习计划数据
  const planRecord = state.rightPanelLearningPlanRecord;
  const planData = planRecord?.metadata;
  const analysis = planData?.analysis;
  const plan = planData?.plan;
  const habits = planData?.habits || [];

  const handleBack = () => {
    setCurrentView(VIEW_MODES.MATERIALS);
    message.info('已退出全屏日历模式');
  };

  return (
    <div style={{ 
      flex: 1, 
      background: '#f5f5f5', 
      margin: '16px', 
      borderRadius: '12px', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      {/* 全屏日历头部 */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#fff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>📅</span>
          <div>
            <Title level={4} style={{ margin: 0, color: '#fff' }}>
              学习计划日历
            </Title>
            {planRecord && (
              <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '4px' }}>
                {planRecord.title} • {planRecord.source}
              </div>
            )}
          </div>
        </div>
        
        <Button 
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          style={{ 
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '6px'
          }}
        >
          返回三栏视图
        </Button>
      </div>

      {/* 日历内容区域 */}
      <div style={{ 
        flex: 1, 
        background: '#fff',
        margin: '16px',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <LearningPlanCalendar
          planData={planData}
          analysis={analysis}
          plan={plan}
          habits={habits}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>
    </div>
  );
};

export default LearningPlanCalendarFullscreen;