chrome.runtime.sendMessage({ type: 'fetchData' }, response => {
  if (response.success) {
    document.getElementById('output').textContent = response.data.message;
  } else {
    document.getElementById('output').textContent = 'Error: ' + response.error;
  }
});