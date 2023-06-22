import {Entity, type Relation, PrimaryColumn, ManyToOne, JoinColumn} from "typeorm";
import ProductEntity from "../../products_service/ProductEntity.js";
import CategoryEntity from "../../../categories/categories_service/CategoryEntity.js";

@Entity({name: "products_in_categories"})
export class ProductInCategoryEntity {
	@PrimaryColumn({name: "product_id", type: "uuid"})
	public readonly productId!: string;

	@PrimaryColumn({name: "category_id", type: "uuid"})
	public readonly categoryId!: string;

	@ManyToOne(() => ProductEntity, (productEntity) => productEntity.productInCategories, {
		onDelete: "CASCADE",
	})
	@JoinColumn({
		name: "product_id",
		referencedColumnName: "id",
	})
	public readonly product!: Relation<ProductEntity>;

	@ManyToOne(() => CategoryEntity, (categoryEntity) => categoryEntity.productInCategories, {
		onDelete: "CASCADE",
	})
	@JoinColumn({
		name: "category_id",
		referencedColumnName: "id",
	})
	public readonly category!: Relation<CategoryEntity>;
}
