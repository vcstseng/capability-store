# GitHub 來源擴大比較 — 2026-11-04

本輪範圍：搜尋並比較已整理好的資源庫，供能力便利商店選源；不安裝收錄資源、不開始 UI。

最新方向：以 Startup Radar 的 22 個「問題／工作」大類作入口，先從完整來源文件擷取基本項目，再依工作找候選並回讀介紹確認；沒有筆數上限，不要求每個資源都能配對。此為探索用途，尚未完成逐項可行性評估。

| Repo | 內容 | 建議角色 | 適用性與限制 |
|---|---|---|---|
| [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) | Skills | 主要候選（已有快照） | 官方團隊與社群 Skills，常有同一 repo 多項 Skill。偏開發生態，不能視為已覆蓋全部企業工作。 |
| [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Skills | 建議補入 | README 有文件、分析、商務行銷、溝通、生產力與協作分類，較容易對應工作入口。包含自有平台自動化內容及外部連結，需保留來源與依賴。 |
| [VoltAgent/official-mcp-servers](https://github.com/VoltAgent/official-mcp-servers) | MCP Tools | 建議優先來源 | 第三方整理、主打供應商官方 servers；已有搜尋、財務、通訊、專案管理、行銷與人資等分組。名稱含 official 不代表清單由 MCP 官方維護，仍須回原供應商確認。 |
| [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) | MCP Tools | 廣泛補充（已有快照） | 範圍很大，含實驗與社群實作；可保留全量原始清單，正式整理依 22 工作找候選，避免逐項處理全部非相關內容。 |
| [Shubhamsaboo/awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps) | 應用範例 | 主要候選（已有快照） | 有研究、資料分析、財務、法務、招募及客服等流程示例，多數是同一 repo 子目錄。是範例候選，不代表已驗證可導入企業。 |
| [wong2/awesome-mcp-servers](https://github.com/wong2/awesome-mcp-servers) | MCP Tools | 備選／補漏 | 區分 reference、official、community servers；部分功能與其他 MCP 清單重疊，新增價值需擷取後去重比較。 |
| [anthropics/skills](https://github.com/anthropics/skills) | 官方 Skill 範例 | 補強原始來源 | 文件、設計、開發、企業溝通等實際 Skill。README 明示文件 Skills 為 source-available，不能把全部當同一開源授權。 |
| [github/awesome-copilot](https://github.com/github/awesome-copilot) | Agents／Skills／Instructions 等 | 備選 | 偏軟體開發與 Copilot，與 Skills 清單有交集。保留補充，先確認工作對應，不因來源官方就收錄全部類型。 |

## 建議採用順序

第一輪來源以五份清單為核心候選：兩份 Skills、official-mcp-servers、既有廣泛 MCP 清單、應用範例。這是來源角色建議，未自動把新候選加入已下載資料集。原三份快照仍完整保留；新增來源尚未下載，正式擷取及排重尚未開始。

資源名稱、簡介、原連結、原分組先擷取；依 22 工作找相關候選，再確認文字依據。個別資源 Stars、維護狀況後續取得，缺資料留空；清單 repo 的 Stars 只屬清單本身。

## 新增首頁方向：GitHub Trending

使用者提出首頁要展示 GitHub Trending repos。官方入口：https://github.com/trending ，提供 Today／This week／This month，頁面列有 repo、簡介、語言、總 Stars 與榜單時段新增 Stars 等可取得資訊。本輪只確認頁面結構，不把搜尋引擎快取內容當作最新榜單快照。

建議首頁保留兩個入口：

1. 按工作找能力：22 個工作大類，搭配資源類型。
2. GitHub Trending：獨立近期熱門區；建議第一版先展示週榜的一段預覽，可進完整列表，標示榜單時段、來源與擷取時間。

Trending 來源是 repo 級，不把 repo 熱度套到個別 Skill；同項同時出現在清單與榜單時保留多來源關係。能確認對應工作時加標籤；不強制把全站榜單所有項目塞進 22 類。Trending 不代表已測試或效果驗證。

Layer 2 可沿用共用列表模板，區分按工作篩選與 Trending 榜單瀏覽，榜單保留來源順序及日期；Layer 3 共用資源詳情，另顯示 Trending 來源與觀察期。以上仍是討論草案，不是已定稿 UI 或自動排程。
