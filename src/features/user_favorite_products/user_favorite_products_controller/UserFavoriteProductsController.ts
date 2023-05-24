import {
	Controller,
	Get,
	NotFoundException,
	Param,
	Put,
	Query,
	ValidationPipe,
} from "@nestjs/common";
import UserFavoriteProductsService from "../user_favorite_products_service/UserFavoriteProductsService.js";
import UserFavoriteProductsServiceProductWithGivenIdNotFoundError from "../user_favorite_products_service/UserFavoriteProductsServiceProductWithGivenIdNotFoundError.js";
import UserFavoriteProductsServiceUserWithGivenIdNotFoundError from "../user_favorite_products_service/UserFavoriteProductsServiceUserWithGivenIdNotFoundError.js";
import type Product from "../../products/products_controller/Product.js";
import type Page from "../../../paging/Page.js";
import PagingOptions from "../../../paging/PagingOptions.js";

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

	@Get("/")
	public async getFavoriteProducts(
		@Query(
			new ValidationPipe({
				transform: true, // Transform to instance of PagingOptions
				whitelist: true, // Do not put other query parameters into the object
			})
		)
		pagingOptions: PagingOptions,
		@Param("userId") userId: string
	): Promise<Page<Product>> {
		try {
			return await this.userFavoriteProductsService.getFavoriteProducts(userId, pagingOptions);
		} catch (error) {
			if (error instanceof UserFavoriteProductsServiceUserWithGivenIdNotFoundError) {
				throw new NotFoundException(`User with id "${userId}" not found.`);
			}
			throw error;
		}
	}
}
