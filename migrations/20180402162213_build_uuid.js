'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('build', function(table) {
    table.renameColumn('buildId', 'uuid');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('build', function(table) {
    table.renameColumn('uuid', 'buildId');
  });
};  