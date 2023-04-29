import { Request } from "express";
import EmailVerficationRepository from "../repositories/EmailVerificationRepository";
import AuthenticationRepository from "../repositories/AuthenticationRepository";
import { v4 as uuid4 } from "uuid";
import Authentication from "../utils/Authentication";
import EmailVerification from "../utils/EmailVerfication";
import randomstring from "randomstring";

class AuthenticationService {
    user: {
        id: number,
        role_id: number
    };
    body: Request["body"];
    params: Request["params"];
    cookie: Request["cookies"];

    constructor(req: Request) {
        this.user = req.app.locals.credentials;
        this.body = req.body;
        this.params = req.params;
        this.cookie = req.cookies;
    }

    sendEmailVerification = async () => {
        const { email } = this.body;
        const user = await AuthenticationRepository.findByEmail(email);
        if (!user) return { message: "Email not found" };
        let token_verification;
        do {
            token_verification = randomstring.generate(8)
        } while (await EmailVerficationRepository.tokenNotUse(token_verification));
        const verifyToken = await EmailVerficationRepository.findByEmail(email);
        if (verifyToken) {
            if (verifyToken.status == 1) return {message: 'Email already verified'}
            await EmailVerficationRepository.updateTokenByEmail(email, token_verification);
        } else {
            await EmailVerficationRepository.insert(email, token_verification);
        }
        const result = await EmailVerification.sendEmailVerification(email, token_verification);
        return result;
    }

    confirmVerificationEmail = async () => {
        const { token } = this.params;
        const status = await EmailVerficationRepository.findByToken(token);
        if (!status) return { message: "Wrong Verification Code" };
        if (status.status === true) return { message: "Email already verified" };
        await EmailVerficationRepository.updateStatusByToken(token);
        await AuthenticationRepository.updateActiveByEmail(status.email);
        return { message: "Email verified" };
    }

    login = async () => {
        const { email, password } = this.body;
        const user = await AuthenticationRepository.findByEmail(email);
        if (!user) return { message: "Email or password wrong" };
        const checkPassword = await Authentication.passwordCompare(password, user.password);
        if (!checkPassword) return { message: "Email or password wrong" };
        if (user.is_active == 0) return { message: "User not verified!" };
        const token = Authentication.createUserToken({
            id: user.id,
            role_id: user.role_id
        });
        const refreshToken = Authentication.createRefreshToken({
            id: user.id,
            role_id: user.role_id,
        });
        await AuthenticationRepository.updateRefreshTokenById(user.id, refreshToken);
        return { 
            token,
            refreshToken
        };
    }

    registerLecturer = async () => {
        const { nip, fullname, email, password, confirm_password } = this.body;
        if (password !== confirm_password) return { message: "Password doesn't match" };
        let random
        do {
            random = uuid4()
        } while(await AuthenticationRepository.randomNotUse(random))
        if (await AuthenticationRepository.emailOrNipNotUse(email, nip)) return {message: "Email or NIP already used"}
        const hashedPassword: string = await Authentication.passwordHash(password);
        const user = await AuthenticationRepository.insertLecturer(nip, fullname, email, hashedPassword, random)
        const token = Authentication.createUserToken({
            id: user[0],
            role_id: 2
        });
        return {
            message: "Register success",
            token
        };
    }
    
    registerStudent = async () => {
        const { nrp, fullname, email, password, confirm_password } = this.body;
        if (password !== confirm_password) return { message: "Password doesn't match" };
        let random
        do {
            random = uuid4()
        } while(await AuthenticationRepository.randomNotUse(random))
        if (await AuthenticationRepository.emailOrNrpNotUse(email, nrp)) return {message: "Email or NRP already used"}
        const hashedPassword: string = await Authentication.passwordHash(password);
        await AuthenticationRepository.insertStudent(nrp, fullname, email, hashedPassword, random)
        return { message: "Register success" };
    }

    refreshToken = async () => {
        const refreshToken = this.cookie.refreshToken;
        if (!refreshToken) return { message: "Refresh Token expired!" };
        const token = Authentication.verifyRefreshToken(refreshToken);
        return {
            message: "Refresh Token success",
            token
        };
    }

    logout = async () => {
        const refreshToken = this.cookie.refreshToken;
        if (!refreshToken) return { message: "Refresh Token expired!" };
        const user = await AuthenticationRepository.findByRefreshToken(refreshToken);
        if (!user) return { message: "User Not Found!" };
        await AuthenticationRepository.updateRefreshTokenById(user.id);
        return { message: "Logout success" }
    }

    getUser = async () => {
        const user = await AuthenticationRepository.findById(this.user.id);
        return {
            message: "Get User success",
            user
        }
    }

    updatePassword = async () => {
        const { old_password, new_password, new_confirm_password } = this.body;
        if (new_password !== new_confirm_password) return {message: "Password not match"};
        const user = await AuthenticationRepository.findById(this.user.id);
        if (!user) return { message: "User Not Found!" }
        const checkPassword = await Authentication.passwordCompare(old_password, user.password);
        if (!checkPassword) return { message: "Password not match" };
        const hashedPassword: string = await Authentication.passwordHash(new_password);
        await AuthenticationRepository.updatePasswordById(this.user.id, hashedPassword);
        return {
            message: "Update Password success",
            user
        }
    }
}

export default AuthenticationService;