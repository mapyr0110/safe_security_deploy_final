export function Toast({ message }) {
  return (
    <div className={`fixed bottom-6 right-6 z-[10000] max-w-sm rounded-full bg-contrast px-5 py-3 text-sm text-contrastText shadow-editorial transition ${message ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
      {message}
    </div>
  );
}
