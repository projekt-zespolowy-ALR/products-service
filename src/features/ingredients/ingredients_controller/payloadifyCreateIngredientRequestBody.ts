import type CreateIngredientRequestBody from "./CreateIngredientRequestBody.js";
import CreateIngredientPayload from "../ingredients_service/CreateIngredientPayload.js";
import {plainToClass} from "class-transformer";

export default function payloadifyCreateIngredientRequestBody(
	createIngredientRequestBody: CreateIngredientRequestBody
): CreateIngredientPayload {
	return plainToClass(CreateIngredientPayload, createIngredientRequestBody);
}
