import CategoryEntity from "./CategoryEntity.js";

import {Injectable} from "@nestjs/common";
import {EntityNotFoundError, Repository} from "typeorm";

import {InjectRepository} from "@nestjs/typeorm";

import CategoriesServiceCategoryWithGivenIdNotFoundError from "./errors/CategoriesServiceCategoryWithGivenIdNotFoundError.js";
import CategoriesServiceCategoryWithGivenSlugNotFoundError from "./errors/CategoriesServiceCategoryWithGivenSlugNotFoundError.js";
import Page from "../../../paging/Page.js";
import PagingOptions from "../../../paging/PagingOptions.js";
import paginatedFindAndCount from "../../../paging/paginatedFindAndCount.js";
import type AddCategoryPayload from "../types/AddCategoryPayload.d.js";
import type Category from "../types/Category.js";
import type UpdateCategoryPayload from "../types/UpdateCategoryPayload.d.js";

@Injectable()
class CategoriesService {
	private readonly categoriesRepository: Repository<CategoryEntity>;
	constructor(@InjectRepository(CategoryEntity) categoriesRepository: Repository<CategoryEntity>) {
		this.categoriesRepository = categoriesRepository;
	}

	public async getCategories(pagingOptions: PagingOptions): Promise<Page<Category>> {
		return await paginatedFindAndCount(this.categoriesRepository, pagingOptions);
	}
	public async getCategoryById(id: string): Promise<Category> {
		try {
			return await this.categoriesRepository.findOneByOrFail({id});
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new CategoriesServiceCategoryWithGivenIdNotFoundError(id);
			}
			throw error;
		}
	}
	public async getCategoryBySlug(categorieslug: string): Promise<Category> {
		try {
			return await this.categoriesRepository.findOneByOrFail({slug: categorieslug});
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new CategoriesServiceCategoryWithGivenSlugNotFoundError(categorieslug);
			}
			throw error;
		}
	}
	public async addCategory(addCategoryPayload: AddCategoryPayload): Promise<Category> {
		const categoryEntity = this.categoriesRepository.create(addCategoryPayload);
		const savedCategoryEntity = await this.categoriesRepository.save(categoryEntity);
		return savedCategoryEntity;
	}
	public async updateCategory(
		categoryId: string,
		updateCategoryPayload: UpdateCategoryPayload
	): Promise<Category> {
		const updatedCategoryEntity = await this.categoriesRepository.preload({
			id: categoryId,
			...updateCategoryPayload,
		});
		if (!updatedCategoryEntity) {
			throw new CategoriesServiceCategoryWithGivenIdNotFoundError(categoryId);
		}
		const savedCategoryEntity = await this.categoriesRepository.save(updatedCategoryEntity);
		return savedCategoryEntity;
	}

	public async deleteCategory(categoryId: string): Promise<void> {
		await this.categoriesRepository.delete(categoryId);
	}
}

export default CategoriesService;
