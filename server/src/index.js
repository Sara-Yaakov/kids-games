import express from 'express';
import helmet from 'helmet';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDb } from './db.js';
import { api } from './routes.js';

const PORT = process.env.PORT ?? 3000;
const CLIENT_DIST = resolve(dirname(fileURLToPath(import.meta.url)), '../../client/dist/kids-games/browser');

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '10kb' }));
app.use('/api', api);

// In production the server also hosts the built Angular app.
if (existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('/{*path}', (_req, res) => res.sendFile(resolve(CLIENT_DIST, 'index.html')));
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'אופס, משהו השתבש' });
});

await loadDb();
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
