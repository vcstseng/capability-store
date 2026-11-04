import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createPortal, readRoute, routeSearch } from '../src/portal.js';
const catalog = JSON.parse(readFileSync(new URL('../../data/processed/catalog/catalog.json', import.meta.url), 'utf8'));
const navigation = JSON.parse(readFileSync(new URL('../../config/taxonomy/portal-navigation.json', import.meta.url), 'utf8'));
test('homepage follows the 10 business / 5 AI reference categories without filling empty groups', () => {
  assert.equal(navigation.categories.filter(c => c.group === 'business').length, 10);
  assert.equal(navigation.categories.filter(c => c.group === 'ai').length, 5);
  const portal = createPortal(catalog, navigation);
  assert.ok(!portal.works.some(w => w.id === 'ai-human-collaboration'));
  assert.equal(portal.works.filter(w => w.group === 'business').length, 10);
  assert.equal(portal.works.filter(w => w.group === 'ai').length, 4);
  for (const work of portal.works) {
    assert.ok(work.label.zh && work.label.en);
    assert.ok(work.examples.length && work.examples.every(e => e.zh && e.en));
    assert.equal(work.theme_count, work.capability_ids.length);
  }
});
test('shared capabilities and resources count once in global totals', () => {
  const portal = createPortal({ metadata: {}, capabilities: [{ id: 't1', resource_ids: ['r'] }, { id: 't2', resource_ids: ['r'] }], resources: [{ id: 'r' }] },
    { groups: [], categories: [{ id: 'a', capability_ids: ['t1', 't1', 't2'] }, { id: 'b', capability_ids: ['t1'] }, { id: 'empty', capability_ids: [] }] });
  assert.equal(portal.works.length, 2);
  assert.equal(portal.works[0].theme_count, 2);
  assert.equal(portal.works[0].resource_count, 1);
  assert.equal(portal.capability_count, 2);
  assert.equal(portal.resource_count, 1);
});
test('reclassification preserves all catalog resources and explicitly retains unassigned themes', () => {
  const before = JSON.stringify(catalog);
  const portal = createPortal(catalog, navigation);
  const visible = new Set(portal.works.flatMap(w => w.capability_ids));
  assert.equal(visible.size + portal.unassigned_capability_ids.length, catalog.capabilities.length);
  assert.equal(portal.catalog_resource_count, 84);
  assert.equal(portal.catalog_capability_count, 32);
  assert.equal(JSON.stringify(catalog), before);
  assert.ok(portal.unassigned_capability_ids.includes('clinical-data'));
});
test('broken capability associations fail the build instead of publishing wrong counts', () => {
  assert.throws(() => createPortal(catalog, { groups: [], categories: [{ capability_ids: ['not-a-theme'] }] }), /Unknown capability/);
});
test('sharing, legacy links, explicit language and unknown selections', () => {
  const state = { lang: 'en', work: 'business-finance', expanded: true };
  assert.deepEqual(readRoute(routeSearch(state), ['business-finance']), state);
  assert.equal(readRoute('?work=finance-accounting', ['business-finance']).work, 'business-finance');
  assert.equal(readRoute('?work=sales-marketing', ['business-sales', 'business-marketing']).work, null);
  assert.equal(readRoute('?work=ai-human-collaboration', ['business-finance']).work, null);
  assert.equal(readRoute('?lang=zh', [], 'en').lang, 'zh');
});
