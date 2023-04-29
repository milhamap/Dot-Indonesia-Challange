import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
require('dotenv').config();

class AuthenticationMiddleware {
    public static verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<Response | any> => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
            if (err) return res.sendStatus(403)
            req.app.locals.credentials = user;
            return next()
        })
    }
    public static isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<Response | any> => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
            if (err) return res.sendStatus(403)
            if (user.role_id !== 1)return res.status(400).json({message: "You aren't Admin"})
            req.app.locals.credentials = user
            return next()
        })
    }
    public static isLecturer = async (req: Request, res: Response, next: NextFunction): Promise<Response | any> => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
            if (err) return res.sendStatus(403)
            if (user.role_id !== 2)return res.status(400).json({message: "You aren't Lecture"})
            req.app.locals.credentials = user
            return next()
        })
    }
    public static isStudent = async (req: Request, res: Response, next: NextFunction): Promise<Response | any> => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
            if (err) return res.sendStatus(403)
            if (user.role_id !== 3)return res.status(400).json({message: "You aren't Student"})
            req.app.locals.credentials = user
            return next()
        })
    }
}

export default AuthenticationMiddleware;