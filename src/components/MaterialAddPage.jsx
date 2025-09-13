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
  ArrowLeftOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const MaterialAddPage = ({ visible, onClose }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [linkUrl, setLinkUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');

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

  const handleGoogleDrive = () => {
    message.info('Google 云端硬盘功能开发中');
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
    setShowWebsiteModal(true);
  };

  const handleWebsiteSubmit = () => {
    if (websiteUrl.trim()) {
      message.success('网站链接添加成功');
      setWebsiteUrl('');
      setShowWebsiteModal(false);
    } else {
      message.warning('请输入网站链接');
    }
  };

  const handleWebsiteCancel = () => {
    setWebsiteUrl('');
    setShowWebsiteModal(false);
  };

  return (
    <>
    <Modal
      title="添加来源"
      open={visible}
      onCancel={onClose}
      width={1040}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="save" type="primary">
          保存资源
        </Button>
      ]}
    >
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
            {/* Google 云端硬盘 */}
            <Card 
              hoverable
              style={{ 
                textAlign: 'center',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              bodyStyle={{ padding: '40px 24px' }}
              onClick={handleGoogleDrive}
            >
              <GoogleOutlined style={{ 
                fontSize: '40px', 
                color: '#4285f4',
                marginBottom: '20px'
              }} />
              <div style={{ marginBottom: '12px' }}>
                <Text strong style={{ fontSize: '16px' }}>Google 云端硬盘</Text>
              </div>
              <div>
                <Button type="link" style={{ padding: 0, height: 'auto', fontSize: '14px', color: '#1890ff' }}>
                  Google 文档
                </Button>
              </div>
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
                <Button type="link" style={{ padding: 0, height: 'auto', fontSize: '14px', color: '#1890ff' }}>
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
    </Modal>

    {/* 网站弹窗 */}
    <Modal
      title={null}
      open={showWebsiteModal}
      onCancel={handleWebsiteCancel}
      footer={null}
      width={520}
      centered
      closable={false}
      bodyStyle={{ padding: '32px 32px 24px 32px' }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '24px' }}>
          <Title level={4} style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1f1f1f' }}>
            网站网址
          </Title>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <Input
            placeholder="粘贴网站网址"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            style={{
              height: '48px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: '#f9fafb'
            }}
          />
        </div>
        
        <div style={{ 
          marginBottom: '32px', 
          padding: '16px', 
          backgroundColor: '#fef3c7', 
          borderRadius: '8px',
          border: '1px solid #fbbf24'
        }}>
          <Text style={{ 
            fontSize: '14px', 
            color: '#92400e',
            lineHeight: '1.5'
          }}>
            NotebookLM 可以访问大多数公开的网站。但是，它无法访问需要登录或付费订阅的内容。
          </Text>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Button
            onClick={handleWebsiteCancel}
            style={{
              height: '40px',
              paddingLeft: '24px',
              paddingRight: '24px',
              borderRadius: '20px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              color: '#374151',
              fontWeight: 500
            }}
          >
            取消
          </Button>
          <Button
            type="primary"
            onClick={handleWebsiteSubmit}
            disabled={!websiteUrl.trim()}
            style={{
              height: '40px',
              paddingLeft: '24px',
              paddingRight: '24px',
              borderRadius: '20px',
              backgroundColor: websiteUrl.trim() ? '#1f2937' : '#9ca3af',
              borderColor: websiteUrl.trim() ? '#1f2937' : '#9ca3af',
              fontWeight: 500
            }}
          >
            确认
          </Button>
        </div>
       </div>
     </Modal>
     </>
   );
 };

export default MaterialAddPage;