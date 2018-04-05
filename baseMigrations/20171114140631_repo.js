
exports.up = function(knex, Promise) {
  return knex.schema.createTable('repo', function(table) {
    table.increments();
    table.uuid('uuid').index().unique().notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();
    table.string('name');
    table.boolean('active').notNullable().defaultTo(true);
    table.boolean('private').notNullable().defaultTo(true);
    table.text('description');
    table.bigInteger('ownerId').defaultTo(0);
    table.string('ownerUsername');
    table.string('providerSlug');
    table.string('providerType').notNullable();
    table.bigInteger('providerId').notNullable().defaultTo(0);
    table.string('slug');
    table.text('url');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('repo');
};
