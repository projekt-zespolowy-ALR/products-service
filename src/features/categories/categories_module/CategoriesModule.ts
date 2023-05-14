import {Module} from "@nestjs/common";
import CategoriesController from "../categories_controller/CategoriesController.js";
import CategoriesService from "../categories_service/CategoriesService.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import CategoryEntity from "../categories_service/CategoryEntity.js";

@Module({
	imports: [TypeOrmModule.forFeature([CategoryEntity])],
	controllers: [CategoriesController],
	providers: [CategoriesService],
})
export default class CategoriesModule {}
