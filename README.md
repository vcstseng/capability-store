# 能力便利商店 / Capability Store

企業工作導向的能力探索 prototype。先整理現成 repos、skills、tools 與 Agent 範例，再 review 網站入口；目前沒有 UI、安裝或自動 matching。

首版已整理 **32 個能力主題、84 個候選資源**，從五份 GitHub 清單的 6,459 個 URL 候選中選出。每題 2–4 個候選，保留中英文、原始連結與來源依據；已整理不代表已測試或採用證明。

- [先看資料 review](docs/prototype-review.md)
- [進度](docs/progress.md)
- 網站資料：`data/processed/catalog/catalog.json`
- 完整候選池：`data/processed/resources/candidate-pool.json`
- 原始快照：`data/raw/snapshots/`
- 工作指引：`AGENTS.md`

資料驗證：`python scripts/validate/validate_catalog.py`。首版維持簡單，不建立共用資料層或執行管線。

GitHub Trending：另存本週榜單 15 筆快照與中英文資料，見 [榜單 review](docs/trending-review.md)。不計入 84 筆能力候選。
