import {Controller, Get, Param, ParseUUIDPipe} from "@nestjs/common";

import type {Offer} from "./Offer.js";
import {OffersOfProductService} from "../offers_of_product_service/OffersOfProductService.js";

@Controller("/products/:productId/offers")
export class OffersOfProductController {
	@Get("/")
	public async getOffersOfProduct(
		@Param(
			"productId",
			new ParseUUIDPipe({
				version: "4",
			})
		)
		productId: string
	): Promise<Offer[]> {
		const offers = await this.offersOfProductService.getOffersOfProduct(productId);
		return offers;
	}
	private readonly offersOfProductService: OffersOfProductService;
	public constructor(offersOfProductService: OffersOfProductService) {
		this.offersOfProductService = offersOfProductService;
	}
}
