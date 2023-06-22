import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	JoinColumn,
	type Relation,
	OneToOne,
	OneToMany,
} from "typeorm";

import ProductEntity from "../../products_service/ProductEntity.js";
import {IngredientInIngredientListEntity} from "./IngredientInIngredientListEntity.js";

@Entity({name: "ingredients_lists"})
export class IngredientListEntity {
	@PrimaryGeneratedColumn("uuid")
	public id!: string;

	@Column({type: "uuid", unique: true, nullable: false, name: "product_id"})
	public productId!: string;

	@OneToOne(() => ProductEntity, (product) => product.ingredientList, {onDelete: "CASCADE"})
	@JoinColumn({name: "product_id", referencedColumnName: "id"})
	public product!: Relation<ProductEntity>;

	@OneToMany(
		() => IngredientInIngredientListEntity,
		(ingredientInList) => ingredientInList.ingredientList
	)
	public ingredientsInList!: Relation<IngredientInIngredientListEntity>[];
}
