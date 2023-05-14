import {plainToClass} from "class-transformer";
import DataSource from "../data_sources_controller/DataSource.js";
import type DataSourceEntity from "./DataSourceEntity.js";

export default function deentityifyDataSourceEntity(
	dataSourceEntity: DataSourceEntity
): DataSource {
	return plainToClass(DataSource, dataSourceEntity);
}
