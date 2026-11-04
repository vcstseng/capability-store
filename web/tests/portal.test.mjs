import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createPortal, readRoute, routeSearch } from '../src/portal.js';
const catalog = JSON.parse(readFileSync(new URL('../../data/processed/catalog/catalog.json', import.meta.url), 'utf8'));
test('portal derives counts from memberships and hides empty categories', () => {
  const portal = createPortal(catalog);
  assert.equal(portal.works.length, 19);
  assert.equal(portal.capability_count, 32);
  assert.equal(portal.resource_count, 84);
  for (const work of portal.works) {
    const expected = catalog.coverage.find(item => item.work_id === work.id);
    assert.equal(work.theme_count, expected.theme_count);
    assert.equal(work.resource_count, expected.resource_count);
    assert.ok(work.label.zh && work.label.en);
  }
  assert.ok(!portal.works.some(work => work.id === 'personal-life'));
});
test('same resource in two themes is counted once within a work', () => {
  const result = createPortal({ metadata: {}, works: [{ id: 'a' }, { id: 'empty' }],
    capabilities: [{ id: 't1', work_ids: ['a'], resource_ids: ['r'] }, { id: 't2', work_ids: ['a'], resource_ids: ['r'] }], resources: [{ id: 'r' }] });
  assert.equal(result.works[0].theme_count, 2);
  assert.equal(result.works[0].resource_count, 1);
  assert.equal(result.works.length, 1);
});
test('a shared URL preserves work, language and expanded Trending state', () => {
  const route = { lang: 'en', work: 'sales-marketing', expanded: true };
  assert.deepEqual(readRoute(routeSearch(route), ['sales-marketing']), route);
  assert.equal(readRoute('?lang=zh', [], 'en').lang, 'zh');
});
test('unknown or empty categories cannot become a selected work', () => {
  assert.equal(readRoute('?work=personal-life', ['sales-marketing']).work, null);
  assert.equal(readRoute('?work=%3Cscript%3E&lang=bad', []).lang, 'zh');
});
