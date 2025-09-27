import React from 'react';
import { Button, Typography, message } from 'antd';
import { VIEW_MODES } from '../constants/noteEditConstants';

const { Text } = Typography;

const ScenarioView = ({
  selectedScenarios,
  setSelectedScenarios,
  setCurrentView
}) => {
  console.log('ScenarioView 渲染 - selectedScenarios:', selectedScenarios);

  return (
    <div style={{ 
      flex: 1, 
      background: '#fff', 
      margin: '16px', 
      borderRadius: '8px', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column'
    }}>
      {/* 场景主页内容 */}
      {selectedScenarios.length > 0 ? (
        <>
          <div style={{ 
            padding: '12px 16px', 
            background: '#f0f9ff', 
            borderBottom: '1px solid #e8e8e8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>场</span>
              <Text strong style={{ color: '#1890ff' }}>
                场景模拟：{selectedScenarios[0].title}
              </Text>
            </div>
            <Button 
              type="text" 
              size="small"
              icon={<span style={{ fontSize: '14px' }}>✕</span>}
              onClick={() => {
                console.log('退出场景视图');
                setCurrentView(VIEW_MODES.MATERIALS);
                setSelectedScenarios([]);
                message.info('已退出场景模拟');
              }}
              style={{
                color: '#666',
                padding: '4px 8px',
                height: 'auto'
              }}
            >
              退出
            </Button>
          </div>
          <div style={{ 
            flex: 1, 
            position: 'relative',
            background: '#f5f5f5'
          }}>
            <iframe 
              src={selectedScenarios[0].thumbnail}
              title={selectedScenarios[0].title}
              style={{ 
                width: '100%', 
                height: '100%', 
                border: 'none',
                position: 'absolute',
                top: 0,
                left: 0
              }}
              onLoad={() => console.log('iframe已加载:', selectedScenarios[0].thumbnail)}
              onError={() => console.error('iframe加载失败:', selectedScenarios[0].thumbnail)}
            />
          </div>
        </>
      ) : (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          color: '#999',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px'
        }}>
          <span style={{ fontSize: '48px', marginBottom: '16px' }}>场</span>
          <Text style={{ fontSize: '16px' }}>未选择场景</Text>
        </div>
      )}
    </div>
  );
};

export default ScenarioView;