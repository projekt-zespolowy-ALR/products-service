import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import CategoryEntity from "./CategoryEntity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {Page, PageMeta, PagingOptions} from "../../paging/index.js";

@Injectable()
class CategoriesService {
	private readonly categoriesRepository: Repository<CategoryEntity>;
	constructor(@InjectRepository(CategoryEntity) categoriesRepository: Repository<CategoryEntity>) {
		this.categoriesRepository = categoriesRepository;
	}

	public async getCategories(pagingOptions: PagingOptions): Promise<Page<CategoryEntity>> {
		const [categories, total] = await this.categoriesRepository.findAndCount({
			take: pagingOptions.take,
			skip: pagingOptions.skip,
		});
		const pageMeta: PageMeta = {
			totalItemsCount: total,
			pageItemsCount: categories.length,
			skip: pagingOptions.skip,
			take: pagingOptions.take,
		};
		const page: Page<CategoryEntity> = {
			meta: pageMeta,
			data: categories,
		};
		return page;
	}
	public async getCategoryById(id: string): Promise<CategoryEntity> {
		return this.categoriesRepository.findOneByOrFail({id});
	}
}

export default CategoriesService;
