/* 위젯 모음 3: 7~9장 (매칭 · 최대 흐름 · 다익스트라 · 격자 BFS · 스펙트럼 · 라플라시안) + 대결 판정 */
(function(){
'use strict';
var U=window.WU,T=window.GT,C=window.WC,E=U.E,H=U.H,svg=U.svg,ctrl=U.ctrl,btn=U.btn,radio=U.radio,slider=U.slider,out=U.out,tx=U.tx,drawG=T.drawG,mk=T.mk,PAL=T.PAL,fmt=T.fmt;

T.P.bip=function(){return mk(['u1','u2','u3','u4','v1','v2','v3','v4'],[[160,40],[160,110],[160,180],[160,250],[480,40],[480,110],[480,180],[480,250]],[['u1','v1'],['u1','v2'],['u2','v2'],['u2','v3'],['u3','v2'],['u3','v4'],['u4','v4']]);};
T.P.hall=function(){return mk(['u1','u2','u3','u4','v1','v2','v3','v4'],[[160,40],[160,110],[160,180],[160,250],[480,40],[480,110],[480,180],[480,250]],[['u1','v1'],['u1','v2'],['u2','v1'],['u2','v2'],['u3','v1'],['u3','v2'],['u4','v3'],['u4','v4']]);};
T.P.flow=function(){return mk(['s','a','b','c','d','t'],[[60,150],[220,55],[220,245],[420,55],[420,245],[580,150]],[['s','a',4],['s','b',3],['a','c',4],['a','b',2],['b','d',3],['c','t',3],['d','t',2]],true);};
T.P.dj=function(){return mk(['s','a','b','c','d','t'],[[60,150],[220,65],[220,245],[430,65],[430,245],[590,150]],[['s','a',2],['s','b',5],['a','b',2],['a','c',3],['b','d',3],['d','c',1],['c','t',5],['d','t',1]],true);};
T.P.k3=function(){return mk(['1','2','3'],[[320,50],[200,230],[440,230]],[['1','2'],['2','3'],['3','1']]);};
T.P.p4=function(){return mk(['1','2','3','4'],[[110,150],[250,150],[390,150],[530,150]],[['1','2'],['2','3'],['3','4']]);};
T.P.c4=function(){return mk(['1','2','3','4'],[[220,60],[420,60],[420,240],[220,240]],[['1','2'],['2','3'],['3','4'],['4','1']]);};
T.P.star=function(){return mk(['O','1','2','3','4'],[[320,150],[320,40],[470,150],[320,260],[170,150]],[['O','1'],['O','2'],['O','3'],['O','4']]);};
T.P.k4=function(){return mk(['1','2','3','4'],[[220,60],[420,60],[420,240],[220,240]],[['1','2'],['1','3'],['1','4'],['2','3'],['2','4'],['3','4']]);};

/* ── 도우미 ── */
function maxMatch(g,L){var A=T.adj(g),mR={},mL={};function aug(u,seen){for(var i=0;i<A[u].length;i++){var v=A[u][i].to;if(seen[v])continue;seen[v]=1;if(mR[v]==null||aug(mR[v],seen)){mR[v]=u;mL[u]=v;return true;}}return false;}
  var sz=0;L.forEach(function(u){if(aug(u,{}))sz++;});return {size:sz,mL:mL};}
function flowState(g){return {f:g.edges.map(function(){return 0;})};}
function residualPath(g,f){var n=g.names.length,s=0,t=n-1,prev=new Array(n).fill(null),q=[s];prev[s]={v:-1};
  while(q.length){var x=q.shift();g.edges.forEach(function(e,k){if(e[0]===x&&f[k]<e[2]&&!prev[e[1]]){prev[e[1]]={v:x,k:k,fw:1};q.push(e[1]);}if(e[1]===x&&f[k]>0&&!prev[e[0]]){prev[e[0]]={v:x,k:k,fw:-1};q.push(e[0]);}});}
  var reach=prev.map(function(p){return !!p;});if(!prev[t])return {path:null,reach:reach};
  var path=[],v=t,b=Infinity;while(v!==s){var p=prev[v];path.unshift(p);b=Math.min(b,p.fw>0?g.edges[p.k][2]-f[p.k]:f[p.k]);v=p.v;}return {path:path,b:b,reach:reach};}
T.maxflow=function(key){var g=T.P[key](),f=flowState(g).f,tot=0,r;while((r=residualPath(g,f)).path){r.path.forEach(function(p){f[p.k]+=p.fw*r.b;});tot+=r.b;}return tot;};
function dijkstraRun(g,src){var n=g.names.length,d=new Array(n).fill(Infinity),done=new Array(n).fill(false),prev=new Array(n).fill(-1),q=[[0,src]],log=[];d[src]=0;
  while(q.length){q.sort(function(a,b){return a[0]-b[0]||a[1]-b[1];});var snap=q.map(function(x){return x.slice();});var top=q.shift(),u=top[1];if(done[u])continue;done[u]=true;var rel=[];
    g.edges.forEach(function(e,k){if(e[0]===u&&!done[e[1]]&&d[u]+e[2]<d[e[1]]){d[e[1]]=d[u]+e[2];prev[e[1]]=k;q=q.filter(function(x){return x[1]!==e[1];});q.push([d[e[1]],e[1]]);rel.push([e[1],d[e[1]]]);}});
    log.push({q:snap,u:u,rel:rel,d:d.slice(),done:done.slice(),prev:prev.slice()});}
  return {d:d,prev:prev,log:log};}
T.dijkstra=function(key,a,b){var g=T.P[key]();return dijkstraRun(g,T.idx(g,a)).d[T.idx(g,b)];};
function lap(g,on){var n=g.names.length,L=[];for(var i=0;i<n;i++)L.push(new Array(n).fill(0));g.edges.forEach(function(e,k){if(on&&!on[k])return;L[e[0]][e[1]]-=1;L[e[1]][e[0]]-=1;L[e[0]][e[0]]+=1;L[e[1]][e[1]]+=1;});return L;}
T.lmax=function(key){var ev=T.eig(T.matrix(T.P[key]()));return T.r2(ev[ev.length-1].v);};
/* 고윳값 막대(줄기) 그림: vals 정렬 배열, ghost = 비교용 값 */
function stem(s,vals,o){o=o||{};s.innerHTML='';var lo=o.lo!=null?o.lo:-3,hi=o.hi!=null?o.hi:3,W0=50,W1=600,Y=180,X=function(v){return W0+(v-lo)/(hi-lo)*(W1-W0);};
  E('line',{x1:W0-10,y1:Y,x2:W1+10,y2:Y,stroke:C.k,'stroke-width':1.5},s);for(var t=Math.ceil(lo);t<=hi;t++){E('line',{x1:X(t),y1:Y,x2:X(t),y2:Y+6,stroke:C.k},s);tx(s,X(t)-(t<0?9:4),Y+24,String(t).replace('-','−'),{'font-size':13});}
  tx(s,W1-6,Y+44,'λ',{'font-size':15,'font-style':'italic'});
  function group(arr){var gr=[];arr.forEach(function(v){var r=T.r2(v);var f=gr.filter(function(x){return Math.abs(x.v-r)<0.011;})[0];if(f)f.m++;else gr.push({v:r,m:1});});return gr;}
  if(o.ghost)group(o.ghost).forEach(function(p){var x=X(p.v),y=Y-50-p.m*28;E('line',{x1:x+5,y1:Y,x2:x+5,y2:y,stroke:'#b6bec8','stroke-dasharray':'3 3'},s);E('circle',{cx:x+5,cy:y,r:7,fill:'#fff',stroke:'#9aa4b0','stroke-width':2},s);});
  group(vals).forEach(function(p){var x=X(p.v),y=Y-50-p.m*28;E('line',{x1:x,y1:Y,x2:x,y2:y,stroke:o.color||C.r,'stroke-dasharray':'4 3'},s);E('circle',{cx:x,cy:y,r:8,fill:o.color||C.r},s);tx(s,x-14,y-14,'('+p.m+')',{'font-size':12});tx(s,x-14,Y-6,fmt(p.v),{'font-size':11,fill:C.mu});});}

/* ═══ 7-1 매칭: 겹치지 않게 짝짓기 ═══ */
W.match=function(el,o){
  var key='bip',g=T.P.bip(),on=[];
  var c=ctrl(el);radio(c,'상황:',[['bip','원자료 짝짓기'],['hall','셋이 둘만 원함']],'bip',function(v){key=v;g=T.P[v]();on=g.edges.map(function(){return false;});draw();});
  btn(c,'컴퓨터: 최대 매칭 찾기',function(){var r=maxMatch(g,[0,1,2,3]);on=g.edges.map(function(e){return r.mL[e[0]]===e[1];});draw();});btn(c,'지우기',function(){on=on.map(function(){return false;});draw();});
  H('p','note','왼쪽 u = 멘티, 오른쪽 v = 멘토(예시). 선 = 「이 둘은 시간이 맞음」. 선을 눌러 짝을 고르세요. 한 사람은 한 짝만!',el);
  var s=svg(el,640,290,'두 줄로 선 사람들의 짝짓기 그래프'),ou=out(el);on=g.edges.map(function(){return false;});
  function draw(){var cnt={};g.edges.forEach(function(e,k){if(on[k]){cnt[e[0]]=(cnt[e[0]]||0)+1;cnt[e[1]]=(cnt[e[1]]||0)+1;}});
    var bad=g.edges.map(function(e,k){return on[k]&&(cnt[e[0]]>1||cnt[e[1]]>1);}),sz=on.filter(Boolean).length,best=maxMatch(g,[0,1,2,3]).size,nb=bad.filter(Boolean).length;
    drawG(s,g,{edgeColor:function(k){return bad[k]?C.a:on[k]?C.r:C.k;},edgeWidth:function(k){return on[k]?5:2;},edgeDash:function(k){return bad[k];},onEdge:function(k){on[k]=!on[k];draw();},
      nodeFill:function(i){return cnt[i]>1?'#fde7a8':cnt[i]?'#f8d7d6':C.node;}});
    ou.innerHTML='<p>고른 짝 <b>'+sz+'쌍</b> · 겹친 사람 '+(nb?'<span class="r">있음 (주황 점선) — 매칭이 아니에요</span>':'<span class="g">없음 — 매칭이에요</span>')+'</p>'+
      (nb===0&&sz===best?'<p class="g">최대 매칭('+best+'쌍)! '+(best===4?'모두가 짝을 찾은 완전 매칭이에요.':'')+'</p>':nb===0?'<p class="note">더 늘릴 수 있을까요? 최대는 '+best+'쌍이에요.</p>':'')+
      (key==='hall'?'<p class="a">u1, u2, u3 세 명이 원하는 상대가 v1, v2 두 명뿐이에요. 아무리 애써도 이 셋 중 한 명은 짝이 없어요(홀의 조건).</p>':'');}
  draw();
};

/* ═══ 7-2 최대 흐름: 증가 경로를 찾아 한 번씩 더 흘려보내기 ═══ */
W.flow=function(el,o){
  var g=T.P.flow(),f=g.edges.map(function(){return 0;}),last=null,cut=null,steps=0;
  var c=ctrl(el);btn(c,'① 더 흘릴 길 찾기',function(){var r=residualPath(g,f);if(!r.path){cut=r.reach;last=null;}else{last=r;cut=null;}draw();});
  btn(c,'② 그 길로 흘려보내기',function(){if(!last)return;last.path.forEach(function(p){f[p.k]+=p.fw*last.b;});steps++;last=null;draw();});
  btn(c,'처음으로',function(){f=f.map(function(){return 0;});last=null;cut=null;steps=0;draw();});
  H('p','note','관 위 숫자는 「지금 흐르는 양 / 관 크기(용량)」예요. 단추 ①과 ②를 번갈아 눌러 s에서 t로 물건을 최대한 보내 보세요.',el);
  var s=svg(el,640,300,'최대 흐름 네트워크'),ou=out(el);
  function draw(){var onP={};if(last)last.path.forEach(function(p){onP[p.k]=1;});var val=g.edges.reduce(function(a,e,k){return a+(e[1]===5?f[k]:0);},0);
    var cutE={};if(cut)g.edges.forEach(function(e,k){if(cut[e[0]]&&!cut[e[1]])cutE[k]=1;});
    drawG(s,g,{weights:true,edgeLabel:function(k){return f[k]+'/'+g.edges[k][2];},edgeColor:function(k){return onP[k]?C.r:cutE[k]?C.m:f[k]===g.edges[k][2]?C.acc:C.k;},edgeWidth:function(k){return onP[k]?5:2+f[k];},
      nodeFill:function(i){return cut?(cut[i]?'#e7f5ec':'#f6ecfa'):C.node;}});
    var cons=g.names.slice(1,5).map(function(nm,j){var i=j+1,inn=0,ot=0;g.edges.forEach(function(e,k){if(e[1]===i)inn+=f[k];if(e[0]===i)ot+=f[k];});return nm+': 들어옴 '+inn+' = 나감 '+ot+(inn===ot?' ✓':' ✗');});
    var h='<p>지금 t에 도착하는 양 <b>|f| = '+val+'</b> (흘려보낸 횟수 '+steps+'번)</p><p class="note">흐름 보존(중간 점에서 들어온 만큼 나감): '+cons.join(' · ')+'</p>';
    if(last)h+='<p class="r">찾은 길: s → '+last.path.map(function(p){return g.names[p.fw>0?g.edges[p.k][1]:g.edges[p.k][0]]+(p.fw<0?'(되돌리기)':'');}).join(' → ')+' · 이 길로 더 보낼 수 있는 양 = 가장 좁은 곳 <b>'+last.b+'</b></p>';
    if(cut){var cc=0;Object.keys(cutE).forEach(function(k){cc+=g.edges[k][2];});h+='<p class="m">더 흘릴 길이 없어요! s에서 아직 갈 수 있는 점 S = {'+g.names.filter(function(_,i){return cut[i];}).join(', ')+'} (초록). S에서 나가는 관(보라)의 용량 합 = <b>'+cc+'</b> = 최대 흐름 '+val+'. 가장 좁은 「자르는 선」이 곧 최대 흐름이에요(최대 흐름 최소 절단 정리).</p>';}
    ou.innerHTML=h;}
  draw();
};

/* ═══ 8-1 다익스트라: 우선순위 큐를 한 단계씩 ═══ */
W.dijk=function(el,o){
  var base=T.P.dj(),wdt=1,step=0,run,g;
  var c=ctrl(el);btn(c,'다음 단계 ▶',function(){if(step<run.log.length)step++;draw();});btn(c,'끝까지',function(){step=run.log.length;draw();});btn(c,'처음으로',function(){step=0;draw();});
  var c2=ctrl(el);slider(c2,'d → t 길이 바꾸기',1,9,1,1,function(v){wdt=v;rebuild();return String(v);});
  var s=svg(el,640,300,'다익스트라 단계별 그래프'),tb=H('div','tw',null,el),ou=out(el);
  function rebuild(){g=T.P.dj();g.edges[7][2]=wdt;run=dijkstraRun(g,0);step=Math.min(step,run.log.length);draw();}
  function draw(){if(!run)return;var L=step?run.log[step-1]:null,d=L?L.d:g.names.map(function(_,i){return i===0?0:Infinity;}),done=L?L.done:[],prev=L?L.prev:[],fin=step===run.log.length;
    var pathE={};if(fin){var v=5;while(run.prev[v]>=0){pathE[run.prev[v]]=1;v=g.edges[run.prev[v]][0];}}
    drawG(s,g,{weights:true,above:function(i){return g.pos[i][1]<100;},below:function(i){return 'd = '+(d[i]===Infinity?'∞':d[i]);},belowFill:function(i){return done[i]?C.g:C.mu;},
      nodeFill:function(i){return L&&i===L.u?'#fde7a8':done[i]?'#e7f5ec':C.node;},edgeColor:function(k){return pathE[k]?C.r:prev.indexOf(k)>=0?C.acc:C.k;},edgeWidth:function(k){return pathE[k]?5:prev.indexOf(k)>=0?3.5:2;}});
    var rows=run.log.slice(0,step).map(function(x,i){return '<tr><td>'+(i+1)+'</td><td>['+x.q.map(function(q){return '('+q[0]+', '+g.names[q[1]]+')';}).join(', ')+']</td><td>'+g.names[x.u]+' 꺼냄</td><td>'+(x.rel.map(function(r){return g.names[r[0]]+' = '+r[1];}).join(', ')||'고칠 곳 없음')+'</td></tr>';}).join('');
    tb.innerHTML='<table class="tb"><thead><tr><th>단계</th><th>대기 줄 (거리, 점)</th><th>꺼낸 점</th><th>거리 고치기</th></tr></thead><tbody>'+(rows||'<tr><td colspan="4">「다음 단계」를 눌러 시작하세요. s의 거리는 0, 나머지는 ∞(아직 모름)예요.</td></tr>')+'</tbody></table>';
    ou.innerHTML=fin?'<p class="g">끝! s → t 가장 짧은 거리 <b>'+run.d[5]+'</b>. 빨간 길을 따라가면 돼요.</p>':'<p class="note">대기 줄에서 거리가 가장 작은 점을 꺼내 확정(초록)하고, 그 점에서 나가는 화살표로 이웃의 거리를 줄일 수 있으면 고쳐요.</p>';}
  rebuild();
};

/* ═══ 8-2 격자 BFS: 무게 없는 미로에서 몇 걸음? ═══ */
W.bfs=function(el,o){
  var Wd=12,Hd=7,wall={},PRE={none:[],wall:['5,0','5,1','5,2','5,3','5,4','5,5'],maze:['2,0','2,1','2,2','2,3','2,4','5,2','5,3','5,4','5,5','5,6','8,0','8,1','8,2','8,3','8,4','10,4','10,5','9,4'],block:['5,0','5,1','5,2','5,3','5,4','5,5','5,6']};
  var c=ctrl(el);radio(c,'지도:',[['none','빈 마당'],['wall','벽 하나'],['maze','미로'],['block','완전히 막힘']],'maze',function(v){set(v);});
  H('p','note','네모를 누르면 벽을 세우거나 허물어요. 출발(S, 왼쪽 위)에서 걸음 수만큼 색이 진해지고, 도착(G, 오른쪽 아래)까지 가장 짧은 길이 빨간 점으로 보여요.',el);
  var s=svg(el,640,380,'격자 미로의 너비 우선 탐색'),ou=out(el);
  function set(k){wall={};PRE[k].forEach(function(x){wall[x]=1;});draw();}
  function draw(){var dist={},prev={},q=['0,0'];dist['0,0']=0;while(q.length){var cur=q.shift(),xy=cur.split(',').map(Number);[[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){var nx=xy[0]+d[0],ny=xy[1]+d[1],kk=nx+','+ny;if(nx<0||ny<0||nx>=Wd||ny>=Hd||wall[kk]||dist[kk]!=null)return;dist[kk]=dist[cur]+1;prev[kk]=cur;q.push(kk);});}
    var G=(Wd-1)+','+(Hd-1),path={};if(dist[G]!=null){var v=G;while(v){path[v]=1;v=prev[v];}}var mx=Math.max.apply(null,Object.keys(dist).map(function(k){return dist[k];}));
    s.innerHTML='';var cs=50,x0=20,y0=15;
    for(var y=0;y<Hd;y++)for(var x=0;x<Wd;x++){(function(x,y){var k=x+','+y,dd=dist[k],fill=wall[k]?'#33414e':dd==null?'#f1f4f7':'rgba(15,124,122,'+(0.12+0.75*dd/Math.max(1,mx))+')';
      var r=E('rect',{x:x0+x*cs,y:y0+y*cs,width:cs-3,height:cs-3,rx:4,fill:fill,tabindex:0,role:'button','aria-label':'네모 '+(x+1)+', '+(y+1)+(wall[k]?' 벽':dd!=null?' '+dd+'걸음':'')},s);r.style.cursor='pointer';
      function tg(){if(k==='0,0'||k===G)return;if(wall[k])delete wall[k];else wall[k]=1;draw();}r.addEventListener('click',tg);r.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();tg();}});
      if(dd!=null&&!wall[k])tx(s,x0+x*cs+(dd>9?12:18),y0+y*cs+30,String(dd),{'font-size':14,fill:dd/Math.max(1,mx)>0.5?'#fff':C.k});
      if(path[k])E('circle',{cx:x0+x*cs+cs/2-1.5,cy:y0+y*cs+cs/2+12,r:5,fill:C.r},s);})(x,y);}
    tx(s,x0+6,y0+20,'S',{'font-size':16,'font-weight':700,fill:C.r});tx(s,x0+(Wd-1)*cs+30,y0+(Hd-1)*cs+20,'G',{'font-size':16,'font-weight':700,fill:C.r});
    ou.innerHTML=dist[G]!=null?'<p class="g">S에서 G까지 가장 짧은 길: <b>'+dist[G]+'걸음</b>. 닿을 수 있는 네모 '+Object.keys(dist).length+'개.</p><p class="note">너비 우선 탐색(BFS)은 1걸음 네모를 모두 본 다음 2걸음 네모를 보는 식으로 퍼져 나가요. 선마다 무게가 같을 때(한 걸음 = 같은 비용)는 이것만으로 최단 거리가 나와요.</p>':'<p class="r">G에 닿는 길이 없어요. 두 네모가 서로 다른 연결 요소에 있어요(3장).</p>';}
  set('maze');
};

