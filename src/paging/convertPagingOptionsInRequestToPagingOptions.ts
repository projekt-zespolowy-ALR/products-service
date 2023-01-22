import {plainToClass} from "class-transformer";
import PagingOptions from "./PagingOptions.js";
import PagingOptionsInRequest from "./PagingOptionsInRequest.js";

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
