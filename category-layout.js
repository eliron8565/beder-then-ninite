// AppForge single-category layout: one horizontal category bar, one category visible at a time.
(function(){
  const appCard = app => `<label class="app-row ${selected.has(app.key)?'selected':''}"><input type="checkbox" data-key="${app.key}" ${selected.has(app.key)?'checked':''}><span class="app-icon">${logoMarkup(app)}</span><span class="app-info"><strong>${app.name}</strong><small>${app.desc}</small></span></label>`;

  const style=document.createElement('style');
  style.textContent=`
    .category-strip{display:flex!important;align-items:center;gap:8px;overflow-x:auto;overflow-y:hidden;white-space:nowrap;scrollbar-width:thin;padding-bottom:8px}
    #categoryNav{display:flex!important;flex-wrap:nowrap!important;gap:8px;min-width:max-content}
    .category-link{flex:0 0 auto!important}
    #catalog{display:block!important}
    #catalog .app-group.single-category{width:100%;max-width:none;margin:0}
    #catalog .app-group.single-category>h2{margin-bottom:14px}
    #catalog .single-category .app-group-list{display:grid;grid-template-columns:repeat(4,minmax(190px,1fr));gap:6px 18px}
    @media(max-width:1100px){#catalog .single-category .app-group-list{grid-template-columns:repeat(3,minmax(180px,1fr))}}
    @media(max-width:780px){#catalog .single-category .app-group-list{grid-template-columns:repeat(2,minmax(150px,1fr))}}
    @media(max-width:520px){#catalog .single-category .app-group-list{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  window.renderApps = function(){
    const catalog=document.querySelector('#catalog'); if(!catalog) return;
    const q=(document.querySelector('#searchInput')?.value||'').trim().toLowerCase();
    let list=availableApps().filter(app=>(activeCategory==='all'||app.category===activeCategory)&&(!q||`${app.name} ${app.category} ${app.desc}`.toLowerCase().includes(q)));
    const sort=document.querySelector('#sortSelect')?.value||'popular';
    list.sort((a,b)=>sort==='popular'?(b.popular-a.popular)||a.name.localeCompare(b.name):sort==='category'?a.category.localeCompare(b.category)||a.name.localeCompare(b.name):a.name.localeCompare(b.name));
    document.querySelector('#emptyState')?.classList.toggle('hidden',list.length>0);

    const title=activeCategory==='all'?'All Apps':activeCategory;
    catalog.innerHTML=list.length?`<section class="app-group single-category"><h2>${title}</h2><div class="app-group-list">${list.map(appCard).join('')}</div></section>`:'';

    document.querySelectorAll('#catalog input[type=checkbox]').forEach(input=>input.addEventListener('change',()=>{
      selected.has(input.dataset.key)?selected.delete(input.dataset.key):selected.add(input.dataset.key);
      saveSelection();renderApps();updateSelectionBar();
    }));
  };

  renderApps();
})();
