import React, { useState, useEffect, useMemo } from 'react';
import { Tree, Checkbox, Input, Button, Space, Tag, Tooltip, Empty, Card, Badge, Rate, Typography, Divider } from 'antd';
import { 
  SearchOutlined, 
  FileTextOutlined, 
  VideoCameraOutlined, 
  LinkOutlined,
  DownOutlined,
  RightOutlined,
  UpOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  PlayCircleOutlined,
  BookOutlined,
  ExperimentOutlined,
  ToolOutlined,
  FileSearchOutlined,
  FormOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EyeOutlined,
  DownloadOutlined,
  StarOutlined,
  TrophyOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { trainingCategories, ResourceType, DifficultyLevel } from '../data/trainingCourseMockData';

const { Search } = Input;
const { Text, Title } = Typography;

// 资源类型图标映射 - 使用更现代的图标和渐变色
const resourceTypeIcons = {
  [ResourceType.COURSE]: <BookOutlined style={{ color: '#1890ff', fontSize: '16px' }} />,
  [ResourceType.VIDEO]: <PlayCircleOutlined style={{ color: '#f5222d', fontSize: '16px' }} />,
  [ResourceType.DOCUMENT]: <FileTextOutlined style={{ color: '#52c41a', fontSize: '16px' }} />,
  [ResourceType.CASE_STUDY]: <ExperimentOutlined style={{ color: '#fa8c16', fontSize: '16px' }} />,
  [ResourceType.TOOL]: <ToolOutlined style={{ color: '#722ed1', fontSize: '16px' }} />,
  [ResourceType.ASSESSMENT]: <FileSearchOutlined style={{ color: '#13c2c2', fontSize: '16px' }} />,
  [ResourceType.TEMPLATE]: <FormOutlined style={{ color: '#eb2f96', fontSize: '16px' }} />,
  [ResourceType.RESEARCH]: <BulbOutlined style={{ color: '#faad14', fontSize: '16px' }} />
};

// 分类图标映射 - 为不同分类添加特色图标
const categoryIcons = {
  'math-methods': <BulbOutlined style={{ color: '#1890ff', fontSize: '18px' }} />,
  'interactive-tools': <ExperimentOutlined style={{ color: '#722ed1', fontSize: '18px' }} />,
  'design-guides': <FormOutlined style={{ color: '#52c41a', fontSize: '18px' }} />,
  'management-skills': <ToolOutlined style={{ color: '#fa8c16', fontSize: '18px' }} />,
  'default': <FolderOutlined style={{ color: '#8c8c8c', fontSize: '18px' }} />
};

// 难度等级颜色映射 - 使用更丰富的颜色方案
const difficultyColors = {
  [DifficultyLevel.BEGINNER]: '#52c41a',
  [DifficultyLevel.INTERMEDIATE]: '#faad14', 
  [DifficultyLevel.ADVANCED]: '#f5222d'
};

// 难度等级标签映射
const difficultyLabels = {
  [DifficultyLevel.BEGINNER]: '初级',
  [DifficultyLevel.INTERMEDIATE]: '中级',
  [DifficultyLevel.ADVANCED]: '高级'
};

const ResourceTreeView = ({ 
  onResourceSelect, 
  selectedResources = [], 
  showCheckbox = true,
  expandAll = false,
  searchable = true 
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState(selectedResources);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  // 初始化展开状态
  useEffect(() => {
    if (expandAll) {
      const allKeys = trainingCategories.map(category => category.id);
      setExpandedKeys(allKeys);
    }
  }, [expandAll]);

  // 构建树形数据
  const treeData = useMemo(() => {
    const filterResources = (resources, searchTerm) => {
      if (!searchTerm) return resources;
      
      return resources.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    };

    return trainingCategories.map(category => {
      const filteredResources = filterResources(category.resources, searchValue);
      
      // 如果搜索后该分类下没有资源，且有搜索条件，则不显示该分类
      if (searchValue && filteredResources.length === 0) {
        return null;
      }

      return {
        title: (
          <div className="category-node">
            <span className="category-icon">
              {categoryIcons[category.id] || categoryIcons['default']}
            </span>
            <span className="category-name">
              {category.name}
            </span>
            <span className="resource-count">
              ({filteredResources.length})
            </span>
          </div>
        ),
        key: category.id,
        children: filteredResources.map(resource => ({
          title: (
            <div className="resource-node">
              <span className="resource-icon">
                {resourceTypeIcons[resource.type]}
              </span>
              <span className="resource-title">
                {resource.title}
              </span>
            </div>
          ),
          key: `${category.id}-${resource.id}`,
          isLeaf: true,
          resourceData: resource,
          categoryData: category
        }))
      };
    }).filter(Boolean);
  }, [searchValue]);

  // 处理展开/收起
  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  // 处理选择
  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
    
    // 获取选中的资源数据
    const selectedResourceData = [];
    const flattenTree = (nodes) => {
      nodes.forEach(node => {
        if (node.isLeaf && checkedKeysValue.includes(node.key)) {
          selectedResourceData.push({
            ...node.resourceData,
            categoryId: node.categoryData.id,
            categoryName: node.categoryData.name
          });
        }
        if (node.children) {
          flattenTree(node.children);
        }
      });
    };
    
    flattenTree(treeData);
    
    if (onResourceSelect) {
      onResourceSelect(selectedResourceData);
    }
  };

  // 处理节点选择（单击）
  const onSelect = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
    
    if (info.node.isLeaf && info.node.resourceData) {
      // 可以在这里处理单个资源的选择事件
      console.log('Selected resource:', info.node.resourceData);
    }
  };

  // 搜索时自动展开匹配的节点
  useEffect(() => {
    if (searchValue) {
      const expandedKeysForSearch = trainingCategories
        .filter(category => 
          category.resources.some(resource =>
            resource.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchValue.toLowerCase()) ||
            resource.tags.some(tag => tag.toLowerCase().includes(searchValue.toLowerCase()))
          )
        )
        .map(category => category.id);
      
      setExpandedKeys(expandedKeysForSearch);
      setAutoExpandParent(true);
    }
  }, [searchValue]);

  // 计算选中状态
  const getCheckedStatus = () => {
    const totalResources = trainingCategories.reduce((sum, category) => sum + category.resources.length, 0);
    const checkedCount = checkedKeys.length;
    
    if (checkedCount === 0) {
      return { checked: false, indeterminate: false };
    } else if (checkedCount === totalResources) {
      return { checked: true, indeterminate: false };
    } else {
      return { checked: false, indeterminate: true };
    }
  };

  const checkedStatus = getCheckedStatus();

  // 全选/取消全选
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allResourceKeys = [];
      trainingCategories.forEach(category => {
        category.resources.forEach(resource => {
          allResourceKeys.push(`${category.id}-${resource.id}`);
        });
      });
      setCheckedKeys(allResourceKeys);
      
      // 通知父组件
      const allResources = [];
      trainingCategories.forEach(category => {
        category.resources.forEach(resource => {
          allResources.push({
            ...resource,
            categoryId: category.id,
            categoryName: category.name
          });
        });
      });
      
      if (onResourceSelect) {
        onResourceSelect(allResources);
      }
    } else {
      setCheckedKeys([]);
      if (onResourceSelect) {
        onResourceSelect([]);
      }
    }
  };

  if (treeData.length === 0 && searchValue) {
    return (
      <div className="resource-tree-container">
        {searchable && (
          <div className="tree-header">
            <Search
              placeholder="搜索培训课程和学习资源..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ marginBottom: 16 }}
              allowClear
            />
          </div>
        )}
        <Empty 
          description="未找到匹配的资源"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="resource-tree-container">
      {searchable && (
        <div className="search-section">
          <Search
            placeholder="🔍 搜索培训课程和学习资源..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            allowClear
            size="large"
            className="modern-search"
          />
        </div>
      )}
      
      {showCheckbox && (
        <div className="tree-controls">
          <Checkbox
            checked={checkedStatus.checked}
            indeterminate={checkedStatus.indeterminate}
            onChange={handleSelectAll}
            className="select-all-checkbox"
          >
            <span className="checkbox-label">
              全选资源 
              <span className="selection-count">({checkedKeys.length} 项已选)</span>
            </span>
          </Checkbox>
          <div className="control-buttons">
            <Button 
              type="primary"
              size="small"
              icon={<DownOutlined />}
              onClick={() => setExpandedKeys(trainingCategories.map(c => c.id))}
              className="expand-btn"
            >
              展开全部
            </Button>
            <Button 
              size="small"
              icon={<UpOutlined />}
              onClick={() => setExpandedKeys([])}
              className="collapse-btn"
            >
              收起全部
            </Button>
          </div>
        </div>
      )}

      <Tree
        checkable={showCheckbox}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={treeData}
        showIcon
        switcherIcon={({ expanded }) => 
          expanded ? <DownOutlined /> : <RightOutlined />
        }
        className="resource-tree"
      />

      <style jsx>{`
        .resource-tree-container {
          padding: 0;
          background: transparent;
        }

        .tree-header {
          margin-bottom: 12px;
          padding: 0 8px;
        }

        .tree-controls {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          padding: 8px;
          background: transparent;
        }

        .select-all-checkbox {
          margin-right: 12px;
        }

        .checkbox-label {
          font-size: 13px;
          color: var(--theme-textSecondary);
        }

        .selection-count {
          color: var(--theme-primary);
          font-weight: 500;
        }

        .control-buttons {
          margin-left: auto;
          display: flex;
          gap: 4px;
        }

        .expand-btn,
        .collapse-btn {
          font-size: 12px;
          height: 24px;
          padding: 0 8px;
        }

        .resource-tree {
          background: transparent;
        }

        .resource-tree :global(.ant-tree-treenode) {
          padding: 1px 0;
        }

        .resource-tree :global(.ant-tree-node-content-wrapper) {
          width: 100%;
          padding: 0;
          border-radius: 6px;
          transition: background-color 0.2s ease;
        }

        .resource-tree :global(.ant-tree-node-content-wrapper:hover) {
          background: rgba(0, 0, 0, 0.04);
        }

        .resource-tree :global(.ant-tree-node-selected .ant-tree-node-content-wrapper) {
          background: rgba(24, 144, 255, 0.1) !important;
        }

        .resource-tree :global(.ant-tree-switcher) {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          margin-right: 4px;
        }

        .resource-tree :global(.ant-tree-switcher-icon) {
          font-size: 12px;
          color: var(--theme-textSecondary);
        }

        .resource-tree :global(.ant-tree-checkbox) {
          margin-right: 6px;
        }

        .resource-tree :global(.ant-tree-iconEle) {
          margin-right: 6px;
          font-size: 14px;
        }

        .category-node {
          display: flex;
          align-items: center;
          padding: 6px 8px;
          font-size: 13px;
          font-weight: 500;
          color: var(--theme-text);
        }

        .category-icon {
          font-size: 14px !important;
          margin-right: 6px !important;
          color: var(--theme-primary);
        }

        .category-name {
          font-weight: 500 !important;
          font-size: 13px;
          color: var(--theme-text);
        }

        .resource-count {
          font-size: 11px;
          color: var(--theme-textSecondary);
          margin-left: 6px;
          background: rgba(0, 0, 0, 0.05);
          padding: 1px 4px;
          border-radius: 8px;
        }

        .resource-node {
          display: flex;
          align-items: center;
          padding: 4px 8px;
          font-size: 13px;
        }

        .resource-icon {
          margin-right: 6px !important;
          font-size: 13px;
          color: var(--theme-textSecondary);
        }

        .resource-title {
          font-weight: 400 !important;
          font-size: 13px;
          color: var(--theme-text);
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};

export default ResourceTreeView;