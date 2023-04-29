import { Request, Response } from "express";
import IController from "./ControllerInterface";
import SubmissionService from "../services/SubmissionService";

class SubmissionController implements IController {
    index = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: SubmissionService = new SubmissionService(req);
            const message = await service.getsSubmissionByAssignmentId()
            return res.status(200).json(message)
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }

    create = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: SubmissionService = new SubmissionService(req);
            const message = await service.store()
            return res.status(200).json(message)
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }

    createValuation = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: SubmissionService = new SubmissionService(req);
            const message = await service.createValuation()
            return res.status(200).json(message)
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }

    show = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: SubmissionService = new SubmissionService(req);
            const message = await service.getOneByAssignmentIdAndUserId()
            return res.status(200).json(message)
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }

    update = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: SubmissionService = new SubmissionService(req);
            const message = await service.update()
            return res.status(200).json(message)
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }

    delete = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: SubmissionService = new SubmissionService(req);
            const message = await service.delete()
            return res.status(200).json(message)
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }
}

export default new SubmissionController();