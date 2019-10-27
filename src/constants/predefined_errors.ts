import ErrorThreeField from "../models/pojo/ErrorThreeField";

export const errorNames = {
	dbReadError: "dbReadError",
	dbWriteError: "dbWriteError",
	passwordHashingError: "passwordHashingError",
	passwordDeHashingError: "passwordDeHashingError",
	missingFCMToken: "missingFCMToken",
	resourceNotFound: "resourceNotFound",
	duplicateEntry: "duplicateEntry",
	authTokenVerificationError: "authTokenVerificationError",
	missingOrIncorrectParams: "missingOrIncorrectParams",
	insufficientAuthInformation: "insufficientAuthInformation",
	serverError: "serverError",
	unauthorized: "unauthorized"
};

export const preDefinedErrors: { [index: string]: ErrorThreeField } = {};

preDefinedErrors[errorNames.dbReadError] = new ErrorThreeField(
	500,
	1,
	"Unable to read from the database"
);

preDefinedErrors[errorNames.dbWriteError] = new ErrorThreeField(
	500,
	2,
	"Unable to write to the database"
);

preDefinedErrors[errorNames.passwordHashingError] = new ErrorThreeField(
	500,
	3,
	"Error while hashing password"
);

preDefinedErrors[errorNames.passwordDeHashingError] = new ErrorThreeField(
	500,
	4,
	"Error while comparing passwords"
);

preDefinedErrors[errorNames.missingFCMToken] = new ErrorThreeField(
	500,
	5,
	"Intended user does not have an FCM token registered"
);

preDefinedErrors[errorNames.resourceNotFound] = new ErrorThreeField(
	404,
	6,
	"Requested Resource or user was not found"
);

preDefinedErrors[errorNames.authTokenVerificationError] = new ErrorThreeField(
	500,
	7,
	"Error while verifying the authentication information."
);

preDefinedErrors[errorNames.insufficientAuthInformation] = new ErrorThreeField(
	401,
	8,
	"Information needed for authentication is not provided. If you are trying to hack, well, FUCK YOU..!!"
);

preDefinedErrors[errorNames.serverError] = new ErrorThreeField(
	500,
	9,
	"Something wen't wrong, yes 'something', cause we really don't know what fucked up.!"
);

preDefinedErrors[errorNames.unauthorized] = new ErrorThreeField(
	401,
	10,
	"Unauthorized to perform this action."
);

preDefinedErrors[errorNames.missingOrIncorrectParams] = new ErrorThreeField(
	401,
	11,
	"Missing or incorrect input parameters"
);

preDefinedErrors[errorNames.missingOrIncorrectParams] = new ErrorThreeField(
	401,
	12,
	"Package with the name already exists."
);

export const getError = (errorName: string, generatedErrorMessage?: string) => {
	const error = preDefinedErrors[errorName];
	error.generatedError = generatedErrorMessage || "NA";
	return error;
};
