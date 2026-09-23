import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import rateLimit from 'express-rate-limit';
import { users, persist } from './db.js';
import { signToken, requireAuth } from './auth.js';

export const GAMES = ['animals', 'instruments', 'countries'];
const MAX_POINTS_PER_ROUND = 1000;
const USERNAME_RE = /^[\p{L}\p{N}_ -]{2,20}$/u;

const publicUser = ({ id, username, scores }) => ({
  id,
  username,
  scores,
  total: Object.values(scores).reduce((a, b) => a + b, 0),
});

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 });

export const api = Router();

api.post('/auth/register', authLimiter, async (req, res) => {
  const username = String(req.body?.username ?? '').trim();
  const password = String(req.body?.password ?? '');

  if (!USERNAME_RE.test(username)) {
    return res.status(400).json({ error: 'שם משתמש צריך להיות 2-20 אותיות או מספרים' });
  }
  if (password.length < 4) {
    return res.status(400).json({ error: 'הסיסמה צריכה לפחות 4 תווים' });
  }
  if (users.findByUsername(username)) {
    return res.status(409).json({ error: 'השם הזה כבר תפוס, נסו שם אחר' });
  }

  const user = await users.add({
    id: randomUUID(),
    username,
    passwordHash: await bcrypt.hash(password, 10),
    scores: Object.fromEntries(GAMES.map((g) => [g, 0])),
    createdAt: new Date().toISOString(),
  });
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

api.post('/auth/login', authLimiter, async (req, res) => {
  const user = users.findByUsername(String(req.body?.username ?? '').trim());
  const ok = user && (await bcrypt.compare(String(req.body?.password ?? ''), user.passwordHash));
  if (!ok) return res.status(401).json({ error: 'שם משתמש או סיסמה לא נכונים' });
  res.json({ token: signToken(user), user: publicUser(user) });
});

api.get('/me', requireAuth, (req, res) => {
  const user = users.findById(req.userId);
  if (!user) return res.status(401).json({ error: 'המשתמש לא נמצא' });
  res.json(publicUser(user));
});

api.post('/scores', requireAuth, async (req, res) => {
  const user = users.findById(req.userId);
  const { game } = req.body ?? {};
  const points = Number(req.body?.points);

  if (!user) return res.status(401).json({ error: 'המשתמש לא נמצא' });
  if (!GAMES.includes(game) || !Number.isInteger(points) || points < 0 || points > MAX_POINTS_PER_ROUND) {
    return res.status(400).json({ error: 'ניקוד לא תקין' });
  }

  user.scores[game] += points;
  await persist();
  res.json(publicUser(user));
});

api.get('/leaderboard', (_req, res) => {
  const top = users
    .all()
    .map(publicUser)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
    .map(({ username, total }) => ({ username, total }));
  res.json(top);
});
