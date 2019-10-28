import { Request, Response, NextFunction } from "express";
import Package from "../../models/pojo/Package";
import Product from "../../models/pojo/Product";

import { getAllPackages } from "../../data";

import {
	validateName,
	validateDescription,
	validatePackages,
	validateProducts
} from "../../util/validations";

import { errorNames } from "../../constants/predefined_errors";

export function newPackageValidations(
	req: Request,
	_: Response,
	next: NextFunction
) {
	const { packages } = req.body;

	if (!validatePackages(packages)) {
		return next(errorNames.missingOrIncorrectParams);
	} else {
		next();
	}
}

export async function idCheck(req: Request, res: Response, next: NextFunction) {
	const id = req.query.id;
	if (!id) {
		return next(errorNames.missingOrIncorrectParams);
	}

	const allPackages = await getAllPackages();
	const packageIndex = getPackageIndex(id, allPackages);

	if (packageIndex === -1) {
		return next(errorNames.resourceNotFound);
	}

	req.body.allPackages = allPackages;
	req.body.packageIndex = packageIndex;

	next();
}

export async function packageAttrValidation(
	req: Request,
	_: Response,
	next: NextFunction
) {
	const { name, description, products } = req.body;
	if (name) {
		if (!validateName(name)) {
			next(errorNames.missingOrIncorrectParams);
			return;
		}
	}

	if (description) {
		if (!validateDescription(description)) {
			next(errorNames.missingOrIncorrectParams);
			return;
		}
	}

	if (products) {
		if (!validateProducts(products)) {
			next(errorNames.missingOrIncorrectParams);
			return;
		}
	}

	next();
}

export async function duplicateProductCheck(req: Request, res: Response, next: NextFunction) {
	const { products } = req.body;

	if (products && products.length > 0) {
		const p = req.body.allPackages[req.body.packageIndex];
		if (p.products && p.products.length > 0) {
			for (const newProduct of products) {
				for (const ep of p.products) {
					if (newProduct.name === ep.name) {
						return next(errorNames.duplicateProduct);
					}
				}
			}
		}
	}

	next();
}

function getPackageIndex(id: string, packages: Package[]) {
	let packageIndex = -1;

	for (let i = 0; i < packages.length; i++) {
		const p = packages[i];
		if (p.id === id.trim()) {
			packageIndex = i;
			break;
		}
	}

	return packageIndex;
}
