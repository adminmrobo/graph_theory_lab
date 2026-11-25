#!/usr/bin/env python3
"""실전 연습장 미션 검사 + 그래프 계산 검산.
① 조작 전에는 통과 표시가 없어야 하고 ② 정답 조작 뒤 아홉 미션이 모두 「통과」가 되는지 확인한다.
③ 위젯 계산값(해밀턴 사이클 수, 채색수, 최소 신장 트리, 최대 흐름, 최단 거리, 고윳값)을 기대값과 비교한다."""
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CALC = {
    'GT.hamCount("k5")': 12, 'GT.hamCount("cube")': 6, 'GT.hamCount("petersen")': 0,
    'GT.chrom("k4c")': 4, 'GT.chrom("c5")': 3, 'GT.chrom("c6")': 2, 'GT.chrom("exam")': 3,
    'GT.mstWeight("span")': 15, 'GT.maxflow("flow")': 5, 'GT.dijkstra("dj","s","t")': 8, 'GT.lmax("src0")': 2.48,
    'GT.oddCount("kb")': 4, 'GT.oddCount("house")': 2, 'GT.oddCount("square")': 0,
    'GT.eig(GT.matrix(GT.P.src0())).map(function(x){return GT.r2(x.v)}).join(",")': '-2,-1.17,0,0.69,2.48',
}


async def node(pg, pane, name):
    await pg.click('#pane-%s svg .gnode[aria-label^="점 %s"]' % (pane, name))


async def stat(pg, pane):
    return await pg.eval_on_selector_all('#pane-%s .mstat' % pane, 'es => es.map(e => e.textContent)')


async def main():
    bad = 0
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page(); await pg.route('**/fonts.g*/**', lambda r: r.abort())
        await pg.goto('file://' + os.path.join(ROOT, '01_graph_fundamentals.html'))
        for expr, want in CALC.items():
            v = await pg.evaluate(expr)
            ok = v == want
            bad += not ok
            print('OK  ' if ok else 'FAIL', expr, '=', v, '(기대', want, ')')
        await pg.goto('file://' + os.path.join(ROOT, 'practice', 'index.html'))
        for pane in ('route', 'exam', 'pipe'):
            s = await stat(pg, pane)
            ok = all('통과' not in x for x in s)
            bad += not ok
            print('OK  ' if ok else 'FAIL', pane, '조작 전:', s)
        # 배달: 평소 최적(센터-B-D-F-고객) → 퇴근: 구간 최소(센터-B-E-고객, 16분 > 14분) → 퇴근 최적(센터-A-C-F-고객)
        await pg.evaluate("location.hash='#route'")
        for nm in ['B', 'D', 'F', '고객']: await node(pg, 'route', nm)
        await pg.click('#pane-route .ctrl button:has-text("퇴근 시간")')
        for nm in ['B', 'E', '고객']: await node(pg, 'route', nm)
        await pg.click('#pane-route button:has-text("처음부터")')
        for nm in ['A', 'C', 'F', '고객']: await node(pg, 'route', nm)
        # 시간표: 1학기 3색 수동(수학1 과학2 국어3 사회3 영어2 음악1 미술2) → 2학기 자동(3색 > 2) → 2학기 2색 수동
        await pg.evaluate("location.hash='#exam'")
        plan = {'수학': 1, '과학': 2, '국어': 3, '사회': 3, '영어': 2, '음악': 1, '미술': 2}
        for nm, k in plan.items():
            for _ in range(k): await node(pg, 'exam', nm)
        await pg.click('#pane-exam button:has-text("2학기")')
        await pg.click('#pane-exam button:has-text("자동")')
        await pg.click('#pane-exam button:has-text("모두 지우기")')
        for nm, k in {'물리1': 1, '물리2': 1, '물리3': 1, '화학1': 2, '화학2': 2, '화학3': 2}.items():
            for _ in range(k): await node(pg, 'exam', nm)
        # 물류: 평소 c→t(+1) → s→a(+0, 함정) → 공사 중 a→c(+2)
        await pg.evaluate("location.hash='#pipe'")
        await pg.click('#pane-pipe button:text-is("c→t")')
        await pg.click('#pane-pipe button:text-is("s→a")')
        await pg.click('#pane-pipe button:has-text("공사 중")')
        await pg.click('#pane-pipe button:text-is("a→c")')
        for pane in ('route', 'exam', 'pipe'):
            s = await stat(pg, pane)
            ok = all('통과' in x for x in s)
            bad += not ok
            print('OK  ' if ok else 'FAIL', pane, '정답 조작 뒤:', s)
        await b.close()
    print('검사 끝: 실패', bad)
    return bad
sys.exit(1 if asyncio.run(main()) else 0)
