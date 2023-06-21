export type DumpOffer = {
	product: DumpProduct;
	dataSource: DumpDataSource;
	pricePln: number | null;
	description: string | null;
	imageUrl: string | null;
	referenceUrl: string | null;
};
export type DumpBrand = {
	name: string | null;
	slug: string;
};
export type DumpCategory = {
	name: string | null;
	slug: string;
};
export type DumpDataSource = {
	name: string;
	slug: string;
	url: string;
};
export type DumpIngredient = {
	latinName: string | null;
	slug: string;
};

export type DumpProduct = {
	slug: string;

	massKilograms: number | null;

	volumeLiters: number | null;

	name: string | null;

	brand: DumpBrand | null;

	categories: DumpCategory[] | null;

	ingredients: DumpIngredient[] | null;
};
