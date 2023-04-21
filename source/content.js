import optionsStorage from './options-storage.js';

console.log('💈 Content script loaded for', chrome.runtime.getManifest().name);

async function init() {
	const options = await optionsStorage.getAll();
	const color = 'rgb(' + options.colorRed + ', ' + options.colorGreen + ',' + options.colorBlue + ')';
	const text = options.text;
	const notice = document.createElement('div');
	notice.innerHTML = text;
	document.body.prepend(notice);
	notice.id = 'text-notice';
	notice.style.border = '2px solid ' + color;
	notice.style.color = color;
}

function createBoldifiedText(text) {
	const words = text.split(' ');
	const fragment = document.createDocumentFragment();
  
	words.forEach((word, index) => {
	  const boldPart = document.createElement('strong');
	  const normalPart = document.createTextNode(word.slice(2));
	  boldPart.textContent = word.slice(0, 2);
  
	  fragment.appendChild(boldPart);
	  fragment.appendChild(normalPart);
  
	  if (index < words.length - 1) {
		fragment.appendChild(document.createTextNode(' '));
	  }
	});
  
	return fragment;
  }
  
  function walk(node) {
	if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
	  const parent = node.parentNode;
  
	  if (parent && parent.nodeName !== 'SCRIPT' && parent.nodeName !== 'STYLE' &&
		  !parent.closest('input, textarea, select')) {
		try {
		  const boldifiedText = createBoldifiedText(node.textContent);
  
		  const range = document.createRange();
		  range.selectNodeContents(node);
		  range.deleteContents();
  
		  const selection = window.getSelection();
		  selection.removeAllRanges();
		  selection.addRange(range);
  
		  range.insertNode(boldifiedText);
		} catch (error) {
		  console.error('Error processing node:', error);
		}
	  }
	} else {
	  for (let child of Array.from(node.childNodes)) {
		walk(child);
	  }
	}
  }
  
  function processSelectedElements(selectors) {
	selectors.forEach((selector) => {
	  const elements = document.querySelectorAll(selector);
  
	  elements.forEach((element) => {
		walk(element);
	  });
	});
  }

  const selectorsArray = ['article', '.text', '.post', '#post', '.story'];
  processSelectedElements(selectorsArray);
  
  
//   init();
  // @todo update "matches" in manifest
//   walk(document.body);
//   observeDOMChanges();
