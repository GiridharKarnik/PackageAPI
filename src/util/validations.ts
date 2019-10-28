import Package from "../../src/models/pojo/Package";
import Product from "../../src/models/pojo/Product";

import supportedCurrencies from "../constants/supportedCurrencies";

export function validateName(productName: string) {
	if (productName) {
		return (productName.trim() !== "" &&
			productName.trim().length > 2);
	} else {
		return false;
	}
}

export function validateDescription(description: string) {
	if (description) {
		return (description.trim() !== "" &&
			description.trim().length > 2);
	} else {
		return false;
	}
}

export function validatePackages(packages: Package[]) {
	let isValid = true;

	for (const p of packages) {
		if (!validatePackage(p)) {
			isValid = false;
			break;
		}
	}

	return isValid;
}

export function validatePackage(p: Package) {
	let isValid = true;
	const properties = Object.keys(p);

	for (const property of properties) {
		switch (property) {
			case "name": {
				if (!validateName(p.name)) {
					isValid = false;
				}
				break;
			}
			case "description": {
				if (!validateDescription(p.description)) {
					isValid = false;
				}
				break;
			}
			case "products": {
				if (p.products && !validateProducts(p.products)) {
					isValid = false;
				}
				break;
			}
		}

		if (!isValid) {
			break;
		}
	}

	return isValid;
}

export function validateProducts(products: Product[]) {
	let isValid = true;

	for (const p of products) {
		if (!validateProduct(p)) {
			isValid = false;
			break;
		}
	}
	return isValid;
}

export function validateProduct(product: Product) {
	if (!validateName(product.name)) {
		return false;
	}

	return true;
}

export function validateCurrencyFormat(currencyFormat: string) {
	if (currencyFormat) {
		if (!supportedCurrencies.includes(currencyFormat.trim())) {
			return false;
		}
	}
}
