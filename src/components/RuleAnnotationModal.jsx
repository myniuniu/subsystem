import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Switch,
  TimePicker,
  DatePicker,
  Card,
  Space,
  Divider,
  Tag,
  Typography,
  Row,
  Col,
  Alert,
  Tooltip,
  InputNumber
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  TagOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

const RuleAnnotationModal = ({ onClose, onRuleCreate, onRuleManage, existingRules }) => {
  const [form] = Form.useForm();
  const [ruleType, setRuleType] = useState('keyword'); // 规则类型
  const [scheduleType, setScheduleType] = useState('manual'); // 执行类型
  const [keywords, setKeywords] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [conditions, setConditions] = useState([]);

  // 添加关键词
  const addKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  // 删除关键词
  const removeKeyword = (keyword) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  // 添加条件
  const addCondition = () => {
    setConditions([...conditions, {
      id: Date.now(),
      field: 'title',
      operator: 'contains',
      value: ''
    }]);
  };

  // 删除条件
  const removeCondition = (id) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  // 更新条件
  const updateCondition = (id, field, value) => {
    setConditions(conditions.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  // 提交规则
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const rule = {
        name: values.ruleName,
        description: values.description,
        type: ruleType,
        enabled: values.enabled !== false,
        scheduleType: scheduleType,
        keywords: keywords,
        conditions: conditions,
        actions: {
          autoTag: values.autoTag,
          tagPrefix: values.tagPrefix || '',
          notification: values.notification,
          priority: values.priority || 'medium'
        },
        schedule: scheduleType === 'scheduled' ? {
          frequency: values.frequency,
          time: values.time?.format('HH:mm'),
          dates: values.dates?.map(d => d.format('YYYY-MM-DD')),
          interval: values.interval
        } : null,
        createdAt: new Date().toISOString(),
        lastExecuted: null,
        executionCount: 0
      };

      onRuleCreate(rule);
      onClose();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <>
      <Alert
        message="智能规则标注"
        description="通过设置规则，系统可以自动识别和标注符合条件的资源，支持关键词匹配、条件筛选和定时执行。"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          enabled: true,
          autoTag: true,
          notification: false,
          priority: 'medium'
        }}
      >
        {/* 基本信息 */}
        <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ruleName"
                label="规则名称"
                rules={[{ required: true, message: '请输入规则名称' }]}
              >
                <Input placeholder="例如：技术类资源自动标注" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="enabled"
                label="启用状态"
                valuePropName="checked"
              >
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="规则描述"
          >
            <TextArea 
              rows={2} 
              placeholder="描述此规则的用途和作用范围..."
            />
          </Form.Item>
        </Card>

        {/* 规则类型 */}
        <Card title="规则类型" size="small" style={{ marginBottom: 16 }}>
          <Select
            value={ruleType}
            onChange={setRuleType}
            style={{ width: '100%' }}
          >
            <Option value="keyword">关键词匹配</Option>
            <Option value="condition">条件筛选</Option>
            <Option value="hybrid">混合模式</Option>
          </Select>

          {(ruleType === 'keyword' || ruleType === 'hybrid') && (
            <div style={{ marginTop: 16 }}>
              <Text strong>关键词设置</Text>
              <div style={{ marginTop: 8, marginBottom: 8 }}>
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    value={currentKeyword}
                    onChange={(e) => setCurrentKeyword(e.target.value)}
                    placeholder="输入关键词"
                    onPressEnter={addKeyword}
                  />
                  <Button type="primary" icon={<PlusOutlined />} onClick={addKeyword}>
                    添加
                  </Button>
                </Space.Compact>
              </div>
              <div>
                {keywords.map(keyword => (
                  <Tag
                    key={keyword}
                    closable
                    onClose={() => removeKeyword(keyword)}
                    style={{ marginBottom: 4 }}
                  >
                    {keyword}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {(ruleType === 'condition' || ruleType === 'hybrid') && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text strong>筛选条件</Text>
                <Button size="small" icon={<PlusOutlined />} onClick={addCondition}>
                  添加条件
                </Button>
              </div>
              
              {conditions.map(condition => (
                <Card key={condition.id} size="small" style={{ marginBottom: 8 }}>
                  <Row gutter={8} align="middle">
                    <Col span={6}>
                      <Select
                        value={condition.field}
                        onChange={(value) => updateCondition(condition.id, 'field', value)}
                        style={{ width: '100%' }}
                      >
                        <Option value="title">标题</Option>
                        <Option value="content">内容</Option>
                        <Option value="type">类型</Option>
                        <Option value="size">大小</Option>
                        <Option value="date">日期</Option>
                      </Select>
                    </Col>
                    <Col span={6}>
                      <Select
                        value={condition.operator}
                        onChange={(value) => updateCondition(condition.id, 'operator', value)}
                        style={{ width: '100%' }}
                      >
                        <Option value="contains">包含</Option>
                        <Option value="equals">等于</Option>
                        <Option value="startsWith">开始于</Option>
                        <Option value="endsWith">结束于</Option>
                        <Option value="greater">大于</Option>
                        <Option value="less">小于</Option>
                      </Select>
                    </Col>
                    <Col span={10}>
                      <Input
                        value={condition.value}
                        onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                        placeholder="条件值"
                      />
                    </Col>
                    <Col span={2}>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeCondition(condition.id)}
                      />
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* 执行动作 */}
        <Card title="执行动作" size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="autoTag"
                label="自动标注"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="notification"
                label="执行通知"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="priority"
                label="优先级"
              >
                <Select>
                  <Option value="high">高</Option>
                  <Option value="medium">中</Option>
                  <Option value="low">低</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="tagPrefix"
            label="标签前缀"
          >
            <Input placeholder="例如：auto-" />
          </Form.Item>
        </Card>

        {/* 执行计划 */}
        <Card title="执行计划" size="small" style={{ marginBottom: 16 }}>
          <Form.Item label="执行方式">
            <Select
              value={scheduleType}
              onChange={setScheduleType}
              style={{ width: '100%' }}
            >
              <Option value="manual">手动执行</Option>
              <Option value="scheduled">定时执行</Option>
              <Option value="realtime">实时执行</Option>
            </Select>
          </Form.Item>

          {scheduleType === 'scheduled' && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="frequency"
                    label="执行频率"
                    rules={[{ required: true, message: '请选择执行频率' }]}
                  >
                    <Select>
                      <Option value="daily">每日</Option>
                      <Option value="weekly">每周</Option>
                      <Option value="monthly">每月</Option>
                      <Option value="custom">自定义</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="time"
                    label="执行时间"
                    rules={[{ required: true, message: '请选择执行时间' }]}
                  >
                    <TimePicker format="HH:mm" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="dates"
                label="执行日期范围"
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item
                name="interval"
                label="执行间隔（分钟）"
              >
                <InputNumber min={1} max={1440} style={{ width: '100%' }} />
              </Form.Item>
            </>
          )}

          {scheduleType === 'realtime' && (
            <Alert
              message="实时执行模式"
              description="规则将在资源添加或更新时立即执行，请确保规则设置合理以避免性能影响。"
              type="warning"
              showIcon
            />
          )}
        </Card>
      </Form>

      {/* 操作按钮 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <Button onClick={onRuleManage}>
          <ClockCircleOutlined /> 管理现有规则
        </Button>
        
        <Space>
          <Button onClick={onClose}>
            取消
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            <PlayCircleOutlined /> 创建规则
          </Button>
        </Space>
      </div>

      {existingRules.length > 0 && (
        <>
          <Divider />
          <div>
            <Text strong>现有规则 ({existingRules.length})</Text>
            <div style={{ marginTop: 8 }}>
              {existingRules.slice(0, 3).map(rule => (
                <Tag key={rule.id} color={rule.enabled ? 'green' : 'default'}>
                  {rule.name}
                </Tag>
              ))}
              {existingRules.length > 3 && (
                <Tag>+{existingRules.length - 3} 更多...</Tag>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RuleAnnotationModal;