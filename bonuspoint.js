/*** 
Use horizontal scaling by deploying multiple worker instances on different servers

BullMQ supports distributed workers, so multiple workers can pick jobs from the same queue

Each worker executes load tests independently

Add rate limiting per test using p-queue to control concurrency and RPS

const queue = new PQueue({
  concurrency: 100,
  interval: 1000,
  intervalCap: 500 // 500 requests per second per test
});


This avoids overloading workers and protects target APIs

Use Redis Cluster for BullMQ, caching, and real-time progress updates

Use TimescaleDB (Postgres extension) for high-volume metrics insertion

TimescaleDB handles high write throughput better than plain Postgres

For 5M requests → 50 worker nodes, Postgres (2–3 replicas) or TimescaleDB

For 10M requests → 100 worker nodes, Postgres (4–6 replicas) or TimescaleDB

Scale workers based on queue depth and system load

**/