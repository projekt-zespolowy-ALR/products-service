import type CreateBrandRequestBody from "./CreateBrandRequestBody.js";
import CreateBrandPayload from "../brands_service/CreateBrandPayload.js";
import {plainToClass} from "class-transformer";

export default function payloadifyCreateBrandRequestBody(
	createBrandRequestBody: CreateBrandRequestBody
): CreateBrandPayload {
	return plainToClass(CreateBrandPayload, createBrandRequestBody);
}
