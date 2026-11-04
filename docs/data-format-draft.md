# 首版資料格式（0.1-prototype）

單一 `data/processed/catalog/catalog.json` 提供未來網站資料，尚未固定為跨模組共用 schema。

| 區塊 | 用途 |
| --- | --- |
| metadata | 版本、review 日期、候選池摘要與完成數；不當作來源即時更新日期 |
| works | 22 個探索參考工作 ID、中英文名稱；不代表工作已完全覆蓋 |
| capabilities | 具體能力主題、中英文名稱、工作 ID、2–4 個資源 ID、企業或產業例子 |
| resources | 穩定 ID、名稱、URL、可多選類型、中英文摘要、來源依據與 review 狀態 |
| coverage | 每個參考工作的主題數與不重複資源數；不是成熟度或評分 |

`summary.en` 保留來源清單英文描述，`summary.zh` 是人工審閱式概括；都不是實測結論。`evidence` 保留清單 repo、固定 commit、原始檔案、行號與原文。`parent_repository` 只從明確的 GitHub URL 取得，否則 null；`metrics`、`license` 尚未個別查核，一律 null。

類型目前包括 mcp_tool、skill、skill_collection、agent_example、toolkit；類型陣列允許重疊，不要求配額。repo 是來源容器，不另要求湊足 repo 類型。

完整候選池和網站首版分開；原始資料不可直接覆蓋。補資料時保留來源、日期與修改記錄，依缺口再決定是否新增欄位，不預建複雜補充層。

獨立 `trending.json`：觀察時間、週榜來源、原始頁面摘要、原順序、repo、中英文說明與當次週增 Stars；與工作候選分開計數，缺描述保留 null。
