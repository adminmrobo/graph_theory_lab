/* 위젯 모음 1: 공용 도우미 + 그래프 그리기 + 1~3장 (차수 · 그래프 종류 · 표현 · 메모리 · 걷기 · 연결 요소) + 데이터 시각화(차수 막대 · 행렬 열지도)
   외부 라이브러리 없음, 브라우저 저장소 사용 안 함 */
var W={},DUELS={};
(function(){
'use strict';
var NS='http://www.w3.org/2000/svg';
function E(tag,at,par){var e=document.createElementNS(NS,tag);for(var k in at)e.setAttribute(k,at[k]);if(par)par.appendChild(e);return e;}
function H(tag,cls,html,par){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(par)par.appendChild(e);return e;}
function svg(el,w,h,label){var s=E('svg',{viewBox:'0 0 '+w+' '+h,width:'100%',role:'img','aria-label':label||'설명 그림'});s.style.maxWidth=w+'px';s.style.touchAction='manipulation';el.appendChild(s);return s;}
function ctrl(el){return H('div','ctrl',null,el);}
function btn(par,label,on,pressed){var b=H('button','bt',label,par);b.type='button';if(pressed!=null)b.setAttribute('aria-pressed',pressed?'true':'false');b.onclick=function(){on(b);};return b;}
function radio(par,label,opts,cur,on){H('span','glabel',label,par);var bs=opts.map(function(o){return btn(par,o[1],function(b){bs.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});on(o[0]);},o[0]===cur);});return bs;}
function slider(par,label,min,max,step,val,on){H('span','glabel',label,par);var r=H('input',null,null,par);r.type='range';r.min=min;r.max=max;r.step=step;r.value=val;r.setAttribute('aria-label',label);var v=H('span','val','',par);function u(){v.textContent=on(+r.value)||'';}r.oninput=u;Promise.resolve().then(u);return r;}
function out(el){var o=H('div','insight',null,el);o.setAttribute('aria-live','polite');return o;}
function tx(s,x,y,t,at){var e=E('text',Object.assign({x:x,y:y,'font-size':14,fill:'#16212b','font-family':'inherit'},at||{}),s);e.textContent=t;return e;}
var C={g:'#13733a',m:'#9b3fb5',r:'#c9302c',a:'#a35c00',b:'#1e55c8',k:'#16212b',mu:'#5b6874',rule:'#c9d1da',acc:'#0f7c7a',node:'#dff3f2',soft:'#eef2f6'};
var PAL=['#0f7c7a','#c9302c','#1e55c8','#a35c00','#9b3fb5','#13733a','#5b6874','#d6336c'];

/* ── 그래프 자료: 이름, 자리, 선 [i, j, 무게] ── */
function G(names,pos,edges,dir){return {names:names,pos:pos,edges:edges.map(function(e){return e.slice();}),dir:!!dir};}
function clone(g){return G(g.names.slice(),g.pos.map(function(p){return p.slice();}),g.edges,g.dir);}
function idx(g,nm){return g.names.indexOf(nm);}
function mk(names,pos,list,dir){var g=G(names,pos,[],dir);list.forEach(function(e){g.edges.push([names.indexOf(e[0]),names.indexOf(e[1]),e[2]==null?1:e[2]]);});return g;}
var P={
  src0:function(){return mk(['a','b','c','d','e'],[[320,40],[175,105],[465,105],[195,225],[445,225]],[['a','b'],['a','c'],['b','d'],['b','e'],['c','e'],['d','e']]);},
  diamond:function(){return mk(['A','B','C','D'],[[320,40],[190,135],[450,135],[320,230]],[['A','B'],['A','C'],['B','D'],['C','D']]);},
  dirdia:function(){return mk(['A','B','C','D'],[[320,40],[190,135],[450,135],[320,230]],[['A','B'],['A','D'],['A','C'],['B','D'],['C','D']],true);},
  wdia:function(){return mk(['A','B','C','D'],[[320,40],[190,135],[450,135],[320,230]],[['A','B',3],['A','C',5],['B','C',1],['B','D',2],['C','D',4]]);},
  rep:function(){return mk(['A','B','C','D'],[[170,60],[400,60],[270,200],[480,200]],[['A','B'],['A','C'],['B','C'],['C','D']]);},
  walk:function(){return mk(['s','a','b','c','d','t'],[[70,140],[210,55],[420,55],[210,225],[420,225],[560,140]],[['s','a'],['a','b'],['b','t'],['a','c'],['c','d'],['d','b']]);},
  comp:function(){return mk(['1','2','3','4','5','6','7','8'],[[90,60],[250,60],[170,190],[330,135],[440,60],[560,60],[440,215],[560,215]],[['1','2'],['1','3'],['2','3'],['3','4'],['4','5'],['5','6'],['4','7'],['7','8'],['6','8']]);},
  friends:function(){var nm=['지민','서준','하은','도윤','민서','예준','수아','시우','지아','주원','채원','건우'];
    var pos=[[80,60],[200,40],[150,150],[60,200],[230,210],[330,130],[440,60],[560,50],[600,160],[480,170],[400,240],[540,250]];
    return mk(nm,pos,[['지민','서준'],['지민','하은'],['지민','도윤'],['서준','하은'],['하은','도윤'],['하은','민서'],['도윤','민서'],['서준','예준'],['하은','예준'],['예준','수아'],['수아','시우'],['수아','주원'],['시우','지아'],['시우','주원'],['지아','주원'],['주원','채원'],['주원','건우'],['채원','건우'],['지아','건우']]);}
};
function adj(g){var A=g.names.map(function(){return [];});g.edges.forEach(function(e,k){A[e[0]].push({to:e[1],k:k,w:e[2]});if(!g.dir)A[e[1]].push({to:e[0],k:k,w:e[2]});});return A;}
function deg(g,i){var d=0;g.edges.forEach(function(e){if(e[0]===i)d++;if(e[1]===i)d++;});return d;}
function comps(g,on){var n=g.names.length,lab=new Array(n).fill(-1),c=0,A=g.names.map(function(){return [];});
  g.edges.forEach(function(e,k){if(on&&!on[k])return;A[e[0]].push(e[1]);A[e[1]].push(e[0]);});
  for(var i=0;i<n;i++){if(lab[i]>=0)continue;var q=[i];lab[i]=c;while(q.length){var x=q.pop();A[x].forEach(function(y){if(lab[y]<0){lab[y]=c;q.push(y);}});}c++;}
  return {n:c,lab:lab};}
