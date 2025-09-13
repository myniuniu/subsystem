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
  message
} from 'antd';
import {
  UploadOutlined,
  GoogleOutlined,
  LinkOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';

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
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

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

  const handleVideoClick = () => {
    setShowVideoForm(true);
  };

  const handleVideoSubmit = () => {
    if (selectedVideo) {
      message.success('课程视频已成功添加！');
      setShowVideoForm(false);
      setSelectedVideo(null);
      onClose();
    }
  };

  const handleVideoCancel = () => {
    setShowVideoForm(false);
    setSelectedVideo(null);
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

  return (
    <Modal
      title={(showWebsiteForm || showBilibiliForm || showDouyinForm || showTextForm || showVideoForm) ? null : "添加来源"}
      open={visible}
      onCancel={onClose}
      width={1040}
      footer={(showWebsiteForm || showBilibiliForm || showDouyinForm || showTextForm || showVideoForm) ? null : [
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="save" type="primary">
          保存资源
        </Button>
      ]}
      centered={(showWebsiteForm || showBilibiliForm || showDouyinForm || showTextForm || showVideoForm)}
      closable={!(showWebsiteForm || showBilibiliForm || showDouyinForm || showTextForm || showVideoForm)}
      bodyStyle={(showWebsiteForm || showBilibiliForm || showDouyinForm || showTextForm || showVideoForm) ? { padding: 0 } : {}}
    >
      {showVideoForm ? (
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
               onClick={handleVideoCancel}
               style={{ 
                 marginRight: '12px',
                 padding: '4px',
                 minWidth: 'auto',
                 height: 'auto'
               }}
             />
             <Title level={4} style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#1f2937' }}>
               选择课程视频
             </Title>
           </div>
           
           {/* 内容区域 */}
           <div style={{ padding: '24px 20px' }}>
             <div style={{ marginBottom: '16px' }}>
               <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                 从平台课程库中选择视频作为学习资料。
               </Text>
             </div>
             
             {/* 视频列表 */}
             <div style={{ marginBottom: '24px', maxHeight: '400px', overflowY: 'auto' }}>
               {[
                 { id: 1, title: '数学基础 - 函数与方程', duration: '45:30', category: '数学', thumbnail: '/api/placeholder/160/90' },
                 { id: 2, title: '物理实验 - 光学原理', duration: '38:15', category: '物理', thumbnail: '/api/placeholder/160/90' },
                 { id: 3, title: '化学反应 - 酸碱平衡', duration: '52:20', category: '化学', thumbnail: '/api/placeholder/160/90' },
                 { id: 4, title: '生物学 - 细胞结构', duration: '41:45', category: '生物', thumbnail: '/api/placeholder/160/90' },
                 { id: 5, title: '历史课程 - 古代文明', duration: '48:10', category: '历史', thumbnail: '/api/placeholder/160/90' }
               ].map(video => (
                 <Card 
                   key={video.id}
                   size="small"
                   hoverable
                   style={{ 
                     marginBottom: '12px',
                     border: selectedVideo?.id === video.id ? '2px solid #1890ff' : '1px solid #f0f0f0',
                     backgroundColor: selectedVideo?.id === video.id ? '#f6ffed' : 'white',
                     cursor: 'pointer'
                   }}
                   onClick={() => setSelectedVideo(video)}
                 >
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <div style={{ 
                       width: '80px', 
                       height: '45px', 
                       backgroundColor: '#f5f5f5',
                       borderRadius: '4px',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       position: 'relative'
                     }}>
                       <PlayCircleOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                     </div>
                     <div style={{ flex: 1 }}>
                       <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px' }}>
                         {video.title}
                       </div>
                       <div style={{ fontSize: '12px', color: '#666' }}>
                         {video.category} • {video.duration}
                       </div>
                     </div>
                   </div>
                 </Card>
               ))}
             </div>
             
             <div style={{ marginBottom: '24px' }}>
               <Text strong style={{ fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                 注意
               </Text>
               <ul style={{ margin: 0, paddingLeft: '20px', color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                 <li>选择的视频将作为学习资料添加到您的笔记中。</li>
                 <li>视频内容可用于AI分析和问答功能。</li>
                 <li>确保选择与学习目标相关的视频内容。</li>
               </ul>
             </div>
             
             <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
               <Button
                 onClick={handleVideoCancel}
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
                 onClick={handleVideoSubmit}
                 disabled={!selectedVideo}
                 style={{
                   height: '36px',
                   paddingLeft: '16px',
                   paddingRight: '16px',
                   borderRadius: '18px',
                   backgroundColor: selectedVideo ? '#1f2937' : '#9ca3af',
                   borderColor: selectedVideo ? '#1f2937' : '#9ca3af',
                   fontSize: '14px'
                 }}
               >
                 添加视频
               </Button>
             </div>
           </div>
         </div>
       ) : showTextForm ? (
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

          {/* 三个功能区域 */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '20px'
          }}>
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
              onClick={handleVideoClick}
            >
              <PlayCircleOutlined style={{ 
                fontSize: '40px', 
                color: '#1890ff',
                marginBottom: '20px'
              }} />
              <div style={{ marginBottom: '12px' }}>
                <Text strong style={{ fontSize: '16px' }}>课程视频</Text>
              </div>
              <Button 
                  type="primary"
                  size="small"
                  onClick={handleVideoClick}
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
                  平台课程
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