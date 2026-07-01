import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES, CREATE_INDEXES, DEFAULT_SETTINGS } from './schema';
import { DB_VERSION } from '../constants/thresholds';
import { nowISO } from '../utils/dateUtils';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDb(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('salary_manager.db');

  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion < DB_VERSION) {
    await db.execAsync(CREATE_TABLES);
    await db.execAsync(CREATE_INDEXES);

    for (const [key, value] of DEFAULT_SETTINGS) {
      await db.runAsync(
        'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?);',
        [key, value]
      );
    }

    // Seed income row
    await db.runAsync(
      'INSERT OR IGNORE INTO income (id, monthly_salary, other_income, updated_at) VALUES (1, 0, 0, ?);',
      [nowISO()]
    );

    // Seed monthly savings target row
    await db.runAsync(
      'INSERT OR IGNORE INTO monthly_savings_target (id, amount, updated_at) VALUES (1, 0, ?);',
      [nowISO()]
    );

    await db.execAsync(`PRAGMA user_version = ${DB_VERSION};`);
  }

  return db;
}

export function getDb(): SQLite.SQLiteDatabase {
  if (!db) throw new Error('Database not initialized. Call initDb() first.');
  return db;
}
