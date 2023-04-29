import { config as dotenv } from 'dotenv';
import Knex from 'knex';
import conf from '../../knexfile.js';
dotenv();
const environment = process.env.NODE_ENV || 'development';
const config = conf[environment];
const knex = Knex(config);

export default knex;