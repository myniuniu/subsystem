// 知识图谱思维导图组件

import React, { useEffect, useRef, useState } from 'react';
import { Play, BookOpen, Clock, Star, Users, FileText, Video, Link } from 'lucide-react';
import './KnowledgeGraphMindMap.css';

const KnowledgeGraphMindMap = ({ 
  knowledgeGraph, 
  selectedCategory, 
  onNodeClick, 
  onResourceClick 
}) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // 监听容器尺寸变化
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setDimensions({
            width: rect.width,
            height: rect.height
          });
        }
      }
    };

    const timer = setTimeout(updateDimensions, 200);
    window.addEventListener('resize', updateDimensions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // 过滤节点
  const filteredNodes = knowledgeGraph?.nodes?.filter(node => {
    if (!selectedCategory || selectedCategory === 'all') return true;
    return node.category === selectedCategory;
  }) || [];

  // 计算节点布局
  const calculateLayout = (nodes) => {
    const padding = 80; // 容器边距
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const usableWidth = dimensions.width - padding * 2;
    const usableHeight = dimensions.height - padding * 2;
    
    // 根据分类分组
    const nodesByCategory = {};
    nodes.forEach(node => {
      if (!nodesByCategory[node.category]) {
        nodesByCategory[node.category] = [];
      }
      nodesByCategory[node.category].push(node);
    });

    const categories = Object.keys(nodesByCategory);
    const layoutNodes = [];
    
    if (categories.length === 1) {
      // 单个分类时，使用网格布局充分利用空间
      const categoryNodes = nodesByCategory[categories[0]];
      const nodeCount = categoryNodes.length;
      const cols = Math.ceil(Math.sqrt(nodeCount * (usableWidth / usableHeight)));
      const rows = Math.ceil(nodeCount / cols);
      
      const colSpacing = usableWidth / (cols + 1);
      const rowSpacing = usableHeight / (rows + 1);
      
      categoryNodes.forEach((node, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        
        const nodeX = padding + colSpacing * (col + 1);
        const nodeY = padding + rowSpacing * (row + 1);
        
        layoutNodes.push({
          ...node,
          x: nodeX,
          y: nodeY
        });
      });
    } else {
      // 多个分类时，使用扇形分布
      const angleStep = (2 * Math.PI) / categories.length;
      const categoryRadius = Math.min(usableWidth, usableHeight) * 0.25;
      
      categories.forEach((category, categoryIndex) => {
        const categoryNodes = nodesByCategory[category];
        const categoryAngle = categoryIndex * angleStep;
        
        // 分类中心位置
        const categoryCenterX = centerX + Math.cos(categoryAngle) * categoryRadius;
        const categoryCenterY = centerY + Math.sin(categoryAngle) * categoryRadius;
        
        categoryNodes.forEach((node, nodeIndex) => {
          let nodeX, nodeY;
          
          if (categoryNodes.length === 1) {
            nodeX = categoryCenterX;
            nodeY = categoryCenterY;
          } else {
            const nodeAngle = (nodeIndex / categoryNodes.length) * 2 * Math.PI;
            const nodeRadius = 80; // 子节点围绕分类中心的半径
            nodeX = categoryCenterX + Math.cos(nodeAngle) * nodeRadius;
            nodeY = categoryCenterY + Math.sin(nodeAngle) * nodeRadius;
          }
          
          // 确保节点在容器范围内
          nodeX = Math.max(padding + 30, Math.min(dimensions.width - padding - 30, nodeX));
          nodeY = Math.max(padding + 30, Math.min(dimensions.height - padding - 30, nodeY));
          
          layoutNodes.push({
            ...node,
            x: nodeX,
            y: nodeY,
            categoryCenter: { x: categoryCenterX, y: categoryCenterY }
          });
        });
      });
    }
    
    return layoutNodes;
  };

  const layoutNodes = calculateLayout(filteredNodes);

  // 处理节点点击
  const handleNodeClick = (node, event) => {
    event.stopPropagation();
    setSelectedNode(node);
    onNodeClick?.(node);
  };

  // 处理资源点击
  const handleResourceClick = (resource, event) => {
    event.stopPropagation();
    onResourceClick?.(resource);
  };

  // 清除选择
  const clearSelection = () => {
    setSelectedNode(null);
  };

  // 获取资源类型图标
  const getResourceIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={14} />;
      case 'document': return <FileText size={14} />;
      case 'course': return <BookOpen size={14} />;
      case 'link': return <Link size={14} />;
      default: return <FileText size={14} />;
    }
  };

  return (
    <div className="knowledge-graph-mindmap" ref={containerRef} onClick={clearSelection}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="mindmap-svg"
      >
        {/* 定义渐变和滤镜 */}
        <defs>
          <linearGradient id="knowledgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
          <filter id="knowledgeGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          {/* 箭头标记 */}
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="rgba(102, 126, 234, 0.6)"
            />
          </marker>
        </defs>

        {/* 连接线 */}
        {knowledgeGraph?.connections?.map(connection => {
          const fromNode = layoutNodes.find(n => n.id === connection.from);
          const toNode = layoutNodes.find(n => n.id === connection.to);
          
          if (!fromNode || !toNode) return null;
          
          const getConnectionColor = (type) => {
            switch (type) {
              case 'integration': return '#f093fb'; // 融合关系 - 粉色
              case 'methodology': return '#4facfe'; // 方法论 - 蓝色
              case 'application': return '#a8edea'; // 应用关系 - 浅蓝色
              case 'foundation': return '#667eea'; // 基础关系 - 深蓝色
              case 'process': return '#ffd89b'; // 流程关系 - 黄色
              case 'implementation': return '#c8e6c9'; // 实施关系 - 绿色
              default: return 'rgba(102, 126, 234, 0.3)';
            }
          };
          
          // 计算线条中点位置用于显示标签
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;
          
          return (
            <g key={connection.id}>
              {/* 连接线 */}
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={getConnectionColor(connection.type)}
                strokeWidth="3"
                strokeDasharray={connection.type === 'dependency' ? '5,5' : 'none'}
                opacity="0.8"
                markerEnd="url(#arrowhead)"
              />
              
              {/* 关系标签 */}
              {connection.label && (
                <g>
                  {/* 标签背景 */}
                  <rect
                    x={midX - connection.label.length * 4 - 4}
                    y={midY - 10}
                    width={connection.label.length * 8 + 8}
                    height={20}
                    fill="rgba(255, 255, 255, 0.95)"
                    stroke={getConnectionColor(connection.type)}
                    strokeWidth="1"
                    rx="10"
                  />
                  {/* 标签文字 */}
                  <text
                    x={midX}
                    y={midY + 3}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="500"
                    fill={getConnectionColor(connection.type)}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {connection.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* 节点 */}
        {layoutNodes.map(node => {
          const isSelected = selectedNode?.id === node.id;
          const isHovered = hoveredNode?.id === node.id;
          const nodeSize = isSelected ? 40 : (isHovered ? 35 : 30);
          
          return (
            <g key={node.id}>
              {/* 节点圆圈 */}
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeSize}
                fill={node.color || '#667eea'}
                stroke={isSelected ? '#fff' : 'none'}
                strokeWidth="3"
                className="knowledge-node"
                filter={isSelected ? 'url(#knowledgeGlow)' : 'none'}
                style={{ cursor: 'pointer' }}
                onClick={(e) => handleNodeClick(node, e)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              />
              
              {/* 节点图标 */}
              <text
                x={node.x}
                y={node.y + 6}
                textAnchor="middle"
                fontSize="18"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {node.icon}
              </text>
              
              {/* 节点标签 */}
              <text
                x={node.x}
                y={node.y + nodeSize + 20}
                textAnchor="middle"
                fontSize="12"
                fontWeight="500"
                fill="#2d3748"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {node.name}
              </text>
              
              {/* 重要性指示器 */}
              {node.importance === 'high' && (
                <circle
                  cx={node.x + nodeSize - 8}
                  cy={node.y - nodeSize + 8}
                  r="6"
                  fill="#f56565"
                  className="importance-indicator"
                />
              )}
              
              {/* 资源数量指示器 */}
              {node.relatedResources && node.relatedResources.length > 0 && (
                <>
                  <circle
                    cx={node.x + nodeSize - 8}
                    cy={node.y + nodeSize - 8}
                    r="8"
                    fill="#48bb78"
                    className="resource-count-indicator"
                  />
                  <text
                    x={node.x + nodeSize - 8}
                    y={node.y + nodeSize - 4}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill="white"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {node.relatedResources.length}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* 节点详情面板 */}
      {selectedNode && (
        <div 
          className="knowledge-detail-panel"
          style={{
            left: Math.min(selectedNode.x + 50, dimensions.width - 350),
            top: Math.max(selectedNode.y - 150, 20)
          }}
        >
          <div className="panel-header">
            <div className="panel-title">
              <span className="node-icon">{selectedNode.icon}</span>
              <h3>{selectedNode.name}</h3>
            </div>
            <div className="panel-category" style={{ backgroundColor: selectedNode.color }}>
              {selectedNode.category}
            </div>
          </div>
          
          <div className="panel-content">
            <p className="node-description">{selectedNode.description}</p>
            
            {selectedNode.keywords && selectedNode.keywords.length > 0 && (
              <div className="node-keywords">
                <strong>关键词：</strong>
                {selectedNode.keywords.map((keyword, index) => (
                  <span key={index} className="keyword-tag">{keyword}</span>
                ))}
              </div>
            )}
            
            {selectedNode.relatedResources && selectedNode.relatedResources.length > 0 && (
              <div className="related-resources">
                <h4>
                  <BookOpen size={16} />
                  相关资源 ({selectedNode.relatedResources.length})
                </h4>
                <div className="resource-list">
                  {selectedNode.relatedResources.map(resource => (
                    <div
                      key={resource.id}
                      className="resource-item"
                      onClick={(e) => handleResourceClick(resource, e)}
                    >
                      <div className="resource-icon">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="resource-info">
                        <div className="resource-title">{resource.title}</div>
                        <div className="resource-meta">
                          <span><Users size={12} /> {resource.author}</span>
                          <span className="resource-type">{resource.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 图例 */}
      <div className="knowledge-legend">
        <h4>图例说明</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-line" style={{ background: '#f093fb' }}></div>
            <span>融合关系</span>
          </div>
          <div className="legend-item">
            <div className="legend-line" style={{ background: '#4facfe' }}></div>
            <span>方法论</span>
          </div>
          <div className="legend-item">
            <div className="legend-line" style={{ background: '#a8edea' }}></div>
            <span>应用关系</span>
          </div>
          <div className="legend-item">
            <div className="legend-circle" style={{ background: '#f56565' }}></div>
            <span>高重要性</span>
          </div>
          <div className="legend-item">
            <div className="legend-circle" style={{ background: '#48bb78' }}></div>
            <span>资源数量</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraphMindMap;