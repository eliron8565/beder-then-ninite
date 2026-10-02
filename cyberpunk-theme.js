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
  picker.addEventListener('change',()=>apply(picker.value));
})();