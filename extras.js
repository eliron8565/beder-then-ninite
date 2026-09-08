const fav = domain => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
const requestedApps = [
  {name:'Cisco Packet Tracer',category:'Education',logo:fav('cisco.com'),popular:8,tags:['student','developer'],desc:'Cisco network simulation and learning tool.',pkg:{windows:'url:https://www.netacad.com/learning-collections/cisco-packet-tracer'},winIndex:31},
  {name:'PyCharm Community',category:'Development',logo:fav('jetbrains.com/pycharm'),popular:9,tags:['developer','student'],desc:'JetBrains IDE for Python development.',pkg:{windows:'JetBrains.PyCharm.Community',mac:{type:'cask',id:'pycharm-ce'}},winIndex:32},
  {name:'IntelliJ IDEA Community',category:'Development',logo:fav('jetbrains.com/idea'),popular:9,tags:['developer','student'],desc:'JetBrains IDE for Java and Kotlin.',pkg:{windows:'JetBrains.IntelliJIDEA.Community',mac:{type:'cask',id:'intellij-idea-ce'}},winIndex:33},
  {name:'Blockbench',category:'Design',logo:fav('blockbench.net'),popular:8,tags:['creator','gaming'],desc:'3D model and pixel-art editor.',pkg:{windows:'JannisX11.Blockbench',linux:'net.blockbench.Blockbench',mac:{type:'cask',id:'blockbench'}},winIndex:34},
  {name:'balenaEtcher',category:'Utilities',logo:fav('etcher.balena.io'),popular:8,tags:['essentials','developer'],desc:'Flash OS images to USB and SD cards.',pkg:{windows:'Balena.Etcher',mac:{type:'cask',id:'balenaetcher'}},winIndex:35},
  {name:'Rufus',category:'Utilities',logo:fav('rufus.ie'),popular:9,tags:['essentials','developer'],desc:'Create bootable USB drives quickly.',pkg:{windows:'Rufus.Rufus'},winIndex:36},
  {name:'PeaZip',category:'Compression',logo:fav('peazip.github.io'),popular:8,tags:['essentials'],desc:'Free archive manager and extractor.',pkg:{windows:'Giorgiotani.Peazip'},winIndex:37},
  {name:'WizTree',category:'Utilities',logo:fav('diskanalyzer.com'),popular:8,tags:['essentials'],desc:'Very fast disk space analyzer.',pkg:{windows:'AntibodySoftware.WizTree'},winIndex:38},
  {name:'WinRAR',category:'Compression',logo:fav('rarlab.com'),popular:8,tags:['essentials'],desc:'RAR and ZIP archive manager.',pkg:{windows:'RARLab.WinRAR'},winIndex:39},
  {name:'MiniTool Partition Wizard',category:'Utilities',logo:fav('partitionwizard.com'),popular:7,tags:['essentials'],desc:'Disk and partition management utility.',pkg:{windows:'MiniTool.PartitionWizard.Free'},winIndex:40},

  {name:'Microsoft Edge',category:'Browsers',logo:fav('microsoft.com/edge'),popular:9,tags:['essentials'],desc:'Microsoft web browser.',pkg:{windows:'Microsoft.Edge'},winIndex:41},
  {name:'Opera',category:'Browsers',logo:fav('opera.com'),popular:8,tags:[],desc:'Feature-rich Chromium browser.',pkg:{windows:'Opera.Opera',mac:{type:'cask',id:'opera'}},winIndex:42},
  {name:'Vivaldi',category:'Browsers',logo:fav('vivaldi.com'),popular:8,tags:[],desc:'Highly customizable web browser.',pkg:{windows:'Vivaldi.Vivaldi',linux:'com.vivaldi.Vivaldi',mac:{type:'cask',id:'vivaldi'}},winIndex:43},
  {name:'Zoom',category:'Messaging',logo:fav('zoom.us'),popular:8,tags:['student'],desc:'Video meetings and collaboration.',pkg:{windows:'Zoom.Zoom',linux:'us.zoom.Zoom',mac:{type:'cask',id:'zoom'}},winIndex:44},
  {name:'Microsoft Teams',category:'Messaging',logo:fav('teams.microsoft.com'),popular:8,tags:['student'],desc:'Chat, calls and meetings.',pkg:{windows:'Microsoft.Teams',mac:{type:'cask',id:'microsoft-teams'}},winIndex:45},
  {name:'FileZilla',category:'Internet',logo:fav('filezilla-project.org'),popular:8,tags:['developer'],desc:'FTP, FTPS and SFTP client.',pkg:{windows:'TimKosse.FileZilla.Client',linux:'org.filezillaproject.Filezilla',mac:{type:'cask',id:'filezilla'}},winIndex:46},
  {name:'Notepad++',category:'Development',logo:fav('notepad-plus-plus.org'),popular:9,tags:['developer','student'],desc:'Fast source code and text editor.',pkg:{windows:'Notepad++.Notepad++'},winIndex:47},
  {name:'WinSCP',category:'Development',logo:fav('winscp.net'),popular:8,tags:['developer'],desc:'SFTP, SCP and FTP client for Windows.',pkg:{windows:'WinSCP.WinSCP'},winIndex:48},
  {name:'PuTTY',category:'Development',logo:fav('putty.org'),popular:8,tags:['developer'],desc:'SSH and Telnet client.',pkg:{windows:'PuTTY.PuTTY'},winIndex:49},
  {name:'AnyDesk',category:'Remote Access',logo:fav('anydesk.com'),popular:8,tags:['essentials'],desc:'Fast remote desktop software.',pkg:{windows:'AnyDeskSoftwareGmbH.AnyDesk',mac:{type:'cask',id:'anydesk'}},winIndex:50},
  {name:'TeamViewer',category:'Remote Access',logo:fav('teamviewer.com'),popular:8,tags:['essentials'],desc:'Remote support and desktop access.',pkg:{windows:'TeamViewer.TeamViewer',mac:{type:'cask',id:'teamviewer'}},winIndex:51},
  {name:'Everything',category:'Utilities',logo:fav('voidtools.com'),popular:9,tags:['essentials'],desc:'Ultra-fast Windows file search.',pkg:{windows:'voidtools.Everything'},winIndex:52},
  {name:'ShareX',category:'Utilities',logo:fav('getsharex.com'),popular:8,tags:['creator'],desc:'Screenshot and screen capture toolkit.',pkg:{windows:'ShareX.ShareX'},winIndex:53},
  {name:'HandBrake',category:'Media',logo:fav('handbrake.fr'),popular:8,tags:['creator'],desc:'Video transcoder and converter.',pkg:{windows:'HandBrake.HandBrake',linux:'fr.handbrake.ghb',mac:{type:'cask',id:'handbrake-app'}},winIndex:54},
  {name:'GitHub Desktop',category:'Development',logo:fav('desktop.github.com'),popular:8,tags:['developer'],desc:'Desktop Git client for GitHub.',pkg:{windows:'GitHub.GitHubDesktop',mac:{type:'cask',id:'github'}},winIndex:55},
  {name:'Inkscape',category:'Design',logo:fav('inkscape.org'),popular:8,tags:['creator'],desc:'Professional vector graphics editor.',pkg:{windows:'Inkscape.Inkscape',linux:'org.inkscape.Inkscape',mac:{type:'cask',id:'inkscape'}},winIndex:56},
  {name:'Malwarebytes',category:'Security',logo:fav('malwarebytes.com'),popular:8,tags:['essentials'],desc:'Malware detection and cleanup.',pkg:{windows:'Malwarebytes.Malwarebytes'},winIndex:57},
  {name:'HWiNFO',category:'System Tools',logo:fav('hwinfo.com'),popular:8,tags:['essentials'],desc:'Detailed hardware information and monitoring.',pkg:{windows:'REALiX.HWiNFO'},winIndex:58},
  {name:'CPU-Z',category:'System Tools',logo:fav('cpuid.com'),popular:8,tags:['essentials'],desc:'CPU and system information utility.',pkg:{windows:'CPUID.CPU-Z'},winIndex:59},
  {name:'CrystalDiskInfo',category:'System Tools',logo:fav('crystalmark.info'),popular:8,tags:['essentials'],desc:'SSD and hard drive health information.',pkg:{windows:'CrystalDewWorld.CrystalDiskInfo'},winIndex:60},
  {name:'PowerToys',category:'Utilities',logo:fav('learn.microsoft.com/windows/powertoys'),popular:9,tags:['essentials','developer'],desc:'Microsoft power-user utilities for Windows.',pkg:{windows:'Microsoft.PowerToys'},winIndex:61},

  {name:'NVIDIA Graphics Drivers',category:'Drivers',logo:fav('nvidia.com'),popular:10,tags:['gaming','essentials'],desc:'Official NVIDIA graphics driver download.',pkg:{windows:'url:https://www.nvidia.com/Download/index.aspx'},winIndex:62},
  {name:'NVIDIA App',category:'Drivers',logo:fav('nvidia.com'),popular:9,tags:['gaming','essentials'],desc:'Official NVIDIA app for drivers and game settings.',pkg:{windows:'url:https://www.nvidia.com/en-us/software/nvidia-app/'},winIndex:63},
  {name:'AMD Radeon Drivers',category:'Drivers',logo:fav('amd.com'),popular:10,tags:['gaming','essentials'],desc:'Official AMD Radeon driver download.',pkg:{windows:'url:https://www.amd.com/en/support/download/drivers.html'},winIndex:64},
  {name:'AMD Software: Adrenalin Edition',category:'Drivers',logo:fav('amd.com'),popular:9,tags:['gaming','essentials'],desc:'Official AMD graphics software and driver suite.',pkg:{windows:'url:https://www.amd.com/en/products/software/adrenalin.html'},winIndex:65}
];

for (const app of requestedApps) {
  app.key = app.name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
  if (!apps.some(existing => existing.key === app.key)) apps.push(app);
}

updatePlatformUI();