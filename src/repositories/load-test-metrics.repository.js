import BaseRepository from "./base.repository.js";

class LoadTestMetricsRepository extends BaseRepository {
  constructor() {
    super("LoadTestMetrics");
  }

  async findByTestId(testId) {
    return this.findOne({ testId });
  }
}

export default new LoadTestMetricsRepository();
