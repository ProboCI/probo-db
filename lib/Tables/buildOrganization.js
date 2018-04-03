'use strict';

const baseTable = require('./baseTable');

class buildOrganization extends baseTable {

  tableName() {
    return 'build_organization';
  }

  schema() {
    return [
      'id',
      'buildId',
      'organizationId'
    ];
  }

  idField() {
    return 'id';
  }
}

module.exports = buildOrganization;