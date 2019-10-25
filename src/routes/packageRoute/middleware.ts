import { Request, Response, NextFunction } from "express";
import Package from "../../models/pojo/Package";
import Product from "../../models/pojo/Product";

import { getAllPackages } from "../../data";

import {
	validateProductName,
	validateProductDescription
} from "../../util/validations";
import { errorNames } from "../../constants/predefined_errors";

function validateProducts(products: Product[]) {
	return true;
}

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

export async function deletePackageValidations(
	req: Request,
	_: Response,
	next: NextFunction
) {
	const id = req.query.id;
	if (!id) {
		return next(errorNames.missingOrIncorrectParams);
	}
	const allPackages = await getAllPackages();
	const packageIndex = getPackageIndex(id, allPackages);

	if (packageIndex === -1) {
		return next(errorNames.resourceNotFound);
	}

	req.body.packageIndex = packageIndex;
	req.body.allPackages = allPackages;
	return next();
}

export async function updatePackageValidation(
	req: Request,
	_: Response,
	next: NextFunction
) {
	const { id } = req.body.id;
	if (!id) {
		next(errorNames.missingOrIncorrectParams);
	}

	const allPackages = await getAllPackages();
	const packageIndex = getPackageIndex(id, allPackages);
	if (packageIndex === -1) {
		return next(errorNames.resourceNotFound);
	}

	req.body.packageIndex = packageIndex;
	req.body.package = allPackages[packageIndex];
	next();
}

function validatePackages(packages: Package[]): boolean {
	if (!packages || packages.length === 0) {
		return false;
	}

	let isValid = true;

	for (const p of packages) {
		if (!validatePackage(p)) {
			isValid = false;
			break;
		}
	}

	return isValid;
}

function validatePackage(p: Package): boolean {
	const { name, description, products } = p;
	return (
		validateProductName(name) &&
		validateProductDescription(description) &&
		validateProducts(products)
	);
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
