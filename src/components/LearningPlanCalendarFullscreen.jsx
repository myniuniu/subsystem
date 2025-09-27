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
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      position: 'relative'
    }}>
      {/* 返回按钮 - 放置在右上角 */}
      <Button 
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={handleBack}
        style={{ 
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 1000,
          color: '#666',
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        返回三栏视图
      </Button>

      {/* 日历内容区域 */}
      <div style={{ 
        flex: 1, 
        background: '#fff',
        borderRadius: '12px',
        overflow: 'hidden'
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