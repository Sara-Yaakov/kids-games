# Olam HaChachamim

Educational web games for kids, in Hebrew. Players sign up with a username and password, earn points, and compete on a shared leaderboard.

| Game | Teaches | Mechanic |
|------|---------|----------|
| Safari | Animal names | Match each animal to its name |
| Musical Balloons | Musical instruments | Pop the balloon with the named instrument; some rounds are sound-only |
| Around the World | Countries and continents | Drag each flag to its continent |
| Upside Down | Hebrew opposites | Pick the opposite word; three levels from basic to advanced |

## Stack

- **Client:** Angular 22, Tailwind CSS 4, Angular CDK (drag and drop), canvas-confetti, Web Audio API
- **Server:** Node.js, Express 5, bcrypt, JWT
- **Storage:** a single JSON file (`server/data/db.json`)

## Getting started

Requires Node.js 22.22+ or 24.15+.

```bash
npm install
npm run dev
```

The app runs at http://localhost:4200 and the API at http://localhost:3000.

## Production

The app ships as a single Docker image: the server serves both the API and the built client.

```bash
docker build -t kids-games .
docker run -p 3000:3000 -e JWT_SECRET=<secret> -e MONGODB_URI=<uri> kids-games
```

Storage is a JSON file by default, or MongoDB when `MONGODB_URI` is set. Hosted on the [Render](https://render.com) free tier (`render.yaml`) with a [MongoDB Atlas](https://www.mongodb.com/atlas) free cluster.

| Variable | Default | |
|----------|---------|---|
| `JWT_SECRET` | none | Required in production |
| `MONGODB_URI` | none | Use MongoDB instead of the JSON file |
| `MONGODB_DB` | `kidsgames` | MongoDB database name |
| `DB_FILE` | `server/data/db.json` | JSON file path |
| `PORT` | `3000` | |

## API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | | Create an account |
| POST | `/api/auth/login` | | Sign in |
| GET | `/api/me` | ✓ | Current user and scores |
| POST | `/api/scores` | ✓ | Add points to a game |
| GET | `/api/leaderboard` | | Top 10 players |

## Credits

Illustrations by [OpenMoji](https://openmoji.org), licensed under CC BY-SA 4.0.
