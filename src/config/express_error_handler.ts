import { Request, Response, NextFunction, Application } from "express";
import { preDefinedErrors } from "../constants/predefined_errors";
import logger from "winston";

export default (app: Application) => {
	app.use((error: any, req: Request, res: Response, next: NextFunction) => {
		if (!error) {
			next();
		}

		const predefinedError = preDefinedErrors[error];

		if (predefinedError) {
			res.status(predefinedError.httpStatusCode);
			res.send({
				error_code: predefinedError.errorCode,
				error_message: predefinedError.errorMessage
			});
		} else {
			//All uncaught exception are caught here. 'error' variable will contain the needed details.
			logger.error("Uncaught exception: " + error);
		}
	});
};
