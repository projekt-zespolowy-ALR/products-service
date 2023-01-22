import {Column, Entity, ManyToOne, PrimaryColumn, type Relation} from "typeorm";
import DataSourceEntity from "../../data_sources/data_sources_service/DataSourceEntity.js";
import ProductEntity from "./ProductEntity.js";

@Entity({name: "products_in_data_sources"})
class ProductInDataSourceEntity {
	@PrimaryColumn({name: "product_id", type: "uuid"})
	public readonly productId!: string;

	@PrimaryColumn({name: "data_source_id", type: "uuid"})
	public readonly dataSourceId!: string;

	@Column({name: "reference_url", type: "text"})
	public readonly referenceUrl!: string;

	@Column({name: "image_url", type: "text"})
	public readonly imageUrl!: string;

	@Column({name: "price", type: "numeric"})
	public readonly price!: number;

	@ManyToOne(() => ProductEntity, (product) => product.dataSources)
	public readonly product!: Relation<ProductEntity>;

	@ManyToOne(() => DataSourceEntity, (dataSource) => dataSource.products)
	public readonly dataSource!: Relation<DataSourceEntity>;
}

export default ProductInDataSourceEntity;