/* ═══ 9-1 스펙트럼: 인접 행렬의 고윳값 줄기 그림 ═══ */
W.spec=function(el,o){
  var key=o.preset||'src0';
  var c=ctrl(el);radio(c,'그래프:',[['src0','원자료 다섯 점'],['k3','삼각형'],['p4','일자 4점'],['c4','네모'],['star','별'],['k4','4점 모두 연결']],key,function(v){key=v;draw();});
  var two=H('div','gviews',null,el);two.style.gridTemplateColumns='minmax(0,1fr) minmax(0,1.6fr)';var a=H('div',null,'<h4>그래프</h4>',two),b=H('div',null,'<h4>고윳값 (빨강, 괄호 = 겹친 개수)</h4>',two);
  var s1=svg(a,640,300,'그래프'),s2=svg(b,640,240,'고윳값 줄기 그림'),ou=out(el);
  function draw(){var g=T.P[key](),ev=T.eig(T.matrix(g)).map(function(x){return x.v;}),n=g.names.length,m=g.edges.length;
    drawG(s1,g,{r:24,below:function(i){return '차수 '+T.deg(g,i);}});
    stem(s2,ev,{ghost:key==='src0'?[-2,-1,0,0,1,3]:null});
    var sum=ev.reduce(function(x,y){return x+y;},0),sq=ev.reduce(function(x,y){return x+y*y;},0),mxd=Math.max.apply(null,g.names.map(function(_,i){return T.deg(g,i);})),lm=ev[ev.length-1],avg=2*m/n;
    var sym=ev.every(function(v,i){return Math.abs(v+ev[n-1-i])<1e-6;});
    ou.innerHTML='<p>고윳값 '+n+'개: { '+ev.map(fmt).join(', ')+' }</p>'+
      '<p>① 모두 더하면 '+fmt(sum)+' <span class="note">(대각선이 전부 0이라 합은 늘 0)</span> · ② 제곱해 더하면 '+fmt(sq)+' = 2 × 선 수 '+m+' ✓ · ③ 가장 큰 값 '+fmt(lm)+'은 평균 차수 '+fmt(avg)+' 이상, 최대 차수 '+mxd+' 이하 ✓</p>'+
      (sym?'<p class="b">값이 0을 기준으로 좌우 대칭이에요 → 두 편으로 나눠 칠할 수 있는 그래프(이분 그래프)라는 신호.</p>':'')+
      (key==='src0'?'<p class="a">회색 빈 원은 원자료에 적힌 값 {−2, −1, 0, 0, 1, 3}이에요. 점이 5개인데 값이 6개이고, 합이 0이 아니어서 맞을 수 없어요. 이 페이지에서는 계산한 값(빨강)으로 바꿉니다.</p>':'');}
  draw();
};

