# 能力便利商店 / Capability Store

按工作探索現成工具、Skills 與 Agent 範例的中英文 prototype，延續 Startup Radar 的極簡風格。

- [開啟網站 / Open website](https://vcstseng.github.io/capability-store/)
- [GitHub Repository](https://github.com/vcstseng/capability-store)
- [能力資料 review](docs/prototype-review.md) · [Trending 快照](docs/trending-review.md) · [進度](docs/progress.md)
- 資料：32 個能力主題、84 個候選資源；另有 15 筆 Trending 週榜快照。已整理不代表已安裝、測試或適用性驗證。

目前 Layer 1 以 99 Problems 分類為主：10 個企業領域、4 個有相關候選的 AI 面向，共 14 個入口。每類顯示能力例子與主題數，中英文與網址狀態同步。GitHub 熱門快照為次要入口，預設 3 筆，可展開 15 筆。

首頁目前可探索 28 個主題、74 個候選；完整資料仍保留 32 個主題、84 個候選，4 個產業主題暫未對應主入口。導覽關係不代表已驗證能解決某個企業問題。能力列表與詳情（Layer 2／3）尚未實作。

## 本機預覽

Node.js 22+、Python 3。沒有需要安裝的前端套件。

```text
cd web
npm test
npm run build
npm run dev
```

瀏覽器開啟 http://127.0.0.1:4174/；使用 HTTP 預覽，不直接開 file://。

GitHub Pages 使用 `.github/workflows/deploy.yml` 建置與發布 `web/dist`。原始來源及候選池留在 repo，網站僅發布入口需要的精簡 JSON。

資料完整性核對：`python scripts/validate/validate_catalog.py`。來源聲明見 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。不安裝第三方候選、不做自動 matching 或共用資料層。
