import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import type {Offer} from "../offers_of_product_controller/Offer.js";
import ProductEntity from "../../products_service/ProductEntity.js";
import {deentityifyOfferEntity} from "./deentityifyOfferEntity.js";
@Injectable()
export class OffersOfProductService {
	private readonly productsRepository: Repository<ProductEntity>;
	public constructor(
		@InjectRepository(ProductEntity) productsRepository: Repository<ProductEntity>
	) {
		this.productsRepository = productsRepository;
	}
	public async getOffersOfProduct(productId: string): Promise<Offer[]> {
		const productEntity = await this.productsRepository.findOneOrFail({
			where: {
				id: productId,
			},
			relations: ["offers"],
		});
		const offers = productEntity.offers.map(deentityifyOfferEntity);
		return offers;
	}
}
