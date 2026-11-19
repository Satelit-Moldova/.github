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
  const rows = facts.map(([v, l], i) => `<g class="f f${i}"><text x="0" y="0" class="big">${num(v)}</text><text x="0" y="30" class="lbl">${esc(l)}</text></g>`).join('');
  // each fact is shown for its slot of the loop: slide up in, hold, slide up out
  const keys = facts.map((_, i) => {
    const a = (i * step / total) * 100, b = ((i * step + 0.4) / total) * 100, c = (((i + 1) * step - 0.4) / total) * 100, d = (((i + 1) * step) / total) * 100;
    return `.f${i}{animation:k${i} ${total}s infinite}@keyframes k${i}{0%,${a.toFixed(2)}%{opacity:0;transform:translateY(18px)}${b.toFixed(2)}%,${c.toFixed(2)}%{opacity:1;transform:translateY(0)}${d.toFixed(2)}%,100%{opacity:0;transform:translateY(-18px)}}`;
  }).join('');
  const css = `.t{font:700 46px ${FONT};fill:${t.text};letter-spacing:-.5px}.s{font:400 20px ${FONT};fill:${t.muted}}.big{font:700 40px ${FONT};fill:${t.accent};letter-spacing:-.5px}.lbl{font:400 17px ${FONT};fill:${t.muted}}.f{opacity:0}${keys}
.m{transform-box:fill-box;transform-origin:center;animation:float 6s ease-in-out infinite}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.glow{animation:pulse 6s ease-in-out infinite}@keyframes pulse{0%,100%{opacity:.35}50%{opacity:.7}}
.sweep{animation:sw 7s ease-in-out infinite}@keyframes sw{0%,60%{transform:translateX(-160px)}100%{transform:translateX(160px)}}
.dot{fill:${t.accent};opacity:.18}.live{fill:${t.down};animation:blink 2s infinite}@keyframes blink{50%{opacity:.25}}`;
  const dots = Array.from({ length: 13 }, (_, i) => `<path class="dot" d="M${900 + i * 22} 312l4 6-4 6-4-6z"/>`).join('');
  const body = `<rect width="1200" height="340" rx="20" fill="${t.bg}"/><rect x=".5" y=".5" width="1199" height="339" rx="19.5" fill="none" stroke="${t.line}"/>
<defs><radialGradient id="g" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${t.accent}" stop-opacity=".55"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<clipPath id="mc"><path d="M920 170l70-105 70 105-70 105z"/></clipPath><linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
<circle cx="990" cy="170" r="150" fill="url(#g)" class="glow"/>
<g class="m">${mark(920, 65, 3.5)}<g clip-path="url(#mc)"><rect class="sweep" x="900" y="40" width="70" height="270" fill="url(#sh)" transform="skewX(-15)"/></g></g>
${dots}
<text x="64" y="104" class="t">Moldova's data. One API.</text>
<text x="64" y="142" class="s">Prices, rates, fuel, courts, companies, laws, news and cinemas,</text>
<text x="64" y="168" class="s">read every day and served as clean JSON at api.satelit.md</text>
<g transform="translate(64 236)">${rows}</g>
<circle cx="70" cy="306" r="5" class="live"/><text x="84" y="311" class="lbl" style="font-size:14px">Live counts, ${day(counts.as_of)}</text>`;
  write('banner', theme, svg(1200, 340, body, css, "Satelit: Moldova's data in one API"));
}

