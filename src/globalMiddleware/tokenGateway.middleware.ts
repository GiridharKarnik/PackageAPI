import { Application, Request, Response, NextFunction } from "express";

import { errorNames } from "../constants/predefined_errors";
import logger from "winston";
import jwt from "jsonwebtoken";

export default (secureRoute: any, app: Application) => {
	secureRoute.use((req: Request, res: Response, next: NextFunction) => {
		//check whether the request contains a token. The token can be either in the header or in the body
		const token =
			req.body.token || req.query.token || req.headers["x-access-token"];

		if (token) {
			//verify whether the received token is valid
			jwt.verify(token, 'private_key', (err: any, decoded: any) => {
				if (err) {
					next(errorNames.unauthorized);
				} else {
					next();
				}
			});
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
