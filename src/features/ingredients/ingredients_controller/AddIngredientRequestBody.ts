import {IsString} from "class-validator";

class AddIngredientRequestBody {
	@IsString()
	public readonly name!: string;

	@IsString()
	public readonly slug!: string;
}

export default AddIngredientRequestBody;
