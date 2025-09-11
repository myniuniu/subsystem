import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  Row,
  Col,
  Card,
  Tag,
  Space,
  Divider,
  Progress,
  Alert
} from 'antd';
import {
  UploadOutlined,
  InboxOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const ScenarioUpload = ({ visible, onClose, onUpload, categories = [], editingScenario = null }) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState('');

  // 初始化表单数据（编辑模式）
  React.useEffect(() => {
    if (editingScenario) {
      form.setFieldsValue({
        title: editingScenario.title,
        description: editingScenario.description,
        category: editingScenario.category,
        difficulty: editingScenario.difficulty,
        estimatedTime: editingScenario.estimatedTime
      });
      setTags(editingScenario.tags || []);
      if (editingScenario.thumbnail) {
        setFileList([{
          uid: '-1',
          name: 'thumbnail.jpg',
          status: 'done',
          url: editingScenario.thumbnail
        }]);
      }
    } else {
      form.resetFields();
      setTags([]);
      setFileList([]);
    }
  }, [editingScenario, form]);

  // 处理文件上传
  const handleUpload = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // 处理文件预览
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  // 获取文件base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // 添加标签
  const handleAddTag = () => {
    if (inputTag && !tags.includes(inputTag)) {
      setTags([...tags, inputTag]);
      setInputTag('');
    }
  };

  // 删除标签
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setUploading(true);
      
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // 构建场景数据
      const scenarioData = {
        ...values,
        tags,
        thumbnail: fileList[0]?.url || fileList[0]?.response?.url || '',
        files: fileList.map(file => ({
          name: file.name,
          url: file.url || file.response?.url,
          size: file.size
        })),
        id: editingScenario?.id || Date.now().toString(),
        uploadTime: new Date().toISOString(),
        status: 'published'
      };

      // 模拟API调用
      setTimeout(() => {
        setUploadProgress(100);
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
          message.success(editingScenario ? '场景更新成功！' : '场景上传成功！');
          onUpload(scenarioData);
          handleClose();
        }, 500);
      }, 1000);

    } catch (error) {
      console.error('表单验证失败:', error);
      setUploading(false);
    }
  };

  // 关闭弹窗
  const handleClose = () => {
    form.resetFields();
    setFileList([]);
    setTags([]);
    setInputTag('');
    setUploadProgress(0);
    setUploading(false);
    onClose();
  };

  // 上传配置
  const uploadProps = {
    name: 'file',
    multiple: true,
    fileList,
    onChange: handleUpload,
    onPreview: handlePreview,
    beforeUpload: (file) => {
      const isValidType = file.type.startsWith('image/') || 
                         file.type === 'application/zip' ||
                         file.type === 'text/html' ||
                         file.name.endsWith('.html');
      if (!isValidType) {
        message.error('只支持图片、HTML文件或ZIP压缩包！');
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('文件大小不能超过10MB！');
        return false;
      }
      return false; // 阻止自动上传，由表单提交时处理
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    }
  };

  return (
    <>
      <Modal
        title={editingScenario ? '编辑场景' : '上传新场景'}
        open={visible}
        onCancel={handleClose}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleClose} disabled={uploading}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={uploading}
            onClick={handleSubmit}
            icon={editingScenario ? <SaveOutlined /> : <UploadOutlined />}
          >
            {uploading ? '处理中...' : (editingScenario ? '保存更改' : '上传场景')}
          </Button>
        ]}
      >
        {uploading && (
          <Alert
            message="正在处理场景文件..."
            description={`进度: ${uploadProgress}%`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            action={
              <Progress
                percent={uploadProgress}
                size="small"
                style={{ width: 100 }}
              />
            }
          />
        )}

        <Form
          form={form}
          layout="vertical"
          disabled={uploading}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="场景标题"
                rules={[
                  { required: true, message: '请输入场景标题' },
                  { max: 50, message: '标题不能超过50个字符' }
                ]}
              >
                <Input placeholder="请输入场景标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="场景分类"
                rules={[{ required: true, message: '请选择场景分类' }]}
              >
                <Select placeholder="请选择分类">
                  {categories.map(category => (
                    <Option key={category.id} value={category.name}>
                      <Tag color={category.color} style={{ marginRight: 8 }}>
                        {category.name}
                      </Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="difficulty"
                label="难度等级"
                rules={[{ required: true, message: '请选择难度等级' }]}
              >
                <Select placeholder="请选择难度">
                  <Option value="beginner">初级</Option>
                  <Option value="intermediate">中级</Option>
                  <Option value="advanced">高级</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="estimatedTime"
                label="预计时长（分钟）"
                rules={[
                  { required: true, message: '请输入预计时长' },
                  { type: 'number', min: 1, max: 300, message: '时长应在1-300分钟之间' }
                ]}
              >
                <Input type="number" placeholder="请输入预计时长" addonAfter="分钟" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="场景描述"
            rules={[
              { required: true, message: '请输入场景描述' },
              { max: 500, message: '描述不能超过500个字符' }
            ]}
          >
            <TextArea
              rows={4}
              placeholder="请详细描述场景内容、学习目标和操作要点..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item label="标签">
            <Space wrap>
              {tags.map(tag => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => handleRemoveTag(tag)}
                >
                  {tag}
                </Tag>
              ))}
            </Space>
            <Input.Group compact style={{ marginTop: 8, display: 'flex' }}>
              <Input
                style={{ flex: 1 }}
                placeholder="添加标签"
                value={inputTag}
                onChange={(e) => setInputTag(e.target.value)}
                onPressEnter={handleAddTag}
              />
              <Button type="primary" onClick={handleAddTag}>
                添加
              </Button>
            </Input.Group>
          </Form.Item>

          <Form.Item
            label="场景文件"
            extra="支持上传HTML文件、图片或ZIP压缩包，文件大小不超过10MB"
          >
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">
                支持单个或批量上传。严禁上传公司数据或其他敏感文件。
              </p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>

      {/* 图片预览弹窗 */}
      <Modal
        open={previewVisible}
        title="图片预览"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ScenarioUpload;