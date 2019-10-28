import { Request, Response, NextFunction } from "express";
import { getAllUsers } from "../../data";
import { errorNames } from "../../constants/predefined_errors";

export async function checkUser(req: Request, res: Response, next: NextFunction) {
	const users = await getAllUsers();
	const { userName } = req.body;

	if (userName) {
		for (const user of users) {
			if (user.userName === userName) {
				next(errorNames.userAlreadyExists);
				break;
			}
		}

		next();
	} else {
		next(errorNames.missingOrIncorrectParams);
	}
}
