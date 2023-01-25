import {Entity, Column, PrimaryGeneratedColumn, Relation, ManyToMany, JoinTable} from "typeorm";
import ProductEntity from "../../products/products_service/ProductEntity.js";

@Entity({name: "categories"})
class CategoryEntity {
	@PrimaryGeneratedColumn("uuid", {name: "id"})
	public readonly id!: string;

	@Column({name: "slug", unique: true, type: "text"})
	public readonly slug!: string;

	@Column({name: "name", type: "text"})
	public readonly name!: string;

	@ManyToMany(() => ProductEntity, (product) => product.categories)
	@JoinTable({
		name: "products_in_categories",
		joinColumn: {
			name: "product_id",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "category_id",
			referencedColumnName: "id",
		},
	})
	public readonly products!: readonly Relation<ProductEntity>[];
}

export default CategoryEntity;
