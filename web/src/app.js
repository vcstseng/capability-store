import { readExploreRoute as readRoute, exploreSearch as routeSearch, positionKey, workResults } from './results.js';
import { copy } from './copy.js';
import { conceptPage } from './concepts.js';

const app = document.querySelector('#app');
let portal, trending, results, concepts;
const failed = { portal: false, trending: false, results: false, concepts: false };
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
  if (next.view === 'resource') history.replaceState({ ...history.state, focusResource: next.id }, '', location.href);
  const focusResource = restore && next.view === 'results' ? state.id : null;
  if (next.view === 'results' && next.source === 'work') history.replaceState({ ...history.state, focusWork: next.work }, '', location.href);
  const focusWork = restore && next.view === 'portal' ? state.work : null;
  state = { ...state, ...next };
  const top = restore ? positions[positionKey(state)] || 0 : 0;
  history.pushState({ scrollY: top }, '', location.pathname + routeSearch(state));
  pendingPosition = { top, focus: !restore, focusWork, focusResource };
  render(); ensureData();
}
function restorePosition() {
  if (!pendingPosition || !portal) return;
  if (state.view === 'resource' && state.id?.startsWith('idea-') && !concepts && !failed.concepts) return;
  if (((state.view === 'resource' && !state.id?.startsWith('idea-')) || state.view === 'results') && state.source === 'work' && state.work && !results && !failed.results) return;
  if (state.view === 'results' && state.source === 'trending' && !trending && !failed.trending) return;
  if (state.view === 'resource' && !state.id?.startsWith('idea-') && ((!results && !failed.results) || (state.id?.startsWith('github:') && !trending && !failed.trending))) return;
  if (state.view === 'results' && portal?.works.find(w=>w.id===state.work)?.concept_count && !concepts && !failed.concepts) return;
  const target = pendingPosition;
  pendingPosition = null;
  requestAnimationFrame(() => {
    if (target.hash) {
      const element = document.getElementById(target.hash.slice(1));
      if (element) { element.scrollIntoView(); return; }
    }
    window.scrollTo(0, target.top);
    if (state.view === 'portal' && target.focusWork) document.querySelector(`[data-work="${target.focusWork}"]`)?.focus({ preventScroll: true });
    else if (state.view === 'results' && target.focusResource) document.querySelector(`[data-resource="${target.focusResource}"]`)?.focus({ preventScroll: true });
    else if (target.focus) document.querySelector('#page-title')?.focus({ preventScroll: true });
  });
}
function loadState(part, message) {
  const t = copy[state.lang];
  return `<div class="load-state" role="status"><p>${failed[part] ? message || t.error : t.loading}</p>${failed[part] ? `<button class="outline-button" data-retry="${part}">${t.retry}</button>` : ''}</div>`;
}
function trendingRow(repo, full = false) {
  const t = copy[state.lang];
  return `<li class="trending-row" id="repo-${e(repo.repository.toLowerCase().replace('/', '--'))}"><span class="rank" aria-hidden="true">${String(repo.rank_in_snapshot).padStart(2, '0')}</span><div class="trending-copy"><div class="candidate-title"><a class="repo-link" data-route="forward" data-resource="${e('github:' + repo.repository.toLowerCase())}" href="${e(href({view:'resource',source:'trending',id:'github:' + repo.repository.toLowerCase()}))}">${e(repo.repository)}</a>${full ? `<span class="type-tag">${t.githubProject}</span>` : ''}</div><p ${repo.summary[state.lang] ? '' : 'class="missing-description"'}>${e(repo.summary[state.lang] || t.noDescription)}</p>${full ? `<p class="candidate-origin">GitHub Trending · ${date(trending.observed_at)}</p>` : ''}</div><div class="star-signal"><span class="stars">${repo.weekly_stars == null ? '—' : '+' + new Intl.NumberFormat(locale()).format(repo.weekly_stars)}</span><span>${t.weekly}</span></div></li>`;
}
function portalContent(t) {
  return `<section class="intro" aria-labelledby="page-title"><p class="eyebrow">CAPABILITY STORE</p><h1 id="page-title" tabindex="-1">${t.heading}</h1><p class="intro-text">${t.intro}</p>
    ${portal ? `<div class="dataset-counts"><span><strong>${portal.concept_domain_count ?? portal.capability_count}</strong> ${portal.concept_count ? t.businessDomainUnit : t.themes}</span><span><strong>${portal.concept_count ?? portal.resource_count}</strong> ${portal.concept_count ? t.conceptUnit : t.resources}</span></div>` : ''}</section>
    <section class="work-section" aria-labelledby="work-heading">
      <div class="section-header"><div><h2 id="work-heading" tabindex="-1">${t.explore}</h2><p>${t.exploreHint}</p></div></div>
      ${portal ? `${portal.groups.map(group => {
        const works = portal.works.filter(work => work.group === group.id);
        if (!works.length) return '';
        return `<section class="work-group" aria-labelledby="group-${e(group.id)}"><div class="group-heading"><h3 id="group-${e(group.id)}">${e(group.label[state.lang])}</h3><span>${group.id === 'business' ? t.conceptCountLabel : t.countLabel}</span></div><div class="work-grid">${works.map(work => `<a class="work-card" data-work="${e(work.id)}" data-route="forward" href="${e(href({ view: 'results', source: 'work', work: work.id }))}" aria-label="${e(label(work))}, ${work.concept_count ?? work.theme_count} ${work.concept_count ? t.conceptUnit : t.themes}"><span class="work-copy"><span class="work-label">${e(label(work))}</span><span class="work-examples">${state.lang === 'zh' ? '例如：' : 'e.g. '}${e(work.examples.map(example => example[state.lang]).join(state.lang === 'zh' ? '、' : ' · '))}</span></span><span class="work-count">${work.concept_count ?? work.theme_count}<span class="work-arrow" aria-hidden="true">→</span></span></a>`).join('')}</div></section>`;
      }).join('')}<p class="section-footnote">${t.visible}</p><p class="reference-note">${state.lang === 'zh' ? '分類沿用 ' : 'Categories follow '}${external('https://vcstseng.github.io/99-problems/pages/problem-map/index.html', '99 Problems ↗')}<span>${state.lang === 'zh' ? '；候選可支援的步驟與適用性仍需確認。' : '; supported steps and suitability still need assessment.'}</span></p>` : loadState('portal')}
    </section>
    <section class="trending-section" aria-labelledby="trending-heading">
      <div class="section-header"><div><h2 id="trending-heading">${t.trending}</h2><p>${t.trendingHint}</p></div>${trending ? `<a class="outline-button" data-route="forward" href="${e(href({ view: 'results', source: 'trending' }))}">${t.viewTrending(trending.repositories.length)}</a>` : ''}</div>
      ${trending ? `<div class="trending-context"><span>${t.snapshot} · <time datetime="${e(trending.observed_at)}">${date(trending.observed_at)}</time></span>${external(trending.source_url, t.source)}</div><ol class="trending-list">${trending.repositories.slice(0, 3).map(repo => trendingRow(repo)).join('')}</ol><p class="section-footnote">${t.trendNote}</p>` : loadState('trending', t.trendError)}
    </section>`;
}
function resourceRoute(id) { return href({ view: 'resource', id }); }
function candidateCard(resource) {
  const t = copy[state.lang];
  const tags = resource.types.map(type => `<span class="type-tag">${e(TYPES[type]?.[state.lang === 'zh' ? 0 : 1] || t.resource)}</span>`).join('');
  const facts = ['input','output'].filter(key => resource.display?.[key]).map(key => `<span><b>${t[key]}</b>${e(resource.display[key][state.lang])}</span>`).join('');
  return `<article class="candidate-card compact-candidate" id="resource-${e(resource.id)}"><a class="candidate-entry" data-route="forward" data-resource="${e(resource.id)}" href="${e(resourceRoute(resource.id))}"><div class="candidate-title"><h3>${e(resource.name)}</h3><div class="type-tags">${tags}</div></div><p class="candidate-summary"><span class="fact-label">${t.canDo}</span>${e(resource.summary[state.lang] || t.noDescription)}</p>${facts ? `<div class="candidate-facts">${facts}</div>` : ''}<span class="candidate-detail">${t.viewDetail} <span aria-hidden="true">→</span></span></a></article>`;
}

