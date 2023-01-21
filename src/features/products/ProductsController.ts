import {
	Body,
	Controller,
	Get,
	HttpStatus,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Post,
	Query,
	ValidationPipe,
	Version,
	Headers,
	Delete,
} from "@nestjs/common";
import {ApiNotFoundResponse, ApiOkResponse, ApiProduces, ApiTags} from "@nestjs/swagger";
import {EntityNotFoundError} from "typeorm";
import ProductEntity from "./ProductEntity.js";
import ProductsService from "./ProductsService.js";
import {Page, PagingOptionsInRequest, ApiPaginatedOkResponse} from "../../paging/index.js";
import AddProductRequestBody from "./AddProductRequestBody.js";
import {AppConfig} from "../../config/index.js";

import * as Utils from "../../utils/index.js";

@ApiTags("products")
@ApiProduces("application/json")
@Controller("/products")
class ProductsController {
	private readonly productsService: ProductsService;
	private readonly appConfig: AppConfig;
	constructor(productsService: ProductsService, appConfig: AppConfig) {
		this.productsService = productsService;
		this.appConfig = appConfig;
	}
	@ApiPaginatedOkResponse({
		description: "All products",
		type: ProductEntity,
	})
	@Version(["1"])
	@Get("/")
	public async getAllProducts(
		@Query(
			new ValidationPipe({
				transform: true,
				whitelist: true,
				errorHttpStatusCode: HttpStatus.BAD_REQUEST,
			})
		)
		pagingOptionsInRequest: PagingOptionsInRequest
	): Promise<Page<ProductEntity>> {
		return this.productsService.getProducts(
			Utils.convertPagingOptionsInRequestToPagingOptions(pagingOptionsInRequest)
		);
	}
	@ApiOkResponse({
		description: "Product with given id",
		type: ProductEntity,
	})
	@ApiNotFoundResponse({
		description: "Product with given id not found",
	})
	@Version(["1"])
	@Get("/:id")
	public async getProductById(
		@Param(
			"id",
			new ParseUUIDPipe({
				errorHttpStatusCode: HttpStatus.NOT_FOUND,
				version: "4",
			})
		)
		id: string
	): Promise<ProductEntity> {
		try {
			const targetProduct = await this.productsService.getProductById(id);
			return targetProduct;
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new NotFoundException(`Product with id "${id}" not found`);
			}
			throw error;
		}
	}

	@Version(["1"])
	@Post("/")
	public async addProduct(
		@Body(
			new ValidationPipe({
				transform: true,
				whitelist: true,
				errorHttpStatusCode: HttpStatus.BAD_REQUEST,
			})
		)
		product: AddProductRequestBody,
		@Headers("Authorization") authorization: string
	): Promise<ProductEntity> {
		if (authorization !== `Bearer ${this.appConfig.ADMIN_TOKEN}`) {
			throw new Error("Unauthorized");
		}
		return this.productsService.addProduct(product);
	}
	@Version(["1"])
	@Delete("/:id")
	public async deleteProduct(
		@Param(
			"id",
			new ParseUUIDPipe({
				errorHttpStatusCode: HttpStatus.NOT_FOUND,
				version: "4",
			})
		)
		productId: string,
		@Headers("Authorization") authorization: string
	): Promise<void> {
		if (authorization !== `Bearer ${this.appConfig.ADMIN_TOKEN}`) {
			throw new Error("Unauthorized");
		}
		return this.productsService.deleteProduct(productId);
	}
}

export default ProductsController;
