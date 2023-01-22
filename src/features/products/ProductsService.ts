import {Injectable} from "@nestjs/common";
import {In, Repository} from "typeorm";
import ProductEntity from "./ProductEntity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {Page, PageMeta, PagingOptions} from "../../paging/index.js";
import AddProductRequestBody from "./products_controller/AddProductRequestBody.js";
import * as Uuid from "uuid";
import {DetailedProduct, Product} from "./types.js";

import * as Paging from "../../paging/index.js";
import {CategoryEntity} from "../categories/index.js";

@Injectable()
class ProductsService {
	public async deleteProduct(productId: string): Promise<void> {
		this.productsRepository.delete(productId);
	}
	private readonly productsRepository: Repository<ProductEntity>;
	private readonly categoryRepository: Repository<CategoryEntity>;
	constructor(
		@InjectRepository(ProductEntity) productsRepository: Repository<ProductEntity>,
		@InjectRepository(CategoryEntity) categoryRepository: Repository<CategoryEntity>
	) {
		this.productsRepository = productsRepository;
		this.categoryRepository = categoryRepository;
	}
	public async getProducts(pagingOptions: PagingOptions): Promise<Page<Product>> {
		return (
			await Paging.paginatedFindAndCount(this.productsRepository, pagingOptions, {
				relations: ["categories"],
			})
		).map(this.deentitifyProduct);
	}
	private deentitifyProduct(product: ProductEntity): Product {
		return {
			id: product.id,
			name: product.name,
			slug: product.slug,
			mass: product.mass,
			volume: product.volume,
			categoriesIds: product.categories.map((category) => category.id),
		};
	}

	public async getProductByIdOrSlug(slug: string): Promise<Product> {
		return this.deentitifyProduct(
			await (Uuid.validate(slug)
				? this.productsRepository.findOneByOrFail({id: slug})
				: this.productsRepository.findOneByOrFail({slug}))
		);
	}
	public async addProduct(addProductRequestBody: AddProductRequestBody): Promise<Product> {
		const productEntity = this.productsRepository.create(
			await (async ({categoriesIdsOrSlugs, name, slug, mass, volume}) => ({
				name: name ?? null,
				slug,
				mass: mass ?? null,
				volume: volume ?? null,

				categories: categoriesIdsOrSlugs
					? await this.categoryRepository.findBy([
							{id: In(categoriesIdsOrSlugs.filter((id) => Uuid.validate(id)))},
							{slug: In(categoriesIdsOrSlugs.filter((id) => !Uuid.validate(id)))},
					  ])
					: [],
			}))(addProductRequestBody)
		);
		const savedProductEntity = await this.productsRepository.save(productEntity);
		return this.deentitifyProduct(savedProductEntity);
	}
	public deentitifyDetailedProduct(productEntity: ProductEntity): DetailedProduct {
		return {
			id: productEntity.id,
			name: productEntity.name,
			slug: productEntity.slug,
			mass: productEntity.mass,
			volume: productEntity.volume,
			categories: productEntity.categories.map((category: CategoryEntity) => ({
				id: category.id,
				name: category.name,
				slug: category.slug,
			})),
		};
	}
	public async getDetailedProducts(pagingOptions: PagingOptions): Promise<Page<DetailedProduct>> {
		// const products = await Paging.paginatedFindAndCount(this.productsRepository, pagingOptions, {
		// 	relations: ["categories"],
		// });
		// const detailedProducts = products.items.map((product) => ({}));
		// return ret;
		const detailedProductsEntities = await Paging.paginatedFindAndCount(
			this.productsRepository,
			pagingOptions,
			{
				relations: ["categories"],
			}
		);
		const detailedProducts = detailedProductsEntities.map((product) =>
			this.deentitifyDetailedProduct(product)
		);
		return detailedProducts;
	}

	public async getDetailedProductByIdOrSlug(idOrSlug: string): Promise<DetailedProduct> {
		const detailedProductEntity = await (Uuid.validate(idOrSlug)
			? this.productsRepository.findOneByOrFail({id: idOrSlug})
			: this.productsRepository.findOneByOrFail({slug: idOrSlug}));
		const productEntity = this.deentitifyDetailedProduct(detailedProductEntity);
		return productEntity;
	}
}

export default ProductsService;
