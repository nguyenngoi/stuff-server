class AdapterTask {
  constructor(repository) {
    this.repository = repository;
  }
  async getAll(param) {
    try {
      return await this.repository
        .getAll(param);
    } catch (error) {
      throw error;
    }
  }
  async getDetail(id) {
    try {
      return await this.repository
        .getDetail(id);
    } catch (error) {
      throw error;
    }
  }
  async create(param) {
    try {
      return await this.repository
        .create(param);
    } catch (error) {
      throw error;
    }
  }
  async delete(id) {
    try {
      return await this.repository
        .delete(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AdapterTask;