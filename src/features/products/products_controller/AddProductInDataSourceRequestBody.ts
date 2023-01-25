import {IsNumber, IsOptional, IsString} from "class-validator";

class AddProductInDataSourceRequestBody {
	@IsString()
	public readonly dataSourceId!: string;

	@IsString()
	@IsOptional()
	public readonly referenceUrl?: string | null | undefined;

	@IsString()
	@IsOptional()
	public readonly imageUrl?: string | null | undefined;

	@IsNumber()
	@IsOptional()
	public readonly price?: number | null | undefined;

	@IsString()
	@IsOptional()
	public readonly description?: string | null | undefined;
}

export default AddProductInDataSourceRequestBody;
