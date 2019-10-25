import express, { Application, Request, Response, NextFunction } from "express";
import { Logger } from "winston";

import db from "../data/db";

function getPackageRoutes(app: Application, logger: Logger, envConfig: any) {
	const packageRoute = express.Router();

	packageRoute.get("/", (req: Request, res: Response) => {
		res.status(200).send("Welcome to package route");
	});

	packageRoute.post("/", (req: Request, res: Response, next: NextFunction) => {
		
	});

	return packageRoute;
}

export default getPackageRoutes;