function hasCycle(n,edges){var p=[];for(var i=0;i<n;i++)p[i]=i;function f(x){while(p[x]!==x)x=p[x]=p[p[x]];return x;}
  for(var k=0;k<edges.length;k++){var a=f(edges[k][0]),b=f(edges[k][1]);if(a===b)return true;p[a]=b;}return false;}
function matrix(g){var n=g.names.length,M=[];for(var i=0;i<n;i++){M.push(new Array(n).fill(0));}g.edges.forEach(function(e){M[e[0]][e[1]]+=1;if(!g.dir)M[e[1]][e[0]]+=1;});return M;}

/* ── 그래프 그리기: o = {r, nodeFill(i), nodeStroke(i), nodeLabel(i), below(i), edgeColor(k), edgeWidth(k), edgeDash(k), edgeOp(k), weights, onNode(i), onEdge(k), drag} ── */
function drawG(s,g,o){
  o=o||{};var r=o.r||20;s.innerHTML='';
  var pairCount={},pairSeen={};g.edges.forEach(function(e){var key=Math.min(e[0],e[1])+'-'+Math.max(e[0],e[1]);pairCount[key]=(pairCount[key]||0)+1;});
  var eg=E('g',{},s),ng=E('g',{},s);
  g.edges.forEach(function(e,k){
    var A=g.pos[e[0]],B=g.pos[e[1]],key=Math.min(e[0],e[1])+'-'+Math.max(e[0],e[1]),cnt=pairCount[key],nth=(pairSeen[key]=(pairSeen[key]||0)+1)-1;
    var dx=B[0]-A[0],dy=B[1]-A[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;
    var off=cnt>1?(nth-(cnt-1)/2)*44:0;if(cnt>1&&e[0]>e[1])off=-off;
    var mx=(A[0]+B[0])/2+nx*off,my=(A[1]+B[1])/2+ny*off;
    var col=o.edgeColor?o.edgeColor(k):C.k,wd=o.edgeWidth?o.edgeWidth(k):2.5,op=o.edgeOp?o.edgeOp(k):1;
    var d='M'+A[0]+' '+A[1]+' Q'+(2*mx-(A[0]+B[0])/2)+' '+(2*my-(A[1]+B[1])/2)+' '+B[0]+' '+B[1];
    var at={d:d,fill:'none',stroke:col,'stroke-width':wd,opacity:op,'stroke-linecap':'round'};if(o.edgeDash&&o.edgeDash(k))at['stroke-dasharray']='6 6';
    E('path',at,eg);
    if(g.dir){var t=0.5,qx=2*mx-(A[0]+B[0])/2,qy=2*my-(A[1]+B[1])/2;
      /* 끝점 근처의 화살촉: 곡선 위 t=0.5보다 끝쪽 */
      var tt=1-(r+4)/L;if(tt<0.5)tt=0.5;var px=(1-tt)*(1-tt)*A[0]+2*(1-tt)*tt*qx+tt*tt*B[0],py=(1-tt)*(1-tt)*A[1]+2*(1-tt)*tt*qy+tt*tt*B[1];
      var tx2=2*(1-tt)*(qx-A[0])+2*tt*(B[0]-qx),ty2=2*(1-tt)*(qy-A[1])+2*tt*(B[1]-qy),tl=Math.hypot(tx2,ty2)||1;tx2/=tl;ty2/=tl;
      E('polygon',{points:[px,py,px-tx2*13-ty2*6,py-ty2*13+tx2*6,px-tx2*13+ty2*6,py-ty2*13-tx2*6].join(' '),fill:col,opacity:op},eg);}
    var lab=o.weights?(o.edgeLabel?o.edgeLabel(k):String(e[2])):'';if(lab!==''){var wx=mx,wy=my,tw=lab.length*8+10;E('rect',{x:wx-tw/2,y:wy-11,width:tw,height:20,rx:5,fill:'#fff',stroke:o.edgeColor?o.edgeColor(k):C.rule,'stroke-width':1},eg);tx(eg,wx-tw/2+5,wy+4,lab,{'font-size':13,fill:col,'font-weight':700});}
    if(o.onEdge){var hit=E('path',{d:d,fill:'none',stroke:'transparent','stroke-width':22,tabindex:0,role:'button','aria-label':'선 '+g.names[e[0]]+'–'+g.names[e[1]]},eg);hit.style.cursor='pointer';
      hit.addEventListener('click',function(){o.onEdge(k);});hit.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();o.onEdge(k);}});}
  });
  g.names.forEach(function(nm,i){var p=g.pos[i];
    var gg=E('g',{'class':'gnode',tabindex:o.onNode||o.drag?0:-1,role:o.onNode?'button':'img','aria-label':'점 '+nm+(o.below?' · '+o.below(i):'')},ng);
    E('circle',{cx:p[0],cy:p[1],r:r,fill:o.nodeFill?o.nodeFill(i):C.node,stroke:o.nodeStroke?o.nodeStroke(i):C.k,'stroke-width':o.nodeSW?o.nodeSW(i):2.5},gg);
    var lb=o.nodeLabel?o.nodeLabel(i):nm;var fs=lb.length>2?12:15;
    tx(gg,p[0]-lb.length*fs*0.33,p[1]+5,lb,{'font-size':fs,'font-weight':700,fill:o.labelFill?o.labelFill(i):C.k});
    if(o.below){var bl=o.below(i);if(bl)tx(gg,p[0]-bl.length*3.6,(o.above&&o.above(i))?p[1]-r-8:p[1]+r+17,bl,{'font-size':12,fill:o.belowFill?o.belowFill(i):C.mu,'font-weight':700});}
    if(o.onNode){gg.addEventListener('click',function(){if(gg.__dragged){gg.__dragged=false;return;}o.onNode(i);});gg.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();o.onNode(i);}});}
    if(o.drag){gg.style.cursor='grab';gg.addEventListener('pointerdown',function(ev){ev.preventDefault();var sv=s,rr=sv.getBoundingClientRect(),vb=sv.viewBox.baseVal;
      function mv(e2){var x=(e2.clientX-rr.left)*vb.width/rr.width,y=(e2.clientY-rr.top)*vb.height/rr.height;g.pos[i]=[Math.max(r,Math.min(vb.width-r,x)),Math.max(r,Math.min(vb.height-r,y))];gg.__dragged=true;o.drag();}
      function up(){removeEventListener('pointermove',mv);removeEventListener('pointerup',up);}
      addEventListener('pointermove',mv);addEventListener('pointerup',up);});
      gg.addEventListener('keydown',function(ev){var st={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]}[ev.key];if(!st)return;ev.preventDefault();g.pos[i]=[g.pos[i][0]+st[0],g.pos[i][1]+st[1]];o.drag();var f=s.querySelectorAll('.gnode')[i];if(f)f.focus();});}
  });
}
/* 고윳값: 대칭 행렬 야코비 회전 (작은 그래프용) */
function eig(M){var n=M.length,A=M.map(function(r){return r.slice();}),V=[];for(var i=0;i<n;i++){V.push(new Array(n).fill(0));V[i][i]=1;}
  for(var sweep=0;sweep<100;sweep++){var off=0;for(var p=0;p<n;p++)for(var q=p+1;q<n;q++)off+=A[p][q]*A[p][q];if(off<1e-20)break;
    for(p=0;p<n;p++)for(q=p+1;q<n;q++){if(Math.abs(A[p][q])<1e-14)continue;var th=(A[q][q]-A[p][p])/(2*A[p][q]),t=(th>=0?1:-1)/(Math.abs(th)+Math.sqrt(th*th+1)),c=1/Math.sqrt(t*t+1),sn=t*c;
      for(var k=0;k<n;k++){var akp=A[k][p],akq=A[k][q];A[k][p]=c*akp-sn*akq;A[k][q]=sn*akp+c*akq;}
      for(k=0;k<n;k++){var apk=A[p][k],aqk=A[q][k];A[p][k]=c*apk-sn*aqk;A[q][k]=sn*apk+c*aqk;}
      for(k=0;k<n;k++){var vkp=V[k][p],vkq=V[k][q];V[k][p]=c*vkp-sn*vkq;V[k][q]=sn*vkp+c*vkq;}}}
  var ev=[];for(i=0;i<n;i++)ev.push({v:Math.abs(A[i][i])<1e-9?0:A[i][i],vec:V.map(function(r){return r[i];})});ev.sort(function(a,b){return a.v-b.v;});return ev;}