function conceptDetailContent(t) {
  const z=state.lang==='zh', txt=(zh,en)=>z?zh:en, val=x=>e(x[state.lang]);
  if (!concepts) return loadState('concepts');
  const c=concepts.concepts.find(c=>c.id===state.id), d=concepts.details?.[state.id];
  const domain=c && concepts.domains.find(w=>w.stages.some(s=>s.concept_ids.includes(c.id)));
  const backWork=domain?.work_id || state.work;
  const back=`<a class="outline-button" data-route="return" href="${e(href({view:'results',source:'work',work:backWork}))}">${txt('← 返回能力列表','← Back to capabilities')}</a>`;
  if (!c || !d) return `<section class="intro"><h1 id="page-title" tabindex="-1">${txt('此能力說明尚未提供','Capability detail unavailable')}</h1><p>${txt('請返回列表探索其他能力。','Return to the list to explore other capabilities.')}</p></section>${back}`;
  const section=(title,body)=>`<section class="detail-section"><h2>${title}</h2>${body}</section>`;
  const related=d.related_ids.map(id=>concepts.concepts.find(x=>x.id===id)).filter(Boolean);
  return `<nav class="journey" aria-label="${t.journey}">${back}<span aria-hidden="true">／</span><span aria-current="page">${txt('能力說明','Capability detail')}</span></nav><article class="concept-detail-page"><header class="intro"><p class="eyebrow">CAPABILITY CONCEPT · ${e(c.kind.toUpperCase())}</p><h1 id="page-title" tabindex="-1">${val(c.name)}</h1><p class="intro-text">${val(c.purpose)}</p><div class="concept-status"><span class="concept-badge">${t.conceptBadge}</span><p>${txt('設計構想，尚未實作或驗證。以下示例為編寫內容，沒有執行。','Design concept, not implemented or validated. Examples below are authored illustrations, not execution results.')}</p></div></header>
  ${section(txt('什麼時候用？','When to use it'),`<p>${val(d.scenario)}</p>`)}
  ${section(txt('輸入 → 處理 → 產出','Input → Process → Output'),`<div class="ability-flow"><div><h3>${txt('輸入','Input')}</h3><p>${val(c.input)}</p></div><div><h3>${txt('處理步驟','Process')}</h3><ol>${d.steps.map(x=>`<li>${val(x)}</li>`).join('')}</ol></div><div><h3>${txt('產出','Output')}</h3><p>${val(c.output)}</p></div></div>`)}
  ${section(txt('看一個示例','An illustrative example'),`<p class="section-footnote">${txt('虛構資料 · 非實際執行結果','Fictional data · Not an execution result')}</p><div class="example-pair"><div><h3>${txt('提供的資料','Provided information')}</h3><p>${val(d.example.input)}</p></div><div><h3>${txt('示範產出','Illustrative output')}</h3><p>${val(d.example.output)}</p></div></div>`)}
  ${section(txt('人工判斷與使用界線','Human decisions & boundaries'),`<dl class="detail-facts"><div><dt>${txt('人工確認','Human confirmation')}</dt><dd>${val(c.human_decision)}</dd></div><div><dt>${txt('資料與權限','Data & permissions')}</dt><dd>${val(d.permissions)}</dd></div><div><dt>${txt('停止與交回','Stop & hand back')}</dt><dd>${val(d.stop)}</dd></div></dl>`)}
  ${section(txt('可搭配的能力','Possible companion capabilities'),`<p class="section-footnote">${txt('以下為組合構想，並非已建立的整合。','Suggested combinations, not implemented integrations.')}</p><div class="companion-list">${related.map(r=>`<a data-route="forward" data-resource="${e(r.id)}" href="${e(href({view:'resource',work:backWork,id:r.id}))}"><span class="type-tag">${e(r.kind)}</span><strong>${val(r.name)} →</strong><p>${val(r.purpose)}</p></a>`).join('')}</div>`)}
  ${section(txt('實現參考','Implementation references'),d.references.length?d.references.map(r=>`<div class="reference-row">${external(r.url,r.name)}<span class="reference-status">${t.referenceStatus}</span><p>${val(r.scope)}</p></div>`).join(''):`<p>${txt('尚未指定此能力的實作參考；可返回領域列表查看較廣泛的 GitHub 線索。','No implementation reference is assigned to this capability. The domain list has broader GitHub research leads.')}</p>`)}
  <div class="results-bottom">${back}</div></article>`;
}

