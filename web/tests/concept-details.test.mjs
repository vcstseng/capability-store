import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateConceptDetails} from '../src/concepts.js';
import {readExploreRoute,exploreSearch,positionKey} from '../src/results.js';
const data=JSON.parse(await readFile(new URL('../../data/processed/concepts/business-concepts.json',import.meta.url)));
data.details=JSON.parse(await readFile(new URL('../../data/processed/concepts/sales-details.json',import.meta.url))).details;
test('sales detail covers six existing capabilities and four kinds with traceable references',()=>{
 validateConceptDetails(data);
 assert.deepEqual(Object.keys(data.details).sort(),data.domains.find(d=>d.work_id==='business-sales').stages.flatMap(s=>s.concept_ids).sort());
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
