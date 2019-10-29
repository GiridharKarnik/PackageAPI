import uuid from "uuid";

class Product {
	public id: string;
	public name: string;
	public usdPrice: number;
	public price: number;
	public currencyFormat: string;

	constructor(name: string, usdPrice?: number, price?: number, currencyFormat?: string) {
		this.id = uuid.v1();
		this.name = name;
		this.usdPrice = usdPrice || null;
		this.price = price || null;
		this.currencyFormat = currencyFormat || null;
	}
}

export default Product;
