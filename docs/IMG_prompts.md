# 이미지 프롬프트 — 그래프 이론 연구실

생성 도구(Genspark 등)에 그대로 붙여 넣는 프롬프트예요. **표지 11장(16:9)은 꼭 필요**하고, **장면 그림 9장(3:2)은 선택**이에요.
캐릭터 기본 그림 9장은 `prompt_pack.zip`의 `characters/` 폴더에 있어요. 요청할 때마다 함께 올려 주세요.

---

## 1. 그림 전체 목록

| 구분 | 파일 이름 | 비율 · 받을 크기 | 쓰는 곳 |
|---|---|---|---|
| 새로 그림 (필수) | cover_00 ~ cover_09, cover_practice (11장) | 16:9 · 1920×1080 PNG | 각 페이지 맨 위 표지 |
| 새로 그림 (선택) | scene_01 ~ scene_09 (9장) | 3:2 · 1536×1024 PNG | 각 장 1단계 「일상으로 치면」 비유 상자 |
| 표지에서 자름 | og_*.webp, 목차 썸네일 | 1200×630 | 공유 미리보기 (`tools/make_og.py`가 자동으로 자름) |
| 캐릭터 팩 재사용 | 표정 그림 (sprites.js) | — | 말풍선 (새로 그릴 필요 없음) |

## 2. 모든 요청에 같이 붙이는 공통 문장

**그림체 (STYLE)** — 모든 프롬프트 맨 앞에 붙여요.
```
16-bit RPG pixel art, crisp pixel grid, limited palette, no anti-aliasing, no blur,
bright clean WHITE background (white walls, white floor), soft teal (#0f7c7a) accents,
cute chibi characters, consistent character design matching the attached reference sheet,
NO text, NO letters, NO numbers, NO logos anywhere in the image.
```

**캐릭터 설명 (CAST)** — 첨부 그림과 함께 붙여요.
```
Characters (match the attached reference images exactly):
- Doctor (referee): middle-aged man, spiky black hair with a white streak, round teal glasses, white lab coat over black vest, cheerful.
- Jupanbot (Team 1 leader): boxy beige robot, green CRT-monitor face with a smiling expression, small antenna, holds a wooden abacus. (beige, NOT a white robot)
- Fruit Fly researcher (Team 2 leader): a small fruit fly with big red compound eyes, blue helmet, white lab coat, holding a magnifying glass.
- Sia (Team 1, intern 1): long straight black hair, black maid-style dress with white collar and gray bow, calm.
- Haru (Team 1, assistant): pink hair in twin buns with a blue streak, blue eyes, white coat over a lavender hoodie.
- X1 (Team 1): fully black silhouette character with a ponytail and a pink bow, only small white eyes and pink cheeks visible.
- Moa (Team 2, intern 2): long light-brown hair, white frilled headdress, red bow tie, brown dress with white apron, bright smile.
- X2 (Team 2): fully black silhouette with a beret and round teal glasses.
- X3 (Team 2): fully black silhouette in a cat-ear hood with yellow drawstrings.
```

**구도 (LAYOUT, 표지 전용)**
```
Wide 16:9 composition. Keep the RIGHT 40% of the image mostly empty white space (a title will be placed there later).
Characters and the main scene on the LEFT 60%. Graph motif = colored square pixel dots (nodes) connected by thin pixel lines (edges).
```

**빼 달라는 말 (NEGATIVE)** — 도구에 「제외」 칸이 있으면 넣어요.
```
text, letters, Korean characters, numbers, watermark, logo, dark background, night scene, photorealistic, 3D render, blurry, smooth gradients, white robot, extra characters not in the reference
```

---

## 3. 표지 프롬프트 11장 (16:9)

> 붙여 넣는 순서: **STYLE + CAST + LAYOUT + 아래 SCENE**. 그림 속 글자는 넣지 않아요(제목은 페이지가 얹어요).

### cover_00 — 오리엔테이션 (가장 먼저 받기)
- 장면: 점과 선으로 이어진 거대한 관계도 벽 앞, 박사가 가운데 심판, 왼쪽 1조와 오른쪽 2조가 마주 섬.
```
SCENE: A bright white research lab. Behind the characters, a giant wall covered with a pixel-art network:
colorful square nodes (teal, red, blue, amber, purple) connected by thin dark pixel lines.
The Doctor stands in the center as a referee holding a small whistle.
On his left, Team 1 lines up: Jupanbot (leader, raising the abacus), Sia, Haru, X1.
On his right, Team 2 lines up: the Fruit Fly researcher (leader, raising the magnifying glass), Moa, X2, X3.
The two teams face each other with friendly competitive smiles. All characters on the left 60% of the frame.
```

