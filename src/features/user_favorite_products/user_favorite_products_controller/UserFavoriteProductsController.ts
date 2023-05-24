import {Controller} from "@nestjs/common";
import type UserFavoriteProductsService from "../user_favorite_products_service/UserFavoriteProductsService.js";

@Controller("/")
export default class UserFavoriteProductsController {
	private readonly userFavoriteProductsService: UserFavoriteProductsService;
	public constructor(userFavoriteProductsService: UserFavoriteProductsService) {
		this.userFavoriteProductsService = userFavoriteProductsService;
	}
}
