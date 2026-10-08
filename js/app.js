/* ============================================================
 *  JinTong 个人博客 · 前端逻辑
 *  - 笔记数据：运行时从 notes-data.json 加载（由 build_notes.py 生成）
 *  - 项目数据：运行时从 projects.json 加载
 *  - 笔记正文：Markdown 渲染（marked + highlight.js，CDN 加载）
 *  ============================================================ */

const $ = (s) => document.querySelector(s);
const GITHUB_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.3-.5-1.5.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.4 4.3 18.4 4.6 18.4 4.6c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z"/></svg>';

let NOTES = [];
let PROJECTS = [];
let currentTag = "全部";
let MARKED_OK = false;

/* ===== Markdown 渲染与代码高亮 ===== */
function escapeHtml(s){
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function highlightCode(code, lang){
  if (window.hljs && lang && hljs.getLanguage(lang)) {
    try { return hljs.highlight(code, { language: lang }).value; } catch (e) {}
  }
  return escapeHtml(code);
}
function setupMarked(){
  if (!window.marked) return false;
  marked.setOptions({ gfm: true, breaks: true });
  const renderer = new marked.Renderer();
  renderer.code = function(code, infostring){
    const lang = (infostring || "").trim().split(/\s+/)[0] || "";
    const cls = lang ? ' class="language-' + lang + ' hljs"' : ' class="hljs"';
    return "<pre><code" + cls + ">" + highlightCode(code, lang) + "</code></pre>";
  };
  marked.use({ renderer });
  return true;
}
function renderMarkdown(md){
  if (MARKED_OK) return marked.parse(md || "");
  return '<pre class="raw-note">' + escapeHtml(md || "") + "</pre>";
}

/* ===== 数据加载 ===== */
function showDataError(err){
  const banner = $("#dataBanner");
  banner.classList.add("show");
  banner.innerHTML =
    "笔记/项目数据加载失败（" + escapeHtml(String(err && err.message || err)) +
    "）。本地直接双击打开 HTML 时，浏览器会阻止页面读取数据文件。" +
    "请用本地服务器预览（<code>python -m http.server 8000</code> 后访问 localhost:8000），" +
    "或直接部署到 GitHub Pages 后访问。";
}
async function loadData(){
  const hint = $("#homeNotes");
  try {
    const [nRes, pRes] = await Promise.all([
      fetch("notes-data.json", { cache: "no-store" }),
      fetch("projects.json", { cache: "no-store" })
    ]);
    if (!nRes.ok) throw new Error("notes-data.json 返回 " + nRes.status);
    if (!pRes.ok) throw new Error("projects.json 返回 " + pRes.status);
    NOTES = await nRes.json();
    PROJECTS = await pRes.json();
  } catch (err) {
    showDataError(err);
  }
  renderAll();
}

/* ===== 渲染 ===== */
function sortedNotes(){ return [...NOTES].sort((a,b)=> (b.date||"").localeCompare(a.date||"")); }
function asArray(v){ return Array.isArray(v) ? v : (v == null || v === "" ? [] : [v]); }
function chipsHtml(tags){
  return asArray(tags).map(t => '<span class="chip">' + escapeHtml(t) + "</span>").join("");
}
function noteCardHtml(n){
  return '<a class="card" href="#note/' + encodeURIComponent(n.id) + '">'
    + '<div class="card-meta"><time>' + escapeHtml(n.date||"") + '</time><span class="dot">·</span><span>' + (n.minutes||0) + " 分钟</span></div>"
    + "<h3>" + escapeHtml(n.title) + "</h3>"
    + "<p>" + escapeHtml(n.excerpt||"") + "</p>"
    + '<div class="card-foot tags">' + chipsHtml(n.tags) + "</div>"
    + "</a>";
}
function projectCardHtml(p){
  return '<article class="card">'
    + "<h3>" + escapeHtml(p.name) + "</h3>"
    + "<p>" + escapeHtml(p.desc||"") + "</p>"
    + '<div class="card-foot tags">' + chipsHtml(p.tags) + "</div>"
    + '<a class="btn ghost btn-sm" href="' + escapeHtml(p.url||"#") + '" target="_blank" rel="noopener">' + GITHUB_ICON + "查看仓库</a>"
    + "</article>";
}

function renderHome(){
  const notes = sortedNotes().slice(0,3);
  const projects = PROJECTS.slice(0,3);
  $("#homeNotes").innerHTML = notes.map(noteCardHtml).join("");
  $("#homeProjects").innerHTML = projects.map(projectCardHtml).join("");
  $("#statNotes").textContent = NOTES.length;
  $("#statProjects").textContent = PROJECTS.length;
}
function uniqueTags(){
  const set = new Set();
  NOTES.forEach(n => asArray(n.tags).forEach(t => set.add(t)));
  return [...set];
}
function renderTags(){
  const tags = ["全部"].concat(uniqueTags());
  $("#noteTags").innerHTML = tags.map(t =>
    '<button type="button" class="chip' + (t===currentTag ? " active" : "") + '" data-tag="' + escapeHtml(t) + '">' + escapeHtml(t) + "</button>"
  ).join("");
  $("#notesCount").textContent = NOTES.length;
}
function renderNotesGrid(){
  const list = currentTag === "全部"
    ? sortedNotes()
    : sortedNotes().filter(n => asArray(n.tags).includes(currentTag));
  $("#notesGrid").innerHTML = list.map(noteCardHtml).join("");
  $("#notesEmpty").style.display = list.length ? "none" : "block";
}
function renderProjects(){
  $("#projectsGrid").innerHTML = PROJECTS.map(projectCardHtml).join("");
}
function renderNote(id){
  const n = NOTES.find(x => x.id === id);
  const box = $("#noteReader");
  if (!n){
    box.innerHTML = '<a class="back-link" href="#notes">返回笔记列表</a><h1>没有找到这篇笔记</h1><p class="tagline">它可能已被删除或地址有误。</p>';
    return;
  }
  box.innerHTML =
    '<a class="back-link" href="#notes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>返回笔记列表</a>'
    + "<h1>" + escapeHtml(n.title) + "</h1>"
    + '<div class="note-meta"><time>' + escapeHtml(n.date||"") + '</time><span class="dot">·</span><span>' + (n.minutes||0) + " 分钟</span><span class=\"dot\">·</span>" + chipsHtml(n.tags) + "</div>"
    + '<div class="note-body">' + renderMarkdown(n.body) + "</div>";
}
function renderAll(){
  renderHome();
  renderTags();
  renderNotesGrid();
  renderProjects();
  if (location.hash && location.hash.indexOf("#note/") === 0) renderNote(location.hash.slice(6));
}

/* ===== 路由 ===== */
const VIEW_TITLES = { home:"首页", notes:"笔记", projects:"项目", about:"关于" };
function navigate(){
  const hash = location.hash || "#home";
  let viewName = "home", noteId = null;
  if (hash.indexOf("#note/") === 0){ viewName = "note"; noteId = decodeURIComponent(hash.slice(6)); }
  else if (hash.charAt(0) === "#"){ viewName = hash.slice(1); }
  if (!VIEW_TITLES[viewName] && viewName !== "note"){ viewName = "home"; }

  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  const target = $("#view-" + viewName);
  if (target){ target.classList.add("active"); window.scrollTo({ top:0, left:0 }); }

  document.querySelectorAll(".nav-links a").forEach(a => {
    a.classList.toggle("active", a.dataset.view === viewName || (viewName === "note" && a.dataset.view === "notes"));
  });

  if (viewName === "note"){ renderNote(noteId); document.title = "笔记 · JinTong"; }
  else { document.title = VIEW_TITLES[viewName] + " · JinTong"; }
}

/* ===== 深浅色模式 ===== */
function applyTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  $("#iconSun").style.display = theme === "dark" ? "none" : "block";
  $("#iconMoon").style.display = theme === "dark" ? "block" : "none";
  try { localStorage.setItem("jt-theme", theme); } catch (e) {}
}
function initTheme(){
  let saved = null;
  try { saved = localStorage.getItem("jt-theme"); } catch (e) {}
  const theme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(theme);
}

/* ===== 事件绑定 ===== */
$("#themeToggle").addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme");
  applyTheme(cur === "dark" ? "light" : "dark");
});
$("#noteTags").addEventListener("click", (e) => {
  const btn = e.target.closest(".chip[data-tag]");
  if (!btn) return;
  currentTag = btn.dataset.tag;
  renderTags();
  renderNotesGrid();
});
window.addEventListener("hashchange", navigate);

/* ===== 初始化 ===== */
MARKED_OK = setupMarked();
initTheme();
navigate();
loadData();
