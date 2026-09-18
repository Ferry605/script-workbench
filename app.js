// 剧本工作台 云端版 v4 - 主程序
const KEY='script-workbench-v4';
const CLOUD_CFG_KEY='sw-cloud-cfg';

function getUserId(){let id=localStorage.getItem('sw-user-id');if(!id){id='u_'+Math.random().toString(36).slice(2,10);localStorage.setItem('sw-user-id',id);}return id;}
function loadData(){try{const raw=localStorage.getItem(KEY);return raw?JSON.parse(raw):{scripts:{},characters:{},scenes:{},saved:{}};}catch{return {scripts:{},characters:{},scenes:{},saved:{}};}}
function saveData(d){localStorage.setItem(KEY,JSON.stringify(d));}

let DB=loadData();
if(!DB.saved)DB.saved={};
let currentScriptId=null;
let currentGenType='short';
let CLOUD=null;

const SCRIPT_TYPES={
short:{name:'短片',struct:'开场 → 冲突 → 高潮 → 结尾'},
film:{name:'电影',struct:'三幕结构（建置/对抗/解决）'},
series:{name:'剧集试播集',struct:'冷开场 → 主线 → 钩子'},
scene:{name:'单场戏',struct:'起承转合 + 情绪变化'},
ad:{name:'广告',struct:'痛点 → 方案 → 品牌'},
vlog:{name:'Vlog',struct:'钩子 → 故事 → CTA'},
turtle:{name:'海龟汤',struct:'汤面（情境）→ 提问 → 是/否回答 → 推理还原真相'},
micro:{name:'小剧本',struct:'一句话张力 + 单场景 + 反转结尾（≤3 分钟）'},
zuowen:{name:'作文',struct:'标题 → 开篇点题 → 主体论述/叙事 → 结尾升华（语言紧密）'},
jbs:{name:'剧本杀',struct:'背景 → 人物（每人秘密）→ 一幕幕分场推进 → 每场有线索 → 真相揭晓'},
story:{name:'故事',struct:'起 → 承 → 转 → 合（人物 + 冲突 + 主题）'}
};
const GENRES=['科幻','悬疑','爱情','喜剧','动作','恐怖','古装','青春','战争','家庭','都市','奇幻'];

// ===== 云端配置 =====
function loadCloudCfg(){try{return JSON.parse(localStorage.getItem(CLOUD_CFG_KEY)||'null');}catch{return null;}}
function saveCloudCfg(c){localStorage.setItem(CLOUD_CFG_KEY,JSON.stringify(c));}

function setupCloud(){
showModal('<h3>☁️ 配置云端存储</h3>'+
'<p style="opacity:.8;font-size:13px;line-height:1.7;margin-bottom:14px">数据存云端，多设备同步。最简单用 <b>JSONBin.io</b>（免登录可用公共模式）：</p>'+
'<button class="btn cloud full" onclick="usePublicCloud()">🌐 免登录公共云端（30秒）</button>'+
'<div style="height:8px"></div>'+
'<button class="btn ghost full" onclick="usePrivateCloud()">🔐 私有云端（注册 JSONBin）</button>'+
'<div style="font-size:11px;opacity:.6;margin-top:14px;line-height:1.6">免登录模式：所有用户共享一份数据，适合临时分享。<br>私有模式：只有你能访问，更安全。</div>'
);
}

async function usePublicCloud(){
CLOUD={mode:'public',binId:'66e0c5b3e41b4d34e5b3e1a0',masterKey:'$2b$10$placeholder',baseUrl:'https://api.jsonbin.io/v3'};
saveCloudCfg(CLOUD);closeModal();
await syncFromCloud();updateCloudStatus();renderList();
toast('☁️ 已连接公共云端');
}

async function usePrivateCloud(){
showModal('<h3>🔐 私有云端配置</h3>'+
'<p style="opacity:.8;font-size:13px;line-height:1.7;margin-bottom:14px">需要先去 <a href="https://jsonbin.io" target="_blank" style="color:#a78bfa">jsonbin.io</a> 注册（免费）：</p>'+
'<ol style="opacity:.8;font-size:13px;line-height:1.9;margin-bottom:14px;padding-left:20px">'+
'<li>注册登录后点 <b>Create Bin</b></li>'+
'<li>内容粘贴 <code>{}</code>，设为 Private</li>'+
'<li>从 URL 末尾复制 Bin ID</li>'+
'<li>从 API Keys 复制 Master Key</li></ol>'+
'<label>Bin ID</label><input id="cb_binId" placeholder="例如：66e0c5b3e41b4d34e5b3e1a0" />'+
'<label>Master Key</label><input id="cb_masterKey" type="password" placeholder="$2b$10$..." />'+
'<button class="btn cloud full" style="margin-top:14px" onclick="connectPrivate()">☁️ 连接并同步</button>'
);
}

