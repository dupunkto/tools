const copied = document.createElement("span");
copied.className = "copied";

window.addEventListener("load", () => {
  document.body.appendChild(copied);
});

function copy(e) {
  navigator.clipboard.writeText(e.target.innerText);
  copied.innerText = "Copied!";
  window.setTimeout(() => copied.innerText = "", 400);
}

// Be a nice citizen; don't clutter global scope.
delete copied;

// Expose our public API on the window.
window.copy = copy;