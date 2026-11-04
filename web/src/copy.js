export const copy = {
  zh: {
    title: '能力便利商店', tagline: '為工作找能力', skip: '跳到工作探索',
    heading: '你想改善什麼工作？', intro: '探索可支援這項工作的工具、Skills 與 Agent 範例，作為研究與試作的起點。',
    themes: '個可探索能力主題', resources: '個相關候選資源', explore: '從工作找能力',
    exploreHint: '點選領域，直接瀏覽相關能力與候選。', countLabel: '能力主題數',
    visible: '僅列有相關候選的分類；同一能力可支援不同工作，分類筆數不相加。', selected: '已選領域', clear: '清除選擇',
    next: '此版先完成工作選擇；能力列表將於下一階段開放。',
    groupCount: (n, r) => `已整理 ${n} 個能力主題、${r} 個候選資源。`,
    selection: name => `已選擇：${name}。`, clearStatus: '已清除工作選擇。',
    trending: 'GitHub 熱門快照', trendingHint: '額外看看受到關注的專案。這是保存的榜單，不會即時更新。',
    snapshot: '週榜快照', weekly: '本週新增 Stars', show: n => `顯示全部 ${n} 筆`, collapse: '收起至 3 筆',
    trendNote: '保留榜單原始順序；熱度不代表已驗證或適合你的工作。', source: '查看榜單來源 ↗',
    noDescription: '榜單未提供介紹。', github: '在 GitHub 查看 ↗', newTab: '在新分頁開啟',
    footer: '先探索，再確認是否適用。候選尚未安裝或實測。', repo: '專案與資料 ↗',
    loading: '正在讀取資料…', error: '暫時無法載入資料。', retry: '重新載入',
    trendError: '熱門榜單暫時無法載入；你仍可使用工作入口。',
    prototype: 'Layer 1 · 探索入口',
  },
  en: {
    title: 'Capability Store', tagline: 'Capabilities for your work', skip: 'Skip to work exploration',
    heading: 'What work would you like to improve?', intro: 'Explore tools, skills and agent examples that can support the work — a starting point for research and prototyping.',
    themes: 'explorable capability themes', resources: 'related resource candidates', explore: 'Find capabilities by work',
    exploreHint: 'Choose an area to browse its capabilities and candidates.', countLabel: 'Capability themes',
    visible: 'Only categories with related candidates are shown. Capabilities can serve several areas; category counts do not add up.', selected: 'Selected area', clear: 'Clear selection',
    next: 'Work selection is ready in this version. Capability lists are coming next.',
    groupCount: (n, r) => `${n} capability themes and ${r} resource candidates curated.`,
    selection: name => `Selected: ${name}.`, clearStatus: 'Work selection cleared.',
    trending: 'GitHub Trending snapshot', trendingHint: 'An extra way to discover projects. This is a saved ranking, not a live feed.',
    snapshot: 'Weekly snapshot', weekly: 'stars this week', show: n => `Show all ${n} repos`, collapse: 'Show first 3',
    trendNote: 'In source order. Popularity does not establish suitability or validation.', source: 'View ranking source ↗',
    noDescription: 'No description provided in the ranking.', github: 'View on GitHub ↗', newTab: 'opens in a new tab',
    footer: 'Explore first, then assess fit. Candidates have not been installed or tested.', repo: 'Project & data ↗',
    loading: 'Loading the catalog…', error: 'The catalog could not be loaded.', retry: 'Try again',
    trendError: 'Trending is unavailable. You can still explore work areas.',
    prototype: 'Layer 1 · Explore',
  },
};
Object.assign(copy.zh, {
 viewCapabilities:'查看能力 →', viewTrending:n=>`查看 ${n} 個專案 →`,
 backToWork:'← 返回分類入口', journey:'探索路徑', resultStep:'02 能力與候選',
 resultsIntro:'依能力主題瀏覽相關候選，找到值得進一步研究的工具與做法。',
 invalidWork:'找不到這個分類', invalidWorkHint:'這個連結沒有可用的工作分類，請返回入口重新選擇。',
 repoCount:n=>`本次快照共 ${n} 個專案。`, directoryStatus:'依清單整理 · 尚未實測',
 themeNavigation:'跳至能力主題', resultsNote:'候選可支援的步驟與適用性仍需確認；同一資源若出現在多個主題下，總數只計一次。',
 candidateCount:n=>`${n} 個候選`, originalSource:'前往原始來源 ↗', parentProject:'所屬專案：', listSource:'清單來源：',
 resource:'資源', githubProject:'GitHub 專案', skipResults:'跳到候選列表',
});
Object.assign(copy.en, {
 viewCapabilities:'Explore capabilities →', viewTrending:n=>`View ${n} projects →`,
 backToWork:'← Back to categories', journey:'Exploration path', resultStep:'02 Capabilities & candidates',
 resultsIntro:'Browse candidates by capability to find tools and approaches worth investigating.',
 invalidWork:'Category not found', invalidWorkHint:'This link has no available work category. Return to the portal to choose one.',
 repoCount:n=>`${n} projects in this snapshot.`, directoryStatus:'Directory review · Not tested',
 themeNavigation:'Jump to a capability', resultsNote:'Supported steps and suitability need assessment. A resource appearing in multiple themes counts once in the total.',
 candidateCount:n=>`${n} candidates`, originalSource:'Open original source ↗', parentProject:'Parent project: ', listSource:'Listed by: ',
 resource:'Resource', githubProject:'GitHub project', skipResults:'Skip to candidates',
});

