'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: 40,
          fontFamily: 'monospace', background: '#F8FAFC', color: '#0F172A',
        }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Fatal Error</h1>
          <p style={{ fontSize: 14, color: '#64748B', marginBottom: 20, textAlign: 'center', maxWidth: 500 }}>
            A critical error occurred. Details below:
          </p>
          <div style={{
            background: '#FFF0F0', border: '1px solid #FECACA', borderRadius: 12,
            padding: '16px 20px', maxWidth: 600, width: '100%', marginBottom: 20,
            fontSize: 13, color: '#991B1B', wordBreak: 'break-word',
          }}>
            <strong>Error:</strong> {error.name}: {error.message}
            {error.digest && <><br/><strong>Digest:</strong> {error.digest}</>}
            {error.stack && <><br/><br/><strong>Stack:</strong><pre style={{ fontSize: 11, marginTop: 8, whiteSpace: 'pre-wrap' }}>{error.stack}</pre></>}
          </div>
          <button onClick={reset} style={{
            padding: '10px 24px', borderRadius: 10, border: 'none',
            background: '#6366F1', color: 'white', fontWeight: 600,
            cursor: 'pointer', fontSize: 14, fontFamily: 'inherit',
          }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
