import { readRoute, routeSearch } from './portal.js';

export function readExploreRoute(search, availableIds, preferred = 'zh') {
  const params = new URLSearchParams(search);
  const base = readRoute(search, availableIds, preferred);
  const view = params.get('view') === 'results' ? 'results' : 'portal';
  const source = params.get('source') === 'trending' ? 'trending' : 'work';
  const problem = /^[A-Za-z][A-Za-z0-9_-]{0,31}$/.test(params.get('problem') || '') ? params.get('problem') : null;
  return { ...base, view, source, problem };
}

export function exploreSearch(state) {
  const params = new URLSearchParams(routeSearch(state));
  if (state.view === 'results') {
    params.set('view', 'results');
    if (state.source === 'trending') params.set('source', 'trending');
  }
  if (state.problem) params.set('problem', state.problem);
  return '?' + params.toString();
}

export function positionKey(state) {
  return JSON.stringify([state.view, state.source, state.work, !!state.expanded, state.problem]);
}

export function createResults(catalog) {
  return {
    schema_version: '0.1-results', review_date: catalog.metadata.review_date,
    capabilities: catalog.capabilities.map(({ id, label, resource_ids }) => ({ id, label, resource_ids })),
    resources: catalog.resources.map(({ id, name, url, types, summary, parent_repository, review_status, evidence }) => ({
      id, name, url, types, summary, parent_repository, review_status,
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
