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

## 首頁導覽（0.2-portal）

`config/taxonomy/portal-navigation.json` 定義 99 Problems 參考分組、雙語分類與能力 ID 對應。建置時由原始 catalog 計算各類主題／不重複資源數、雙語例子、全站去重總數及未對應主題。catalog 原本的工作分類與資源 ID 不修改。這是導覽設定，不是跨模組共用 schema 或已驗證的 Problem matching。

## L2 精簡資料（0.1-results）

`web/dist/data/results.json` 由 catalog 建置產生：capabilities 保存 id、雙語 label、resource_ids；resources 保存 id、名稱、URL、多值 types、雙語 summary、parent_repository、review_status 及清單 repo 名稱。完整 evidence 留在原 catalog，不複製到首頁資料。

L2 以 portal 的 capability_ids 取資料，計數按穩定 ID 去重。找不到分類不顯示全量資源；參照缺失會報錯，不以其他候選填補。原 catalog 完整 32／84 保留。

網址 view=results，source=trending 時顯示榜單，其他為工作候選；work 沿用穩定入口 ID，lang 控制雙語。problem 是可選且受格式限制的情境識別字，僅保留、不查找或驗證問題關聯。暫不建立共用資料層或跨站 matching。

## 比較顯示註記與基本資源頁

`config/resource-display.json` 以既有 resource ID 記錄可由英文來源支持的雙語 input／output，未知為 null；basis_description_en 保留依據。建置時核對原文相符，不改 catalog。精簡 results.json 增加可選 display 欄位。資源網址 view=resource，id 為 cap-穩定ID 或 github:owner/repo；兩者不假合併。純導覽與資料引用，沒有推斷問題適用性。

## 構想資料（0.1-concepts）

另存 domains／stages／concepts。domain 沿用 99 Problems 對齊的 business-* ID；stage 用 concept_ids 關聯穩定 idea-* ID。每構想有 kind、雙語 name／purpose／input／output／human_decision、status=concept_only、implementation=null。domain.references 只存既有 resource_id、GitHub URL、雙語可能用途及 status=unverified_reference。概念、來源與驗證狀態不得混合；不宣稱已覆蓋所有問題。


## 能力 L3（1.0-concept-detail）與 Freeze v1

銷售六筆 sales-details.json 與其餘五十四筆 business-details.json，均用 details[idea-*] 連到現有構想。欄位 scenario／steps／example.input／example.output／permissions／stop 為雙語；example.status 固定 illustrative_not_executed。related_ids 連到既有能力詳情；references 只複用既有領域參考的 resource_id／URL／unverified_reference，另附雙語 scope 說明有限參考範圍。沒有可證明對應的資源就留空。

建置合併後必須恰有全部 60 個能力，拒絕重複、缺項、缺翻譯與斷鏈。原能力的 status／implementation 不變。凍結清單見 config/freezes/prototype-v1.json。
