"use client";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ padding: "2rem", textAlign: "center", fontFamily: "sans-serif" }}>
          <h1>Something went wrong</h1>
          <p>The app hit an unexpected error. Please try reloading the page.</p>
          {error.digest ? (
            <p style={{ color: "#666", fontSize: "0.875rem" }}>Error reference: {error.digest}</p>
          ) : null}
        </div>
      </body>
    </html>
  );
}