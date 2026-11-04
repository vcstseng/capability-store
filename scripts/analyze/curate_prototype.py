import json, hashlib, re
from pathlib import Path
from collections import Counter

ROOT = Path(r'D:\capability-store')
POOL = ROOT / 'data/processed/resources/candidate-pool.json'
pool = json.loads(POOL.read_text(encoding='utf-8'))['resources']

# Explicit annotations against the immutable candidate-pool snapshot; not keyword classification.
annotations = '''
8|將檔案與文件轉為 Markdown，供後續文字處理使用。
5270|文件轉換與處理工具。
5602|處理與匯入非結構化文件。
1973|處理試算表公式、圖表與資料轉換。
864|從資料倉儲查詢資料，產生回答、圖表與 SQL。
807|以自然語言對 CSV 或 Excel 檔案提問的應用範例。
4282|連結與摘要相關文件，整理成知識網絡。
495|搜尋與查詢 GitBook 文件空間。
1400|唯讀查詢帶有版本資訊與原始連結的文件。
3205|提供網頁搜尋與內容擷取。
218|提供網頁搜尋與程式碼情境查詢。
5749|結合 OpenAI Agents SDK 與 Firecrawl 的網路研究範例。
4829|存取會議逐字稿與會議洞察。
3495|查詢會議筆記與逐字稿。
838|從會議逐字稿分析發言比例、語助詞與互動模式。
6081|透過 Cal.com 處理排程。
3830|管理 Google Calendar 活動、參與者、空閒時間與重複活動。
465|透過 Dart 管理專案與任務。
4314|存取 Notion 頁面與資料庫。
4992|從終端介面與 Notion 頁面互動的 Agent 範例。
4482|讀取發票與收據、擷取資訊並重新命名，協助整理文件。
5348|從 AI 助理建立與檢視發票。
4294|連接 Xero 會計資料。
2045|存取 QuickBooks Online 會計資料與報表。
4552|提供 PayPal 付款與商務相關工具。
2590|存取 Square 付款、商品目錄與訂單。
453|存取 Salesforce CRM 資料與操作。
2364|透過遠端 MCP 存取 HubSpot CRM 資料。
5391|管理 Zoho CRM 潛在客戶、聯絡人、交易與帳戶。
1181|取得 Apollo.io 潛在客戶與銷售資料。
945|依產品分析、目標公司搜尋與聯繫策略建議，協助研究潛在客戶。
1179|查詢多個行銷平台的資料。
1589|取得 SEO 關鍵字、連結與網站指標。
1243|從廣告資料庫擷取與分析競爭者廣告的訊息與創意。
6387|協助內容研究、引用資料、文章開頭與分段寫作回饋。
3689|模擬讀者對草稿的反應，提供閱讀回饋。
6176|研究、撰寫與編輯文章的 Agent 範例。
5974|建立與編輯 Canva 設計。
1733|讀取與寫入 Google Slides 簡報。
3041|建立、編輯與分析 PowerPoint 簡報。
2071|存取 Intercom 對話與聯絡人。
4957|管理 Intercom 對話、聯絡人、公司、工單與文章。
6055|提供中英文常見問題回覆、可預約時段查詢與預約。
6271|管理 Zendesk 工單、使用者、組織、搜尋與巨集。
3285|讀寫 Zendesk 工單、留言與相關管理資料。
4544|存取職缺、候選人與招募流程。
4181|管理 BambooHR 員工、休假、報表與通訊錄。
5582|涵蓋履歷篩選與面試排程的招募 Agent 團隊範例。
5741|包含 NDA 分流、合約版本比較、引文查核與會議簡報等工作的法律 Skill 集合。
1081|法律研究、合約分析與策略規劃的 Agent 團隊範例。
1995|透過 SignNow 管理電子簽署文件與簽署邀請。
1202|在 Agent 工作流程中執行安全掃描。
5439|應用程式安全掃描工具。
5806|以 Sigma 規則進行威脅搜尋與安全事件分析。
4660|提供瀏覽器自動化操作。
3964|以 Playwright 測試本機網頁應用，檢查前端功能、除錯與擷取畫面。
970|提供 LLM 可觀測性與評估。
5147|提供 LLM 可觀測性與評估。
4628|建立 Agent 系統的評估框架。
1596|存取 Langfuse 的提示詞管理。
3418|從 LangSmith Studio 取得並分析 LangChain／LangGraph 執行軌跡。
2159|提供資料與 AI 可觀測性，包含監測、資料沿襲與警示。
1851|查詢 Zabbix 主機、觸發條件與問題。
1425|基礎設施監測與根因分析。
1818|應用程式效能監測。
3493|搜尋 Udemy Business 課程與學習內容。
1728|建立與複習 Anki 記憶卡。
877|搜尋 O’Reilly 書籍、課程與學習內容。
5626|提供運價比較、庫存、訂單追蹤、車隊物流與需求預測相關工具。
3966|取得供應鏈中斷、商品價格、港口壅塞、運費與貿易政策等風險資料。
4734|搜尋德國公開採購資料，依公司資料進行標案語意匹配與篩選。
3627|搜尋俄羅斯公開採購標案與合約。
296|連接支援 OPC UA 的工業系統。
3868|連接不同協定與製造商的工業設備，處理遙測與設備健康資料。
6|以自然語言在 Fusion 360 建立草圖、實體與零件模型。
4271|建立、檢視與量測 3D 幾何，並匯出 STEP／STL 等格式。
6342|處理 KiCad 電路圖、PCB 佈局、規則檢查與製造檔案匯出。
5266|連接 FHIR 伺服器，查詢病患病歷等資料。
1270|透過 FHIR API 與 SMART on FHIR 授權，搜尋、讀寫與分析臨床資料。
2325|透過 Climatiq API 計算碳排與氣候影響。
3022|依電力碳強度與預估延遲比較雲端區域，並提供批次工作時段建議；即時資料需額外服務。
5603|從工程圖 PDF 擷取公差等資訊，產生品質管制計畫、標註圖面與 Excel 報表。
637|提供時間序列的機率預測，可指定模型或整合多個模型的預測。
1293|對 CSV 或串接服務的資料進行統計分析、預測與機器學習，輸出互動報告。
'''

