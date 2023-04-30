import BaseRoutes from "./BaseRoutes";
import AuthenticationMiddleware from "../middlewares/AuthenticationMiddleware";

// Controllers
import SubmissionController from "../controllers/SubmissionController";
import Multer from "../utils/Multer";

const configFile = new Multer('submissions');
const up = configFile.upload();

class AssignmentRoutes extends BaseRoutes {
    public routes(): void {
        this.router.post("/", up.single('file'), AuthenticationMiddleware.isStudent, SubmissionController.create);
        this.router.get("/", AuthenticationMiddleware.isLecturer, SubmissionController.index);
        this.router.get("/:randomAssignment", AuthenticationMiddleware.isStudent, SubmissionController.show);
        this.router.put("/:random", up.single('file'), AuthenticationMiddleware.isStudent, SubmissionController.update);
        this.router.put("/:random/valuation", AuthenticationMiddleware.isLecturer, SubmissionController.createValuation);
        this.router.delete("/:random", AuthenticationMiddleware.isStudent, SubmissionController.delete);
    }
}

export default new AssignmentRoutes().router;