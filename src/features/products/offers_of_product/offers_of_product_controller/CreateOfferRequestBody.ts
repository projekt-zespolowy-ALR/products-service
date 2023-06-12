import {Matches} from "class-validator";
import {IsOptional, IsString, IsUrl, MinLength} from "class-validator";

export class CreateOfferRequestBody {
	@IsString()
	@MinLength(1)
	@IsOptional()
	@IsUrl()
	public readonly referenceUrl?: string | null;

	@IsString()
	@IsOptional()
	@IsUrl()
	@MinLength(1)
	public readonly imageUrl?: string | null;

	@IsString()
	@IsOptional()
	@MinLength(1)
	public readonly description?: string | null;

	@IsString()
	@IsOptional()
	@Matches(/^\d+\.\d{2}$/)
	public readonly pricePlnAsString?: string | null;
}
