import knex from "../configs/database";
import CreateAssignmentDto from "../dtos/CreateAssignmentDto";
import UpdateAssignmentDto from "../dtos/UpdateAssignmentDto";

class AssignmentRepository {
    // random not use
    randomNotUse = async (random: string) => {
        return await knex('assignments').where({ random }).then((data: string | any) => data.length) !== 0;
    }

    // id not use
    assignmentIdNotAvailable = async (id: number) => {
        return await knex('assignments').where({ id }).then((data: string | any) => data.length) !== 0;
    }

    // create
    insert = async (assignmentDto: CreateAssignmentDto) => {
        return await knex('assignments').insert(assignmentDto);
    }

    // read
    getAll = async () => {
        return await knex('assignments');
    }

    getMyAssignments = async (user_id: number) => {
        return await knex('assignments').where({ user_id });
    }

    findByRandom = async (random: string) => {
        return await knex('assignments').where({ random }).first();
    }

    findByIdAndUserId = async (id: number, user_id: number) => {
        return await knex('assignments').where({ user_id }).andWhere({ id }).first();
    }

    // update
    updateByRandom = async (random: string, updateAssignmentDto: UpdateAssignmentDto) => {
        return await knex('assignments').where({ random }).update(updateAssignmentDto);
    }
    
    // delete
    deleteById = async (id: number) => {
        return await knex('assignments').where({ id }).del();
    }
}

export default new AssignmentRepository();