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
