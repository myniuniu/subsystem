// 证书服务：本地持久化 + 简单查询/生成

const STORAGE_KEY = 'smartnotes_certificates'

function ensureStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ certificates: [] }))
  }
}

function readAll() {
  ensureStorage()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = JSON.parse(raw || '{}')
    return Array.isArray(parsed.certificates) ? parsed.certificates : []
  } catch (e) {
    return []
  }
}

function writeAll(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ certificates: list }))
}

function generateId() {
  return 'cert_' + Math.random().toString(36).slice(2)
}

function formatDate(ts = Date.now()) {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function buildDataUrlHTML(cert) {
  const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"/><title>${cert.title}</title><style>
  body{font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial; background:#f7f9fc; padding:40px;}
  .card{max-width:800px; margin:0 auto; background:#fff; border:1px solid #e6e6e6; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.06);}
  .header{padding:24px 28px; border-bottom:1px solid #f0f0f0; display:flex; align-items:center; gap:12px}
  .header .badge{background:#1890ff; color:#fff; padding:6px 10px; border-radius:999px; font-size:12px}
  .content{padding:28px}
  h1{margin:0 0 8px; font-size:22px; color:#1f1f1f}
  .meta{color:#666; font-size:14px}
  .meta span{margin-right:16px}
  .section{margin-top:20px; line-height:1.8; color:#333}
  .footer{padding:18px 28px; border-top:1px solid #f0f0f0; color:#555; font-size:13px}
  </style>
  <div class="card">
    <div class="header">
      <div class="badge">电子证书</div>
      <div style="font-weight:600; color:#1890ff">${cert.issuer || '组织培训中心'}</div>
    </div>
    <div class="content">
      <h1>${cert.title}</h1>
      <div class="meta">
        <span>证书编号：${cert.serial}</span>
        <span>颁发日期：${formatDate(cert.achievedAt)}</span>
      </div>
      <div class="section">
        恭喜您在主题「${cert.topicTitle || cert.title}」中达标，特此颁发电子证书，以兹鼓励。
      </div>
    </div>
    <div class="footer">本证书由系统自动生成，仅供培训达标证明使用。</div>
  </div>
  </html>`
  const encoded = encodeURIComponent(html)
  return `data:text/html;charset=utf-8,${encoded}`
}

class CertificateService {
  listCertificates(query = '') {
    const all = readAll()
    if (!query) return all
    const q = String(query).toLowerCase()
    return all.filter(c =>
      (c.title || '').toLowerCase().includes(q) ||
      (c.topicTitle || '').toLowerCase().includes(q) ||
      (c.serial || '').toLowerCase().includes(q)
    )
  }

  getCertificateByTopic(topicId) {
    const all = readAll()
    return all.find(c => c.topicId === topicId) || null
  }

  issueCertificate({ title, topicId, topicTitle, issuer = '组织培训中心', type = 'training', achievedAt = Date.now() }) {
    const all = readAll()
    const exists = all.find(c => c.topicId === topicId)
    if (exists) return exists
    const serial = `CERT-${formatDate(achievedAt).replace(/-/g,'')}-${Math.random().toString(36).slice(2,6).toUpperCase()}`
    const cert = {
      id: generateId(),
      title: title || (topicTitle ? `${topicTitle} 达标证书` : '达标证书'),
      topicId,
      topicTitle,
      issuer,
      type,
      achievedAt,
      serial,
      fileUrl: ''
    }
    cert.fileUrl = buildDataUrlHTML(cert)
    writeAll([cert, ...all])
    return cert
  }

  ensureCertificateForTopic({ topicId, topicTitle, title }) {
    const found = this.getCertificateByTopic(topicId)
    if (found) return found
    return this.issueCertificate({ topicId, topicTitle, title })
  }
  removeCertificateByTopic(topicId) {
    const all = readAll()
    const next = all.filter(c => c.topicId !== topicId)
    writeAll(next)
    return next.length !== all.length
  }
}

const certificateService = new CertificateService()
export default certificateService