import { Request, Response } from "express";
import IController from "./ControllerInterface";
import AssignmentService from "../services/AssignmentService";

class AssignmentController implements IController {
    index = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AssignmentService = new AssignmentService(req);
            const assignments = await service.getAll()
            return res.status(200).json(assignments)
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }

    create= async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AssignmentService = new AssignmentService(req);
            const message = await service.store()
            return res.status(200).json(message)
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }

    show= async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AssignmentService = new AssignmentService(req);
            const assignment = await service.getOne()
            return res.status(200).json(assignment)
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }

    getMyAssignments = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AssignmentService = new AssignmentService(req);
            const assignments = await service.getMyAssignments()
            return res.status(200).json(assignments)
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }

    update= async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AssignmentService = new AssignmentService(req);
            const message = await service.update()
            return res.status(200).json(message)
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }
    delete= async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AssignmentService = new AssignmentService(req);
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

export default new AssignmentController();