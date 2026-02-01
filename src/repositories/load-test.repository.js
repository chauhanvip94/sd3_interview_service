import { LOAD_TEST_STATUS } from "../constant/load-test.constant.js";
import BaseRepository from "./base.repository.js";

class LoadTestRepository extends BaseRepository {
  constructor() {
    super("LoadTest");
  }

  async findByUserId(userId) {
    return this.repository.find({ where: { userId } });
  }

  async findWithFilters(filters) {
    const queryBuilder = this.repository.createQueryBuilder("loadTest")
      .leftJoinAndSelect("loadTest.metrics", "metrics");

    if (filters.method) {
      queryBuilder.andWhere("loadTest.method = :method", { method: filters.method.toUpperCase() });
    }

    if (filters.url) {
      queryBuilder.andWhere("loadTest.url ILIKE :url", { url: `%${filters.url}%` });
    }

    if (filters.userId) {
      queryBuilder.andWhere("loadTest.userId = :userId", { userId: filters.userId });
    }

    if (filters.status) {
      queryBuilder.andWhere("loadTest.status = :status", { status: filters.status });
    }

    if (filters.minErrorRate !== undefined) {
      queryBuilder.andWhere(
        "(metrics.error_count::float / NULLIF(metrics.total_requests, 0) * 100) >= :minErrorRate",
        { minErrorRate: filters.minErrorRate }
      );
    }

    if (filters.maxErrorRate !== undefined) {
      queryBuilder.andWhere(
        "(metrics.error_count::float / NULLIF(metrics.total_requests, 0) * 100) <= :maxErrorRate",
        { maxErrorRate: filters.maxErrorRate }
      );
    }

    if (filters.minThroughput !== undefined) {
      queryBuilder.andWhere("metrics.throughput >= :minThroughput", { minThroughput: filters.minThroughput });
    }

    if (filters.maxThroughput !== undefined) {
      queryBuilder.andWhere("metrics.throughput <= :maxThroughput", { maxThroughput: filters.maxThroughput });
    }

    return queryBuilder.getMany();
  }

  async findByIdWithMetrics(id) {
    return this.repository.createQueryBuilder("loadTest")
      .leftJoinAndSelect("loadTest.metrics", "metrics")
      .where("loadTest.id = :id", { id })
      .getOne();
  }

  async updateLoadTest({id, status, startedAt, completedAt}) {
    if (status && !Object.values(LOAD_TEST_STATUS).includes(status)) {
      throw new Error("Invalid status value");
    }
    const data = {}
    if(status){
      data.status = status
    }
    if(startedAt){
      data.startedAt = startedAt
    }
    if(completedAt){
      data.completedAt = completedAt
    }

    return this.repository.update(id, data);
  }
}

export default new LoadTestRepository();