// ---------------------------------------------------------------- today: the rates, fuel caps, a price and the law digest
function today(t, theme, s) {
  const arrow = (p) => (p > 0 ? `<tspan fill="${t.up}">▲ ${p.toFixed(1)}%</tspan>` : p < 0 ? `<tspan fill="${t.down}">▼ ${Math.abs(p).toFixed(1)}%</tspan>` : `<tspan fill="${t.muted}">0.0%</tspan>`);
  const eur = s.rates.find((r) => r.code === 'EUR'), usd = s.rates.find((r) => r.code === 'USD');
  const tiles = [
    ['EUR', lei(eur.value), 'lei', `7 days ${''}`, eur.change_7d_pct, 'BNM official rate'],
    ['USD', lei(usd.value), 'lei', '', usd.change_7d_pct, 'BNM official rate'],
    ['A95', lei(s.fuel.cap.a95), 'lei/l', '', null, 'ANRE price cap'],
    ['Diesel', lei(s.fuel.cap.diesel), 'lei/l', '', null, 'ANRE price cap'],
  ];
  const w = 270, gap = 16, x0 = 24;
  const tileSvg = tiles.map(([k, v, u, , ch, src], i) => {
    const x = x0 + i * (w + gap);
    return `<g class="tile" style="animation-delay:${i * 0.12}s"><rect x="${x}" y="64" width="${w}" height="124" rx="14" fill="${t.card}" stroke="${t.line}"/>
<text x="${x + 20}" y="96" class="k">${k}</text><text x="${x + 20}" y="144" class="v">${v}<tspan class="u"> ${u}</tspan></text>
<text x="${x + 20}" y="172" class="src">${src}${ch == null ? '' : ' · 7 days '}${ch == null ? '' : arrow(ch)}</text></g>`;
  }).join('');
  const css = `.h{font:700 22px ${FONT};fill:${t.text}}.d{font:400 15px ${FONT};fill:${t.muted}}.k{font:600 15px ${FONT};fill:${t.muted};letter-spacing:.6px}.v{font:700 36px ${FONT};fill:${t.text};letter-spacing:-.4px}.u{font:500 16px ${FONT};fill:${t.muted}}.src{font:400 13.5px ${FONT};fill:${t.muted}}
.row{font:400 15.5px ${FONT};fill:${t.text}}.row b,.acc{fill:${t.accent};font-weight:600}.tile{animation:in .7s ease-out both}@keyframes in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.live{fill:${t.down};animation:blink 2s infinite}@keyframes blink{50%{opacity:.25}}`;
  const body = `<rect width="1200" height="290" rx="20" fill="${t.bg}"/><rect x=".5" y=".5" width="1199" height="289" rx="19.5" fill="none" stroke="${t.line}"/>
<circle cx="32" cy="36" r="5" class="live"/><text x="46" y="42" class="h">Moldova today</text><text x="1176" y="42" class="d" text-anchor="end">${day(s.updated_at)}, from GET /v1/sample</text>
${tileSvg}
<text x="24" y="226" class="row"><tspan class="acc">Price of the day</tspan>  ${esc(s.price.name)} from ${lei(s.price.min_price)} lei, at ${esc(s.price.store)}</text>
<text x="24" y="256" class="row"><tspan class="acc">Monitorul Oficial</tspan>  ${s.law.acts} new acts on ${day(s.law.date)}</text>
<text x="1176" y="256" class="src" text-anchor="end">Rates: Banca Națională a Moldovei, bnm.md, CC BY 4.0</text>`;
  write('today', theme, svg(1200, 290, body, css, `Moldova today: EUR ${eur.value} lei, USD ${usd.value} lei`));
}

// ---------------------------------------------------------------- numbers: what the API holds, counted every hour
function numbers(t, theme, c) {
  const cells = [
    [c.products, 'products', 'priced in shops'], [c.price_points, 'price points', `since ${day(c.price_history_from)}`],
    [c.court_hearings, 'court hearings', `${num(c.court_cases)} cases`], [c.companies, 'companies', `${num(c.company_contracts)} public contracts`],
    [c.acts, 'laws and acts', `since ${c.acts_from.slice(0, 4)}`], [c.citizenship_dossiers, 'citizenship dossiers', `${num(c.citizenship_orders)} orders`],
    [c.movies_films, 'films', `${num(c.movies_series)} series`], [c.geo_houses, 'addresses', `${num(c.geo_streets)} streets`],
  ];
  const cols = 4, w = 279, h = 104, gap = 12;
  const g = cells.map(([v, k, sub], i) => {
    const x = 24 + (i % cols) * (w + gap), y = 64 + Math.floor(i / cols) * (h + gap);
    return `<g class="c" style="animation-delay:${(i * 0.08).toFixed(2)}s"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${t.card}" stroke="${t.line}"/>
<text x="${x + 18}" y="${y + 46}" class="v">${num(v)}</text><text x="${x + 18}" y="${y + 72}" class="k">${esc(k)}</text><text x="${x + 18}" y="${y + 92}" class="s">${esc(sub)}</text></g>`;
  }).join('');
  const css = `.h{font:700 22px ${FONT};fill:${t.text}}.d{font:400 15px ${FONT};fill:${t.muted}}.v{font:700 30px ${FONT};fill:${t.accent};letter-spacing:-.4px}.k{font:600 15px ${FONT};fill:${t.text}}.s{font:400 13.5px ${FONT};fill:${t.muted}}
.c{animation:in .6s ease-out both}@keyframes in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`;
  const body = `<rect width="1200" height="320" rx="20" fill="${t.bg}"/><rect x=".5" y=".5" width="1199" height="319" rx="19.5" fill="none" stroke="${t.line}"/>
<text x="24" y="42" class="h">What is inside</text><text x="1176" y="42" class="d" text-anchor="end">Counted ${day(c.as_of)}, from GET /v1/stats</text>${g}`;
  write('numbers', theme, svg(1200, 320, body, css, 'What the Satelit API holds'));
}

