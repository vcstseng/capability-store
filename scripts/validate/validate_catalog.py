"""Offline integrity checks for the curated prototype and its saved evidence."""
import hashlib
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]

def main():
    catalog=json.loads((ROOT/'data/processed/catalog/catalog.json').read_text(encoding='utf-8'))
    pool_path=ROOT/'data/processed/resources/candidate-pool.json'
    pool=json.loads(pool_path.read_text(encoding='utf-8'))['resources']
    meta=catalog['metadata']
    assert hashlib.sha256(pool_path.read_bytes()).hexdigest()==meta['candidate_pool_sha256']
    source_commits={}
    checked_files=0
    for manifest_path in (ROOT/'data/raw/snapshots').glob('*/manifest.json'):
        manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
        for source in manifest['sources']:
            source_commits[source['id']]=source['commit']
            for filename,digest in source['sha256'].items():
                path=ROOT/source['snapshot_path']/filename
                assert hashlib.sha256(path.read_bytes()).hexdigest()==digest, str(path)
                checked_files+=1
    resources=catalog['resources']
    byid={r['id']:r for r in resources}
    assert len(byid)==len(resources)==meta['resource_count']
    assert len({r['url'] for r in resources})==len(resources)
    assert all(r['label']['zh'] and r['label']['en'] for r in catalog['works'])
    work_ids={w['id'] for w in catalog['works']}
    assert len(work_ids)==22
    source_lines={}
    evidence_count=0
    for r in resources:
        candidate=pool[r['candidate_pool_index']]
        assert (r['id'],r['name'],r['url'])==(candidate['id'],candidate['name'],candidate['url'])
        assert r['summary']['en']==candidate['description_en']
        assert r['summary']['zh'].strip() and r['summary']['en'].strip()
        assert r['types'] and r['metrics'] is None and r['license'] is None
        assert r['review_status']=='directory_reviewed_not_tested'
        assert r['evidence']==candidate['sources']
        for e in r['evidence']:
            assert e['source_commit']==source_commits[e['source_id']]
            path=(ROOT/e['source_file']).resolve()
            assert path.is_relative_to((ROOT/'data/raw').resolve())
            if path not in source_lines: source_lines[path]=path.read_text(encoding='utf-8').splitlines()
            assert source_lines[path][e['source_line']-1]==e['raw_text'], r['id']
            evidence_count+=1
    themes=catalog['capabilities']
    assert len({t['id'] for t in themes})==len(themes)==meta['capability_count']
    for t in themes:
        assert t['label']['zh'] and t['label']['en']
        assert 2<=len(t['resource_ids'])<=4
        assert len(set(t['resource_ids']))==len(t['resource_ids'])
        assert set(t['resource_ids'])<=byid.keys()
        assert set(t['work_ids'])<=work_ids
    assert {rid for t in themes for rid in t['resource_ids']}==byid.keys()
    assert len(catalog['coverage'])==22
    for c in catalog['coverage']:
        matching=[t for t in themes if c['work_id'] in t['work_ids']]
        assert c['theme_count']==len(matching)
        assert c['resource_count']==len({rid for t in matching for rid in t['resource_ids']})
    progress=json.loads((ROOT/'data/processed/resources/progress.json').read_text(encoding='utf-8'))
    assert progress['reviewed_record_count']==len(resources)
    assert progress['capability_count']==len(themes)
    assert progress['normalized_record_count']==len(pool)
    assert progress['tested_record_count']==meta['tested_count']==0
    result=dict(status='passed',capabilities=len(themes),resources=len(resources),
                covered_work_categories=sum(c['theme_count']>0 for c in catalog['coverage']),
                total_work_categories=22,evidence_references=evidence_count,raw_files_hash_verified=checked_files,
                checks=['candidate pool digest','unique identifiers and URLs','bilingual fields','2–4 candidates per theme',
                        'valid references','source commits and exact source lines','raw snapshot hashes','coverage and progress totals'])
    output=ROOT/'docs/reviews/round-001-validation.json'
    output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False))

if __name__=='__main__':main()
