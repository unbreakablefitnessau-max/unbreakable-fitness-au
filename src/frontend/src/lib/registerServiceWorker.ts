/**
 * Registers the offline app-shell service worker and keeps the running app in
 * step with new deploys: when a new worker takes control, the page reloads once
 * so members never sit on a stale build.
 */
export function registerServiceWorker(): void {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  if (
    window.location.protocol !== "https:" &&
    window.location.hostname !== "localhost"
  ) {
    return;
  }

  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .then((registration) => {
        // Check for a new build on every launch and when the app returns to
        // the foreground, so a long-lived installed app still refreshes.
        void registration.update();
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") {
            void registration.update();
          }
        });
      })
      .catch(() => {
        // Installability is a progressive enhancement; the app works without it.
      });
  });
}
