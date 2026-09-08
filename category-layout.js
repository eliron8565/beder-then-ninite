// Ninite-style grouped category layout for AppForge.
(function(){
  const appCard = app => `<label class="app-row ${selected.has(app.key)?'selected':''}"><input type="checkbox" data-key="${app.key}" ${selected.has(app.key)?'checked':''}><span class="app-icon">${logoMarkup(app)}</span><span class="app-info"><strong>${app.name}</strong><small>${app.desc}</small></span></label>`;

  window.renderApps = function(){
    const catalog = document.querySelector('#catalog'); if(!catalog) return;
    const q=(document.querySelector('#searchInput')?.value||'').trim().toLowerCase();
    let list=availableApps().filter(app=>(activeCategory==='all'||app.category===activeCategory)&&(!q||`${app.name} ${app.category} ${app.desc}`.toLowerCase().includes(q)));
    document.querySelector('#emptyState')?.classList.toggle('hidden',list.length>0);

    const categoryOrder=['Web Browsers','Messaging','Media','File Sharing','Compression','Documents & Office','Design & Imaging','Development','Utilities','Security','Gaming','Runtimes','Drivers'];
    const groups={};
    for(const app of list)(groups[app.category]??=[]).push(app);
    const ordered=[...categoryOrder.filter(c=>groups[c]),...Object.keys(groups).filter(c=>!categoryOrder.includes(c)).sort()];
    const sort=document.querySelector('#sortSelect')?.value||'popular';
    for(const cat of ordered){
      groups[cat].sort((a,b)=>sort==='popular'?(b.popular-a.popular)||a.name.localeCompare(b.name):a.name.localeCompare(b.name));
    }
    catalog.innerHTML=ordered.map(cat=>`<section class="app-group"><h2>${cat}</h2><div class="app-group-list">${groups[cat].map(appCard).join('')}</div></section>`).join('');
    document.querySelectorAll('#catalog input[type=checkbox]').forEach(input=>input.addEventListener('change',()=>{selected.has(input.dataset.key)?selected.delete(input.dataset.key):selected.add(input.dataset.key);saveSelection();renderApps();updateSelectionBar();}));
  };
  renderApps();
})();