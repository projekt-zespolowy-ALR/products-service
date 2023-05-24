import {Test} from "@nestjs/testing";
import {describe, test, expect, beforeEach, afterEach, beforeAll} from "@jest/globals";
import type {NestFastifyApplication} from "@nestjs/platform-fastify";
import * as Testcontainers from "testcontainers";
import AppOrmModule from "../../../src/app_orm/AppOrmModule.js";
import AppConfig from "../../../src/app_config/AppConfig.js";
import {TypedConfigModule} from "nest-typed-config";
import * as Fs from "fs/promises";

import testsConfig from "../../app_config/testsConfig.js";
import generatePostgresqlPassword from "../../utils/generatePostgresqlPassword.js";
import createTestingApp from "../../utils/createTestingApp.js";
import FeaturesModule from "../../../src/features/FeaturesModule.js";
import type {User} from "../../../src/features/users_microservice_client/User.js";
import UsersMicroserviceClientUserWithGivenIdNotFoundError from "../../../src/features/users_microservice_client/UsersMicroserviceClientUserWithGivenIdNotFoundError.js";
import UsersMicroserviceClient from "../../../src/features/users_microservice_client/UsersMicroserviceClient.js";
import type Product from "../../../src/features/products/products_controller/Product.js";
import type Brand from "../../../src/features/brands/brands_controller/Brand.js";
import type CreateBrandRequestBody from "../../../src/features/brands/brands_controller/CreateBrandRequestBody.js";

