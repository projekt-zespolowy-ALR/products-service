type ProductInDataSource = {
	readonly productId: string;
	readonly dataSourceId: string;
	readonly referenceUrl: string | null;
	readonly imageUrl: string | null;
	readonly price: number | null;
};

export default ProductInDataSource;
