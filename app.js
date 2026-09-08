const apps = [
  {name:'Google Chrome',id:'Google.Chrome',category:'Browsers',icon:'🌐',desc:'Fast browser from Google.',popular:10,tags:['essentials','student']},
  {name:'Mozilla Firefox',id:'Mozilla.Firefox',category:'Browsers',icon:'🦊',desc:'Open-source privacy-friendly browser.',popular:9,tags:['essentials']},
  {name:'Brave',id:'Brave.Brave',category:'Browsers',icon:'🦁',desc:'Privacy-focused Chromium browser.',popular:8,tags:[]},
  {name:'Vivaldi',id:'Vivaldi.Vivaldi',category:'Browsers',icon:'🧭',desc:'Highly customizable browser.',popular:6,tags:[]},
  {name:'Opera',id:'Opera.Opera',category:'Browsers',icon:'⭕',desc:'Feature-rich Chromium browser.',popular:6,tags:[]},

  {name:'Discord',id:'Discord.Discord',category:'Messaging',icon:'💬',desc:'Voice, video and text chat.',popular:10,tags:['essentials','gaming']},
  {name:'Telegram Desktop',id:'Telegram.TelegramDesktop',category:'Messaging',icon:'✈️',desc:'Fast cross-platform messaging.',popular:8,tags:['essentials']},
  {name:'WhatsApp',id:'WhatsApp.WhatsApp',category:'Messaging',icon:'🟢',desc:'WhatsApp desktop client.',popular:8,tags:[]},
  {name:'Zoom',id:'Zoom.Zoom',category:'Messaging',icon:'📹',desc:'Video meetings and calls.',popular:7,tags:['student']},
  {name:'Slack',id:'SlackTechnologies.Slack',category:'Messaging',icon:'🗨️',desc:'Team communication and workspaces.',popular:6,tags:['developer']},

  {name:'Steam',id:'Valve.Steam',category:'Gaming',icon:'🎮',desc:'PC game storefront and launcher.',popular:10,tags:['gaming']},
  {name:'Epic Games Launcher',id:'EpicGames.EpicGamesLauncher',category:'Gaming',icon:'🕹️',desc:'Epic Games store and launcher.',popular:9,tags:['gaming']},
  {name:'GOG Galaxy',id:'GOG.Galaxy',category:'Gaming',icon:'🌌',desc:'GOG library and launcher.',popular:6,tags:['gaming']},
  {name:'EA app',id:'ElectronicArts.EADesktop',category:'Gaming',icon:'🎯',desc:'EA games launcher.',popular:7,tags:['gaming']},
  {name:'Ubisoft Connect',id:'Ubisoft.Connect',category:'Gaming',icon:'🌀',desc:'Ubisoft games launcher.',popular:6,tags:['gaming']},
  {name:'Prism Launcher',id:'PrismLauncher.PrismLauncher',category:'Gaming',icon:'🧱',desc:'Open-source Minecraft launcher.',popular:7,tags:['gaming']},
  {name:'Playnite',id:'Playnite.Playnite',category:'Gaming',icon:'🗂️',desc:'Unified game library manager.',popular:6,tags:['gaming']},

  {name:'7-Zip',id:'7zip.7zip',category:'Utilities',icon:'📦',desc:'Lightweight archive manager.',popular:10,tags:['essentials','developer','student']},
  {name:'WinRAR',id:'RARLab.WinRAR',category:'Utilities',icon:'🗜️',desc:'Popular archive utility.',popular:7,tags:[]},
  {name:'Everything',id:'voidtools.Everything',category:'Utilities',icon:'🔎',desc:'Instant Windows file search.',popular:9,tags:['essentials']},
  {name:'PowerToys',id:'Microsoft.PowerToys',category:'Utilities',icon:'🧰',desc:'Advanced Windows utilities.',popular:9,tags:['essentials','developer']},
  {name:'ShareX',id:'ShareX.ShareX',category:'Utilities',icon:'📸',desc:'Screenshot, capture and upload toolkit.',popular:8,tags:['creator','developer']},
  {name:'Rufus',id:'Rufus.Rufus',category:'Utilities',icon:'💾',desc:'Create bootable USB drives.',popular:8,tags:['developer']},
  {name:'WizTree',id:'AntibodySoftware.WizTree',category:'Utilities',icon:'🌳',desc:'Fast disk space analyzer.',popular:7,tags:[]},
  {name:'CPU-Z',id:'CPUID.CPU-Z',category:'Utilities',icon:'🧠',desc:'CPU and hardware information.',popular:7,tags:[]},
  {name:'HWiNFO',id:'REALiX.HWiNFO',category:'Utilities',icon:'📊',desc:'Detailed hardware monitoring.',popular:7,tags:[]},
  {name:'CrystalDiskInfo',id:'CrystalDewWorld.CrystalDiskInfo',category:'Utilities',icon:'💽',desc:'SSD and hard drive health monitor.',popular:7,tags:[]},
  {name:'CrystalDiskMark',id:'CrystalDewWorld.CrystalDiskMark',category:'Utilities',icon:'⚡',desc:'Disk benchmark utility.',popular:6,tags:[]},

  {name:'VLC media player',id:'VideoLAN.VLC',category:'Media',icon:'🎬',desc:'Play almost any audio or video format.',popular:10,tags:['essentials','student']},
  {name:'Spotify',id:'Spotify.Spotify',category:'Media',icon:'🎵',desc:'Music and podcast streaming.',popular:9,tags:['essentials']},
  {name:'OBS Studio',id:'OBSProject.OBSStudio',category:'Media',icon:'🎥',desc:'Recording and live streaming toolkit.',popular:9,tags:['creator','gaming']},
  {name:'Audacity',id:'Audacity.Audacity',category:'Media',icon:'🎙️',desc:'Audio recording and editing.',popular:7,tags:['creator']},
  {name:'HandBrake',id:'HandBrake.HandBrake',category:'Media',icon:'🎞️',desc:'Video transcoder and converter.',popular:7,tags:['creator']},
  {name:'Krita',id:'KDE.Krita',category:'Media',icon:'🎨',desc:'Digital painting and illustration.',popular:7,tags:['creator']},
  {name:'GIMP',id:'GIMP.GIMP.3',category:'Media',icon:'🖼️',desc:'Open-source image editor.',popular:7,tags:['creator']},
  {name:'Blender',id:'BlenderFoundation.Blender',category:'Media',icon:'🧊',desc:'3D creation suite.',popular:8,tags:['creator']},

  {name:'Visual Studio Code',id:'Microsoft.VisualStudioCode',category:'Development',icon:'💻',desc:'Popular source-code editor.',popular:10,tags:['developer']},
  {name:'Git',id:'Git.Git',category:'Development',icon:'🔧',desc:'Distributed version control.',popular:10,tags:['developer']},
  {name:'GitHub Desktop',id:'GitHub.GitHubDesktop',category:'Development',icon:'🐙',desc:'Desktop client for GitHub.',popular:8,tags:['developer']},
  {name:'Python 3',id:'Python.Python.3.13',category:'Development',icon:'🐍',desc:'Python programming language.',popular:9,tags:['developer','student']},
  {name:'Node.js LTS',id:'OpenJS.NodeJS.LTS',category:'Development',icon:'🟢',desc:'JavaScript runtime.',popular:9,tags:['developer']},
  {name:'Docker Desktop',id:'Docker.DockerDesktop',category:'Development',icon:'🐳',desc:'Containers and local development.',popular:8,tags:['developer']},
  {name:'Postman',id:'Postman.Postman',category:'Development',icon:'📮',desc:'API development and testing.',popular:8,tags:['developer']},
  {name:'Windows Terminal',id:'Microsoft.WindowsTerminal',category:'Development',icon:'⌨️',desc:'Modern Windows terminal.',popular:9,tags:['developer']},
  {name:'Notepad++',id:'Notepad++.Notepad++',category:'Development',icon:'📝',desc:'Fast text and source editor.',popular:9,tags:['developer','essentials']},
  {name:'PuTTY',id:'PuTTY.PuTTY',category:'Development',icon:'🔐',desc:'SSH and terminal client.',popular:6,tags:['developer']},
  {name:'WinSCP',id:'WinSCP.WinSCP',category:'Development',icon:'📁',desc:'SFTP and FTP client.',popular:7,tags:['developer']},

  {name:'LibreOffice',id:'TheDocumentFoundation.LibreOffice',category:'Office',icon:'📄',desc:'Free open-source office suite.',popular:9,tags:['student','essentials']},
  {name:'Obsidian',id:'Obsidian.Obsidian',category:'Office',icon:'💎',desc:'Markdown notes and knowledge base.',popular:8,tags:['student','developer']},
  {name:'Notion',id:'Notion.Notion',category:'Office',icon:'◼️',desc:'Notes, docs and workspace.',popular:8,tags:['student']},
  {name:'SumatraPDF',id:'SumatraPDF.SumatraPDF',category:'Office',icon:'📕',desc:'Lightweight PDF and ebook reader.',popular:8,tags:['student','essentials']},
  {name:'Thunderbird',id:'Mozilla.Thunderbird',category:'Office',icon:'📧',desc:'Open-source email client.',popular:7,tags:[]},

  {name:'qBittorrent',id:'qBittorrent.qBittorrent',category:'Internet',icon:'🧲',desc:'Open-source BitTorrent client.',popular:8,tags:[]},
  {name:'FileZilla',id:'TimKosse.FileZilla.Client',category:'Internet',icon:'🌍',desc:'FTP and SFTP client.',popular:6,tags:['developer']},
  {name:'Tailscale',id:'Tailscale.Tailscale',category:'Internet',icon:'🔗',desc:'Simple mesh VPN.',popular:7,tags:['developer']},
  {name:'Cloudflare WARP',id:'Cloudflare.Warp',category:'Internet',icon:'☁️',desc:'Cloudflare network client.',popular:7,tags:[]},

  {name:'Bitwarden',id:'Bitwarden.Bitwarden',category:'Security',icon:'🔒',desc:'Open-source password manager.',popular:9,tags:['essentials','student','developer']},
  {name:'KeePassXC',id:'KeePassXCTeam.KeePassXC',category:'Security',icon:'🗝️',desc:'Offline password manager.',popular:7,tags:[]},
  {name:'Malwarebytes',id:'Malwarebytes.Malwarebytes',category:'Security',icon:'🛡️',desc:'Malware scanning and cleanup.',popular:8,tags:[]},

  {name:'AnyDesk',id:'AnyDeskSoftwareGmbH.AnyDesk',category:'Remote Access',icon:'🖥️',desc:'Remote desktop software.',popular:7,tags:[]},
  {name:'RustDesk',id:'RustDesk.RustDesk',category:'Remote Access',icon:'🦀',desc:'Open-source remote desktop.',popular:7,tags:['developer']},

  {name:'Google Drive',id:'Google.GoogleDrive',category:'Cloud',icon:'☁️',desc:'Google Drive desktop sync.',popular:8,tags:['student']},
  {name:'Dropbox',id:'Dropbox.Dropbox',category:'Cloud',icon:'📦',desc:'Cloud file sync and sharing.',popular:7,tags:[]},
  {name:'OneDrive',id:'Microsoft.OneDrive',category:'Cloud',icon:'🌤️',desc:'Microsoft cloud sync client.',popular:7,tags:[]}
];

