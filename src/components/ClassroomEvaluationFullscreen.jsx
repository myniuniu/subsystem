import React from 'react';
import { Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { VIEW_MODES } from '../constants/noteEditConstants';
import ClassroomEvaluationViewer from './OperationPanel/ClassroomEvaluationViewer';

const ClassroomEvaluationFullscreen = ({ state, setCurrentView }) => {
  const handleBack = () => {
    setCurrentView(VIEW_MODES.MATERIALS);
    message.info('已退出课堂评价记录全屏模式');
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#fff',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 顶部工具栏 */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '18px' }}>📊</span>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
            课堂评价记录 - 全屏查看
          </span>
        </div>
        
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
        >
          返回三栏视图
        </Button>
      </div>

      {/* 内容区域 */}
      <div style={{ 
        flex: 1,
        overflow: 'hidden',
        padding: '0'
      }}>
        <ClassroomEvaluationViewer
          rightPanelNoteRecord={state.rightPanelClassroomEvaluationRecord}
          rightPanelNoteContent={state.rightPanelNoteContent}
          setRightPanelView={() => {}} // 全屏模式下不需要切换视图
          setRightPanelNoteRecord={() => {}} // 全屏模式下不需要清除记录
          setRightPanelNoteContent={() => {}} // 全屏模式下不需要清除内容
        />
      </div>
    </div>
  );
};

export default ClassroomEvaluationFullscreen;