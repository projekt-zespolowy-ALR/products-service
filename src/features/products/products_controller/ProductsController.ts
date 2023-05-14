import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Post,
	Query,
	ValidationPipe,
} from "@nestjs/common";
import ProductsService from "../products_service/ProductsService.js";
import PagingOptions from "../../../paging/PagingOptions.js";
import type Page from "../../../paging/Page.js";
import type Product from "./Product.js";
import ProductsServiceProductWithGivenIdNotFoundError from "../products_service/ProductsServiceProductWithGivenIdNotFoundError.js";
import CreateProductRequestBody from "./CreateProductRequestBody.js";
import payloadifyCreateProductRequestBody from "./payloadifyCreateProductRequestBody.js";

@Controller("/")
export default class ProductsController {
	private readonly productsService: ProductsService;
	public constructor(productsService: ProductsService) {
		this.productsService = productsService;
	}
	@Get("/products")
	public async getProducts(
		@Query(
			new ValidationPipe({
				transform: true, // Transform to instance of PagingOptions
				whitelist: true, // Do not put other query parameters into the object
			})
		)
		pagingOptions: PagingOptions
	): Promise<Page<Product>> {
		return await this.productsService.getProducts(pagingOptions);
	}

	@Get("/products/:productId")
	public async getProductById(
		@Param(
			"productId",
			new ParseUUIDPipe({
				version: "4",
			})
		)
		productId: string
	): Promise<Product> {
		try {
			const targetProduct = await this.productsService.getProductById(productId);
			return targetProduct;
		} catch (error) {
			if (error instanceof ProductsServiceProductWithGivenIdNotFoundError) {
				throw new NotFoundException(`Product with id "${productId}" not found`);
			}
			throw error;
		}
	}

	@Post("/products")
	public async createProduct(
		@Body(
			new ValidationPipe({
				transform: true, // Transform to instance of CreateCatRequestBody
				whitelist: true, // Do not allow other properties than those defined in CreateCatRequestBody
				forbidNonWhitelisted: true, // Throw an error if other properties than those defined in CreateCatRequestBody are present
			})
		)
		createProductRequestBody: CreateProductRequestBody
	): Promise<Product> {
		return await this.productsService.createProduct(
			payloadifyCreateProductRequestBody(createProductRequestBody)
		);
	}
}
