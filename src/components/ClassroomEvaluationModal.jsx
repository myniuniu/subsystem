import React, { useState } from 'react';
import {
  Modal,
  Typography,
  Form,
  Input,
  Select,
  Button,
  Space,
  Card,
  Divider,
  Tag,
  Row,
  Col,
  Alert,
  message
} from 'antd';
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  StarOutlined,
  BookOutlined,
  UserOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ClassroomEvaluationModal = ({ visible, onCancel, onConfirm, inline = false }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // 构建评价配置数据
      const evaluationConfig = {
        subject: values.subject,
        grade: values.grade,
        evaluationType: values.evaluationType,
        evaluationRequirements: values.evaluationRequirements,
        focusAreas: values.focusAreas || [],
        timestamp: new Date().toISOString()
      };

      onConfirm(evaluationConfig);
      
      // 创建操作记录后直接关闭弹窗
      form.resetFields();
      onCancel();
    } catch (error) {
      console.error('表单验证失败:', error);
      // 添加用户友好的错误提示
      if (error.errorFields && error.errorFields.length > 0) {
        const firstError = error.errorFields[0];
        message.error(`请检查${firstError.name[0]}字段：${firstError.errors[0]}`);
      } else {
        message.error('请检查表单填写是否完整');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const evaluationTypes = [
    { value: 'comprehensive', label: '综合评价', description: '全面评估教学各个环节' },
    { value: 'teaching-method', label: '教学方法评价', description: '重点关注教学方法和技巧' },
    { value: 'interaction', label: '师生互动评价', description: '评估课堂互动效果' },
    { value: 'content-delivery', label: '内容传达评价', description: '评价知识点传达效果' },
    { value: 'classroom-management', label: '课堂管理评价', description: '评估课堂组织和管理能力' }
  ];

  const focusAreaOptions = [
    '教学目标达成',
    '教学内容组织',
    '教学方法运用',
    '师生互动质量',
    '课堂氛围营造',
    '学生参与度',
    '知识点讲解清晰度',
    '时间分配合理性',
    '教学资源利用',
    '课堂纪律管理'
  ];

  return (
    <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 16 }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px'
        }}>
          📊
        </div>
        <span style={{ fontWeight: 600 }}>课堂评价工具</span>
        <Space style={{ marginLeft: 'auto' }}>
          <Button onClick={handleCancel}>取消</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading} icon={<CheckCircleOutlined />}>生成</Button>
        </Space>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <Alert
          message="工具说明"
          description="该工具基于您提交的评价要求，智能生成专业的课堂评价量表，并基于该量表对老师在课堂上的表现进行全面、客观的评估分析。"
          type="info"
          icon={<InfoCircleOutlined />}
          showIcon
          style={{ marginBottom: '16px' }}
        />

        <Card size="small" style={{ background: '#fafafa', border: 'none' }}>
          <Row gutter={16}>
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                <StarOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                <div style={{ fontSize: '12px', color: '#666' }}>智能量表生成</div>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                <BookOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                <div style={{ fontSize: '12px', color: '#666' }}>多维度评估</div>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                <CheckCircleOutlined style={{ fontSize: '24px', color: '#fa8c16', marginBottom: '8px' }} />
                <div style={{ fontSize: '12px', color: '#666' }}>专业报告生成</div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="subject"
              label="授课科目"
              rules={[{ required: true, message: '请输入授课科目' }]}
            >
              <Input 
                placeholder="如：数学、语文、英语等"
                prefix={<BookOutlined style={{ color: '#bfbfbf' }} />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="grade"
              label="年级班级"
              rules={[{ required: true, message: '请输入年级班级' }]}
            >
              <Input 
                placeholder="如：三年级一班、高二(3)班等"
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="evaluationType"
          label="评价类型"
          rules={[{ required: true, message: '请选择评价类型' }]}
        >
          <Select placeholder="请选择评价类型">
            {evaluationTypes.map(type => (
              <Option key={type.value} value={type.value}>
                <div>
                  <div style={{ fontWeight: 500 }}>{type.label}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{type.description}</div>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="focusAreas"
          label="重点关注领域"
        >
          <Select
            mode="multiple"
            placeholder="选择需要重点关注的评价领域（可多选）"
            maxTagCount={3}
            maxTagTextLength={8}
          >
            {focusAreaOptions.map(area => (
              <Option key={area} value={area}>{area}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="evaluationRequirements"
          label="具体评价要求"
          rules={[{ required: true, message: '请输入具体的评价要求' }]}
        >
          <TextArea
            rows={4}
            placeholder="请详细描述您的评价要求，如：评价标准、关注重点、特殊要求等。例如：重点关注学生参与度和互动效果，评价教师的课堂组织能力和知识点讲解的清晰度..."
            showCount
            maxLength={500}
          />
        </Form.Item>
      </Form>

      <Divider />

      <div style={{ textAlign: 'right' }}>
        <Space>
          <Button onClick={handleCancel}>
            取消
          </Button>
          <Button 
            type="primary" 
            onClick={handleSubmit}
            loading={loading}
            icon={<CheckCircleOutlined />}
          >
            生成
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default ClassroomEvaluationModal;