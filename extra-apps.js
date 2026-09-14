// Extra AppForge catalog entries.
// Windows indexes stay append-only: personalized installer tokens depend on them.
(() => {
  const extras = [
    // More browsers
    ['Zen Browser','Web Browsers','zen-browser.app',9,'Zen-Team.Zen-Browser',71,['essentials']],
    ['LibreWolf','Web Browsers','librewolf.net',8,'LibreWolf.LibreWolf',72,['privacy']],
    ['Floorp','Web Browsers','floorp.app',7,'Ablaze.Floorp',73,['privacy']],
    ['Tor Browser','Web Browsers','torproject.org',9,'TorProject.TorBrowser',74,['privacy','security']],
    ['Mullvad Browser','Web Browsers','mullvad.net/browser',8,'MullvadVPN.MullvadBrowser',75,['privacy','security']],
    ['Waterfox','Web Browsers','waterfox.net',7,'Waterfox.Waterfox',76,['privacy']],
    ['Chromium','Web Browsers','chromium.org',7,'Hibbiki.Chromium',77,['developer']],
    ['Falkon','Web Browsers','falkon.org',6,'KDE.Falkon',78,[]],
    ['Ungoogled Chromium','Web Browsers','github.com/ungoogled-software/ungoogled-chromium-windows',7,'eloston.ungoogled-chromium',79,['privacy']],
    ['Firefox ESR','Web Browsers','mozilla.org/firefox/enterprise',7,'Mozilla.Firefox.ESR',80,[]],
    ['Thorium Browser','Web Browsers','thorium.rocks',7,'Alex313031.Thorium',81,[]],
    ['Arc Browser','Web Browsers','arc.net',8,'TheBrowserCompany.Arc',82,[]],
    ['Opera GX','Web Browsers','opera.com/gx',9,'Opera.OperaGX',83,['gaming']],
    ['DuckDuckGo Browser','Web Browsers','duckduckgo.com/windows',8,'DuckDuckGo.DesktopBrowser',84,['privacy']],

    // Privacy & security
    ['Proton VPN','Privacy & Security','protonvpn.com',9,'Proton.ProtonVPN',85,['privacy','security','essentials']],
    ['Mullvad VPN','Privacy & Security','mullvad.net',8,'MullvadVPN.MullvadVPN',86,['privacy','security']],
    ['Proton Pass','Privacy & Security','proton.me/pass',8,'Proton.ProtonPass',87,['privacy','security']],
    ['VeraCrypt','Privacy & Security','veracrypt.fr',8,'IDRIX.VeraCrypt',88,['privacy','security']],
    ['Cryptomator','Privacy & Security','cryptomator.org',7,'Cryptomator.Cryptomator',89,['privacy','security']],
    ['SimpleWall','Privacy & Security','github.com/henrypp/simplewall',8,'Henry++.simplewall',90,['privacy','security']],

    // Local AI / AI desktop
    ['Ollama','AI & Local Models','ollama.com',10,'Ollama.Ollama',91,['ai','developer']],
    ['LM Studio','AI & Local Models','lmstudio.ai',10,'ElementLabs.LMStudio',92,['ai']],
    ['Jan','AI & Local Models','jan.ai',9,'Jan.Jan',93,['ai','privacy']],
    ['GPT4All','AI & Local Models','nomic.ai/gpt4all',8,'Nomic.GPT4All',94,['ai','privacy']],
    ['AnythingLLM','AI & Local Models','anythingllm.com',9,'MintplexLabs.AnythingLLM',95,['ai','agent','privacy']],

    // AI agents / coding assistants
    ['Claude Desktop','AI Agents','claude.ai',9,'Anthropic.Claude',96,['ai','agent']],
    ['ChatGPT Desktop','AI Agents','openai.com/chatgpt/desktop',10,'OpenAI.ChatGPT',97,['ai','agent']],
    ['Cursor','AI Agents','cursor.com',10,'Anysphere.Cursor',98,['ai','agent','developer']],
    ['Windsurf','AI Agents','windsurf.com',9,'Codeium.Windsurf',99,['ai','agent','developer']],
    ['GitHub Desktop + Copilot tools','AI Agents','github.com/features/copilot',7,'url:https://github.com/features/copilot',100,['ai','agent','developer']]
  ];

  for (const [name,category,domain,popular,windows,winIndex,tags] of extras) {
    const key=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    if (apps.some(a=>a.key===key)) continue;
    apps.push({
      name,category,domain,popular,tags,
      pkg:{windows},winIndex,
      key,logo:fav(domain),
      desc:`${name} — install or open the official installer automatically.`
    });
  }
  updatePlatformUI();
})();