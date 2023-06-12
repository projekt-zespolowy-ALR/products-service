import {Test} from "@nestjs/testing";
import {describe, test, expect, beforeEach, afterEach, beforeAll} from "@jest/globals";
import type {NestFastifyApplication} from "@nestjs/platform-fastify";
import * as Testcontainers from "testcontainers";

import {TypedConfigModule} from "nest-typed-config";
import * as Fs from "fs/promises";
import testsConfig from "../../../app_config/testsConfig.js";
import generatePostgresqlPassword from "../../../utils/generatePostgresqlPassword.js";
import AppConfig from "../../../../src/app_config/AppConfig.js";
import FeaturesModule from "../../../../src/features/FeaturesModule.js";
import AppOrmModule from "../../../../src/app_orm/AppOrmModule.js";
import createTestingApp from "../../../utils/createTestingApp.js";

describe("OffersOfProductModule", () => {
	let postgresqlContainer: Testcontainers.StartedPostgreSqlContainer;
	let app: NestFastifyApplication;
	let postgresqlInitializationSqlScript: string;

	beforeAll(async () => {
		postgresqlInitializationSqlScript = await Fs.readFile(
			testsConfig.TESTS_POSTGRESQL_INITIALIZATION_SQL_SCRIPT_PATH,
			"utf-8"
		);
	});

	beforeEach(async () => {
		const postgresqlContainerPassword = generatePostgresqlPassword();

		postgresqlContainer = await new Testcontainers.PostgreSqlContainer(
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
			load: () => ({
				USERS_MICROSERVICE_BASE_URL: "https://users-microservice",
				POSTGRES_HOST: postgresqlContainer.getHost(),
				POSTGRES_PORT: postgresqlContainer.getPort(),
				POSTGRES_USERNAME: postgresqlContainer.getUsername(),
				POSTGRES_PASSWORD: postgresqlContainer.getPassword(),
				POSTGRES_DATABASE: postgresqlContainer.getDatabase(),
			}),
		});
		const appModule = await Test.createTestingModule({
			imports: [FeaturesModule, AppOrmModule, AppConfigModule],
		}).compile();

		app = await createTestingApp(appModule);
	}, testsConfig.TESTS_INTEGRATION_TEST_BEFORE_EACH_TIMEOUT * 1000);

	afterEach(async () => {
		await Promise.all([postgresqlContainer.stop(), app.close()]);
	});
	describe("v1", () => {
		describe("GET /products/:productId/offers", () => {
			describe("if product with specified id exists, but has no offers", () => {
				const injectTestProduct = async () => {
					const addBrandRequestBody = {
						slug: "test",
						name: "test",
					} as const;
					const brand = (
						await app.inject({
							method: "POST",
							url: "/v1/brands",
							payload: addBrandRequestBody,
						})
					).json();

					const addProductRequestBody = {
						brandId: brand.id,
						slug: "test2",
						name: "test2",
						massKilograms: 0.5,
						volumeLiters: 0.5,
					} as const;

					const response = await app.inject({
						method: "POST",
						url: "/v1/products",
						payload: addProductRequestBody,
					});
					return response.json();
				};
				test("should return 200 HTTP status code and empty array", async () => {
					const product = await injectTestProduct();
					const response = await app.inject({
						method: "GET",
						url: `/v1/products/${product.id}/offers`,
					});

					expect(response.statusCode).toBe(200);
					expect(JSON.parse(response.body)).toStrictEqual([]);
				});
			});
		});
		describe("POST /products/:productId/offers", () => {
			describe("if product with specified id exists, data source is valid and product has no offers and body is valid", () => {
				const injectTestProduct = async () => {
					const addBrandRequestBody = {
						slug: "test",
						name: "test",
					} as const;
					const brand = (
						await app.inject({
							method: "POST",
							url: "/v1/brands",
							payload: addBrandRequestBody,
						})
					).json();

					const addProductRequestBody = {
						brandId: brand.id,
						slug: "test2",
						name: "test2",
						massKilograms: 0.5,
						volumeLiters: 0.5,
					} as const;

					const response = await app.inject({
						method: "POST",
						url: "/v1/products",
						payload: addProductRequestBody,
					});
					return response.json();
				};
				const injectTestDataSource = async () => {
					const addDataSourceRequestBody = {
						name: "test",
						slug: "test",
						url: "https://test.com",
					} as const;

					const response = await app.inject({
						method: "POST",
						url: "/v1/data-sources",
						payload: addDataSourceRequestBody,
					});
					return response.json();
				};
				test("should return 200 HTTP status code and created offer", async () => {
					const [product, dataSource] = await Promise.all([
						injectTestProduct(),
						injectTestDataSource(),
					]);
					const addOfferRequestBody = {
						referenceUrl: "https://test.com",
						imageUrl: "https://test.com",
						description: "test",
						pricePlnAsString: "1.00",
					} as const;

					const response = await app.inject({
						method: "PUT",
						url: `/v1/products/${product.id}/offers/${dataSource.id}`,
						payload: addOfferRequestBody,
					});

					console.log(response);

					expect(response.statusCode).toBe(200);
					expect(JSON.parse(response.body)).toStrictEqual({
						productId: product.id,
						dataSourceId: dataSource.id,
						referenceUrl: "https://test.com",
						imageUrl: "https://test.com",
						description: "test",
						pricePlnAsString: "1.00",
					});
				});
			});
		});
	});
});
