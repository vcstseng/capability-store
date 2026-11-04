# 銷售能力 L3：2026-11-05

本輪完成銷售 6 個能力的雙語詳情與共用模板。其他領域 54 個構想保留既有 L2；沒有詳情資料就不顯示詳情入口。

## 內容與導覽

L2 用途是比較與選擇；L3 說明單一能力的情境、輸入→處理→產出、虛構示例、人工確認、資料權限、停止條件、搭配能力及可能的實現參考。所有示例都是編寫內容，沒有實際執行。整體方案分析、選用理由及方案層治理留待整合 demo；本輪不改 99 Problems 或 Startup Radar。

沿用 view=resource，共用能力模板，id=idea-sales-*。直接分享、重新整理、瀏覽器上一頁及語言切換維持能力 ID；返回 L2 保留領域、位置與焦點。可搭配能力之間提供站內連結。沒有安裝、執行或自動 matching 操作。

資料另存 data/processed/concepts/sales-details.json，以既有能力 ID 連接。建置時驗證資料並併入 concepts.json；不寫入 raw、既有 catalog 或原始 L2 構想。未來可沿用相同模板擴展。只有客戶適配與優先排序附既有 Lead Research Assistant 參考，限研究方法閱讀線索，未驗證實作；其餘不硬配 repo，較廣泛線索仍在 L2。

## 驗證

- 19 項 Node 測試通過，含六個能力與四種類型覆蓋、雙語完整性、示例狀態、來源可回查、斷鏈阻擋、URL 語言／ID／情境保留。
- 建置與 JavaScript 語法檢查通過。
- 瀏覽器逐一檢查六頁英文 375px、六頁中文 1280px，均有六個內容區，沒有橫向溢出；桌面流程三欄、手機單欄。
- 重整、語言切換、搭配能力、瀏覽器返回及 L2 位置恢復已檢查；返回下半部位置約 1982px 且焦點回到連結。未見 console error。
- 畫面：screenshots/sales-capability-detail.jpg。

## 預覽與發布

本機：http://127.0.0.1:4175/?lang=zh&work=business-sales&view=resource&id=idea-sales-risk

正式站發布狀態另記於 docs/progress.md；不能將已推送程式等同正式站已更新。
