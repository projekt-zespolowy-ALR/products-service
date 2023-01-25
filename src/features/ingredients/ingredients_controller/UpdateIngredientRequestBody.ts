import {IsString} from "class-validator";

class UpdateIngredientRequestBody {
	@IsString()
	public readonly name!: string;

	@IsString()
	public readonly slug!: string;
}

export default UpdateIngredientRequestBody;
