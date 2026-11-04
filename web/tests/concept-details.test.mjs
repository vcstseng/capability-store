import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateConceptDetails} from '../src/concepts.js';
import {readExploreRoute,exploreSearch,positionKey} from '../src/results.js';
const data=JSON.parse(await readFile(new URL('../../data/processed/concepts/business-concepts.json',import.meta.url)));
data.details={};
for (const file of ['sales-details.json','business-details.json']) {
 const {details}=JSON.parse(await readFile(new URL('../../data/processed/concepts/'+file,import.meta.url)));
 for(const [id,detail] of Object.entries(details)){assert.ok(!data.details[id], 'Duplicate detail: '+id);data.details[id]=detail;}
}
test('all sixty capabilities have complete details across exactly ten business domains',()=>{
 validateConceptDetails(data);
 assert.equal(Object.keys(data.details).length,60);
 assert.deepEqual(Object.keys(data.details).sort(),data.concepts.map(c=>c.id).sort());
 for(const domain of data.domains){
  const ids=domain.stages.flatMap(s=>s.concept_ids);assert.equal(ids.length,6);
  for(const id of ids){assert.ok(data.details[id]);assert.ok(data.details[id].related_ids.every(r=>ids.includes(r)));}
 }
 assert.equal(new Set(data.concepts.filter(c=>data.details[c.id]).map(c=>c.kind)).size,4);
});
test('incomplete, unsupported, and broken detail content fails before publication',()=>{
 for(const mutate of [d=>delete d.steps[0].en,d=>d.related_ids.push('idea-unknown'),d=>d.example.status='executed',d=>d.references.push({status:'verified'})]){
 const bad=structuredClone(data);mutate(bad.details['idea-sales-fit']);assert.throws(()=>validateConceptDetails(bad));
 }
});
test('concept identity survives sharing and language changes, while list positions share one key',()=>{
 const route={lang:'en',work:'business-sales',view:'resource',source:'work',id:'idea-sales-risk',problem:'demo-1'};
 const read=readExploreRoute(exploreSearch(route),['business-sales']);
 assert.equal(read.id,route.id);assert.equal(read.lang,'en');assert.equal(read.problem,'demo-1');assert.equal(read.work,route.work);
 assert.equal(readExploreRoute(exploreSearch({...read,lang:'zh'}),['business-sales']).id,route.id);
 assert.equal(positionKey({...read,view:'results'}),positionKey({...read,view:'results',id:'idea-sales-fit'}));
 assert.equal(readExploreRoute('?view=resource&id=idea-<bad>',[]).id,null);
});

test('missing capability detail fails the frozen coverage contract',()=>{const bad=structuredClone(data);delete bad.details['idea-finance-cash'];assert.throws(()=>validateConceptDetails(bad));});
