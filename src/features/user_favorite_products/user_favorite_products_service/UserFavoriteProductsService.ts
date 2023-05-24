import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import UserFavoriteProductEntity from "./UserFavoriteProductEntity.js";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export default class UserFavoriteProductsService {
	private readonly userFavoriteproductsRepository: Repository<UserFavoriteProductEntity>;
	public constructor(
		@InjectRepository(UserFavoriteProductEntity)
		userFavoriteproductsRepository: Repository<UserFavoriteProductEntity>
	) {
		this.userFavoriteproductsRepository = userFavoriteproductsRepository;
	}
}
