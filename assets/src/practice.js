/* 마지막 장 · 실전 연습장: 그래프 사업장 시뮬레이터 (외부 라이브러리 없음, 기록은 현재 탭에만)
   route(배달 길찾기 센터) · exam(시험 시간표 사무실) · pipe(물류 관 증설 본부) */
(function(){
'use strict';
var U=window.WU,T=window.GT,C=window.WC,E=U.E,H=U.H;
var root=document.getElementById('sim');if(!root)return;
function el(tag,cls,html,par){return H(tag,cls,html,par);}
function sv(par,w,h,label){var s=E('svg',{viewBox:'0 0 '+w+' '+h,width:'100%',role:'img','aria-label':label});s.style.maxWidth=w+'px';par.appendChild(s);return s;}
function tx(s,x,y,t,at){var e=E('text',Object.assign({x:x,y:y,'font-size':13,fill:'#16212b','font-family':'inherit'},at||{}),s);e.textContent=t;return e;}
function says(lines){return lines.map(function(l){return '<div class="say" data-who="'+l[0]+'"><img class="who" data-who="'+l[0]+'" data-mood="'+l[1]+'" alt="" aria-hidden="true"><div><b class="name">'+window.Cast.names[l[0]]+'</b><p>'+l[2]+'</p></div></div>';}).join('');}
function card(lab,val,good){return '<div class="'+(good===true?'good':good===false?'bad':'')+'"><span>'+lab+'</span><b>'+val+'</b></div>';}
function bars(s,items,title){s.innerHTML='';var mx=Math.max.apply(null,items.map(function(x){return x.v;}).concat([1]));tx(s,10,16,title,{'font-size':12,fill:C.mu});
  items.forEach(function(it,i){var y=30+i*34,w=it.v/mx*300;E('rect',{x:150,y:y,width:Math.max(2,w),height:24,rx:4,fill:it.c||C.acc},s);tx(s,4,y+17,it.l,{'font-size':12});tx(s,156+w,y+17,it.t||String(it.v),{'font-size':12,'font-weight':700});});}

/* ── 탭 ── */
var SC=[{k:'route',t:'배달 길찾기 센터'},{k:'exam',t:'시험 시간표 사무실'},{k:'pipe',t:'물류 관 증설 본부'}];
var tabs=el('div','ctrl',null,root);tabs.setAttribute('role','tablist');var panes={},tbtn={};
SC.forEach(function(s){var b=el('button','bt',s.t,tabs);b.type='button';b.setAttribute('role','tab');b.onclick=function(){show(s.k);history.replaceState(null,'','#'+s.k);};tbtn[s.k]=b;
  var p=el('div','tabpane',null,root);p.id='pane-'+s.k;p.setAttribute('role','tabpanel');p.hidden=true;panes[s.k]=p;});
function show(k){if(!panes[k])k='route';SC.forEach(function(s){panes[s.k].hidden=s.k!==k;tbtn[s.k].setAttribute('aria-selected',s.k===k?'true':'false');tbtn[s.k].setAttribute('aria-pressed',s.k===k?'true':'false');});}

function frame(p,o){
  el('h2',null,o.title,p);
  el('div','three','<b>상황</b> — '+o.situ,p);
  var env=el('div','panel',null,p);env.style.borderLeft='6px solid var(--gfp)';el('div','ptitle','초록 상자 · 시장 환경 (내가 못 바꾸는 조건)',env);
  var dec=el('div','panel',null,p);dec.style.borderLeft='6px solid var(--info)';el('div','ptitle','파란 상자 · 내 결정',dec);
  var sc=el('div','sc4',null,p);sc.setAttribute('aria-live','polite');
  var g=el('div','twobox',null,p);var g1=el('div','panel',null,g),g2=el('div','panel',null,g);
  var talk=el('div','talk',null,p);
  var ms=el('div','explain',null,p);el('h3',null,'미션 3개 — 조작한 뒤에 자동 판정',ms);var ml=el('ol',null,null,ms);
  el('p','note','배운 곳 다시 보기: '+o.back,p);
  return {env:env,dec:dec,sc:sc,g1:g1,g2:g2,talk:talk,ml:ml};
}
function missions(F,list){var lis=list.map(function(m){return el('li',null,'<b>'+m+'</b> <span class="mstat note">아직 시도 전</span>',F.ml);});
  return function(i,state){var s=lis[i].querySelector('.mstat');if(s.className==='mstat g')return;if(state==='ok'){s.className='mstat g';s.textContent='통과 ✓';}else if(state==='try'){s.className='mstat a';s.textContent='진행 중';}};}
function radioRow(par,label,opts,cur,on){var w=el('div','ctrl',null,par);el('span','glabel',label,w);var bs=opts.map(function(o){var b=el('button','bt',o[1],w);b.type='button';b.setAttribute('aria-pressed',o[0]===cur?'true':'false');b.onclick=function(){bs.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});on(o[0]);};return b;});return bs;}
function btnRow(par,label,on){var b=el('button','bt',label,par);b.type='button';b.onclick=on;return b;}