function r2(x){return Math.round(x*100)/100;}
function fmt(x){var v=r2(x);return (Object.is(v,-0)?0:v).toString().replace('-','−');}

window.WU={E:E,H:H,svg:svg,ctrl:ctrl,btn:btn,radio:radio,slider:slider,out:out,tx:tx};
window.GT={G:G,mk:mk,clone:clone,P:P,adj:adj,deg:deg,comps:comps,hasCycle:hasCycle,matrix:matrix,drawG:drawG,eig:eig,fmt:fmt,r2:r2,PAL:PAL,idx:idx};
window.WC=C;

/* ═══ 1-1 차수와 악수 정리: 두 점을 차례로 눌러 선 잇기·끊기 ═══ */
W.degree=function(el,o){
  var key=o.preset||'diamond',g=P[key](),sel=-1;
  var c=ctrl(el);radio(c,'시작 그림:',[['diamond','마름모 (원자료 1장)'],['src0','다섯 점 (원자료 표지)'],['friends','반 친구 12명']],key,function(v){key=v;g=P[v]();sel=-1;draw();});
  btn(c,'선 모두 지우기',function(){g.edges=[];sel=-1;draw();});
  H('p','note','점 하나를 누르고 다른 점을 누르면 선이 생기고, 이미 있으면 지워져요. 점 아래 숫자가 그 점의 차수(이어진 선 수)예요.',el);
  var s=svg(el,640,270,'점과 선 그림, 점 아래에 차수 표시'),ou=out(el);
  function toggle(i,j){var k=-1;g.edges.forEach(function(e,kk){if((e[0]===i&&e[1]===j)||(e[0]===j&&e[1]===i))k=kk;});if(k>=0)g.edges.splice(k,1);else g.edges.push([i,j,1]);}
  function draw(){var big=g.names.length>6;
    drawG(s,g,{r:big?17:20,nodeFill:function(i){return i===sel?'#fde7a8':C.node;},below:function(i){return '차수 '+deg(g,i);},
      onNode:function(i){if(sel<0){sel=i;}else if(sel===i){sel=-1;}else{toggle(sel,i);sel=-1;}draw();}});
    var ds=g.names.map(function(_,i){return deg(g,i);}),sum=ds.reduce(function(a,b){return a+b;},0),odd=ds.filter(function(d){return d%2;}).length;
    ou.innerHTML='<p>차수 '+ds.join(' + ')+' = <b>'+sum+'</b> · 선 수 |E| = '+g.edges.length+' → 2 × '+g.edges.length+' = <b>'+(2*g.edges.length)+'</b> '+(sum===2*g.edges.length?'<span class="g">✓ 언제나 같아요</span>':'')+'</p>'+
      '<p>차수가 홀수인 점: <b>'+odd+'개</b> <span class="note">(선 하나는 양쪽 끝 두 점의 차수를 1씩 올려요. 그래서 합은 늘 짝수이고, 홀수 차수인 점의 수도 늘 짝수예요.)</span></p>'+
      (sel>=0?'<p class="a">점 '+g.names[sel]+'을 골랐어요. 이을 다른 점을 누르세요.</p>':'');}
  draw();
};

