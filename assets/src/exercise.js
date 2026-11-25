/* 연습 문제 채점 (기록은 이 화면에만, 저장하지 않음) */
(function(){
'use strict';
var ANS=window.EXANS||{},done={};
function parse(v){v=String(v).replace(/[,\s]/g,'').replace(/[−–]/g,'-');if(v==='')return NaN;return Number(v);}
function score(){
  var tot=0,ok=0;
  document.querySelectorAll('.exsc').forEach(function(p){var ch=p.dataset.ch,ids=Object.keys(ANS).filter(function(k){return k.slice(1,3)===ch;}),tried=ids.filter(function(k){return k in done;});
    if(!tried.length)return;var good=tried.filter(function(k){return done[k];}).length,pct=Math.round(good/ids.length*100);tot+=ids.length;ok+=good;
    var link=p.querySelector('a').outerHTML;
    p.innerHTML='이 장 점수: <b>'+good+' / '+ids.length+'</b> ('+pct+'%)'+(tried.length<ids.length?' · 아직 안 푼 문제 '+(ids.length-tried.length)+'개':'')+(pct<70&&tried.length===ids.length?' · <span class="a">풀이를 펼쳐 보고 장을 다시 보는 것을 권해요</span>':'')+' · '+link;});
  var n=Object.keys(done).length,g=Object.keys(done).filter(function(k){return done[k];}).length,T=document.getElementById('extotal');
  if(T)T.innerHTML=n?'채점한 문제 <b>'+n+' / '+Object.keys(ANS).length+'</b> · 맞힌 문제 <b>'+g+'</b> ('+Math.round(g/n*100)+'%)':'아직 채점한 문제가 없어요.';}
document.querySelectorAll('.exq').forEach(function(q){
  var id=q.dataset.id,inp=q.querySelector('input'),fb=q.querySelector('.exfb'),b=q.querySelector('.exgo');
  function go(){var v=parse(inp.value);
    if(isNaN(v)){fb.className='exfb a';fb.textContent='숫자를 입력해 주세요 (쉼표는 있어도 괜찮아요).';return;}
    var right=Math.abs(v-ANS[id])<1e-9;done[id]=right;
    fb.className='exfb '+(right?'g':'r');
    fb.textContent=right?'정답이에요! 풀이를 펼쳐 내 방법과 같은지 확인해 보세요.':'아쉬워요. 다시 생각해 보거나 「단계별 풀이 보기」를 펼쳐 보세요.';
    score();}
  b.addEventListener('click',go);inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();go();}});});
})();
