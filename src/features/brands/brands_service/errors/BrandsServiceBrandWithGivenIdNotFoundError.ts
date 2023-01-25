class BrandsServiceBrandWithGivenIdNotFoundError extends Error {
	public readonly brandId: string;
	constructor(brandId: string) {
		super(`Brand with id ${brandId} was not found.`);
		this.brandId = brandId;
	}
}

export default BrandsServiceBrandWithGivenIdNotFoundError;
