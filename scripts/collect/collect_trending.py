import urllib.request, json, hashlib
from datetime import datetime,timezone
from pathlib import Path
from bs4 import BeautifulSoup

ROOT=Path(r'D:\capability-store')
URL='https://github.com/trending?since=weekly'
request=urllib.request.Request(URL,headers={'User-Agent':'CapabilityStore-Prototype/0.1','Cache-Control':'no-cache'})
with urllib.request.urlopen(request,timeout=45) as response:
    html=response.read()
    headers={k:v for k,v in response.headers.items() if k.lower() not in ['set-cookie','cookie','authorization']}
    status=response.status
now=datetime.now(timezone.utc).isoformat()
soup=BeautifulSoup(html,'html.parser')
entries=[]
for rank,row in enumerate(soup.select('article.Box-row'),1):
    link=row.select_one('h2 a')
    if not link:continue
    repo=link.get('href','').strip('/')
    desc=row.select_one('p')
    weekly=row.select_one('span.d-inline-block.float-sm-right')
    entries.append(dict(rank=rank,repository=repo,url='https://github.com/'+repo,
        description_en=desc.get_text(' ',strip=True) if desc else '',
        weekly_stars_display=weekly.get_text(' ',strip=True) if weekly else None,
        raw_text=row.get_text(' ',strip=True)))
assert entries, 'No repository rows found; do not publish an empty ranking.'
folder=ROOT/'data/raw/snapshots'/('trending-weekly-'+datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ'))
folder.mkdir(parents=True,exist_ok=False)
(folder/'page.html').write_bytes(html)
snapshot=dict(source_url=URL,observed_at=now,http_status=status,http_headers=headers,
    raw_file=str((folder/'page.html').relative_to(ROOT)).replace('\\','/'),
    sha256=hashlib.sha256(html).hexdigest(),period='weekly',language_filter=None,
    note='Observed response from GitHub weekly page; not a guaranteed calendar-week range or proof of adoption.',repositories=entries)
(folder/'extracted.json').write_text(json.dumps(snapshot,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT/'data/processed/resources/trending-snapshot-pointer.json').write_text(json.dumps({'snapshot':str((folder/'extracted.json').relative_to(ROOT)).replace('\\','/')},indent=2)+'\n',encoding='utf-8')
print(json.dumps({'snapshot':str(folder),'observed_at':now,'http_date':headers.get('Date'),'rows':len(entries)},ensure_ascii=False))
for row in entries: print(row['rank'],row['repository'],'|',row['description_en'],'|',row['weekly_stars_display'])
