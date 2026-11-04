# 專案進度

## 2026-11-04：建立公開 GitHub repo，資料備份完成

- Repository：[vcstseng/capability-store](https://github.com/vcstseng/capability-store)，公開，預設分支 main。
- 首次資料上傳 commit：`f5d17d2`。包含 32 個能力主題、84 個資源候選、15 筆獨立 Trending 週榜快照、中英文資料、來源快照與處理腳本。
- 已驗證：84 筆來源對應、92 個來源依據、14 份來源快照檔案 hash、分類參照與數量一致。Trending 原始頁面 hash、順序、15 個不重複 repo 已核對。
- 來源聲明見 `THIRD_PARTY_NOTICES.md`；未將來源清單授權套用到每個候選。已排除 HTTP session-cookie headers。
- 網站尚未建置或部署；GitHub repo 連結是程式與資料入口，尚無 Capability Store 網站網址。

使用者決定：能力的深入 review 與替換之後再做，目前用這份資料推進 prototype。

**下一步只做 Layer 1**：維持極簡、中英文，規劃工作探索入口與獨立 Trending 區；以現有 JSON 為基礎，保留日後替換資源的能力。Layer 2／3 後續再做，不先增加 matching、共用資料層或安裝流程。

---



## 2026-11-04：首版能力資料整理完成，待 review

- 五份 GitHub 清單已保存 README、metadata、可取得授權、固定 commit 與 SHA-256。
- 擷取 6,551 個清單項目；按完全相同 URL 整併後 6,459 個候選。這不是經過實測的能力數，別名仍可能存在。
- 首版：**32 個具體能力主題、84 個資源候選**；每題 2–4 個選擇。中英文標籤與描述、來源依據、類型與工作對應已整理。
- 19/22 個參考工作類別有候選；尚未整理：設施、設備、物業與維護、個人生活、陪伴與日常活動、媒合、交易與經紀。個人生活不屬目前企業主軸；其餘缺口等待 review 後再補，不以相近標籤充數。
- 「已整理」指回讀保存的來源清單；原始資源庫全面審查、安裝及實測：0。沒有將候選宣稱為已驗證或廣泛採用。
- 不做類型配額、不追求填滿 200 筆。企業共通工作為主，四個產業主題補充。
- GitHub Trending 已另存本週榜單 15 筆快照，中英文及原始來源已保存，見 [榜單 review](trending-review.md)。網站、matching、共用 data layer、自動更新均未實作。

Review：[首版能力與候選](prototype-review.md)。網站可用資料：`data/processed/catalog/catalog.json`。驗證結果：`docs/reviews/round-001-validation.json`。

下一步：與使用者 review 主題粒度與候選是否有用，再討論網站 L1–L3；不直接開始 UI。

---

以下保留歷史進度；舊的上限與未匯入狀態，以本節及 resources/progress.json 為準。



## 2026-11-04 接續：工作入口與來源擴大比較

使用者同意沿用 Startup Radar 的 22 個工作方向找能力，先擷取清單基本資料，再按工作找候選、回讀確認對應，不設定總筆數上限。新增首頁 GitHub Trending 區方向，仍待 UI 討論，尚未實作。

本輪比較八份 GitHub 資源庫，建議五份核心候選；其中原三份已有快照，新來源只完成網路與 README 結構 review，未下載／匯入。Trending 已確認官方日／週／月入口；沒有把快取榜單當作目前最新資料。詳見 [來源比較與 Trending 草案](github-source-comparison-2026-11-04.md)。正式資源列仍待擷取，網站未開始。

## 2026-11-04 接續：取消筆數上限、來源 review

使用者指定先找 GitHub 現成清單，可整份沿用，不限 30 筆；看完來源後先討論 Layer 1–3。已選三份主要清單並保存 README、授權、repo metadata、固定 commit 及 SHA-256。另 review awesome-copilot，列為補充候選。原始清單完成保存，正式擷取／去重／逐項整理數量尚未確定，網站未開始。完整說明見 [來源 review](source-review.md)。

目前進度以 data/processed/resources/progress.json 為準。下文骨架建立時的空來源與筆數限制是歷史狀態，已由本節取代。


## 2026-11-04：建立本機骨架

- 路徑：D:\capability-store。
- 已建立 config、raw、processed、supplements、docs、scripts 與 web 的分層。
- 已寫每輪工作指引、資料格式草案及網站／腳本接續說明。
- 正式來源：0／預計三份清單（Skills、MCP Tools、應用 repos 各一份）。
- 樣本：0／不限筆數的資源。
- 網站：待資料 review，尚未開始。
- 共用資料層、跨模組 matching、自動更新與單題示範：後續階段。

下一步：與使用者確認開始來源選擇，讀候選清單後正式記入 config/sources.json，再整理樣本。來源候選沿用對話提及的 GitHub curated lists，但本輪未選定、未重新核實，也未下載。

完成驗證：骨架必要目錄與說明文件存在；兩個 JSON 設定可解析，來源及完成筆數皆為零。