async function connectPrivate(){
const binId=document.getElementById('cb_binId').value.trim();
const masterKey=document.getElementById('cb_masterKey').value.trim();
if(!binId||!masterKey){toast('⚠️ 请填写完整');return;}
CLOUD={mode:'private',binId,masterKey,baseUrl:'https://api.jsonbin.io/v3'};
saveCloudCfg(CLOUD);closeModal();
await syncFromCloud();updateCloudStatus();renderList();
toast('☁️ 私有云端已连接');
}

function switchToLocal(){CLOUD=null;localStorage.removeItem(CLOUD_CFG_KEY);updateCloudStatus();toast('已切换本地');}

function updateCloudStatus(){
const dot=document.getElementById('modeDot');
const tag=document.getElementById('userTag');
const banner=document.getElementById('syncBanner');
const status=document.getElementById('cloudStatus');
if(CLOUD){
dot.className='user-dot cloud';
tag.textContent=CLOUD.mode==='public'?'公共云端':'私有云端';
banner.style.display='flex';
status.innerHTML='✅ <b>'+(CLOUD.mode==='public'?'公共':'私有')+'</b>云端 · Bin: <code>'+CLOUD.binId.slice(0,12)+'...</code> <button class="btn small ghost" style="margin-left:6px" onclick="syncToCloud()">⬆️</button> <button class="btn small ghost" onclick="syncFromCloud()">⬇️</button>';
}else{
dot.className='user-dot local';
tag.textContent='本地模式';
banner.style.display='none';
status.innerHTML='⚪ 未配置 · 数据仅本机';
}
}

async function cloudApi(method,path,body){
if(!CLOUD)return null;
const headers={'Content-Type':'application/json','X-Master-Key':CLOUD.masterKey};
const opts={method,headers};
if(body)opts.body=JSON.stringify(body);
try{
const r=await fetch(CLOUD.baseUrl+path,opts);
if(!r.ok){const t=await r.text();throw new Error('HTTP '+r.status);}
return await r.json();
}catch(e){toast('☁️ '+e.message);return null;}
}

async function syncToCloud(){
if(!CLOUD)return;
const payload={scripts:DB.scripts,characters:DB.characters,scenes:DB.scenes,saved:DB.saved,updated:Date.now(),by:getUserId()};
const r=await cloudApi('PUT','/b/'+CLOUD.binId,payload);
if(r)toast('☁️ 已上传');
}

async function syncFromCloud(){
if(!CLOUD)return;
const r=await cloudApi('GET','/b/'+CLOUD.binId+'/latest');
if(!r||!r.record){toast('☁️ 上传本地数据...');await syncToCloud();return;}
const data=r.record;
const n=Object.keys(data.scripts||{}).length;
if(n>0){
if(!confirm('云端有 '+n+' 个作品，覆盖本地？'))return;
DB.scripts=data.scripts||{};
DB.characters=data.characters||{};
DB.scenes=data.scenes||{};
DB.saved=data.saved||{};
saveData(DB);renderList();toast('☁️ 已恢复 '+n+' 个作品');
}else{
toast('☁️ 云端空，上传本地数据');
await syncToCloud();
}
}

let syncTimer=null;
function autoSync(){if(!CLOUD)return;clearTimeout(syncTimer);syncTimer=setTimeout(()=>syncToCloud(),1500);}

// ===== UI =====
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800);}
function initI18n(){
document.querySelectorAll('#langSwitch button').forEach(btn=>{
  btn.classList.toggle('active',btn.dataset.lang===currentLang);
  btn.onclick=()=>setLang(btn.dataset.lang);
});
applyI18N();
}

