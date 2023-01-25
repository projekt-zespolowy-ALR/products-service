class CategoriesServiceCategoryWithGivenSlugNotFoundError extends Error {
	public readonly categorySlug: string;
	constructor(categorySlug: string) {
		super(`Category with slug ${categorySlug} was not found.`);
		this.categorySlug = categorySlug;
	}
}

export default CategoriesServiceCategoryWithGivenSlugNotFoundError;