### cover_01 — 그래프 기초 (상담 + 차수 막대그래프 발표)
```
SCENE: A small white counseling corner. The Doctor sits at a desk and shows Haru two simple paper sheets
(one listing dots, one listing pairs of dots, drawn only as pixel boxes and lines, no writing).
Haru looks relieved. Behind them a whiteboard shows a pixel friendship network of 12 nodes
and a small teal bar chart. Moa and X2 stand near the whiteboard holding a pointer.
```

### cover_02 — 그래프 표현 (시각화 조별발표 대결)
```
SCENE: A white presentation hall with two big screens.
Left screen: a teal-and-white grid heatmap (adjacency matrix) with two clear square blocks along the diagonal; Sia points at it, Jupanbot and Haru watch.
Right screen: three horizontal bars of very different lengths (red long, blue medium, green short); Moa presents, X3 holds a calculator.
The Doctor sits at a judge's table in front with a scorecard.
```

### cover_03 — 경로와 연결 (시아 개인발표 + 상담)
```
SCENE: Sia stands at a small podium giving a solo presentation, slightly nervous but confident.
Behind her, a screen shows a pixel map: a house, a bus stop and a school connected by a highlighted red path,
plus a second separate island of dots not connected to the rest.
In the audience, X1 raises a hand with a question; the Fruit Fly researcher sits beside X1, pointing at the separate island.
```

### cover_04 — 트리 (모아 상담 + X3 개인발표)
```
SCENE: A white office wall with a big upside-down pixel tree diagram (root at the top, branches going down, small round leaves at the bottom).
Moa sits with the Doctor at a round table asking a question, the Doctor gestures toward the tree.
On the floor, a pixel map of 7 small villages connected by exactly 6 red roads (no loops).
X3 stands nearby pointing at a stack of nested folder icons drawn as pixel boxes.
```

### cover_05 — 오일러와 해밀턴 (조별 토론)
```
SCENE: A debate table split in two. Team 1 (Jupanbot, Sia, Haru, X1) on the left side, Team 2 (Fruit Fly researcher, Moa, X2, X3) on the right side.
In the middle of the table, a small model of a river town with an island and seven pixel bridges,
and next to it a five-pointed star path drawn with red pixel lines on a pentagon.
The Doctor stands at the head of the table as moderator.
```

### cover_06 — 평면성과 색칠 (노선도 vs 시간표 시각화 대결)
```
SCENE: Two white walls. On the left wall, X1 and Haru untangle a subway-like pixel map: lines that were crossing are being pulled apart so no lines cross.
On the right wall, X2 and Moa stick colored blocks (red, blue, yellow) onto a timetable board made of nodes connected by lines, neighbors always in different colors.
The Doctor looks on from the center with a scorecard.
```

### cover_07 — 매칭과 흐름 (역할극 + 상담)
```
SCENE: A white classroom floor. The team members stand in two rows facing each other (Team 1 on the left row, Team 2 on the right row),
holding colored ropes that connect them in pairs, no person holding two ropes.
In the background, a network of pixel pipes of different thicknesses flowing from a left tank to a right tank,
with the narrowest pipes glowing purple as the bottleneck. Jupanbot explains the pipes to X2.
```

### cover_08 — 최단 경로 (하루 개인발표)
```
SCENE: Haru stands proudly at a podium giving her first solo presentation, pointing at a screen.
The screen shows a pixel map with numbered stops where one route is highlighted in red as the fastest path,
and next to it a small grid maze with a ripple of teal shades spreading from the top-left corner.
In the audience, X3 checks numbers on a notepad and Moa gives a thumbs up.
```

### cover_09 — 스펙트럼 (상담 + 졸업 조별발표)
```
SCENE: A graduation-style presentation stage with small pixel confetti.
A large screen shows a pixel friendship network where nodes are colored in two groups (blue and red),
and below it a stem plot: thin dashed vertical lines topped with red dots of different heights.
Both teams stand together on stage smiling; X3 holds up a sign shaped like a big zero (no text, just the 0 shape).
The Doctor claps from the side.
```

### cover_practice — 실전 연습장
```
SCENE: A cheerful pixel town under a white sky with three small buildings side by side:
(1) a delivery route center with a scooter parked in front and a map board,
(2) a timetable office with colored blocks on its window,
(3) a logistics hub with thick and thin pipes running between tanks.
The Doctor, Sia, Moa and X3 stand in front of the buildings, ready to start work.
```

---

