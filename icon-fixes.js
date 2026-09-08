// AppForge icon system v14 — stable sources and clean fallbacks.
// Use stable SVG/PNG sources for known products. Never leave a browser broken-image glyph visible.

const simpleIconSlugs = {
  'Google Chrome':'googlechrome','Mozilla Firefox':'firefoxbrowser','Microsoft Edge':'microsoftedge','Brave':'brave','Opera':'opera','Vivaldi':'vivaldi',
  'Discord':'discord','Telegram':'telegram','Slack':'slack','Zoom':'zoom',
  'Steam':'steam','Epic Games Launcher':'epicgames','Heroic Games Launcher':'heroicgameslauncher',
  'VLC media player':'vlcmediaplayer','Spotify':'spotify','OBS Studio':'obsstudio','Audacity':'audacity','HandBrake':'handbrake',
  'Visual Studio Code':'visualstudiocode','Git':'git','GitHub Desktop':'github','Python 3':'python','Node.js LTS':'nodedotjs','Docker Desktop':'docker','Postman':'postman','PyCharm Community':'pycharm','IntelliJ IDEA Community':'intellijidea','Notepad++':'notepadplusplus','Cisco Packet Tracer':'cisco','Blockbench':'blockbench',
  'LibreOffice':'libreoffice','Obsidian':'obsidian','Thunderbird':'thunderbird',
  'Krita':'krita','GIMP':'gimp','Blender':'blender','Inkscape':'inkscape','ShareX':'sharex',
  '7-Zip':'7zip','WinRAR':'winrar','qBittorrent':'qbittorrent','FileZilla':'filezilla',
  'Bitwarden':'bitwarden','KeePassXC':'keepassxc','Malwarebytes':'malwarebytes',
  'Rufus':'rufus','balenaEtcher':'balenaetcher','AnyDesk':'anydesk','TeamViewer':'teamviewer','PuTTY':'putty','RustDesk':'rustdesk',
  'Java 21 (Temurin JDK)':'eclipseadoptium','Java 17 (Temurin JDK)':'eclipseadoptium',
  'NVIDIA Graphics Drivers':'nvidia','NVIDIA App':'nvidia','AMD Radeon Drivers':'amd','AMD Software: Adrenalin Edition':'amd'
};

const exactIconUrls = {
  // Known icons that were previously broken in the UI.
  'Microsoft Teams':'https://msicons.com/icons/apps/Microsoft%20Teams.svg',
  'PeaZip':'https://raw.githubusercontent.com/peazip/peazip.github.io/master/PeaZip-128.png',
  'Prism Launcher':'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/prismlauncher.svg',
  'Slack':'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/slack.svg',
  'PuTTY':'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/putty.svg',
  'WinSCP':'https://www.google.com/s2/favicons?domain_url=https%3A%2F%2Fwinscp.net&sz=128',
  'PowerToys':'https://www.google.com/s2/favicons?domain_url=https%3A%2F%2Flearn.microsoft.com%2Fwindows%2Fpowertoys&sz=128',
  'Everything':'https://www.google.com/s2/favicons?domain_url=https%3A%2F%2Fvoidtools.com&sz=128',
  'WizTree':'https://www.google.com/s2/favicons?domain_url=https%3A%2F%2Fdiskanalyzer.com&sz=128',
  'MiniTool Partition Wizard':'https://www.google.com/s2/favicons?domain_url=https%3A%2F%2Fpartitionwizard.com&sz=128',
  'HWiNFO':'https://www.google.com/s2/favicons?domain_url=https%3A%2F%2Fhwinfo.com&sz=128',
  'CPU-Z':'https://www.google.com/s2/favicons?domain_url=https%3A%2F%2Fcpuid.com&sz=128',
  'CrystalDiskInfo':'https://www.google.com/s2/favicons?domain_url=https%3A%2F%2Fcrystalmark.info&sz=128',
  'Visual C++ Redistributable 2015–2022 x64':'https://www.google.com/s2/favicons?domain_url=https%3A%2F%2Flearn.microsoft.com&sz=128',
  '.NET Desktop Runtime 8':'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/dotnet.svg'
};

function stableIconFor(app){
  if (exactIconUrls[app.name]) return exactIconUrls[app.name];
  const slug = simpleIconSlugs[app.name];
  if (slug) return `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`;
  const host = String(app.domain || '').replace(/^https?:\/\//,'').split('/')[0];
  return host ? `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(`https://${host}`)}&sz=128` : '';
}

for (const app of apps) app.logo = stableIconFor(app);

// Replace the old renderer. If a remote source fails, the image is removed completely,
// so the user never sees the ugly browser "broken image" icon.
logoMarkup = function(app){
  const fallback = (app.name.match(/[A-Za-z0-9]/g) || ['A']).slice(0,2).join('').toUpperCase();
  const src = stableIconFor(app);
  if (!src) return `<span class="logo-fallback always">${fallback}</span>`;
  return `<img src="${src}" alt="${app.name} icon" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.remove();const f=this.parentElement.querySelector('.logo-fallback');if(f)f.style.display='grid'"><span class="logo-fallback">${fallback}</span>`;
};

renderApps();
updateSelectionBar();