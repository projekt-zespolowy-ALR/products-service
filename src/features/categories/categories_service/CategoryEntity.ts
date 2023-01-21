import {Entity, Column, PrimaryGeneratedColumn, OneToMany, Relation} from "typeorm";
import {ProductInCategoryEntity} from "../../products/index.js";

@Entity({name: "categories"})
class CategoryEntity {
	@PrimaryGeneratedColumn("uuid", {name: "id"})
	public readonly id!: string;

	@Column({name: "slug", unique: true, type: "text"})
	public readonly slug!: string;

	@Column({name: "name", type: "text"})
	public readonly name!: string;

	@OneToMany(() => ProductInCategoryEntity, (productInCategory) => productInCategory.category)
	public readonly products!: readonly Relation<ProductInCategoryEntity>[];
}

export default CategoryEntity;
