// Builds the organisation profile's pictures from the live API (keyless routes only, so CI needs no secret).
// Writes profile/assets/*.svg in a dark and a light version. Run: node scripts/build.mjs
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'profile', 'assets');
const API = 'https://api.satelit.md/v1';
mkdirSync(OUT, { recursive: true });

async function get(path) {
  const res = await fetch(API + path, { headers: { 'User-Agent': 'satelit-profile/1.0 (+https://github.com/Satelit-Moldova)' } });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return (await res.json()).data;
}

const THEMES = {
  dark: { bg: '#0E0F11', card: '#16181B', line: '#2A2D33', text: '#F3F1EC', muted: '#9AA0A8', accent: '#F0B14E', up: '#E5735B', down: '#5BBF8A', code: '#0A0B0C' },
  light: { bg: '#F6F4EF', card: '#FFFFFF', line: '#E3DFD6', text: '#16181B', muted: '#5F6670', accent: '#C9821A', up: '#C2492F', down: '#2E8A5A', code: '#F1EEE7' },
};
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace";
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (n) => Math.round(n).toLocaleString('en-US').replace(/,/g, ' ');
const lei = (n) => n.toFixed(2);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const day = (iso) => { const [y, m, d] = iso.slice(0, 10).split('-'); return `${+d} ${MONTHS[+m - 1]} ${y}`; };

// the faceted rhombus, Satelit's mark (shared/brand/satelit-romb-color.svg), at any size
const mark = (x, y, s, cls = '') =>
  `<g transform="translate(${x} ${y}) scale(${s})" class="${cls}"><path d="M0 30L20 0L20 30Z" fill="#FFE3AA"/><path d="M20 0L40 30L20 30Z" fill="#F3BD5C"/><path d="M0 30L20 60L20 30Z" fill="#DE9A35"/><path d="M20 60L40 30L20 30Z" fill="#B9771B"/></g>`;

