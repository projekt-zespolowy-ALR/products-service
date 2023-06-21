import {Module} from "@nestjs/common";
import {DumpController} from "./DumpController.js";
import {DumpService} from "./DumpService.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OfferEntity} from "../offers/OfferEntity.js";
import BrandEntity from "../brands/brands_service/BrandEntity.js";
import IngredientEntity from "../ingredients/ingredients_service/IngredientEntity.js";
import ProductEntity from "../products/products_service/ProductEntity.js";
import DataSourceEntity from "../data_sources/data_sources_service/DataSourceEntity.js";
import CategoryEntity from "../categories/categories_service/CategoryEntity.js";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			OfferEntity,
			BrandEntity,
			IngredientEntity,
			ProductEntity,
			DataSourceEntity,
			CategoryEntity,
			// ProductEntity,
			// IngredientListEntity,
			// IngredientInIngredientListEntity,
		]),
	],
	controllers: [DumpController],
	providers: [DumpService],
})
export default class DumpModule {}
