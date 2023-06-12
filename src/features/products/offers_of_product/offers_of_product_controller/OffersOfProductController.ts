import {Body, Controller, Get, Param, ParseUUIDPipe, Put, ValidationPipe} from "@nestjs/common";

import type {Offer} from "./Offer.js";
import {OffersOfProductService} from "../offers_of_product_service/OffersOfProductService.js";
import {CreateOfferRequestBody} from "./CreateOfferRequestBody.js";
import {payloadifyCreateOfferRequestBody} from "./payloadifyCreateOfferRequestBody.js";

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

	@Put("/:dataSourceId")
	public async addOfferToProduct(
		@Param(
			"productId",
			new ParseUUIDPipe({
				version: "4",
			})
		)
		productId: string,
		@Param(
			"dataSourceId",
			new ParseUUIDPipe({
				version: "4",
			})
		)
		dataSourceId: string,
		@Body(
			new ValidationPipe({
				transform: true, // Transform to instance
				whitelist: true, // Do not allow other properties than those defined in CreateCatRequestBody
				forbidNonWhitelisted: true, // Throw an error if other properties than those defined in CreateCatRequestBody are present
			})
		)
		createOfferRequestBody: CreateOfferRequestBody
	): Promise<Offer> {
		return await this.offersOfProductService.addOfferToProduct(
			productId,
			dataSourceId,
			payloadifyCreateOfferRequestBody(createOfferRequestBody)
		);
	}
}
