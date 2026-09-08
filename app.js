const icon = slug => `https://cdn.simpleicons.org/${slug}`;

const apps = [
  {key:'chrome',name:'Google Chrome',category:'Browsers',logo:icon('googlechrome'),desc:'Fast browser from Google.',popular:10,tags:['essentials','student'],pkg:{windows:'Google.Chrome',linux:'com.google.Chrome',mac:{type:'cask',id:'google-chrome'}}},
  {key:'firefox',name:'Mozilla Firefox',category:'Browsers',logo:icon('firefoxbrowser'),desc:'Open-source privacy-focused browser.',popular:10,tags:['essentials'],pkg:{windows:'Mozilla.Firefox',linux:'org.mozilla.firefox',mac:{type:'cask',id:'firefox'}}},
  {key:'brave',name:'Brave',category:'Browsers',logo:icon('brave'),desc:'Privacy-first Chromium browser.',popular:9,tags:['essentials'],pkg:{windows:'Brave.Brave',linux:'com.brave.Browser',mac:{type:'cask',id:'brave-browser'}}},
  {key:'vivaldi',name:'Vivaldi',category:'Browsers',logo:icon('vivaldi'),desc:'Highly customizable browser.',popular:7,tags:[],pkg:{windows:'Vivaldi.Vivaldi',linux:'com.vivaldi.Vivaldi',mac:{type:'cask',id:'vivaldi'}}},

  {key:'discord',name:'Discord',category:'Messaging',logo:icon('discord'),desc:'Voice, video and text chat.',popular:10,tags:['essentials','gaming'],pkg:{windows:'Discord.Discord',linux:'com.discordapp.Discord',mac:{type:'cask',id:'discord'}}},
  {key:'telegram',name:'Telegram Desktop',category:'Messaging',logo:icon('telegram'),desc:'Fast cross-platform messaging.',popular:8,tags:['essentials'],pkg:{windows:'Telegram.TelegramDesktop',linux:'org.telegram.desktop',mac:{type:'cask',id:'telegram'}}},
  {key:'slack',name:'Slack',category:'Messaging',logo:icon('slack'),desc:'Team communication and workspaces.',popular:8,tags:['developer'],pkg:{windows:'SlackTechnologies.Slack',linux:'com.slack.Slack',mac:{type:'cask',id:'slack'}}},
  {key:'zoom',name:'Zoom',category:'Messaging',logo:icon('zoom'),desc:'Video meetings and calls.',popular:7,tags:['student'],pkg:{windows:'Zoom.Zoom',linux:'us.zoom.Zoom',mac:{type:'cask',id:'zoom'}}},

  {key:'steam',name:'Steam',category:'Gaming',logo:icon('steam'),desc:'PC game storefront and launcher.',popular:10,tags:['gaming'],pkg:{windows:'Valve.Steam',linux:'com.valvesoftware.Steam',mac:{type:'cask',id:'steam'}}},
  {key:'prism',name:'Prism Launcher',category:'Gaming',logo:icon('prismlauncher'),desc:'Open-source Minecraft launcher.',popular:8,tags:['gaming'],pkg:{windows:'PrismLauncher.PrismLauncher',linux:'org.prismlauncher.PrismLauncher',mac:{type:'cask',id:'prismlauncher'}}},
  {key:'heroic',name:'Heroic Games Launcher',category:'Gaming',logo:icon('heroicgameslauncher'),desc:'Epic, GOG and Amazon games launcher.',popular:8,tags:['gaming'],pkg:{linux:'com.heroicgameslauncher.hgl',mac:{type:'cask',id:'heroic'}}},
  {key:'lutris',name:'Lutris',category:'Gaming',logo:icon('lutris'),desc:'Open gaming platform for Linux.',popular:8,tags:['gaming'],pkg:{linux:'net.lutris.Lutris'}} ,
  {key:'bottles',name:'Bottles',category:'Gaming',logo:icon('bottles'),desc:'Run Windows apps and games on Linux.',popular:8,tags:['gaming'],pkg:{linux:'com.usebottles.bottles'}},
  {key:'protonup',name:'ProtonUp-Qt',category:'Gaming',fallback:'PU',desc:'Manage Proton-GE and compatibility tools.',popular:7,tags:['gaming'],pkg:{linux:'net.davidotek.pupgui2'}},

  {key:'7zip',name:'7-Zip',category:'Utilities',logo:icon('7zip'),desc:'Lightweight archive manager.',popular:10,tags:['essentials','developer','student'],pkg:{windows:'7zip.7zip',mac:{type:'formula',id:'sevenzip'}}},
  {key:'powertoys',name:'PowerToys',category:'Utilities',logo:icon('windows11'),desc:'Advanced Windows utilities.',popular:9,tags:['essentials','developer'],pkg:{windows:'Microsoft.PowerToys'}},
  {key:'everything',name:'Everything',category:'Utilities',fallback:'EV',desc:'Instant Windows file search.',popular:9,tags:['essentials'],pkg:{windows:'voidtools.Everything'}},
  {key:'sharex',name:'ShareX',category:'Utilities',logo:icon('sharex'),desc:'Screenshot and capture toolkit.',popular:8,tags:['creator','developer'],pkg:{windows:'ShareX.ShareX'}},
  {key:'rufus',name:'Rufus',category:'Utilities',logo:icon('rufus'),desc:'Create bootable USB drives.',popular:8,tags:['developer'],pkg:{windows:'Rufus.Rufus'}},
  {key:'flatseal',name:'Flatseal',category:'Utilities',fallback:'FS',desc:'Manage Flatpak application permissions.',popular:8,tags:['essentials'],pkg:{linux:'com.github.tchx84.Flatseal'}},
  {key:'flameshot',name:'Flameshot',category:'Utilities',logo:icon('flameshot'),desc:'Powerful screenshot utility.',popular:8,tags:['creator'],pkg:{windows:'Flameshot.Flameshot',linux:'org.flameshot.Flameshot',mac:{type:'cask',id:'flameshot'}}},
  {key:'rectangle',name:'Rectangle',category:'Utilities',fallback:'▣',desc:'Window snapping and management for macOS.',popular:9,tags:['essentials'],pkg:{mac:{type:'cask',id:'rectangle'}}},
  {key:'raycast',name:'Raycast',category:'Utilities',logo:icon('raycast'),desc:'Fast launcher and productivity toolbox.',popular:9,tags:['essentials','developer'],pkg:{mac:{type:'cask',id:'raycast'}}},

  {key:'vlc',name:'VLC media player',category:'Media',logo:icon('vlcmediaplayer'),desc:'Play almost any audio or video format.',popular:10,tags:['essentials','student'],pkg:{windows:'VideoLAN.VLC',linux:'org.videolan.VLC',mac:{type:'cask',id:'vlc'}}},
  {key:'spotify',name:'Spotify',category:'Media',logo:icon('spotify'),desc:'Music and podcast streaming.',popular:9,tags:['essentials'],pkg:{windows:'Spotify.Spotify',linux:'com.spotify.Client',mac:{type:'cask',id:'spotify'}}},
  {key:'obs',name:'OBS Studio',category:'Media',logo:icon('obsstudio'),desc:'Recording and live streaming toolkit.',popular:9,tags:['creator','gaming'],pkg:{windows:'OBSProject.OBSStudio',linux:'com.obsproject.Studio',mac:{type:'cask',id:'obs'}}},
  {key:'audacity',name:'Audacity',category:'Media',logo:icon('audacity'),desc:'Audio recording and editing.',popular:7,tags:['creator'],pkg:{windows:'Audacity.Audacity',linux:'org.audacityteam.Audacity',mac:{type:'cask',id:'audacity'}}},
  {key:'handbrake',name:'HandBrake',category:'Media',logo:icon('handbrake'),desc:'Video transcoder and converter.',popular:7,tags:['creator'],pkg:{windows:'HandBrake.HandBrake',linux:'fr.handbrake.ghb',mac:{type:'cask',id:'handbrake-app'}}},
  {key:'krita',name:'Krita',category:'Media',logo:icon('krita'),desc:'Digital painting and illustration.',popular:8,tags:['creator'],pkg:{windows:'KDE.Krita',linux:'org.kde.krita',mac:{type:'cask',id:'krita'}}},
  {key:'gimp',name:'GIMP',category:'Media',logo:icon('gimp'),desc:'Open-source image editor.',popular:8,tags:['creator'],pkg:{windows:'GIMP.GIMP.3',linux:'org.gimp.GIMP',mac:{type:'cask',id:'gimp'}}},
  {key:'blender',name:'Blender',category:'Media',logo:icon('blender'),desc:'Professional 3D creation suite.',popular:9,tags:['creator'],pkg:{windows:'BlenderFoundation.Blender',linux:'org.blender.Blender',mac:{type:'cask',id:'blender'}}},
  {key:'kdenlive',name:'Kdenlive',category:'Media',logo:icon('kdenlive'),desc:'Powerful open-source video editor.',popular:7,tags:['creator'],pkg:{windows:'KDE.Kdenlive',linux:'org.kde.kdenlive',mac:{type:'cask',id:'kdenlive'}}},

  {key:'vscode',name:'Visual Studio Code',category:'Development',logo:icon('visualstudiocode'),desc:'Popular source-code editor.',popular:10,tags:['developer','student'],pkg:{windows:'Microsoft.VisualStudioCode',linux:'com.visualstudio.code',mac:{type:'cask',id:'visual-studio-code'}}},
  {key:'githubdesktop',name:'GitHub Desktop',category:'Development',logo:icon('github'),desc:'Desktop client for GitHub.',popular:8,tags:['developer'],pkg:{windows:'GitHub.GitHubDesktop',mac:{type:'cask',id:'github'}}},
  {key:'postman',name:'Postman',category:'Development',logo:icon('postman'),desc:'API development and testing.',popular:8,tags:['developer'],pkg:{windows:'Postman.Postman',linux:'com.getpostman.Postman',mac:{type:'cask',id:'postman'}}},
  {key:'docker',name:'Docker Desktop',category:'Development',logo:icon('docker'),desc:'Containers and local development.',popular:9,tags:['developer'],pkg:{windows:'Docker.DockerDesktop',mac:{type:'cask',id:'docker'}}},
  {key:'git',name:'Git',category:'Development',logo:icon('git'),desc:'Distributed version control.',popular:10,tags:['developer'],pkg:{windows:'Git.Git',mac:{type:'formula',id:'git'}}},
  {key:'python',name:'Python 3',category:'Development',logo:icon('python'),desc:'Python programming language.',popular:9,tags:['developer','student'],pkg:{windows:'Python.Python.3.13',mac:{type:'formula',id:'python'}}},
  {key:'node',name:'Node.js',category:'Development',logo:icon('nodedotjs'),desc:'JavaScript runtime.',popular:9,tags:['developer'],pkg:{windows:'OpenJS.NodeJS.LTS',mac:{type:'formula',id:'node'}}},
  {key:'iterm',name:'iTerm2',category:'Development',logo:icon('iterm2'),desc:'Advanced terminal emulator for macOS.',popular:9,tags:['developer'],pkg:{mac:{type:'cask',id:'iterm2'}}},

  {key:'libreoffice',name:'LibreOffice',category:'Office',logo:icon('libreoffice'),desc:'Free open-source office suite.',popular:9,tags:['student','essentials'],pkg:{windows:'TheDocumentFoundation.LibreOffice',linux:'org.libreoffice.LibreOffice',mac:{type:'cask',id:'libreoffice'}}},
  {key:'obsidian',name:'Obsidian',category:'Office',logo:icon('obsidian'),desc:'Markdown notes and knowledge base.',popular:9,tags:['student','developer'],pkg:{windows:'Obsidian.Obsidian',linux:'md.obsidian.Obsidian',mac:{type:'cask',id:'obsidian'}}},
  {key:'thunderbird',name:'Thunderbird',category:'Office',logo:icon('thunderbird'),desc:'Open-source email client.',popular:8,tags:['student'],pkg:{windows:'Mozilla.Thunderbird',linux:'org.mozilla.Thunderbird',mac:{type:'cask',id:'thunderbird'}}},

  {key:'qbittorrent',name:'qBittorrent',category:'Internet',logo:icon('qbittorrent'),desc:'Open-source BitTorrent client.',popular:8,tags:[],pkg:{windows:'qBittorrent.qBittorrent',linux:'org.qbittorrent.qBittorrent',mac:{type:'cask',id:'qbittorrent'}}},
  {key:'filezilla',name:'FileZilla',category:'Internet',logo:icon('filezilla'),desc:'FTP and SFTP client.',popular:7,tags:['developer'],pkg:{windows:'TimKosse.FileZilla.Client',linux:'org.filezillaproject.Filezilla',mac:{type:'cask',id:'filezilla'}}},
  {key:'bitwarden',name:'Bitwarden',category:'Security',logo:icon('bitwarden'),desc:'Open-source password manager.',popular:10,tags:['essentials','student','developer'],pkg:{windows:'Bitwarden.Bitwarden',linux:'com.bitwarden.desktop',mac:{type:'cask',id:'bitwarden'}}},
  {key:'keepassxc',name:'KeePassXC',category:'Security',logo:icon('keepassxc'),desc:'Offline password manager.',popular:8,tags:[],pkg:{windows:'KeePassXCTeam.KeePassXC',linux:'org.keepassxc.KeePassXC',mac:{type:'cask',id:'keepassxc'}}},
  {key:'rustdesk',name:'RustDesk',category:'Remote Access',logo:icon('rustdesk'),desc:'Open-source remote desktop.',popular:8,tags:['developer'],pkg:{windows:'RustDesk.RustDesk',linux:'com.rustdesk.RustDesk',mac:{type:'cask',id:'rustdesk'}}}
];

