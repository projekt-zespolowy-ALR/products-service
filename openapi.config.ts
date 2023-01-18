import type {OpenApiConfig} from "./scripts/generate_openapi/index.js";

const config: OpenApiConfig = {
	outputFilePath: undefined,
	openApiVersion: "3.0.0",
	info: {
		title: "Products service",
		version: "1",
	},
};
export default config;
