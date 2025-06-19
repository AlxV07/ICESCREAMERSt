chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'fetchData') {
    fetch('http://localhost:5000/api/data')
      .then(res => res.json())
      .then(data => sendResponse({ success: true, data }))
      .catch(err => sendResponse({ success: false, error: err.toString() }));
    return true;  // keeps sendResponse async
  }
});