class BrandsServiceBrandWithGivenIdNotFoundError extends Error {
	public readonly id: string;
	constructor(id: string) {
		super(`Brand with id ${id} was not found.`);
		this.id = id;
	}
}

export default BrandsServiceBrandWithGivenIdNotFoundError;
