import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import ProductEntity from "./ProductEntity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {Page, PageMeta, PagingOptions} from "../../paging/index.js";
import AddProductRequestBody from "./AddProductRequestBody.js";
import * as Uuid from "uuid";
import {DetailedProduct, Product} from "./types.js";

import * as Paging from "../../paging/index.js";
import {CategoryEntity} from "../categories/index.js";

@Injectable()
class ProductsService {
	public async deleteProduct(productId: string): Promise<void> {
		this.productsRepository.delete(productId);
	}
	private readonly productsRepository: Repository<ProductEntity>;
	constructor(@InjectRepository(ProductEntity) productsRepository: Repository<ProductEntity>) {
		this.productsRepository = productsRepository;
	}
	public async getProducts(pagingOptions: PagingOptions): Promise<Page<ProductEntity>> {
		return await Paging.paginatedFindAndCount(this.productsRepository, pagingOptions);
	}
	public async getProductById(id: string): Promise<Product> {
		return this.productsRepository.findOneByOrFail({id});
	}
	public async getProductBySlug(slug: string): Promise<Product> {
		return this.productsRepository.findOneByOrFail({slug});
	}
	public async addProduct(product: AddProductRequestBody): Promise<Product> {
		const newProduct = this.productsRepository.create({
			id: Uuid.v4(),
			name: product.name ?? null,
			slug: product.slug,
			mass: product.mass ?? null,
			volume: product.volume ?? null,
		});
		return await this.productsRepository.save(newProduct);
	}
	public async getDetailedProducts(
		pagingOptions: PagingOptions
	): Promise<Page<Readonly<DetailedProduct>>> {
		const ret = await Paging.paginatedFindAndCount(this.productsRepository, pagingOptions, {
			relations: ["categories"],
		});
		ret.data.forEach((product) => {
			console.log(product.categories);
		});

		return ret;
	}
}

export default ProductsService;
