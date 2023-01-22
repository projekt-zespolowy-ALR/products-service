import {IsString, IsUrl} from "class-validator";

class AddDataSourceRequestBody {
	@IsString()
	public readonly name!: string;

	@IsString()
	public readonly slug!: string;

	@IsUrl()
	public readonly url!: string;
}

export default AddDataSourceRequestBody;
