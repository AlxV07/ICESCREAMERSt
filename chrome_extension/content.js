function removePopup() {
  const oldPopup = document.getElementById('highlight-popup');
  if (oldPopup) oldPopup.remove();
}

document.addEventListener("mouseup", (e) => {
//    console.log('mouse up ed')
  removePopup();

  const selectedText = window.getSelection().toString().trim();

  if (selectedText.length === 0) return;

  const popup = document.createElement("div");
  popup.id = "highlight-popup";
  popup.textContent = `Highlighted: "${selectedText}"`;
  popup.style.top = `${e.pageY + 10}px`;
  popup.style.left = `${e.pageX + 10}px`;
  popup.style.zIndex = 9999;
  popup.style.position = 'absolute';

  document.body.appendChild(popup);
});