const $ = s => document.querySelector(s);
let platform = localStorage.getItem('appforge-platform') || 'windows';
let activeCategory = 'all';
const selected = new Set(JSON.parse(localStorage.getItem('appforge-selected-v2') || '[]'));
const platformNames = {windows:'Windows',linux:'Linux',mac:'macOS'};
const platformManagers = {windows:'Winget',linux:'Flatpak',mac:'Homebrew'};
const categoryIcons = {Browsers:'🌐',Messaging:'💬',Gaming:'🎮',Utilities:'🧰',Media:'🎬',Development:'⌨️',Office:'📚',Internet:'🌍',Security:'🛡️','Remote Access':'🖥️'};

function availableApps(){ return apps.filter(a => a.pkg[platform]); }
function saveSelection(){ localStorage.setItem('appforge-selected-v2', JSON.stringify([...selected])); }
function logoMarkup(app){
  if(app.logo) return `<img src="${app.logo}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="logo-fallback">${app.fallback || app.name.slice(0,2).toUpperCase()}</span>`;
  return `<span class="logo-fallback always">${app.fallback || app.name.slice(0,2).toUpperCase()}</span>`;
}

function cleanUnsupportedSelection(){
  const allowed = new Set(availableApps().map(a=>a.key));
  [...selected].forEach(key => { if(!allowed.has(key)) selected.delete(key); });
  saveSelection();
}

