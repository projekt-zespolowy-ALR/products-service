import CategoryEntity from "./CategoryEntity.js";

import {Injectable} from "@nestjs/common";
import {EntityNotFoundError, Repository} from "typeorm";

import {InjectRepository} from "@nestjs/typeorm";

import CategoriesServiceCategoryWithGivenIdNotFoundError from "./errors/CategoriesServiceCategoryWithGivenIdNotFoundError.js";
import CategoriesServiceCategoryWithGivenSlugNotFoundError from "./errors/CategoriesServiceCategoryWithGivenSlugNotFoundError.js";
import type Page from "../../../paging/Page.js";
import type PagingOptions from "../../../paging/PagingOptions.js";
import paginatedFindAndCount from "../../../paging/paginatedFindAndCount.js";
import type AddCategoryPayload from "../types/AddCategoryPayload.d.js";
import type Category from "../types/Category.js";
import type UpdateCategoryPayload from "../types/UpdateCategoryPayload.d.js";
import type Product from "../../products/types/Product.d.js";
import ProductEntity from "../../products/products_service/ProductEntity.js";
import paginateQuery from "../../../paging/paginateQuery.js";
import deentitifyProduct from "../../products/products_service/deentitifyProduct.js";
import deentitifyCategory from "./deentitifyCategory.js";

@Injectable()
class CategoriesService {
	public async getProductsByCategory(
		categoryId: string,
		pagingOptions: PagingOptions
	): Promise<Page<Product>> {
		await this.getCategoryById(categoryId);
		const products = (
			await paginateQuery(
				this.productsRepository
					.createQueryBuilder("product")
					.innerJoinAndSelect("product.categories", "category", "category.id = :categoryId", {
						categoryId,
					}),
				pagingOptions
			)
		).map(deentitifyProduct);
		return products;
	}

	public async getProductsByCategorySlug(
		categorySlug: string,
		pagingOptions: PagingOptions
	): Promise<Page<Product>> {
		await this.getCategoryBySlug(categorySlug);
		const products = (
			await paginateQuery(
				this.productsRepository
					.createQueryBuilder("product")
					.innerJoinAndSelect("product.categories", "category", "category.slug = :categorySlug", {
						categorySlug,
					}),
				pagingOptions
			)
		).map(deentitifyProduct);
		return products;
	}

	private readonly categoriesRepository: Repository<CategoryEntity>;
	private readonly productsRepository: Repository<ProductEntity>;
	constructor(
		@InjectRepository(CategoryEntity) categoriesRepository: Repository<CategoryEntity>,
		@InjectRepository(ProductEntity) productsRepository: Repository<ProductEntity>
	) {
		this.categoriesRepository = categoriesRepository;
		this.productsRepository = productsRepository;
	}

	public async getCategories(pagingOptions: PagingOptions): Promise<Page<Category>> {
		return (await paginatedFindAndCount(this.categoriesRepository, pagingOptions)).map(
			deentitifyCategory
		);
	}
	public async getCategoryById(categoryId: string): Promise<Category> {
		try {
			return deentitifyCategory(await this.categoriesRepository.findOneByOrFail({id: categoryId}));
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new CategoriesServiceCategoryWithGivenIdNotFoundError(categoryId);
			}
			throw error;
		}
	}
	public async getCategoryBySlug(categorieslug: string): Promise<Category> {
		try {
			return deentitifyCategory(
				await this.categoriesRepository.findOneByOrFail({slug: categorieslug})
			);
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
		return deentitifyCategory(savedCategoryEntity);
	}

	public async deleteCategory(categoryId: string): Promise<void> {
		try {
			const categoryEntity = await this.categoriesRepository.findOneByOrFail({id: categoryId});
			await this.categoriesRepository.remove(categoryEntity);
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new CategoriesServiceCategoryWithGivenIdNotFoundError(categoryId);
			}
			throw error;
		}
	}
}

export default CategoriesService;
