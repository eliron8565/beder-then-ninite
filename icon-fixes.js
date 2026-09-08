// AppForge icon system v15 — full-color product icons.
// Simple Icons are intentionally NOT used here: their SVGs are monochrome.

const iconDomains = {
  'Google Chrome':'google.com/chrome','Mozilla Firefox':'mozilla.org/firefox','Microsoft Edge':'microsoft.com/edge','Brave':'brave.com','Opera':'opera.com','Vivaldi':'vivaldi.com',
  'Discord':'discord.com','Telegram':'telegram.org','Slack':'slack.com','Zoom':'zoom.us','Microsoft Teams':'microsoft.com/microsoft-teams',
  'Steam':'steampowered.com','Epic Games Launcher':'epicgames.com','Prism Launcher':'prismlauncher.org','Heroic Games Launcher':'heroicgameslauncher.com',
  'VLC media player':'videolan.org','Spotify':'spotify.com','OBS Studio':'obsproject.com','Audacity':'audacityteam.org','HandBrake':'handbrake.fr',
  'Visual Studio Code':'code.visualstudio.com','Git':'git-scm.com','GitHub Desktop':'desktop.github.com','Python 3':'python.org','Node.js LTS':'nodejs.org','Docker Desktop':'docker.com','Postman':'postman.com','PyCharm Community':'jetbrains.com/pycharm','IntelliJ IDEA Community':'jetbrains.com/idea','Notepad++':'notepad-plus-plus.org','Cisco Packet Tracer':'cisco.com','Blockbench':'blockbench.net',
  'LibreOffice':'libreoffice.org','Obsidian':'obsidian.md','Thunderbird':'thunderbird.net','Krita':'krita.org','GIMP':'gimp.org','Blender':'blender.org','Inkscape':'inkscape.org','ShareX':'getsharex.com',
  '7-Zip':'7-zip.org','PeaZip':'peazip.github.io','WinRAR':'rarlab.com','qBittorrent':'qbittorrent.org','FileZilla':'filezilla-project.org','WinSCP':'winscp.net',
  'Bitwarden':'bitwarden.com','KeePassXC':'keepassxc.org','Malwarebytes':'malwarebytes.com','PowerToys':'learn.microsoft.com/windows/powertoys','Everything':'voidtools.com','WizTree':'diskanalyzer.com','Rufus':'rufus.ie','balenaEtcher':'etcher.balena.io','MiniTool Partition Wizard':'partitionwizard.com','HWiNFO':'hwinfo.com','CPU-Z':'cpuid.com','CrystalDiskInfo':'crystalmark.info','AnyDesk':'anydesk.com','TeamViewer':'teamviewer.com','PuTTY':'putty.org','RustDesk':'rustdesk.com',
  'Visual C++ Redistributable 2015–2022 x64':'microsoft.com','Java 21 (Temurin JDK)':'adoptium.net','Java 17 (Temurin JDK)':'adoptium.net','NVIDIA Graphics Drivers':'nvidia.com','NVIDIA App':'nvidia.com','AMD Radeon Drivers':'amd.com','AMD Software: Adrenalin Edition':'amd.com'
};

const colorIconUrls = {
  'Microsoft Teams':'https://img.icons8.com/color/144/microsoft-teams.png',
  'Slack':'https://img.icons8.com/color/144/slack-new.png',
  'PeaZip':'https://raw.githubusercontent.com/peazip/peazip.github.io/master/PeaZip-128.png',
  'PuTTY':'https://img.icons8.com/color/144/putty.png',
  'Prism Launcher':'https://prismlauncher.org/img/logo-text-darkmode.svg',
  'WinSCP':'https://img.icons8.com/color/144/winscp.png',
  'VLC media player':'https://img.icons8.com/color/144/vlc.png',
  'Visual Studio Code':'https://img.icons8.com/color/144/visual-studio-code-2019.png',
  'Python 3':'https://img.icons8.com/color/144/python--v1.png',
  'Git':'https://img.icons8.com/color/144/git.png',
  'Google Chrome':'https://img.icons8.com/color/144/chrome--v1.png',
  'Mozilla Firefox':'https://img.icons8.com/color/144/firefox.png',
  'Microsoft Edge':'https://img.icons8.com/color/144/ms-edge-new.png',
  'Discord':'https://img.icons8.com/color/144/discord-logo.png',
  'Spotify':'https://img.icons8.com/color/144/spotify--v1.png',
  'Steam':'https://img.icons8.com/color/144/steam.png',
  'Docker Desktop':'https://img.icons8.com/color/144/docker.png',
  'Node.js LTS':'https://img.icons8.com/color/144/nodejs.png',
  'IntelliJ IDEA Community':'https://img.icons8.com/color/144/intellij-idea.png',
  'PyCharm Community':'https://img.icons8.com/color/144/pycharm.png',
  'Postman':'https://img.icons8.com/external-tal-revivo-color-tal-revivo/144/external-postman-is-the-only-complete-api-development-environment-logo-color-tal-revivo.png',
  'NVIDIA Graphics Drivers':'https://img.icons8.com/color/144/nvidia.png',
  'NVIDIA App':'https://img.icons8.com/color/144/nvidia.png',
  'AMD Radeon Drivers':'https://img.icons8.com/color/144/amd.png',
  'AMD Software: Adrenalin Edition':'https://img.icons8.com/color/144/amd.png',
  '7-Zip':'https://img.icons8.com/color/144/7zip.png'
};

function hostFor(app){ return String(iconDomains[app.name] || app.domain || '').replace(/^https?:\/\//,'').split('/')[0]; }
function googleColorIcon(host){ return `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(`https://${host}`)}&sz=256`; }
function duckIcon(host){ return `https://icons.duckduckgo.com/ip3/${host}.ico`; }
function iconSources(app){
  const host=hostFor(app), list=[];
  if(colorIconUrls[app.name]) list.push(colorIconUrls[app.name]);
  if(host){ list.push(googleColorIcon(host)); list.push(duckIcon(host)); }
  return [...new Set(list)];
}

window.appIconFallback=function(img){
  let sources=[]; try{sources=JSON.parse(decodeURIComponent(img.dataset.sources||'[]'));}catch{}
  const next=Number(img.dataset.iconIndex||0)+1;
  if(next<sources.length){img.dataset.iconIndex=String(next);img.src=sources[next];return;}
  img.style.display='none'; const f=img.parentElement?.querySelector('.logo-fallback'); if(f)f.style.display='grid';
};

for(const app of apps){const s=iconSources(app);app.logo=s[0]||'';}
logoMarkup=function(app){
  const fallback=(app.name.match(/[A-Za-z0-9]/g)||['A']).slice(0,2).join('').toUpperCase();
  const sources=iconSources(app); if(!sources.length)return `<span class="logo-fallback always">${fallback}</span>`;
  const packed=encodeURIComponent(JSON.stringify(sources));
  return `<img src="${sources[0]}" data-sources="${packed}" data-icon-index="0" alt="${app.name} icon" loading="lazy" referrerpolicy="no-referrer" onerror="appIconFallback(this)"><span class="logo-fallback">${fallback}</span>`;
};
renderApps();updateSelectionBar();