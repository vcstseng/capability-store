# 能力便利商店：每輪工作指引

## 最新授權：2026-11-05，十領域 L3 完成後凍結

使用者決定不調整 Sales 的「可搭配能力」UI，沿用現有頁面與內容結構，補齊其餘九領域共 54 個雙語 L3，總計 60 個。企業情境要合理、一般人能讀懂；保留必要人工確認與資料權限，不增加複雜流程。GitHub 參考只是待評估線索，不虛構功能。完成測試、docs、GitHub、部署後凍結 prototype；沒有新指示不擴充、重分類、刷新來源或更改 UI。凍結範圍見 docs/prototype-freeze-v1.md 與 config/freezes/prototype-v1.json。後面的六筆／只做 L2 限制為歷史階段。


## 最新授權：2026-11-05，銷售 L3

使用者同意先做銷售 6 個能力與共用動態 L3，優先於下方歷史 L2 限制。以 JSON 加共用模板呈現雙語用途、情境、步驟、虛構示例、能力層的權限／人工判斷／停止條件與搭配能力。示例明示編寫且未執行。GitHub 參考僅保留可說明關係的既有候選，待評估，無則留空。其他 54 個構想維持 L2，不放假的詳情入口。返回保留領域與位置、分享／重整／語言不遺失 ID。方案選用理由與整體治理留給未來整合 demo；不改 99 Problems 或 Startup Radar。完成更新 docs、GitHub 及部署。


## 最新方向：構想式 L2（2026-11-04）

使用者明確指定：對齊 99 Problems 的十個企業領域，用想像力定義可能需要的 Skills、Tools、Agents、Workflows，不必有真實 repo，不逐題解完問題。每領域可有多個同類型能力，不能為配額湊數。

目前 60 個構想／30 個工作環節／10 個領域，資料為 data/processed/concepts/business-concepts.json。每筆有雙語用途、預期輸入與產出、人工決策點，status=concept_only，implementation=null。構想為設計假說，不能冒充已實作、已驗證、已部署或可直接使用。

各領域另放 2 個既有 GitHub 候選作參考；與構想分開，標示待評估，不宣稱匹配成功。原始資料與既有 catalog 保留。原有 AI 四個入口仍為資源參考，不冒充新增構想。

L1 是分類連結，直接進 L2；L2 按工作環節展示構想、輸入／產出與人類判斷。保持極簡、中英文、分享網址與返回位置。本輪只完成十個企業領域 L2，不擴充 L3；基本資源頁保留。不要加入搜尋、評分、全量 matching、共用資料平台或執行管線。

## 每輪流程

1. 先讀本檔、docs/progress.md、data/processed/resources/progress.json。
2. 使用者最新指示優先。創作授權只適用明確標示的構想；真實 repo 的功能、授權、維護、價格與成效仍不得捏造。
3. 不改 raw 或既有來源候選內容。修改構想資料要維持 ID 與雙語欄位，補充依據與設計假說分清楚。
4. 執行 web 的相關測試／建置與必要的資料驗證，完成後更新 docs、GitHub 及公開部署。
5. 不安裝或執行第三方資源，不全面搜尋 GitHub，除非使用者另有指示。

## 整合方向

99 Problems 提供問題起點；Startup Radar 提供產品與解法參考；能力探索提供能力設計與實現線索；Consulting Agents 未來再評估沿用、調整、組合、自建及可行性。分類相同不等於逐題匹配，也不證明市場需求或實際效果。

公開 repo：vcstseng/capability-store，main。網站：https://vcstseng.github.io/capability-store/ 。詳細內容見 docs/business-concepts-review.md。
