import { Application, Request, Response, NextFunction } from "express";

import { errorNames } from "../constants/predefined_errors";
import logger from "winston";

export default (secureRoute: any, app: Application) => {
	secureRoute.use((req: Request, res: Response, next: NextFunction) => {
		//check whether the request contains a token. The token can be either in the header or in the body
		const token =
			req.body.token || req.query.token || req.headers["x-access-token"];

		const uid = req.body.uid || req.query.uid || req.headers.uid;

		if (token && uid) {
			//verify whether the received token is valid
		} else {
			//if there is not token
			if (
				process.env.NODE_ENV === "test" ||
				process.env.NODE_ENV === "development"
			) {
				next();
			} else {
				logger.error("No authorization headers found");
				next(errorNames.insufficientAuthInformation);
			}
		}
	});
};
