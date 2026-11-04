# 能力便利商店：每輪工作指引

## 最新決定（2026-11-04）

最終會整合 99 Problems、Startup Radar、Capability Store 與 Consulting Agents。Capability Store 首頁以 99 Problems 的 10 個企業領域及 5 個 AI 面向為參考，僅顯示有相關候選的分類，目前為 10＋4。Startup Radar 僅作產品與解法參考，舊的工作對應保留在 catalog 以便溯源，不再作首頁分類。

本輪已完成動態 L2（工作分組與獨立 Trending 列表），L3 尚未實作。每個入口有能力例子，共通能力可支援多個工作，計數按穩定 ID 去重。首頁目前 28 主題／74 資源；完整 catalog 保留 32／84，4 個產業主題不硬配、不刪除。導覽關係另存 config/taxonomy/portal-navigation.json，不當作已驗證 Problem matching。

保持 Startup Radar 的極簡風格、中英文、網址與返回狀態。Trending 為次要的「GitHub 熱門快照」，3 筆預覽／15 筆完整榜單，不宣稱即時更新。空分類先不顯示，不湊數。Layer 2 已完成，接著先 review，再按使用者指示做 Layer 3。

公開 repo：vcstseng/capability-store，main；網站 https://vcstseng.github.io/capability-store/。完成輪次後更新 docs、同步 GitHub 與發布結果。能力深化 review 及替換延後，不建共用資料層、自動 matching 或 Agent 執行管線。

## 每輪流程

1. 先讀本檔、docs/progress.md、data/processed/resources/progress.json。
2. 按使用者指定範圍工作；目前 Layer 1／2 已完成；Layer 3 待使用者後續指示。
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

L2 使用單一模板與精簡 JSON；返回狀態、雙語與穩定 ID 一起維護。原始來源連結可直接開啟；沒有 L3 時不加空的詳情按鈕。網址 problem 只保留情境，不視為匹配證據。
