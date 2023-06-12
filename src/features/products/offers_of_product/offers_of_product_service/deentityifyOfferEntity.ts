import {plainToInstance} from "class-transformer";
import type {OfferEntity} from "../../../offers/OfferEntity.js";
import {Offer} from "../offers_of_product_controller/Offer.js";

export function deentityifyOfferEntity(offerEntity: OfferEntity): Offer {
	return plainToInstance(Offer, {
		...offerEntity,
		pricePlnAsString: offerEntity.pricePln ?? null,
	});
}