function detailContent(t) {
  if (state.id?.startsWith('idea-')) return conceptDetailContent(t);
  const hasList = state.source === 'trending' || portal?.works.some(work => work.id === state.work);
  const backHref = href({view:hasList ? 'results' : 'portal'});
  const backText = hasList ? t.backList : t.backToWork;
  const back = `<a class="outline-button" data-route="return" href="${e(backHref)}">${backText}</a>`;
  if (!results || (state.id?.startsWith('github:') && !trending)) return `<section class="intro"><h1 id="page-title" tabindex="-1">${t.detailTitle}</h1></section>${!results ? loadState('results') : loadState('trending')}`;
  const resource = results.resources.find(r => r.id === state.id);
  const repo = !resource && state.id?.startsWith('github:') ? trending.repositories.find(r => `github:${r.repository.toLowerCase()}` === state.id) : null;
  if (!resource && !repo) return `<section class="intro"><h1 id="page-title" tabindex="-1">${t.resourceMissing}</h1><p>${t.resourceMissingHint}</p></section>${back}`;
  const item = resource || { name:repo.repository, summary:repo.summary, url:repo.url, types:[], list_sources:['GitHub Trending'] };
  const related = resource ? results.capabilities.filter(theme => theme.resource_ids.includes(resource.id)) : [];
  const tags = resource ? resource.types.map(type => `<span class="type-tag">${e(TYPES[type]?.[state.lang === 'zh' ? 0 : 1] || t.resource)}</span>`).join('') : `<span class="type-tag">${t.githubProject}</span>`;
  const facts = ['input','output'].filter(key => item.display?.[key]).map(key => `<div><dt>${t[key]}</dt><dd>${e(item.display[key][state.lang])}</dd></div>`).join('');
  const parent = resource?.parent_repository && resource.parent_repository !== resource.url;
  return `<nav class="journey" aria-label="${t.journey}"><a data-route="return" href="${e(backHref)}">${backText}</a><span aria-hidden="true">／</span><span aria-current="page">${t.detailTitle}</span></nav><article class="resource-page"><header class="intro resource-intro"><p class="eyebrow">CAPABILITY STORE</p><h1 id="page-title" tabindex="-1">${e(item.name)}</h1><div class="type-tags">${tags}</div><p class="resource-overview">${e(item.summary[state.lang] || t.noDescription)}</p></header>${facts ? `<section class="detail-section"><h2>${t.taskScope}</h2><dl class="detail-facts">${facts}</dl></section>` : ''}${related.length ? `<section class="detail-section"><h2>${t.relatedCapabilities}</h2><ul class="related-themes">${related.map(theme => `<li>${e(theme.label[state.lang])}</li>`).join('')}</ul></section>` : ''}<section class="detail-section"><h2>${t.originalResource}</h2><div class="detail-actions">${external(item.url,t.originalSource,'outline-button')}${parent ? external(resource.parent_repository,t.parentProject + new URL(resource.parent_repository).pathname.slice(1),'outline-button') : ''}</div><p class="section-footnote">${t.externalNote}</p></section><section class="detail-section"><h2>${t.evidenceTitle}</h2><dl class="detail-facts"><div><dt>${t.listSource}</dt><dd>${e(item.list_sources.join(' · '))}</dd></div><div><dt>${t.reviewDate}</dt><dd>${repo ? date(trending.observed_at) : e(results.review_date)}</dd></div><div><dt>${t.reviewStatus}</dt><dd>${repo ? t.snapshotStatus : t.directoryStatus}</dd></div></dl><p class="detail-note">${t.detailLimits}</p>${item.summary.en ? `<details class="source-excerpt"><summary>${t.originalDescription}</summary><p lang="en">${e(item.summary.en)}</p></details>` : ''}</section><div class="results-bottom">${back}</div></article>`;
}

