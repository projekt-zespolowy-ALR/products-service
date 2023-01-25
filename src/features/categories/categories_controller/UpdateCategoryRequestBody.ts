import {IsString} from "class-validator";

class UpdateCategoryRequestBody {
	@IsString()
	public readonly name!: string;

	@IsString()
	public readonly slug!: string;
}

export default UpdateCategoryRequestBody;
