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
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    // 根据分类分组
    const nodesByCategory = {};
    nodes.forEach(node => {
      if (!nodesByCategory[node.category]) {
        nodesByCategory[node.category] = [];
      }
      nodesByCategory[node.category].push(node);
    });

    const categories = Object.keys(nodesByCategory);
    const angleStep = (2 * Math.PI) / categories.length;
    
    const layoutNodes = [];
    
    categories.forEach((category, categoryIndex) => {
      const categoryNodes = nodesByCategory[category];
      const categoryAngle = categoryIndex * angleStep;
      const categoryRadius = Math.min(dimensions.width, dimensions.height) * 0.3;
      
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
          const nodeRadius = 100; // 子节点围绕分类中心的半径
          nodeX = categoryCenterX + Math.cos(nodeAngle) * nodeRadius;
          nodeY = categoryCenterY + Math.sin(nodeAngle) * nodeRadius;
        }
        
        layoutNodes.push({
          ...node,
          x: nodeX,
          y: nodeY,
          categoryCenter: { x: categoryCenterX, y: categoryCenterY }
        });
      });
    });
    
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
        </defs>

        {/* 连接线 */}
        {knowledgeGraph?.connections?.map(connection => {
          const fromNode = layoutNodes.find(n => n.id === connection.from);
          const toNode = layoutNodes.find(n => n.id === connection.to);
          
          if (!fromNode || !toNode) return null;
          
          const getConnectionColor = (type) => {
            switch (type) {
              case 'integration': return '#f093fb';
              case 'methodology': return '#4facfe';
              case 'application': return '#a8edea';
              case 'foundation': return '#667eea';
              default: return 'rgba(102, 126, 234, 0.3)';
            }
          };
          
          return (
            <line
              key={connection.id}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={getConnectionColor(connection.type)}
              strokeWidth="2"
              strokeDasharray={connection.type === 'dependency' ? '5,5' : 'none'}
              opacity="0.6"
            />
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