import {Module} from "@nestjs/common";
import CategoriesController from "./CategoriesController.js";
import CategoriesService from "./CategoriesService.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import CategoryEntity from "./CategoryEntity.js";

@Module({
	imports: [TypeOrmModule.forFeature([CategoryEntity])],
	controllers: [CategoriesController],
	providers: [CategoriesService],
})
class CategoriesModule {
	constructor() {}
}

export default CategoriesModule;
