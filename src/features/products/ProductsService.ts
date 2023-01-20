import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import ProductEntity from "./ProductEntity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {Page, PageMeta, PagingOptions} from "../../paging/index.js";
import AddProductRequestBody from "./AddProductRequestBody.js";
import * as Uuid from "uuid";

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
		const [products, total] = await this.productsRepository.findAndCount({
			take: pagingOptions.take,
			skip: pagingOptions.skip,
		});
		const pageMeta: PageMeta = {
			totalItemsCount: total,
			pageItemsCount: products.length,
			skip: pagingOptions.skip,
			take: pagingOptions.take,
		};
		const page: Page<ProductEntity> = {
			meta: pageMeta,
			data: products,
		};
		return page;
	}
	public async getProductById(id: string): Promise<ProductEntity> {
		return this.productsRepository.findOneByOrFail({id});
	}
	public async addProduct(product: AddProductRequestBody): Promise<ProductEntity> {
		const newProduct = this.productsRepository.create({
			id: Uuid.v4(),
			name: product.name ?? null,
			slug: product.slug,
			mass: product.mass ?? null,
			volume: product.volume ?? null,
		});
		return await this.productsRepository.save(newProduct);
	}
}

export default ProductsService;
