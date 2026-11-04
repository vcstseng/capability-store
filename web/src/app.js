import { readExploreRoute as readRoute, exploreSearch as routeSearch, positionKey, workResults } from './results.js';
import { copy } from './copy.js';

const app = document.querySelector('#app');
let portal, trending, results;
const failed = { portal: false, trending: false, results: false };
const loading = new Set();
let preferred = 'zh';
try { preferred = localStorage.getItem('capability-store-language') || 'zh'; } catch {}
let state = readRoute(location.search, [], preferred);
let positions = {};
try { positions = JSON.parse(sessionStorage.getItem('capability-store-positions') || '{}'); } catch {}
let pendingPosition = { top: Number(history.state?.scrollY || 0), focus: false, hash: location.hash };
history.scrollRestoration = 'manual';

const e = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const label = work => work.label[state.lang];
const locale = () => state.lang === 'en' ? 'en-GB' : 'zh-TW';
const safeUrl = value => { try { const u = new URL(value); return u.protocol === 'https:' ? u.href : '#'; } catch { return '#'; } };
const external = (url, text, className = '') => `<a class="${className}" href="${e(safeUrl(url))}" target="_blank" rel="noopener noreferrer" aria-label="${e(text)} (${copy[state.lang].newTab})">${e(text)}</a>`;
const href = patch => routeSearch({ ...state, ...patch });
const date = value => new Intl.DateTimeFormat(locale(), { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(value));
const TYPES = {
  mcp_tool: ['MCP 工具', 'MCP tool'], skill: ['Skill', 'Skill'], agent_example: ['Agent 範例', 'Agent example'],
  skill_collection: ['Skills 集合', 'Skills collection'], toolkit: ['工具套件', 'Toolkit'], application_example: ['應用範例', 'Application example'],
};

function savePosition(updateHistory = true) {
  positions[positionKey(state)] = window.scrollY;
  try { sessionStorage.setItem('capability-store-positions', JSON.stringify(positions)); } catch {}
  if (updateHistory) history.replaceState({ ...history.state, scrollY: window.scrollY }, '', location.href);
}
function updateState(next, replace = false) {
  savePosition();
  state = { ...state, ...next };
  history[replace ? 'replaceState' : 'pushState']({ scrollY: window.scrollY }, '', location.pathname + routeSearch(state) + location.hash);
}
function go(next, restore = false) {
  savePosition();
  state = { ...state, ...next };
  const top = restore ? positions[positionKey(state)] || 0 : 0;
  history.pushState({ scrollY: top }, '', location.pathname + routeSearch(state));
  pendingPosition = { top, focus: !restore };
  render(); ensureData();
}
function restorePosition() {
  if (!pendingPosition || !portal) return;
  if (state.view === 'results' && state.source === 'work' && state.work && !results && !failed.results) return;
  if (state.view === 'results' && state.source === 'trending' && !trending && !failed.trending) return;
  const target = pendingPosition;
  pendingPosition = null;
  requestAnimationFrame(() => {
    if (target.hash) {
      const element = document.getElementById(target.hash.slice(1));
      if (element) { element.scrollIntoView(); return; }
    }
    window.scrollTo(0, target.top);
    if (target.focus) document.querySelector('#page-title')?.focus({ preventScroll: true });
  });
}
function announce(text) { document.querySelector('#announcer').textContent = text; }
function selectedMarkup(t) {
  const work = portal?.works.find(work => work.id === state.work);
  return work ? `<div class="selection-content"><div><p class="micro-label">${t.selected}</p><h3>${e(label(work))}</h3><p>${t.groupCount(work.theme_count, work.resource_count)}</p><p class="selection-examples">${e(work.examples.map(example => example[state.lang]).join(state.lang === 'zh' ? '、' : ' · '))}</p></div><div class="selection-actions"><a class="primary-button" data-route="forward" href="${e(href({ view: 'results', source: 'work' }))}">${t.viewCapabilities}</a><button class="text-button" data-clear>${t.clear}</button></div></div>` : '';
}
function renderWorkSelection() {
  const container = document.querySelector('#selected-work');
  if (!container) return;
  container.hidden = !state.work;
  container.innerHTML = selectedMarkup(copy[state.lang]);
  document.querySelectorAll('[data-work]').forEach(button => {
    const selected = button.dataset.work === state.work;
    button.setAttribute('aria-pressed', String(selected));
    button.querySelector('.work-arrow').textContent = selected ? '✓' : '+';
  });
}
function loadState(part, message) {
  const t = copy[state.lang];
  return `<div class="load-state" role="status"><p>${failed[part] ? message || t.error : t.loading}</p>${failed[part] ? `<button class="outline-button" data-retry="${part}">${t.retry}</button>` : ''}</div>`;
}
function trendingRow(repo, full = false) {
  const t = copy[state.lang];
  return `<li class="trending-row" id="repo-${e(repo.repository.toLowerCase().replace('/', '--'))}"><span class="rank" aria-hidden="true">${String(repo.rank_in_snapshot).padStart(2, '0')}</span><div class="trending-copy"><div class="candidate-title">${external(repo.url, repo.repository, 'repo-link')}${full ? `<span class="type-tag">${t.githubProject}</span>` : ''}</div><p ${repo.summary[state.lang] ? '' : 'class="missing-description"'}>${e(repo.summary[state.lang] || t.noDescription)}</p>${full ? `<p class="candidate-origin">GitHub Trending · ${date(trending.observed_at)}</p>` : ''}</div><div class="star-signal"><span class="stars">${repo.weekly_stars == null ? '—' : '+' + new Intl.NumberFormat(locale()).format(repo.weekly_stars)}</span><span>${t.weekly}</span></div></li>`;
}
function portalContent(t) {
  const selected = portal?.works.find(w => w.id === state.work);
  return `<section class="intro" aria-labelledby="page-title"><p class="eyebrow">CAPABILITY STORE</p><h1 id="page-title" tabindex="-1">${t.heading}</h1><p class="intro-text">${t.intro}</p>
    ${portal ? `<div class="dataset-counts"><span><strong>${portal.capability_count}</strong> ${t.themes}</span><span><strong>${portal.resource_count}</strong> ${t.resources}</span></div>` : ''}</section>
    <section class="work-section" aria-labelledby="work-heading">
      <div class="section-header"><div><h2 id="work-heading" tabindex="-1">${t.explore}</h2><p>${t.exploreHint}</p></div></div>
      <div id="selected-work" class="selection-panel" ${selected ? '' : 'hidden'}>${selectedMarkup(t)}</div>
      ${portal ? `${portal.groups.map(group => {
        const works = portal.works.filter(work => work.group === group.id);
        if (!works.length) return '';
        return `<section class="work-group" aria-labelledby="group-${e(group.id)}"><div class="group-heading"><h3 id="group-${e(group.id)}">${e(group.label[state.lang])}</h3><span>${t.countLabel}</span></div><div class="work-grid">${works.map(work => `<button type="button" class="work-card" data-work="${e(work.id)}" aria-pressed="${work.id === state.work}" aria-label="${e(label(work))}, ${work.theme_count} ${t.themes}"><span class="work-copy"><span class="work-label">${e(label(work))}</span><span class="work-examples">${state.lang === 'zh' ? '例如：' : 'e.g. '}${e(work.examples.map(example => example[state.lang]).join(state.lang === 'zh' ? '、' : ' · '))}</span></span><span class="work-count">${work.theme_count}<span class="work-arrow" aria-hidden="true">${work.id === state.work ? '✓' : '+'}</span></span></button>`).join('')}</div></section>`;
      }).join('')}<p class="section-footnote">${t.visible}</p><p class="reference-note">${state.lang === 'zh' ? '分類沿用 ' : 'Categories follow '}${external('https://vcstseng.github.io/99-problems/pages/problem-map/index.html', '99 Problems ↗')}<span>${state.lang === 'zh' ? '；候選可支援的步驟與適用性仍需確認。' : '; supported steps and suitability still need assessment.'}</span></p>` : loadState('portal')}
    </section>
    <section class="trending-section" aria-labelledby="trending-heading">
      <div class="section-header"><div><h2 id="trending-heading">${t.trending}</h2><p>${t.trendingHint}</p></div>${trending ? `<a class="outline-button" data-route="forward" href="${e(href({ view: 'results', source: 'trending' }))}">${t.viewTrending(trending.repositories.length)}</a>` : ''}</div>
      ${trending ? `<div class="trending-context"><span>${t.snapshot} · <time datetime="${e(trending.observed_at)}">${date(trending.observed_at)}</time></span>${external(trending.source_url, t.source)}</div><ol class="trending-list">${trending.repositories.slice(0, 3).map(repo => trendingRow(repo)).join('')}</ol><p class="section-footnote">${t.trendNote}</p>` : loadState('trending', t.trendError)}
    </section>`;
}
function candidateCard(resource) {
  const t = copy[state.lang];
  const tags = resource.types.map(type => `<span class="type-tag">${e(TYPES[type]?.[state.lang === 'zh' ? 0 : 1] || t.resource)}</span>`).join('');
  const parent = resource.parent_repository && resource.parent_repository !== resource.url;
  const parentName = parent ? new URL(resource.parent_repository).pathname.slice(1) : '';
  return `<article class="candidate-card" id="resource-${e(resource.id)}"><div class="candidate-title"><h3>${e(resource.name)}</h3><div class="type-tags">${tags}</div></div><p class="candidate-summary">${e(resource.summary[state.lang] || t.noDescription)}</p><div class="candidate-links">${external(resource.url, t.originalSource, 'source-link')}${parent ? external(resource.parent_repository, t.parentProject + parentName) : ''}</div><p class="candidate-origin">${t.listSource}${e(resource.list_sources.join(' · '))}</p></article>`;
}
function returnLink(t, extraClass = '') {
  return `<a class="outline-button ${extraClass}" data-route="return" href="${e(href({ view: 'portal', source: 'work' }))}">${t.backToWork}</a>`;
}
function resultsContent(t) {
  const isTrending = state.source === 'trending';
  const work = portal?.works.find(w => w.id === state.work);
  const title = isTrending ? t.trending : work ? label(work) : portal ? t.invalidWork : t.resultStep;
  const header = `<nav class="journey" aria-label="${t.journey}"><a data-route="return" href="${e(href({ view: 'portal', source: 'work' }))}">${t.backToWork}</a><span aria-hidden="true">／</span><span aria-current="page">${t.resultStep}</span></nav><section class="intro results-intro"><p class="eyebrow">${isTrending ? 'GITHUB SNAPSHOT' : 'CAPABILITY STORE'}</p><h1 id="page-title" tabindex="-1">${e(title)}</h1><p class="intro-text">${isTrending ? t.trendingHint : t.resultsIntro}</p></section>`;
  if (!portal) return header + loadState('portal');
  if (isTrending) {
    if (!trending) return header + loadState('trending', t.trendError);
    return header + `<div class="results-context"><p>${t.repoCount(trending.repositories.length)}</p><span>${t.snapshot} · <time datetime="${e(trending.observed_at)}">${date(trending.observed_at)}</time></span></div><p class="results-note">${t.trendNote}</p><ol class="trending-list results-trending">${trending.repositories.map(repo => trendingRow(repo, true)).join('')}</ol><div class="results-bottom">${returnLink(t)}${external(trending.source_url, t.source)}</div>`;
  }
  if (!work) return header + `<div class="load-state"><p>${t.invalidWorkHint}</p>${returnLink(t)}</div>`;
  if (!results) return header + loadState('results');
  let listing;
  try { listing = workResults(portal, results, work.id); }
  catch { return header + `<div class="load-state" role="alert"><p>${t.error}</p>${returnLink(t)}</div>`; }
  return header + `<div class="results-context"><p>${t.groupCount(listing.theme_count, listing.resource_count)}</p><span>${t.directoryStatus}</span></div><nav class="theme-jumps" aria-label="${t.themeNavigation}">${listing.groups.map(group => `<a href="#capability-${e(group.id)}">${e(group.label[state.lang])}</a>`).join('')}</nav><p class="results-note">${t.resultsNote}</p><div class="capability-groups">${listing.groups.map((group, index) => `<section class="capability-group" id="capability-${e(group.id)}" aria-labelledby="theme-${e(group.id)}"><div class="capability-heading"><span class="theme-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><h2 id="theme-${e(group.id)}">${e(group.label[state.lang])}</h2><span>${t.candidateCount(group.resources.length)}</span></div><div class="candidate-list">${group.resources.map(candidateCard).join('')}</div></section>`).join('')}</div><div class="results-bottom">${returnLink(t)}</div>`;
}
function render() {
  const t = copy[state.lang];
  const isResults = state.view === 'results';
  const work = portal?.works.find(w => w.id === state.work);
  const page = isResults ? state.source === 'trending' ? t.trending : work ? label(work) : t.resultStep : t.title;
  document.documentElement.lang = state.lang === 'zh' ? 'zh-Hant' : 'en';
  document.title = isResults ? `${page} · ${t.title}` : `${t.title} · ${t.tagline}`;
  document.querySelector('meta[name="description"]').content = isResults ? t.resultsIntro : t.intro;
  app.innerHTML = `<div class="app-shell${isResults ? ' results-view' : ''}"><a class="skip-link" href="${isResults ? '#page-title' : '#work-heading'}">${isResults ? t.skipResults : t.skip}</a><header class="masthead"><a class="wordmark" href="${e(href({ view: 'portal', source: 'work', work: null }))}" data-home>${t.title}<span class="brand-dot" aria-hidden="true"></span></a><div class="masthead-tools"><span class="masthead-note">${t.tagline}</span><nav class="language-switch" aria-label="Language"><button type="button" lang="zh-Hant" data-language="zh" aria-pressed="${state.lang === 'zh'}">中文</button><button type="button" lang="en" data-language="en" aria-pressed="${state.lang === 'en'}">English</button></nav></div></header><main>${isResults ? resultsContent(t) : portalContent(t)}</main><footer><p>${t.footer}</p><div><span>${isResults ? t.resultStep : t.prototype}</span>${external('https://github.com/vcstseng/capability-store', t.repo)}</div></footer><p id="announcer" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></p></div>`;
  restorePosition();
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
  } else if (target.hasAttribute('data-route')) {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    const next = readRoute(new URL(target.href).search, portal?.works.map(w => w.id) || [], state.lang);
    go(next, target.dataset.route === 'return');
  } else if (target.hasAttribute('data-work')) {
    updateState({ work: state.work === target.dataset.work ? null : target.dataset.work });
    renderWorkSelection();
    announce(state.work ? copy[state.lang].selection(label(portal.works.find(w => w.id === state.work))) : copy[state.lang].clearStatus);
    const panel = document.querySelector('#selected-work');
    if (!panel.hidden && panel.getBoundingClientRect().top < 0) panel.scrollIntoView({ block: 'start' });
  } else if (target.hasAttribute('data-clear')) {
    const previous = state.work;
    updateState({ work: null }); renderWorkSelection();
    document.querySelector(`[data-work="${previous}"]`)?.focus({ preventScroll: true });
    announce(copy[state.lang].clearStatus);
  } else if (target.hasAttribute('data-retry')) load(target.dataset.retry);
  else if (target.hasAttribute('data-home') && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
    event.preventDefault(); go({ view: 'portal', source: 'work', work: null });
  }
});
window.addEventListener('popstate', () => {
  savePosition(false);
  state = readRoute(location.search, portal?.works.map(w => w.id) || [], state.lang);
  pendingPosition = { top: Number(history.state?.scrollY ?? positions[positionKey(state)] ?? 0), focus: false, hash: location.hash };
  render(); ensureData();
});
window.addEventListener('pagehide', () => savePosition());

async function load(part) {
  if (loading.has(part)) return;
  loading.add(part); failed[part] = false; render();
  try {
    const response = await fetch(new URL(`../data/${part}.json`, import.meta.url));
    if (!response.ok) throw new Error('Unable to load catalog');
    const data = await response.json();
    if (part === 'portal') {
      if (!Array.isArray(data.works) || !data.works.length) throw new Error('Invalid portal');
      portal = data;
      state = readRoute(location.search, portal.works.map(w => w.id), preferred);
      if (new URLSearchParams(location.search).get('work') && state.work) history.replaceState(history.state, '', location.pathname + routeSearch(state) + location.hash);
    } else if (part === 'results') {
      if (!Array.isArray(data.capabilities) || !Array.isArray(data.resources)) throw new Error('Invalid results');
      results = data;
    } else {
      if (!Array.isArray(data.repositories) || !data.repositories.length) throw new Error('Invalid Trending');
      trending = data;
    }
  } catch { failed[part] = true; }
  finally { loading.delete(part); }
  render(); ensureData();
}
function ensureData() {
  if (state.view === 'results' && state.source === 'work' && portal && state.work && !results && !failed.results) load('results');
}
render();
Promise.allSettled([load('portal'), load('trending')]);
