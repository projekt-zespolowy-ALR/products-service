import ProductEntity from "../../products/products_service/ProductEntity.js";

import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	JoinColumn,
	type Relation,
} from "typeorm";

@Entity({name: "brands"})
export default class BrandEntity {
	@PrimaryGeneratedColumn("uuid", {name: "id"})
	public readonly id!: string;
	@Column({name: "name", type: "text"})
	public readonly name!: string;

	@Column({name: "slug", type: "text"})
	public readonly slug!: string;

	@OneToMany(() => ProductEntity, (product) => product.brand)
	@JoinColumn({referencedColumnName: "id", name: "brand_id"})
	public readonly products!: readonly Relation<ProductEntity>[];
}
