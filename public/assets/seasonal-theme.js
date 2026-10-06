(()=>{
  const now=new Date();
  // Halloween theme: active automatically only during October (local date of visitor).
  if(now.getMonth()!==9) return;
  document.documentElement.classList.add('theme-halloween');
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='assets/halloween-theme.css?v=2026-10-06-1';
  link.dataset.seasonalTheme='halloween';
  document.head.appendChild(link);
})();