/* ═════════ 1. 배달 길찾기 센터 (최단 경로) ═════════ */
var ROUTE=(function(){
  var nm=['센터','A','B','C','D','E','F','고객'],pos=[[50,150],[180,50],[180,250],[320,50],[320,150],[320,250],[460,150],[590,150]];
  var base=[['센터','A',4],['센터','B',3],['A','C',3],['A','D',5],['B','D',4],['B','E',2],['C','F',4],['D','F',2],['E','F',6],['C','고객',9],['E','고객',8],['F','고객',3],['D','고객',8]];
  var jam={'B–D':9,'D–F':7,'B–E':5};
  function graph(traffic){return T.mk(nm,pos.map(function(p){return p.slice();}),base.map(function(e){var k=e[0]+'–'+e[1];return [e[0],e[1],traffic&&jam[k]?jam[k]:e[2]];}));}
  function dij(g){var n=g.names.length,d=new Array(n).fill(Infinity),prev=new Array(n).fill(-1),done=[],A=T.adj(g);d[0]=0;
    for(var it=0;it<n;it++){var u=-1;for(var i=0;i<n;i++)if(!done[i]&&(u<0||d[i]<d[u]))u=i;done[u]=true;A[u].forEach(function(y){if(d[u]+y.w<d[y.to]){d[y.to]=d[u]+y.w;prev[y.to]=y.k;}});}
    return {d:d,prev:prev};}
  function fewest(g){var n=g.names.length,dist=new Array(n).fill(-1),prev=new Array(n).fill(-1),A=T.adj(g),q=[0];dist[0]=0;while(q.length){var u=q.shift();A[u].forEach(function(y){if(dist[y.to]<0){dist[y.to]=dist[u]+1;prev[y.to]=y.k;q.push(y.to);}});}
    var t=n-1,ks=[],v=t,w=0;while(v!==0){ks.push(prev[v]);w+=g.edges[prev[v]][2];var e=g.edges[prev[v]];v=e[0]===v?e[1]:e[0];}return {steps:dist[t],w:w,ks:ks};}
  return {graph:graph,dij:dij,fewest:fewest,jam:jam};
})();
(function(){
  var p=panes.route,F=frame(p,{title:'배달 길찾기 센터 — 가장 빠른 배달 길 고르기',
    situ:'센터에서 고객 집까지 오토바이로 배달해요. 구간마다 걸리는 시간(분)이 적혀 있고, 퇴근 시간에는 몇 구간이 막혀 시간이 늘어나요. 점을 차례로 눌러 배달 길을 만들고, 가장 빠른 길을 찾아보세요.',
    back:'<a href="../08_shortest_paths.html">08장 최단 경로</a> · <a href="../03_paths_connectivity.html">03장 경로와 연결</a> · <a href="../01_graph_fundamentals.html">01장 무게 있는 그래프</a>'});
  var st={traffic:false,seq:[0]},hist={okN:false,okJ:false,trap:false,touched:false};
  radioRow(F.env,'시간대:',[[false,'평소 (한산)'],[true,'퇴근 시간 (B–D · B–E · D–F 정체)']],false,function(v){st.traffic=v;st.seq=[0];hist.touched=true;run();});
  el('p','note','센터에서 시작해 이어진 점을 차례로 누르세요. 고객에 닿으면 배달 완료!',F.dec);
  var cb=el('div','ctrl',null,F.dec);btnRow(cb,'한 걸음 되돌리기',function(){if(st.seq.length>1)st.seq.pop();run();});btnRow(cb,'처음부터',function(){st.seq=[0];run();});
  var mk=missions(F,['평소 시간대에 가장 빠른 길로 배달하기','함정 관찰: 퇴근 시간에 「구간 수가 가장 적은 길」로 배달해 보고, 가장 빠른 길보다 느린 것 확인하기','조건 바꾸기: 평소와 퇴근 시간 모두에서 가장 빠른 길 찾기 (길이 바뀌어요)']);
  var s1=sv(F.g1,640,300,'배달 지도'),s2=sv(F.g2,480,150,'내 길과 가장 빠른 길 시간 비교 막대그래프');
  function ek(g,a,b){for(var k=0;k<g.edges.length;k++){var e=g.edges[k];if((e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a))return k;}return -1;}
  function run(){var g=ROUTE.graph(st.traffic),R=ROUTE.dij(g),opt=R.d[7],few=ROUTE.fewest(g),used={},w=0;
    for(var i=1;i<st.seq.length;i++){var k=ek(g,st.seq[i-1],st.seq[i]);used[k]=1;w+=g.edges[k][2];}
    var done=st.seq[st.seq.length-1]===7,optE={},v=7;while(v!==0){var kk=R.prev[v];optE[kk]=1;var e=g.edges[kk];v=e[0]===v?e[1]:e[0];}
    T.drawG(s1,g,{r:22,weights:true,nodeLabel:function(i){return g.names[i];},nodeFill:function(i){return i===st.seq[st.seq.length-1]?'#fde7a8':st.seq.indexOf(i)>=0?'#d6ecff':C.node;},
      edgeColor:function(k){var key=g.names[g.edges[k][0]]+'–'+g.names[g.edges[k][1]];return used[k]?C.r:(st.traffic&&ROUTE.jam[key])?C.a:C.k;},edgeWidth:function(k){return used[k]?5:2.2;},
      onNode:function(i){if(done)return;var last=st.seq[st.seq.length-1];if(ek(g,last,i)<0||st.seq.indexOf(i)>=0)return;st.seq.push(i);hist.touched=true;run();}});
    bars(s2,[{l:'내 길',v:done?w:0,t:done?w+'분':'배달 중',c:done&&w===opt?C.g:C.b},{l:'가장 빠른 길',v:opt,t:opt+'분',c:C.g},{l:'구간 수 최소 길',v:few.w,t:few.w+'분 ('+few.steps+'구간)',c:C.a}],'배달 시간 비교 (분)');
    var gap=done?w-opt:null;
    F.sc.innerHTML=card('내 배달 시간',done?w+'분':'배달 중')+card('가장 빠른 시간',opt+'분')+card('차이',done?(gap?'+'+gap+'분':'0분 (최적)'):'—',done?gap===0:null)+card('지나간 구간',(st.seq.length-1)+'개');
    var myFew=done&&st.seq.length-1===few.steps;
    F.talk.innerHTML=says([['doc',done&&gap===0?'judge':'think',done?(gap===0?'가장 빠른 길이에요. 고객이 기뻐하겠네요.':'배달 완료! 그런데 '+gap+'분 더 빠른 길이 있어요.'):'고객까지 이어 보세요. 정체 구간은 주황색이에요.'],
      ['asst','report','지금까지 '+(st.seq.length-1)+'구간, '+w+'분이에요.'+(st.traffic?' 퇴근 시간이라 주황 구간이 느려요.':'')],
      ['fly','magnify',st.traffic?'정체 구간을 피하면 구간 수가 늘어도 빨라질 수 있어. 다익스트라처럼 시간 합으로 봐.':'구간 수가 아니라 시간 합이야. 08장 하루 발표 기억나?'],
      ['robo','calc','구간이 적은 길('+few.steps+'구간, '+few.w+'분)이 제일 빠르겠죠!']]);window.Cast.fill(F.talk);
    if(done&&gap===0){if(st.traffic)hist.okJ=true;else hist.okN=true;}
    if(done&&st.traffic&&myFew&&w>opt)hist.trap=true;
    if(hist.touched){mk(0,hist.okN?'ok':'try');mk(1,hist.trap?'ok':'try');mk(2,hist.okN&&hist.okJ?'ok':'try');}}
  run();
})();

