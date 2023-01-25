import ProductEntity from "./ProductEntity.js";

import {Injectable} from "@nestjs/common";
import {EntityNotFoundError, Repository} from "typeorm";

import {InjectRepository} from "@nestjs/typeorm";

import ProductsServiceProductWithGivenIdNotFoundError from "./errors/ProductsServiceProductWithGivenIdNotFoundError.js";
import ProductsServiceProductWithGivenSlugNotFoundError from "./errors/ProductsServiceProductWithGivenSlugNotFoundError.js";
import type Page from "../../../paging/Page.js";
import type PagingOptions from "../../../paging/PagingOptions.js";
import paginatedFindAndCount from "../../../paging/paginatedFindAndCount.js";
import type AddProductPayload from "../types/AddProductPayload.d.js";
import type Product from "../types/Product.js";
// import type UpdateProductPayload from "../types/UpdateProductPayload.d.js";
import deentitifyProduct from "./deentitifyProduct.js";
import * as Uuid from "uuid";

@Injectable()
class ProductsService {
	private readonly productsRepository: Repository<ProductEntity>;
	constructor(@InjectRepository(ProductEntity) productsRepository: Repository<ProductEntity>) {
		this.productsRepository = productsRepository;
	}

	public async getProducts(pagingOptions: PagingOptions): Promise<Page<Product>> {
		return (
			await paginatedFindAndCount(this.productsRepository, pagingOptions, {
				relations: ["inCategories", "ingredientsList"],
			})
		).map(deentitifyProduct);
	}
	public async getProduct(productId: string): Promise<Product> {
		try {
			return deentitifyProduct(
				await this.productsRepository.findOneOrFail({
					where: {id: productId},
					relations: ["inCategories", "ingredientsList"],
				})
			);
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new ProductsServiceProductWithGivenIdNotFoundError(productId);
			}
			throw error;
		}
	}
	public async getProductBySlug(productSlug: string): Promise<Product> {
		try {
			return deentitifyProduct(
				await this.productsRepository.findOneOrFail({
					relations: ["categories"],
					where: {slug: productSlug},
				})
			);
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new ProductsServiceProductWithGivenSlugNotFoundError(productSlug);
			}
			throw error;
		}
	}
	/*
QueryFailedError: insert or update on table "products_in_categories" violates foreign key constraint "products_in_categories_category_id_fkey"

How to fix this function to 
*/
	public async addProduct(addProductPayload: AddProductPayload): Promise<Product> {
		console.log("addProduct", {
			slug: addProductPayload.slug,
			name: addProductPayload.name ?? null,
			mass: addProductPayload.mass ?? null,
			volume: addProductPayload.volume ?? null,
			...(addProductPayload.brandId ? {brand: {id: addProductPayload.brandId}} : null),
			inCategories: addProductPayload.categoriesIds
				? addProductPayload.categoriesIds.map((id) => ({categoryId: id}))
				: [],
			...(addProductPayload.ingredientsIds
				? {
						ingredientsList: {
							inIngredients: addProductPayload.ingredientsIds.map((id) => ({ingredientId: id})),
						},
				  }
				: null),
			inDataSources: [],
		});
		const productId = Uuid.v4();

		const productEntity = this.productsRepository.create({
			id: productId,
			slug: addProductPayload.slug,
			name: addProductPayload.name ?? null,
			mass: addProductPayload.mass ?? null,
			volume: addProductPayload.volume ?? null,
			...(addProductPayload.brandId ? {brand: {id: addProductPayload.brandId}} : null),
			inCategories: addProductPayload.categoriesIds
				? addProductPayload.categoriesIds.map((id) => ({categoryId: id, productId: productId}))
				: [],
			...(addProductPayload.ingredientsIds
				? (() => {
						const ingredientsListId = Uuid.v4();
						return {
							ingredientsList: {
								id: ingredientsListId,
								inIngredients: addProductPayload.ingredientsIds.map((id) => ({
									ingredientId: id,
									ingredientsListId: ingredientsListId,
								})),
							},
						};
				  })()
				: null),
			inDataSources: [],
		});
		const savedProductEntity = await this.productsRepository.save(productEntity);
		return deentitifyProduct(savedProductEntity);
	}
	// public async updateProduct(
	// 	productId: string,
	// 	updateProductPayload: UpdateProductPayload
	// ): Promise<Product> {
	// 	const updatedProductEntity = await this.productsRepository.preload({
	// 		id: productId,
	// 		...updateProductPayload,
	// 	});
	// 	if (!updatedProductEntity) {
	// 		throw new ProductsServiceProductWithGivenIdNotFoundError(productId);
	// 	}

	// 	const savedProductEntity = await this.productsRepository.save(updatedProductEntity);
	// 	return deentitifyProduct(savedProductEntity);
	// }

	public async deleteProduct(productId: string): Promise<void> {
		try {
			const productEntity = await this.productsRepository.findOneByOrFail({id: productId});
			await this.productsRepository.remove(productEntity);
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new ProductsServiceProductWithGivenIdNotFoundError(productId);
			}
			throw error;
		}
	}
}

export default ProductsService;
