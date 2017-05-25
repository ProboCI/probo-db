'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('project_build', function(table) {
    table.uuid('projectId').index().notNullable();
    table.uuid('buildId').index().notNullable();
    table.unique(['projectId', 'buildId']);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('project_build');
};
