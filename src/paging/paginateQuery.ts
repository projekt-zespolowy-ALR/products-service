import {plainToClass} from "class-transformer";
import {SelectQueryBuilder, type ObjectLiteral} from "typeorm";
import Page from "./Page.js";
import PageMeta from "./PageMeta.js";
import type PagingOptions from "./PagingOptions.js";

async function paginateQuery<Entity extends ObjectLiteral>(
	selectQueryBuilder: SelectQueryBuilder<Entity>,
	pagingOptions: PagingOptions
): Promise<Page<Entity>> {
	const [entities, total]: [ReadonlyArray<Entity>, number] = await selectQueryBuilder
		.skip(pagingOptions["paging-skip"])
		.take(pagingOptions["paging-take"])
		.getManyAndCount();
	const pageMeta: Readonly<PageMeta> = {
		totalItemsCount: total,
		pageItemsCount: entities.length,
		skip: pagingOptions["paging-skip"],
		take: pagingOptions["paging-take"],
	};

	const page: Page<Entity> = plainToClass(Page, {
		meta: pageMeta,
		data: entities,
	}) as Page<Entity>;

	return page;
}

export default paginateQuery;
