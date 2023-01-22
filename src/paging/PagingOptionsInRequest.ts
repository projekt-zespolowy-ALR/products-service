import {IsInt, IsOptional, Max, Min} from "class-validator";
import {ApiPropertyOptional} from "@nestjs/swagger";
import {Expose, Type} from "class-transformer";

class PagingOptionsInRequest {
	@ApiPropertyOptional({
		default: 0,
		minimum: 0,
		type: Number,
	})
	@IsInt()
	@Min(0)
	@Type(() => Number)
	@IsOptional()
	@Expose({name: "skip"})
	public readonly "paging-skip"?: number;

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
	@Expose({name: "take"})
	public readonly "paging-take"?: number;
}

export default PagingOptionsInRequest;
