import {IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID} from "class-validator";

export default class CreateProductRequestBody {
	@IsUUID("4")
	public readonly brandId!: string;
	@IsNotEmpty()
	@IsString()
	public readonly slug!: string;

	@IsNumber()
	@IsOptional()
	public readonly massKilograms?: number | null;

	@IsNumber()
	@IsOptional()
	public readonly volumeLiters?: number | null;

	@IsNotEmpty()
	@IsString()
	public readonly name!: string;
}
