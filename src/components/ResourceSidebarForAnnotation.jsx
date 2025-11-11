import React, { useMemo, useState } from 'react';
import { Layout, Tree, Checkbox } from 'antd';
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
  
} from '@ant-design/icons';
import { getSystemCategoryConfig } from '../services/categoryConfigService';
import './ResourceSidebar.css';

const { Sider } = Layout;

// 注释页专用的副本组件：与 ResourceSidebar 一致，但作为独立实例使用
const ResourceSidebarForAnnotation = ({
  selectedCategory,
  onCategoryChange,
  notes,
  categories,
  configVersion,
  // 可选：显示右侧复选框（默认开启，满足“增加菜单复选框”需求）
  checkableRight = true,
  // 可选：受控复选状态
  checkedKeys: controlledCheckedKeys,
  onCheckedKeysChange
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

  // 辅助材料标注：记录被标注为“辅助材料”的一级分组key（独立于原组件的本地存储）
  // 简化：移除侧边“辅助材料/更多操作”等逻辑，仅展示分组与叶子分类

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

  // 复选框状态（不传受控props时走内部状态）
  const [internalCheckedKeys, setInternalCheckedKeys] = useState([]);
  const effectiveCheckedKeys = Array.isArray(controlledCheckedKeys)
    ? controlledCheckedKeys
    : internalCheckedKeys;

  const toggleCheck = (key) => {
    const next = effectiveCheckedKeys.includes(key)
      ? effectiveCheckedKeys.filter(k => k !== key)
      : [...effectiveCheckedKeys, key];
    if (onCheckedKeysChange) {
      onCheckedKeysChange(next);
    } else {
      setInternalCheckedKeys(next);
    }
  };

  const renderTreeNodeTitle = (category) => {
    const isEmojiIcon = category.icon && category.icon.length <= 2;
    const IconComponent = isEmojiIcon ? null : (iconMap[category.icon] || FileTextOutlined);
    const showCount = false; // 去掉数字统计标签
    const count = getCategoryCount(category);
    // 简化：不显示任何操作按钮，仅展示标签与计数

    return (
      <div className={`category-item ${selectedCategory === category.value ? 'active' : ''}`} style={{ paddingLeft: 0 }}>
        {isEmojiIcon ? (
          <span className="category-icon">{category.icon}</span>
        ) : (
          <IconComponent className="category-icon" />
        )}
        <span className="category-label">{category.label}</span>
        {showCount && <span className="category-count">{count}</span>}
        {checkableRight && (
          <Checkbox
            className="category-checkbox-right"
            checked={effectiveCheckedKeys.includes(category.value)}
            onChange={(e) => { e.stopPropagation(); toggleCheck(category.value); }}
          />
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

  const renderGroupNode = (group) => {
    const childrenValues = Array.isArray(group.childrenValues) ? group.childrenValues : [];
    const catChildren = childrenValues
      .map(val => systemCategories.find(c => c.value === val))
      .filter(Boolean)
      .map(cat => {
        assignedValues.add(cat.value);
        return {
          key: cat.value,
          title: renderTreeNodeTitle(cat),
          isLeaf: true
        };
      });

    const subGroupChildren = (group.groups || []).map(sub => renderGroupNode(sub));

    return {
      key: group.key,
      title: (
        <span className="category-group-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FolderOpenOutlined className="category-group-icon" />
          <span style={{ fontWeight: 500 }}>{group.title}</span>
        </span>
      ),
      selectable: false,
      children: [...catChildren, ...subGroupChildren]
    };
  };

  const groupNodes = (groupDefinitions || []).map(g => renderGroupNode(g));

  const unassignedCategories = systemCategories.filter(cat => !assignedValues.has(cat.value));
  const restNodes = unassignedCategories.map(cat => ({
    key: cat.value,
    title: renderTreeNodeTitle(cat),
    isLeaf: true
  }));

  const treeData = [
    ...groupNodes,
    ...restNodes
  ];

  return (
    <Sider width="100%" className="notes-sidebar resource-sidebar" style={{ height: '100%', background: '#fff' }}>
      <div className="sidebar-content" style={{ height: '100%', background: '#fff' }}>
        <div className="category-section" style={{ height: '100%' }}>
          <Tree
            treeData={treeData}
            defaultExpandAll
            showLine={false}
            onSelect={(keys) => {
              const key = Array.isArray(keys) ? keys[0] : keys;
              if (key) {
                onCategoryChange(key);
              }
            }}
            selectedKeys={selectedCategory ? [selectedCategory] : []}
            height={undefined}
          />
        </div>
      </div>
    </Sider>
  );
};

export default ResourceSidebarForAnnotation;