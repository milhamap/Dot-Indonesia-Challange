import { Request, Response } from "express";

interface IController {
    index(req: Request, res: Response): Response | Promise<Response>;
    create(req: Request, res: Response): Response | Promise<Response>;
    show(req: Request, res: Response): Response | Promise<Response>;
    update(req: Request, res: Response): Response | Promise<Response>;
    delete(req: Request, res: Response): Response | Promise<Response>;
    getMyAssignments(req: Request, res: Response): Response | Promise<Response>;
    sendEmailVerification(req: Request, res: Response): Response | Promise<Response>;
    confirmVerificationEmail(req: Request, res: Response): Response | Promise<Response>;
    login(req: Request, res: Response): Response | Promise<Response>;
    registerLecturer(req: Request, res: Response): Response | Promise<Response>;
    registerStudent(req: Request, res: Response): Response | Promise<Response>;
    refreshToken(req: Request, res: Response): Response | Promise<Response>;
    logout(req: Request, res: Response): Response | Promise<Response>;
    getUser(req: Request, res: Response): Response | Promise<Response>;
    updatePassword(req: Request, res: Response): Response | Promise<Response>;
    createValuation(req: Request, res: Response): Response | Promise<Response>;
}

export default IController;