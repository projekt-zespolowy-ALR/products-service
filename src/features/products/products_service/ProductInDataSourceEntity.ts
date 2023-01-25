import ProductEntity from "./ProductEntity.js";
import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, type Relation} from "typeorm";
import DataSourceEntity from "../../data_sources/data_sources_service/DataSourceEntity.js";

@Entity({name: "products_in_data_sources"})
class ProductInDataSourceEntity {
	@PrimaryColumn({name: "product_id", type: "uuid"})
	public readonly productId!: string;

	@PrimaryColumn({name: "data_source_id", type: "uuid"})
	public readonly dataSourceId!: string;

	@Column({name: "reference_url", type: "text"})
	public readonly referenceUrl!: string | null;

	@Column({name: "image_url", type: "text"})
	public readonly imageUrl!: string | null;

	@Column({name: "price", type: "numeric"})
	public readonly price!: number | null;

	@Column({name: "description", type: "text"})
	public readonly description!: string | null;

	@ManyToOne(() => ProductEntity, (product) => product.inDataSources)
	@JoinColumn({name: "product_id"})
	public readonly product!: Relation<ProductEntity>;

	@ManyToOne(() => DataSourceEntity, (dataSource) => dataSource.products)
	@JoinColumn({name: "data_source_id"})
	public readonly dataSource!: Relation<DataSourceEntity>;
}

export default ProductInDataSourceEntity;