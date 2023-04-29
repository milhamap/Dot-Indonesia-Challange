import BaseRoutes from "./BaseRoutes";
// import validate from "../middlewares/AuthValidator";
import AuthenticationMiddleware from "../middlewares/AuthenticationMiddleware";

// Controllers
import AuthenticationController from "../controllers/AuthenticationController";

class AuthenticationRoutes extends BaseRoutes {
    public routes(): void {
        this.router.post("/send-email", AuthenticationController.sendEmailVerification);
        this.router.get("/verify/:token", AuthenticationController.confirmVerificationEmail);
        this.router.post("/register-student", AuthenticationController.registerStudent);
        this.router.post("/login", AuthenticationController.login);
        this.router.post("/register-lecture", AuthenticationMiddleware.isAdmin, AuthenticationController.registerLecturer);
        this.router.get('/refresh-token', AuthenticationController.refreshToken);
        this.router.delete('/logout', AuthenticationController.logout);
        this.router.get("/", AuthenticationMiddleware.verifyToken, AuthenticationController.getUser);
        this.router.put("/update-password", AuthenticationMiddleware.verifyToken, AuthenticationController.updatePassword);
    }
}

export default new AuthenticationRoutes().router;