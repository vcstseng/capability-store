# 目錄與清理紀錄

日期：2026-11-05。最新版本請從 [Prototype v1 凍結紀錄](prototype-freeze-v1.md) 開始；[progress.md](progress.md) 保留逐輪歷史，不當作目前 UI 規格。

| 位置 | 用途 |
| --- | --- |
| web/src | L1／L2／L3 共用介面、網址與雙語文字 |
| web/scripts、web/tests | 建置與資料／導覽測試 |
| web/dist | 本機預覽與部署產物；Git 忽略，可由 build 重建 |
| data/processed/concepts | 60 個能力與中英文 L3 資料；Sales 原六筆及其餘 54 筆分檔 |
| data/processed/catalog | 原來源主題／資源與熱門快照，作為參考保留 |
| data/processed/resources | 原候選池、來源擷取紀錄及目前進度 |
| data/raw/snapshots | 來源原始證據與授權檔；保留供回查與完整性驗證 |
| config | 來源、分類、顯示設定及 freezes 凍結雜湊 |
| scripts | 既有蒐集、整理與離線驗證腳本；凍結後不自動執行蒐集 |
| docs | 目前規格、凍結說明、進度及可回查的歷史 review |
| docs/reviews、docs/screenshots | 驗證紀錄及仍有用途的畫面 |
| .github/workflows | GitHub Pages 發布流程 |

## 刪除項目

刪除 14 個已無必要的 .gitkeep。連同 5 個尚未使用的空目錄移除：config/schemas、data/processed/resources/batches、data/raw/sources、data/supplements、web/public。

另刪除 4 張無引用的過期 UI 截圖：direct-category-entry.jpg、layer-1-desktop.jpg、layer-1-99-problems-navigation.jpg、layer-2-procurement.jpg。保留現有 L2／L3、有歷史引用及凍結版畫面。

合計 18 個檔案、5 個空目錄。所有刪除目標均核對在 D:/capability-store 內；未更動來源 raw、候選池、catalog、Sales 原 L3 或使用者其他專案。本機 web/dist 仍供既有 4175 預覽服務使用，所以保留，沒有納入 GitHub。

沒有發現 node_modules、__pycache__ 或額外測試暫存目錄。歷史研究與來源腳本仍有回查／重現用途，故保留而非當作垃圾刪除。檔案清理後以建置、來源驗證與凍結雜湊確認必要檔案完整。
