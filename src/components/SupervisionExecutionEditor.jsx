import React from 'react';
import { Card, Form, Input, Button, Space, Typography, Tabs, Select, Upload } from 'antd';

const { TextArea } = Input;
const { Text } = Typography;

// 执行编辑器：将计划中的 checklist 变成执行项，允许记录问题与整改跟踪
const SupervisionExecutionEditor = ({ execution, onSave, onCancel }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (execution) {
      form.setFieldsValue({
        title: execution.title,
        description: execution.description || '',
        items: (execution.items || []).map(row => ({
          category: row.category || '',
          item: row.item || '',
          standard: row.standard || '',
          issue: row.issue || '',
          action: row.action || '',
          owner: row.owner || '',
          progress: row.progress || '未开始',
          tracking: row.tracking || ''
        }))
      });
    }
  }, [execution, form]);

  const handleSave = () => {
    const values = form.getFieldsValue();
    const next = {
      ...execution,
      title: values.title,
      description: values.description,
      status: execution.status,
      items: (values.items || []).map(it => ({
        category: it.category,
        item: it.item,
        standard: it.standard,
        issue: it.issue,
        action: it.action,
        owner: it.owner,
        progress: it.progress,
        tracking: it.tracking,
        attachments: it.attachments || []
      }))
    };
    onSave && onSave(next);
  };

  return (
    <Card title={execution?.title || '督导执行'} extra={(
      <Space>
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" onClick={handleSave}>保存</Button>
      </Space>
    )}>
      <Form form={form} layout="vertical">
        <Tabs items={[
          {
            key: 'overview',
            label: '概览',
            children: (
              <>
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary">执行标题</Text>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{execution?.title || ''}</div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary">描述</Text>
                  <div style={{ color: '#374151' }}>{execution?.description || '按检查项推进并记录问题与整改跟踪'}</div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary">督导对象</Text>
                  <div style={{ color: '#374151' }}>
                    {(Array.isArray(execution?.targets) && execution.targets.length > 0)
                      ? execution.targets.join('、')
                      : '示例：第一小学、第二中学'}
                  </div>
                </div>
              </>
            )
          },
          {
            key: 'items',
            label: '执行项',
            children: (
              <>
                <div style={{ marginBottom: 12, color: '#6b7280' }}>逐项记录问题与整改跟踪（来源：任务检查清单）</div>
                <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1.2fr 1.2fr 1fr 1.2fr 1fr', gap: 0, background: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
                    <div style={{ padding: 8, fontWeight: 600 }}>检查类目</div>
                    <div style={{ padding: 8, fontWeight: 600 }}>检查项目</div>
                    <div style={{ padding: 8, fontWeight: 600 }}>参考标准</div>
                    <div style={{ padding: 8, fontWeight: 600 }}>检查人</div>
                    <div style={{ padding: 8, fontWeight: 600 }}>问题描述</div>
                    <div style={{ padding: 8, fontWeight: 600 }}>整改措施</div>
                    <div style={{ padding: 8, fontWeight: 600 }}>责任人</div>
                    <div style={{ padding: 8, fontWeight: 600 }}>进度/跟踪</div>
                    <div style={{ padding: 8, fontWeight: 600 }}>附件</div>
                  </div>
                  <Form.List name="items">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(field => (
                          <div key={field.key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1.2fr 1.2fr 1fr 1.2fr 1fr', gap: 0, borderBottom: '1px solid #f0f0f0' }}>
                            <div style={{ padding: 8, display: 'flex', alignItems: 'center' }}>
                              <Text>{form.getFieldValue(['items', field.name, 'category']) || ''}</Text>
                            </div>
                            <div style={{ padding: 8, display: 'flex', alignItems: 'center' }}>
                              <Text>{form.getFieldValue(['items', field.name, 'item']) || ''}</Text>
                            </div>
                            <div style={{ padding: 8, display: 'flex', alignItems: 'center' }}>
                              <Text>{form.getFieldValue(['items', field.name, 'standard']) || ''}</Text>
                            </div>
                            <div style={{ padding: 8, display: 'flex', alignItems: 'center' }}>
                              <Text>
                                {(() => {
                                  const principal = execution?.principal || '';
                                  const collaborators = Array.isArray(execution?.collaborators) ? execution.collaborators : [];
                                  const experts = Array.isArray(execution?.experts) ? execution.experts : [];
                                  const names = [];
                                  if (principal) names.push(`主督学：${principal}`);
                                  collaborators.forEach(c => c && names.push(`协同：${c}`));
                                  experts.forEach(e => e && names.push(`专家：${e}`));
                                  return names.length > 0 ? names.join('，') : '示例：主督学、协同督学、专家';
                                })()}
                              </Text>
                            </div>
                            <div style={{ padding: 8 }}><Form.Item name={[field.name, 'issue']} style={{ margin: 0 }}><TextArea rows={3} placeholder="问题描述" /></Form.Item></div>
                            <div style={{ padding: 8 }}><Form.Item name={[field.name, 'action']} style={{ margin: 0 }}><TextArea rows={3} placeholder="整改措施" /></Form.Item></div>
                            <div style={{ padding: 8 }}><Form.Item name={[field.name, 'owner']} style={{ margin: 0 }}><Input placeholder="责任人" /></Form.Item></div>
                            <div style={{ padding: 8 }}>
                              <Form.Item name={[field.name, 'progress']} style={{ margin: 0 }}>
                                <Select options={[{value:'未开始',label:'未开始'},{value:'进行中',label:'进行中'},{value:'已完成',label:'已完成'}]} />
                              </Form.Item>
                              <Form.Item name={[field.name, 'tracking']} style={{ marginTop: 8 }}>
                                <TextArea rows={2} placeholder="跟踪记录（时间点/备注）" />
                              </Form.Item>
                            </div>
                            <div style={{ padding: 8 }}>
                              <Form.Item name={[field.name, 'attachments']} valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList} style={{ margin: 0 }}>
                                <Upload beforeUpload={() => false} maxCount={5} listType="text">
                                  <Button type="dashed">上传附件</Button>
                                </Upload>
                              </Form.Item>
                            </div>
                          </div>
                        ))}
                        {/* 去掉新增行操作 */}
                      </>
                    )}
                  </Form.List>
                </div>
              </>
            )
          }
        ]} />
      </Form>
    </Card>
  );
};

export default SupervisionExecutionEditor;