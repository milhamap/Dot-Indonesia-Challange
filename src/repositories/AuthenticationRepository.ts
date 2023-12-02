import knex from "../configs/database";
import RegisterLectureDto from "../dtos/RegisterLectureDto";
import RegisterStudentDto from "../dtos/RegisterStudentDto";

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
    insertLecturer = async (userLectureDto: RegisterLectureDto) => {
        return await knex('users').insert({
            ...userLectureDto,
            role_id: 2,
            is_active: true
        });
    }

    insertStudent = async (userStudentDto: RegisterStudentDto) => {
        return await knex('users').insert({
            ...userStudentDto,
            role_id: 3
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
}

export default new AuthenticationRepository();