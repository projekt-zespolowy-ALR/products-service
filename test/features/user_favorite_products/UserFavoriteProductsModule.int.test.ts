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
		});
	});
});
