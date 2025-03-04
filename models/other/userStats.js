import db from '../config/db.js';

class userStats {
  static async connect() { //Sprawdzanie czy serwer jest połączony z DB, jeśli nie to połącz
    if (!db._connected) {
      await db.connect();
    }
  }

}

export default userStats;
