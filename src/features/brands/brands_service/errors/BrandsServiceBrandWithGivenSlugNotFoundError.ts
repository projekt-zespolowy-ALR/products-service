class BrandsServiceBrandWithGivenSlugNotFoundError extends Error {
	public readonly brandSlug: string;
	constructor(brandSlug: string) {
		super(`Brand with slug ${brandSlug} was not found.`);
		this.brandSlug = brandSlug;
	}
}

export default BrandsServiceBrandWithGivenSlugNotFoundError;
