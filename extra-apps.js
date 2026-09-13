// Extra AppForge catalog entries
// Keep Windows indexes append-only: the personalized installer token depends on them.
(() => {
  const fdm = {
    name:'Free Download Manager',
    category:'File Sharing',
    domain:'freedownloadmanager.org',
    popular:9,
    tags:['essentials'],
    pkg:{windows:'SoftDeluxe.FreeDownloadManager'},
    winIndex:70
  };
  fdm.key='free-download-manager';
  fdm.logo=fav(fdm.domain);
  fdm.desc='Free Download Manager — download accelerator and organizer.';
  if (!apps.some(a => a.key === fdm.key)) apps.push(fdm);
  updatePlatformUI();
})();
