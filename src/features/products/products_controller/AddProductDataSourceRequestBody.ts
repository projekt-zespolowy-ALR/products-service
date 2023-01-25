import {IsNumber, IsOptional, IsString} from "class-validator";

class AddProductInDataSourceRequestBody {
	@IsString()
	public readonly dataSourceId!: string;

	@IsString()
	@IsOptional()
	public readonly refenceUrl?: string | null | undefined;

	@IsString()
	@IsOptional()
	public readonly imageUrl?: string | null | undefined;

	@IsString()
	@IsNumber()
	public readonly price?: number | null | undefined;
}

export default AddProductInDataSourceRequestBody;
