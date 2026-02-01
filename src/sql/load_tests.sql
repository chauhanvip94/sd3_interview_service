CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS load_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INTEGER REFERENCES users(id),
    url VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL,
    total_requests INTEGER NOT NULL,
    concurrency INTEGER NOT NULL,
    headers JSONB,
    payload JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'QUEUED',
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_load_tests_user_id ON load_tests(user_id);
CREATE INDEX idx_load_tests_status ON load_tests(status);
CREATE INDEX idx_load_tests_method ON load_tests(method);
