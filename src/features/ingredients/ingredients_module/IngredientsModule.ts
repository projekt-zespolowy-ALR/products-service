import {Module} from "@nestjs/common";

import {TypeOrmModule} from "@nestjs/typeorm";
import IngredientsController from "../ingredients_controller/IngredientsController.js";
import IngredientEntity from "../ingredients_service/IngredientEntity.js";
import IngredientsService from "../ingredients_service/IngredientsService.js";

@Module({
	imports: [TypeOrmModule.forFeature([IngredientEntity])],
	controllers: [IngredientsController],
	providers: [IngredientsService],
})
class IngredientsModule {
	constructor() {}
}

export default IngredientsModule;
