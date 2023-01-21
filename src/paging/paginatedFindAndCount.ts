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
	const page: Page<Readonly<Entity>> = {
		meta: pageMeta,
		data: entities,
	};
	return page;
}

export default paginatedFindAndCount;
