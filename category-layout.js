// Ninite-style grouped category layout + compact category dropdown for AppForge.
(function(){
  const appCard = app => `<label class="app-row ${selected.has(app.key)?'selected':''}"><input type="checkbox" data-key="${app.key}" ${selected.has(app.key)?'checked':''}><span class="app-icon">${logoMarkup(app)}</span><span class="app-info"><strong>${app.name}</strong><small>${app.desc}</small></span></label>`;

  const categoryOrder=['Popular Browsers','Privacy Browsers','Gaming Browsers','Alternative Browsers','AI & Local Models','AI Agents','Privacy & Security','Messaging','Media','File Sharing','Compression','Documents & Office','Design & Imaging','Development','Utilities','Security','Gaming','Runtimes','Drivers'];

  window.renderNav = function(){
    const nav=document.querySelector('#categoryNav');
    if(!nav) return;

    const oldAll=document.querySelector('.category-strip > .category-link[data-category="all"]');
    if(oldAll) oldAll.style.display='none';

    const cats=categories();
    const ordered=[...categoryOrder.filter(c=>cats.includes(c)),...cats.filter(c=>!categoryOrder.includes(c)).sort()];
    nav.innerHTML=`<label class="category-dropdown-wrap"><span>Category</span><select id="categorySelect" class="category-select"><option value="all" ${activeCategory==='all'?'selected':''}>All categories</option>${ordered.map(cat=>`<option value="${cat}" ${activeCategory===cat?'selected':''}>${cat} (${availableApps().filter(a=>a.category===cat).length})</option>`).join('')}</select></label>`;

    const select=document.querySelector('#categorySelect');
    if(select) select.addEventListener('change',()=>{
      activeCategory=select.value;
      setText('#catalogTitle',activeCategory==='all'?'All apps':activeCategory);
      renderApps();
    });
  };

  window.renderApps = function(){
    const catalog = document.querySelector('#catalog'); if(!catalog) return;
    const q=(document.querySelector('#searchInput')?.value||'').trim().toLowerCase();
    let list=availableApps().filter(app=>(activeCategory==='all'||app.category===activeCategory)&&(!q||`${app.name} ${app.category} ${app.desc}`.toLowerCase().includes(q)));
    document.querySelector('#emptyState')?.classList.toggle('hidden',list.length>0);

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

  const style=document.createElement('style');
  style.textContent=`
    .category-strip{display:flex;align-items:center;gap:12px;overflow:visible!important}
    #categoryNav{display:block;flex:0 0 auto}
    .category-dropdown-wrap{display:flex;align-items:center;gap:10px;color:var(--muted,#91a5bc);font-weight:700}
    .category-select{min-width:250px;max-width:min(420px,80vw);height:42px;padding:0 42px 0 14px;border:1px solid rgba(105,226,255,.2);border-radius:12px;background:#0b1b2f;color:#f1f7fd;font:600 14px Inter,Segoe UI,sans-serif;outline:none;cursor:pointer}
    .category-select:focus{border-color:rgba(105,226,255,.65);box-shadow:0 0 0 3px rgba(105,226,255,.09)}
    @media(max-width:640px){.category-dropdown-wrap span{display:none}.category-select{min-width:min(82vw,320px)}}
  `;
  document.head.appendChild(style);

  renderNav();
  renderApps();
})();