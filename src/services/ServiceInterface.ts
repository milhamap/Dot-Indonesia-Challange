import ResponseFormat from "../utils/ResponseFormat";

interface IService {
    sendEmailVerification(): Promise<ResponseFormat>;
    confirmVerificationEmail(): Promise<ResponseFormat>;
    login(): Promise<ResponseFormat>;
    registerLecturer(): Promise<ResponseFormat>;
    registerStudent(): Promise<ResponseFormat>;
    refreshToken(): Promise<ResponseFormat>;
    logout(): Promise<ResponseFormat>;
    getUser(): Promise<ResponseFormat>;
    updatePassword(): Promise<ResponseFormat>;
    getAll(): Promise<ResponseFormat>;
    store(): Promise<ResponseFormat>;
    getMyAssignments(): Promise<ResponseFormat>;
    getOne(): Promise<ResponseFormat>;
    update(): Promise<ResponseFormat>;
    delete(): Promise<ResponseFormat>;
    getsSubmissionByAssignmentId(): Promise<ResponseFormat>;
    getOneByAssignmentIdAndUserId(): Promise<ResponseFormat>;
    createValuation(): Promise<ResponseFormat>;
}

export default IService;