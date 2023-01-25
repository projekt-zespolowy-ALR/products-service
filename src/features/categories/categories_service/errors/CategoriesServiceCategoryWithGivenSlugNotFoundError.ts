class CategoriesServiceCategoryWithGivenSlugNotFoundError extends Error {
	public readonly slug: string;
	constructor(slug: string) {
		super(`Category with slug ${slug} was not found.`);
		this.slug = slug;
	}
}

export default CategoriesServiceCategoryWithGivenSlugNotFoundError;
