export function validateProductName(productName: string) {
	return (
		productName &&
		productName.trim() !== "" &&
		productName.trim().length > 2
	);
}

export function validateProductDescription(description: string) {
	return (
		description &&
		description.trim() !== "" &&
		description.trim().length > 2
	);
}
