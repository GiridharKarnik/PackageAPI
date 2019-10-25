import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import { Application } from "express";

export default (app: Application, config: any) => {
	// parse application/x-www-form-urlencoded
	app.use(
		bodyParser.urlencoded({
			extended: false
		})
	);

	// parse application/json
	app.use(bodyParser.json());

	app.use(bodyParser.text());

	app.use(cors());

	app.use(morgan("dev"));
};
