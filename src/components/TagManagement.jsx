import React, { useEffect, useMemo, useState } from 'react';
import {
  Layout,
  Typography,
  Input,
  Button,
  Card,
  Space,
  Tag as AntTag,
  Modal,
  Form,
  Select,
  Switch,
  Slider,
  InputNumber,
  Tree,
  Table,
  Popconfirm,
  message,
  Divider,
  Statistic,
  Row,
  Col,
  Tooltip,
  Dropdown,
  Menu,
  Tabs,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  NodeIndexOutlined,
  TagOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
  StopOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import tagsService from '../services/tagsService';
import './TagManagement.css';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

// 标签创建/编辑弹窗
const TagEditModal = ({ open, onCancel, onOk, initial }) => {
  const [form] = Form.useForm();
  const [nameUnique, setNameUnique] = useState(true);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        name: initial?.name || '',
        aliases: (initial?.aliases || []).join(','),
        parentId: initial?.parentId ?? null,
        enabled: initial?.enabled ?? true,
        weight: initial?.weight ?? 0,
      });
      setNameUnique(true);
    }
  }, [open, initial, form]);

  const handleNameChange = async (e) => {
    const v = e.target.value;
    const ok = tagsService.validateNameUnique(v || '', initial?.id || null);
    setNameUnique(ok);
    if (!ok) {
      form.setFields([{
        name: 'name',
        errors: ['该标签已存在']
      }]);
    }
  };

  const allTags = tagsService.getAll();
  const parentOptions = useMemo(() => [{ id: null, name: '无父标签（顶级）' }, ...allTags], [allTags]);

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!values.name || !nameUnique) {
        setIsSubmitting(false);
        return;
      }
      onOk({
        name: values.name,
        aliases: values.aliases || '',
        parentId: values.parentId || null,
        enabled: !!values.enabled,
        weight: Number(values.weight) || 0,
      });
    } catch (e) {
      // no-op
    }
  };

  const currentParentPath = useMemo(() => {
    if (!form.getFieldValue('parentId')) return '顶级';
    const p = tagsService.findById(form.getFieldValue('parentId'));
    const pathNames = [];
    const walkUp = (t) => {
      if (!t) return;
      pathNames.unshift(t.name);
      if (t.parentId) walkUp(tagsService.findById(t.parentId));
    };
    walkUp(p);
    return pathNames.join(' > ');
  }, [form]);

  return (
    <Modal open={open} title={initial ? '编辑标签' : '新建标签'} onCancel={onCancel} onOk={onSubmit} okText="确定" cancelText="取消">
      <Form layout="vertical" form={form}>
        <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入标签名称' }]}>
          <Input placeholder="请输入标签名称" onChange={handleNameChange} />
        </Form.Item>
        {!nameUnique && (
          <Text type="danger">该标签已存在</Text>
        )}
        <Form.Item name="aliases" label="别名" extra="用逗号分隔，如 JS,javascript；自动去重">
          <Input placeholder="JS,javascript" />
        </Form.Item>
        <Form.Item name="parentId" label="父标签">
          <Select showSearch allowClear placeholder="无父标签（顶级）">
            {parentOptions.map(opt => (
              <Option key={String(opt.id)} value={opt.id}>{opt.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <div className="tag-parent-path">层级路径：{currentParentPath}</div>
        <Form.Item name="enabled" label="状态" valuePropName="checked" initialValue>
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
        <Text type="secondary">禁用后该标签不可被普通用户使用，但历史关联关系保留</Text>
        <Form.Item label="权重">
          <Space>
            <Form.Item name="weight" noStyle>
              <Slider min={0} max={100} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item name="weight" noStyle>
              <InputNumber min={0} max={100} />
            </Form.Item>
          </Space>
          <div className="form-extra">权重越高，在列表中排序越靠前</div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// 管理员视角：详情中的同义词/互斥配置
const RelationChips = ({ tag, onAddSynonym, onRemoveSynonym, onToggleMutex }) => {
  const [synonymInput, setSynonymInput] = useState(undefined);
  const [mutexInput, setMutexInput] = useState(undefined);
  const allTags = tagsService.getAll().filter(t => t.id !== tag.id);

  const handleAddSynonym = () => {
    if (!synonymInput) return;
    try {
      onAddSynonym(tag.id, synonymInput);
      setSynonymInput(undefined);
    } catch (e) { message.error(e.message); }
  };

  const handleToggleMutex = () => {
    if (!mutexInput) return;
    try {
      const isOn = !(tag.mutex || []).includes(mutexInput);
      onToggleMutex(tag.id, mutexInput, isOn);
      setMutexInput(undefined);
    } catch (e) { message.error(e.message); }
  };

  return (
    <div className="relation-area">
      <Title level={5}>同义词管理</Title>
      <Space wrap>
        {(tag.synonyms || []).map(id => {
          const t = tagsService.findById(id);
          if (!t) return null;
          return (
            <AntTag key={id} closable onClose={() => onRemoveSynonym(tag.id, id)}>{t.name}</AntTag>
          );
        })}
      </Space>
      <Space style={{ marginTop: 8 }}>
        <Select showSearch placeholder="选择同义词" style={{ width: 240 }} value={synonymInput} onChange={setSynonymInput}>
          {allTags.map(t => (
            <Option key={t.id} value={t.id}>{t.name}</Option>
          ))}
        </Select>
        <Button type="primary" size="small" onClick={handleAddSynonym}>+ 添加同义词</Button>
      </Space>

      <Divider />
      <Title level={5}>互斥标签管理</Title>
      <Space wrap>
        {(tag.mutex || []).map(id => {
          const t = tagsService.findById(id);
          if (!t) return null;
          return (
            <AntTag key={id} color="red" closable onClose={() => onToggleMutex(tag.id, id, false)}>{t.name}</AntTag>
          );
        })}
      </Space>
      <Space style={{ marginTop: 8 }}>
        <Select showSearch placeholder="选择互斥标签" style={{ width: 240 }} value={mutexInput} onChange={setMutexInput}>
          {allTags.map(t => (
            <Option key={t.id} value={t.id}>{t.name}</Option>
          ))}
        </Select>
        <Button type="primary" danger size="small" onClick={handleToggleMutex}>设置/取消互斥</Button>
      </Space>
      <Text type="secondary">互斥标签：同一实体不可同时关联的标签（如“线上教学”与“线下教学”）</Text>
    </div>
  );
};

// 普通用户视角：标签添加组件
const TagAddInput = ({ selected = [], onChange, history = [], entityText = '' }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const s = tagsService.search(input).slice(0, 8);
    const recommend = tagsService.suggestTagsForEntity(entityText, history);
    setSuggestions([...s, ...recommend.filter(r => !s.find(x => x.id === r.id))].slice(0, 8));
  }, [input, history, entityText]);

  const toggleSelect = (t) => {
    // 检查互斥
    const conflict = selected.some(s => (s.mutex || []).includes(t.id) || (t.mutex || []).includes(s.id));
    if (conflict) {
      message.warning('存在互斥标签，无法同时选择');
      return;
    }
    const ids = selected.map(s => s.id);
    const next = ids.includes(t.id)
      ? selected.filter(s => s.id !== t.id)
      : [...selected, t];
    onChange(next);
  };

  const remove = (id) => onChange(selected.filter(s => s.id !== id));

  return (
    <div className="tag-add-input">
      <Input placeholder="输入以搜索标签，如 pbl -> 项目式学习" value={input} onChange={e => setInput(e.target.value)} />
      <div className="selected-chips">
        {selected.map(s => (
          <AntTag key={s.id} closable onClose={() => remove(s.id)}>{s.name}</AntTag>
        ))}
      </div>
      <div className="suggestions">
        <div className="suggestions-title">推荐标签</div>
        <Space wrap>
          {suggestions.map(s => (
            <Button key={s.id} size="small" onClick={() => toggleSelect(s)}>{s.name}</Button>
          ))}
        </Space>
      </div>
    </div>
  );
};

// 标签筛选界面（标签云 + 层级筛选器）
const TagCloudFilter = ({ onSelect }) => {
  const all = tagsService.getAll();
  const maxCount = Math.max(...all.map(t => t.entityCount || 0), 1);
  const tree = tagsService.getTree();
  const [currentPath, setCurrentPath] = useState('全部');

  const fontSizeFor = (count) => 12 + Math.round((count / maxCount) * 12);

  const [selectedIds, setSelectedIds] = useState([]);
  const toggle = (id) => {
    const next = selectedIds.includes(id) ? selectedIds.filter(x => x !== id) : [...selectedIds, id];
    setSelectedIds(next);
    onSelect(next);
  };

  const [expandedKeys, setExpandedKeys] = useState([]);

  const renderTreeTitles = (nodes) => nodes.map(n => ({
    key: n.id,
    title: (
      <span>
        {n.name} <Text type="secondary">（{n.entityCount}）</Text>
      </span>
    ),
    children: renderTreeTitles(n.children || [])
  }));

  return (
    <div className="tag-cloud-filter">
      <div className="cloud">
        {all.map(t => (
          <span
            key={t.id}
            className={`cloud-tag ${selectedIds.includes(t.id) ? 'active' : ''}`}
            style={{ fontSize: fontSizeFor(t.entityCount), color: selectedIds.includes(t.id) ? '#1677ff' : undefined }}
            onClick={() => toggle(t.id)}
          >
            {t.name}
          </span>
        ))}
      </div>
      <Divider />
      <div className="hierarchy-filter">
        <Space>
          <NodeIndexOutlined />
          <Text>层级筛选器：</Text>
          <Text strong>{currentPath}</Text>
        </Space>
        <Tree
          treeData={renderTreeTitles(tree)}
          expandedKeys={expandedKeys}
          onExpand={setExpandedKeys}
          onSelect={(keys) => {
            const id = keys[0];
            const t = tagsService.findById(id);
            if (!t) return;
            const path = [];
            let cur = t;
            while (cur) {
              path.unshift(cur.name);
              cur = cur.parentId ? tagsService.findById(cur.parentId) : null;
            }
            setCurrentPath(path.join(' > '));
            toggle(id);
          }}
        />
      </div>
    </div>
  );
};

// 统计看板
const TagStats = () => {
  const stats = tagsService.getStats();
  return (
    <Card title={(<Space><BarChartOutlined /> <span>标签统计看板</span></Space>)}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}><Statistic title="总标签数" value={stats.total} /></Col>
        <Col xs={24} sm={12} md={6}><Statistic title="启用标签数" value={stats.enabled} /></Col>
        <Col xs={24} sm={12} md={6}><Statistic title="今日新增标签" value={stats.todayNew} /></Col>
        <Col xs={24} sm={12} md={6}><Statistic title="关联实体总数" value={stats.entityTotal} /></Col>
      </Row>
      <Divider />
      <Title level={5}>热门标签 TOP10</Title>
      <Table
        size="small"
        pagination={false}
        dataSource={stats.top10.map((t, i) => ({ key: t.id, rank: i + 1, name: t.name, count: t.entityCount }))}
        columns={[
          { title: '排名', dataIndex: 'rank', width: 80 },
          { title: '标签', dataIndex: 'name' },
          { title: '关联实体数', dataIndex: 'count', width: 140 },
        ]}
      />
      <Divider />
      <Title level={5}>层级分布</Title>
      <Space wrap>
        {Object.entries(stats.levelCounts).map(([level, count]) => (
          <Card key={level} size="small"><Space>层级{level}</Space> <Text>数量：{count}</Text></Card>
        ))}
      </Space>
    </Card>
  );
};

// 左侧树形导航项渲染（名称加粗、状态颜色、关联实体数）
const renderTreeData = (nodes, keyword, getContextMenu, onMenuClick) => nodes.map(n => {
  const name = n.name;
  const matchIdx = keyword ? name.toLowerCase().indexOf(keyword.toLowerCase()) : -1;
  const before = matchIdx >= 0 ? name.slice(0, matchIdx) : name;
  const match = matchIdx >= 0 ? name.slice(matchIdx, matchIdx + keyword.length) : '';
  const after = matchIdx >= 0 ? name.slice(matchIdx + keyword.length) : '';
  const statusColor = n.enabled ? 'green' : 'gray';
  const title = (
    <Dropdown overlay={getContextMenu(n)} trigger={['contextMenu']}>
      <span className="tree-node-title">
        <b>{before}{match && <span className="highlight">{match}</span>}{after}</b>
        <AntTag color={statusColor} style={{ marginLeft: 8 }}>{n.enabled ? '启用' : '禁用'}</AntTag>
        <Text type="secondary" style={{ marginLeft: 8 }}>（{n.entityCount}）</Text>
        <Button type="text" icon={<MoreOutlined />} className="more-btn" onClick={(e) => e.stopPropagation()} />
      </span>
    </Dropdown>
  );
  return {
    key: n.id,
    title,
    children: renderTreeData(n.children || [], keyword, getContextMenu, onMenuClick)
  };
});

// 主模块组件
const TagManagement = () => {
  const [keyword, setKeyword] = useState('');
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const tree = tagsService.getTree();

  const [rightTag, setRightTag] = useState(null);
  useEffect(() => {
    const id = selectedKeys[0];
    setRightTag(id ? tagsService.findById(id) : null);
  }, [selectedKeys]);

  const handleSearch = (v) => {
    setKeyword(v);
    const results = tagsService.search(v);
    const keys = results.map(r => r.id);
    setExpandedKeys(keys);
    if (keys.length > 0) setSelectedKeys([keys[0]]);
  };

  const handleCreate = (parentId = null) => {
    setEditing(null);
    setCreateOpen(true);
    // HACK: a bit tricky to pass parentId to modal
    setTimeout(() => {
      const form = document.querySelector('.ant-modal-wrap form');
      if (form) {
        const parentIdInput = form.querySelector('[name="parentId"]');
        if (parentIdInput) {
          // This is not a stable way to set form value, but works for now
          // A better way is to use a state management library like redux/zustand
          // or pass a dedicated prop to the modal.
          tagsService.tempParentId = parentId;
        }
      }
    }, 100);
  };

  const handleRename = (tag) => {
    setCreateOpen(false);
    setEditing(tag);
  };

  const handleDelete = (tag) => {
    Modal.confirm({
      title: `确定删除标签"${tag.name}"吗？`,
      content: '删除后，其子标签将一并删除，且相关内容将失去此标签。此操作不可恢复。',
      icon: <ExclamationCircleOutlined />,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        try {
          tagsService.removeMany([tag.id]);
          message.success('删除成功');
          if (selectedKeys.includes(tag.id)) {
            setSelectedKeys([]);
            setRightTag(null);
          }
          if (checkedKeys.includes(tag.id)) {
            setCheckedKeys(checkedKeys.filter(k => k !== tag.id));
          }
        } catch (e) {
          message.error(e.message);
        }
      }
    });
  };

  const onMenuClick = (key, tag) => {
    switch (key) {
      case 'create-child':
        handleCreate(tag.id);
        break;
      case 'rename':
        handleRename(tag);
        break;
      case 'delete':
        handleDelete(tag);
        break;
      default:
        break;
    }
  };

  const getContextMenu = (tag) => (
    <Menu onClick={({ key }) => onMenuClick(key, tag)}>
      <Menu.Item key="create-child" icon={<PlusOutlined />}>新建子标签</Menu.Item>
      <Menu.Item key="rename" icon={<PlusOutlined />}>重命名</Menu.Item>
      {(!tag.children || tag.children.length === 0) && (
        <Menu.Item key="delete" icon={<DeleteOutlined />} danger>删除</Menu.Item>
      )}
    </Menu>
  );

  const treeData = renderTreeData(tree, keyword, getContextMenu, onMenuClick);

  // Tree批量管理：使用勾选项进行批量启用/禁用/删除
  const [checkedKeys, setCheckedKeys] = useState([]);
  const doBatchEnable = () => {
    const ids = (checkedKeys || []).map(k => Number(k));
    tagsService.setEnabledMany(ids, true);
    message.success('已批量启用');
    setCheckedKeys([]);
  };
  const doBatchDisable = () => {
    const ids = (checkedKeys || []).map(k => Number(k));
    tagsService.setEnabledMany(ids, false);
    message.success('已批量禁用');
    setCheckedKeys([]);
  };
  const doBatchDelete = () => {
    const ids = (checkedKeys || []).map(k => Number(k));
    tagsService.removeMany(ids);
    message.success('已批量删除');
    setCheckedKeys([]);
    setSelectedKeys([]);
    setRightTag(null);
  };

  const onCreate = (payload) => {
    try {
      const created = tagsService.create(payload);
      message.success('创建成功');
      setCreateOpen(false);
      setSelectedKeys([created.id]);
    } catch (e) {
      message.error(e.message);
    }
  };

  const onUpdate = (updates) => {
    try {
      const updated = tagsService.update(editing.id, updates);
      message.success('更新成功');
      setEditing(null);
      setSelectedKeys([updated.id]);
      setRightTag(updated);
    } catch (e) { message.error(e.message); }
  };

  const onAddSynonym = (id, synId) => { tagsService.linkSynonym(id, synId); message.success('已添加同义词'); setRightTag(tagsService.findById(id)); };
  const onRemoveSynonym = (id, synId) => { tagsService.unlinkSynonym(id, synId); message.success('已移除同义词'); setRightTag(tagsService.findById(id)); };
  const onToggleMutex = (id, otherId, on) => { tagsService.setMutex(id, otherId, on); message.success(on ? '已设置互斥' : '已取消互斥'); setRightTag(tagsService.findById(id)); };

  // 已移除普通用户视角演示

  return (
    <Layout className="tag-management">
      <Sider width="30%" style={{ flexBasis: '30%', maxWidth: '30%' }} className="tag-sider">
        <div className="sider-top">
          <div className="sider-header">
            <Title level={5} style={{ margin: 0 }}>标签管理</Title>
            <div className="sider-actions">
              <Tooltip title="新建标签">
                <Button icon={<PlusOutlined />} type="text" onClick={handleCreate} />
              </Tooltip>
              <Tooltip title="批量启用">
                <Button icon={<CheckCircleOutlined />} type="text" onClick={doBatchEnable} disabled={checkedKeys.length === 0} />
              </Tooltip>
              <Tooltip title="批量禁用">
                <Button icon={<StopOutlined />} type="text" onClick={doBatchDisable} disabled={checkedKeys.length === 0} />
              </Tooltip>
              <Tooltip title="批量删除">
                <Button icon={<DeleteOutlined />} type="text" onClick={doBatchDelete} disabled={checkedKeys.length === 0} />
              </Tooltip>
            </div>
          </div>
          <Input allowClear placeholder="按名称/别名搜索" prefix={<SearchOutlined />} onChange={(e) => handleSearch(e.target.value)} />
        </div>
        <div className="tree-wrap">
          <Tree
            showLine
            checkable
            treeData={treeData}
            expandedKeys={expandedKeys}
            onExpand={setExpandedKeys}
            selectedKeys={selectedKeys}
            onSelect={keys => setSelectedKeys(keys)}
            checkedKeys={checkedKeys}
            onCheck={(keys) => setCheckedKeys(Array.isArray(keys) ? keys : keys.checked)}
          />
        </div>
        
      </Sider>
      <Content className="tag-content" style={{ flexBasis: '70%', maxWidth: '70%' }}>
        {rightTag ? (
          <Card title={(<Space><TagOutlined /> <span>{rightTag.name}</span></Space>)}>
            <Tabs defaultActiveKey="list">
              <Tabs.TabPane tab="标签列表" key="list">
                <TagChildrenSection
                  parent={rightTag}
                  onCreateChild={(parentId) => handleCreate(parentId)}
                  onRenameChild={(tag) => handleRename(tag)}
                  onDeleteChild={(tag) => handleDelete(tag)}
                  onRefreshParent={(id) => setRightTag(tagsService.findById(id))}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="关联实体" key="entities">
                <TagEntitiesSection tag={rightTag} onTagChanged={(id) => setRightTag(tagsService.findById(id))} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="属性与关系" key="misc">
                <div className="tag-attrs" style={{ marginBottom: 16 }}>
                  <Space wrap>
                    <Text strong>状态：</Text>
                    <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={rightTag.enabled} onChange={(checked) => { tagsService.update(rightTag.id, { enabled: checked }); setRightTag(tagsService.findById(rightTag.id)); }} />
                    <Text strong>权重：</Text>
                    <Slider min={0} max={100} value={rightTag.weight} onChange={(v) => { tagsService.update(rightTag.id, { weight: v }); setRightTag(tagsService.findById(rightTag.id)); }} style={{ width: 200 }} />
                    <InputNumber min={0} max={100} value={rightTag.weight} onChange={(v) => { tagsService.update(rightTag.id, { weight: v }); setRightTag(tagsService.findById(rightTag.id)); }} />
                    <Button onClick={() => setEditing(rightTag)}>编辑属性</Button>
                  </Space>
                </div>
                <RelationChips tag={rightTag} onAddSynonym={onAddSynonym} onRemoveSynonym={onRemoveSynonym} onToggleMutex={onToggleMutex} />
              </Tabs.TabPane>
            </Tabs>
          </Card>
        ) : (
          <Card><Text type="secondary">请选择左侧标签查看详情</Text></Card>
        )}
      </Content>

      {/* 创建与编辑弹窗 */}
      <TagEditModal open={createOpen} onCancel={() => setCreateOpen(false)} onOk={onCreate} />
      <TagEditModal open={!!editing} onCancel={() => setEditing(null)} onOk={onUpdate} initial={editing || undefined} />
    </Layout>
  );
};

export default TagManagement;

// 当前分类的子标签列表与操作
const TagChildrenSection = ({ parent, onCreateChild, onRenameChild, onDeleteChild, onRefreshParent }) => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = () => {
    if (!parent?.id) { setChildren([]); return; }
    // 若无子标签，自动进行一次模拟初始化
    const seeded = tagsService.ensureChildrenForParent(parent.id);
    const all = tagsService.getAll();
    setChildren(all.filter(t => t.parentId === parent.id));
  };

  useEffect(() => { refresh(); }, [parent]);

  const toggleEnabled = (tagId, checked) => {
    setLoading(true);
    try {
      tagsService.update(tagId, { enabled: checked });
      refresh();
      onRefreshParent?.(parent.id);
      message.success(checked ? '已启用' : '已禁用');
    } finally { setLoading(false); }
  };

  const updateWeight = (tagId, weight) => {
    tagsService.update(tagId, { weight });
    refresh();
    onRefreshParent?.(parent.id);
  };

  return (
    <Card size="small" title="标签列表" bodyStyle={{ padding: 0 }} style={{ margin: 0 }} extra={(
      <Space>
        <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => onCreateChild?.(parent.id)}>新建子标签</Button>
      </Space>
    )}>
      <Table
        size="small"
        loading={loading}
        pagination={false}
        tableLayout="fixed"
        style={{ width: '100%' }}
        dataSource={children.map(t => ({ key: t.id, ...t }))}
        columns={[
          { title: '标签名称', dataIndex: 'name' },
          { title: '状态', dataIndex: 'enabled', width: 140, render: (val, rec) => (
            <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={!!val} onChange={(checked) => toggleEnabled(rec.id, checked)} />
          ) },
          { title: '权重', dataIndex: 'weight', width: 240, render: (val, rec) => (
            <Space>
              <Slider min={0} max={100} value={val} onChange={(v) => updateWeight(rec.id, v)} style={{ width: 160 }} />
              <InputNumber min={0} max={100} value={val} onChange={(v) => updateWeight(rec.id, v)} />
            </Space>
          ) },
          { title: '操作', key: 'ops', width: 220, render: (_, rec) => (
            <Space>
              <Button size="small" onClick={() => onRenameChild?.(rec)}>重命名</Button>
              <Popconfirm title={`确认删除标签“${rec.name}”？`} onConfirm={() => onDeleteChild?.(rec)}>
                <Button size="small" danger>删除</Button>
              </Popconfirm>
            </Space>
          ) },
        ]}
      />
    </Card>
  );
};

