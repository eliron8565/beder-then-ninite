const apps = [
  {name:'Google Chrome', id:'Google.Chrome', category:'Browsers', icon:'🌐', desc:'Fast browser from Google.', popular:true},
  {name:'Mozilla Firefox', id:'Mozilla.Firefox', category:'Browsers', icon:'🦊', desc:'Open-source privacy-friendly browser.', popular:true},
  {name:'Brave', id:'Brave.Brave', category:'Browsers', icon:'🦁', desc:'Privacy-focused Chromium browser.'},
  {name:'Discord', id:'Discord.Discord', category:'Communication', icon:'💬', desc:'Voice, video and text chat.', popular:true},
  {name:'Telegram Desktop', id:'Telegram.TelegramDesktop', category:'Communication', icon:'✈️', desc:'Fast cross-platform messaging.'},
  {name:'Zoom', id:'Zoom.Zoom', category:'Communication', icon:'📹', desc:'Video meetings and calls.'},
  {name:'Steam', id:'Valve.Steam', category:'Gaming', icon:'🎮', desc:'PC games storefront and launcher.', popular:true},
  {name:'Epic Games Launcher', id:'EpicGames.EpicGamesLauncher', category:'Gaming', icon:'🕹️', desc:'Epic Games store and launcher.'},
  {name:'GOG Galaxy', id:'GOG.Galaxy', category:'Gaming', icon:'🌌', desc:'GOG game library and launcher.'},
  {name:'7-Zip', id:'7zip.7zip', category:'Utilities', icon:'📦', desc:'Lightweight archive manager.', popular:true},
  {name:'VLC media player', id:'VideoLAN.VLC', category:'Media', icon:'🎬', desc:'Play almost any audio or video format.', popular:true},
  {name:'Spotify', id:'Spotify.Spotify', category:'Media', icon:'🎵', desc:'Music and podcast streaming.'},
  {name:'OBS Studio', id:'OBSProject.OBSStudio', category:'Media', icon:'🎥', desc:'Recording and live streaming toolkit.'},
  {name:'Visual Studio Code', id:'Microsoft.VisualStudioCode', category:'Development', icon:'💻', desc:'Popular code editor from Microsoft.', popular:true},
  {name:'Git', id:'Git.Git', category:'Development', icon:'🔧', desc:'Distributed version control system.'},
  {name:'Python', id:'Python.Python.3.13', category:'Development', icon:'🐍', desc:'Python programming language.'},
  {name:'Node.js LTS', id:'OpenJS.NodeJS.LTS', category:'Development', icon:'🟢', desc:'JavaScript runtime for development.'},
  {name:'Notepad++', id:'Notepad++.Notepad++', category:'Productivity', icon:'📝', desc:'Fast text and source editor.'},
  {name:'LibreOffice', id:'TheDocumentFoundation.LibreOffice', category:'Productivity', icon:'📄', desc:'Free open-source office suite.'},
  {name:'Everything', id:'voidtools.Everything', category:'Utilities', icon:'🔎', desc:'Instant Windows file search.'},
  {name:'PowerToys', id:'Microsoft.PowerToys', category:'Utilities', icon:'🧰', desc:'Advanced utilities for Windows power users.'},
  {name:'ShareX', id:'ShareX.ShareX', category:'Utilities', icon:'📸', desc:'Powerful screenshot and capture tool.'},
  {name:'qBittorrent', id:'qBittorrent.qBittorrent', category:'Internet', icon:'🧲', desc:'Open-source BitTorrent client.'},
  {name:'WinSCP', id:'WinSCP.WinSCP', category:'Internet', icon:'📁', desc:'SFTP and FTP client for Windows.'}
];

const selected = new Set();
const appGrid = document.querySelector('#appGrid');
const searchInput = document.querySelector('#searchInput');
const categoryFilter = document.querySelector('#categoryFilter');
const selectionBar = document.querySelector('#selectionBar');
const selectionCount = document.querySelector('#selectionCount');
const clearSelection = document.querySelector('#clearSelection');
const generateButton = document.querySelector('#generateButton');
const commandDialog = document.querySelector('#commandDialog');
const commandOutput = document.querySelector('#commandOutput');
const copyCommand = document.querySelector('#copyCommand');
const selectPopular = document.querySelector('#selectPopular');
const themeToggle = document.querySelector('#themeToggle');

[...new Set(apps.map(a => a.category))].sort().forEach(category => {
  const option = document.createElement('option');
  option.value = category;
  option.textContent = category;
  categoryFilter.appendChild(option);
});

function renderApps() {
  const q = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const filtered = apps.filter(app => {
    const matchesSearch = !q || `${app.name} ${app.desc} ${app.category}`.toLowerCase().includes(q);
    const matchesCategory = category === 'all' || app.category === category;
    return matchesSearch && matchesCategory;
  });

  appGrid.innerHTML = '';
  if (!filtered.length) {
    appGrid.innerHTML = '<div class="empty-state">No apps found. Try another search or category.</div>';
    return;
  }

  filtered.forEach(app => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `app-card ${selected.has(app.id) ? 'selected' : ''}`;
    card.setAttribute('aria-pressed', selected.has(app.id));
    card.innerHTML = `
      <div class="app-card-top">
        <div class="app-icon">${app.icon}</div>
        <div class="check">✓</div>
      </div>
      <h3>${app.name}</h3>
      <p>${app.desc}</p>
      <div class="app-meta"><span>${app.category}</span><span>Winget</span></div>
    `;
    card.addEventListener('click', () => toggleApp(app.id));
    appGrid.appendChild(card);
  });
}

function toggleApp(id) {
  selected.has(id) ? selected.delete(id) : selected.add(id);
  renderApps();
  updateSelectionBar();
}

function updateSelectionBar() {
  const count = selected.size;
  selectionCount.textContent = `${count} app${count === 1 ? '' : 's'} selected`;
  selectionBar.classList.toggle('hidden', count === 0);
}

searchInput.addEventListener('input', renderApps);
categoryFilter.addEventListener('change', renderApps);
clearSelection.addEventListener('click', () => {
  selected.clear();
  renderApps();
  updateSelectionBar();
});

selectPopular.addEventListener('click', () => {
  apps.filter(app => app.popular).forEach(app => selected.add(app.id));
  renderApps();
  updateSelectionBar();
  document.querySelector('#apps').scrollIntoView({behavior:'smooth'});
});

generateButton.addEventListener('click', () => {
  const commands = [...selected].map(id => `winget install --id ${id} -e --accept-package-agreements --accept-source-agreements`);
  commandOutput.textContent = commands.join(' && \\n');
  commandDialog.showModal();
});

copyCommand.addEventListener('click', async () => {
  await navigator.clipboard.writeText(commandOutput.textContent);
  const old = copyCommand.textContent;
  copyCommand.textContent = 'Copied ✓';
  setTimeout(() => copyCommand.textContent = old, 1300);
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('appforge-theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

if (localStorage.getItem('appforge-theme') === 'light') document.body.classList.add('light');
renderApps();
updateSelectionBar();
