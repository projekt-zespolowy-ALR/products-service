class BrandsServiceBrandWithGivenSlugNotFoundError extends Error {
	public readonly slug: string;
	constructor(slug: string) {
		super(`Brand with slug ${slug} was not found.`);
		this.slug = slug;
	}
}

export default BrandsServiceBrandWithGivenSlugNotFoundError;
