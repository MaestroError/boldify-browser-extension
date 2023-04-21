// eslint-disable-next-line import/no-unassigned-import
import 'webext-base-css';
import './options.css';

import optionsStorage from './options-storage.js';

// Automatically sync the form with the browser's storage
optionsStorage.syncForm('#options-form');

const fontWeightSelect = document.getElementById('font-weight');
const exampleText = document.getElementById('example-text');

// Update the example text's font-weight
function updateExampleText() {
  const fontWeight = fontWeightSelect.value;
  exampleText.style.fontWeight = fontWeight;
}

// Set up event listeners
fontWeightSelect.addEventListener('change', updateExampleText);

// Update the example text when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
  optionsStorage.getAll().then(options => {
    fontWeightSelect.value = options.fontWeight;
    updateExampleText();
  });
});
