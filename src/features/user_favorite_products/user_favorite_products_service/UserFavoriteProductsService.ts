import {Injectable} from "@nestjs/common";
import {QueryFailedError, Repository} from "typeorm";
import UserFavoriteProductEntity from "./UserFavoriteProductEntity.js";
import {InjectRepository} from "@nestjs/typeorm";
import UserFavoriteProductsServiceProductWithGivenIdNotFoundError from "./UserFavoriteProductsServiceProductWithGivenIdNotFoundError.js";
import UsersMicroserviceClient from "../../users_microservice_client/UsersMicroserviceClient.js";
import UsersMicroserviceClientUserWithGivenIdNotFoundError from "../../users_microservice_client/UsersMicroserviceClientUserWithGivenIdNotFoundError.js";
import UserFavoriteProductsServiceUserWithGivenIdNotFoundError from "./UserFavoriteProductsServiceUserWithGivenIdNotFoundError.js";
import type Page from "../../../paging/Page.js";
import type Product from "../../products/products_controller/Product.js";
import paginatedFindAndCount from "../../../paging/paginatedFindAndCount.js";
import type PagingOptions from "../../../paging/PagingOptions.js";

@Injectable()
export default class UserFavoriteProductsService {
	private readonly userFavoriteProductsRepository: Repository<UserFavoriteProductEntity>;
	private readonly usersMicroserviceClient: UsersMicroserviceClient;
	public constructor(
		@InjectRepository(UserFavoriteProductEntity)
		userFavoriteProductsRepository: Repository<UserFavoriteProductEntity>,
		usersMicroserviceClient: UsersMicroserviceClient
	) {
		this.userFavoriteProductsRepository = userFavoriteProductsRepository;
		this.usersMicroserviceClient = usersMicroserviceClient;
	}
	public async addFavoriteProduct(userId: string, productId: string): Promise<void> {
		try {
			await this.usersMicroserviceClient.getUserById(userId);
		} catch (error) {
			if (error instanceof UsersMicroserviceClientUserWithGivenIdNotFoundError) {
				throw new UserFavoriteProductsServiceUserWithGivenIdNotFoundError(error.userId);
			}
			throw error;
		}

		try {
			await this.userFavoriteProductsRepository.insert({userId, productId});
		} catch (error) {
			if (
				error instanceof QueryFailedError &&
				error.message.includes("violates foreign key constraint")
			) {
				throw new UserFavoriteProductsServiceProductWithGivenIdNotFoundError(productId);
			}
			throw error;
		}
	}

	public async getFavoriteProducts(
		userId: string,
		pagingOptions: PagingOptions
	): Promise<Page<Product>> {
		try {
			await this.usersMicroserviceClient.getUserById(userId);
		} catch (error) {
			if (error instanceof UsersMicroserviceClientUserWithGivenIdNotFoundError) {
				throw new UserFavoriteProductsServiceUserWithGivenIdNotFoundError(error.userId);
			}
			throw error;
		}

		return (
			await paginatedFindAndCount(this.userFavoriteProductsRepository, pagingOptions, {
				where: {userId},
				relations: ["product"],
			})
		).map((userFavoriteProduct) => userFavoriteProduct.product);
	}
}
