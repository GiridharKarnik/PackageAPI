import { Request, Response, NextFunction } from "express";
import Package from "../../models/pojo/Package";
import Product from "../../models/pojo/Product";

import { getAllPackages } from "../../data";

import {
	validateName,
	validateDescription
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
	const { name, description } = req.body;
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
		validateName(name) &&
		validateDescription(description) &&
		validateProducts(products)
	);
}

function validateProducts(products: Product[]) {
	let isValid = true;

	for (const p of products) {
		if (!validateProduct(p)) {
			isValid = false;
			break;
		}
	}
	return isValid;
}

function validateProduct(product: Product) {
	return validateName(product.name);
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