// ---------------------------------------------------------------- terminal: a command typed, then its real output
function terminal(t, theme, s) {
  const eur = s.rates.find((r) => r.code === 'EUR'), usd = s.rates.find((r) => r.code === 'USD');
  const pct = (p) => `${p > 0 ? '+' : ''}${p.toFixed(1)}%`;
  const cmd = 'satelit rates';
  const out = ['CODE  LEI      7 DAYS   DATE', `EUR   ${eur.value.toFixed(4)}  ${pct(eur.change_7d_pct).padEnd(7)}  ${eur.date}`, `USD   ${usd.value.toFixed(4)}  ${pct(usd.change_7d_pct).padEnd(7)}  ${usd.date}`];
  const total = 9; // seconds per loop
  const typeEnd = 2.2;
  const lines = out.map((l, i) => `<text x="28" y="${120 + i * 26}" class="o${i === 0 ? ' hd' : ''}" style="animation-delay:0s">${esc(l).replace(/ /g, '&#160;')}</text>`).join('');
  const css = `.p{font:500 16px ${MONO};fill:${t.accent}}.cmd{font:500 16px ${MONO};fill:${t.text}}.o{font:400 16px ${MONO};fill:${t.text};opacity:0;animation:show ${total}s infinite}.hd{fill:${t.muted}}
.cmd{clip-path:inset(0 100% 0 0);animation:type ${total}s steps(${cmd.length}) infinite}
@keyframes type{0%{clip-path:inset(0 100% 0 0)}${((typeEnd / total) * 100).toFixed(1)}%,100%{clip-path:inset(0 0 0 0)}}
@keyframes show{0%,${(((typeEnd + 0.3) / total) * 100).toFixed(1)}%{opacity:0}${(((typeEnd + 0.5) / total) * 100).toFixed(1)}%,92%{opacity:1}100%{opacity:0}}
.cur{fill:${t.accent};animation:blink 1s steps(1) infinite}@keyframes blink{50%{opacity:0}}.dot{opacity:.8}.ttl{font:500 13px ${FONT};fill:${t.muted}}`;
  const body = `<rect width="590" height="220" rx="14" fill="${t.code}"/><rect x=".5" y=".5" width="589" height="219" rx="13.5" fill="none" stroke="${t.line}"/>
<circle cx="24" cy="22" r="6" fill="#E5735B" class="dot"/><circle cx="44" cy="22" r="6" fill="#F0B14E" class="dot"/><circle cx="64" cy="22" r="6" fill="#5BBF8A" class="dot"/><text x="295" y="27" class="ttl" text-anchor="middle">go install github.com/Satelit-Moldova/satelit-go/cmd/satelit@latest</text>
<text x="28" y="80" class="p">$</text><text x="46" y="80" class="cmd">${cmd}</text><rect x="${46 + cmd.length * 9.6 + 4}" y="66" width="9" height="18" class="cur"/>
${lines}`;
  write('terminal', theme, svg(590, 220, body, css, `satelit rates: EUR ${eur.value} lei`));
}

// ---------------------------------------------------------------- one card per repo
const REPOS = JSON.parse(readFileSync(join(ROOT, 'scripts', 'repos.json'), 'utf8'));
function card(t, theme, r) {
  const css = `.n{font:700 19px ${FONT};fill:${t.accent}}.d{font:400 14.5px ${FONT};fill:${t.text}}.m{font:400 13px ${FONT};fill:${t.muted}}.tag{font:600 12px ${FONT};fill:${t.muted};letter-spacing:.5px}
.b{transition:none}.edge{stroke:${t.accent};stroke-opacity:0;animation:e 5s ease-in-out infinite ${r.delay || 0}s}@keyframes e{0%,70%,100%{stroke-opacity:0}85%{stroke-opacity:.6}}`;
  const lines = r.lines.map((l, i) => `<text x="22" y="${76 + i * 21}" class="d">${esc(l)}</text>`).join('');
  const body = `<rect x=".5" y=".5" width="579" height="149" rx="14" fill="${t.card}" stroke="${t.line}"/><rect x=".5" y=".5" width="579" height="149" rx="14" fill="none" class="edge" stroke-width="1.5"/>
${mark(22, 20, 0.42)}<text x="48" y="40" class="n">${esc(r.name)}</text><text x="558" y="40" class="tag" text-anchor="end">${esc(r.tag)}</text>
${lines}<text x="22" y="132" class="m">${esc(r.tested)}</text>`;
  write(`repo-${r.name}`, theme, svg(580, 150, body, css, `${r.name}: ${r.lines.join(' ')}`));
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
