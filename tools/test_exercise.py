#!/usr/bin/env python3
"""연습 문제 검사: 문제 18개 모두 ① 정답을 넣으면 「정답」 ② 틀린 값을 넣으면 「아쉬워요」, 장 점수와 전체 점수가 맞게 바뀌는지 확인"""
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
async def main():
    bad = 0
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page(); await pg.route('**/fonts.g*/**', lambda r: r.abort())
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + os.path.join(ROOT, 'exercise', 'index.html'))
        ans = await pg.evaluate('window.EXANS')
        for pid, a in ans.items():
            await pg.fill('#in_' + pid, str(a + 1)); await pg.click('.exq[data-id="%s"] .exgo' % pid)
            wrong = await pg.inner_text('#fb_' + pid)
            await pg.fill('#in_' + pid, '{:,}'.format(a) if a >= 1000 else str(a)); await pg.click('.exq[data-id="%s"] .exgo' % pid)
            right = await pg.inner_text('#fb_' + pid)
            ok = '아쉬워요' in wrong and '정답' in right
            bad += not ok
            if not ok: print('FAIL', pid, a, wrong, right)
        total = await pg.inner_text('#extotal'); ch1 = await pg.inner_text('.exsc[data-ch="01"]')
        ok = '18 / 18' in total and '100%' in total and '2 / 2' in ch1
        bad += not ok or bool(errs)
        print('문제', len(ans), '개 · 전체:', total, '· 01장:', ch1.split('·')[0], '· 오류', errs)
        await b.close()
    print('검사 끝: 실패', bad)
    return bad
sys.exit(1 if asyncio.run(main()) else 0)
