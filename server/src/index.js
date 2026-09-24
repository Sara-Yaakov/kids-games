import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDb, persist } from './db.js';
import { api } from './routes.js';

const PORT = process.env.PORT ?? 3000;
const CLIENT_DIST = resolve(dirname(fileURLToPath(import.meta.url)), '../../client/dist/kids-games/browser');

const app = express();
// Behind the hosting proxy: needed for correct client IPs in rate limiting.
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api', api);

// In production the server also hosts the built Angular app.
if (existsSync(CLIENT_DIST)) {
  app.use(
    express.static(CLIENT_DIST, {
      // Hashed bundles never change; index.html must always be fresh.
      setHeaders: (res, path) => {
        const hashed = /-[A-Za-z0-9_]{8,}\.(js|css)$/.test(path);
        res.setHeader('Cache-Control', hashed ? 'public, max-age=31536000, immutable' : 'no-cache');
      },
    }),
  );
  app.get('/{*path}', (_req, res) => res.sendFile(resolve(CLIENT_DIST, 'index.html')));
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'אופס, משהו השתבש' });
});

await loadDb();
const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Finish pending writes before the platform stops the container.
process.on('SIGTERM', () => server.close(() => persist().finally(() => process.exit(0))));
