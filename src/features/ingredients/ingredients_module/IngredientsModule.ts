import {Module} from "@nestjs/common";
import IngredientsController from "../ingredients_controller/IngredientsController.js";
import IngredientsService from "../ingredients_service/IngredientsService.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import IngredientEntity from "../ingredients_service/IngredientEntity.js";

@Module({
	imports: [TypeOrmModule.forFeature([IngredientEntity])],
	controllers: [IngredientsController],
	providers: [IngredientsService],
})
export default class IngredientsModule {}
