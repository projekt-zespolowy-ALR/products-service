import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import BrandEntity from "./BrandEntity.js";
import {InjectRepository} from "@nestjs/typeorm";
import type Page from "../../../paging/Page.js";
import type PagingOptions from "../../../paging/PagingOptions.js";
import paginatedFindAndCount from "../../../paging/paginatedFindAndCount.js";
import type Brand from "../brands_controller/Brand.js";
import deentityifyBrandEntity from "./deentityifyBrandEntity.js";

@Injectable()
export default class BrandsService {
	private readonly brandsRepository: Repository<BrandEntity>;
	public constructor(@InjectRepository(BrandEntity) brandsRepository: Repository<BrandEntity>) {
		this.brandsRepository = brandsRepository;
	}
	public async getBrands(pagingOptions: PagingOptions): Promise<Page<Brand>> {
		return (await paginatedFindAndCount(this.brandsRepository, pagingOptions)).map(
			deentityifyBrandEntity
		);
	}
	public async getBrandById(id: string): Promise<Brand> {
		return deentityifyBrandEntity(await this.brandsRepository.findOneByOrFail({id}));
	}
}