const svg = (w, h, body, css, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"><style>${css}@media (prefers-reduced-motion:reduce){*{animation:none!important}}</style>${body}</svg>\n`;

function write(name, theme, content) { writeFileSync(join(OUT, `${name}-${theme}.svg`), content); }

// ---------------------------------------------------------------- banner: the mark, the promise, a ticker of real counts
// Sizes: GitHub shows a profile README 640 to 900 px wide, so full-width pictures are drawn 880 wide and cards 420.
function banner(t, theme, counts) {
  const facts = [
    [counts.products, 'products priced in Moldovan shops'],
    [counts.court_hearings, 'court hearings, back to 2001'],
    [counts.companies, 'companies from the state register'],
    [counts.acts, 'laws and acts, back to 1961'],
    [counts.movies_films, 'films, with cinema sessions in Moldova'],
    [counts.citizenship_dossiers, 'Romanian citizenship dossiers'],
  ];
  const n = facts.length, step = 3, total = n * step;
  const rows = facts.map(([v, l], i) => `<g class="f f${i}"><text x="0" y="0" class="big">${num(v)}</text><text x="0" y="28" class="lbl">${esc(l)}</text></g>`).join('');
  // each fact has its slot of the loop: slides up in, holds, slides up out
  const keys = facts.map((_, i) => {
    const a = (i * step / total) * 100, b = ((i * step + 0.4) / total) * 100, c = (((i + 1) * step - 0.4) / total) * 100, d = (((i + 1) * step) / total) * 100;
    return `.f${i}{animation:k${i} ${total}s infinite}@keyframes k${i}{0%,${a.toFixed(2)}%{opacity:0;transform:translateY(16px)}${b.toFixed(2)}%,${c.toFixed(2)}%{opacity:1;transform:translateY(0)}${d.toFixed(2)}%,100%{opacity:0;transform:translateY(-16px)}}`;
  }).join('');
  const css = `.t{font:700 42px ${FONT};fill:${t.text};letter-spacing:-.5px}.s{font:400 18px ${FONT};fill:${t.muted}}.big{font:700 38px ${FONT};fill:${t.accent};letter-spacing:-.5px}.lbl{font:400 17px ${FONT};fill:${t.muted}}.f{opacity:0}${keys}
.m{transform-box:fill-box;transform-origin:center;animation:float 6s ease-in-out infinite}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
.glow{animation:pulse 6s ease-in-out infinite}@keyframes pulse{0%,100%{opacity:.35}50%{opacity:.7}}
.sweep{animation:sw 7s ease-in-out infinite}@keyframes sw{0%,60%{transform:translateX(-140px)}100%{transform:translateX(140px)}}
.dot{fill:${t.accent};opacity:.2}.live{fill:${t.down};animation:blink 2s infinite}@keyframes blink{50%{opacity:.25}}.when{font:400 15px ${FONT};fill:${t.muted}}`;
  const dots = Array.from({ length: 9 }, (_, i) => `<path class="dot" d="M${652 + i * 20} 286l4 6-4 6-4-6z"/>`).join('');
  const body = `<rect width="880" height="320" rx="18" fill="${t.bg}"/><rect x=".5" y=".5" width="879" height="319" rx="17.5" fill="none" stroke="${t.line}"/>
<defs><radialGradient id="g" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${t.accent}" stop-opacity=".55"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<clipPath id="mc"><path d="M680 150l60-90 60 90-60 90z"/></clipPath><linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
<circle cx="740" cy="150" r="125" fill="url(#g)" class="glow"/>
<g class="m">${mark(680, 60, 3)}<g clip-path="url(#mc)"><rect class="sweep" x="660" y="40" width="60" height="230" fill="url(#sh)" transform="skewX(-15)"/></g></g>
${dots}
<text x="40" y="88" class="t">Moldova's data. One API.</text>
<text x="40" y="124" class="s">Prices, rates, fuel, courts, companies, laws,</text>
<text x="40" y="148" class="s">news and cinemas, read every day, served as JSON.</text>
<g transform="translate(40 218)">${rows}</g>
<circle cx="46" cy="290" r="5" class="live"/><text x="60" y="295" class="when">Live counts, ${day(counts.as_of)}</text>`;
  write('banner', theme, svg(880, 320, body, css, "Satelit: Moldova's data in one API"));
}

// ---------------------------------------------------------------- today: the rates, fuel caps, a price and the law digest
function today(t, theme, s) {
  const arrow = (p) => (p > 0 ? `<tspan fill="${t.up}">▲ ${p.toFixed(1)}%</tspan>` : p < 0 ? `<tspan fill="${t.down}">▼ ${Math.abs(p).toFixed(1)}%</tspan>` : `<tspan fill="${t.muted}">0.0%</tspan>`);
  const eur = s.rates.find((r) => r.code === 'EUR'), usd = s.rates.find((r) => r.code === 'USD');
  const tiles = [
    ['EUR', lei(eur.value), 'lei', eur.change_7d_pct, 'BNM rate'],
    ['USD', lei(usd.value), 'lei', usd.change_7d_pct, 'BNM rate'],
    ['A95', lei(s.fuel.cap.a95), 'lei/l', null, 'ANRE price cap'],
    ['Diesel', lei(s.fuel.cap.diesel), 'lei/l', null, 'ANRE price cap'],
  ];
  const w = 404, h = 92, gap = 16;
  const tileSvg = tiles.map(([k, v, u, ch, src], i) => {
    const x = 28 + (i % 2) * (w + gap), y = 70 + Math.floor(i / 2) * (h + 12);
    return `<g class="tile" style="animation-delay:${i * 0.12}s"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${t.card}" stroke="${t.line}"/>
<text x="${x + 20}" y="${y + 34}" class="k">${k}</text><text x="${x + 20}" y="${y + 74}" class="v">${v}<tspan class="u"> ${u}</tspan></text>
<text x="${x + w - 20}" y="${y + 34}" class="src" text-anchor="end">${src}</text>${ch == null ? '' : `<text x="${x + w - 20}" y="${y + 72}" class="chg" text-anchor="end">7 days ${arrow(ch)}</text>`}</g>`;
  }).join('');
  const css = `.h{font:700 22px ${FONT};fill:${t.text}}.d{font:400 15px ${FONT};fill:${t.muted}}.k{font:600 16px ${FONT};fill:${t.muted};letter-spacing:.6px}.v{font:700 34px ${FONT};fill:${t.text};letter-spacing:-.4px}.u{font:500 17px ${FONT};fill:${t.muted}}.src{font:400 15px ${FONT};fill:${t.muted}}.chg{font:600 16px ${FONT};fill:${t.muted}}
.row{font:400 17px ${FONT};fill:${t.text}}.acc{fill:${t.accent};font-weight:600}.foot{font:400 13.5px ${FONT};fill:${t.muted}}.tile{animation:in .7s ease-out both}@keyframes in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.live{fill:${t.down};animation:blink 2s infinite}@keyframes blink{50%{opacity:.25}}`;
  const body = `<rect width="880" height="370" rx="18" fill="${t.bg}"/><rect x=".5" y=".5" width="879" height="369" rx="17.5" fill="none" stroke="${t.line}"/>
<circle cx="36" cy="40" r="5" class="live"/><text x="50" y="47" class="h">Moldova today</text><text x="852" y="46" class="d" text-anchor="end">${day(s.updated_at)}</text>
${tileSvg}
<text x="28" y="298" class="row"><tspan class="acc">Price of the day</tspan>   ${esc(s.price.name)} from ${lei(s.price.min_price)} lei, at ${esc(s.price.store)}</text>
<text x="28" y="328" class="row"><tspan class="acc">Monitorul Oficial</tspan>   ${s.law.acts} new acts on ${day(s.law.date)}</text>
<text x="852" y="352" class="foot" text-anchor="end">Rates: Banca Națională a Moldovei, bnm.md, CC BY 4.0</text>`;
  write('today', theme, svg(880, 370, body, css, `Moldova today: EUR ${eur.value} lei, USD ${usd.value} lei`));
}

// ---------------------------------------------------------------- numbers: what the API holds, counted every hour
function numbers(t, theme, c) {
  const cells = [
    [c.products, 'products', 'priced in shops'], [c.price_points, 'price points', `since ${day(c.price_history_from)}`],
    [c.court_hearings, 'court hearings', `${num(c.court_cases)} cases`], [c.companies, 'companies', `${num(c.company_contracts)} contracts`],
    [c.acts, 'laws and acts', `since ${c.acts_from.slice(0, 4)}`], [c.citizenship_dossiers, 'citizenship files', `${num(c.citizenship_orders)} orders`],
    [c.movies_films, 'films', `${num(c.movies_series)} series`], [c.geo_houses, 'addresses', `${num(c.geo_streets)} streets`],
  ];
  const cols = 4, w = 199, h = 104, gap = 12;
  const g = cells.map(([v, k, sub], i) => {
    const x = 24 + (i % cols) * (w + gap), y = 70 + Math.floor(i / cols) * (h + gap);
    return `<g class="c" style="animation-delay:${(i * 0.08).toFixed(2)}s"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${t.card}" stroke="${t.line}"/>
<text x="${x + 16}" y="${y + 42}" class="v">${num(v)}</text><text x="${x + 16}" y="${y + 68}" class="k">${esc(k)}</text><text x="${x + 16}" y="${y + 90}" class="s">${esc(sub)}</text></g>`;
  }).join('');
  const css = `.h{font:700 22px ${FONT};fill:${t.text}}.d{font:400 15px ${FONT};fill:${t.muted}}.v{font:700 27px ${FONT};fill:${t.accent};letter-spacing:-.4px}.k{font:600 16px ${FONT};fill:${t.text}}.s{font:400 14.5px ${FONT};fill:${t.muted}}
.c{animation:in .6s ease-out both}@keyframes in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`;
  const body = `<rect width="880" height="320" rx="18" fill="${t.bg}"/><rect x=".5" y=".5" width="879" height="319" rx="17.5" fill="none" stroke="${t.line}"/>
<text x="24" y="46" class="h">What is inside</text><text x="856" y="46" class="d" text-anchor="end">Counted ${day(c.as_of)}</text>${g}`;
  write('numbers', theme, svg(880, 320, body, css, 'What the Satelit API holds'));
}

// ---------------------------------------------------------------- terminal: a command typed, then its real output
function terminal(t, theme, s) {
  const eur = s.rates.find((r) => r.code === 'EUR'), usd = s.rates.find((r) => r.code === 'USD');
  const pct = (p) => `${p > 0 ? '+' : ''}${p.toFixed(1)}%`;
  const cmd = 'satelit rates';
  const out = ['CODE  LEI      7 DAYS', `EUR   ${eur.value.toFixed(4)}  ${pct(eur.change_7d_pct)}`, `USD   ${usd.value.toFixed(4)}  ${pct(usd.change_7d_pct)}`];
  const total = 9, typeEnd = 2.2; // seconds per loop, typing ends at
  const lines = out.map((l, i) => `<text x="24" y="${126 + i * 28}" class="o${i === 0 ? ' hd' : ''}">${esc(l).replace(/ /g, '&#160;')}</text>`).join('');
  const css = `.p{font:600 18px ${MONO};fill:${t.accent}}.cmd{font:500 18px ${MONO};fill:${t.text}}.o{font:400 18px ${MONO};fill:${t.text};opacity:0;animation:show ${total}s infinite}.hd{fill:${t.muted}}
.cmd{clip-path:inset(0 100% 0 0);animation:type ${total}s steps(${cmd.length}) infinite}
@keyframes type{0%{clip-path:inset(0 100% 0 0)}${((typeEnd / total) * 100).toFixed(1)}%,100%{clip-path:inset(0 0 0 0)}}
@keyframes show{0%,${(((typeEnd + 0.3) / total) * 100).toFixed(1)}%{opacity:0}${(((typeEnd + 0.5) / total) * 100).toFixed(1)}%,92%{opacity:1}100%{opacity:0}}
.cur{fill:${t.accent};animation:blink 1s steps(1) infinite}@keyframes blink{50%{opacity:0}}.ttl{font:500 14px ${FONT};fill:${t.muted}}`;
  const body = `<rect width="420" height="230" rx="14" fill="${t.code}"/><rect x=".5" y=".5" width="419" height="229" rx="13.5" fill="none" stroke="${t.line}"/>
<circle cx="22" cy="22" r="6" fill="#E5735B"/><circle cx="42" cy="22" r="6" fill="#F0B14E"/><circle cx="62" cy="22" r="6" fill="#5BBF8A"/><text x="398" y="27" class="ttl" text-anchor="end">satelit-go CLI</text>
<text x="24" y="80" class="p">$</text><text x="44" y="80" class="cmd">${cmd}</text><rect x="${44 + cmd.length * 10.85 + 4}" y="64" width="10" height="20" class="cur"/>
${lines}`;
  write('terminal', theme, svg(420, 230, body, css, `satelit rates: EUR ${eur.value} lei`));
}

// ---------------------------------------------------------------- one card per repo
const REPOS = JSON.parse(readFileSync(join(ROOT, 'scripts', 'repos.json'), 'utf8'));
function card(t, theme, r) {
  const css = `.n{font:700 19px ${FONT};fill:${t.accent}}.d{font:400 14.5px ${FONT};fill:${t.text}}.m{font:400 13.5px ${FONT};fill:${t.muted}}.tag{font:600 12px ${FONT};fill:${t.muted};letter-spacing:.5px}
.edge{stroke:${t.accent};stroke-opacity:0;animation:e 5s ease-in-out infinite ${r.delay || 0}s}@keyframes e{0%,70%,100%{stroke-opacity:0}85%{stroke-opacity:.6}}`;
  const lines = r.lines.map((l, i) => `<text x="20" y="${78 + i * 22}" class="d">${esc(l)}</text>`).join('');
  const body = `<rect x=".5" y=".5" width="419" height="159" rx="14" fill="${t.card}" stroke="${t.line}"/><rect x=".5" y=".5" width="419" height="159" rx="14" fill="none" class="edge" stroke-width="1.5"/>
${mark(20, 22, 0.42)}<text x="46" y="42" class="n">${esc(r.name)}</text><text x="400" y="41" class="tag" text-anchor="end">${esc(r.tag)}</text>
${lines}<text x="20" y="140" class="m">${esc(r.tested)}</text>`;
  write(`repo-${r.name}`, theme, svg(420, 160, body, css, `${r.name}: ${r.lines.join(' ')}`));
}

const [sample, stats] = await Promise.all([get('/sample'), get('/stats')]);
for (const [theme, t] of Object.entries(THEMES)) {
  banner(t, theme, stats.counts);
  today(t, theme, sample);
  numbers(t, theme, stats.counts);
  terminal(t, theme, sample);
  REPOS.forEach((r, i) => card(t, theme, { ...r, delay: (i % 6) * 0.8 }));
}
// the README from its template: picture addresses stamped with the day, so GitHub's image cache fetches new copies
const A = 'https://raw.githubusercontent.com/Satelit-Moldova/.github/main/profile/assets';
const V = sample.updated_at.slice(0, 13).replace(/[-T:]/g, '');
const pic = (name, alt, href) => `<a href="${href}"><picture><source media="(prefers-color-scheme: dark)" srcset="${A}/${name}-dark.svg?v=${V}"><img alt="${esc(alt)}" src="${A}/${name}-light.svg?v=${V}" width="49%"></picture></a>`;
const readme = readFileSync(join(ROOT, 'scripts', 'README.tpl.md'), 'utf8')
  .replace(/\{\{CARDS:([^}]+)\}\}/g, (_, list) => '<p>\n' + list.split(',').map((n) => { const r = REPOS.find((x) => x.name === n); return pic(`repo-${n}`, `${n}: ${r.lines.join(' ')}`, `https://github.com/Satelit-Moldova/${n}`); }).join('\n') + '\n</p>')
  .replaceAll('{{A}}', A).replaceAll('{{V}}', V)
  .replaceAll('{{SHOPS}}', String(stats.counts.shops_open)).replaceAll('{{FUEL}}', String(stats.counts.fuel_networks));
writeFileSync(join(ROOT, 'profile', 'README.md'), readme);
console.log(`profile assets written: EUR ${sample.rates.find((r) => r.code === 'EUR').value}, products ${stats.counts.products}`);
