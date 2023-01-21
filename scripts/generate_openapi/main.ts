import {FastifyAdapter, NestFastifyApplication} from "@nestjs/platform-fastify";
import {VersioningType} from "@nestjs/common";
import openApiConfigSchema from "./openApiConfigSchema.js";
const openApiConfig = await openApiConfigSchema.validate(
	(
		await import("../../openapi.config.js")
	).default,
	{
		strict: true,
		abortEarly: false,
	}
);

import {SwaggerModule, DocumentBuilder} from "@nestjs/swagger";
import * as path from "path";
import * as fs from "fs/promises";
import {Test} from "@nestjs/testing";
import ProductsModule from "../../src/features/products/ProductsModule.js";

import {getRepositoryToken} from "@nestjs/typeorm";
import ProductEntity from "../../src/features/products/ProductEntity.js";
import CategoriesModule from "../../src/features/categories/CategoriesModule.js";
import BrandsModule from "../../src/features/brands/BrandsModule.js";
import CategoryEntity from "../../src/features/categories/categories_service/CategoryEntity.js";
import BrandEntity from "../../src/features/brands/brands_service/BrandEntity.js";
import AppConfigModule from "../../src/config/AppConfigModule.js";

const appModule = await Test.createTestingModule({
	imports: [ProductsModule, CategoriesModule, BrandsModule, AppConfigModule],
})
	.overrideProvider(getRepositoryToken(ProductEntity))
	.useValue(null)
	.overrideProvider(getRepositoryToken(CategoryEntity))
	.useValue(null)
	.overrideProvider(getRepositoryToken(BrandEntity))
	.useValue(null)
	.compile();
const app = appModule.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
app.enableVersioning({
	type: VersioningType.URI,
});

const swaggerOptions = new DocumentBuilder()
	.setTitle(openApiConfig.info.title)
	.setVersion(openApiConfig.info.version)
	.build();
const document = SwaggerModule.createDocument(app, swaggerOptions);
const outputFilePath = openApiConfig.outputFilePath ?? path.join("openapi", "openapi.json");
await fs.mkdir(path.dirname(outputFilePath), {recursive: true});
const outputPath = path.resolve(process.cwd(), outputFilePath);
await fs.writeFile(outputPath, JSON.stringify(document), {encoding: "utf8"});
