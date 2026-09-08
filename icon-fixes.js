// Robust AppForge icon system.
// Every app gets a chain of sources: product logo -> Google favicon -> DuckDuckGo favicon -> initials.
const appIconSlugs = {
  'Google Chrome':'googlechrome','Mozilla Firefox':'firefoxbrowser','Microsoft Edge':'microsoftedge','Brave':'brave','Opera':'opera','Vivaldi':'vivaldi',
  'Discord':'discord','Telegram':'telegram','Zoom':'zoom',
  'Steam':'steam','Epic Games Launcher':'epicgames','Heroic Games Launcher':'heroicgameslauncher',
  'VLC media player':'vlcmediaplayer','Spotify':'spotify','OBS Studio':'obsstudio','Audacity':'audacity','HandBrake':'handbrake',
  'Visual Studio Code':'visualstudiocode','Git':'git','GitHub Desktop':'github','Python 3':'python','Node.js LTS':'nodedotjs','Docker Desktop':'docker','Postman':'postman','PyCharm Community':'pycharm','IntelliJ IDEA Community':'intellijidea','Notepad++':'notepadplusplus','Cisco Packet Tracer':'cisco','Blockbench':'blockbench',
  'LibreOffice':'libreoffice','Obsidian':'obsidian','Thunderbird':'thunderbird',
  'Krita':'krita','GIMP':'gimp','Blender':'blender','Inkscape':'inkscape','ShareX':'sharex',
  '7-Zip':'7zip','WinRAR':'winrar','qBittorrent':'qbittorrent','FileZilla':'filezilla',
  'Bitwarden':'bitwarden','KeePassXC':'keepassxc','Malwarebytes':'malwarebytes',
  'Rufus':'rufus','balenaEtcher':'balenaetcher','AnyDesk':'anydesk','TeamViewer':'teamviewer','RustDesk':'rustdesk',
  'Java 21 (Temurin JDK)':'eclipseadoptium','Java 17 (Temurin JDK)':'eclipseadoptium',
  'NVIDIA Graphics Drivers':'nvidia','NVIDIA App':'nvidia','AMD Radeon Drivers':'amd','AMD Software: Adrenalin Edition':'amd'
};

// These products are better represented by their official-site icon than by Simple Icons.
const faviconDomains = {
  'Microsoft Teams':'teams.microsoft.com',
  'Slack':'slack.com',
  'Prism Launcher':'prismlauncher.org',
  'PeaZip':'peazip.github.io',
  'PuTTY':'putty.org',
  'WinSCP':'winscp.net',
  'PowerToys':'learn.microsoft.com',
  'Everything':'voidtools.com',
  'WizTree':'diskanalyzer.com',
  'MiniTool Partition Wizard':'partitionwizard.com',
  'HWiNFO':'hwinfo.com',
  'CPU-Z':'cpuid.com',
  'CrystalDiskInfo':'crystalmark.info',
  'Visual C++ Redistributable 2015–2022 x64':'microsoft.com',
  '.NET Desktop Runtime 8':'dotnet.microsoft.com'
};

function cleanHost(domain){
  return String(domain || '').replace(/^https?:\/\//,'').split('/')[0];
}
function googleIcon(host){
  return `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(`https://${host}`)}&sz=128`;
}
function duckIcon(host){
  return `https://icons.duckduckgo.com/ip3/${host}.ico`;
}
function sourcesFor(app){
  const host = cleanHost(faviconDomains[app.name] || app.domain);
  const out = [];
  const slug = appIconSlugs[app.name];
  if (slug && !faviconDomains[app.name]) out.push(`https://cdn.simpleicons.org/${slug}`);
  if (host) {
    out.push(googleIcon(host));
    out.push(duckIcon(host));
  }
  return [...new Set(out)];
}

window.appIconFallback = function(img){
  let sources = [];
  try { sources = JSON.parse(decodeURIComponent(img.dataset.sources || '[]')); } catch {}
  let next = Number(img.dataset.iconIndex || 0) + 1;
  if (next < sources.length) {
    img.dataset.iconIndex = String(next);
    img.src = sources[next];
    return;
  }
  img.style.display = 'none';
  const fallback = img.nextElementSibling;
  if (fallback) fallback.style.display = 'grid';
};

// Override the renderer from app.js so every icon gets automatic fallbacks.
logoMarkup = function(app){
  const fallback = (app.name.match(/[A-Za-z0-9]/g) || ['A']).slice(0,2).join('').toUpperCase();
  const sources = sourcesFor(app);
  const src = sources[0] || googleIcon(cleanHost(app.domain));
  const packed = encodeURIComponent(JSON.stringify(sources));
  return `<img src="${src}" data-sources="${packed}" data-icon-index="0" alt="${app.name} icon" loading="lazy" referrerpolicy="no-referrer" onerror="appIconFallback(this)"><span class="logo-fallback">${fallback}</span>`;
};

// Refresh the whole UI after replacing the icon renderer.
renderApps();
updateSelectionBar();