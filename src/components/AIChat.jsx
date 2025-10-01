import React from 'react';
import {
  Button,
  Typography,
  Space,
  message,
  Card,
  Avatar,
  Input
} from 'antd';
import {
  SaveOutlined,
  SendOutlined,
  FileTextOutlined,
  RobotOutlined,
  UserOutlined
} from '@ant-design/icons';
import { COMMON_QUESTIONS } from '../constants/noteEditConstants';
import { generateSummaryContent } from '../utils/noteEditUtils';
import notesService from '../services/notesService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const AIChat = ({ state, handlers }) => {
  const {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isLoading,
    setIsLoading,
    selectedMaterials,
    uploadedFiles,
    links,
    addedTexts,
    courseVideos,
    organizationalCourses,
    operationRecords,
    setOperationRecords
  } = state;

  const { onSaveToNote } = handlers;

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // 基于个人培训与学习数据生成“学伴”式智能回复
    setTimeout(() => {
      try {
        const notes = notesService.getAllNotes() || [];
        const byCategory = (cat) => notes.filter(n => n.category === cat);
        const study = byCategory('study');
        const personal = byCategory('personal');
        const orgTrain = byCategory('organizational_training');

        const recentTitles = (arr, k = 3) => arr
          .slice()
          .sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0))
          .slice(0, k)
          .map(n => n.title)
          .filter(Boolean);

        const studyCount = study.length;
        const personalCount = personal.length;
        const orgCount = orgTrain.length;

        const orgProgress = (() => {
          let totalUnits = 0;
          let completedUnits = 0;
          for (const n of orgTrain) {
            const schedule = n.learningSchedule;
            if (Array.isArray(schedule)) {
              totalUnits += schedule.length;
              completedUnits += schedule.filter(u => u.completed || u.done || u.status === 'completed').length;
            } else if (schedule && Array.isArray(schedule.units)) {
              totalUnits += schedule.units.length;
              completedUnits += schedule.units.filter(u => u.completed || u.done || u.status === 'completed').length;
            }
          }
          const percent = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : null;
          return { totalUnits, completedUnits, percent };
        })();

        const studyRecent = recentTitles(study, 3);
        const personalRecent = recentTitles(personal, 3);
        const orgRecent = recentTitles(orgTrain, 3);

        const progressLine = orgProgress.percent != null
          ? `组织培训总体进度约为 ${orgProgress.percent}%（${orgProgress.completedUnits}/${orgProgress.totalUnits} 单元）。`
          : orgCount > 0
            ? `已记录 ${orgCount} 条组织培训笔记，部分课程包含学习进度。`
            : `尚未记录组织培训数据，建议先添加培训课程或生成模拟数据。`;

        const suggestion = [
          '- 今日建议：复习最近一次组织培训的关键知识点，完成一个未完成单元。',
          '- 学习规划：从最近的学习笔记中挑选一个主题，生成导图或小测验。',
          '- 数据跟踪：开启形成性评价记录（参与度、作业正确率、路径完成度）。'
        ].join('\n');

        const content = [
          `您问到：“${inputMessage}”。以下是基于您个人的培训与学习数据的学伴答复：`,
          '',
          '【个人学习与培训概览】',
          `- 学习笔记：${studyCount} 条；近期主题：${studyRecent.join('、') || '暂无'}`,
          `- 个人笔记：${personalCount} 条；近期主题：${personalRecent.join('、') || '暂无'}`,
          `- 组织培训：${orgCount} 条；近期课程：${orgRecent.join('、') || '暂无'}`,
          `- 进度概况：${progressLine}`,
          '',
          '【学伴建议】',
          suggestion,
          '',
          '如果需要，我可以：',
          '- 生成复习清单或导图',
          '- 汇总本周学习报告',
          '- 提醒下一个学习里程碑'
        ].join('\n');

        const aiResponse = {
          id: Date.now() + 1,
          type: 'assistant',
          content,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiResponse]);
      } catch (e) {
        const fallback = {
          id: Date.now() + 1,
          type: 'assistant',
          content: `我理解您的问题：“${inputMessage}”。目前无法读取个人数据，请稍后重试或点击“生成模拟数据”。`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, fallback]);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  // 保存AI回复到笔记
  const handleSaveToNote = (content, userQuestion) => {
    const newRecord = {
      id: Date.now(),
      title: userQuestion || `AI问答笔记 - ${new Date().toLocaleString()}`,
      source: 'AI智能问答',
      time: '刚刚',
      type: 'note',
      content: content
    };

    setOperationRecords(prev => ({
      ...prev,
      note: [newRecord, ...prev.note]
    }));

    message.success('AI回复已保存到笔记');
  };

  // 操作按钮点击处理函数
  const handleOperationClick = (operationType) => {
    const operationTitles = {
      audio: '音频概览',
      video: '视频概览', 
      mindmap: '思维导图',
      report: '分析报告',
      ppt: 'PPT演示',
      webcode: '网页代码',
      scenario: '场景模拟',
      'training-plan': '培训方案',
      schedule: '课表',
      participants: '参训人员清单',
      note: '笔记'
    };

    // 计算所有资料的总数
    const totalMaterials = uploadedFiles.length + addedTexts.length + courseVideos.length + links.length;

    const newRecord = {
      id: Date.now(),
      title: `基于${totalMaterials}个资料生成${operationTitles[operationType]}`,
      source: `${totalMaterials}个来源`,
      time: '刚刚',
      type: operationType
    };

    // 对于培训方案和课表工具，不显示文字生成效果，直接添加记录
    if (operationType === 'training-plan' || operationType === 'schedule') {
      setOperationRecords(prev => ({
        ...prev,
        [operationType]: [newRecord, ...prev[operationType]]
      }));
      message.success(`${operationTitles[operationType]}已生成并添加到操作记录`);
    } else {
      // 其他工具保持原有的进度效果
      message.loading(`正在生成${operationTitles[operationType]}...`, 3);
      setTimeout(() => {
        setOperationRecords(prev => ({
          ...prev,
          [operationType]: [newRecord, ...prev[operationType]]
        }));
        message.success(`${operationTitles[operationType]}已生成并添加到操作记录`);
      }, 3000);
    }
  };

  return (
    <div style={{ 
      flex: 5, 
      margin: '16px', 
      background: '#fff', 
      borderRadius: '8px', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'flex 0.3s ease',
      position: 'relative',
      height: '100%'
    }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
        <Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>
          💬 智能问答
        </Title>
      </div>
      
      {/* 摘要区域 */}
      <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
        <div style={{ marginBottom: '12px' }}>
          <Text strong style={{ color: '#1890ff' }}>📋 针对所有来源的摘要</Text>
        </div>
        <Card size="small" style={{ marginBottom: '16px', backgroundColor: '#fff' }}>
           <Paragraph style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
             {generateSummaryContent(uploadedFiles, links, addedTexts, courseVideos, organizationalCourses)}
           </Paragraph>
         </Card>
        
        {/* 快捷操作按钮 */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button 
            size="small" 
            icon={<FileTextOutlined />}
            onClick={() => {
              const newNote = {
                id: Date.now(),
                title: '摘要笔记',
                source: '智能摘要',
                time: '刚刚',
                type: 'report'
              };
              setOperationRecords(prev => ({
                ...prev,
                report: [newNote, ...prev.report]
              }));
              message.success('摘要已保存为笔记');
            }}
            style={{ borderRadius: '16px' }}
          >
            保存笔记
          </Button>
          <Button 
            size="small" 
            icon={<span>音频</span>}
            onClick={() => handleOperationClick('audio')}
            style={{ borderRadius: '16px' }}
          >
            音频概览
          </Button>
          <Button 
            size="small" 
            icon={<span>导图</span>}
            onClick={() => handleOperationClick('mindmap')}
            style={{ borderRadius: '16px' }}
          >
            思维导图
          </Button>
        </div>
      </div>
      
      {/* 消息列表 */}
      <div style={{ 
        flex: 1, 
        padding: '20px', 
        overflowY: 'auto', 
        paddingBottom: '140px',
        minHeight: 0
      }}>
        {messages.map((msg, index) => {
          // 查找对应的用户问题
          const correspondingUserMessage = msg.type === 'assistant' ? 
            messages.slice(0, index).reverse().find(m => m.type === 'user') : null;
          
          return (
            <div key={msg.id} style={{ marginBottom: 16 }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: 8
              }}>
                {msg.type === 'assistant' && (
                  <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
                )}
                <div style={{
                  maxWidth: '70%'
                }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: msg.type === 'user' ? '#1890ff' : '#f6f6f6',
                    color: msg.type === 'user' ? '#fff' : '#333'
                  }}>
                    <Text style={{ color: 'inherit' }}>{msg.content}</Text>
                  </div>
                  {msg.type === 'assistant' && (
                    <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-start' }}>
                      <Button
                        size="small"
                        type="text"
                        icon={<SaveOutlined />}
                        onClick={() => handleSaveToNote(msg.content, correspondingUserMessage?.content)}
                        style={{
                          fontSize: '12px',
                          color: '#666',
                          padding: '4px 8px',
                          height: 'auto'
                        }}
                      >
                        保存到笔记
                      </Button>
                    </div>
                  )}
                </div>
                {msg.type === 'user' && (
                  <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#52c41a' }} />
                )}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
            <div style={{ padding: '12px 16px', backgroundColor: '#f6f6f6', borderRadius: '12px' }}>
              <Text>正在思考中...</Text>
            </div>
          </div>
        )}
      </div>
      
      {/* 底部固定区域 */}
      <div style={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid #f0f0f0',
        backgroundColor: '#fff',
        zIndex: 10,
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px'
      }}>
        {/* 常见问题按钮 */}
        <div style={{ padding: '16px 20px 0 20px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflow: 'hidden' }}>
            {COMMON_QUESTIONS.map(question => (
              <Button 
                key={question.key}
                size="small" 
                style={{ 
                  borderRadius: '16px', 
                  fontSize: '11px',
                  flex: '1 1 0',
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => setInputMessage(question.message)}
                title={question.text}
              >
                {question.text}
              </Button>
            ))}
          </div>
        </div>
        
        {/* 输入区域 */}
        <div style={{ padding: '0 20px 20px 20px' }}>
          <Space.Compact style={{ width: '100%', position: 'relative' }}>
            {/* 选中资料数量提示 - 浮动显示 */}
            {selectedMaterials.length > 0 && (
              <div style={{ 
                position: 'absolute',
                top: '-24px',
                left: '0',
                padding: '2px 8px', 
                backgroundColor: '#f6ffed', 
                border: '1px solid #b7eb8f', 
                borderRadius: '12px',
                fontSize: '10px',
                color: '#52c41a',
                zIndex: 10,
                whiteSpace: 'nowrap'
              }}>
                📋 {selectedMaterials.length}个资料
              </div>
            )}
            <Input.TextArea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={selectedMaterials.length > 0 ? `基于已选择的 ${selectedMaterials.length} 个资料，请输入您的问题...` : "请先选择资料后再输入问题..."}
              autoSize={{ minRows: 1, maxRows: 3 }}
              disabled={selectedMaterials.length === 0}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              type="primary" 
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              loading={isLoading}
              disabled={!inputMessage.trim() || selectedMaterials.length === 0}
            >
              发送
            </Button>
          </Space.Compact>
        </div>
      </div>
    </div>
  );
};

export default AIChat;