import {Injectable} from "@nestjs/common";
import {EntityNotFoundError, Repository} from "typeorm";
import ProductEntity from "./ProductEntity.js";
import {InjectRepository} from "@nestjs/typeorm";
import type Page from "../../../paging/Page.js";
import type PagingOptions from "../../../paging/PagingOptions.js";
import paginatedFindAndCount from "../../../paging/paginatedFindAndCount.js";
import type Product from "../products_controller/Product.js";
import deentityifyProductEntity from "./deentityifyProductEntity.js";
import type CreateProductPayload from "./CreateProductPayload.js";
import ProductsServiceProductWithGivenIdNotFoundError from "./ProductsServiceProductWithGivenIdNotFoundError.js";
@Injectable()
export default class ProductsService {
	private readonly productsRepository: Repository<ProductEntity>;
	public constructor(
		@InjectRepository(ProductEntity) productsRepository: Repository<ProductEntity>
	) {
		this.productsRepository = productsRepository;
	}
	public async getProducts(pagingOptions: PagingOptions): Promise<Page<Product>> {
		return (await paginatedFindAndCount(this.productsRepository, pagingOptions)).map(
			deentityifyProductEntity
		);
	}
	public async getProductById(id: string): Promise<Product> {
		try {
			return deentityifyProductEntity(await this.productsRepository.findOneByOrFail({id}));
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new ProductsServiceProductWithGivenIdNotFoundError(id);
			}
			throw error;
		}
	}
	public async createProduct(createProductPayload: CreateProductPayload): Promise<Product> {
		return deentityifyProductEntity(await this.productsRepository.save(createProductPayload));
	}
}