/* ═════════ 2. 시험 시간표 사무실 (색칠) ═════════ */
var EXAM=(function(){
  var A=function(){return T.P.exam();};
  var B=function(){return T.mk(['물리1','화학1','물리2','화학2','물리3','화학3'],[[120,60],[520,60],[120,160],[520,160],[120,260],[520,260]],[['물리1','화학2'],['물리1','화학3'],['물리2','화학1'],['물리2','화학3'],['물리3','화학1'],['물리3','화학2']]);};
  function chrom(g){var n=g.names.length,Ad=T.adj(g);for(var k=1;k<=n;k++){var col=new Array(n).fill(-1);if(bt(0))return k;}return n;function bt(i){if(i===n)return true;for(var c=0;c<k;c++){if(Ad[i].every(function(y){return col[y.to]!==c;})){col[i]=c;if(bt(i+1))return true;col[i]=-1;}}return false;}}
  function greedyOrder(g,order){var Ad=T.adj(g),col=g.names.map(function(){return 0;});order.forEach(function(i){var k=1;while(Ad[i].some(function(y){return col[y.to]===k;}))k++;col[i]=k;});return col;}
  return {A:A,B:B,chrom:chrom,greedy:greedyOrder};
})();
(function(){
  var p=panes.exam,F=frame(p,{title:'시험 시간표 사무실 — 시간대를 가장 적게',
    situ:'과목마다 시험 시간대(색)를 정해요. 같은 학생이 듣는 두 과목(선으로 이어짐)은 같은 시간대에 볼 수 없어요. 시간대가 하나 늘 때마다 시험 기간이 하루 길어져요. 학기마다 과목 충돌 데이터가 달라요.',
    back:'<a href="../06_planarity_coloring.html">06장 평면성과 색칠</a> · <a href="../05_euler_hamilton.html">05장 어려운 문제</a>'});
  var COL=['#ffffff','#e5534b','#3b82f6','#f2c12e','#22a39f','#9b3fb5'],st={set:'A'},g=EXAM.A(),col=g.names.map(function(){return 0;}),hist={okA:false,okB:false,trap:false,touched:false};
  radioRow(F.env,'이번 학기 충돌 데이터:',[['A','1학기 (7과목)'],['B','2학기 (물리·화학 6과목)']],'A',function(v){st.set=v;g=v==='A'?EXAM.A():EXAM.B();col=g.names.map(function(){return 0;});hist.touched=true;run();});
  el('p','note','과목(점)을 누를 때마다 시간대 색이 바뀌어요. 자동 단추는 적힌 순서대로 「쓸 수 있는 가장 앞 시간대」를 고르는 방법이에요.',F.dec);
  var cb=el('div','ctrl',null,F.dec);btnRow(cb,'자동: 목록 순서대로 칠하기',function(){col=EXAM.greedy(g,g.names.map(function(_,i){return i;}));hist.touched=true;hist.auto=true;run();});btnRow(cb,'모두 지우기',function(){col=g.names.map(function(){return 0;});run();});
  var mk=missions(F,['1학기(7과목)를 충돌 없이 가장 적은 시간대로 짜기','함정 관찰: 2학기에서 「자동: 목록 순서대로」가 필요보다 시간대를 더 쓰는 것 확인하기','조건 바꾸기: 1학기와 2학기 모두 충돌 없이 가장 적은 시간대로 짜기']);
  var s1=sv(F.g1,640,310,'과목 충돌 그래프'),s2=sv(F.g2,480,240,'시간대별 시험 과목 수 막대그래프');
  function run(){var bad=g.edges.map(function(e){return col[e[0]]&&col[e[0]]===col[e[1]];}),nb=bad.filter(Boolean).length,all=col.every(function(x){return x;}),used=new Set(col.filter(function(x){return x;})).size,chi=EXAM.chrom(g),ok=all&&nb===0;
    T.drawG(s1,g,{r:28,nodeFill:function(i){return COL[col[i]];},onNode:function(i){col[i]=(col[i]+1)%COL.length;hist.touched=true;hist.auto=false;run();},edgeColor:function(k){return bad[k]?C.r:C.k;},edgeDash:function(k){return bad[k];},edgeWidth:function(k){return bad[k]?4:2.2;}});
    var items=[];for(var c=1;c<COL.length;c++){var cnt=col.filter(function(x){return x===c;}).length;if(cnt)items.push({l:c+'번째 시간대',v:cnt,t:cnt+'과목',c:COL[c]});}
    if(!items.length)items.push({l:'아직 없음',v:0,t:'—'});bars(s2,items,'시간대별 시험 과목 수');
    F.sc.innerHTML=card('쓴 시간대',used+'개',ok?used===chi:null)+card('필요한 최소 시간대',chi+'개')+card('충돌',nb+'곳',nb===0&&all)+card('시험 기간',ok?used+'일':'짜는 중',ok?used===chi:null);
    F.talk.innerHTML=says([['doc',ok&&used===chi?'judge':'think',ok?(used===chi?'충돌 없고 시간대도 최소예요. 이 시간표로 확정합시다.':'충돌은 없지만 '+(used-chi)+'일을 줄일 수 있어요.'):'아직 칠하지 않은 과목이나 충돌(빨간 점선)이 있어요.'],
      ['asst','report','시간대 '+used+'개, 충돌 '+nb+'곳이에요.'],
      ['fly','magnify',st.set==='B'?'2학기 그래프는 두 편(물리·화학)으로 나뉘어. 사실 2색이면 돼. 자동 단추를 믿지 마.':'국어–수학–과학은 삼각형이야. 최소 3시간대는 필요해.'],
      ['robo','calc','자동 단추가 칠했으니 이게 최소겠죠!']]);window.Cast.fill(F.talk);
    if(ok&&used===chi){if(st.set==='A')hist.okA=true;else hist.okB=true;}
    if(st.set==='B'&&hist.auto&&ok&&used>chi)hist.trap=true;
    if(hist.touched){mk(0,hist.okA?'ok':'try');mk(1,hist.trap?'ok':'try');mk(2,hist.okA&&hist.okB?'ok':'try');}}
  run();
})();

