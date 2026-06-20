// Full cinematic motion is the default for everyone.
// ?motion=reduced forces the static accessible path (QA/testing only).

const override =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("motion")
    : null

export const REDUCED_MOTION: boolean = override === "reduced"

if (typeof document !== "undefined" && REDUCED_MOTION) {
  document.documentElement.classList.add("reduced-motion")
}
