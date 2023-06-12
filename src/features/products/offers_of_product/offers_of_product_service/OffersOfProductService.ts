import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import type {Offer} from "../offers_of_product_controller/Offer.js";
import ProductEntity from "../../products_service/ProductEntity.js";
import {deentityifyOfferEntity} from "./deentityifyOfferEntity.js";
import type {CreateOfferPayload} from "./CreateOfferPayload.js";
import {OfferEntity} from "../../../offers/OfferEntity.js";
import DataSourceEntity from "../../../data_sources/data_sources_service/DataSourceEntity.js";
@Injectable()
export class OffersOfProductService {
	private readonly productsRepository: Repository<ProductEntity>;
	private readonly dataSourceRepository: Repository<DataSourceEntity>;
	private readonly offersRepository: Repository<OfferEntity>;
	public constructor(
		@InjectRepository(ProductEntity) productsRepository: Repository<ProductEntity>,
		@InjectRepository(OfferEntity) offersRepository: Repository<OfferEntity>,
		@InjectRepository(DataSourceEntity) dataSourceRepository: Repository<DataSourceEntity>
	) {
		this.productsRepository = productsRepository;
		this.offersRepository = offersRepository;
		this.dataSourceRepository = dataSourceRepository;
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
	public async addOfferToProduct(
		productId: string,
		dataSourceId: string,
		createOfferPayload: CreateOfferPayload
	): Promise<Offer> {
		const [productEntity, DataSourceEntity] = await Promise.all([
			this.productsRepository.findOneOrFail({
				where: {
					id: productId,
				},
			}),
			this.dataSourceRepository.findOneOrFail({
				where: {
					id: dataSourceId,
				},
			}),
		]);
		const offerEntity = this.offersRepository.create({
			...createOfferPayload,
			pricePln: createOfferPayload.pricePlnAsString ?? null,
			product: productEntity,
			dataSource: DataSourceEntity,
		});
		const offer = deentityifyOfferEntity(await this.offersRepository.save(offerEntity));
		return offer;
	}
}
