// AppForge native downloads: Windows EXE, Linux AppImage, macOS app ZIP.
(function () {
  const KEY_MARKER='\nAPPFORGE_KEYS_V1:';

  function saveBlob(blob,name){
    const url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1800);
  }

  async function fetchFile(path){
    const r=await fetch(`${path}?v=${Date.now()}`,{cache:'no-store'});
    if(!r.ok) throw new Error(`${path.split('/').pop()} is unavailable (${r.status}).`);
    return r;
  }

  // Encode selected Windows catalog indexes in a compact bitset. The EXE itself is
  // never modified, so its embedded icon and future Authenticode signature stay intact.
  function windowsSelectionToken(chosen){
    const indexes=chosen.map(a=>Number(a.winIndex)).filter(Number.isInteger);
    if(!indexes.length) throw new Error('Could not prepare the Windows app selection.');
    const bytes=new Uint8Array(Math.floor(Math.max(...indexes)/8)+1);
    for(const index of indexes) bytes[Math.floor(index/8)]|=1<<(index%8);
    let binary='';
    for(const b of bytes) binary+=String.fromCharCode(b);
    return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }

  async function downloadWindows(chosen){
    const r=await fetchFile('downloads/AppForge-Windows.exe');
    const blob=await r.blob();
    if(blob.size<10000) throw new Error('Windows EXE is not ready yet.');
    const token=windowsSelectionToken(chosen);
    // AppForge reads the token from this filename and immediately shows ONLY these apps.
    saveBlob(blob,`AppForge-${token}.exe`);
  }

  async function downloadLinux(chosen){
    const r=await fetchFile('downloads/AppForge-Linux.AppImage');
    const base=await r.arrayBuffer();
    if(base.byteLength<10000) throw new Error('Linux AppImage is not ready yet.');
    const data=new TextEncoder().encode(`${KEY_MARKER}${chosen.map(a=>a.key).join(',')}:END\n`);
    saveBlob(new Blob([base,data],{type:'application/octet-stream'}),'AppForge-Linux.AppImage');
  }

  async function downloadMac(chosen){
    if(typeof JSZip==='undefined') throw new Error('macOS packager did not load. Refresh the page and try again.');
    const r=await fetchFile('downloads/AppForge-macOS.zip');
    const zip=await JSZip.loadAsync(await r.arrayBuffer());
    const entry=zip.file('AppForge.app/Contents/MacOS/AppForge');
    if(!entry) throw new Error('macOS app package is invalid.');
    const binary=await entry.async('uint8array');
    const marker=new TextEncoder().encode(`${KEY_MARKER}${chosen.map(a=>a.key).join(',')}:END\n`);
    const combined=new Uint8Array(binary.length+marker.length);combined.set(binary);combined.set(marker,binary.length);
    zip.file('AppForge.app/Contents/MacOS/AppForge',combined,{binary:true,unixPermissions:0o755});
    const blob=await zip.generateAsync({type:'blob',platform:'UNIX',compression:'DEFLATE',compressionOptions:{level:6}});
    saveBlob(blob,'AppForge-macOS.zip');
  }

  function wire(){
    const old=document.querySelector('#downloadScript');
    if(!old||old.dataset.nativeDownload==='1')return;
    const button=old.cloneNode(true);button.dataset.nativeDownload='1';old.replaceWith(button);
    button.addEventListener('click',async()=>{
      const chosen=availableApps().filter(a=>selected.has(a.key));if(!chosen.length)return;
      const oldText=button.textContent;button.disabled=true;button.textContent='Preparing AppForge…';
      try{
        if(platform==='windows')await downloadWindows(chosen);
        else if(platform==='linux')await downloadLinux(chosen);
        else await downloadMac(chosen);
      }catch(e){alert(`AppForge: ${e.message}`);}finally{button.disabled=false;button.textContent=oldText;}
    });
  }
  wire();
})();