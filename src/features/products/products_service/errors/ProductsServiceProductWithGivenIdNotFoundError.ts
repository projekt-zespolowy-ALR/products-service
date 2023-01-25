class ProductsServiceProductWithGivenIdNotFoundError extends Error {
	public readonly productId: string;
	constructor(productId: string) {
		super(`Product with id ${productId} was not found.`);
		this.productId = productId;
	}
}

export default ProductsServiceProductWithGivenIdNotFoundError;
