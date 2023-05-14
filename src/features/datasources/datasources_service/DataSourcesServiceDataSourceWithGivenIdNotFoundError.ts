export default class BrandsServiceBrandWithGivenIdNotFoundError extends Error {
	public readonly dataSourceId: string;

	public constructor(dataSourceId: string) {
		super(`Brand with id ${dataSourceId} not found`);
		this.dataSourceId = dataSourceId;
	}
}
