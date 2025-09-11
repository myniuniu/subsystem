import React from 'react';
import { Radar } from '@ant-design/charts';
import { Card } from 'antd';

const RadarChart = ({ data, title = '能力雷达图' }) => {
  // 转换数据格式为雷达图所需的格式
  const radarData = [
    {
      item: '问题识别',
      score: data.problemIdentification?.score || 0,
      fullScore: 100
    },
    {
      item: '共情沟通',
      score: data.empathyCommunication?.score || 0,
      fullScore: 100
    },
    {
      item: '解决方案',
      score: data.solutionRationality?.score || 0,
      fullScore: 100
    }
  ];

  const config = {
    data: radarData,
    xField: 'item',
    yField: 'score',
    meta: {
      score: {
        alias: '得分',
        min: 0,
        max: 100,
        nice: true,
        tickCount: 5
      }
    },
    xAxis: {
      line: null,
      tickLine: null,
      grid: {
        line: {
          style: {
            lineDash: null,
            stroke: '#e8e8e8',
            lineWidth: 1
          },
        },
      },
      label: {
        style: {
          fontSize: 12,
          fontWeight: 500,
          fill: '#595959'
        }
      }
    },
    yAxis: {
      line: null,
      tickLine: null,
      grid: {
        line: {
          type: 'line',
          style: {
            lineDash: null,
            stroke: '#f0f0f0',
            lineWidth: 1
          },
        },
        alternateColor: 'rgba(24, 144, 255, 0.02)',
      },
      label: {
        style: {
          fontSize: 11,
          fill: '#8c8c8c'
        }
      }
    },
    point: {
      size: 4,
      style: {
        fill: '#1890ff',
        stroke: '#fff',
        lineWidth: 2
      }
    },
    area: {
      style: {
        fill: 'l(270) 0:#1890ff00 0.5:#1890ff40 1:#1890ff80',
        fillOpacity: 0.3,
      },
    },
    line: {
      style: {
        stroke: '#1890ff',
        lineWidth: 2
      }
    },
    smooth: true,
    tooltip: {
      showMarkers: false,
      formatter: (datum) => {
        const level = datum.score >= 90 ? '优秀' : datum.score >= 80 ? '良好' : datum.score >= 70 ? '一般' : '待提升';
        return {
          name: datum.item,
          value: `${datum.score}分 (${level})`
        };
      },
      customContent: (title, items) => {
        if (!items || items.length === 0) return null;
        const item = items[0];
        return `
          <div style="padding: 8px 12px; background: rgba(0,0,0,0.8); border-radius: 4px; color: white; font-size: 12px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${item.name}</div>
            <div>${item.value}</div>
          </div>
        `;
      }
    },
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1000
      }
    }
  };

  return (
    <Card title={title} className="radar-chart-card">
      <div style={{ height: 300 }}>
        <Radar {...config} />
      </div>
      <div className="radar-legend">
        {radarData.map((item, index) => (
          <div key={index} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#1890ff' }}></span>
            <span className="legend-text">{item.item}: {item.score}分</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RadarChart;