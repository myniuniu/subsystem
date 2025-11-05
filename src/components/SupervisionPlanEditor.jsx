import React from 'react';
import { Card, Form, Input, Button, Space, Typography, Tabs, Radio, DatePicker, TimePicker, Select, AutoComplete, Tag } from 'antd';
import supervisionDictionary from '../services/supervisionDictionary';

const { TextArea } = Input;
const { Text } = Typography;

// 督导计划编辑器（页签：基础信息/任务），右侧内嵌显示
const SupervisionPlanEditor = ({ plan, onSave, onCancel, onPublish, specialTemplates = [] }) => {
  const [form] = Form.useForm();

  const [dict, setDict] = React.useState(() => supervisionDictionary.getDict());
  const initializedRef = React.useRef(false);

  React.useEffect(() => {
    if (plan) {
      form.setFieldsValue({
        title: plan.title,
        description: plan.description,
        type: plan.type || 'regular',
        associatedTemplateId: plan.associatedTemplateId || undefined,
        targets: plan.targets || [],
        approach: plan.approach || 'onsite',
        onsiteDateRange: plan.onsiteDateRange || null,
        onlineMethod: plan.onlineMethod || undefined,
        onlineLink: plan.onlineLink || '',
        principal: plan.principal || '',
        collaborators: plan.collaborators || [],
        experts: plan.experts || [],
        checklist: plan.checklist || []
      });

      // 合并模板检查项与AI追加项（模板项不标记AI；列表为空时填充；若已有则补齐缺失模板项并追加AI项）
      const assocId = plan.associatedTemplateId || form.getFieldValue('associatedTemplateId');
      if (plan.type === 'special' && assocId) {
        const tpl = (specialTemplates || []).find(t => t.id === assocId);
        if (tpl && Array.isArray(tpl.checklist)) {
          const base = tpl.checklist.map(row => ({
            category: row.category || '',
            item: row.item || '',
            standard: row.standard || '',
            method: Array.isArray(row.method) ? row.method : (row.method ? [row.method] : []),
            notes: row.notes || ''
          }));
          const current = form.getFieldValue('checklist') || [];
          const currentItems = new Set(current.map(x => String(x.item || '')));
          // 先确保模板项存在
          let merged = [...current];
          base.forEach(x => { if (!currentItems.has(String(x.item || ''))) merged.push(x); });
          const existingItems = new Set(merged.map(x => String(x.item || '')));
          const aiExtras = [
            { category: '校园卫生安全', item: '食堂卫生', standard: '食堂环境清洁、餐具消毒、从业人员健康证明齐全。', method: ['实地查看', '查看相关记录'], notes: '抽查消毒记录与从业健康证；检查储物间卫生与食材存放规范。', ai: true },
            { category: '应急演练与培训', item: '安全演练', standard: '每学期至少组织一次应急演练并留存记录材料。', method: ['查阅相关材料', '走访教职工'], notes: '查看演练方案与总结；询问教师演练参与与反馈。', ai: true },
            { category: '信息安全与设备', item: '网络安全与设备巡检', standard: '校园网络安全策略到位；关键设备巡检记录完整。', method: ['查看相关记录'], notes: '抽查网络安全策略与巡检记录；检查设备标签与保养记录。', ai: true }
          ].filter(x => !existingItems.has(String(x.item)));
          const finalList = [...merged, ...aiExtras];
          // 仅在当前为空或未包含模板项时才写入，避免重复覆盖用户编辑
          if (current.length === 0 || base.some(b => !currentItems.has(String(b.item || '')))) {
            form.setFieldsValue({ checklist: finalList });
          }
          initializedRef.current = true;
        }
      }
    }
  }, [plan, form, specialTemplates]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const next = { ...plan, ...values };
      onSave && onSave(next);
    });
  };
  const handlePublish = () => {
    const values = form.getFieldsValue();
    const next = { ...plan, ...values };
    onPublish && onPublish(next);
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

  // 当选择专项督导且选择了专项模板时，加载对应模板的检查清单
  const onValuesChange = (changed, all) => {
    if ((changed.associatedTemplateId || changed.type) && (all.type === 'special') && all.associatedTemplateId) {
      const tpl = (specialTemplates || []).find(t => t.id === all.associatedTemplateId);
      if (tpl && Array.isArray(tpl.checklist)) {
        const base = tpl.checklist.map(row => ({
          category: row.category || '',
          item: row.item || '',
          standard: row.standard || '',
          method: Array.isArray(row.method) ? row.method : (row.method ? [row.method] : []),
          notes: row.notes || ''
        }));
        const existingItems = new Set(base.map(x => String(x.item || '')));
        // 追加AI生成的检查项（模板项不标记AI，新增项标记AI）
        const aiExtras = [
          { category: '校园卫生安全', item: '食堂卫生', standard: '食堂环境清洁、餐具消毒、从业人员健康证明齐全。', method: ['实地查看', '查看相关记录'], notes: '抽查消毒记录与从业健康证；检查储物间卫生与食材存放规范。', ai: true },
          { category: '应急演练与培训', item: '安全演练', standard: '每学期至少组织一次应急演练并留存记录材料。', method: ['查阅相关材料', '走访教职工'], notes: '查看演练方案与总结；询问教师演练参与与反馈。', ai: true },
          { category: '信息安全与设备', item: '网络安全与设备巡检', standard: '校园网络安全策略到位；关键设备巡检记录完整。', method: ['查看相关记录'], notes: '抽查网络安全策略与巡检记录；检查设备标签与保养记录。', ai: true }
        ].filter(x => !existingItems.has(String(x.item)));
        form.setFieldsValue({ checklist: [...base, ...aiExtras] });
      }
    }
  };

  return (
    <Card
      title={(
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ fontWeight: 600 }}>{plan?.title || '督导计划'}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={handlePublish}>发布</Button>
            <Button type="primary" onClick={handleSubmit}>保存</Button>
            <Button onClick={onCancel}>取消</Button>
          </div>
        </div>
      )}
      bordered
    >
      <Form layout="vertical" form={form} onValuesChange={onValuesChange}>
        <Tabs defaultActiveKey="base" items={[
          {
            key: 'base',
            label: '基础信息',
            children: (
              <>
                <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
                  <Input placeholder="请输入督导计划标题" />
                </Form.Item>
                <Form.Item label="计划简介" name="description">
                  <TextArea rows={3} placeholder="简单描述该督导计划的目标与范围" />
                </Form.Item>

                <Form.Item label="选择督导类型" name="type" rules={[{ required: true }]}> 
                  <Radio.Group>
                    <Radio value="regular">常规督导</Radio>
                    <Radio value="special">专项督导</Radio>
                    <Radio value="review">复查督导</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item shouldUpdate noStyle>
                  {() => form.getFieldValue('type') === 'special' ? (
                    <Form.Item label="关联专项模板" name="associatedTemplateId" rules={[{ required: true, message: '请选择专项模板' }]}>
                      <Select placeholder="选择专项模板" options={specialTemplates.map(t => ({ value: t.id, label: t.title }))} />
                    </Form.Item>
                  ) : null}
                </Form.Item>

                <Form.Item label="选择督导对象（学校）" name="targets">
                  <Select 
                    mode="multiple"
                    placeholder="选择或输入学校"
                    options={[
                      { value: 'A校' }, { value: 'B校' }, { value: 'C校' }, { value: 'D校' }
                    ]}
                    allowClear
                  />
                </Form.Item>
                {/* 批量导入上传区域已移除 */}

                <Form.Item label="选择督导方式" name="approach" rules={[{ required: true }]}> 
                  <Radio.Group>
                    <Radio value="onsite">现场督导</Radio>
                    <Radio value="online">线上督导</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item shouldUpdate noStyle>
                  {() => form.getFieldValue('approach') === 'onsite' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                      <Form.Item label="预计督导时间段" name="onsiteDateRange" rules={[{ required: true, message: '请选择时间段' }]}> 
                        <DatePicker.RangePicker showTime={{ format: 'HH:mm' }} style={{ width: '100%' }} />
                      </Form.Item>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <Form.Item label="线上方式" name="onlineMethod" rules={[{ required: true, message: '请选择线上方式' }]}>
                        <Select options={[{ value: 'video', label: '视频会议' }, { value: 'doc', label: '文档审核' }]} />
                      </Form.Item>
                      <Form.Item label="会议链接 / 文档地址" name="onlineLink" rules={[{ required: true, message: '请填写链接' }]}> 
                        <Input placeholder="填写会议链接或文档提交地址" />
                      </Form.Item>
                    </div>
                  )}
                </Form.Item>

                {/* 参与人员分配（基础信息：下拉选择模拟数据） */}
                <Form.Item label="主督学（1名）" name="principal">
                  <Select placeholder="选择主督学" allowClear options={[{ value: '李明', label: '李明' }, { value: '王伟', label: '王伟' }, { value: '赵强', label: '赵强' }]} />
                </Form.Item>
                <Form.Item label="协同督学（多名）" name="collaborators">
                  <Select mode="multiple" placeholder="选择协同督学" allowClear options={[{ value: '张华', label: '张华' }, { value: '陈芳', label: '陈芳' }, { value: '刘健', label: '刘健' }, { value: '孙丽', label: '孙丽' }]} />
                </Form.Item>
                <Form.Item label="专家（多名）" name="experts">
                  <Select mode="multiple" placeholder="选择专家" allowClear options={[{ value: '周安', label: '周安' }, { value: '郑鹏', label: '郑鹏' }, { value: '胡宁', label: '胡宁' }, { value: '钱坤', label: '钱坤' }]} />
                </Form.Item>
              </>
            )
          },
          {
            key: 'tasks',
            label: '任务',
            children: (
              <>
                <div style={{ marginBottom: 12, color: '#6b7280' }}>可动态添加/删除行（同专项模板）</div>
                <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.4fr 1.2fr 1.2fr 1.2fr 1.4fr 80px', gap: 0, background: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
                    <div style={{ padding: 8, fontWeight: 600 }}>检查类目</div>
                    <div style={{ padding: 8, fontWeight: 600 }}>检查项目</div>
                    <div style={{ padding: 8, fontWeight: 600 }}>参考标准</div>
                    <div style={{ padding: 8, fontWeight: 600 }}>记录要点</div>
                    <div style={{ padding: 8, fontWeight: 600 }}>督查方式</div>
                    <div style={{ padding: 8, fontWeight: 600 }}>检查人</div>
                    <div style={{ padding: 8, fontWeight: 600 }}>材料上传要求</div>
                    <div style={{ padding: 8 }} />
                  </div>
                  <Form.List name="checklist">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(field => (
                          <React.Fragment key={field.key}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.4fr 1.2fr 1.2fr 1.2fr 1.4fr 80px', gap: 0, borderBottom: '1px solid #f0f0f0' }}>
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
                                    const isAI = !!form.getFieldValue(['checklist', field.name, 'ai']);
                                    return (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <AutoComplete
                                          options={itemOptions}
                                          placeholder="如：消防设施"
                                          onBlur={(e) => handleItemBlur(currentCategory, e.target.value)}
                                          filterOption={(inputValue, option) => option?.value?.toLowerCase?.().includes(inputValue.toLowerCase())}
                                        />
                                        {isAI && <Tag color="blue">AI</Tag>}
                                      </div>
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
                              <div style={{ padding: 8 }}>
                                <Form.Item name={[field.name, 'method']} style={{ margin: 0 }}>
                                  <Select
                                    mode="multiple"
                                    placeholder="选择或输入督查方式"
                                    options={[
                                      { value: '实地查看', label: '实地查看' },
                                      { value: '查阅相关材料', label: '查阅相关材料' },
                                      { value: '查看相关记录', label: '查看相关记录' },
                                      { value: '走访教职工', label: '走访教职工' },
                                      { value: '查阅相关会议材料', label: '查阅相关会议材料' }
                                    ]}
                                    allowClear
                                  />
                                </Form.Item>
                              </div>
                              <div style={{ padding: 8 }}>
                                <Form.Item name={[field.name, 'checkers']} style={{ margin: 0 }}>
                                  {(() => {
                                    const principal = form.getFieldValue('principal');
                                    const collaborators = form.getFieldValue('collaborators') || [];
                                    const experts = form.getFieldValue('experts') || [];
                                    const options = [];
                                    if (principal) options.push({ value: principal, label: `主督学：${principal}` });
                                    collaborators.forEach(c => { if (c) options.push({ value: c, label: `协同督学：${c}` }); });
                                    experts.forEach(e => { if (e) options.push({ value: e, label: `专家：${e}` }); });
                                    return <Select mode="multiple" options={options} placeholder="选择检查人" />;
                                  })()}
                                </Form.Item>
                              </div>
                              <div style={{ padding: 8 }}>
                                <Form.Item name={[field.name, 'materialsText']} style={{ margin: 0 }}>
                                  <TextArea rows={4} placeholder="如：教学计划、安全台账；请填写需提交材料及截止要求" />
                                </Form.Item>
                              </div>
                              <div style={{ padding: 8, display: 'flex', alignItems: 'center' }}>
                                <Button danger type="text" onClick={() => remove(field.name)}>删除</Button>
                              </div>
                            </div>
                          </React.Fragment>
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

export default SupervisionPlanEditor;