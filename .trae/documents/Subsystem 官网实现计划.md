## 目标与受众
- 明确官网的核心信息：产品定位、主要功能、典型场景、下载/试用入口、联系与支持
- 受众：教育行业管理者/教师/学生与技术同事（需要清晰的价值主张与上手路径）

## 信息架构
- 首页：价值主张、核心卖点、产品截图/动效、快速上手按钮
- 功能：模块概览（消息中心、学习分析、资源库、模拟平台等），每个模块的简述与亮点
- 场景：典型应用场景故事（如“新教师培训”“心理辅导”“课堂评价”）
- 展示：交互演示/视频/动画（复用现有组件截图或录屏）
- 下载与试用：桌面/网页入口说明，快速引导到应用
- 文档与支持：跳转到现有 Docs 或仓库 README
- 关于与联系：团队介绍、邮箱与工单渠道

## 设计与品牌
- 视觉：沿用当前应用的主题色与圆角/毛玻璃风格（与 `src/utils/themeManager.js` 一致）
- 组件：统一使用 `antd@5`（已依赖，见 `package.json:27`），图标用 `lucide-react` 与 `@ant-design/icons`
- 响应式：移动端优先，PC 与 Pad 自适应

## 技术实现
- 技术栈：Vite + React 单独入口的多页面（MPA）结构（当前项目为 Vite，见 `package.json:6-11`）
- 项目结构（新增）
  - `website.html`：官网独立入口（含 SEO Meta / OpenGraph）
  - `src/website/main.jsx`：挂载入口，复用 `initTheme`（参考 `src/main.jsx:5-8`）
  - `src/website/WebsiteApp.jsx`：官网主框架（Header / Footer / 路由）
  - `src/website/pages/*`：`Home`、`Features`、`Scenarios`、`Showcase`、`Download`、`Docs`、`About`、`Contact`、`FAQ`
  - `src/website/website.css`：样式（与现有主题变量协同）
  - `public/website/*`：静态资源（截图、视频、favicon、社交分享图）
- 路由：官网内部使用 `react-router-dom@6`（已依赖，见 `package.json:38`）
- Vite 配置：新增 `vite.config.js`，设置多入口
  - `build.rollupOptions.input = { main: 'index.html', website: 'website.html' }`
- 开发体验：保留现 `npm run dev` 用于应用，新增 `npm run dev:website`（直接打开 `website.html`）

## 内容准备
- 文案：中文为主，标题/副标题、模块卖点（3-5 条/模块）、场景故事（图文）
- 媒体：UI 截图、短视频/动效（可用现有组件录屏），社交分享图（1200×630）
- 法务：版权、隐私与数据声明（简版）

## SEO 与分析
- 基础：`title/description/keywords`，OG/Twitter 卡片、`favicon`、`sitemap.xml`、`robots.txt`
- 性能：首屏轻量、图片懒加载、资源压缩
- 统计：接入 Umami/Plausible 或 GA（可选，隐私友好优先）

## 部署与域名
- 方案 A：GitHub Pages（仓库已在 GitHub，`homepage` 指向 README，见 `package.json:62-63`）
  - 新增 `npm run build` 输出 MPA，使用 `gh-pages` 推送到 `gh-pages` 分支
  - 自定义域名绑定（可选）
- 方案 B：Netlify / Vercel（自动化 CI/CD，预览环境）

## 里程碑
- M1 架构与骨架：搭建多入口、页面路由与框架（1 天）
- M2 视觉与组件：完成首页与 3 个核心页面（1-2 天）
- M3 内容与媒体：完善文案与素材、SEO（1 天）
- M4 部署与质检：上线、性能与移动端适配检查（0.5 天）

## 验收标准
- 访问 `/website.html` 可单独进入官网，首页性能良好
- 页面完整：至少首页、功能、场景、下载、关于/联系、FAQ
- SEO 基础到位，移动端体验良好
- 与应用互通：官网有“立即体验/打开应用”按钮指向现应用（哈希导航，参考 `src/App.jsx:86-104`）

## 预计改动点（不立即执行）
- 新增：`website.html`、`src/website/*`、`public/website/*`、`vite.config.js`
- 脚本：`npm run dev:website`、`npm run deploy`（如选 GitHub Pages）
- 可选：在应用侧 `Sidebar` 增加“官网”外链按钮（打开 `website.html`）

请确认以上计划；确认后我将开始落地实现并交付可访问的官网入口与页面。