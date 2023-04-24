// eslint-disable-next-line import/no-unassigned-import
import './options-storage.js';

const extension = typeof browser !== 'undefined' ? browser : chrome;

chrome.action.onClicked.addListener(async (tab) => {
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});