import { readFile, mkdir, copyFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createPortal } from '../src/portal.js';
import { createResults } from '../src/results.js';
import { enrichPortalWithConcepts, validateConceptDetails } from '../src/concepts.js';
const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = path.resolve(web, '../data/processed/catalog');
const catalog = JSON.parse(await readFile(path.join(data, 'catalog.json'), 'utf8'));
const navigation = JSON.parse(await readFile(path.resolve(web, '../config/taxonomy/portal-navigation.json'), 'utf8'));
const concepts = JSON.parse(await readFile(path.resolve(web, '../data/processed/concepts/business-concepts.json'), 'utf8'));
concepts.details = JSON.parse(await readFile(path.resolve(web, '../data/processed/concepts/sales-details.json'), 'utf8')).details;
validateConceptDetails(concepts);
const display = JSON.parse(await readFile(path.resolve(web, '../config/resource-display.json'), 'utf8'));
for (const [id, note] of Object.entries(display)) {
  const resource = catalog.resources.find(resource => resource.id === id);
  if (!resource || note.basis_description_en !== resource.summary.en) throw new Error('Display annotation source mismatch: ' + id);
  for (const field of ['input','output']) if (note[field] && (!note[field].zh || !note[field].en)) throw new Error('Missing annotation language: ' + id);
}
const trending = JSON.parse(await readFile(path.join(data, 'trending.json'), 'utf8'));
for (const folder of ['', 'src', 'data']) await mkdir(path.join(web, 'dist', folder), { recursive: true });
for (const file of ['index.html', 'src/app.js', 'src/styles.css', 'src/portal.js', 'src/results.js', 'src/copy.js', 'src/concepts.js'])
  await copyFile(path.join(web, file), path.join(web, 'dist', file));
await writeFile(path.join(web, 'dist/data/portal.json'), JSON.stringify(enrichPortalWithConcepts(createPortal(catalog, navigation), concepts)) + '\n');
await writeFile(path.join(web, 'dist/data/results.json'), JSON.stringify(createResults(catalog, display)) + '\n');
await writeFile(path.join(web, 'dist/data/concepts.json'), JSON.stringify(concepts) + '\n');
const { repositories, source_url, observed_at, period } = trending;
await writeFile(path.join(web, 'dist/data/trending.json'), JSON.stringify({ source_url, observed_at, period,
  repositories: repositories.map(({ repository, url, summary, rank_in_snapshot, weekly_stars }) =>
    ({ repository, url, summary, rank_in_snapshot, weekly_stars })) }) + '\n');
console.log(`Built Layers 1–3: ${createPortal(catalog, navigation).works.length} work entries, ${repositories.length} Trending repos.`);
