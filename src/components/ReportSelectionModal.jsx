import React, { useState, useEffect } from 'react';
import { Modal, Card, Row, Col, Button, Typography, Spin } from 'antd';
import { EditOutlined, FileTextOutlined, BookOutlined, FormOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const ReportSelectionModal = ({ 
  visible, 
  onCancel, 
  onConfirm, 
  materialCount = 0 
}) => {
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null); // 新增：选中的建议

  // 报告类型配置
  const reportTypes = [
    {
      key: 'teaching-design',
      title: '教学设计',
      description: '设计完整的教学方案，包含教学目标、教学过程、教学方法等',
      icon: <FormOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
      borderColor: '#722ed1'
    },
    {
      key: 'speech',
      title: '发言稿',
      description: '撰写结构清晰的发言稿，适用于会议、演讲、汇报等场合',
      icon: <EditOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />,
      gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
      borderColor: '#fa8c16'
    },
    {
      key: 'custom',
      title: '自制格式',
      description: '通过指定结构、风格、语气等方面，按照自己的方式制作报告',
      icon: <EditOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
      borderColor: '#1890ff'
    },
    {
      key: 'brief',
      title: '简报文档',
      description: '概述来源中的重要分析洞见和引文',
      icon: <FileTextOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      gradient: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
      borderColor: '#52c41a'
    },
    {
      key: 'study-guide',
      title: '学习指南',
      description: '筛答题驱动、推荐的论文问题以及关键术语词汇表',
      icon: <BookOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
      borderColor: '#722ed1'
    },
    {
      key: 'blog',
      title: '博文',
      description: '将洞察点融汇成博文，深入浅出，通俗易懂',
      icon: <FormOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />,
      gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
      borderColor: '#fa8c16'
    }
  ];

  // 模拟加载建议
  useEffect(() => {
    if (visible) {
      setLoading(true);
      // 模拟异步加载建议
      setTimeout(() => {
        setSuggestions([
          '教学反思与改进',
          '学习效果分析',
          '课程内容总结',
          '培训成果评估'
        ]);
        setLoading(false);
      }, 1500);
    }
  }, [visible]);

  const handleTypeSelect = (type) => {
    setSelectedType(type.key);
  };

  // 新增：处理建议选择
  const handleSuggestionSelect = (suggestion) => {
    setSelectedSuggestion(suggestion);
  };

  const handleConfirm = () => {
    // 只要选择了报告类型或智能建议中的任意一项就可以创建
    if (!selectedType && !selectedSuggestion) return;
    
    const selectedTypeConfig = selectedType ? reportTypes.find(type => type.key === selectedType) : null;
    // 将选中的建议传递给父组件
    onConfirm(selectedType, selectedTypeConfig, selectedSuggestion);
    
    // 重置状态
    setSelectedType(null);
    setSelectedSuggestion(null);
    setSuggestions([]);
    setLoading(false);
  };

  const handleCancel = () => {
    setSelectedType(null);
    setSelectedSuggestion(null);
    setSuggestions([]);
    setLoading(false);
    onCancel();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '8px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileTextOutlined style={{ color: 'white', fontSize: '16px' }} />
          </div>
          <Title level={4} style={{ margin: 0, color: '#1f1f1f' }}>
            创建报告
          </Title>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button 
          key="confirm" 
          type="primary" 
          onClick={handleConfirm}
          disabled={!selectedType && !selectedSuggestion}
          title={(!selectedType && !selectedSuggestion) ? '请选择报告格式或智能建议' : ''}
        >
          创建报告
        </Button>
      ]}
      width={800}
      styles={{ body: { padding: '24px' } }}
    >
      <div>
        {/* 操作提示 */}
        {!selectedType && !selectedSuggestion && (
          <div style={{
            background: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
            border: '1px solid #ffbb96',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '16px' }}>👆</span>
            <Text style={{ fontSize: '13px', color: '#d4380d', fontWeight: '500' }}>
              请选择报告格式或智能建议（选择其中一项即可创建）
            </Text>
          </div>
        )}
        
        <Title level={5} style={{ marginBottom: '16px', color: '#1f1f1f' }}>
          格式
        </Title>
        
        <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
          {reportTypes.map(type => (
            <Col xs={24} sm={12} key={type.key}>
              <Card
                hoverable
                onClick={() => handleTypeSelect(type)}
                style={{
                  background: selectedType === type.key ? type.gradient : '#fff',
                  border: `2px solid ${selectedType === type.key ? type.borderColor : '#f0f0f0'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  height: '120px'
                }}
                bodyStyle={{ padding: '16px' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', height: '100%' }}>
                  <div style={{ flexShrink: 0, marginTop: '4px' }}>
                    {type.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Title level={5} style={{ 
                      margin: '0 0 8px 0', 
                      fontSize: '16px',
                      color: selectedType === type.key ? type.borderColor : '#1f1f1f'
                    }}>
                      {type.title}
                    </Title>
                    <Paragraph 
                      style={{ 
                        margin: 0, 
                        fontSize: '13px', 
                        color: '#666',
                        lineHeight: '1.4'
                      }}
                      ellipsis={{ rows: 2 }}
                    >
                      {type.description}
                    </Paragraph>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 加载建议部分 */}
        <div style={{ 
          background: '#fafafa', 
          borderRadius: '12px', 
          padding: '20px',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: 'linear-gradient(45deg, #667eea, #764ba2)' 
            }} />
            <Text style={{ fontSize: '14px', fontWeight: '500', color: '#1f1f1f' }}>
              {loading ? '正在加载建议...' : '智能建议'}
            </Text>
          </div>
          
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Spin size="small" />
              <Text style={{ fontSize: '13px', color: '#666' }}>
                基于您的{materialCount}个数据源，正在生成个性化建议...
              </Text>
            </div>
          ) : (
            <Row gutter={[12, 12]}>
              {suggestions.map((suggestion, index) => (
                <Col xs={12} sm={6} key={index}>
                  <div style={{
                    background: selectedSuggestion === suggestion ? '#e6f7ff' : '#fff',
                    borderRadius: '8px',
                    padding: '12px',
                    border: selectedSuggestion === suggestion ? '2px solid #1890ff' : '1px solid #e6e6e6',
                    textAlign: 'center',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  onMouseEnter={(e) => {
                    if (selectedSuggestion !== suggestion) {
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                      e.target.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSuggestion !== suggestion) {
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                  >
                    <Text style={{ 
                      fontSize: '12px', 
                      color: selectedSuggestion === suggestion ? '#1890ff' : '#666', 
                      textAlign: 'center',
                      fontWeight: selectedSuggestion === suggestion ? '500' : 'normal'
                    }}>
                      {suggestion}
                    </Text>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>
        
        {materialCount > 0 && (
          <div style={{ 
            marginTop: '16px', 
            textAlign: 'center',
            padding: '8px',
            background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
            borderRadius: '8px',
            border: '1px solid #b7eb8f'
          }}>
            <Text style={{ fontSize: '12px', color: '#52c41a' }}>
              💡 将基于您选择的 {materialCount} 个数据源生成报告
            </Text>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReportSelectionModal;