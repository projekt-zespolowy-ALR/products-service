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
import {ApiNotFoundResponse, ApiOkResponse, ApiProduces} from "@nestjs/swagger";
import {EntityNotFoundError} from "typeorm";

import ProductsService from "../products_service/ProductsService.js";
import {Page, PagingOptionsInRequest} from "../../../paging/index.js";
import AddProductRequestBody from "./AddProductRequestBody.js";
import {AppConfig} from "../../../config/index.js";

import * as Utils from "../../../utils/index.js";
import {type Product, type DetailedProduct} from "../types.js";
import * as Uuid from "uuid";

@Controller("/")
class ProductsController {
	private readonly productsService: ProductsService;
	private readonly appConfig: AppConfig;
	constructor(productsService: ProductsService, appConfig: AppConfig) {
		this.productsService = productsService;
		this.appConfig = appConfig;
	}

	@Version(["1"])
	@Get("/products")
	@ApiProduces("application/json")
	public async getAllProducts(
		@Query()
		pagingOptionsInRequest: PagingOptionsInRequest
	): Promise<Page<Product>> {
		return this.productsService.getProducts(
			Utils.convertPagingOptionsInRequestToPagingOptions(pagingOptionsInRequest)
		);
	}

	@Version(["1"])
	@Get("/detailed-products")
	@ApiProduces("application/json")
	public async getAllDetailedProducts(
		@Query()
		pagingOptionsInRequest: PagingOptionsInRequest
	): Promise<Page<Readonly<DetailedProduct>>> {
		return this.productsService.getDetailedProducts(
			Utils.convertPagingOptionsInRequestToPagingOptions(pagingOptionsInRequest)
		);
	}

	@Version(["1"])
	@Get("/details/:idOrSlug")
	@ApiProduces("application/json")
	public async getDetailedProductByIdOrSlug(
		@Param("idOrSlug")
		idOrSlug: string
	): Promise<Readonly<DetailedProduct>> {
		try {
			return await this.productsService.getDetailedProductByIdOrSlug(idOrSlug);
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new NotFoundException();
			}

			throw error;
		}
	}

	@Version(["1"])
	@Get("/products/:idOrSlug")
	public async getProductById(
		@Param("idOrSlug")
		idOrSlug: string
	): Promise<Product> {
		try {
			return await this.productsService.getProductByIdOrSlug(idOrSlug);
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new NotFoundException();
			}
			throw error;
		}
	}

	@Version(["1"])
	@Post("/products")
	public async addProduct(
		@Body()
		product: AddProductRequestBody,
		@Headers("Authorization") authorization: string
	): Promise<Readonly<Product>> {
		return await this.productsService.addProduct(product);
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
