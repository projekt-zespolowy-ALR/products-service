import {
	Controller,
	Get,
	HttpStatus,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Query,
	ValidationPipe,
	Version,
} from "@nestjs/common";
import {ApiNotFoundResponse, ApiOkResponse, ApiProduces, ApiTags} from "@nestjs/swagger";
import {EntityNotFoundError} from "typeorm";
import ProductEntity from "./ProductEntity.js";
import ProductsService from "./ProductsService.js";
import {Page, PagingOptionsInRequest, ApiPaginatedOkResponse} from "../../paging/index.js";

@ApiTags("products")
@ApiProduces("application/json")
@Controller("/products")
class ProductsController {
	private readonly productsService: ProductsService;
	constructor(productsService: ProductsService) {
		this.productsService = productsService;
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
		const pagingOptions = pagingOptionsInRequest.toPagingOptions();
		return this.productsService.getProducts(pagingOptions);
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
}

export default ProductsController;
