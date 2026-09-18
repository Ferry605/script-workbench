// 风格库：50 个人格化视角（不再是抽象的导演/作者梗），按文体打标
// 骰子会根据当前择定的文体，从适用该文体的视角里随机抽取
const STYLE_POOL=[
{n:'多年后的自己回望',t:['short','film','series','scene','story','zuowen','micro']},
{n:'知情老友的口吻',t:['story','scene','series','film','micro']},
{n:'旁观者的冷静注视',t:['short','scene','series','story','film']},
{n:'当事人亲历自述',t:['vlog','zuowen','story','scene','short']},
{n:'给故人的一封信',t:['zuowen','story','micro','scene']},
{n:'深夜电台的陪伴',t:['vlog','ad','story','scene']},
{n:'长辈讲古的从容',t:['story','zuowen','series','scene']},
{n:'少年心事的热切',t:['zuowen','story','micro','short','film']},
{n:'档案记录者的克制',t:['turtle','jbs','series','zuowen']},
{n:'老同桌的视角',t:['zuowen','story','micro','short']},
{n:'女儿的目光',t:['story','film','scene','zuowen']},
{n:'儿子的沉默',t:['story','film','scene','zuowen']},
{n:'老兵的平静',t:['story','film','series','scene']},
{n:'时代洪流下的小人物',t:['film','series','story']},
{n:'山河岁月的宏大视角',t:['film','story','series']},
{n:'市井烟火的热闹',t:['scene','series','story','ad']},
{n:'陌生旅人的路过',t:['story','scene','vlog','short']},
{n:'深夜便利店的一夜',t:['short','scene','story','series']},
{n:'老照片前的凝视',t:['story','film','zuowen','series']},
{n:'修表匠的耐心',t:['story','scene','short','series']},
{n:'医生面对生死的平静',t:['scene','series','story','film']},
{n:'接线员听见的世界',t:['short','series','scene','story']},
{n:'司机夜路上的独白',t:['vlog','story','scene','short']},
{n:'摆摊人的算账声',t:['scene','series','story','ad']},
{n:'老屋拆迁前的告别',t:['story','zuowen','film','scene']},
{n:'春运站台上的张望',t:['story','film','scene','series']},
{n:'工地上的号子',t:['series','story','scene','film']},
{n:'手写书信的郑重',t:['zuowen','story','micro','scene']},
{n:'微信语音的碎碎念',t:['vlog','micro','ad']},
{n:'直播间里的家常',t:['vlog','ad','micro']},
{n:'街坊邻居的闲话',t:['series','scene','story','micro']},
{n:'酒桌上欲言又止',t:['scene','micro','story','series']},
{n:'病房里的低声',t:['scene','story','series','film']},
{n:'深夜厨房的烟火',t:['scene','story','vlog','series']},
{n:'车站送别的克制',t:['story','scene','film','micro']},
{n:'雨夜屋檐下的避谈',t:['short','scene','story','micro']},
{n:'老师批改作业的耐心',t:['zuowen','story','scene','series']},
{n:'保安亭里的夜班',t:['short','scene','story','series']},
{n:'渔船出海的辽阔',t:['story','film','series','vlog']},
{n:'火车硬座的漫谈',t:['story','scene','series','vlog']},
{n:'童年夏夜的追忆',t:['zuowen','story','film','ad']},
{n:'中年回望的释然',t:['story','zuowen','film','series']},
{n:'谜题出题人的引导',t:['turtle','jbs']},
{n:'侦探笔记的条理',t:['turtle','jbs','series']},
{n:'幸存者的复述',t:['turtle','story','film','jbs']},
{n:'全知旁白的悲悯',t:['film','series','story','scene']},
{n:'镜头诗的留白',t:['short','film','scene','ad']},
{n:'广告文案的温度',t:['ad','vlog','micro']},
{n:'说明书里的深情',t:['ad','micro','turtle']},
{n:'讲给大人听的童话',t:['micro','zuowen','ad','story']}
];
// 按文体索引
const STYLES_BY_TYPE=(function(){
  const m={};
  Object.keys({short:1,film:1,series:1,scene:1,ad:1,vlog:1,turtle:1,micro:1,zuowen:1,jbs:1,story:1}).forEach(k=>m[k]=[]);
  STYLE_POOL.forEach(s=>s.t.forEach(k=>{if(m[k])m[k].push(s.n);}));
  return m;
})();
function rollStyle(){
  const pool=STYLES_BY_TYPE[currentGenType]||STYLE_POOL.map(s=>s.n);
  const el=document.getElementById('gRef');
  const cur=el.value.trim();
  let v=pool[Math.floor(Math.random()*pool.length)];
  // 若只有一个候选且与当前相同，直接返回
  let tries=0;
  while(pool.length>1&&v===cur&&tries<8){v=pool[Math.floor(Math.random()*pool.length)];tries++;}
  el.value=v;
  toast('🎲 '+v);
}
