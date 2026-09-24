import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_FILE = resolve(dirname(fileURLToPath(import.meta.url)), '../../data/db.json');

/** Single JSON file. Zero setup for local development. */
export async function createJsonStore(file = DEFAULT_FILE) {
  let data = { users: [] };
  let writeQueue = Promise.resolve();

  // Serialized atomic writes: temp file + rename, so a crash never leaves a half-written file.
  const persist = () => {
    writeQueue = writeQueue.then(async () => {
      const tmp = `${file}.tmp`;
      await writeFile(tmp, JSON.stringify(data, null, 2));
      await rename(tmp, file);
    });
    return writeQueue;
  };

  try {
    data = JSON.parse(await readFile(file, 'utf8'));
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    await mkdir(dirname(file), { recursive: true });
    await persist();
  }

  const total = (u) => Object.values(u.scores).reduce((a, b) => a + b, 0);

  return {
    async findByUsername(username) {
      return data.users.find((u) => u.username.toLowerCase() === username.toLowerCase()) ?? null;
    },
    async findById(id) {
      return data.users.find((u) => u.id === id) ?? null;
    },
    /** Returns false if the username is taken. */
    async add(user) {
      if (await this.findByUsername(user.username)) return false;
      data.users.push(user);
      await persist();
      return true;
    },
    async addPoints(id, game, points) {
      const user = await this.findById(id);
      if (!user) return null;
      user.scores[game] = (user.scores[game] ?? 0) + points;
      await persist();
      return user;
    },
    async top(limit) {
      return data.users
        .map((u) => ({ username: u.username, total: total(u) }))
        .sort((a, b) => b.total - a.total)
        .slice(0, limit);
    },
    close: () => persist(),
  };
}
