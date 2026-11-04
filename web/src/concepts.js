export function enrichPortalWithConcepts(portal, data) {
  const byId = new Map(data.concepts.map(c => [c.id,c]));
  const domains = new Map(data.domains.map(d => [d.work_id,d]));
  const used = new Set();
  const works = portal.works.map(work => {
    const domain = domains.get(work.id);
    if (!domain) return work;
    const ids = domain.stages.flatMap(stage => stage.concept_ids);
    for (const id of ids) {
      if (!byId.has(id)) throw new Error('Unknown concept: '+id);
      used.add(id);
    }
    return {...work, concept_count:new Set(ids).size, examples:domain.stages.map(stage=>stage.label)};
  });
  if (domains.size !== 10 || [...domains.keys()].some(id=>!works.some(w=>w.id===id))) throw new Error('The ten business categories must match the portal.');
  return {...portal,groups:portal.groups.map(g=>g.id==='ai'?{...g,label:{zh:'AI 能力與治理 · 原有資源參考',en:'AI capabilities & governance · Existing references'}}:g),works,concept_count:used.size,concept_domain_count:domains.size};
}

export function conceptPage(data, workId) {
  const domain=data.domains.find(d=>d.work_id===workId);
  if (!domain) return null;
  const byId=new Map(data.concepts.map(c=>[c.id,c]));
  return {...domain,stages:domain.stages.map(s=>({...s,concepts:s.concept_ids.map(id=>{
    const concept=byId.get(id);
    if (!concept) throw new Error('Unknown concept: '+id);
    return concept;
  })}))};
}

export function validateConceptDetails(data) {
  const ids=new Set(data.concepts.map(c=>c.id));
  const bilingual=x=>x && ['zh','en'].every(lang=>typeof x[lang]==='string' && x[lang].trim());
  const refs=new Set(data.domains.flatMap(d=>d.references.map(r=>r.resource_id+'|'+r.url)));
  for (const [id,d] of Object.entries(data.details || {})) {
    if (!ids.has(id)) throw new Error('Unknown detail identity: '+id);
    if (![d.scenario,d.permissions,d.stop,d.example?.input,d.example?.output].every(bilingual) || !Array.isArray(d.steps) || !d.steps.length || !d.steps.every(bilingual)) throw new Error('Incomplete bilingual detail: '+id);
    if (d.example.status !== 'illustrative_not_executed') throw new Error('Example must be illustrative: '+id);
    if (!Array.isArray(d.related_ids) || d.related_ids.some(r=>r===id || !data.details[r])) throw new Error('Broken companion link: '+id);
    if (!Array.isArray(d.references) || d.references.some(r=>r.status!=='unverified_reference' || !bilingual(r.scope) || !refs.has(r.resource_id+'|'+r.url))) throw new Error('Untraceable reference: '+id);
  }
}
