import {Entity, JoinColumn, ManyToOne, PrimaryColumn, type Relation} from "typeorm";
import CategoryEntity from "../../categories/categories_service/CategoryEntity.js";
import ProductEntity from "./ProductEntity.js";

@Entity({name: "products_in_categories"})
class ProductInCategoryEntity {
	@ManyToOne(() => ProductEntity, (product) => product.inCategories)
	@JoinColumn({name: "product_id"})
	public readonly product!: Relation<ProductEntity>;

	@ManyToOne(() => CategoryEntity, (category) => category.inProducts)
	@JoinColumn({name: "category_id"})
	public readonly category!: Relation<CategoryEntity>;

	@PrimaryColumn({name: "product_id", type: "uuid"})
	public readonly productId!: string;

	@PrimaryColumn({name: "category_id", type: "uuid"})
	public readonly categoryId!: string;
}

export default ProductInCategoryEntity;
