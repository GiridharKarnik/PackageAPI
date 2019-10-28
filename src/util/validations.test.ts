import { validateName, validateDescription, validatePackage } from "./validations";
import Package from "../../src/models/pojo/Package";

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
	});
});
