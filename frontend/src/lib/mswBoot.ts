export async function bootMsw(): Promise<void> {
  // Start MSW only in development mode
  if (import.meta.env.DEV) {
    const { worker } = await import("../mocks/browser");
    
    // Start MSW worker to intercept fetch calls
    await worker.start({
      onUnhandledRequest: "bypass", // Allow unmocked external requests (like Google Fonts or Vite updates)
    });
    console.log("Mock Service Worker active.");
  }
  return Promise.resolve();
}
