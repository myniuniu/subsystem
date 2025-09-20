import React, { useState, useEffect } from 'react';
import {
  Layout,
  Input,
  Button,
  Typography,
  Space,
  message,
  Upload,
  List,
  Card,
  Divider,
  Tag,
  Avatar,
  Tooltip,
  Select,
  Row,
  Col,
  Modal,
  Checkbox,
  Popconfirm,
  Dropdown
} from 'antd';
import MaterialAddPage from './MaterialAddPage';
import ExploreModal from './ExploreModal';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
  FileTextOutlined,
  LinkOutlined,
  SendOutlined,
  PlusOutlined,
  DeleteOutlined,
  DownloadOutlined,
  CopyOutlined,
  ShareAltOutlined,
  RobotOutlined,
  UserOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  GlobalOutlined,
  MoreOutlined,
  EditOutlined
} from '@ant-design/icons';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const NoteEditPage = ({ onBack, onViewChange }) => {
  // 资料收集相关状态
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: '成都火锅制作工艺.pdf', type: 'application/pdf', uploadTime: '刚刚' }
  ]);
  
  // 多选功能状态
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [showMaterialDetail, setShowMaterialDetail] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [links, setLinks] = useState([
    { id: 2, url: 'https://chengdu-food.com', title: '成都美食攻略网站', addTime: '刚刚' }
  ]);
  const [newLink, setNewLink] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMaterialAddModal, setShowMaterialAddModal] = useState(false);
  const [websiteType, setWebsiteType] = useState('normal'); // 'normal' 或 'video'
  const [websiteUrl, setWebsiteUrl] = useState('');// 文字内容相关状态
  const [textContent, setTextContent] = useState('');
  const [addedTexts, setAddedTexts] = useState([
    { id: 3, title: '成都小吃介绍', content: '成都是著名的美食之都，拥有麻婆豆腐、回锅肉、担担面、龙抄手等众多特色小吃...', addTime: '刚刚' }
  ]);
  
  // 课程视频相关状态
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [courseVideos, setCourseVideos] = useState([
    { id: 4, title: '成都火锅制作教程', url: 'https://video.com/chengdu-hotpot', addTime: '刚刚' }
  ]);
  
  // 问答区域相关状态
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 快捷操作相关状态
  const [quickActions] = useState([
    { key: 'summarize', label: '内容总结', icon: <FileTextOutlined /> },
    { key: 'extract', label: '关键信息提取', icon: <CopyOutlined /> },
    { key: 'translate', label: '翻译', icon: <ShareAltOutlined /> },
    { key: 'analyze', label: '深度分析', icon: <RobotOutlined /> }
  ]);
  
  // 操作结果相关状态
  const [operationResults, setOperationResults] = useState([]);
  
  // 操作面板相关状态
  const [selectedOperation, setSelectedOperation] = useState('audio'); // 当前选中的操作类型
  
  // 探索弹窗相关状态
  const [showExploreModal, setShowExploreModal] = useState(false);
  
  // 操作记录状态
  const [operationRecords, setOperationRecords] = useState({
    audio: [],
    video: [],
    mindmap: [],
    report: [],
    ppt: [],
    webcode: [],
    file: [],
    text: [],
    link: []
  });

  // 内容查看弹窗状态
  const [showContentModal, setShowContentModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [modalContent, setModalContent] = useState('');

  // 预览功能状态
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewType, setPreviewType] = useState('');
  const [previewData, setPreviewData] = useState(null);
  
  // 智能笔记相关状态
  const [smartNotes, setSmartNotes] = useState([]);
  const [showSmartNotesModal, setShowSmartNotesModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // 新建笔记功能
  const handleCreateNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: '新建笔记',
      source: '手动创建',
      time: '刚刚',
      type: 'report'
    };
    
    setOperationRecords(prev => ({
      ...prev,
      report: [newNote, ...prev.report]
    }));
    
    message.success('新建笔记已添加到操作记录');
  };

  // 处理探索功能
  const handleExplore = (exploreData) => {
    const { query, source } = exploreData;
    
    // 模拟探索结果
    const mockResults = {
      web: [
        {
          id: Date.now() + 1,
          title: `关于"${query}"的网络资源`,
          url: `https://search.example.com/q=${encodeURIComponent(query)}`,
          content: `通过网络搜索找到的关于"${query}"的相关内容...`,
          addTime: '刚刚',
          source: 'Web搜索'
        }
      ],
      'google-drive': [
        {
          id: Date.now() + 2,
          title: `Google云端硬盘中的"${query}"相关文档`,
          url: `https://drive.google.com/search?q=${encodeURIComponent(query)}`,
          content: `从Google云端硬盘中找到的关于"${query}"的文档...`,
          addTime: '刚刚',
          source: 'Google云端硬盘'
        }
      ]
    };
    
    // 根据选择的来源添加结果到对应的资料列表
    const results = mockResults[source] || [];
    
    if (results.length > 0) {
      // 添加到链接列表
      setLinks(prev => [...results.map(r => ({
        id: r.id,
        url: r.url,
        title: r.title,
        addTime: r.addTime
      })), ...prev]);
      
      // 添加到文本内容列表
      setAddedTexts(prev => [...results.map(r => ({
        id: r.id + 1000,
        title: r.title,
        content: r.content,
        addTime: r.addTime,
        source: r.source
      })), ...prev]);
      
      message.success(`成功从${source === 'web' ? 'Web' : 'Google云端硬盘'}探索到${results.length}条相关资源`);
    } else {
      message.info('未找到相关资源，请尝试其他关键词');
    }
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
      'training-plan': '培训方案',
      schedule: '课表',
      participants: '参训人员清单'
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

    setOperationRecords(prev => ({
      ...prev,
      [operationType]: [newRecord, ...prev[operationType]]
    }));

    message.success(`${operationTitles[operationType]}已生成并添加到操作记录`);
  };

  // 保存AI回复到笔记
  const handleSaveToNote = (content) => {
    const newRecord = {
      id: Date.now(),
      title: `AI问答笔记 - ${new Date().toLocaleString()}`,
      source: 'AI智能问答',
      time: '刚刚',
      type: 'report',
      content: content
    };

    setOperationRecords(prev => ({
      ...prev,
      report: [newRecord, ...prev.report]
    }));

    message.success('AI回复已保存到笔记');
  };

  // 处理更多操作菜单点击
  const handleMoreAction = (action, record) => {
    switch (action) {
      case 'convertToSource':
        // 将操作记录转换为资料来源
        const newMaterial = {
          id: Date.now(),
          title: record.title,
          content: record.content || `来源于操作记录：${record.title}`,
          addTime: '刚刚',
          source: record.source || '操作记录转换'
        };
        
        // 根据记录类型添加到对应的资料数组
        if (record.type === 'report' || record.type === 'mindmap') {
          setAddedTexts(prev => [newMaterial, ...prev]);
        } else if (record.type === 'video' || record.type === 'audio') {
          setCourseVideos(prev => [{
            ...newMaterial,
            url: record.url || 'https://converted-from-record.com'
          }, ...prev]);
        } else {
          setAddedTexts(prev => [newMaterial, ...prev]);
        }
        
        message.success(`已将"${record.title}"转换为来源并保存到资料`);
        break;
      case 'convertAllToSource':
        // 将所有操作记录转换为资料来源
        const allRecords = Object.values(operationRecords).flat();
        const convertedMaterials = allRecords.map(rec => ({
          id: Date.now() + Math.random(),
          title: rec.title,
          content: rec.content || `来源于操作记录：${rec.title}`,
          addTime: '刚刚',
          source: rec.source || '操作记录转换'
        }));
        
        setAddedTexts(prev => [...convertedMaterials, ...prev]);
        message.success(`已将${allRecords.length}条操作记录转换为来源并保存到资料`);
        break;
      case 'delete':
        // 从操作记录中删除该记录
        setOperationRecords(prev => {
          const newRecords = { ...prev };
          Object.keys(newRecords).forEach(type => {
            newRecords[type] = newRecords[type].filter(r => r.id !== record.id);
          });
          return newRecords;
        });
        message.success(`已删除"${record.title}"`);
        break;
      default:
        break;
    }
  };

  // 获取更多操作菜单项
  const getMoreMenuItems = (record) => {
    const commonItems = [
      {
        key: 'delete',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🗑️</span>
            <span>删除</span>
          </div>
        ),
        onClick: () => handleMoreAction('delete', record)
      }
    ];

    // 报告类型添加额外选项
    if (record.type === 'report') {
      return [
        {
          key: 'convertToSource',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📋</span>
              <span>转换为来源</span>
            </div>
          ),
          onClick: () => handleMoreAction('convertToSource', record)
        },
        {
          key: 'convertAllToSource',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📄</span>
              <span>将所有笔记转换为来源</span>
            </div>
          ),
          onClick: () => handleMoreAction('convertAllToSource', record)
        },
        ...commonItems
      ];
    }

    return commonItems;
  };

  // 处理记录点击打开
  const handleRecordClick = (record) => {
    setCurrentRecord(record);
    
    // 根据记录类型生成不同的内容
    switch (record.type) {
      case 'report':
        setModalContent(`
          <div style="padding: 20px; line-height: 1.6;">
            <h2 style="color: #1890ff; margin-bottom: 20px;">${record.title}</h2>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <strong>📊 数据来源：</strong>${record.source}<br>
              <strong>⏰ 生成时间：</strong>${record.time}
            </div>
            <h3 style="color: #333; margin: 20px 0 10px 0;">📈 分析概述</h3>
            <p>基于收集的资料，本报告对相关内容进行了深入分析。通过数据挖掘和模式识别，我们发现了以下关键洞察...</p>
            <h3 style="color: #333; margin: 20px 0 10px 0;">🔍 主要发现</h3>
            <ul>
              <li>关键趋势分析显示出明显的增长模式</li>
              <li>数据相关性分析揭示了重要的关联因素</li>
              <li>预测模型表明未来发展的潜在方向</li>
            </ul>
            <h3 style="color: #333; margin: 20px 0 10px 0;">💡 建议与结论</h3>
            <p>综合分析结果，建议采取以下措施以优化效果和提升价值...</p>
          </div>
        `);
        break;
      case 'audio':
        setModalContent(`
          <div style="padding: 20px; text-align: center;">
            <h2 style="color: #1890ff; margin-bottom: 30px;">${record.title}</h2>
            <div style="background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%); padding: 30px; border-radius: 16px; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);">
              <div style="font-size: 64px; margin-bottom: 20px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">🎵</div>
              <p style="font-size: 18px; color: #1890ff; margin: 0; font-weight: 500;">音频播放器</p>
            </div>
            <div style="background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px; box-shadow: 0 6px 20px rgba(0,0,0,0.3);">
              <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 15px;">
                <button style="background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%); color: white; border: none; border-radius: 50%; width: 50px; height: 50px; cursor: pointer; font-size: 18px; box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3); transition: all 0.2s ease;">▶</button>
                <div style="flex: 1; height: 6px; background: #444; border-radius: 3px; position: relative; overflow: hidden;">
                  <div style="width: 30%; height: 100%; background: linear-gradient(90deg, #1890ff 0%, #40a9ff 100%); border-radius: 3px; box-shadow: 0 0 8px rgba(24, 144, 255, 0.5);"></div>
                </div>
                <span style="color: #fff; font-size: 14px; font-family: monospace;">02:30 / 05:00</span>
              </div>
              <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 15px;">
                <button style="background: transparent; color: #ccc; border: none; cursor: pointer; font-size: 20px; padding: 5px;">⏮</button>
                <button style="background: transparent; color: #ccc; border: none; cursor: pointer; font-size: 20px; padding: 5px;">⏸</button>
                <button style="background: transparent; color: #ccc; border: none; cursor: pointer; font-size: 20px; padding: 5px;">⏭</button>
                <button style="background: transparent; color: #ccc; border: none; cursor: pointer; font-size: 16px; padding: 5px;">🔊</button>
              </div>
              <div style="text-align: center;">
                <span style="color: #999; font-size: 14px;">${record.source}</span>
              </div>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #1890ff;">
              <div style="text-align: left;">
                <p style="margin: 0 0 10px 0; color: #333;"><strong>📝 内容摘要：</strong>基于${record.source}生成的音频概览</p>
                <p style="margin: 0 0 10px 0; color: #333;"><strong>⏱️ 时长：</strong>约 5 分钟</p>
                <p style="margin: 0; color: #333;"><strong>🎯 重点内容：</strong>核心要点提炼和关键信息总结，建议使用耳机获得更好的收听体验</p>
              </div>
            </div>
          </div>
        `);
        break;
      case 'video':
        setModalContent(`
          <div style="padding: 20px;">
            <h2 style="color: #1890ff; margin-bottom: 30px; text-align: center;">${record.title}</h2>
            <div style="background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); border-radius: 12px; margin-bottom: 25px; position: relative; aspect-ratio: 16/9; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.4);">
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; text-align: center;">
                <div style="font-size: 72px; margin-bottom: 15px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));">🎬</div>
                <button style="background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%); color: white; border: 3px solid rgba(255,255,255,0.8); border-radius: 50%; width: 80px; height: 80px; cursor: pointer; font-size: 28px; backdrop-filter: blur(10px); transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(255,255,255,0.2);">▶</button>
              </div>
              <div style="position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.6); padding: 8px 12px; border-radius: 20px; backdrop-filter: blur(10px);">
                <span style="color: white; font-size: 12px; font-weight: 500;">HD 1080p</span>
              </div>
              <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 20px 15px 15px; backdrop-filter: blur(5px);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                  <button style="background: transparent; color: white; border: none; cursor: pointer; font-size: 16px; padding: 4px;">⏮</button>
                  <button style="background: rgba(255,255,255,0.2); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; padding: 6px 8px;">⏸</button>
                  <button style="background: transparent; color: white; border: none; cursor: pointer; font-size: 16px; padding: 4px;">⏭</button>
                  <span style="color: white; font-size: 13px; font-family: monospace; margin-left: 8px;">00:00 / 08:00</span>
                  <div style="flex: 1; height: 5px; background: rgba(255,255,255,0.2); border-radius: 3px; margin: 0 10px; overflow: hidden;">
                    <div style="width: 0%; height: 100%; background: linear-gradient(90deg, #1890ff 0%, #40a9ff 100%); border-radius: 3px; box-shadow: 0 0 8px rgba(24, 144, 255, 0.6);"></div>
                  </div>
                  <button style="background: transparent; color: white; border: none; cursor: pointer; font-size: 16px; padding: 4px;">🔊</button>
                  <button style="background: transparent; color: white; border: none; cursor: pointer; font-size: 16px; padding: 4px;">⛶</button>
                </div>
              </div>
            </div>
            <div style="display: flex; gap: 20px;">
              <div style="flex: 1; background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #1890ff;">
                <h4 style="color: #333; margin: 0 0 10px 0; font-size: 14px;">📹 视频信息</h4>
                <p style="color: #666; line-height: 1.6; margin: 0; font-size: 13px;">分辨率: 1920×1080<br>时长: 8分钟<br>来源: ${record.source}</p>
              </div>
              <div style="flex: 2; background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #52c41a;">
                <h4 style="color: #333; margin: 0 0 10px 0; font-size: 14px;">📝 内容概述</h4>
                <p style="color: #666; line-height: 1.6; margin: 0; font-size: 13px;">这是基于您上传资料生成的视频概览内容，包含了可视化的数据展示、详细解说和互动演示。视频采用高清画质，支持全屏播放和字幕显示。</p>
              </div>
            </div>
          </div>
        `);
        break;
      case 'mindmap':
        setModalContent(`
          <div style="padding: 20px; text-align: center;">
            <h2 style="color: #1890ff; margin-bottom: 20px;">${record.title}</h2>
            <div style="background: #f0f8ff; padding: 20px; border-radius: 12px;">
              <div style="font-size: 48px; margin-bottom: 15px;">🧠</div>
              <p style="color: #666; margin-bottom: 20px;">思维导图内容</p>
              <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); min-height: 400px;">
                <svg width="100%" height="400" style="border: 1px solid #e8e8e8; border-radius: 4px;">
                  <!-- 中心节点 -->
                  <circle cx="300" cy="200" r="40" fill="#1890ff" />
                  <text x="300" y="205" text-anchor="middle" fill="white" font-size="12">核心主题</text>
                  
                  <!-- 分支节点 -->
                  <circle cx="150" cy="100" r="25" fill="#52c41a" />
                  <text x="150" y="105" text-anchor="middle" fill="white" font-size="10">要点1</text>
                  <line x1="275" y1="175" x2="175" y2="125" stroke="#1890ff" stroke-width="2" />
                  
                  <circle cx="450" cy="100" r="25" fill="#52c41a" />
                  <text x="450" y="105" text-anchor="middle" fill="white" font-size="10">要点2</text>
                  <line x1="325" y1="175" x2="425" y2="125" stroke="#1890ff" stroke-width="2" />
                  
                  <circle cx="150" cy="300" r="25" fill="#52c41a" />
                  <text x="150" y="305" text-anchor="middle" fill="white" font-size="10">要点3</text>
                  <line x1="275" y1="225" x2="175" y2="275" stroke="#1890ff" stroke-width="2" />
                  
                  <circle cx="450" cy="300" r="25" fill="#52c41a" />
                  <text x="450" y="305" text-anchor="middle" fill="white" font-size="10">要点4</text>
                  <line x1="325" y1="225" x2="425" y2="275" stroke="#1890ff" stroke-width="2" />
                  
                  <!-- 子节点 -->
                  <circle cx="80" cy="50" r="15" fill="#faad14" />
                  <text x="80" y="55" text-anchor="middle" fill="white" font-size="8">细节</text>
                  <line x1="135" y1="85" x2="95" y2="65" stroke="#52c41a" stroke-width="1" />
                  
                  <circle cx="520" cy="50" r="15" fill="#faad14" />
                  <text x="520" y="55" text-anchor="middle" fill="white" font-size="8">细节</text>
                  <line x1="465" y1="85" x2="505" y2="65" stroke="#52c41a" stroke-width="1" />
                </svg>
                <div style="margin-top: 15px; text-align: left; color: #333;">
                  <p><strong>🎯 思维导图说明：</strong>基于${record.source}构建的知识结构图</p>
                  <p><strong>📊 节点数量：</strong>主要节点 4 个，子节点 8 个</p>
                  <p><strong>🔗 关联关系：</strong>展示了核心概念间的逻辑关系</p>
                </div>
              </div>
            </div>
          </div>
        `);
        break;
      default:
        setModalContent(`
          <div style="padding: 20px; text-align: center;">
            <h2 style="color: #1890ff; margin-bottom: 20px;">${record.title}</h2>
            <p>暂无预览内容</p>
          </div>
        `);
    }
    
    setShowContentModal(true);
  };

  // 文件上传处理
  const handleFileUpload = (info) => {
    const { status, originFileObj, response } = info.file;
    
    if (status === 'done') {
      const newFile = {
        id: Date.now(),
        name: originFileObj.name,
        size: originFileObj.size,
        type: originFileObj.type,
        uploadTime: new Date().toISOString(),
        content: '文件内容预览...'
      };
      setUploadedFiles(prev => [...prev, newFile]);
      message.success(`${originFileObj.name} 上传成功`);
    } else if (status === 'error') {
      message.error(`${originFileObj.name} 上传失败`);
    }
  };

  // 添加链接
  const handleAddLink = () => {
    if (!newLink.trim()) {
      message.warning('请输入有效的链接地址');
      return;
    }
    
    const linkObj = {
      id: Date.now(),
      url: newLink,
      title: '链接标题',
      addTime: new Date().toISOString()
    };
    
    setLinks(prev => [...prev, linkObj]);
    setNewLink('');
    message.success('链接添加成功');
  };

  // 添加网站地址处理函数
  const handleAddWebsite = () => {
    if (!websiteUrl.trim()) {
      message.warning('请输入有效的网站地址');
      return;
    }

    // 验证视频网站地址
    if (websiteType === 'video') {
      const isBilibili = websiteUrl.includes('bilibili.com') || websiteUrl.includes('b23.tv');
      const isXiaohongshu = websiteUrl.includes('xiaohongshu.com') || websiteUrl.includes('xhslink.com');
      
      if (!isBilibili && !isXiaohongshu) {
        message.warning('视频地址仅支持B站和小红书链接');
        return;
      }
    }
    
    const websiteObj = {
      id: Date.now(),
      url: websiteUrl,
      type: websiteType,
      title: websiteType === 'video' ? '视频链接' : '网站链接',
      platform: websiteType === 'video' ? 
        (websiteUrl.includes('bilibili.com') || websiteUrl.includes('b23.tv') ? 'B站' : '小红书') : 
        '普通网站',
      addTime: new Date().toISOString()
    };
    
    setLinks(prev => [...prev, websiteObj]);
    setWebsiteUrl('');
     message.success(`${websiteType === 'video' ? '视频' : '网站'}地址添加成功`);
   };

   // 添加文字内容处理函数
   const handleAddText = () => {
     if (!textContent.trim()) {
       message.warning('请输入文字内容');
       return;
     }

     const textObj = {
       id: Date.now(),
       content: textContent.trim(),
       type: 'text',
       title: textContent.trim().length > 20 ? textContent.trim().substring(0, 20) + '...' : textContent.trim(),
       addTime: new Date().toISOString()
     };

     setAddedTexts(prev => [...prev, textObj]);
     setTextContent('');
     message.success('文字内容添加成功');
   };

   // 删除文字内容
   const handleDeleteText = (textId) => {
     setAddedTexts(prev => prev.filter(text => text.id !== textId));
     message.success('文字内容删除成功');
   };

   // 添加课程视频
   const handleAddVideo = () => {
     if (!videoTitle.trim()) {
       message.error('请输入视频标题');
       return;
     }
     if (!videoUrl.trim()) {
       message.error('请输入视频链接');
       return;
     }

     // 简单的URL验证
     const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/.*)?$/;
     if (!urlPattern.test(videoUrl)) {
       message.error('请输入有效的视频链接');
       return;
     }

     const videoObj = {
       id: Date.now(),
       title: videoTitle.trim(),
       url: videoUrl.trim(),
       addedAt: new Date().toLocaleString()
     };

     setCourseVideos(prev => [...prev, videoObj]);
     setVideoTitle('');
     setVideoUrl('');
     message.success('课程视频添加成功');
   };

   // 删除课程视频
   const handleDeleteVideo = (videoId) => {
     setCourseVideos(prev => prev.filter(video => video.id !== videoId));
     message.success('课程视频删除成功');
   };

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
    
    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `基于您上传的资料，我理解您的问题是："${inputMessage}"。根据现有资料分析，我建议...`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  // 执行快捷操作
  const handleQuickAction = (actionKey) => {
    const action = quickActions.find(a => a.key === actionKey);
    const result = {
      id: Date.now(),
      action: action.label,
      content: `${action.label}的结果内容...`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    setOperationResults(prev => [result, ...prev]);
    message.success(`${action.label}操作完成`);
  };

  // 删除文件
  const handleDeleteFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    message.success('文件删除成功');
  };

  // 删除链接
  const handleDeleteLink = (linkId) => {
    setLinks(links.filter(link => link.id !== linkId));
    message.success('链接删除成功');
  };

  // 多选功能处理函数
  const handleSelectMaterial = (materialId, checked) => {
    if (checked) {
      setSelectedMaterials([...selectedMaterials, materialId]);
    } else {
      setSelectedMaterials(selectedMaterials.filter(id => id !== materialId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allMaterialIds = [
        ...uploadedFiles.map(file => `file-${file.id}`),
        ...addedTexts.map(text => `text-${text.id}`),
        ...courseVideos.map(video => `video-${video.id}`),
        ...links.map(link => `link-${link.id}`)
      ];
      setSelectedMaterials(allMaterialIds);
    } else {
      setSelectedMaterials([]);
    }
  };

  const handleBatchDelete = () => {
    selectedMaterials.forEach(materialId => {
      const [type, id] = materialId.split('-');
      const numId = parseInt(id);
      
      switch (type) {
        case 'file':
          setUploadedFiles(prev => prev.filter(file => file.id !== numId));
          break;
        case 'text':
          setAddedTexts(prev => prev.filter(text => text.id !== numId));
          break;
        case 'video':
          setCourseVideos(prev => prev.filter(video => video.id !== numId));
          break;
        case 'link':
          setLinks(prev => prev.filter(link => link.id !== numId));
          break;
      }
    });
    setSelectedMaterials([]);
    message.success(`已删除 ${selectedMaterials.length} 个资料`);
  };

  const handleViewMaterial = (material, type) => {
    // 生成单个资料的智能笔记
    const smartNote = generateSmartNote(material, type);
    setSmartNotes([smartNote]);
    setShowSmartNotesModal(true);
  };

  // 预览资料功能
  const handlePreviewMaterial = (material, type) => {
    setPreviewData(material);
    setPreviewType(type);
    setShowPreviewModal(true);
  };

  // 智能笔记生成功能
  const generateSmartNote = (material, type) => {
    let smartNote = {
      id: Date.now(),
      type: type,
      title: material.title || material.name,
      originalData: material,
      summary: '',
      keyPoints: [],
      tags: [],
      createdAt: new Date().toLocaleString()
    };

    // 根据不同类型生成智能摘要
    switch (type) {
      case 'file':
        smartNote.summary = `文件资料：${material.name}，类型：${material.type || '未知'}。建议进一步分析文件内容以提取关键信息。`;
        smartNote.keyPoints = ['文件已上传', '待内容分析', '可用于AI问答'];
        smartNote.tags = ['文件', material.type || '未知类型'];
        break;
      
      case 'video':
        smartNote.summary = `视频资料：${material.title}。视频内容可能包含重要的学习材料，建议观看并记录要点。`;
        smartNote.keyPoints = ['视频已添加', '包含音视频内容', '适合深度学习'];
        smartNote.tags = ['视频', '学习资料'];
        if (material.url.includes('bilibili.com')) {
          smartNote.tags.push('B站');
        } else if (material.url.includes('youtube.com')) {
          smartNote.tags.push('YouTube');
        }
        break;
      
      case 'link':
        smartNote.summary = `网站链接：${material.title}。网页内容可能包含有价值的信息，建议浏览并提取关键内容。`;
        smartNote.keyPoints = ['网站已添加', '可在线访问', '内容待分析'];
        smartNote.tags = ['网站', '在线资源'];
        break;
      
      case 'text':
        const wordCount = material.content.length;
        const hasMarkdown = /[*_`#\[\]]/g.test(material.content);
        smartNote.summary = `文字内容：${material.title}，共${wordCount}字。${hasMarkdown ? '包含格式化内容，' : ''}可直接用于AI分析和问答。`;
        smartNote.keyPoints = [
          `文字长度：${wordCount}字`,
          hasMarkdown ? '包含Markdown格式' : '纯文本内容',
          '可直接分析'
        ];
        smartNote.tags = ['文字', hasMarkdown ? 'Markdown' : '纯文本'];
        break;
    }

    return smartNote;
  };

  // 批量生成智能笔记
  const handleGenerateSmartNotes = () => {
    const notes = [];
    
    // 为所有资料生成智能笔记
    uploadedFiles.forEach(file => {
      notes.push(generateSmartNote(file, 'file'));
    });
    
    addedTexts.forEach(text => {
      notes.push(generateSmartNote(text, 'text'));
    });
    
    courseVideos.forEach(video => {
      notes.push(generateSmartNote(video, 'video'));
    });
    
    links.forEach(link => {
      notes.push(generateSmartNote(link, 'link'));
    });

    if (notes.length > 0) {
      setSmartNotes(notes);
      setShowSmartNotesModal(true);
      message.success(`已生成 ${notes.length} 条智能笔记`);
    } else {
      message.info('暂无资料可生成智能笔记');
    }
  };

  // 渲染文件预览内容
  const renderFilePreview = (file) => {
    const fileType = file.type || file.name.split('.').pop().toLowerCase();
    
    if (fileType.includes('pdf') || fileType === 'pdf') {
      return (
        <div style={{ height: '500px', width: '100%' }}>
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(file.url || '#')}&embedded=true`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title={file.name}
          />
          <div style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
            PDF预览 - {file.name}
          </div>
        </div>
      );
    }
    
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <FileTextOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
        <div>
          <h3>{file.name}</h3>
          <p>文件类型: {fileType}</p>
          <p>暂不支持此文件类型的在线预览</p>
        </div>
      </div>
    );
  };

  // 渲染视频预览内容
  const renderVideoPreview = (video) => {
    const getVideoEmbedUrl = (url) => {
      if (url.includes('bilibili.com')) {
        const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
        if (bvMatch) {
          return `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}&autoplay=0`;
        }
      }
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId[1]}`;
        }
      }
      return url;
    };

    const embedUrl = getVideoEmbedUrl(video.url);
    
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3>{video.title}</h3>
          <p style={{ color: '#666' }}>视频链接: <a href={video.url} target="_blank" rel="noopener noreferrer">{video.url}</a></p>
        </div>
        <div style={{ height: '400px', width: '100%' }}>
          <iframe
            src={embedUrl}
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
            title={video.title}
            allowFullScreen
          />
        </div>
      </div>
    );
  };

  // 渲染链接预览内容
  const renderLinkPreview = (link) => {
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3>{link.title}</h3>
          <p style={{ color: '#666' }}>网站地址: <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a></p>
        </div>
        <div style={{ height: '500px', width: '100%' }}>
          <iframe
            src={link.url}
            style={{ width: '100%', height: '100%', border: '1px solid #d9d9d9', borderRadius: '8px' }}
            title={link.title}
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
          网站预览 - 如无法显示，请点击上方链接直接访问
        </div>
      </div>
    );
  };

  // 渲染文字预览内容
  const renderTextPreview = (text) => {
    // 简单的 Markdown 渲染
    const renderMarkdown = (content) => {
      let html = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
        .replace(/`(.*?)`/g, '<code style="background: #f5f5f5; padding: 2px 4px; border-radius: 3px;">$1</code>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #1890ff;">$1</a>')
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 4px;" />')
        .replace(/\n/g, '<br />');
      
      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    };

    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3>{text.title}</h3>
          <p style={{ color: '#666' }}>添加时间: {text.addTime}</p>
        </div>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fafafa', 
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          maxHeight: '400px',
          overflow: 'auto',
          lineHeight: '1.6'
        }}>
          {renderMarkdown(text.content)}
        </div>
      </div>
    );
  };

  // 计算选中状态
  const allMaterials = [
    ...uploadedFiles.map(file => `file-${file.id}`),
    ...addedTexts.map(text => `text-${text.id}`),
    ...courseVideos.map(video => `video-${video.id}`),
    ...links.map(link => `link-${link.id}`)
  ];
  const isAllSelected = allMaterials.length > 0 && selectedMaterials.length === allMaterials.length;
  const isIndeterminate = selectedMaterials.length > 0 && selectedMaterials.length < allMaterials.length;



  // 返回
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.close();
    }
  };

  return (
    <>
      <div style={{ display: 'flex', height: '100vh', background: '#f5f5f5' }}>
      {/* 左侧资料收集区域 */}
      <div style={{ width: 320, background: '#fff', margin: '16px 0 16px 16px', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>
                  📚 资料收集
                </Title>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {selectedMaterials.length > 0 && (
                  <Popconfirm
                    title="确认删除"
                    description={`确定要删除选中的 ${selectedMaterials.length} 个资料吗？`}
                    onConfirm={handleBatchDelete}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button 
                      type="text" 
                      icon={<DeleteOutlined />}
                      danger
                      size="small"
                    >
                      删除选中
                    </Button>
                  </Popconfirm>
                )}
                {onBack && (
                  <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />} 
                    onClick={handleBack}
                    style={{ color: '#666' }}
                  >
                    返回
                  </Button>
                )}
              </div>
            </div>
            
            {/* 操作按钮区域 */}
            <div style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                style={{ flex: 1 }}
                onClick={() => {
                  setShowMaterialAddModal(true);
                }}
              >
                添加
              </Button>
              <Button 
                type="default" 
                style={{ flex: 1 }}
                onClick={() => setShowExploreModal(true)}
              >
                探索
              </Button>
            </div>
            
            <Divider style={{ margin: '16px 0' }} />
            
            {/* 选择所有来源 */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '8px 12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              marginBottom: 12,
              border: '1px solid #e9ecef'
            }}>
              <span style={{ color: '#495057', fontSize: '14px' }}>选择所有来源</span>
              <Checkbox 
                style={{ marginLeft: 'auto' }}
                checked={selectedMaterials.length > 0 && selectedMaterials.length === (
                  uploadedFiles.length + addedTexts.length + courseVideos.length + links.length
                )}
                indeterminate={selectedMaterials.length > 0 && selectedMaterials.length < (
                  uploadedFiles.length + addedTexts.length + courseVideos.length + links.length
                )}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </div>
            
            {/* 统一的资料列表 */}
            <div style={{ height: 'calc(100vh - 280px)', overflowY: 'auto' }}>
              {/* 已上传文件 */}
              {uploadedFiles.map(file => {
                const [isHovered, setIsHovered] = React.useState(false);
                return (
                  <Card 
                    key={`file-${file.id}`} 
                    size="small" 
                    style={{ 
                      marginBottom: 8,
                      border: selectedMaterials.includes(`file-${file.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                      backgroundColor: selectedMaterials.includes(`file-${file.id}`) ? '#f6ffed' : 'white'
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}
                        onClick={() => handleViewMaterial(file, 'file')}
                      >
                        {isHovered ? (
                          <Dropdown
                            menu={{
                              items: [
                                {
                                  key: 'rename',
                                  label: '重命名',
                                  icon: <EditOutlined />,
                                  onClick: () => {
                                    const newName = prompt('请输入新的文件名:', file.name);
                                    if (newName && newName.trim()) {
                                      setUploadedFiles(prev => 
                                        prev.map(f => 
                                          f.id === file.id ? { ...f, name: newName.trim() } : f
                                        )
                                      );
                                      message.success('文件重命名成功');
                                    }
                                  }
                                },
                                {
                                  key: 'delete',
                                  label: '删除',
                                  icon: <DeleteOutlined />,
                                  onClick: () => {
                                    Modal.confirm({
                                      title: '确认删除',
                                      content: `确定要删除文件"${file.name}"吗？`,
                                      okText: '确定',
                                      cancelText: '取消',
                                      onOk: () => handleDeleteFile(file.id)
                                    });
                                  },
                                  danger: true
                                }
                              ]
                            }}
                            trigger={['click']}
                          >
                            <Button 
                              type="text" 
                              size="small" 
                              icon={<MoreOutlined />}
                              onClick={(e) => e.stopPropagation()}
                              style={{ marginRight: 8 }}
                            />
                          </Dropdown>
                        ) : (
                          <FileTextOutlined style={{ fontSize: 16, color: '#1890ff', marginRight: 8 }} />
                        )}
                        <div style={{ flex: 1 }}>
                          <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{file.name}</Text>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedMaterials.includes(`file-${file.id}`)}
                        onChange={(e) => handleSelectMaterial(`file-${file.id}`, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </Card>
                );
              })}
              
              {/* 添加的文字 */}
              {addedTexts.map(text => {
                const [isHovered, setIsHovered] = React.useState(false);
                return (
                  <Card 
                    key={`text-${text.id}`} 
                    size="small" 
                    style={{ 
                      marginBottom: 8,
                      border: selectedMaterials.includes(`text-${text.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                      backgroundColor: selectedMaterials.includes(`text-${text.id}`) ? '#f6ffed' : 'white'
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}
                        onClick={() => handleViewMaterial(text, 'text')}
                      >
                        {isHovered ? (
                           <Dropdown
                             menu={{
                               items: [
                                 {
                                   key: 'rename',
                                   label: '重命名',
                                   icon: <EditOutlined />,
                                   onClick: () => {
                                      const newTitle = prompt('请输入新的标题:', text.title);
                                      if (newTitle && newTitle.trim()) {
                                        setAddedTexts(prev => 
                                          prev.map(t => 
                                            t.id === text.id ? { ...t, title: newTitle.trim() } : t
                                          )
                                        );
                                        message.success('文字重命名成功');
                                      }
                                    }
                                 },
                                 {
                                    key: 'delete',
                                    label: '删除',
                                    icon: <DeleteOutlined />,
                                    onClick: () => {
                                      Modal.confirm({
                                        title: '确认删除',
                                        content: `确定要删除文字"${text.title}"吗？`,
                                        okText: '确定',
                                        cancelText: '取消',
                                        onOk: () => handleDeleteText(text.id)
                                      });
                                    },
                                    danger: true
                                  }
                               ]
                             }}
                             trigger={['click']}
                           >
                            <Button 
                              type="text" 
                              size="small" 
                              icon={<MoreOutlined />}
                              onClick={(e) => e.stopPropagation()}
                              style={{ marginRight: 8 }}
                            />
                          </Dropdown>
                        ) : (
                          <FileTextOutlined style={{ fontSize: 16, color: '#52c41a', marginRight: 8 }} />
                        )}
                        <div style={{ flex: 1 }}>
                          <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{text.title}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 10 }} ellipsis>
                            {text.content.length > 50 ? text.content.substring(0, 50) + '...' : text.content}
                          </Text>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedMaterials.includes(`text-${text.id}`)}
                        onChange={(e) => handleSelectMaterial(`text-${text.id}`, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </Card>
                );
              })}
              
              {/* 课程视频 */}
              {courseVideos.map(video => {
                const [isHovered, setIsHovered] = React.useState(false);
                return (
                  <Card 
                    key={`video-${video.id}`} 
                    size="small" 
                    style={{ 
                      marginBottom: 8,
                      border: selectedMaterials.includes(`video-${video.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                      backgroundColor: selectedMaterials.includes(`video-${video.id}`) ? '#f6ffed' : 'white'
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}
                        onClick={() => handleViewMaterial(video, 'video')}
                      >
                        {isHovered ? (
                           <Dropdown
                             menu={{
                               items: [
                                 {
                                   key: 'rename',
                                   label: '重命名',
                                   icon: <EditOutlined />,
                                   onClick: () => {
                                      const newTitle = prompt('请输入新的视频标题:', video.title);
                                      if (newTitle && newTitle.trim()) {
                                        setCourseVideos(prev => 
                                          prev.map(v => 
                                            v.id === video.id ? { ...v, title: newTitle.trim() } : v
                                          )
                                        );
                                        message.success('视频重命名成功');
                                      }
                                    }
                                 },
                                 {
                                    key: 'delete',
                                    label: '删除',
                                    icon: <DeleteOutlined />,
                                    onClick: () => {
                                      Modal.confirm({
                                        title: '确认删除',
                                        content: `确定要删除视频"${video.title}"吗？`,
                                        okText: '确定',
                                        cancelText: '取消',
                                        onOk: () => handleDeleteVideo(video.id)
                                      });
                                    },
                                    danger: true
                                  }
                               ]
                             }}
                             trigger={['click']}
                           >
                            <Button 
                              type="text" 
                              size="small" 
                              icon={<MoreOutlined />}
                              onClick={(e) => e.stopPropagation()}
                              style={{ marginRight: 8 }}
                            />
                          </Dropdown>
                        ) : (
                          <div style={{ fontSize: 16, marginRight: 8 }}>🎥</div>
                        )}
                        <div style={{ flex: 1 }}>
                          <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{video.title}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 10 }} ellipsis>
                            {video.url}
                          </Text>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedMaterials.includes(`video-${video.id}`)}
                        onChange={(e) => handleSelectMaterial(`video-${video.id}`, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </Card>
                );
              })}
              
              {/* 保存的链接 */}
              {links.map(link => {
                const [isHovered, setIsHovered] = React.useState(false);
                return (
                  <Card 
                    key={`link-${link.id}`} 
                    size="small" 
                    style={{ 
                      marginBottom: 8,
                      border: selectedMaterials.includes(`link-${link.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                      backgroundColor: selectedMaterials.includes(`link-${link.id}`) ? '#f6ffed' : 'white'
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}
                        onClick={() => handleViewMaterial(link, 'link')}
                      >
                        {isHovered ? (
                           <Dropdown
                             menu={{
                               items: [
                                 {
                                   key: 'rename',
                                   label: '重命名',
                                   icon: <EditOutlined />,
                                   onClick: () => {
                                      const newTitle = prompt('请输入新的链接标题:', link.title);
                                      if (newTitle && newTitle.trim()) {
                                        setLinks(prev => 
                                          prev.map(l => 
                                            l.id === link.id ? { ...l, title: newTitle.trim() } : l
                                          )
                                        );
                                        message.success('链接重命名成功');
                                      }
                                    }
                                 },
                                 {
                                    key: 'delete',
                                    label: '删除',
                                    icon: <DeleteOutlined />,
                                    onClick: () => {
                                      Modal.confirm({
                                        title: '确认删除',
                                        content: `确定要删除链接"${link.title}"吗？`,
                                        okText: '确定',
                                        cancelText: '取消',
                                        onOk: () => handleDeleteLink(link.id)
                                      });
                                    },
                                    danger: true
                                  }
                               ]
                             }}
                             trigger={['click']}
                           >
                            <Button 
                              type="text" 
                              size="small" 
                              icon={<MoreOutlined />}
                              onClick={(e) => e.stopPropagation()}
                              style={{ marginRight: 8 }}
                            />
                          </Dropdown>
                        ) : (
                          <LinkOutlined style={{ fontSize: 16, color: '#fa8c16', marginRight: 8 }} />
                        )}
                        <div style={{ flex: 1 }}>
                          <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{link.title}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 10 }} ellipsis>
                            {link.url}
                          </Text>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedMaterials.includes(`link-${link.id}`)}
                        onChange={(e) => handleSelectMaterial(`link-${link.id}`, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
      </div>

      {/* 中间问答区域 */}
      <div style={{ flex: 1, margin: '16px', background: '#fff', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
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
                 收集的资料涵盖了成都美食文化的各个方面，包括川菜历史文献、餐厅数据分析、火锅店分布、调料配方、制作技法视频以及营养成分分析等。这些材料从历史传承、地理分布、制作工艺、营养价值等多维度展现了成都美食的丰富内涵，为深入了解川菜文化和成都饮食特色提供了全面的参考依据。
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
                icon={<span>🎵</span>}
                onClick={() => handleOperationClick('audio')}
                style={{ borderRadius: '16px' }}
              >
                音频概览
              </Button>
              <Button 
                size="small" 
                icon={<span>🧠</span>}
                onClick={() => handleOperationClick('mindmap')}
                style={{ borderRadius: '16px' }}
              >
                思维导图
              </Button>
            </div>
          </div>
          
          {/* 消息列表 */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', maxHeight: 'calc(100vh - 500px)' }}>
            {messages.map(msg => (
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
                          onClick={() => handleSaveToNote(msg.content)}
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
            ))}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <div style={{ padding: '12px 16px', backgroundColor: '#f6f6f6', borderRadius: '12px' }}>
                  <Text>正在思考中...</Text>
                </div>
              </div>
            )}
          </div>
          
          {/* 常见问题按钮 */}
          <div style={{ padding: '16px 20px 0 20px', borderTop: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflow: 'hidden' }}>
              <Button 
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
                onClick={() => setInputMessage('川菜特色？')}
                title="川菜特色？"
              >
                川菜特色？
              </Button>
              <Button 
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
                onClick={() => setInputMessage('火锅做法？')}
                title="火锅做法？"
              >
                火锅做法？
              </Button>
              <Button 
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
                onClick={() => setInputMessage('小吃推荐？')}
                title="小吃推荐？"
              >
                小吃推荐？
              </Button>
            </div>
          </div>
          
          {/* 输入区域 */}
          <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0' }}>
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
              <TextArea
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

        {/* 右侧操作区域 */}
        <div style={{ width: 320, background: '#fff', margin: '16px 16px 16px 0', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* 上半部分 - 功能概览 */}
          <div style={{ padding: '20px', flex: 1 }}>
            <Title level={5} style={{ marginBottom: 16, color: '#1f1f1f' }}>
              🛠️ 操作面板
            </Title>
            
            {/* 功能卡片网格 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: 16 }}>
              {/* 音频概览 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('audio')}
                style={{ 
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>🎵</div>
                  <Text style={{ 
                    fontSize: '11px', 
                    fontWeight: 500, 
                    color: '#1565c0' 
                  }}>音频概览</Text>
                </div>
              </Card>
              
              {/* 视频概览 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('video')}
                style={{ 
                  background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>📹</div>
                  <Text style={{ 
                    fontSize: '11px', 
                    fontWeight: 500, 
                    color: '#2e7d32' 
                  }}>视频概览</Text>
                </div>
              </Card>
              
              {/* 思维导图 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('mindmap')}
                style={{ 
                  background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>🧠</div>
                  <Text style={{ 
                    fontSize: '11px', 
                    fontWeight: 500, 
                    color: '#c2185b' 
                  }}>思维导图</Text>
                </div>
              </Card>
              
              {/* 报告 */}
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'brief',
                      label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>📄</span>
                          <span>简报文档</span>
                        </div>
                      ),
                      onClick: () => message.info('简报文档功能开发中')
                    },
                    {
                      key: 'guide',
                      label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>📖</span>
                          <span>学习指南</span>
                        </div>
                      ),
                      onClick: () => message.info('学习指南功能开发中')
                    },
                    {
                      key: 'faq',
                      label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>❓</span>
                          <span>常见问题解答</span>
                        </div>
                      ),
                      onClick: () => message.info('常见问题解答功能开发中')
                    },
                    {
                      key: 'timeline',
                      label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>⏰</span>
                          <span>时间轴</span>
                        </div>
                      ),
                      onClick: () => message.info('时间轴功能开发中')
                    }
                  ]
                }}
                trigger={['hover']}
                placement="bottomLeft"
                overlayClassName="report-dropdown"
              >
                <Card 
                  size="small" 
                  hoverable
                  onClick={() => handleOperationClick('report')}
                  style={{ 
                    background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ padding: '6px 0' }}>
                    <div style={{ fontSize: '20px', marginBottom: '6px' }}>📊</div>
                    <Text style={{ 
                      fontSize: '11px', 
                      fontWeight: 500, 
                      color: '#ef6c00' 
                    }}>报告</Text>
                  </div>
                </Card>
              </Dropdown>
              
              {/* PPT概览 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('ppt')}
                style={{ 
                  background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                   <div style={{ fontSize: '20px', marginBottom: '6px' }}>📽️</div>
                   <Text style={{ 
                     fontSize: '11px', 
                     fontWeight: 500, 
                     color: '#d32f2f' 
                   }}>PPT概览</Text>
                 </div>
              </Card>
              
              {/* 网页代码 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('webcode')}
                style={{ 
                  background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                   <div style={{ fontSize: '20px', marginBottom: '6px' }}>💻</div>
                   <Text style={{ 
                     fontSize: '11px', 
                     fontWeight: 500, 
                     color: '#7b1fa2' 
                   }}>网页代码</Text>
                 </div>
              </Card>
              

            </div>
          </div>
          
          {/* 下半部分 - 操作记录 */}
          <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Title level={5} style={{ marginBottom: 16, color: '#1f1f1f', fontSize: '14px' }}>
              📋 操作记录
            </Title>
            
            <div style={{ flex: 1, overflowY: 'auto', maxHeight: '300px' }}>
              {Object.values(operationRecords).flat().map(record => {
                const getIcon = (type) => {
                    switch(type) {
                      case 'audio': return '🎵';
                      case 'video': return '📹';
                      case 'mindmap': return '🧠';
                      case 'report': return '📊';
                      case 'ppt': return '📽️';
                      case 'webcode': return '💻';
                      case 'file': return '📄';
                      case 'text': return '📝';
                      case 'link': return '🔗';
                      default: return '📄';
                    }
                  };
                
                return (
                  <Card 
                    key={record.id}
                    size="small" 
                    hoverable
                    style={{ 
                      marginBottom: '8px',
                      borderRadius: '8px',
                      border: '1px solid #f0f0f0',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleRecordClick(record)}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ fontSize: '16px', marginTop: '2px' }}>
                        {getIcon(record.type)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text 
                          style={{ 
                            fontSize: '12px', 
                            fontWeight: 500, 
                            color: '#1f1f1f',
                            display: 'block',
                            marginBottom: '4px',
                            lineHeight: '1.4'
                          }}
                          ellipsis={{ tooltip: record.title }}
                        >
                          {record.title}
                        </Text>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={{ fontSize: '10px', color: '#999' }}>
                            {record.source}
                          </Text>
                          <Text style={{ fontSize: '10px', color: '#999' }}>
                            {record.time}
                          </Text>
                        </div>
                      </div>
                      {(record.type === 'audio' || record.type === 'video') && (
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<div style={{ fontSize: '12px' }}>▶</div>}
                          style={{ padding: '2px 4px', height: 'auto', minWidth: 'auto' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRecordClick(record);
                          }}
                        />
                      )}
                      <Dropdown
                        menu={{ items: getMoreMenuItems(record) }}
                        trigger={['click']}
                        placement="bottomRight"
                      >
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<div style={{ fontSize: '12px' }}>⋯</div>}
                          style={{ padding: '2px 4px', height: 'auto', minWidth: 'auto' }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Dropdown>
                    </div>
                  </Card>
                );
              })}
              
              {Object.values(operationRecords).flat().length === 0 && (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>
                  暂无操作记录
                </div>
              )}
            </div>
            
            {/* 新建笔记按钮 */}
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleCreateNewNote}
                style={{
                  borderRadius: '6px',
                  fontSize: '12px',
                  height: '32px',
                  paddingLeft: '12px',
                  paddingRight: '12px'
                }}
              >
                新建笔记
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 上传弹窗 */}
      <Modal
      title="添加来源"
      open={showUploadModal}
      onCancel={() => setShowUploadModal(false)}
      footer={null}
      width={600}
    >
      <div style={{ padding: '20px 0' }}>
        {/* 文档上传区域 */}
        <div style={{ marginBottom: 32 }}>
          <Title level={5} style={{ marginBottom: 16 }}>文档上传</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            请选择要上传的文档，NotebookLM 智能笔记支持以下格式的资料来源：
          </Text>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 12 }}>
            (示例：教育方案、课程设计材料、研究报告、会议文档内容、辅导文档等)
          </Text>
          <Upload.Dragger
            multiple
            onChange={handleFileUpload}
            showUploadList={false}
            accept=".pdf,.doc,.docx,.txt,.md"
            style={{ marginBottom: 16 }}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">上传文档</p>
            <p className="ant-upload-hint">
              拖放文档文件到此处，或点击上传
            </p>
          </Upload.Dragger>
          <Text type="secondary" style={{ fontSize: 12 }}>
            支持的文档类型：PDF, txt, Markdown 等格式（例如 .md）
          </Text>
        </div>

        <Divider />

        {/* 网站地址添加区域 */}
        <div>
          <Title level={5} style={{ marginBottom: 16 }}>添加网站地址</Title>
          
          {/* 网站类型选择 */}
          <div style={{ marginBottom: 16 }}>
            <Text style={{ marginRight: 8 }}>网站类型：</Text>
            <Select
              value={websiteType}
              onChange={setWebsiteType}
              style={{ width: 120, marginRight: 16 }}
            >
              <Option value="normal">普通网站</Option>
              <Option value="video">视频网站</Option>
            </Select>
            {websiteType === 'video' && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                支持B站、小红书视频
              </Text>
            )}
          </div>
          
          {/* 网站地址输入 */}
          <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
            <Input
              placeholder={websiteType === 'video' ? '输入B站或小红书视频链接' : '输入网站地址'}
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              onPressEnter={handleAddWebsite}
              prefix={<LinkOutlined />}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddWebsite}>
              添加
            </Button>
          </Space.Compact>
          
          {/* 示例说明 */}
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
            {websiteType === 'video' ? 
              '示例：https://www.bilibili.com/video/BV1xx411c7mu 或 https://www.xiaohongshu.com/explore/xxx' :
              '示例：https://www.example.com'
            }
          </Text>
         </div>

         <Divider />

         {/* 文字内容添加区域 */}
         <div>
           <Title level={5} style={{ marginBottom: 16 }}>添加文字</Title>
           
           {/* 文字内容输入 */}
           <div style={{ marginBottom: 16 }}>
             <TextArea
               placeholder="输入文字内容..."
               value={textContent}
               onChange={(e) => setTextContent(e.target.value)}
               rows={4}
               maxLength={1000}
               showCount
               style={{ marginBottom: 12 }}
             />
             <Button 
               type="primary" 
               icon={<PlusOutlined />} 
               onClick={handleAddText}
               block
             >
               添加文字
             </Button>
           </div>
           
           {/* 说明文字 */}
           <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
             添加的文字内容将作为资料来源，可用于AI问答和分析
           </Text>
         </div>

         <Divider />

         {/* 课程视频添加区域 */}
         <div>
           <Title level={5} style={{ marginBottom: 16 }}>添加课程视频</Title>
           
           {/* 视频标题输入 */}
           <div style={{ marginBottom: 12 }}>
             <Input
               placeholder="输入视频标题..."
               value={videoTitle}
               onChange={(e) => setVideoTitle(e.target.value)}
               maxLength={100}
               showCount
             />
           </div>
           
           {/* 视频链接输入 */}
           <div style={{ marginBottom: 16 }}>
             <Input
               placeholder="输入视频链接..."
               value={videoUrl}
               onChange={(e) => setVideoUrl(e.target.value)}
               addonBefore="🎥"
             />
             <Button 
               type="primary" 
               icon={<PlusOutlined />} 
               onClick={handleAddVideo}
               block
               style={{ marginTop: 12 }}
             >
               添加视频
             </Button>
           </div>
           
           {/* 说明文字 */}
           <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
             支持各类视频平台链接，如B站、YouTube、腾讯视频等
           </Text>
           <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
             示例：https://www.bilibili.com/video/BV1xx411c7mu
           </Text>
         </div>

      </div>
       </Modal>
       


      {/* 资料预览弹窗 */}
      <Modal
        title={`预览 - ${previewData?.title || '资料'}`}
        open={showPreviewModal}
        onCancel={() => setShowPreviewModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowPreviewModal(false)}>
            关闭
          </Button>
        ]}
        width={800}
        style={{ top: 20 }}
      >
        {previewData && (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {previewType === 'file' && renderFilePreview(previewData)}
            {previewType === 'video' && renderVideoPreview(previewData)}
            {previewType === 'link' && renderLinkPreview(previewData)}
            {previewType === 'text' && renderTextPreview(previewData)}
          </div>
        )}
      </Modal>

      {/* 内容查看弹窗 */}
      <Modal
        title={currentRecord?.title || '内容查看'}
        open={showContentModal}
        onCancel={() => setShowContentModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowContentModal(false)}>
            关闭
          </Button>
        ]}
        width={800}
        style={{ top: 20 }}
      >
        <div 
          dangerouslySetInnerHTML={{ __html: modalContent }}
          style={{ maxHeight: '70vh', overflowY: 'auto' }}
        />
      </Modal>
      
      {/* 资料添加弹窗 */}
      <MaterialAddPage 
        visible={showMaterialAddModal}
        onClose={() => setShowMaterialAddModal(false)}
      />
      
      {/* 智能笔记弹窗 */}
      <Modal
        title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RobotOutlined style={{ color: '#1890ff' }} />
          {smartNotes.length === 1 ? '资料智能预览' : '智能笔记预览'}
        </div>}
        open={showSmartNotesModal}
        onCancel={() => {
          setShowSmartNotesModal(false);
          setSelectedNote(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setShowSmartNotesModal(false);
            setSelectedNote(null);
          }}>
            关闭
          </Button>
        ]}
        width={900}
        style={{ top: 20 }}
      >
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {smartNotes.length > 0 ? (
            <div>
              <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px', border: '1px solid #bae7ff' }}>
                 <Text type="secondary">
                   {smartNotes.length === 1 ? 
                     '🤖 AI智能分析该资料，为您提供摘要、关键要点和标签分类' : 
                     `📝 已为您生成 ${smartNotes.length} 条智能笔记，包含资料摘要、关键要点和标签分类`
                   }
                 </Text>
               </div>
              
              <List
                itemLayout="vertical"
                dataSource={smartNotes}
                renderItem={(note, index) => (
                  <List.Item
                    key={note.id}
                    style={{
                      padding: '16px',
                      marginBottom: '12px',
                      backgroundColor: selectedNote?.id === note.id ? '#f6ffed' : '#fafafa',
                      borderRadius: '8px',
                      border: selectedNote?.id === note.id ? '1px solid #b7eb8f' : '1px solid #f0f0f0',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedNote(selectedNote?.id === note.id ? null : note)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                          {note.type === 'file' && '📄'}
                          {note.type === 'video' && '🎥'}
                          {note.type === 'link' && '🔗'}
                          {note.type === 'text' && '📝'}
                          {' '}{note.title}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {note.createdAt}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {note.tags.map((tag, tagIndex) => (
                          <Tag key={tagIndex} size="small" color={note.type === 'file' ? 'blue' : note.type === 'video' ? 'red' : note.type === 'link' ? 'green' : 'orange'}>
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </div>
                    
                    <Paragraph style={{ margin: 0, marginBottom: 12, color: '#666' }}>
                      {note.summary}
                    </Paragraph>
                    
                    {selectedNote?.id === note.id && (
                      <div style={{ marginTop: 12, padding: '12px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e8f4fd' }}>
                        <Title level={5} style={{ margin: 0, marginBottom: 8, color: '#1890ff' }}>关键要点：</Title>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {note.keyPoints.map((point, pointIndex) => (
                            <li key={pointIndex} style={{ marginBottom: 4, color: '#666' }}>{point}</li>
                          ))}
                        </ul>
                        
                        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                          <Button 
                            size="small" 
                            icon={<EyeOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviewMaterial(note.originalData, note.type);
                            }}
                          >
                            预览原资料
                          </Button>
                          <Button 
                            size="small" 
                            type="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              message.success('笔记已保存到操作记录');
                              // 这里可以添加保存到操作记录的逻辑
                            }}
                          >
                            保存笔记
                          </Button>
                        </div>
                      </div>
                    )}
                  </List.Item>
                )}
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
              <RobotOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
              <div>暂无智能笔记</div>
              <div style={{ fontSize: '12px', marginTop: '8px' }}>请先添加资料，然后点击"智能笔记"按钮生成</div>
            </div>
          )}
        </div>
      </Modal>
      
      {/* 探索弹窗 */}
      <ExploreModal
        visible={showExploreModal}
        onClose={() => setShowExploreModal(false)}
        onExplore={handleExplore}
      />
    </>
  );
};

export default NoteEditPage;