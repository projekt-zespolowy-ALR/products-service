import {Module} from "@nestjs/common";
import ProductsController from "./ProductsController.js";
import ProductsService from "./ProductsService.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import ProductEntity from "./ProductEntity.js";

@Module({
	imports: [TypeOrmModule.forFeature([ProductEntity])],
	controllers: [ProductsController],
	providers: [ProductsService],
})
class ProductsModule {
	constructor() {}
}

export default ProductsModule;