function returnLink(t, extraClass = '') {
  return `<a class="outline-button ${extraClass}" data-route="return" href="${e(href({ view: 'portal', source: 'work' }))}">${t.backToWork}</a>`;
}
function conceptResultsContent(t) {
  const work=portal.works.find(w=>w.id===state.work);
  const header=`<nav class="journey" aria-label="${t.journey}"><a data-route="return" href="${e(href({view:'portal',source:'work'}))}">${t.backToWork}</a><span aria-hidden="true">／</span><span aria-current="page">${t.conceptStep}</span></nav><section class="intro results-intro"><p class="eyebrow">CAPABILITY CONCEPTS</p><h1 id="page-title" tabindex="-1">${e(label(work))}</h1><p class="intro-text">${t.conceptIntro}</p></section>`;
  if (!concepts) return header+loadState('concepts');
  const page=conceptPage(concepts,state.work);
  if (!page) return header+`<p>${t.invalidWorkHint}</p>`+returnLink(t);
  const count=new Set(page.stages.flatMap(s=>s.concept_ids)).size;
  const kinds={skill:'Skill',tool:'Tool',agent:'Agent',workflow:'Workflow'};
  return header+`<div class="concept-status"><span class="concept-badge">${t.conceptBadge}</span><p>${t.conceptBoundary}</p></div><div class="results-context"><p>${t.conceptSummary(page.stages.length,count)}</p><span>${t.conceptAcquisition}</span></div><nav class="theme-overview theme-jumps concept-overview" aria-label="${t.themeNavigation}">${page.stages.map(stage=>`<a href="#${e(stage.id)}"><span>${e(stage.label[state.lang])}</span><small>${t.conceptQuantity(stage.concepts.length)}</small></a>`).join('')}</nav><details class="kind-guide"><summary>${t.kindGuide}</summary><p>${t.kindDefinitions}</p></details><div class="concept-stages">${page.stages.map(stage=>`<section class="concept-stage" id="${e(stage.id)}" aria-labelledby="title-${e(stage.id)}"><div class="concept-stage-heading"><h2 id="title-${e(stage.id)}">${e(stage.label[state.lang])}</h2><span>${t.conceptQuantity(stage.concepts.length)}</span></div><div class="concept-grid">${stage.concepts.map(concept=>`<article class="concept-card" id="${e(concept.id)}"><span class="type-tag">${kinds[concept.kind]} · ${t.idea}</span><h3>${concepts.details?.[concept.id] ? `<a data-route="forward" data-resource="${e(concept.id)}" href="${e(href({view:'resource',id:concept.id}))}">${e(concept.name[state.lang])}</a>` : e(concept.name[state.lang])}</h3><p class="concept-purpose">${e(concept.purpose[state.lang])}</p><dl class="concept-io"><div><dt>${t.expectedInput}</dt><dd>${e(concept.input[state.lang])}</dd></div><div><dt>${t.expectedOutput}</dt><dd>${e(concept.output[state.lang])}</dd></div></dl><details class="human-boundary"><summary>${t.humanDecision}</summary><p>${e(concept.human_decision[state.lang])}</p></details>${concepts.details?.[concept.id] ? `<a class="concept-detail-link" data-route="forward" data-resource="${e(concept.id)}" href="${e(href({view:'resource',id:concept.id}))}">${state.lang === 'zh' ? '查看能力說明 →' : 'Explore capability →'}</a>` : ''}</article>`).join('')}</div></section>`).join('')}</div><aside class="reference-block" aria-labelledby="reference-heading"><div class="section-header"><div><h2 id="reference-heading">${t.referenceHeading}</h2><p>${t.referenceNote}</p></div></div>${page.references.filter(ref=>ref.url).map(ref=>`<div class="reference-row">${external(ref.url,ref.name,'reference-link')}<span class="reference-status">${t.referenceStatus}</span><p>${t.possibleStep}${e(ref.reason[state.lang])}</p></div>`).join('')}<p class="section-footnote">${t.referenceBoundary}</p></aside><div class="results-bottom">${returnLink(t)}</div>`;
}

