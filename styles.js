// 风格库：人格化视角（不再是抽象的导演/作者梗），按文体打标；后续更新持续扩充第二批及以后
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
{n:'讲给大人听的童话',t:['micro','zuowen','ad','story']},
// ===== 第二批：更多方向（每次更新链接都会扩充） =====
// 校园·成长
{n:'毕业典礼上的致辞',t:['zuowen','story','scene','short']},
{n:'晚自习窗边的走神',t:['zuowen','story','micro','short']},
{n:'班主任的家访路',t:['story','scene','series','zuowen']},
{n:'课桌里传的纸条',t:['micro','short','story','scene']},
{n:'运动会广播稿的热血',t:['zuowen','short','ad','story']},
// 职场·谋生
{n:'会计月底对账的细密',t:['story','scene','series','micro']},
{n:'销售业绩单背后的疲惫',t:['story','scene','series']},
{n:'值班室里的泡面时间',t:['scene','short','story','micro']},
{n:'面试官的三分钟观察',t:['short','scene','micro','series']},
{n:'创业者凌晨的写字楼',t:['story','film','series','scene']},
// 乡村·土地
{n:'麦收时节的场院',t:['story','film','series','scene']},
{n:'赶集路上的吆喝',t:['scene','series','story','ad']},
{n:'老井台边的闲坐',t:['story','scene','zuowen','series']},
{n:'山货进城的一路',t:['story','vlog','scene','ad']},
{n:'祠堂修谱的郑重',t:['story','zuowen','series','film']},
// 幽默·轻快
{n:'相亲桌上的错位对话',t:['micro','scene','short','series']},
{n:'家长群里的考古现场',t:['micro','vlog','series','ad']},
{n:'广场舞C位的自信',t:['vlog','micro','scene','ad']},
{n:'宠物拆家后的庭审',t:['vlog','micro','ad','short']},
{n:'年会上忘词的节目',t:['scene','micro','series','short']},
// 想象·科幻
{n:'时间旅行者的留言条',t:['micro','short','story','film']},
{n:'AI学会撒谎的第一天',t:['film','series','short','jbs']},
{n:'末班地铁开往未来',t:['short','film','micro','story']},
{n:'外星人观察员的报告',t:['micro','zuowen','short','jbs']},
{n:'记忆可以备份之后',t:['film','series','story','short']},
// 历史·厚重
{n:'老物件背后的年代',t:['story','zuowen','film','series']},
{n:'家书里的战火年代',t:['zuowen','story','film','scene']},
{n:'老照片修复师的发现',t:['story','film','series','micro']},
{n:'口述历史的录音带',t:['zuowen','series','film','story']},
{n:'古城墙下的低语',t:['story','film','zuowen','scene']},
// 美食·烟火
{n:'夜市摊前的排队人',t:['scene','vlog','series','ad']},
{n:'外婆菜谱的传抄',t:['zuowen','story','micro','vlog']},
{n:'早餐铺开张半小时',t:['scene','series','vlog','story']},
{n:'深夜食堂的常客',t:['scene','series','story','short']},
{n:'一桌年夜饭的筹备',t:['story','scene','series','zuowen']},
// 旅行·在路上
{n:'绿皮车过道上的闲聊',t:['story','vlog','scene','series']},
{n:'青旅留言墙的阅读',t:['micro','story','vlog','zuowen']},
{n:'自驾抛锚的 roadside',t:['vlog','story','scene','micro']},
{n:'导游喇叭之外的静',t:['story','scene','vlog','zuowen']},
{n:'边境小站的清晨',t:['film','story','scene','series']},
// 运动·身体
{n:'马拉松三十公里处',t:['story','scene','vlog','ad']},
{n:'球馆末场灯灭前',t:['short','scene','story','series']},
{n:'康复科里的重新学步',t:['story','scene','series','zuowen']},
{n:'泳道里的呼吸节奏',t:['micro','short','story','ad']},
// 动物·自然
{n:'老狗等待的一下午',t:['micro','story','scene','short']},
{n:'阳台种菜的四季',t:['zuowen','vlog','micro','story']},
{n:'候鸟过境的那一周',t:['zuowen','story','film','vlog']},
{n:'暴雨前蚂蚁的搬家线',t:['micro','zuowen','short','story']},
// 手艺·匠心
{n:'木匠刨花里的年轮',t:['story','zuowen','scene','series']},
{n:'裁缝铺改一条旧裤',t:['scene','story','micro','series']},
{n:'修钢笔的老主顾',t:['story','micro','scene','zuowen']},
{n:'理发店镜前的三十年',t:['story','scene','series','film']}
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
