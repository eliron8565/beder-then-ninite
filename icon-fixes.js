// Prefer product logos over generic website favicons.
const appIconSlugs = {
  'Google Chrome':'googlechrome','Mozilla Firefox':'firefoxbrowser','Microsoft Edge':'microsoftedge','Brave':'brave','Opera':'opera','Vivaldi':'vivaldi',
  'Discord':'discord','Telegram':'telegram','Slack':'slack','Zoom':'zoom','Microsoft Teams':'microsoftteams',
  'Steam':'steam','Epic Games Launcher':'epicgames','Prism Launcher':'prismlauncher','Heroic Games Launcher':'heroicgameslauncher',
  'VLC media player':'vlcmediaplayer','Spotify':'spotify','OBS Studio':'obsstudio','Audacity':'audacity','HandBrake':'handbrake',
  'Visual Studio Code':'visualstudiocode','Git':'git','GitHub Desktop':'github','Python 3':'python','Node.js LTS':'nodedotjs','Docker Desktop':'docker','Postman':'postman','PyCharm Community':'pycharm','IntelliJ IDEA Community':'intellijidea','Notepad++':'notepadplusplus','Cisco Packet Tracer':'cisco','Blockbench':'blockbench',
  'LibreOffice':'libreoffice','Obsidian':'obsidian','Thunderbird':'thunderbird',
  'Krita':'krita','GIMP':'gimp','Blender':'blender','Inkscape':'inkscape','ShareX':'sharex',
  '7-Zip':'7zip','PeaZip':'peazip','WinRAR':'winrar','qBittorrent':'qbittorrent','FileZilla':'filezilla','WinSCP':'winscp',
  'Bitwarden':'bitwarden','KeePassXC':'keepassxc','Malwarebytes':'malwarebytes',
  'PowerToys':'windows','Everything':'windows','Rufus':'rufus','balenaEtcher':'balenaetcher','AnyDesk':'anydesk','TeamViewer':'teamviewer','PuTTY':'putty','RustDesk':'rustdesk',
  'Java 21 (Temurin JDK)':'eclipseadoptium','Java 17 (Temurin JDK)':'eclipseadoptium',
  'NVIDIA Graphics Drivers':'nvidia','NVIDIA App':'nvidia','AMD Radeon Drivers':'amd','AMD Software: Adrenalin Edition':'amd'
};

for (const app of apps) {
  const slug = appIconSlugs[app.name];
  if (slug) app.logo = `https://cdn.simpleicons.org/${slug}`;
}

// A few products are not in Simple Icons; use a more specific official-site favicon for them.
const specificFavicons = {
  'WizTree':'diskanalyzer.com','MiniTool Partition Wizard':'partitionwizard.com','HWiNFO':'hwinfo.com','CPU-Z':'cpuid.com','CrystalDiskInfo':'crystalmark.info',
  'Visual C++ Redistributable 2015–2022 x64':'microsoft.com','.NET Desktop Runtime 8':'dotnet.microsoft.com'
};
for (const app of apps) if (specificFavicons[app.name]) app.logo = fav(specificFavicons[app.name]);

renderApps();
updateSelectionBar();