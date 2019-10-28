import Product from "./Product";
import uuid from "uuid";

class Package {
	public id: string;
	public name: string;
	public description: string;
	public products: Product[];

	constructor(name: string, description: string, products?: Product[]) {
		this.id = uuid.v1();
		this.name = name;
		this.description = description;
		this.products = products || null;
	}
}

export default Package;
