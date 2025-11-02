// 培训分析服务：按培训形式聚合真实/外部数据来源（出勤、作业、考试、证书）
// 数据来源优先级：localStorage（attendance_records、assignment_records、exam_records、certificate_records）> 内存缓存 > 估算回退

const KEYS = {
  attendance: 'attendance_records',   // { formatName: { participants: number, participationRate: number } }
  assignments: 'assignment_records',  // { formatName: { completionRate: number } }
  exams: 'exam_records',              // { formatName: { avgScore: number, completionRate?: number } }
  certificates: 'certificate_records' // { formatName: { certified: number, certificationRate?: number } }
};

function safeRead(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clamp(n, min = 0, max = 100) { return Math.max(min, Math.min(max, Number(n) || 0)); }

// 基于方案与参与者列表构建一个回退估算（不使用学时份额，但按形式类别给出常识分布）
function fallbackForFormat(formatName, totals) {
  const f = String(formatName);
  const bias = (
    f.includes('直播') ? 0.9 :
    f.includes('录播') ? 0.8 :
    f.includes('研讨') ? 0.7 :
    f.includes('作业') ? 0.75 :
    f.includes('考试') ? 0.65 : 0.7
  );
  const participants = Math.round((totals.totalParticipants || 0) * bias);
  const active = Math.round((totals.active || 0) * bias);
  const certified = Math.round((totals.certified || 0) * (f.includes('考试') ? 0.8 : 0.6));
  const completionRate = clamp((f.includes('作业') ? 85 : f.includes('考试') ? 90 : 80));
  const avgScore = clamp((f.includes('考试') ? 86 : 82));
  return { participants, active, certified, completionRate, avgScore };
}

export function getFormatStats(formatName, totals = {}) {
  const att = safeRead(KEYS.attendance)?.[formatName];
  const assign = safeRead(KEYS.assignments)?.[formatName];
  const exam = safeRead(KEYS.exams)?.[formatName];
  const cert = safeRead(KEYS.certificates)?.[formatName];
  const base = fallbackForFormat(formatName, totals);
  const participants = Number(att?.participants ?? base.participants);
  const active = Number(att?.active ?? base.active);
  const certified = Number(cert?.certified ?? base.certified);
  const completionRate = clamp(assign?.completionRate ?? exam?.completionRate ?? base.completionRate);
  const avgScore = clamp(exam?.avgScore ?? base.avgScore);
  const certificationRate = participants > 0 ? clamp((certified / participants) * 100) : 0;
  const participationRate = participants > 0 ? clamp((active / participants) * 100) : 0;
  return { participants, active, certified, completionRate, avgScore, certificationRate, participationRate };
}

export function upsertFormatStats(formatName, payload = {}) {
  const currentAtt = safeRead(KEYS.attendance) || {};
  const currentAssign = safeRead(KEYS.assignments) || {};
  const currentExam = safeRead(KEYS.exams) || {};
  const currentCert = safeRead(KEYS.certificates) || {};
  if (payload.participants != null || payload.active != null) {
    currentAtt[formatName] = { 
      participants: Number(payload.participants ?? (currentAtt[formatName]?.participants || 0)),
      active: Number(payload.active ?? (currentAtt[formatName]?.active || 0))
    };
    localStorage.setItem(KEYS.attendance, JSON.stringify(currentAtt));
  }
  if (payload.completionRate != null) {
    currentAssign[formatName] = { completionRate: clamp(payload.completionRate) };
    localStorage.setItem(KEYS.assignments, JSON.stringify(currentAssign));
  }
  if (payload.avgScore != null) {
    currentExam[formatName] = { avgScore: clamp(payload.avgScore), completionRate: clamp(payload.completionRate ?? (currentExam[formatName]?.completionRate || 0)) };
    localStorage.setItem(KEYS.exams, JSON.stringify(currentExam));
  }
  if (payload.certified != null) {
    currentCert[formatName] = { certified: Number(payload.certified || 0), certificationRate: clamp(payload.certificationRate ?? (currentCert[formatName]?.certificationRate || 0)) };
    localStorage.setItem(KEYS.certificates, JSON.stringify(currentCert));
  }
}

export default { getFormatStats, upsertFormatStats };