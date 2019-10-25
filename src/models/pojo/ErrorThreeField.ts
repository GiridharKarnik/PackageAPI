export default class ErrorThreeField extends Error {
	public httpStatusCode: number;
	public errorCode: number;
	public errorMessage: string;
	public generatedError: string;

	constructor(httpStatusCode: number, errorCode: number, errorMessage: string) {
		super(errorMessage);
		this.httpStatusCode = httpStatusCode;
		this.errorCode = errorCode;
		this.errorMessage = errorMessage;
	}
}
