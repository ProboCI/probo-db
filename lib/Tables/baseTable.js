'use strict';

class baseTable {

  constructor(options) {
    this.knex = options.knex;
    this.logger = options.logger;
  }

  idField() {
    return 'uuid';
  }

  uuid() {
    const self = this;
    return self.idField() === 'uuid';
  }

  getRows(filters, options) {
    const self = this;
    const tableName = self.tableName();
    let query = self.knex(tableName);
    if (options.getOne == true) {
      query = query.first();
    }
    for (let key in filters) {
      query = query.where(key, filters[key]);
    }
    return query;
  }

  deleteRow(id, options) {
    const self = this;
    const idField = self.idfield();
    const tableName = self.tableName();
    let query = self.knex(tableName).where({idField: id});
    // @todo: do we use this column?
    /*if (options.safeDelete == 1) {
      return query.update({deleted: 1});
    }*/
    return query.del();
  }
}

module.exports = baseTable;