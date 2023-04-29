import knex from "../configs/database";

class SubmissionRepository {
    // random not use
    randomNotUse = async (random: string) => {
        return await knex('submissions').where({ random }).then((data: string | any) => data.length) !== 0;
    }

    // create
    insert = async (random: string, message: string, file: string, assignment_id: number, user_id: number) => {
        return await knex('submissions').insert({ random, message, file, assignment_id, user_id });
    }

    // read
    findByRandom = async (random: string) => {
        return await knex('submissions').where({ random }).first();
    }

    getsByAssignmentId = async (assignment_id: number) => {
        return await knex('submissions').where({ assignment_id });
    }

    getOneByAssignmentIdAndUserId = async (assignment_id: number, user_id: number) => {
        return await knex('submissions').where({ assignment_id }).andWhere({ user_id }).first();
    }

    // update
    updateByRandom = async (random: string, message: string, file: string) => {
        return await knex('submissions').where({ random }).update({ message, file });
    }

    updateValuationByRandom = async (random: string, score: number, status: string) => {
        return await knex('submissions').where({ random }).update({ score, status });
    }

    // delete
    deleteById = async (id: number) => {
        return await knex('submissions').where({ id }).del();
    }

    deleteByRandom = async (random: string) => {
        return await knex('submissions').where({ random }).del();
    }
}

export default new SubmissionRepository();