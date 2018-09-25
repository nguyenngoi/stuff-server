class MongoAdapterRepository {
  constructor(model, mapper) {
    this.model = model;
    this.mapper = mapper;
  }

  /**
   * get list data with limit and page
   *
   * @param {Object} param
   * @returns {Array} [Item]
   * @memberof MongoAdapterRepository
   */
  async getAll({ limit = 10, page = 0, sort = 'created_at', direction = '-1' }, populate, query = {}) {
    try {
      let sortTemp = sort.split(',');
      let direct = direction.split(',');
      let sortObj = {};
      sortTemp.forEach((s, i) => {
        try {
          if (s) {
            sortObj[s] = direct[i] ? Number.parseInt(direct[i]) : 1;
          }
        } catch (error) {
          throw error;
        }
      });
      limit = typeof limit == 'string' ? Number.parseInt(limit) : limit;
      page = typeof page == 'string' ? Number.parseInt(page) : page;

      let find = this.model
        .find(query)
        .sort(sortObj)
        .limit(limit)
        .skip(page);

      if (populate && populate.length) {
        populate.forEach(value => {
          find.populate(value);
        });
      }
      let resps = await find.lean();

      if (!resps.length) {
        return resps;
      }
      return resps.map(this.toEntity.bind(this));
    } catch (error) {
      throw error;
    }
  }

  /**
   * get detail by _id
   *
   * @param {String} _id
   * @returns {Object} Item
   * @memberof MongoAdapterRepository
   */
  async getDetail(_id, populate) {
    try {
      let find = this.model
        .findOne({ _id });
      if (populate && populate.length) {
        populate.forEach(value => {
          find.populate(value);
        });
      }
      let resp = await find.lean();

      if (!resp) {
        return resp;
      }
      return this.toEntity(resp);
    } catch (error) {
      throw error;
    }
  }

  /**
   * create new Item
   *
   * @param {Object} param
   * @returns {Object} Item
   * @memberof MongoAdapterRepository
   */
  async create(param) {
    try {
      const resp = await this.model
        .create(param);
      return this.toEntity(resp.toJSON());
    } catch (error) {
      throw error;
    }
  }

  /**
   * delete one Item by _id
   *
   * @param {String} _id
   * @returns {String} _id
   * @memberof MongoAdapterRepository
   */
  async delete(_id) {
    try {
      const { n } = await this.model
        .deleteOne({ _id });
      if (n == 1) {
        return _id;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  toEntity(data, refs) {
    if (!data) {
      return data;
    }
    let tmpData = Object.assign({}, data);
    if (refs && refs.length) {
      refs.forEach(ref => {
        if (tmpData[ref]) {
          tmpData[ref] = this.configDataForToEntity(tmpData[ref]);
        }
      });
    }
    return this.mapper.toEntity({
      ...this.configDataForToEntity(tmpData),
    });
  }

  configDataForToEntity(param) {
    if (!param) {
      return param;
    }
    if (!param._id
      && !param.created_at
      && !param.updated_at
    ) {
      return param;
    }
    let id = param._id.toHexString();
    let created_at = new Date(param.created_at).getTime();
    let updated_at = new Date(param.updated_at).getTime();
    let obj = { id, created_at, updated_at };
    if (param.status) {
      obj.status = param.status == 1 ? 'Active' : 'Deactive';
    }
    return {
      ...param,
      ...obj,
    };
  }
}

module.exports = MongoAdapterRepository;