Object.assign(copy.zh,{canDo:'能做什麼：',input:'輸入：',output:'輸出：',viewDetail:'查看詳情',backList:'← 返回候選列表',detailTitle:'資源詳情',resourceMissing:'找不到這個資源',resourceMissingHint:'此連結的資源不存在或尚未整理，請返回列表。',taskScope:'工作範圍',relatedCapabilities:'相關能力主題',originalResource:'原始資源',evidenceTitle:'資料依據',reviewDate:'整理／觀察日期',reviewStatus:'查核狀態',snapshotStatus:'榜單快照 · 尚未實測',externalNote:'以下連結開啟外部網站。',detailLimits:'目前依公開清單或榜單整理，尚未逐項確認安裝條件、費用、相容性與實際效果。',originalDescription:'查看來源英文介紹'});
Object.assign(copy.en,{canDo:'What it does: ',input:'Input: ',output:'Output: ',viewDetail:'View details',backList:'← Back to candidates',detailTitle:'Resource details',resourceMissing:'Resource not found',resourceMissingHint:'This resource is unavailable. Return to the list to explore candidates.',taskScope:'Task scope',relatedCapabilities:'Related capability themes',originalResource:'Original resource',evidenceTitle:'Evidence and review',reviewDate:'Review / observation date',reviewStatus:'Review status',snapshotStatus:'Ranking snapshot · Not tested',externalNote:'These links open external websites.',detailLimits:'Based on public directories or rankings. Installation requirements, pricing, compatibility and outcomes have not been individually verified.',originalDescription:'Read the original English description'});

copy.zh.topicDefault='比較下列候選能支援的具體工作，再查看資源詳情。';
copy.en.topicDefault='Compare the tasks each candidate supports, then open its details.';
copy.zh.topicIntros={
'document-conversion':'將文件內容轉換或匯入，供後續資料處理使用。',
'data-analysis':'比較試算表操作、資料倉儲查詢與檔案問答等不同做法。',
'invoices':'這裡包含整理發票／收據，以及建立與檢視發票的不同候選。',
'accounting':'探索連接現有會計服務資料的工具。',
'payments':'比較付款、商品目錄與訂單等商務功能的工具入口。',
'forecasting':'比較時間序列預測與資料分析工具的工作範圍。',
'procurement-search':'目前候選分別查詢德國與俄羅斯公開採購資料，請留意資料地區。'};
copy.en.topicIntros={
'document-conversion':'Convert or ingest document content for further data processing.',
'data-analysis':'Compare spreadsheet operations, warehouse queries and questions about files.',
'invoices':'Candidates cover different tasks: organizing invoices and receipts, or creating and reviewing invoices.',
'accounting':'Explore tools for accessing existing accounting services.',
'payments':'Compare tool entry points for payments, catalogs, orders and commerce.',
'forecasting':'Compare the scope of time-series forecasting and data analysis tools.',
'procurement-search':'These candidates query public procurement data in Germany and Russia respectively. Check regional coverage.'};

