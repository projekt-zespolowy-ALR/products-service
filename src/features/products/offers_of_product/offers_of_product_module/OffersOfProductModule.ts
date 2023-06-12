import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OffersOfProductController} from "../offers_of_product_controller/OffersOfProductController.js";
import {OffersOfProductService} from "../offers_of_product_service/OffersOfProductService.js";
import ProductEntity from "../../products_service/ProductEntity.js";
import {OfferEntity} from "../../../offers/OfferEntity.js";
import DataSourceEntity from "../../../data_sources/data_sources_service/DataSourceEntity.js";
@Module({
	imports: [TypeOrmModule.forFeature([ProductEntity, OfferEntity, DataSourceEntity])],
	controllers: [OffersOfProductController],
	providers: [OffersOfProductService],
})
export class OffersOfProductModule {
	public constructor() {}
}
