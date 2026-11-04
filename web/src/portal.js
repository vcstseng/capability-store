export function createPortal(catalog) {
  const allThemes = new Set(catalog.capabilities.map(item => item.id));
  const allResources = new Set(catalog.resources.map(item => item.id));
  const works = catalog.works.flatMap(work => {
    const themes = catalog.capabilities.filter(theme => theme.work_ids.includes(work.id));
    return themes.length ? [{ ...work, theme_count: new Set(themes.map(t => t.id)).size,
      resource_count: new Set(themes.flatMap(t => t.resource_ids)).size }] : [];
  });
  return { schema_version: '0.1-portal', review_date: catalog.metadata.review_date,
    capability_count: allThemes.size, resource_count: allResources.size, works };
}

export function readRoute(search, availableIds, preferred = 'zh') {
  const params = new URLSearchParams(search);
  const lang = params.has('lang') ? (params.get('lang') === 'en' ? 'en' : 'zh') : (preferred === 'en' ? 'en' : 'zh');
  const work = availableIds.includes(params.get('work')) ? params.get('work') : null;
  return { lang, work, expanded: params.get('trending') === 'all' };
}

export function routeSearch(state) {
  const params = new URLSearchParams();
  if (state.lang === 'en') params.set('lang', 'en');
  else params.set('lang', 'zh');
  if (state.work) params.set('work', state.work);
  if (state.expanded) params.set('trending', 'all');
  return '?' + params.toString();
}