themes = [
('document-conversion','文件轉換與擷取','Document conversion and extraction',['data-knowledge'],[8,5270,5602]),
('data-analysis','表格與資料分析','Spreadsheet and data analysis',['data-knowledge'],[1973,864,807]),
('knowledge-access','文件知識查詢','Documentation and knowledge access',['data-knowledge'],[4282,495,1400]),
('web-research','網路研究與資料蒐集','Web research and collection',['research-discovery'],[3205,218,5749]),
('meeting-review','會議記錄與回顧','Meeting records and review',['operations-planning'],[4829,3495,838]),
('scheduling','行事曆與預約','Calendar and scheduling',['operations-planning'],[6081,3830]),
('work-coordination','任務與協作資料','Tasks and collaboration data',['operations-planning'],[465,4314,4992]),
('invoices','發票與收據處理','Invoices and receipts',['finance-accounting'],[4482,5348]),
('accounting','會計資料存取','Accounting data access',['finance-accounting'],[4294,2045]),
('payments','付款與訂單操作','Payments and orders',['finance-accounting'],[4552,2590]),
('crm','客戶資料與銷售流程','CRM data and sales workflows',['sales-marketing'],[453,2364,5391]),
('prospecting','潛在客戶研究','Prospect research',['sales-marketing'],[1181,945]),
('marketing-research','行銷與競品資料','Marketing and competitor data',['sales-marketing'],[1179,1589,1243]),
('writing','內容研究與寫作','Content research and writing',['content-creative'],[6387,3689,6176]),
('visual-content','設計與簡報製作','Design and presentations',['content-creative'],[5974,1733,3041]),
('customer-conversations','客戶對話與預約','Customer conversations and bookings',['customer-service'],[2071,4957,6055]),
('support-tickets','客服工單處理','Support ticket handling',['customer-service'],[6271,3285]),
('people-operations','招募與人事資料','Recruitment and people data',['people-workforce'],[4544,4181,5582]),
('legal-documents','法律文件研究與簽署','Legal document research and signing',['legal-compliance'],[5741,1081,1995]),
('security-review','安全掃描與威脅分析','Security scanning and threat analysis',['risk-security'],[1202,5439,5806]),
('web-testing','網頁操作與測試','Browser automation and web testing',['software-development'],[4660,3964]),
('ai-evaluation','AI 評估與觀測','AI evaluation and observability',['ai-lifecycle'],[970,5147,4628]),
('ai-operations','提示詞、軌跡與資料觀測','Prompts, traces and data observability',['ai-lifecycle'],[1596,3418,2159]),
('system-monitoring','系統監測與問題追蹤','System monitoring and issue investigation',['software-development'],[1851,1425,1818]),
('learning','學習內容與複習','Learning content and review',['education-training'],[3493,1728,877]),
('supplychain','供應鏈營運與風險資料','Supply chain operations and risk data',['supplychain-procurement'],[5626,3966]),
('procurement-search','公開標案搜尋','Public procurement search',['supplychain-procurement'],[4734,3627]),
('industrial-data','工業設備資料連接','Industrial equipment data connections',['production-quality'],[296,3868]),
('engineering','工程建模與圖面處理','Engineering models and drawings',['engineering-design'],[6,4271,6342,5603]),
('clinical-data','臨床資料存取','Clinical data access',['healthcare-care'],[5266,1270]),
('carbon','碳排估算與雲端區域比較','Carbon estimates and cloud region comparison',['energy-environment'],[2325,3022]),
('forecasting','資料分析與時間序列預測','Data analysis and time-series forecasting',['assessment-detection'],[637,1293]),
]

