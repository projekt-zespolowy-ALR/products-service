import {plainToClass} from "class-transformer";
import {PagingOptions, type PagingOptionsInRequest} from "../paging/index.js";

function convertPagingOptionsInRequestToPagingOptions(
	pagingOptionsInRequest: PagingOptionsInRequest
): PagingOptions {
	return plainToClass(
		PagingOptions,
		{
			skip: pagingOptionsInRequest["paging-skip"],
			take: pagingOptionsInRequest["paging-take"],
		},
		{
			exposeDefaultValues: true,
		}
	);
}

export default convertPagingOptionsInRequestToPagingOptions;
