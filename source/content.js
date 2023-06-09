import optionsStorage from './options-storage.js';

console.log('💈 Content script loaded for', chrome.runtime.getManifest().name);

// Initialize the content script
async function init() {
	// Get options from the storage
	const options = await optionsStorage.getAll();
	// console.log(options.selectors.split(","), options.fontWeight);

	// Process the selected elements with the given font weight
	processSelectedElements(options.selectors.split(","), options.fontWeight);
}

async function checkAutoDetection() {
	const options = await optionsStorage.getAll();
	if (options.auto) {
		setTimeout(() => {
			init();
		}, 2000)
	}
}

// Create boldified text by splitting a text node in half and wrapping the first half in a strong tag
function createBoldifiedText(text, fontWeight) {
	const words = text.split(' ');
	const fragment = document.createDocumentFragment();
  
	words.forEach((word, index) => {
	  const halfLength = Math.floor(word.length / 2);
	  const boldPart = document.createElement('strong');
	  boldPart.className = 'bionic-bolder';
	  boldPart.style.fontWeight = fontWeight;
	  const normalPart = document.createTextNode(word.slice(halfLength));
	  boldPart.textContent = word.slice(0, halfLength);
  
	  fragment.appendChild(boldPart);
	  fragment.appendChild(normalPart);
  
	  if (index < words.length - 1) {
		fragment.appendChild(document.createTextNode(' '));
	  }
	});
  
	return fragment;
  }
  
  // Recursively walk through the DOM tree and apply the boldifying function to text nodes
  function walk(node, fontWeight) {
	if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
	  	const parent = node.parentNode;

		// Check if the first character is not a special character
		const firstChar = node.textContent.trim()[0];
		const isNotSpecialCharacter = /^[^\s!@#$%^&*)_+=\[\]{}\\|;:<>/?]$/i.test(firstChar);
  
		// Process the text node only if its parent is an allowed element, and the first character is not a special character
		if (parent && parent.nodeName !== 'SCRIPT' && parent.nodeName !== 'STYLE' &&
			!parent.closest('input, textarea, select') && isAllowedElement(parent) && isNotSpecialCharacter) {
		try {
			const boldifiedText = createBoldifiedText(node.textContent, fontWeight);

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
		walk(child, fontWeight); // Pass the fontWeight parameter
	  }
	}
  }
  
  // Process selected elements by applying the boldifying function
  function processSelectedElements(selectors, fontWeight) {
	console.log(selectors);
	selectors.forEach((selector) => {
	  const elements = document.querySelectorAll(selector);
	  elements.forEach((element) => {
		console.log(isAllowedElement(element), element);

		if (isAllowedElement(element)) {
			walk(element, fontWeight);
		}
	  });
	});
  }

  // Check if an element is allowed for processing
  function isAllowedElement(element) {
	const nodeName = element.nodeName.toLowerCase();
	const allowedNodes = ['p', 'span', 'article', 'li', 'div'];
	const disallowedNodes = ['a', 'pre', 'code', 'input', 'textarea', 'select'];
	// console.log(nodeName);
	return (
	  allowedNodes.includes(nodeName) &&
	  !disallowedNodes.some((disallowedNode) =>
		element.closest(disallowedNode)
	  )
	);
  }

  function removeBoldifiedText() {
	const boldElements = document.querySelectorAll('strong.bionic-bolder');
  
	boldElements.forEach((boldElement) => {
	  const parent = boldElement.parentNode;
	  const normalPart = boldElement.nextSibling;
	  const originalText = boldElement.textContent + (normalPart ? normalPart.textContent : '');
	  
	  if (normalPart) {
		parent.removeChild(normalPart);
	  }
  
	  const textNode = document.createTextNode(originalText);
	  parent.replaceChild(textNode, boldElement);
	});
  }

  // Use only on difficult places, breaks performance
  /* Usage example:
	const targetNode = document.querySelector('#your-container-element'); // Replace with the appropriate selector
	const fontWeight = '800';

	const observer = observeMutations(targetNode, fontWeight);
  */
  function observeMutations(targetNode, fontWeight) {
	const config = { childList: true, subtree: true, characterData: true };
  
	const callback = function (mutationsList, observer) {
	  for (const mutation of mutationsList) {
		if (
		  mutation.type === 'childList' ||
		  mutation.type === 'subtree' ||
		  mutation.type === 'characterData'
		) {
		  walk(mutation.target, fontWeight);
		}
	  }
	};
  
	const observer = new MutationObserver(callback);
	observer.observe(targetNode, config);
  
	return observer;
  }


  	chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
		if (message.action === 'toggle') {
			const status = message.status;
			switch (status) {
				case 'on':
					// Process the document according to the "on" logic
					init();
					break;
				case 'off':
					// Process the document according to the "off" logic
					removeBoldifiedText()
					break;
			}
		}
		if (message.action === 'toggleAutoDetect') {
			let autoDetect = message.status
			console.log(message);
			await optionsStorage.set({ auto: autoDetect });
		}
	});

	window.addEventListener('load', () => {
		console.log("Checking auto detection");
		checkAutoDetection();
	});

  
/** Removed from manifest:
 * {
		"matches": [ 
			"<all_urls>"
		],
		"js": [ "content.js" ],
		"css": [ "content.css" ],
		"run_at": "document_end"
	}
 */