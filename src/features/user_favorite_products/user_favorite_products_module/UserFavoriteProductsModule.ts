import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import UserFavoriteProductEntity from "../user_favorite_products_service/UserFavoriteProductEntity.js";
import UserFavoriteProductsService from "../user_favorite_products_service/UserFavoriteProductsService.js";
import UserFavoriteProductsController from "../user_favorite_products_controller/UserFavoriteProductsController.js";
@Module({
	imports: [TypeOrmModule.forFeature([UserFavoriteProductEntity])],
	controllers: [UserFavoriteProductsController],
	providers: [UserFavoriteProductsService],
})
export default class UserFavoriteProductsModule {
	public constructor() {}
}
