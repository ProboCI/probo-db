
exports.up = function(knex, Promise) {
  return knex.schema.createTable('build_step', function(table) {
    table.uuid('id').index().unique().notNullable();
    table.uuid('buildId').index().notNullable();
    table.integer('order').notNullable();
    table.text('description');
    table.string('name');
    table.string('plugin');
    // @todo: do we want this to be an enum, or leave it open to more statuses?
    table.string('state');
    table.integer('resultCode');
    table.integer('resultDuration');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('build_step');
};