## 4. 장면 그림 프롬프트 9장 (선택, 3:2)

> 각 장 **1단계 「일상으로 치면」 비유 상자**에 들어가는 그림이에요. 붙여 넣는 순서: **STYLE + CAST + 아래 SCENE** (LAYOUT은 빼요). 비율 3:2, 장면을 화면 가운데에 채워요.

| 파일 | 비유 | SCENE |
|---|---|---|
| scene_01 | 행사장 악수 | `A bright white event hall where team members shake hands in pairs; each handshake is shown as a short pixel line between two people; the Doctor counts with tally marks on a blank board (no numbers).` |
| scene_02 | 출석부와 메모장 | `Sia at a desk comparing two papers: a big grid attendance sheet with mostly empty cells and a few teal circle marks, and a small memo list with short pixel lines; Haru looks at the empty cells surprised.` |
| scene_03 | 통학길 | `Sia walking along a pixel path from a house to a bus stop to a school, red footprints showing the route; a separate small island with two dots far away, not connected.` |
| scene_04 | 조직도 | `An upside-down pixel organization chart on a white wall: one box at the top, branches going down, every box has exactly one line going up; Moa traces one line upward with her finger, the Doctor nods.` |
| scene_05 | 다리 산책 | `A pixel river town with an island and seven small bridges; Jupanbot walks across a bridge looking confused while the Fruit Fly researcher counts bridges at each land area with a magnifying glass.` |
| scene_06 | 노선도 | `X1 and Haru on a white wall pulling apart a tangled subway-like pixel map so that the colored lines no longer cross; one stubborn crossing remains on a five-station map.` |
| scene_07 | 양보 사슬 | `Two rows of team members connecting in pairs with colored ropes; X1 at the end without a partner looking surprised, Moa waving to swap partners so a new pair can form.` |
| scene_08 | 가까운 곳부터 도장 | `Haru walking from her house through a pixel map of stops, stamping a green check stamp on the nearest stop first, then the next nearest; the fastest route glows red toward the school.` |
| scene_09 | 지문 | `A large pixel fingerprint whose ridges are made of graph nodes and lines; next to it a small stem plot with red dots on dashed lines; X3 compares the two with the Doctor, smiling.` |

## 5. 요청 꾸러미 (하나 = 대화 하나, 같은 비율끼리)

| 요청 | 들어가는 그림 | 함께 올릴 것 |
|---|---|---|
| 요청 1 | cover_00 (1장) | characters 9장 |
| 요청 2 | cover_01 · 02 · 03 · 04 (4장) | characters 9장 + 받은 cover_00 (그림체 참고) |
| 요청 3 | cover_05 · 06 · 07 · 08 · 09 (5장) | characters 9장 + cover_00 |
| 요청 4 | cover_practice (1장) | characters 4장(doctor, sia, moa, x3) + cover_00 |
| 요청 5 (선택) | scene_01 ~ 05 (5장, 3:2) | characters 9장 + cover_00 |
| 요청 6 (선택) | scene_06 ~ 09 (4장, 3:2) | characters 9장 + cover_00 |

요청 2부터는 맨 앞에 이 한 줄을 더 붙여요.
```
Match the art style, palette and character proportions of the attached cover_00 image exactly.
```

## 6. 받은 뒤 확인할 것

- [ ] 그림 속에 글자·숫자·로고가 없다
- [ ] 배경이 흰색이다 (어두운 배경, 밤 장면이 아니다)
- [ ] 주판봇이 베이지색 상자 로봇이다 (하얀 로봇이 아니다)
- [ ] X1·X2·X3가 검은 실루엣이다 (얼굴을 그리지 않았다)
- [ ] 표지의 오른쪽 40%가 비어 있다
- [ ] 픽셀 경계가 또렷하다 (흐릿하게 뭉개지지 않았다)

## 7. 저장 이름과 넣는 곳

받은 PNG를 이 이름으로 저장해 보내 주시면 반영해요. 직접 넣을 때는 원래 픽셀 격자(보통 PNG를 4로 나눈 크기)를 찾아 NEAREST 정수배로 1920×1080 무손실 WebP로 바꾼 뒤 아래 자리에 두고 `python3 tools/build.py && python3 tools/make_og.py`를 실행해요.

| 저장 이름 | 넣는 곳 |
|---|---|
| cover_00.png ~ cover_09.png, cover_practice.png | `img/cover/` (.webp로 변환) |
| scene_01.png ~ scene_09.png | `img/scene/scene_NN_lv1.webp` (1200×800 .webp로 변환, 예: scene_03 → scene_03_lv1.webp) |
