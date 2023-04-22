import {describe, test, expect, beforeEach, afterEach, beforeAll} from "@jest/globals";
import type AddCategoryRequestBody from "../../../src/features/categories/categories_controller/AddCategoryRequestBody.js";
import type AddCategoryPayload from "../../../src/features/categories/types/AddCategoryPayload.js";
import AddProductRequestBody from "../../../src/features/products/products_controller/AddProductRequestBody.js";
import generatePostgresqlPassword from "../../utils/generatePostgresqlPassword.js";
import {Test} from "@nestjs/testing";
import type {NestFastifyApplication} from "@nestjs/platform-fastify";
import * as Testcontainers from "testcontainers";
import AppOrmModule from "../../../src/app_orm/AppOrmModule.js";
import AppConfig from "../../../src/app_config/AppConfig.js";
import {TypedConfigModule} from "nest-typed-config";
import * as Fs from "fs/promises";

import testsConfig from "../../app_config/testsConfig.js";
import createTestingApp from "../../utils/createTestingApp.js";
import CategoriesModule from "../../../src/features/categories/categories_module/CategoriesModule.js";

describe("CategoriesModule", () => {
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
			test("Get all categories", async () => {
				const response = await app.inject({
					method: "GET",
					url: "/v1/categories",
				});
				expect(response.statusCode).toBe(200);
				expect(response.json()).toEqual({
					data: [],
					meta: {skip: 0, take: 10, totalItemsCount: 0, pageItemsCount: 0},
				});
			});
			test("Add one category", async () => {
				const someCategoryRequestBody: AddCategoryRequestBody = {
					name: "Some category",
					slug: "some-category",
				} as const;
				const response = await app.inject({
					method: "POST",
					url: "/v1/categories",
					headers: {
						"content-type": "application/json",
					},
					payload: someCategoryRequestBody,
				});
				expect(response.statusCode).toBe(201);
				expect(response.json()).toEqual({
					id: expect.stringMatching(
						/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
					),
					name: "Some category",
					slug: "some-category",
				});
			});
			test("Add one category and check if it is in the database", async () => {
				const someCategoryRequestBody: AddCategoryRequestBody = {
					name: "Some category",
					slug: "some-category",
				} as const;
				await app.inject({
					method: "POST",
					url: "/v1/categories",
					headers: {
						"content-type": "application/json",
					},
					payload: someCategoryRequestBody,
				});

				const response2 = await app.inject({
					method: "GET",
					url: "/v1/categories",
				});
				expect(response2.statusCode).toBe(200);
				expect(response2.json()).toEqual({
					data: [
						{
							id: expect.stringMatching(
								/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
							),
							name: "Some category",
							slug: "some-category",
						},
					],
					meta: {skip: 0, take: 10, totalItemsCount: 1, pageItemsCount: 1},
				});
			});
			test("Get non existing category by id should return 404", async () => {
				const response = await app.inject({
					method: "GET",
					url: "/v1/categories/af7c1fe6-d669-414e-b066-e9733f0de7a8",
				});
				expect(response.statusCode).toBe(404);
			});
			test("Get non existing category by slug should return 404", async () => {
				const response = await app.inject({
					method: "GET",
					url: "/v1/categories-by-slug/some-category",
				});
				expect(response.statusCode).toBe(404);
			});
			test("Delete added category", async () => {
				const someCategoryRequestBody: AddCategoryRequestBody = {
					name: "Some category",
					slug: "some-category",
				} as const;
				const response = await app.inject({
					method: "POST",
					url: "/v1/categories",
					headers: {
						"content-type": "application/json",
					},
					payload: someCategoryRequestBody,
				});
				const categoryId = response.json().id;

				const response2 = await app.inject({
					method: "DELETE",
					url: `/v1/categories/${categoryId}`,
				});
				expect(response2.statusCode).toBe(204);
			});
			test("Update added category", async () => {
				const someCategoryRequestBody: AddCategoryRequestBody = {
					name: "Some category",
					slug: "some-category",
				} as const;
				const response = await app.inject({
					method: "POST",
					url: "/v1/categories",
					headers: {
						"content-type": "application/json",
					},
					payload: someCategoryRequestBody,
				});
				const categoryId = response.json().id;

				const newCategoryRequestBody: AddCategoryRequestBody = {
					name: "Some category updated",
					slug: "some-category-updated",
				} as const;
				const response2 = await app.inject({
					method: "PUT",
					url: `/v1/categories/${categoryId}`,
					headers: {
						"content-type": "application/json",
					},
					payload: newCategoryRequestBody,
				});
				expect(response2.statusCode).toBe(200);
				expect(response2.json()).toEqual({
					id: categoryId,
					name: "Some category updated",
					slug: "some-category-updated",
				});
			});
			test("Get added category by id", async () => {
				const someCategoryRequestBody: AddCategoryRequestBody = {
					name: "Some category",
					slug: "some-category",
				} as const;
				const response = await app.inject({
					method: "POST",
					url: "/v1/categories",
					headers: {
						"content-type": "application/json",
					},
					payload: someCategoryRequestBody,
				});
				const categoryId = response.json().id;

				const response2 = await app.inject({
					method: "GET",
					url: `/v1/categories/${categoryId}`,
				});
				expect(response2.statusCode).toBe(200);
				expect(response2.json()).toEqual({
					id: categoryId,
					name: "Some category",
					slug: "some-category",
				});
			});
			test("Get added category by slug", async () => {
				const someCategoryRequestBody: AddCategoryRequestBody = {
					name: "Some category",
					slug: "some-category",
				} as const;
				const response = await app.inject({
					method: "POST",
					url: "/v1/categories",
					headers: {
						"content-type": "application/json",
					},
					payload: someCategoryRequestBody,
				});
				const categoryId = response.json().id;

				const response2 = await app.inject({
					method: "GET",
					url: `/v1/categories-by-slug/some-category`,
				});
				expect(response2.statusCode).toBe(200);
				expect(response2.json()).toEqual({
					id: categoryId,
					name: "Some category",
					slug: "some-category",
				});
			});
		});
		describe("Database with some products assigned to different categories", () => {
			test("Get products assigned to category", async () => {
				const someCategory1: AddCategoryPayload = {
					name: "Some category 1",
					slug: "some-category-1",
				} as const;
				const someCategory2: AddCategoryPayload = {
					name: "Some category 2",
					slug: "some-category-2",
				} as const;
				const someCategory1Id = (
					await app.inject({
						method: "POST",
						url: "/v1/categories",
						headers: {
							"content-type": "application/json",
						},
						payload: someCategory1,
					})
				).json().id;
				const someCategory2Id = (
					await app.inject({
						method: "POST",
						url: "/v1/categories",
						headers: {
							"content-type": "application/json",
						},
						payload: someCategory2,
					})
				).json().id;
				const someProduct1: AddProductRequestBody = {
					name: "Some product 1",
					slug: "some-product-1",
					categoriesIds: [someCategory1Id],
					ingredientsIds: undefined,
				} as const;
				const someProduct2: AddProductRequestBody = {
					name: "Some product 2",
					slug: "some-product-2",
					categoriesIds: [someCategory2Id],
					ingredientsIds: undefined,
				} as const;
				const responseSomeProduct1 = await app.inject({
					method: "POST",
					url: "/v1/products",
					headers: {
						"content-type": "application/json",
					},
					payload: someProduct1,
				});
				const addedProduct1 = responseSomeProduct1.json();
				await app.inject({
					method: "POST",
					url: "/v1/products",
					headers: {
						"content-type": "application/json",
					},
					payload: someProduct2,
				});
				const response = await app.inject({
					method: "GET",
					url: `/v1/categories/${someCategory1Id}/products`,
				});
				expect(response.statusCode).toBe(200);
				expect(response.json()).toEqual({
					data: [
						expect.objectContaining({
							id: addedProduct1.id,
							name: addedProduct1.name,
							slug: addedProduct1.slug,
							categoriesIds: [someCategory1Id],
						}),
					],
					meta: {skip: 0, take: 10, totalItemsCount: 1, pageItemsCount: 1},
				});
			});
		});
	});
});
