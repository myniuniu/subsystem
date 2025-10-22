import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Layout, Input, Tree, Button, Tooltip, Modal, message, Dropdown, Select, Space } from 'antd';
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
  SettingOutlined,
  PlusOutlined,
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { TRAINING_STATUS, getTrainingStatusInfo } from '../utils/trainingStatusUtils';
import { getSystemCategoryConfig, saveSystemCategoryConfig } from '../services/categoryConfigService';
import { getAvailableTemplates } from '../services/templateService';

const { Sider } = Layout;
const { Search } = Input;

const NotesSidebar = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  notes,
  categories,
  onOpenSystemCategoryManager,
  configVersion
}) => {
  // 新增系统分类弹窗状态
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [addParentCategoryValue, setAddParentCategoryValue] = useState(null);
  const [addMode, setAddMode] = useState('category'); // 'category' 或 'group'
  const [addTargetGroupKey, setAddTargetGroupKey] = useState(null); // 针对分组标题的新增
  // 触发重新渲染以刷新本地读取的系统分组配置
  const [refreshTick, setRefreshTick] = useState(0);

  // 一级分组模板选择（仅在新增一级分类时可用）
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [templateTargetGroupKey, setTemplateTargetGroupKey] = useState(null);

  // 新增系统分类的图标选择（支持常用图标或emoji）
  const [newCategoryIcon, setNewCategoryIcon] = useState('');

  // 就地“更多”菜单相关：重命名/移动/删除
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null); // { type: 'category' | 'group', value|key, label }
  const [renameLabel, setRenameLabel] = useState('');
  const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);
  const [moveTarget, setMoveTarget] = useState(null); // { type: 'category', value }
  const [moveTargetGroupKey, setMoveTargetGroupKey] = useState(null);
  const [moveSelectedKey, setMoveSelectedKey] = useState(null);
  // 系统分类滚动区域：滚动箭头指示逻辑
  const sidebarBottomRef = useRef(null);
  const [showBottomArrow, setShowBottomArrow] = useState(false);
  const [showTopArrow, setShowTopArrow] = useState(false);
  const [isBottomHovered, setIsBottomHovered] = useState(false);

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

  // 常用图标选项（用于新增分类时选择）
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
    { label: '设置', value: 'SettingOutlined', Icon: SettingOutlined },
  ];

  // 当打开“新增一级分类”弹窗时加载可用主题模版
  useEffect(() => {
    if (isAddCategoryModalVisible && addMode === 'group') {
      setLoadingTemplates(true);
      getAvailableTemplates()
        .then(res => {
          if (res.success) {
            setAvailableTemplates(res.data || []);
          } else {
            message.error(res.message || '加载模版失败');
          }
        })
        .finally(() => setLoadingTemplates(false));
    }
  }, [isAddCategoryModalVisible, addMode]);

  // 计算某分类计数（用于树形标题展示），保持原数据不变
  const getCategoryCount = (category) => {
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
      // 优先显示“进行中”数量；如为0则显示总数，避免误显示为0
      const inProgressCount = orgTrainingNotes.filter(note => {
        const statusInfo = getTrainingStatusInfo(note);
        return statusInfo && statusInfo.status === TRAINING_STATUS.IN_PROGRESS;
      }).length;
      return inProgressCount > 0 ? inProgressCount : orgTrainingNotes.length;
    } else if (category.value === 'training_needs_management') {
      // 培训需求管理：显示“实施中”的数量
      const trainingNeedsNotes = notes.filter(note => 
        note.category === 'training_needs_management'
      );
      const implementingCount = trainingNeedsNotes.filter(note => 
        note.trainingStatus === 'implementing'
      ).length;
      return implementingCount > 0 ? implementingCount : trainingNeedsNotes.length;
    } else {
      return notes.filter(note => note.category === category.value).length;
    }
  };

  const renderCategoryItem = (category) => {
    const isEmojiIcon = category.icon && category.icon.length <= 2;
    const IconComponent = isEmojiIcon ? null : (iconMap[category.icon] || FileTextOutlined);
    const count = getCategoryCount(category);
    // 显示计数：非系统分类 + 特例（组织培训和培训需求管理显示进行中数量）；置顶后不显示数字
    const isPinned = !!category.pinned;
    const showCount = (
      category.value === 'organizational_training' || 
      category.value === 'training_needs_management'
    ) || (!isPinned && (category.type && category.type !== 'system'));
    
    // 是否显示“组织”角标：仅对组织培训和培训需求管理，置顶分类不显示
    const showOrgRibbon = (
      category.value === 'organizational_training' || 
      category.value === 'training_needs_management'
    );
    
    // 是否使用组织培训样式：组织培训、培训需求管理、置顶分类
    const useOrgStyle = (
      category.value === 'organizational_training' || 
      category.value === 'training_needs_management' ||
      category.pinned // 置顶的分类使用相同样式
    );
    
    return (
      <div
        key={category.value}
        className={`category-item ${
          useOrgStyle ? 'organizational-training-category' : ''
        } ${category.type === 'fixed' ? 'fixed-category' : ''} ${
          category.type === 'custom' && !category.pinned ? 'custom-category' : ''
        } ${isPinned ? 'pinned-category' : ''} ${selectedCategory === category.value ? 'active' : ''}`}
        onClick={() => onCategoryChange(category.value)}
      >
        {isEmojiIcon ? (
          <span className="category-icon">{category.icon}</span>
        ) : (
          <IconComponent className="category-icon" />
        )}
        <span className="category-label">
          {category.value === 'organizational_training' ? '组织培训' : category.label}
        </span>
        {showCount && <span className="category-count">{count}</span>}
        {showOrgRibbon && (
          <span className="category-ribbon">组织</span>
        )}
        {isPinned && (
          <span className="category-ribbon">置顶</span>
        )}
        {onOpenSystemCategoryManager && isPinned && (
          <span className="category-actions">
            <Dropdown
              trigger={["click"]}
              overlayClassName="side-more-menu"
              menu={{ items: getPinnedCategoryMoreMenuItems(category), onClick: (ev) => onPinnedCategoryMenuClick(ev, category) }}
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
        {onOpenSystemCategoryManager && category.type === 'system' && !isPinned && category.value !== 'organizational_training' && category.value !== 'training_needs_management' && (
          <span className="category-actions">
            <Tooltip title="新增分类">
              <Button
                type="text"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setAddParentCategoryValue(category.value);
                  setIsAddCategoryModalVisible(true);
                }}
                icon={<PlusOutlined className="transparent-maintain-icon" />}
                aria-label="新增分类"
              />
            </Tooltip>
            <Dropdown
              trigger={["click"]}
              overlayClassName="side-more-menu"
              menu={{ items: getCategoryMoreMenuItems(category), onClick: (ev) => onCategoryMenuClick(ev, category) }}
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

  // 为树节点生成标题（不绑定点击，交给 Tree 的 onSelect 处理）
  const renderTreeNodeTitle = (category, options = {}) => {
    const { hideActions = false } = options;
    const isEmojiIcon = category.icon && category.icon.length <= 2;
    const IconComponent = isEmojiIcon ? null : (iconMap[category.icon] || FileTextOutlined);
    const count = getCategoryCount(category);
    return (
      <div
        className={`category-item ${selectedCategory === category.value ? 'active' : ''}`}
        style={{ paddingLeft: 0 }}
      >
        {isEmojiIcon ? (
          <span className="category-icon">{category.icon}</span>
        ) : (
          <IconComponent className="category-icon" />
        )}
        <span className="category-label">{category.label}</span>
        {onOpenSystemCategoryManager && !hideActions && (
          <span className="category-actions">
            <Tooltip title="新增分类">
              <Button
                type="text"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setAddParentCategoryValue(category.value);
                  setIsAddCategoryModalVisible(true);
                }}
                icon={<PlusOutlined className="transparent-maintain-icon" />}
                aria-label="新增分类"
              />
            </Tooltip>
            <Dropdown
              trigger={["click"]}
              overlayClassName="side-more-menu"
              menu={{ items: getCategoryMoreMenuItems(category), onClick: (ev) => onCategoryMenuClick(ev, category) }}
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

  // 构建系统分类的树形数据（不改动原始 categories，仅分组展示）
  // 读取系统分类分组配置（使用本地存储），随外部版本号变化而刷新
  const { config, extraCats, systemCategories, groupDefinitions, pinnedCategoriesFromExtra } = useMemo(() => {
    const config = getSystemCategoryConfig();
    const extraCats = (config?.extraCategories || []);
    
    // 从 extraCategories 中提取所有value，用于去重
    const extraCatValues = new Set(extraCats.map(c => c.value));
    
    // 过滤掉已经在extraCategories中的分类，避免重复
    const baseSystemCategories = categories.filter(
      c => c.value !== 'organizational_training' && 
           (!c.type || c.type === 'system') &&
           !extraCatValues.has(c.value)  // 新增：排除已在extraCategories中的
    );
    
    const systemCategories = [...baseSystemCategories, ...extraCats];
    const groupDefinitions = config.groups || [];
    
    // 从 extraCategories 中提取置顶的分类，用于在组织培训区域显示（排除固定的组织培训/培训需求管理）
    const pinnedCategoriesFromExtra = extraCats.filter(c => c.pinned === true && c.value !== 'organizational_training' && c.value !== 'training_needs_management');
    
    console.log('=== NotesSidebar 数据加载 ===');
    console.log('categories prop 长度:', categories.length);
    console.log('extraCategories 总数:', extraCats.length);
    console.log('extraCategories 内容:', extraCats);
    console.log('baseSystemCategories 长度:', baseSystemCategories.length);
    return { config, extraCats, systemCategories, groupDefinitions, pinnedCategoriesFromExtra };
  }, [categories, configVersion, refreshTick]);

  // 通用分组操作工具
  const updateGroupByKey = (configObj, targetKey, updater) => {
    const walk = (groups = []) => groups.map(g => {
      const updated = g.key === targetKey ? updater(g) : g;
      return { ...updated, groups: walk(updated.groups || []) };
    });
    return { ...configObj, groups: walk(configObj.groups || []) };
  };

  const removeCategoryFromAllGroups = (configObj, categoryValue) => {
    const walk = (groups = []) => groups.map(g => ({
      ...g,
      childrenValues: (g.childrenValues || []).filter(v => v !== categoryValue),
      groups: walk(g.groups || [])
    }));
    return { ...configObj, groups: walk(configObj.groups || []) };
  };

  const removeGroupByKey = (configObj, targetKey) => {
    const walk = (groups = []) => groups
      .filter(g => g.key !== targetKey)
      .map(g => ({ ...g, groups: walk(g.groups || []) }));
    return { ...configObj, groups: walk(configObj.groups || []) };
  };

  const findGroupByCategory = (groups = [], selectedVal, depth = 1) => {
    for (const g of groups) {
      if ((g.childrenValues || []).includes(selectedVal)) {
        return { key: g.key, depth };
      }
      const sub = findGroupByCategory(g.groups || [], selectedVal, depth + 1);
      if (sub) return sub;
    }
    return null;
  };

  // 新增：查找某分类所在的所有分组key（用于置顶/取消置顶时恢复位置）
  const findAllGroupKeysByCategory = (groups = [], selectedVal) => {
    const keys = [];
    const walk = (gs = []) => {
      for (const g of gs) {
        if ((g.childrenValues || []).includes(selectedVal)) {
          keys.push(g.key);
        }
        walk(g.groups || []);
      }
    };
    walk(groups);
    return keys;
  };

  const flattenGroups = (groups = [], depth = 1, acc = []) => {
    for (const g of groups) {
      acc.push({ key: g.key, title: g.title, depth });
      flattenGroups(g.groups || [], depth + 1, acc);
    }
    return acc;
  };

  // 监控系统分类滚动容器是否溢出与滚动位置，用于显示顶部/底部箭头指示
  const updateScrollArrows = () => {
    const el = sidebarBottomRef.current;
    if (!el) {
      setShowBottomArrow(false);
      setShowTopArrow(false);
      return;
    }
    const hasOverflow = el.scrollHeight > el.clientHeight + 1;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    const nearTop = el.scrollTop <= 2;
    setShowBottomArrow(hasOverflow && !nearBottom && isBottomHovered);
    setShowTopArrow(hasOverflow && !nearTop && isBottomHovered);
  };

  useEffect(() => {
    const el = sidebarBottomRef.current;
    if (!el) return;
    const onScroll = () => updateScrollArrows();
    el.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    // 初始化计算
    updateScrollArrows();
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [groupDefinitions, refreshTick, isBottomHovered]);

  // 分类的“更多”菜单
  const getCategoryMoreMenuItems = (category) => {
    const items = [
      {
        key: 'rename',
        icon: <EditOutlined />,
        label: (
          <span style={{ display: 'flex', justifyContent: 'space-between', width: 180 }}>
            <span>重命名</span>
            <span style={{ color: '#94a3b8' }}>⌘⇧R</span>
          </span>
        )
      },
      {
        key: 'move',
        icon: <ArrowRightOutlined />,
        label: (
          <span style={{ display: 'flex', justifyContent: 'space-between', width: 180 }}>
            <span>移动到</span>
            <span style={{ color: '#94a3b8' }}>⌘⇧P</span>
          </span>
        )
      }
    ];
    
    // 如果是系统分类（非组织培训和培训需求管理），添加"置顶"选项
    if (category.type === 'system' && 
        category.value !== 'organizational_training' && 
        category.value !== 'training_needs_management') {
      items.push({
        key: 'pin-to-top',
        icon: <StarOutlined />,
        label: <span>置顶</span>
      });
    }
    
    items.push({ type: 'divider' });
    items.push({
      key: 'trash',
      icon: <DeleteOutlined />,
      danger: true,
      label: <span>移至垃圾箱</span>
    });
    
    return items;
  };

  const onCategoryMenuClick = (e, category) => {
    e?.domEvent?.stopPropagation?.();
    const { key } = e;
    if (key === 'rename') {
      setRenameTarget({ type: 'category', value: category.value, label: category.label });
      setRenameLabel(category.label || '');
      setIsRenameModalVisible(true);
      return;
    }
    if (key === 'move') {
      setMoveTarget({ type: 'category', value: category.value });
      const loc = findGroupByCategory(groupDefinitions, category.value, 1);
      setMoveTargetGroupKey(loc?.key || null);
      setMoveSelectedKey(null);
      setIsMoveModalVisible(true);
      return;
    }
    if (key === 'pin-to-top') {
      // 置顶到组织区域：将该分类移动到自定义分类区域，并添加特殊样式
      const current = getSystemCategoryConfig();
      
      console.log('=== 置顶操作开始 ===');
      console.log('1. 原始category对象:', JSON.stringify(category, null, 2));
      console.log('2. 当前config:', JSON.stringify(current, null, 2));
      
      // 1. 从原有的extraCategories中移除
      const existingExtraCategories = (current?.extraCategories || []).filter(c => c.value !== category.value);
      console.log('3. 过滤后的existingExtraCategories:', JSON.stringify(existingExtraCategories, null, 2));
      
      // 记录置顶前的原分组位置
      const originalGroupKeys = findAllGroupKeysByCategory(current?.groups || [], category.value);
      console.log('3.1 原分组keys:', originalGroupKeys);
      
      // 2. 添加到自定义分类列表，并标记为置顶
      const pinnedCategory = {
        ...category,
        type: 'custom',
        pinned: true,
        pinnedAt: new Date().toISOString(),
        // 保存原分组key，用于取消置顶时恢复
        originalGroupKeys
      };
      console.log('4. 构造的pinnedCategory:', JSON.stringify(pinnedCategory, null, 2));
      
      let nextConfig = { 
        ...current, 
        extraCategories: [...existingExtraCategories, pinnedCategory]
      };
      console.log('5. 新的nextConfig.extraCategories:', JSON.stringify(nextConfig.extraCategories, null, 2));
      
      // 3. 保留该分类在原分组中（不移除，以便在原分类里仍然保留）
      // nextConfig = removeCategoryFromAllGroups(nextConfig, category.value);
      console.log('6. 保留在原分组，避免从树中消失');
      
      const ok = saveSystemCategoryConfig(nextConfig);
      console.log('7. saveSystemCategoryConfig 返回值:', ok);
      
      // 验证保存后的数据
      const savedConfig = getSystemCategoryConfig();
      console.log('8. 保存后立即读取的config:', JSON.stringify(savedConfig, null, 2));
      console.log('9. 保存后extraCategories中的置顶分类:', savedConfig?.extraCategories?.filter(c => c.pinned === true));
      console.log('=== 置顶操作结束 ===');
      
      if (ok) {
        message.success(`已将"${category.label}"置顶到组织区域，并保留在原分组`);
        setRefreshTick(Date.now());
      } else {
        message.error('操作失败，请稍后重试');
      }
      return;
    }
    if (key === 'trash') {
      const current = getSystemCategoryConfig();
      const isExtra = (current?.extraCategories || []).some(c => c.value === category.value);
      if (!isExtra) {
        message.warning('内置系统分类暂不支持删除，可通过移动调整位置');
        return;
      }
      Modal.confirm({
        title: '确认移至垃圾箱？',
        content: `分类“${category.label}”将被移除，且从所有分组中删除。`,
        okText: '移除',
        cancelText: '取消',
        onOk: () => {
          let next = { ...current, extraCategories: (current.extraCategories || []).filter(c => c.value !== category.value) };
          next = removeCategoryFromAllGroups(next, category.value);
          const ok = saveSystemCategoryConfig(next);
          if (ok) {
            message.success('已移至垃圾箱');
            setRefreshTick(Date.now());
          } else {
            message.error('操作失败，请稍后重试');
          }
        }
      });
    }
  };

  // 置顶分类的“更多”菜单
  const getPinnedCategoryMoreMenuItems = (category) => ([
    {
      key: 'unpin',
      icon: <StarOutlined />,
      label: <span>取消置顶</span>
    },
    {
      key: 'rename',
      icon: <EditOutlined />,
      label: (
        <span style={{ display: 'flex', justifyContent: 'space-between', width: 180 }}>
          <span>重命名</span>
          <span style={{ color: '#94a3b8' }}>⌘⇧R</span>
        </span>
      )
    },
    { type: 'divider' },
    {
      key: 'trash',
      icon: <DeleteOutlined />,
      danger: true,
      label: <span>移至垃圾箱</span>
    }
  ]);

  const onPinnedCategoryMenuClick = (e, category) => {
    e?.domEvent?.stopPropagation?.();
    const { key } = e;
    
    if (key === 'unpin') {
      // 取消置顶：将分类移回系统分类，并恢复到原分组
      const current = getSystemCategoryConfig();
      
      // 移除pinned标记，改回type为'system'
      const unpinnedCategory = {
        ...category,
        type: 'system',
        pinned: false,
        pinnedAt: null
      };
      
      const existingExtraCategories = (current?.extraCategories || []).filter(c => c.value !== category.value);
      
      let nextConfig = { 
        ...current, 
        extraCategories: [...existingExtraCategories, unpinnedCategory]
      };
      
      // 尝试恢复到置顶前的原分组位置
      let restoreKeys = Array.isArray(category?.originalGroupKeys) ? category.originalGroupKeys.filter(Boolean) : [];
      if (!restoreKeys.length) {
        // 历史数据可能没有记录原分组，回退到第一个一级分组，避免进入“其他”
        const fallbackKey = current?.groups?.[0]?.key || null;
        if (fallbackKey) restoreKeys = [fallbackKey];
        console.log('未找到originalGroupKeys，使用回退分组:', fallbackKey);
      } else {
        console.log('使用originalGroupKeys恢复分组:', restoreKeys);
      }
      
      restoreKeys.forEach(k => {
        nextConfig = updateGroupByKey(nextConfig, k, (g) => ({
          ...g,
          childrenValues: Array.from(new Set([ ...(g.childrenValues || []), category.value ]))
        }));
      });
      
      const ok = saveSystemCategoryConfig(nextConfig);
      if (ok) {
        message.success(`已取消“${category.label}”的置顶并恢复到原分组`);
        setRefreshTick(Date.now());
      } else {
        message.error('操作失败，请稍后重试');
      }
      return;
    }
    
    if (key === 'rename') {
      setRenameTarget({ type: 'category', value: category.value, label: category.label });
      setRenameLabel(category.label || '');
      setIsRenameModalVisible(true);
      return;
    }
    
    if (key === 'trash') {
      const current = getSystemCategoryConfig();
      Modal.confirm({
        title: '确认移至垃圾箱？',
        content: `分类“${category.label}”将被移除。`,
        okText: '移除',
        cancelText: '取消',
        onOk: () => {
          const next = { ...current, extraCategories: (current.extraCategories || []).filter(c => c.value !== category.value) };
          const ok = saveSystemCategoryConfig(next);
          if (ok) {
            message.success('已移至垃圾箱');
            setRefreshTick(Date.now());
          } else {
            message.error('操作失败，请稍后重试');
          }
        }
      });
    }
  };

  // 分组标题“更多”菜单（仅一级支持“主题模版”）
  const getGroupMoreMenuItems = (group, depth) => ([
    ...(depth === 1 ? [
      {
        key: 'template',
        icon: <BookOutlined />,
        label: <span>智能体</span>
      },
      { type: 'divider' }
    ] : []),
    {
      key: 'rename',
      icon: <EditOutlined />,
      label: (
        <span style={{ display: 'flex', justifyContent: 'space-between', width: 180 }}>
          <span>重命名</span>
          <span style={{ color: '#94a3b8' }}>⌘⇧R</span>
        </span>
      )
    },
    { type: 'divider' },
    {
      key: 'trash',
      icon: <DeleteOutlined />,
      danger: true,
      label: <span>移至垃圾箱</span>
    }
  ]);

  const onGroupMenuClick = (e, group, depth) => {
    e?.domEvent?.stopPropagation?.();
    const { key } = e;
    const current = getSystemCategoryConfig();
    if (key === 'template') {
      if (depth !== 1) {
        message.info('仅一级分组支持绑定智能体');
        return;
      }
      setTemplateTargetGroupKey(group.key);
      setSelectedTemplateId(group.templateId || null);
      // 加载模板
      setLoadingTemplates(true);
      getAvailableTemplates().then(res => {
        if (res.success) {
          setAvailableTemplates(res.data || []);
        } else {
          message.error(res.message || '加载模版失败');
        }
      }).finally(() => setLoadingTemplates(false));
      setIsTemplateModalVisible(true);
      return;
    }
    if (key === 'rename') {
      setRenameTarget({ type: 'group', key: group.key, label: group.title });
      setRenameLabel(group.title || '');
      setIsRenameModalVisible(true);
      return;
    }
    if (key === 'trash') {
      const target = (current.groups || []).find(g => g.key === group.key);
      const hasChildren = !!(target && (((target.childrenValues || []).length) || ((target.groups || []).length)));
      if (hasChildren) {
        message.warning('请先移除或移动该分组内的分类/子分组');
        return;
      }
      Modal.confirm({
        title: '确认删除分组？',
        content: `分组“${group.title}”将被删除。`,
        okText: '删除',
        cancelText: '取消',
        onOk: () => {
          const ok = saveSystemCategoryConfig(removeGroupByKey(current, group.key));
          if (ok) {
            message.success('已删除分组');
            setRefreshTick(Date.now());
          } else {
            message.error('操作失败，请稍后重试');
          }
        }
      });
    }
  };

  // 递归构建树，并收集所有已分配的系统分类值
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
          {depth === 1 && group.templateId ? (
            <span style={{ marginLeft: 8, fontSize: 12, color: '#94a3b8' }}>已绑定模版</span>
          ) : null}
          {onOpenSystemCategoryManager && (
            <span className="category-actions" style={{ marginLeft: 'auto' }}>
              <Tooltip title="新增分类到该分组">
                <Button
                  type="text"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddMode('category');
                    setAddParentCategoryValue(null);
                    setAddTargetGroupKey(group.key);
                    setIsAddCategoryModalVisible(true);
                  }}
                  icon={<PlusOutlined className="transparent-maintain-icon" />}
                  aria-label="新增到分组"
                />
              </Tooltip>
              <Dropdown
                trigger={["click"]}
                overlayClassName="side-more-menu"
                menu={{ items: getGroupMoreMenuItems(group, depth), onClick: (ev) => onGroupMenuClick(ev, group, depth) }}
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
        </span>
      ),
      selectable: false,
      children: [...catChildren, ...subGroupChildren]
    };
  };

  // 构建“移动到”弹窗使用的树形数据（分组可选，分类不可选）
  const buildMoveTreeGroupNode = (group, depth = 1) => {
    const catChildren = (group.childrenValues || [])
      .map(val => systemCategories.find(c => c.value === val))
      .filter(Boolean)
      .map(cat => ({ key: cat.value, title: renderTreeNodeTitle(cat, { hideActions: true }), isLeaf: true, selectable: true, parentGroupKey: group.key }));
    const subGroupChildren = (group.groups || []).map(sub => buildMoveTreeGroupNode(sub, depth + 1));
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
          {depth === 1 && group.templateId ? (
            <span style={{ marginLeft: 8, fontSize: 12, color: '#94a3b8' }}>已绑定模版</span>
          ) : null}
        </span>
      ),
      selectable: false,
      children: [...catChildren, ...subGroupChildren]
    };
  };

  const treeData = groupDefinitions.map(g => buildGroupNode(g, 1));
  const moveTreeData = groupDefinitions.map(g => buildMoveTreeGroupNode(g, 1));
  
  // 移除“我的分类”树中的“置顶”分组以避免重复显示
  // （顶部区域仍显示置顶分类，这里不重复渲染）
  
  // 其余未分配的系统分类进入"其他"分组，但要排除置顶的分类
  const pinnedValues = new Set(pinnedCategoriesFromExtra.map(c => c.value));
  console.log('=== 过滤"其他"分组 ===');
  console.log('assignedValues:', Array.from(assignedValues));
  console.log('pinnedValues:', Array.from(pinnedValues));
  console.log('systemCategories:', systemCategories.map(c => ({ value: c.value, pinned: c.pinned, type: c.type })));
    
  const restCategories = systemCategories.filter(c => {
    const isAssigned = assignedValues.has(c.value);
    const isPinned = pinnedValues.has(c.value);
    const shouldInclude = !isAssigned && !isPinned;
    console.log(`分类 ${c.value}: assigned=${isAssigned}, pinned=${isPinned}, include=${shouldInclude}`);
    return shouldInclude;
  });
    
  console.log('restCategories (将进入"其他"分组):', restCategories.map(c => c.value));
  console.log('======================');
    
  if (restCategories.length) {
    treeData.push({
      key: 'group_other',
      title: <span style={{ fontWeight: 600, color: '#6b7280' }}>其他</span>,
      selectable: false,
      children: restCategories.map(cat => ({ key: cat.value, title: renderTreeNodeTitle(cat), isLeaf: true }))
    });
  }

  return (
    <Sider width={280} className="notes-sidebar">
      <div className="sidebar-content">
        {/* 顶部固定区域：搜索框、组织培训、专业分类 */}
        <div className="sidebar-top">
          {/* 搜索框 */}
          <Search
            placeholder="搜索主题"
            allowClear
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />

          {/* 顶部分类列表：组织培训 + 培训需求管理 + 专业分类 */}
          <div className="category-section">
            <div className="category-list">
              {/* 固定显示组织培训分类 */}
              <div key="organizational_training_wrapper">
                {renderCategoryItem({
                  value: 'organizational_training',
                  label: '组织培训',
                  icon: 'TeamOutlined',
                  type: 'system'
                })}
              </div>
          
              {/* 培训需求管理（在组织培训下面） */}
              <div key="training_needs_management_wrapper">
                {renderCategoryItem({
                  value: 'training_needs_management',
                  label: '培训需求管理',
                  icon: 'FileTextOutlined',
                  type: 'system'
                })}
              </div>

              {/* 置顶的自定义分类：显示在培训需求管理下面 */}
              {pinnedCategoriesFromExtra.map(category => (
                <div key={category.value}>
                  {renderCategoryItem(category)}
                </div>
              ))}

              {/* 专业分类（在组织培训下面） */}
              <div className="category-group" key="fixed_categories">
                <div className="category-group-title">专业分类</div>
                {categories
                  .filter(category => category.type === 'fixed')
                  .map(category => (
                    <div key={category.value}>{renderCategoryItem(category)}</div>
                  ))}
              </div>

              {/* 自定义分类（区分置顶和非置顶） */}
              {(() => {
                // 从 categories prop 中获取自定义分类（未置顶的）
                const customCategories = categories.filter(category => category.type === 'custom' && !category.pinned);
                
                return (
                  <>
                    {/* 普通自定义分类：显示在自定义分类区域 */}
                    {customCategories.length > 0 && (
                      <div className="category-group" key="custom_categories">
                        <div className="category-group-title">自定义分类</div>
                        {customCategories.map(category => (
                          <div key={category.value}>{renderCategoryItem(category)}</div>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}

              {/* 系统分类标题（固定在顶部区域，支持悬停操作：更多、新增一级） */}
              <div className="category-group" key="system_categories_header">
                <div className="category-group-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>我的分类</span>
                  {onOpenSystemCategoryManager && (
                    <span className="category-actions">
                      <Tooltip title="新增一级分类">
                        <Button
                          type="text"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAddMode('group');
                            setAddParentCategoryValue(null);
                            setSelectedTemplateId(null);
                            setIsAddCategoryModalVisible(true);
                          }}
                          icon={<PlusOutlined className="transparent-maintain-icon" />}
                          aria-label="新增一级分类"
                        />
                      </Tooltip>
                      {/* 按要求移除系统分类标题右侧的“更多”按钮 */}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部区域：系统分类树形展示，内容过多时可滚动（隐藏滚动条 + 箭头指示） */}
        <div
          className="sidebar-bottom"
          ref={sidebarBottomRef}
          onMouseEnter={() => { setIsBottomHovered(true); updateScrollArrows(); }}
          onMouseLeave={() => { setIsBottomHovered(false); updateScrollArrows(); }}
        >
          {showTopArrow && (
            <div
              className="collapsed-top-arrow"
              onClick={() => {
                const el = sidebarBottomRef.current;
                if (el) {
                  el.scrollBy({ top: -160, behavior: 'smooth' });
                }
              }}
            >
              <div className="arrow-pill">
                <UpOutlined style={{ fontSize: 16, color: '#3b82f6' }} />
              </div>
            </div>
          )}
          <div className="category-section">
            <div className="category-group system-group" key="system_categories">
              <Tree
                blockNode
                showLine={false}
                defaultExpandAll
                selectedKeys={
                  systemCategories.some(c => c.value === selectedCategory)
                    ? [selectedCategory]
                    : []
                }
                treeData={treeData}
                onSelect={(keys, info) => {
                  const key = info?.node?.key;
                  const isLeaf = info?.node?.isLeaf;
                  if (isLeaf && typeof key === 'string') {
                    onCategoryChange(key);
                  }
                }}
              />
            </div>
          </div>
          {showBottomArrow && (
            <div
              className="collapsed-bottom-arrow"
              onClick={() => {
                const el = sidebarBottomRef.current;
                if (el) {
                  el.scrollBy({ top: 160, behavior: 'smooth' });
                }
              }}
            >
              <div className="arrow-pill">
                <DownOutlined style={{ fontSize: 16, color: '#3b82f6' }} />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* 新增系统分类弹窗 */}
      <Modal
        open={isAddCategoryModalVisible}
        title={addMode === 'group' ? '新增一级分类' : '新增系统分类'}
        okText="添加"
        cancelText="取消"
        onOk={async () => {
          const label = String(newCategoryLabel || '').trim();
          if (!label) {
            message.warning('请输入分类名称');
            return;
          }
          const current = getSystemCategoryConfig();

          if (addMode === 'group') {
            // 新增一级分组（一级分类）
            const baseSlug = label
              .toLowerCase()
              .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '_')
              .replace(/^_+|_+$/g, '') || `group_${Date.now()}`;
            const existingGroupKeys = new Set((current.groups || []).map(g => g.key));
            let newKey = `group_${baseSlug}`;
            let i = 1;
            while (existingGroupKeys.has(newKey)) {
              newKey = `group_${baseSlug}_${i++}`;
            }
            const newGroup = {
              key: newKey,
              title: label,
              templateId: selectedTemplateId || null,
              icon: 'FolderOpenOutlined',
              childrenValues: [],
              groups: []
            };
            const nextConfig = { ...current, groups: [ ...(current.groups || []), newGroup ] };
            const ok = saveSystemCategoryConfig(nextConfig);
            if (ok) {
              message.success('已新增一级分类');
              setIsAddCategoryModalVisible(false);
              setNewCategoryLabel('');
              setAddParentCategoryValue(null);
              setAddMode('category');
              setSelectedTemplateId(null);
              setRefreshTick(Date.now());
            } else {
              message.error('保存失败，请稍后重试');
            }
            return;
          }

          // 模式：新增系统分类并“挂载到悬停分类下”
          // 具体做法：在该分类所属分组下为此分类创建/使用一个同名子分组，
          // 将该分类与新分类作为此子分组的叶子，从而在树结构里显示为“在该分类下”。
          const existingValues = new Set([
            ...((categories || []).map(c => c.value)),
            ...((current?.extraCategories || []).map(c => c.value))
          ]);
          const baseSlug = label
            .toLowerCase()
            .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '_')
            .replace(/^_+|_+$/g, '') || `sys_${Date.now()}`;
          let newValue = baseSlug;
          let idx = 1;
          while (existingValues.has(newValue)) {
            newValue = `${baseSlug}_${idx++}`;
          }

          const findGroupByCategory = (groups = [], selectedVal, depth = 1) => {
            for (const g of groups) {
              if ((g.childrenValues || []).includes(selectedVal)) {
                return { key: g.key, depth };
              }
              const sub = findGroupByCategory(g.groups || [], selectedVal, depth + 1);
              if (sub) return sub;
            }
            return null;
          };
          const loc = addParentCategoryValue
            ? findGroupByCategory(current.groups || [], addParentCategoryValue, 1)
            : null;
          const targetGroupKey = addTargetGroupKey || loc?.key || (current.groups?.[0]?.key ?? null);

          const newCat = { value: newValue, label, icon: newCategoryIcon || 'FileTextOutlined', type: 'system' };
          let nextConfig = { 
            ...current, 
            extraCategories: [ ...(current?.extraCategories || []), newCat ]
          };

          const updateGroupByKey = (configObj, targetKey, updater) => {
            const updateGroups = (groups = [], depth = 1) => groups.map(g => {
              const updated = g.key === targetKey ? updater(g) : g;
              return { ...updated, groups: updateGroups(updated.groups || [], depth + 1) };
            });
            return { ...configObj, groups: updateGroups(configObj.groups || [], 1) };
          };

          if (targetGroupKey && addParentCategoryValue) {
            // 计算“悬停分类”的显示名称
            const parentInfo =
              (categories || []).find(c => c.value === addParentCategoryValue) ||
              (current?.extraCategories || []).find(c => c.value === addParentCategoryValue) ||
              { label: addParentCategoryValue };
            const subgroupKey = `group_cat_${addParentCategoryValue}`;

            nextConfig = updateGroupByKey(nextConfig, targetGroupKey, (g) => {
              // 从父分组的 childrenValues 中移除悬停分类，使其转入子分组
              const filteredChildren = (g.childrenValues || []).filter(v => v !== addParentCategoryValue);
              // 找或建此分类的子分组
              let found = (g.groups || []).find(sub => sub.key === subgroupKey);
              let newGroups = (g.groups || []).slice();
              if (!found) {
                found = {
                  key: subgroupKey,
                  title: parentInfo.label || addParentCategoryValue,
                  templateId: null,
                  icon: 'FolderOpenOutlined',
                  childrenValues: [],
                  groups: []
                };
                newGroups.push(found);
              }
              // 更新子分组：仅包含新分类（以及已存在的子分类），不重复父分类
              const subChildren = Array.from(new Set([ ...(found.childrenValues || []), newValue ]));
              const updatedSub = { ...found, childrenValues: subChildren };
              newGroups = newGroups.map(sub => sub.key === subgroupKey ? updatedSub : sub);
              return { ...g, childrenValues: filteredChildren, groups: newGroups };
            });
          } else if (targetGroupKey) {
            // 直接将新分类加入目标分组的 childrenValues（用于分组标题的新增）
            nextConfig = updateGroupByKey(nextConfig, targetGroupKey, (g) => ({
              ...g,
              childrenValues: Array.from(new Set([ ...(g.childrenValues || []), newValue ]))
            }));
          }

          const ok = saveSystemCategoryConfig(nextConfig);
          if (ok) {
            message.success('已新增系统分类并挂载到所属分组');
            setIsAddCategoryModalVisible(false);
            setNewCategoryLabel('');
            setAddParentCategoryValue(null);
            setAddTargetGroupKey(null);
            setAddMode('category');
            setNewCategoryIcon('');
            setRefreshTick(Date.now());
          } else {
            message.error('保存失败，请稍后重试');
          }
        }}
        onCancel={() => {
          setIsAddCategoryModalVisible(false);
          setNewCategoryLabel('');
          setAddParentCategoryValue(null);
          setAddTargetGroupKey(null);
          setAddMode('category');
          setSelectedTemplateId(null);
          setNewCategoryIcon('');
        }}
      >
        <Input
          placeholder="输入分类名称"
          value={newCategoryLabel}
          onChange={(e) => setNewCategoryLabel(e.target.value)}
        />
        {addMode === 'group' && (
          <Select
            value={selectedTemplateId || undefined}
            onChange={(val) => setSelectedTemplateId(val || null)}
            loading={loadingTemplates}
            allowClear
            placeholder="选择智能体（仅一级分类可选）"
            style={{ width: '100%', marginTop: 12 }}
            options={(availableTemplates || []).map(t => ({ label: t.name, value: t.id }))}
          />
        )}
        {addMode === 'category' && (
          <div style={{ marginTop: 12 }}>
            <Space wrap>
              <Select
                value={(newCategoryIcon && newCategoryIcon.length <= 2) ? undefined : (newCategoryIcon || undefined)}
                onChange={(val) => setNewCategoryIcon(val || '')}
                placeholder="选择常用图标（可选）"
                style={{ width: 220 }}
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
                value={(newCategoryIcon && newCategoryIcon.length <= 2) ? newCategoryIcon : ''}
                onChange={(e) => setNewCategoryIcon(e.target.value)}
                placeholder="或输入emoji，如📄、📘"
                style={{ width: 160 }}
              />
              <Space>
                <span style={{ color: '#666' }}>预览：</span>
                {(newCategoryIcon && newCategoryIcon.length <= 2) ? (
                  <span style={{ fontSize: 14, lineHeight: '14px', opacity: 0.8 }}>{newCategoryIcon || ''}</span>
                ) : newCategoryIcon ? (
                  (() => {
                    const match = iconOptions.find(i => i.value === newCategoryIcon);
                    const IconComp = match ? match.Icon : FileTextOutlined;
                    return <IconComp style={{ fontSize: 14, color: '#94a3b8' }} />;
                  })()
                ) : (
                  <FileTextOutlined style={{ fontSize: 14, color: '#94a3b8' }} />
                )}
              </Space>
            </Space>
          </div>
        )}
      </Modal>
      {/* 绑定主题模版（仅一级分组） */}
      <Modal
        open={isTemplateModalVisible}
        title={'绑定智能体'}
        okText="保存"
        cancelText="取消"
        onOk={() => {
          const current = getSystemCategoryConfig();
          const next = updateGroupByKey(current, templateTargetGroupKey, (g) => ({
            ...g,
            templateId: selectedTemplateId || null
          }));
          const ok = saveSystemCategoryConfig(next);
          if (ok) {
            message.success('已更新智能体');
            setIsTemplateModalVisible(false);
            setTemplateTargetGroupKey(null);
            setSelectedTemplateId(null);
            setRefreshTick(Date.now());
          } else {
            message.error('保存失败，请稍后重试');
          }
        }}
        onCancel={() => {
          setIsTemplateModalVisible(false);
          setTemplateTargetGroupKey(null);
          setSelectedTemplateId(null);
        }}
      >
        <Select
          value={selectedTemplateId || undefined}
          onChange={(val) => setSelectedTemplateId(val || null)}
          loading={loadingTemplates}
          allowClear
          placeholder="选择智能体（仅一级分组）"
          style={{ width: '100%' }}
          options={(availableTemplates || []).map(t => ({ label: t.name, value: t.id }))}
        />
      </Modal>
      {/* 重命名弹窗 */}
      <Modal
        open={isRenameModalVisible}
        title={renameTarget?.type === 'group' ? '重命名分组' : '重命名分类'}
        okText="保存"
        cancelText="取消"
        onOk={() => {
          const nextLabel = String(renameLabel || '').trim();
          if (!nextLabel) {
            message.warning('请输入新名称');
            return;
          }
          const current = getSystemCategoryConfig();
          let ok = false;
          if (renameTarget?.type === 'category') {
            const isExtra = (current?.extraCategories || []).some(c => c.value === renameTarget.value);
            if (!isExtra) {
              message.warning('内置系统分类暂不支持直接重命名');
            } else {
              const next = {
                ...current,
                extraCategories: (current.extraCategories || []).map(c =>
                  c.value === renameTarget.value ? { ...c, label: nextLabel } : c
                )
              };
              ok = saveSystemCategoryConfig(next);
            }
          } else if (renameTarget?.type === 'group') {
            const next = updateGroupByKey(current, renameTarget.key, g => ({ ...g, title: nextLabel }));
            ok = saveSystemCategoryConfig(next);
          }
          if (ok) {
            message.success('已保存');
            setIsRenameModalVisible(false);
            setRenameTarget(null);
            setRenameLabel('');
            setRefreshTick(Date.now());
          } else if (renameTarget?.type !== 'category' || (current?.extraCategories || []).some(c => c.value === renameTarget?.value)) {
            message.error('保存失败，请稍后重试');
          }
        }}
        onCancel={() => {
          setIsRenameModalVisible(false);
          setRenameTarget(null);
          setRenameLabel('');
        }}
      >
        <Input
          placeholder="输入新名称"
          value={renameLabel}
          onChange={(e) => setRenameLabel(e.target.value)}
        />
      </Modal>

      {/* 移动弹窗 */}
      <Modal
        open={isMoveModalVisible}
        title={moveTarget?.type === 'category' ? '移动分类到分组' : '移动到'}
        okText="移动"
        cancelText="取消"
        onOk={() => {
          if (!moveTargetGroupKey) {
            message.warning('请选择目标分类');
            return;
          }
          const current = getSystemCategoryConfig();
          let next = removeCategoryFromAllGroups(current, moveTarget?.value);
          next = updateGroupByKey(next, moveTargetGroupKey, (g) => ({
            ...g,
            childrenValues: Array.from(new Set([ ...(g.childrenValues || []), moveTarget?.value ].filter(Boolean)))
          }));
          const ok = saveSystemCategoryConfig(next);
          if (ok) {
            message.success('已移动');
            setIsMoveModalVisible(false);
            setMoveTarget(null);
            setMoveTargetGroupKey(null);
            setMoveSelectedKey(null);
            setRefreshTick(Date.now());
          } else {
            message.error('操作失败，请稍后重试');
          }
        }}
        onCancel={() => {
          setIsMoveModalVisible(false);
          setMoveTarget(null);
          setMoveTargetGroupKey(null);
          setMoveSelectedKey(null);
        }}
      >
        <div style={{ marginBottom: 8, color: '#64748b' }}>请选择目标分类（将移动到其所在分组）</div>
        <Tree
          blockNode
          showLine={false}
          defaultExpandAll
          selectedKeys={moveSelectedKey ? [moveSelectedKey] : []}
          treeData={moveTreeData}
          onSelect={(keys, info) => {
            const key = info?.node?.key;
            const isLeaf = info?.node?.isLeaf;
            if (isLeaf && typeof key === 'string') {
              setMoveSelectedKey(key);
              const parentKey = info?.node?.parentGroupKey;
              if (parentKey) setMoveTargetGroupKey(parentKey);
            }
          }}
        />
      </Modal>
    </Sider>
  );
};

export default NotesSidebar;