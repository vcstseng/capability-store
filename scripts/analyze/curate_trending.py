import json, hashlib, re, shutil
from pathlib import Path
ROOT=Path(r'D:\capability-store')
pointer=json.loads((ROOT/'data/processed/resources/trending-snapshot-pointer.json').read_text(encoding='utf-8'))
snap=json.loads((ROOT/pointer['snapshot']).read_text(encoding='utf-8'))
zh={
'thedotmack/claude-mem':'保存、壓縮 Agent 工作階段內容，並在後續工作階段提供相關情境。',
'Nutlope/hallmark':'供程式開發 Agent 使用的介面設計 Skill。',
'pingdotgg/t3code':None,
'pbakaus/impeccable':'提供設計詞彙、修整、批評與介面審查方向，供程式開發 Agent 使用。',
'obra/superpowers':'結合 Agent Skills 的軟體開發框架與工作方法。',
'anthropics/skills':'Agent Skills 的公開資源庫，屬於集合。',
'max-sixty/worktrunk':'用於 Git worktree 管理的命令列工具，面向平行 AI Agent 工作流程。',
'jakubkrehel/skills':'協助建立介面的 Agent Skills 集合。',
'JetBrains/thinkrail':'結合 pi 的輕量 IDE，依開發工作方式調整。',
'ghostty-org/ghostty':'使用原生介面與 GPU 加速的跨平台終端模擬器。',
'multica-ai/andrej-karpathy-skills':'以單一 CLAUDE.md 檔案整理 LLM 寫程式常見問題的行為指引。',
'hyprwm/Hyprland':'可自訂的動態平鋪式 Wayland compositor，屬於桌面環境軟體。',
'AgriciDaniel/claude-seo':'Claude Code 的 SEO Skill 集合，涵蓋技術 SEO、網站結構、在地與電商等方向。',
'calesthio/OpenMontage':'結合製作流程、工具與 Skill／知識檔案的 Agent 影片製作系統。',
'Leonxlnx/taste-skill':'供程式開發 Agent 使用的視覺設計 Skills，強調藝術方向、參考圖與瀏覽器檢查。',
}
rows=[]
for r in snap['repositories']:
    assert r['repository'] in zh
    m=re.search(r'([\d,]+)\s+stars this week',r['weekly_stars_display'] or '')
    rows.append(dict(id='trending-'+r['repository'].lower().replace('/','--'),repository=r['repository'],url=r['url'],
        rank_in_snapshot=r['rank'],summary={'zh':zh[r['repository']],'en':r['description_en'] or None},
        weekly_stars=int(m.group(1).replace(',','')) if m else None,weekly_stars_display=r['weekly_stars_display'],
        evidence={'source_url':snap['source_url'],'snapshot':pointer['snapshot'],'rank':r['rank']},
        review_status='trending_listing_only_not_tested'))
feed=dict(schema_version='0.1-prototype',source_url=snap['source_url'],observed_at=snap['observed_at'],
    http_date=snap['http_headers'].get('Date'),period='weekly',language_filter=None,
    raw_file=snap['raw_file'],raw_sha256=snap['sha256'],repository_count=len(rows),
    note={'zh':'GitHub 本週榜單的觀察快照；保留原始順序，不是推薦排名、採用率或能力驗證。不強制對應工作。',
          'en':'Observed snapshot of GitHub weekly Trending, in source order; not recommendations, adoption evidence or capability validation. No forced work mapping.'},
    repositories=rows)