function switchTab(name){
document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
document.getElementById('page-'+name).classList.add('active');
document.querySelectorAll('.tab-item').forEach(t=>t.classList.remove('active'));
document.querySelector('.tab-item[data-page="'+name+'"]').classList.add('active');
if(name==='list')renderList();
if(name==='gen')renderGenUI();
if(name==='cmd')renderCmdUI();
}
function esc(s){return (s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function renderList(){
const ids=Object.keys(DB.scripts);
document.getElementById('scriptCount').textContent=ids.length;
const list=document.getElementById('scriptList');
if(!ids.length){
  list.innerHTML='<div class="empty-list">'+t('emptyScripts')+'</div>';
  return;
}
list.innerHTML=ids.sort((a,b)=>(DB.scripts[b].updated||0)-(DB.scripts[a].updated||0)).map(function(id){
  var s=DB.scripts[id];
  var cn=Object.values(DB.characters).filter(function(c){return c.scriptId===id;}).length;
  var sn=Object.values(DB.scenes).filter(function(x){return x.scriptId===id;}).length;
  var stMap={draft:t('draftOpt'),writing:t('writingOpt'),done:t('doneOpt')};
  var title=esc(s.title||t('untitled'));
  var genre=esc(s.genre||t('genre'));
  var length=esc(s.length||t('length'));
  var status=stMap[s.status||'draft'];
  return '<div class="item" onclick="openScript(\''+id+'\')">'
    +'<div class="item-main">'
    +'<div class="item-title">'+title+'</div>'
    +'<div class="item-meta">'+genre+' · '+length+' · '+cn+t('person')+' '+sn+t('stage')+' · '+status+'</div>'
    +'</div>'
    +'<div class="item-actions"><button class="btn small ghost" onclick="event.stopPropagation();confirmDelScript(\''+id+'\')">🗑</button></div>'
    +'</div>';
}).join('');
}function newScript(){
const id='s_'+Date.now();
DB.scripts[id]={id,title:'',logline:'',genre:'',length:'',status:'draft',created:Date.now(),updated:Date.now()};
saveData(DB);autoSync();openScript(id);
}

function confirmDelScript(id){
if(!confirm('删除这个作品？'))return;
delete DB.scripts[id];
Object.values(DB.characters).filter(c=>c.scriptId===id).forEach(c=>delete DB.characters[c.id]);
Object.values(DB.scenes).filter(s=>s.scriptId===id).forEach(s=>delete DB.scenes[s.id]);
saveData(DB);autoSync();
if(currentScriptId===id)goList();else renderList();
toast(t('toastBurned'));
}

function openScript(id){
currentScriptId=id;
const s=DB.scripts[id];
document.getElementById('dTitle').value=s.title||'';
document.getElementById('dLogline').value=s.logline||'';
document.getElementById('dGenre').value=s.genre||'';
document.getElementById('dLength').value=s.length||'';
document.getElementById('dStatus').value=s.status||'draft';
document.getElementById('detailTitle').textContent=s.title||t('untitled');
const sb=document.getElementById('detailStatus');
sb.className='badge '+(s.status||'draft');
sb.textContent=({draft:'草稿',writing:'写作中',done:'已完成'})[s.status||'draft'];
document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
document.getElementById('page-detail').classList.add('active');
document.querySelectorAll('.tab-item').forEach(t=>t.classList.remove('active'));
renderGenreChips();renderCharacters();renderScenes();
}

function goList(){currentScriptId=null;switchTab('list');}

function saveScript(){
if(!currentScriptId)return;
const s=DB.scripts[currentScriptId];
s.title=document.getElementById('dTitle').value.trim();
s.logline=document.getElementById('dLogline').value.trim();
s.genre=document.getElementById('dGenre').value.trim();
s.length=document.getElementById('dLength').value.trim();
s.status=document.getElementById('dStatus').value;
s.updated=Date.now();
saveData(DB);autoSync();
document.getElementById('detailTitle').textContent=s.title||t("untitled");
const sb=document.getElementById('detailStatus');
sb.className='badge '+s.status;
sb.textContent=({draft:t('draftOpt'),writing:t('writingOpt'),done:t('doneOpt')})[s.status];
toast(t('toastSaved'));
}

function deleteScript(){confirmDelScript(currentScriptId);}

function renderGenreChips(){
const wrap=document.getElementById('genreChips');
const current=(DB.scripts[currentScriptId]?.genre||'').split(/[\/、,，]/).map(x=>x.trim()).filter(Boolean);
wrap.innerHTML=GENRES.map(g=>'<span class="chip '+(current.includes(g)?'active':'')+'" onclick="toggleGenre(\''+g+'\')">'+g+'</span>').join('');
}

function toggleGenre(g){
const input=document.getElementById('dGenre');
const cur=input.value.trim();
const parts=cur?cur.split(/[\/、,，]/).map(x=>x.trim()).filter(Boolean):[];
const idx=parts.indexOf(g);
if(idx>=0)parts.splice(idx,1);else parts.push(g);
input.value=parts.join(' / ');
renderGenreChips();
}

function renderCharacters(){
  var list=document.getElementById('charList');
  var chars=Object.values(DB.characters).filter(function(c){return c.scriptId===currentScriptId;});
  document.getElementById('charCount').textContent=chars.length;
  if(!chars.length){list.innerHTML='<div class="empty-list">'+t('charsEmpty')+'</div>';return;}
  list.innerHTML=chars.map(function(c){
    var title=esc(c.name||t('untitled'));
    var meta=esc(c.age||'')+' · '+esc(c.role||'')+' · '+esc(c.trait||'');
    return '<div class="item" onclick="editCharacter(\''+c.id+'\')">'
      +'<div class="item-main">'
      +'<div class="item-title">'+title+'</div>'
      +'<div class="item-meta">'+meta+'</div>'
      +'</div>'
      +'<div class="item-actions"><button class="btn small ghost" onclick="event.stopPropagation();delCharacter(\''+c.id+'\')">🗑</button></div>'
      +'</div>';
  }).join('');
}

function addCharacter(){if(currentScriptId)editCharacter(null);}
function editCharacter(cid){
const c=cid?DB.characters[cid]:{name:'',age:'',role:'',trait:'',secret:'',scriptId:currentScriptId};
const isNew=!cid;
showModal('<h3>'+(isNew?'➕ 新增人物':'✏️ 编辑人物')+'</h3>'+
'<label>姓名</label><input id="m_name" value="'+esc(c.name)+'" />'+
'<label>年龄</label><input id="m_age" value="'+esc(c.age)+'" />'+
'<label>身份</label><input id="m_role" value="'+esc(c.role)+'" />'+
'<label>性格</label><input id="m_trait" value="'+esc(c.trait)+'" />'+
'<label>隐藏动机</label><textarea id="m_secret" rows="2">'+esc(c.secret)+'</textarea>'+
'<button class="btn full" style="margin-top:14px" onclick="saveCharacter(\''+(cid||'')+'\')">💾 保存</button>');
}
function saveCharacter(cid){
const obj={scriptId:currentScriptId,
name:document.getElementById('m_name').value.trim(),
age:document.getElementById('m_age').value.trim(),
role:document.getElementById('m_role').value.trim(),
trait:document.getElementById('m_trait').value.trim(),
secret:document.getElementById('m_secret').value.trim()};
if(!obj.name){toast('请填写姓名');return;}
if(cid){DB.characters[cid]={...DB.characters[cid],...obj};}else{const id='c_'+Date.now();DB.characters[id]={id,...obj};}
saveData(DB);autoSync();closeModal();renderCharacters();toast('✓ 已保存');
}
function delCharacter(cid){if(!confirm('删除？'))return;delete DB.characters[cid];saveData(DB);autoSync();renderCharacters();toast('已删除');}

function renderScenes(){
  var list=document.getElementById('sceneList');
  var scenes=Object.values(DB.scenes).filter(function(x){return x.scriptId===currentScriptId;}).sort(function(a,b){return (a.seq||0)-(b.seq||0);});
  document.getElementById('sceneCount').textContent=scenes.length;
  if(!scenes.length){list.innerHTML='<div class="empty-list">'+t('scenesEmpty')+'</div>';return;}
  list.innerHTML=scenes.map(function(s){
    var title=esc((s.seq||'?')+'. '+(s.name||t('untitled')));
    var meta=esc(s.location||'')+' · '+esc(s.time||'');
    return '<div class="item" onclick="editScene(\''+s.id+'\')">'
      +'<div class="item-main">'
      +'<div class="item-title">'+title+'</div>'
      +'<div class="item-meta">'+meta+'</div>'
      +'</div>'
      +'<div class="item-actions"><button class="btn small ghost" onclick="event.stopPropagation();delScene(\''+s.id+'\')">🗑</button></div>'
      +'</div>';
  }).join('');
}
function addScene(){if(currentScriptId)editScene(null);}
function editScene(sid){
const s=sid?DB.scenes[sid]:{seq:'',location:'',time:'',purpose:'',notes:'',scriptId:currentScriptId};
const isNew=!sid;
showModal('<h3>'+(isNew?'➕ 新增场景':'✏️ 编辑场景')+'</h3>'+
'<label>场号</label><input id="m_seq" value="'+esc(s.seq)+'" placeholder="1 / 1a" />'+
'<label>地点</label><input id="m_loc" value="'+esc(s.location)+'" placeholder="INT. 咖啡馆 - 夜晚" />'+
'<label>时间</label><input id="m_time" value="'+esc(s.time)+'" />'+
'<label>场景目的</label><textarea id="m_purp" rows="2">'+esc(s.purpose)+'</textarea>'+
'<label>备注</label><textarea id="m_notes" rows="2">'+esc(s.notes)+'</textarea>'+
'<button class="btn full" style="margin-top:14px" onclick="saveScene(\''+(sid||'')+'\')">💾 保存</button>');
}
function saveScene(sid){
const obj={scriptId:currentScriptId,
seq:document.getElementById('m_seq').value.trim(),
location:document.getElementById('m_loc').value.trim(),
time:document.getElementById('m_time').value.trim(),
purpose:document.getElementById('m_purp').value.trim(),
notes:document.getElementById('m_notes').value.trim()};
if(sid){DB.scenes[sid]={...DB.scenes[sid],...obj};}else{const id='sc_'+Date.now();DB.scenes[id]={id,...obj};}
saveData(DB);autoSync();closeModal();renderScenes();toast('✓ 已保存');
}
function delScene(sid){if(!confirm('删除？'))return;delete DB.scenes[sid];saveData(DB);autoSync();renderScenes();toast('已删除');}

function showModal(html){document.getElementById('modalContent').innerHTML=html;document.getElementById('modal').classList.add('show');}
function closeModal(){document.getElementById('modal').classList.remove('show');}

function exportData(){
const data=JSON.stringify(DB,null,2);
const blob=new Blob([data],{type:'application/json'});
const url=URL.createObjectURL(blob);
const a=document.createElement('a');
a.href=url;
a.download='剧本工作台备份_'+new Date().toISOString().slice(0,10)+'.json';
a.click();
URL.revokeObjectURL(url);
toast('✓ 已导出');
}

function importData(){
const input=document.createElement('input');
input.type='file';input.accept='application/json';
input.onchange=e=>{
const file=e.target.files[0];if(!file)return;
const reader=new FileReader();
reader.onload=ev=>{
try{
const data=JSON.parse(ev.target.result);
if(!data.scripts||!data.characters||!data.scenes)throw new Error('格式不对');
if(!confirm('导入将覆盖当前数据，确认？'))return;
DB=data;saveData(DB);autoSync();renderList();toast('✓ 已导入');
}catch(err){alert('导入失败：'+err.message);}
};
reader.readAsText(file);
};
input.click();
}

function resetAll(){
if(!confirm('⚠️ 确认清空所有数据？'))return;
if(!confirm('再次确认：真的要删除吗？'))return;
DB={scripts:{},characters:{},scenes:{}};
saveData(DB);autoSync();renderList();toast('✓ 已清空');
}

function renderGenUI(){
const wrap=document.getElementById('typeChips');
const groups=[
{k:'影视',items:['short','film','series','scene','ad','vlog']},
{k:'文字',items:['story','zuowen','micro']},
{k:'游戏/推理',items:['turtle','jbs']}
];
const typeKey={short:'typeShort',film:'typeFilm',series:'typeSeries',scene:'typeScene',ad:'typeAd',vlog:'typeVlog',turtle:'typeTurtle',micro:'typeMicro',zuowen:'typeZuowen',jbs:'typeJbs',story:'typeStory'};
wrap.innerHTML=groups.map(g=>'<div style="margin-bottom:10px"><div style="font-size:11px;opacity:.6;margin-bottom:6px">'+t('group'+g.k.replace(/[\\/]/g,'_'))+'</div>'+g.items.map(k=>'<span class="chip '+(currentGenType===k?'active':'')+'" onclick="pickGenType(\''+k+'\')">'+t(typeKey[k])+'</span>').join('')+'</div>').join('');
}

const STYLE_DICE = {
  "short": [
    "反转",
    "开放结局",
    "黑色幽默",
    "意识流",
    "极简",
    "戛纳调性"
  ],
  "film": [
    "诺兰式",
    "是枝裕和式",
    "库布里克式",
    "王家卫式",
    "公路片",
    "黑色电影"
  ],
  "series": [
    "双时间线",
    "群像",
    "POV",
    "章节体",
    "反英雄",
    "单元剧"
  ],
  "scene": [
    "长镜头",
    "对白驱动",
    "静默",
    "默片式",
    "三一律",
    "一镜到底"
  ],
  "ad": [
    "30秒",
    "60秒",
    "公益",
    "反转",
    "一镜到底",
    "微电影"
  ],
  "vlog": [
    "失败",
    "日常",
    "挑战",
    "治愈",
    "独白",
    "反差"
  ],
  "turtle": [
    "本格",
    "变格",
    "新本格",
    "叙诡",
    "日常之谜",
    "连锁"
  ],
  "micro": [
    "反转",
    "张力",
    "单场景",
    "默剧",
    "极简",
    "群口"
  ],
  "zuowen": [
    "抒情",
    "叙事",
    "议论",
    "散文诗",
    "书信体",
    "古文风"
  ],
  "jbs": [
    "硬核",
    "阵营",
    "欢乐",
    "情感",
    "还原",
    "封闭"
  ],
  "story": [
    "散文",
    "反转",
    "意识流",
    "寓言",
    "极简",
    "魔幻"
  ]
};

function rollStyle(){
  var input=document.getElementById('gRef');
  if(!input)return;
  var pool=STYLE_DICE[currentGenType]||STYLE_DICE.short;
  var pick=pool[Math.floor(Math.random()*pool.length)];
  // 追加到现有内容（逗号分隔）
  var cur=input.value.trim();
  if(cur && cur.indexOf(pick)<0){
    input.value = cur + '，' + pick;
  } else if(cur && cur.indexOf(pick)>=0){
    // 已包含 → 换一个新关键词
    var others=pool.filter(function(p){return p!==pick;});
    pick=others[Math.floor(Math.random()*others.length)];
    input.value=cur.replace(pick, '').replace(/^，|，$/g,'') + '，' + pick;
  } else {
    input.value=pick;
  }
  // 小动画
  input.classList.remove('dice-roll');
  void input.offsetWidth;
  input.classList.add('dice-roll');
  toast(t('toastDiceRolled')||'🎲 已投骰');
}

function pickGenType(k){currentGenType=k;renderGenUI();}

initI18n();

function openGenerator(){
if(currentScriptId){
const s=DB.scripts[currentScriptId];
const chars=Object.values(DB.characters).filter(c=>c.scriptId===currentScriptId);
if(s.genre)document.getElementById('gGenre').value=s.genre;
if(s.logline)document.getElementById('gLogline').value=s.logline;
if(s.length)document.getElementById('gLength').value=s.length;
if(chars.length){
document.getElementById('gChars').value=chars.map(c=>c.name+'，'+(c.age||'')+'岁，'+(c.role||'')+'，'+(c.trait||'')+(c.secret?'——隐藏：'+c.secret:'')).join('\n');
}
}
switchTab('gen');
}

function generate(){
const genre=document.getElementById('gGenre').value.trim();
const logline=document.getElementById('gLogline').value.trim();
if(!genre&&!logline){toast(t('toastGenreMissing'));return;}
const r=freshExample(currentGenType);
document.getElementById('gOutput').textContent=r.text;
toast(t('toastGenOk'));
}
function loadExample(){
const r=freshExample(currentGenType);
document.getElementById('gOutput').textContent=r.text;
toast(t('toastExOk'));
}
// ===== 示例夹（保存 / 分享 / 删除） =====
function saveExample(){
const txt=document.getElementById('gOutput').textContent;
if(!txt.trim()){toast(t('toastEmpty'));return;}
const id='ex_'+Date.now();
DB.saved[id]={id,type:currentGenType,style:(document.getElementById('gRef').value||'').trim(),text:txt,created:Date.now()};
saveData(DB);autoSync();
toast(t('toastExSaved'));
}
const TYPE_LABEL={short:'typeShort',film:'typeFilm',series:'typeSeries',scene:'typeScene',ad:'typeAd',vlog:'typeVlog',turtle:'typeTurtle',micro:'typeMicro',zuowen:'typeZuowen',jbs:'typeJbs',story:'typeStory',article:'typeArticle'};
function showSavedExamples(){
const ids=Object.keys(DB.saved).sort((a,b)=>(DB.saved[b].created||0)-(DB.saved[a].created||0));
let body;
if(!ids.length){body='<div class="empty-list">'+t('exBookEmpty')+'</div>';}
else{
body='<div class="item-list">'+ids.map(function(id){
  var e=DB.saved[id];
  var prev=esc(e.text.slice(0,80))+(e.text.length>80?'…':'');
  var date=new Date(e.created||Date.now());
  var ds=date.getFullYear()+'-'+('0'+(date.getMonth()+1)).slice(-2)+'-'+('0'+date.getDate()).slice(-2);
  return '<div class="item" onclick="viewSaved(\''+id+'\')">'
    +'<div class="item-main">'
    +'<div class="item-title">'+esc(e.style||t(TYPE_LABEL[e.type]||'typeStory'))+'</div>'
    +'<div class="item-meta">'+esc(t(TYPE_LABEL[e.type]||'typeStory'))+' · '+ds+' · '+prev+'</div>'
    +'</div>'
    +'<div class="item-actions"><button class="btn small ghost" onclick="event.stopPropagation();delSaved(\''+id+'\')">🗑</button></div>'
    +'</div>';
}).join('')+'</div>';
}
showModal('<h3>📚 '+t('exBookBtn')+'</h3>'+body);
}
function viewSaved(id){
const e=DB.saved[id];if(!e)return;
showModal('<h3>'+esc(e.style||t(TYPE_LABEL[e.type]||'typeStory'))+'</h3>'
+'<div class="output" style="max-height:50vh">'+esc(e.text)+'</div>'
+'<div class="row">'
+'<button class="btn" onclick="copySaved(\''+id+'\')">'+t('copyGen')+'</button>'
+'<button class="btn ghost" onclick="shareSaved(\''+id+'\')">'+t('shareGen')+'</button>'
+'<button class="btn ghost" style="color:var(--vermilion);border-color:var(--vermilion)" onclick="delSaved(\''+id+'\')">'+t('burnScript')+'</button>'
+'</div>');
}
function copySaved(id){const e=DB.saved[id];if(!e)return;
if(navigator.clipboard){navigator.clipboard.writeText(e.text).then(()=>toast(t('toastCopied')));}
else{const ta=document.createElement('textarea');ta.value=e.text;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);toast(t('toastCopied'));}}
function shareSaved(id){const e=DB.saved[id];if(!e)return;
if(navigator.share){navigator.share({title:'剧本工作台 · 示例',text:e.text}).catch(()=>{});}
else{copySaved(id);}}
function delSaved(id){if(!DB.saved[id])return;
if(!confirm(t('toastBurned')+'？'))return;
delete DB.saved[id];saveData(DB);autoSync();showSavedExamples();toast(t('toastBurned'));}
// ===== 成文工坊 =====
function setLen(n){document.getElementById('aLen').value=n;}
function genArticle(){
const len=parseInt(document.getElementById('aLen').value,10)||800;
const r=freshArticle(len);
document.getElementById('aOutput').style.display='block';
document.getElementById('aOutput').textContent=r.text;
document.getElementById('aBtns').style.display='flex';
document.getElementById('aMeta').textContent='✓ 约 '+r.text.replace(/\s/g,'').length+' 字 · '+t(TYPE_LABEL[currentGenType]||'typeStory')+(r.style?' · '+r.style:'');
toast(t('toastArticleOk'));
}
function saveArticle(){
const txt=document.getElementById('aOutput').textContent;
if(!txt.trim()){toast(t('toastEmpty'));return;}
const id='ex_'+Date.now();
DB.saved[id]={id,type:'article',style:(document.getElementById('gRef').value||'').trim(),text:txt,created:Date.now()};
saveData(DB);autoSync();toast(t('toastExSaved'));
}
function copyArticle(){const e=document.getElementById('aOutput').textContent;
if(!e.trim()){toast(t('toastEmpty'));return;}
if(navigator.clipboard){navigator.clipboard.writeText(e).then(()=>toast(t('toastCopied')));}
else{const ta=document.createElement('textarea');ta.value=e;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);toast(t('toastCopied'));}}
function shareArticle(){const e=document.getElementById('aOutput').textContent;
if(!e.trim()){toast(t('toastEmpty'));return;}
if(navigator.share){navigator.share({title:'剧本工作台 · 成文',text:e}).catch(()=>{});}
else{copyArticle();}}
function copyGen(){
const t=document.getElementById('gOutput').textContent;
if(!t){toast(t('toastEmpty'));return;}
if(navigator.clipboard){navigator.clipboard.writeText(t).then(()=>toast('✓ 已复制'));}
else{const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);toast('✓ 已复制');}
}
function shareGen(){
const t=document.getElementById('gOutput').textContent;
if(!t){toast('暂无内容');return;}
if(navigator.share){navigator.share({title:'我的剧本提示词',text:t}).catch(()=>{});}
else{copyGen();}
}


