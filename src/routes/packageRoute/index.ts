import express, { Application, Request, Response, NextFunction } from "express";
import { Logger } from "winston";
import { getAllPackages, addPackage, savePackages } from "../../data";

import { errorNames } from "../../constants/predefined_errors";

import Package from "../../models/pojo/Package";
import Product from "../../models/pojo/Product";

import {
	newPackageValidations,
	idCheck,
	packageAttrValidation
} from "./middleware";

function getPackageRoutes(app: Application, logger: Logger, envConfig: any) {
	const packageRoute = express.Router();

	packageRoute.get(
		"/",
		async (_: Request, res: Response, next: NextFunction) => {
			const allPackages = await getAllPackages();

			if (allPackages) {
				res.status(200).send(allPackages);
			} else {
				next(errorNames.resourceNotFound);
			}
		}
	);

	packageRoute.get("/:id", idCheck, async (req: Request, res: Response, next: NextFunction) => {
		res.status(200).send(req.body.allPackages[req.body.packageIndex]);
	});

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
		idCheck,
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
		idCheck,
		packageAttrValidation,
		(req: Request, res: Response, next: NextFunction) => {
			const p = req.body.allPackages[req.body.packageIndex];
			Object.keys(p).forEach((k) => {
				if (req.body[k] && k !== "products") {
					p[k] = req.body[k];
				}
			});

			savePackages(req.body.allPackages.splice(req.body.index, 1, p));
			res.status(200).send(p);
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
