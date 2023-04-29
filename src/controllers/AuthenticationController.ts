import { Request, Response } from "express";
import AuthenticationService from "../services/AuthenticationService";

class AuthenticationController {
    sendEmailVerification = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AuthenticationService = new AuthenticationService(req);
            const message = await service.sendEmailVerification();
            return res.status(200).json(message);
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }
    }

    confirmVerificationEmail = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AuthenticationService = new AuthenticationService(req);
            const message = await service.confirmVerificationEmail();
            return res.status(200).json(message);
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }
    }

    login = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AuthenticationService = new AuthenticationService(req);
            const result = await service.login();
            if (result.message) return res.status(400).json(result);
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            return res.status(200).json({
                message: "Login Success",
                token: result.token
            });
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }
    }
    
    registerLecturer = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AuthenticationService = new AuthenticationService(req);
            const users = await service.registerLecturer();
            return res.status(200).json(users);
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }
    }

    registerStudent = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AuthenticationService = new AuthenticationService(req);
            const users = await service.registerStudent();
            return res.status(200).json(users);
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }
    }

    refreshToken = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AuthenticationService = new AuthenticationService(req);
            const token = await service.refreshToken();
            return res.status(200).json(token)            
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });            
        }
    }

    logout = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AuthenticationService = new AuthenticationService(req);
            const token = await service.logout();
            res.clearCookie('refreshToken');
            return res.status(200).json(token)        
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });            
        }
    }

    getUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AuthenticationService = new AuthenticationService(req);
            const token = await service.getUser();
            return res.status(200).json(token)            
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });            
        }
    }

    updatePassword = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: AuthenticationService = new AuthenticationService(req);
            const user = await service.updatePassword();
            return res.status(200).json(user)            
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });            
        }
    }
}

export default new AuthenticationController();