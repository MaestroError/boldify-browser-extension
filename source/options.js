// eslint-disable-next-line import/no-unassigned-import
import 'webext-base-css';
import './options.css';

import optionsStorage from './options-storage.js';

const fontWeightSelect = document.getElementById('font-weight');
const exampleText = document.getElementById('example-text');

// Update the example text's font-weight
function updateExampleText() {
  const fontWeight = fontWeightSelect.value;
  exampleText.style.fontWeight = fontWeight;
}

// Set up event listeners
fontWeightSelect.addEventListener('change', updateExampleText);

async function init() {
	await optionsStorage.syncForm('#options-form');
	updateExampleText()
}

init();