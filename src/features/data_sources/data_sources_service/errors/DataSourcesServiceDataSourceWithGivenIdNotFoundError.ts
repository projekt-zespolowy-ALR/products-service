class DataSourcesServiceDataSourceWithGivenIdNotFoundError extends Error {
	public readonly dataSourceId: string;
	constructor(dataSourceId: string) {
		super(`DataSource with id ${dataSourceId} was not found.`);
		this.dataSourceId = dataSourceId;
	}
}

export default DataSourcesServiceDataSourceWithGivenIdNotFoundError;
