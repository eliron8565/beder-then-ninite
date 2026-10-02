// Optional Cyberpunk-inspired AppForge theme.
(() => {
  const key='appforge-theme';
  const button=document.querySelector('#cyberpunkToggle');
  if(!button)return;
  const apply=on=>{
    document.body.classList.toggle('cyberpunk',on);
    button.setAttribute('aria-pressed',String(on));
    button.textContent=on?'⚡ DEFAULT':'⚡ CYBERPUNK';
  };
  apply(localStorage.getItem(key)==='cyberpunk');
  button.addEventListener('click',()=>{
    const on=!document.body.classList.contains('cyberpunk');
    apply(on);
    localStorage.setItem(key,on?'cyberpunk':'default');
  });
})();