// 关联实体展示与操作（简单模拟版）
const TagEntitiesSection = ({ tag, onTagChanged }) => {
  const [entities, setEntities] = useState([]);
  const [newEntityTitle, setNewEntityTitle] = useState('');

  useEffect(() => {
    if (tag?.id) {
      const existing = tagsService.getEntitiesByTag(tag.id);
      // 若当前标签没有关联实体，则从资料库中模拟生成若干条
      if (!existing || existing.length === 0) {
        tagsService.seedEntitiesForTagFromLibrary(tag.id, 5);
      }
      setEntities(tagsService.getEntitiesByTag(tag.id));
    } else {
      setEntities([]);
    }
  }, [tag]);

  const attach = () => {
    const title = (newEntityTitle || '').trim();
    if (!title) return;
    const e = tagsService.attachTagToEntityByTitle(title, tag.id);
    message.success(`已将标签关联到实体：${e.title}`);
    setNewEntityTitle('');
    setEntities(tagsService.getEntitiesByTag(tag.id));
    onTagChanged(tag.id);
  };

  const detach = (entityId) => {
    tagsService.detachTagFromEntity(entityId, tag.id);
    message.success('已移除该实体上的标签');
    setEntities(tagsService.getEntitiesByTag(tag.id));
    onTagChanged(tag.id);
  };

  return (
    <Card size="small" title="关联实体">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space wrap>
          <Input
            placeholder="输入实体标题并关联此标签"
            value={newEntityTitle}
            onChange={(e) => setNewEntityTitle(e.target.value)}
            style={{ width: 320 }}
          />
          <Button type="primary" onClick={attach}>关联到实体</Button>
        </Space>
        <Table
          size="small"
          pagination={false}
          dataSource={entities.map(e => ({ key: e.id, ...e }))}
          columns={[
            { title: '实体标题', dataIndex: 'title' },
            { title: '操作', key: 'ops', width: 140, render: (_, rec) => (
              <Popconfirm title="确认移除此标签？" onConfirm={() => detach(rec.id)}>
                <Button danger size="small">移除标签</Button>
              </Popconfirm>
            ) },
          ]}
        />
      </Space>
    </Card>
  );
};