import {describe, test, expect, beforeEach, afterEach} from "@jest/globals";
import type AddBrandRequestBody from "../../../src/features/brands/brands_controller/AddBrandRequestBody.js";
import testsConfig from "../../config/testsConfig.js";
import AppTestingEnvironment from "../../utils/testing_environment/AppTestingEnvironment.js";
import EmptyTestingEnvironment from "../../utils/testing_environment/EmptyTestingEnvironment.js";
import TestingEnvironment from "../../utils/testing_environment/TestingEnvironment.js";

let testingEnvironment: TestingEnvironment = new EmptyTestingEnvironment();

beforeEach(async () => {
	testingEnvironment = new AppTestingEnvironment();
	await testingEnvironment.start();
}, testsConfig.TESTS_INTEGRATION_TEST_BEFORE_EACH_TIMEOUT * 1000);

afterEach(async () => {
	await testingEnvironment.stop();
});

describe("BrandsModule", () => {
	describe("v1", () => {
		describe("Empty database", () => {
			test("Get all brands", async () => {
				const response = await testingEnvironment.app.inject({
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
				const response = await testingEnvironment.app.inject({
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
				await testingEnvironment.app.inject({
					method: "POST",
					url: "/v1/brands",
					headers: {
						"content-type": "application/json",
					},
					payload: someBrandRequestBody,
				});

				const response2 = await testingEnvironment.app.inject({
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
				const response = await testingEnvironment.app.inject({
					method: "GET",
					url: "/v1/brands/af7c1fe6-d669-414e-b066-e9733f0de7a8",
				});
				expect(response.statusCode).toBe(404);
			});
			test("Get non existing brand by slug should return 404", async () => {
				const response = await testingEnvironment.app.inject({
					method: "GET",
					url: "/v1/brand-by-slug?slug=some-brand",
				});
				expect(response.statusCode).toBe(404);
			});
			test("Delete added brand", async () => {
				const someBrandRequestBody: AddBrandRequestBody = {
					name: "Some brand",
					slug: "some-brand",
				} as const;
				const response = await testingEnvironment.app.inject({
					method: "POST",
					url: "/v1/brands",
					headers: {
						"content-type": "application/json",
					},
					payload: someBrandRequestBody,
				});
				const brandId = response.json().id;

				const response2 = await testingEnvironment.app.inject({
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
				const response = await testingEnvironment.app.inject({
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
				const response2 = await testingEnvironment.app.inject({
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
				const response = await testingEnvironment.app.inject({
					method: "POST",
					url: "/v1/brands",
					headers: {
						"content-type": "application/json",
					},
					payload: someBrandRequestBody,
				});
				const brandId = response.json().id;

				const response2 = await testingEnvironment.app.inject({
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
				const response = await testingEnvironment.app.inject({
					method: "POST",
					url: "/v1/brands",
					headers: {
						"content-type": "application/json",
					},
					payload: someBrandRequestBody,
				});
				const brandId = response.json().id;

				const response2 = await testingEnvironment.app.inject({
					method: "GET",
					url: `/v1/brand-by-slug?slug=some-brand`,
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
