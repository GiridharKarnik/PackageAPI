import bcrypt from "bcrypt";
import logger from "winston";

const saltRounds = 10;

export const hash = async (password: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		bcrypt.hash(password, saltRounds, (error, hash) => {
			if (error) {
				logger.error("Error while hashing password: " + error.message);
				reject(error);
			} else {
				resolve(hash);
			}
		});
	});
};

export const compare = (hash: string, password: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(password, hash, (error, result) => {
			if (error) {
				logger.error("Error while verifying the password " + error.message);
				reject(error);
			} else {
				if (!result) {
					reject();
				} else {
					resolve();
				}
			}
		});
	});
};
