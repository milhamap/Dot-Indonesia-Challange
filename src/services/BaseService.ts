import {Request} from "express";
import IService from "./ServiceInterface";
import ResponseFormat from "../utils/ResponseFormat";
import {v4 as uuid4} from "uuid";

class BaseService implements IService {
    user: {
        id: number,
        role_id: number
    };
    body: Request["body"];
    params: Request["params"];
    cookie: Request["cookies"];
    query: Request["query"];
    file: Express.Multer.File | undefined;

    constructor(req: Request) {
        this.user = req.app.locals.credentials;
        this.body = req.body;
        this.params = req.params;
        this.cookie = req.cookies;
        this.file = req.file
        this.query = req.query;
    }
    sendEmailVerification(): Promise<ResponseFormat> {
        throw new Error("Method not implemented.");
    }

    confirmVerificationEmail(): Promise<ResponseFormat> {
        throw new Error("Method not implemented.");
    }

    login(): Promise<ResponseFormat> {
        throw new Error("Method not implemented.");
    }

    registerLecturer(): Promise<ResponseFormat> {
        throw new Error("Method not implemented.");
    }

    registerStudent(): Promise<ResponseFormat> {
        throw new Error("Method not implemented.");
    }

    refreshToken(): Promise<ResponseFormat> {
        throw new Error("Method not implemented.");
    }

    logout(): Promise<ResponseFormat> {
        throw new Error("Method not implemented.");
    }

    getUser(): Promise<ResponseFormat> {
        throw new Error("Method not implemented.");
    }

    updatePassword(): Promise<ResponseFormat> {
        throw new Error("Method not implemented.");
    }

    getAll(): Promise<ResponseFormat> {
        throw new Error("Method not implemented.");
    }

    store(): Promise<ResponseFormat> {
        throw new Error("Method not implemented.");
    }

    getMyAssignments(): Promise<ResponseFormat> {
        throw new Error("Method not implemented.");
    }

    getOne(): Promise<ResponseFormat> {
        throw new Error("Method not implemented.");
    }

    update(): Promise<ResponseFormat> {
        throw new Error("Method not implemented.");
    }

    delete(): Promise<ResponseFormat> {
        throw new Error("Method not implemented.");
    }

    getsSubmissionByAssignmentId(): Promise<ResponseFormat> {
        throw new Error("Method not implemented.");
    }

    getOneByAssignmentIdAndUserId(): Promise<ResponseFormat> {
        throw new Error("Method not implemented.");
    }

    createValuation(): Promise<ResponseFormat> {
        throw new Error("Method not implemented.");
    }

    loopingRandomField = async (repository: any): Promise<string> => {
        let random
        do {
            random = uuid4()
        } while(await repository.randomNotUse(random))
        return random;
    }

    checkFileAvailable = async (file: any) => {
        let fileName = ""
        if (file)
            fileName = file.filename
        else
            throw new Error("File tidak ditemukan");
        return fileName
    }

    checkAssignmentAvailable = async (assignment: any, unlink: any): Promise<ResponseFormat> => {
        if (!assignment) if (this.file) await unlink('public/uploads/assignments/' + this.file.filename)
        return ResponseFormat.error(404, "Assignment Not Found!");
    }
}

export default BaseService;