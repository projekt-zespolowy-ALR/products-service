import {IsNumber, IsOptional, IsString} from "class-validator";

class UpdateProductRequestBody {
	@IsString()
	@IsOptional()
	public readonly name?: string | undefined | null;

	@IsString()
	public readonly slug!: string;

	@IsNumber()
	@IsOptional()
	public readonly mass?: number | undefined | null;

	@IsNumber()
	@IsOptional()
	public readonly volume?: number | undefined | null;

	@IsString({each: true})
	@IsOptional()
	public readonly categoriesIds: readonly string[] | undefined | null;

	@IsString()
	@IsOptional()
	public readonly brandId?: string | undefined | null;
}

export default UpdateProductRequestBody;