function updatePlatformUI(){
  document.querySelectorAll('.platform-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.platform === platform));
  $('#platformBadge').textContent = `${platformNames[platform]} · ${platformManagers[platform]}`;
  $('#catalogEyebrow').textContent = `${platformNames[platform]} catalog`;
  cleanUnsupportedSelection();
  activeCategory = 'all';
  $('#catalogTitle').textContent = 'All apps';
  renderCategoryNav();
  renderApps();
  updateSelectionBar();
}

function renderCategoryNav(){
  const list = availableApps();
  const categories = [...new Set(list.map(a=>a.category))].sort();
  $('#appTotal').textContent = list.length;
  $('#categoryTotal').textContent = categories.length;
  $('#allCount').textContent = list.length;
  $('#categoryNav').innerHTML = categories.map(cat => `<button class="category-link" data-category="${cat}" type="button"><span><b class="category-emoji">${categoryIcons[cat] || '•'}</b>${cat}</span><span class="category-count">${list.filter(a=>a.category===cat).length}</span></button>`).join('');
  document.querySelectorAll('.category-link').forEach(btn => btn.addEventListener('click', () => {
    activeCategory = btn.dataset.category;
    document.querySelectorAll('.category-link').forEach(x => x.classList.toggle('active', x.dataset.category === activeCategory));
    $('#catalogTitle').textContent = activeCategory === 'all' ? 'All apps' : activeCategory;
    renderApps();
  }));
  document.querySelector('.category-link[data-category="all"]')?.classList.add('active');
}

function filteredApps(){
  const q = $('#searchInput').value.trim().toLowerCase();
  let list = availableApps().filter(a => (activeCategory === 'all' || a.category === activeCategory) && (!q || `${a.name} ${a.desc} ${a.category}`.toLowerCase().includes(q)));
  const sort = $('#sortSelect').value;
  list.sort((a,b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'category' ? (a.category.localeCompare(b.category) || a.name.localeCompare(b.name)) : ((b.popular||0)-(a.popular||0) || a.name.localeCompare(b.name)));
  return list;
}

function renderApps(){
  const list = filteredApps();
  $('#emptyState').classList.toggle('hidden', list.length > 0);
  $('#catalog').innerHTML = list.map(app => `<label class="app-row ${selected.has(app.key) ? 'selected' : ''}">
    <input type="checkbox" data-key="${app.key}" ${selected.has(app.key) ? 'checked' : ''}>
    <span class="app-icon">${logoMarkup(app)}</span>
    <span class="app-info"><strong>${app.name}</strong><small>${app.desc}</small></span>
    <span class="app-category">${app.category}</span>
    ${app.popular >= 9 ? '<span class="popular-badge">Popular</span>' : ''}
    <span class="select-indicator">✓</span>
  </label>`).join('');
  $('#catalog').querySelectorAll('input[type="checkbox"]').forEach(input => input.addEventListener('change', () => {
    selected.has(input.dataset.key) ? selected.delete(input.dataset.key) : selected.add(input.dataset.key);
    saveSelection(); renderApps(); updateSelectionBar();
  }));
}

function updateSelectionBar(){
  const chosen = availableApps().filter(a => selected.has(a.key));
  $('#selectionCount').textContent = `${chosen.length} app${chosen.length === 1 ? '' : 's'} selected for ${platformNames[platform]}`;
  $('#selectionNames').textContent = chosen.length ? chosen.slice(0,4).map(a=>a.name).join(', ') + (chosen.length > 4 ? ` +${chosen.length-4} more` : '') : 'Choose apps to build your installer.';
  $('#selectionBar').classList.toggle('hidden', chosen.length === 0);
}

function applyPreset(tag){
  availableApps().filter(a => a.tags.includes(tag)).forEach(a => selected.add(a.key));
  saveSelection(); renderApps(); updateSelectionBar();
}

function buildCommand(){
  const chosen = availableApps().filter(a => selected.has(a.key));
  if(platform === 'windows') return chosen.map(a => `winget install --id ${a.pkg.windows} -e --silent --accept-package-agreements --accept-source-agreements`).join('\n');
  if(platform === 'linux') return `# AppForge Linux installer\n# Requires Flatpak + Flathub\n${chosen.map(a => `flatpak install -y flathub ${a.pkg.linux}`).join('\n')}`;
  const formulas = chosen.filter(a => a.pkg.mac.type === 'formula').map(a => a.pkg.mac.id);
  const casks = chosen.filter(a => a.pkg.mac.type === 'cask').map(a => a.pkg.mac.id);
  let out = '# AppForge macOS installer\n# Requires Homebrew\n';
  if(formulas.length) out += `brew install ${formulas.join(' ')}\n`;
  if(casks.length) out += `brew install --cask ${casks.join(' ')}\n`;
  return out.trim();
}

function reviewBundle(){
  const chosen = availableApps().filter(a => selected.has(a.key));
  $('#dialogEyebrow').textContent = `Your ${platformNames[platform]} bundle`;
  $('#dialogIntro').textContent = platform === 'windows' ? 'Run the generated Winget commands in Windows Terminal or PowerShell.' : platform === 'linux' ? 'Run this in a terminal. The Linux bundle uses Flatpak packages from Flathub for broad distro compatibility.' : 'Run this in Terminal. The macOS bundle uses Homebrew formulas and casks.';
  $('#platformNote').textContent = platform === 'linux' ? 'Linux distributions differ, so AppForge uses Flatpak for the Linux catalog instead of assuming apt, dnf or pacman.' : platform === 'mac' ? 'Homebrew must be installed before running this script.' : 'Winget is included with modern Windows 10/11 App Installer.';
  $('#selectedList').innerHTML = chosen.map(a => `<span class="selected-pill"><span class="mini-logo">${logoMarkup(a)}</span>${a.name}</span>`).join('');
  $('#commandOutput').textContent = buildCommand();
  $('#reviewDialog').showModal();
}

function downloadScript(){
  const ext = platform === 'windows' ? 'ps1' : 'sh';
  const header = platform === 'windows' ? '# AppForge Windows installer\n$ErrorActionPreference = "Continue"\n' : '#!/usr/bin/env bash\nset -e\n';
  const blob = new Blob([header + buildCommand() + '\n'], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `AppForge-${platformNames[platform].replace('OS','OS')}-Installer.${ext}`; a.click();
  setTimeout(()=>URL.revokeObjectURL(url),500);
}

document.querySelectorAll('.platform-btn').forEach(btn => btn.addEventListener('click', () => { platform = btn.dataset.platform; localStorage.setItem('appforge-platform', platform); updatePlatformUI(); }));
document.querySelectorAll('.preset-btn[data-preset]').forEach(btn => btn.addEventListener('click', () => applyPreset(btn.dataset.preset)));
$('#clearSelection').addEventListener('click',()=>{ selected.clear(); saveSelection(); renderApps(); updateSelectionBar(); });
$('#searchInput').addEventListener('input',renderApps);
$('#sortSelect').addEventListener('change',renderApps);
$('#reviewButton').addEventListener('click',reviewBundle);
$('#dialogClose').addEventListener('click',()=>$('#reviewDialog').close());
$('#copyCommand').addEventListener('click',async()=>{ await navigator.clipboard.writeText($('#commandOutput').textContent); const b=$('#copyCommand'); const old=b.textContent; b.textContent='Copied ✓'; setTimeout(()=>b.textContent=old,1200); });
$('#downloadScript').addEventListener('click',downloadScript);
$('#themeToggle').addEventListener('click',()=>{ document.body.classList.toggle('light'); localStorage.setItem('appforge-theme',document.body.classList.contains('light')?'light':'dark'); });
if(localStorage.getItem('appforge-theme')==='light') document.body.classList.add('light');

updatePlatformUI();