describe("UserFavoriteProductsModule", () => {
	let postgresqlContainer: Testcontainers.StartedPostgreSqlContainer;
	let app: NestFastifyApplication;
	let postgresqlInitializationSqlScript: string;

	beforeAll(async () => {
		postgresqlInitializationSqlScript = await Fs.readFile(
			testsConfig.TESTS_POSTGRESQL_INITIALIZATION_SQL_SCRIPT_PATH,
			"utf-8"
		);
	});

	let usersMicroserviceClientMock: UsersMicroserviceClient = {
		async getUserById(userId: string): Promise<User> {
			throw new UsersMicroserviceClientUserWithGivenIdNotFoundError(userId);
		},
	} as UsersMicroserviceClient;

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
		})
			.overrideProvider(UsersMicroserviceClient)
			.useValue(usersMicroserviceClientMock)
			.compile();

		app = await createTestingApp(appModule);
	}, testsConfig.TESTS_INTEGRATION_TEST_BEFORE_EACH_TIMEOUT * 1000);

	afterEach(async () => {
		await Promise.all([postgresqlContainer.stop(), app.close()]);
	});
	describe("v1", () => {
		describe("Empty database, user exists in users microservice", () => {
			describe("PUT /users/[userId]/favorite-products/[productId]", () => {
				const userId = "f6e78687-5049-462a-bfd5-66e35a622977";
				const productId = "f6e78687-5049-462a-bfd5-66e35a622977";
				test("Should return 404 (product not found)", async () => {
					usersMicroserviceClientMock.getUserById = async function (): Promise<User> {
						return Promise.resolve({
							id: userId,
							username: "username",
							avatarUrl:
								"https://static.wikia.nocookie.net/james-camerons-avatar/images/7/7c/Neytiri_infoboks.png/revision/latest",
						});
					};

					const response = await app.inject({
						method: "PUT",
						url: `/v1/users/${userId}/favorite-products/${productId}`,
					});
					expect(response.statusCode).toBe(404);
					expect(response.json()).toEqual({
						error: "Not Found",
						message: `Product with id "${productId}" not found.`,
						statusCode: 404,
					});
				});
			});
			describe("GET /users/[userId]/favorite-products", () => {
				const userId = "f6e78687-5049-462a-bfd5-66e35a622977";
				test("Should return 200 and an empty page", async () => {
					usersMicroserviceClientMock.getUserById = async function (): Promise<User> {
						return Promise.resolve({
							id: userId,
							username: "username",
							avatarUrl:
								"https://static.wikia.nocookie.net/james-camerons-avatar/images/7/7c/Neytiri_infoboks.png/revision/latest",
						});
					};

					const response = await app.inject({
						method: "GET",
						url: `/v1/users/${userId}/favorite-products`,
					});
					expect(response.statusCode).toBe(200);
					expect(response.json()).toEqual({
						items: [],
						meta: {skip: 0, take: 10, totalItemsCount: 0, pageItemsCount: 0},
					});
				});
			});
		});
		describe("Empty database, user does not exist in users microservice", () => {
			describe("PUT /users/[userId]/favorite-products/[productId]", () => {
				const userId = "f6e78687-5049-462a-bfd5-66e35a622977";
				const productId = "f6e78687-5049-462a-bfd5-66e35a622977";
				test("Should return 404 (user not found)", async () => {
					usersMicroserviceClientMock.getUserById = async function (): Promise<User> {
						throw new UsersMicroserviceClientUserWithGivenIdNotFoundError(userId);
					};

					const response = await app.inject({
						method: "PUT",
						url: `/v1/users/${userId}/favorite-products/${productId}`,
					});
					expect(response.statusCode).toBe(404);
					expect(response.json()).toEqual({
						error: "Not Found",
						message: `User with id "${userId}" not found.`,
						statusCode: 404,
					});
				});
			});

			describe("GET /users/[userId]/favorite-products", () => {
				const userId = "f6e78687-5049-462a-bfd5-66e35a622977";
				test("Should return 404 (user not found)", async () => {
					usersMicroserviceClientMock.getUserById = async function (): Promise<User> {
						throw new UsersMicroserviceClientUserWithGivenIdNotFoundError(userId);
					};

					const response = await app.inject({
						method: "GET",
						url: `/v1/users/${userId}/favorite-products`,
					});
					expect(response.statusCode).toBe(404);
					expect(response.json()).toEqual({
						error: "Not Found",
						message: `User with id "${userId}" not found.`,
						statusCode: 404,
					});
				});
			});
		});

		describe("Three liked products", () => {
			const addAndLikeProducts = async (userId: string) => {
				const addBrandRequestBody: CreateBrandRequestBody = {
					name: "name",
					slug: "slug",
				};
				const addedBrand = (
					await app.inject({
						method: "POST",
						url: "/v1/brands",
						payload: addBrandRequestBody,
					})
				).json() as Brand;
				const addedProducts = (await Promise.all(
					Array(3)
						.fill(null)
						.map(async (_, i) => {
							const response = await app.inject({
								method: "POST",
								url: "/v1/products",
								payload: {
									brandId: addedBrand.id,
									massKilograms: 1,
									volumeLiters: 1,
									name: "name",
									slug: `slug${i}`,
								},
							});
							expect(response.statusCode).toBe(201);
							return response.json();
						})
				)) as unknown as Product[];

				await Promise.all(
					addedProducts.map(async (product) => {
						const response = await app.inject({
							method: "PUT",
							url: `/v1/users/${userId}/favorite-products/${product.id}`,
						});
						expect(response.statusCode).toBe(200);
					})
				);

				return addedProducts;
			};

			describe("GET /users/[userId]/favorite-products", () => {
				const userId = "ac9bd64c-5260-4044-a113-0e7d9fb32e1f";
				test("Should return 200 and a page with 3 products", async () => {
					usersMicroserviceClientMock.getUserById = async function (): Promise<User> {
						return Promise.resolve({
							id: userId,
							username: "username",
							avatarUrl:
								"https://static.wikia.nocookie.net/james-camerons-avatar/images/7/7c/Neytiri_infoboks.png/revision/latest",
						});
					};

					const addedProducts = await addAndLikeProducts(userId);

					const response = await app.inject({
						method: "GET",
						url: `/v1/users/${userId}/favorite-products`,
					});
					expect(response.statusCode).toBe(200);
					expect(response.json()).toEqual({
						items: expect.arrayContaining(addedProducts),
						meta: {skip: 0, take: 10, totalItemsCount: 3, pageItemsCount: 3},
					});
					expect(response.json().items.length).toBe(3);
				});
			});
		});
	});
});
