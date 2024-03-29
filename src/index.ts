import express, { Application } from 'express'
import cors from "cors"
import morgan from "morgan"
import { ConfigServer } from "./config/config"
import swaggerUi from 'swagger-ui-express';
import { PersonRouter } from './persons/person.router';
import { RoleRouter } from './role/role.router';
import { DocumentRouter } from './document_type/document.router';
import { AuthRouter } from './auth/auth.service';


class Server extends ConfigServer {
    private readonly app: Application
    private readonly PORT: number

    constructor() {
        super()
        this.app = express()
        this.PORT = this.getNumberEnv("PORT") || 3000
        this.middlewares()
        this.db()
        this.app.use("/api", this.routers())
        this.app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(this.swagger()));
        this.swagger()
        this.listen()
    }

    middlewares() {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cors())
        this.app.use(morgan("dev"))
    }

    routers(): express.Router[] {
        return [
            new PersonRouter().router,
            new RoleRouter().router,
            new DocumentRouter().router,
            new AuthRouter().router
        ]
    }

    listen() {
        this.app.listen(this.PORT, () => {
            console.log(`Server running on port: ${this.PORT} - http://localhost:${this.PORT}`);
        })
    }
}

new Server()