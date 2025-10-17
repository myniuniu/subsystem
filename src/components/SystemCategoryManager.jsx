import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Select, Space, Card, Divider, Typography, message, Popconfirm } from 'antd';
import { PlusOutlined, ReloadOutlined, DeleteOutlined, SaveOutlined, BookOutlined, FileTextOutlined, FolderOpenOutlined, UserOutlined, BulbOutlined, StarOutlined, NodeIndexOutlined, RadarChartOutlined, ExperimentOutlined, TeamOutlined } from '@ant-design/icons';
import { getAvailableTemplates } from '../services/templateService';
import {
  DEFAULT_SYSTEM_CATEGORY_CONFIG,
  getSystemCategoryConfig,
  saveSystemCategoryConfig,
  resetSystemCategoryConfig
} from '../services/categoryConfigService';

const { Title, Text } = Typography;

const SystemCategoryManager = ({ visible, onCancel, onSave, categories, managerContext }) => {
  const [config, setConfig] = useState(DEFAULT_SYSTEM_CATEGORY_CONFIG);
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [activeGroupKey, setActiveGroupKey] = useState(null);
  const [activeGroupDepth, setActiveGroupDepth] = useState(null);

  const extraCats = (config?.extraCategories || []);
  const systemCategories = [
    ...(categories || []).filter(
      c => c.value !== 'organizational_training' && (!c.type || c.type === 'system')
    ),
    ...extraCats
  ];

  useEffect(() => {
    if (visible) {
      // 读取现有配置
      const current = getSystemCategoryConfig();
      setConfig(current);

      // 根据上下文定位当前操作分组（选中的分类所属分组作为上级；未选则不定位）
      const selectedVal = managerContext?.parentCategoryValue || null;
      if (selectedVal) {
        const findGroupByCategory = (groups = [], depth = 1) => {
          for (const g of groups) {
            if ((g.childrenValues || []).includes(selectedVal)) {
              return { key: g.key, depth };
            }
            const sub = findGroupByCategory(g.groups || [], depth + 1);
            if (sub) return sub;
          }
          return null;
        };
        const found = findGroupByCategory(current.groups || [], 1);
        setActiveGroupKey(found?.key || null);
        setActiveGroupDepth(found?.depth || null);
      } else {
        setActiveGroupKey(null);
        setActiveGroupDepth(null);
      }

      // 加载可用模板
      setLoadingTemplates(true);
      getAvailableTemplates().then(res => {
        if (res.success) {
          setTemplates(res.data);
        } else {
          message.error(res.message || '加载模版失败');
        }
      }).finally(() => setLoadingTemplates(false));
    }
  }, [visible, managerContext]);

  const handleAddGroup = () => {
    const newGroup = {
      key: `group_${Date.now()}`,
      title: '未命名分组',
      templateId: null,
      childrenValues: [],
      groups: []
    };
    setConfig(prev => {
      if (activeGroupKey) {
        // 将新分组添加为当前定位分组的子分组
        return addSubgroup(prev, activeGroupKey);
      }
      // 无定位上级时，添加为一级分组
      return { ...prev, groups: [...(prev.groups || []), newGroup] };
    });
  };

  // 递归工具：更新/删除/新增子分组（支持最多三级）
  const updateGroupByKey = (prev, key, updater) => {
    const walk = (groups = []) => groups.map(g => {
      const updated = g.key === key ? updater(g) : g;
      const childGroups = walk(g.groups || []);
      return { ...updated, groups: childGroups };
    });
    return { ...prev, groups: walk(prev.groups || []) };
  };

  // 在指定分组下新增系统分类（仅一级或二级分组使用）
  const handleCreateCategory = (targetGroupKey, newCategory) => {
    // 校验重复 value
    const allValues = new Set([
      ...((categories || []).map(c => c.value)),
      ...((config?.extraCategories || []).map(c => c.value))
    ]);
    if (!newCategory?.value || !newCategory?.label) {
      message.error('分类名称或ID不能为空');
      return;
    }
    if (allValues.has(newCategory.value)) {
      message.error('分类ID已存在，请更换');
      return;
    }
    setConfig(prev => {
      const nextExtra = [...(prev.extraCategories || []), { ...newCategory, type: 'system' }];
      const withExtra = { ...prev, extraCategories: nextExtra };
      return updateGroupByKey(withExtra, targetGroupKey, (g) => ({
        ...g,
        childrenValues: Array.from(new Set([...(g.childrenValues || []), newCategory.value]))
      }));
    });
  };

  const removeGroupByKey = (prev, key) => {
    const walk = (groups = []) => groups
      .filter(g => g.key !== key)
      .map(g => ({ ...g, groups: walk(g.groups || []) }));
    return { ...prev, groups: walk(prev.groups || []) };
  };

  const addSubgroup = (prev, parentKey) => {
    const newGroup = {
      key: `group_${Date.now()}`,
      title: '未命名分组',
      templateId: null,
      childrenValues: [],
      groups: []
    };
    const walk = (groups = [], depth = 1) => groups.map(g => {
      if (g.key === parentKey) {
        const children = [...(g.groups || []), newGroup];
        return { ...g, groups: children };
      }
      return { ...g, groups: walk(g.groups || [], depth + 1) };
    });
    return { ...prev, groups: walk(prev.groups || []) };
  };

  const handleResetDefault = () => {
    resetSystemCategoryConfig();
    setConfig(DEFAULT_SYSTEM_CATEGORY_CONFIG);
    message.success('已恢复默认分组配置');
  };

  const handleSave = () => {
    const ok = saveSystemCategoryConfig(config);
    if (ok) {
      message.success('系统分类配置已保存');
      onSave && onSave(config);
    } else {
      message.error('保存失败，请重试');
    }
  };

  return (
    <Modal
      open={visible}
      title="系统分类维护"
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnHidden
      centered
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>维护系统分类分组，并可为一级分组绑定智能体</Title>
        <Space>
          <Button icon={<PlusOutlined />} onClick={handleAddGroup}>新增分组</Button>
          <Button icon={<ReloadOutlined />} onClick={handleResetDefault}>恢复默认</Button>
        </Space>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {config.groups.map(group => (
          <GroupEditor
            key={group.key}
            group={group}
            depth={1}
            systemCategories={systemCategories}
            templates={templates}
            loadingTemplates={loadingTemplates}
            onUpdate={(key, updater) => setConfig(prev => updateGroupByKey(prev, key, updater))}
            onRemove={(key) => setConfig(prev => removeGroupByKey(prev, key))}
            onAddSubgroup={(key) => setConfig(prev => addSubgroup(prev, key))}
            onCreateCategory={handleCreateCategory}
            activeGroupKey={activeGroupKey}
          />
        ))}
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>保存</Button>
      </div>
    </Modal>
  );
};

