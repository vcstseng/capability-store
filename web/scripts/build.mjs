import { readFile, mkdir, copyFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createPortal } from '../src/portal.js';
const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = path.resolve(web, '../data/processed/catalog');
const catalog = JSON.parse(await readFile(path.join(data, 'catalog.json'), 'utf8'));
const navigation = JSON.parse(await readFile(path.resolve(web, '../config/taxonomy/portal-navigation.json'), 'utf8'));
const trending = JSON.parse(await readFile(path.join(data, 'trending.json'), 'utf8'));
for (const folder of ['', 'src', 'data']) await mkdir(path.join(web, 'dist', folder), { recursive: true });
for (const file of ['index.html', 'src/app.js', 'src/styles.css', 'src/portal.js'])
  await copyFile(path.join(web, file), path.join(web, 'dist', file));
await writeFile(path.join(web, 'dist/data/portal.json'), JSON.stringify(createPortal(catalog, navigation)) + '\n');
const { repositories, source_url, observed_at, period } = trending;
await writeFile(path.join(web, 'dist/data/trending.json'), JSON.stringify({ source_url, observed_at, period,
  repositories: repositories.map(({ repository, url, summary, rank_in_snapshot, weekly_stars }) =>
    ({ repository, url, summary, rank_in_snapshot, weekly_stars })) }) + '\n');
console.log(`Built Layer 1: ${createPortal(catalog, navigation).works.length} work entries, ${repositories.length} Trending repos.`);
