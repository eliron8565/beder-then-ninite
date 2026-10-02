// AppForge visual theme selector.
(() => {
  const key='appforge-theme';
  const picker=document.querySelector('#themePicker');
  if(!picker)return;
  const themes=['cyberpunk','gta','minecraft','league','apex'];
  const apply=value=>{
    const theme=themes.includes(value)?value:'default';
    document.body.classList.remove(...themes);
    if(theme!=='default')document.body.classList.add(theme);
    picker.value=theme;
    localStorage.setItem(key,theme);
  };
  apply(localStorage.getItem(key)||'default');
  picker.addEventListener('change',()=>{apply(picker.value);document.body.classList.add('theme-switching');setTimeout(()=>document.body.classList.remove('theme-switching'),420);});
  let ticking=false;
  addEventListener('pointermove',e=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{document.documentElement.style.setProperty('--mx',(e.clientX/innerWidth*100).toFixed(1)+'%');document.documentElement.style.setProperty('--my',(e.clientY/innerHeight*100).toFixed(1)+'%');ticking=false;});},{passive:true});
})();