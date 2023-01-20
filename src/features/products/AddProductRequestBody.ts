import {IsNumber, IsOptional, IsString} from "class-validator";
class AddProductRequestBody {
	@IsString()
	@IsOptional()
	public readonly name?: string | undefined;

	@IsString()
	public readonly slug!: string;

	@IsNumber()
	@IsOptional()
	public readonly mass?: number | undefined;

	@IsNumber()
	@IsOptional()
	public readonly volume!: number | null;
}

export default AddProductRequestBody;
