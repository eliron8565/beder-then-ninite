const requestedApps = [
  {name:'Cisco Packet Tracer',category:'Education',logo:icon('cisco'),popular:8,tags:['student','developer'],desc:'Cisco network simulation and learning tool.',pkg:{windows:'url:https://www.netacad.com/learning-collections/cisco-packet-tracer'},winIndex:31},
  {name:'PyCharm Community',category:'Development',logo:icon('pycharm'),popular:9,tags:['developer','student'],desc:'JetBrains IDE for Python development.',pkg:{windows:'JetBrains.PyCharm.Community',mac:{type:'cask',id:'pycharm-ce'}},winIndex:32},
  {name:'IntelliJ IDEA Community',category:'Development',logo:icon('intellijidea'),popular:9,tags:['developer','student'],desc:'JetBrains IDE for Java and Kotlin.',pkg:{windows:'JetBrains.IntelliJIDEA.Community',mac:{type:'cask',id:'intellij-idea-ce'}},winIndex:33},
  {name:'Blockbench',category:'Design',logo:icon('blockbench'),popular:8,tags:['creator','gaming'],desc:'3D model and pixel-art editor, popular for Minecraft.',pkg:{windows:'JannisX11.Blockbench',linux:'net.blockbench.Blockbench',mac:{type:'cask',id:'blockbench'}},winIndex:34},
  {name:'balenaEtcher',category:'Utilities',logo:icon('balenaetcher'),popular:8,tags:['essentials','developer'],desc:'Flash OS images to USB drives and SD cards.',pkg:{windows:'Balena.Etcher',mac:{type:'cask',id:'balenaetcher'}},winIndex:35},
  {name:'Rufus',category:'Utilities',logo:icon('rufus'),popular:9,tags:['essentials','developer'],desc:'Create bootable USB drives quickly.',pkg:{windows:'Rufus.Rufus'},winIndex:36},
  {name:'PeaZip',category:'Utilities',logo:icon('peazip'),popular:8,tags:['essentials'],desc:'Free archive manager and file extractor.',pkg:{windows:'Giorgiotani.Peazip'},winIndex:37},
  {name:'WizTree',category:'Utilities',fallback:'WZ',popular:8,tags:['essentials'],desc:'Very fast disk space analyzer.',pkg:{windows:'AntibodySoftware.WizTree'},winIndex:38},
  {name:'WinRAR',category:'Utilities',logo:icon('winrar'),popular:8,tags:['essentials'],desc:'RAR and ZIP archive manager.',pkg:{windows:'RARLab.WinRAR'},winIndex:39},
  {name:'MiniTool Partition Wizard',category:'Utilities',fallback:'MT',popular:7,tags:['essentials'],desc:'Disk and partition management utility.',pkg:{windows:'MiniTool.PartitionWizard.Free'},winIndex:40}
];

for (const app of requestedApps) {
  app.key = app.name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
  if (!apps.some(existing => existing.key === app.key)) apps.push(app);
}

updatePlatformUI();