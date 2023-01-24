import {Module} from "@nestjs/common";
import {ProductEntity, ProductsService} from "./products_service/index.js";

import {ProductsController} from "./products_controller/index.js";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
	imports: [TypeOrmModule.forFeature([ProductEntity])],
	controllers: [ProductsController],
	providers: [ProductsService],
})
class ProductsModule {
	constructor() {}
}

export default ProductsModule;
