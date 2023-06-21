import {Entity, Column, PrimaryGeneratedColumn, type Relation, OneToMany} from "typeorm";
import {ProductInCategoryEntity} from "../../products/categories_of_product/categories_of_product_service/ProductInCategoryEntity.js";

@Entity({name: "categories"})
export default class CategoryEntity {
	@PrimaryGeneratedColumn("uuid", {name: "id"})
	public readonly id!: string;
	@Column({name: "name", type: "text", nullable: true})
	public readonly name!: string | null;

	@Column({name: "slug", type: "text"})
	public readonly slug!: string;

	@OneToMany(
		() => ProductInCategoryEntity,
		(productInCategoryEntity) => productInCategoryEntity.category
	)
	public readonly productInCategories!: Relation<ProductInCategoryEntity>[];
}
