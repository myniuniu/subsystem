// 方案摘要工具：统一构建与发布 TrainingPlan 的轻量摘要，供其他模块消费
// 使用 window 存储与事件派发，避免组件之间紧耦合

export const PLAN_SUMMARY_GLOBAL_KEY = '__latest_training_plan__summary__';
export const PLAN_SUMMARY_EVENT = 'trainingPlanSummaryUpdated';
const PLAN_SUMMARY_STORAGE_KEY = 'training_plan_summary';

// 将模块的 format 文本解析为列表（支持 +、中文逗号、英文逗号、顿号）
export function parseFormats(formatText) {
  if (!formatText) return [];
  return String(formatText)
    .split(/[+，,、]/)
    .map(s => s.trim())
    .filter(Boolean);
}

// 根据模块 formatConfigs 与 formatTypeMap 计算各培训形式的学时份额
export function computeFormatShares(formats, typeMap = {}, cfgs = {}) {
  const hours = formats.map(f => {
    const tk = typeMap[f] || f;
    const c = cfgs[tk] || {};
    const v = Number(c.arrangedHours ?? 0) || 0;
    return { name: f, typeKey: tk, arrangedHours: v };
  });
  const total = hours.reduce((a, b) => a + (b.arrangedHours || 0), 0);
  const baseShare = formats.length > 0 ? (1 / formats.length) : 0;
  return hours.map(h => ({
    ...h,
    share: total > 0 ? Math.max(0, Math.min(1, h.arrangedHours / total)) : baseShare
  }));
}

// 从完整的 plan 对象构建轻量摘要
export function buildPlanSummary(plan) {
  try {
    const phases = Array.isArray(plan?.phases) ? plan.phases : [];
    const summaryPhases = phases.map(ph => ({
      name: ph?.name || '',
      modules: (Array.isArray(ph?.modules) ? ph.modules : []).map(m => ({
        title: m?.title || '',
        format: m?.format || '',
        assessment: m?.assessment || '',
        formatTypeMap: m?.formatTypeMap || {},
        formatConfigs: m?.formatConfigs || {},
        arrangedHours: Number(m?.arrangedHours ?? 0) || 0,
        hoursTarget: Number(m?.hoursTarget ?? 0) || 0,
        weight: Number(m?.weight ?? 0) || 0
      }))
    }));
    const participantsCount = Array.isArray(plan?.participants) ? plan.participants.length : 0;
    return { phases: summaryPhases, participantsCount };
  } catch (e) {
    return { phases: [], participantsCount: 0 };
  }
}

// 发布摘要到全局并派发事件
export function publishPlanSummary(summary) {
  if (typeof window === 'undefined') return;
  window[PLAN_SUMMARY_GLOBAL_KEY] = summary;
  try {
    const json = JSON.stringify(summary);
    localStorage.setItem(PLAN_SUMMARY_STORAGE_KEY, json);
  } catch {}
  try {
    window.dispatchEvent(new Event(PLAN_SUMMARY_EVENT));
  } catch {}
}

// 读取最新摘要
export function getLatestPlanSummary() {
  if (typeof window === 'undefined') return null;
  const inMemory = window[PLAN_SUMMARY_GLOBAL_KEY];
  if (inMemory) return inMemory;
  try {
    const raw = localStorage.getItem(PLAN_SUMMARY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// 订阅摘要更新
export function subscribePlanSummaryUpdated(handler) {
  if (typeof window === 'undefined' || typeof handler !== 'function') return () => {};
  const cb = () => handler(getLatestPlanSummary());
  window.addEventListener(PLAN_SUMMARY_EVENT, cb);
  return () => window.removeEventListener(PLAN_SUMMARY_EVENT, cb);
}