// 组编辑器（递归渲染，最多支持四级；仅一级允许绑定模板）
const GroupEditor = ({ group, depth, systemCategories, templates, loadingTemplates, onUpdate, onRemove, onAddSubgroup, onCreateCategory, activeGroupKey }) => {
  const isMaxDepth = depth >= 4;
  const iconOptions = [
    { label: '文档', value: 'FileTextOutlined', Icon: FileTextOutlined },
    { label: '文件夹', value: 'FolderOpenOutlined', Icon: FolderOpenOutlined },
    { label: '书籍', value: 'BookOutlined', Icon: BookOutlined },
    { label: '用户', value: 'UserOutlined', Icon: UserOutlined },
    { label: '灵感', value: 'BulbOutlined', Icon: BulbOutlined },
    { label: '收藏', value: 'StarOutlined', Icon: StarOutlined },
    { label: '节点', value: 'NodeIndexOutlined', Icon: NodeIndexOutlined },
    { label: '雷达', value: 'RadarChartOutlined', Icon: RadarChartOutlined },
    { label: '实验', value: 'ExperimentOutlined', Icon: ExperimentOutlined },
    { label: '团队', value: 'TeamOutlined', Icon: TeamOutlined },
  ];
  const isEmojiIcon = typeof group.icon === 'string' && group.icon.length <= 2;
  const [newCatName, setNewCatName] = React.useState('');
  const [newCatValue, setNewCatValue] = React.useState('');
  const [newCatIcon, setNewCatIcon] = React.useState('');
  const slugify = (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  const canCreateHere = depth <= 2;
  const isEmojiCatIcon = newCatIcon && newCatIcon.length <= 2;
  const isActive = group.key === activeGroupKey;
  return (
    <Card size="small" bodyStyle={{ padding: 12 }} style={{ borderLeft: `4px solid ${['#1890ff','#52c41a','#fa8c16','#a855f7'][depth-1]}`, background: isActive ? '#f0f7ff' : undefined, boxShadow: isActive ? '0 0 0 2px rgba(24, 144, 255, 0.2) inset' : undefined }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Text strong>{depth === 1 ? '一级分组名称' : depth === 2 ? '二级分组名称' : depth === 3 ? '三级分组名称' : '四级分组名称'}</Text>
          <Input
            value={group.title}
            onChange={(e) => onUpdate(group.key, (g) => ({ ...g, title: e.target.value }))}
            style={{ width: 220 }}
            placeholder="请输入分组标题"
          />
        </Space>
        <Space>
          {!isMaxDepth && (
            <Button icon={<PlusOutlined />} onClick={() => onAddSubgroup(group.key)}>新增子分组</Button>
          )}
          <Popconfirm title="确定删除该分组？" onConfirm={() => onRemove(group.key)}>
            <Button danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
        {depth === 1 ? (
          <div style={{ flex: 1, minWidth: 260 }}>
            <Text style={{ display: 'block', marginBottom: 6 }}>绑定智能体（仅一级分组）</Text>
            <Select
              value={group.templateId}
              onChange={(val) => onUpdate(group.key, (g) => ({ ...g, templateId: val }))}
              loading={loadingTemplates}
              allowClear
              placeholder="选择一个智能体（可选）"
              style={{ width: '100%' }}
              options={templates.map(t => ({ label: t.name, value: t.id }))}
            />
          </div>
        ) : (
          <div style={{ flex: 1, minWidth: 260 }}>
            <Text style={{ display: 'block', marginBottom: 6 }}>智能体绑定</Text>
            <div style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px dashed #d9d9d9',
              borderRadius: 6,
              color: '#666'
            }}>
              该层级不支持绑定智能体，继承所属一级分组的智能体设置
            </div>
          </div>
        )}

        <div style={{ flex: 1, minWidth: 260 }}>
          <Text style={{ display: 'block', marginBottom: 6 }}>分组图标</Text>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Select
              value={!isEmojiIcon ? (group.icon || undefined) : undefined}
              onChange={(val) => onUpdate(group.key, (g) => ({ ...g, icon: val || null }))}
              placeholder="选择常用图标"
              style={{ width: '100%' }}
              allowClear
              optionLabelProp="label"
            >
              {iconOptions.map(opt => (
                <Select.Option key={opt.value} value={opt.value} label={opt.label}>
                  <Space>
                    <opt.Icon />
                    <span>{opt.label}</span>
                  </Space>
                </Select.Option>
              ))}
            </Select>
            <Input
              value={isEmojiIcon ? (group.icon || '') : ''}
              onChange={(e) => onUpdate(group.key, (g) => ({ ...g, icon: e.target.value }))}
              placeholder="或输入emoji，如📂、📁"
            />
            <Space>
              <Text type="secondary">当前图标预览：</Text>
              {isEmojiIcon && group.icon ? (
                <span style={{ fontSize: 14, lineHeight: '14px', opacity: 0.8 }}>{group.icon}</span>
              ) : group.icon ? (
                (() => {
                  const match = iconOptions.find(i => i.value === group.icon);
                  const IconComp = match ? match.Icon : FolderOpenOutlined;
                  return <IconComp style={{ fontSize: 14, color: '#94a3b8' }} />;
                })()
              ) : (
                <FolderOpenOutlined style={{ fontSize: 14, color: '#94a3b8' }} />
              )}
            </Space>
          </Space>
        </div>

        <div style={{ flex: 2, minWidth: 320 }}>
          <Text style={{ display: 'block', marginBottom: 6 }}>包含分类</Text>
          <Select
            mode="multiple"
            value={group.childrenValues}
            onChange={(vals) => onUpdate(group.key, (g) => ({ ...g, childrenValues: vals }))}
            placeholder="选择该分组下的系统分类"
            style={{ width: '100%' }}
            options={systemCategories.map(c => ({ label: c.label, value: c.value }))}
          />
        </div>
      </div>

      {canCreateHere && (
        <div style={{ marginTop: 12, padding: 12, border: '1px dashed #d9d9d9', borderRadius: 6 }}>
          <Text style={{ display: 'block', marginBottom: 8 }}>新增分类到本分组（仅一级/二级）</Text>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Input
              value={newCatName}
              onChange={(e) => {
                const val = e.target.value;
                setNewCatName(val);
                if (!newCatValue || newCatValue === slugify(newCatName)) {
                  setNewCatValue(slugify(val));
                }
              }}
              placeholder="分类名称，如“教学计划”"
              style={{ width: 200 }}
            />
            <Input
              value={newCatValue}
              onChange={(e) => setNewCatValue(e.target.value.trim())}
              placeholder="分类ID（自动生成，可编辑）"
              style={{ width: 220 }}
            />
            <Select
              value={!isEmojiCatIcon ? (newCatIcon || undefined) : undefined}
              onChange={(val) => setNewCatIcon(val || '')}
              placeholder="选择常用图标（可选）"
              style={{ width: 200 }}
              allowClear
              optionLabelProp="label"
            >
              {iconOptions.map(opt => (
                <Select.Option key={opt.value} value={opt.value} label={opt.label}>
                  <Space>
                    <opt.Icon />
                    <span>{opt.label}</span>
                  </Space>
                </Select.Option>
              ))}
            </Select>
            <Input
              value={isEmojiCatIcon ? newCatIcon : ''}
              onChange={(e) => setNewCatIcon(e.target.value)}
              placeholder="或输入emoji，如📄、📘"
              style={{ width: 160 }}
            />
            <Space>
              <Text type="secondary">预览：</Text>
              {isEmojiCatIcon && newCatIcon ? (
                <span style={{ fontSize: 14, lineHeight: '14px', opacity: 0.8 }}>{newCatIcon}</span>
              ) : newCatIcon ? (
                (() => {
                  const match = iconOptions.find(i => i.value === newCatIcon);
                  const IconComp = match ? match.Icon : FileTextOutlined;
                  return <IconComp style={{ fontSize: 14, color: '#94a3b8' }} />;
                })()
              ) : (
                <FileTextOutlined style={{ fontSize: 14, color: '#94a3b8' }} />
              )}
            </Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                if (!newCatName || !newCatValue) {
                  message.error('请填写分类名称和ID');
                  return;
                }
                onCreateCategory && onCreateCategory(group.key, {
                  value: newCatValue,
                  label: newCatName,
                  icon: newCatIcon || 'FileTextOutlined',
                  type: 'system'
                });
                setNewCatName('');
                setNewCatValue('');
                setNewCatIcon('');
              }}
            >添加分类</Button>
          </div>
        </div>
      )}

      {(group.groups || []).length > 0 && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {group.groups.map(sub => (
            <GroupEditor
              key={sub.key}
              group={sub}
              depth={depth + 1}
              systemCategories={systemCategories}
              templates={templates}
              loadingTemplates={loadingTemplates}
              onUpdate={onUpdate}
              onRemove={onRemove}
              onAddSubgroup={onAddSubgroup}
              onCreateCategory={onCreateCategory}
              activeGroupKey={activeGroupKey}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default SystemCategoryManager;