# 資料腳本

- collect/collect_and_extract.py：保存／擷取五份清單候選，勿在一般 review 時重新抓取或覆蓋快照。
- analyze/curate_prototype.py：首輪明確挑選與中英文註記，可重建首版 catalog 和 review；基於固定 candidate-pool 索引及 ID，不是自動分類器。
- validate/validate_catalog.py：離線核對候選池摘要、來源 commit、原始行號、快照 hash、雙語、參照完整性與數量。

腳本只處理資料；不安裝或執行收錄的第三方資源。
