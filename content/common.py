# 시리즈 공용 데이터
SERIES = '그래프 이론 연구실 — 점과 선으로 관계를 보는 법'
LOGO = '그래프 이론 연구실'
SITE = 'https://adminmrobo.github.io/graph_theory_lab/'
AUTHOR = {'name': '안상선', 'en': 'Ahn Sangsun', 'site': 'https://adminmrobo.github.io/who_am_i/who_am_i.html', 'org': '(주)M-Robo 대표'}

# who: (이름, 이 시리즈의 자리, 기본 표정, 한 줄 소개)
PEOPLE = {
    'doc': ('박사', '심판', 'front', '두 조의 발표와 대결을 판정해요. 판정 기준은 언제나 「계산 결과」. 막히는 곳에서는 꼭 멈춰 줍니다.'),
    'robo': ('주판봇', '1조 조장', 'calc', '빠른 계산과 큰 숫자를 좋아하는 1조 조장. 가끔 너무 빨리 확신해서 조원들이 확인해 줘요.'),
    'fly': ('초파리 연구원', '2조 조장', 'magnify', '작지만 날카로운 2조 조장. 「정말 그래?」 하고 반례를 들고 옵니다.'),
    'sia': ('인턴 시아', '1조 조원 · 인턴1', 'e13', '조용하고 꼼꼼한 정리 담당. 표와 그림 정리를 맡아요.'),
    'asst': ('조수 하루', '1조 조원', 'e13', '수식이나 코드가 나오면 손을 번쩍 드는 질문 담당. 처음 오신 분의 눈높이.'),
    'x1': ('미공개 X1', '1조 조원', 'e13', '정체는 비밀. 짧고 엉뚱한 질문을 던져요.'),
    'moa': ('인턴 모아', '2조 조원 · 인턴2', 'e13', '상냥하고 잘 웃는 발표 담당. 응원 목소리가 제일 커요.'),
    'x2': ('미공개 X2', '2조 조원', 'e13', '정체는 비밀. 조용히 그림(시각화)을 그려 와요.'),
    'x3': ('미공개 X3', '2조 조원', 'e13', '정체는 비밀. 숫자 세기와 표 만들기를 좋아해요.'),
}
CAST_ORDER = ['doc', 'robo', 'sia', 'asst', 'x1', 'fly', 'moa', 'x2', 'x3']
# 두 조: 꼭짓점(점)을 하나하나 세는 1조, 변(연결선)을 따라가 보는 2조
TEAMS = [
    {'no': '1조', 'name': '꼭짓점조', 'lead': 'robo', 'members': ['sia', 'asst', 'x1']},
    {'no': '2조', 'name': '연결선조', 'lead': 'fly', 'members': ['moa', 'x2', 'x3']},
]

CHAPTERS = [('ch%02d' % i, None) for i in range(1, 10)]

