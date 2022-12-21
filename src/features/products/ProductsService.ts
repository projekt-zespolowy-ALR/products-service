import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import ProductEntity from "./ProductEntity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {Page, PageMeta, PagingOptions} from "../../paging/index.js";

@Injectable()
class ProductsService {
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
}

export default ProductsService;
