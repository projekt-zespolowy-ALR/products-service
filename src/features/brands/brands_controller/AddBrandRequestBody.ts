import {IsString} from "class-validator";

class AddBrandRequestBody {
	@IsString()
	public readonly name!: string;

	@IsString()
	public readonly slug!: string;
}

export default AddBrandRequestBody;
