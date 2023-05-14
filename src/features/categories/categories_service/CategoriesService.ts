import {Injectable} from "@nestjs/common";
import {EntityNotFoundError, Repository} from "typeorm";
import CategoryEntity from "./CategoryEntity.js";
import {InjectRepository} from "@nestjs/typeorm";
import type Page from "../../../paging/Page.js";
import type PagingOptions from "../../../paging/PagingOptions.js";
import paginatedFindAndCount from "../../../paging/paginatedFindAndCount.js";
import type Category from "../categories_controller/Category.js";
import deentityifyCategoryEntity from "./deentityifyCategoryEntity.js";
import type CreateCategoryPayload from "./CreateCategoryPayload.js";
import CategoriesServiceCategoryWithGivenIdNotFoundError from "./CategoriesServiceCategoryWithGivenIdNotFoundError.js";
@Injectable()
export default class CategoriesService {
	private readonly categoriesRepository: Repository<CategoryEntity>;
	public constructor(
		@InjectRepository(CategoryEntity) categoriesRepository: Repository<CategoryEntity>
	) {
		this.categoriesRepository = categoriesRepository;
	}
	public async getCategories(pagingOptions: PagingOptions): Promise<Page<Category>> {
		return (await paginatedFindAndCount(this.categoriesRepository, pagingOptions)).map(
			deentityifyCategoryEntity
		);
	}
	public async getCategoryById(id: string): Promise<Category> {
		try {
			return deentityifyCategoryEntity(await this.categoriesRepository.findOneByOrFail({id}));
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new CategoriesServiceCategoryWithGivenIdNotFoundError(id);
			}
			throw error;
		}
	}
	public async createCategory(createCategoryPayload: CreateCategoryPayload): Promise<Category> {
		return deentityifyCategoryEntity(await this.categoriesRepository.save(createCategoryPayload));
	}
}
