import yup from "yup";

import openApiConfigSchema from "./openApiConfigSchema.js";

type OpenApiConfig = Readonly<yup.InferType<typeof openApiConfigSchema>>;

export default OpenApiConfig;
