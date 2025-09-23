import React, { useState, useEffect, useMemo } from 'react';
import { 
  Tree, 
  Input, 
  Select, 
  Button, 
  Space, 
  Card, 
  Modal, 
  Descriptions, 
  Tag, 
  Badge,
  Spin,
  Empty,
  message,
  Row,
  Col,
  Typography,
  Divider
} from 'antd';
import { 
  FolderOutlined, 
  UserOutlined,
  PlusOutlined, 
  EyeOutlined, 
  SearchOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  StarOutlined,
  ExclamationCircleOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import './StudentAnnotationTree.css';
import {
  PersonnelType,
  AnnotationStatus,
  TreeNodeType
} from '../types/organizationPersonnelTree.js';
import {
  createMockOrganizationPersonnelTree,
  searchPersonnelAnnotations
} from '../data/organizationPersonnelMockData.js';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

// 状态图标映射
const statusIcons = {
  [AnnotationStatus.PENDING]: <ClockCircleOutlined style={{ color: '#faad14' }} />,
  [AnnotationStatus.IN_PROGRESS]: <SyncOutlined spin style={{ color: '#1890ff' }} />,
  [AnnotationStatus.COMPLETED]: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
  [AnnotationStatus.REVIEWED]: <StarOutlined style={{ color: '#722ed1' }} />,
  [AnnotationStatus.REJECTED]: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
};

// 人员类型图标映射
const personnelTypeIcons = {
  [PersonnelType.TEACHER]: <UserOutlined style={{ color: '#1890ff' }} />,
  [PersonnelType.STUDENT]: <TeamOutlined style={{ color: '#fa8c16' }} />,
  [PersonnelType.ADMIN]: <StarOutlined style={{ color: '#52c41a' }} />,
  [PersonnelType.STAFF]: <UserOutlined style={{ color: '#722ed1' }} />,
  [PersonnelType.GUEST]: <UserOutlined style={{ color: '#13c2c2' }} />,
  [PersonnelType.EXTERNAL]: <GlobalOutlined style={{ color: '#8c8c8c' }} />
};

// 状态标签颜色映射
const statusColors = {
  [AnnotationStatus.PENDING]: 'orange',
  [AnnotationStatus.IN_PROGRESS]: 'blue',
  [AnnotationStatus.COMPLETED]: 'green',
  [AnnotationStatus.REVIEWED]: 'purple',
  [AnnotationStatus.REJECTED]: 'red'
};

const StudentAnnotationTree = ({ onPersonnelSelect }) => {
  const [treeManager] = useState(createMockOrganizationPersonnelTree());
  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState(['root']);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPersonnelType, setFilterPersonnelType] = useState('');

  // 转换树数据为Ant Design Tree组件格式
  const convertToTreeData = (node) => {
    const isPersonnel = node.type === TreeNodeType.PERSONNEL;
    const isCategory = node.type === TreeNodeType.CATEGORY;
    
    let title = (
      <div className="tree-node-title">
        <Space size="small">
          {isPersonnel ? <UserOutlined /> : <FolderOutlined />}
          <span className="node-name">{node.name}</span>
          
          {isCategory && (
            <Badge count={node.children.length} size="small" color="#1890ff" />
          )}
        </Space>
      </div>
    );

    const treeNode = {
      key: node.id,
      title,
      children: node.children.map(child => convertToTreeData(child)),
      isLeaf: node.children.length === 0,
      data: node
    };

    return treeNode;
  };

  // 更新树数据
  const updateTreeData = () => {
    const rootNode = treeManager.getTreeData();
    const converted = rootNode.children.map(child => convertToTreeData(child));
    setTreeData(converted);
  };

  // 初始化
  useEffect(() => {
    updateTreeData();
    // 默认展开所有分类节点
    const categoryKeys = treeManager.getFlatNodes()
      .filter(node => node.type === TreeNodeType.CATEGORY)
      .map(node => node.id);
    setExpandedKeys(['root', ...categoryKeys]);
  }, [treeManager]);

  // 搜索处理
  const handleSearch = (value) => {
    setSearchValue(value);
    if (value) {
      const results = searchPersonnelAnnotations(treeManager, value, {
        status: filterStatus,
        personnelType: filterPersonnelType
      });
      
      // 展开包含搜索结果的节点
      const expandKeys = new Set(['root']);
      results.forEach(node => {
        if (node.path) {
          node.path.forEach(pathId => expandKeys.add(pathId));
        }
        if (node.parentId) {
          expandKeys.add(node.parentId);
        }
      });
      setExpandedKeys(Array.from(expandKeys));
    }
  };

  // 节点选择处理 - 保持单选用于查看详情
  const handleSelect = (selectedKeys, info) => {
    setSelectedKeys(selectedKeys);
    if (selectedKeys.length > 0) {
      const nodeId = selectedKeys[0];
      const node = treeManager.findNode(nodeId);
      setSelectedNode(node);
    } else {
      setSelectedNode(null);
    }
  };

  // 新增：复选框选择处理 - 用于多选
  const handleCheck = (checkedKeys, info) => {
    setCheckedKeys(checkedKeys);
    
    // 获取选中的人员节点
    const selectedPersonnel = [];
    const checkedKeysArray = Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked;
    
    checkedKeysArray.forEach(key => {
      const node = treeManager.findNode(key);
      if (node && node.type === TreeNodeType.PERSONNEL) {
        selectedPersonnel.push(node);
      }
    });
    
    // 调用回调函数，传递选中的人员数组
    if (onPersonnelSelect) {
      onPersonnelSelect(selectedPersonnel);
    }
  };

  // 节点展开处理
  const handleExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
  };

  // 显示详情模态框
  const showDetailModal = (node) => {
    setSelectedNode(node);
    setDetailModalVisible(true);
  };

  // 过滤树节点
  const filterTreeData = (nodes, searchValue) => {
    return nodes.filter(node => {
      const matchesSearch = !searchValue || 
        node.data.name.toLowerCase().includes(searchValue.toLowerCase());

      const hasMatchingChildren = node.children && 
        filterTreeData(node.children, searchValue).length > 0;

      return matchesSearch || hasMatchingChildren;
    }).map(node => ({
      ...node,
      children: node.children ? 
        filterTreeData(node.children, searchValue) : []
    }));
  };

  const filteredTreeData = useMemo(() => {
    return filterTreeData(treeData, searchValue);
  }, [treeData, searchValue]);

  return (
    <div className="personnel-annotation-tree">
      <Card className="tree-header-card">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Search
              placeholder="搜索人员姓名..."
              allowClear
              onSearch={handleSearch}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card 
            title="人员组织结构" 
            className="tree-main-card"
          >
            {filteredTreeData.length > 0 ? (
              <Tree
                showIcon
                showLine={{ showLeafIcon: false }}
                checkable
                expandedKeys={expandedKeys}
                selectedKeys={selectedKeys}
                checkedKeys={checkedKeys}
                treeData={filteredTreeData}
                onSelect={handleSelect}
                onCheck={handleCheck}
                onExpand={handleExpand}
                className="personnel-tree"
              />
            ) : (
              <Empty 
                description="没有找到匹配的人员"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* 详情模态框 */}
      <Modal
        title={selectedNode?.name}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedNode && selectedNode.type === TreeNodeType.PERSONNEL && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="姓名">{selectedNode.name}</Descriptions.Item>
            <Descriptions.Item label="职位">{selectedNode.position}</Descriptions.Item>
            <Descriptions.Item label="部门">{selectedNode.department}</Descriptions.Item>
            <Descriptions.Item label="人员类型">
              {personnelTypeIcons[selectedNode.personnelType]} {selectedNode.personnelType}
            </Descriptions.Item>
            <Descriptions.Item label="标注状态">
              <Tag color={statusColors[selectedNode.annotationStatus]}>
                {statusIcons[selectedNode.annotationStatus]}
                {selectedNode.annotationStatus}
              </Tag>
            </Descriptions.Item>
            {selectedNode.email && (
              <Descriptions.Item label="邮箱">{selectedNode.email}</Descriptions.Item>
            )}
            {selectedNode.phone && (
              <Descriptions.Item label="电话">{selectedNode.phone}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default StudentAnnotationTree;