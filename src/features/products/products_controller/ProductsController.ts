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
	Version,
	Headers,
	Delete,
} from "@nestjs/common";
import {ApiProduces} from "@nestjs/swagger";
import {EntityNotFoundError} from "typeorm";

import AddProductRequestBody from "./AddProductRequestBody.js";

import {type Product, type DetailedProduct} from "../types.js";
import AppConfig from "../../../config/AppConfig.js";
import ProductsService from "../products_service/ProductsService.js";
import PagingOptions from "../../../paging/PagingOptions.js";
import Page from "../../../paging/Page.js";

@Controller("/")
class ProductsController {
	private readonly productsService: ProductsService;

	constructor(productsService: ProductsService) {
		this.productsService = productsService;
	}

	@Version(["1"])
	@Get("/products")
	@ApiProduces("application/json")
	public async getAllProducts(
		@Query()
		pagingOptions: PagingOptions
	): Promise<Page<Product>> {
		return this.productsService.getProducts(pagingOptions);
	}

	@Version(["1"])
	@Get("/detailed-products")
	public async getAllDetailedProducts(
		@Query()
		pagingOptions: PagingOptions
	): Promise<Page<Readonly<DetailedProduct>>> {
		return this.productsService.getDetailedProducts(pagingOptions);
	}

	@Version(["1"])
	@Get("/detailed-products/:idOrSlug")
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
		product: AddProductRequestBody
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
		productId: string
	): Promise<void> {
		return this.productsService.deleteProduct(productId);
	}
}

export default ProductsController;
