// CREATE TABLE user_favourite_products (
// 	user_id UUID NOT NULL,
// 	product_id UUID NOT NULL,
// 	FOREIGN KEY (product_id) REFERENCES products (id),
// 	PRIMARY KEY (user_id, product_id)
// );

import {Entity, ManyToOne, type Relation, JoinColumn, PrimaryColumn} from "typeorm";
import ProductEntity from "../../products/products_service/ProductEntity.js";

@Entity({name: "user_favorite_products"})
export default class UserFavoriteProductEntity {
	@PrimaryColumn({name: "user_id", type: "uuid"})
	public readonly userId!: string;

	@PrimaryColumn({name: "product_id", type: "uuid"})
	public readonly productId!: string;

	@ManyToOne(() => ProductEntity, (productEntity) => productEntity.userFavoriteProducts)
	@JoinColumn({name: "product_id", referencedColumnName: "id"})
	public readonly product!: Relation<ProductEntity>;
}
