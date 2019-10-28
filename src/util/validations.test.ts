import { validateName, validateDescription, validatePackage, validatePackages, validateCurrencyFormat } from "./validations";
import Package from "../../src/models/pojo/Package";
import Product from "../../src/models/pojo/Product";

describe("validation tests", () => {

	describe("name validation tests", () => {
		it("empty package names should fail validations", () => {
			const result = validateName("");
			expect(result).toBe(false);
		});

		it("package names with 2 or less than 2 characters should fail validations", () => {
			const result = validateName("aa");
			expect(result).toBe(false);
		});

		it("package names with more than 2 characters should pass validations", () => {
			const result = validateName("package");
			expect(result).toBe(true);
		});
	});

	describe("description validation tests", () => {
		it("empty descriptions should fail validations", () => {
			const result = validateDescription("");
			expect(result).toBe(false);
		});

		it("descriptions with 2 or less than 2 characters should fail validations", () => {
			const result = validateDescription("aa");
			expect(result).toBe(false);
		});

		it("descriptions with more than 2 characters should pass validations", () => {
			const result = validateDescription("description");
			expect(result).toBe(true);
		});
	});

	describe("packages validation tests", () => {
		it("package with invalid names should fail validations", () => {
			const p = new Package("", "description");
			expect(validatePackage(p)).toBeFalsy();
		});

		it("packages with invalid description should fail validations", () => {
			const p = new Package("name", "");
			expect(validatePackage(p)).toBeFalsy();
		});

		it("packages with valid name and description should pass validations", () => {
			const p = new Package("name", "description");
			expect(validatePackage(p)).toBeTruthy();
		});

		it("packages with valid name, descriptions and products should pass validations", () => {
			const validProduct = new Product("name", 200);
			const validPackage = new Package("name", "description", [validProduct]);
			expect(validatePackages([validPackage])).toBeTruthy();
		});

		it("packages with valid name, descriptions but invalid products, should fail validations", () => {
			const invalidProduct = new Product("", 200);
			const p = new Package("name", "description", [invalidProduct]);
			expect(validatePackages([p])).toBeFalsy();
		});
	});

	describe("currency format validation", () => {
		it("currency format not in supported currencies should fail validations", () => {
			const result = validateCurrencyFormat("ZZZ");
			expect(result).toBeFalsy();
		});

		it("currency format in supported currencies should pass validations", () => {
			const result = validateCurrencyFormat("INR");
			expect(result).toBeTruthy();
		});
	});
});
