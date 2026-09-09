// AppForge native downloads + transparent no-EXE package-manager commands.
(function () {
  const KEY_MARKER='\nAPPFORGE_KEYS_V1:';
  function saveBlob(blob,name){const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1800)}
  async function fetchFile(path){const r=await fetch(`${path}?v=${Date.now()}`,{cache:'no-store'});if(!r.ok)throw new Error(`${path.split('/').pop()} is unavailable (${r.status}).`);return r}
  function windowsSelectionToken(chosen){const indexes=chosen.map(a=>Number(a.winIndex)).filter(Number.isInteger);if(!indexes.length)throw new Error('Could not prepare the Windows app selection.');const bytes=new Uint8Array(Math.floor(Math.max(...indexes)/8)+1);for(const index of indexes)bytes[Math.floor(index/8)]|=1<<(index%8);let binary='';for(const b of bytes)binary+=String.fromCharCode(b);return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
  async function downloadWindows(chosen){const r=await fetchFile('downloads/AppForge-Windows.exe');const blob=await r.blob();if(blob.size<10000)throw new Error('Windows EXE is not ready yet.');saveBlob(blob,`AppForge-${windowsSelectionToken(chosen)}.exe`)}
  async function downloadLinux(chosen){const r=await fetchFile('downloads/AppForge-Linux.AppImage');const base=await r.arrayBuffer();if(base.byteLength<10000)throw new Error('Linux AppImage is not ready yet.');const data=new TextEncoder().encode(`${KEY_MARKER}${chosen.map(a=>a.key).join(',')}:END\n`);saveBlob(new Blob([base,data],{type:'application/octet-stream'}),'AppForge-Linux.AppImage')}
  async function downloadMac(chosen){if(typeof JSZip==='undefined')throw new Error('macOS packager did not load. Refresh the page and try again.');const r=await fetchFile('downloads/AppForge-macOS.zip');const zip=await JSZip.loadAsync(await r.arrayBuffer());const entry=zip.file('AppForge.app/Contents/MacOS/AppForge');if(!entry)throw new Error('macOS app package is invalid.');const binary=await entry.async('uint8array');const marker=new TextEncoder().encode(`${KEY_MARKER}${chosen.map(a=>a.key).join(',')}:END\n`);const combined=new Uint8Array(binary.length+marker.length);combined.set(binary);combined.set(marker,binary.length);zip.file('AppForge.app/Contents/MacOS/AppForge',combined,{binary:true,unixPermissions:0o755});saveBlob(await zip.generateAsync({type:'blob',platform:'UNIX',compression:'DEFLATE',compressionOptions:{level:6}}),'AppForge-macOS.zip')}

  function commandFor(chosen){
    if(platform==='windows'){
      const ids=chosen.map(a=>a.pkg.windows).filter(v=>v&&!String(v).startsWith('url:'));
      if(!ids.length)return '';
      return ids.map(id=>`winget install --id "${id}" -e --silent --accept-package-agreements --accept-source-agreements`).join(' ; ');
    }
    if(platform==='linux'){
      const ids=chosen.map(a=>a.pkg.linux).filter(Boolean);if(!ids.length)return '';
      return `flatpak install -y flathub ${ids.map(id=>`"${id}"`).join(' ')}`;
    }
    const pkgs=chosen.map(a=>a.pkg.mac).filter(Boolean);if(!pkgs.length)return '';
    const formulas=pkgs.filter(p=>p.type==='formula').map(p=>p.id),casks=pkgs.filter(p=>p.type==='cask').map(p=>p.id),parts=[];
    if(formulas.length)parts.push(`brew install ${formulas.map(x=>`"${x}"`).join(' ')}`);
    if(casks.length)parts.push(`brew install --cask ${casks.map(x=>`"${x}"`).join(' ')}`);
    return parts.join(' ; ');
  }
  function refreshCommand(){const box=document.querySelector('#installCommand'),hint=document.querySelector('#commandHint');if(!box)return;const chosen=availableApps().filter(a=>selected.has(a.key));const cmd=commandFor(chosen);box.textContent=cmd||'No automatic package-manager command is available for this selection.';if(hint){const manual=chosen.filter(a=>platform==='windows'&&String(a.pkg.windows||'').startsWith('url:'));hint.textContent=manual.length?`${manual.map(a=>a.name).join(', ')} uses an official download page and is not included in the command.`:(platform==='windows'?'Runs with Windows Package Manager (winget).':platform==='linux'?'Runs with Flatpak / Flathub.':'Runs with Homebrew.')}}
  function wireCommand(){const copy=document.querySelector('#copyInstallCommand');if(copy&&!copy.dataset.wired){copy.dataset.wired='1';copy.addEventListener('click',async()=>{refreshCommand();const text=document.querySelector('#installCommand')?.textContent||'';if(!text||text.startsWith('No automatic'))return;try{await navigator.clipboard.writeText(text);const old=copy.textContent;copy.textContent='✓ Copied';setTimeout(()=>copy.textContent=old,1600)}catch{alert('Could not copy automatically. Select the command and copy it manually.')}})}const review=document.querySelector('#reviewButton');if(review&&!review.dataset.commandWired){review.dataset.commandWired='1';review.addEventListener('click',()=>setTimeout(refreshCommand,0))}}
  function wire(){const old=document.querySelector('#downloadScript');if(!old||old.dataset.nativeDownload==='1'){wireCommand();return}const button=old.cloneNode(true);button.dataset.nativeDownload='1';old.replaceWith(button);button.addEventListener('click',async()=>{const chosen=availableApps().filter(a=>selected.has(a.key));if(!chosen.length)return;const oldText=button.textContent;button.disabled=true;button.textContent='Preparing AppForge…';try{if(platform==='windows')await downloadWindows(chosen);else if(platform==='linux')await downloadLinux(chosen);else await downloadMac(chosen)}catch(e){alert(`AppForge: ${e.message}`)}finally{button.disabled=false;button.textContent=oldText}});wireCommand()}
  wire();
})();