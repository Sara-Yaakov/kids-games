import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DB_FILE = process.env.DB_FILE ?? resolve(dirname(fileURLToPath(import.meta.url)), '../data/db.json');

let data = { users: [] };
let writeQueue = Promise.resolve();

export async function loadDb() {
  try {
    data = JSON.parse(await readFile(DB_FILE, 'utf8'));
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    await mkdir(dirname(DB_FILE), { recursive: true });
    await persist();
  }
}

// Serialized atomic writes: temp file + rename, so a crash never leaves a half-written DB.
export function persist() {
  writeQueue = writeQueue.then(async () => {
    const tmp = `${DB_FILE}.tmp`;
    await writeFile(tmp, JSON.stringify(data, null, 2));
    await rename(tmp, DB_FILE);
  });
  return writeQueue;
}

export const users = {
  findByUsername: (username) =>
    data.users.find((u) => u.username.toLowerCase() === username.toLowerCase()),
  findById: (id) => data.users.find((u) => u.id === id),
  all: () => data.users,
  async add(user) {
    data.users.push(user);
    await persist();
    return user;
  },
};
