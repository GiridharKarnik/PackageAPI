import { obtainExchangeRates, convertToUSD, normalizePriceForPackages, normalizePriceForProducts } from "./currencyConverter";
import Product from "../models/pojo/Product";
import Package from "../models/pojo/Package";

describe("currency converter tests", () => {

	let rates: any = null;

	beforeAll(async () => {
		try {
			rates = await obtainExchangeRates();
		} catch (error) {
			throw new Error(error);
		}
	});

	it("should obtain the latest exchange rates", () => {
		expect(rates).toBeDefined();
		expect(typeof rates).toBe("object");
	});

	it("should convert currencies to USD according to rates", () => {
		const inrAmount = 300;
		const usdAmount = inrAmount / rates.INR;

		expect(convertToUSD(rates, inrAmount, "INR")).toBe(usdAmount);
	});

	it("packages with non USD product prices, should be normalized", async () => {
		const product = new Product("test_product_name", null, 200, "INR");
		const pac = new Package("package_name", "description", [product]);

		try {
			const normalizedPackage = await normalizePriceForPackages([pac]);
			const normalizedPrice = product.price / rates.INR;
			expect(normalizedPackage[0].products[0].usdPrice).toBe(normalizedPrice);
		} catch (error) {
			throw new Error(error);
		}
	});

	it("products with non USD product prices, should be normalized", async () => {
		const product0 = new Product("test_product_name", null, 200, "INR");
		const product1 = new Product("test_product_name", null, 400, "INR");

		try {
			const normalizedProducts = await normalizePriceForProducts([product0, product1]);
			const normalizedPrice0 = product0.price / rates.INR;
			const normalizedPrice1 = product1.price / rates.INR;
			expect(normalizedProducts[0].usdPrice).toBe(normalizedPrice0);
			expect(normalizedProducts[1].usdPrice).toBe(normalizedPrice1);
		} catch (error) {
			throw new Error(error);
		}
	});
});
