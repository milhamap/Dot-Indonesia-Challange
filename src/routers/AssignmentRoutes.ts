import BaseRoutes from "./BaseRoutes";
// import validate from "../middlewares/AuthValidator";
import AuthenticationMiddleware from "../middlewares/AuthenticationMiddleware";

// Controllers
import AssignmentController from "../controllers/AssignmentController";
import Multer from "../utils/Multer";

const configFile = new Multer('assignments');
const up = configFile.upload();

class AssignmentRoutes extends BaseRoutes {
    public routes(): void {
        this.router.post('/', up.single('file'), AuthenticationMiddleware.isLecturer, AssignmentController.create)
        this.router.get('/', AuthenticationMiddleware.verifyToken, AssignmentController.index)
        this.router.get('/me/', AuthenticationMiddleware.isLecturer, AssignmentController.getMyAssignments)
        this.router.get('/:random', AuthenticationMiddleware.verifyToken, AssignmentController.show)
        this.router.put('/:random', up.single('file'), AuthenticationMiddleware.isLecturer, AssignmentController.update)
        this.router.delete('/:random', AuthenticationMiddleware.isLecturer, AssignmentController.delete)
    }
}

export default new AssignmentRoutes().router;