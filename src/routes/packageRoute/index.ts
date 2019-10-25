import express, { Application, Request, Response, NextFunction } from "express";
import { Logger } from "winston";

import db from "../../data/db";
import { getAllPackages, addPackage, savePackages } from "../../data";

import { errorNames } from "../../constants/predefined_errors";

import Package from "../../models/pojo/Package";
import Product from "../../models/pojo/Product";

import {
	newPackageValidations,
	deletePackageValidations,
	updatePackageValidation
} from "./middleware";

function getPackageRoutes(app: Application, logger: Logger, envConfig: any) {
	const packageRoute = express.Router();

	packageRoute.get(
		"/",
		async (req: Request, res: Response, next: NextFunction) => {
			const allPackages = await getAllPackages();

			if (allPackages) {
				res.status(200).send(allPackages);
			} else {
				next(errorNames.resourceNotFound);
			}
		}
	);

	packageRoute.post(
		"/",
		newPackageValidations,
		async (req: Request, res: Response, next: NextFunction) => {
			const packages = composePackages(req.body.packages);

			await addPackage(packages);
			res.status(201).send(packages);
		}
	);

	packageRoute.delete(
		"/",
		deletePackageValidations,
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const allPackages = req.body.allPackages;
				const deletedPackage = allPackages.splice(
					req.body.packageIndex,
					1
				);

				await savePackages(allPackages);
				res.status(200).send(deletedPackage);
			} catch (error) {
				logger.error(error.message);
				next(error.message);
			}
		}
	);

	packageRoute.put(
		"/",
		updatePackageValidation,
		(req: Request, res: Response, next: NextFunction) => {
			console.log("Hello");
		}
	);

	return packageRoute;
}

function composePackages(packages: Package[]) {
	return packages.map(p => {
		return new Package(p.name, p.description, composeProducts(p.products));
	});
}

function composeProducts(products: Product[]): Product[] {
	const composed: Product[] = products.map(p => {
		return new Product(p.name, p.usdPrice);
	});

	return composed;
}

export default getPackageRoutes;
