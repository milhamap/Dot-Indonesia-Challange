import { Request, Response } from "express";
import IController from "./ControllerInterface";
import TemplateHTML from "../utils/TemplateHTML";

class BaseController implements IController {
    index(req: Request, res: Response): Response | Promise<Response> {
        throw new Error("Method not implemented.");
    }

    create(req: Request, res: Response): Response | Promise<Response> {
        throw new Error("Method not implemented.");
    }

    show(req: Request, res: Response): Response | Promise<Response> {
        throw new Error("Method not implemented.");
    }

    update(req: Request, res: Response): Response | Promise<Response> {
        throw new Error("Method not implemented.");
    }

    delete(req: Request, res: Response): Response | Promise<Response> {
        throw new Error("Method not implemented.");
    }

    getMyAssignments(req: Request, res: Response): Response | Promise<Response> {
        throw new Error("Method not implemented.");
    }

    sendEmailVerification(req: Request, res: Response): Response | Promise<Response> {
        throw new Error("Method not implemented.");
    }

    confirmVerificationEmail(req: Request, res: Response): Response | Promise<Response> {
        throw new Error("Method not implemented.");
    }

    login(req: Request, res: Response): Response | Promise<Response> {
        throw new Error("Method not implemented.");
    }

    registerLecturer(req: Request, res: Response): Response | Promise<Response> {
        throw new Error("Method not implemented.");
    }

    registerStudent(req: Request, res: Response): Response | Promise<Response> {
        throw new Error("Method not implemented.");
    }

    refreshToken(req: Request, res: Response): Response | Promise<Response> {
        throw new Error("Method not implemented.");
    }

    logout(req: Request, res: Response): Response | Promise<Response> {
        throw new Error("Method not implemented.");
    }

    getUser(req: Request, res: Response): Response | Promise<Response> {
        throw new Error("Method not implemented.");
    }

    updatePassword(req: Request, res: Response): Response | Promise<Response> {
        throw new Error("Method not implemented.");
    }

    createValuation(req: Request, res: Response): Response | Promise<Response> {
        throw new Error("Method not implemented.");
    }

    convertDataToInternalServerErrorResponse = (res: Response, error: any): Response => {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }

    convertDataToInformationResponse = (res: Response, status: number, message: string): Response => {
        return res.status(status).json({message})
    }

    convertDataToSuccessResponse = (res: Response, message: string, data: any): Response => {
        return res.status(200).json({message, data})
    }

    convertDataToHTMLResponse = (res: Response, data: any): Response => {
        return res.status(200).send(data)
    }

    decisionResponse = (res: Response, data: any): Response => {
        if (data.status == 200) return this.convertDataToSuccessResponse(res, data.message, data.data)
        if (data.status == 201 || data.status == 400 || data.status == 404) return this.convertDataToInformationResponse(res, data.status, data.message)
        if (data.status == 204) return this.convertDataToHTMLResponse(res, TemplateHTML.templateSuccessEmailVerification(data.message))
        return this.convertDataToInternalServerErrorResponse(res, data)
    }
}

export default BaseController;