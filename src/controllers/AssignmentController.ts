import { Request, Response } from "express";
import AssignmentService from "../services/AssignmentService";
import BaseController from "./BaseController";
import {promisify} from "util";
import fs from "fs";

class AssignmentController extends BaseController {
    index = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AssignmentService = new AssignmentService(req);
            const assignments = await service.getAll()
            return this.decisionResponse(res, assignments)
        } catch (error: any) {
            return this.convertDataToInternalServerErrorResponse(res, error)
        }
    }

    create= async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AssignmentService = new AssignmentService(req);
            const result = await service.store()
            return this.decisionResponse(res, result)
        } catch (error: any) {
            const unlinkSync = promisify(fs.unlink)
            await unlinkSync('public/uploads/assignments/' + req.file?.filename)
            return this.convertDataToInternalServerErrorResponse(res, error)
        }
    }

    show= async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AssignmentService = new AssignmentService(req);
            const assignment = await service.getOne()
            return this.decisionResponse(res, assignment)
        } catch (error: any) {
            return this.convertDataToInternalServerErrorResponse(res, error)
        }
    }

    getMyAssignments = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AssignmentService = new AssignmentService(req);
            const assignments = await service.getMyAssignments()
            return this.decisionResponse(res, assignments)
        } catch (error: any) {
            return this.convertDataToInternalServerErrorResponse(res, error)
        }
    }

    update= async (req: Request, res: Response): Promise<Response> => {
        const service: AssignmentService = new AssignmentService(req);
        const result = await service.update()
        return this.decisionResponse(res, result)
    }
    delete= async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AssignmentService = new AssignmentService(req);
            const result = await service.delete()
            return this.decisionResponse(res, result)
        } catch (error: any) {
            return this.convertDataToInternalServerErrorResponse(res, error)
        }
    }
}

export default new AssignmentController();