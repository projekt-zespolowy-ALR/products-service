import {Injectable} from "@nestjs/common";
import {In, Repository} from "typeorm";
import ProductEntity from "./ProductEntity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {Page, PagingOptions} from "../../../paging/index.js";
import AddProductRequestBody from "../products_controller/AddProductRequestBody.js";
import * as Uuid from "uuid";
import {DetailedProduct, Product} from "../types.js";

import * as Paging from "../../../paging/index.js";
import {CategoryEntity} from "../../categories/index.js";
import ProductInDataSourceEntity from "./ProductInDataSourceEntity.js";
import {DataSourceEntity} from "../../data_sources/index.js";

@Injectable()
class ProductsService {
	public async deleteProduct(productId: string): Promise<void> {
		this.productsRepository.delete(productId);
	}
	private readonly productsRepository: Repository<ProductEntity>;
	private readonly categoryRepository: Repository<CategoryEntity>;
	private readonly productInDataSourceRepository: Repository<ProductInDataSourceEntity>;
	private readonly dataSourceRepository: Repository<DataSourceEntity>;
	constructor(
		@InjectRepository(ProductEntity) productsRepository: Repository<ProductEntity>,
		@InjectRepository(CategoryEntity) categoryRepository: Repository<CategoryEntity>,
		@InjectRepository(ProductInDataSourceEntity)
		productInDataSourceRepository: Repository<ProductInDataSourceEntity>,
		@InjectRepository(DataSourceEntity) dataSourceRepository: Repository<DataSourceEntity>
	) {
		this.productsRepository = productsRepository;
		this.categoryRepository = categoryRepository;
		this.productInDataSourceRepository = productInDataSourceRepository;
		this.dataSourceRepository = dataSourceRepository;
	}
	public async getProducts(pagingOptions: PagingOptions): Promise<Page<Product>> {
		const productsEntities = await Paging.paginatedFindAndCount(
			this.productsRepository,
			pagingOptions,
			{
				relations: ["categories", "inDataSources"],
			}
		);
		const products = productsEntities.map(this.deentitifyProduct);
		return products;
	}
	private deentitifyProduct(product: ProductEntity): Product {
		return {
			id: product.id,
			name: product.name,
			slug: product.slug,
			mass: product.mass,
			volume: product.volume,
			categoriesIds: product.categories.map((category) => category.id),
			inDataSourcesIds: product.inDataSources.map((inDataSource) => inDataSource.dataSourceId),
			brandId: "",
			ingredientsIds: [],
		};
	}

	public async getProductByIdOrSlug(slug: string): Promise<Product> {
		return this.deentitifyProduct(
			await (Uuid.validate(slug)
				? this.productsRepository.findOneOrFail({
						where: {id: slug},
						relations: ["categories", "inDataSources"],
				  })
				: this.productsRepository.findOneOrFail({
						where: {slug},
						relations: ["categories", "inDataSources"],
				  }))
		);
	}
	public async addProduct(addProductRequestBody: AddProductRequestBody): Promise<Product> {
		// TODO: Refactor using promise all
		const categoriesIdsOrSlugs = addProductRequestBody.categoriesIdsOrSlugs;
		const categories = categoriesIdsOrSlugs
			? await this.categoryRepository.findBy([
					{
						id: In(
							categoriesIdsOrSlugs.filter((categoryIdOrSlug) => Uuid.validate(categoryIdOrSlug))
						),
					},
					{
						slug: In(
							categoriesIdsOrSlugs.filter((categoryIdOrSlug) => !Uuid.validate(categoryIdOrSlug))
						),
					},
			  ])
			: [];
		const inDataSourcesIdsOrSlugs = addProductRequestBody.inDataSources?.map(
			(inDataSource) => inDataSource.dataSourceIdOrSlug
		);
		const dataSources = inDataSourcesIdsOrSlugs
			? await this.dataSourceRepository.findBy([
					{
						id: In(
							inDataSourcesIdsOrSlugs.filter((dataSourceIdOrSlug) =>
								Uuid.validate(dataSourceIdOrSlug)
							)
						),
					},
					{
						slug: In(
							inDataSourcesIdsOrSlugs.filter(
								(dataSourceIdOrSlug) => !Uuid.validate(dataSourceIdOrSlug)
							)
						),
					},
			  ])
			: [];
		const dataSourceEntityBySlug = dataSources.reduce(
			(dataSourceEntityBySlug: Map<string, DataSourceEntity>, dataSource) => {
				dataSourceEntityBySlug.set(dataSource.slug, dataSource);
				return dataSourceEntityBySlug;
			},
			new Map()
		);
		const dataSourceEntityById = dataSources.reduce(
			(dataSourceEntityById: Map<string, DataSourceEntity>, dataSource) => {
				dataSourceEntityById.set(dataSource.id, dataSource);
				return dataSourceEntityById;
			},
			new Map()
		);
		const inDataSources: ProductInDataSourceEntity[] =
			addProductRequestBody.inDataSources?.map((inDataSource) => {
				const dataSource =
					dataSourceEntityBySlug.get(inDataSource.dataSourceIdOrSlug) ??
					(dataSourceEntityById.get(inDataSource.dataSourceIdOrSlug) as DataSourceEntity);
				return this.productInDataSourceRepository.create({
					dataSourceId: dataSource.id,
					productId: null as unknown as string,
					referenceUrl: inDataSource.referenceUrl ?? null,
					imageUrl: inDataSource.imageUrl ?? null,
					price: inDataSource.price ?? null,
				});
			}) ?? [];
		const productEntity = this.productsRepository.create({
			name: addProductRequestBody.name ?? null,
			slug: addProductRequestBody.slug,
			mass: addProductRequestBody.mass ?? null,
			volume: addProductRequestBody.volume ?? null,
			categories,
			inDataSources,
		});
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
			inDataSources: productEntity.inDataSources.map((inDataSource: ProductInDataSourceEntity) => ({
				dataSource: inDataSource.dataSource,
				referenceUrl: inDataSource.referenceUrl,
				imageUrl: inDataSource.imageUrl,
				price: inDataSource.price,
			})),
			ingredients: [],
			brand: null,
		};
	}
	public async getDetailedProducts(pagingOptions: PagingOptions): Promise<Page<DetailedProduct>> {
		const detailedProductsEntities = await Paging.paginatedFindAndCount(
			this.productsRepository,
			pagingOptions,
			{
				relations: ["categories", "inDataSources", "inDataSources.dataSource"],
			}
		);
		const detailedProducts = detailedProductsEntities.map((product) =>
			this.deentitifyDetailedProduct(product)
		);
		return detailedProducts;
	}

	public async getDetailedProductByIdOrSlug(idOrSlug: string): Promise<DetailedProduct> {
		const detailedProductEntity = await (Uuid.validate(idOrSlug)
			? this.productsRepository.findOneOrFail({
					where: {id: idOrSlug},
					relations: ["categories", "inDataSources"],
			  })
			: this.productsRepository.findOneOrFail({
					where: {slug: idOrSlug},
					relations: ["categories", "inDataSources"],
			  }));
		const productEntity = this.deentitifyDetailedProduct(detailedProductEntity);
		return productEntity;
	}
}

export default ProductsService;
