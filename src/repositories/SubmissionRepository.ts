import knex from "../configs/database";
import CreateSubmissionDto from "../dtos/CreateSubmissionDto";
import UpdateSubmissionDto from "../dtos/UpdateSubmissionDto";
import UpdateValuationDto from "../dtos/UpdateValuationDto";

class SubmissionRepository {
    // random not use
    randomNotUse = async (random: string) => {
        return await knex('submissions').where({ random }).then((data: string | any) => data.length) !== 0;
    }

    // create
    insert = async (createSubmissionDto: CreateSubmissionDto) => {
        return await knex('submissions').insert(createSubmissionDto);
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
    updateByRandom = async (random: string, updateSubmissionDto: UpdateSubmissionDto) => {
        return await knex('submissions').where({ random }).update(updateSubmissionDto);
    }

    updateValuationByRandom = async (random: string, updateValuationDto: UpdateValuationDto) => {
        return await knex('submissions').where({ random }).update(updateValuationDto);
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