target=ROOT/'data/processed/catalog/trending.json'
target.write_text(json.dumps(feed,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
assert hashlib.sha256((ROOT/feed['raw_file']).read_bytes()).hexdigest()==feed['raw_sha256']
assert [r['rank_in_snapshot'] for r in rows]==list(range(1,len(rows)+1))
assert len({r['repository'] for r in rows})==len(rows)
catalog_path=ROOT/'data/processed/catalog/catalog.json'
catalog=json.loads(catalog_path.read_text(encoding='utf-8'))
catalog['metadata']['trending_status']='weekly_snapshot_saved_separate_feed'
catalog_path.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
progress_path=ROOT/'data/processed/resources/progress.json'
progress=json.loads(progress_path.read_text(encoding='utf-8'))
progress.update(trending_repository_count=len(rows),trending_observed_at=feed['observed_at'])
progress_path.write_text(json.dumps(progress,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
report=['# GitHub Trending：本週榜單快照','',f"觀察時間（UTC）：{feed['observed_at']}；HTTP 回應日期：{feed['http_date']}。",'',
    f"來源：[GitHub Trending — This week]({feed['source_url']})；所有程式語言，保存當次頁面回傳的 {len(rows)} 筆，不宣稱每天自動更新。",'',
    '這是獨立探索入口，不混入 84 個工作能力候選計數。榜單含 Skills 集合、開發工具及桌面軟體；上榜不代表適合每個企業工作，也不表示已實測。保留 GitHub 頁面順序，不按本週 Stars 重新排序。','',
    '| 順序 | Repo | 中文概括 | 本週新增 Stars（頁面值） |','| ---: | --- | --- | ---: |']
for r in rows:
    report.append(f"| {r['rank_in_snapshot']} | [{r['repository']}]({r['url']}) | {r['summary']['zh'] or '榜單未提供描述，留空待查。'} | {r['weekly_stars'] or ''} |")
report += ['', '中英文資料：`data/processed/catalog/trending.json`。英文保留榜單描述；t3code 當次沒有描述，中英文均留 null。原始 HTML、HTTP headers、擷取行項及 SHA-256 已保存。數字只適用於這次觀察，不代表可比的採用率或維護品質。','']
(ROOT/'docs/trending-review.md').write_text('\n'.join(report),encoding='utf-8')
for path in [ROOT/'AGENTS.md',ROOT/'docs/progress.md',ROOT/'docs/prototype-review.md']:
    content=path.read_text(encoding='utf-8')
    content=content.replace('GitHub Trending 是未來獨立區域，尚未收集，不算能力覆蓋或現在的熱門排名。','GitHub Trending 已另存本週榜單 15 筆快照，見 docs/trending-review.md；不計入能力覆蓋，沒有自動更新。')
    content=content.replace('GitHub Trending 尚未收集，網站、matching、共用 data layer、自動更新均未實作。','GitHub Trending 已另存本週榜單 15 筆快照，中英文及原始來源已保存，見 [榜單 review](trending-review.md)。網站、matching、共用 data layer、自動更新均未實作。')
    content=content.replace('GitHub Trending 仍待獨立整理，沒有混入本輪能力覆蓋或聲稱是最新熱門榜。','GitHub Trending 已獨立整理本週榜單快照 15 筆，見 [榜單 review](trending-review.md)；不計入本輪能力覆蓋，沒有自動更新。')
    path.write_text(content,encoding='utf-8')
with (ROOT/'README.md').open('a',encoding='utf-8') as f:f.write('\nGitHub Trending：另存本週榜單 15 筆快照與中英文資料，見 [榜單 review](docs/trending-review.md)。不計入 84 筆能力候選。\n')
with (ROOT/'docs/data-format-draft.md').open('a',encoding='utf-8') as f:f.write('\n獨立 `trending.json`：觀察時間、週榜來源、原始頁面摘要、原順序、repo、中英文說明與當次週增 Stars；與工作候選分開計數，缺描述保留 null。\n')
for filename,dest in [('collect_trending.py','scripts/collect/collect_trending.py'),('curate_trending.py','scripts/analyze/curate_trending.py')]:
    shutil.copy2(Path(__file__).parent/filename,ROOT/dest)
(ROOT/'docs/reviews/trending-validation.json').write_text(json.dumps(dict(status='passed',rows=len(rows),raw_sha256_verified=True,source_order_verified=True,unique_repositories=True,missing_description_count=sum(r['summary']['en'] is None for r in rows)),indent=2)+'\n',encoding='utf-8')
print(f'Trending complete: {len(rows)} repositories; preserved original order and raw snapshot, one missing description left null.')
