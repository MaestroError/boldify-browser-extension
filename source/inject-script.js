(async function() {
    const script = document.createElement('script');
    script.setAttribute('type', 'module');
    script.src = chrome.runtime.getURL('content.js');
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  })();