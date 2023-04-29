/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('submissions', function(table) {
        table.increments('id');
        table.string('random').notNullable();
        table.integer('assignment_id').unsigned().notNullable();
        table.foreign('assignment_id').references('id').inTable('assignments').onDelete('CASCADE');
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.string('file').notNullable();
        table.text('message').notNullable();
        table.float('score').notNullable().defaultTo(0);
        table.enum('status', ['pending', 'approved', 'rejected']).notNullable().defaultTo('pending');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('submissions');
};
