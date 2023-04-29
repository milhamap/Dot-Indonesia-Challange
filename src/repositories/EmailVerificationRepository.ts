import knex from "../configs/database";

class EmailVerficationRepository {
    // token not use
    tokenNotUse = async (token: string) => {
        return await knex('email_verifications').where({ token }).then((data: string | any) => data.length) !== 0;
    }

    // create
    insert = async (email: string, token: string) => {
        return await knex('email_verifications').insert({ email, token });
    }    

    // read
    findByEmail = async (email: string) => {
        return await knex('email_verifications').where({ email }).first();
    }

    findByToken = async (token: string) => {
        return await knex('email_verifications').where({ token }).first();
    }

    // update
    updateTokenByEmail = async (email: string, token: string) => {
        return await knex('email_verifications').where({ email }).update({ token });
    }

    updateStatusByToken = async (token: string) => {
        return await knex('email_verifications').where({ token }).update({ status: true });
    }
}

export default new EmailVerficationRepository();