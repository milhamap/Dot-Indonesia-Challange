import { Request } from "express";
import fs from "fs";
import { promisify } from "util"
import { v4 as uuid4 } from "uuid";
import AssignmentRepository from "../repositories/AssignmentRepository";
import SubmissionRepository from "../repositories/SubmissionRepository";

class SubmissionService {
    user: {
        id: number,
        role_id: number
    }
    body: Request["body"];
    params: Request["params"];
    query: Request["query"];
    file: Express.Multer.File | undefined;

    constructor(req: Request) {
        this.user = req.app.locals.credentials;
        this.body = req.body;
        this.params = req.params;
        this.query = req.query;
        this.file = req.file
    }

    getsSubmissionByAssignmentId = async () => {
        const assignment_id = parseInt(this.query.assignment_id as string, 10);
        const asg = await AssignmentRepository.findByIdAndUserId(assignment_id, this.user.id);
        if (!asg) throw new Error("You aren't the owner of this assignment!")
        const submissions = await SubmissionRepository.getsByAssignmentId(assignment_id);
        if (submissions.length == 0) throw new Error("Submission Not Found!")
        return {
            message: "Success get all submissions",
            submissions
        };
    }

    store = async () => {
        const unlinkSync = promisify(fs.unlink)
        const { assignment_id, message } = this.body
        if (await AssignmentRepository.assignmentIdNotAvailable(assignment_id)) {
            if (this.file) await unlinkSync('public/uploads/submissions/' + this.file.filename)
            throw new Error("Assignment Not Found!")
        }
        let random;
        do {
            random = uuid4()
        } while(await SubmissionRepository.randomNotUse(random))
        let fileName = ""
        if (this.file)
            fileName = this.file.filename
        else 
            throw new Error("File tidak ditemukan");
        const submission = await SubmissionRepository.insert(random, message, fileName, assignment_id, this.user.id);
        if (submission.length == 0) await unlinkSync('public/uploads/submissions/' + fileName)
        return {
            message: "Submission created!",
            submission: {
                id: submission[0],
                message,
                file: fileName,
                assignment_id,
                user_id: this.user.id
            }
        }
    }

    getOneByAssignmentIdAndUserId = async () => {
        const asg = await AssignmentRepository.findByRandom(this.params.randomAssignment);
        if (!asg) throw new Error("Assignment Not Found!")
        const submission = await SubmissionRepository.getOneByAssignmentIdAndUserId(asg.id, this.user.id);
        if (!submission) throw new Error("Submission Not Found!")
        return {
            message: "Success get submission",
            submission
        };
    }

    createValuation = async () => {
        const { score, status } = this.body;
        const submission = await SubmissionRepository.updateValuationByRandom(this.params.random, score, status);
        if (submission != 1) throw new Error("Submission Not Found!")
        return {
            message: "Valuation created!",
            valuation: {
                score,
                status,
            }
        }
    }

    update = async () => {
        const unlinkSync = promisify(fs.unlink)
        const submit = await SubmissionRepository.findByRandom(this.params.random);
        if (submit.status == "approved") {
            if (this.file) await unlinkSync('public/uploads/submissions/' + this.file.filename)
            throw new Error("Submission Not Update!")
        }
        if (!submit) {
            if (this.file) await unlinkSync('public/uploads/submissions/' + this.file.filename)
            throw new Error("Submission Not Found!")
        } 
        await unlinkSync('public/uploads/submissions/' + submit.file)
        let fileName = ""
        if (this.file)
            fileName = this.file.filename
        else 
            throw new Error("File tidak ditemukan");
        const submission = await SubmissionRepository.updateByRandom(this.params.random, this.body.message, fileName);
        if (submission != 1) await unlinkSync('public/uploads/submissions/' + fileName)
        return { message: "Submission updated!" }
    }

    delete = async () => {
        const unlinkSync = promisify(fs.unlink)
        const submission = await SubmissionRepository.findByRandom(this.params.random);
        if (!submission) throw new Error("Submission Not Found!")
        await unlinkSync('public/uploads/submissions/' + submission.file)
        const deleted = await SubmissionRepository.deleteByRandom(this.params.random);
        if (deleted != 1) throw new Error("Submission Not Found!")
        return { message: "Submission deleted!" }
    }
}

export default SubmissionService;