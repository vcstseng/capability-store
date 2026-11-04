import { readRoute, routeSearch } from './portal.js';

const copy = {
  zh: {
    title: '能力便利商店', tagline: '為工作找能力', skip: '跳到工作探索',
    heading: '你想改善什麼工作？', intro: '探索可支援這項工作的工具、Skills 與 Agent 範例，作為研究與試作的起點。',
    themes: '個可探索能力主題', resources: '個相關候選資源', explore: '從工作找能力',
    exploreHint: '先選一個領域，看看有哪些能力可支援其中的工作。', countLabel: '能力主題數',
    visible: '僅列有相關候選的分類；同一能力可支援不同工作，分類筆數不相加。', selected: '已選領域', clear: '清除選擇',
    next: '此版先完成工作選擇；能力列表將於下一階段開放。',
    groupCount: (n, r) => `已整理 ${n} 個能力主題、${r} 個候選資源。`,
    selection: name => `已選擇：${name}。`, clearStatus: '已清除工作選擇。',
    trending: 'GitHub 熱門快照', trendingHint: '額外看看受到關注的專案。這是保存的榜單，不會即時更新。',
    snapshot: '週榜快照', weekly: '本週新增 Stars', show: n => `顯示全部 ${n} 筆`, collapse: '收起至 3 筆',
    trendNote: '保留榜單原始順序；熱度不代表已驗證或適合你的工作。', source: '查看榜單來源 ↗',
    noDescription: '榜單未提供介紹。', github: '在 GitHub 查看 ↗', newTab: '在新分頁開啟',
    footer: '先探索，再確認是否適用。候選尚未安裝或實測。', repo: '專案與資料 ↗',
    loading: '正在讀取資料…', error: '暫時無法載入資料。', retry: '重新載入',
    trendError: '熱門榜單暫時無法載入；你仍可使用工作入口。',
    prototype: 'Layer 1 · 探索入口',
  },
  en: {
    title: 'Capability Store', tagline: 'Capabilities for your work', skip: 'Skip to work exploration',
    heading: 'What work would you like to improve?', intro: 'Explore tools, skills and agent examples that can support the work — a starting point for research and prototyping.',
    themes: 'explorable capability themes', resources: 'related resource candidates', explore: 'Find capabilities by work',
    exploreHint: 'Choose an area to explore capabilities that support steps within the work.', countLabel: 'Capability themes',
    visible: 'Only categories with related candidates are shown. Capabilities can serve several areas; category counts do not add up.', selected: 'Selected area', clear: 'Clear selection',
    next: 'Work selection is ready in this version. Capability lists are coming next.',
    groupCount: (n, r) => `${n} capability themes and ${r} resource candidates curated.`,
    selection: name => `Selected: ${name}.`, clearStatus: 'Work selection cleared.',
    trending: 'GitHub Trending snapshot', trendingHint: 'An extra way to discover projects. This is a saved ranking, not a live feed.',
    snapshot: 'Weekly snapshot', weekly: 'stars this week', show: n => `Show all ${n} repos`, collapse: 'Show first 3',
    trendNote: 'In source order. Popularity does not establish suitability or validation.', source: 'View ranking source ↗',
    noDescription: 'No description provided in the ranking.', github: 'View on GitHub ↗', newTab: 'opens in a new tab',
    footer: 'Explore first, then assess fit. Candidates have not been installed or tested.', repo: 'Project & data ↗',
    loading: 'Loading the catalog…', error: 'The catalog could not be loaded.', retry: 'Try again',
    trendError: 'Trending is unavailable. You can still explore work areas.',
    prototype: 'Layer 1 · Explore',
  },
};


const app = document.querySelector('#app');
let portal, trending, portalFailed = false, trendFailed = false;
let preferred = 'zh';
try { preferred = localStorage.getItem('capability-store-language') || 'zh'; } catch {}
let state = readRoute(location.search, [], preferred);
const e = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const label = work => work.label[state.lang];
const safeUrl = value => { try { const u = new URL(value); return u.protocol === 'https:' ? u.href : '#'; } catch { return '#'; } };
const external = (url, text, className = '') => `<a class="${className}" href="${e(safeUrl(url))}" target="_blank" rel="noopener noreferrer" aria-label="${e(text)} (${copy[state.lang].newTab})">${e(text)}</a>`;

