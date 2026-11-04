# Layers 1–2

暖白／深綠、文字優先的中英文工作入口與獨立 Trending 區。Layer 2 已加入工作能力與 Trending 列表；這輪不實作 Layer 3。

Node 22+：`npm test`、`npm run build`。Python 3：`npm run dev`，開啟 http://127.0.0.1:4174/。

- index.html：共用頁面入口。
- src/app.js、styles.css：介面、語言與選取互動。
- src/portal.js：資料計數與網址狀態。
- scripts/build.mjs：從既有 catalog／trending JSON 產生精簡網站資料，不上線 raw／完整候選池。
- tests/portal.test.mjs：計數及網址行為檢查。

URL：`?lang=en&work=finance-accounting&trending=all`。穩定工作 ID 可供之後接上動態 Layer 2；目前選取摘要明確說明列表尚未開放。

2026-11-04 首頁改為 99 Problems 分類導覽，設定見 `config/taxonomy/portal-navigation.json`。每類例子由實際能力名稱產生；全站計數去重，未對應主題保留。舊財務等明確網址可相容，模糊合併分類不猜選。

L2 工作入口：`?lang=en&work=business-procurement&view=results`；熱門入口：`?lang=en&view=results&source=trending`。

`src/results.js` 處理精簡結果資料、分組及 L2 route；`src/copy.js` 保存雙語 UI 文字。`data/results.json` 由建置產生並在工作 L2 才載入。既有 portal／trending 資料不改寫。分享網址可帶保留的 `problem=P02` 識別字，但不展示未經證實的匹配關係。

能力與資源錨點可直接定位；來源連結開新分頁。返回入口保留語言、原位置與分類焦點；沒有 L3 詳情頁。

2026-11-04 UX 簡化：分類是直接導覽連結，不需先選取或確認；返回首頁保留閱讀位置與焦點。

最新 L2：能力總覽、主題工作說明與緊湊候選列；查看詳情進 `view=resource&id=cap-...` 或 `id=github:owner/repo`。保留 work、source、lang、problem 情境；返回恢復候選位置與焦點。無列表情境的資源網址回分類入口。外部資源連結只在基本詳情頁提供。

最新企業 L2 改為構想式 prototype：src/concepts.js 與 concepts.json 以既有 work ID 連接。L1 同步構想計數，AI 原有資源不變。構想在 L2 閱讀用途、預期輸入／產出與人工決策點，沒有執行或新 L3 按鈕；GitHub 參考另列。
