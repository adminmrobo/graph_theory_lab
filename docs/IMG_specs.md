# 표지 그림 지시문 — 그래프 이론 연구실 (11장)

공통 규칙
- 그림체: 16비트 RPG 픽셀아트, **흰 배경**(실내도 밝은 흰 벽). 생성 PNG를 4로 나눈 원래 격자(예 480×270)를 찾아 NEAREST 정수배로만 키운 무손실 WebP 1920×1080으로 `img/cover/cover_NN.webp`에 넣는다.
- 등장인물: 박사(심판, 흰 가운·안경), 주판봇(1조 조장, 청록 모니터 얼굴의 주판 로봇), 초파리 연구원(2조 조장, 돋보기), 인턴 시아(검은 긴 머리), 인턴 모아(밝은 갈색 머리), 조수 하루(분홍 머리 경단), 미공개 X1·X2·X3(검은 실루엣). 캐릭터 기본 그림은 adminmrobo/fruitfly-lab-expressions에서 첨부.
- 표지 오른쪽 40%는 제목 글자를 얹을 수 있게 비워 둔다(그림 속 글자 금지). 그래프 모티프: 픽셀 점(색 네모)과 픽셀 선.
- 「심판 1명 · 조장 2명 · 조원 6명」 구도에서 그 장의 주인공을 앞에 둔다. 하얀 로봇은 쓰지 않는다.

## cover_00 — 오리엔테이션
- 장면: 점과 선으로 이어진 거대한 픽셀 관계도 벽 앞에서 박사가 가운데(심판), 왼쪽에 1조(주판봇·시아·하루·X1), 오른쪽에 2조(초파리·모아·X2·X3)가 마주 섬.
- 프롬프트: 16-bit RPG pixel art, white background lab, a giant wall of colored pixel nodes connected by pixel lines, a scientist referee in the center, two teams facing each other, empty space on the right 40% for a title, no text.

## cover_01 — 그래프 기초 — 점과 선으로 관계 적기
- 장면: 상담실 책상에서 박사가 하루에게 「점 목록·선 목록」 두 장짜리 표를 보여 주고, 뒤 화이트보드에 12명 친구 관계도와 막대그래프.
- 주인공: asst · 수업 형식: 첫 상담 + 조별 데이터 시각화 발표
- 프롬프트: 16-bit RPG pixel art, bright white background, Graph fundamentals lesson scene, characters from the attached sheet, empty right 40% for title, no text in image.

## cover_02 — 그래프 표현 — 같은 관계, 네 가지 모양
- 장면: 두 조가 발표하는 강당. 왼쪽 스크린에 청록색 0/1 행렬 열지도(대각선 위 네모 덩어리 두 개), 오른쪽 스크린에 길이가 크게 다른 막대 세 개.
- 주인공: sia · 수업 형식: 데이터 시각화 조별발표 대결
- 프롬프트: 16-bit RPG pixel art, bright white background, Graph representations lesson scene, characters from the attached sheet, empty right 40% for title, no text in image.

## cover_03 — 경로와 연결 — 어디서 어디로 갈 수 있나
- 장면: 시아가 발표 단상에 서 있고, 뒤 스크린에 집→정류장→학교 길과 두 덩어리로 나뉜 점 그림. X1이 손을 들고 있음.
- 주인공: sia · 수업 형식: 개인발표 + 상담
- 프롬프트: 16-bit RPG pixel art, bright white background, Paths and connectivity lesson scene, characters from the attached sheet, empty right 40% for title, no text in image.

## cover_04 — 트리 — 사이클 없이 모두 잇기
- 장면: 거꾸로 선 나무 모양 조직도(뿌리가 위) 앞에서 모아가 박사와 상담, 옆 책상에서 X3이 폴더 트리를 가리킴. 바닥 지도에 마을 7곳과 빨간 도로 6개.
- 주인공: moa · 수업 형식: 상담 + 개인발표
- 프롬프트: 16-bit RPG pixel art, bright white background, Trees and spanning trees lesson scene, characters from the attached sheet, empty right 40% for title, no text in image.

## cover_05 — 오일러와 해밀턴 — 모든 길인가, 모든 집인가
- 장면: 1조와 2조가 토론 탁자 양쪽에 앉고, 가운데 테이블 위에 일곱 다리가 있는 섬 모형과 오각별 모양 길.
- 주인공: fly · 수업 형식: 조별 토론 대결
- 프롬프트: 16-bit RPG pixel art, bright white background, Eulerian and Hamiltonian graphs lesson scene, characters from the attached sheet, empty right 40% for title, no text in image.

## cover_06 — 평면성과 색칠 — 겹치지 않게 그리고, 다른 색으로 나누기
- 장면: 벽 한쪽에 엇갈린 노선도를 손으로 풀어 펴는 X1, 다른 쪽에 색 블록 시간표(빨강·파랑·노랑)를 붙이는 X2.
- 주인공: x2 · 수업 형식: 데이터 시각화 조별발표 대결
- 프롬프트: 16-bit RPG pixel art, bright white background, Planarity and coloring lesson scene, characters from the attached sheet, empty right 40% for title, no text in image.

## cover_07 — 매칭과 흐름 — 짝짓기와 실어 나르기
- 장면: 조원들이 바닥 위 두 줄로 서서 끈으로 짝을 잇는 역할극, 뒤에는 굵기가 다른 파이프 네트워크와 보라색 병목 표시.
- 주인공: x2 · 수업 형식: 역할극 + 상담
- 프롬프트: 16-bit RPG pixel art, bright white background, Matching and network flow lesson scene, characters from the attached sheet, empty right 40% for title, no text in image.

## cover_08 — 최단 경로 — 가장 적게 드는 길 찾기
- 장면: 하루가 발표 단상에서 대기 줄 표를 가리키고, 뒤 스크린에 빨간 최단 경로와 바둑판 미로의 물결 모양 색 번짐.
- 주인공: asst · 수업 형식: 개인발표 + 조별 검증
- 프롬프트: 16-bit RPG pixel art, bright white background, Shortest paths lesson scene, characters from the attached sheet, empty right 40% for title, no text in image.

## cover_09 — 스펙트럼 그래프 이론 — 그래프의 숫자 지문
- 장면: 졸업 발표 무대. 스크린에 빨간 줄기 그림(고윳값)과 파랑·빨강 두 무리로 칠해진 친구 관계도. X3이 숫자 0을 들고 웃음.
- 주인공: x3 · 수업 형식: 상담 + 졸업 조별발표
- 프롬프트: 16-bit RPG pixel art, bright white background, Spectral graph theory lesson scene, characters from the attached sheet, empty right 40% for title, no text in image.

## cover_practice — 실전 연습장
- 장면: 배달 오토바이가 서 있는 길찾기 센터, 색 블록 시간표 사무실, 파이프가 얽힌 물류 본부 세 건물 앞에 박사와 시아·모아·X3.
- 프롬프트: 16-bit RPG pixel art town, white sky, three small buildings (delivery route center, timetable office, pipeline logistics hub), scientist and three interns in front, empty right 40%, no text.

## 만드는 순서
1. cover_00을 먼저 받아 그림체 확인 → 2. 나머지는 cover_00을 참고 그림으로 함께 올려 3~5장씩 요청 → 3. `python3 tools/build.py`와 `python3 tools/make_og.py`로 반영(표지가 있으면 공유 미리보기도 표지에서 다시 만듦).
