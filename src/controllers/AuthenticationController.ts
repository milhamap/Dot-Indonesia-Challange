import { Request, Response } from "express";
import AuthenticationService from "../services/AuthenticationService";
import BaseController from "./BaseController";

class AuthenticationController extends BaseController {
    sendEmailVerification = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AuthenticationService = new AuthenticationService(req);
            const result = await service.sendEmailVerification();
            return this.decisionResponse(res, result)
        } catch (error: any) {
            return this.convertDataToInternalServerErrorResponse(res, error);
        }
    }

    confirmVerificationEmail = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AuthenticationService = new AuthenticationService(req);
            const result = await service.confirmVerificationEmail()
            return this.decisionResponse(res, result)
        } catch (error: any) {
            return this.convertDataToInternalServerErrorResponse(res, error);
        }
    }

    createCookie = (res: Response, name: string, data: string): Response => {
        return res.cookie(name, data, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    }

    login = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AuthenticationService = new AuthenticationService(req);
            const result = await service.login();
            this.createCookie(res, "refreshToken", result.data.refreshToken);
            return this.decisionResponse(res, result)
        } catch (error: any) {
            return this.convertDataToInternalServerErrorResponse(res, error);
        }
    }
    
    registerLecturer = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AuthenticationService = new AuthenticationService(req);
            const result = await service.registerLecturer();
            return this.decisionResponse(res, result)
        } catch (error: any) {
            return this.convertDataToInternalServerErrorResponse(res, error);
        }
    }

    registerStudent = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AuthenticationService = new AuthenticationService(req);
            const result = await service.registerStudent();
            return this.decisionResponse(res, result)
        } catch (error: any) {
            return this.convertDataToInternalServerErrorResponse(res, error);
        }
    }

    refreshToken = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AuthenticationService = new AuthenticationService(req);
            const result = await service.refreshToken();
            return this.decisionResponse(res, result)
        } catch (error: any) {
            return this.convertDataToInternalServerErrorResponse(res, error);
        }
    }

    logout = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AuthenticationService = new AuthenticationService(req);
            const result = await service.logout();
            res.clearCookie('refreshToken');
            return this.decisionResponse(res, result)
        } catch (error: any) {
            return this.convertDataToInternalServerErrorResponse(res, error);
        }
    }

    getUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AuthenticationService = new AuthenticationService(req);
            const result = await service.getUser();
            return this.decisionResponse(res, result)
        } catch (error: any) {
            return this.convertDataToInternalServerErrorResponse(res, error);
        }
    }

    updatePassword = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AuthenticationService = new AuthenticationService(req);
            const result = await service.updatePassword();
            return this.decisionResponse(res, result)
        } catch (error: any) {
            return this.convertDataToInternalServerErrorResponse(res, error);
        }
    }
}

export default new AuthenticationController();