function resultsContent(t) {
  if (state.source === 'work' && portal?.works.find(w=>w.id===state.work)?.concept_count) return conceptResultsContent(t);
  const isTrending = state.source === 'trending';
  const work = portal?.works.find(w => w.id === state.work);
  const title = isTrending ? t.trending : work ? label(work) : portal ? t.invalidWork : t.resultStep;
  const header = `<nav class="journey" aria-label="${t.journey}"><a data-route="return" href="${e(href({ view: 'portal', source: 'work' }))}">${t.backToWork}</a><span aria-hidden="true">／</span><span aria-current="page">${t.resultStep}</span></nav><section class="intro results-intro"><p class="eyebrow">${isTrending ? 'GITHUB SNAPSHOT' : 'CAPABILITY STORE'}</p><h1 id="page-title" tabindex="-1">${e(title)}</h1><p class="intro-text">${isTrending ? t.trendingHint : t.resultsIntro}</p></section>`;
  if (!portal) return header + loadState('portal');
  if (isTrending) {
    if (!trending) return header + loadState('trending', t.trendError);
    return header + `<div class="results-context"><p>${t.repoCount(trending.repositories.length)}</p><span>${t.snapshot} · <time datetime="${e(trending.observed_at)}">${date(trending.observed_at)}</time></span></div><p class="results-note">${t.trendNote}</p><ol class="trending-list results-trending">${trending.repositories.map(repo => trendingRow(repo, true)).join('')}</ol><div class="results-bottom">${returnLink(t)}</div>`;
  }
  if (!work) return header + `<div class="load-state"><p>${t.invalidWorkHint}</p>${returnLink(t)}</div>`;
  if (!results) return header + loadState('results');
  let listing;
  try { listing = workResults(portal, results, work.id); }
  catch { return header + `<div class="load-state" role="alert"><p>${t.error}</p>${returnLink(t)}</div>`; }
  return header + `<div class="results-context"><p>${t.groupCount(listing.theme_count, listing.resource_count)}</p><span>${t.directoryStatus}</span></div><nav class="theme-jumps theme-overview" aria-label="${t.themeNavigation}">${listing.groups.map(group => `<a href="#capability-${e(group.id)}"><span>${e(group.label[state.lang])}</span><small>${t.candidateCount(group.resources.length)}</small></a>`).join('')}</nav><p class="results-note">${t.resultsNote}</p><div class="capability-groups">${listing.groups.map((group, index) => `<section class="capability-group" id="capability-${e(group.id)}" aria-labelledby="theme-${e(group.id)}"><div class="capability-heading"><span class="theme-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><h2 id="theme-${e(group.id)}">${e(group.label[state.lang])}</h2><span>${t.candidateCount(group.resources.length)}</span></div><p class="theme-description">${e(t.topicIntros?.[group.id] || t.topicDefault)}</p><div class="candidate-list">${group.resources.map(candidateCard).join('')}</div></section>`).join('')}</div><div class="results-bottom">${returnLink(t)}</div>`;
}
function render() {
  const t = copy[state.lang];
  const isDetail = state.view === 'resource';
  const isResults = state.view !== 'portal';
  const work = portal?.works.find(w => w.id === state.work);
  const detailName = isDetail && state.id?.startsWith('idea-') ? concepts?.concepts.find(c=>c.id===state.id)?.name[state.lang] || t.detailTitle : isDetail ? results?.resources.find(r => r.id === state.id)?.name || trending?.repositories.find(r => 'github:' + r.repository.toLowerCase() === state.id)?.repository || t.detailTitle : '';
  const page = isDetail ? detailName : isResults ? state.source === 'trending' ? t.trending : work ? label(work) : t.resultStep : t.title;
  document.documentElement.lang = state.lang === 'zh' ? 'zh-Hant' : 'en';
  document.title = isResults ? `${page} · ${t.title}` : `${t.title} · ${t.tagline}`;
  document.querySelector('meta[name="description"]').content = isResults ? t.resultsIntro : t.intro;
  app.innerHTML = `<div class="app-shell${isResults ? ' results-view' : ''}"><a class="skip-link" href="${isResults ? '#page-title' : '#work-heading'}">${isDetail && state.id?.startsWith('idea-') ? (state.lang==='zh'?'跳到能力說明':'Skip to capability detail') : isResults ? t.skipResults : t.skip}</a><header class="masthead"><a class="wordmark" href="${e(href({ view: 'portal', source: 'work', work: null }))}" data-home>${t.title}<span class="brand-dot" aria-hidden="true"></span></a><div class="masthead-tools"><span class="masthead-note">${t.tagline}</span><nav class="language-switch" aria-label="Language"><button type="button" lang="zh-Hant" data-language="zh" aria-pressed="${state.lang === 'zh'}">中文</button><button type="button" lang="en" data-language="en" aria-pressed="${state.lang === 'en'}">English</button></nav></div></header><main>${isDetail ? detailContent(t) : isResults ? resultsContent(t) : portalContent(t)}</main><footer><p>${t.footer}</p><div><span>${isDetail ? (state.id?.startsWith('idea-') ? (state.lang==='zh'?'03 能力說明':'03 Capability detail') : t.detailTitle) : isResults ? (state.source === 'work' && portal?.works.find(w=>w.id===state.work)?.concept_count ? t.conceptStep : t.resultStep) : t.prototype}</span>${external('https://github.com/vcstseng/capability-store', t.repo)}</div></footer><p id="announcer" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></p></div>`;
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
  } else if (target.hasAttribute('data-retry')) load(target.dataset.retry);
  else if (target.hasAttribute('data-home') && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
    event.preventDefault(); go({ view: 'portal', source: 'work', work: null });
  }
});
window.addEventListener('popstate', () => {
  savePosition(false);
  state = readRoute(location.search, portal?.works.map(w => w.id) || [], state.lang);
  pendingPosition = { top: Number(history.state?.scrollY ?? positions[positionKey(state)] ?? 0), focus: false, hash: location.hash, focusWork: history.state?.focusWork, focusResource: history.state?.focusResource };
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
    } else if (part === 'concepts') {
      if (!Array.isArray(data.domains) || !Array.isArray(data.concepts)) throw new Error('Invalid concepts');
      concepts = data;
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
  if (state.view === 'resource' && state.id?.startsWith('idea-') && !concepts && !failed.concepts) load('concepts');
  if (state.view === 'results' && state.source === 'work' && portal?.works.find(w=>w.id===state.work)?.concept_count && !concepts && !failed.concepts) load('concepts');
  if (((state.view === 'resource' && !state.id?.startsWith('idea-')) || (state.view === 'results' && state.source === 'work' && state.work)) && portal && !results && !failed.results) load('results');
}
render();
Promise.allSettled([load('portal'), load('trending')]);
