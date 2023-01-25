import CategoryEntity from "./CategoryEntity.js";
import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";

import {InjectRepository} from "@nestjs/typeorm";

import {type AddCategoryPayload, type Category} from "../types.js";
import PagingOptions from "../../../paging/PagingOptions.js";
import Page from "../../../paging/Page.js";
import paginatedFindAndCount from "../../../paging/paginatedFindAndCount.js";

@Injectable()
class CategoriesService {
	private readonly categoriesRepository: Repository<CategoryEntity>;
	constructor(@InjectRepository(CategoryEntity) categoriesRepository: Repository<CategoryEntity>) {
		this.categoriesRepository = categoriesRepository;
	}

	public async getCategories(
		pagingOptions: PagingOptions
	): Promise<Page<Readonly<CategoryEntity>>> {
		return await paginatedFindAndCount(this.categoriesRepository, pagingOptions);
	}
	public async getCategoryById(id: string): Promise<Readonly<Category>> {
		return await this.categoriesRepository.findOneByOrFail({id});
	}
	public async getCategoryBySlug(slug: string): Promise<Readonly<Category>> {
		return await this.categoriesRepository.findOneByOrFail({slug});
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
