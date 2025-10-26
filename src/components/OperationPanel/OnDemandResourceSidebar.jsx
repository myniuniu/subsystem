import React, { useMemo, useState, useEffect } from 'react';
import { Layout, Tree, Button, Tooltip, Dropdown, message } from 'antd';
import {
  BookOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  UserOutlined,
  BulbOutlined,
  StarOutlined,
  NodeIndexOutlined,
  RadarChartOutlined,
  ExperimentOutlined,
  TeamOutlined,
  PlusOutlined,
  EllipsisOutlined
} from '@ant-design/icons';
import { getSystemCategoryConfig } from '../../services/categoryConfigService';
import './ResourceSidebar.css';

const { Sider } = Layout;

const ResourceSidebar = ({
  selectedCategory,
  onCategoryChange,
  notes,
  categories,
  configVersion
}) => {
  const iconMap = {
    FileTextOutlined,
    FolderOpenOutlined,
    BookOutlined,
    UserOutlined,
    BulbOutlined,
    StarOutlined,
    NodeIndexOutlined,
    RadarChartOutlined,
    ExperimentOutlined,
    TeamOutlined
  };

  const getCategoryCount = (category) => {
    if (!Array.isArray(notes)) return 0;
    if (category.value === 'all') {
      return notes.length;
    } else if (category.value === 'starred') {
      return notes.filter(note => note.starred).length;
    } else if (category.value === 'learning_square') {
      return notes.filter(note =>
        note.category === 'learning_square' ||
        note.tags?.includes('学习广场') ||
        note.source === '学习广场'
      ).length;
    } else if (category.value === 'organizational_training') {
      const orgTrainingNotes = notes.filter(note =>
        note.courseType === 'organizational_training' ||
        note.tags?.includes('组织培训') ||
        note.category === 'organizational_training' ||
        note.source === '组织培训'
      );
      const inProgressCount = orgTrainingNotes.filter(note => note.trainingStatus === 'in_progress').length;
      return inProgressCount > 0 ? inProgressCount : orgTrainingNotes.length;
    } else if (category.value === 'training_needs_management') {
      const trainingNeedsNotes = notes.filter(note => note.category === 'training_needs_management');
      const implementingCount = trainingNeedsNotes.filter(note => note.trainingStatus === 'implementing').length;
      return implementingCount > 0 ? implementingCount : trainingNeedsNotes.length;
    } else {
      return notes.filter(note => note.category === category.value).length;
    }
  };

  const hoverMenuItems = [
    { key: 'rename', label: '重命名' },
    { key: 'move', label: '移动到' },
    { key: 'pin-to-top', label: '置顶' },
    { type: 'divider' },
    { key: 'trash', danger: true, label: '移至垃圾箱' }
  ];

  const onHoverMenuClick = ({ key }) => {
    // 暂时提供交互反馈，后续可接入系统分类管理器
    switch (key) {
      case 'rename':
        message.info('重命名将在后续版本提供');
        break;
      case 'move':
        message.info('移动分类将在后续版本提供');
        break;
      case 'pin-to-top':
        message.success('置顶操作将在后续版本接入');
        break;
      case 'trash':
        message.warning('删除/移至垃圾箱将在后续版本提供');
        break;
      default:
        break;
    }
  };

  const renderTreeNodeTitle = (category) => {
    const isEmojiIcon = category.icon && category.icon.length <= 2;
    const IconComponent = isEmojiIcon ? null : (iconMap[category.icon] || FileTextOutlined);
    const showCount = true;
    const count = getCategoryCount(category);
    const showActions = category.type === 'system' && category.value !== 'organizational_training' && category.value !== 'training_needs_management';

    return (
      <div className={`category-item ${selectedCategory === category.value ? 'active' : ''}`} style={{ paddingLeft: 0 }}>
        {isEmojiIcon ? (
          <span className="category-icon">{category.icon}</span>
        ) : (
          <IconComponent className="category-icon" />
        )}
        <span className="category-label">{category.label}</span>
        {showCount && <span className="category-count">{count}</span>}
        {showActions && (
          <span className="category-actions">
            <Tooltip title="新增分类">
              <Button
                type="text"
                size="small"
                onClick={(e) => { e.stopPropagation(); message.info('新增分类将在后续版本提供'); }}
                icon={<PlusOutlined className="transparent-maintain-icon" />}
                aria-label="新增分类"
              />
            </Tooltip>
            <Dropdown
              trigger={["click"]}
              overlayClassName="side-more-menu"
              menu={{ items: hoverMenuItems, onClick: onHoverMenuClick }}
            >
              <Tooltip title="更多">
                <Button
                  type="text"
                  size="small"
                  onClick={(e) => { e.stopPropagation(); }}
                  icon={<EllipsisOutlined className="transparent-maintain-icon" />}
                  aria-label="更多操作"
                />
              </Tooltip>
            </Dropdown>
          </span>
        )}
      </div>
    );
  };

  const { systemCategories, groupDefinitions, pinnedCategoriesFromExtra } = useMemo(() => {
    const config = getSystemCategoryConfig();
    const extraCats = (config?.extraCategories || []);
    const extraCatValues = new Set(extraCats.map(c => c.value));
    const baseSystemCategories = (categories || []).filter(
      c => c.value !== 'organizational_training' &&
           (!c.type || c.type === 'system') &&
           !extraCatValues.has(c.value)
    );
    const systemCategories = [...baseSystemCategories, ...extraCats];
    const groupDefinitions = config?.groups || [];
    const pinnedCategoriesFromExtra = extraCats.filter(c => c.pinned === true && c.value !== 'organizational_training' && c.value !== 'training_needs_management');
    return { systemCategories, groupDefinitions, pinnedCategoriesFromExtra };
  }, [categories, configVersion]);

  const assignedValues = new Set();
  const buildGroupNode = (group, depth = 1) => {
    const catChildren = (group.childrenValues || [])
      .map(val => systemCategories.find(c => c.value === val))
      .filter(Boolean)
      .map(cat => {
        assignedValues.add(cat.value);
        return { key: cat.value, title: renderTreeNodeTitle(cat), isLeaf: true };
      });
    const subGroupChildren = (group.groups || []).map(sub => buildGroupNode(sub, depth + 1));
    const isEmojiIcon = group.icon && group.icon.length <= 2;
    const GroupIconComponent = isEmojiIcon ? null : (iconMap[group.icon] || FolderOpenOutlined);
    return {
      key: group.key,
      title: (
        <span className="tree-group-title" style={{ fontWeight: 600, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
          {isEmojiIcon ? (
            <span className="category-icon">{group.icon}</span>
          ) : (
            <GroupIconComponent className="category-icon" />
          )}
          <span>{group.title}</span>
          <span className="category-actions">
            <Tooltip title="新增分类">
              <Button
                type="text"
                size="small"
                onClick={(e) => { e.stopPropagation(); message.info('新增一级分类将在后续版本提供'); }}
                icon={<PlusOutlined className="transparent-maintain-icon" />}
                aria-label="新增一级分类"
              />
            </Tooltip>
          </span>
        </span>
      ),
      selectable: false,
      children: [...catChildren, ...subGroupChildren]
    };
  };

  const treeData = groupDefinitions.map(g => buildGroupNode(g, 1));
  const pinnedValues = new Set(pinnedCategoriesFromExtra.map(c => c.value));
  const restCategories = systemCategories.filter(c => !assignedValues.has(c.value) && !pinnedValues.has(c.value));
  if (restCategories.length) {
    treeData.push({
      key: 'group_other',
      title: <span style={{ fontWeight: 600, color: '#6b7280' }}>其他</span>,
      selectable: false,
      children: restCategories.map(cat => ({ key: cat.value, title: renderTreeNodeTitle(cat), isLeaf: true }))
    });
  }

  // 让“我的分类”默认全部展开：受控 expandedKeys
  const [expandedKeys, setExpandedKeys] = useState([]);
  useEffect(() => {
    if (expandedKeys.length === 0 && Array.isArray(treeData) && treeData.length) {
      const collectKeys = (nodes) => nodes.flatMap(n => [n.key, ...(n.children ? collectKeys(n.children) : [])]);
      setExpandedKeys(collectKeys(treeData));
    }
  }, [treeData]);
  const onExpand = (keys) => setExpandedKeys(keys);

  const onSelect = (keys) => {
    const key = keys?.[0];
    if (key) {
      onCategoryChange?.(key);
    }
  };

  return (
    <Sider className="notes-sidebar resource-sidebar">
      <div className="sidebar-content">
        <div className="category-group" key="system_categories_header">
          <div className="category-group-title">
            <span>我的分类</span>
            <span className="category-actions">
              <Tooltip title="新增分类">
                <Button
                  type="text"
                  size="small"
                  onClick={(e) => { e.stopPropagation(); message.info('新增分类将在后续版本提供'); }}
                  icon={<PlusOutlined />}
                  aria-label="新增分类"
                />
              </Tooltip>
            </span>
          </div>
        </div>
        <div className="sidebar-bottom">
          <Tree
            className="category-tree"
            showLine={false}
            showIcon={false}
            treeData={treeData}
            selectedKeys={selectedCategory ? [selectedCategory] : []}
            onSelect={onSelect}
            expandedKeys={expandedKeys}
            onExpand={onExpand}
          />
        </div>
      </div>
    </Sider>
  );
};

export default ResourceSidebar;