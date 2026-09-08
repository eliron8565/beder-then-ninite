const icon = slug => `https://cdn.simpleicons.org/${slug}`;

const apps = [
  {name:'Google Chrome',id:'Google.Chrome',category:'Browsers',logo:icon('googlechrome'),desc:'Fast browser from Google.',popular:10,tags:['essentials','student']},
  {name:'Mozilla Firefox',id:'Mozilla.Firefox',category:'Browsers',logo:icon('firefoxbrowser'),desc:'Open-source privacy-focused browser.',popular:9,tags:['essentials']},
  {name:'Brave',id:'Brave.Brave',category:'Browsers',logo:icon('brave'),desc:'Privacy-first Chromium browser.',popular:8,tags:[]},
  {name:'Vivaldi',id:'Vivaldi.Vivaldi',category:'Browsers',logo:icon('vivaldi'),desc:'Highly customizable browser.',popular:7,tags:[]},
  {name:'Opera',id:'Opera.Opera',category:'Browsers',logo:icon('opera'),desc:'Feature-rich Chromium browser.',popular:7,tags:[]},

  {name:'Discord',id:'Discord.Discord',category:'Messaging',logo:icon('discord'),desc:'Voice, video and text chat.',popular:10,tags:['essentials','gaming']},
  {name:'Telegram Desktop',id:'Telegram.TelegramDesktop',category:'Messaging',logo:icon('telegram'),desc:'Fast cross-platform messaging.',popular:8,tags:['essentials']},
  {name:'WhatsApp',id:'WhatsApp.WhatsApp',category:'Messaging',logo:icon('whatsapp'),desc:'WhatsApp desktop client.',popular:8,tags:[]},
  {name:'Zoom',id:'Zoom.Zoom',category:'Messaging',logo:icon('zoom'),desc:'Video meetings and calls.',popular:7,tags:['student']},
  {name:'Slack',id:'SlackTechnologies.Slack',category:'Messaging',logo:icon('slack'),desc:'Team communication and workspaces.',popular:7,tags:['developer']},

  {name:'Steam',id:'Valve.Steam',category:'Gaming',logo:icon('steam'),desc:'PC games storefront and launcher.',popular:10,tags:['gaming']},
  {name:'Epic Games Launcher',id:'EpicGames.EpicGamesLauncher',category:'Gaming',logo:icon('epicgames'),desc:'Epic Games store and launcher.',popular:9,tags:['gaming']},
  {name:'GOG Galaxy',id:'GOG.Galaxy',category:'Gaming',logo:icon('gogdotcom'),desc:'GOG game library and launcher.',popular:7,tags:['gaming']},
  {name:'EA app',id:'ElectronicArts.EADesktop',category:'Gaming',logo:icon('ea'),desc:'EA games launcher.',popular:7,tags:['gaming']},
  {name:'Ubisoft Connect',id:'Ubisoft.Connect',category:'Gaming',logo:icon('ubisoft'),desc:'Ubisoft games launcher.',popular:7,tags:['gaming']},
  {name:'Prism Launcher',id:'PrismLauncher.PrismLauncher',category:'Gaming',logo:icon('prismlauncher'),desc:'Open-source Minecraft launcher.',popular:8,tags:['gaming']},
  {name:'Playnite',id:'Playnite.Playnite',category:'Gaming',logo:icon('playnite'),desc:'Unified game library manager.',popular:7,tags:['gaming']},

  {name:'7-Zip',id:'7zip.7zip',category:'Utilities',logo:icon('7zip'),desc:'Lightweight archive manager.',popular:10,tags:['essentials','developer','student']},
  {name:'WinRAR',id:'RARLab.WinRAR',category:'Utilities',logo:icon('winrar'),desc:'Popular archive utility.',popular:7,tags:[]},
  {name:'Everything',id:'voidtools.Everything',category:'Utilities',fallback:'EV',desc:'Instant Windows file search.',popular:9,tags:['essentials']},
  {name:'PowerToys',id:'Microsoft.PowerToys',category:'Utilities',logo:icon('windows11'),desc:'Advanced Windows utilities.',popular:9,tags:['essentials','developer']},
  {name:'ShareX',id:'ShareX.ShareX',category:'Utilities',logo:icon('sharex'),desc:'Screenshot, capture and upload toolkit.',popular:8,tags:['creator','developer']},
  {name:'Rufus',id:'Rufus.Rufus',category:'Utilities',logo:icon('rufus'),desc:'Create bootable USB drives.',popular:8,tags:['developer']},
  {name:'WizTree',id:'AntibodySoftware.WizTree',category:'Utilities',fallback:'WZ',desc:'Fast disk space analyzer.',popular:7,tags:[]},
  {name:'CPU-Z',id:'CPUID.CPU-Z',category:'Utilities',fallback:'CPU',desc:'CPU and hardware information.',popular:7,tags:[]},
  {name:'HWiNFO',id:'REALiX.HWiNFO',category:'Utilities',fallback:'HW',desc:'Detailed hardware monitoring.',popular:8,tags:[]},
  {name:'CrystalDiskInfo',id:'CrystalDewWorld.CrystalDiskInfo',category:'Utilities',fallback:'CDI',desc:'SSD and HDD health monitor.',popular:7,tags:[]},
  {name:'CrystalDiskMark',id:'CrystalDewWorld.CrystalDiskMark',category:'Utilities',fallback:'CDM',desc:'Disk benchmark utility.',popular:7,tags:[]},

  {name:'VLC media player',id:'VideoLAN.VLC',category:'Media',logo:icon('vlcmediaplayer'),desc:'Play almost any audio or video format.',popular:10,tags:['essentials','student']},
  {name:'Spotify',id:'Spotify.Spotify',category:'Media',logo:icon('spotify'),desc:'Music and podcast streaming.',popular:9,tags:['essentials']},
  {name:'OBS Studio',id:'OBSProject.OBSStudio',category:'Media',logo:icon('obsstudio'),desc:'Recording and live streaming toolkit.',popular:9,tags:['creator','gaming']},
  {name:'Audacity',id:'Audacity.Audacity',category:'Media',logo:icon('audacity'),desc:'Audio recording and editing.',popular:7,tags:['creator']},
  {name:'HandBrake',id:'HandBrake.HandBrake',category:'Media',logo:icon('handbrake'),desc:'Video transcoder and converter.',popular:7,tags:['creator']},
  {name:'Krita',id:'KDE.Krita',category:'Media',logo:icon('krita'),desc:'Digital painting and illustration.',popular:7,tags:['creator']},
  {name:'GIMP',id:'GIMP.GIMP.3',category:'Media',logo:icon('gimp'),desc:'Open-source image editor.',popular:7,tags:['creator']},
  {name:'Blender',id:'BlenderFoundation.Blender',category:'Media',logo:icon('blender'),desc:'Professional 3D creation suite.',popular:8,tags:['creator']},

  {name:'Visual Studio Code',id:'Microsoft.VisualStudioCode',category:'Development',logo:icon('visualstudiocode'),desc:'Popular source-code editor.',popular:10,tags:['developer']},
  {name:'Git',id:'Git.Git',category:'Development',logo:icon('git'),desc:'Distributed version control.',popular:10,tags:['developer']},
  {name:'GitHub Desktop',id:'GitHub.GitHubDesktop',category:'Development',logo:icon('github'),desc:'Desktop client for GitHub.',popular:8,tags:['developer']},
  {name:'Python 3',id:'Python.Python.3.13',category:'Development',logo:icon('python'),desc:'Python programming language.',popular:9,tags:['developer','student']},
  {name:'Node.js LTS',id:'OpenJS.NodeJS.LTS',category:'Development',logo:icon('nodedotjs'),desc:'JavaScript runtime.',popular:9,tags:['developer']},
  {name:'Docker Desktop',id:'Docker.DockerDesktop',category:'Development',logo:icon('docker'),desc:'Containers and local development.',popular:8,tags:['developer']},
  {name:'Postman',id:'Postman.Postman',category:'Development',logo:icon('postman'),desc:'API development and testing.',popular:8,tags:['developer']},
  {name:'Windows Terminal',id:'Microsoft.WindowsTerminal',category:'Development',logo:icon('windowsterminal'),desc:'Modern Windows terminal.',popular:9,tags:['developer']},
  {name:'Notepad++',id:'Notepad++.Notepad++',category:'Development',logo:icon('notepadplusplus'),desc:'Fast text and source editor.',popular:9,tags:['developer','essentials']},
  {name:'PuTTY',id:'PuTTY.PuTTY',category:'Development',logo:icon('putty'),desc:'SSH and terminal client.',popular:6,tags:['developer']},
  {name:'WinSCP',id:'WinSCP.WinSCP',category:'Development',logo:icon('winscp'),desc:'SFTP and FTP client.',popular:7,tags:['developer']},

  {name:'LibreOffice',id:'TheDocumentFoundation.LibreOffice',category:'Office',logo:icon('libreoffice'),desc:'Free open-source office suite.',popular:9,tags:['student','essentials']},
  {name:'Obsidian',id:'Obsidian.Obsidian',category:'Office',logo:icon('obsidian'),desc:'Markdown notes and knowledge base.',popular:8,tags:['student','developer']},
  {name:'Notion',id:'Notion.Notion',category:'Office',logo:icon('notion'),desc:'Notes, docs and workspace.',popular:8,tags:['student']},
  {name:'SumatraPDF',id:'SumatraPDF.SumatraPDF',category:'Office',fallback:'PDF',desc:'Lightweight PDF and ebook reader.',popular:8,tags:['student','essentials']},
  {name:'Thunderbird',id:'Mozilla.Thunderbird',category:'Office',logo:icon('thunderbird'),desc:'Open-source email client.',popular:7,tags:[]},

  {name:'qBittorrent',id:'qBittorrent.qBittorrent',category:'Internet',logo:icon('qbittorrent'),desc:'Open-source BitTorrent client.',popular:8,tags:[]},
  {name:'FileZilla',id:'TimKosse.FileZilla.Client',category:'Internet',logo:icon('filezilla'),desc:'FTP and SFTP client.',popular:7,tags:['developer']},
  {name:'Tailscale',id:'Tailscale.Tailscale',category:'Internet',logo:icon('tailscale'),desc:'Simple mesh VPN.',popular:8,tags:['developer']},
  {name:'Cloudflare WARP',id:'Cloudflare.Warp',category:'Internet',logo:icon('cloudflare'),desc:'Cloudflare network client.',popular:7,tags:[]},

  {name:'Bitwarden',id:'Bitwarden.Bitwarden',category:'Security',logo:icon('bitwarden'),desc:'Open-source password manager.',popular:9,tags:['essentials','student','developer']},
  {name:'KeePassXC',id:'KeePassXCTeam.KeePassXC',category:'Security',logo:icon('keepassxc'),desc:'Offline password manager.',popular:7,tags:[]},
  {name:'Malwarebytes',id:'Malwarebytes.Malwarebytes',category:'Security',logo:icon('malwarebytes'),desc:'Malware scanning and cleanup.',popular:8,tags:[]},

  {name:'AnyDesk',id:'AnyDeskSoftwareGmbH.AnyDesk',category:'Remote Access',logo:icon('anydesk'),desc:'Remote desktop software.',popular:7,tags:[]},
  {name:'RustDesk',id:'RustDesk.RustDesk',category:'Remote Access',logo:icon('rustdesk'),desc:'Open-source remote desktop.',popular:8,tags:['developer']},

  {name:'Google Drive',id:'Google.GoogleDrive',category:'Cloud',logo:icon('googledrive'),desc:'Google Drive desktop sync.',popular:8,tags:['student']},
  {name:'Dropbox',id:'Dropbox.Dropbox',category:'Cloud',logo:icon('dropbox'),desc:'Cloud file sync and sharing.',popular:7,tags:[]},
  {name:'OneDrive',id:'Microsoft.OneDrive',category:'Cloud',logo:icon('microsoftonedrive'),desc:'Microsoft cloud sync client.',popular:7,tags:[]}
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

const categoryIcons = {Browsers:'🌐',Messaging:'💬',Gaming:'🎮',Utilities:'🧰',Media:'🎬',Development:'⌨️',Office:'📚',Internet:'🌍',Security:'🛡️','Remote Access':'🖥️',Cloud:'☁️'};
const categories = [...new Set(apps.map(a => a.category))].sort();
$('#appTotal').textContent = apps.length;
$('#categoryTotal').textContent = categories.length;
$('#allCount').textContent = apps.length;

function saveSelection(){ localStorage.setItem('appforge-selected', JSON.stringify([...selected])); }
function logoMarkup(app){
  if(app.logo) return `<img src="${app.logo}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"> <span class="logo-fallback">${app.fallback || app.name.slice(0,2).toUpperCase()}</span>`;
  return `<span class="logo-fallback always">${app.fallback || app.name.slice(0,2).toUpperCase()}</span>`;
}

function renderCategoryNav(){
  categoryNav.innerHTML = categories.map(cat => `<button class="category-link" data-category="${cat}"><span><b class="category-emoji">${categoryIcons[cat] || '•'}</b>${cat}</span><span class="category-count">${apps.filter(a=>a.category===cat).length}</span></button>`).join('');
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
  catalog.innerHTML = list.map(app => `<label class="app-row ${selected.has(app.id) ? 'selected' : ''}">
    <input type="checkbox" data-id="${app.id}" ${selected.has(app.id) ? 'checked' : ''}>
    <span class="app-icon">${logoMarkup(app)}</span>
    <span class="app-info"><strong>${app.name}</strong><small>${app.desc}</small></span>
    <span class="app-category">${app.category}</span>
    ${app.popular >= 9 ? '<span class="popular-badge">Popular</span>' : ''}
    <span class="select-indicator">✓</span>
  </label>`).join('');
  catalog.querySelectorAll('input[type="checkbox"]').forEach(input => input.addEventListener('change', () => toggleApp(input.dataset.id)));
}

function toggleApp(id){ selected.has(id) ? selected.delete(id) : selected.add(id); saveSelection(); renderApps(); updateSelectionBar(); }
function updateSelectionBar(){
  const chosen = apps.filter(a => selected.has(a.id));
  selectionCount.textContent = `${chosen.length} app${chosen.length === 1 ? '' : 's'} selected`;
  selectionNames.textContent = chosen.length ? chosen.slice(0,4).map(a=>a.name).join(', ') + (chosen.length > 4 ? ` +${chosen.length-4} more` : '') : 'Choose apps to build your installer.';
  selectionBar.classList.toggle('hidden', chosen.length === 0);
}
function applyPreset(tag){ apps.filter(a => a.tags.includes(tag)).forEach(a => selected.add(a.id)); saveSelection(); renderApps(); updateSelectionBar(); }

document.querySelectorAll('.preset-btn[data-preset]').forEach(btn => btn.addEventListener('click', () => applyPreset(btn.dataset.preset)));
$('#clearSelection').addEventListener('click', () => { selected.clear(); saveSelection(); renderApps(); updateSelectionBar(); });
searchInput.addEventListener('input', renderApps);
sortSelect.addEventListener('change', renderApps);

function buildCommand(shell='powershell'){
  const mode = $('#upgradeMode').checked ? 'upgrade' : 'install';
  const silent = $('#silentMode').checked ? ' --silent' : '';
  const commands = apps.filter(a=>selected.has(a.id)).map(a => `winget ${mode} --id ${a.id} -e${silent} --accept-package-agreements --accept-source-agreements`);
  return shell === 'cmd' ? commands.join(' && ^\n') : commands.join('; `\n');
}
function refreshCommand(){ commandOutput.textContent = buildCommand(activeTab); }
function openReview(){
  const chosen = apps.filter(a=>selected.has(a.id));
  $('#selectedList').innerHTML = chosen.map(a=>`<div class="selected-pill"><span class="mini-logo">${logoMarkup(a)}</span><span>${a.name}</span></div>`).join('');
  refreshCommand(); reviewDialog.showModal();
}
$('#reviewButton').addEventListener('click', openReview);
$('#dialogClose').addEventListener('click', ()=>reviewDialog.close());
reviewDialog.addEventListener('click', e=>{ if(e.target === reviewDialog) reviewDialog.close(); });
$('#silentMode').addEventListener('change', refreshCommand);
$('#upgradeMode').addEventListener('change', refreshCommand);
document.querySelectorAll('.tab-btn').forEach(btn=>btn.addEventListener('click',()=>{
  activeTab = btn.dataset.tab;
  document.querySelectorAll('.tab-btn').forEach(x=>x.classList.toggle('active',x===btn));
  refreshCommand();
}));
$('#copyCommand').addEventListener('click', async ()=>{
  await navigator.clipboard.writeText(commandOutput.textContent);
  const btn=$('#copyCommand'); const old=btn.textContent; btn.textContent='Copied ✓'; setTimeout(()=>btn.textContent=old,1300);
});
function download(filename,text){ const blob=new Blob([text],{type:'text/plain'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); setTimeout(()=>URL.revokeObjectURL(url),500); }
$('#downloadPs1').addEventListener('click',()=>download('AppForge-Installer.ps1', buildCommand('powershell')));
$('#downloadCmd').addEventListener('click',()=>download('AppForge-Installer.cmd', '@echo off\r\n'+buildCommand('cmd')+'\r\npause'));
$('#themeToggle').addEventListener('click',()=>{ document.body.classList.toggle('light'); localStorage.setItem('appforge-theme',document.body.classList.contains('light')?'light':'dark'); });
if(localStorage.getItem('appforge-theme')==='light') document.body.classList.add('light');

renderCategoryNav(); renderApps(); updateSelectionBar();