/* ═══ 1-2 세 종류 그래프: 방향 없음 / 방향 있음 / 무게 있음 ═══ */
W.kinds=function(el,o){
  var kind=o.kind||'u',sel=1;
  var c=ctrl(el);radio(c,'그래프 종류:',[['u','방향 없음'],['d','방향 있음'],['w','무게 있음']],kind,function(v){kind=v;draw();});
  H('p','note','점을 누르면 그 점에 붙은 선이 빨갛게 보이고, 차수를 종류별로 세어 줘요.',el);
  var s=svg(el,640,270,'세 종류 그래프'),ou=out(el);
  function draw(){var g=kind==='u'?P.diamond():kind==='d'?P.dirdia():P.wdia();
    var inc=function(k){return g.edges[k][0]===sel||g.edges[k][1]===sel;};
    drawG(s,g,{weights:kind==='w',nodeFill:function(i){return i===sel?'#f8d7d6':C.node;},edgeColor:function(k){return inc(k)?C.r:C.k;},edgeWidth:function(k){return inc(k)?4:2.5;},onNode:function(i){sel=i;draw();}});
    var nm=g.names[sel],d=deg(g,sel),h='';
    if(kind==='u')h='<p>점 '+nm+'의 차수 deg('+nm+') = <b>'+d+'</b> — 붙은 선을 그냥 셉니다.</p><p class="note">친구 관계처럼 「서로」인 관계예요.</p>';
    if(kind==='d'){var ins=g.edges.filter(function(e){return e[1]===sel;}).length,outs=g.edges.filter(function(e){return e[0]===sel;}).length;
      h='<p>점 '+nm+': 들어오는 화살표 <b>'+ins+'개</b>(들어오는 차수), 나가는 화살표 <b>'+outs+'개</b>(나가는 차수) → 합 '+d+'</p><p class="note">팔로우처럼 「한쪽만」인 관계예요. 내가 따라가도 상대가 나를 따라오지 않을 수 있어요.</p>';}
    if(kind==='w'){var ws=g.edges.filter(function(e){return e[0]===sel||e[1]===sel;}).map(function(e){return e[2];}),sw=ws.reduce(function(a,b){return a+b;},0);
      h='<p>점 '+nm+': 붙은 선 <b>'+d+'개</b>(차수) · 선에 적힌 무게 합 '+ws.join(' + ')+' = <b>'+sw+'</b>(가중 차수)</p><p class="note">원자료의 deg(B) = 3은 「선 개수」예요. 무게(거리·비용)를 더한 값은 따로 「가중 차수」라고 불러요.</p>';}
    ou.innerHTML=h;}
  draw();
};

