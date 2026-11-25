#!/usr/bin/env python3
"""조장 대결 판정 검사: 각 장의 대결 단추를 눌러 판정 문장을 확인 (02·04·07장은 주판봇 조장 승, 나머지는 초파리 조장 승)"""
import asyncio, glob, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROBO = ('02', '04', '07')
async def main():
    bad = 0
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        for f in sorted(glob.glob(os.path.join(ROOT, '[0-9][0-9]_*.html'))):
            pg = await b.new_page(); await pg.route('**/fonts.g*/**', lambda r: r.abort())
            await pg.goto('file://' + f); await pg.click('#duel .duel-run'); await pg.wait_for_timeout(50)
            t = await pg.inner_text('#duel .verdict')
            w = t.split('심판 박사 (판정)')[-1].strip().split('.')[0]
            want = '주판봇 조장 승' if os.path.basename(f)[:2] in ROBO else '초파리 조장 승'
            ok = want in w
            bad += not ok
            print('OK  ' if ok else 'FAIL', os.path.basename(f), '|', w, '|', t.split('\n')[1][:90] if '\n' in t else t[:90])
            await pg.close()
        await b.close()
    return bad
sys.exit(1 if asyncio.run(main()) else 0)