/* ═══ 9-2 라플라시안: 0의 개수 = 덩어리 수, 둘째 값으로 무리 나누기 ═══ */
W.lap=function(el,o){
  var g=T.P.friends(),on=g.edges.map(function(){return true;});
  var c=ctrl(el);btn(c,'모두 잇기',function(){on=on.map(function(){return true;});draw();});btn(c,'두 무리 사이 다리 끊기',function(){on=g.edges.map(function(e){var a=g.names[e[0]],b=g.names[e[1]];return !((a==='서준'||a==='하은')&&b==='예준');});draw();});
  H('p','note','선을 눌러 끊고 이어 보세요. 아래 줄기 그림은 라플라시안(차수 표 − 인접 행렬)의 고윳값이에요.',el);
  var s1=svg(el,640,290,'반 친구 관계 그래프 (색 = 둘째 고유벡터의 부호)'),s2=svg(el,640,240,'라플라시안 고윳값 줄기 그림'),ou=out(el);
  function draw(){var L=lap(g,on),ev=T.eig(L),vals=ev.map(function(x){return x.v;}),z=vals.filter(function(v){return Math.abs(v)<1e-6;}).length,cm=T.comps(g,on),f=ev[1].vec,l2=vals[1];
    drawG(s1,g,{r:17,nodeFill:function(i){return z>1?PAL[cm.lab[i]%PAL.length]:(f[i]>=0?'#1e55c8':'#c9302c');},labelFill:function(){return '#fff';},nodeStroke:function(){return '#fff';},
      edgeColor:function(k){return on[k]?C.k:C.rule;},edgeDash:function(k){return !on[k];},onEdge:function(k){on[k]=!on[k];draw();}});
    stem(s2,vals,{lo:0,hi:Math.ceil(Math.max.apply(null,vals)),color:C.acc});
    ou.innerHTML='<p>고윳값 0의 개수 <b>'+z+'</b> = 덩어리 수 <b>'+cm.n+'</b> '+(z===cm.n?'✓':'')+'</p>'+
      (z===1?'<p>둘째로 작은 값 λ₂ = <b>'+fmt(l2)+'</b> '+(l2<0.5?'<span class="a">(0에 가까움 → 살짝만 이어진 두 무리가 있다는 신호)</span>':'<span class="g">(꽤 큼 → 골고루 단단히 이어짐)</span>')+'</p><p class="b">점 색은 λ₂에 딸린 숫자 줄(고유벡터)의 부호예요. 파랑/빨강이 곧 컴퓨터가 찾은 두 무리예요.</p>':'<p class="a">덩어리가 여러 개면 0이 그만큼 겹쳐 나와요. 점 색 = 덩어리.</p>');}
  draw();
};

/* ═══ 대결 판정: 계산식 ═══ */
DUELS.expr=function(){var c=(window.PAGE&&PAGE.duel&&PAGE.duel.calc)||{};var v;try{v=Function('"use strict";return ('+c.expr+');')();}catch(e){v=NaN;}
  function same(a,b){return typeof a==='number'&&typeof b==='number'?Math.abs(a-b)<1e-9:String(a)===String(b);}
  return {fly:same(v,c.fly),robo:same(v,c.robo),report:String(c.fmt||'계산 결과: {v}').replace(/\{v\}/g,'<b>'+v+'</b>')};};
})();
