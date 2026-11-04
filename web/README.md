# Capability Store — L1–L3 prototype

中英文、暖白與深綠的靜態網站；共用模板依 URL 讀 JSON。企業入口使用十個對齊 99 Problems 的領域，L2 有 60 個構想、L3 有 60 個能力說明。能力未實作，例子為虛構編寫。原 AI 資源頁與 Trending 快照保留。

Node 22+：npm test、npm run build。Python 3：npm run dev（預設 http://127.0.0.1:4174/）。本輪既有本機預覽服務在 4175。

- L1：?lang=zh
- L2：?lang=zh&work=business-finance&view=results
- L3：?lang=zh&work=business-finance&view=resource&id=idea-finance-invoice
- 原資源詳情：view=resource&id=cap-...；Trending：view=results&source=trending。

語言切換保留能力與情境；返回列表保留位置與焦點。problem 僅為保留情境識別字，不代表已 matching。所有頁面仍是概念／參考，沒有能力安裝或執行。

build.mjs 從 catalog、導覽設定、構想資料及兩份 L3 增補產生 dist/data。Sales 原六筆在 sales-details.json，其餘 54 筆在 business-details.json。建置時拒絕缺少詳情、重複 ID、缺翻譯、失效參照；不發布 raw 或完整候選池。

凍結說明與雜湊見 docs/prototype-freeze-v1.md、config/freezes/prototype-v1.json。未經新指示不擴充。
