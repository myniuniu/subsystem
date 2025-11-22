const data={pinned:[{id:"tp_org_new_teacher_online_001",title:"新教师入职线上培训具体方案",sourceType:"培训方案",statusTag:"执行中"}],phases:[{id:1,week:"第1阶段",content:"学校文化与制度",type:"直播讲座",hours:6},{id:2,week:"第2阶段",content:"教学基本规范",type:"录播视频",hours:6},{id:3,week:"第3阶段",content:"学生管理基础",type:"直播课程",hours:6},{id:4,week:"第4阶段",content:"教育技术应用",type:"操作演示",hours:6},{id:5,week:"第5阶段",content:"教学设计进阶",type:"专题讲座",hours:8},{id:6,week:"第6阶段",content:"课堂教学技能",type:"示范课观摩",hours:8},{id:7,week:"第7阶段",content:"差异化教学",type:"案例研讨",hours:8},{id:8,week:"第8阶段",content:"教学反思与改进",type:"反思写作",hours:8},{id:9,week:"第9阶段",content:"教育科研入门",type:"理论学习",hours:8},{id:10,week:"第10阶段",content:"校本课程开发",type:"项目学习",hours:8},{id:11,week:"第11阶段",content:"家校沟通艺术",type:"情景演练",hours:8},{id:12,week:"第12阶段",content:"教师职业规划",type:"导师指导",hours:8}],materials:{1:{live:[{id:"org_ntm_phase1_lecture_001",title:"学校文化与制度 · 直播讲座",instructor:"校长办公室刘老师",time:"2025-02-05 19:00-20:30"}]},2:{videos:[{id:"org_ntm_norms_001",title:"教学基本规范（课堂纪律与仪表）",duration:"30分钟"},{id:"org_ntm_norms_002",title:"教学基本规范（备课与作业设计）",duration:"35分钟"},{id:"org_ntm_norms_003",title:"教学基本规范（课堂提问与评价）",duration:"40分钟"}]},3:{live:[{id:"org_ntm_phase3_live_001",title:"学生管理基础 · 班级纪律与规则",instructor:"德育处王老师",time:"2025-02-12 19:00-20:30"},{id:"org_scene_phase3_live_001",title:"情景模拟：班级突发事件处置（直播演练）",instructor:"德育处王老师",time:"2025-03-05 19:00-20:00"}],achievements:[{id:"achv-scene-1",title:"情景模拟：心理健康辅导场景训练",status:"未完成"}]},4:{texts:[{id:"achv-edu-tech-1",title:"研修成果：微课作品与教学应用"}]},5:{exams:[{id:"exam_phase_5_topic_lecture_assessment",title:"教学设计进阶｜专题讲座研修作业（100分）"}]},6:{videos:[{id:"org_ntm_demo_001",title:"示范课观摩：课堂导入与活动组织",duration:"30分钟"},{id:"org_ntm_demo_002",title:"示范课观摩：板书与节奏控制",duration:"35分钟"}],exams:[{id:"exam_phase_6_demo_observation_sheet",title:"课堂教学技能｜示范课观摩记录表（100分）"}]},7:{texts:[{id:"case-1",title:"案例研讨：课堂管理冲突处理"}]},8:{texts:[{id:"reflect-1",title:"反思写作：一次失败的提问活动"}]},9:{links:[{id:"ln-1",title:"教育理论精读：布鲁纳的认知发现学习"},{id:"ln-2",title:"教育心理学基础简读"}]},10:{projects:[{id:"tp_org_new_teacher_online_001",title:"新教师入职线上培训具体方案",status:"执行中"}]},11:{live:[{id:"org_ntm_phase11_live_001",title:"家校沟通艺术 · 情景演练",instructor:"心理中心吴老师",time:"2025-03-26 19:00-20:00"}]},12:{live:[{id:"org_ntm_phase12_live_001",title:"教师职业规划 · 导师指导",instructor:"人事处赵老师",time:"2025-04-02 19:00-20:00"}]}}}
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e}
function renderPinned(){const root=document.getElementById("pinnedProjects");if(!root)return;root.innerHTML="";if(!data.pinned||!data.pinned.length){const empty=el("div","sp-empty","无置顶项目");root.appendChild(empty);return}data.pinned.forEach(p=>{const card=el("div","sp-card");const title=el("div","sp-card-title",p.title);const tags=el("div");const t1=el("span","sp-tag","培训方案");const t2=el("span","sp-tag good",p.statusTag||"进行中");tags.appendChild(t1);tags.appendChild(t2);card.appendChild(title);card.appendChild(tags);root.appendChild(card)})}
const videoSources={
  org_ntm_norms_001:{
    src:"assets/demo1.mp4",
    article:"教学基本规范（课堂纪律与仪表）原文\n\n一、课堂纪律要求：\n1. 按时到课，遵守课堂秩序；\n2. 积极参与课堂活动，保持良好学习状态。\n\n二、教师仪表规范：\n1. 着装整洁得体；\n2. 仪态端正，语言文明；\n3. 树立良好师德形象。"
  },
  org_ntm_norms_002:{
    src:"https://www.w3schools.com/html/mov_bbb.mp4",
    article:"教学基本规范（备课与作业设计）原文：目标-活动-评价三对齐的具体要求与示例。"
  },
  org_ntm_norms_003:{
    src:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    article:"教学基本规范（课堂提问与评价）原文：提问层级与形成性评价要点。"
  }
};
function showDetail(video){try{const rootListPinned=document.getElementById("pinnedProjects");const rootListPhases=document.getElementById("phases");const detail=document.getElementById("detail");const titleEl=document.getElementById("detailTitle");const videoEl=document.getElementById("detailVideo");const articleEl=document.getElementById("detailArticle");
  rootListPinned.style.display="none";rootListPhases.style.display="none";detail.style.display="block";
  titleEl.textContent=video.title||"视频详情";
  const vs=videoSources[video.id]||{};videoEl.src=vs.src||"";articleEl.textContent=vs.article||"暂无原文";
}catch(e){}}
function backToList(){try{const rootListPinned=document.getElementById("pinnedProjects");const rootListPhases=document.getElementById("phases");const detail=document.getElementById("detail");const videoEl=document.getElementById("detailVideo");
  detail.style.display="none";rootListPinned.style.display="block";rootListPhases.style.display="block";try{videoEl.pause()}catch(e){}
}catch(e){}}
function renderPhases(){const root=document.getElementById("phases");root.innerHTML="";data.phases.forEach(p=>{const box=el("div","sp-phase");const head=el("div","sp-phase-head");const left=el("div","sp-phase-title");left.appendChild(el("span","",p.week));left.appendChild(el("span","",p.content));left.appendChild(el("span","sp-tag",p.type));const right=el("div");right.appendChild(el("span","sp-tag",`${p.hours}学时`));head.appendChild(left);head.appendChild(right);const content=el("div","sp-phase-content");head.addEventListener("click",()=>{const v=content.style.display==="block"?"none":"block";content.style.display=v});const mats=data.materials[p.id]||{};function openVideo(id){const vids=mats.videos||[];const v=vids.find(x=>x.id===id)||{id,title:"视频详情"};showDetail(v)}
function list(sectionTitle,items,kind){const sub=el("div","sp-sub");const subTitle=el("div","sp-sub-title");subTitle.appendChild(el("span","",sectionTitle));sub.appendChild(subTitle);if(!items||!items.length){sub.appendChild(el("div","sp-empty","暂无内容"));content.appendChild(sub);return}const list=el("div","sp-list");items.forEach(it=>{const item=el("div","sp-item");const main=el("div","sp-item-main");main.appendChild(el("div","sp-item-title",it.title));const d=[];if(it.instructor)d.push(it.instructor);if(it.time)d.push(it.time);if(it.duration)d.push(it.duration);if(d.length)main.appendChild(el("div","sp-item-desc",d.join(" · ")));const badges=el("div","sp-badges");const b=el("span","badge "+kind,sectionTitle);badges.appendChild(b);item.appendChild(main);item.appendChild(badges);if(kind==="video"){item.addEventListener("click",()=>openVideo(it.id))}list.appendChild(item)});sub.appendChild(list);content.appendChild(sub)}
list("直播课",mats.live,"live");list("录播视频",mats.videos,"video");list("阅读材料",mats.links,"link");list("文本",mats.texts,"text");list("考试/试卷",mats.exams,"exam");list("研修成果",mats.achievements,"achv");list("培训项目",mats.projects,"proj");box.appendChild(head);box.appendChild(content);root.appendChild(box)})}
function expandAll(){document.querySelectorAll(".sp-phase-content").forEach(elm=>{elm.style.display="block"})}
function collapseAll(){document.querySelectorAll(".sp-phase-content").forEach(elm=>{elm.style.display="none"})}
document.getElementById("expandAll").addEventListener("click",expandAll)
document.getElementById("collapseAll").addEventListener("click",collapseAll)
document.getElementById("backToList").addEventListener("click",backToList)
renderPinned()
renderPhases()
