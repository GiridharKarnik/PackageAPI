import uuid from "uuid";

class Product {
	public id: string;
	public name: string;
	public usdPrice: number;
	public price: number;
	public currencyFormat: string;

	constructor(name: string, usdPrice: number) {
		this.id = uuid.v1();
		this.name = name;
		this.usdPrice = usdPrice;
	}
}

export default Product;