work_en = ['Sales and marketing','Customer service','Finance, accounting and payments','Legal, contracts and compliance','Risk, security, privacy and identity','Recruitment and workforce','Procurement, supply chain and inventory','Production, processes and quality','Facilities, property and maintenance','Healthcare and care support','Research and discovery','Software development, testing and operations','AI development, evaluation and governance','Education and training','Content, media and creative design','Data, documents and knowledge','Operations, planning and collaboration','Personal life and companionship','Energy, environment and sustainability','Matching, transactions and brokerage','Engineering design and simulation','Assessment, detection and measurement']

def write(path, value):
    target=ROOT/path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n',encoding='utf-8')

def run():
    notes={int(line.split('|',1)[0]):line.split('|',1)[1] for line in annotations.strip().splitlines()}
    selected=sorted({i for t in themes for i in t[4]})
    assert set(selected)==set(notes), (set(selected)-set(notes),set(notes)-set(selected))
    resources=[]
    for i in selected:
        r=pool[i]
        types=r['types']
        if i in [807,5749,4992,6176,5582,1081]: types=['agent_example']
        if i==5741: types=['skill_collection']
        if i==4552: types=['toolkit']
        repo=re.match(r'https://github\.com/([^/]+/[^/#?]+)',r['url'],re.I)
        resources.append(dict(id=r['id'],name=r['name'],url=r['url'],types=types,
            summary={'zh':notes[i],'en':r['description_en']},
            summary_basis='curated-list description; not independently tested',
            parent_repository=('https://github.com/'+repo.group(1)) if repo else None,
            metrics=None,license=None,review_status='directory_reviewed_not_tested',
            evidence=r['sources'],candidate_pool_index=i))
    own_taxonomy=ROOT/'config/taxonomy/work-reference.json'
    if own_taxonomy.exists():
        taxonomy=json.loads(own_taxonomy.read_text(encoding='utf-8'))
    else:
        work_raw=json.loads(Path(r'D:\startup-radar\data\processed\catalog\v1\taxonomy.json').read_text(encoding='utf-8'))
        cats=[c for c in work_raw['dimensions']['problem_workflow']['categories'] if not c['id'].startswith('__')]
        taxonomy=[{'id':c['id'],'label':{'zh':c['label_zh'],'en':en}} for c,en in zip(cats,work_en)]
    assert len(taxonomy)==22
    entries=[dict(id=id,label={'zh':zh,'en':en},work_ids=works,resource_ids=[pool[i]['id'] for i in inds],
                 scope='industry_example' if id in ['industrial-data','engineering','clinical-data','carbon'] else 'enterprise_work')
             for id,zh,en,works,inds in themes]
    coverage=[]
    for w in taxonomy:
        ts=[t for t in entries if w['id'] in t['work_ids']]
        coverage.append(dict(work_id=w['id'],theme_count=len(ts),resource_count=len({rid for t in ts for rid in t['resource_ids']}),
                             status='has_candidates' if ts else 'not_curated_in_prototype'))
    meta={'schema_version':'0.1-prototype','review_date':'2026-11-04','languages':['zh','en'],
          'candidate_pool_sha256':hashlib.sha256(POOL.read_bytes()).hexdigest(),
          'source_count':5,'candidate_occurrences':6551,'exact_url_candidate_count':len(pool),
          'capability_count':len(entries),'resource_count':len(resources),'tested_count':0,
          'basis':'Review of saved curated-list entries; not installation, original-repository audit, or popularity verification.',
          'selection_policy':'Concrete enterprise work first; 2–4 choices per theme; limited industry examples; no type quotas.',
          'trending_status':'planned_separate_section_not_collected'}
    write(Path('data/processed/catalog/catalog.json'),dict(metadata=meta,works=taxonomy,capabilities=entries,resources=resources,coverage=coverage))
    progress=json.loads((ROOT/'data/processed/resources/progress.json').read_text(encoding='utf-8'))
    progress.update(phase='prototype_curation',status='ready_for_user_review',reviewed_record_count=len(resources),
                    capability_count=len(entries),tested_record_count=0,prototype_limit=None,
                    batches=[{'id':'round-001','date':'2026-11-04','resource_count':len(resources),'capability_count':len(entries)}])
    write(Path('data/processed/resources/progress.json'),progress)
    config=json.loads((ROOT/'config/sources.json').read_text(encoding='utf-8'))
    config['prototype_limit']=None
    config['prototype_selection_policy']='About 30 concrete capability themes, 2–4 candidates each; no filler or type quotas.'
    write(Path('config/sources.json'),config)
    report=['# 能力便利商店：首版資料 review','', '日期：2026-11-04。這是資料 prototype，網站尚未開始。','',
       f'五份來源保存了 6,551 個清單項目，依完全相同 URL 整併後為 {len(pool):,} 個候選；本輪選出 **{len(entries)} 個能力主題、{len(resources)} 個資源候選**。來源清單的收錄不代表採用率、品質排名或已測試。','',
       '## 怎麼看這份資料','',
       '工作 → 具體能力 → 2–4 個候選。候選是不同切入方式，不保證能互相替換。例如發票整理與發票建立、資料連接與應用範例，使用前提不同。原始英文描述與中文概括並存，可回查來源檔案與行號。','',
       '企業共通工作為主，工業、工程、醫療與碳排為少量補充例子。資源類型不設配額；集合不拆成虛構能力，也不把來源清單的 Stars 當成子項目的 Stars。','',
       '## 能力與候選','']
    byid={r['id']:r for r in resources}
    for t in entries:
        report += [f"### {t['label']['zh']} / {t['label']['en']}",'']
        for rid in t['resource_ids']:
            r=byid[rid]
            report.append(f"- [{r['name']}]({r['url']})（{', '.join(r['types'])}）：{r['summary']['zh']}")
        report.append('')
    report += ['## 覆蓋與缺口','', '| 工作 | 主題數 | 資源數 |','| --- | ---: | ---: |']
    for w,c in zip(taxonomy,coverage): report.append(f"| {w['label']['zh']} | {c['theme_count']} | {c['resource_count']} |")
    report += ['', '工作對應只表示有相關步驟的候選，不表示整個工作流程或 99 Problems 題庫已被解決。評估、偵測與量測類別未以一般安全掃描或監測項目充數；媒合與交易也未以標案搜尋代替完整媒合能力。缺口保留，等待 review 後決定是否補充。','',
       '## 本輪限制與下一步','',
       '- 0 筆安裝或實測；尚未逐一審查原始資源庫。來源中的宣稱仍是作者／清單說法。',
       '- Stars、維護訊號、個別授權與測試結果尚未補查，保留 null；不宣稱這些是大家都用得好的資源。',
       '- MCP 多需帳號、API、授權或自架環境；Skill／Agent 範例也不等於現成商業產品。安裝前才做個別相容性、權限與授權檢查。',
       '- 少數主題較寬，用來 review 能力粒度；這些主題不預設為最終 UI 分類。',
       '- GitHub Trending 仍待獨立整理，沒有混入本輪能力覆蓋或聲稱是最新熱門榜。',
       '- 下一步一起 review 這份資料，再討論 L1–L3；本輪不做網站、自動 matching 或安裝。','',
       '網站資料：`data/processed/catalog/catalog.json`。完整候選池另外保留，不會全部出現在首版。','']
    (ROOT/'docs/prototype-review.md').write_text('\n'.join(report),encoding='utf-8')
    print(json.dumps(meta,ensure_ascii=False))

if __name__=='__main__': run()
