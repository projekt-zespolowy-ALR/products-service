export default class BrandsServiceBrandWithGivenIdNotFoundError extends Error {
	public readonly brandId: string;

	public constructor(brandId: string) {
		super(`Brand with id ${brandId} not found`);
		this.brandId = brandId;
	}
}
