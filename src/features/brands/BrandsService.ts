import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import BrandEntity from "./BrandEntity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {Page, PageMeta, PagingOptions} from "../../paging/index.js";

@Injectable()
class BrandsService {
	private readonly brandsRepository: Repository<BrandEntity>;
	constructor(@InjectRepository(BrandEntity) brandsRepository: Repository<BrandEntity>) {
		this.brandsRepository = brandsRepository;
	}

	public async getBrands(pagingOptions: PagingOptions): Promise<Page<BrandEntity>> {
		const [brands, total] = await this.brandsRepository.findAndCount({
			take: pagingOptions.take,
			skip: pagingOptions.skip,
		});
		const pageMeta: PageMeta = {
			totalItemsCount: total,
			pageItemsCount: brands.length,
			skip: pagingOptions.skip,
			take: pagingOptions.take,
		};
		const page: Page<BrandEntity> = {
			meta: pageMeta,
			data: brands,
		};
		return page;
	}
	public async getBrandById(id: string): Promise<BrandEntity> {
		return this.brandsRepository.findOneByOrFail({id});
	}
}

export default BrandsService;
