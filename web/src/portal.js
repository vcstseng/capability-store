// Homepage associations are navigation aids, not verified problem-to-resource matches.
export function createPortal(catalog, navigation) {
  const themesById = new Map(catalog.capabilities.map(theme => [theme.id, theme]));
  const resourceIds = new Set(catalog.resources.map(resource => resource.id));
  const works = navigation.categories.flatMap(category => {
    const themeIds = [...new Set(category.capability_ids)];
    const themes = themeIds.map(id => {
      if (!themesById.has(id)) throw new Error(`Unknown capability: ${id}`);
      return themesById.get(id);
    });
    if (!themes.length) return [];
    const candidates = [...new Set(themes.flatMap(theme => theme.resource_ids))];
    if (candidates.some(id => !resourceIds.has(id))) throw new Error('Unknown resource reference');
    return [{ id: category.id, group: category.group, label: category.label,
      capability_ids: themeIds, resource_ids: candidates,
      theme_count: themes.length, resource_count: candidates.length,
      examples: themes.slice(0, 3).map(theme => theme.label) }];
  });
  const activeThemes = new Set(works.flatMap(work => work.capability_ids));
  return { schema_version: '0.2-portal', review_date: catalog.metadata.review_date,
    capability_count: activeThemes.size,
    resource_count: new Set(works.flatMap(work => work.resource_ids)).size,
    catalog_capability_count: themesById.size, catalog_resource_count: resourceIds.size,
    unassigned_capability_ids: [...themesById.keys()].filter(id => !activeThemes.has(id)),
    groups: navigation.groups, works };
}

const LEGACY_WORK = {
  'finance-accounting': 'business-finance', 'customer-service': 'business-customer-service',
  'legal-compliance': 'business-legal', 'people-workforce': 'business-hr',
  'operations-planning': 'business-operations', 'risk-security': 'ai-security',
  'software-development': 'ai-native-development', 'ai-lifecycle': 'ai-native-development',
};

export function readRoute(search, availableIds, preferred = 'zh') {
  const params = new URLSearchParams(search);
  const lang = params.has('lang') ? (params.get('lang') === 'en' ? 'en' : 'zh') : (preferred === 'en' ? 'en' : 'zh');
  const requested = params.get('work');
  const canonical = LEGACY_WORK[requested] || requested;
  const work = availableIds.includes(canonical) ? canonical : null;
  return { lang, work, expanded: params.get('trending') === 'all' };
}

export function routeSearch(state) {
  const params = new URLSearchParams();
  params.set('lang', state.lang === 'en' ? 'en' : 'zh');
  if (state.work) params.set('work', state.work);
  if (state.expanded) params.set('trending', 'all');
  return '?' + params.toString();
}