const selected = new Set(JSON.parse(localStorage.getItem('appforge-selected') || '[]'));
let activeCategory = 'all';
let activeTab = 'powershell';

const $ = s => document.querySelector(s);
const catalog = $('#catalog');
const searchInput = $('#searchInput');
const categoryNav = $('#categoryNav');
const selectionBar = $('#selectionBar');
const selectionCount = $('#selectionCount');
const selectionNames = $('#selectionNames');
const reviewDialog = $('#reviewDialog');
const commandOutput = $('#commandOutput');
const sortSelect = $('#sortSelect');

const categoryIcons = {Browsers:'🌐',Messaging:'💬',Gaming:'🎮',Utilities:'🧰',Media:'🎬',Development:'💻',Office:'📄',Internet:'🌍',Security:'🛡️','Remote Access':'🖥️',Cloud:'☁️'};
const categories = [...new Set(apps.map(a => a.category))].sort();

$('#appTotal').textContent = apps.length;
$('#categoryTotal').textContent = categories.length;
$('#allCount').textContent = apps.length;

function saveSelection(){ localStorage.setItem('appforge-selected', JSON.stringify([...selected])); }

function renderCategoryNav(){
  categoryNav.innerHTML = categories.map(cat => {
    const count = apps.filter(a => a.category === cat).length;
    return `<button class="category-link" data-category="${cat}"><span>${categoryIcons[cat] || '•'} ${cat}</span><span>${count}</span></button>`;
  }).join('');
  document.querySelectorAll('.category-link').forEach(btn => btn.addEventListener('click', () => {
    activeCategory = btn.dataset.category;
    document.querySelectorAll('.category-link').forEach(x => x.classList.toggle('active', x.dataset.category === activeCategory));
    $('#catalogTitle').textContent = activeCategory === 'all' ? 'All apps' : activeCategory;
    renderApps();
  }));
}

