import type CreateProductRequestBody from "./CreateProductRequestBody.js";
import CreateProductPayload from "../products_service/CreateProductPayload.js";
import {plainToClass} from "class-transformer";

export default function payloadifyCreateProductRequestBody(
	createProductRequestBody: CreateProductRequestBody
): CreateProductPayload {
	return plainToClass(CreateProductPayload, {
		...createProductRequestBody,
		massKilograms: createProductRequestBody.massKilograms ?? null,
		volumeLiters: createProductRequestBody.volumeLiters ?? null,
	});
}
