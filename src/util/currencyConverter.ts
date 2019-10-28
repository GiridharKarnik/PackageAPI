import request from "request";
import { EXCHANGE_RATES_API } from "../constants/publicAPIs";

import supportedCurrencies from "../constants/supportedCurrencies";
import Package from "../../src/models/pojo/Package";
import Product from "../../src/models/pojo/Product";
import { resolve } from "url";

export function obtainExchangeRates(): Promise<any> {

	return new Promise(async (resolve, reject) => {
		request(`${EXCHANGE_RATES_API}?base=USD`, (error, response, body) => {
			if (error) {
				reject(`Error converting`);
			} else if (response.statusCode !== 200) {
				reject(`Error converting`);
			} else {
				const result = JSON.parse(body);
				resolve(result.rates);
			}
		});
	});
}

export function convertToUSD(exchangeRates: any, price: number, currencyFormat: string): number {
	if (!currencyFormat || currencyFormat.trim() === "" || !supportedCurrencies.includes(currencyFormat.trim())) {
		return price;
	}

	return price / exchangeRates[currencyFormat.trim()];
}

export function normalizePriceForPackages(packages: Package[]): Promise<Package[]> {
	return new Promise(async (resolve, reject) => {

		const exchangeRates = await obtainExchangeRates();

		packages.forEach((p: Package) => {
			if (p.products && p.products.length > 0) {
				p.products.forEach((product: Product) => {
					product.usdPrice = convertToUSD(exchangeRates, product.price, product.currencyFormat);
				});
			}
		});

		resolve(packages);
	});
}

export function normalizePriceForProducts(products: Product[]): Promise<Product[]> {
	return new Promise(async (resolve, reject) => {

		if (!products || products.length === 0) {
			resolve(products);
		}

		const exchangeRates = await obtainExchangeRates();

		products.forEach((product: Product) => {
			product.usdPrice = convertToUSD(exchangeRates, product.price, product.currencyFormat);
		});

		resolve(products);
	});
}
