import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, type Relation} from "typeorm";
import ProductEntity from "./ProductEntity.js";
import {CategoryEntity} from "../categories/index.js";

@Entity({name: "products_in_categories"})
class ProductInCategoryEntity {
	@PrimaryGeneratedColumn("uuid", {name: "id"})
	public readonly id!: string;

	@Column({name: "product_id", type: "uuid"})
	public readonly product_id!: string;

	@Column({name: "category_id", type: "uuid"})
	public readonly category_id!: string;

	@ManyToOne(() => ProductEntity, (product) => product.categories)
	public readonly product!: Relation<ProductEntity>;

	@ManyToOne(() => CategoryEntity, (category) => category.products)
	public readonly category!: Relation<CategoryEntity>;
}

export default ProductInCategoryEntity;
