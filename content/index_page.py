"""오리엔테이션(목차) 페이지 조립"""
import os

FORMAT_NOTE = [
    ('상담', '조원 한 명이 박사(또는 조장)에게 막히는 점을 털어놓고 함께 푸는 장면', 'consult'),
    ('조별발표', '한 조가 데이터 시각화 슬라이드로 발표하고, 다른 조가 질문하며 심판이 평가', 'team'),
    ('개인발표', '조원 한 명이 자기 생활 속 예시로 개념을 발표', 'solo'),
    ('토론', '두 조가 서로 다른 주장을 맡아 근거로 맞붙음', 'debate'),
    ('역할극', '조원들이 점·선·물건이 되어 직접 움직여 보는 수업', 'role'),
    ('쪽지시험', '단계 끝 확인 퀴즈와 마지막 장의 종합 점검', 'quiz'),
]
TOPICS = {1: '점과 선의 기초', 2: '길과 나무', 3: '그리고 나누기', 4: '가장 좋은 답과 숫자로 보기'}


def build(B, chs):
    esc, img, says = B.esc, B.img, B.says
    B.GLOSS = {'그래프': '점(꼭짓점)과 선(변)으로 관계를 나타낸 것. 함수의 그래프와는 다른 뜻.',
               '차수': '한 점에 붙은 선의 수.'}
    n = len(chs)
    o = [B.head(B.SERIES + ' · 오리엔테이션', '데이터·코드를 처음 배우는 분을 위한 그래프 이론 %d장 + 실전 연습장. 심판 박사, 조장 초파리·주판봇, 조원 여섯이 조별발표·개인발표·상담으로 배우는 연구실 해설 시리즈.' % n)]
    o.append('<nav class="top" aria-label="목차"><a class="logo" href="index.html">%s</a><a href="#three">3줄 요약</a><a href="#cast">두 조</a><a href="#pillars">네 기둥</a><a href="#terms">용어</a><a href="#toc">목차</a><a href="#how">수업 방식</a><a href="practice/index.html">실전 연습장</a></nav><div id="prog"></div>' % B.LOGO)
    o.append(B.cover_html('cover_00', '그래프 이론 연구실', '오리엔테이션 · 00', '점과 선으로 관계를 보는 법 — %d장 + 실전 연습장' % n, '그래프 이론 연구실 표지 — 픽셀 점과 선으로 이어진 관계도 앞의 두 조와 심판 박사',
                          chars=[('doc', 'front'), ('robo', 'happy'), ('fly', 'point'), ('asst', 'smile')]))
    o.append(f'''<header class="hero"><div class="wrap"><div class="kicker">연구실 해설 시리즈 · 그래프 이론 · 데이터·코드 입문자용</div><h1>{esc(B.SERIES)}</h1>
<p class="q">핵심 질문 — 복잡한 관계를 점과 선으로 적으면, 무엇을 계산하고 무엇을 볼 수 있을까?</p>
<p>{B.rich('[[그래프]]는 점과 선으로 「무엇과 무엇이 이어져 있나」를 적는 방법이에요. 친구 관계, 지하철 노선, 택배 물류, 웹 링크가 모두 그래프예요. 이 시리즈는 인포그래픽 9장의 아홉 주제를 {n}개 장(장마다 2단계)으로 풀고, 그림을 직접 눌러 보며 배우게 만들었어요.')}</p>
<div class="kpis"><div class="kpi g"><b>{n}장</b><span>한 장에 2단계, 20~25분</span></div><div class="kpi m"><b>2개 조</b><span>꼭짓점조 vs 연결선조</span></div><div class="kpi a"><b>18개</b><span>직접 눌러 보는 그림 실험</span></div><div class="kpi r"><b>3곳</b><span>실전 연습장 사업장</span></div></div>''' + says([('doc', 'front', '안녕하세요, 이 연구실의 심판 박사입니다. 데이터도 코드도 처음이어도 괜찮아요. 본문에는 코드가 없고, 궁금한 분만 접기 상자를 펼치면 돼요.'),
                                                                                                                                                                       ('asst', 'smile', '저도 처음이에요. 모르는 게 나오면 제가 먼저 손을 들게요!')]) + '</div></header>')
    o.append('''<div class="wrap"><div class="three" id="three"><h2>처음 오신 분께 — 이 시리즈를 3줄로</h2><ol>
<li><b>무엇을:</b> 점과 선으로 관계를 적고(1~3장), 길·나무·한붓그리기를 찾고(4~5장), 그리고 나누고(6~7장), 가장 좋은 답과 숫자 지문을 구합니다(8~9장).</li>
<li><b>왜 중요한가:</b> 데이터의 상당수는 「관계」예요. 표 두 장(점 목록·선 목록)으로 저장하고, 같은 질문(누가 중심인가, 가장 짧은 길은, 몇 무리인가)을 계산해요.</li>
<li><b>생활·현장에서는:</b> 지도 앱 길찾기, 택배 배송, 시험 시간표 짜기, 멘토 짝짓기, SNS 친구 추천에 바로 쓰여요.</li></ol>
<p class="note">각 장 앞의 「오늘의 장면」(상담·발표)부터 읽으면 개념이 어디에 쓰이는지 먼저 보여요. 수식 상자를 건너뛰어도 그림 실험과 비유로 따라올 수 있어요.</p></div></div>''')
    castl = ''.join('<div>%s<div><span class="role">%s</span><b>%s</b><span>%s</span></div></div>' % (img(w, B.PEOPLE[w][2], cls=''), esc(B.PEOPLE[w][1]), esc(B.PEOPLE[w][0]), esc(B.PEOPLE[w][3])) for w in B.CAST_ORDER)
    o.append(f'''<section class="level" id="cast"><div class="wrap"><h2>등장인물 — 심판 1명, 조장 2명, 조원 6명</h2><div class="cast">{castl}</div>
{B.groups_html()}
<p class="note">1조 「꼭짓점조」는 점을 하나하나 세는 쪽, 2조 「연결선조」는 선을 따라가 보는 쪽이 특기예요. 조장 둘은 장마다 「조장 대결」로 맞붙고, 심판 박사는 계산 결과로만 판정해요.</p></div></section>''')
    pill = []
    for p in (1, 2, 3, 4):
        items = ''.join('<li><a href="%s.html">%02d %s</a></li>' % (c['slug'], c['no'], esc(c['title'])) for c in chs if c.get('pillar') == p)
        pill.append('<div><b>기둥 %d · %s</b><ul>%s</ul></div>' % (p, TOPICS[p], items))
    o.append('''<section class="level" id="pillars"><div class="wrap"><h2>네 기둥 — 이 시리즈의 큰 그림</h2>
<p>원자료 표지는 「그래프 → 인접 행렬 → 경로 → 신장 트리 → 스펙트럼」을 한 흐름으로 그렸어요. 이 연구실은 그 흐름을 네 기둥으로 나눠 걸어요.</p>
<div class="steps">''' + ''.join(pill) + '''</div>
<details><summary>원자료 인포그래픽 표지 보기 (영어 그림)</summary><p class="note">원자료 표지의 스펙트럼 값 {−2, −1, 0, 0, 1, 3}은 점 5개 그래프인데 값이 6개이고 합도 0이 아니어서, 09장에서 계산한 값 {−2, −1.17, 0, 0.69, 2.48}로 바꿉니다.</p><img loading="lazy" src="img/source/src00.webp" width="919" height="919" alt="그래프 이론 시리즈 개요 인포그래픽"></details>
</div></section>''')
    TERMS = [('그래프', '점과 선으로 관계를 적은 것', '반 친구 관계도', 1), ('꼭짓점 · 변', '점(사람·장소) · 선(관계)', '사람 · 친구 사이', 1), ('차수', '한 점에 붙은 선의 수', '친구 수', 1),
             ('인접 리스트 · 행렬', '점별 이웃 목록 · n × n의 0/1 표', '사람별 메모 · 출석부', 2), ('경로 · 사이클', '점이 안 겹치는 길 · 제자리로 오는 길', '통학길 · 공원 한 바퀴', 3), ('연결 요소', '서로 길이 있는 점들의 덩어리', '다리로 이어진 섬 무리', 3),
             ('트리 · 신장 트리', '사이클 없는 연결 그래프 · 모든 점을 잇는 트리', '조직도 · 최소 도로 공사', 4), ('오일러 · 해밀턴', '모든 선 한 번씩 · 모든 점 한 번씩', '다리 산책 · 택배 순서', 5),
             ('평면 그래프 · 채색수', '엇갈림 없이 그리기 · 이웃끼리 다른 색 최소 수', '노선도 · 시험 시간대 수', 6), ('매칭 · 최대 흐름', '겹치지 않는 짝 · 용량 안에서 최대로 보내기', '멘토 배정 · 택배 트럭', 7),
             ('최단 경로', '무게 합이 가장 작은 길', '가장 빠른 통학길', 8), ('고윳값 · 스펙트럼', '행렬의 숫자 지문', '그래프의 지문', 9)]
    trow = ''.join('<tr><td><b>%s</b></td><td>%s</td><td>%s</td><td><a href="%s.html">%02d장</a></td></tr>' % (esc(a), esc(b2), esc(c), [x for x in chs if x['no'] == k][0]['slug'], k) for a, b2, c, k in TERMS)
    o.append('<section class="level" id="terms"><div class="wrap"><h2>그래프 용어 한 장 정리 — 막히면 여기로</h2><p>용어가 헷갈릴 때 이 표로 돌아오세요. 오른쪽 장 이름을 누르면 처음 나오는 곳으로 가요.</p><div class="tw"><table class="tb"><thead><tr><th>용어</th><th>한 줄 뜻</th><th>일상 비유</th><th>처음 나오는 곳</th></tr></thead><tbody>%s</tbody></table></div></div></section>' % trow)
    cards = ''.join('<a href="%s.html"><span class="n">%02d · 기둥 %d · %s · 약 %d분 %s</span><b>%s</b><span>%s</span><span class="fmt">%s</span></a>' % (
        c['slug'], c['no'], c['pillar'], B.STARS[B.LEVEL[c['no']]].split(' ')[0], B.MINUTES[c['no']], '<span class="track basic">기본</span>' if c['no'] in B.BASIC else '<span class="track adv">심화</span>',
        esc(c['title']), esc(c['q']), esc(c['format'][0])) for c in chs)
    cards += '<a href="practice/index.html"><span class="n">마지막 장</span><b>실전 연습장 — 그래프 사업장 시뮬레이터</b><span>배달 길찾기 센터, 시험 시간표 사무실, 물류 관 증설 본부를 운영하며 배운 것을 써 봐요.</span><span class="fmt">시뮬레이터</span></a>'
    o.append(f'<section class="level" id="toc"><div class="wrap"><h2>목차 — {n}장 + 실전 연습장</h2><div class="toc">{cards}</div><p class="note">「기본」 장만 따라가도 실전 연습장까지 갈 수 있어요. 「심화」(09장)는 고윳값이 나오는 장이라 마지막에 도전하세요.</p></div></section>')
    rows = ''.join('<tr><td>%s</td><td>%s</td><td>%s</td></tr>' % (esc(k), esc(v), ', '.join('%02d' % c['no'] for c in chs if any(s['kind'] == key for s in c.get('scenes', []))) or '각 장 끝') for k, v, key in FORMAT_NOTE)
    o.append(f'''<section class="level" id="how"><div class="wrap"><h2>수업 방식 — 장마다 다른 장면</h2>
<div class="tw"><table class="tb"><thead><tr><th>장면</th><th>어떻게 하나</th><th>나오는 장</th></tr></thead><tbody>{rows}</tbody></table></div>
<h3>한 장의 흐름</h3><div class="steps"><div><b class="n">1</b><b>3줄 요약 → 오늘의 장면</b><p>상담·발표 장면으로 「어디에 쓰나」를 먼저 봐요.</p></div><div><b class="n">2</b><b>단계 2개</b><p>박사의 상황 질문 → 왜 이 방법 / 하루의 수식 질문 → 데이터·코드 첫걸음 → 그림 실험 → 풀이 → 퀴즈.</p></div><div><b class="n">3</b><b>AI 판단 · 조장 대결 · 정리</b><p>AI 답의 오류 찾기, 계산으로 가리는 조장 대결, 한눈에 보는 정리표.</p></div></div>
{says([('fly', 'magnify', '원자료 그림에서 바꾼 곳은 「원자료 인포그래픽 보기」 상자에 적어 뒀어. 원자료도 확인하면서 읽자.'), ('robo', 'happy', '계산은 1조에 맡기세요! …물론 조장 대결에서는 저도 자주 틀립니다.')])}</div></section>''')
    o.append(B.footer_html(None, (chs[0]['slug'] + '.html', '01 ' + chs[0]['title']) if chs else None,
                           '<p class="note">원자료: 사용자가 제공한 그래프 이론 인포그래픽 9장(@eeanimation). 이 시리즈의 숫자 예시는 모두 설명용 예시값입니다.</p>'))
    o.append(B.foot_scripts(kg=False))
    open(os.path.join(B.ROOT, 'index.html'), 'w', encoding='utf-8').write('\n'.join(o))
    print('built index')
