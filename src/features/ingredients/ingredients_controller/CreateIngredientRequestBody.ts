import {IsNotEmpty, IsString} from "class-validator";

export default class CreateIngredientRequestBody {
	@IsNotEmpty()
	@IsString()
	public readonly latinName!: string;
	@IsNotEmpty()
	@IsString()
	public readonly slug!: string;
}