/* ═══ 데이터 시각화: 차수 막대그래프 (조별발표용) ═══ */
W.degbar=function(el,o){
  var g=P[o.preset||'friends'](),hi=-1;
  var two=H('div','gviews',null,el);two.style.gridTemplateColumns='minmax(0,1.4fr) minmax(0,1fr)';
  var a=H('div',null,'<h4>관계 그림 (점 테두리가 두꺼울수록 친구가 많음)</h4>',two),b=H('div',null,'<h4>친구 수별 사람 수 (막대를 눌러 보세요)</h4>',two);
  var s1=svg(a,640,290,'반 친구 12명의 친구 관계 그림'),s2=svg(b,320,240,'친구 수별 사람 수 막대그래프'),ou=out(el);
  var ds=g.names.map(function(_,i){return deg(g,i);}),mx=Math.max.apply(null,ds);
  function draw(){
    drawG(s1,g,{r:16,nodeLabel:function(i){return g.names[i];},nodeFill:function(i){return ds[i]===hi?'#fde7a8':C.node;},nodeSW:function(i){return 1.5+ds[i];}});
    s2.innerHTML='';var cnt=[];for(var d=0;d<=mx;d++)cnt.push(ds.filter(function(x){return x===d;}).length);
    var bw=240/(mx+1);E('line',{x1:40,y1:200,x2:300,y2:200,stroke:C.mu},s2);
    cnt.forEach(function(v,d){var h=v*34,x=46+d*bw;var r=E('rect',{x:x,y:200-h,width:bw-8,height:h,fill:d===hi?C.a:C.acc,tabindex:0,role:'button','aria-label':'친구 '+d+'명인 사람 '+v+'명'},s2);r.style.cursor='pointer';
      r.addEventListener('click',function(){hi=hi===d?-1:d;draw();});r.addEventListener('keydown',function(e){if(e.key==='Enter'){hi=hi===d?-1:d;draw();}});
      tx(s2,x+bw/2-8,218,String(d),{'font-size':13});if(v)tx(s2,x+bw/2-7,195-h,String(v),{'font-size':13,'font-weight':700});});
    tx(s2,120,236,'친구 수(차수)',{'font-size':12,fill:C.mu});tx(s2,0,20,'사람 수',{'font-size':12,fill:C.mu});
    var sum=ds.reduce(function(x,y){return x+y;},0);
    ou.innerHTML='<p>12명의 친구 수를 모두 더하면 <b>'+sum+'</b>, 친구 관계(선)는 <b>'+g.edges.length+'개</b> — 정확히 두 배예요.</p>'+(hi>=0?'<p class="a">친구 '+hi+'명인 사람: '+g.names.filter(function(_,i){return ds[i]===hi;}).join(', ')+'</p>':'<p class="note">가장 친구가 많은 사람은 '+g.names.filter(function(_,i){return ds[i]===mx;}).join(', ')+' ('+mx+'명).</p>');}
  draw();
};

