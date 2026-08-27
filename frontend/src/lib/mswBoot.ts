export async function bootMsw(): Promise<void> {
  // Disabled offline mock service worker to route requests directly to MERN backend
  console.log("Mock Service Worker disabled. Connecting directly to backend API.");
  return Promise.resolve();
}
