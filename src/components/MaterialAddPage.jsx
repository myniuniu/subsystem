import React, { useState } from 'react';
import {
  Modal,
  Button,
  Typography,
  Upload,
  Progress,
  Card,
  Space,
  Input,
  message,
  Divider,
  Tag
} from 'antd';
import {
  UploadOutlined,
  GoogleOutlined,
  LinkOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  PlayCircleOutlined,
  BookOutlined,
  PlusOutlined,
  ApartmentOutlined,
  NodeIndexOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import courseSelectionService from '../services/courseSelectionService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const MaterialAddPage = ({ visible, onClose }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [linkUrl, setLinkUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [showWebsiteForm, setShowWebsiteForm] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [showBilibiliForm, setShowBilibiliForm] = useState(false);
  const [bilibiliUrl, setBilibiliUrl] = useState('');
  const [showDouyinForm, setShowDouyinForm] = useState(false);
  const [douyinUrl, setDouyinUrl] = useState('');
  const [showTextForm, setShowTextForm] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [showKnowledgeGraphForm, setShowKnowledgeGraphForm] = useState(false);
  const [showCapabilityModelForm, setShowCapabilityModelForm] = useState(false);
  const [showMyCourseForm, setShowMyCourseForm] = useState(false);
  const [showCourseVideoForm, setShowCourseVideoForm] = useState(false);
  const [showLiveStreamForm, setShowLiveStreamForm] = useState(false);
  const [showMicroMajorForm, setShowMicroMajorForm] = useState(false);

  const handleFileUpload = (info) => {
    const { status } = info.file;
    if (status === 'uploading') {
      setUploadProgress(info.file.percent || 0);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
      setUploadProgress(100);
    } else if (status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  };



  const handleLinkAdd = () => {
    if (linkUrl.trim()) {
      message.success('链接添加成功');
      setLinkUrl('');
    } else {
      message.warning('请输入有效链接');
    }
  };

  const handleTextAdd = () => {
    if (textContent.trim()) {
      message.success('文字内容添加成功');
      setTextContent('');
    } else {
      message.warning('请输入文字内容');
    }
  };

  const handleWebsiteClick = () => {
    setShowWebsiteForm(true);
  };

  const handleWebsiteSubmit = () => {
    if (websiteUrl.trim()) {
      message.success('网站链接添加成功');
      setWebsiteUrl('');
      setShowWebsiteForm(false);
    } else {
      message.warning('请输入网站链接');
    }
  };

  const handleWebsiteCancel = () => {
    setWebsiteUrl('');
    setShowWebsiteForm(false);
  };

  const handleBilibiliClick = () => {
    setShowBilibiliForm(true);
  };

  const handleBilibiliSubmit = () => {
    if (bilibiliUrl.trim()) {
      message.success('Bilibili链接提交成功！');
      setBilibiliUrl('');
      setShowBilibiliForm(false);
    }
  };

  const handleBilibiliCancel = () => {
    setBilibiliUrl('');
    setShowBilibiliForm(false);
  };

  const handleDouyinClick = () => {
    setShowDouyinForm(true);
  };

  const handleDouyinSubmit = () => {
    if (douyinUrl.trim()) {
      message.success('抖音链接提交成功！');
      setDouyinUrl('');
      setShowDouyinForm(false);
    }
  };

  const handleDouyinCancel = () => {
    setShowDouyinForm(false);
    setDouyinUrl('');
  };

  const handleTextClick = () => {
    setShowTextForm(true);
  };

  const handleTextSubmit = () => {
    if (pastedText.trim()) {
      message.success('文字内容已成功添加！');
      setShowTextForm(false);
      setPastedText('');
      onClose();
    }
  };

  const handleTextCancel = () => {
    setShowTextForm(false);
    setPastedText('');
  };



  const handleKnowledgeGraphClick = () => {
    setShowKnowledgeGraphForm(true);
  };

  const handleKnowledgeGraphSubmit = () => {
    message.success('知识图谱已成功添加！');
    setShowKnowledgeGraphForm(false);
    onClose();
  };

  const handleKnowledgeGraphCancel = () => {
    setShowKnowledgeGraphForm(false);
  };

  const handleCapabilityModelClick = () => {
    setShowCapabilityModelForm(true);
  };

  const handleCapabilityModelSubmit = () => {
    message.success('能力模型已成功添加！');
    setShowCapabilityModelForm(false);
    onClose();
  };

  const handleCapabilityModelCancel = () => {
    setShowCapabilityModelForm(false);
  };

  const handleMyCourseClick = () => {
    setShowMyCourseForm(true);
  };

  const handleMyCourseSubmit = () => {
    message.success('我的选课已成功添加！');
    setShowMyCourseForm(false);
    onClose();
  };

  const handleMyCourseCancel = () => {
    setShowMyCourseForm(false);
  };

  const handleCourseVideoClick = () => {
    setShowCourseVideoForm(true);
  };

  const handleCourseVideoSubmit = () => {
    message.success('课程视频已成功添加！');
    setShowCourseVideoForm(false);
    onClose();
  };

  // 微专业相关处理函数
  const handleMicroMajorClick = () => {
    setShowMicroMajorForm(true);
  };

  const handleMicroMajorSubmit = () => {
    message.success('微专业选择成功！');
    setShowMicroMajorForm(false);
  };

  const handleCourseVideoCancel = () => {
    setShowCourseVideoForm(false);
  };

  // 直播相关处理函数
  const handleLiveStreamClick = () => {
    setShowLiveStreamForm(true);
  };

  const handleLiveStreamSubmit = () => {
    message.success('直播链接已成功添加！');
    setShowLiveStreamForm(false);
    onClose();
  };

  const handleLiveStreamCancel = () => {
    setShowLiveStreamForm(false);
  };

  const handleMicroMajorCancel = () => {
    setShowMicroMajorForm(false);
  };

  return (
    <Modal
      title={(showWebsiteForm || showBilibiliForm || showDouyinForm || showTextForm || showKnowledgeGraphForm || showCapabilityModelForm || showMyCourseForm || showCourseVideoForm || showMicroMajorForm) ? null : "添加来源"}
      open={visible}
      onCancel={onClose}
      width={1040}
      footer={(showWebsiteForm || showBilibiliForm || showDouyinForm || showTextForm || showKnowledgeGraphForm || showCapabilityModelForm || showMyCourseForm || showCourseVideoForm || showMicroMajorForm) ? null : [
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="save" type="primary">
          保存资源
        </Button>
      ]}
      centered={(showWebsiteForm || showBilibiliForm || showDouyinForm || showTextForm || showKnowledgeGraphForm || showCapabilityModelForm || showMyCourseForm || showCourseVideoForm || showMicroMajorForm)}
      closable={!(showWebsiteForm || showBilibiliForm || showDouyinForm || showTextForm || showKnowledgeGraphForm || showCapabilityModelForm || showMyCourseForm || showCourseVideoForm || showMicroMajorForm)}
      bodyStyle={(showWebsiteForm || showBilibiliForm || showDouyinForm || showTextForm || showKnowledgeGraphForm || showCapabilityModelForm || showMyCourseForm || showCourseVideoForm || showMicroMajorForm) ? { padding: 0 } : {}}
    >
      {showTextForm ? (
        <div>
          {/* 标题栏 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleTextCancel}
              style={{ 
                marginRight: '12px',
                padding: '4px',
                minWidth: 'auto',
                height: 'auto'
              }}
            />
            <Title level={4} style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#1f2937' }}>
              粘贴文字
            </Title>
          </div>
          
          {/* 内容区域 */}
          <div style={{ padding: '24px 20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                在下方粘贴文字内容，即可作为来源上传至 NotebookLM。
              </Text>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <TextArea
                placeholder="粘贴文字内容 *"
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                rows={8}
                style={{
                  fontSize: '14px',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  backgroundColor: 'white'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <Text strong style={{ fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                注意
              </Text>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                <li>支持纯文本内容，系统将自动处理格式。</li>
                <li>建议粘贴结构化的文本内容以获得更好的分析效果。</li>
                <li>文本内容将被直接用于分析和问答。</li>
              </ul>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button
                onClick={handleTextCancel}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px'
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                onClick={handleTextSubmit}
                disabled={!pastedText.trim()}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  backgroundColor: pastedText.trim() ? '#1f2937' : '#9ca3af',
                  borderColor: pastedText.trim() ? '#1f2937' : '#9ca3af',
                  fontSize: '14px'
                }}
              >
                提交
              </Button>
            </div>
          </div>
        </div>
      ) : showWebsiteForm ? (
        <div>
          {/* 标题栏 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleWebsiteCancel}
              style={{ 
                marginRight: '12px',
                padding: '4px',
                minWidth: 'auto',
                height: 'auto'
              }}
            />
            <Title level={4} style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#1f2937' }}>
              网站网址
            </Title>
          </div>
          
          {/* 内容区域 */}
          <div style={{ padding: '24px 20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                在下方粘贴网址，即可作为来源上传至 NotebookLM。
              </Text>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ position: 'relative' }}>
                <LinkOutlined style={{ 
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '16px'
                }} />
                <Input
                  placeholder="粘贴网址 *"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  style={{
                    height: '48px',
                    paddingLeft: '40px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    backgroundColor: 'white'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <Text strong style={{ fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                注意
              </Text>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                <li>如果来源是多个网址，请单独提交每个网址内容。</li>
                <li>我们目前不支持需要登录的网站文字。</li>
                <li>不支持付费墙。</li>
              </ul>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button
                onClick={handleWebsiteCancel}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px'
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                onClick={handleWebsiteSubmit}
                disabled={!websiteUrl.trim()}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  backgroundColor: websiteUrl.trim() ? '#1f2937' : '#9ca3af',
                  borderColor: websiteUrl.trim() ? '#1f2937' : '#9ca3af',
                  fontSize: '14px'
                }}
              >
                提交
              </Button>
            </div>
          </div>
        </div>
      ) : showBilibiliForm ? (
        <div>
          {/* 标题栏 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBilibiliCancel}
              style={{ 
                marginRight: '12px',
                padding: '4px',
                minWidth: 'auto',
                height: 'auto'
              }}
            />
            <Title level={4} style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#1f2937' }}>
              Bilibili 视频
            </Title>
          </div>
          
          {/* 内容区域 */}
          <div style={{ padding: '24px 20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                在下方粘贴 Bilibili 视频链接，即可作为来源上传至 NotebookLM。
              </Text>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ position: 'relative' }}>
                <LinkOutlined style={{ 
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '16px'
                }} />
                <Input
                  placeholder="粘贴 Bilibili 视频链接 *"
                  value={bilibiliUrl}
                  onChange={(e) => setBilibiliUrl(e.target.value)}
                  style={{
                    height: '48px',
                    paddingLeft: '40px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    backgroundColor: 'white'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <Text strong style={{ fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                注意
              </Text>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                <li>支持 Bilibili 视频链接，系统将自动提取视频内容。</li>
                <li>确保视频链接有效且可以正常访问。</li>
                <li>视频内容将被转换为文本进行分析。</li>
              </ul>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button
                onClick={handleBilibiliCancel}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px'
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                onClick={handleBilibiliSubmit}
                disabled={!bilibiliUrl.trim()}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  backgroundColor: bilibiliUrl.trim() ? '#1f2937' : '#9ca3af',
                  borderColor: bilibiliUrl.trim() ? '#1f2937' : '#9ca3af',
                  fontSize: '14px'
                }}
              >
                提交
              </Button>
            </div>
          </div>
        </div>
      ) : showDouyinForm ? (
        <div>
          {/* 标题栏 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleDouyinCancel}
              style={{ 
                marginRight: '12px',
                padding: '4px',
                minWidth: 'auto',
                height: 'auto'
              }}
            />
            <Title level={4} style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#1f2937' }}>
              抖音视频
            </Title>
          </div>
          
          {/* 内容区域 */}
          <div style={{ padding: '24px 20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                在下方粘贴抖音视频链接，即可作为来源上传至 NotebookLM。
              </Text>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ position: 'relative' }}>
                <LinkOutlined style={{ 
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '16px'
                }} />
                <Input
                  placeholder="粘贴抖音视频链接 *"
                  value={douyinUrl}
                  onChange={(e) => setDouyinUrl(e.target.value)}
                  style={{
                    height: '48px',
                    paddingLeft: '40px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    backgroundColor: 'white'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <Text strong style={{ fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                注意
              </Text>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                <li>支持抖音视频链接，系统将自动提取视频内容。</li>
                <li>确保视频链接有效且可以正常访问。</li>
                <li>视频内容将被转换为文本进行分析。</li>
              </ul>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button
                onClick={handleDouyinCancel}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px'
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                onClick={handleDouyinSubmit}
                disabled={!douyinUrl.trim()}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  backgroundColor: douyinUrl.trim() ? '#1f2937' : '#9ca3af',
                  borderColor: douyinUrl.trim() ? '#1f2937' : '#9ca3af',
                  fontSize: '14px'
                }}
              >
                提交
              </Button>
            </div>
          </div>
        </div>
      ) : showKnowledgeGraphForm ? (
        <div>
          {/* 标题栏 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleKnowledgeGraphCancel}
              style={{ 
                marginRight: '12px',
                padding: '4px',
                minWidth: 'auto',
                height: 'auto'
              }}
            />
            <Title level={4} style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#1f2937' }}>
              知识图谱
            </Title>
          </div>
          
          {/* 内容区域 */}
          <div style={{ padding: '24px 20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                选择知识图谱作为智能笔记的来源，系统将基于图谱结构进行分析。
              </Text>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <Text strong style={{ fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                可用的知识图谱
              </Text>
              <div style={{ 
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#f9fafb'
              }}>
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  • 教师专业发展知识图谱
                </Text>
                <br />
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  • 学科知识体系图谱
                </Text>
                <br />
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  • 课程关联知识图谱
                </Text>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button
                onClick={handleKnowledgeGraphCancel}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px'
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                onClick={handleKnowledgeGraphSubmit}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  backgroundColor: '#52c41a',
                  borderColor: '#52c41a',
                  fontSize: '14px'
                }}
              >
                选择图谱
              </Button>
            </div>
          </div>
        </div>
      ) : showCapabilityModelForm ? (
        <div>
          {/* 标题栏 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleCapabilityModelCancel}
              style={{ 
                marginRight: '12px',
                padding: '4px',
                minWidth: 'auto',
                height: 'auto'
              }}
            />
            <Title level={4} style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#1f2937' }}>
              能力模型
            </Title>
          </div>
          
          {/* 内容区域 */}
          <div style={{ padding: '24px 20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                选择能力模型作为智能笔记的来源，系统将基于能力框架进行分析。
              </Text>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <Text strong style={{ fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                可用的能力模型
              </Text>
              <div style={{ 
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#f9fafb'
              }}>
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  • 教师专业能力模型
                </Text>
                <br />
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  • 学生核心素养模型
                </Text>
                <br />
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  • 课程设计能力模型
                </Text>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button
                onClick={handleCapabilityModelCancel}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px'
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                onClick={handleCapabilityModelSubmit}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  backgroundColor: '#fa8c16',
                  borderColor: '#fa8c16',
                  fontSize: '14px'
                }}
              >
                选择模型
              </Button>
            </div>
          </div>
        </div>
      ) : showMyCourseForm ? (
        <div>
          {/* 标题栏 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleMyCourseCancel}
              style={{ 
                marginRight: '12px',
                padding: '4px',
                minWidth: 'auto',
                height: 'auto'
              }}
            />
            <Title level={4} style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#1f2937' }}>
              我的选课
            </Title>
          </div>
          
          {/* 内容区域 */}
          <div style={{ padding: '24px 20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                从您的选课中选择课程内容作为智能笔记的来源。
              </Text>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <Text strong style={{ fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                我的课程
              </Text>
              <div style={{ 
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#f9fafb'
              }}>
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  • 教育心理学基础
                </Text>
                <br />
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  • 现代教学设计理论
                </Text>
                <br />
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  • 数字化教学工具应用
                </Text>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button
                onClick={handleMyCourseCancel}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px'
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                onClick={handleMyCourseSubmit}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  backgroundColor: '#722ed1',
                  borderColor: '#722ed1',
                  fontSize: '14px'
                }}
              >
                选择课程
              </Button>
            </div>
          </div>
        </div>
      ) : showCourseVideoForm ? (
        <div>
          {/* 标题栏 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleCourseVideoCancel}
              style={{ 
                marginRight: '12px',
                padding: '4px',
                minWidth: 'auto',
                height: 'auto'
              }}
            />
            <Title level={4} style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#1f2937' }}>
              课程视频
            </Title>
          </div>
          
          {/* 内容区域 */}
          <div style={{ padding: '24px 20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                选择课程视频作为智能笔记的来源，系统将提取视频内容进行分析。
              </Text>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <Text strong style={{ fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                可用的课程视频
              </Text>
              <div style={{ 
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#f9fafb'
              }}>
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  • 教学方法创新实践
                </Text>
                <br />
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  • 课堂管理技巧分享
                </Text>
                <br />
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  • 学生评价体系构建
                </Text>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button
                onClick={handleCourseVideoCancel}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px'
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                onClick={handleCourseVideoSubmit}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  backgroundColor: '#eb2f96',
                  borderColor: '#eb2f96',
                  fontSize: '14px'
                }}
              >
                选择视频
              </Button>
            </div>
          </div>
        </div>
      ) : showMicroMajorForm ? (
        <div>
          {/* 标题栏 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleMicroMajorCancel}
              style={{ 
                marginRight: '12px',
                padding: '4px',
                minWidth: 'auto',
                height: 'auto'
              }}
            />
            <Title level={4} style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#1f2937' }}>
              微专业
            </Title>
          </div>
          
          {/* 内容区域 */}
          <div style={{ padding: '24px 20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                选择微专业课程作为智能笔记的来源，系统将基于专业课程体系进行分析。
              </Text>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <Text strong style={{ fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                可用的微专业
              </Text>
              <div style={{ 
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#f9fafb'
              }}>
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  • 人工智能教育应用
                </Text>
                <br />
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  • 数字化教学设计
                </Text>
                <br />
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  • 教育数据分析
                </Text>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button
                onClick={handleMicroMajorCancel}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px'
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                onClick={handleMicroMajorSubmit}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  backgroundColor: '#13c2c2',
                  borderColor: '#13c2c2',
                  fontSize: '14px'
                }}
              >
                选择专业
              </Button>
            </div>
          </div>
        </div>
      ) : showLiveStreamForm ? (
        <div>
          {/* 标题栏 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleLiveStreamCancel}
              style={{ 
                marginRight: '12px',
                padding: '4px',
                minWidth: 'auto',
                height: 'auto'
              }}
            />
            <Title level={4} style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#1f2937' }}>
              直播
            </Title>
          </div>
          
          {/* 内容区域 */}
          <div style={{ padding: '24px 20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                添加直播链接作为智能笔记的来源，系统将实时分析直播内容。
              </Text>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <Text strong style={{ fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                支持的直播平台
              </Text>
              <div style={{ 
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#f9fafb'
              }}>
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  • 腾讯会议直播
                </Text>
                <br />
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  • 钉钉直播
                </Text>
                <br />
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  • Zoom直播
                </Text>
                <br />
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  • B站直播
                </Text>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button
                onClick={handleLiveStreamCancel}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px'
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                onClick={handleLiveStreamSubmit}
                style={{
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  backgroundColor: '#f5222d',
                  borderColor: '#f5222d',
                  fontSize: '14px'
                }}
              >
                选择直播
              </Button>
            </div>
          </div>
        </div>
      ) : (
      <div style={{ padding: '0' }}>

        {/* 说明文字 */}
        <div style={{ marginBottom: '32px' }}>
          <Text type="secondary">
            请选择要上传的文档，NotebookLM 智能笔记支持以下格式的资料来源。
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            (示例：教育方案、课程设计材料、研究报告、会议文档内容、辅导文档等)
          </Text>
        </div>

        {/* 主要内容区域 */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '40px',
          marginBottom: '24px',
          border: '1px solid #e8e8e8'
        }}>
          {/* 上传区域 */}
          <div style={{ 
            textAlign: 'center',
            marginBottom: '48px'
          }}>
            <Upload.Dragger
              name="file"
              multiple
              onChange={handleFileUpload}
              showUploadList={false}
              accept=".pdf,.txt,.md,.doc,.docx"
              style={{
                backgroundColor: '#fafafa',
                border: '2px dashed #d9d9d9',
                borderRadius: '8px',
                padding: '60px 20px'
              }}
            >
              <div>
                <UploadOutlined style={{ 
                  fontSize: '48px', 
                  color: '#4285f4',
                  marginBottom: '16px'
                }} />
                <div style={{ marginBottom: '8px' }}>
                  <Text strong style={{ fontSize: '16px' }}>上传文档</Text>
                </div>
                <Text type="secondary">
                  拖放文档文件到此处，或点击上传
                </Text>
              </div>
            </Upload.Dragger>
            
            <Text type="secondary" style={{ 
              fontSize: '12px',
              marginTop: '12px',
              display: 'block'
            }}>
              支持的文档类型：PDF, txt, Markdown 等格式（例如 .md3）
            </Text>
          </div>

          {/* 八个功能区域 - 4x2布局：第一排四个，第二排四个 */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px'
          }}>
            {/* 第一排：知识图谱、能力模型、微专业、我的选课 */}
            {/* 知识图谱 */}
            <Card 
              hoverable
              style={{ 
                textAlign: 'center',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              bodyStyle={{ padding: '40px 24px' }}
              onClick={handleKnowledgeGraphClick}
            >
              <ApartmentOutlined style={{ 
                fontSize: '40px', 
                color: '#52c41a',
                marginBottom: '20px'
              }} />
              <div style={{ marginBottom: '12px' }}>
                <Text strong style={{ fontSize: '16px' }}>知识图谱</Text>
              </div>
              <Button 
                type="primary"
                size="small"
                onClick={handleKnowledgeGraphClick}
                style={{
                  backgroundColor: '#52c41a',
                  borderColor: '#52c41a',
                  borderRadius: '16px',
                  fontSize: '12px',
                  height: '28px',
                  paddingLeft: '12px',
                  paddingRight: '12px'
                }}
              >
                选择图谱
              </Button>
            </Card>

            {/* 能力模型 */}
            <Card 
              hoverable
              style={{ 
                textAlign: 'center',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              bodyStyle={{ padding: '40px 24px' }}
              onClick={handleCapabilityModelClick}
            >
              <NodeIndexOutlined style={{ 
                fontSize: '40px', 
                color: '#fa8c16',
                marginBottom: '20px'
              }} />
              <div style={{ marginBottom: '12px' }}>
                <Text strong style={{ fontSize: '16px' }}>能力模型</Text>
              </div>
              <Button 
                type="primary"
                size="small"
                onClick={handleCapabilityModelClick}
                style={{
                  backgroundColor: '#fa8c16',
                  borderColor: '#fa8c16',
                  borderRadius: '16px',
                  fontSize: '12px',
                  height: '28px',
                  paddingLeft: '12px',
                  paddingRight: '12px'
                }}
              >
                选择模型
              </Button>
            </Card>

            {/* 微专业 */}
            <Card 
              hoverable
              style={{ 
                textAlign: 'center',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              bodyStyle={{ padding: '40px 24px' }}
              onClick={handleMicroMajorClick}
            >
              <GoogleOutlined style={{ 
                fontSize: '40px', 
                color: '#1890ff',
                marginBottom: '20px'
              }} />
              <div style={{ marginBottom: '12px' }}>
                <Text strong style={{ fontSize: '16px' }}>微专业</Text>
              </div>
              <Button 
                type="primary"
                size="small"
                onClick={handleMicroMajorClick}
                style={{
                  backgroundColor: '#1890ff',
                  borderColor: '#1890ff',
                  borderRadius: '16px',
                  fontSize: '12px',
                  height: '28px',
                  paddingLeft: '12px',
                  paddingRight: '12px'
                }}
              >
                选择专业
              </Button>
            </Card>

            {/* 我的选课 */}
            <Card 
              hoverable
              style={{ 
                textAlign: 'center',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              bodyStyle={{ padding: '40px 24px' }}
              onClick={handleMyCourseClick}
            >
              <BookOutlined style={{ 
                fontSize: '40px', 
                color: '#722ed1',
                marginBottom: '20px'
              }} />
              <div style={{ marginBottom: '12px' }}>
                <Text strong style={{ fontSize: '16px' }}>我的选课</Text>
              </div>
              <Button 
                type="primary"
                size="small"
                onClick={handleMyCourseClick}
                style={{
                  backgroundColor: '#722ed1',
                  borderColor: '#722ed1',
                  borderRadius: '16px',
                  fontSize: '12px',
                  height: '28px',
                  paddingLeft: '12px',
                  paddingRight: '12px'
                }}
              >
                选择课程
              </Button>
            </Card>

            {/* 第二排：课程视频、直播、链接、粘贴文字 */}
            {/* 课程视频 */}
            <Card 
              hoverable
              style={{ 
                textAlign: 'center',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              bodyStyle={{ padding: '40px 24px' }}
              onClick={handleCourseVideoClick}
            >
              <PlayCircleOutlined style={{ 
                fontSize: '40px', 
                color: '#eb2f96',
                marginBottom: '20px'
              }} />
              <div style={{ marginBottom: '12px' }}>
                <Text strong style={{ fontSize: '16px' }}>课程视频</Text>
              </div>
              <Button 
                type="primary"
                size="small"
                onClick={handleCourseVideoClick}
                style={{
                  backgroundColor: '#eb2f96',
                  borderColor: '#eb2f96',
                  borderRadius: '16px',
                  fontSize: '12px',
                  height: '28px',
                  paddingLeft: '12px',
                  paddingRight: '12px'
                }}
              >
                选择视频
              </Button>
            </Card>

            {/* 直播 */}
            <Card 
              hoverable
              style={{ 
                textAlign: 'center',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              bodyStyle={{ padding: '40px 24px' }}
              onClick={handleLiveStreamClick}
            >
              <VideoCameraOutlined style={{ 
                fontSize: '40px', 
                color: '#f5222d',
                marginBottom: '20px'
              }} />
              <div style={{ marginBottom: '12px' }}>
                <Text strong style={{ fontSize: '16px' }}>直播</Text>
              </div>
              <Button 
                type="primary"
                size="small"
                onClick={handleLiveStreamClick}
                style={{
                  backgroundColor: '#f5222d',
                  borderColor: '#f5222d',
                  borderRadius: '16px',
                  fontSize: '12px',
                  height: '28px',
                  paddingLeft: '12px',
                  paddingRight: '12px'
                }}
              >
                选择直播
              </Button>
            </Card>

            {/* 链接 */}
            <Card 
              hoverable
              style={{ 
                textAlign: 'center',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              bodyStyle={{ padding: '40px 24px' }}
            >
              <LinkOutlined style={{ 
                fontSize: '40px', 
                color: '#4285f4',
                marginBottom: '20px'
              }} />
              <div style={{ marginBottom: '12px' }}>
                <Text strong style={{ fontSize: '16px' }}>链接</Text>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button 
                  onClick={handleWebsiteClick}
                  style={{ 
                    padding: '4px 12px', 
                    height: 'auto', 
                    fontSize: '12px', 
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #d9d9d9',
                    borderRadius: '16px',
                    color: '#666'
                  }}
                >
                  网站
                </Button>
                <Button 
                  onClick={handleBilibiliClick}
                  style={{ 
                    padding: '4px 12px', 
                    height: 'auto', 
                    fontSize: '12px', 
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #d9d9d9',
                    borderRadius: '16px',
                    color: '#666'
                  }}
                >
                  bilibili
                </Button>
                <Button 
                  onClick={handleDouyinClick}
                  style={{ 
                    padding: '4px 12px', 
                    height: 'auto', 
                    fontSize: '12px', 
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #d9d9d9',
                    borderRadius: '16px',
                    color: '#666'
                  }}
                >
                  抖音
                </Button>
              </div>
            </Card>

            {/* 粘贴文字 */}
            <Card 
              hoverable
              style={{ 
                textAlign: 'center',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              bodyStyle={{ padding: '40px 24px' }}
              onClick={handleTextClick}
            >
              <FileTextOutlined style={{ 
                fontSize: '40px', 
                color: '#4285f4',
                marginBottom: '20px'
              }} />
              <div style={{ marginBottom: '12px' }}>
                <Text strong style={{ fontSize: '16px' }}>粘贴文字</Text>
              </div>
              <div>
                <Button 
                  onClick={handleTextClick}
                  style={{ 
                    padding: '4px 12px', 
                    height: 'auto', 
                    fontSize: '12px', 
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #d9d9d9',
                    borderRadius: '16px',
                    color: '#666'
                  }}
                >
                  复制的文字
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* 底部进度条 */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px 24px',
          border: '1px solid #e8e8e8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Text style={{ marginRight: '16px', fontSize: '14px', fontWeight: 500 }}>资源添加进度</Text>
            <Progress 
              percent={uploadProgress} 
              size="small" 
              strokeColor="#1890ff"
              style={{ flex: 1, marginRight: '16px' }} 
            />
            <Text style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>10/50</Text>
          </div>
        </div>
      </div>
      )}
    </Modal>
   );
 };

export default MaterialAddPage;