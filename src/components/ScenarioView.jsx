import React from 'react';
import { Typography, message } from 'antd';
import { VIEW_MODES } from '../constants/noteEditConstants';
import { generateScenarioThumbnail } from '../utils/scenarioThumbnailUtils';

const { Text } = Typography;

const ScenarioView = ({
  selectedScenarios,
  setSelectedScenarios,
  setCurrentView
}) => {
  // 图片缓存状态
  const [imageCache, setImageCache] = React.useState(new Map());
  const [imageLoading, setImageLoading] = React.useState(false);
  
  console.log('ScenarioView 渲染 - selectedScenarios:', selectedScenarios);
  
  // 生成默认缩略图
  const generateDefaultImage = (title) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    // 渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#f0f9ff');
    gradient.addColorStop(1, '#e0f2fe');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // 中心场景图标
    ctx.fillStyle = '#0ea5e9';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('场', 400, 280);
    
    // 场景标题
    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(title || '场景模拟', 400, 350);
    
    // 底部提示
    ctx.fillStyle = '#64748b';
    ctx.font = '16px Arial';
    ctx.fillText('点击运行按钮启动场景', 400, 400);
    
    return canvas.toDataURL('image/jpeg', 0.9);
  };
  
  // 加载场景预览图
  React.useEffect(() => {
    if (selectedScenarios.length > 0 && selectedScenarios[0].title) {
      const scenario = selectedScenarios[0];
      if (!imageCache.has(scenario.id)) {
        setImageLoading(true);
        // 使用新的缩略图生成工具
        const defaultImage = generateScenarioThumbnail(
          scenario.id, 
          scenario.title, 
          scenario.category || 'default'
        );
        setImageCache(prev => new Map([...prev, [scenario.id, defaultImage]]));
        setImageLoading(false);
      }
    }
  }, [selectedScenarios]);

  // 监听来自iframe的退出指令
  React.useEffect(() => {
    const handleMessage = (event) => {
      const data = event?.data;
      if (data && data.type === 'EXIT_SCENARIO') {
        setCurrentView(VIEW_MODES.MATERIALS);
        setSelectedScenarios([]);
        message.info('已退出场景模拟');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [setCurrentView, setSelectedScenarios]);

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
        <div style={{ 
          flex: 1, 
          position: 'relative',
          background: '#f5f5f5'
        }}>
          {/* 直接显示iframe，保持原有交互功能；增加安全回退 */}
          <iframe 
            src={(selectedScenarios[0]?.thumbnail 
              || selectedScenarios[0]?.files?.html 
              || selectedScenarios[0]?.htmlPath 
              || '/gen-html/ai-mental-health-scenario.html')}
            title={selectedScenarios[0]?.title || '场景预览'}
            style={{ 
              width: '100%', 
              height: '100%', 
              border: 'none',
              position: 'absolute',
              top: 0,
              left: 0
            }}
            onLoad={() => console.log('iframe已加载:', (selectedScenarios[0]?.thumbnail || selectedScenarios[0]?.files?.html || selectedScenarios[0]?.htmlPath))}
            onError={() => console.error('iframe加载失败:', (selectedScenarios[0]?.thumbnail || selectedScenarios[0]?.files?.html || selectedScenarios[0]?.htmlPath))}
          />
        </div>
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