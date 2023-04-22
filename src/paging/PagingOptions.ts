import {IsInt, IsOptional, Max, Min} from "class-validator";
import {ApiPropertyOptional} from "@nestjs/swagger";
import {Type} from "class-transformer";

class PagingOptions {
	@ApiPropertyOptional({
		default: 0,
		minimum: 0,
		type: Number,
	})
	@IsInt()
	@Min(0)
	@Type(() => Number)
	@IsOptional()
	public readonly skip = 0;

	@ApiPropertyOptional({
		default: 10,
		minimum: 0,
		maximum: 100,
		type: Number,
	})
	@IsInt()
	@Min(0)
	@Max(100)
	@Type(() => Number)
	@IsOptional()
	public readonly take = 10;
}

export default PagingOptions;
