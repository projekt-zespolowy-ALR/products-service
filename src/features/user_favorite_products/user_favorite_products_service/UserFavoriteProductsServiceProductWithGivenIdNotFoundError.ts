export default class UserFavoriteProductsServiceProductWithGivenIdNotFoundError extends Error {
	public readonly productId: string;

	public constructor(productId: string) {
		super(`Product with id ${productId} not found.`);
		this.productId = productId;
	}
}
