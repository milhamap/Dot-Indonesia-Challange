import EmailVerficationRepository from "../repositories/EmailVerificationRepository";
import AuthenticationRepository from "../repositories/AuthenticationRepository";
import Authentication from "../utils/Authentication";
import EmailVerification from "../utils/EmailVerfication";
import randomstring from "randomstring";
import BaseService from "./BaseService";
import ResponseFormat from "../utils/ResponseFormat";
import RegisterLectureDto from "../dtos/RegisterLectureDto";
import RegisterStudentDto from "../dtos/RegisterStudentDto";

class AuthenticationService extends BaseService {
    sendEmailVerification = async (): Promise<ResponseFormat> => {
        const { email } = this.body;
        const user = await AuthenticationRepository.findByEmail(email);
        if (!user) return ResponseFormat.error(404, "User not found")
        const token_verification = await this.loopingTokenVerificationEmail();
        const verifyToken = await EmailVerficationRepository.findByEmail(email);
        this.decisionVerifyToken(verifyToken, token_verification, email);
        const result = await EmailVerification.sendEmailVerification(email, token_verification);
        return ResponseFormat.success(200, result.message);
    }

    loopingTokenVerificationEmail = async (): Promise<string> => {
        let token_verification;
        do {
            token_verification = randomstring.generate(8)
        } while(await EmailVerficationRepository.tokenNotUse(token_verification));
        return token_verification;
    }

    decisionVerifyToken = async (token: any, verify: string, email: string): Promise<number | number[] | ResponseFormat> => {
        if (token) {
            if (token.status == 1) return ResponseFormat.error(400, "Email already verified")
            return await EmailVerficationRepository.updateTokenByEmail(email, verify);
        } else {
            return await EmailVerficationRepository.insert(email, verify);
        }
    }

    confirmVerificationEmail = async (): Promise<ResponseFormat> => {
        const { token } = this.params;
        const status = await EmailVerficationRepository.findByToken(token);
        if (!status) return ResponseFormat.error(400, "Wrong Verification Token")
        if (status.status == true) return ResponseFormat.success(204, "Email already verified!")
        await EmailVerficationRepository.updateStatusByToken(token);
        await AuthenticationRepository.updateActiveByEmail(status.email);
        return ResponseFormat.success(204, "Email verified!")
    }

    login = async (): Promise<ResponseFormat> => {
        const { email, password } = this.body;
        const user = await AuthenticationRepository.findByEmail(email);
        if (!user) return ResponseFormat.error(400, "Email or password wrong")
        const checkPassword = await Authentication.passwordCompare(password, user.password);
        if (!checkPassword) return ResponseFormat.error(400, "Email or password wrong")
        if (user.is_active == 0) return ResponseFormat.error(400, "Email not verified")
        const token = Authentication.createUserToken({ id: user.id, role_id: user.role_id });
        const refreshToken = Authentication.createRefreshToken({ id: user.id, role_id: user.role_id });
        await AuthenticationRepository.updateRefreshTokenById(user.id, refreshToken);
        return ResponseFormat.resource(200, "Login success", { token, refreshToken });
    }

    registerLecturer = async (): Promise<ResponseFormat> => {
        const lecturerData = this.convertDataToLecturerData(this.body);
        if (lecturerData.password !== lecturerData.confirm_password) return ResponseFormat.error(400, "Password doesn't match")
        const random = await this.loopingRandomField(AuthenticationRepository);
        lecturerData.random = random;
        if (await AuthenticationRepository.emailOrNipNotUse(lecturerData.email, lecturerData.nip)) return ResponseFormat.error(400, "Email or NIP already used")
        const hashedPassword: string = await Authentication.passwordHash(lecturerData.password);
        lecturerData.password = hashedPassword;
        const user = await AuthenticationRepository.insertLecturer(new RegisterLectureDto(lecturerData));
        const token = Authentication.createUserToken({ id: user[0], role_id: 2 });
        return ResponseFormat.resource(200, "Register success", { token });
    }

    convertDataToLecturerData = (data: any): any => {
        return {
            nip: data.nip,
            fullname: data.fullname,
            email: data.email,
            password: data.password,
            confirm_password: data.confirm_password,
            random: data.random
        }
    }
    
    registerStudent = async (): Promise<ResponseFormat> => {
        const registerData = this.convertDataToStudentData(this.body);
        if (registerData.password !== registerData.confirm_password) return ResponseFormat.error(400, "Password doesn't match")
        const random = await this.loopingRandomField(AuthenticationRepository);
        registerData.random = random;
        if (await AuthenticationRepository.emailOrNrpNotUse(registerData.email, registerData.nrp)) return ResponseFormat.error(400, "Email or NRP already used")
        const hashedPassword: string = await Authentication.passwordHash(registerData.password);
        registerData.password = hashedPassword;
        await AuthenticationRepository.insertStudent(new RegisterStudentDto(registerData))
        return ResponseFormat.success(201, "Register success")
    }

    convertDataToStudentData = (data: any): any => {
        return {
            nrp: data.nrp,
            fullname: data.fullname,
            email: data.email,
            password: data.password,
            confirm_password: data.confirm_password,
            random: data.random
        }
    }

    refreshToken = async (): Promise<ResponseFormat> => {
        const refreshToken = this.cookie.refreshToken;
        if (!refreshToken) return ResponseFormat.error(400, "Refresh Token expired!")
        const token = Authentication.verifyRefreshToken(refreshToken);
        return ResponseFormat.resource(200, "Success refresh token", { token });
    }

    logout = async (): Promise<ResponseFormat> => {
        const refreshToken = this.cookie.refreshToken;
        if (!refreshToken) return ResponseFormat.error(400, "Refresh Token expired!")
        const user = await AuthenticationRepository.findByRefreshToken(refreshToken);
        if (!user) return ResponseFormat.error(404, "User not found")
        await AuthenticationRepository.updateRefreshTokenById(user.id);
        return ResponseFormat.success(201, "Logout success");
    }

    getUser = async (): Promise<ResponseFormat> => {
        const user = await AuthenticationRepository.findById(this.user.id);
        return ResponseFormat.resource(200, "Success get user", { user });
    }

    updatePassword = async (): Promise<ResponseFormat> => {
        const { old_password, new_password, new_confirm_password } = this.body;
        if (new_password !== new_confirm_password) return ResponseFormat.error(400, "Password doesn't match");
        const user = await AuthenticationRepository.findById(this.user.id);
        if (!user) return ResponseFormat.error(404, "User not found")
        const checkPassword = await Authentication.passwordCompare(old_password, user.password);
        if (!checkPassword) return ResponseFormat.error(400, "Password doesn't match");
        const hashedPassword: string = await Authentication.passwordHash(new_password);
        await AuthenticationRepository.updatePasswordById(this.user.id, hashedPassword);
        return ResponseFormat.resource(200, "Update password success", { user });
    }
}

export default AuthenticationService;