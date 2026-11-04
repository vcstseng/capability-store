# 能力便利商店：每輪工作指引

## 最新決定（2026-11-04）

公開 repo：vcstseng/capability-store，main。Layer 1 已完成：沿用 Startup Radar 極簡風格、中英文、19 個有資料工作入口、單選摘要、獨立 Trending 前 5／全部 15 筆。完成後同步 GitHub 與 docs。下一步先 review 首頁，再討論 Layer 2；不連帶實作 Layer 2／3。

能力深化 review 與替換延後；首版為「工作 → 具體能力 → 2–4 個候選」，32 個主題、84 個資源。企業共通工作優先，少量產業例子補充，不湊筆數、不做類型配額。Startup Radar 的工作 ID 只作探索參考，不代表 99 Problems 已覆蓋。

## 每輪流程

1. 先讀本檔、docs/progress.md、data/processed/resources/progress.json。
2. 按使用者指定範圍工作；目前 Layer 1 已完成；Layer 2／3 待使用者後續指示。
3. raw 保持原樣，在 processed 整理。更新資料後執行 scripts/validate/validate_catalog.py。
4. 文件記錄數量、來源依據、缺口、限制與下一步；候選、已整理、已測試分開計數。

## 資料原則

- 中英文從資料階段保留。中文概括忠於來源，英文描述保留原文；標籤使用穩定 ID。
- 已整理只是回讀來源清單的項目，不代表原始 repo 已審查、已安裝、已測試或有採用實績。
- 缺漏保留 null。來源清單的 Stars／授權不得套給子資源；不捏造維護狀態、價格、整合方式或成效。
- 跨來源同名不自動合併；完全相同 URL 整併仍可能有別名，保留來源與固定 commit、檔案、行號。
- 大型集合保留集合標示；不要求使用者到集合裡重新找所有東西。
- GitHub Trending 已另存本週榜單 15 筆快照，見 docs/trending-review.md；不計入能力覆蓋，沒有自動更新。
- 本階段不安裝或執行第三方資源，不建立共用 data layer、全量 matching、自動排程、評分系統或 Agent 執行管線。

資料矛盾或重大範圍變動再找使用者討論；一般缺漏直接記錄，不打斷工作。未來網站維持極簡、中英文、JSON 動態列表／詳情；後續保持穩定 ID 與動態 JSON，不因替換候選重做介面。
