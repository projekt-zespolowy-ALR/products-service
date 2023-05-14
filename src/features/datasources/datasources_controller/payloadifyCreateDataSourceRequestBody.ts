import type CreateDataSourceRequestBody from "./CreateDataSourceRequestBody.js";
import CreateDataSourcePayload from "../datasources_service/CreateDataSourcePayload.js";
import {plainToClass} from "class-transformer";

export default function payloadifyCreateDataSourceRequestBody(
	createDataSourceRequestBody: CreateDataSourceRequestBody
): CreateDataSourcePayload {
	return plainToClass(CreateDataSourcePayload, createDataSourceRequestBody);
}
