import yup from "yup";

const openApiConfigSchema = yup
	.object({
		outputFilePath: yup.string().notRequired(),
		openApiVersion: yup.string().required(),
		info: yup
			.object({
				title: yup.string().required(),
				version: yup.string().required(),
			})
			.noUnknown()
			.required(),
	})
	.noUnknown()
	.required();

export default openApiConfigSchema;
