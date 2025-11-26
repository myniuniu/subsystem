// 站点数据清理工具：与 clear-site-data.html 的逻辑保持一致
// 提供 Promise 接口，供组件直接调用一键清理

/**
 * 删除 Cache Storage 中的所有缓存
 */
async function clearCaches() {
  try {
    if (!('caches' in window)) {
      return { removed: 0, total: 0, message: '环境不支持 Cache Storage' };
    }
    const keys = await caches.keys();
    let removed = 0;
    for (const k of keys) {
      const ok = await caches.delete(k);
      if (ok) removed++;
    }
    return { removed, total: keys.length };
  } catch (e) {
    return { removed: 0, total: 0, error: e };
  }
}

/**
 * 注销所有 Service Worker 注册
 */
async function unregisterSW() {
  try {
    if (!('serviceWorker' in navigator)) {
      return { count: 0, message: '环境不支持 Service Worker' };
    }
    const regs = await navigator.serviceWorker.getRegistrations();
    let count = 0;
    for (const r of regs) {
      await r.unregister();
      count++;
    }
    return { count };
  } catch (e) {
    return { count: 0, error: e };
  }
}

/**
 * 清空 localStorage
 */
function clearLocalStorage() {
  try {
    const before = localStorage.length;
    localStorage.clear();
    return { count: before };
  } catch (e) {
    return { count: 0, error: e };
  }
}

/**
 * 清空 sessionStorage
 */
function clearSessionStorage() {
  try {
    const before = sessionStorage.length;
    sessionStorage.clear();
    return { count: before };
  } catch (e) {
    return { count: 0, error: e };
  }
}

function deleteDB(name) {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.deleteDatabase(name);
      req.onsuccess = () => resolve({ name, status: 'success' });
      req.onerror = () => resolve({ name, status: 'error' });
      req.onblocked = () => resolve({ name, status: 'blocked' });
    } catch (e) {
      resolve({ name, status: 'error', error: e });
    }
  });
}

/**
 * 删除所有 IndexedDB 数据库（若浏览器支持枚举）
 */
async function clearIndexedDB() {
  if (!('indexedDB' in window)) {
    return { total: 0, message: '环境不支持 IndexedDB（或被禁用）' };
  }
  try {
    if (typeof indexedDB.databases !== 'function') {
      return { total: 0, message: '当前浏览器不支持列举数据库，无法自动删除所有' };
    }
    const dbs = await indexedDB.databases();
    const names = (dbs || []).map(d => d.name).filter(Boolean);
    let success = 0, blocked = 0, failed = 0;
    for (const n of names) {
      const r = await deleteDB(n);
      if (r.status === 'success') success++; else if (r.status === 'blocked') blocked++; else failed++;
    }
    return { total: names.length, success, blocked, failed };
  } catch (e) {
    return { total: 0, error: e };
  }
}

/**
 * 一键清理站点数据
 * @param {Object} options
 * @param {boolean} options.clearCaches  删除 Cache Storage
 * @param {boolean} options.unregisterSW 注销 Service Worker
 * @param {boolean} options.clearLocalStorage 清空 localStorage
 * @param {boolean} options.clearIndexedDB 删除 IndexedDB
 * @returns {Promise<Object>} 结果汇总
 */
export async function runSiteDataCleanup({
  clearCaches: doCaches = true,
  unregisterSW: doSW = true,
  clearLocalStorage: doLS = true,
  clearIndexedDB: doIDB = true,
  clearSessionStorage: doSS = true
} = {}) {
  const result = { steps: {} };
  if (doCaches) result.steps.cache = await clearCaches();
  if (doSW) result.steps.sw = await unregisterSW();
  if (doLS) result.steps.ls = clearLocalStorage();
  if (doSS) result.steps.ss = clearSessionStorage();
  if (doIDB) result.steps.idb = await clearIndexedDB();
  return result;
}

export default {
  runSiteDataCleanup,
};
