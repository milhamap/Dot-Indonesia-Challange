const { v4: uuid4 } = require('uuid')
const bcrypt = require('bcrypt');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash('elearning@admin.com', salt);
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      id: 1, 
      random: uuid4(), 
      fullname: 'Admin E Learning', 
      email: 'admin@elearning.com', 
      password: hashedPassword,
      role_id: 1,
      is_active: true
    }
  ]);
};
