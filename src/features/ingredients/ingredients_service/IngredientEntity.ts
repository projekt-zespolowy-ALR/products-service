import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "ingredients"})
export default class IngredientEntity {
	@PrimaryGeneratedColumn("uuid", {name: "id"})
	public readonly id!: string;
	@Column({name: "latin_name", type: "text"})
	public readonly latinName!: string;

	@Column({name: "slug", type: "text"})
	public readonly slug!: string;
}
