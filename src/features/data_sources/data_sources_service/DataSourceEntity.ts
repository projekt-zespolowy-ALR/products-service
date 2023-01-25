import {Entity, Column, PrimaryGeneratedColumn, OneToMany, Relation} from "typeorm";
import ProductInDataSourceEntity from "../../products/products_service/ProductInDataSourceEntity.js";

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
	public readonly products!: readonly Relation<ProductInDataSourceEntity>[];
}

export default DataSourceEntity;
