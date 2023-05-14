import {IsNotEmpty, IsString} from "class-validator";

export default class CreateDataSourceRequestBody {
	@IsNotEmpty()
	@IsString()
	public readonly name!: string;
	@IsNotEmpty()
	@IsString()
	public readonly slug!: string;
	@IsNotEmpty()
	@IsString()
	public readonly url!: string;
}
