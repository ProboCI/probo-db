'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('build', function(table) {
    table.increments();
    table.uuid('buildId').index().unique().notNullable();
    table.uuid('requestId').index().notNullable();
    table.uuid('projectId').index().notNullable();
    table.dateTime('timeStarted').notNullable();
    table.dateTime('timeUpdated').notNullable();
    table.bigInteger('bytesVirtual').notNullable().defaultTo(0);
    table.bigInteger('bytesReal').notNullable().defaultTo(0);
    table.json('config');
    table.string('branchName');
    table.string('branchUrl');
    table.string('commitUrl');
    table.string('commitRef');
    table.string('prDescription');
    table.string('prUrl');
    table.string('prName');
    table.string('prNumber');
    table.boolean('reaped').notNullable().defaultTo(false);
    table.integer('reapedReason').index();
    table.string('reapedReasonText');
    table.dateTime('reapedDate');
    table.boolean('pinned').notNullable().defaultTo(false);
    table.enu('statusSubmitted', ['pending', 'submitted', 'error', 'paused']).notNullable().defaultTo('pending');
    table.enu('statusBuild', ['pending', 'running', 'error', 'success']).notNullable().defaultTo('pending');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('build');
};