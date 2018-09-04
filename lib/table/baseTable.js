'use strict';

const uuidv4 = require('uuid/v4');

class baseTable {

  constructor(options) {
    this.knex = options.knex;
    this.logger = options.logger;
  }

  tableName() {
    return '';
  }

  schema() {
    return [];
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
    let query = self.knex(self.tableName());
    if (options.getOne == true) {
      query = query.first();
    }
    for (let key in filters) {
      query = query.where(key, filters[key]);
    }
    return query;
  }

  deleteRows(filters, options) {
    const self = this;
    let query = self.knex(self.tableName());
    for (let key in filters) {
      query = query.where(key, filters[key]);
    }
    // @todo: do we use this column?
    /*if (options.safeDelete == 1) {
      return query.update({deleted: 1});
    }*/
    return query.del();
  }

  addRows(rows) {
    const self = this;
    const idField = self.idField();
    let data = [];
    for (let i in rows) {
      let row = self.mapData(rows[i]);
      if (self.uuid() === true) {
        if (!row[idField]) {
          row[idField] = uuidv4();
        }
      }
      data.push(row);
    }

    // This returns the id of the created rows.
    return self.knex(self.tableName())
      .returning(self.idField())
      .insert(rows);
  }

  updateRows(filters, data) {
    const self = this;
    let query = self.knex(self.tableName());
    data = self.mapData(data);

    for (let key in filters) {
      query = query.where(key, filters[key]);
    }
    return query.update(data);
  }

  mapData(data) {
    const self = this;
    const schema = self.schema();
    for (let key in data) {
      if (!self.inArray(key, schema)) {
        delete data[key];
      }
    }    
    return data;
  }

  inArray(needle, haystack) {
    const length = haystack.length;
    for (let i = 0; i < length; i++) {
      if (haystack[i] == needle) {
        return true;
      }
    }
    return false;
  }
}

module.exports = baseTable;