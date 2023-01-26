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
import deentitifyProduct from "./deentitifyProduct.js";
import AddProductInDataSourceRequestBody from "../products_controller/AddProductInDataSourceRequestBody.js";
import type ProductInDataSource from "../types/ProductInDataSource.d.js";
import deentitifyProductInDataSource from "./deentitifyProductInDataSource.js";
import ProductInDataSourceEntity from "./ProductInDataSourceEntity.js";
import DetailedProduct from "../types/DetailedProduct.js";
import deentitifyDetailedProduct from "./deentitifyDetailedProduct.js";

@Injectable()
class ProductsService {
	public async getDataSourcesForProduct(
		productId: string,
		pagingOptions: PagingOptions
	): Promise<Page<ProductInDataSource>> {
		return (
			await paginatedFindAndCount(this.productInDataSourceRepository, pagingOptions, {
				where: {product: {id: productId}},
			})
		).map(deentitifyProductInDataSource);
	}
	public async getDataSourcesForProductBySlug(
		productSlug: string,
		pagingOptions: PagingOptions
	): Promise<Page<ProductInDataSource>> {
		return (
			await paginatedFindAndCount(this.productInDataSourceRepository, pagingOptions, {
				where: {product: {slug: productSlug}},
			})
		).map(deentitifyProductInDataSource);
	}
	private readonly productsRepository: Repository<ProductEntity>;
	private readonly productInDataSourceRepository: Repository<ProductInDataSourceEntity>;
	constructor(
		@InjectRepository(ProductEntity) productsRepository: Repository<ProductEntity>,
		@InjectRepository(ProductInDataSourceEntity)
		productInDataSourceRepository: Repository<ProductInDataSourceEntity>
	) {
		this.productsRepository = productsRepository;
		this.productInDataSourceRepository = productInDataSourceRepository;
	}

	public async getProducts(pagingOptions: PagingOptions): Promise<Page<Product>> {
		return (
			await paginatedFindAndCount(this.productsRepository, pagingOptions, {
				relations: [
					"inCategories",
					"ingredientsList",
					"ingredientsList.inIngredients",
					"inDataSources",
				],
			})
		).map(deentitifyProduct);
	}
	async getDetailedProducts(pagingOptions: PagingOptions): Promise<Page<DetailedProduct>> {
		return (
			await paginatedFindAndCount(this.productsRepository, pagingOptions, {
				relations: [
					"brand",
					"inCategories",
					"inCategories.category",
					"ingredientsList",
					"ingredientsList.inIngredients",
					"ingredientsList.inIngredients.ingredient",
					"inDataSources",
					"inDataSources.dataSource",
					"inDataSources.product",
					"inDataSources.product.inCategories",
					"inDataSources.product.ingredientsList",
					"inDataSources.product.ingredientsList.inIngredients",
					"inDataSources.product.inDataSources",
				],
			})
		).map(deentitifyDetailedProduct);
	}
	async getDetailedProduct(productId: string): Promise<DetailedProduct> {
		try {
			return deentitifyDetailedProduct(
				await this.productsRepository.findOneOrFail({
					where: {id: productId},
					relations: [
						"brand",
						"inCategories",
						"inCategories.category",
						"ingredientsList",
						"ingredientsList.inIngredients",
						"ingredientsList.inIngredients.ingredient",
						"inDataSources",
						"inDataSources.dataSource",
						"inDataSources.product",
						"inDataSources.product.inCategories",
						"inDataSources.product.ingredientsList",
						"inDataSources.product.ingredientsList.inIngredients",
						"inDataSources.product.inDataSources",
					],
				})
			);
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new ProductsServiceProductWithGivenIdNotFoundError(productId);
			}
			throw error;
		}
	}

	public async getProduct(productId: string): Promise<Product> {
		try {
			return deentitifyProduct(
				await this.productsRepository.findOneOrFail({
					where: {id: productId},
					relations: [
						"inCategories",
						"ingredientsList",
						"ingredientsList.inIngredients",
						"inDataSources",
					],
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
					relations: [
						"inCategories",
						"ingredientsList",
						"ingredientsList.inIngredients",
						"inDataSources",
					],
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

	async addDataSourceToProduct(
		productId: string,
		addProductInDataSourceRequestBody: AddProductInDataSourceRequestBody
	): Promise<ProductInDataSource> {
		const productInDataSourceEntity = this.productInDataSourceRepository.create({
			productId,
			dataSourceId: addProductInDataSourceRequestBody.dataSourceId,
			referenceUrl: addProductInDataSourceRequestBody.referenceUrl ?? null,
			imageUrl: addProductInDataSourceRequestBody.imageUrl ?? null,
			price: addProductInDataSourceRequestBody.price ?? null,
			description: addProductInDataSourceRequestBody.description ?? null,
		});
		const savedProductInDataSourceEntity = await this.productInDataSourceRepository.save(
			productInDataSourceEntity
		);
		return deentitifyProductInDataSource(savedProductInDataSourceEntity);
	}

	async addDataSourceToProductBySlug(
		productSlug: string,
		addProductInDataSourceRequestBody: AddProductInDataSourceRequestBody
	): Promise<ProductInDataSource> {
		const product = await this.getProductBySlug(productSlug);

		const productInDataSourceEntity = this.productInDataSourceRepository.create({
			productId: product.id,
			dataSourceId: addProductInDataSourceRequestBody.dataSourceId,
			referenceUrl: addProductInDataSourceRequestBody.referenceUrl ?? null,
			imageUrl: addProductInDataSourceRequestBody.imageUrl ?? null,
			price: addProductInDataSourceRequestBody.price ?? null,
			description: addProductInDataSourceRequestBody.description ?? null,
		});
		const savedProductInDataSourceEntity = await this.productInDataSourceRepository.save(
			productInDataSourceEntity
		);

		return deentitifyProductInDataSource(savedProductInDataSourceEntity);
	}

	public async addProduct(addProductPayload: AddProductPayload): Promise<Product> {
		const productEntity = this.productsRepository.create({
			slug: addProductPayload.slug,
			name: addProductPayload.name ?? null,
			mass: addProductPayload.mass ?? null,
			volume: addProductPayload.volume ?? null,
			...(addProductPayload.brandId ? {brand: {id: addProductPayload.brandId}} : null),
			inCategories: addProductPayload.categoriesIds
				? addProductPayload.categoriesIds.map((id) => ({
						categoryId: id,
				  }))
				: [],
			...(addProductPayload.ingredientsIds
				? {
						ingredientsList: {
							inIngredients: addProductPayload.ingredientsIds.map((id) => ({
								ingredientId: id,
							})),
						},
				  }
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
