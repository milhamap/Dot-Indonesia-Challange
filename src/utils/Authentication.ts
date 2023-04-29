import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
require('dotenv').config();

class Authentication {
    public static passwordHash = async (password: string): Promise<string> => {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }

    public static passwordCompare = async (password: string, hash: string): Promise<boolean> => { 
        return bcrypt.compare(password, hash);
    }

    public static createUserToken = (payload: object): string => {
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, { 
            expiresIn: process.env.JWT_EXPIRE_TIME 
        });
    }

    public static createRefreshToken = (payload: object): string => {
        return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, { 
            expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME 
        });
    }

    public static verifyRefreshToken = (token: string): any => {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string, (err: any, user: any) => {
            if (err) return false;
            const token = Authentication.createUserToken({ id: user.id, role_id: user.role_id });
            return token;
        });
    }
}

export default Authentication;