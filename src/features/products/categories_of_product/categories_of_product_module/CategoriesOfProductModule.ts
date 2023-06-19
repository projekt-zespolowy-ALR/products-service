import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductInCategoryEntity} from "../categories_of_product_service/ProductInCategoryEntity.js";
import {CategoriesOfProductController} from "../categories_of_product_controller/CategoriesOfProductController.js";
import {CategoriesOfProductService} from "../categories_of_product_service/CategoriesOfProductService.js";
import ProductEntity from "../../products_service/ProductEntity.js";

@Module({
	imports: [TypeOrmModule.forFeature([ProductEntity, ProductInCategoryEntity])],
	controllers: [CategoriesOfProductController],
	providers: [CategoriesOfProductService],
})
export class CategoriesOfProductModule {
	public constructor() {}
}
