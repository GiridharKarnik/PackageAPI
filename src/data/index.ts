import fs from "fs";
import * as path from "path";
import Package from "../../src/models/pojo/Package";

export function getAllPackages(): Promise<[Package]> {
	return new Promise((resolve, reject) => {
		fs.readFile(
			path.resolve(__dirname, "./db.json"),
			"utf8",
			(err, jsonString) => {
				if (err) {
					reject(err.message);
				} else {
					try {
						const db = JSON.parse(jsonString);
						resolve(db.packages);
					} catch (err) {
						reject(err.message);
					}
				}
			}
		);
	});
}

export function getPackage(id: string) {
	return new Promise(async (resolve, reject) => {
		try {
			const allPackages: [Package] = await getAllPackages();
			const p = allPackages.find(p => {
				return p.id === id;
			});

			resolve(p);
		} catch (err) {
			reject(err.message);
		}
	});
}

export function addPackage(p: Package | Package[]) {
	return new Promise(async (resolve, reject) => {
		try {
			let allPackages: Package[] = await getAllPackages();
			if (Array.isArray(p)) {
				allPackages = [...allPackages, ...p];
			} else {
				allPackages.push(p);
			}
			savePackages(allPackages);
			resolve();
		} catch (err) {
			reject(err);
		}
	});
}

export function savePackages(packages: Package[] | Package) {
	const data = {
		packages
	};

	const jsonString = JSON.stringify(data);

	return new Promise((resolve, reject) => {
		fs.writeFile(path.resolve(__dirname, "./db.json"), jsonString, err => {
			if (err) {
				reject(err.message);
			} else {
				resolve();
			}
		});
	});
}
