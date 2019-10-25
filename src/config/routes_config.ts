import { Application, Request, Response } from "express";
import { Logger } from "winston";
import expressErrorHandler from "./express_error_handler";

import getPackageRoutes from "../routes/packageRoute";

export default (app: Application, logger: Logger, envConfig: any) => {

	app.use("/package", getPackageRoutes(app, logger, envConfig));

	app.get("/", (req: Request, res: Response) => {
		res.send("Welcome to abc API");
	});

	//set up error handler
	expressErrorHandler(app);
};
