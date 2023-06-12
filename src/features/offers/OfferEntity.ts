import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, type Relation} from "typeorm";
import ProductEntity from "../products/products_service/ProductEntity.js";
import DataSourceEntity from "../data_sources/data_sources_service/DataSourceEntity.js";

@Entity({name: "offers"})
export class OfferEntity {
	@PrimaryColumn({name: "product_id", type: "uuid"})
	public readonly productId!: string;

	@PrimaryColumn({name: "data_source_id", type: "uuid"})
	public readonly dataSourceId!: string;

	@Column({name: "reference_url", type: "text", nullable: true})
	public readonly referenceUrl!: string | null;

	@Column({name: "image_url", type: "text", nullable: true})
	public readonly imageUrl!: string | null;

	@Column({name: "description", type: "text", nullable: true})
	public readonly description!: string | null;

	@Column({name: "price_pln", type: "numeric", precision: 10, scale: 2, nullable: true})
	public readonly pricePln!: string | null;

	@ManyToOne(() => ProductEntity, (product) => product.offers)
	@JoinColumn({referencedColumnName: "id", name: "product_id"})
	public readonly product!: Relation<ProductEntity>;

	@ManyToOne(() => DataSourceEntity, (dataSource) => dataSource.offers)
	@JoinColumn({referencedColumnName: "id", name: "data_source_id"})
	public readonly dataSource!: Relation<DataSourceEntity>;
}