/* ═══ 2-1 같은 구조, 네 가지 모양: 그림 · 인접 리스트 · 인접 행렬 · 선 목록 ═══ */
W.reps=function(el,o){
  var g=P.rep(),sel=-1,dir=false;
  var c=ctrl(el);radio(c,'관계:',[[false,'방향 없음 (친구)'],[true,'방향 있음 (팔로우)']],false,function(v){dir=v;g.dir=v;draw();});btn(c,'처음으로',function(){g=P.rep();g.dir=dir;sel=-1;draw();});
  H('p','note','그림에서 두 점을 차례로 누르거나, 표의 0/1 자리를 눌러 보세요. 나머지 세 모양이 함께 바뀌어요.',el);
  var s=svg(el,640,260,'점 네 개의 그래프'),v=H('div','gviews',null,el),ou=out(el);
  function has(i,j){for(var k=0;k<g.edges.length;k++){var e=g.edges[k];if((e[0]===i&&e[1]===j)||(!dir&&e[0]===j&&e[1]===i))return k;}return -1;}
  function toggle(i,j){if(i===j)return;var k=has(i,j);if(k>=0)g.edges.splice(k,1);else g.edges.push([i,j,1]);}
  function draw(){drawG(s,g,{nodeFill:function(i){return i===sel?'#fde7a8':C.node;},onNode:function(i){if(sel<0)sel=i;else{toggle(sel,i);sel=-1;}draw();}});
    var M=matrix(g),n=g.names.length,A=adj(g);v.innerHTML='';
    var l=H('div',null,'<h4>인접 리스트 (사람마다 친구 목록)</h4>',v);l.innerHTML+=g.names.map(function(nm,i){return '<div><b>'+nm+'</b>: '+(A[i].map(function(x){return g.names[x.to];}).sort().join(', ')||'—')+'</div>';}).join('');
    var m=H('div',null,'<h4>인접 행렬 (0/1 표)</h4>',v),t=H('table','mtx',null,m);
    var hr='<tr><th></th>'+g.names.map(function(x){return '<th>'+x+'</th>';}).join('')+'</tr>';t.innerHTML=hr;
    for(var i=0;i<n;i++){var tr=H('tr',null,'<th>'+g.names[i]+'</th>',t);for(var j=0;j<n;j++){(function(i,j){var td=H('td',(M[i][j]?'on ':'')+(i!==j?'btn':''),String(M[i][j]),tr);if(i!==j){td.tabIndex=0;td.setAttribute('role','button');td.setAttribute('aria-label',g.names[i]+'에서 '+g.names[j]+' 자리 '+M[i][j]);td.onclick=function(){toggle(i,j);draw();};td.onkeydown=function(e){if(e.key==='Enter'){toggle(i,j);draw();}};}})(i,j);}}
    var e=H('div',null,'<h4>선 목록 (CSV 한 줄 = 선 하나)</h4>',v);e.innerHTML+='<div style="font-family:monospace">from,to<br>'+g.edges.map(function(x){return g.names[x[0]]+','+g.names[x[1]];}).join('<br>')+'</div>';
    var sym=true;for(i=0;i<n;i++)for(j=0;j<n;j++)if(M[i][j]!==M[j][i])sym=false;
    var ones=M.reduce(function(a,r){return a+r.reduce(function(x,y){return x+y;},0);},0);
    ou.innerHTML='<p>행렬의 1 개수 <b>'+ones+'</b> · 선 목록 줄 수 <b>'+g.edges.length+'</b> → '+(dir?'방향이 있으면 1 하나가 선 하나예요.':'방향이 없으면 선 하나가 자리 두 곳(A→B, B→A)에 1로 적혀서 1의 개수 = 2 × 선 수.')+'</p><p>행렬이 대각선을 기준으로 '+(sym?'<span class="g">좌우 대칭이에요</span>':'<span class="a">대칭이 아니에요 (한쪽만 팔로우한 관계가 있음)</span>')+'.</p>'+(sel>=0?'<p class="a">점 '+g.names[sel]+' 선택 — 이을 점을 누르세요.</p>':'');}
  draw();
};

