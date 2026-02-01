CREATE DATABASE sd3_interview;

\c sd3_interview;

\i users.sql
\i load_tests.sql
\i load_test_metrics.sql

INSERT INTO users (name, email, phone_number) VALUES
('SD3 Test User', 'sd3Test@example.com', '1234567890');
