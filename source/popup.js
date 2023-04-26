import optionsStorage from './options-storage.js';

document.addEventListener('DOMContentLoaded', () => {

    const switchElement = document.getElementById('switch');
    const autonomousDetectingElement = document.getElementById('autonomousDetecting');

    optionsStorage.getAll().then((options) => {
        // Use options here
        console.log(options);
        if (options.auto) {
            autonomousDetectingElement.checked = true
        } else {
            autonomousDetectingElement.checked = false
        }
    });

    // Add an event listener for on/off switch
    switchElement.addEventListener('change', async () => {
        await chrome.storage.sync.set({ switchStatus: switchElement.value });
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle', status: switchElement.value });
        });
    });
    // Add an event listener for the autonomous detecting checkbox
    autonomousDetectingElement.addEventListener('change', () => {
        const autoDetect = autonomousDetectingElement.checked;

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleAutoDetect', status: autoDetect });
        });
    });
});

let auro = document.getElementById('autonomousDetecting');
console.log(auro);