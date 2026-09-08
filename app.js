const fav = domain => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

const apps = [
  {name:'Google Chrome',category:'Web Browsers',domain:'google.com',popular:10,tags:['essentials','student'],pkg:{windows:'Google.Chrome',linux:'com.google.Chrome',mac:{type:'cask',id:'google-chrome'}}},
  {name:'Mozilla Firefox',category:'Web Browsers',domain:'mozilla.org',popular:10,tags:['essentials'],pkg:{windows:'Mozilla.Firefox',linux:'org.mozilla.firefox',mac:{type:'cask',id:'firefox'}}},
  {name:'Microsoft Edge',category:'Web Browsers',domain:'microsoft.com/edge',popular:9,tags:['essentials'],pkg:{windows:'Microsoft.Edge'}},
  {name:'Brave',category:'Web Browsers',domain:'brave.com',popular:9,tags:['essentials'],pkg:{windows:'Brave.Brave',linux:'com.brave.Browser',mac:{type:'cask',id:'brave-browser'}}},
  {name:'Opera',category:'Web Browsers',domain:'opera.com',popular:8,tags:[],pkg:{windows:'Opera.Opera',mac:{type:'cask',id:'opera'}}},
  {name:'Vivaldi',category:'Web Browsers',domain:'vivaldi.com',popular:8,tags:[],pkg:{windows:'Vivaldi.Vivaldi',linux:'com.vivaldi.Vivaldi',mac:{type:'cask',id:'vivaldi'}}},
  {name:'Discord',category:'Messaging',domain:'discord.com',popular:10,tags:['essentials','gaming'],pkg:{windows:'Discord.Discord',linux:'com.discordapp.Discord',mac:{type:'cask',id:'discord'}}},
  {name:'Telegram',category:'Messaging',domain:'telegram.org',popular:9,tags:['essentials'],pkg:{windows:'Telegram.TelegramDesktop',linux:'org.telegram.desktop',mac:{type:'cask',id:'telegram'}}},
  {name:'Slack',category:'Messaging',domain:'slack.com',popular:8,tags:['developer'],pkg:{windows:'SlackTechnologies.Slack',linux:'com.slack.Slack',mac:{type:'cask',id:'slack'}}},
  {name:'Zoom',category:'Messaging',domain:'zoom.us',popular:9,tags:['student'],pkg:{windows:'Zoom.Zoom',linux:'us.zoom.Zoom',mac:{type:'cask',id:'zoom'}}},
  {name:'Microsoft Teams',category:'Messaging',domain:'microsoft.com/microsoft-teams',popular:8,tags:['student'],pkg:{windows:'Microsoft.Teams',mac:{type:'cask',id:'microsoft-teams'}}},
  {name:'Steam',category:'Gaming',domain:'steampowered.com',popular:10,tags:['gaming'],pkg:{windows:'Valve.Steam',linux:'com.valvesoftware.Steam',mac:{type:'cask',id:'steam'}}},
  {name:'Epic Games Launcher',category:'Gaming',domain:'epicgames.com',popular:9,tags:['gaming'],pkg:{windows:'EpicGames.EpicGamesLauncher'}},
  {name:'Prism Launcher',category:'Gaming',domain:'prismlauncher.org',popular:8,tags:['gaming'],pkg:{windows:'PrismLauncher.PrismLauncher',linux:'org.prismlauncher.PrismLauncher',mac:{type:'cask',id:'prismlauncher'}}},
  {name:'Heroic Games Launcher',category:'Gaming',domain:'heroicgameslauncher.com',popular:8,tags:['gaming'],pkg:{windows:'HeroicGamesLauncher.HeroicGamesLauncher',linux:'com.heroicgameslauncher.hgl',mac:{type:'cask',id:'heroic'}}},
  {name:'VLC media player',category:'Media',domain:'videolan.org',popular:10,tags:['essentials','student'],pkg:{windows:'VideoLAN.VLC',linux:'org.videolan.VLC',mac:{type:'cask',id:'vlc'}}},
  {name:'Spotify',category:'Media',domain:'spotify.com',popular:10,tags:['essentials'],pkg:{windows:'Spotify.Spotify',linux:'com.spotify.Client',mac:{type:'cask',id:'spotify'}}},
  {name:'OBS Studio',category:'Media',domain:'obsproject.com',popular:9,tags:['creator','gaming'],pkg:{windows:'OBSProject.OBSStudio',linux:'com.obsproject.Studio',mac:{type:'cask',id:'obs'}}},
  {name:'Audacity',category:'Media',domain:'audacityteam.org',popular:8,tags:['creator'],pkg:{windows:'Audacity.Audacity',linux:'org.audacityteam.Audacity',mac:{type:'cask',id:'audacity'}}},
  {name:'HandBrake',category:'Media',domain:'handbrake.fr',popular:8,tags:['creator'],pkg:{windows:'HandBrake.HandBrake',linux:'fr.handbrake.ghb',mac:{type:'cask',id:'handbrake-app'}}},
  {name:'Visual Studio Code',category:'Development',domain:'code.visualstudio.com',popular:10,tags:['developer','student'],pkg:{windows:'Microsoft.VisualStudioCode',linux:'com.visualstudio.code',mac:{type:'cask',id:'visual-studio-code'}}},
  {name:'Git',category:'Development',domain:'git-scm.com',popular:10,tags:['developer'],pkg:{windows:'Git.Git',mac:{type:'formula',id:'git'}}},
  {name:'GitHub Desktop',category:'Development',domain:'desktop.github.com',popular:8,tags:['developer'],pkg:{windows:'GitHub.GitHubDesktop',mac:{type:'cask',id:'github'}}},
  {name:'Python 3',category:'Development',domain:'python.org',popular:10,tags:['developer','student'],pkg:{windows:'Python.Python.3.13',mac:{type:'formula',id:'python'}}},
  {name:'Node.js LTS',category:'Development',domain:'nodejs.org',popular:9,tags:['developer'],pkg:{windows:'OpenJS.NodeJS.LTS',mac:{type:'formula',id:'node'}}},
  {name:'Docker Desktop',category:'Development',domain:'docker.com',popular:9,tags:['developer'],pkg:{windows:'Docker.DockerDesktop',mac:{type:'cask',id:'docker'}}},
  {name:'Postman',category:'Development',domain:'postman.com',popular:8,tags:['developer'],pkg:{windows:'Postman.Postman',linux:'com.getpostman.Postman',mac:{type:'cask',id:'postman'}}},
  {name:'PyCharm Community',category:'Development',domain:'jetbrains.com/pycharm',popular:9,tags:['developer','student'],pkg:{windows:'JetBrains.PyCharm.Community',mac:{type:'cask',id:'pycharm-ce'}}},
  {name:'IntelliJ IDEA Community',category:'Development',domain:'jetbrains.com/idea',popular:9,tags:['developer','student'],pkg:{windows:'JetBrains.IntelliJIDEA.Community',mac:{type:'cask',id:'intellij-idea-ce'}}},
  {name:'Notepad++',category:'Development',domain:'notepad-plus-plus.org',popular:9,tags:['developer','essentials'],pkg:{windows:'Notepad++.Notepad++'}},
  {name:'Cisco Packet Tracer',category:'Development',domain:'cisco.com',popular:8,tags:['developer','student'],pkg:{windows:'url:https://www.netacad.com/learning-collections/cisco-packet-tracer'}},
  {name:'Blockbench',category:'Development',domain:'blockbench.net',popular:8,tags:['developer','creator','gaming'],pkg:{windows:'JannisX11.Blockbench',linux:'net.blockbench.Blockbench',mac:{type:'cask',id:'blockbench'}}},
  {name:'LibreOffice',category:'Documents & Office',domain:'libreoffice.org',popular:9,tags:['student','essentials'],pkg:{windows:'TheDocumentFoundation.LibreOffice',linux:'org.libreoffice.LibreOffice',mac:{type:'cask',id:'libreoffice'}}},
  {name:'Obsidian',category:'Documents & Office',domain:'obsidian.md',popular:9,tags:['student','developer'],pkg:{windows:'Obsidian.Obsidian',linux:'md.obsidian.Obsidian',mac:{type:'cask',id:'obsidian'}}},
  {name:'Thunderbird',category:'Documents & Office',domain:'thunderbird.net',popular:8,tags:['student'],pkg:{windows:'Mozilla.Thunderbird',linux:'org.mozilla.Thunderbird',mac:{type:'cask',id:'thunderbird'}}},
  {name:'Krita',category:'Design & Imaging',domain:'krita.org',popular:8,tags:['creator'],pkg:{windows:'KDE.Krita',linux:'org.kde.krita',mac:{type:'cask',id:'krita'}}},
  {name:'GIMP',category:'Design & Imaging',domain:'gimp.org',popular:9,tags:['creator'],pkg:{windows:'GIMP.GIMP.3',linux:'org.gimp.GIMP',mac:{type:'cask',id:'gimp'}}},
  {name:'Blender',category:'Design & Imaging',domain:'blender.org',popular:9,tags:['creator'],pkg:{windows:'BlenderFoundation.Blender',linux:'org.blender.Blender',mac:{type:'cask',id:'blender'}}},
  {name:'Inkscape',category:'Design & Imaging',domain:'inkscape.org',popular:8,tags:['creator'],pkg:{windows:'Inkscape.Inkscape',linux:'org.inkscape.Inkscape',mac:{type:'cask',id:'inkscape'}}},
  {name:'ShareX',category:'Design & Imaging',domain:'getsharex.com',popular:8,tags:['creator','essentials'],pkg:{windows:'ShareX.ShareX'}},
  {name:'7-Zip',category:'Compression',domain:'7-zip.org',popular:10,tags:['essentials','developer','student'],pkg:{windows:'7zip.7zip',mac:{type:'formula',id:'sevenzip'}}},
  {name:'PeaZip',category:'Compression',domain:'peazip.github.io',popular:8,tags:['essentials'],pkg:{windows:'Giorgiotani.Peazip'}},
  {name:'WinRAR',category:'Compression',domain:'rarlab.com',popular:9,tags:['essentials'],pkg:{windows:'RARLab.WinRAR'}},
  {name:'qBittorrent',category:'File Sharing',domain:'qbittorrent.org',popular:9,tags:[],pkg:{windows:'qBittorrent.qBittorrent',linux:'org.qbittorrent.qBittorrent',mac:{type:'cask',id:'qbittorrent'}}},
  {name:'FileZilla',category:'File Sharing',domain:'filezilla-project.org',popular:8,tags:['developer'],pkg:{windows:'TimKosse.FileZilla.Client',linux:'org.filezillaproject.Filezilla',mac:{type:'cask',id:'filezilla'}}},
  {name:'WinSCP',category:'File Sharing',domain:'winscp.net',popular:8,tags:['developer'],pkg:{windows:'WinSCP.WinSCP'}},
  {name:'Bitwarden',category:'Security',domain:'bitwarden.com',popular:9,tags:['essentials','student','developer'],pkg:{windows:'Bitwarden.Bitwarden',linux:'com.bitwarden.desktop',mac:{type:'cask',id:'bitwarden'}}},
  {name:'KeePassXC',category:'Security',domain:'keepassxc.org',popular:8,tags:['essentials'],pkg:{windows:'KeePassXCTeam.KeePassXC',linux:'org.keepassxc.KeePassXC',mac:{type:'cask',id:'keepassxc'}}},
  {name:'Malwarebytes',category:'Security',domain:'malwarebytes.com',popular:8,tags:['essentials'],pkg:{windows:'Malwarebytes.Malwarebytes'}},
  {name:'PowerToys',category:'Utilities',domain:'learn.microsoft.com/windows/powertoys',popular:10,tags:['essentials','developer'],pkg:{windows:'Microsoft.PowerToys'}},
  {name:'Everything',category:'Utilities',domain:'voidtools.com',popular:9,tags:['essentials'],pkg:{windows:'voidtools.Everything'}},
  {name:'WizTree',category:'Utilities',domain:'diskanalyzer.com',popular:9,tags:['essentials'],pkg:{windows:'AntibodySoftware.WizTree'}},
  {name:'Rufus',category:'Utilities',domain:'rufus.ie',popular:9,tags:['essentials'],pkg:{windows:'Rufus.Rufus'}},
  {name:'balenaEtcher',category:'Utilities',domain:'etcher.balena.io',popular:8,tags:['essentials','developer'],pkg:{windows:'Balena.Etcher',mac:{type:'cask',id:'balenaetcher'}}},
  {name:'MiniTool Partition Wizard',category:'Utilities',domain:'partitionwizard.com',popular:8,tags:['essentials'],pkg:{windows:'MiniTool.PartitionWizard.Free'}},
  {name:'HWiNFO',category:'Utilities',domain:'hwinfo.com',popular:8,tags:['essentials'],pkg:{windows:'REALiX.HWiNFO'}},
  {name:'CPU-Z',category:'Utilities',domain:'cpuid.com',popular:8,tags:['essentials'],pkg:{windows:'CPUID.CPU-Z'}},
  {name:'CrystalDiskInfo',category:'Utilities',domain:'crystalmark.info',popular:8,tags:['essentials'],pkg:{windows:'CrystalDewWorld.CrystalDiskInfo'}},
  {name:'AnyDesk',category:'Utilities',domain:'anydesk.com',popular:8,tags:['essentials'],pkg:{windows:'AnyDeskSoftwareGmbH.AnyDesk'}},
  {name:'TeamViewer',category:'Utilities',domain:'teamviewer.com',popular:8,tags:['essentials'],pkg:{windows:'TeamViewer.TeamViewer'}},
  {name:'PuTTY',category:'Utilities',domain:'putty.org',popular:8,tags:['developer'],pkg:{windows:'PuTTY.PuTTY'}},
  {name:'RustDesk',category:'Utilities',domain:'rustdesk.com',popular:8,tags:['developer'],pkg:{windows:'RustDesk.RustDesk',linux:'com.rustdesk.RustDesk',mac:{type:'cask',id:'rustdesk'}}},
  {name:'Visual C++ Redistributable 2015–2022 x64',category:'Runtimes',domain:'microsoft.com',popular:9,tags:['gaming','developer','essentials'],pkg:{windows:'Microsoft.VCRedist.2015+.x64'}},
  {name:'.NET Desktop Runtime 8',category:'Runtimes',domain:'dotnet.microsoft.com',popular:9,tags:['gaming','developer'],pkg:{windows:'Microsoft.DotNet.DesktopRuntime.8'}},
  {name:'Java 21 (Temurin JDK)',category:'Runtimes',domain:'adoptium.net',popular:8,tags:['developer','student'],pkg:{windows:'EclipseAdoptium.Temurin.21.JDK'}},
  {name:'Java 17 (Temurin JDK)',category:'Runtimes',domain:'adoptium.net',popular:8,tags:['developer','student'],pkg:{windows:'EclipseAdoptium.Temurin.17.JDK'}},
  {name:'NVIDIA Graphics Drivers',category:'Drivers',domain:'nvidia.com',popular:10,tags:['gaming','drivers'],pkg:{windows:'url:https://www.nvidia.com/Download/index.aspx'}},
  {name:'NVIDIA App',category:'Drivers',domain:'nvidia.com',popular:10,tags:['gaming','drivers'],pkg:{windows:'url:https://www.nvidia.com/en-us/software/nvidia-app/'}},
  {name:'AMD Radeon Drivers',category:'Drivers',domain:'amd.com',popular:10,tags:['gaming','drivers'],pkg:{windows:'url:https://www.amd.com/en/support/download/drivers.html'}},
  {name:'AMD Software: Adrenalin Edition',category:'Drivers',domain:'amd.com',popular:10,tags:['gaming','drivers'],pkg:{windows:'url:https://www.amd.com/en/products/software/adrenalin.html'}}
];

