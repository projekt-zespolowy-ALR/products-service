import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import Page from "../../../paging/Page.js";
import PagingOptions from "../../../paging/PagingOptions.js";
import ProductsService from "../products_service/ProductsService.js";
import ProductsServiceProductWithGivenIdNotFoundError from "../products_service/errors/ProductsServiceProductWithGivenIdNotFoundError.js";
import ProductsServiceProductWithGivenSlugNotFoundError from "../products_service/errors/ProductsServiceProductWithGivenSlugNotFoundError.js";
import type Product from "../types/Product.js";
import AddProductRequestBody from "./AddProductRequestBody.js";
import UpdateProductRequestBody from "./UpdateProductRequestBody.js";

@Controller("/")
class ProductsController {
	private readonly productsService: ProductsService;
	constructor(productsService: ProductsService) {
		this.productsService = productsService;
	}

	@Get("/products")
	public async getAllProducts(
		@Query()
		pagingOptions: PagingOptions
	): Promise<Page<Product>> {
		return await this.productsService.getProducts(pagingOptions);
	}

	@Get("/products/:productId")
	public async getProductById(
		@Param("productId", ParseUUIDPipe)
		productId: string
	): Promise<Product> {
		try {
			return await this.productsService.getProduct(productId);
		} catch (error) {
			if (error instanceof ProductsServiceProductWithGivenIdNotFoundError) {
				throw new NotFoundException(`Product with id ${productId} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}

	@Get("/products-by-slug/:productSlug")
	public async getProductBySlug(
		@Param("productSlug")
		productSlug: string
	): Promise<Product> {
		try {
			return await this.productsService.getProductBySlug(productSlug);
		} catch (error) {
			if (error instanceof ProductsServiceProductWithGivenSlugNotFoundError) {
				throw new NotFoundException(`Product with slug ${productSlug} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}

	@Post("/products")
	public async addProduct(@Body() product: AddProductRequestBody): Promise<Product> {
		return await this.productsService.addProduct(product);
	}

	@Delete("/products/:productId")
	@HttpCode(204)
	public async deleteProduct(
		@Param("productId", ParseUUIDPipe)
		productId: string
	): Promise<void> {
		try {
			await this.productsService.deleteProduct(productId);
		} catch (error) {
			if (error instanceof ProductsServiceProductWithGivenIdNotFoundError) {
				throw new NotFoundException(`Product with id ${productId} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}

	// @Put("/products/:productId")
	// public async updateProduct(
	// 	@Param("productId", ParseUUIDPipe)
	// 	productId: string,
	// 	@Body()
	// 	product: UpdateProductRequestBody
	// ): Promise<Product> {
	// 	try {
	// 		return await this.productsService.updateProduct(productId, product);
	// 	} catch (error) {
	// 		if (error instanceof ProductsServiceProductWithGivenIdNotFoundError) {
	// 			throw new NotFoundException(`Product with id ${productId} not found.`, {
	// 				cause: error,
	// 			});
	// 		}
	// 		throw error;
	// 	}
	// }
}

export default ProductsController;
