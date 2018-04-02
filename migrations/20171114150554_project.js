
exports.up = function(knex, Promise) {
  return knex.schema.createTable('project', function(table) {
    table.increments();
    table.uuid('uuid').index().unique().notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();
    table.string('name');
    table.boolean('active').notNullable().defaultTo(true);
    table.string('owner');
    table.string('providerSlug');
    table.string('providerType').notNullable();
    // Note: this is for stash
    table.string('providerUrl');
    table.bigInteger('providerId').notNullable().defaultTo(0);
    table.string('slug');
    // @todo: why is this here?  Shouldn't projectId be on a repo or have multiple repoIds or have separate table?
    table.string('repo').notNullable();
    table.uuid('repoId').index().notNullable();
    table.json('serviceAuth');
    table.string('assetsBucket');
    table.json('assetsTokens');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('project');
};
