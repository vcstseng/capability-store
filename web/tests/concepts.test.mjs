import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { enrichPortalWithConcepts, conceptPage } from '../src/concepts.js';
import { createPortal } from '../src/portal.js';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
const data=read('../../data/processed/concepts/business-concepts.json');
const catalog=read('../../data/processed/catalog/catalog.json');
const navigation=read('../../config/taxonomy/portal-navigation.json');
test('concepts belong to the exact ten business domains without problem-level matching claims',()=>{
 const expected=navigation.categories.filter(c=>c.group==='business').map(c=>c.id).sort();
 assert.deepEqual(data.domains.map(d=>d.work_id).sort(),expected);
 assert.equal(new Set(data.concepts.map(c=>c.id)).size,data.concepts.length);
 const used=data.domains.flatMap(d=>d.stages.flatMap(s=>s.concept_ids));
 assert.equal(new Set(used).size,data.concepts.length);
 assert.ok(!data.concepts.some(c=>c.problem_ids||c.verified_match));
 for(const d of data.domains){
  const page=conceptPage(data,d.work_id);
  assert.equal(page.stages.length,3);
  assert.ok(page.stages.every(s=>s.concepts.length>0));
 }
});
test('every idea has bilingual practical inputs, outputs and human boundaries, but no invented implementation',()=>{
 for(const c of data.concepts){
  assert.ok(['skill','tool','agent','workflow'].includes(c.kind));
  for(const field of ['name','purpose','input','output','human_decision']) for(const lang of ['zh','en']) assert.ok(c[field][lang].trim(),c.id+field+lang);
  assert.equal(c.status,'concept_only');
  assert.equal(c.implementation,null);
 }
 assert.ok(data.domains.some(d=>conceptPage(data,d.work_id).stages.flatMap(s=>s.concepts).filter(c=>c.kind==='skill').length>1));
});
test('references are separate real candidate leads with explicit unverified status',()=>{
 const byId=new Map(catalog.resources.map(r=>[r.id,r]));
 for(const d of data.domains){
  assert.ok(d.references.length>0);
  for(const ref of d.references){
   const original=byId.get(ref.resource_id);
   assert.ok(original);
   assert.ok(ref.url?.startsWith('https://github.com/'));
   assert.ok([original.url,original.parent_repository].includes(ref.url));
   assert.equal(ref.status,'unverified_reference');
   assert.ok(ref.reason.zh&&ref.reason.en);
  }
 }
});
test('portal counts concepts separately and preserves sourced data and AI reference entries',()=>{
 const old=createPortal(catalog,navigation);
 const before=JSON.stringify(old);
 const next=enrichPortalWithConcepts(old,data);
 assert.equal(next.concept_domain_count,10);
 assert.equal(next.concept_count,data.concepts.length);
 assert.equal(next.works.filter(w=>w.concept_count).length,10);
 assert.equal(next.works.filter(w=>w.group==='ai').length,4);
 assert.equal(next.resource_count,old.resource_count);
 assert.equal(JSON.stringify(old),before);
 assert.equal(conceptPage(data,'missing'),null);
});
