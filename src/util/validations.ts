import Package from "../../src/models/pojo/Package";
import Product from "../../src/models/pojo/Product";

export function validateName(productName: string) {
	return (
		productName &&
		productName.trim() !== "" &&
		productName.trim().length > 2
	);
}

export function validateDescription(description: string) {
	return (
		description &&
		description.trim() !== "" &&
		description.trim().length > 2
	);
}
