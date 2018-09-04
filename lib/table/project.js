'use strict';

const baseTable = require('./baseTable');

class project extends baseTable {

  tableName() {
    return 'project';
  }

  schema() {
    return [
      'id',
      'uuid',
      'createdat',
      'updatedAt',
      'name',
      'active',
      'owner',
      'providerSlug',
      'providerType',
      'providerUrl',
      'providerId',
      'slug',
      'repo',
      'repoId',
      'serviceAuth',
      'assetsBucket',
      'assetsTokens'
    ];
  }
}

module.exports = project;