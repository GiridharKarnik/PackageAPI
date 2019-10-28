import express, { Application, Request, Response, NextFunction } from "express";
import { Logger } from "winston";
import { errorNames } from "../../constants/predefined_errors";
import { hash, compare } from "../../util/authentication";
import { getPasswordForUser, saveUserToDB } from "../../data";

import { checkUser } from "./middleware";
import tokenGateway from "../../globalMiddleware/tokenGateway.middleware";

import jwt from "jsonwebtoken";

function getUserRoutes(app: Application, logger: Logger, envConfig: any) {
	const packageRoute = express.Router();

	packageRoute.post("/signUp", checkUser, async (req: Request, res: Response, next: NextFunction) => {
		const { userName, password } = req.body;

		if (userName === null || password === null) {
			return next(errorNames.missingOrIncorrectParams);
		}

		const hashedPassword = await hash(password);
		saveUserToDB(userName, hashedPassword).then(() => {
			res.status(200).send("Signed up successfully");
		}).catch((error) => {
			next(errorNames.passwordDeHashingError);
		});

	});

	packageRoute.post("/auth", async (req: Request, res: Response, next: NextFunction) => {
		const { userName, password } = req.body;

		if (userName === null || password === null) {
			return next(errorNames.missingOrIncorrectParams);
		}

		const storedHashedPassword = await getPasswordForUser(userName);
		compare(storedHashedPassword, password).then(() => {
			res.status(200).send({ jwt: jwt.sign({ userName }, "private_key") });
		}).catch((err) => {
			return next(errorNames.invalidCredentials);
		});
	});

	tokenGateway(packageRoute, app);

	packageRoute.get("/validate", (req: Request, res: Response, next: NextFunction) => {
		res.status(200).send("valid");
	});

	return packageRoute;
}

export default getUserRoutes;
