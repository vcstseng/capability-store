# 能力便利商店 / Capability Store

按工作探索現成工具、Skills 與 Agent 範例的中英文 prototype，延續 Startup Radar 的極簡風格。

- [開啟網站 / Open website](https://vcstseng.github.io/capability-store/)
- [GitHub Repository](https://github.com/vcstseng/capability-store)
- [能力資料 review](docs/prototype-review.md) · [Trending 快照](docs/trending-review.md) · [進度](docs/progress.md)
- 資料：32 個能力主題、84 個候選資源；另有 15 筆 Trending 週榜快照。已整理不代表已安裝、測試或適用性驗證。

目前完成 Layer 1：19 個有資料的工作入口、選取摘要、中英文切換、網址狀態、Trending 展開／收合與外部 GitHub 連結。能力列表與詳情（Layer 2／3）尚未實作。

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
