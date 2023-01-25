import {IsString, IsUrl} from "class-validator";

class UpdateDataSourceRequestBody {
	@IsString()
	public readonly name!: string;

	@IsString()
	public readonly slug!: string;

	@IsUrl()
	public readonly url!: string;
}

export default UpdateDataSourceRequestBody;