function filteredApps(){
  const q = searchInput.value.trim().toLowerCase();
  let list = apps.filter(a => (activeCategory === 'all' || a.category === activeCategory) && (!q || `${a.name} ${a.desc} ${a.category}`.toLowerCase().includes(q)));
  const sort = sortSelect.value;
  list.sort((a,b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'category' ? (a.category.localeCompare(b.category) || a.name.localeCompare(b.name)) : ((b.popular||0)-(a.popular||0) || a.name.localeCompare(b.name)));
  return list;
}

function renderApps(){
  const list = filteredApps();
  $('#emptyState').classList.toggle('hidden', list.length > 0);
  catalog.innerHTML = list.map(app => `
    <label class="app-row ${selected.has(app.id) ? 'selected' : ''}">
      <input type="checkbox" data-id="${app.id}" ${selected.has(app.id) ? 'checked' : ''}>
      <span class="app-icon">${app.icon}</span>
      <span class="app-info"><strong>${app.name}</strong><small>${app.desc}</small></span>
      <span class="app-category">${app.category}</span>
      ${app.popular >= 9 ? '<span class="popular-badge">Popular</span>' : ''}
    </label>`).join('');
  catalog.querySelectorAll('input[type="checkbox"]').forEach(input => input.addEventListener('change', () => toggleApp(input.dataset.id)));
}

function toggleApp(id){
  selected.has(id) ? selected.delete(id) : selected.add(id);
  saveSelection();
  renderApps();
  updateSelectionBar();
}

function updateSelectionBar(){
  const chosen = apps.filter(a => selected.has(a.id));
  selectionCount.textContent = `${chosen.length} app${chosen.length === 1 ? '' : 's'} selected`;
  selectionNames.textContent = chosen.length ? chosen.slice(0,4).map(a=>a.name).join(', ') + (chosen.length > 4 ? ` +${chosen.length-4} more` : '') : 'Choose apps to build your installer.';
  selectionBar.classList.toggle('hidden', chosen.length === 0);
}

function applyPreset(tag){
  apps.filter(a => a.tags.includes(tag)).forEach(a => selected.add(a.id));
  saveSelection(); renderApps(); updateSelectionBar();
}

document.querySelectorAll('.preset-btn[data-preset]').forEach(btn => btn.addEventListener('click', () => applyPreset(btn.dataset.preset)));
$('#clearSelection').addEventListener('click', () => { selected.clear(); saveSelection(); renderApps(); updateSelectionBar(); });
searchInput.addEventListener('input', renderApps);
sortSelect.addEventListener('change', renderApps);

function selectedApps(){ return apps.filter(a => selected.has(a.id)); }

function buildCommands(shell='powershell'){
  const isUpgrade = $('#upgradeMode').checked;
  const silent = $('#silentMode').checked;
  const verb = isUpgrade ? 'upgrade' : 'install';
  const flags = `-e --accept-package-agreements --accept-source-agreements${silent ? ' --silent' : ''}`;
  const lines = selectedApps().map(a => `winget ${verb} --id ${a.id} ${flags}`);
  if(shell === 'cmd') return ['@echo off','title AppForge Installer','echo Installing selected applications...','',...lines,'','echo.','echo AppForge finished.','pause'].join('\n');
  return ['$ErrorActionPreference = "Continue"','Write-Host "AppForge installer started" -ForegroundColor Cyan','',...lines,'','Write-Host "AppForge finished" -ForegroundColor Green'].join('\n');
}

function refreshDialog(){
  $('#selectedList').innerHTML = selectedApps().map(a => `<div><span>${a.icon}</span><strong>${a.name}</strong><small>${a.id}</small></div>`).join('');
  commandOutput.textContent = buildCommands(activeTab);
}

$('#reviewButton').addEventListener('click', () => { refreshDialog(); reviewDialog.showModal(); });
$('#dialogClose').addEventListener('click', () => reviewDialog.close());
$('#silentMode').addEventListener('change', refreshDialog);
$('#upgradeMode').addEventListener('change', refreshDialog);

document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => {
  activeTab = btn.dataset.tab;
  document.querySelectorAll('.tab-btn').forEach(x => x.classList.toggle('active', x === btn));
  refreshDialog();
}));

$('#copyCommand').addEventListener('click', async () => {
  await navigator.clipboard.writeText(commandOutput.textContent);
  const b = $('#copyCommand'); const old = b.textContent; b.textContent = 'Copied ✓'; setTimeout(()=>b.textContent=old,1200);
});

function downloadText(filename, content){
  const blob = new Blob([content], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
$('#downloadPs1').addEventListener('click', () => downloadText('AppForge-Installer.ps1', buildCommands('powershell')));
$('#downloadCmd').addEventListener('click', () => downloadText('AppForge-Installer.cmd', buildCommands('cmd')));

$('#themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('appforge-theme', document.body.classList.contains('light') ? 'light' : 'dark');
});
if(localStorage.getItem('appforge-theme') === 'light') document.body.classList.add('light');

renderCategoryNav(); renderApps(); updateSelectionBar();