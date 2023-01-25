import type DataSource from "../types/DataSource.d.js";
import type DataSourceEntity from "./DataSourceEntity.js";

function deentitifyDataSource(dataSourceEntity: DataSourceEntity): DataSource {
	return {
		id: dataSourceEntity.id,
		name: dataSourceEntity.name,
		slug: dataSourceEntity.slug,
		url: dataSourceEntity.url,
	};
}

export default deentitifyDataSource;
