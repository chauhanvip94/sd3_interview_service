import { EntitySchema } from "typeorm";

const LoadTestMetrics = new EntitySchema({
  name: "LoadTestMetrics",
  tableName: "load_test_metrics",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    testId: {
      name: "test_id",
      type: "uuid",
    },
    totalRequests: {
      name: "total_requests",
      type: "int",
    },
    successCount: {
      name: "success_count",
      type: "int",
    },
    errorCount: {
      name: "error_count",
      type: "int",
    },
    avgResponseTime: {
      name: "avg_response_time",
      type: "decimal",
      precision: 10,
      scale: 2,
    },
    p95ResponseTime: {
      name: "p95_response_time",
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: true,
    },
    throughput: {
      type: "decimal",
      precision: 10,
      scale: 2,
    },
    createdAt: {
      name: "created_at",
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    loadTest: {
      type: "one-to-one",
      target: "LoadTest",
      joinColumn: {
        name: "test_id",
        referencedColumnName: "id",
      },
      inverseSide: "metrics",
    },
  },
});

export default LoadTestMetrics;
