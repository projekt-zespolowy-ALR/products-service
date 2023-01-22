import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";

import {InjectRepository} from "@nestjs/typeorm";
import {Page, PageMeta, PagingOptions} from "../../../paging/index.js";
import BrandEntity from "./BrandEntity.js";

import * as Paging from "../../../paging/index.js";

@Injectable()
class BrandsService {
	private readonly brandsRepository: Repository<BrandEntity>;
	constructor(@InjectRepository(BrandEntity) brandsRepository: Repository<BrandEntity>) {
		this.brandsRepository = brandsRepository;
	}

	public async getBrands(pagingOptions: PagingOptions): Promise<Page<BrandEntity>> {
		return await Paging.paginatedFindAndCount(this.brandsRepository, pagingOptions);
	}
	public async getBrandById(id: string): Promise<BrandEntity> {
		return this.brandsRepository.findOneByOrFail({id});
	}
}

export default BrandsService;
