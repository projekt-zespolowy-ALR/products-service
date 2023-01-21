import {Entity, Column, PrimaryGeneratedColumn, OneToMany, Relation} from "typeorm";
import ProductInCategoryEntity from "./ProductInCategoryEntity.js";

@Entity({name: "products"})
class ProductEntity {
	@PrimaryGeneratedColumn("uuid", {name: "id"})
	public readonly id!: string;

	@Column({name: "name", nullable: true, type: "text"})
	public readonly name!: string | null;

	@Column({name: "slug", unique: true, type: "text"})
	public readonly slug!: string;

	@Column({name: "mass", nullable: true, type: "double precision"})
	public readonly mass!: number | null;

	@Column({name: "volume", nullable: true, type: "double precision"})
	public readonly volume!: number | null;

	@OneToMany(() => ProductInCategoryEntity, (productInCategory) => productInCategory.product)
	public readonly categories!: readonly Relation<ProductInCategoryEntity>[];
}

export default ProductEntity;
