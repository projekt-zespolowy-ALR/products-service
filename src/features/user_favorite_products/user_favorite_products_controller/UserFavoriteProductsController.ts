import {Controller, NotFoundException, Param, Put} from "@nestjs/common";
import UserFavoriteProductsService from "../user_favorite_products_service/UserFavoriteProductsService.js";
import UserFavoriteProductsServiceProductWithGivenIdNotFoundError from "../user_favorite_products_service/UserFavoriteProductsServiceProductWithGivenIdNotFoundError.js";
import UserFavoriteProductsServiceUserWithGivenIdNotFoundError from "../user_favorite_products_service/UserFavoriteProductsServiceUserWithGivenIdNotFoundError.js";

@Controller("/users/:userId/favorite-products")
export default class UserFavoriteProductsController {
	private readonly userFavoriteProductsService: UserFavoriteProductsService;
	public constructor(userFavoriteProductsService: UserFavoriteProductsService) {
		this.userFavoriteProductsService = userFavoriteProductsService;
	}

	@Put("/:productId")
	public async addFavoriteProduct(
		@Param("userId") userId: string,
		@Param("productId") productId: string
	): Promise<void> {
		try {
			await this.userFavoriteProductsService.addFavoriteProduct(userId, productId);
		} catch (error) {
			if (error instanceof UserFavoriteProductsServiceProductWithGivenIdNotFoundError) {
				throw new NotFoundException(`Product with id "${productId}" not found.`);
			}
			if (error instanceof UserFavoriteProductsServiceUserWithGivenIdNotFoundError) {
				throw new NotFoundException(`User with id "${userId}" not found.`);
			}
			throw error;
		}
	}
}
