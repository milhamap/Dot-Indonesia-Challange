import fs from "fs";
import { promisify } from "util"
import AssignmentRepository from "../repositories/AssignmentRepository";
import SubmissionRepository from "../repositories/SubmissionRepository";
import BaseService from "./BaseService";
import ResponseFormat from "../utils/ResponseFormat";

class SubmissionService extends BaseService {
    getsSubmissionByAssignmentId = async (): Promise<ResponseFormat> => {
        const assignment_id = parseInt(this.query.assignment_id as string, 10);
        const asg = await AssignmentRepository.findByIdAndUserId(assignment_id, this.user.id);
        if (!asg) return ResponseFormat.error(400, "You aren't the owner of this assignment!")
        const submissions = await SubmissionRepository.getsByAssignmentId(assignment_id);
        if (submissions.length == 0) return ResponseFormat.error(404, "Submission Not Found!")
        return ResponseFormat.resource(200, "Success get all submissions", submissions)
    }

    store = async (): Promise<ResponseFormat> => {
        const unlinkSync = promisify(fs.unlink)
        try {
            const storeData = this.convertDataToCreateSubmissionData(this.body)
            const assignment = await AssignmentRepository.assignmentIdNotAvailable(storeData.assignment_id)
            await this.checkAssignmentForSubmission(assignment, unlinkSync)
            const random = await this.loopingRandomField(SubmissionRepository)
            const fileName = await this.checkFileAvailable(this.file)
            const submission = await SubmissionRepository.insert({ ...storeData, random, file: fileName, user_id: this.user.id });
            return ResponseFormat.resource(200, "Success create submission", { id: submission[0], ...storeData, file: fileName, random, user_id: this.user.id })
        } catch (error: any) {
            await unlinkSync('public/uploads/submissions/' + this.file?.filename)
            return ResponseFormat.error(500, "Internal Server Error")
        }
    }

    convertDataToCreateSubmissionData = (data: any): any => {
        return {
            message: data.message,
            assignment_id: parseInt(data.assignment_id, 10)
        }
    }

    getOneByAssignmentIdAndUserId = async (): Promise<ResponseFormat> => {
        const asg = await AssignmentRepository.findByRandom(this.params.randomAssignment);
        if (!asg) return ResponseFormat.error(404, "Assignment Not Found!")
        const submission = await SubmissionRepository.getOneByAssignmentIdAndUserId(asg.id, this.user.id);
        if (!submission) return ResponseFormat.error(404, "Submission Not Found!")
        return ResponseFormat.resource(200, "Success get submission", submission)
    }

    createValuation = async (): Promise<ResponseFormat> => {
        const storeData = this.convertDataToCreateValuationData(this.body)
        const submission = await SubmissionRepository.updateValuationByRandom(this.params.random, storeData);
        if (submission != 1) return ResponseFormat.error(404, "Submission Not Found!")
        return ResponseFormat.resource(200, "Success create valuation", storeData)
    }

    convertDataToCreateValuationData = (data: any): any => {
        return {
            score: data.score,
            status: data.status
        }
    }

    update = async (): Promise<ResponseFormat> => {
        const unlinkSync = promisify(fs.unlink)
        try {
            const submit = await SubmissionRepository.findByRandom(this.params.random);
            this.checkSubmissionAvailable(submit, unlinkSync)
            await unlinkSync('public/uploads/submissions/' + submit.file)
            const fileName = await this.checkFileAvailable(this.file)
            const updateData = this.convertDataToUpdateSubmissionData({message: this.body, file: fileName})
            await SubmissionRepository.updateByRandom(this.params.random, updateData);
            return ResponseFormat.success(201, "Success update submission")
        } catch (error: any) {
            await unlinkSync('public/uploads/submissions/' + this.file?.filename)
            return ResponseFormat.error(500, "Internal Server Error")
        }
    }

    convertDataToUpdateSubmissionData = (data: any): any => {
        return {
            message: data.message,
            file: data.file
        }
    }

    checkSubmissionAvailable = async (submissions: any, unlink: any) => {
        if (submissions.status == "approved") {
            if (this.file) await unlink('public/uploads/submissions/' + this.file.filename)
            throw new Error("Submission Not Update!")
        }
        if (!submissions) {
            if (this.file) await unlink('public/uploads/submissions/' + this.file.filename)
            throw new Error("Submission Not Found!")
        }
    }

    checkAssignmentForSubmission = async (assignment: any, unlink: any): Promise<ResponseFormat> => {
        if (!assignment) if (this.file) await unlink('public/uploads/submissions/' + this.file.filename)
        return ResponseFormat.error(404, "Assignment Not Found!");
    }

    delete = async (): Promise<ResponseFormat> => {
        const unlinkSync = promisify(fs.unlink)
        const submission = await SubmissionRepository.findByRandom(this.params.random);
        if (!submission) ResponseFormat.error(404, "Submission Not Found!")
        await unlinkSync('public/uploads/submissions/' + submission.file)
        const deleted = await SubmissionRepository.deleteByRandom(this.params.random);
        if (deleted != 1) ResponseFormat.error(404, "Submission Not Found!")
        return ResponseFormat.success(201, "Success delete submission")
    }
}

export default SubmissionService;