import {Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, Unique, type Relation} from "typeorm";
import {IngredientListEntity} from "./IngredientListEntity.js";
import IngredientEntity from "../../../ingredients/ingredients_service/IngredientEntity.js";

@Entity({name: "ingredients_in_ingredients_lists"})
@Unique(["ingredientListId", "orderInList"])
export class IngredientInIngredientListEntity {
	@PrimaryColumn({type: "uuid", name: "ingredients_list_id"})
	public ingredientListId!: string;

	@PrimaryColumn({type: "uuid", name: "ingredient_id"})
	public ingredientId!: string;

	@ManyToOne(() => IngredientListEntity, (ingredientList) => ingredientList.ingredientsInList)
	@JoinColumn({name: "ingredients_list_id", referencedColumnName: "id"})
	public ingredientList!: Relation<IngredientListEntity>;

	@ManyToOne(() => IngredientEntity, (ingredient) => ingredient.ingredientsInLists)
	@JoinColumn({name: "ingredient_id", referencedColumnName: "id"})
	public ingredient!: Relation<IngredientEntity>;

	@Column({type: "integer", name: "order_in_list", nullable: false})
	public orderInList!: number;
}
