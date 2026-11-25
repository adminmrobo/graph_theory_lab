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

