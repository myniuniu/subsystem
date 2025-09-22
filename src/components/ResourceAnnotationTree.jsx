import React, { useState, useEffect, useMemo } from 'react';
import {
  Tree,
  Card,
  Input,
  Select,
  Tag,
  Badge,
  Tooltip,
  Button,
  Space,
  Progress,
  Statistic,
  Row,
  Col,
  Modal,
  Form,
  Rate,
  message,
  Dropdown,
  Menu,
  Divider,
  Typography,
  Empty,
  Spin
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  FileOutlined,
  TagOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  PlusOutlined,
  MoreOutlined,
  BarChartOutlined,
  GlobalOutlined,
  HomeOutlined,
  ImportOutlined,
  RobotOutlined,
  TeamOutlined
} from '@ant-design/icons';
import './ResourceAnnotationTree.css';
import {
  ResourceSourceType,
  AnnotationStatus,
  TreeNodeType
} from '../types/resourceAnnotationTree.js';
import {
  defaultResourceAnnotationTree,
  getResourceAnnotationStats,
  searchResourceAnnotations,
  getPopularTags
} from '../data/resourceAnnotationTreeMockData.js';

const { Search } = Input;
const { Option } = Select;
const { Text, Title } = Typography;

// 状态图标映射
const statusIcons = {
  [AnnotationStatus.PENDING]: <ClockCircleOutlined style={{ color: '#faad14' }} />,
  [AnnotationStatus.IN_PROGRESS]: <SyncOutlined spin style={{ color: '#1890ff' }} />,
  [AnnotationStatus.COMPLETED]: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
  [AnnotationStatus.REVIEWED]: <StarOutlined style={{ color: '#722ed1' }} />,
  [AnnotationStatus.REJECTED]: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
};

// 来源类型图标映射
const sourceTypeIcons = {
  [ResourceSourceType.INTERNAL]: <HomeOutlined style={{ color: '#1890ff' }} />,
  [ResourceSourceType.EXTERNAL]: <GlobalOutlined style={{ color: '#fa8c16' }} />,
  [ResourceSourceType.IMPORTED]: <ImportOutlined style={{ color: '#52c41a' }} />,
  [ResourceSourceType.GENERATED]: <RobotOutlined style={{ color: '#722ed1' }} />,
  [ResourceSourceType.SHARED]: <TeamOutlined style={{ color: '#13c2c2' }} />,
  [ResourceSourceType.ARCHIVED]: <FolderOutlined style={{ color: '#8c8c8c' }} />
};

// 状态标签颜色映射
const statusColors = {
  [AnnotationStatus.PENDING]: 'orange',
  [AnnotationStatus.IN_PROGRESS]: 'blue',
  [AnnotationStatus.COMPLETED]: 'green',
  [AnnotationStatus.REVIEWED]: 'purple',
  [AnnotationStatus.REJECTED]: 'red'
};

