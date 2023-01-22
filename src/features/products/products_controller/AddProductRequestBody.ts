import {IsNumber, IsOptional, IsString} from "class-validator";
class AddProductRequestBody {
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
	public readonly categoriesIdsOrSlugs?: readonly string[] | undefined | null;
}

export default AddProductRequestBody;
