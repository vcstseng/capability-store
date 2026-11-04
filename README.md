# 能力便利商店 / Capability Store

以 99 Problems 的十個企業領域探索可能需要的 Skills、Tools、Agents 與 Workflows。

- [開啟網站](https://vcstseng.github.io/capability-store/)
- [銷售能力構想](https://vcstseng.github.io/capability-store/?lang=zh&work=business-sales&view=results)
- [十領域構想 review](docs/business-concepts-review.md) · [進度](docs/progress.md)

目前 L2 有 **60 個構想、30 個工作環節、10 個企業領域**。用途、預期輸入／產出與人工決策點均有中英文。這些是尚未實作的設計假說，不是現成工具或已驗證方案。

每領域另有 2 個既有 GitHub 候選作實現線索，標示待評估；不假設單一 repo 能實現整個構想。之後可沿用、調整、組合或自建。原有資源資料、AI 參考入口與基本資源頁保留。十個領域的 60 個中英文 L3 已完成，沿用 Sales 模板。

## 本機預覽

Node.js 22+、Python 3，無前端套件安裝需求。

```text
cd web
npm test
npm run build
npm run dev
```

開啟 http://127.0.0.1:4174/ 。GitHub Pages 使用 .github/workflows/deploy.yml 發布 web/dist。

構想資料：data/processed/concepts/business-concepts.json。原來源資料：data/processed/catalog/catalog.json；raw 快照保留不改。第三方說明見 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。


## 十領域能力 L3 · Prototype v1

60 個能力提供共用模板讀 JSON 的中英文能力說明，含虛構示例、能力界線與搭配能力。構想尚未實作，示例非執行結果。完成後凍結，不自動擴充。[凍結範圍與驗證](docs/prototype-freeze-v1.md) · [目錄說明](docs/file-directory.md)。
