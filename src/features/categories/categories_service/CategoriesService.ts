import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import CategoryEntity from "./CategoryEntity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {Page, PageMeta, PagingOptions} from "../../../paging/index.js";
import * as Uuid from "uuid";
import {AddCategoryPayload, Category} from "../types.js";
import * as Paging from "../../../paging/index.js";

@Injectable()
class CategoriesService {
	private readonly categoriesRepository: Repository<CategoryEntity>;
	constructor(@InjectRepository(CategoryEntity) categoriesRepository: Repository<CategoryEntity>) {
		this.categoriesRepository = categoriesRepository;
	}

	public async getCategories(
		pagingOptions: PagingOptions
	): Promise<Page<Readonly<CategoryEntity>>> {
		return await Paging.paginatedFindAndCount(this.categoriesRepository, pagingOptions);
	}
	public async getCategoryById(id: string): Promise<Readonly<Category>> {
		return await this.categoriesRepository.findOneByOrFail({id});
	}
	public async addCategory(addCategoryPayload: AddCategoryPayload): Promise<Readonly<Category>> {
		const categoryEntity: CategoryEntity = this.categoriesRepository.create(addCategoryPayload);
		const savedCategoryEntity: CategoryEntity = await this.categoriesRepository.save(
			categoryEntity
		);
		return savedCategoryEntity;
	}
}

export default CategoriesService;
