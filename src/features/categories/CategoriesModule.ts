import {Module} from "@nestjs/common";

import {TypeOrmModule} from "@nestjs/typeorm";
import CategoriesController from "./categories_controller/CategoriesController.js";
import CategoriesService from "./categories_service/CategoriesService.js";
import CategoryEntity from "./categories_service/CategoryEntity.js";

@Module({
	imports: [TypeOrmModule.forFeature([CategoryEntity])],
	controllers: [CategoriesController],
	providers: [CategoriesService],
})
class CategoriesModule {
	constructor() {}
}

export default CategoriesModule;
