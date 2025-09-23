import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Switch,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Card,
  Statistic,
  Row,
  Col,
  Typography,
  Badge,
  Tooltip,
  Progress,
  Alert
} from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
  SettingOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { TextArea } = Input;

const RuleManagementModal = ({ rules, onRuleUpdate, onClose }) => {
  const [selectedRule, setSelectedRule] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editForm] = Form.useForm();

  // 执行规则
  const executeRule = async (rule) => {
    message.loading({ content: '正在执行规则...', key: 'execute' });
    
    try {
      // 模拟执行规则
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 更新规则执行统计
      const updatedRule = {
        ...rule,
        executionCount: (rule.executionCount || 0) + 1,
        lastExecuted: new Date().toISOString(),
        successRate: Math.min(100, (rule.successRate || 0) + Math.random() * 10)
      };
      
      onRuleUpdate(updatedRule);
      message.success({ content: '规则执行成功！', key: 'execute' });
    } catch (error) {
      message.error({ content: '规则执行失败！', key: 'execute' });
    }
  };

  // 删除规则
  const deleteRule = (ruleId) => {
    const updatedRules = rules.filter(rule => rule.id !== ruleId);
    onRuleUpdate(updatedRules);
    message.success('规则删除成功！');
  };

  // 切换规则状态
  const toggleRuleStatus = (rule) => {
    const updatedRule = { ...rule, enabled: !rule.enabled };
    onRuleUpdate(updatedRule);
    message.success(`规则已${updatedRule.enabled ? '启用' : '禁用'}！`);
  };

  // 编辑规则
  const handleEditRule = (rule) => {
    setSelectedRule(rule);
    editForm.setFieldsValue(rule);
    setShowEditModal(true);
  };

  // 保存编辑
  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields();
      const updatedRule = { ...selectedRule, ...values };
      onRuleUpdate(updatedRule);
      setShowEditModal(false);
      setSelectedRule(null);
      editForm.resetFields();
      message.success('规则更新成功！');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 查看规则详情
  const viewRuleDetail = (rule) => {
    setSelectedRule(rule);
    setShowDetailModal(true);
  };

  // 获取优先级标签
  const getPriorityTag = (priority) => {
    const priorityConfig = {
      high: { color: 'red', text: '高' },
      medium: { color: 'orange', text: '中' },
      low: { color: 'green', text: '低' }
    };
    const config = priorityConfig[priority] || priorityConfig.medium;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取状态标签
  const getStatusTag = (enabled) => {
    return enabled ? (
      <Text type="success">启用</Text>
    ) : (
      <Text type="secondary">禁用</Text>
    );
  };

  // 表格列定义
  const columns = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
      render: (enabled) => getStatusTag(enabled),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority) => getPriorityTag(priority),
    },
    {
      title: '执行次数',
      dataIndex: 'executionCount',
      key: 'executionCount',
      width: 100,
      render: (count) => count || 0,
    },
    {
      title: '最后执行',
      dataIndex: 'lastExecuted',
      key: 'lastExecuted',
      width: 150,
      render: (date) => date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="执行规则">
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              onClick={() => executeRule(record)}
              disabled={!record.enabled}
            />
          </Tooltip>
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => viewRuleDetail(record)}
            />
          </Tooltip>
          <Tooltip title="编辑规则">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditRule(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确认删除"
                description="删除后无法恢复，确定要删除这个规则吗？"
            onConfirm={() => deleteRule(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除规则">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 计算统计数据
  const stats = {
    total: rules.length,
    enabled: rules.filter(rule => rule.enabled).length,
    disabled: rules.filter(rule => !rule.enabled).length,
    totalExecutions: rules.reduce((sum, rule) => sum + (rule.executionCount || 0), 0)
  };

  return (
    <Modal
      title="规则管理"
      open={true}
      onCancel={onClose}
      width={1200}
      footer={null}
      style={{ top: 20 }}
    >
      <div style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="总规则数"
                value={stats.total}
                prefix={<BarChartOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="启用规则"
                value={stats.enabled}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="禁用规则"
                value={stats.disabled}
                prefix={<PauseCircleOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总执行次数"
                value={stats.totalExecutions}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Card title="规则列表" extra={
        <Button type="primary" onClick={onClose}>
          关闭
        </Button>
      }>
        {rules.length === 0 ? (
          <Alert
            message="暂无规则"
            description="您还没有创建任何规则，请先创建规则以开始使用规则管理功能。"
            type="info"
            showIcon
          />
        ) : (
          <Table
            columns={columns}
            dataSource={rules}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            size="small"
          />
        )}
      </Card>

      {/* 编辑规则模态框 */}
      <Modal
        title="编辑规则"
        open={showEditModal}
        onOk={handleSaveEdit}
        onCancel={() => {
          setShowEditModal(false);
          setSelectedRule(null);
          editForm.resetFields();
        }}
        okText="保存"
        cancelText="取消"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="name"
            label="规则名称"
            rules={[{ required: true, message: '请输入规则名称' }]}
          >
            <Input placeholder="请输入规则名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="规则描述"
          >
            <TextArea
              rows={3}
              placeholder="请输入规则描述"
            />
          </Form.Item>
          <Form.Item
            name="enabled"
            label="启用状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Select placeholder="请选择优先级">
              <Select.Option value="high">高</Select.Option>
              <Select.Option value="medium">中</Select.Option>
              <Select.Option value="low">低</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 规则详情模态框 */}
      <Modal
        title="规则详情"
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowDetailModal(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedRule && (
          <div>
            <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>规则名称：</Text>
                    <Text>{selectedRule.name}</Text>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>状态：</Text>
                    {getStatusTag(selectedRule.enabled)}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>优先级：</Text>
                    {getPriorityTag(selectedRule.priority)}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>创建时间：</Text>
                    <Text>{selectedRule.createdAt ? dayjs(selectedRule.createdAt).format('YYYY-MM-DD HH:mm') : '-'}</Text>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>更新时间：</Text>
                    <Text>{selectedRule.updatedAt ? dayjs(selectedRule.updatedAt).format('YYYY-MM-DD HH:mm') : '-'}</Text>
                  </div>
                </Col>
              </Row>
              <div style={{ marginTop: 16 }}>
                <Text strong>描述：</Text>
                <div style={{ marginTop: 8, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                  <Text>{selectedRule.description || '暂无描述'}</Text>
                </div>
              </div>
            </Card>

            <Card title="规则配置" size="small" style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 12 }}>
                <Text strong>关键词：</Text>
                <div style={{ marginTop: 8 }}>
                  {selectedRule.keywords?.map((keyword, index) => (
                    <Tag key={keyword} color="blue">{keyword}</Tag>
                  )) || <Text type="secondary">暂无关键词</Text>}
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <Text strong>触发条件：</Text>
                <div style={{ marginTop: 8 }}>
                  {selectedRule.conditions?.map((condition, index) => (
                    <Tag key={index} color="green">
                      {condition.field} {condition.operator} {condition.value}
                    </Tag>
                  )) || <Text type="secondary">暂无触发条件</Text>}
                </div>
              </div>
            </Card>

            <Card title="执行配置" size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>执行动作：</Text>
                    <div style={{ marginTop: 4 }}>
                      <Text>{selectedRule.action?.type || '暂无配置'}</Text>
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>执行参数：</Text>
                    <div style={{ marginTop: 4 }}>
                      <Text code>{JSON.stringify(selectedRule.action?.params || {}, null, 2)}</Text>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>调度配置：</Text>
                    <div style={{ marginTop: 4 }}>
                      <Text>{selectedRule.schedule?.type || '手动执行'}</Text>
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>调度参数：</Text>
                    <div style={{ marginTop: 4 }}>
                      <Text>{selectedRule.schedule?.cron || '无'}</Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            <Card title="执行统计" size="small">
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="执行次数"
                    value={selectedRule.executionCount || 0}
                    prefix={<PlayCircleOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="最后执行"
                    value={selectedRule.lastExecuted ? dayjs(selectedRule.lastExecuted).format('MM-DD HH:mm') : '从未执行'}
                    prefix={<ClockCircleOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="成功率"
                    value={selectedRule.successRate || 0}
                    precision={1}
                    suffix="%"
                    prefix={<CheckCircleOutlined />}
                  />
                </Col>
              </Row>
              {selectedRule.executionCount > 0 && (
                <div style={{ marginTop: 16 }}>
                  <Text strong>执行趋势：</Text>
                  <Progress
                    percent={selectedRule.successRate || 0}
                    status={selectedRule.successRate >= 80 ? 'success' : selectedRule.successRate >= 60 ? 'active' : 'exception'}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
                </div>
              )}
            </Card>
          </div>
        )}
      </Modal>
    </Modal>
  );
};

export default RuleManagementModal;