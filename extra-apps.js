// Extra AppForge catalog entries.
// Windows indexes stay append-only: personalized installer tokens depend on them.
(() => {
  const extras = [
    // Download managers — index 70 is already supported by AppForgeInstaller.
    ['Free Download Manager','Utilities','freedownloadmanager.org',9,'SoftDeluxe.FreeDownloadManager',70,['essentials','free']],

    // More browsers
    ['Zen Browser','Popular Browsers','zen-browser.app',9,'Zen-Team.Zen-Browser',71,['essentials']],
    ['LibreWolf','Privacy Browsers','librewolf.net',8,'LibreWolf.LibreWolf',72,['privacy']],
    ['Floorp','Privacy Browsers','floorp.app',7,'Ablaze.Floorp',73,['privacy']],
    ['Tor Browser','Privacy Browsers','torproject.org',9,'TorProject.TorBrowser',74,['privacy','security']],
    ['Mullvad Browser','Privacy Browsers','mullvad.net/browser',8,'MullvadVPN.MullvadBrowser',75,['privacy','security']],
    ['Waterfox','Privacy Browsers','waterfox.net',7,'Waterfox.Waterfox',76,['privacy']],
    ['Chromium','Alternative Browsers','chromium.org',7,'Hibbiki.Chromium',77,['developer']],
    ['Falkon','Alternative Browsers','falkon.org',6,'KDE.Falkon',78,[]],
    ['Ungoogled Chromium','Privacy Browsers','github.com/ungoogled-software/ungoogled-chromium-windows',7,'eloston.ungoogled-chromium',79,['privacy']],
    ['Firefox ESR','Alternative Browsers','mozilla.org/firefox/enterprise',7,'Mozilla.Firefox.ESR',80,[]],
    ['Thorium Browser','Alternative Browsers','thorium.rocks',7,'Alex313031.Thorium',81,[]],
    ['Arc Browser','Alternative Browsers','arc.net',8,'TheBrowserCompany.Arc',82,[]],
    ['Opera GX','Gaming Browsers','opera.com/gx',9,'Opera.OperaGX',83,['gaming','ai','free']],
    ['DuckDuckGo Browser','Privacy Browsers','duckduckgo.com/windows',8,'DuckDuckGo.DesktopBrowser',84,['privacy']],

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
    ['GitHub Desktop + Copilot tools','AI Agents','github.com/features/copilot',7,'url:https://github.com/features/copilot',100,['ai','agent','developer']],

    // Free AI browser. Basic AI features are available without a paid subscription.
    ['Comet Browser','AI Browsers','perplexity.ai',9,'url:https://www.perplexity.ai/comet',101,['ai','agent','free']],

    // PDF tools
    ['PDF24 Creator','Documents & Office','pdf24.org',9,'geeksoftwareGmbH.PDF24Creator',102,['essentials','student','free']],

    // Minecraft creation tools
    ['MCreator','Minecraft','mcreator.net',10,'url:https://mcreator.net/download',103,['gaming','creator','developer','free']],
    ['Minecraft Launcher','Minecraft','minecraft.net',10,'Mojang.MinecraftLauncher',104,['gaming','essentials']],
    ['Modrinth App','Minecraft','modrinth.com',10,'Modrinth.ModrinthApp',105,['gaming','mods','free']],
    ['XMCL','Minecraft','xmcl.app',8,'CI010.XMinecraftLauncher',106,['gaming','mods','free']],
    ['Amulet Editor','Minecraft','amuletmc.com',8,'url:https://www.amuletmc.com/',107,['gaming','creator']],

    // Discord alternative
    ['Root','Messaging','rootapp.com',9,'url:https://www.rootapp.com/',108,['gaming','free']],

    // Minecraft / modding
    ['CurseForge','Minecraft','curseforge.com',10,'Overwolf.CurseForge',109,['gaming','mods']],
    ['Fabric','Minecraft','fabricmc.net',9,'url:https://fabricmc.net/use/installer/',110,['gaming','mods','developer','free']],
    ['NeoForge','Minecraft','neoforged.net',8,'url:https://neoforged.net/',111,['gaming','mods','developer','free']],
    ['Aseprite','Design & Imaging','aseprite.org',8,'url:https://www.aseprite.org/',112,['creator']],

    // Gaming launchers
    ['EA app','Gaming','ea.com/ea-app',9,'ElectronicArts.EADesktop',113,['gaming']],
    ['Ubisoft Connect','Gaming','ubisoftconnect.com',9,'Ubisoft.Connect',114,['gaming']],
    ['GOG GALAXY','Gaming','gog.com/galaxy',9,'GOG.Galaxy',115,['gaming']],
    ['Playnite','Gaming','playnite.link',9,'Playnite.Playnite',116,['gaming','free']],

    // Gaming performance
    ['MSI Afterburner','Gaming','msi.com/Landing/afterburner',9,'url:https://www.msi.com/Landing/afterburner/graphics-cards',117,['gaming']],

    // Cybersecurity
    ['Wireshark','Security','wireshark.org',10,'WiresharkFoundation.Wireshark',118,['security','developer','student']],
    ['Nmap','Security','nmap.org',10,'Insecure.Nmap',119,['security','developer','student']],
    ['VirtualBox','Development','virtualbox.org',9,'Oracle.VirtualBox',120,['developer','student']],
    ['Burp Suite Community','Security','portswigger.net/burp/communitydownload',10,'PortSwigger.BurpSuite.Community',121,['security','developer','student','free']],
    ['OWASP ZAP','Security','zaproxy.org',9,'url:https://www.zaproxy.org/download/',122,['security','developer','student','free']],

    // AI image workflows
    ['ComfyUI','AI & Local Models','comfy.org',9,'url:https://www.comfy.org/download',123,['ai','creator','free']],

    // Content creation / game development
    ['DaVinci Resolve','Media','blackmagicdesign.com/products/davinciresolve',10,'url:https://www.blackmagicdesign.com/products/davinciresolve',124,['creator','free']],
    ['CapCut','Media','capcut.com',9,'url:https://www.capcut.com/tools/desktop-video-editor',125,['creator']],
    ['Kdenlive','Media','kdenlive.org',9,'url:https://kdenlive.org/download/',126,['creator','free']],
    ['Godot','Development','godotengine.org',10,'url:https://godotengine.org/download/',127,['developer','creator','free']],
    ['Unreal Engine','Development','unrealengine.com',10,'url:https://www.unrealengine.com/download',128,['developer','creator','gaming']],
    ['Unity Hub','Development','unity.com/download',10,'url:https://unity.com/download',129,['developer','creator','gaming']],

    // Messaging / Discord alternatives
    ['Revolt','Messaging','revolt.chat',8,'url:https://revolt.chat/',130,['gaming','free']],
    ['Element','Messaging','element.io',9,'url:https://element.io/download',131,['privacy','free']],
    ['Mumble','Messaging','mumble.info',8,'url:https://www.mumble.info/downloads/',132,['gaming','free']],
    ['Guilded','Messaging','guilded.gg',8,'url:https://www.guilded.gg/downloads',134,['gaming','free']]
  ];

  for (const [name,category,domain,popular,windows,winIndex,tags] of extras) {
    const key=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    if (apps.some(a=>a.key===key)) continue;
    const pkg={windows};
    if(name==='Floorp'){pkg.linux='one.ablaze.floorp';pkg.mac={type:'cask',id:'floorp'};}
    if(name==='MCreator'){pkg.linux='url:https://mcreator.net/download';pkg.mac={type:'url',id:'https://mcreator.net/download'};}
    if(name==='Modrinth App'){pkg.linux='com.modrinth.ModrinthApp';pkg.mac={type:'cask',id:'modrinth-app'};}
    apps.push({name,category,domain,popular,tags,pkg,winIndex,key,logo:fav(domain),desc:`${name} — install or open the official installer automatically.`});
  }

  const browserGroups = {
    'Google Chrome':'Popular Browsers','Mozilla Firefox':'Popular Browsers','Microsoft Edge':'Popular Browsers',
    'Brave':'AI Browsers','Opera':'AI Browsers','Vivaldi':'Popular Browsers'
  };
  for (const app of apps) if (browserGroups[app.name]) app.category=browserGroups[app.name];
  updatePlatformUI();
})();