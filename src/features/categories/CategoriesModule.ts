import {Module} from "@nestjs/common";
import {CategoryEntity, CategoriesService} from "./categories_service/index.js";

import {CategoriesController} from "./categories_controller/index.js";

import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
	imports: [TypeOrmModule.forFeature([CategoryEntity])],
	controllers: [CategoriesController],
	providers: [CategoriesService],
})
class CategoriesModule {
	constructor() {}
}

export default CategoriesModule;
