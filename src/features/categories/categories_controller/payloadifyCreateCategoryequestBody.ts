import type CreateCategoryRequestBody from "./CreateCategoryRequestBody.js";
import CreateCategoryPayload from "../categories_service/CreateCategoryPayload.js";
import {plainToClass} from "class-transformer";

export default function payloadifyCreateCategoryRequestBody(
	createCategoryRequestBody: CreateCategoryRequestBody
): CreateCategoryPayload {
	return plainToClass(CreateCategoryPayload, createCategoryRequestBody);
}