// ===== 命令工坊：六个 AI 指令模板（糖心蛋交接需求） =====
let currentCmd='tone';
const TONES=['正式','非正式','专业','友好','权威','激励性'];
const CMDS={
tone:{label:'cmdTone',fields:['text','audience','tone']},
detail:{label:'cmdDetail',fields:['text']},
trim:{label:'cmdTrim',fields:['text']},
expand:{label:'cmdExpand',fields:['text','words']},
imitate:{label:'cmdImitate',fields:['text','theme']},
wording:{label:'cmdWording',fields:['text']},
humanize:{label:'cmdHumanize',fields:['text']},
polish:{label:'cmdPolish',fields:['text']},
coherent:{label:'cmdCoherent',fields:['text']},
reorg:{label:'cmdReorg',fields:['text']}
};
function renderCmdUI(){
document.getElementById('cmdChips').innerHTML=Object.keys(CMDS).map(k=>'<span class="chip '+(currentCmd===k?'active':'')+'" onclick="pickCmd(\''+k+'\')">'+t(CMDS[k].label)+'</span>').join('');
const f=CMDS[currentCmd].fields;
let html='';
if(f.indexOf('text')>=0)html+='<label>'+t('cmdText')+'</label><textarea id="cText" rows="7" placeholder="'+t('cmdTextPh')+'"></textarea>';
if(f.indexOf('audience')>=0)html+='<label>'+t('cmdAudience')+'</label><input id="cAudience" placeholder="'+t('cmdAudiencePh')+'" />';
if(f.indexOf('tone')>=0)html+='<label>'+t('cmdToneSel')+'</label><div id="toneChips">'+TONES.map(x=>'<span class="chip" data-tone="'+x+'" onclick="toggleTone(\''+x+'\')">'+x+'</span>').join('')+'</div>';
if(f.indexOf('theme')>=0)html+='<label>'+t('cmdTheme')+'</label><input id="cTheme" placeholder="'+t('cmdThemePh')+'" />';
if(f.indexOf('words')>=0)html+='<label>'+t('cmdWords')+'</label><input id="cWords" inputmode="numeric" placeholder="'+t('cmdWordsPh')+'" />';
document.getElementById('cmdFormWrap').innerHTML=html;
document.getElementById('cmdOutCard').style.display='none';
}
function pickCmd(k){currentCmd=k;_tones=[];renderCmdUI();}
let _tones=[];
function toggleTone(x){
const i=_tones.indexOf(x);
if(i>=0)_tones.splice(i,1);else _tones.push(x);
document.querySelectorAll('#toneChips .chip').forEach(el=>el.classList.toggle('active',_tones.indexOf(el.dataset.tone)>=0));
}
function cmdImport(){
const a=document.getElementById('aOutput'),g=document.getElementById('gOutput');
const txt=((a&&a.style.display!=='none'&&a.textContent.trim())?a.textContent:g.textContent).trim();
if(!txt){toast(t('toastEmpty'));return;}
const el=document.getElementById('cText');if(el)el.value=txt;
toast('✓ 已导入');
}
function buildCmd(){
const txt=(document.getElementById('cText')||{value:''}).value.trim();
if(!txt){toast(t('toastEmpty'));return;}
let p='';
if(currentCmd==='tone'){
if(!_tones.length){toast(t('toastPickTone'));return;}
p='请调整以下文本的语气，使其适合「'+((document.getElementById('cAudience')||{value:''}).value.trim()||'一般读者')+'」。\n'
+'要求：\n'
+'· 将语气调整为「'+_tones.join('、')+'」\n'
+'· 考虑目标受众的知识水平和期望，据此调整专业术语的使用密度\n'
+'· 确保语言符合预期的社交和文化环境\n'
+'· 调整语调以反映适当的情感基调\n'
+'· 保留原文的核心信息和意图\n\n'
+'【原文】\n'+txt;
}else if(currentCmd==='detail'){
p='请为以下文本增加更多具体细节和说明性内容：\n'
+'· 添加相关例子、案例或场景\n'
+'· 提供更具体的数据、统计或证据\n'
+'· 展开关键概念的解释\n'
+'· 补充背景信息或上下文\n'
+'· 用生动的描述替代抽象的陈述\n'
+'· 确保新增内容支持而非偏离原文主题\n\n'
+'【原文】\n'+txt;
}else if(currentCmd==='trim'){
p='请在不改变原文意思的基础上，对以下文章进行精简：\n'
+'· 围绕文章主题，删去与主题不相关的内容\n'
+'· 确保与原文结构逻辑一致，言简意赅\n\n'
+'【原文】\n'+txt;
}else if(currentCmd==='expand'){
const w=parseInt((document.getElementById('cWords')||{value:''}).value,10);
p='请在不改变原文意思的基础上，对以下文章进行扩写。要求如下：\n'
+'· 围绕文章主题，提供更丰富的信息和观点\n'
+'· 引入相关案例或数据支持文中论点，增强说服力\n'
+'· 结构清晰、逻辑连贯，易于读者理解\n'
+(w?'· 目标篇幅约 '+w+' 字\n':'')
+'\n【原文】\n'+txt;
}else if(currentCmd==='imitate'){
const th=(document.getElementById('cTheme')||{value:''}).value.trim();
if(!th){toast(t('toastNeedTheme'));return;}
p='请根据以下要求仿写文章。\n'
+'· 仿写样本：见下方【样本】\n'
+'· 仿写主题：'+th+'\n'
+'要求如下：\n'
+'· 仔细阅读并分析原文的风格、结构和语言特征，归纳要点，与我达成共识\n'
+'· 达成共识后，在原文的基础上重新仿写一篇文章，以「'+th+'」为主题\n'
+'· 积极运用原文的风格、结构和语言特征\n\n'
+'【样本】\n'+txt;
}else if(currentCmd==='humanize'){
p='请帮我重写以下文本，使其更自然、更像人类书写的内容：\n'
+'· 减少过于完美的句式结构\n'
+'· 添加适当的不规则表达\n'
+'· 使用更具个性化的语言\n'
+'· 偶尔使用口语化表达\n'
+'· 避免过于机械化的段落结构\n'
+'· 保留原文的核心信息和意图\n\n'
+'【原文】\n'+txt;
}else if(currentCmd==='polish'){
p='请对以下文本进行润色，使其更具表现力和吸引力：\n'
+'· 改进用词，使用更精准、生动的词汇\n'
+'· 调整句式，使表达更流畅自然\n'
+'· 增强语言的韵律感\n'
+'· 确保语言风格一致且符合场合\n'
+'· 修正任何语法或拼写错误\n'
+'· 保留原文的核心信息和意图\n\n'
+'【原文】\n'+txt;
}else if(currentCmd==='coherent'){
p='请重写以下文本，确保主题连贯一致：\n'
+'· 检查并强化中心思想贯穿全文\n'
+'· 确保每个段落都服务于主题\n'
+'· 增强段落之间的过渡和连接\n'
+'· 删除偏离主题的内容\n'
+'· 调整结构以形成清晰的逻辑发展\n'
+'· 保持论点、论据和结论之间的连贯性\n\n'
+'【原文】\n'+txt;
}else if(currentCmd==='reorg'){
p='请重新组织以下文本，使其更清晰、更易于理解：\n'
+'· 简化复杂的句子结构\n'
+'· 将长段落分解为更短、更聚焦的单元\n'
+'· 去除模糊或歧义表达\n'
+'· 使用明确的小标题划分内容（如适用）\n'
+'· 提高信息的层次性和条理性\n'
+'· 确保每个段落只包含一个中心思想\n\n'
+'【原文】\n'+txt;
}else{
p='请仔细阅读以下文章，改善文章中的用词，使文字描述更加准确、清晰和生动。\n\n【原文】\n'+txt;
}
document.getElementById('cmdOutCard').style.display='block';
document.getElementById('cmdOutput').textContent=p;
toast(t('toastCmdOk'));
}
function copyCmd(){const e=document.getElementById('cmdOutput').textContent;
if(!e.trim()){toast(t('toastEmpty'));return;}
if(navigator.clipboard){navigator.clipboard.writeText(e).then(()=>toast(t('toastCopied')));}
else{const ta=document.createElement('textarea');ta.value=e;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);toast(t('toastCopied'));}}
function shareCmd(){const e=document.getElementById('cmdOutput').textContent;
if(!e.trim()){toast(t('toastEmpty'));return;}
if(navigator.share){navigator.share({title:'剧本工作台 · 命令提示词',text:e}).catch(()=>{});}
else{copyCmd();}}


// 启动
CLOUD=loadCloudCfg();
document.getElementById('userIdDisplay').textContent=getUserId();
updateCloudStatus();
renderList();