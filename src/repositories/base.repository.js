import database from "../config/database.js";

class BaseRepository {
  constructor(entityName) {
    this.entityName = entityName;
  }

  get repository() {
    return database.getRepository(this.entityName);
  }

  async findAll() {
    return this.repository.find();
  }

  async findById(id) {
    return this.repository.findOneBy({ id });
  }

  async findOne(where) {
    return this.repository.findOneBy(where);
  }

  async create(data) {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id, data) {
    const entity = await this.findById(id);
    if (!entity) return null;
    this.repository.merge(entity, data);
    return this.repository.save(entity);
  }

  async delete(id) {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}

export default BaseRepository;