let windowsIndex = 0;
for (const app of apps) {
  app.key = app.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  app.logo = fav(app.domain);
  app.desc = app.desc || `${app.name} — install or open the official installer automatically.`;
  if (app.pkg.windows) app.winIndex = windowsIndex++;
}

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const platformNames = {windows:'Windows', linux:'Linux', mac:'macOS'};
let platform = localStorage.getItem('appforge-platform') || 'windows';
if (!platformNames[platform]) platform = 'windows';
let activeCategory = 'all';
let selected;
try { selected = new Set(JSON.parse(localStorage.getItem('appforge-selected-v2') || '[]')); }
catch { selected = new Set(); }

function availableApps(){ return apps.filter(app => Boolean(app.pkg[platform])); }
function categories(){ return [...new Set(availableApps().map(app => app.category))].sort((a,b)=>a.localeCompare(b)); }
function saveSelection(){ localStorage.setItem('appforge-selected-v2', JSON.stringify([...selected])); }
function logoMarkup(app){
  const fallback = (app.name.match(/[A-Za-z0-9]/g) || ['A']).slice(0,2).join('').toUpperCase();
  return `<img src="${app.logo}" alt="${app.name} icon" loading="lazy" referrerpolicy="no-referrer" onerror="this.hidden=true;this.nextElementSibling.style.display='grid'"><span class="logo-fallback">${fallback}</span>`;
}
function setText(selector, value){ const el=$(selector); if(el) el.textContent=value; }

