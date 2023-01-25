import {IsInt, IsOptional, Max, Min} from "class-validator";
import {Type} from "class-transformer";

class PagingOptions {
	@IsInt()
	@Min(0)
	@Type(() => Number)
	@IsOptional()
	public readonly "paging-skip": number = 0;

	@IsInt()
	@Min(0)
	@Max(100)
	@Type(() => Number)
	@IsOptional()
	public readonly "paging-take": number = 10;
}

export default PagingOptions;
