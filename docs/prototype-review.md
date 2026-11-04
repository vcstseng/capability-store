# 能力便利商店：首版資料 review

日期：2026-11-04。這是資料 prototype，網站尚未開始。

五份來源保存了 6,551 個清單項目，依完全相同 URL 整併後為 6,459 個候選；本輪選出 **32 個能力主題、84 個資源候選**。來源清單的收錄不代表採用率、品質排名或已測試。

## 怎麼看這份資料

工作 → 具體能力 → 2–4 個候選。候選是不同切入方式，不保證能互相替換。例如發票整理與發票建立、資料連接與應用範例，使用前提不同。原始英文描述與中文概括並存，可回查來源檔案與行號。

企業共通工作為主，工業、工程、醫療與碳排為少量補充例子。資源類型不設配額；集合不拆成虛構能力，也不把來源清單的 Stars 當成子項目的 Stars。

## 能力與候選

### 文件轉換與擷取 / Document conversion and extraction

- [Microsoft MarkItDown](https://github.com/microsoft/markitdown/tree/main/packages/markitdown-mcp)（mcp_tool）：將檔案與文件轉為 Markdown，供後續文字處理使用。
- [Docling](https://github.com/docling-project/docling-mcp)（mcp_tool）：文件轉換與處理工具。
- [Unstructured-IO/UNS-MCP](https://github.com/Unstructured-IO/UNS-MCP)（mcp_tool）：處理與匯入非結構化文件。

### 表格與資料分析 / Spreadsheet and data analysis

- [xlsx](https://github.com/anthropics/skills/tree/main/skills/xlsx)（skill）：處理試算表公式、圖表與資料轉換。
- [Dot (getdot.ai)](https://docs.getdot.ai/developers/mcp)（mcp_tool）：從資料倉儲查詢資料，產生回答、圖表與 SQL。
- [📊 AI Data Analysis Agent](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/6c16b23f1bacd0fdf240bb5141ef45e59e82c306/starter_ai_agents/ai_data_analysis_agent/)（agent_example）：以自然語言對 CSV 或 Excel 檔案提問的應用範例。

### 文件知識查詢 / Documentation and knowledge access

- [tapestry](https://github.com/michalparkola/tapestry-skills-for-claude-code/tree/main/tapestry)（skill）：連結與摘要相關文件，整理成知識網絡。
- [GitBook](https://gitbook.com/docs/getting-started/ai-documentation/gitbook-mcp)（mcp_tool）：搜尋與查詢 GitBook 文件空間。
- [Docsy](https://docsy.remcp.site/docs)（mcp_tool）：唯讀查詢帶有版本資訊與原始連結的文件。

### 網路研究與資料蒐集 / Web research and collection

- [Tavily](https://github.com/tavily-ai/tavily-mcp)（mcp_tool）：提供網頁搜尋與內容擷取。
- [exa-labs/exa-mcp-server](https://github.com/exa-labs/exa-mcp-server)（mcp_tool）：提供網頁搜尋與程式碼情境查詢。
- [🔍 AI Deep Research Agent](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/6c16b23f1bacd0fdf240bb5141ef45e59e82c306/advanced_ai_agents/single_agent_apps/ai_deep_research_agent/)（agent_example）：結合 OpenAI Agents SDK 與 Firecrawl 的網路研究範例。

### 會議記錄與回顧 / Meeting records and review

- [Otter.ai](https://help.otter.ai/hc/en-us/articles/35287607569687-Otter-MCP-Server)（mcp_tool）：存取會議逐字稿與會議洞察。
- [Granola](https://docs.granola.ai/help-center/sharing/integrations/mcp)（mcp_tool）：查詢會議筆記與逐字稿。
- [Meeting Insights Analyzer](https://github.com/ComposioHQ/awesome-claude-skills/tree/be2a406907dbc61b73e6827ded415c96139d13a2/meeting-insights-analyzer/)（skill）：從會議逐字稿分析發言比例、語助詞與互動模式。

### 行事曆與預約 / Calendar and scheduling

- [Cal.com](https://github.com/calcom/cal-mcp)（mcp_tool）：透過 Cal.com 處理排程。
- [Google Calendar Automation](https://github.com/ComposioHQ/awesome-claude-skills/tree/be2a406907dbc61b73e6827ded415c96139d13a2/google-calendar-automation/)（skill）：管理 Google Calendar 活動、參與者、空閒時間與重複活動。

### 任務與協作資料 / Tasks and collaboration data

- [its-dart/dart-mcp-server](https://github.com/its-dart/dart-mcp-server)（mcp_tool）：透過 Dart 管理專案與任務。
- [Notion](https://github.com/makenotion/notion-mcp-server)（mcp_tool）：存取 Notion 頁面與資料庫。
- [📑 Notion MCP Agent](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/6c16b23f1bacd0fdf240bb5141ef45e59e82c306/mcp_ai_agents/notion_mcp_agent)（agent_example）：從終端介面與 Notion 頁面互動的 Agent 範例。

### 發票與收據處理 / Invoices and receipts

- [Invoice Organizer](https://github.com/ComposioHQ/awesome-claude-skills/tree/be2a406907dbc61b73e6827ded415c96139d13a2/invoice-organizer/)（skill）：讀取發票與收據、擷取資訊並重新命名，協助整理文件。
- [Invompt](https://github.com/Invompt/invompt-mcp)（mcp_tool）：從 AI 助理建立與檢視發票。

### 會計資料存取 / Accounting data access

- [XeroAPI/xero-mcp-server](https://github.com/XeroAPI/xero-mcp-server)（mcp_tool）：連接 Xero 會計資料。
- [QuickBooks](https://github.com/intuit/quickbooks-online-mcp-server)（mcp_tool）：存取 QuickBooks Online 會計資料與報表。

### 付款與訂單操作 / Payments and orders

- [paypal/agent-toolkit](https://github.com/paypal/agent-toolkit)（toolkit）：提供 PayPal 付款與商務相關工具。
- [square/square-mcp-server](https://github.com/square/square-mcp-server)（mcp_tool）：存取 Square 付款、商品目錄與訂單。

### 客戶資料與銷售流程 / CRM data and sales workflows

- [Salesforce](https://developer.salesforce.com/docs/platform/hosted-mcp-servers/guide/headless-360-mcp.html)（mcp_tool）：存取 Salesforce CRM 資料與操作。
- [HubSpot](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server)（mcp_tool）：透過遠端 MCP 存取 HubSpot CRM 資料。
- [Zoho CRM Automation](https://github.com/ComposioHQ/awesome-claude-skills/tree/be2a406907dbc61b73e6827ded415c96139d13a2/zoho-crm-automation/)（skill）：管理 Zoho CRM 潛在客戶、聯絡人、交易與帳戶。

### 潛在客戶研究 / Prospect research

- [apolloio/apollo-mcp-plugin](https://github.com/apolloio/apollo-mcp-plugin)（mcp_tool）：取得 Apollo.io 潛在客戶與銷售資料。
- [Lead Research Assistant](https://github.com/ComposioHQ/awesome-claude-skills/tree/be2a406907dbc61b73e6827ded415c96139d13a2/lead-research-assistant/)（skill）：依產品分析、目標公司搜尋與聯繫策略建議，協助研究潛在客戶。

### 行銷與競品資料 / Marketing and competitor data

- [Supermetrics](https://github.com/supermetrics-public/supermetrics-mcp)（mcp_tool）：查詢多個行銷平台的資料。
- [Moz](https://moz.com/api/docs/guides/mcp-servers)（mcp_tool）：取得 SEO 關鍵字、連結與網站指標。
- [Competitive Ads Extractor](https://github.com/ComposioHQ/awesome-claude-skills/tree/be2a406907dbc61b73e6827ded415c96139d13a2/competitive-ads-extractor/)（skill）：從廣告資料庫擷取與分析競爭者廣告的訊息與創意。

### 內容研究與寫作 / Content research and writing

- [Content Research Writer](https://github.com/ComposioHQ/awesome-claude-skills/tree/be2a406907dbc61b73e6827ded415c96139d13a2/content-research-writer/)（skill）：協助內容研究、引用資料、文章開頭與分段寫作回饋。
- [👁️ First Reader](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/6c16b23f1bacd0fdf240bb5141ef45e59e82c306/agent_skills/first-reader/)（skill）：模擬讀者對草稿的反應，提供閱讀回饋。
- [🗞️ AI Journalist Agent](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/6c16b23f1bacd0fdf240bb5141ef45e59e82c306/advanced_ai_agents/single_agent_apps/ai_journalist_agent/)（agent_example）：研究、撰寫與編輯文章的 Agent 範例。

### 設計與簡報製作 / Design and presentations

- [Canva](https://www.canva.dev/docs/apps/mcp/)（mcp_tool）：建立與編輯 Canva 設計。
- [googleworkspace/gws-slides](https://officialskills.sh/googleworkspace/skills/gws-slides)（skill）：讀取與寫入 Google Slides 簡報。
- [anthropics/pptx](https://officialskills.sh/anthropics/skills/pptx)（skill）：建立、編輯與分析 PowerPoint 簡報。

### 客戶對話與預約 / Customer conversations and bookings

- [Intercom](https://github.com/intercom/intercom-mcp-server)（mcp_tool）：存取 Intercom 對話與聯絡人。
- [Intercom Automation](https://github.com/ComposioHQ/awesome-claude-skills/tree/be2a406907dbc61b73e6827ded415c96139d13a2/intercom-automation/)（skill）：管理 Intercom 對話、聯絡人、公司、工單與文章。
- [oneappsworld/callchatsyn-mcp](https://github.com/oneappsworld/callchatsyn-mcp)（mcp_tool）：提供中英文常見問題回覆、可預約時段查詢與預約。

### 客服工單處理 / Support ticket handling

- [Zendesk Automation](https://github.com/ComposioHQ/awesome-claude-skills/tree/be2a406907dbc61b73e6827ded415c96139d13a2/zendesk-automation/)（skill）：管理 Zendesk 工單、使用者、組織、搜尋與巨集。
- [michaelrice/zendesk-mcp](https://github.com/michaelrice/zendesk-mcp)（mcp_tool）：讀寫 Zendesk 工單、留言與相關管理資料。

### 招募與人事資料 / Recruitment and people data

- [Workable](https://workable.readme.io/reference/workable-mcp-server)（mcp_tool）：存取職缺、候選人與招募流程。
- [BambooHR Automation](https://github.com/ComposioHQ/awesome-claude-skills/tree/be2a406907dbc61b73e6827ded415c96139d13a2/bamboohr-automation/)（skill）：管理 BambooHR 員工、休假、報表與通訊錄。
- [💼 AI Recruitment Agent Team](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/6c16b23f1bacd0fdf240bb5141ef45e59e82c306/advanced_ai_agents/multi_agent_apps/agent_teams/ai_recruitment_agent_team/)（agent_example）：涵蓋履歷篩選與面試排程的招募 Agent 團隊範例。

### 法律文件研究與簽署 / Legal document research and signing

- [Master Claude for Legal](https://github.com/sboghossian/master-claude-for-legal)（skill_collection）：包含 NDA 分流、合約版本比較、引文查核與會議簡報等工作的法律 Skill 集合。
- [👨‍⚖️ AI Legal Agent Team (Cloud & Local)](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/6c16b23f1bacd0fdf240bb5141ef45e59e82c306/advanced_ai_agents/multi_agent_apps/agent_teams/ai_legal_agent_team/)（agent_example）：法律研究、合約分析與策略規劃的 Agent 團隊範例。
- [SignNow](https://docs.signnow.com/docs/signnow/mcp-server)（mcp_tool）：透過 SignNow 管理電子簽署文件與簽署邀請。

### 安全掃描與威脅分析 / Security scanning and threat analysis

- [Snyk](https://github.com/snyk/studio-mcp)（mcp_tool）：在 Agent 工作流程中執行安全掃描。
- [cycodehq/cycode-cli](https://github.com/cycodehq/cycode-cli)（mcp_tool）：應用程式安全掃描工具。
- [threat-hunting-with-sigma-rules](https://github.com/jthack/threat-hunting-with-sigma-rules-skill)（skill）：以 Sigma 規則進行威脅搜尋與安全事件分析。

### 網頁操作與測試 / Browser automation and web testing

- [Playwright](https://github.com/microsoft/playwright-mcp)（mcp_tool）：提供瀏覽器自動化操作。
- [Webapp Testing](https://github.com/ComposioHQ/awesome-claude-skills/tree/be2a406907dbc61b73e6827ded415c96139d13a2/webapp-testing/)（skill）：以 Playwright 測試本機網頁應用，檢查前端功能、除錯與擷取畫面。

### AI 評估與觀測 / AI evaluation and observability

- [comet-ml/opik-mcp](https://github.com/comet-ml/opik-mcp)（mcp_tool）：提供 LLM 可觀測性與評估。
- [Arize Phoenix](https://github.com/Arize-ai/phoenix)（mcp_tool）：提供 LLM 可觀測性與評估。
- [muratcankoylan/evaluation](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering/tree/main/skills/evaluation)（skill）：建立 Agent 系統的評估框架。

### 提示詞、軌跡與資料觀測 / Prompts, traces and data observability

- [langfuse/mcp-server-langfuse](https://github.com/langfuse/mcp-server-langfuse)（mcp_tool）：存取 Langfuse 的提示詞管理。
- [LangSmith Fetch](https://github.com/ComposioHQ/awesome-claude-skills/tree/be2a406907dbc61b73e6827ded415c96139d13a2/langsmith-fetch/)（skill）：從 LangSmith Studio 取得並分析 LangChain／LangGraph 執行軌跡。
- [Monte Carlo](https://docs.getmontecarlo.com/docs/monte-carlo-mcp-server-technical-overview)（mcp_tool）：提供資料與 AI 可觀測性，包含監測、資料沿襲與警示。

### 系統監測與問題追蹤 / System monitoring and issue investigation

- [initMAX/zabbix-mcp-server](https://github.com/initMAX/zabbix-mcp-server)（mcp_tool）：查詢 Zabbix 主機、觸發條件與問題。
- [Netdata](https://github.com/netdata/netdata/blob/master/src/web/mcp/README.md)（mcp_tool）：基礎設施監測與根因分析。
- [instana/mcp-instana](https://github.com/instana/mcp-instana)（mcp_tool）：應用程式效能監測。

### 學習內容與複習 / Learning content and review

- [Udemy Business](https://business-support.udemy.com/hc/en-us/articles/34213384429335-How-to-Integrate-the-Udemy-Business-MCP-Server-With-Your-AI-Tool)（mcp_tool）：搜尋 Udemy Business 課程與學習內容。
- [ankimcp/anki-mcp-server](https://github.com/ankimcp/anki-mcp-server)（mcp_tool）：建立與複習 Anki 記憶卡。
- [O'Reilly](https://learning.oreilly.com/apidocs/mcp/content/)（mcp_tool）：搜尋 O’Reilly 書籍、課程與學習內容。

### 供應鏈營運與風險資料 / Supply chain operations and risk data

- [OFODevelopment/cerebrochain-mcp-server](https://github.com/OFODevelopment/cerebrochain-mcp-server)（mcp_tool）：提供運價比較、庫存、訂單追蹤、車隊物流與需求預測相關工具。
- [SupplyMaven-SCR/supplymaven-mcp-server](https://github.com/SupplyMaven-SCR/supplymaven-mcp-server)（mcp_tool）：取得供應鏈中斷、商品價格、港口壅塞、運費與貿易政策等風險資料。

### 公開標案搜尋 / Public procurement search

- [qune-tech/ocds-mcp](https://github.com/qune-tech/ocds-mcp)（mcp_tool）：搜尋德國公開採購資料，依公司資料進行標案語意匹配與篩選。
- [atomno-mcp/mcp-zakupki](https://github.com/atomno-mcp/mcp-zakupki)（mcp_tool）：搜尋俄羅斯公開採購標案與合約。

### 工業設備資料連接 / Industrial equipment data connections

- [kukapay/opcua-mcp](https://github.com/kukapay/opcua-mcp)（mcp_tool）：連接支援 OPC UA 的工業系統。
- [FoundryNet/forge-mcp](https://github.com/FoundryNet/forge-mcp)（mcp_tool）：連接不同協定與製造商的工業設備，處理遙測與設備健康資料。

### 工程建模與圖面處理 / Engineering models and drawings

- [mikan-atomoki/text-to-model](https://github.com/mikan-atomoki/text-to-model)（mcp_tool）：以自然語言在 Fusion 360 建立草圖、實體與零件模型。
- [pzfreo/build123d-mcp](https://github.com/pzfreo/build123d-mcp)（mcp_tool）：建立、檢視與量測 3D 幾何，並匯出 STEP／STL 等格式。
- [ProductOfAmerica/mcp-server-kicad](https://github.com/ProductOfAmerica/mcp-server-kicad)（mcp_tool）：處理 KiCad 電路圖、PCB 佈局、規則檢查與製造檔案匯出。
- [imnoo-team/quality-control-plan-mcp](https://github.com/imnoo-team/quality-control-plan-mcp)（mcp_tool）：從工程圖 PDF 擷取公差等資訊，產生品質管制計畫、標註圖面與 Excel 報表。

### 臨床資料存取 / Clinical data access

- [the-momentum/fhir-mcp-server](https://github.com/the-momentum/fhir-mcp-server)（mcp_tool）：連接 FHIR 伺服器，查詢病患病歷等資料。
- [wso2/fhir-mcp-server](https://github.com/wso2/fhir-mcp-server)（mcp_tool）：透過 FHIR API 與 SMART on FHIR 授權，搜尋、讀寫與分析臨床資料。

### 碳排估算與雲端區域比較 / Carbon estimates and cloud region comparison

- [jagan-shanmugam/climatiq-mcp-server](https://github.com/jagan-shanmugam/climatiq-mcp-server)（mcp_tool）：透過 Climatiq API 計算碳排與氣候影響。
- [stevensu04/eco-router-mcp](https://github.com/stevensu04/eco-router-mcp)（mcp_tool）：依電力碳強度與預估延遲比較雲端區域，並提供批次工作時段建議；即時資料需額外服務。

### 資料分析與時間序列預測 / Data analysis and time-series forecasting

- [TensorLink-AI/ephemeris-mcp](https://github.com/TensorLink-AI/ephemeris-mcp)（mcp_tool）：提供時間序列的機率預測，可指定模型或整合多個模型的預測。
- [embeddedlayers/mcp-analytics](https://github.com/embeddedlayers/mcp-analytics)（mcp_tool）：對 CSV 或串接服務的資料進行統計分析、預測與機器學習，輸出互動報告。

## 覆蓋與缺口

| 工作 | 主題數 | 資源數 |
| --- | ---: | ---: |
| 獲客、行銷與銷售 | 3 | 8 |
| 客服、接待與客戶互動 | 2 | 5 |
| 財務、會計、稅務與收付款 | 3 | 6 |
| 法律、合約、合規與稽核 | 1 | 3 |
| 風險、安全、隱私與身分 | 1 | 3 |
| 招募、人力與員工管理 | 1 | 3 |
| 採購、供應鏈、物流與庫存 | 2 | 4 |
| 生產、製程與品質 | 1 | 2 |
| 設施、設備、物業與維護 | 0 | 0 |
| 醫療、診斷、照護與健康支持 | 1 | 2 |
| 研究、研發與探索 | 1 | 3 |
| 軟體開發、測試與維運 | 2 | 5 |
| AI 開發、部署、評估與治理 | 2 | 6 |
| 教育、學習與技能培訓 | 1 | 3 |
| 內容、媒體與創意設計 | 2 | 6 |
| 資料、文件、知識與資訊處理 | 3 | 9 |
| 營運、規劃、排程與協作 | 3 | 8 |
| 個人生活、陪伴與日常活動 | 0 | 0 |
| 能源、環境、農業與永續管理 | 1 | 2 |
| 媒合、交易與經紀 | 0 | 0 |
| 工程設計、模擬與硬體研發 | 1 | 4 |
| 評估、偵測、預測與量測 | 1 | 2 |

工作對應只表示有相關步驟的候選，不表示整個工作流程或 99 Problems 題庫已被解決。評估、偵測與量測類別未以一般安全掃描或監測項目充數；媒合與交易也未以標案搜尋代替完整媒合能力。缺口保留，等待 review 後決定是否補充。

## 本輪限制與下一步

- 0 筆安裝或實測；尚未逐一審查原始資源庫。來源中的宣稱仍是作者／清單說法。
- Stars、維護訊號、個別授權與測試結果尚未補查，保留 null；不宣稱這些是大家都用得好的資源。
- MCP 多需帳號、API、授權或自架環境；Skill／Agent 範例也不等於現成商業產品。安裝前才做個別相容性、權限與授權檢查。
- 少數主題較寬，用來 review 能力粒度；這些主題不預設為最終 UI 分類。
- GitHub Trending 已獨立整理本週榜單快照 15 筆，見 [榜單 review](trending-review.md)；不計入本輪能力覆蓋，沒有自動更新。
- 下一步一起 review 這份資料，再討論 L1–L3；本輪不做網站、自動 matching 或安裝。

網站資料：`data/processed/catalog/catalog.json`。完整候選池另外保留，不會全部出現在首版。
