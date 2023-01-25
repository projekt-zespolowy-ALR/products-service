class ProductsServiceProductWithGivenSlugNotFoundError extends Error {
	public readonly productSlug: string;
	constructor(productSlug: string) {
		super(`Product with slug ${productSlug} was not found.`);
		this.productSlug = productSlug;
	}
}

export default ProductsServiceProductWithGivenSlugNotFoundError;
