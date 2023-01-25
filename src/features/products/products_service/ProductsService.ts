import ProductInDataSourceEntity from "./ProductInDataSourceEntity.js";

import {Injectable} from "@nestjs/common";
import {In, Repository} from "typeorm";

import ProductEntity from "./ProductEntity.js";
import {InjectRepository} from "@nestjs/typeorm";
import AddProductRequestBody from "../products_controller/AddProductRequestBody.js";
import * as Uuid from "uuid";
import type DetailedProduct from "../types/DetailedProduct.js";
import type Product from "../types/Product.js";
import CategoryEntity from "../../categories/categories_service/CategoryEntity.js";
import DataSourceEntity from "../../data_sources/data_sources_service/DataSourceEntity.js";
import PagingOptions from "../../../paging/PagingOptions.js";
import Page from "../../../paging/Page.js";
import paginatedFindAndCount from "../../../paging/paginatedFindAndCount.js";
import deentitifyDetailedProduct from "./deentitifyDetailedProduct.js";

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
		const productsEntities = await paginatedFindAndCount(this.productsRepository, pagingOptions, {
			relations: ["categories", "inDataSources"],
		});
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
		const categories = addProductRequestBody.categoriesIds
			? await this.categoryRepository.findBy([
					{
						id: In(addProductRequestBody.categoriesIds),
					},
			  ])
			: [];

		const productEntity = this.productsRepository.create({
			name: addProductRequestBody.name ?? null,
			slug: addProductRequestBody.slug,
			mass: addProductRequestBody.mass ?? null,
			volume: addProductRequestBody.volume ?? null,
			categories,
			inDataSources: [],
		});
		const savedProductEntity = await this.productsRepository.save(productEntity);
		return this.deentitifyProduct(savedProductEntity);
	}

	public async getDetailedProducts(pagingOptions: PagingOptions): Promise<Page<DetailedProduct>> {
		const detailedProductsEntities = await paginatedFindAndCount(
			this.productsRepository,
			pagingOptions,
			{
				relations: ["categories", "inDataSources", "inDataSources.dataSource"],
			}
		);
		const detailedProducts = detailedProductsEntities.map(deentitifyDetailedProduct);
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
		const productEntity = deentitifyDetailedProduct(detailedProductEntity);
		return productEntity;
	}
}

export default ProductsService;
