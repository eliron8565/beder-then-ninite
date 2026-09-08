// Keeps the Windows download name clean while preserving the selected app list.
(function () {
  const MARKER = '\nAPPFORGE_SELECTION_V1:';

  async function downloadCleanWindowsExe(button) {
    const chosen = availableApps().filter(app => selected.has(app.key));
    if (!chosen.length) return;

    const oldText = button.textContent;
    button.disabled = true;
    button.textContent = 'Preparing AppForge…';

    try {
      const response = await fetch(`downloads/AppForge-Windows.exe?v=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Windows EXE is unavailable (${response.status}).`);

      const baseExe = await response.arrayBuffer();
      if (baseExe.byteLength < 10000) throw new Error('Windows EXE is not ready yet.');

      // PE files safely ignore appended overlay bytes. The AppForge GUI reads this marker on startup.
      const selectionData = new TextEncoder().encode(`${MARKER}${chosen.map(app => app.winIndex).join('.')}:END\n`);
      const blob = new Blob([baseExe, selectionData], { type: 'application/vnd.microsoft.portable-executable' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'AppForge.exe';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (error) {
      alert(`AppForge: ${error.message}`);
    } finally {
      button.disabled = false;
      button.textContent = oldText;
    }
  }

  function wireDownloadButton() {
    const oldButton = document.querySelector('#downloadScript');
    if (!oldButton || oldButton.dataset.cleanDownload === '1') return;

    // Cloning removes the old app.js listener so only the clean download path runs.
    const button = oldButton.cloneNode(true);
    button.dataset.cleanDownload = '1';
    oldButton.replaceWith(button);

    button.addEventListener('click', async () => {
      if (platform === 'windows') {
        await downloadCleanWindowsExe(button);
      } else {
        // For Linux/macOS keep the existing installer behavior.
        const chosen = availableApps().filter(app => selected.has(app.key));
        if (!chosen.length) return;
        const blob = new Blob([buildUnixInstaller()], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = platform === 'linux' ? 'AppForge-Linux-Installer.sh' : 'AppForge-macOS-Installer.command';
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    });
  }

  wireDownloadButton();
})();