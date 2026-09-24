import { MongoClient } from 'mongodb';

/** MongoDB (e.g. Atlas free tier) for hosts without a persistent disk. */
export async function createMongoStore(uri) {
  const client = new MongoClient(uri);
  await client.connect();
  const col = client.db(process.env.MONGODB_DB ?? 'kidsgames').collection('users');

  await Promise.all([
    col.createIndex({ usernameLower: 1 }, { unique: true }),
    col.createIndex({ total: -1 }),
  ]);

  // Documents use _id and helper fields internally; callers see the same shape as the JSON store.
  const toUser = (doc) =>
    doc && { id: doc._id, username: doc.username, passwordHash: doc.passwordHash, scores: doc.scores };

  return {
    async findByUsername(username) {
      return toUser(await col.findOne({ usernameLower: username.toLowerCase() }));
    },
    async findById(id) {
      return toUser(await col.findOne({ _id: id }));
    },
    async add({ id, ...user }) {
      try {
        await col.insertOne({ _id: id, ...user, usernameLower: user.username.toLowerCase(), total: 0 });
        return true;
      } catch (err) {
        if (err.code === 11000) return false; // duplicate username
        throw err;
      }
    },
    async addPoints(id, game, points) {
      const doc = await col.findOneAndUpdate(
        { _id: id },
        { $inc: { [`scores.${game}`]: points, total: points } },
        { returnDocument: 'after' },
      );
      return toUser(doc);
    },
    async top(limit) {
      return col
        .find({}, { projection: { _id: 0, username: 1, total: 1 } })
        .sort({ total: -1 })
        .limit(limit)
        .toArray();
    },
    close: () => client.close(),
  };
}
