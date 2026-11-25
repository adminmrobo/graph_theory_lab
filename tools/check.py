#!/usr/bin/env python3
"""화면 점검: 390·1280px 가로 넘침, 콘솔 오류, 빈 캐릭터 그림, 위젯 실패 문구.
사용: python3 tools/check.py [페이지 경로 ...]  (기본: 모든 페이지)"""
import glob, os, sys, asyncio
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


async def main(pages):
    bad = 0
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        for w in (390, 1280):
            ctx = await b.new_context(viewport={'width': w, 'height': 900})
            for f in pages:
                pg = await ctx.new_page()
                errs = []
                pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'fonts.g' not in m.text and 'ERR_FAILED' not in m.text else None)
                pg.on('pageerror', lambda e: errs.append(str(e)))
                await pg.route('**/fonts.googleapis.com/**', lambda r: r.abort())
                await pg.route('**/fonts.gstatic.com/**', lambda r: r.abort())
                await pg.goto('file://' + os.path.join(ROOT, f))
                await pg.wait_for_timeout(300)
                r = await pg.evaluate('''() => {
                  const sw = document.documentElement.scrollWidth, iw = innerWidth;
                  const wide = [...document.querySelectorAll('body *')].filter(e => { const b = e.getBoundingClientRect(); return b.right > iw + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('.tw') && !e.closest('#tip'); }).slice(0, 3).map(e => e.tagName + '.' + e.className);
                  const noimg = [...document.querySelectorAll('img[data-who]')].filter(i => !i.getAttribute('src')).map(i => i.dataset.who + '_' + i.dataset.mood);
                  const wfail = [...document.querySelectorAll('[data-w]')].filter(e => e.textContent.startsWith('그림을 그리지 못했어요')).map(e => e.dataset.w + ': ' + e.textContent.slice(0, 80));
                  const empty = [...document.querySelectorAll('[data-w]')].filter(e => e.children.length === 0).map(e => e.dataset.w);
                  return {sw, iw, wide, noimg: [...new Set(noimg)], wfail, empty};
                }''')
                problems = []
                if r['sw'] > r['iw'] + 1: problems.append('가로 넘침 %d>%d %s' % (r['sw'], r['iw'], r['wide']))
                if errs: problems.append('콘솔 오류 %s' % errs[:3])
                if r['noimg']: problems.append('빈 캐릭터 %s' % r['noimg'])
                if r['wfail']: problems.append('위젯 실패 %s' % r['wfail'])
                if r['empty']: problems.append('빈 위젯 %s' % r['empty'])
                if problems:
                    bad += 1
                    print('[%d] %s: %s' % (w, f, ' | '.join(problems)))
                await pg.close()
            await ctx.close()
        await b.close()
    print('점검 끝: 문제 있는 페이지-폭 %d개' % bad)
    return bad


if __name__ == '__main__':
    pages = sys.argv[1:] or sorted([os.path.relpath(x, ROOT) for x in glob.glob(os.path.join(ROOT, '*.html')) + glob.glob(os.path.join(ROOT, 'practice', '*.html'))])
    sys.exit(1 if asyncio.run(main(pages)) else 0)
