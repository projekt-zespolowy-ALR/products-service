class CategoriesServiceCategoryWithGivenIdNotFoundError extends Error {
	public readonly categoryId: string;
	constructor(categoryId: string) {
		super(`Category with id ${categoryId} was not found.`);
		this.categoryId = categoryId;
	}
}

export default CategoriesServiceCategoryWithGivenIdNotFoundError;
