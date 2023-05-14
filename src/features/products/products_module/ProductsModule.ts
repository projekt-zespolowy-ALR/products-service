import {Module} from "@nestjs/common";
import ProductsController from "../products_controller/ProductsController.js";
import ProductsService from "../products_service/ProductsService.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import ProductEntity from "../products_service/ProductEntity.js";

@Module({
	imports: [TypeOrmModule.forFeature([ProductEntity])],
	controllers: [ProductsController],
	providers: [ProductsService],
})
export default class ProductsModule {}
