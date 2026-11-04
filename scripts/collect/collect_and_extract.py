import hashlib
import html
import json
import re
import shutil
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen

ROOT = Path(r'D:\capability-store')
assert (ROOT / 'AGENTS.md').is_file()

def save(path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')

def fetch(url):
    with urlopen(Request(url, headers={'User-Agent': 'Capability-Store-Prototype'}), timeout=60) as response:
        return response.read()

def plain(text):
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', text)
    text = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', text)
    return html.unescape(re.sub(r'\s+', ' ', text.replace('**', '').replace('`', ''))).strip()

registry = json.loads((ROOT / 'config/sources.json').read_text(encoding='utf-8'))
stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
observed = datetime.now(timezone.utc).isoformat()
new_folder = ROOT / 'data/raw/snapshots' / ('additional-sources-' + stamp)
new_manifest = []
for source_id, repo, kind in [
    ('composio-skills', 'ComposioHQ/awesome-claude-skills', 'skills'),
    ('official-mcp', 'VoltAgent/official-mcp-servers', 'mcp_tools')
]:
    existing = next((s for s in registry['sources'] if s['id'] == source_id), None)
    if existing:
        continue
    metadata_bytes = fetch('https://api.github.com/repos/' + repo)
    metadata = json.loads(metadata_bytes)
    commit = json.loads(fetch('https://api.github.com/repos/' + repo + '/commits/' + metadata['default_branch']))['sha']
    target = new_folder / source_id
    target.mkdir(parents=True, exist_ok=False)
    body = fetch(f'https://raw.githubusercontent.com/{repo}/{commit}/README.md')
    (target / 'README.md').write_bytes(body)
    (target / 'repository.json').write_bytes(metadata_bytes)
    license_path = None
    for name in ['LICENSE', 'LICENSE.md', 'LICENSE.txt']:
        try:
            license_bytes = fetch(f'https://raw.githubusercontent.com/{repo}/{commit}/{name}')
            (target / name).write_bytes(license_bytes)
            license_path = name
            break
        except Exception as error:
            from urllib.error import HTTPError
            if isinstance(error, HTTPError) and error.code == 404:
                continue
            raise
    source = {'id': source_id, 'repo': repo, 'kind': kind, 'url': 'https://github.com/' + repo,
              'commit': commit, 'status': 'raw_snapshot_saved',
              'snapshot_path': target.relative_to(ROOT).as_posix(),
              'license_spdx': (metadata.get('license') or {}).get('spdx_id'),
              'license_file': license_path, 'observed_at': observed}
    registry['sources'].append(source)
    new_manifest.append({**source, 'sha256': {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in target.iterdir()}})
if new_manifest:
    save(new_folder / 'manifest.json', {'observed_at': observed, 'sources': new_manifest})
registry['prototype_limit'] = 200
registry['record_limit'] = None
save(ROOT / 'config/sources.json', registry)

occurrences = []
for source in registry['sources']:
    readme = ROOT / source['snapshot_path'] / 'README.md'
    lines = readme.read_text(encoding='utf-8').splitlines()
    section = ''
    started = source['id'] == 'official-mcp'
    for number, line in enumerate(lines, 1):
        md = re.match(r'^(#{1,3})\s+(.+)', line)
        h3 = re.search(r'<h3[^>]*>(.*?)</h3>', line)
        if md or h3:
            heading = plain(h3.group(1) if h3 else md.group(2))
            if source['id'] == 'punkpeye-mcp' and md and len(md.group(1)) == 2:
                started = heading == 'Server Implementations'
            if source['id'] == 'composio-skills' and md and len(md.group(1)) == 2:
                started = heading == 'Skills'
            if source['id'] == 'voltagent-skills':
                if heading == 'Official Claude Skills':
                    started = True
                elif md and len(md.group(1)) == 2:
                    started = False
            if source['id'] == 'awesome-llm-apps' and md and len(md.group(1)) == 2:
                started = 'Browse all templates' in heading
            section = heading
        if not started:
            continue
        match = re.match(r'^\s*[-*]\s+\*{0,2}\[([^\]]+)\]\(([^)]+)\)(.*)', line)
        if not match:
            continue
        name, target, tail = match.groups()
        split = re.search(r'\s[-–—]\s', tail)
        if not split:
            continue
        description = plain(tail[split.end():])
        if len(description) < 8 or target.startswith('#'):
            continue
        if target.startswith(('http://', 'https://')):
            url = target
        else:
            url = urljoin(f"https://github.com/{source['repo']}/tree/{source['commit']}/", target)
        parsed = urlsplit(url)
        if parsed.scheme not in ('http', 'https') or not parsed.netloc:
            continue
        clean_path = parsed.path.rstrip('/')
        if parsed.hostname.lower() == 'github.com':
            parts = clean_path.split('/')
            if len(parts) >= 3:
                parts[1:3] = [p.lower() for p in parts[1:3]]
                clean_path = '/'.join(parts)
        key = urlunsplit((parsed.scheme.lower(), parsed.netloc.lower(), clean_path, parsed.query, parsed.fragment))
        kind = 'mcp_tool' if source['kind'] == 'mcp_tools' else 'skill' if source['kind'] == 'skills' else 'agent' if 'Agent' in section else 'application_example'
        if source['kind'] == 'application_repos' and 'Agent Skills' in section:
            kind = 'skill'
        occurrences.append({'source_id': source['id'], 'source_repo': source['repo'], 'source_commit': source['commit'],
            'source_file': readme.relative_to(ROOT).as_posix(), 'source_line': number, 'source_section': section,
            'raw_text': line, 'name': plain(name), 'description_en': description, 'url': url, 'url_key': key, 'suggested_type': kind})

by_url = {}
for item in occurrences:
    by_url.setdefault(item['url_key'], []).append(item)
candidates = []
for url, refs in by_url.items():
    candidate_id = 'cap-' + hashlib.sha256(url.encode()).hexdigest()[:14]
    refs.sort(key=lambda x: (['official-mcp', 'composio-skills', 'voltagent-skills', 'awesome-llm-apps', 'punkpeye-mcp'].index(x['source_id']), x['source_line']))
    primary = refs[0]
    candidates.append({'id': candidate_id, 'name': primary['name'], 'url': primary['url'],
        'description_en': primary['description_en'], 'types': sorted({r['suggested_type'] for r in refs}),
        'source_sections': sorted({r['source_section'] for r in refs}), 'sources': refs,
        'review_status': 'unreviewed', 'metrics': None})
candidates.sort(key=lambda x: x['id'])
out = ROOT / 'data/processed/resources'
save(out / 'candidate-pool.json', {'schema_version': '0.1-draft', 'observed_at': observed,
    'note': 'Mechanically extracted candidates, not reviewed resources. Exact resolved URL grouping only; cross-source aliases may remain.',
    'source_count': len(registry['sources']), 'occurrence_count': len(occurrences), 'candidate_count': len(candidates), 'resources': candidates})
totals = {s['id']: sum(o['source_id'] == s['id'] for o in occurrences) for s in registry['sources']}
save(out / 'extraction-report.json', {'observed_at': observed, 'occurrences_by_source': totals,
    'occurrences': len(occurrences), 'exact_url_groups': len(candidates), 'removed_repeat_occurrences': len(occurrences)-len(candidates),
    'prototype_limit': 200, 'reviewed_count': 0, 'alias_deduplication': 'pending review'})
progress = json.loads((out / 'progress.json').read_text(encoding='utf-8'))
progress.update({'phase': 'candidate_extraction', 'status': 'prototype_selection_in_progress', 'source_count': len(registry['sources']),
                 'prototype_limit': 200, 'normalized_record_count': len(candidates), 'reviewed_record_count': 0,
                 'counts_pending_extraction': False, 'latest_additional_snapshot': new_folder.relative_to(ROOT).as_posix() if new_manifest else None})
save(out / 'progress.json', progress)
script = ROOT / 'scripts/collect/collect_and_extract.py'
if Path(__file__).resolve() != script.resolve():
    shutil.copyfile(__file__, script)
assert len({r['id'] for r in candidates}) == len(candidates)
for r in candidates:
    for ref in r['sources']:
        assert (ROOT / ref['source_file']).read_text(encoding='utf-8').splitlines()[ref['source_line']-1] == ref['raw_text']
print(json.dumps({'sources': totals, 'occurrences':len(occurrences),'candidates':len(candidates),'validation':'source line references match raw'}))