/* ═══ 2-2 저장 공간 비교: 행렬 n×n 자리 vs 리스트 2|E|자리 ═══ */
W.memory=function(el,o){
  var st={n:o.n||1000,k:o.k||10};
  var c=ctrl(el);var ns=[10,100,1000,10000,100000,1000000];
  slider(c,'사람 수',0,5,1,ns.indexOf(st.n),function(v){st.n=ns[v];draw();return st.n.toLocaleString()+'명';});
  var c2=ctrl(el);slider(c2,'한 사람당 평균 친구 수',1,50,1,st.k,function(v){st.k=v;draw();return v+'명';});
  var s=svg(el,640,200,'저장 자리 수 비교 막대그래프 (로그 눈금)'),ou=out(el);
  function lg(x){return Math.log10(Math.max(1,x));}
  function draw(){var n=st.n,k=Math.min(st.k,n-1),E2=n*k/2,mat=n*n,lst=n*k,el2=E2;
    s.innerHTML='';var rows=[['인접 행렬 (n × n 자리)',mat,C.r],['인접 리스트 (친구 이름 자리)',lst,C.b],['선 목록 (줄 수)',el2,C.g]],mx=13;
    rows.forEach(function(r,i){var y=30+i*55,w=lg(r[1])/mx*400;E('rect',{x:210,y:y,width:Math.max(2,w),height:30,fill:r[2]},s);tx(s,0,y+20,r[0],{'font-size':13});tx(s,216+w,y+20,Math.round(r[1]).toLocaleString()+'자리',{'font-size':13,'font-weight':700,fill:r[2]});});
    tx(s,210,192,'막대 길이는 자릿수(10배마다 한 눈금)로 그렸어요.',{'font-size':11,fill:C.mu});
    var dens=k/(n-1)*100;
    ou.innerHTML='<p>사람 '+n.toLocaleString()+'명, 평균 친구 '+k+'명 → 친구 관계(선) '+Math.round(E2).toLocaleString()+'개.</p><p>행렬 자리 중 1인 자리의 비율: <b>'+(dens<0.01?dens.toExponential(1):dens.toFixed(dens<1?3:1))+'%</b> — '+(dens<5?'<span class="a">거의 전부 0이에요. 0을 저장하는 데 자리를 낭비하므로 리스트가 유리해요.</span>':'<span class="g">1이 꽤 많아서 행렬도 충분히 쓸 만해요.</span>')+'</p>';}
  draw();
};

/* ═══ 데이터 시각화: 인접 행렬 열지도 — 순서를 바꾸면 무리가 보인다 ═══ */
W.heat=function(el,o){
  var g=P.friends(),order='name',n=g.names.length;
  var c=ctrl(el);radio(c,'줄 순서:',[['name','가나다순'],['comm','무리끼리 모아서']],'name',function(v){order=v;draw();});
  var s=svg(el,640,330,'반 친구 12명 인접 행렬 열지도'),ou=out(el);
  var cm=comps(g,g.edges.map(function(e){var a=g.names[e[0]],b=g.names[e[1]];return !(a==='하은'&&b==='예준')&&!(a==='서준'&&b==='예준');}));
  function draw(){var M=matrix(g),idx=g.names.map(function(_,i){return i;});
    if(order==='name')idx.sort(function(a,b){return g.names[a].localeCompare(g.names[b],'ko');});else idx.sort(function(a,b){return cm.lab[a]-cm.lab[b]||a-b;});
    s.innerHTML='';var cs=22,x0=70,y0=60;
    idx.forEach(function(i,r){tx(s,4,y0+r*cs+16,g.names[i],{'font-size':12});var t=tx(s,x0+r*cs+4,y0-8,g.names[i],{'font-size':11});t.setAttribute('transform','rotate(-60 '+(x0+r*cs+8)+' '+(y0-8)+')');
      idx.forEach(function(j,cc){var v=M[i][j];E('rect',{x:x0+cc*cs,y:y0+r*cs,width:cs-2,height:cs-2,fill:v?(order==='comm'?PAL[cm.lab[i]===cm.lab[j]?cm.lab[i]:6]:C.acc):'#f1f4f7'},s);});});
    tx(s,x0+n*cs+20,y0+20,'칠한 자리 = 친구 관계',{'font-size':12,fill:C.mu});tx(s,x0+n*cs+20,y0+40,'빈 자리 = 관계 없음',{'font-size':12,fill:C.mu});
    ou.innerHTML=order==='name'?'<p>가나다순으로 줄을 세우면 칠한 자리가 흩어져서 무리가 잘 안 보여요.</p>':'<p class="g">같은 무리끼리 줄을 모으면 대각선 위에 네모 덩어리 <b>'+cm.n+'개</b>가 나타나요. 덩어리 밖의 자리(회색)은 무리를 잇는 몇 안 되는 다리예요.</p><p class="note">데이터는 그대로이고 순서만 바꿨어요. 시각화는 「무엇을 어떤 순서로 보여 주나」가 절반이에요.</p>';}
  draw();
};

