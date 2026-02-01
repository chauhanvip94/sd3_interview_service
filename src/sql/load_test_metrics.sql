CREATE TABLE IF NOT EXISTS load_test_metrics (
    id SERIAL PRIMARY KEY,
    test_id UUID NOT NULL REFERENCES load_tests(id),
    total_requests INTEGER NOT NULL,
    success_count INTEGER NOT NULL,
    error_count INTEGER NOT NULL,
    avg_response_time DECIMAL(10, 2) NOT NULL,
    p95_response_time DECIMAL(10, 2),
    throughput DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_load_test_metrics_test_id ON load_test_metrics(test_id);
