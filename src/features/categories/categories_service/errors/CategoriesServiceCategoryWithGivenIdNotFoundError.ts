class CategoriesServiceCategoryWithGivenIdNotFoundError extends Error {
	public readonly id: string;
	constructor(id: string) {
		super(`Category with id ${id} was not found.`);
		this.id = id;
	}
}

export default CategoriesServiceCategoryWithGivenIdNotFoundError;
