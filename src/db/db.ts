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

    // v2: add priority column to variable_expenses for pre-existing databases.
    // CREATE TABLE above uses IF NOT EXISTS, so it never alters an existing table.
    await ensureColumn(db, 'variable_expenses', 'priority', "TEXT NOT NULL DEFAULT 'medium'");

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

async function ensureColumn(
  database: SQLite.SQLiteDatabase,
  table: string,
  column: string,
  definition: string
): Promise<void> {
  const cols = await database.getAllAsync<{ name: string }>(`PRAGMA table_info(${table});`);
  if (!cols.some((c) => c.name === column)) {
    await database.execAsync(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition};`);
  }
}

export function getDb(): SQLite.SQLiteDatabase {
  if (!db) throw new Error('Database not initialized. Call initDb() first.');
  return db;
}
