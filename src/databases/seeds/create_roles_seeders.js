const { v4: uuid4 } = require('uuid')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('roles').del()
  await knex('roles').insert([
    {id: 1, random: uuid4(), name: 'Admin'},
    {id: 2, random: uuid4(), name: 'Lecturer'},
    {id: 3, random: uuid4(), name: 'Student'}
  ]);
};
