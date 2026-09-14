// Extra AppForge catalog entries
// Keep Windows indexes append-only: the personalized installer token depends on them.
(() => {
  const extras = [
    {key:'free-download-manager',name:'Free Download Manager',category:'File Sharing',domain:'freedownloadmanager.org',popular:9,tags:['essentials'],pkg:{windows:'SoftDeluxe.FreeDownloadManager'},winIndex:70,desc:'Free Download Manager — download accelerator and organizer.'},
    {key:'zen-browser',name:'Zen Browser',category:'Web Browsers',domain:'zen-browser.app',popular:9,tags:['browser'],pkg:{windows:'Zen-Team.Zen-Browser'},winIndex:71,desc:'Modern Firefox-based browser focused on a calm, customizable browsing experience.'},
    {key:'librewolf',name:'LibreWolf',category:'Web Browsers',domain:'librewolf.net',popular:8,tags:['browser','privacy'],pkg:{windows:'LibreWolf.LibreWolf'},winIndex:72,desc:'Privacy-focused Firefox fork with stronger privacy defaults.'},
    {key:'floorp',name:'Floorp',category:'Web Browsers',domain:'floorp.app',popular:7,tags:['browser','privacy'],pkg:{windows:'Ablaze.Floorp'},winIndex:73,desc:'Highly customizable Firefox-based browser.'},
    {key:'tor-browser',name:'Tor Browser',category:'Web Browsers',domain:'torproject.org',popular:8,tags:['browser','privacy'],pkg:{windows:'TorProject.TorBrowser'},winIndex:74,desc:'Privacy browser that routes browsing through the Tor network.'},
    {key:'mullvad-browser',name:'Mullvad Browser',category:'Web Browsers',domain:'mullvad.net',popular:7,tags:['browser','privacy'],pkg:{windows:'MullvadVPN.MullvadBrowser'},winIndex:75,desc:'Privacy-focused browser developed with the Tor Project.'},
    {key:'waterfox',name:'Waterfox',category:'Web Browsers',domain:'waterfox.net',popular:6,tags:['browser'],pkg:{windows:'Waterfox.Waterfox'},winIndex:76,desc:'Independent Firefox-based browser with customization and privacy features.'},
    {key:'chromium',name:'Chromium',category:'Web Browsers',domain:'chromium.org',popular:7,tags:['browser'],pkg:{windows:'Hibbiki.Chromium'},winIndex:77,desc:'Open-source browser project behind many Chromium-based browsers.'},
    {key:'falkon',name:'Falkon',category:'Web Browsers',domain:'falkon.org',popular:5,tags:['browser'],pkg:{windows:'KDE.Falkon'},winIndex:78,desc:'Lightweight open-source web browser from KDE.'},
    {key:'ungoogled-chromium',name:'Ungoogled Chromium',category:'Web Browsers',domain:'github.com/ungoogled-software',popular:7,tags:['browser','privacy'],pkg:{windows:'eloston.ungoogled-chromium'},winIndex:79,desc:'Chromium with Google web-service integration removed.'},
    {key:'firefox-esr',name:'Firefox ESR',category:'Web Browsers',domain:'mozilla.org',popular:6,tags:['browser'],pkg:{windows:'Mozilla.Firefox.ESR'},winIndex:80,desc:'Firefox Extended Support Release for users who prefer long-term stability.'},
    {key:'thorium-browser',name:'Thorium Browser',category:'Web Browsers',domain:'thorium.rocks',popular:6,tags:['browser'],pkg:{windows:'Alex313031.Thorium.AVX2'},winIndex:81,desc:'Performance-focused Chromium-based browser.'}
  ];
  for (const item of extras) {
    item.logo=fav(item.domain);
    if (!apps.some(a => a.key === item.key)) apps.push(item);
  }
  updatePlatformUI();
})();
