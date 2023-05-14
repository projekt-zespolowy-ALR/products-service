export default class CategoriesServiceCategoryWithGivenIdNotFoundError extends Error {
	public readonly categoryId: string;

	public constructor(categoryId: string) {
		super(`Category with id ${categoryId} not found`);
		this.categoryId = categoryId;
	}
}
