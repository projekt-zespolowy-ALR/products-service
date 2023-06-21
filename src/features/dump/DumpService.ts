import {Injectable} from "@nestjs/common";
import {In, type Repository} from "typeorm";
import type {
	DumpBrand,
	DumpCategory,
	DumpDataSource,
	DumpIngredient,
	DumpOffer,
	DumpProduct,
} from "./Offer.js";
import {InjectRepository} from "@nestjs/typeorm";
import {OfferEntity} from "../offers/OfferEntity.js";
import BrandEntity from "../brands/brands_service/BrandEntity.js";
import CategoryEntity from "../categories/categories_service/CategoryEntity.js";
import DataSourceEntity from "../data_sources/data_sources_service/DataSourceEntity.js";
import ProductEntity from "../products/products_service/ProductEntity.js";
import IngredientEntity from "../ingredients/ingredients_service/IngredientEntity.js";

@Injectable()
export class DumpService {
	private readonly offersRepository: Repository<OfferEntity>;
	private readonly brandsRepository: Repository<BrandEntity>;
	private readonly categoriesRepository: Repository<CategoryEntity>;
	private readonly dataSourcesRepository: Repository<DataSourceEntity>;
	private readonly productsRepository: Repository<ProductEntity>;
	private readonly ingredientsRepository: Repository<IngredientEntity>;

	public constructor(
		@InjectRepository(OfferEntity) offersRepository: Repository<OfferEntity>,
		@InjectRepository(BrandEntity) brandsRepository: Repository<BrandEntity>,
		@InjectRepository(CategoryEntity) categoriesRepository: Repository<CategoryEntity>,
		@InjectRepository(DataSourceEntity) dataSourcesRepository: Repository<DataSourceEntity>,
		@InjectRepository(ProductEntity) productsRepository: Repository<ProductEntity>,
		@InjectRepository(IngredientEntity) ingredientsRepository: Repository<IngredientEntity>
	) {
		this.offersRepository = offersRepository;
		this.brandsRepository = brandsRepository;
		this.categoriesRepository = categoriesRepository;
		this.dataSourcesRepository = dataSourcesRepository;
		this.productsRepository = productsRepository;
		this.ingredientsRepository = ingredientsRepository;
	}

	private async persistBrand(brand: DumpBrand): Promise<BrandEntity> {
		await this.brandsRepository.upsert(
			{
				slug: brand.slug,
				name: brand.name,
			},
			["slug"]
		);
		return this.brandsRepository.findOneByOrFail({
			slug: brand.slug,
		});
	}

	private async persistCategories(categories: DumpCategory[]): Promise<CategoryEntity[]> {
		await this.categoriesRepository.upsert(
			categories.map((category) => ({
				slug: category.slug,
				name: category.name,
			})),
			["slug"]
		);
		return this.categoriesRepository.findBy({
			slug: In(categories.map((category) => category.slug)),
		});
	}

	private async persistDataSource(dataSource: DumpDataSource): Promise<DataSourceEntity> {
		await this.dataSourcesRepository.upsert(
			{
				slug: dataSource.slug,
				name: dataSource.name,
				url: dataSource.url,
			},
			["slug"]
		);
		return this.dataSourcesRepository.findOneByOrFail({
			slug: dataSource.slug,
		});
	}

	private async persistIngredients(ingredients: DumpIngredient[]): Promise<IngredientEntity[]> {
		await this.ingredientsRepository.upsert(
			ingredients.map((ingredient) => ({
				slug: ingredient.slug,
				latinName: ingredient.latinName,
			})),
			["slug"]
		);
		return this.ingredientsRepository.findBy({
			slug: In(ingredients.map((ingredient) => ingredient.slug)),
		});
	}

	private async persistProduct(product: DumpProduct): Promise<ProductEntity> {
		await this.productsRepository.upsert(
			{
				slug: product.slug,
				massKilograms: product.massKilograms,
				volumeLiters: product.volumeLiters,
				name: product.name,
				brand: product.brand ? await this.persistBrand(product.brand) : null,
				productInCategories: product.categories
					? (
							await this.persistCategories(product.categories)
					  ).map((category) => ({
							categoryId: category.id,
					  }))
					: [],
				ingredientList: product.ingredients
					? {
							ingredientsInList: (
								await this.persistIngredients(product.ingredients)
							).map((ingredient) => ({
								ingredientId: ingredient.id,
							})),
					  }
					: null,
			},
			["slug"]
		);
		return this.productsRepository.findOneByOrFail({
			slug: product.slug,
		});
	}

	private async persistOffer(offer: DumpOffer): Promise<OfferEntity> {
		const product = await this.persistProduct(offer.product);
		const dataSource = await this.persistDataSource(offer.dataSource);
		await this.offersRepository.upsert(
			{
				product: {
					id: product.id,
				},
				dataSource: {
					id: dataSource.id,
				},
				description: offer.description,
				imageUrl: offer.imageUrl,
				referenceUrl: offer.referenceUrl,
				pricePln: offer.pricePln ? String(offer.pricePln) : null,
			},
			["product", "dataSource"]
		);
		return this.offersRepository.findOneByOrFail({
			product: {
				id: product.id,
			},
			dataSource: {
				id: dataSource.id,
			},
		});
	}

	public async dump(offer: DumpOffer) {
		return await this.persistOffer(offer);
	}
}
