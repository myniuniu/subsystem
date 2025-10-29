import React, { useMemo, useState, useEffect } from 'react';
import { Button, Typography, Card, Table, Tag, InputNumber, Input, Radio, Statistic, Progress } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Text } = Typography;

const SUBJECTIVE_TYPES = [
  { key: 'short_answer', label: '简答题' },
  { key: 'essay', label: '论述题' },
  { key: 'material_analysis', label: '材料分析题' },
  { key: 'calculation', label: '计算题' },
  { key: 'writing', label: '写作类题目' }
];

const TYPE_LABELS = SUBJECTIVE_TYPES.reduce((acc, t) => { acc[t.key] = t.label; return acc; }, {});

const ExamReviewFullPage = ({ state, setCurrentView, VIEW_MODES }) => {
  const record = state?.selectedMaterial || state?.rightPanelExamReviewRecord || { id: 'exam_review_default', title: '考试评阅' };
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentViewMode, setStudentViewMode] = useState('list'); // list | card

  // 当前考试的所有提交（示例结构：[{id,name,items:[{type,question,answer,score,comment}]}]）
  const submissions = useMemo(() => {
    const list = (state?.evaluationSubmissions || {})[record.id] || [];
    return Array.isArray(list) ? list : [];
  }, [state.evaluationSubmissions, record]);

  // 若无数据，注入默认示例，避免页面空白
  useEffect(() => {
    const list = (state?.evaluationSubmissions || {})[record.id] || [];
    if (!record?.id || (Array.isArray(list) && list.length > 0)) return;
    const defaults = Array.from({ length: 20 }).map((_, idx) => ({
      id: `stu_${(idx + 1).toString().padStart(3, '0')}`,
      name: ['张三','李四','王五','赵六','钱七','孙八','周九','吴十','郑一','王二','冯三','陈四','褚五','卫六','蒋七','沈八','韩九','杨十','朱一','秦二'][idx % 20],
      items: [
        { type: 'short_answer', question: '解释“班级管理”的核心含义', answer: '维持秩序与促进发展', score: null, comment: '' },
        { type: 'essay', question: '论述“教师规则与激励”的重要性', answer: '围绕规则与激励机制展开论述…', score: null, comment: '' },
        { type: 'material_analysis', question: '材料阅读并分析关键问题', answer: '关键变量包括…', score: null, comment: '' },
        { type: 'calculation', question: '计算课堂管理效率指标X', answer: '步骤与公式推导…', score: null, comment: '' },
        { type: 'writing', question: '写作：我的班级管理策略', answer: '引言-主体-结论；主题思想…', score: null, comment: '' }
      ]
    }));
    state.setEvaluationSubmissions(prev => {
      const next = { ...(prev || {}) };
      next[record.id] = defaults;
      try { localStorage.setItem('evaluationSubmissions', JSON.stringify(next)); } catch {}
      return next;
    });
  }, [record, state.evaluationSubmissions]);

  const students = useMemo(() => (
    submissions.map(s => ({
      id: s.id,
      name: s.name,
      pendingCount: (s.items || []).filter(i => i.score == null).length,
      gradedCount: (s.items || []).filter(i => i.score != null).length
    }))
  ), [submissions]);

  const selectedStudent = submissions.find(s => s.id === selectedStudentId) || submissions[0] || null;
  useEffect(() => {
    if (!selectedStudentId && submissions.length > 0) {
      setSelectedStudentId(submissions[0].id);
    }
  }, [submissions, selectedStudentId]);

  const handleSaveScore = (itemIndex, value) => {
    const num = typeof value === 'number' ? Math.max(0, Math.min(100, value)) : null;
    state.setEvaluationSubmissions(prev => {
      const list = prev[record.id] || [];
      const nextList = list.map(s => {
        if (!selectedStudent || s.id !== selectedStudent.id) return s;
        const nextItems = (selectedStudent.items || []).map((it, idx) => idx === itemIndex ? { ...it, score: num } : it);
        return { ...s, items: nextItems };
      });
      const next = { ...prev, [record.id]: nextList };
      try { localStorage.setItem('evaluationSubmissions', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const handleSaveComment = (itemIndex, value) => {
    state.setEvaluationSubmissions(prev => {
      const list = prev[record.id] || [];
      const nextList = list.map(s => {
        if (!selectedStudent || s.id !== selectedStudent.id) return s;
        const nextItems = (selectedStudent.items || []).map((it, idx) => idx === itemIndex ? { ...it, comment: value } : it);
        return { ...s, items: nextItems };
      });
      const next = { ...prev, [record.id]: nextList };
      try { localStorage.setItem('evaluationSubmissions', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // 汇总统计
  const stats = useMemo(() => {
    const allItems = submissions.flatMap(s => (s.items || []));
    const graded = allItems.filter(i => typeof i.score === 'number');
    const avg = graded.length > 0 ? Math.round(graded.reduce((sum, i) => sum + (i.score || 0), 0) / graded.length) : 0;
    return {
      totalStudents: submissions.length,
      totalItems: allItems.length,
      gradedItems: graded.length,
      avgScore: avg,
      progress: allItems.length > 0 ? Math.round((graded.length / allItems.length) * 100) : 0
    };
  }, [submissions]);

  const title = record?.title || '考试评阅';

  return (
    <div style={{ 
      flex: 1, 
      background: '#f0f2f5', 
      margin: '16px', 
      borderRadius: '12px', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
    }}>
      {/* 顶部条 */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8, background: '#fff' }}>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setCurrentView && setCurrentView(VIEW_MODES.MATERIALS)}>返回</Button>
          <Text style={{ fontWeight: 600 }}>考试评阅</Text>
          <Text type="secondary" style={{ marginLeft: 8 }}>{title}</Text>
        <div style={{ marginLeft: 'auto' }} />
        </div>

      {/* 三栏布局 */}
      <div style={{ display: 'grid', gridTemplateColumns: '3.5fr 4.5fr 2fr', gap: 12, padding: 12 }}>
        {/* 左栏：学员清单 */}
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: 8, borderBottom: '1px solid #f0f0f0', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text strong>评阅与提交清单（全部题型）</Text>
            <Radio.Group size="small" value={studentViewMode} onChange={(e) => setStudentViewMode(e.target.value)}>
              <Radio.Button value="list">列表</Radio.Button>
              <Radio.Button value="card">卡片</Radio.Button>
            </Radio.Group>
          </div>
          <div style={{ padding: 8 }}>
            {studentViewMode === 'list' ? (
              <Table
                size="small"
                pagination={false}
                rowKey={r => r.id}
                dataSource={students}
                onRow={(r) => ({ onClick: () => setSelectedStudentId(r.id) })}
                tableLayout="fixed"
                columns={[
                  { title: '学员', dataIndex: 'name', key: 'name', width: 260 },
                  { title: '待评', dataIndex: 'pendingCount', key: 'pending', width: 120, render: v => <Tag color="orange">{v}</Tag> },
                  { title: '已评', dataIndex: 'gradedCount', key: 'graded', width: 120, render: v => <Tag color="green">{v}</Tag> }
                ]}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {students.map(s => (
                  <Card
                    key={s.id}
                    size="small"
                    hoverable
                    onClick={() => setSelectedStudentId(s.id)}
                    style={{ borderColor: selectedStudentId === s.id ? '#1890ff' : '#f0f0f0' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text strong style={{ fontSize: 12 }}>{s.name}</Text>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Tag color="orange">待评 {s.pendingCount}</Tag>
                        <Tag color="green">已评 {s.gradedCount}</Tag>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 中栏：题目与打分 */}
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 12, borderBottom: '1px solid #f0f0f0', background: '#fafafa', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text strong>评阅 · 全部题型</Text>
          </div>
          <div style={{ padding: 12, flex: 1, overflowY: 'auto' }}>
            {selectedStudent ? (
              (selectedStudent.items || []).map((it, idx) => (
                <Card key={`${selectedStudent.id}-${it.type}-${idx}`} size="small" style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div>
                      <Tag color="blue">{TYPE_LABELS[it.type] || '题目'}</Tag>
                    </div>
                    <div>
                      <Text strong>题目：</Text><Text>{it.question}</Text>
                    </div>
                    <div>
                      <Text strong>作答：</Text><Text>{it.answer}</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div>
                        <Text strong>评分：</Text>
                        <InputNumber min={0} max={100} value={it.score} onChange={(v) => handleSaveScore(idx, v)} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text strong>评语：</Text>
                        <Input.TextArea rows={2} value={it.comment} onChange={(e) => handleSaveComment(idx, e.target.value)} />
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Text type="secondary">请选择左侧学员</Text>
            )}
          </div>
        </div>

        {/* 右栏：统计与进度 */}
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: 12, borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
            <Text strong>评阅进度</Text>
          </div>
          <div style={{ padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Card size="small">
              <Statistic title="学员人数" value={stats.totalStudents} suffix="人" />
            </Card>
            <Card size="small">
              <Statistic title="总题数" value={stats.totalItems} suffix="题" />
            </Card>
            <Card size="small">
              <Statistic title="已评题数" value={stats.gradedItems} suffix="题" />
            </Card>
            <Card size="small">
              <Statistic title="平均分" value={stats.avgScore} suffix="分" />
            </Card>
            <Card size="small" style={{ gridColumn: '1 / span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Text strong>总体进度：</Text>
                <div style={{ flex: 1 }}>
                  <Progress percent={stats.progress} status="active" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamReviewFullPage;