import fs from "fs";
import { promisify } from "util"
import AssignmentRepository from "../repositories/AssignmentRepository";
import SubmissionRepository from "../repositories/SubmissionRepository";
import BaseService from "./BaseService";
import ResponseFormat from "../utils/ResponseFormat";
import updateAssignmentDto from "../dtos/UpdateAssignmentDto";

class AssignmentService extends BaseService {
    getAll = async (): Promise<ResponseFormat> => {
        const assignments = await AssignmentRepository.getAll();
        return ResponseFormat.resource(200, "Success get all assignments", assignments)
    }

    store = async (): Promise<ResponseFormat> => {
        const unlinkSync = promisify(fs.unlink)
        const storeData = this.convertDataToCreateAssignmentData(this.body)
        const random = await this.loopingRandomField(AssignmentRepository);
        const fileName = await this.checkFileAvailable(this.file)
        storeData.random = random
        storeData.file = fileName
        storeData.user_id = this.user.id
        const assignment = await AssignmentRepository.insert(storeData);
        return ResponseFormat.resource(200, "Success create assignment", { id: assignment[0], ...storeData })
    }

    convertDataToCreateAssignmentData = (data: any): any => {
        return {
            random: data.random,
            title: data.title,
            description: data.description,
            deadline: data.deadline,
            file: data.file ?? null,
            user_id: data.user_id ?? null
        }
    }

    getMyAssignments = async (): Promise<ResponseFormat> => {
        const assignments = await AssignmentRepository.getMyAssignments(this.user.id);
        return ResponseFormat.resource(200, "Success get my assignments", assignments)
    }

    getOne = async (): Promise<ResponseFormat> => {
        const assignment = await AssignmentRepository.findByRandom(this.params.random);
        return ResponseFormat.resource(200, "Success get assignment", assignment)
    }

    update = async (): Promise<ResponseFormat> => {
        const unlinkSync = promisify(fs.unlink)
        try {
            const updateData = this.convertDataToUpdateAssignmentData(this.body)
            const asg = await AssignmentRepository.findByRandom(this.params.random)
            await this.checkAssignmentAvailable(asg, unlinkSync)
            const fileName = await this.checkFileAvailable(this.file)
            await AssignmentRepository.updateByRandom(this.params.random, {...updateData, file: fileName});
            await unlinkSync('public/uploads/assignments/' + asg.file)
            return ResponseFormat.success(201, "Success update assignment")
        } catch(error: any) {
            await unlinkSync('public/uploads/assignments/' + this.file?.filename)
            return ResponseFormat.error(500, "Internal Server Error")
        }
    }

    convertDataToUpdateAssignmentData = (data: any): any => {
        return {
            title: data.title,
            description: data.description,
            deadline: data.deadline
        }
    }

    delete = async (): Promise<ResponseFormat> => {
        const unlinkSync = promisify(fs.unlink)
        const assignment = await AssignmentRepository.findByRandom(this.params.random)
        const submissions = await SubmissionRepository.getsByAssignmentId(assignment.id)
        await this.checkSubmissionAvailable(submissions, unlinkSync)
        await unlinkSync('public/uploads/assignments/' + assignment.file)
        await AssignmentRepository.deleteById(assignment.id);
        return ResponseFormat.success(201, "Success delete assignment")
    }

    checkSubmissionAvailable = async (submissions: any, unlink: any) => {
        if (submissions.length != 0) {
            await Promise.all(submissions.map(async (submission: any) => {
                await unlink('public/uploads/submissions/' + submission.file)
                await SubmissionRepository.deleteById(submission.id)
            }))
        }
    }
}

export default AssignmentService;