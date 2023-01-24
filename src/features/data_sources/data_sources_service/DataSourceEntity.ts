import {ProductInDataSourceEntity} from "../../products/index.js";

import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";

@Entity({name: "data_sources"})
class DataSourceEntity {
	@PrimaryGeneratedColumn("uuid", {name: "id"})
	public readonly id!: string;

	@Column({name: "name", type: "text"})
	public readonly name!: string;

	@Column({name: "slug", unique: true, type: "text"})
	public readonly slug!: string;

	@Column({name: "url", type: "text"})
	public readonly url!: string;

	@OneToMany(
		() => ProductInDataSourceEntity,
		(productInDataSource) => productInDataSource.dataSource
	)
	public readonly products!: readonly ProductInDataSourceEntity[];
}

export default DataSourceEntity;
