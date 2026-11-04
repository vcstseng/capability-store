import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createPortal } from '../src/portal.js';
import { createResults, workResults, readExploreRoute, exploreSearch, positionKey } from '../src/results.js';
const catalog = JSON.parse(readFileSync(new URL('../../data/processed/catalog/catalog.json', import.meta.url), 'utf8'));
const navigation = JSON.parse(readFileSync(new URL('../../config/taxonomy/portal-navigation.json', import.meta.url), 'utf8'));
const portal = createPortal(catalog, navigation);
const results = createResults(catalog);
test('every work lists exactly its declared capabilities and distinct candidates', () => {
  for (const work of portal.works) {
    const listing = workResults(portal, results, work.id);
    assert.deepEqual(listing.groups.map(g => g.id), work.capability_ids);
    assert.equal(listing.theme_count, work.theme_count);
    assert.equal(listing.resource_count, work.resource_count);
    for (const group of listing.groups) for (const resource of group.resources) {
      assert.ok(resource.summary.zh && resource.summary.en && resource.list_sources.length);
      assert.equal(resource.review_status, 'directory_reviewed_not_tested');
    }
  }
  assert.equal(workResults(portal, results, 'business-procurement').resource_count, 8);
});
test('work results do not leak unrelated or unassigned candidates', () => {
  assert.equal(workResults(portal, results, 'missing'), null);
  const listing = workResults(portal, results, 'business-procurement');
  assert.ok(!listing.groups.some(g => g.id === 'clinical-data'));
  assert.deepEqual(listing.groups.map(g => g.id), ['document-conversion','data-analysis','procurement-search']);
});
test('a resource shared across themes counts once while remaining in both contexts', () => {
  const listing = workResults({ works: [{ id: 'w', capability_ids: ['a','b'] }] },
    { capabilities: [{ id: 'a', resource_ids: ['r','r'] }, { id: 'b', resource_ids: ['r'] }], resources: [{ id: 'r' }] }, 'w');
  assert.equal(listing.groups[0].resources.length, 1);
  assert.equal(listing.groups[1].resources.length, 1);
  assert.equal(listing.resource_count, 1);
  assert.throws(() => workResults({ works: [{ id: 'w', capability_ids: ['absent'] }] }, { capabilities: [], resources: [] }, 'w'), /Missing capability/);
});
test('share links preserve view, source, language and opaque problem context without deriving matches', () => {
  const work = { lang: 'en', work: 'business-finance', expanded: false, view: 'results', source: 'work', problem: 'P02' };
  assert.deepEqual(readExploreRoute(exploreSearch(work), ['business-finance']), work);
  const trend = { ...work, source: 'trending' };
  assert.deepEqual(readExploreRoute(exploreSearch(trend), ['business-finance']), trend);
  assert.equal(positionKey(work), positionKey({ ...work, lang: 'zh' }));
  assert.notEqual(positionKey(work), positionKey(trend));
  assert.equal(readExploreRoute('?view=results&work=unknown', []).work, null);
  assert.equal(readExploreRoute('?problem=https://example.com', []).problem, null);
});

test('returning to the portal restores the same position across category routes', () => {
  const home = { lang: 'zh', work: null, view: 'portal', source: 'work', problem: null };
  assert.equal(positionKey(home), positionKey({ ...home, work: 'business-procurement', lang: 'en' }));
  assert.notEqual(positionKey(home), positionKey({ ...home, view: 'results', work: 'business-procurement' }));
});

test('resource links preserve stable identity and list context while result positions ignore resource identity', () => {
  const item={lang:'en',work:'business-finance',expanded:false,view:'resource',source:'work',problem:'F03',id:'cap-0123456789abcd'};
  assert.deepEqual(readExploreRoute(exploreSearch(item),['business-finance']),item);
  assert.notEqual(positionKey(item),positionKey({...item,id:'cap-aaaaaaaaaaaaaa'}));
  assert.equal(positionKey({...item,view:'results'}),positionKey({...item,view:'results',id:'cap-aaaaaaaaaaaaaa'}));
  assert.equal(readExploreRoute('?view=resource&id=javascript:alert(1)',[]).id,null);
  const repo={...item,source:'trending',id:'github:anthropics/skills'};
  assert.deepEqual(readExploreRoute(exploreSearch(repo),['business-finance']),repo);
});
test('input and output annotations are explicit and do not fill unknown fields', () => {
  const id=catalog.resources.find(r=>r.name==='Microsoft MarkItDown').id;
  const data=createResults(catalog,{[id]:{input:{zh:'檔案',en:'Files'},output:null}});
  assert.equal(data.resources.find(r=>r.id===id).display.input.en,'Files');
  assert.equal(data.resources.find(r=>r.id===id).display.output,null);
  assert.ok(!data.resources.find(r=>r.id!==id).display);
});
