import BaseRepository from "./base.repository.js";

class LoadTestRepository extends BaseRepository {
  constructor() {
    super("load_test");
  }

  async create(data) {
    return this.create(data);
  }
}

export default new LoadTestRepository();
