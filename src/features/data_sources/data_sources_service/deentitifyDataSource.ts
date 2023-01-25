import DataSource from "../types/DataSource.js";
import DataSourceEntity from "./DataSourceEntity.js";

function deentitifyDataSource(dataSource: DataSourceEntity): DataSource {
	return {
		id: dataSource.id,
		name: dataSource.name,
		slug: dataSource.slug,
		url: dataSource.url,
	};
}

export default deentitifyDataSource;
