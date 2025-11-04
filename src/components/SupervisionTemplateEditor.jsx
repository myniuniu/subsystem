import React from 'react';
import { Card, Form, Input, Button, Space, Typography, Divider, Tabs, AutoComplete } from 'antd';
import supervisionDictionary from '../services/supervisionDictionary';

const { Title, Text } = Typography;
const { TextArea } = Input;

// 督学模板编辑器（右侧内嵌显示，不弹窗）
const SupervisionTemplateEditor = ({ item, onSave, onCancel }) => {
  const [form] = Form.useForm();
  const [dict, setDict] = React.useState(() => supervisionDictionary.getDict());

  React.useEffect(() => {
    if (item) {
      form.setFieldsValue({
        title: item.title,
        categoryLabel: item.categoryLabel,
        content: item.content,
        tags: (item.tags || []).join(', '),
        coreInfo: {
          period: item.coreInfo?.period || '',
          target: item.coreInfo?.target || '',
          objective: item.coreInfo?.objective || ''
        },
        checklist: (item.checklist || []).map(row => ({
          category: row.category || '',
          item: row.item || '',
          standard: row.standard || '',
          notes: row.notes || ''
        }))
      });
    }
  }, [item, form]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const next = {
        ...item
      };
      // 结构化字段
      next.coreInfo = {
        period: values?.coreInfo?.period || '',
        target: values?.coreInfo?.target || '',
        objective: values?.coreInfo?.objective || ''
      };
      next.checklist = Array.isArray(values.checklist) ? values.checklist.map(r => ({
        category: r.category || '',
        item: r.item || '',
        standard: r.standard || '',
        notes: r.notes || ''
      })) : [];
      onSave && onSave(next);
    });
  };

  const refreshDict = () => setDict(supervisionDictionary.getDict());
  const handleCategoryBlur = (val) => {
    supervisionDictionary.ensureCategory(val);
    refreshDict();
  };
  const handleItemBlur = (category, val) => {
    supervisionDictionary.addItem(category, val);
    refreshDict();
  };

  return (
    <Card
      title={(
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ fontWeight: 600 }}>{item?.title || '编辑模板'}</div>
          <div className="editor-toolbar" style={{ display: 'flex', gap: 8 }}>
            <Button type="primary" onClick={handleSubmit}>保存</Button>
            <Button onClick={onCancel}>取消</Button>
          </div>
        </div>
      )}
      bordered
    >
      <Form layout="vertical" form={form}>
        <Tabs defaultActiveKey="core" items={[
          {
            key: 'core',
            label: '基本信息',
            children: (
              <>
                <Form.Item label="适用周期" name={["coreInfo","period"]}>
                  <Input placeholder="例如：开学前1周 - 开学后2周" />
                </Form.Item>
                <Form.Item label="督导对象" name={["coreInfo","target"]}>
                  <Input placeholder="例如：辖区内所有中小学、幼儿园" />
                </Form.Item>
                <Form.Item label="核心目标" name={["coreInfo","objective"]}>
                  <TextArea rows={3} placeholder="例如：排查校园安全隐患，保障师生安全、教学秩序稳定" />
                </Form.Item>
              </>
            )
          },
          {
            key: 'checklist',
            label: '检查清单',
            children: (
              <>
                <div style={{ marginBottom: 12, color: '#6b7280' }}>可动态添加/删除行</div>
                <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.4fr 1.4fr 80px', gap: 0, background: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
                    <div style={{ padding: 8, fontWeight: 600 }}>必查大类</div>
                    <div style={{ padding: 8, fontWeight: 600 }}>具体子项</div>
                    <div style={{ padding: 8, fontWeight: 600 }}>参考标准</div>
                    <div style={{ padding: 8, fontWeight: 600 }}>记录要点</div>
                    <div style={{ padding: 8 }} />
                  </div>
                  <Form.List name="checklist">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(field => (
                          <div key={field.key} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.4fr 1.4fr 80px', gap: 0, borderBottom: '1px solid #f0f0f0' }}>
                            <div style={{ padding: 8 }}>
                              <Form.Item name={[field.name, 'category']} style={{ margin: 0 }}>
                                <AutoComplete
                                  options={(dict.categories || []).map(c => ({ value: c }))}
                                  placeholder="如：校园设施安全"
                                  onBlur={(e) => handleCategoryBlur(e.target.value)}
                                  filterOption={(inputValue, option) => option?.value?.toLowerCase?.().includes(inputValue.toLowerCase())}
                                />
                              </Form.Item>
                            </div>
                            <div style={{ padding: 8 }}>
                              <Form.Item name={[field.name, 'item']} style={{ margin: 0 }}>
                                {(() => {
                                  const currentCategory = form.getFieldValue(['checklist', field.name, 'category']);
                                  const itemOptions = supervisionDictionary.getItems(currentCategory).map(i => ({ value: i }));
                                  return (
                                    <AutoComplete
                                      options={itemOptions}
                                      placeholder="如：消防设施"
                                      onBlur={(e) => handleItemBlur(currentCategory, e.target.value)}
                                      filterOption={(inputValue, option) => option?.value?.toLowerCase?.().includes(inputValue.toLowerCase())}
                                    />
                                  );
                                })()}
                              </Form.Item>
                            </div>
                            <div style={{ padding: 8 }}>
                              <Form.Item name={[field.name, 'standard']} style={{ margin: 0 }}>
                                <TextArea rows={4} placeholder="参考标准" />
                              </Form.Item>
                            </div>
                            <div style={{ padding: 8 }}>
                              <Form.Item name={[field.name, 'notes']} style={{ margin: 0 }}>
                                <TextArea rows={4} placeholder="记录要点" />
                              </Form.Item>
                            </div>
                            <div style={{ padding: 8, display: 'flex', alignItems: 'center' }}>
                              <Button danger type="text" onClick={() => remove(field.name)}>删除</Button>
                            </div>
                          </div>
                        ))}
                        <div style={{ padding: 8 }}>
                          <Button type="dashed" onClick={() => add({ category: '', item: '', standard: '', notes: '' })} block>
                            + 新增一行
                          </Button>
                        </div>
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

export default SupervisionTemplateEditor;