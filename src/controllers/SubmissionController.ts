import { Request, Response } from "express";
import SubmissionService from "../services/SubmissionService";
import BaseController from './BaseController';

class SubmissionController extends BaseController {
    index = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: SubmissionService = new SubmissionService(req);
            const result = await service.getsSubmissionByAssignmentId()
            return this.decisionResponse(res, result)
        } catch (error: any) {
            return this.convertDataToInternalServerErrorResponse(res, error)
        }
    }

    create = async (req: Request, res: Response): Promise<Response> => {
        const service: SubmissionService = new SubmissionService(req);
        const result = await service.store()
        return this.decisionResponse(res, result)
    }

    createValuation = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: SubmissionService = new SubmissionService(req);
            const result = await service.createValuation()
            return this.decisionResponse(res, result)
        } catch (error: any) {
            return this.convertDataToInternalServerErrorResponse(res, error)
        }
    }

    show = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: SubmissionService = new SubmissionService(req);
            const result = await service.getOneByAssignmentIdAndUserId()
            return this.decisionResponse(res, result)
        } catch (error: any) {
            return this.convertDataToInternalServerErrorResponse(res, error)
        }
    }

    update = async (req: Request, res: Response): Promise<Response> => {
        const service: SubmissionService = new SubmissionService(req);
        const result = await service.update()
        return this.decisionResponse(res, result)
    }

    delete = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: SubmissionService = new SubmissionService(req);
            const result = await service.delete()
            return this.decisionResponse(res, result)
        } catch (error: any) {
            return this.convertDataToInternalServerErrorResponse(res, error)
        }
    }
}

export default new SubmissionController();