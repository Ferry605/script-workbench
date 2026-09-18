// 动态示例生成器：每次生成全新示例，绝不重复
// 原理：大量随机槽位组合 + 已见哈希去重（按文体记录最近 300 条）
(function(){
const NAMES=['林晚','陈默','苏辞','周野','顾一帆','许知遥','沈青山','叶蓁','陆知行','江眠','韩江雪','方拾','白树','温言','程野','秦九','纪风','明月','老周','阿蛮','洛尘','祝晓','乔一','麦冬','聂海','路遥','柏舟','宋辞','季夏','顾城北','老纪','二两','半夏','铁蛋','糖水','小满','阿灿','老猫','崔胜利','王秀兰','李建国','赵春梅','孙德发','马长贵','郑桂香','何三炮','高挑儿','冯幺妹','许大茂','吕秀才','傅明理','齐纳言','聂小倩','封不平','桑无邪','党育红','盛半夏','边关月','池鱼','应长安','闻人夜','雕哥','水嫩儿','老白干','跑得快','崔莺莺','温吞水','祝英台','煤球','大嗓门','一撮毛','扁担'];
const ROLES=['深夜便利店店员','退休刑警','刚失业的程序员','高中复读生','花店老板','外卖骑手','急诊科护士','旧书店老板','酒吧驻唱','纪录片导演','夜班出租车司机','天台养鸽人','地铁安检员','写字楼保洁阿姨','过气童星','守灯塔的人','废品站老板','代驾司机','早餐铺老板','钟表修理师','水产店老板','小学门卫','火锅店领班','快递分拣员','公交司机','剧院检票员','宠物美容师','二手车销售','驾校教练','夜市炒粉摊主','物业电工','保险理赔员','图书馆管理员','裁缝铺老板','远洋渔民','货运司机','塔吊司机','婚庆主持人','修手机的小哥','社区网格员','游乐场检票员','摄影工作室学徒','火车站小卖部老板','彩票站站主','澡堂搓澡师傅','电缆巡线工','水果摊主','中学宿管阿姨'];
const PLACES=['末班地铁','天桥底下','24小时便利店','老居民楼天台','医院走廊','拆迁中的巷子','深夜加油站','城中村出租屋','火车站候车厅','海边防波堤','停业的录像厅','小学操场','菜市场','台球厅','公交总站','雨夜的十字路口','凌晨的洗车行','巷口的面馆','旧货市场','江边步道'];
const OBJECTS=['一只停摆的怀表','半张电影票','一部旧诺基亚','一封没寄出的信','一把缺了骨的雨伞','一盒没听完的磁带','一张泛黄的全家福','一枚生锈的钥匙','一罐没开封的汽水','一本过期的借书证','一副老花镜','一只走失又回来的猫','一部老DV机','一张写了一半的欠条','半瓶没喝完的白酒','一张当票'];
const TIMES=['凌晨三点','除夕夜','暴雨傍晚','高考前夜','末班车进站时','初雪那天','停电的夏夜','冬至','周一早高峰','生日当天','婚礼前一小时','搬家那天','周六清晨','发工资那天','立秋那天','放假第一天'];
// 秘密与"物件"绑定成模板，保证全文逻辑闭环（不再出现沉重/死人梗）
const SECRET_TPL=[
c=>'它其实是'+c.c2+'当年悄悄留下的',
c=>'它本来是要送人的，一直没送出去',
c=>'它一直没坏——是有人不想让它坏',
c=>'它原本是一对，另一只在'+c.c2+'手里',
c=>'它是'+c.c1+'用第一份工钱换来的',
c=>'它背后有一行小字，是很多年后才被发现的',
c=>'它是别人特意托'+c.c1+'保管的',
c=>'它修过一次，找的人正是'+c.c2
];
const PRODUCTS=['一款助眠APP','一杯粗粮豆浆','一把自动伞','一辆共享单车','一瓶气泡水','一盏护眼台灯','一双跑鞋','一个记账APP','一台空气净化器','一顿预制晚餐'];
const TOPICS=['台阶','灯','旧物','渡口','归途','候鸟','空椅子','旧钟','巷口','背影','门缝','晚风'];
const THEMES=['一次没说出口的道谢','两代人没对上的频道','一件小事里的人情','一门快失传的手艺','一个慢慢兑现的承诺','一份记了很多年的账','一场迟到但不缺席的重逢','把日子过出滋味的人','一句改了主意的再见','老手艺遇上新主顾','一件东西两代人','街坊之间的来往'];
const TWISTS=['反转：他等的那个对象，其实一直坐在他旁边','反转：所有人以为的误会，是当事人唯一的温柔','反转：最后一句台词推翻前面所有对话','反转：真正的"恶人"到结尾都没出现','反转：观众以为的巧合，其实是好些年的预谋','反转：收尾一秒，画面里多出一个本不该在的人','反转：先走的人其实留了后手','反转：最不合群的那个，才是唯一清醒的','反转：全场只有一句台词是真的'];
const DUR=['三年','五年','七年','十年','十二年','整整八年','快十五年'];

// ===== 活力元素池：让每段剧情有呼吸感（海龟汤不注入） =====
const VITAL={
sensory:['风把一个塑料袋吹到脚边，转了半圈才停。','头顶的灯闪了两下，像在打暗号。','空气里有油烟味，混着一点雨。','邻座的汤太烫，说话都带着哈气。','地上一摊没干的水渍，映着半个招牌。','空调滴水，滴在铁皮上，一声，一声。','阳光斜进来，把灰尘照得清清楚楚。','墙上的福字褪了色，倒着贴。','桌腿底下垫着半块砖，桌子不晃了。','玻璃上全是手印，最小的那枚在最上面。','烟灰缸满了，最上面那根还冒着烟。','一道光从没拉严的窗帘缝里切进来，正好切在脸上。','门口蹲着条狗，看人出来，甩了甩尾巴。','风灌进来，桌上的纸被吹到地上。','水龙头没关紧，一滴一滴，滴了很久。'],
micro:['她把杯子转了半圈，又转回去。','他把烟夹在指间，忘了点。','她笑到一半，笑不动了。','他用鞋尖碾了碾地上的烟头。','她把头发别到耳后，想了想，又放下来。','他数了三遍零钱，数出三个不同的数。','她把围巾往上拉了拉，又扯回原位。','他靠着墙，慢慢出溜下去半寸。','她把手机扣在桌上，屏幕朝下。','他打了个哈欠，打到一半变成叹气。','她用指甲刮了下杯沿，声音很小。','他把袖子卷上去，看了一眼，又放下来。','她推开门，手还搭在门把上，先看了眼屋里。','他咽了口唾沫，没出声。','她把鞋蹭了蹭门槛，进了屋。','他往旁边挪了挪，腾出点地方。','她把东西放在桌上，往他那边推了推。'],
specific:['第 27 次按响门铃。','1998 年的挂历还挂在墙上，停在那年 6 月。','杯沿有个缺口，正好冲着他。','外卖备注写着：放门口，别敲。','鞋是新的，鞋带已经起毛了。','票根上的日期，比她说的早一天。','门牌号被人用记号笔描过一遍。','钟停在 4:44，电池是好的。','钱包里那张合照，边角磨圆了。','四米长的收银条底下，压着一颗水果糖。','窗帘拉绳打了个死结。','共享单车的坐垫，被人调到最低。'],
sound:['冰柜的嗡嗡声忽然大了一拍。','远处有人放了一挂鞭炮，就三响。','楼上的脚步声，停在第七级台阶。','外卖柜「哐当」一声合上。','谁的手机在包里震，没人接。','隔壁电视在放天气预报。','卷帘门拉到一半，卡住了。','热水壶按下去，半天没响。','电梯到了，门开了，没人。','雨点砸遮阳棚，先是一下，然后连成片。','耳机里漏出半句歌，走调的。','风铃响了一声。没有风。','楼道里的声控灯灭了，漆黑一片。','电视突然关了，啪的一声。','门被带上，声音很轻，像怕吵醒谁。'],
aside:['——说真的，这事儿搁谁身上谁都得懵。','——别问，问就是命。','——这话我原样转述，一个字没改。','——行吧。','——你要是不信，我也没辙。','——后来我才想明白这半句。','——这一段，我演了好些年。','——记住这个细节，后面要考。','——到这里，故事本来该结束了。','——可惜没有。','——我知道你在等这句。','——不信去问当事人，当事人是我。'],
closer:['[黑屏。]','[画面淡出。]','[定格。]','[切。]','[光收了。]','[字幕缓缓升起。]']
};
function vitalize(text){
  const lines=text.split('\n');
  const used={};
  function one(pool){
    let v=pick(pool),tries=0;
    while(used[v]&&tries<6){v=pick(pool);tries++;}
    used[v]=1;return v;
  }
  // 定位正文起点：跳过开头的【】标题与空行
  let start=0;
  while(start<lines.length&&(lines[start].trim()===''||/^[【\[].*[】\]]$/.test(lines[start].trim())))start++;
  const target=2+Math.floor(Math.random()*2); // 注入 2-3 处
  let inserted=0;
  const out=[];
  for(let i=0;i<lines.length;i++){
    const l=lines[i];
    const prev=lines[i-1]||'';
    const canInsert=i>start+1&&inserted<target&&l.trim()!==''&&!/^[【\[]/.test(l.trim())&&!/^[【\[]/.test(prev.trim());
    if(canInsert&&Math.random()<0.30){
      out.push('');
      out.push(one(pick([VITAL.sensory,VITAL.micro,VITAL.specific,VITAL.sound])));
      out.push('');
      inserted++;
    }
    out.push(l);
  }
  // 兜底：若正文太短没注入够，插到中间
  while(inserted<Math.min(2,target)&&out.length>start+4){
    const pos=start+2+Math.floor(Math.random()*(out.length-start-4));
    out.splice(pos,0,'',one(pick([VITAL.sensory,VITAL.micro,VITAL.specific])),'');
    inserted++;
  }
  // 口语插话：约 55% 概率加一句
  if(Math.random()<0.55){
    const pos=Math.max(start+3,Math.floor(out.length*0.6));
    out.splice(pos,0,'',one(VITAL.aside),'');
  }
  // 收尾多样化：把最后孤立的 [黑屏。] 随机换成别的收法
  const last=out.length-1;
  while(last>=0&&out[last].trim()==='')out.pop();
  if(/(黑屏|淡出|定格|光收|字幕)/.test((out[out.length-1]||'').trim())){
    out[out.length-1]=one(VITAL.closer);
  }
  return out.join('\n');
}

function pick(a){return a[Math.floor(Math.random()*a.length)];}
function pickN(a,n){const c=a.slice();const o=[];while(o.length<n&&c.length)o.push(c.splice(Math.floor(Math.random()*c.length),1)[0]);return o;}
function hashStr(s){let h=5381;for(let i=0;i<s.length;i++){h=((h<<5)+h+s.charCodeAt(i))|0;}return h;}
const SEEN_MAX=300;
function seenKey(type){return 'sw-seen-'+type;}
function loadSeen(type){try{return JSON.parse(localStorage.getItem(seenKey(type))||'[]');}catch(e){return [];}}
function saveSeen(type,arr){try{localStorage.setItem(seenKey(type),JSON.stringify(arr.slice(-SEEN_MAX)));}catch(e){}}

// 从提示素材里取用户人物名（解析每行第一个词）
function userChars(){
  const el=document.getElementById('gChars');
  if(!el)return [];
  return el.value.split(/\n/).map(l=>l.trim().split(/[，,：:]/)[0].trim()).filter(x=>x&&x.length<=8).slice(0,4);
}
function ctx(){
  const g=(document.getElementById('gGenre')||{}).value||'';
  const l=(document.getElementById('gLogline')||{}).value||'';
  const r=(document.getElementById('gRef')||{}).value||'';
  const uc=userChars();
  const base={ genre:g.trim(),
    logline:l.trim(),
    style:r.trim()||pick(STYLE_POOL.filter(s=>s.t.indexOf(currentGenType)>=0).map(s=>s.n)),
    role1:pick(ROLES),role2:pick(ROLES),
    place:pick(PLACES),obj:pick(OBJECTS),time:pick(TIMES),
    product:pick(PRODUCTS),topic:pick(TOPICS),theme:pick(THEMES),twist:pick(TWISTS),
    pn:pick(['他','她']),dur:pick(DUR)
  };
  base.c1=uc[0]||pick(NAMES);
  base.c2=uc[1]||pick(NAMES.filter(n=>n!==base.c1));
  base.secret=pick(SECRET_TPL)(base); // 秘密与物件绑定，全文逻辑闭环
  return base;
}
function head(c,label){return '【'+label+' · '+c.style+(c.genre?' · '+c.genre:'')+'】';}
function loglineLine(c){return c.logline?'\n【题要】'+c.logline+'\n':'';}

const BUILDERS={
  V_TURTLE_BOTTOM: [
    c=>c.secret+'。'+c.obj+'是唯一还能替'+c.c1+'说话的东西。\n这'+c.dur+'不说话，不是忘了，是不敢。',
    c=>'汤底其实很平：'+c.secret+'。\n'+c.c1+'不是在等人发问，是在等一个能替'+c.c1+'收尾的人。\n'+c.obj+'替'+c.c1+'等到了。',
    c=>c.secret+'。这'+c.dur+'，'+c.c1+'试过很多次开口，都没成。\n最后是'+c.obj+'替'+c.c1+'开的口。眼泪是利息。',
    c=>c.secret+'。\n'+c.c1+'摆的不是'+c.obj+'，是一本公开的账，只摆给一个人看。\n那个人看懂了，问出了声。'+c.c1+'这才敢塌下来。',
  ],
};

// ===== 一句话导读：让范例一眼看懂 =====
function gist(c,type){
  if(type==='turtle'){
    return '▶ 一句话看懂：'+c.c1+'把'+c.obj+'摆了'+c.dur+'没动，谜底是——'+c.secret+'。';
  }
  return '▶ 一句话看懂：'+pick([
    c.c1+'（'+c.role1+'）在'+c.time+'的'+c.place+'，与'+c.c2+'因'+c.obj+'重新面对面，牵出'+c.theme+'。',
    '这是一个关于'+c.theme+'的故事：'+c.c1+'一直收着'+c.obj+'，直到'+c.c2+'出现。',
    c.c1+'以为放下的只是'+c.obj+'，其实是'+c.theme+'；'+c.c2+'一来，什么都藏不住了。'
  ]);
}

// ===== 套话黑名单：生成结果若命中惯用"AI 金句"则重摇 =====
const CLICHE_RE=/终于|所谓|不是等待|赎罪|物是人非|藏在心里|泪如雨下|岁月静好/;

// ===== 文体目标字数：每种文体适配最舒服的长度 =====
const TYPE_TARGET = {
  short:   400,
  film:    650,
  series:  600,
  scene:   500,
  ad:      450,
  vlog:    500,
  micro:   350,
  zuowen:  700,
  jbs:     550,
  story:   800,
  turtle:  500,
};

// ===== 海龟汤完整模板：汤面 + 提问方向 + 汤底 =====
function buildTurtle(c){
  const bg = pick([
    c.time+'，'+c.place+'。'+c.c1+'（'+c.role1+'）做了一件事：把'+c.obj+'放在一个谁都能看见的地方，从那以后再没动过它。'+c.dur+'过去，旁人只当这是个怪人，直到有人问对了那个问题。',
    c.time+'，'+c.place+'。'+c.c1+'（'+c.role1+'）把'+c.obj+'摆在桌上。过了'+c.dur+'，这东西一直没人动。问起来，'+c.c1+'只说一句话：「再等等，会有人问对问题的。」',
    c.place+'，'+c.time+'。'+c.c1+'（'+c.role1+'）做了一件事：把'+c.obj+'摆在一个人人都看得见的位置。之后的'+c.dur+'，没人问过一句话。直到'+c.time+'的第二天，有人开口——'+c.c1+'当场落泪。',
  ]);
  const hints = pick([
    '· '+c.obj+'原本是谁的？\n· 「看得到」重要，还是「'+c.dur+'不动」重要？\n· 那个「对的问题」究竟问的是什么？',
    '· 谁把'+c.obj+'托给'+c.c1+'的？\n· 为什么是「'+c.place+'」这个地方？\n· 「对的问题」和别的提问，差在哪？',
    '· '+c.obj+'一开始就不在'+c.c1+'手里，是什么时候到的？\n· '+c.c1+'等的不是一个答案，是一个问法。\n· 「哭」的不是因为被说破，是因为这一回，问的人问对了。',
  ]);
  const bottom = pick(BUILDERS.V_TURTLE_BOTTOM)(c);
  return '【海龟汤 · '+c.style+'】\n\n【汤面】\n'+bg+'\n\n【关键提问方向】\n'+hints+'\n\n【汤底（真相）】\n'+bottom;
}

// ===== 通用文体模板：调用 A 段落池，按目标字数拼装连贯短文 =====
window.freshExample=function(type){
  const target = TYPE_TARGET[type] || 500;
  const seen = loadSeen(type);
  const seenSet = {}; seen.forEach(h => seenSet[h] = 1);

  // 海龟汤走专用模板（保持谜题完整性，不去重）
  if (type === 'turtle') {
    const c = ctx();
    const out = buildTurtle(c);
    return { text: out, style: (document.getElementById('gRef')||{value:''}).value.trim() };
  }

  let out='', h=0, tries=0;
  do {
    const c = ctx();
    // 用 A 段落池拼装；按目标字数动态取段
    const lead = pick(A.lead)(c);
    const origin = target >= 500 ? pick(A.origin)(c) : null;
    const meet = pick(A.meet)(c);
    const trouble = target >= 550 ? pick(A.trouble)(c) : null;
    const turn = target >= 600 ? pick(A.turn)(c) : null;
    const close = pick(A.close)(c);
    const mains = [lead, origin, meet, trouble, turn, close].filter(Boolean);

    // 插叙段补足字数
    const mids = [];
    const deepPool = A.deep.slice().sort((a,b)=>a.r-b.r);
    for (let di=0; di<deepPool.length && countChars(mains.concat(mids).join('')) < target * 0.85; di++) {
      if (deepPool[di].f) mids.push(deepPool[di].f(c));
    }
    let fillQueue = A_FILL.slice().sort(()=>Math.random()-0.5);
    while (countChars(mains.concat(mids).join('')) < target * 0.92) {
      mids.push(fillQueue.length ? fillQueue.pop()(c) : pick(A_FILL)(c));
    }
    while (mids.length && countChars(mains.concat(mids).join('')) > target * 1.15) {
      mids.pop();
    }

    // 文体特定的标题前缀（不再用 [画面]/[字幕]）
    const labels = {
      short:'短片范例', film:'电影范例', series:'剧集范例', scene:'单场戏范例',
      ad:'广告脚本', vlog:'Vlog 脚本', micro:'微小说', zuowen:'作文范例',
      jbs:'剧本杀开场', story:'故事范例'
    };
    const label = labels[type] || '范例';
    let txt = head(c, label) + (c.logline ? '\n【题要】'+c.logline : '') + '\n\n' +
               [lead, origin, meet, ...mids, trouble, turn, close].filter(Boolean).join('\n\n');
    out = txt;
    h = hashStr(out);
    tries++;
  } while ((seenSet[h] || CLICHE_RE.test(out)) && tries < 40);

  if (tries >= 40) saveSeen(type, []);
  seen.push(h);
  saveSeen(type, seen);

  return { text: out, style: (document.getElementById('gRef')||{value:''}).value.trim() };
};

// ===== 旧 BUILDERS 字段已清理；V_TURTLE_BOTTOM 在上方 BUILDERS 对象里保留 =====
const _STUB_OLD_BUILDERS_REMOVED = true;
// ===== 成文工坊：按提示素材直接生成指定字数的完整成文 =====
// ===== 单线叙事：一件事讲到底，段落按时间顺序承接，前后逻辑闭环 =====
function vitalLine(){return pick(pick([VITAL.sensory,VITAL.micro,VITAL.sound]));} // 点缀不插道具类细节，避免与场景脱节
function countChars(s){return (s||'').replace(/\s/g,'').length;}

// 各阶段段落。每段只依赖共享设定（人物/物件/秘密），且自带承接语，
// 段落之间靠固定阶段顺序 + 插叙段按 rank 排序来保证时间线不乱。
const A={
lead:[ // 开头：人物+日常+物件，定下全文主线（按 type 适配：影视偏场景、作文偏自我、剧本杀偏人物、海龟汤偏物件）
// 通用影视类（短片/电影/剧集/单场戏/广告/Vlog）
c=>c.time+'，'+c.place+'。'+c.c1+'（'+c.role1+'）刚刚做完手里的事，抬头看了眼墙上的钟。'+c.pn+'身上有样东西——'+c.obj+'，用旧了，边角磨圆，'+c.pn+'还是天天带着。',
c=>c.place+'那一片，来来去去就这些人，日子久了都眼熟。'+c.c1+'在这里待了'+c.dur+'，是个'+c.role1+'，日子过得不快，但一步是一步。'+c.pn+'有一样放不下的东西：'+c.obj+'。',
c=>'要说'+c.c1+'，得先说'+c.obj+'。这东西跟了'+c.pn+'很多年，旁人看着不起眼，'+c.pn+'却当个正经物件：定期擦，定期查，从不离身。问急了，'+c.pn+'只有一句：习惯了。',
// 自我口吻（第一人称感，作文/微小说）
c=>'我第一次注意到'+c.c1+'，是因为'+c.obj+'。那天'+c.time+'，'+c.pn+'站在'+c.place+'门口，手里攥着那东西，半天没动。我走过去，'+c.pn+'抬头看了我一眼，眼里没有笑，也没有为难，只是很沉。',
c=>'有人托我打听'+c.c1+'的下落。我去'+c.place+'，一打听，街坊都认得：是个'+c.role1+'，做了'+c.dur+'了。问'+c.pn+'最近怎么样，邻居说，还那样，就是'+c.obj+'换了个位置，从左手换到了右手。',
c=>c.c1+'这个人，外人不大提。可'+c.place+'上了年纪的人都知道，'+c.pn+'身上常年带着'+c.obj+'，不是因为离不了手，是因为里面装着一件谁都没说破的事。'
],
origin:[ // 来历：物件怎么到的手里，为后文"秘密"埋线
c=>'这事要说回去。'+c.dur+'前，'+c.c1+'刚到'+c.place+'，还是个生手。'+c.obj+'就是那阵子到'+c.pn+'手里的。头一年没觉得它特别，用着用着才发现：日子再乱，只要它在手边，心就是定的。',
c=>c.obj+'的来历，'+c.c1+'很少讲。那是'+c.pn+'刚干'+c.role1+'的第一年，手头紧，事情多，偏偏是这东西陪着'+c.pn+'熬了过来。从那以后，它对'+c.pn+'来说就不只是东西了。',
c=>''+c.dur+'前的一个'+c.time+'，'+c.c1+'得到了'+c.obj+'。当时没觉得那是个什么日子，后来才发现，很多事都是从那天起换了走向的。',
c=>'听老一辈讲，'+c.obj+'本来是别家的东西。'+c.dur+'前赶上那年大事，'+c.c1+'的上一辈把它交到了'+c.pn+'手里，只说了一句：以后的事，靠它记着。',
c=>c.c1+'小时候有一回在'+c.place+'后巷捡到了'+c.obj+'，本来想交公，被拦住了。拦'+c.pn+'的人是'+c.c2+'的父亲，对方只说：「这东西我家出过一份力，你留着，往后你就懂。」'
],
meet:[ // 相识：c2 登场
c=>c.c2+'是那年认识'+c.c1+'的。头几回只是点头之交，后来'+c.place+'里里外外的事搭了几次手，话就多了。'+c.c2+'发现这个'+c.role1+'话不多，但句句作数；'+c.c1+'也发现，'+c.c2+'是那种不占人便宜、也不让人吃亏的人。',
c=>c.c2+'第一次留意'+c.c1+'，就是因为'+c.obj+'。别人顶多多看两眼，'+c.c2+'却问了一句在点子上的话。'+c.c1+'当时就想：这人不一样。一来二去，两个人熟了。',
c=>'两人的交情，是在一件件小事里攒起来的。'+c.c1+'搬重物，'+c.c2+'搭把手；'+c.c2+'赶时间，'+c.c1+'顶着。谁也没提"朋友"两个字，但谁都把对方当朋友。',
c=>c.c2+'搬到'+c.place+'是后来的事。一来就跟'+c.c1+'对门，平日进出碰见，渐渐熟了。'+c.c2+'过日子仔细，'+c.c1+'过日子糙，两个人的门一开一关，倒是把一条巷子的动静都给撑起来了。',
c=>c.c2+'早年间就跟'+c.c1+'打过几回照面，但没说过几句话。再后来'+c.c2+'回了'+c.place+'，一进门就发现，'+c.c1+'桌上还摆着那件'+c.obj+'——位置都没挪过。'
],
// 插叙段：可按需增删，选中后按 r 排序插入，时间线不乱
deep:[
{r:1,f:c=>'熟了之后，来往就多了。'+c.c2+'常顺路来看'+c.pn+'，有时候帮忙搭把手，有时候就是坐着说话。'+c.c1+'话还是不多，但'+c.c2+'听得出来：'+c.pn+'说出口的，没有一句是虚的。'},
{r:2,f:c=>'有一回，两人一起办事，出了点岔子，忙到后半夜。事情了结，'+c.c2+'说了句「多亏有你」，'+c.c1+'摆摆手说应该的。就是从那晚起，两人说话不用再挑着说了。'},
{r:3,f:null}, // 占位，下方统一填充
{r:4,f:c=>'那年冬天'+c.c1+'病了一场，'+c.c2+'隔三差五过来看一眼，带点吃的，坐一会儿就走。'+c.c1+'后来跟人说：这辈子没求过人，那阵子才体会到，被人惦记是什么滋味。'},
{r:5,f:null},
{r:6,f:null},
{r:7,f:null},
{r:8,f:null},
{r:9,f:null},
{r:10,f:null},
{r:11,f:null},
{r:12,f:null}
],
trouble:[ // 波折：写实的难处，不煽情
c=>'麻烦出在'+c.time+'。干活的场子要整修，一时半会儿用不上，'+c.c1+'的进项眼见着断了。有人劝'+c.pn+'换个营生，'+c.pn+'没吭声，回头把'+c.obj+'擦了一遍，收进箱底——不是认输，是不肯潦草。',
c=>'那年'+c.c1+'碰上了难处：手头紧，家里事多，两头烧。'+c.pn+'没跟人诉苦，白天照常干活，夜里一样一样想办法。只有一件事没松手：'+c.obj+'一直带在身上。',
c=>'变故来得突然。一笔说好的进项落了空，牵连出好些麻烦。'+c.c1+'不埋怨，先把欠人的补上，再把自己的窟窿一个一个填。'+c.c2+'要帮，'+c.pn+'只收了一半：「这一半算借的。」'
],
turn:[ // 转折：秘密揭开，与物件呼应
c=>'转机是'+c.c2+'带来的。那天'+c.c2+'来了，没寒暄，把一样东西放在桌上，说了实话：'+c.secret+'。'+c.c1+'听完，好半天没说话。原来这些年，不是只有一个人在惦记。',
c=>'事情说开，是在一个很平常的下午。'+c.c2+'坐下来说了来意，'+c.c1+'才知道——'+c.secret+'。'+c.pn+'没有多说什么，起身烧了壶水，给'+c.c2+'倒了杯热的。有些情不用说破，倒了这杯水，就都到了。',
c=>c.c2+'把话说破那天，'+c.c1+'沉默了很久，最后只问了一句：「你图什么？」'+c.c2+'说：「不图什么。」'+c.c1+'点点头。两个都不图什么的人，事情就好办了。',
c=>'转折来得很轻。那天'+c.c2+'捎来一张旧收据，'+c.c1+'看了一眼，手指就僵了：'+c.secret+'。'+c.c1+'半晌没说话，最后只问：「你从哪儿找到的？」'+c.c2+'说：「你妈给我的。」',
c=>c.c2+'话是分几次才说完的。第一次说完，'+c.c1+'没接茬，转身去把窗户关了。第二次说完，'+c.c1+'倒了杯水，洒了一半。第三次说完，'+c.c1+'才问：「那我现在该咋办？」'
],
close:[ // 收尾：回到开头的人和物件，主线闭环
c=>'后来的日子，一步一步顺了回来。'+c.c1+'还是做着'+c.role1+'这份工，'+c.obj+'还带在身上，只是用得更旧、也更顺手了。'+c.theme+'——道理不复杂：人对事认真，事就会对人认真。',
c=>'如今再说起这事，'+c.c1+'还是那句话：没什么大不了的。可熟识'+c.pn+'的人都清楚，一个人能把'+c.dur+'的日子过得不慌不忙、恩怨分明，本身就是本事。',
c=>'故事到这里就完了。没有轰轰烈烈，只有一个'+c.role1+'、一个实在朋友、一件旧物，把普通日子过出了分量。'+c.theme+'，说的就是这个。',
c=>'再往后的事，'+c.c1+'很少跟人提。只是偶尔路过'+c.place+'，会停下来站一站，看看那扇当年借过光的窗户。'+c.pn+'站在那儿，外人会觉得在看天，只有'+c.c2+'知道，'+c.pn+'在数日子。',
c=>'要是有人问起'+c.c1+'现在怎么样，'+c.place+'的人都会说一句：「还行，还是那样。」说这话的人自己也说不清「那样」是哪样，反正这'+c.dur+'，'+c.pn+'就是这么过下来的。'+c.obj+'还在'+c.pn+'身上，老物件，记着老事，这就够了。'
]
};
// 补齐插叙段（按时间顺序写，可任意增删）
(function(){
var D=A.deep;
D[2].f=c=>c.time+'，'+c.c2+'带来一样小东西，说配'+c.obj+'正合适。'+c.c1+'愣了一下，收下了。旁人送礼是人情，'+c.c2+'这份是分寸——不贵重，但正对心思。';
D[4].f=c=>'有阵子'+c.place+'附近施工，进出都难。'+c.c1+'每天绕远路，照旧把活儿干完。'+c.c2+'说何苦，'+c.pn+'说：答应了的事，就得有个交代。';
D[5].f=c=>'两人偶尔也争。为一件活儿的做法，能各说各理说半天。争完了，谁也不记仇，第二天照旧。'+c.c2+'后来说：跟实在人争，争赢了也舒坦。';
D[6].f=c=>c.c1+'过生日那天没什么动静，'+c.c2+'拎了两个菜过来，就算一起过了。没蛋糕，没客套，吃完了各回各家。这种来往，最禁得起年头。';
D[7].f=c=>''+c.obj+'旧了，'+c.c1+'动手修过一回。修的那天'+c.c2+'在旁边打下手，递工具，递得正合适。活儿干完，两个人看着它，像看一件共同做完的事。';
D[8].f=c=>'中间有个小插曲：'+c.c1+'差点把'+c.obj+'弄丢了。找了一晚上，最后在工装口袋里摸着了。'+c.c2+'说「找着就好」，没笑话'+c.pn+'。分寸这东西，就在这些地方。';
D[9].f=c=>'有一年年底结账，'+c.c1+'多算了'+c.c2+'的钱，发现后连夜送回去。'+c.c2+'收了，只说了句「就知道你会来」。信任不是嘴上说的，是这么一笔一笔攒出来的。';
D[10].f=c=>c.time+'，两人一起去了一趟'+c.place+'另一头，办完事顺路走了走。没说什么要紧话，可回来的路上都觉着，这段日子没白过。';
D[11].f=c=>c.c2+'家里有事的那阵子，'+c.c1+'隔天去搭把手，从不多问，做完就走。'+c.c2+'后来提起来：最难的时候，是谁在身边，心里跟明镜似的。';
})();
// 兜底扩写段：仍不够长时使用，写法上不与具体时序冲突
const A_FILL=[
c=>'这些年间，'+c.place+'来来去去换了不少人，'+c.c1+'没挪过窝。有人问'+c.pn+'图什么，'+c.pn+'说：活儿在哪儿，人就在哪儿。',
c=>c.obj+'被不少人看中过，有人出价，'+c.c1+'都摇头。'+c.c2+'替'+c.pn+'回过一句话：这东西不卖——不卖，不是值钱，是有讲究。',
c=>'日子平常，但不是没有滋味。'+c.place+'早上的动静、歇工时的一碗热汤、做完活儿回头看一眼的踏实——这些东西单拎出来都不算什么，攒起来就是日子。',
c=>c.c1+'有个习惯：每做完一单，在本子上记一笔。哪天、谁家、什么活儿，写得清清楚楚。'+c.c2+'翻过一次，说：你这哪是账本，是人品。',
c=>'街坊里谁家有急事，头一个想到的是'+c.c1+'。'+c.pn+'从不推，也从不声张。时间长了，'+c.place+'的人提起来都是一句话：那是个靠得住的人。',
c=>c.c1+'不大会说漂亮话。别人道谢，'+c.pn+'就回一句「顺手的事」。说多了，街坊也就懂了：这人的「顺手」，比别人的上心还实在。',
c=>''+c.dur+'里也有过冷清的时候。来的人少了，'+c.c1+'就把手艺练得更熟。'+c.c2+'说这样亏不亏，'+c.pn+'说：手上的功夫，什么时候都不亏。',
c=>'日子说不上富，但月月有结余；说不上热闹，但心里不慌。'+c.c1+'觉得，这就叫过得去。'
];

window.freshArticle=function(target){
  target=Math.max(200,Math.min(2600,target||800));
  let c=ctx(),txt='',tries=0;
  // 海龟汤：完整谜题（汤面+提问+汤底），保持严谨
  if(currentGenType==='turtle'){
    txt=head(c,'海龟汤 · 完整版')+'\n\n【汤面】\n'
      +c.time+'，'+c.place+'。'+c.c1+'（'+c.role1+'）做了一件事：把'+c.obj+'摆在一个人人看得见的地方，然后'+c.dur+'没有动过它。街坊都当这是个怪人。直到'+c.time+'的第二天，有人问对了那个问题——'+c.c1+'当场落泪。\n\n'
      +'【关键提问方向】\n· '+c.obj+'原本是谁的？\n· 「看得见」重要，还是「'+c.dur+'不动」重要？\n· 那个「对的问题」问的是什么？\n\n'
      +'【汤底（真相）】\n'+pick(BUILDERS.V_TURTLE_BOTTOM)(c)+'\n';
    return {text:txt,style:c.style};
  }

  // 短文章（300 字以下）：走示例片段逻辑即可
  if(target < 350){
    return window.freshExample(currentGenType);
  }

  // 口语插话池：让叙述像人话——有情绪、有打断、有感叹
  const ASIDE = [
    // 感叹 / 意外
    '说句实在的，',
    '不是我夸张，',
    '挺意外。',
    '说实话，',
    '说实话我也愣了一下。',
    '真不是。',
    '真的。',
    '你没看错。',
    '没骗你。',
    '这种事，',
    '忽然就来了。',
    '说偏了。咱们说回来。',
    // 回忆 / 反思
    '我后来想了想，',
    '其实也没那么复杂。',
    '你要问我怎么知道的，',
    '就那么一次，',
    '我一直记得。',
    '这事过去挺久了，',
    '那会儿我就觉得，',
    '后来才明白，',
    '当时觉得挺自然的，',
    '其实不对劲。',
    '想起来就好笑。',
    '想起来挺难受的。',
    '到现在我也说不准。',
    // 打断 / 话头
    '插一句，',
    '顺便提一下，',
    '你猜怎么着，',
    '没想到的是，',
    '事情是这么起来的——',
    '忽然想起一件事。',
    '这么说吧，',
    '忽然有一天，',
    '哎，',
    '然后呢，',
    '结果你猜怎么着，',
    '等一下，',
    '——慢着，让我再想想。',
    // 反应 / 接话
    '他说的。',
    '我当时没接话。',
    '没人接这个话茬。',
    '我也没再多问。',
    '这事就这么过去了。',
    '算了，说下一个。',
    '反正，',
    '就这么着吧。',
    '话说回来，',
    '你说是不是？',
    '这种事搁谁都一样。',
    '我懂。',
    '——好吧。',
    // 情绪 / 沉吟
    '忽然心里一沉。',
    '忽然又想笑。',
    '忽然不知道说什么。',
    '话到嘴边，又咽回去了。',
    '想起来了，眼眶一热。',
    '心里堵得慌。',
    '忽然就笑不出来了。',
    '那口气，憋了很久。',
    '嗓子眼发紧。',
  ];

  // 对话片段池：原话直接引用，有语气、有情绪、有停顿
  const DIALOGUE = [
    c=>'「'+pick(['行。','嗯。','别说了。','也好。','再说吧。','就这样吧。','随你。'])+'」',
    c=>'「'+pick(['那不一样。','这你就不懂了。','你想多了。','算了算了，别说这个了。','没你说的那么严重。'])+'」',
    c=>'「'+pick(['你这个人……','怎么跟你说不明白呢。','行，我不说了。','随你吧。','你爱咋咋。'])+'」',
    c=>'「'+pick(['我不知道。','我没想那么多。','就这样吧。','哎……'])+'」',
    c=>'「'+pick(['你图什么？','谁让你管的？','这事儿跟你没关系。','管好你自己吧。'])+'」',
    c=>'「'+pick(['多亏有你。','哪有那么容易。','日子还长着呢。','你急什么。'])+'」',
    c=>'「'+pick(['你记得不？','你还欠我一句实话。','这事我没忘。','我一直记着呢。'])+'」',
    c=>'「'+pick(['得了，别提了。','别闹了。','别这样。','别走。'])+'」',
    c=>'「'+pick(['我想了想，还是算了。','这事不说了。','就这样吧。','没别的意思。'])+'」',
    c=>'「'+pick(['等等。','慢着。','你再说一遍。'])+'」',
    c=>'「'+pick(['……嗯。','……算了。','……没事。','……也好。','……行吧。','……没所谓。'])+'」',
  ];

  // 不完整句池：话说到一半就停了，模拟真实想法
  const TRAIL = [
    '……就这样。',
    '……算了。',
    '……他懂。',
    '……其实也不必。',
    '……我也没多想。',
    '……反正就那么回事。',
    '……不说了。',
    '……就这样吧。',
    '……他也不好受。',
    '……但也不全是。',
    '……也许吧。',
    '……这种事。',
    '……不是你想的那样。',
    '……有些事说不清。',
  ];

  // 短段落池：碎片观察 + 对话尾音 + 情绪瞬间（让文章有呼吸）
  const SHORT_V = [
    // 碎片观察
    c=>'那天特别冷。',
    c=>'屋里没人说话。',
    c=>'事情就悄悄地起了变化。',
    c=>'他没再提这件事。',
    c=>'他想了想，还是没接话。',
    c=>'就那么一次例外。',
    c=>'那之后谁也没再提。',
    c=>'他没回答。',
    c=>'算是默认了吧。',
    c=>'其实也没那么难。',
    c=>'就是有点不是滋味。',
    c=>'也不全是坏消息。',
    c=>'算是过了这一关。',
    c=>'日子就这么过着。',
    c=>'我后来再没见过他。',
    c=>'没人提，大家也当没发生过。',
    c=>'这事说起来也简单。',
    // 情绪瞬间
    c=>'忽然心里一沉。',
    c=>'忽然又想笑。',
    c=>'忽然不知道说什么。',
    c=>'话到嘴边，又咽回去了。',
    c=>'想起来了，眼眶一热。',
    c=>'心里堵得慌。',
    c=>'忽然就笑不出来了。',
    c=>'那口气，憋了很久。',
    c=>'嗓子眼发紧。',
    // 短反应
    c=>'没人接话。',
    c=>'他没再出声。',
    c=>'她没抬头。',
    c=>'我也愣了一下。',
    c=>'他低头没说话。',
    c=>'她笑了笑，没说什么。',
    c=>'他点了根烟，没点着。',
    c=>'她站起来，走了。',
    c=>'他没跟出来。',
    c=>'然后就没然后了。',
    c=>'算是吧。',
    c=>'反正。',
    c=>'就这样。',
    c=>'忽然就。',
    c=>'再后来。',
    c=>'那年。',
    c=>'那时候。',
    c=>'……嗯。',
    c=>'……算了。',
    c=>'……也好。',
    c=>'……也是。',
    c=>'……行吧。',
    c=>'……没事。',
    c=>'……没所谓。',
    c=>'……也好也好。',
  ];

  do {
    if(tries>0) c=ctx();
    const big = target >= 450;

    // 收集所有可选段落（按逻辑顺序，但每个段落只选一次，从对应池中随机）
    const slots = []; // [{f, type}]

    // 1. 开场：3 种选 1
    slots.push({ f: pick(A.lead), type:'lead' });

    // 2. 来历（无题要时才加入；题要已在 head 标题下显示，不重复）
    if(!c.logline && big){
      slots.push({ f: pick(A.origin), type:'origin' });
    }

    // 3. 相识 + 物件介入
    slots.push({ f: pick(A.meet), type:'meet' });

    // 4. 插叙段（按时间顺序插入 2-4 段）
    if(big){
      const deepPool = A.deep.filter(x => x.f).slice().sort((a,b)=>a.r-b.r);
      const wantDeep = Math.min(deepPool.length, 2 + Math.floor(Math.random()*3));
      // 随机打乱但保持 r 顺序内的局部稳定
      const used = [];
      while(used.length < wantDeep){
        const i = Math.floor(Math.random() * deepPool.length);
        if(!used.includes(i)) used.push(i);
      }
      used.sort((a,b)=>deepPool[a].r - deepPool[b].r);
      used.forEach(i => slots.push({ f: deepPool[i].f, type:'deep_'+deepPool[i].r }));
    }

    // 5. 波折 + 转折（按需）
    if(big){
      slots.push({ f: pick(A.trouble), type:'trouble' });
      slots.push({ f: pick(A.turn), type:'turn' });
    } else if (Math.random() < 0.5) {
      // 短文章偶尔也插一点转折，避免太平
      slots.push({ f: pick(A.turn), type:'turn' });
    }

    // 6. 收尾
    slots.push({ f: pick(A.close), type:'close' });

    // 段落顺序：随机化（但题记段和收尾段锁定位置）
    const middle = slots.slice(1, -1);
    // Fisher-Yates 局部洗牌，但保持 lead 在最前、close 在最后
    for(let i = middle.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [middle[i], middle[j]] = [middle[j], middle[i]];
    }
    const ordered = [slots[0], ...middle, slots[slots.length-1]];

    // 段落文本：让文章有呼吸感——短段落、对话打断、情绪瞬间穿插
    let body = '';
    const shortUsed = new Set();

    ordered.forEach((s, idx) => {
      let para = s.f(c);
      const isLead = idx === 0;
      const isClose = idx === ordered.length - 1;

      // 【开场 lead】插入一点环境/动作，让开头有画面感
      if(isLead && Math.random() < 0.55){
        const opener = pick(pick([VITAL.sensory, VITAL.micro, VITAL.sound]));
        // 在第一句后插入（找第一个句号）
        const fp = para.indexOf('。');
        if(fp > 5){
          para = para.substring(0, fp+1) + ' ' + opener + para.substring(fp+1);
        }
      }

      // 【非首尾段】22% 概率做短段落（情绪瞬间 + 碎片观察）
      if(!isLead && !isClose && Math.random() < 0.22){
        let tries = 0, shortPara;
        do {
          shortPara = pick(SHORT_V)(c);
          tries++;
        } while(shortUsed.has(shortPara) && tries < 6);
        shortUsed.add(shortPara);
        body += shortPara + '\n\n';
        return;
      }

      // 【非首尾段】30% 概率口语开头
      if(!isLead && !isClose && Math.random() < 0.30){
        para = pick(ASIDE) + para.charAt(0).toLowerCase() + para.substring(1);
      }

      // 【非首尾段】35% 概率在段中插入对话打断（模拟真实对话）
      if(!isLead && !isClose && Math.random() < 0.35){
        const d = pick(DIALOGUE)(c);
        // 找第一个逗号插入
        const ci = para.indexOf('，');
        if(ci > 0 && ci < para.length * 0.75){
          para = para.substring(0, ci+1) + ' ' + d + '，' + para.substring(ci+1);
        }
      }

      // 【非首尾段】30% 概率在段中或段尾插生活细节
      if(!isLead && !isClose && Math.random() < 0.30){
        const vital = pick(pick([VITAL.sensory, VITAL.micro, VITAL.sound]));
        if(Math.random() < 0.5){
          para += ' ' + vital;
        } else {
          const cp = para.indexOf('。');
          if(cp > 5 && cp < para.length - 5){
            para = para.substring(0, cp+1) + ' ' + vital + para.substring(cp+1);
          } else {
            para += ' ' + vital;
          }
        }
      }

      // 【长段落切短】超过 180 字在句号处断成两段
      if(para.length > 180 && Math.random() < 0.45){
        const mid = Math.floor(para.length * 0.55);
        let cut = para.indexOf('。', mid);
        if(cut < 0) cut = para.indexOf('，', mid);
        if(cut > 10 && cut < para.length - 3){
          const first = para.substring(0, cut+1);
          const second = para.substring(cut+1).trim();
          if(second.length > 0){
            body += first + '\n\n';
            // 第二段：70% 概率截断成短句或情绪瞬间
            if(Math.random() < 0.70){
              body += second.charAt(0) + pick(TRAIL) + '\n\n';
            } else {
              body += second + '\n\n';
            }
            return;
          }
        }
      }

      // 【收尾段】35% 概率戛然而止
      if(isClose && Math.random() < 0.35){
        para = para.replace(/[。！？]+$/, '') + '。 ' + pick([
          '就这样。',
          '没别的了。',
          '没什么好说的了。',
          '后来的事也没什么好提的了。',
        ]);
      }

      body += para + '\n\n';
    });

    // 字数调整：补足段落（去重，段落长短交替）
    const usedTexts = new Set(body.replace(/\s/g,''));
    let fillTries = 0;
    while(countChars(body) < target * 0.88 && fillTries < 15){
      let filler;
      const roll = Math.random();
      if(roll < 0.5){
        // 短句：直接用 SHORT_V，不拼接
        filler = pick(SHORT_V)(c);
      } else if(roll < 0.75){
        // 中等段落：A_FILL，但 50% 截断
        filler = pick(A_FILL)(c);
        if(filler.length > 120 && Math.random() < 0.5){
          const cut = filler.indexOf('。', Math.floor(filler.length * 0.35));
          if(cut > 10) filler = filler.substring(0, cut+1);
        }
      } else {
        // 口语片段
        filler = pick(ASIDE) + pick([
          '后来才知道的。',
          '也不算什么事。',
          '说不上来。',
          '反正。',
          '就这样。',
          '也不算什么事。',
        ]);
      }
      const sig = filler.replace(/\s/g,'').substring(0, 22);
      if(!usedTexts.has(sig)){
        body += filler + '\n\n';
        usedTexts.add(sig);
      }
      fillTries++;
    }
    if(countChars(body) > target * 1.2){
      // 简单截断到目标字数附近
      const maxLen = Math.floor(target * 1.15);
      let trimmed = body.substring(0, maxLen);
      const lastDot = trimmed.lastIndexOf('。');
      if(lastDot > target * 0.5) trimmed = trimmed.substring(0, lastDot + 1);
      body = trimmed + '\n\n——（文止于此）';
    }

    txt = head(c, '成文') + '\n\n' + (c.logline ? '题记：' + c.logline + '\n\n' : '') + body.trim();
    tries++;
  } while (CLICHE_RE.test(txt) && tries < 4);

  return {text:txt,style:c.style};
};

// ===== 改善用词：将平淡词替换为精准/生动/有质感的词 =====
window.improveWording=function(){
  const el=document.getElementById('aOutput');
  if(!el||!el.textContent.trim()){toast('✨ 暂无文章');return;}
  // 取纯文本（从 textContent，去掉标签干扰）
  let text=el.textContent;
  if(!text.trim()){toast('✨ 暂无文章');return;}

  // 改善用词：精准搭配替换（整词匹配，不伤复合词）
  // 每次随机选 5-8 种策略应用，每种 40% 概率触发，保留写作手感
  const POOL=[
    {from:/\b看见\b/g, to:'瞧见'},
    {from:/\b看一下\b/g, to:'瞅了一眼'},
    {from:/\b看一眼\b/g, to:'瞥了一眼'},
    {from:/\b说得\b/g, to:'道'},
    {from:/\b说话\b/g, to:'开口'},
    {from:/\b知道\b/g, to:'清楚'},
    {from:/\b不知道\b/g, to:'说不清'},
    {from:/\b觉得\b/g, to:'感到'},
    {from:/\b很好\b/g, to:'妥帖'},
    {from:/\b不错\b/g, to:'在行'},
    {from:/\b站起来\b/g, to:'起身'},
    {from:/\b坐下来\b/g, to:'落座'},
    {from:/\b睡着了\b/g, to:'合了眼'},
    {from:/\b醒过来\b/g, to:'睁开眼'},
    {from:/\b回到家\b/g, to:'踏进门槛'},
    {from:/\b离开了\b/g, to:'走了'},
    {from:/\b哭了起来\b/g, to:'眼眶湿了'},
    {from:/\b笑了起来\b/g, to:'嘴角扬了一下'},
    {from:/\b叹了口气\b/g, to:'长出了一口气'},
    {from:/\b想了想\b/g, to:'琢磨了一下'},
    {from:/\b点了点头\b/g, to:'应了一声'},
    {from:/\b没说话\b/g, to:'没吭声'},
    {from:/\b抬起头\b/g, to:'仰起脸'},
    {from:/\b低下头\b/g, to:'垂下眼'},
    {from:/\b转过身\b/g, to:'扭过头去'},
    {from:/\b往前走\b/g, to:'朝前去了'},
    {from:/\b天气冷\b/g, to:'风凉了起来'},
    {from:/\b人很多\b/g, to:'人头黑压压一片'},
    {from:/\b声音很轻\b/g, to:'声音压得很低'},
    {from:/\b路很远\b/g, to:'要走上半天'},
    {from:/\b吃完饭\b/g, to:'放下碗筷'},
    {from:/\b喝完酒\b/g, to:'干了杯中酒'},
    {from:/\b第二天早上\b/g, to:'第二天天刚亮'},
    {from:/\b那之后\b/g, to:'打那以后'},
    {from:/\b一直这样\b/g, to:'始终这样'},
    {from:/\b突然之间\b/g, to:'猛地一下'},
    {from:/\b经常去\b/g, to:'时不时去'},
    {from:/\b每天早上\b/g, to:'天一亮'},
    {from:/\b每天晚上\b/g, to:'入夜以后'},
    {from:/\b后来\b/g, to:'再往后'},
    {from:/\b但是\b/g, to:'可'},
    {from:/\b所以\b/g, to:'于是'},
    {from:/\b因为\b/g, to:'一来'},
    {from:/\b可以\b/g, to:'能'},
    {from:/\b已经\b/g, to:'早已'},
    {from:/\b然后\b/g, to:'接着'},
    {from:/\b如果\b/g, to:'倘若'},
    {from:/\b一些\b/g, to:'若干'},
    {from:/\b什么\b/g, to:'啥'},
    {from:/\b怎么\b/g, to:'咋'},
    {from:/\b没有\b/g, to:'没了'},
    {from:/\b不是\b/g, to:'并非'},
    {from:/\b这个\b/g, to:'这'},
    {from:/\b那个\b/g, to:'那'},
    {from:/\b有点\b/g, to:'有些'},
    {from:/\b一点\b/g, to:'一丝'},
    {from:/\b慢慢\b/g, to:'一点一点地'},
    {from:/\b总是\b/g, to:'老是'},
    {from:/\b终于\b/g, to:'到底还是'},
    {from:/\b突然\b/g, to:'猛地'},
    {from:/\b经常\b/g, to:'时不时'},
    {from:/\b差不多\b/g, to:'八九不离十'},
    {from:/\b太好了\b/g, to:'齐活了'},
    {from:/\b不太对\b/g, to:'不对劲'},
    {from:/\b很自然\b/g, to:'在理'},
    {from:/\b没关系\b/g, to:'没啥大不了'},
    {from:/\b说实话\b/g, to:'说句实在的'},
    {from:/\b没什么\b/g, to:'没啥'},
    {from:/\b什么意思\b/g, to:'啥意思'},
    {from:/\b怎么办\b/g, to:'咋办'},
    {from:/\b不用说\b/g, to:'不用提'},
    {from:/\b不知道怎么办\b/g, to:'不知咋整'},
    {from:/\b不知道说什么\b/g, to:'不知咋开口'},
    {from:/\b差不多就行了\b/g, to:'过得去就行'},
    {from:/\b不要紧\b/g, to:'没啥大不了'},
    {from:/\b不要紧的\b/g, to:'没事'},
  ];

  // 随机选 5-8 种策略应用
  const shuffled = POOL.slice().sort(()=>Math.random()-0.5);
  shuffled.slice(0, 5 + Math.floor(Math.random()*4)).forEach(function(item){
    if(Math.random()<0.4){
      text = text.replace(item.from, item.to);
    }
  });
  // 去除重复空格和多余换行
  text=text.replace(/ {2,}/g,' ').replace(/\n{3,}/g,'\n\n').trim();

  // 显示改善结果：label 在顶部占一行，后面正文保持段落感
  el.innerHTML = '<span style="color:var(--ink-dim);font-size:11px;margin-bottom:4px;display:block">✨ 已改善用词</span><br><br>' + text.replace(/\n/g,'<br>');
  toast('✨ 用词已改善');
};
})();
