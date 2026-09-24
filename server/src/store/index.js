import { createJsonStore } from './json.js';
import { createMongoStore } from './mongo.js';

export async function createStore() {
  if (process.env.MONGODB_URI) {
    console.log('Storage: MongoDB');
    return createMongoStore(process.env.MONGODB_URI);
  }
  if (process.env.NODE_ENV === 'production') {
    console.warn('Storage: JSON file. Data is lost on hosts without a persistent disk; set MONGODB_URI.');
  }
  return createJsonStore(process.env.DB_FILE);
}
