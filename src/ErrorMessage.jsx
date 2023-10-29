export function ErrorMessage({ error }) {
  return (
    <div className="error">
      <span>⛔</span>
      {error}
    </div>
  );
}
