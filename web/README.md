# Layer 1

暖白／深綠、文字優先的中英文工作入口與獨立 Trending 區。這輪不實作 Layer 2／3。

Node 22+：`npm test`、`npm run build`。Python 3：`npm run dev`，開啟 http://127.0.0.1:4174/。

- index.html：共用頁面入口。
- src/app.js、styles.css：介面、語言與選取互動。
- src/portal.js：資料計數與網址狀態。
- scripts/build.mjs：從既有 catalog／trending JSON 產生精簡網站資料，不上線 raw／完整候選池。
- tests/portal.test.mjs：計數及網址行為檢查。

URL：`?lang=en&work=finance-accounting&trending=all`。穩定工作 ID 可供之後接上動態 Layer 2；目前選取摘要明確說明列表尚未開放。
