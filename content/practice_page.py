"""마지막 장 · 실전 연습장 조립"""
import os


def build(B, chs):
    B.USED.update({('doc', 'judge'), ('doc', 'think'), ('asst', 'report'), ('fly', 'magnify'), ('robo', 'calc'), ('robo', 'happy')})
    last = chs[-1]
    o = [B.head('마지막 장 · 실전 연습장 — ' + B.SERIES, '배달 길찾기 센터, 시험 시간표 사무실, 물류 관 증설 본부를 운영하며 그래프 이론을 써 보는 시뮬레이터.', depth=1, og='../img/og/og_practice.webp')]
    o.append('<nav class="top" aria-label="실전 연습장 목차"><a class="logo" href="../index.html">%s</a><a href="#sim">사업장</a><a href="#wrap">마무리</a><a href="../%s.html">%02d장</a></nav><div id="prog"></div>' % (B.LOGO, last['slug'], last['no']))
    o.append(B.cover_html('cover_practice', '그래프 사업장 시뮬레이터', '마지막 장 · 실전 연습장', '배달 길찾기 센터 · 시험 시간표 사무실 · 물류 관 증설 본부', '실전 연습장 표지 — 세 사업장 앞의 심판 박사와 두 조', up='../',
                          chars=[('doc', 'front'), ('sia', 'smile'), ('moa', 'smile'), ('x3', 'e13')]))
    o.append('<header class="hero"><div class="wrap"><div class="kicker">마지막 장 · 실전 연습장</div><h1>그래프 사업장 시뮬레이터</h1>'
             '<p class="q">핵심 질문 — 배운 개념으로 가상 사업장의 결정을 내리면, 숫자가 어떻게 달라질까?</p>'
             '<p>사업장 세 곳을 탭으로 골라 운영해 보세요. 초록 상자는 시장 환경(내가 못 바꾸는 조건), 파란 상자는 내 결정이에요. 성적표·그래프·캐릭터 대사가 바로 바뀌고, 미션 3개는 직접 조작한 뒤에 자동으로 판정돼요. 주소 끝에 #route, #exam, #pipe를 붙이면 그 사업장이 바로 열려요.</p>'
             + B.says([('doc', 'front', '마지막 장은 실습입니다. 정답은 계산이 판정해요. 사업장마다 미션 세 개, 모두 아홉 개!'), ('moa', 'cheer', '1조, 2조 모두 같이 운영해 봐요!')]) + '</div></header>')
    o.append('<section class="level" style="padding-top:24px"><div class="wrap" id="sim"></div></section>')
    o.append('''<section class="level" id="wrap"><div class="wrap"><h2>마무리 — 세 사업장이 함께 묻는 질문</h2>
<p>세 사업장은 모두 「같은 그래프라도 무엇을 재느냐(걸음 수인가 시간인가, 색 수인가 충돌 수인가, 관 크기인가 흐름인가)에 따라 가장 좋은 답이 달라진다」는 질문을 던져요. 배달 센터에서는 선의 무게가, 시간표 사무실에서는 이웃 관계가, 물류 본부에서는 가장 좁은 자르는 선이 답을 정했어요. 결과 숫자를 믿기 전에 그 숫자를 만든 기준을 먼저 확인하는 것 — 이것이 이 연구실이 말하는 「AI 결과를 판단하는 힘」이에요.</p>
<div class="lim"><b>모형의 한계</b> — 사업장의 숫자(이동 시간, 과목 충돌, 관 용량, 증설 효과)는 모두 교육용 예시값이에요. 실제 배송·학사·물류 계획에는 시간대, 비용, 사람의 선택처럼 훨씬 많은 조건이 붙어요. 이 페이지의 결과는 경영·투자 권고가 아닙니다.</div>
</div></section>''')
    o.append(B.footer_html(('../%s.html' % last['slug'], '%02d %s' % (last['no'], last['title'])), ('../index.html', '오리엔테이션으로'), ''))
    o.append('<script src="../assets/sprites.js"></script><script src="../assets/widgets.js"></script><script src="../assets/lab.js"></script><script src="../assets/practice.js"></script></body></html>')
    os.makedirs(os.path.join(B.ROOT, 'practice'), exist_ok=True)
    open(os.path.join(B.ROOT, 'practice', 'index.html'), 'w', encoding='utf-8').write('\n'.join(o))
    print('built practice')
