// AppForge reliable personalized downloads.
(function () {
  const KEY_MARKER='\nAPPFORGE_KEYS_V1:';

  function saveBlob(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000)}
  async function fetchFile(path){const r=await fetch(`${path}${path.includes('?')?'&':'?'}v=${Date.now()}`,{cache:'no-store'});if(!r.ok)throw new Error(`${path.split('/').pop()} is unavailable (${r.status}).`);return r}

  function windowsIndexes(chosen){return [...new Set(chosen.map(a=>Number(a.winIndex)).filter(i=>Number.isInteger(i)&&i>=0&&i<=103))].sort((a,b)=>a-b)}
  function windowsSelectionToken(chosen){
    const ids=windowsIndexes(chosen);if(!ids.length)throw new Error('Could not prepare the Windows app selection.');
    // 13 bytes = indexes 0..103. No random bytes: every bit is selection data.
    // The installer already accepts variable/13-byte Base64URL bitsets and strips browser " (1)" suffixes.
    const bytes=new Uint8Array(13);for(const i of ids)bytes[Math.floor(i/8)]|=1<<(i%8);
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

  function commandFor(chosen){if(platform==='windows'){const ids=chosen.map(a=>a.pkg.windows).filter(v=>v&&!String(v).startsWith('url:'));return ids.map(id=>`winget install --id "${id}" -e --silent --accept-package-agreements --accept-source-agreements --disable-interactivity`).join(' ; ')}if(platform==='linux'){const ids=chosen.map(a=>a.pkg.linux).filter(Boolean);return ids.length?`flatpak install -y flathub ${ids.map(id=>`"${id}"`).join(' ')}`:''}const pkgs=chosen.map(a=>a.pkg.mac).filter(Boolean),f=pkgs.filter(p=>p.type==='formula').map(p=>p.id),c=pkgs.filter(p=>p.type==='cask').map(p=>p.id),parts=[];if(f.length)parts.push(`brew install ${f.map(x=>`"${x}"`).join(' ')}`);if(c.length)parts.push(`brew install --cask ${c.map(x=>`"${x}"`).join(' ')}`);return parts.join(' ; ')}
  function refreshCommand(){const box=document.querySelector('#installCommand'),hint=document.querySelector('#commandHint');if(!box)return;const chosen=availableApps().filter(a=>selected.has(a.key)),cmd=commandFor(chosen);box.textContent=cmd||'No automatic package-manager command is available for this selection.';if(hint)hint.textContent=platform==='windows'?'Runs with Windows Package Manager (winget).':platform==='linux'?'Runs with Flatpak / Flathub.':'Runs with Homebrew.'}
  function wireCommand(){const copy=document.querySelector('#copyInstallCommand');if(copy&&!copy.dataset.wired){copy.dataset.wired='1';copy.addEventListener('click',async()=>{refreshCommand();const text=document.querySelector('#installCommand')?.textContent||'';if(!text||text.startsWith('No automatic'))return;try{await navigator.clipboard.writeText(text);const old=copy.textContent;copy.textContent='✓ Copied';setTimeout(()=>copy.textContent=old,1600)}catch{alert('Could not copy automatically.')}})}const review=document.querySelector('#reviewButton');if(review&&!review.dataset.commandWired){review.dataset.commandWired='1';review.addEventListener('click',()=>setTimeout(refreshCommand,0))}}
  function wire(){const old=document.querySelector('#downloadScript');if(!old||old.dataset.nativeDownload==='1'){wireCommand();return}const button=old.cloneNode(true);button.dataset.nativeDownload='1';old.replaceWith(button);button.addEventListener('click',async()=>{const chosen=availableApps().filter(a=>selected.has(a.key));if(!chosen.length)return;const oldText=button.textContent;button.disabled=true;button.textContent=platform==='windows'?'Downloading AppForge…':'Preparing AppForge…';try{if(platform==='windows')downloadWindows(chosen);else if(platform==='linux')await downloadLinux(chosen);else await downloadMac(chosen)}catch(e){alert(`AppForge: ${e.message}`)}finally{button.disabled=false;button.textContent=oldText}});wireCommand()}
  wire();
})();