/* ═════════ 3. 물류 관 증설 본부 (최대 흐름 · 최소 절단) ═════════ */
var PIPE=(function(){
  function graph(work,up){var g=T.P.flow();if(work)g.edges[2][2]=1;if(up!=null&&up>=0)g.edges[up][2]+=2;return g;}
  function maxflow(g){var n=g.names.length,f=g.edges.map(function(){return 0;}),tot=0;
    for(;;){var prev=new Array(n).fill(null),q=[0];prev[0]={v:-1};while(q.length){var x=q.shift();g.edges.forEach(function(e,k){if(e[0]===x&&f[k]<e[2]&&!prev[e[1]]){prev[e[1]]={v:x,k:k,fw:1};q.push(e[1]);}if(e[1]===x&&f[k]>0&&!prev[e[0]]){prev[e[0]]={v:x,k:k,fw:-1};q.push(e[0]);}});}
      if(!prev[n-1])return {v:tot,f:f,reach:prev.map(function(p){return !!p;})};var path=[],v=n-1,b=Infinity;while(v!==0){var pp=prev[v];path.push(pp);b=Math.min(b,pp.fw>0?g.edges[pp.k][2]-f[pp.k]:f[pp.k]);v=pp.v;}
      path.forEach(function(pp){f[pp.k]+=pp.fw*b;});tot+=b;}}
  return {graph:graph,maxflow:maxflow};
})();
(function(){
  var p=panes.pipe,F=frame(p,{title:'물류 관 증설 본부 — 어디를 넓혀야 더 많이 보낼까',
    situ:'물류 센터 s에서 지점 t로 하루에 보낼 수 있는 트럭 수(관 크기)가 도로마다 정해져 있어요. 올해 예산으로 도로 한 곳만 하루 2대 더 넓힐 수 있어요. 어디를 넓혀야 처리량이 가장 늘까요? 도로 a→c가 공사 중이면 하루 1대만 지나가요.',
    back:'<a href="../07_matching_flow.html">07장 매칭과 흐름</a> · <a href="../03_paths_connectivity.html">03장 다리(끊으면 갈라지는 선)</a>'});
  var g0=T.P.flow(),st={work:false,up:-1},hist={tried:{},okN:false,okW:false,trap:false,touched:false};
  radioRow(F.env,'도로 상황:',[[false,'평소'],[true,'a→c 공사 중 (용량 1)']],false,function(v){st.work=v;st.up=-1;hist.touched=true;sel.forEach(function(b){b.setAttribute('aria-pressed','false');});run();});
  var opts=g0.edges.map(function(e,k){return [k,g0.names[e[0]]+'→'+g0.names[e[1]]];});
  var sel=radioRow(F.dec,'넓힐 도로 (+2대):',opts,-1,function(v){st.up=+v;hist.touched=true;run();});
  var mk=missions(F,['평소에 처리량이 가장 많이 느는 도로를 골라 넓히기','함정 관찰: 출발 도로 s→a를 넓혀도 처리량이 그대로인 것 확인하기','조건 바꾸기: a→c 공사 중일 때도 가장 효과 큰 도로 찾기 (답이 바뀌어요)']);
  var s1=sv(F.g1,640,300,'물류 도로망과 가장 좁은 자르는 선'),s2=sv(F.g2,480,280,'넓혀 본 도로별 처리량 증가 막대그래프');
  function run(){var base=PIPE.maxflow(PIPE.graph(st.work)),gu=PIPE.graph(st.work,st.up),now=PIPE.maxflow(gu),gain=now.v-base.v,best=0;
    for(var k=0;k<g0.edges.length;k++)best=Math.max(best,PIPE.maxflow(PIPE.graph(st.work,k)).v-base.v);
    var key=(st.work?'W':'N')+st.up;if(st.up>=0)hist.tried[key]=gain;
    var cutE={};g0.edges.forEach(function(e,k){if(base.reach[e[0]]&&!base.reach[e[1]])cutE[k]=1;});
    T.drawG(s1,gu,{weights:true,edgeLabel:function(k){return now.f[k]+'/'+gu.edges[k][2];},edgeColor:function(k){return k===st.up?C.b:cutE[k]?C.m:C.k;},edgeWidth:function(k){return k===st.up?5:2+now.f[k];},nodeFill:function(i){return base.reach[i]?'#e7f5ec':'#f6ecfa';}});
    var items=Object.keys(hist.tried).filter(function(x){return x[0]===(st.work?'W':'N');}).map(function(x){var k=+x.slice(1);return {l:opts[k][1],v:hist.tried[x],t:'+'+hist.tried[x]+'대',c:hist.tried[x]===best?C.g:C.mu};});
    if(!items.length)items=[{l:'아직 없음',v:0,t:'도로를 골라 보세요'}];bars(s2,items,'넓혀 본 도로별 처리량 증가 ('+(st.work?'공사 중':'평소')+')');
    F.sc.innerHTML=card('지금 처리량',base.v+'대/일')+card('넓힌 뒤',st.up>=0?now.v+'대/일':'—')+card('늘어난 양',st.up>=0?'+'+gain+'대':'—',st.up>=0?gain===best:null)+card('가장 좁은 자르는 선',Object.keys(cutE).map(function(k){return opts[k][1];}).join(', '));
    F.talk.innerHTML=says([['doc',st.up>=0&&gain===best?'judge':'think',st.up<0?'보라색 도로가 지금의 병목(가장 좁은 자르는 선)이에요. 어디를 넓힐지 골라 보세요.':gain===best?'예산을 가장 잘 썼어요. 하루 '+gain+'대가 늘어요.':'넓혀도 '+gain+'대밖에 안 늘어요. 병목이 아닌 곳일 수 있어요.'],
      ['asst','report','처리량 '+base.v+'대 → '+(st.up>=0?now.v:base.v)+'대예요.'],
      ['fly','magnify','병목에 속한 도로를 넓혀야 해. 병목이 아닌 도로는 아무리 넓혀도 그대로야.'],
      ['robo','calc','출발하는 도로를 넓히면 당연히 더 많이 나가겠죠!']]);window.Cast.fill(F.talk);
    if(st.up>=0&&gain===best&&best>0){if(st.work)hist.okW=true;else hist.okN=true;}
    if(st.up===0&&gain===0)hist.trap=true;
    if(hist.touched){mk(0,hist.okN?'ok':'try');mk(1,hist.trap?'ok':'try');mk(2,hist.okN&&hist.okW?'ok':'try');}}
  run();
})();

show((location.hash||'#route').slice(1));
addEventListener('hashchange',function(){show(location.hash.slice(1));});
window.PRACTICE={ROUTE:ROUTE,EXAM:EXAM,PIPE:PIPE};
})();
