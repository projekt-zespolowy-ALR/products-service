import {IsString} from "class-validator";

class UpdateBrandRequestBody {
	@IsString()
	public readonly name!: string;

	@IsString()
	public readonly slug!: string;
}

export default UpdateBrandRequestBody;
