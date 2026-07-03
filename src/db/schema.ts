export const CREATE_TABLES = `
  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS income (
    id              INTEGER PRIMARY KEY,
    monthly_salary  INTEGER NOT NULL DEFAULT 0,
    other_income    INTEGER NOT NULL DEFAULT 0,
    updated_at      TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS fixed_expenses (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    category    TEXT NOT NULL,
    amount      INTEGER NOT NULL,
    is_active   INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS fixed_expense_payments (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    fixed_expense_id  INTEGER NOT NULL REFERENCES fixed_expenses(id),
    month_key         TEXT NOT NULL,
    is_paid           INTEGER NOT NULL DEFAULT 0,
    paid_at           TEXT,
    UNIQUE(fixed_expense_id, month_key)
  );

  CREATE TABLE IF NOT EXISTS variable_expenses (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    amount      INTEGER NOT NULL,
    category    TEXT NOT NULL,
    priority    TEXT NOT NULL DEFAULT 'medium',
    date        TEXT NOT NULL,
    month_key   TEXT NOT NULL,
    note        TEXT,
    created_at  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS savings_goals (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT NOT NULL,
    target_amount   INTEGER NOT NULL,
    current_amount  INTEGER NOT NULL DEFAULT 0,
    deadline        TEXT,
    is_completed    INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT NOT NULL,
    updated_at      TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS monthly_savings_target (
    id         INTEGER PRIMARY KEY,
    amount     INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS savings_contributions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    goal_id     INTEGER REFERENCES savings_goals(id),
    amount      INTEGER NOT NULL,
    month_key   TEXT NOT NULL,
    note        TEXT,
    created_at  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS monthly_snapshots (
    month_key               TEXT PRIMARY KEY,
    total_income            INTEGER NOT NULL DEFAULT 0,
    fixed_expense_total     INTEGER NOT NULL DEFAULT 0,
    variable_expense_total  INTEGER NOT NULL DEFAULT 0,
    savings_target          INTEGER NOT NULL DEFAULT 0,
    remaining_balance       INTEGER NOT NULL DEFAULT 0,
    updated_at              TEXT NOT NULL
  );
`;

export const CREATE_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_variable_expenses_month ON variable_expenses(month_key);
  CREATE INDEX IF NOT EXISTS idx_variable_expenses_category ON variable_expenses(category);
  CREATE INDEX IF NOT EXISTS idx_fixed_payments_month ON fixed_expense_payments(month_key);
  CREATE INDEX IF NOT EXISTS idx_savings_contributions_goal ON savings_contributions(goal_id);
  CREATE INDEX IF NOT EXISTS idx_savings_contributions_month ON savings_contributions(month_key);
`;

export const DEFAULT_SETTINGS = [
  ['currency_symbol', '$'],
  ['notifications_enabled', '0'],
  ['alert_threshold', '10'],
];
