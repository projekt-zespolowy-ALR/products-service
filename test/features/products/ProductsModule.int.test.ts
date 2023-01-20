import {FastifyAdapter, NestFastifyApplication} from "@nestjs/platform-fastify";
import * as Testcontainers from "testcontainers";
import {testsConfig} from "../../config/index.js";
import * as fs from "fs/promises";
import * as TestsUtils from "../../utils/index.js";
import {TypedConfigModule} from "nest-typed-config";
import {AppConfig} from "../../../src/config/index.js";
import {Test} from "@nestjs/testing";
import {AppOrmModule} from "../../../src/orm/index.js";
import ProductsModule from "../../../src/features/products/ProductsModule.js";
import {VersioningType} from "@nestjs/common";
import {describe, test, expect, beforeEach, afterEach, beforeAll} from "@jest/globals";
import AddProductRequestBody from "../../../src/features/products/AddProductRequestBody.js";

let postgresqlContainer: Testcontainers.StartedPostgreSqlContainer | null = null;
let app: NestFastifyApplication | null = null;
let postgresqlInitializationSqlScript: string | null = null;

beforeAll(async () => {
	postgresqlInitializationSqlScript = await fs.readFile(
		testsConfig.TESTS_POSTGRESQL_INITIALIZATION_SQL_SCRIPT_PATH,
		"utf-8"
	);
});

beforeEach(async () => {
	if (!postgresqlInitializationSqlScript) {
		throw new Error("Database initialization SQL is not initialized");
	}
	const postgresqlContainerPassword = TestsUtils.generatePostgresqlPassword();

	const postgresqlContainer = await new Testcontainers.PostgreSqlContainer(
		testsConfig.TESTS_POSTGRESQL_CONTAINER_IMAGE_NAME
	)
		.withPassword(postgresqlContainerPassword)
		.withEnvironment({"PGPASSWORD": postgresqlContainerPassword})
		.withDatabase(testsConfig.TESTS_POSTGRESQL_CONTAINER_DATABASE_NAME)
		.start();

	await postgresqlContainer.exec([
		"psql",
		`--host=localhost`,
		`--port=5432`,
		`--username=${postgresqlContainer.getUsername()}`,
		`--dbname=${postgresqlContainer.getDatabase()}`,
		`--no-password`,
		`--command`,
		`${postgresqlInitializationSqlScript}`,
	]);

	const AppConfigModule = TypedConfigModule.forRoot({
		schema: AppConfig,
		load: () => {
			if (!postgresqlContainer) {
				throw new Error("PostgreSQL container is not initialized");
			}
			return {
				POSTGRES_HOST: postgresqlContainer.getHost(),
				POSTGRES_PORT: postgresqlContainer.getPort(),
				POSTGRES_USERNAME: postgresqlContainer.getUsername(),
				POSTGRES_PASSWORD: postgresqlContainer.getPassword(),
				POSTGRES_DATABASE: postgresqlContainer.getDatabase(),
			};
		},
	});
	const appModule = await Test.createTestingModule({
		imports: [AppOrmModule, AppConfigModule, ProductsModule],
	}).compile();

	app = appModule.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
	app.enableVersioning({
		type: VersioningType.URI,
	});
	await app.init();
	await app.getHttpAdapter().getInstance().ready();
}, testsConfig.TESTS_INTEGRATION_TEST_BEFORE_EACH_TIMEOUT * 1000);

afterEach(async () => {
	if (postgresqlContainer) {
		await postgresqlContainer.stop();
	}
	if (app) {
		await app.close();
	}
});

describe("ProductsModule", () => {
	describe("v1", () => {
		describe("Empty database", () => {
			test("GET /cats", async () => {
				if (!app) {
					throw new Error("App is not initialized");
				}
				const response = await app.inject({
					method: "GET",
					url: "/v1/products",
				});
				expect(response.statusCode).toBe(200);
				expect(response.json()).toEqual({
					data: [],
					meta: {skip: 0, take: 10, totalItemsCount: 0, pageItemsCount: 0},
				});
			});
		});
		describe("Database with one product", () => {
			let addedProductId: string | null = null;
			beforeEach(async () => {
				if (!app) {
					throw new Error("App is not initialized");
				}
				const someProductRequestBody: Readonly<AddProductRequestBody> = {
					name: "Some product",
					slug: "some-product",
					mass: 100,
				};
				const ADMIN_TOKEN = "4dm1nT0k3n";
				const response = await app.inject({
					method: "POST",
					url: "/v1/products",
					headers: {
						Authorization: `Bearer ${ADMIN_TOKEN}`,
						"content-type": "application/json",
					},
					payload: someProductRequestBody,
				});
				addedProductId = response.json().data.id;
			});
			test("GET /products", async () => {
				if (!app) {
					throw new Error("App is not initialized");
				}
				if (addedProductId === null) {
					throw new Error("Added product ID is not initialized");
				}
				const response = await app.inject({
					method: "GET",
					url: "/v1/products",
				});
				expect(response.statusCode).toBe(200);
				expect(response.json()).toEqual({
					data: [
						{
							id: addedProductId,
							name: "Some product",
							slug: "some-product",
							mass: 100,
							volume: null,
						},
					],
					meta: {skip: 0, take: 10, totalItemsCount: 1, pageItemsCount: 1},
				});
			});
			test("GET /products/:product-id", async () => {
				if (!app) {
					throw new Error("App is not initialized");
				}
				if (addedProductId === null) {
					throw new Error("Added product ID is not initialized");
				}
				const response = await app.inject({
					method: "GET",
					url: `/v1/products/${addedProductId}`,
				});
				expect(response.statusCode).toBe(200);
				expect(response.json()).toEqual({
					data: {
						id: addedProductId,
						name: "Some product",
						slug: "some-product",
						mass: 100,
						volume: null,
					},
				});
			});
		});
	});
});
