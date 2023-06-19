import {Entity, Column, PrimaryGeneratedColumn, OneToMany, type Relation} from "typeorm";
import {IngredientInIngredientListEntity} from "../../products/ingredients_of_product/ingredients_of_product_service/IngredientInIngredientListEntity.js";

@Entity({name: "ingredients"})
export default class IngredientEntity {
	@PrimaryGeneratedColumn("uuid", {name: "id"})
	public readonly id!: string;
	@Column({name: "latin_name", type: "text"})
	public readonly latinName!: string;

	@Column({name: "slug", type: "text"})
	public readonly slug!: string;

	@OneToMany(
		() => IngredientInIngredientListEntity,
		(ingredientInList) => ingredientInList.ingredient
	)
	public readonly ingredientsInLists!: Relation<IngredientInIngredientListEntity>[];
}