_V = {'title': True, 'author': True, 'year': True, 'doi': False, 'pages': False}
REFS = {
    'src_infographics': {'type': 'graphic', 'title': 'Graph Theory — Understanding relationships through structure (인포그래픽 9장, @eeanimation, 2026-11-26 제공본)', 'author': [{'literal': '@eeanimation (사용자 제공 자료)'}],
                         'year': 2026, 'role': 'primary', 'verified': {'title': True, 'author': False, 'year': False},
                         'short': '원자료 인포그래픽 9장 (@eeanimation, 사용자 제공)', 'use': '장 구성(시리즈 9주제)과 각 단계의 예시 그래프'},
    'west2001': {'type': 'book', 'title': 'Introduction to Graph Theory (2nd ed.)', 'author': [{'family': 'West', 'given': 'Douglas B.'}], 'year': 2001, 'publisher': 'Prentice Hall',
                 'role': 'background', 'verified': dict(_V), 'short': 'West (2001) Introduction to Graph Theory', 'use': '차수·경로·트리·오일러·해밀턴·평면성·색칠·매칭의 표준 정의'},
    'diestel2017': {'type': 'book', 'title': 'Graph Theory (5th ed.)', 'author': [{'family': 'Diestel', 'given': 'Reinhard'}], 'year': 2017, 'publisher': 'Springer',
                    'role': 'background', 'verified': dict(_V), 'short': 'Diestel (2017) Graph Theory', 'use': '연결성·평면 그래프·쿠라토프스키 정리 확인'},
    'clrs2009': {'type': 'book', 'title': 'Introduction to Algorithms (3rd ed.)', 'author': [{'family': 'Cormen', 'given': 'Thomas H.'}, {'family': 'Leiserson', 'given': 'Charles E.'}, {'family': 'Rivest', 'given': 'Ronald L.'}, {'family': 'Stein', 'given': 'Clifford'}],
                 'year': 2009, 'publisher': 'MIT Press', 'role': 'background', 'verified': dict(_V), 'short': 'Cormen 외 (2009) Introduction to Algorithms',
                 'use': '인접 행렬·인접 리스트, BFS, 다익스트라, 벨만-포드, 플로이드-워셜, 최대 흐름'},
    'dijkstra1959': {'type': 'article-journal', 'title': 'A note on two problems in connexion with graphs', 'author': [{'family': 'Dijkstra', 'given': 'Edsger W.'}], 'year': 1959,
                     'container': 'Numerische Mathematik', 'volume': '1', 'pages': '269-271', 'role': 'background', 'verified': dict(_V), 'short': 'Dijkstra (1959)', 'use': '최단 경로 알고리즘'},
    'ford1956': {'type': 'article-journal', 'title': 'Maximal flow through a network', 'author': [{'family': 'Ford', 'given': 'L. R.'}, {'family': 'Fulkerson', 'given': 'D. R.'}], 'year': 1956,
                 'container': 'Canadian Journal of Mathematics', 'volume': '8', 'pages': '399-404', 'role': 'background', 'verified': dict(_V), 'short': 'Ford & Fulkerson (1956)', 'use': '최대 흐름 최소 절단 정리'},
    'euler1736': {'type': 'article-journal', 'title': 'Solutio problematis ad geometriam situs pertinentis', 'author': [{'family': 'Euler', 'given': 'Leonhard'}], 'year': 1736,
                  'container': 'Commentarii academiae scientiarum Petropolitanae', 'volume': '8', 'role': 'background', 'verified': dict(_V), 'short': 'Euler (1736) 쾨니히스베르크 다리 문제', 'use': '오일러 회로와 차수의 짝수 조건'},
    'kruskal1956': {'type': 'article-journal', 'title': 'On the shortest spanning subtree of a graph and the traveling salesman problem', 'author': [{'family': 'Kruskal', 'given': 'Joseph B.'}], 'year': 1956,
                    'container': 'Proceedings of the American Mathematical Society', 'volume': '7', 'pages': '48-50', 'role': 'background', 'verified': dict(_V), 'short': 'Kruskal (1956)', 'use': '최소 신장 트리'},
    'chung1997': {'type': 'book', 'title': 'Spectral Graph Theory', 'author': [{'family': 'Chung', 'given': 'Fan R. K.'}], 'year': 1997, 'publisher': 'American Mathematical Society',
                  'role': 'background', 'verified': dict(_V), 'short': 'Chung (1997) Spectral Graph Theory', 'use': '인접 행렬·라플라시안 고윳값과 연결성'},
    'appel1977': {'type': 'article-journal', 'title': 'Every planar map is four colorable. Part I: Discharging', 'author': [{'family': 'Appel', 'given': 'Kenneth'}, {'family': 'Haken', 'given': 'Wolfgang'}], 'year': 1977,
                  'container': 'Illinois Journal of Mathematics', 'volume': '21', 'pages': '429-490', 'role': 'background', 'verified': dict(_V), 'short': 'Appel & Haken (1977) 4색 정리', 'use': '평면 그래프는 4가지 색이면 충분하다'},
}
