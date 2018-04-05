'use strict';

const baseTable = require('./baseTable');

class build extends baseTable {

  tableName() {
    return 'build';
  }

  schema() {
    return [
      'id',
      'uuid',
      'createdAt',
      'updatedAt',
      'name',
      'active',
      'private',
      'description',
      'ownerId',
      'ownerUsername',
      'providerSlug',
      'providerType',
      'providerId',
      'slug',
      'url'
    ];
  }
}

module.exports = build;