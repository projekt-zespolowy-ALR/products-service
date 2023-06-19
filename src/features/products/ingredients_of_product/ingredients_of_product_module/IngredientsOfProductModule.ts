import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {IngredientListEntity} from "../ingredients_of_product_service/IngredientListEntity.js";
import {IngredientInIngredientListEntity} from "../ingredients_of_product_service/IngredientInIngredientListEntity.js";
import {IngredientsOfProductController} from "../ingredients_of_product_controller/IngredientsOfProductController.js";
import {IngredientsOfProductService} from "../ingredients_of_product_service/IngredientsOfProductService.js";
import ProductEntity from "../../products_service/ProductEntity.js";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			ProductEntity,
			IngredientListEntity,
			IngredientInIngredientListEntity,
		]),
	],
	controllers: [IngredientsOfProductController],
	providers: [IngredientsOfProductService],
})
export class IngredientsOfProductModule {
	public constructor() {}
}
