import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToMany,
	type Relation,
	OneToMany,
} from "typeorm";
import IngredientInIngredientsListEntity from "../../products/products_service/IngredientInIngredientsListEntity.js";
import IngredientsListEntity from "../../products/products_service/IngredientsListEntity.js";

@Entity({name: "ingredients"})
class IngredientEntity {
	@PrimaryGeneratedColumn("uuid", {name: "id"})
	public readonly id!: string;

	@Column({name: "slug", unique: true, type: "text", nullable: false})
	public readonly slug!: string;

	@Column({name: "name", type: "text", nullable: false})
	public readonly name!: string;

	@ManyToMany(() => IngredientsListEntity, (ingredientsList) => ingredientsList.inIngredients)
	public readonly ingredientsLists!: readonly Relation<IngredientsListEntity>[];

	@OneToMany(
		() => IngredientInIngredientsListEntity,
		(ingredientInIngredientsListEntity) => ingredientInIngredientsListEntity.ingredient
	)
	public readonly inIngredientsLists!: readonly Relation<IngredientInIngredientsListEntity>[];
}

export default IngredientEntity;