const ResourceAnnotationTree = () => {
  const [treeManager] = useState(defaultResourceAnnotationTree);
  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState(['root']);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSourceType, setFilterSourceType] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // 统计数据
  const stats = useMemo(() => {
    return getResourceAnnotationStats(treeManager);
  }, [treeManager]);

  // 热门标签
  const popularTags = useMemo(() => {
    return getPopularTags(treeManager, 10);
  }, [treeManager]);

  // 转换树数据为Ant Design Tree组件格式
  const convertToTreeData = (node) => {
    const isResource = node.type === TreeNodeType.RESOURCE;
    const isCategory = node.type === TreeNodeType.CATEGORY;
    
    let title = (
      <div className="tree-node-title">
        <Space size="small">
          {isResource && sourceTypeIcons[node.sourceType]}
          {isCategory && (node.isExpanded ? <FolderOpenOutlined /> : <FolderOutlined />)}
          {!isResource && !isCategory && <FileOutlined />}
          
          <span className="node-name">{node.name}</span>
          
          {isResource && (
            <>
              <Tag color={statusColors[node.annotationStatus]} size="small">
                {statusIcons[node.annotationStatus]}
                {node.annotationStatus}
              </Tag>
              <Rate disabled value={node.quality} count={5} size="small" />
            </>
          )}
          
          {isCategory && (
            <Badge count={node.resourceCount} size="small" color="#1890ff" />
          )}
        </Space>
      </div>
    );

    const treeNode = {
      key: node.id,
      title,
      icon: isResource ? <FileOutlined /> : (node.isExpanded ? <FolderOpenOutlined /> : <FolderOutlined />),
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
      const results = searchResourceAnnotations(treeManager, value, {
        status: filterStatus,
        sourceType: filterSourceType
      });
      
      // 展开包含搜索结果的节点
      const expandKeys = new Set(['root']);
      results.forEach(node => {
        node.path.forEach(pathId => expandKeys.add(pathId));
        expandKeys.add(node.parentId);
      });
      setExpandedKeys(Array.from(expandKeys));
    }
  };

  // 节点选择处理
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

  // 节点展开处理
  const handleExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
  };

  // 显示详情模态框
  const showDetailModal = (node) => {
    setSelectedNode(node);
    setDetailModalVisible(true);
  };

  // 显示统计模态框
  const showStatsModal = () => {
    setStatsModalVisible(true);
  };

  // 节点右键菜单
  const getNodeContextMenu = (node) => {
    const menuItems = [
      {
        key: 'view',
        icon: <EyeOutlined />,
        label: '查看详情',
        onClick: () => showDetailModal(node)
      }
    ];

    if (node.type === TreeNodeType.RESOURCE) {
      menuItems.push(
        {
          key: 'edit',
          icon: <EditOutlined />,
          label: '编辑标注',
          onClick: () => message.info('编辑功能开发中...')
        },
        {
          key: 'download',
          icon: <DownloadOutlined />,
          label: '下载资源',
          onClick: () => message.info('下载功能开发中...')
        }
      );
    }

    menuItems.push(
      { type: 'divider' },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: '删除',
        danger: true,
        onClick: () => {
          Modal.confirm({
            title: '确认删除',
            content: `确定要删除 "${node.name}" 吗？`,
            onOk: () => {
              if (treeManager.removeNode(node.id)) {
                updateTreeData();
                message.success('删除成功');
              } else {
                message.error('删除失败');
              }
            }
          });
        }
      }
    );

    return <Menu items={menuItems} />;
  };

  // 过滤树节点
  const filterTreeData = (nodes, searchValue, statusFilter, sourceTypeFilter) => {
    return nodes.filter(node => {
      const matchesSearch = !searchValue || 
        node.data.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        (node.data.tags && node.data.tags.some(tag => 
          tag.toLowerCase().includes(searchValue.toLowerCase())
        ));
      
      const matchesStatus = !statusFilter || 
        (node.data.annotationStatus && node.data.annotationStatus === statusFilter);
      
      const matchesSourceType = !sourceTypeFilter || 
        (node.data.sourceType && node.data.sourceType === sourceTypeFilter);

      const hasMatchingChildren = node.children && 
        filterTreeData(node.children, searchValue, statusFilter, sourceTypeFilter).length > 0;

      return (matchesSearch && matchesStatus && matchesSourceType) || hasMatchingChildren;
    }).map(node => ({
      ...node,
      children: node.children ? 
        filterTreeData(node.children, searchValue, statusFilter, sourceTypeFilter) : []
    }));
  };

  const filteredTreeData = useMemo(() => {
    return filterTreeData(treeData, searchValue, filterStatus, filterSourceType);
  }, [treeData, searchValue, filterStatus, filterSourceType]);

  return (
    <div className="resource-annotation-tree">
      <Card className="tree-header-card">
        <Row gutter={[16, 16]} align="middle">
          <Col span={8}>
            <Title level={4} style={{ margin: 0 }}>
              <TagOutlined /> 标签标注管理
            </Title>
          </Col>
          <Col span={16}>
            <Space size="middle" style={{ float: 'right' }}>
              <Button 
                icon={<BarChartOutlined />} 
                onClick={showStatsModal}
              >
                统计信息
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => message.info('添加功能开发中...')}
              >
                添加资源
              </Button>
            </Space>
          </Col>
        </Row>
        
        <Divider />
        
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Search
              placeholder="搜索资源名称或标签..."
              allowClear
              onSearch={handleSearch}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder="筛选状态"
              allowClear
              style={{ width: '100%' }}
              value={filterStatus}
              onChange={setFilterStatus}
            >
              {Object.values(AnnotationStatus).map(status => (
                <Option key={status} value={status}>
                  {statusIcons[status]} {status}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Select
              placeholder="筛选来源类型"
              allowClear
              style={{ width: '100%' }}
              value={filterSourceType}
              onChange={setFilterSourceType}
            >
              {Object.values(ResourceSourceType).map(type => (
                <Option key={type} value={type}>
                  {sourceTypeIcons[type]} {type}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card 
            title="资源树状结构" 
            className="tree-main-card"
            extra={
              <Space>
                <Text type="secondary">
                  共 {stats.totalResources} 个资源
                </Text>
              </Space>
            }
          >
            {filteredTreeData.length > 0 ? (
              <Tree
                showIcon
                showLine={{ showLeafIcon: false }}
                expandedKeys={expandedKeys}
                selectedKeys={selectedKeys}
                treeData={filteredTreeData}
                onSelect={handleSelect}
                onExpand={handleExpand}
                className="resource-tree"
                titleRender={(nodeData) => (
                  <Dropdown
                    overlay={getNodeContextMenu(nodeData.data)}
                    trigger={['contextMenu']}
                  >
                    <div className="tree-node-wrapper">
                      {nodeData.title}
                    </div>
                  </Dropdown>
                )}
              />
            ) : (
              <Empty 
                description="没有找到匹配的资源"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
        
        <Col span={8}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* 统计卡片 */}
            <Card title="统计概览" size="small">
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <Statistic
                    title="总资源数"
                    value={stats.totalResources}
                    prefix={<FileOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="已完成"
                    value={stats.completedResources}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={24}>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary">完成率</Text>
                    <Progress 
                      percent={Math.round(stats.completionRate * 100)} 
                      size="small"
                      status={stats.completionRate > 0.8 ? 'success' : 'active'}
                    />
                  </div>
                </Col>
              </Row>
            </Card>

            {/* 热门标签 */}
            <Card title="热门标签" size="small">
              <div className="popular-tags">
                {popularTags.map(({ tag, count }) => (
                  <Tag 
                    key={tag} 
                    color="blue" 
                    style={{ marginBottom: 4, cursor: 'pointer' }}
                    onClick={() => setSearchValue(tag)}
                  >
                    {tag} ({count})
                  </Tag>
                ))}
              </div>
            </Card>

            {/* 选中节点详情 */}
            {selectedNode && (
              <Card title="节点详情" size="small">
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div>
                    <Text strong>名称：</Text>
                    <Text>{selectedNode.name}</Text>
                  </div>
                  
                  {selectedNode.type === TreeNodeType.RESOURCE && (
                    <>
                      <div>
                        <Text strong>状态：</Text>
                        <Tag color={statusColors[selectedNode.annotationStatus]}>
                          {statusIcons[selectedNode.annotationStatus]}
                          {selectedNode.annotationStatus}
                        </Tag>
                      </div>
                      
                      <div>
                        <Text strong>来源：</Text>
                        {sourceTypeIcons[selectedNode.sourceType]}
                        <Text style={{ marginLeft: 4 }}>{selectedNode.sourceName}</Text>
                      </div>
                      
                      <div>
                        <Text strong>质量评分：</Text>
                        <Rate disabled value={selectedNode.quality} count={5} size="small" />
                      </div>
                      
                      {selectedNode.tags.length > 0 && (
                        <div>
                          <Text strong>标签：</Text>
                          <div style={{ marginTop: 4 }}>
                            {selectedNode.tags.map(tag => (
                              <Tag key={tag} size="small">{tag}</Tag>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {selectedNode.type === TreeNodeType.CATEGORY && (
                    <>
                      <div>
                        <Text strong>资源数量：</Text>
                        <Text>{selectedNode.resourceCount}</Text>
                      </div>
                      
                      <div>
                        <Text strong>完成率：</Text>
                        <Progress 
                          percent={Math.round(selectedNode.completionRate * 100)} 
                          size="small"
                        />
                      </div>
                    </>
                  )}
                  
                  <Button 
                    type="primary" 
                    size="small" 
                    block
                    onClick={() => showDetailModal(selectedNode)}
                  >
                    查看详情
                  </Button>
                </Space>
              </Card>
            )}
          </Space>
        </Col>
      </Row>

      {/* 详情模态框 */}
      <Modal
        title={selectedNode?.name}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedNode && (
          <div className="node-detail-content">
            {selectedNode.type === TreeNodeType.RESOURCE ? (
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div>
                      <Text strong>资源ID：</Text>
                      <Text code>{selectedNode.resourceId}</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <Text strong>来源类型：</Text>
                      {sourceTypeIcons[selectedNode.sourceType]}
                      <Text style={{ marginLeft: 4 }}>{selectedNode.sourceType}</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <Text strong>标注状态：</Text>
                      <Tag color={statusColors[selectedNode.annotationStatus]}>
                        {statusIcons[selectedNode.annotationStatus]}
                        {selectedNode.annotationStatus}
                      </Tag>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <Text strong>来源名称：</Text>
                      <Text>{selectedNode.sourceName}</Text>
                    </div>
                  </Col>
                </Row>

                <Divider />

                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Statistic
                      title="质量评分"
                      value={selectedNode.quality}
                      precision={1}
                      suffix="/ 5.0"
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="相关性"
                      value={selectedNode.relevance}
                      precision={1}
                      suffix="/ 5.0"
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="置信度"
                      value={selectedNode.confidence}
                      precision={2}
                      suffix="/ 1.0"
                    />
                  </Col>
                </Row>

                {selectedNode.tags.length > 0 && (
                  <>
                    <Divider />
                    <div>
                      <Text strong>标签：</Text>
                      <div style={{ marginTop: 8 }}>
                        {selectedNode.tags.map(tag => (
                          <Tag key={tag} color="blue">{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {selectedNode.annotations.length > 0 && (
                  <>
                    <Divider />
                    <div>
                      <Text strong>标注内容：</Text>
                      <div style={{ marginTop: 8 }}>
                        {selectedNode.annotations.map((annotation, index) => (
                          <Card key={annotation.id} size="small" style={{ marginBottom: 8 }}>
                            <Text>{annotation.content}</Text>
                            <div style={{ marginTop: 8, fontSize: '12px', color: '#8c8c8c' }}>
                              标注时间：{new Date(annotation.createTime).toLocaleString()}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {selectedNode.reviewComments && (
                  <>
                    <Divider />
                    <div>
                      <Text strong>审核意见：</Text>
                      <Card size="small" style={{ marginTop: 8 }}>
                        <Text>{selectedNode.reviewComments}</Text>
                        <div style={{ marginTop: 8, fontSize: '12px', color: '#8c8c8c' }}>
                          审核时间：{new Date(selectedNode.reviewTime).toLocaleString()}
                        </div>
                      </Card>
                    </div>
                  </>
                )}
              </Space>
            ) : (
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong>描述：</Text>
                  <Text>{selectedNode.description}</Text>
                </div>
                
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Statistic
                      title="资源数量"
                      value={selectedNode.resourceCount}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="标注数量"
                      value={selectedNode.annotationCount}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="平均质量"
                      value={selectedNode.averageQuality}
                      precision={1}
                      suffix="/ 5.0"
                    />
                  </Col>
                </Row>

                <div>
                  <Text strong>完成率：</Text>
                  <Progress 
                    percent={Math.round(selectedNode.completionRate * 100)} 
                    style={{ marginTop: 8 }}
                  />
                </div>
              </Space>
            )}
          </div>
        )}
      </Modal>

      {/* 统计模态框 */}
      <Modal
        title="统计信息"
        open={statsModalVisible}
        onCancel={() => setStatsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Statistic
                title="总节点数"
                value={stats.totalNodes}
                prefix={<FileOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="资源数量"
                value={stats.totalResources}
                prefix={<FileOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="分类数量"
                value={stats.totalCategories}
                prefix={<FolderOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="标注总数"
                value={stats.totalAnnotations}
                prefix={<TagOutlined />}
              />
            </Col>
          </Row>

          <Divider />

          <div>
            <Title level={5}>按来源类型统计</Title>
            <Row gutter={[16, 16]}>
              {Object.entries(stats.sourceTypeStats).map(([type, data]) => (
                <Col span={8} key={type}>
                  <Card size="small">
                    <Statistic
                      title={
                        <Space>
                          {sourceTypeIcons[type]}
                          {type}
                        </Space>
                      }
                      value={data.count}
                      suffix={`(${data.completed}已完成)`}
                    />
                    <Progress 
                      percent={data.count > 0 ? Math.round((data.completed / data.count) * 100) : 0}
                      size="small"
                      style={{ marginTop: 8 }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          <Divider />

          <div>
            <Title level={5}>按状态统计</Title>
            <Row gutter={[16, 16]}>
              {Object.entries(stats.statusStats).map(([status, count]) => (
                <Col span={8} key={status}>
                  <Card size="small">
                    <Statistic
                      title={
                        <Space>
                          {statusIcons[status]}
                          {status}
                        </Space>
                      }
                      value={count}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Space>
      </Modal>
    </div>
  );
};

export default ResourceAnnotationTree;