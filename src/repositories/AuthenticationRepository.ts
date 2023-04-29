import knex from "../configs/database";

class AuthenticationRepository {
    // random not use
    randomNotUse = async (random: string) => {
        return await knex('users').where({ random }).then((data: string | any) => data.length) !== 0;
    }

    // email or nip not use
    emailOrNipNotUse = async (email: string, nip: string) => {
        return await knex('users').where('email', email).orWhere('nip', nip).then((data: string | any) => data.length) !== 0;
    }

    emailOrNrpNotUse = async (email: string, nrp: string) => {
        return await knex('users').where('email', email).orWhere('nrp', nrp).then((data: string | any) => data.length) !== 0;
    }

    // create
    insertLecturer = async (nip: string, fullname: string, email: string, password: string, random: string) => {
        return await knex('users').insert({
            nip,
            fullname,
            email,
            password,
            role_id: 2,
            random,
            is_active: true
        });
    }

    insertStudent = async (nrp: string, fullname: string, email: string, password: string, random: string) => {
        return await knex('users').insert({
            nrp,
            fullname,
            email,
            password,
            role_id: 3,
            random
        });
    }

    // read
    findByEmail = async (email: string) => {
        return await knex('users').where({ email }).first();
    }

    findByRefreshToken = async (refresh_token: string) => {
        return await knex('users').where({ refresh_token }).first();
    }

    findById = async (id: number) => {
        return await knex('users').where({ id }).first();
    }

    // update
    updateActiveByEmail = async (email: string) => {
        return await knex('users').where({ email }).update({ is_active: true });
    }

    updateRefreshTokenById = async (id: number, refresh_token: string | null = null) => {
        return await knex('users').where({ id }).update({ refresh_token });
    }

    updatePasswordById = async (id: number, password: string) => {
        return await knex('users').where({ id }).update({ password });
    }

    // delete

    
}

export default new AuthenticationRepository();