import { hash, compare } from "./authentication";

describe("auth helper methods test", () => {

	const validPassword = "password";

	it("password should be hashed without errors", async () => {
		try {
			await hash(validPassword);
		} catch (error) {
			throw new Error(error);
		}
	});

	it("correct password should pass the compare", async () => {
		try {
			const hashedPassword = await hash(validPassword);
			const result = await compare(hashedPassword, validPassword);

			expect(result).toBeTruthy();
		} catch (error) {
			throw new Error(error);
		}
	});

	it("incorrect password should fail the compare", async () => {
		try {
			const hashedPassword = await hash(validPassword);
			const result = await compare(hashedPassword, "invalidPassword");

			expect(result).toBeFalsy();
		} catch (error) {
			throw new Error(error);
		}
	});
});
