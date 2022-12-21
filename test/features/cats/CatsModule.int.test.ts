import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({path: path.join(__dirname, ".env.test")});
import {Test} from "@nestjs/testing";
import {VersioningType} from "@nestjs/common";
import {describe, test, expect} from "@jest/globals";
import {FastifyAdapter, NestFastifyApplication} from "@nestjs/platform-fastify";
import {CatEntity, CatsModule} from "../../../src/features/cats/index.js";
import {getRepositoryToken} from "@nestjs/typeorm";

describe("HelloModule", () => {
	describe("v2", () => {
		describe("Empty database", () => {
			test("GET /cats", async () => {
				const catsRepositoryMock = {
					findAndCount() {
						return Promise.resolve([[], 0]);
					},
				};
				const appModule = await Test.createTestingModule({
					imports: [CatsModule],
				})
					.overrideProvider(getRepositoryToken(CatEntity))
					.useValue(catsRepositoryMock)
					.compile();

				const app = appModule.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
				app.enableVersioning({
					type: VersioningType.URI,
				});
				await app.init();
				await app.getHttpAdapter().getInstance().ready();

				const response = await app.inject({
					method: "GET",
					url: "/v2/cats",
				});
				expect(response.statusCode).toBe(200);
				expect(response.json()).toEqual({
					data: [],
					meta: {skip: 0, take: 10, totalItemsCount: 0, pageItemsCount: 0},
				});
			});
			test("GET /cats/:id", async () => {
				const catsRepositoryMock = {
					findOne() {
						return Promise.resolve(undefined);
					},
				};
				const appModule = await Test.createTestingModule({
					imports: [CatsModule],
				})
					.overrideProvider(getRepositoryToken(CatEntity))
					.useValue(catsRepositoryMock)
					.compile();

				const app = appModule.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
				app.enableVersioning({
					type: VersioningType.URI,
				});
				await app.init();
				await app.getHttpAdapter().getInstance().ready();

				const response = await app.inject({
					method: "GET",
					url: "/v2/cats/1",
				});
				expect(response.statusCode).toBe(404);
			});
			test("POST /cats", async () => {
				const catsRepositoryMock = {
					save() {
						return Promise.resolve(undefined);
					},
				};
				const appModule = await Test.createTestingModule({
					imports: [CatsModule],
				})
					.overrideProvider(getRepositoryToken(CatEntity))
					.useValue(catsRepositoryMock)
					.compile();

				const app = appModule.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
				app.enableVersioning({
					type: VersioningType.URI,
				});
				await app.init();
				await app.getHttpAdapter().getInstance().ready();

				const response = await app.inject({
					method: "POST",
					url: "/v2/cats",
					payload: {
						name: "test",
						age: 1,
						breed: "test",
					},
				});
				expect(response.statusCode).toBe(201);
			});
		});
		describe("Database with one cat", () => {
			test("GET /cats", async () => {
				const catsRepositoryMock = {
					data: [
						{
							id: 1,
							name: "test",
							age: 1,
							breed: "test",
						},
					],
					findAndCount() {
						return Promise.resolve([this.data, this.data.length]);
					},
				};
				const appModule = await Test.createTestingModule({
					imports: [CatsModule],
				})
					.overrideProvider(getRepositoryToken(CatEntity))
					.useValue(catsRepositoryMock)
					.compile();

				const app = appModule.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
				app.enableVersioning({
					type: VersioningType.URI,
				});
				await app.init();
				await app.getHttpAdapter().getInstance().ready();

				const response = await app.inject({
					method: "GET",
					url: "/v2/cats",
				});
				expect(response.statusCode).toBe(200);
				expect(response.json()).toEqual({
					data: [
						{
							id: 1,
							name: "test",
							age: 1,
							breed: "test",
						},
					],
					meta: {skip: 0, take: 10, totalItemsCount: 1, pageItemsCount: 1},
				});
			});
		});
	});
});
