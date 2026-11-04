# GitHub 來源 review

日期：2026-11-04。依最新指示取消樣本筆數上限，先保存完整清單，之後討論 UI，不安裝清單內的資源。

| 來源 | 內容與結構 | 採用方式 |
|---|---|---|
| VoltAgent/awesome-agent-skills | HTML／Markdown 表格；同一作者 repo 可包含多個 Skill | 主要 Skills 來源，保留單項路徑與所屬 repo |
| punkpeye/awesome-mcp-servers | 依主題分組的 MCP server 連結與介紹 | 主要 Tools 來源，保留原始分類與描述 |
| Shubhamsaboo/awesome-llm-apps | 多種 Agent、Skill、RAG 應用，多數指向同一 repo 的子目錄 | 主要應用範例來源，不把每個例子冒充獨立 repo |
| github/awesome-copilot | 自訂 agents、instructions、skills、hooks、workflows 等；README 另連結分項目錄 | 已讀內容，暫列補充來源，未匯入 |

## 保存與規模

三份主要來源均保存固定 commit 的完整英文 README 與授權文件，另存取得時的 repo metadata、日期及 SHA-256。主要清單授權：前兩份 MIT，應用清單 Apache-2.0；清單授權不等於所有被連結資源皆有相同授權，日後公開展示需保留來源與適用聲明。

MCP README 可找出超過 4,600 個不同 GitHub repo 連結；此為文字中的連結參照，包含非資源連結與重複／相關資源，不是已確認的資源筆數。Skills 與應用例子又可能是同一 repo 的子項，所以不能以 repo 數當項目數。正確總量待正式擷取、排除導覽／贊助／安裝指令與去重後才回報。

本輪未把各項第三方 repo 或程式下載、安裝或執行，也未把 source README 直接當成網站資料。

## Layer 1–3 討論依據

- 清單已有資源名稱、原始連結、簡短介紹與分組，可以用於第一版探索。
- 各來源的分類不同，先保留原標籤；網站入口另作輕量對照，不直接沿用 Startup Radar 的產業分類。
- 類型、工作用途、所屬 repo 是不同資訊；一項可同時具備多個關係。
- 熱門和維護訊號目前只有來源清單 repo 的 metadata；不能挪用到其每個子項。個別資源訊號未取得則留空。
- 下一步先與使用者討論：首頁怎麼看全貌／進入、列表需要哪些資訊、詳情需要哪些來源與限制，再定最小資料格式。
