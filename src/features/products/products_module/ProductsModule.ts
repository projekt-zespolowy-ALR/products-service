import {Module} from "@nestjs/common";
import ProductsController from "../products_controller/ProductsController.js";
import ProductsService from "../products_service/ProductsService.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import ProductEntity from "../products_service/ProductEntity.js";
import {OfferEntity} from "../../offers/OfferEntity.js";
import {OffersOfProductModule} from "../offers_of_product/offers_of_product_module/OffersOfProductModule.js";
import {IngredientsOfProductModule} from "../ingredients_of_product/ingredients_of_product_module/IngredientsOfProductModule.js";
import {CategoriesOfProductModule} from "../categories_of_product/categories_of_product_module/CategoriesOfProductModule.js";

@Module({
	imports: [
		TypeOrmModule.forFeature([ProductEntity, OfferEntity]),
		OffersOfProductModule,
		IngredientsOfProductModule,
		CategoriesOfProductModule,
	],
	controllers: [ProductsController],
	providers: [ProductsService],
})
export default class ProductsModule {
	public constructor() {}
}
