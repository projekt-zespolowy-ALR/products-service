import {testsConfig} from "../../config/index.js";

import {describe, test, expect, beforeEach, afterEach} from "@jest/globals";
import AddProductRequestBody from "../../../src/features/products/products_controller/AddProductRequestBody.js";
import {
	EmptyTestingEnvironment,
	type TestingEnvironment,
} from "../../utils/testing_environment/index.js";

let testingEnvironment: TestingEnvironment = new EmptyTestingEnvironment();

beforeEach(async () => {}, testsConfig.TESTS_INTEGRATION_TEST_BEFORE_EACH_TIMEOUT * 1000);

afterEach(async () => {});

describe("ProductsModule", () => {
	describe("v1", () => {
		describe("Empty database", () => {
			test("GET /cats", async () => {
				const response = await testingEnvironment.app.inject({
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
				const someProductRequestBody: Readonly<AddProductRequestBody> = {
					name: "Some product",
					slug: "some-product",
					mass: 100,
				};
				const ADMIN_TOKEN = "4dm1nT0k3n";
				const response = await testingEnvironment.app.inject({
					method: "POST",
					url: "/v1/products",
					headers: {
						Authorization: `Bearer ${ADMIN_TOKEN}`,
						"content-type": "application/json",
					},
					payload: someProductRequestBody,
				});
				addedProductId = response.json().id;
			});
			test("GET /products", async () => {
				if (addedProductId === null) {
					throw new Error("Added product ID is not initialized");
				}
				const response = await testingEnvironment.app.inject({
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
							categoriesIds: [],
							inDataSourcesIds: [],
						},
					],
					meta: {skip: 0, take: 10, totalItemsCount: 1, pageItemsCount: 1},
				});
			});
			test("GET /products/:product-id", async () => {
				if (addedProductId === null) {
					throw new Error("Added product ID is not initialized");
				}
				const response = await testingEnvironment.app.inject({
					method: "GET",
					url: `/v1/products/${addedProductId}`,
				});
				expect(response.statusCode).toBe(200);
				expect(response.json()).toEqual({
					id: addedProductId,
					name: "Some product",
					slug: "some-product",
					mass: 100,
					volume: null,
					categoriesIds: [],
					inDataSourcesIds: [],
				});
			});
		});
	});
});
