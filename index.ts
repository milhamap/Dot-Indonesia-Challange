import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config as dotenv } from "dotenv";
dotenv();

// Routes
import AuthenticationRoutes from "./src/routers/AuthenticationRoutes";
import AssignmentRoutes from "./src/routers/AssignmentRoutes";
import SubmissionRoutes from "./src/routers/SubmissionRoutes";

// App
class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.plugins();
        this.routes();
    }

    protected plugins(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(morgan("dev"));
        this.app.use(cookieParser());
    }

    protected routes(): void {
        this.app.use("/api/v1/auth", AuthenticationRoutes);
        this.app.use("/api/v1/assignment", AssignmentRoutes);
        this.app.use("/api/v1/submission", SubmissionRoutes);
    }
}

const app = new App().app;
app.listen(process.env.PORT, () => {
    console.log(`Listening on http://localhost:${process.env.PORT}`);
});