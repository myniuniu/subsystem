import React from 'react';
import {
  Modal,
  Card,
  Button,
  Typography,
  message,
  Select
} from 'antd';
import scenarioService from '../services/scenarioService';

const { Title, Text } = Typography;

const ScenarioSimulation = ({
  // 显示控制
  scenarioModalVisible,
  setScenarioModalVisible,
  
  // 场景状态
  selectedScenarios,
  setSelectedScenarios,
  operationRecords,
  setOperationRecords,
  
  // 其他状态
  state
}) => {
  // 场景数据状态
  const [availableScenarios, setAvailableScenarios] = React.useState([]);
  const [scenarioLoading, setScenarioLoading] = React.useState(false);
  const [scenarioCategories, setScenarioCategories] = React.useState([]);
  
  // 加载场景数据
  const loadScenarios = React.useCallback(async () => {
    setScenarioLoading(true);
    try {
      // 获取已发布的场景
      const response = await scenarioService.getAllScenarios({ 
        status: 'published' 
      });
      
      if (response.success && response.data) {
        setAvailableScenarios(response.data);
      }
    } catch (error) {
      console.error('加载场景数据失败:', error);
      message.error('加载场景数据失败');
    } finally {
      setScenarioLoading(false);
    }
  }, []);
  
  // 组件加载时获取场景数据
  React.useEffect(() => {
    loadScenarios();
  }, [loadScenarios]);

  // AI创建场景处理函数
  const handleAICreateScenario = () => {
    Modal.confirm({
      title: 'AI智能创建场景',
      width: 600,
      content: (
        <div style={{ padding: '16px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖✨</div>
            <Text style={{ fontSize: '16px', color: '#1890ff', fontWeight: 'bold' }}>AI场景创建助手</Text>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <Text style={{ fontSize: '14px', lineHeight: '1.6', color: '#666' }}>
              AI将基于您当前的学习资料和需求，智能生成个性化的场景模拟。
            </Text>
          </div>
          
          <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
            <Text style={{ fontSize: '13px', color: '#666' }}>
              <strong>🎯 AI将分析以下内容：</strong>
            </Text>
            <ul style={{ margin: '8px 0 0 0', padding: '0 0 0 20px', color: '#666', fontSize: '13px' }}>
              <li>您已上传的{state.uploadedFiles?.length || 0}个文件资料</li>
              <li>您添加的{state.addedTexts?.length || 0}个文本内容</li>
              <li>您收集的{state.courseVideos?.length || 0}个视频资源</li>
              <li>您保存的{state.links?.length || 0}个网页链接</li>
            </ul>
          </div>
          
          <div style={{ background: '#e6f7ff', padding: '16px', borderRadius: '8px', border: '1px solid #91d5ff' }}>
            <Text style={{ fontSize: '13px', color: '#0050b3' }}>
              <strong>🚀 生成内容包括：</strong>
            </Text>
            <ul style={{ margin: '8px 0 0 0', padding: '0 0 0 20px', color: '#0050b3', fontSize: '13px' }}>
              <li>个性化场景标题和描述</li>
              <li>适合的难度等级和时长设定</li>
              <li>针对性的学习目标和技能标签</li>
              <li>基于资料的交互式场景内容</li>
            </ul>
          </div>
        </div>
      ),
      okText: '🎨 开始AI创建',
      cancelText: '取消',
      icon: null,
      onOk: () => {
        // 关闭场景选择弹窗
        setScenarioModalVisible(false);
        
        // 在操作记录中创建AI创建场景的记录
        const totalMaterials = (state.uploadedFiles?.length || 0) + 
                               (state.addedTexts?.length || 0) + 
                               (state.courseVideos?.length || 0) + 
                               (state.links?.length || 0);
        
        const aiCreationRecord = {
          id: Date.now(),
          title: `AI智能创建场景：基于${totalMaterials}个资料生成`,
          source: 'AI智能助手',
          time: '刚刚',
          type: 'scenario',
          status: 'creating', // 创建中状态
          progress: 0, // 初始进度
          description: 'AI正在分析您的学习资料并智能生成个性化场景模拟...',
          isAIGenerated: true,
          materialCount: totalMaterials
        };
        
        // 添加到操作记录
        setOperationRecords(prev => ({
          ...prev,
          scenario: [aiCreationRecord, ...prev.scenario]
        }));
        
        message.success('AI创建任务已启动，请在操作记录中查看进度');
        
        // 模拟AI创建进度
        let currentProgress = 0;
        const progressInterval = setInterval(() => {
          currentProgress += Math.random() * 15 + 5; // 每次增加5-20%
          
          if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(progressInterval);
            
            // 创建完成，更新记录状态
            setTimeout(() => {
              const completedScenario = {
                id: `ai-${Date.now()}`,
                title: `【AI生成】智能场景：基于${totalMaterials}个资料的个性化训练`,
                description: `AI基于您的学习资料智能生成的个性化场景模拟，包含针对性的训练内容和交互式学习体验。`,
                category: 'ai_generated',
                difficulty: 'medium',
                duration: '30-45分钟',
                author: 'AI助手',
                tags: ['AI生成', '个性化', '智能场景', '数据驱动'],
                views: 0,
                rating: 5.0,
                thumbnail: '/gen-html/ai-mental-health-scenario.html',
                learningObjectives: '通过AI分析的个性化学习目标，提升实际应用能力',
                isAIGenerated: true,
                createTime: new Date().toISOString(),
                status: 'completed',
                progress: 100,
                source: 'AI智能助手',
                time: '刚刚',
                type: 'scenario',
                materialCount: totalMaterials
              };
              
              // 更新操作记录，将创建中的记录替换为完成的记录
              setOperationRecords(prev => ({
                ...prev,
                scenario: prev.scenario.map(record => 
                  record.id === aiCreationRecord.id ? completedScenario : record
                )
              }));
              
              // 同时添加到可用场景列表
              setAvailableScenarios(prev => [completedScenario, ...prev]);
              
              message.success('🎉 AI场景创建完成！您可以在操作记录中查看和运行新场景');
            }, 500);
          } else {
            // 更新进度
            setOperationRecords(prev => ({
              ...prev,
              scenario: prev.scenario.map(record => 
                record.id === aiCreationRecord.id 
                  ? { ...record, progress: Math.round(currentProgress) }
                  : record
              )
            }));
          }
        }, 300); // 每300ms更新一次进度
      }
    });
  };

  // 场景选择处理函数
  const handleScenarioSelect = (scenario) => {
    // 创建场景选择的操作记录
    const scenarioRecord = {
      id: `scenario-${Date.now()}`,
      title: scenario.title,
      description: scenario.description,
      category: scenario.category,
      difficulty: scenario.difficulty,
      duration: scenario.duration,
      author: scenario.author,
      tags: scenario.tags || [],
      views: scenario.views || 0,
      rating: scenario.rating || 0,
      thumbnail: scenario.thumbnail,
      learningObjectives: scenario.learningObjectives,
      source: '场景库选择',
      time: '刚刚',
      type: 'scenario',
      status: 'selected',
      createTime: new Date().toISOString()
    };
    
    // 添加到操作记录
    setOperationRecords(prev => ({
      ...prev,
      scenario: [scenarioRecord, ...prev.scenario]
    }));
    
    setSelectedScenarios([scenarioRecord]);
    message.success(`已选择场景：${scenario.title}`);
    setScenarioModalVisible(false);
    
    // 显示场景详情
    showScenarioDetails(scenario);
  };

  // 显示场景详情
  const showScenarioDetails = (scenario) => {
    // 难度级别映射
    const difficultyMap = {
      'easy': '初级',
      'medium': '中级', 
      'hard': '高级'
    };
    const difficultyText = difficultyMap[scenario.difficulty] || scenario.difficulty;
    
    // 分类映射
    const categoryMap = {
      'psychology': '学生心理',
      'family': '家庭教育',
      'teacher': '教师培训',
      'management': '班级管理',
      'leadership': '学校管理',
      'special': '特殊教育',
      'science_demo': '教学科学演示'
    };
    const categoryText = categoryMap[scenario.category] || scenario.category;

    Modal.info({
      title: `场景模拟：${scenario.title}`,
      width: 700,
      content: (
        <div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ 
              width: '100%', 
              height: '200px', 
              marginBottom: '16px',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <iframe 
                src={scenario.thumbnail}
                title={scenario.title}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  border: 'none'
                }}
              />
            </div>
            <p style={{ marginBottom: '12px', color: '#666', lineHeight: '1.6' }}>
              <strong>描述：</strong>{scenario.description}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              <p style={{ margin: 0 }}>
                <strong>难度等级：</strong>
                <span style={{ 
                  color: scenario.difficulty === 'easy' ? '#52c41a' : 
                         scenario.difficulty === 'medium' ? '#fa8c16' : '#f5222d'
                }}>
                  {difficultyText}
                </span>
              </p>
              <p style={{ margin: 0 }}>
                <strong>预计时长：</strong>{scenario.duration}
              </p>
              <p style={{ margin: 0 }}>
                <strong>作者：</strong>{scenario.author}
              </p>
              <p style={{ margin: 0 }}>
                <strong>分类：</strong>{categoryText}
              </p>
              <p style={{ margin: 0 }}>
                <strong>浏览次数：</strong>{scenario.views || 0}
              </p>
              <p style={{ margin: 0 }}>
                <strong>评分：</strong>⭐ {scenario.rating || 0}
              </p>
            </div>
            {scenario.learningObjectives && (
              <p style={{ marginBottom: '12px' }}>
                <strong>学习目标：</strong>{scenario.learningObjectives}
              </p>
            )}
            {scenario.tags && scenario.tags.length > 0 && (
              <div>
                <strong>标签：</strong>
                <div style={{ marginTop: '4px' }}>
                  {scenario.tags.map(tag => (
                    <span key={tag} style={{
                      display: 'inline-block',
                      background: '#f0f0f0',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      margin: '2px 4px 2px 0'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ),
      okText: '运行场景',
      onOk: () => {
        // 在新窗口中打开场景
        if (scenario.thumbnail) {
          window.open(scenario.thumbnail, '_blank');
          message.success('场景已在新窗口中打开');
        } else {
          message.error('场景文件不存在');
        }
      }
    });
  };

  // 渲染场景卡片
  const renderScenarioCard = (scenario) => {
    // 难度级别映射
    const difficultyMap = {
      'easy': '初级',
      'medium': '中级', 
      'hard': '高级'
    };
    const difficultyText = difficultyMap[scenario.difficulty] || scenario.difficulty;
    
    // 分类映射
    const categoryMap = {
      'psychology': '学生心理',
      'family': '家庭教育',
      'teacher': '教师培训',
      'management': '班级管理',
      'leadership': '学校管理',
      'special': '特殊教育',
      'science_demo': '教学科学演示'
    };
    const categoryText = categoryMap[scenario.category] || scenario.category;

    return (
      <Card
        key={scenario.id}
        hoverable
        onClick={() => handleScenarioSelect(scenario)}
        style={{
          cursor: 'pointer',
          border: '1px solid #e8e8e8',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', gap: '16px' }}>
          {/* 左侧缩略图 */}
          <div style={{ 
            width: '120px',
            height: '80px',
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <iframe 
              src={scenario.thumbnail}
              title={scenario.title}
              style={{ 
                width: '100%', 
                height: '100%', 
                border: 'none',
                pointerEvents: 'none',
                transform: 'scale(0.8)',
                transformOrigin: 'top left'
              }}
            />
          </div>
          
          {/* 中间内容 */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <Title level={5} style={{ margin: 0, color: '#1890ff' }}>
                {scenario.title}
              </Title>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  background: scenario.difficulty === 'easy' ? '#f6ffed' : 
                             scenario.difficulty === 'medium' ? '#fff7e6' : '#fff2f0',
                  color: scenario.difficulty === 'easy' ? '#52c41a' : 
                         scenario.difficulty === 'medium' ? '#fa8c16' : '#f5222d',
                  border: `1px solid ${scenario.difficulty === 'easy' ? '#b7eb8f' : 
                                        scenario.difficulty === 'medium' ? '#ffd591' : '#ffccc7'}`
                }}>
                  {difficultyText}
                </span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  background: '#f0f0f0',
                  color: '#666'
                }}>
                  {scenario.duration}
                </span>
              </div>
            </div>
            
            <Text style={{ color: '#666', fontSize: '13px', lineHeight: '1.4', display: 'block', marginBottom: '8px' }}>
              {scenario.description}
            </Text>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{
                  padding: '1px 6px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  background: 'rgba(24, 144, 255, 0.1)',
                  color: '#1890ff'
                }}>
                  {categoryText}
                </span>
                <Text style={{ fontSize: '12px', color: '#999' }}>
                  👤 {scenario.author}
                </Text>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Text style={{ fontSize: '12px', color: '#999' }}>
                  👁 {scenario.views || 0}
                </Text>
                <Text style={{ fontSize: '12px', color: '#999' }}>
                  ⭐ {scenario.rating || 0}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Modal
      title="选择场景模拟"
      open={scenarioModalVisible}
      onCancel={() => setScenarioModalVisible(false)}
      footer={null}
      width={1000}
      centered
    >
      <div style={{ padding: '20px 0' }}>
        {/* 顶部操作栏 */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* 筛选器 */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Text strong>筛选条件：</Text>
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              placeholder="所有难度"
            >
              <Select.Option value="all">所有难度</Select.Option>
              <Select.Option value="easy">初级</Select.Option>
              <Select.Option value="medium">中级</Select.Option>
              <Select.Option value="hard">高级</Select.Option>
            </Select>
            <Select
              defaultValue="all"
              style={{ width: 140 }}
              placeholder="所有分类"
            >
              <Select.Option value="all">所有分类</Select.Option>
              <Select.Option value="psychology">学生心理</Select.Option>
              <Select.Option value="family">家庭教育</Select.Option>
              <Select.Option value="teacher">教师培训</Select.Option>
              <Select.Option value="management">班级管理</Select.Option>
              <Select.Option value="leadership">学校管理</Select.Option>
              <Select.Option value="special">特殊教育</Select.Option>
              <Select.Option value="science_demo">教学科学演示</Select.Option>
            </Select>
            <Button 
              type="link" 
              onClick={loadScenarios}
              loading={scenarioLoading}
              style={{ padding: 0 }}
            >
              🔄 刷新
            </Button>
          </div>
          
          {/* AI创建场景按钮 */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button 
              type="primary"
              icon={<span style={{ fontSize: '16px', marginRight: '4px' }}>🤖</span>}
              onClick={handleAICreateScenario}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '6px',
                height: '36px',
                fontWeight: 'bold'
              }}
            >
              AI创建场景
            </Button>
            
            <Button 
              icon={<span style={{ fontSize: '16px', marginRight: '4px' }}>➕</span>}
              onClick={() => {
                message.info('手动创建场景功能开发中...');
              }}
              style={{
                borderColor: '#d9d9d9',
                color: '#666',
                borderRadius: '6px',
                height: '36px'
              }}
            >
              手动创建
            </Button>
          </div>
        </div>
        
        {/* 场景列表 */}
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {scenarioLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔄</div>
              <Text>正在加载场景数据...</Text>
            </div>
          ) : availableScenarios.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              {availableScenarios.map(renderScenarioCard)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>场</div>
              <Text style={{ fontSize: '16px' }}>暂无可用的场景模拟</Text>
              <br />
              <Text style={{ fontSize: '14px', color: '#ccc' }}>请先在"场景模拟"模块中创建一些场景</Text>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ScenarioSimulation;