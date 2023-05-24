import {
	Controller,
	Delete,
	Get,
	Head,
	NotFoundException,
	Param,
	Put,
	Query,
	Res,
	ValidationPipe,
} from "@nestjs/common";
import UserFavoriteProductsService from "../user_favorite_products_service/UserFavoriteProductsService.js";
import UserFavoriteProductsServiceProductWithGivenIdNotFoundError from "../user_favorite_products_service/UserFavoriteProductsServiceProductWithGivenIdNotFoundError.js";
import UserFavoriteProductsServiceUserWithGivenIdNotFoundError from "../user_favorite_products_service/UserFavoriteProductsServiceUserWithGivenIdNotFoundError.js";
import type Product from "../../products/products_controller/Product.js";
import type Page from "../../../paging/Page.js";
import PagingOptions from "../../../paging/PagingOptions.js";
import type {FastifyReply} from "fastify";

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

	@Head("/:productId")
	public async isProductFavorite(
		@Param("userId") userId: string,
		@Param("productId") productId: string,
		@Res() response: FastifyReply
	): Promise<void> {
		try {
			const isProductFavorite = await this.userFavoriteProductsService.isProductFavorite(
				userId,
				productId
			);
			if (!isProductFavorite) {
				response.status(404).send();
			} else {
				response.status(200).send();
			}
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

	@Delete("/:productId")
	public async removeFavoriteProduct(
		@Param("userId") userId: string,
		@Param("productId") productId: string
	): Promise<void> {
		try {
			await this.userFavoriteProductsService.removeFavoriteProduct(userId, productId);
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
