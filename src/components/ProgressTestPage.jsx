import React, { useState } from 'react';
import { Card, Button, message } from 'antd';
import DraggableOperationCard from './OperationPanel/DraggableOperationCard';

const ProgressTestPage = () => {
  const [loadingCards, setLoadingCards] = useState([]);

  const testCards = [
    {
      key: 'audio',
      title: '音频概览',
      icon: '音',
      gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
      color: '#1890ff'
    },
    {
      key: 'video',
      title: '视频概览',
      icon: '视',
      gradient: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
      color: '#52c41a'
    },
    {
      key: 'mindmap',
      title: '思维导图',
      icon: '思',
      gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
      color: '#fa8c16'
    }
  ];

  const handleCardClick = (card) => {
    if (loadingCards.includes(card.key)) {
      message.warning('工具正在处理中，请稍候...');
      return;
    }

    // 开始加载状态
    setLoadingCards(prev => [...prev, card.key]);
    message.loading(`正在生成${card.title}...`, 3);

    // 3秒后移除加载状态
    setTimeout(() => {
      setLoadingCards(prev => prev.filter(key => key !== card.key));
      message.success(`${card.title}生成完成！`);
    }, 3000);
  };

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Card title="光圈进度效果测试" style={{ marginBottom: '20px' }}>
        <p>点击下方工具卡片测试光圈进度效果：</p>
        <ul>
          <li>✅ 点击工具后会显示光圈动画效果</li>
          <li>✅ 工具在加载期间不可再次点击</li>
          <li>✅ 3秒后进度效果消失，工具恢复可用状态</li>
        </ul>
      </Card>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '16px',
        maxWidth: '600px'
      }}>
        {testCards.map((card, index) => (
          <DraggableOperationCard
            key={card.key}
            card={card}
            index={index}
            onMove={() => {}}
            onRemove={() => {}}
            onClick={() => handleCardClick(card)}
            isEditMode={false}
            hasSourceData={true}
            sourceInfo={{ total: 3, details: '已勾选3个资料' }}
            isLoading={loadingCards.includes(card.key)}
          />
        ))}
      </div>

      <Card style={{ marginTop: '20px' }}>
        <h4>当前加载状态：</h4>
        <p>
          {loadingCards.length === 0 
            ? '暂无工具在加载中' 
            : `正在加载: ${loadingCards.join(', ')}`
          }
        </p>
      </Card>
    </div>
  );
};

export default ProgressTestPage;