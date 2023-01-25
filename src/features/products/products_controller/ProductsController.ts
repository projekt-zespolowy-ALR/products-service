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
	Query,
} from "@nestjs/common";
import Page from "../../../paging/Page.js";
import PagingOptions from "../../../paging/PagingOptions.js";
import ProductsService from "../products_service/ProductsService.js";
import ProductsServiceProductWithGivenIdNotFoundError from "../products_service/errors/ProductsServiceProductWithGivenIdNotFoundError.js";
import ProductsServiceProductWithGivenSlugNotFoundError from "../products_service/errors/ProductsServiceProductWithGivenSlugNotFoundError.js";
import type Product from "../types/Product.js";
import AddProductRequestBody from "./AddProductRequestBody.js";
import AddProductInDataSourceRequestBody from "./AddProductInDataSourceRequestBody.js";
import ProductInDataSource from "../types/ProductInDataSource.js";
import DetailedProduct from "../types/DetailedProduct.js";

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

	@Post("/products/:productId/data-sources")
	public async addDataSourceToProduct(
		@Param("productId", ParseUUIDPipe)
		productId: string,
		@Body()
		addProductInDataSourceRequestBody: AddProductInDataSourceRequestBody
	): Promise<ProductInDataSource> {
		try {
			return await this.productsService.addDataSourceToProduct(
				productId,
				addProductInDataSourceRequestBody
			);
		} catch (error) {
			if (error instanceof ProductsServiceProductWithGivenIdNotFoundError) {
				throw new NotFoundException(`Product with id ${productId} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}

	@Post("/products-by-slug/:productSlug/data-sources")
	public async addDataSourceToProductBySlug(
		@Param("productSlug")
		productSlug: string,
		@Body()
		addProductInDataSourceRequestBody: AddProductInDataSourceRequestBody
	): Promise<ProductInDataSource> {
		try {
			return await this.productsService.addDataSourceToProductBySlug(
				productSlug,
				addProductInDataSourceRequestBody
			);
		} catch (error) {
			if (error instanceof ProductsServiceProductWithGivenSlugNotFoundError) {
				throw new NotFoundException(`Product with slug ${productSlug} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}

	@Get("/products/:productId/data-sources")
	public async getDataSourcesForProduct(
		@Query()
		pagingOptions: PagingOptions,
		@Param("productId", ParseUUIDPipe)
		productId: string
	): Promise<Page<ProductInDataSource>> {
		try {
			return await this.productsService.getDataSourcesForProduct(productId, pagingOptions);
		} catch (error) {
			if (error instanceof ProductsServiceProductWithGivenIdNotFoundError) {
				throw new NotFoundException(`Product with id ${productId} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}

	@Get("/products-by-slug/:productSlug/data-sources")
	public async getDataSourcesForProductBySlug(
		@Query()
		pagingOptions: PagingOptions,
		@Param("productSlug")
		productSlug: string
	): Promise<Page<ProductInDataSource>> {
		try {
			return await this.productsService.getDataSourcesForProductBySlug(productSlug, pagingOptions);
		} catch (error) {
			if (error instanceof ProductsServiceProductWithGivenSlugNotFoundError) {
				throw new NotFoundException(`Product with slug ${productSlug} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}

	@Get("/detailed-products")
	public async getDetailedProducts(
		@Query()
		pagingOptions: PagingOptions
	): Promise<Page<DetailedProduct>> {
		return await this.productsService.getDetailedProducts(pagingOptions);
	}

	@Get("/detailed-products/:productId")
	public async getDetailedProductById(
		@Param("productId", ParseUUIDPipe)
		productId: string
	): Promise<DetailedProduct> {
		try {
			return await this.productsService.getDetailedProduct(productId);
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
