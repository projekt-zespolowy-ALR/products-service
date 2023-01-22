import {plainToClass} from "class-transformer";
import {Repository, type FindOneOptions, type ObjectLiteral} from "typeorm";
import Page from "./Page.js";
import PageMeta from "./PageMeta.js";
import type PagingOptions from "./PagingOptions.js";

async function paginatedFindAndCount<Entity extends ObjectLiteral>(
	repository: Repository<Entity>,
	pagingOptions: PagingOptions,
	findOneOptions: FindOneOptions<Entity> = {}
): Promise<Page<Entity>> {
	const [entities, total]: [ReadonlyArray<Entity>, number] = await repository.findAndCount({
		...findOneOptions,
		...pagingOptions,
	});
	const pageMeta: Readonly<PageMeta> = {
		totalItemsCount: total,
		pageItemsCount: entities.length,
		skip: pagingOptions.skip,
		take: pagingOptions.take,
	};
	// const page: Page<Readonly<Entity>> = {
	// 	meta: pageMeta,
	// 	data: entities,
	// };
	const page: Page<Entity> = plainToClass(Page, {
		meta: pageMeta,
		data: entities,
	}) as Page<Entity>;

	return page;
}

export default paginatedFindAndCount;
