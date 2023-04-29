/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
        table.increments('id').primary();
        table.uuid('random').notNullable().unique();
        table.string('nrp', 10).nullable();
        table.string('nip', 18).nullable();
        table.string('fullname').notNullable();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.string('refresh_token').nullable();
        table.integer('role_id').unsigned().notNullable();
        table.foreign('role_id').references('id').inTable('roles');
        table.boolean('is_active').defaultTo(false);
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
