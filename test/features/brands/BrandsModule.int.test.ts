import {describe, test, expect, beforeEach, afterEach, beforeAll} from "@jest/globals";
import generatePostgresqlPassword from "../../utils/generatePostgresqlPassword.js";
import {Test} from "@nestjs/testing";
import type {NestFastifyApplication} from "@nestjs/platform-fastify";
import * as Testcontainers from "testcontainers";
import AppOrmModule from "../../../src/orm/AppOrmModule.js";
import AppConfig from "../../../src/app_config/AppConfig.js";
import {TypedConfigModule} from "nest-typed-config";
import * as Fs from "fs/promises";

import testsConfig from "../../app_config/testsConfig.js";
import createTestingApp from "../../utils/createTestingApp.js";
import CategoriesModule from "../../../src/features/categories/categories_module/CategoriesModule.js";
import AddBrandRequestBody from "../../../src/features/brands/brands_controller/AddBrandRequestBody.js";

describe("BrandsModule", () => {
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
				POSTGRES_HOST: postgresqlContainer.getHost(),
				POSTGRES_PORT: postgresqlContainer.getPort(),
				POSTGRES_USERNAME: postgresqlContainer.getUsername(),
				POSTGRES_PASSWORD: postgresqlContainer.getPassword(),
				POSTGRES_DATABASE: postgresqlContainer.getDatabase(),
			}),
		});
		const appModule = await Test.createTestingModule({
			imports: [CategoriesModule, AppOrmModule, AppConfigModule],
		}).compile();

		app = await createTestingApp(appModule);
	}, testsConfig.TESTS_INTEGRATION_TEST_BEFORE_EACH_TIMEOUT * 1000);

	afterEach(async () => {
		await Promise.all([postgresqlContainer.stop(), app.close()]);
	});
	describe("v1", () => {
		describe("Empty database", () => {
			test("Get all brands", async () => {
				const response = await app.inject({
					method: "GET",
					url: "/v1/brands",
				});
				expect(response.statusCode).toBe(200);
				expect(response.json()).toEqual({
					data: [],
					meta: {skip: 0, take: 10, totalItemsCount: 0, pageItemsCount: 0},
				});
			});
			test("Add one brand", async () => {
				const someBrandRequestBody: AddBrandRequestBody = {
					name: "Some brand",
					slug: "some-brand",
				} as const;
				const response = await app.inject({
					method: "POST",
					url: "/v1/brands",
					headers: {
						"content-type": "application/json",
					},
					payload: someBrandRequestBody,
				});
				expect(response.statusCode).toBe(201);
				expect(response.json()).toEqual({
					id: expect.stringMatching(
						/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
					),
					name: "Some brand",
					slug: "some-brand",
				});
			});
			test("Add one brand and check if it is in the database", async () => {
				const someBrandRequestBody: AddBrandRequestBody = {
					name: "Some brand",
					slug: "some-brand",
				} as const;
				await app.inject({
					method: "POST",
					url: "/v1/brands",
					headers: {
						"content-type": "application/json",
					},
					payload: someBrandRequestBody,
				});

				const response2 = await app.inject({
					method: "GET",
					url: "/v1/brands",
				});
				expect(response2.statusCode).toBe(200);
				expect(response2.json()).toEqual({
					data: [
						{
							id: expect.stringMatching(
								/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
							),
							name: "Some brand",
							slug: "some-brand",
						},
					],
					meta: {skip: 0, take: 10, totalItemsCount: 1, pageItemsCount: 1},
				});
			});
			test("Get non existing brand by id should return 404", async () => {
				const response = await app.inject({
					method: "GET",
					url: "/v1/brands/af7c1fe6-d669-414e-b066-e9733f0de7a8",
				});
				expect(response.statusCode).toBe(404);
			});
			test("Get non existing brand by slug should return 404", async () => {
				const response = await app.inject({
					method: "GET",
					url: "/v1/brands-by-slug/some-brand",
				});
				expect(response.statusCode).toBe(404);
			});
			test("Delete added brand", async () => {
				const someBrandRequestBody: AddBrandRequestBody = {
					name: "Some brand",
					slug: "some-brand",
				} as const;
				const response = await app.inject({
					method: "POST",
					url: "/v1/brands",
					headers: {
						"content-type": "application/json",
					},
					payload: someBrandRequestBody,
				});
				const brandId = response.json().id;

				const response2 = await app.inject({
					method: "DELETE",
					url: `/v1/brands/${brandId}`,
				});
				expect(response2.statusCode).toBe(204);
			});
			test("Update added brand", async () => {
				const someBrandRequestBody: AddBrandRequestBody = {
					name: "Some brand",
					slug: "some-brand",
				} as const;
				const response = await app.inject({
					method: "POST",
					url: "/v1/brands",
					headers: {
						"content-type": "application/json",
					},
					payload: someBrandRequestBody,
				});
				const brandId = response.json().id;

				const newBrandRequestBody: AddBrandRequestBody = {
					name: "Some brand updated",
					slug: "some-brand-updated",
				} as const;
				const response2 = await app.inject({
					method: "PUT",
					url: `/v1/brands/${brandId}`,
					headers: {
						"content-type": "application/json",
					},
					payload: newBrandRequestBody,
				});
				expect(response2.statusCode).toBe(200);
				expect(response2.json()).toEqual({
					id: brandId,
					name: "Some brand updated",
					slug: "some-brand-updated",
				});
			});
			test("Get added brand by id", async () => {
				const someBrandRequestBody: AddBrandRequestBody = {
					name: "Some brand",
					slug: "some-brand",
				} as const;
				const response = await app.inject({
					method: "POST",
					url: "/v1/brands",
					headers: {
						"content-type": "application/json",
					},
					payload: someBrandRequestBody,
				});
				const brandId = response.json().id;

				const response2 = await app.inject({
					method: "GET",
					url: `/v1/brands/${brandId}`,
				});
				expect(response2.statusCode).toBe(200);
				expect(response2.json()).toEqual({
					id: brandId,
					name: "Some brand",
					slug: "some-brand",
				});
			});
			test("Get added brand by slug", async () => {
				const someBrandRequestBody: AddBrandRequestBody = {
					name: "Some brand",
					slug: "some-brand",
				} as const;
				const response = await app.inject({
					method: "POST",
					url: "/v1/brands",
					headers: {
						"content-type": "application/json",
					},
					payload: someBrandRequestBody,
				});
				const brandId = response.json().id;

				const response2 = await app.inject({
					method: "GET",
					url: `/v1/brands-by-slug/some-brand`,
				});
				expect(response2.statusCode).toBe(200);
				expect(response2.json()).toEqual({
					id: brandId,
					name: "Some brand",
					slug: "some-brand",
				});
			});
		});
	});
});
