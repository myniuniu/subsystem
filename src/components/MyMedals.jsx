import React from 'react'
import { Button, Tag } from 'antd'
import './MyMedals.css'
import { achievementMedals, weeklyChallenge, monthlyChallenge, getTotalMedalCount } from '../data/medalsData'
import MedalIcon from './MedalIcon'

const MedalBadge = ({ value, label, tier = 'silver' }) => {
  return (
    <div className="medal-item">
      <MedalIcon tier={tier} value={value} />
      <div className="medal-label">{label}</div>
    </div>
  )
}

const MyMedals = () => {
  const total = getTotalMedalCount()

  return (
    <div className="my-medals-page">
      <div className="medals-container">
        <div className="page-title">
          <span>我的勋章</span>
          <span className="count">{total}</span>
        </div>

        {/* 顶部勋章网格 */}
        <div className="section-card" style={{ paddingTop: 24 }}>
          <div className="medal-grid">
            {achievementMedals.map((m) => (
              <MedalBadge key={m.id} value={m.value} label={m.label} tier={m.tier} />
            ))}
          </div>
          <div className="top-divider" />
        </div>

        {/* 晒晒我的勋章收藏馆 */}
        <div className="section-card" style={{ marginTop: 24 }}>
          <div className="section-title">
            <span># 晒晒我的勋章收藏馆</span>
            <Button type="primary" ghost size="small">去逛逛</Button>
          </div>
          <div className="footer-divider" />
        </div>

        {/* 微信读书勋章体系 */}
        <div className="section-card" style={{ marginTop: 28 }}>
          <div className="page-title" style={{ fontSize: 20 }}>
            <span>学习勋章体系</span>
          </div>

          {/* 每周阅读挑战 */}
          <div style={{ marginTop: 12 }}>
            <div className="section-title">
              <div className="tag-row">
                <Tag color="#3b82f6">每周</Tag>
                <Tag color="#52c41a">7天 · 25小时</Tag>
              </div>
              <span style={{ opacity: 0.8 }}>每周学习挑战</span>
            </div>
            <div className="sub-grid">
              {weeklyChallenge.map((m) => (
                <MedalBadge key={m.id} value={m.value} label={m.label} tier={m.tier} />
              ))}
            </div>
          </div>

          {/* 每月阅读挑战 */}
          <div style={{ marginTop: 8 }}>
            <div className="section-title">
              <div className="tag-row">
                <Tag color="#fa8c16">每月</Tag>
                <Tag color="#13c2c2">至少 100 小时</Tag>
              </div>
              <span style={{ opacity: 0.8 }}>每月学习挑战</span>
            </div>
            <div className="sub-grid">
              {monthlyChallenge.map((m) => (
                <MedalBadge key={m.id} value={m.value} label={m.label} tier={m.tier} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyMedals