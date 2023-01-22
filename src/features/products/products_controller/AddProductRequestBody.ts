import {Type} from "class-transformer";
import {IsArray, IsNumber, IsOptional, IsString, ValidateNested} from "class-validator";

class AddProductRequestBodyInDataSource {
	@IsString()
	@IsOptional()
	public readonly dataSourceIdOrSlug!: string;

	@IsString()
	@IsOptional()
	public readonly referenceUrl?: string | undefined | null;

	@IsString()
	@IsOptional()
	public readonly imageUrl?: string | undefined | null;

	@IsNumber()
	@IsOptional()
	public readonly price?: number | undefined | null;
}

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
	@IsOptional()
	public readonly categoriesIdsOrSlugs?: readonly string[] | undefined | null;

	@IsOptional()
	@ValidateNested({each: true})
	@IsArray()
	@Type(() => AddProductRequestBodyInDataSource)
	public readonly inDataSources?: readonly AddProductRequestBodyInDataSource[] | undefined | null;
}

export default AddProductRequestBody;
