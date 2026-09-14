// Ninite-style grouped layout. Browser subcategories use one compact dropdown; all other categories stay visible as cards.
(function(){
  const appCard = app => `<label class="app-row ${selected.has(app.key)?'selected':''}"><input type="checkbox" data-key="${app.key}" ${selected.has(app.key)?'checked':''}><span class="app-icon">${logoMarkup(app)}</span><span class="app-info"><strong>${app.name}</strong><small>${app.desc}</small></span></label>`;

  const browserCategories=['Popular Browsers','Privacy Browsers','Gaming Browsers','Alternative Browsers'];
  const categoryOrder=['AI & Local Models','AI Agents','Privacy & Security','Messaging','Media','File Sharing','Compression','Documents & Office','Design & Imaging','Development','Utilities','Security','Gaming','Runtimes','Drivers'];
  let browserView='all';

  // Restore normal category navigation. Browser sub-groups are handled inside the browser card only.
  window.renderNav = function(){
    const nav=document.querySelector('#categoryNav');
    if(!nav) return;
    const oldAll=document.querySelector('.category-strip > .category-link[data-category="all"]');
    if(oldAll) oldAll.style.display='';

    const cats=categories().filter(c=>!browserCategories.includes(c));
    const ordered=[...categoryOrder.filter(c=>cats.includes(c)),...cats.filter(c=>!categoryOrder.includes(c)).sort()];
    nav.innerHTML=ordered.map(cat=>`<button class="category-link ${activeCategory===cat?'active':''}" data-category="${cat}" type="button"><span>${cat}</span><span class="category-count">${availableApps().filter(a=>a.category===cat).length}</span></button>`).join('');

    document.querySelectorAll('.category-link').forEach(btn=>btn.addEventListener('click',()=>{
      activeCategory=btn.dataset.category;
      setText('#catalogTitle',activeCategory==='all'?'All apps':activeCategory);
      renderNav();
      renderApps();
    }));
  };

  function browserSection(list,sort){
    const browserApps=list.filter(a=>browserCategories.includes(a.category));
    if(!browserApps.length) return '';

    let shown=browserApps;
    if(browserView!=='all') shown=browserApps.filter(a=>a.category===browserView);
    shown.sort((a,b)=>sort==='popular'?(b.popular-a.popular)||a.name.localeCompare(b.name):a.name.localeCompare(b.name));

    const options=[['all','All Browsers'],...browserCategories.map(c=>[c,c.replace(' Browsers','')])];
    return `<section class="app-group browser-group"><div class="browser-group-head"><h2>Web Browsers</h2><select id="browserCategorySelect" class="browser-category-select">${options.map(([v,t])=>`<option value="${v}" ${browserView===v?'selected':''}>${t}</option>`).join('')}</select></div><div class="app-group-list">${shown.map(appCard).join('')}</div></section>`;
  }

  window.renderApps = function(){
    const catalog=document.querySelector('#catalog'); if(!catalog) return;
    const q=(document.querySelector('#searchInput')?.value||'').trim().toLowerCase();
    let list=availableApps().filter(app=>(activeCategory==='all'||app.category===activeCategory)&&(!q||`${app.name} ${app.category} ${app.desc}`.toLowerCase().includes(q)));
    document.querySelector('#emptyState')?.classList.toggle('hidden',list.length>0);

    const sort=document.querySelector('#sortSelect')?.value||'popular';
    const groups={};
    for(const app of list){
      if(browserCategories.includes(app.category)) continue;
      (groups[app.category]??=[]).push(app);
    }
    const ordered=[...categoryOrder.filter(c=>groups[c]),...Object.keys(groups).filter(c=>!categoryOrder.includes(c)).sort()];
    for(const cat of ordered) groups[cat].sort((a,b)=>sort==='popular'?(b.popular-a.popular)||a.name.localeCompare(b.name):a.name.localeCompare(b.name));

    const browsers=(activeCategory==='all'||browserCategories.includes(activeCategory))?browserSection(list,sort):'';
    const others=ordered.map(cat=>`<section class="app-group"><h2>${cat}</h2><div class="app-group-list">${groups[cat].map(appCard).join('')}</div></section>`).join('');
    catalog.innerHTML=browsers+others;

    const browserSelect=document.querySelector('#browserCategorySelect');
    if(browserSelect) browserSelect.addEventListener('change',()=>{browserView=browserSelect.value;renderApps();});

    document.querySelectorAll('#catalog input[type=checkbox]').forEach(input=>input.addEventListener('change',()=>{selected.has(input.dataset.key)?selected.delete(input.dataset.key):selected.add(input.dataset.key);saveSelection();renderApps();updateSelectionBar();}));
  };

  const style=document.createElement('style');
  style.textContent=`
    .browser-group-head{display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid rgba(105,226,255,.14);padding-bottom:8px;margin-bottom:6px}
    .browser-group-head h2{border:0!important;margin:0!important;padding:0!important}
    .browser-category-select{min-width:138px;height:32px;padding:0 30px 0 10px;border:1px solid rgba(105,226,255,.22);border-radius:9px;background:#0b1b2f;color:#f1f7fd;font:600 12px Inter,Segoe UI,sans-serif;outline:none;cursor:pointer}
    .browser-category-select:focus{border-color:rgba(105,226,255,.65);box-shadow:0 0 0 3px rgba(105,226,255,.08)}
  `;
  document.head.appendChild(style);

  renderNav();
  renderApps();
})();