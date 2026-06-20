import ReactDOM from "react-dom/client"
import App from "./App"
import "./styles.css"
import { StrictMode } from "react"

// always land on the hero, never a browser-restored scroll position from a
// refresh or back/forward navigation — the preloader/intro timing assumes
// it starts at the top. pageshow also fires on bfcache restores, which can
// otherwise reapply a stale position after this initial call.
if ("scrollRestoration" in history) history.scrollRestoration = "manual"
window.scrollTo(0, 0)
window.addEventListener("pageshow", () => window.scrollTo(0, 0))
window.onbeforeunload = () => {
  window.scrollTo(0, 0)
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
