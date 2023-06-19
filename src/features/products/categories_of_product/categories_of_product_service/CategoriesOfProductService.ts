import {Injectable} from "@nestjs/common";
import type Category from "../../../categories/categories_controller/Category.js";
import ProductEntity from "../../products_service/ProductEntity.js";
import {EntityNotFoundError, type Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import deentityifyCategoryEntity from "../../../categories/categories_service/deentityifyCategoryEntity.js";
import {CategoriesOfProductServiceProductWithGivenIdNotFoundError} from "./CategoriesOfProductServiceProductWithGivenIdNotFoundError.js";
import {ProductInCategoryEntity} from "./ProductInCategoryEntity.js";

@Injectable()
export class CategoriesOfProductService {
	private readonly productInCategoriesRepository: Repository<ProductInCategoryEntity>;
	public async saveCategoryListOfProductByid(
		productId: string,
		categoryIds: string[]
	): Promise<Category[]> {
		await this.productInCategoriesRepository.save(
			categoryIds.map((categoryId) => ({
				productId,
				categoryId,
			}))
		);
		const productInCategoryEntities = await this.productInCategoriesRepository.find({
			where: {
				productId,
			},
			relations: {
				category: true,
			},
		});
		return productInCategoryEntities
			.map((productInCategoryEntity) => productInCategoryEntity.category)
			.map(deentityifyCategoryEntity);
	}
	private readonly productsRepository: Repository<ProductEntity>;

	public constructor(
		@InjectRepository(ProductEntity) productsRepository: Repository<ProductEntity>,
		@InjectRepository(ProductInCategoryEntity)
		productInCategoriesRepository: Repository<ProductInCategoryEntity>
	) {
		this.productsRepository = productsRepository;
		this.productInCategoriesRepository = productInCategoriesRepository;
	}

	public async getCategoriesOfProductById(productId: string): Promise<Category[]> {
		try {
			const productEntity = await this.productsRepository.findOneOrFail({
				where: {
					id: productId,
				},
				relations: {
					productInCategories: {
						category: true,
					},
				},
			});
			return productEntity.productInCategories
				.map((productInCategoryEntity) => productInCategoryEntity.category)
				.map(deentityifyCategoryEntity);
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new CategoriesOfProductServiceProductWithGivenIdNotFoundError(productId);
			}
			throw error;
		}
	}
}
