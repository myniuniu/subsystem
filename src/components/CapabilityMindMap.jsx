// 思维导图组件
// 用于在地图模式下显示能力节点和关联的课程视频

import React, { useEffect, useRef, useState } from 'react';
import { Play, BookOpen, Clock, Star, Users } from 'lucide-react';
import './CapabilityMindMap.css';

const CapabilityMindMap = ({ 
  capabilityMap, 
  selectedCategory, 
  onNodeClick, 
  onVideoClick 
}) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 }); // 设置默认值
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // 监听容器尺寸变化
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        console.log('容器尺寸检测:', rect);
        if (rect.width > 0 && rect.height > 0) {
          const newDimensions = {
            width: rect.width,
            height: rect.height
          };
          console.log('设置的尺寸:', newDimensions);
          setDimensions(newDimensions);
        }
      }
    };

    // 延迟一下再检测尺寸，确保DOM已经渲染
    const timer = setTimeout(updateDimensions, 200);
    
    window.addEventListener('resize', updateDimensions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // 过滤节点
  const filteredNodes = capabilityMap?.nodes?.filter(node => {
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
          const nodeRadius = 80; // 子节点围绕分类中心的半径
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

  // 处理视频点击
  const handleVideoClick = (video, event) => {
    event.stopPropagation();
    onVideoClick?.(video);
  };

  // 清除选择
  const clearSelection = () => {
    setSelectedNode(null);
  };

  // 暂时去掉尺寸检查，直接渲染
  // if (!dimensions.width || !dimensions.height || dimensions.width < 100 || dimensions.height < 100) {
  //   console.log('尺寸不符合要求，显示加载状态:', dimensions);
  //   return <div className="mindmap-loading">正在加载思维导图...</div>;
  // }

  console.log('开始渲染思维导图，尺寸:', dimensions);

  return (
    <div className="capability-mindmap" ref={containerRef} onClick={clearSelection}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="mindmap-svg"
      >
        {/* 定义渐变 */}
        <defs>
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* 连接线 */}
        {capabilityMap?.connections?.map(connection => {
          const fromNode = layoutNodes.find(n => n.id === connection.from);
          const toNode = layoutNodes.find(n => n.id === connection.to);
          
          if (!fromNode || !toNode) return null;
          
          return (
            <line
              key={connection.id}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="rgba(102, 126, 234, 0.3)"
              strokeWidth="2"
              strokeDasharray={connection.type === 'dependency' ? '5,5' : 'none'}
            />
          );
        })}

        {/* 节点 */}
        {layoutNodes.map(node => (
          <g key={node.id}>
            {/* 节点圆圈 */}
            <circle
              cx={node.x}
              cy={node.y}
              r={selectedNode?.id === node.id ? 35 : (hoveredNode?.id === node.id ? 30 : 25)}
              fill={node.color || '#667eea'}
              stroke={selectedNode?.id === node.id ? '#fff' : 'none'}
              strokeWidth="3"
              className="mindmap-node"
              filter={selectedNode?.id === node.id ? 'url(#glow)' : 'none'}
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
              fontSize="16"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {node.icon}
            </text>
            
            {/* 节点标签 */}
            <text
              x={node.x}
              y={node.y + 45}
              textAnchor="middle"
              fontSize="12"
              fontWeight="500"
              fill="#2d3748"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {node.name}
            </text>
            
            {/* 关联视频数量指示器 */}
            {node.relatedVideos && node.relatedVideos.length > 0 && (
              <circle
                cx={node.x + 20}
                cy={node.y - 15}
                r="8"
                fill="#f56565"
                className="video-count-indicator"
              />
            )}
            
            {node.relatedVideos && node.relatedVideos.length > 0 && (
              <text
                x={node.x + 20}
                y={node.y - 11}
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="white"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {node.relatedVideos.length}
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* 节点详情面板 */}
      {selectedNode && (
        <div 
          className="node-detail-panel"
          style={{
            left: Math.min(selectedNode.x + 50, dimensions.width - 320),
            top: Math.max(selectedNode.y - 100, 20)
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
            
            {selectedNode.relatedVideos && selectedNode.relatedVideos.length > 0 && (
              <div className="related-videos">
                <h4>
                  <BookOpen size={16} />
                  关联课程 ({selectedNode.relatedVideos.length})
                </h4>
                <div className="video-list">
                  {selectedNode.relatedVideos.map(video => (
                    <div
                      key={video.id}
                      className="video-item"
                      onClick={(e) => handleVideoClick(video, e)}
                    >
                      <div className="video-icon">
                        <Play size={14} />
                      </div>
                      <div className="video-info">
                        <div className="video-title">{video.title}</div>
                        <div className="video-meta">
                          <span><Clock size={12} /> {video.duration}</span>
                          <span><Users size={12} /> {video.author}</span>
                          <span><Star size={12} /> {video.difficulty}</span>
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
      <div className="mindmap-legend">
        <h4>图例说明</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-line solid"></div>
            <span>协同关系</span>
          </div>
          <div className="legend-item">
            <div className="legend-line dashed"></div>
            <span>依赖关系</span>
          </div>
          <div className="legend-item">
            <div className="legend-circle"></div>
            <span>能力节点</span>
          </div>
          <div className="legend-item">
            <div className="legend-badge"></div>
            <span>关联视频数量</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapabilityMindMap;