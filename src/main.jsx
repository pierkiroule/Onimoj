import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

window.onerror = function (msg, url, line, col) {
  const box = document.createElement("div");
  box.style.position = "fixed";
  box.style.bottom = "0";
  box.style.left = "0";
  box.style.right = "0";
  box.style.background = "#300";
  box.style.color = "#fff";
  box.style.fontSize = "12px";
  box.style.padding = "4px";
  box.style.zIndex = "9999";
  box.textContent = "⚠️ " + msg + " (" + line + ":" + col + ")";
  document.body.appendChild(box);
  return false;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