Object.assign(copy.zh,{
intro:'從企業工作出發，探索可能需要的能力，再評估沿用、組合或自行開發。',
footer:'能力構想尚未實作；現成資源僅作後續評估線索。',
businessDomainUnit:'個企業領域',conceptUnit:'個能力構想',conceptCountLabel:'能力構想數',conceptStep:'02 能力構想',
conceptIntro:'按工作環節探索能力構想，再評估沿用、組合或自建。',
conceptBadge:'Concept prototype · 尚未實作',conceptBoundary:'以下構想尚未實作，不代表已驗證的問題解法。',
conceptSummary:(s,n)=>`${s} 個工作環節 · ${n} 個能力構想`,conceptAcquisition:'未來可沿用、調整、組合或自建',conceptQuantity:n=>`${n} 個構想`,
kindGuide:'Skill、Tool、Agent、Workflow 有什麼不同？',kindDefinitions:'Skill：可重用的分析或操作方法。Tool：明確輸入輸出的計算或查詢功能。Agent：在限定任務內整理資訊、判斷下一步。Workflow：把步驟、交接與核准串成流程。類型可以組合，不代表已部署。',
idea:'構想',expectedInput:'預期輸入',expectedOutput:'預期產出',humanDecision:'人工決策與限制',
referenceHeading:'可能可以用的 GitHub 資源',referenceNote:'從既有候選整理的實現線索，尚未核對能否支援上述構想。',referenceStatus:'待評估',possibleStep:'可能參考的環節：',
referenceBoundary:'不代表一個 repo 就能完成整個構想；也可能需要調整、組合或自行開發。'});
Object.assign(copy.en,{
intro:'Start with enterprise work, explore the capabilities it may need, then consider reuse, adaptation, composition or custom development.',
footer:'Capability concepts are not implemented. Existing resources are leads for later assessment.',
businessDomainUnit:'business domains',conceptUnit:'capability concepts',conceptCountLabel:'Capability concepts',conceptStep:'02 Capability concepts',
conceptIntro:'Explore capability ideas by work stage, then consider reuse, composition or custom development.',
conceptBadge:'Concept prototype · Not implemented',conceptBoundary:'Design concepts only: not implemented or validated as business solutions.',
conceptSummary:(s,n)=>`${s} work stages · ${n} capability concepts`,conceptAcquisition:'Potential routes: reuse, adapt, combine or build',conceptQuantity:n=>`${n} concepts`,
kindGuide:'How do skills, tools, agents and workflows differ?',kindDefinitions:'Skill: a reusable method for analysis or operations. Tool: a defined calculation or query. Agent: gathers information and reasons about next steps within a bounded task. Workflow: connects steps, handoffs and approvals. Types can be combined; none implies deployment.',
idea:'Concept',expectedInput:'Expected input',expectedOutput:'Expected output',humanDecision:'Human decisions and limits',
referenceHeading:'GitHub resources that may help',referenceNote:'Implementation leads from the existing candidate pool. Their fit to these concepts has not been verified.',referenceStatus:'To assess',possibleStep:'Potential reference for: ',
referenceBoundary:'A repository is not assumed to deliver a complete concept. Adaptation, composition or custom development may be needed.'});
