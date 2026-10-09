// AppForge reliable personalized downloads.
(function () {
  const KEY_MARKER='\nAPPFORGE_KEYS_V1:';

  function saveBlob(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000)}
  async function fetchFile(path){const r=await fetch(`${path}${path.includes('?')?'&':'?'}v=${Date.now()}`,{cache:'no-store'});if(!r.ok)throw new Error(`${path.split('/').pop()} is unavailable (${r.status}).`);return r}

  function windowsIndexes(chosen){return [...new Set(chosen.map(a=>Number(a.winIndex)).filter(i=>Number.isInteger(i)&&i>=0&&i<=143))].sort((a,b)=>a-b)}
  function windowsSelectionToken(chosen){
    const ids=windowsIndexes(chosen);if(!ids.length)throw new Error('Could not prepare the Windows app selection.');
    // 18 bytes = indexes 0..143. No random bytes: every bit is selection data.
    // Variable-length Base64URL bitsets are supported by the installer.
    const bytes=new Uint8Array(18);for(const i of ids)bytes[Math.floor(i/8)]|=1<<(i%8);
    let s='';for(const b of bytes)s+=String.fromCharCode(b);
    return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }
  function windowsName(chosen){return `AppForge-${windowsSelectionToken(chosen)}.exe`}

  function downloadWindows(chosen){
    // Same-origin download keeps the personalized filename without loading/mutating a 70MB EXE in browser memory.
    const a=document.createElement('a');
    a.href=`downloads/AppForge-Windows.exe?v=${Date.now()}`;
    a.download=windowsName(chosen);
    document.body.appendChild(a);a.click();a.remove();
  }

  async function downloadLinux(chosen){const r=await fetchFile('downloads/AppForge-Linux.AppImage');const base=await r.arrayBuffer();if(base.byteLength<10000)throw new Error('Linux AppImage is not ready yet.');const data=new TextEncoder().encode(`${KEY_MARKER}${chosen.map(a=>a.key).join(',')}:END\n`);saveBlob(new Blob([base,data],{type:'application/octet-stream'}),'AppForge-Linux.AppImage')}
  async function downloadMac(chosen){if(typeof JSZip==='undefined')throw new Error('macOS packager did not load. Refresh and try again.');const r=await fetchFile('downloads/AppForge-macOS.zip');const zip=await JSZip.loadAsync(await r.arrayBuffer());const entry=zip.file('AppForge.app/Contents/MacOS/AppForge');if(!entry)throw new Error('macOS app package is invalid.');const binary=await entry.async('uint8array');const marker=new TextEncoder().encode(`${KEY_MARKER}${chosen.map(a=>a.key).join(',')}:END\n`);const combined=new Uint8Array(binary.length+marker.length);combined.set(binary);combined.set(marker,binary.length);zip.file('AppForge.app/Contents/MacOS/AppForge',combined,{binary:true,unixPermissions:0o755});saveBlob(await zip.generateAsync({type:'blob',platform:'UNIX',compression:'DEFLATE'}),'AppForge-macOS.zip')}

  const linuxNative = {
    'vlc-media-player':{apt:'vlc',dnf:'vlc',pacman:'vlc',zypper:'vlc'},
    'mozilla-firefox':{apt:'firefox',dnf:'firefox',pacman:'firefox',zypper:'MozillaFirefox'},
    'git':{apt:'git',dnf:'git',pacman:'git',zypper:'git'},
    'python-3':{apt:'python3',dnf:'python3',pacman:'python',zypper:'python3'},
    'gimp':{apt:'gimp',dnf:'gimp',pacman:'gimp',zypper:'gimp'},
    'blender':{apt:'blender',dnf:'blender',pacman:'blender',zypper:'blender'},
    'inkscape':{apt:'inkscape',dnf:'inkscape',pacman:'inkscape',zypper:'inkscape'},
    'krita':{apt:'krita',dnf:'krita',pacman:'krita',zypper:'krita'},
    'libreoffice':{apt:'libreoffice',dnf:'libreoffice',pacman:'libreoffice-fresh',zypper:'libreoffice'},
    'audacity':{apt:'audacity',dnf:'audacity',pacman:'audacity',zypper:'audacity'},
    'obs-studio':{apt:'obs-studio',dnf:'obs-studio',pacman:'obs-studio',zypper:'obs-studio'},
    'qbittorrent':{apt:'qbittorrent',dnf:'qbittorrent',pacman:'qbittorrent',zypper:'qbittorrent'},
    'keepassxc':{apt:'keepassxc',dnf:'keepassxc',pacman:'keepassxc',zypper:'keepassxc'},
    'vlc':{apt:'vlc',dnf:'vlc',pacman:'vlc',zypper:'vlc'},
    'firefox':{apt:'firefox',dnf:'firefox',pacman:'firefox',zypper:'MozillaFirefox'},
    'python':{apt:'python3',dnf:'python3',pacman:'python',zypper:'python3'},
    'obs':{apt:'obs-studio',dnf:'obs-studio',pacman:'obs-studio',zypper:'obs-studio'}
  };
  function linuxCommand(chosen){
    const ids=[...new Set(chosen.map(a=>a.pkg?.linux).filter(v=>typeof v==='string'&&/^[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+$/.test(v)))];
    const managers=['apt','dnf','pacman','zypper'];
    const mappings=Object.fromEntries(managers.map(m=>[m,[...new Set(chosen.map(a=>linuxNative[a.key]?.[m]).filter(Boolean))]]));
    if(!ids.length&&!managers.some(m=>mappings[m].length))return '';
    const quote=v=>"'"+v.replace(/'/g,"'\\''")+"'";
    const branches=managers.filter(m=>mappings[m].length).map((m,i)=>{
      const detect={apt:'apt-get',dnf:'dnf',pacman:'pacman',zypper:'zypper'}[m];
      const prefix={apt:'sudo apt-get update && sudo apt-get install -y ',dnf:'sudo dnf install -y ',pacman:'sudo pacman -S --needed --noconfirm ',zypper:'sudo zypper install -y '}[m];
      return (i?'elif':'if')+' command -v '+detect+' >/dev/null 2>&1; then '+prefix+mappings[m].map(quote).join(' ')+'; native_done=1';
    });
    const parts=['native_done=0'];
    if(branches.length)parts.push(branches.join(' ')+'; fi');
    if(ids.length){
      const install='flatpak remote-add --user --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo && flatpak install --user -y flathub '+ids.map(quote).join(' ');
      parts.push('if [ "$native_done" -eq 0 ]; then if command -v flatpak >/dev/null 2>&1; then '+install+'; else echo "Flatpak is needed for this selection. See https://flatpak.org/setup/"; fi; fi');
    }
    return parts.join('; ');
  }
  function commandFor(chosen){if(platform==='windows'){const ids=chosen.map(a=>a.pkg.windows).filter(v=>v&&!String(v).startsWith('url:'));return ids.map(id=>`winget install --id "${id}" -e --silent --accept-package-agreements --accept-source-agreements --disable-interactivity`).join(' ; ')}if(platform==='linux')return linuxCommand(chosen);const pkgs=chosen.map(a=>a.pkg.mac).filter(Boolean),f=pkgs.filter(p=>p.type==='formula').map(p=>p.id),c=pkgs.filter(p=>p.type==='cask').map(p=>p.id),parts=[];if(f.length)parts.push(`brew install ${f.map(x=>`"${x}"`).join(' ')}`);if(c.length)parts.push(`brew install --cask ${c.map(x=>`"${x}"`).join(' ')}`);return parts.join(' ; ')}
  function refreshCommand(){const box=document.querySelector('#installCommand'),hint=document.querySelector('#commandHint');if(!box)return;const chosen=availableApps().filter(a=>selected.has(a.key)),cmd=commandFor(chosen);const mgr=document.querySelector('#linuxManagerWrap');if(mgr)mgr.style.display='none';box.textContent=cmd||'No compatible packages found for this manager. Try Flatpak or select another app.';if(hint)hint.textContent=platform==='windows'?'Runs with Windows Package Manager (winget).':platform==='linux'?'Auto-detects native package managers; falls back to Flatpak when needed.':'Runs with Homebrew.'}
  function wireCommand(){const mgr=document.querySelector('#linuxPackageManager');if(mgr&&!mgr.dataset.wired){mgr.dataset.wired='1';mgr.addEventListener('change',refreshCommand);}const copy=document.querySelector('#copyInstallCommand');if(copy&&!copy.dataset.wired){copy.dataset.wired='1';copy.addEventListener('click',async()=>{refreshCommand();const text=document.querySelector('#installCommand')?.textContent||'';if(!text||text.startsWith('No compatible'))return;try{await navigator.clipboard.writeText(text);const old=copy.textContent;copy.textContent='✓ Copied';setTimeout(()=>copy.textContent=old,1600)}catch{alert('Could not copy automatically.')}})}const review=document.querySelector('#reviewButton');if(review&&!review.dataset.commandWired){review.dataset.commandWired='1';review.addEventListener('click',()=>setTimeout(refreshCommand,0))}}
  function wire(){const old=document.querySelector('#downloadScript');if(!old||old.dataset.nativeDownload==='1'){wireCommand();return}const button=old.cloneNode(true);button.dataset.nativeDownload='1';old.replaceWith(button);button.addEventListener('click',async()=>{const chosen=availableApps().filter(a=>selected.has(a.key));if(!chosen.length)return;const oldText=button.textContent;button.disabled=true;button.textContent=platform==='windows'?'Downloading AppForge…':'Preparing AppForge…';try{if(platform==='windows')downloadWindows(chosen);else if(platform==='linux')await downloadLinux(chosen);else await downloadMac(chosen)}catch(e){alert(`AppForge: ${e.message}`)}finally{button.disabled=false;button.textContent=oldText}});wireCommand()}
  wire();
})();