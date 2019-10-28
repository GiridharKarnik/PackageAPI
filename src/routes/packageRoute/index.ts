import express, { Application, Request, Response, NextFunction } from "express";
import { Logger } from "winston";
import { getAllPackages, addPackage, savePackages } from "../../data";

import { errorNames } from "../../constants/predefined_errors";
import supportedCurrencies from "../../constants/supportedCurrencies";

import Package from "../../models/pojo/Package";
import Product from "../../models/pojo/Product";

import { normalizePriceForPackages, normalizePriceForProducts } from "../../util/currencyConverter";

import {
	newPackageValidations,
	idCheck,
	packageAttrValidation,
	duplicateProductCheck
} from "./middleware";

import tokenGateway from "../../globalMiddleware/tokenGateway.middleware";

function getPackageRoutes(app: Application, logger: Logger, envConfig: any) {
	const packageRoute = express.Router();

	tokenGateway(packageRoute, app);

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
			const packages = await composePackages(req.body.packages);
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
		duplicateProductCheck,
		async (req: Request, res: Response, next: NextFunction) => {
			const p = req.body.allPackages[req.body.packageIndex];
			const properties = Object.keys(p);

			for (const property of properties) {
				if (req.body[property] === "products") {
					const newProducts = await normalizePriceForProducts(req.body.products);
					p[property] = [...p.products, ...newProducts];
				} else if (req.body[property]) {
					p[property] = req.body[property];
				}
			}

			const updatedPackages = req.body.allPackages.splice(req.body.index, 1, p);
			await savePackages(updatedPackages);
			res.status(200).send(p);
		}
	);

	return packageRoute;
}

async function composePackages(packages: Package[]) {
	const usdPricedPackages = await normalizePriceForPackages(packages);

	const newPackages = usdPricedPackages.map(p => {
		return new Package(p.name, p.description, composeProducts(p.products));
	});

	return newPackages;
}

function composeProducts(products: Product[]): Product[] {
	const composed: Product[] = products.map(p => {
		return new Product(p.name, p.usdPrice);
	});

	return composed;
}

export default getPackageRoutes;
