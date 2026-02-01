import { EntitySchema } from "typeorm";

export const LoadTestStatus = {
  QUEUED: "QUEUED",
  RUNNING: "RUNNING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

const LoadTest = new EntitySchema({
  name: "LoadTest",
  tableName: "load_tests",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    userId: {
      name: "user_id",
      type: "int",
      nullable: true,
    },
    url: {
      type: "varchar",
      length: 500,
    },
    method: {
      type: "varchar",
      length: 10,
    },
    totalRequests: {
      name: "total_requests",
      type: "int",
    },
    concurrency: {
      type: "int",
    },
    headers: {
      type: "jsonb",
      nullable: true,
    },
    payload: {
      type: "jsonb",
      nullable: true,
    },
    status: {
      type: "varchar",
      length: 20,
      default: "QUEUED",
    },
    startedAt: {
      name: "started_at",
      type: "timestamp",
      nullable: true,
    },
    completedAt: {
      name: "completed_at",
      type: "timestamp",
      nullable: true,
    },
    createdAt: {
      name: "created_at",
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      name: "updated_at",
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
      },
      nullable: true,
    },
    metrics: {
      type: "one-to-one",
      target: "LoadTestMetrics",
      inverseSide: "loadTest",
    },
  },
});

export default LoadTest;