function renderNav(){
  const nav = $('#categoryNav'); if(!nav) return;
  nav.innerHTML = categories().map(cat => `<button class="category-link ${activeCategory===cat?'active':''}" data-category="${cat}" type="button"><span>${cat}</span><span class="category-count">${availableApps().filter(a=>a.category===cat).length}</span></button>`).join('');
  $$('.category-link').forEach(btn => btn.addEventListener('click', () => {
    activeCategory = btn.dataset.category;
    setText('#catalogTitle', activeCategory === 'all' ? 'All apps' : activeCategory);
    renderNav(); renderApps();
  }));
}
function renderApps(){
  const catalog = $('#catalog'); if(!catalog) return;
  const q = ($('#searchInput')?.value || '').trim().toLowerCase();
  let list = availableApps().filter(app => (activeCategory==='all'||app.category===activeCategory) && (!q || `${app.name} ${app.category} ${app.desc}`.toLowerCase().includes(q)));
  const sort = $('#sortSelect')?.value || 'popular';
  list.sort((a,b)=> sort==='name' ? a.name.localeCompare(b.name) : sort==='category' ? a.category.localeCompare(b.category)||a.name.localeCompare(b.name) : b.popular-a.popular||a.name.localeCompare(b.name));
  $('#emptyState')?.classList.toggle('hidden', list.length > 0);
  catalog.innerHTML = list.map(app => `<label class="app-row ${selected.has(app.key)?'selected':''}"><input type="checkbox" data-key="${app.key}" ${selected.has(app.key)?'checked':''}><span class="app-icon">${logoMarkup(app)}</span><span class="app-info"><strong>${app.name}</strong><small>${app.desc}</small></span><span class="app-category">${app.category}</span>${app.popular>=9?'<span class="popular-badge">Popular</span>':''}<span class="select-indicator">✓</span></label>`).join('');
  $$('#catalog input[type=checkbox]').forEach(input => input.addEventListener('change', () => { selected.has(input.dataset.key) ? selected.delete(input.dataset.key) : selected.add(input.dataset.key); saveSelection(); renderApps(); updateSelectionBar(); }));
}
function updateSelectionBar(){
  const chosen = availableApps().filter(a=>selected.has(a.key));
  setText('#selectionCount', `${chosen.length} app${chosen.length===1?'':'s'} selected`);
  setText('#selectionNames', chosen.length ? chosen.slice(0,5).map(a=>a.name).join(', ') + (chosen.length>5?` +${chosen.length-5} more`:'') : 'Choose apps to build your installer.');
  $('#selectionBar')?.classList.toggle('hidden', chosen.length===0);
}
function updatePlatformUI(){
  $$('.platform-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.platform===platform));
  setText('#platformBadge', platformNames[platform]); setText('#catalogEyebrow', `${platformNames[platform]} catalog`); setText('#appTotal', availableApps().length); setText('#allCount', availableApps().length);
  activeCategory='all'; setText('#catalogTitle','All apps'); renderNav(); renderApps(); updateSelectionBar();
}
function applyPreset(tag){ availableApps().filter(app=>app.tags.includes(tag)).forEach(app=>selected.add(app.key)); saveSelection(); renderApps(); updateSelectionBar(); }
function buildUnixInstaller(){
  const chosen=availableApps().filter(a=>selected.has(a.key));
  if(platform==='linux') return '#!/usr/bin/env bash\nset -e\necho "AppForge Linux Installer"\ncommand -v flatpak >/dev/null 2>&1 || { echo "Flatpak is required."; exit 1; }\nflatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo\n'+chosen.filter(a=>typeof a.pkg.linux==='string').map(a=>`echo "Installing ${a.name}..."\nflatpak install -y flathub "${a.pkg.linux}"`).join('\n')+'\necho "AppForge finished."\n';
  const formulas=chosen.filter(a=>a.pkg.mac?.type==='formula').map(a=>a.pkg.mac.id), casks=chosen.filter(a=>a.pkg.mac?.type==='cask').map(a=>a.pkg.mac.id);
  return '#!/usr/bin/env bash\nset -e\necho "AppForge macOS Installer"\ncommand -v brew >/dev/null 2>&1 || { echo "Homebrew is required."; exit 1; }\n'+(formulas.length?`brew install ${formulas.map(x=>`"${x}"`).join(' ')}\n`:'')+(casks.length?`brew install --cask ${casks.map(x=>`"${x}"`).join(' ')}\n`:'')+'echo "AppForge finished."\n';
}
async function downloadInstaller(){
  const chosen=availableApps().filter(a=>selected.has(a.key)); if(!chosen.length) return;
  const button=$('#downloadScript'), old=button?.textContent; if(button){button.disabled=true;button.textContent='Preparing…';}
  try{
    if(platform==='windows'){
      const response=await fetch(`downloads/AppForge-Windows.exe?v=${Date.now()}`,{cache:'no-store'}); if(!response.ok) throw new Error(`Windows EXE is unavailable (${response.status}).`);
      const blob=await response.blob(); if(blob.size<10000) throw new Error('Windows EXE is not ready yet.');
      const url=URL.createObjectURL(blob), link=document.createElement('a'); link.href=url; link.download=`AppForge-Windows--${chosen.map(a=>a.winIndex).join('.')}.exe`; document.body.appendChild(link); link.click(); link.remove(); setTimeout(()=>URL.revokeObjectURL(url),1500);
    } else {
      const blob=new Blob([buildUnixInstaller()],{type:'text/plain'}), url=URL.createObjectURL(blob), link=document.createElement('a'); link.href=url; link.download=platform==='linux'?'AppForge-Linux-Installer.sh':'AppForge-macOS-Installer.command'; document.body.appendChild(link); link.click(); link.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
  }catch(err){alert(`AppForge: ${err.message}`);} finally{if(button){button.disabled=false;button.textContent=old;}}
}
function reviewBundle(){
  const chosen=availableApps().filter(a=>selected.has(a.key)); if(!chosen.length) return;
  setText('#dialogEyebrow',`Your ${platformNames[platform]} installer`); setText('#dialogIntro',platform==='windows'?`The EXE will open with AppForge GUI and these ${chosen.length} selected apps.`:`AppForge will create one installer file with these ${chosen.length} selected apps.`);
  setText('#platformNote',platform==='windows'?'Apps install through Winget. Driver items open the official NVIDIA/AMD page so AppForge never guesses the wrong GPU driver.':platform==='linux'?'Linux uses Flatpak + Flathub.':'macOS uses Homebrew.');
  const list=$('#selectedList'); if(list) list.innerHTML=chosen.map(a=>`<span class="selected-pill"><span class="mini-logo">${logoMarkup(a)}</span>${a.name}</span>`).join(''); setText('#downloadScript',platform==='windows'?'⬇ Download AppForge EXE':'⬇ Download installer'); $('#reviewDialog')?.showModal();
}

$$('.platform-btn').forEach(btn=>btn.addEventListener('click',()=>{platform=btn.dataset.platform;localStorage.setItem('appforge-platform',platform);updatePlatformUI();}));
$$('.preset-btn[data-preset]').forEach(btn=>btn.addEventListener('click',()=>applyPreset(btn.dataset.preset)));
$('#clearSelection')?.addEventListener('click',()=>{selected.clear();saveSelection();renderApps();updateSelectionBar();});
$('#searchInput')?.addEventListener('input',renderApps); $('#sortSelect')?.addEventListener('change',renderApps); $('#reviewButton')?.addEventListener('click',reviewBundle); $('#dialogClose')?.addEventListener('click',()=>$('#reviewDialog')?.close()); $('#downloadScript')?.addEventListener('click',downloadInstaller);
$('#themeToggle')?.addEventListener('click',()=>{document.body.classList.toggle('light');localStorage.setItem('appforge-theme',document.body.classList.contains('light')?'light':'dark');});
$$('[data-jump-category]').forEach(btn=>btn.addEventListener('click',()=>{ if(platform!=='windows'){platform='windows';localStorage.setItem('appforge-platform',platform);} activeCategory=btn.dataset.jumpCategory; setText('#catalogTitle',activeCategory); $$('.platform-btn').forEach(b=>b.classList.toggle('active',b.dataset.platform===platform)); setText('#platformBadge',platformNames[platform]); setText('#catalogEyebrow',`${platformNames[platform]} catalog`); setText('#appTotal',availableApps().length); setText('#allCount',availableApps().length); renderNav(); renderApps(); document.querySelector('#apps-section')?.scrollIntoView({behavior:'smooth'}); }));
if(localStorage.getItem('appforge-theme')==='light') document.body.classList.add('light');
updatePlatformUI();