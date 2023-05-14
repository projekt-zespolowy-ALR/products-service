import {IsNotEmpty, IsString} from "class-validator";

export default class CreateCategoryRequestBody {
	@IsNotEmpty()
	@IsString()
	public readonly name!: string;
	@IsNotEmpty()
	@IsString()
	public readonly slug!: string;
}
