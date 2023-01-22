import {IsString} from "class-validator";

class AddCategoryRequestBody {
	@IsString()
	public readonly name!: string;

	@IsString()
	public readonly slug!: string;
}

export default AddCategoryRequestBody;
