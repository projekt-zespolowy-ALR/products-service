class DataSourcesServiceDataSourceWithGivenSlugNotFoundError extends Error {
	public readonly dataSourceSlug: string;
	constructor(dataSourceSlug: string) {
		super(`Data source with slug ${dataSourceSlug} was not found.`);
		this.dataSourceSlug = dataSourceSlug;
	}
}

export default DataSourcesServiceDataSourceWithGivenSlugNotFoundError;
