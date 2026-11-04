import { readRoute, routeSearch } from './portal.js';

export function readExploreRoute(search, availableIds, preferred = 'zh') {
  const params = new URLSearchParams(search);
  const base = readRoute(search, availableIds, preferred);
  const view = ['results','resource'].includes(params.get('view')) ? params.get('view') : 'portal';
  const source = params.get('source') === 'trending' ? 'trending' : 'work';
  const problem = /^[A-Za-z][A-Za-z0-9_-]{0,31}$/.test(params.get('problem') || '') ? params.get('problem') : null;
  const id = /^(idea-[a-z0-9-]{1,64}|cap-[a-f0-9]{14}|github:[a-z0-9_.-]+\/[a-z0-9_.-]+)$/.test(params.get('id') || '') ? params.get('id') : null;
  return { ...base, view, source, problem, ...(view === 'resource' ? {id} : {}) };
}

export function exploreSearch(state) {
  const params = new URLSearchParams(routeSearch(state));
  if (state.view === 'results' || state.view === 'resource') {
    params.set('view', state.view);
    if (state.view === 'resource' && state.id) params.set('id', state.id);
    if (state.source === 'trending') params.set('source', 'trending');
  }
  if (state.problem) params.set('problem', state.problem);
  return '?' + params.toString();
}

export function positionKey(state) {
  if (state.view === 'portal') return JSON.stringify(['portal', state.problem]);
  return JSON.stringify([state.view, state.source, state.work, !!state.expanded, state.problem, ...(state.view === 'resource' ? [state.id] : [])]);
}

export function createResults(catalog, display = {}) {
  return {
    schema_version: '0.1-results', review_date: catalog.metadata.review_date,
    capabilities: catalog.capabilities.map(({ id, label, resource_ids }) => ({ id, label, resource_ids })),
    resources: catalog.resources.map(({ id, name, url, types, summary, parent_repository, review_status, evidence }) => ({
      id, name, url, types, summary, parent_repository, review_status,
      ...(display[id] ? { display: { input: display[id].input, output: display[id].output } } : {}),
      list_sources: [...new Set(evidence.map(item => item.source_repo))],
    })),
  };
}

export function workResults(portal, results, workId) {
  const work = portal.works.find(work => work.id === workId);
  if (!work) return null;
  const themes = new Map(results.capabilities.map(theme => [theme.id, theme]));
  const resources = new Map(results.resources.map(resource => [resource.id, resource]));
  const groups = work.capability_ids.map(id => {
    const theme = themes.get(id);
    if (!theme) throw new Error(`Missing capability: ${id}`);
    return { ...theme, resources: [...new Set(theme.resource_ids)].map(id => {
      if (!resources.has(id)) throw new Error(`Missing resource: ${id}`);
      return resources.get(id);
    }) };
  });
  return { work, groups, theme_count: groups.length,
    resource_count: new Set(groups.flatMap(group => group.resources.map(resource => resource.id))).size };
}