/* ═══ 3-1 걷기 · 트레일 · 경로 · 사이클 판별기 ═══ */
W.walk=function(el,o){
  var g=P.walk(),seq=[];
  var c=ctrl(el);H('span','glabel','예시:',c);
  [['s a b t','경로'],['s a c d b a','트레일'],['a b d c a b','걷기'],['a c d b a','사이클']].forEach(function(x){btn(c,x[1]+' 예',function(){seq=x[0].split(' ').map(function(nm){return idx(g,nm);});draw();});});
  btn(c,'한 걸음 되돌리기',function(){seq.pop();draw();});btn(c,'지우기',function(){seq=[];draw();});
  H('p','note','점을 차례로 눌러 길을 만들어 보세요. 선으로 이어진 점만 다음 점이 될 수 있어요.',el);
  var s=svg(el,640,280,'걷기 실험 그래프'),ou=out(el);
  var A=adj(g);
  function ek(a,b){for(var k=0;k<g.edges.length;k++){var e=g.edges[k];if((e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a))return k;}return -1;}
  function draw(){var used={},rep=false;for(var i=1;i<seq.length;i++){var k=ek(seq[i-1],seq[i]);if(used[k])rep=true;used[k]=(used[k]||0)+1;}
    var vs={},vrep=false;seq.forEach(function(v,i){if(vs[v]!=null&&!(i===seq.length-1&&v===seq[0]&&seq.length>3))vrep=true;vs[v]=i;});
    var closed=seq.length>3&&seq[0]===seq[seq.length-1];
    drawG(s,g,{nodeFill:function(i){return seq.length&&i===seq[seq.length-1]?'#fde7a8':seq.indexOf(i)>=0?'#d6ecff':C.node;},below:function(i){var p=[];seq.forEach(function(v,j){if(v===i)p.push(j+1);});return p.length?p.join('·')+'번째':'';},
      edgeColor:function(k){return used[k]>1?C.r:used[k]?C.b:C.k;},edgeWidth:function(k){return used[k]?5:2.5;},
      onNode:function(i){if(!seq.length||ek(seq[seq.length-1],i)>=0){seq.push(i);draw();}else{ou.innerHTML='<p class="r">'+g.names[seq[seq.length-1]]+'에서 '+g.names[i]+'로 바로 가는 선이 없어요.</p>'+ou.innerHTML;}}});
    var kind=seq.length<2?'':(!rep&&!vrep&&closed&&seq.length>=4)?'사이클 (같은 점으로 돌아오고, 선도 점도 겹치지 않음)':(!vrep&&!rep&&!closed)?'경로 (점이 하나도 겹치지 않음)':(!rep)?'트레일 (선은 겹치지 않지만 점은 다시 지나감)':'걷기 (같은 선을 다시 지나감)';
    ou.innerHTML='<p>지금 길: <b>'+(seq.map(function(v){return g.names[v];}).join(' → ')||'—')+'</b></p>'+(kind?'<p class="'+(kind[0]==='걷'?'a':'g')+'">판정: <b>'+kind+'</b></p>':'<p class="note">점을 두 개 이상 누르면 판정이 나와요.</p>')+
      '<p class="note">빨간 선 = 두 번 이상 지난 선. 걷기 ⊃ 트레일 ⊃ 경로 — 조건이 하나씩 더 엄격해져요.</p>';}
  draw();
};

/* ═══ 3-2 연결 요소: 선을 끊고 이으며 덩어리 세기 ═══ */
W.comp=function(el,o){
  var g=P.comp(),on=g.edges.map(function(){return true;}),showB=false;
  var c=ctrl(el);btn(c,'모두 잇기',function(){on=on.map(function(){return true;});draw();});btn(c,'선 3–4 끊기 (두 덩어리)',function(){on=g.edges.map(function(e){var a=g.names[e[0]],b=g.names[e[1]];return (a+b)!=='34';});draw();});
  var bb=btn(c,'끊으면 갈라지는 선(다리) 보기',function(){showB=!showB;bb.setAttribute('aria-pressed',showB?'true':'false');draw();},false);
  H('p','note','선을 누르면 끊기고(점선), 다시 누르면 이어져요. 같은 색 점끼리 한 덩어리(연결 요소)예요.',el);
  var s=svg(el,640,270,'선을 끊고 잇는 그래프'),ou=out(el);
  function draw(){var cm=comps(g,on),bridges={};
    if(showB)g.edges.forEach(function(e,k){if(!on[k])return;var t=on.slice();t[k]=false;if(comps(g,t).n>cm.n)bridges[k]=1;});
    drawG(s,g,{nodeFill:function(i){return PAL[cm.lab[i]%PAL.length];},labelFill:function(){return '#fff';},nodeStroke:function(){return '#fff';},
      edgeColor:function(k){return !on[k]?C.rule:bridges[k]?C.r:C.k;},edgeDash:function(k){return !on[k];},edgeWidth:function(k){return bridges[k]?5:2.5;},onEdge:function(k){on[k]=!on[k];draw();}});
    var groups=[];for(var c2=0;c2<cm.n;c2++)groups.push('{'+g.names.filter(function(_,i){return cm.lab[i]===c2;}).join(', ')+'}');
    ou.innerHTML='<p>덩어리(연결 요소) <b>'+cm.n+'개</b>: '+groups.join(' ')+'</p><p>'+(cm.n===1?'<span class="g">어느 두 점 사이에도 길이 있어요 → 연결 그래프</span>':'<span class="a">서로 길이 없는 점들이 있어요 → 연결이 끊긴 그래프</span>')+'</p>'+(showB?'<p class="r">빨간 굵은 선 '+Object.keys(bridges).length+'개는 하나만 끊어도 덩어리가 늘어나는 「다리」예요.</p>':'');}
  draw();
};
})();
