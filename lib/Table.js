'use strict';

class Table {

  constructor(options) {
    this.db = options.db;
    this.config = options.config;
    this.logger = options.logger;
    this.tablePlugins = options.tablePlugins;
  }

  getPlugin(table) {
    const self = this;
    console.log(table);
    for (let key in self.tablePlugins) {
      console.log(self.tablePlugins[key].constructor.name);
      console.log('there');
      
      if (self.tablePlugins[key].constructor.name == table) {
        console.log('good');
        
        return self.tablePlugins[key];
      }
    }
    const error = Error(table + ' is not a valid object type.');
    self.logger.error(error);
  }

  getSchema(table) {
    const self = this;
    const plugin = self.getPlugin(table);
    return plugin.schema();
  }

  getTableName(table) {
    const self = this;
    const plugin = self.getPlugin(table);
    return plugin.tableName();
  }

  getIdField(table) {
    const self = this;
    const plugin = self.getPlugin(table);
    return plugin.idField();
  }

  mapData(table, data) {
    const schema = self.getSchema(table);
    for (let key in data) {
      if (!inArray(key, schema)) {
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

module.exports = Table;
