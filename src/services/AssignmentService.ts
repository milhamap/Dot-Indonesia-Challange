import { Request } from "express";
import fs from "fs";
import { promisify } from "util"
import { v4 as uuid4 } from "uuid";
import AssignmentRepository from "../repositories/AssignmentRepository";
import SubmissionRepository from "../repositories/SubmissionRepository";

class AssignmentService {
    user: {
        id: number,
        role_id: number
    }
    body: Request["body"];
    params: Request["params"];
    file: Express.Multer.File | undefined;

    constructor(req: Request) {
        this.user = req.app.locals.credentials;
        this.body = req.body;
        this.params = req.params;
        this.file = req.file
    }

    getAll = async () => {
        const assignments = await AssignmentRepository.getAll();
        return {
            message: "Success get all assignments",
            assignments
        };
    }

    store = async () => {
        const unlinkSync = promisify(fs.unlink)
        const { title, description, deadline } = this.body;
        let random
        do {
            random = uuid4()
        } while(await AssignmentRepository.randomNotUse(random))

        let fileName = ""
        if (this.file)
            fileName = this.file.filename
        else 
            throw new Error("File tidak ditemukan");
        const assignment = await AssignmentRepository.insert(random, title, description, fileName, deadline, this.user.id);
        if (assignment.length == 0) await unlinkSync('public/uploads/assignments/' + fileName)
        return {
            message: "Assignment created!",
            assignment: {
                id: assignment[0],
                title,
                description,
                file: fileName,
                deadline,
            }
        }
    }

    getMyAssignments = async () => {
        const assignments = await AssignmentRepository.getMyAssignments(this.user.id);
        return {
            message: "Success get  my assignments",
            assignments
        };
    }

    getOne = async () => {
        const assignment = await AssignmentRepository.findByRandom(this.params.random);
        return {
            message: "Success get assignment",
            assignment
        };
    }

    update = async () => {
        const unlinkSync = promisify(fs.unlink)
        const { title, description, deadline } = this.body;
        const asg = await AssignmentRepository.findByRandom(this.params.random)
        if (!asg) {
            if (this.file) await unlinkSync('public/uploads/assignments/' + this.file.filename)
            return { message: "Assignment Not Found!" };
        } 
        await unlinkSync('public/uploads/assignments/' + asg.file)
        let fileName = ""
        if (this.file)
            fileName = this.file.filename
        else 
            throw new Error("File tidak ditemukan");
        const assignment = await AssignmentRepository.updateByRandom(this.params.random, title, description, fileName, deadline);
        if (assignment != 1) await unlinkSync('public/uploads/assignments/' + fileName)
        return { message: "Assignment updated!" }
    }

    delete = async () => {
        const unlinkSync = promisify(fs.unlink)
        const assignment = await AssignmentRepository.findByRandom(this.params.random)
        const submissions = await SubmissionRepository.getsByAssignmentId(assignment.id)
        if (submissions.length != 0) {
            await Promise.all(submissions.map(async (submission: any) => {
                await unlinkSync('public/uploads/submissions/' + submission.file)
                await SubmissionRepository.deleteById(submission.id)
            }))
        }
        await unlinkSync('public/uploads/assignments/' + assignment.file)
        await AssignmentRepository.deleteById(assignment.id);
        return { message: "Assignment deleted!" }
    }
}

export default AssignmentService;