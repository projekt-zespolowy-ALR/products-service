import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import UserFavoriteProductEntity from "../user_favorite_products_service/UserFavoriteProductEntity.js";
import UserFavoriteProductsService from "../user_favorite_products_service/UserFavoriteProductsService.js";
import UserFavoriteProductsController from "../user_favorite_products_controller/UserFavoriteProductsController.js";
import UsersMicroserviceClientModule from "../../users_microservice_client/UsersMicroserviceClientModule.js";
@Module({
	imports: [TypeOrmModule.forFeature([UserFavoriteProductEntity]), UsersMicroserviceClientModule],
	controllers: [UserFavoriteProductsController],
	providers: [UserFavoriteProductsService],
})
export default class UserFavoriteProductsModule {
	public constructor() {}
}
