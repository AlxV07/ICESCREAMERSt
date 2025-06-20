chrome.runtime.sendMessage({ type: 'fetchData' }, response => {
  if (response.success) {
    document.getElementById('output').textContent = response.data.message;
  } else {
    document.getElementById('output').textContent = 'Error: ' + response.error;
  }
});

document.getElementById("openBtn").addEventListener("click", () => {
  chrome.tabs.create({ url: "http://127.0.0.1:8000/templates/" });
});
