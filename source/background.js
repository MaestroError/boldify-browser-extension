// eslint-disable-next-line import/no-unassigned-import
import './options-storage.js';

const extension = typeof browser !== 'undefined' ? browser : chrome;
const tabStates = new Map();

extension.action.onClicked.addListener(async (tab) => {
  const tabId = tab.id;
  const isEnabled = tabStates.get(tabId);

  if (isEnabled) {
    await extension.tabs.reload(tabId);
    tabStates.set(tabId, false);
  } else {
    await extension.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
    tabStates.set(tabId, true);
  }
});