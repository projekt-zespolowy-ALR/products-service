export default class UserFavoriteProductsServiceUserWithGivenIdNotFoundError extends Error {
	public readonly userId: string;

	public constructor(userId: string) {
		super(`User with id ${userId} not found.`);
		this.userId = userId;
	}
}
