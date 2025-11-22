chrome.runtime.onInstalled.addListener(async () => {
  try { await chrome.sidePanel.setOptions({ path: 'sidepanel.html', enabled: true }); } catch (e) {}
  try { if (chrome.sidePanel.setPanelBehavior) await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }); } catch (e) {}
});

chrome.runtime.onStartup.addListener(async () => {
  try { await chrome.sidePanel.setOptions({ path: 'sidepanel.html', enabled: true }); } catch (e) {}
  try { if (chrome.sidePanel.setPanelBehavior) await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }); } catch (e) {}
});

chrome.action.onClicked.addListener(async (tab) => {
  try {
    const tId = tab && tab.id ? tab.id : (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
    if (tId) {
      await chrome.sidePanel.setOptions({ tabId: tId, path: 'sidepanel.html', enabled: true });
      await chrome.sidePanel.open({ tabId: tId });
      return;
    }
    await chrome.sidePanel.setOptions({ path: 'sidepanel.html', enabled: true });
    await chrome.sidePanel.open({});
  } catch (e) {}
});