function updateState(next, replace = false) {
  state = { ...state, ...next };
  history[replace ? 'replaceState' : 'pushState']({}, '', location.pathname + routeSearch(state) + location.hash);
}
function announce(text) { document.querySelector('#announcer').textContent = text; }
function selectedMarkup(t) {
  const work = portal?.works.find(work => work.id === state.work);
  return work ? `<div class="selection-content"><div><p class="micro-label">${t.selected}</p><h3>${e(label(work))}</h3><p>${t.groupCount(work.theme_count, work.resource_count)}</p><p class="selection-examples">${e(work.examples.map(example => example[state.lang]).join(state.lang === 'zh' ? '、' : ' · '))}</p></div><button class="text-button" data-clear>${t.clear}</button></div><p class="next-note">${t.next}</p>` : '';
}
function renderWorkSelection() {
  const container = document.querySelector('#selected-work');
  container.hidden = !state.work;
  container.innerHTML = selectedMarkup(copy[state.lang]);
  document.querySelectorAll('[data-work]').forEach(button => {
    const selected = button.dataset.work === state.work;
    button.setAttribute('aria-pressed', String(selected));
    button.querySelector('.work-arrow').textContent = selected ? '✓' : '+';
  });
}
function render() {
  const t = copy[state.lang];
  document.documentElement.lang = state.lang === 'zh' ? 'zh-Hant' : 'en';
  document.title = `${t.title} · ${state.lang === 'zh' ? '為工作找能力' : 'Capabilities for your work'}`;
  document.querySelector('meta[name="description"]').content = t.intro;
  const selected = portal?.works.find(w => w.id === state.work);
  app.innerHTML = `<div class="app-shell">
    <a class="skip-link" href="#work-heading">${t.skip}</a>
    <header class="masthead">
      <a class="wordmark" href="?lang=${state.lang}" data-home>${t.title}<span class="brand-dot" aria-hidden="true"></span></a>
      <div class="masthead-tools"><span class="masthead-note">${t.tagline}</span><nav class="language-switch" aria-label="Language">
        <button type="button" lang="zh-Hant" data-language="zh" aria-pressed="${state.lang === 'zh'}">中文</button>
        <button type="button" lang="en" data-language="en" aria-pressed="${state.lang === 'en'}">English</button>
      </nav></div>
    </header>
    <main>
      <section class="intro" aria-labelledby="page-title"><p class="eyebrow">CAPABILITY STORE</p><h1 id="page-title">${t.heading}</h1><p class="intro-text">${t.intro}</p>
      ${portal ? `<div class="dataset-counts"><span><strong>${portal.capability_count}</strong> ${t.themes}</span><span><strong>${portal.resource_count}</strong> ${t.resources}</span></div>` : ''}</section>
      <section class="work-section" aria-labelledby="work-heading">
        <div class="section-header"><div><h2 id="work-heading" tabindex="-1">${t.explore}</h2><p>${t.exploreHint}</p></div></div>
        <div id="selected-work" class="selection-panel" ${selected ? '' : 'hidden'}>${selectedMarkup(t)}</div>
        ${portal ? `${portal.groups.map(group => {
          const works = portal.works.filter(work => work.group === group.id);
          if (!works.length) return '';
          return `<section class="work-group" aria-labelledby="group-${e(group.id)}"><div class="group-heading"><h3 id="group-${e(group.id)}">${e(group.label[state.lang])}</h3><span>${state.lang === 'zh' ? '能力主題數' : 'Capability themes'}</span></div><div class="work-grid">${works.map(work => `<button type="button" class="work-card" data-work="${e(work.id)}" aria-pressed="${work.id === state.work}" aria-label="${e(label(work))}, ${work.theme_count} ${t.themes}"><span class="work-copy"><span class="work-label">${e(label(work))}</span><span class="work-examples">${state.lang === 'zh' ? '例如：' : 'e.g. '}${e(work.examples.map(example => example[state.lang]).join(state.lang === 'zh' ? '、' : ' · '))}</span></span><span class="work-count">${work.theme_count}<span class="work-arrow" aria-hidden="true">${work.id === state.work ? '✓' : '+'}</span></span></button>`).join('')}</div></section>`;
        }).join('')}<p class="section-footnote">${t.visible}</p><p class="reference-note">${state.lang === 'zh' ? '分類沿用 ' : 'Categories follow '}${external('https://vcstseng.github.io/99-problems/pages/problem-map/index.html', '99 Problems ↗')}<span>${state.lang === 'zh' ? '；候選可支援的步驟與適用性仍需確認。' : '; supported steps and suitability still need assessment.'}</span></p>` : `<div class="load-state" role="status"><p>${portalFailed ? t.error : t.loading}</p>${portalFailed ? `<button class="outline-button" data-retry="portal">${t.retry}</button>` : ''}</div>`}
      </section>
      <section class="trending-section" aria-labelledby="trending-heading">
        <div class="section-header"><div><h2 id="trending-heading">${t.trending}</h2><p>${t.trendingHint}</p></div>
        ${trending ? `<button class="outline-button trending-toggle" aria-expanded="${state.expanded}" aria-controls="trending-list" data-expand>${state.expanded ? t.collapse : t.show(trending.repositories.length)}</button>` : ''}</div>
        ${trending ? `<div class="trending-context"><span>${t.snapshot} · <time datetime="${e(trending.observed_at)}">${new Intl.DateTimeFormat(state.lang === 'en' ? 'en-GB' : 'zh-TW', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(trending.observed_at))}</time></span>${external(trending.source_url, t.source)}</div>
        <ol id="trending-list" class="trending-list">${trending.repositories.slice(0, state.expanded ? undefined : 3).map(repo => `<li class="trending-row"><span class="rank" aria-hidden="true">${String(repo.rank_in_snapshot).padStart(2, '0')}</span><div class="trending-copy">${external(repo.url, repo.repository, 'repo-link')}<p ${repo.summary[state.lang] ? '' : 'class="missing-description"'}>${e(repo.summary[state.lang] || t.noDescription)}</p></div><div class="star-signal"><span class="stars">+${new Intl.NumberFormat(state.lang === 'en' ? 'en' : 'zh-TW').format(repo.weekly_stars)}</span><span>${t.weekly}</span></div></li>`).join('')}</ol><p class="section-footnote">${t.trendNote}</p>` : `<div class="load-state" role="status"><p>${trendFailed ? t.trendError : t.loading}</p>${trendFailed ? `<button class="outline-button" data-retry="trending">${t.retry}</button>` : ''}</div>`}
      </section>
    </main>
    <footer><p>${t.footer}</p><div><span>${t.prototype}</span>${external('https://github.com/vcstseng/capability-store', t.repo)}</div></footer>
    <p id="announcer" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></p>
  </div>`;
}

