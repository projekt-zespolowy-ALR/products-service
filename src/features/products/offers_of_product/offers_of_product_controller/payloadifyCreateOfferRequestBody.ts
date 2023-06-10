import type {CreateOfferPayload} from "../offers_of_product_service/CreateOfferPayload.js";
import type {CreateOfferRequestBody} from "./CreateOfferRequestBody.js";

export function payloadifyCreateOfferRequestBody(
	createOfferRequestBody: CreateOfferRequestBody
): CreateOfferPayload {
	return {
		referenceUrl: createOfferRequestBody.referenceUrl ?? null,
		imageUrl: createOfferRequestBody.imageUrl ?? null,
		description: createOfferRequestBody.description ?? null,
		pricePlnAsString: createOfferRequestBody.pricePlnAsString ?? null,
	};
}
