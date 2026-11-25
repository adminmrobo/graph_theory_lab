/* 위젯 모음 2: 4~6장 (트리 · 신장 트리 · 오일러 · 해밀턴 · 평면 그래프 · 색칠) */
(function(){
'use strict';
var U=window.WU,T=window.GT,C=window.WC,E=U.E,H=U.H,svg=U.svg,ctrl=U.ctrl,btn=U.btn,radio=U.radio,out=U.out,tx=U.tx,drawG=T.drawG,mk=T.mk,PAL=T.PAL;

T.P.tree=function(){return mk(['r','a','b','c','d','e','f','h','i','g'],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[['r','a'],['r','b'],['a','c'],['a','d'],['b','e'],['b','f'],['c','h'],['c','i'],['e','g']]);};
T.P.span=function(){return mk(['a','b','c','d','e','f','g'],[[320,35],[200,105],[440,105],[320,145],[200,215],[440,215],[320,265]],[['a','b',4],['a','d',2],['a','c',5],['b','d',1],['c','d',3],['b','e',6],['c','f',4],['e','f',7],['e','g',2],['f','g',3]]);};
T.P.square=function(){return mk(['A','B','C','D'],[[180,50],[460,50],[460,230],[180,230]],[['A','B'],['B','C'],['C','D'],['D','A']]);};
T.P.house=function(){return mk(['A','B','C','D','E'],[[200,250],[440,250],[440,130],[200,130],[320,35]],[['A','B'],['B','C'],['C','D'],['D','A'],['A','C'],['B','D'],['D','E'],['E','C']]);};
T.P.kb=function(){return mk(['북','남','섬','동'],[[300,40],[300,250],[230,145],[520,145]],[['북','섬'],['북','섬'],['남','섬'],['남','섬'],['북','동'],['남','동'],['섬','동']]);};
function ring(n,cx,cy,R,rot){var p=[];for(var i=0;i<n;i++){var a=-Math.PI/2+i*2*Math.PI/n+(rot||0);p.push([cx+R*Math.cos(a),cy+R*Math.sin(a)]);}return p;}
T.P.k5=function(){var nm=['A','B','C','D','E'],e=[];for(var i=0;i<5;i++)for(var j=i+1;j<5;j++)e.push([nm[i],nm[j]]);return mk(nm,ring(5,320,150,115),e);};
T.P.petersen=function(){var nm=['1','2','3','4','5','6','7','8','9','10'],p=ring(5,320,150,125).concat(ring(5,320,150,58)),e=[];
  for(var i=0;i<5;i++){e.push([nm[i],nm[(i+1)%5]]);e.push([nm[i],nm[i+5]]);e.push([nm[i+5],nm[(i+2)%5+5]]);}return mk(nm,p,e);};
T.P.cube=function(){var nm=['1','2','3','4','5','6','7','8'],p=[[170,240],[390,240],[390,60],[170,60],[250,200],[470,200],[470,20],[250,20]].map(function(q){return [q[0],q[1]+20];});
  return mk(nm,p,[['1','2'],['2','3'],['3','4'],['4','1'],['5','6'],['6','7'],['7','8'],['8','5'],['1','5'],['2','6'],['3','7'],['4','8']]);};
T.P.k4x=function(){return mk(['A','B','C','D'],[[200,60],[440,60],[440,240],[200,240]],[['A','B'],['B','C'],['C','D'],['D','A'],['A','C'],['B','D']]);};
T.P.wheel=function(){return mk(['A','B','C','D','O'],[[180,50],[460,50],[460,250],[180,250],[320,150]],[['A','B'],['B','C'],['C','D'],['D','A'],['A','O'],['B','O'],['C','O'],['D','O']]);};
T.P.k33=function(){return mk(['u1','u2','u3','v1','v2','v3'],[[170,50],[170,150],[170,250],[470,50],[470,150],[470,250]],[['u1','v1'],['u1','v2'],['u1','v3'],['u2','v1'],['u2','v2'],['u2','v3'],['u3','v1'],['u3','v2'],['u3','v3']]);};
T.P.k4c=function(){return mk(['A','B','C','O'],[[320,35],[150,255],[490,255],[320,170]],[['A','B'],['B','C'],['C','A'],['A','O'],['B','O'],['C','O']]);};
T.P.c5=function(){var nm=['1','2','3','4','5'];return mk(nm,ring(5,320,150,115),[['1','2'],['2','3'],['3','4'],['4','5'],['5','1']]);};
T.P.c6=function(){var nm=['1','2','3','4','5','6'];return mk(nm,ring(6,320,150,115),[['1','2'],['2','3'],['3','4'],['4','5'],['5','6'],['6','1']]);};
T.P.exam=function(){var nm=['국어','수학','영어','과학','사회','음악','미술'];
  return mk(nm,[[110,70],[320,40],[530,70],[200,190],[440,190],[110,270],[530,270]],[['국어','수학'],['수학','영어'],['국어','과학'],['수학','과학'],['수학','사회'],['영어','사회'],['과학','사회'],['과학','음악'],['사회','미술'],['음악','미술'],['국어','음악']]);};

/* ── 도우미: 경로 찾기(트리), 색칠 최소 색 수, 해밀턴 사이클 세기, 교차 세기 ── */
function treePath(g,a,b){var A=T.adj(g),prev={},q=[a];prev[a]=-1;while(q.length){var x=q.shift();A[x].forEach(function(y){if(prev[y.to]==null){prev[y.to]={v:x,k:y.k};q.push(y.to);}});}
  var ks=[],v=b;while(v!==a&&prev[v]!=null&&prev[v]!==-1){ks.push(prev[v].k);v=prev[v].v;}return ks;}
function chrom(g){var n=g.names.length,A=T.adj(g);for(var k=1;k<=n;k++){var col=new Array(n).fill(-1);if(bt(0))return k;}return n;
  function bt(i){if(i===n)return true;for(var c=0;c<k;c++){if(A[i].every(function(y){return col[y.to]!==c;})){col[i]=c;if(bt(i+1))return true;col[i]=-1;}}return false;}}
T.chrom=function(key){return chrom(T.P[key]());};
function hamCount(g){var n=g.names.length,A=T.adj(g),vis=new Array(n).fill(false),cnt=0,tried=0;vis[0]=true;
  (function go(v,d){if(d===n){tried++;if(A[v].some(function(y){return y.to===0;}))cnt++;return;}A[v].forEach(function(y){if(!vis[y.to]){vis[y.to]=true;go(y.to,d+1);vis[y.to]=false;}});})(0,1);
  return {cycles:cnt/2,tried:tried};}
T.hamCount=function(key){return hamCount(T.P[key]()).cycles;};
function crossings(g){var c=0,list=[];function ccw(a,b,d){return (d[1]-a[1])*(b[0]-a[0])-(b[1]-a[1])*(d[0]-a[0]);}
  for(var i=0;i<g.edges.length;i++)for(var j=i+1;j<g.edges.length;j++){var e=g.edges[i],f=g.edges[j];if(e[0]===f[0]||e[0]===f[1]||e[1]===f[0]||e[1]===f[1])continue;
    var p1=g.pos[e[0]],p2=g.pos[e[1]],p3=g.pos[f[0]],p4=g.pos[f[1]];var d1=ccw(p3,p4,p1),d2=ccw(p3,p4,p2),d3=ccw(p1,p2,p3),d4=ccw(p1,p2,p4);
    if(((d1>0&&d2<0)||(d1<0&&d2>0))&&((d3>0&&d4<0)||(d3<0&&d4>0))){c++;list.push(i,j);}}return {n:c,list:list};}
function kruskal(g){var p=g.names.map(function(_,i){return i;});function f(x){while(p[x]!==x)x=p[x]=p[p[x]];return x;}
  var ks=g.edges.map(function(_,k){return k;}).sort(function(a,b){return g.edges[a][2]-g.edges[b][2]||a-b;}),pick=[],w=0;
  ks.forEach(function(k){var a=f(g.edges[k][0]),b=f(g.edges[k][1]);if(a!==b){p[a]=b;pick.push(k);w+=g.edges[k][2];}});return {pick:pick,w:w};}
T.mstWeight=function(key){return kruskal(T.P[key]()).w;};
T.oddCount=function(key){var g=T.P[key]();return g.names.filter(function(_,i){return T.deg(g,i)%2;}).length;};

/* ═══ 4-1 트리: 뿌리 정하기 · 두 점 사이 하나뿐인 길 ═══ */
W.tree=function(el,o){
  var g=T.P.tree(),root=0,mode='root',pick=[];
  var c=ctrl(el);radio(c,'점을 누르면:',[['root','그 점을 뿌리로'],['path','두 점 사이 길 보기']],'root',function(v){mode=v;pick=[];draw();});
  btn(c,'선 하나 더하기 (h–i)',function(){if(g.edges.length===9)g.edges.push([T.idx(g,'h'),T.idx(g,'i'),1]);draw();});btn(c,'처음으로',function(){g=T.P.tree();root=0;pick=[];draw();});
  var s=svg(el,640,290,'뿌리 있는 트리'),ou=out(el);
  function layout(){var A=T.adj(g),lv={},ch={},seen={};lv[root]=0;seen[root]=1;var q=[root],order=[];
    while(q.length){var x=q.shift();order.push(x);ch[x]=[];A[x].forEach(function(y){if(!seen[y.to]){seen[y.to]=1;lv[y.to]=lv[x]+1;ch[x].push(y.to);q.push(y.to);}});}
    var leafX=0,X={};(function dfs(v){if(!ch[v].length){X[v]=leafX++;return;}ch[v].forEach(dfs);X[v]=(X[ch[v][0]]+X[ch[v][ch[v].length-1]])/2;})(root);
    var mx=Math.max.apply(null,Object.keys(lv).map(function(k){return lv[k];}));
    g.names.forEach(function(_,i){g.pos[i]=[60+X[i]*(520/Math.max(1,leafX-1)),35+lv[i]*(220/Math.max(1,mx))];});return {lv:lv,ch:ch};}
  function draw(){var L=layout(),cyc=T.hasCycle(g.names.length,g.edges),pk=pick.length===2?treePath(g,pick[0],pick[1]):[];
    var role=function(i){if(i===root)return '뿌리';if(!L.ch[i]||!L.ch[i].length)return '잎';return '';};
    drawG(s,g,{nodeFill:function(i){return i===root?'#f8d7d6':pick.indexOf(i)>=0?'#fde7a8':(!L.ch[i]||!L.ch[i].length)?'#e7f5ec':T.P&&C.node;},below:role,
      edgeColor:function(k){return pk.indexOf(k)>=0?C.r:k>=9?C.a:C.acc;},edgeWidth:function(k){return pk.indexOf(k)>=0?5:3;},
      onNode:function(i){if(mode==='root'){root=i;}else{pick.push(i);if(pick.length>2)pick=[i];}draw();}});
    var n=g.names.length,leaves=g.names.filter(function(_,i){return !L.ch[i]||!L.ch[i].length;}).length;
    var h='<p>점 n = '+n+'개, 선 '+g.edges.length+'개 '+(g.edges.length===n-1?'<span class="g">= n − 1 ✓</span>':'<span class="r">≠ n − 1</span>')+' · 사이클 '+(cyc?'<span class="r">있음 → 더 이상 트리가 아니에요</span>':'<span class="g">없음</span>')+'</p>';
    h+='<p>뿌리: <b>'+g.names[root]+'</b> · 잎(자식 없는 점): <b>'+leaves+'개</b> · 깊이(뿌리에서 가장 먼 층): <b>'+Math.max.apply(null,Object.keys(L.lv).map(function(k){return L.lv[k];}))+'</b></p>';
    if(mode==='path')h+=pick.length===2?'<p class="a">'+g.names[pick[0]]+'에서 '+g.names[pick[1]]+'까지 길: 선 '+pk.length+'개'+(cyc?' (사이클이 생겨 다른 길도 생겼어요)':' — 트리에서는 이 길 하나뿐이에요')+'</p>':'<p class="note">점 두 개를 차례로 누르세요.</p>';
    ou.innerHTML=h;}
  draw();
};

/* ═══ 4-2 신장 트리: 선을 골라 모든 점 잇기, 공사비 최소로 ═══ */
W.span=function(el,o){
  var g=T.P.span(),on=g.edges.map(function(){return false;}),best=kruskal(g),showK=false;
  var c=ctrl(el);btn(c,'원자료 그림의 트리',function(){var want=['ad','bd','be','eg','fg','cf'];on=g.edges.map(function(e){var k=[g.names[e[0]],g.names[e[1]]].sort().join('');return want.indexOf(k)>=0;});showK=false;draw();});
  btn(c,'크루스칼: 싼 선부터',function(){on=g.edges.map(function(_,k){return best.pick.indexOf(k)>=0;});showK=true;draw();});btn(c,'모두 끄기',function(){on=on.map(function(){return false;});showK=false;draw();});
  H('p','note','선 위 숫자는 공사비(억 원, 예시값)예요. 선을 눌러 켜고 끄며 모든 마을을 잇는 가장 싼 방법을 찾아보세요.',el);
  var s=svg(el,640,295,'공사비가 적힌 마을 연결 그래프'),ou=out(el);
  function draw(){var pick=g.edges.filter(function(_,k){return on[k];}),cm=T.comps(g,on),cyc=T.hasCycle(g.names.length,pick),w=pick.reduce(function(a,e){return a+e[2];},0);
    drawG(s,g,{weights:true,edgeColor:function(k){return on[k]?C.r:C.rule;},edgeWidth:function(k){return on[k]?5:2.5;},onEdge:function(k){on[k]=!on[k];showK=false;draw();},nodeFill:function(i){return PAL[cm.lab[i]%PAL.length];},labelFill:function(){return '#fff';}});
    var span=cm.n===1&&!cyc;
    ou.innerHTML='<p>고른 선 <b>'+pick.length+'개</b> (점 7개 → 트리는 7 − 1 = 6개) · 덩어리 '+cm.n+'개 · 사이클 '+(cyc?'<span class="r">있음 (돈 낭비인 선이 있어요)</span>':'없음')+' · 공사비 합 <b>'+w+'억</b></p>'+
      (span?'<p class="'+(w===best.w?'g':'a')+'">신장 트리 완성! '+(w===best.w?'가장 싼 값('+best.w+'억)이에요.':'하지만 가장 싼 값은 '+best.w+'억이에요. '+(w-best.w)+'억을 더 쓰고 있어요.')+'</p>':'<p class="note">신장 트리 = 모든 점이 이어지고(덩어리 1개) 사이클이 없는 선 모음.</p>')+
      (showK?'<p class="note">크루스칼 방법: 싼 선부터 차례로 보고, 사이클을 만들지 않으면 고르고 만들면 건너뛰어요. 선이 6개 모이면 끝.</p>':'');}
  draw();
};

/* ═══ 5-1 오일러: 모든 선을 한 번씩 (한붓그리기) ═══ */
W.euler=function(el,o){
  var key=o.preset||'square',g=T.P[key](),used=[],cur=-1,trail=[];
  var c=ctrl(el);radio(c,'그림:',[['square','네모 (원자료)'],['house','집 모양'],['kb','쾨니히스베르크 다리']],key,function(v){key=v;g=T.P[v]();reset();});
  btn(c,'다시 그리기',function(){reset();});
  H('p','note','시작할 점을 누른 뒤, 이어진 점을 차례로 누르세요. 한 번 지난 선은 다시 못 지나요.',el);
  var s=svg(el,640,290,'한붓그리기 그래프'),ou=out(el);
  function reset(){used=g.edges.map(function(){return false;});cur=-1;trail=[];draw();}
  function draw(){var odd=g.names.filter(function(_,i){return T.deg(g,i)%2;}),left=used.filter(function(u){return !u;}).length;
    drawG(s,g,{nodeFill:function(i){return i===cur?'#fde7a8':T.deg(g,i)%2?'#f8d7d6':C.node;},below:function(i){return '차수 '+T.deg(g,i);},belowFill:function(i){return T.deg(g,i)%2?C.r:C.mu;},
      edgeColor:function(k){return used[k]?C.r:C.k;},edgeWidth:function(k){return used[k]?5:2.5;},edgeLabel:function(k){var p=trail.indexOf(k);return p>=0?String(p+1):'';},weights:trail.length>0,
      onNode:function(i){if(cur<0){cur=i;trail=[];draw();return;}var k=-1;g.edges.forEach(function(e,kk){if(k<0&&!used[kk]&&((e[0]===cur&&e[1]===i)||(e[1]===cur&&e[0]===i)))k=kk;});
        if(k<0){ou.innerHTML='<p class="r">'+g.names[cur]+'에서 '+g.names[i]+'로 가는, 아직 안 지난 선이 없어요.</p>'+ou.innerHTML;return;}used[k]=true;trail.push(k);cur=i;draw();}});
    var rule=odd.length===0?'<span class="g">홀수 차수 점 0개 → 어디서 시작해도 제자리로 돌아오는 한붓그리기(오일러 회로)가 있어요.</span>':odd.length===2?'<span class="a">홀수 차수 점 2개('+odd.map(function(i){return g.names[i];}).join(', ')+') → 한 점에서 시작해 다른 점에서 끝나는 한붓그리기(오일러 트레일)만 있어요.</span>':'<span class="r">홀수 차수 점 '+odd.length+'개 → 한붓그리기 불가능.</span>';
    ou.innerHTML='<p>남은 선: <b>'+left+'개</b> / '+g.edges.length+'개'+(left===0?' — <b class="g">완성!</b>':'')+'</p><p>규칙으로 미리 보기: '+rule+'</p>'+(cur<0?'<p class="note">시작할 점을 누르세요. 빨간 점은 차수가 홀수인 점이에요.</p>':'');}
  reset();
};

/* ═══ 5-2 해밀턴: 모든 점을 한 번씩 ═══ */
W.ham=function(el,o){
  var key=o.preset||'k5',g=T.P[key](),seq=[];
  var c=ctrl(el);radio(c,'그림:',[['k5','다섯 점 모두 연결 (원자료)'],['cube','정육면체'],['petersen','페테르센 그래프']],key,function(v){key=v;g=T.P[v]();seq=[];draw();});
  btn(c,'한 걸음 되돌리기',function(){seq.pop();draw();});btn(c,'지우기',function(){seq=[];draw();});
  var cb=btn(c,'컴퓨터가 모두 세어 보기',function(){var r=hamCount(g);extra='<p class="b">컴퓨터가 점 '+g.names[0]+'에서 출발하는 길을 '+r.tried.toLocaleString()+'개 끝까지 따라가 보고 찾은 해밀턴 사이클: <b>'+r.cycles+'개</b> (같은 고리를 거꾸로 돈 것은 하나로 셈).</p>';draw();});
  H('p','note','점을 차례로 눌러 모든 점을 한 번씩 지나고, 마지막에 시작 점을 눌러 돌아오세요.',el);
  var s=svg(el,640,300,'해밀턴 사이클 찾기 그래프'),ou=out(el),extra='';
  function ek(a,b){for(var k=0;k<g.edges.length;k++){var e=g.edges[k];if((e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a))return k;}return -1;}
  function draw(){var on={};for(var i=1;i<seq.length;i++)on[ek(seq[i-1],seq[i])]=i;var n=g.names.length,closed=seq.length===n+1&&seq[0]===seq[n];
    drawG(s,g,{r:18,nodeFill:function(i){return seq.length&&i===seq[seq.length-1]?'#fde7a8':seq.indexOf(i)>=0?'#d6ecff':C.node;},edgeColor:function(k){return on[k]?C.r:C.rule;},edgeWidth:function(k){return on[k]?5:2;},
      weights:seq.length>1,edgeLabel:function(k){return on[k]?String(on[k]):'';},
      onNode:function(i){if(seq.length&&ek(seq[seq.length-1],i)<0)return;if(seq.indexOf(i)>=0&&!(i===seq[0]&&seq.length===n))return;seq.push(i);draw();}});
    var fact=1;for(var j=2;j<n;j++)fact*=j;
    ou.innerHTML='<p>지난 점 '+(closed?n:new Set(seq).size)+' / '+n+'개 '+(closed?'<b class="g">— 해밀턴 사이클 완성!</b>':seq.length===n?'<span class="a">— 이제 시작 점으로 돌아갈 수 있나요?</span>':'')+'</p><p class="note">해밀턴 사이클은 「이 조건이면 된다」는 간단한 규칙이 알려져 있지 않아요. 점 '+n+'개면 고리 후보만 최대 '+(fact/2).toLocaleString()+'개 — 점이 늘면 순식간에 커져요.</p>'+extra;extra='';}
  draw();
};

/* ═══ 6-1 평면 그래프: 점을 끌어 선 교차 없애기 ═══ */
W.planar=function(el,o){
  var key=o.preset||'k4x',g=T.P[key]();
  var c=ctrl(el);radio(c,'그림:',[['k4x','네 점 모두 연결'],['wheel','원자료 평면 그림'],['k5','K₅'],['k33','K₃,₃']],key,function(v){key=v;g=T.P[v]();draw();});btn(c,'처음 자리로',function(){g=T.P[key]();draw();});
  H('p','note','점을 끌어서(키보드는 Tab으로 고르고 방향키) 선이 겹치는 곳을 없애 보세요. 빨간 선은 지금 다른 선과 엇갈린 선이에요.',el);
  var s=svg(el,640,300,'끌어서 옮길 수 있는 그래프'),ou=out(el);
  function draw(){var cr=crossings(g),V=g.names.length,Ed=g.edges.length,bip=key==='k33';
    drawG(s,g,{drag:draw,edgeColor:function(k){return cr.list.indexOf(k)>=0?C.r:C.k;},edgeWidth:function(k){return cr.list.indexOf(k)>=0?3.5:2.5;}});
    var lim=bip?2*V-4:3*V-6;
    ou.innerHTML='<p>점 V = '+V+', 선 E = '+Ed+' · 지금 엇갈림 <b>'+cr.n+'곳</b></p>'+
      (cr.n===0?'<p class="g">겹침 없이 그렸어요! 면(선으로 둘러싸인 방 + 바깥) F = '+(Ed-V+2)+' → V − E + F = '+V+' − '+Ed+' + '+(Ed-V+2)+' = 2 (오일러 공식)</p>':'')+
      '<p>미리 보는 검사: 평면 그래프면 선은 최대 '+(bip?'2V − 4':'3V − 6')+' = '+lim+'개 → '+(Ed<=lim?'<span class="g">'+Ed+' ≤ '+lim+', 검사 통과 (그래도 직접 그려 봐야 확실해요)</span>':'<span class="r">'+Ed+' > '+lim+'! 아무리 옮겨도 한 곳 이상 엇갈려요 (평면 그래프 아님)</span>')+'</p>';}
  draw();
};

/* ═══ 6-2 색칠: 이웃끼리 다른 색 ═══ */
W.color=function(el,o){
  var key=o.preset||'k4c',g=T.P[key](),col=[],COL=['#ffffff','#e5534b','#3b82f6','#f2c12e','#22a39f','#9b3fb5'];
  var c=ctrl(el);radio(c,'그림:',[['k4c','원자료 삼각형'],['c5','다섯 명 원탁'],['c6','여섯 명 원탁'],['exam','시험 시간표']],key,function(v){key=v;g=T.P[v]();col=g.names.map(function(){return 0;});draw();});
  btn(c,'자동: 차례로 칠하기',function(){var A=T.adj(g);col=g.names.map(function(){return 0;});g.names.forEach(function(_,i){var k=1;while(A[i].some(function(y){return col[y.to]===k;}))k++;col[i]=k;});draw();});
  btn(c,'지우기',function(){col=g.names.map(function(){return 0;});draw();});
  H('p','note','점을 누를 때마다 색이 바뀌어요(흰색 → 빨강 → 파랑 → 노랑 → 초록 → 보라). 선으로 이어진 두 점이 같은 색이면 선이 빨간 점선이 돼요.',el);
  var s=svg(el,640,300,'색칠 그래프'),ou=out(el);col=g.names.map(function(){return 0;});
  function draw(){var bad=g.edges.map(function(e){return col[e[0]]&&col[e[0]]===col[e[1]];}),used=new Set(col.filter(function(x){return x;})).size,all=col.every(function(x){return x;}),nb=bad.filter(Boolean).length,chi=chrom(g);
    drawG(s,g,{r:key==='exam'?26:22,nodeFill:function(i){return COL[col[i]];},onNode:function(i){col[i]=(col[i]+1)%COL.length;draw();},edgeColor:function(k){return bad[k]?C.r:C.k;},edgeDash:function(k){return bad[k];},edgeWidth:function(k){return bad[k]?4:2.5;}});
    ou.innerHTML='<p>쓴 색 <b>'+used+'가지</b> · 충돌(같은 색 이웃) <b>'+nb+'곳</b> · '+(all?'모두 칠함':'아직 안 칠한 점 '+col.filter(function(x){return !x;}).length+'개')+'</p>'+
      (all&&nb===0?'<p class="'+(used===chi?'g':'a')+'">올바른 색칠이에요! '+(used===chi?'이 그래프에 필요한 가장 적은 색 수(채색수) '+chi+'가지와 같아요.':'그런데 '+chi+'가지로도 돼요. 더 줄여 볼까요?')+'</p>':'')+
      (key==='exam'?'<p class="note">점 = 과목, 선 = 「두 과목을 다 듣는 학생이 있음」. 색 = 시험 시간대. 색 수가 곧 필요한 시간대 수예요.</p>':'');}
  draw();
};
})();
