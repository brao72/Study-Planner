CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  title       TEXT      NOT NULL,
  due_date    DATE      NOT NULL,
  status      TEXT      NOT NULL
            CHECK (status IN ('backlog','in-progress','done')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
