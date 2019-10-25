import { Application } from "express";

import envConfigs from "./env_config";
import expressConfig from "./express_config";
import loggerConfig from "./logger_config";
import routesConfig from "./routes_config";

export default (app: Application) => {
	const env = process.env.NODE_ENV || "development";

	const envConfig = envConfigs[env];

	const logger = loggerConfig(envConfig);
	expressConfig(app, envConfig);
	routesConfig(app, envConfig, logger);

	return {
		envConfig,
		logger
	};
};