app.addEventListener('click', event => {
  const target = event.target.closest('button,a');
  if (!target) return;
  if (target.hasAttribute('data-language')) {
    const scroll = window.scrollY;
    updateState({ lang: target.dataset.language }, true);
    try { localStorage.setItem('capability-store-language', state.lang); } catch {}
    render();
    document.querySelector(`[data-language="${state.lang}"]`).focus({ preventScroll: true });
    window.scrollTo(0, scroll);
  } else if (target.hasAttribute('data-work')) {
    updateState({ work: state.work === target.dataset.work ? null : target.dataset.work });
    renderWorkSelection();
    announce(state.work ? copy[state.lang].selection(label(portal.works.find(w => w.id === state.work))) : copy[state.lang].clearStatus);
    const panel = document.querySelector('#selected-work');
    if (!panel.hidden && panel.getBoundingClientRect().bottom < 0) panel.scrollIntoView({ block: 'start' });
  } else if (target.hasAttribute('data-clear')) {
    const previous = state.work;
    updateState({ work: null }); renderWorkSelection();
    document.querySelector(`[data-work="${previous}"]`)?.focus({ preventScroll: true });
    announce(copy[state.lang].clearStatus);
  } else if (target.hasAttribute('data-expand')) {
    updateState({ expanded: !state.expanded }); render();
    document.querySelector('[data-expand]').focus({ preventScroll: true });
  } else if (target.hasAttribute('data-retry')) load(target.dataset.retry);
  else if (target.hasAttribute('data-home') && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
    event.preventDefault(); updateState({ work: null, expanded: false }); render(); window.scrollTo(0, 0);
  }
});
window.addEventListener('popstate', () => { state = readRoute(location.search, portal?.works.map(w => w.id) || [], state.lang); render(); });

async function load(part) {
  if (part === 'portal') portalFailed = false; else trendFailed = false;
  render();
  try {
    const response = await fetch(new URL(`../data/${part}.json`, import.meta.url));
    if (!response.ok) throw new Error('Unable to load catalog');
    const data = await response.json();
    if (part === 'portal') {
      if (!Array.isArray(data.works) || !data.works.length) throw new Error('Invalid portal');
      portal = data;
      state = readRoute(location.search, portal.works.map(w => w.id), preferred);
      if (new URLSearchParams(location.search).get('work') && state.work) updateState({}, true);
    } else {
      if (!Array.isArray(data.repositories) || !data.repositories.length) throw new Error('Invalid Trending');
      trending = data;
    }
  } catch { if (part === 'portal') portalFailed = true; else trendFailed = true; }
  render();
}
render();
Promise.allSettled([load('portal'), load('trending')]);
