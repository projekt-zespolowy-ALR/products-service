import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "brands"})
class BrandEntity {
	@PrimaryGeneratedColumn("uuid", {name: "id"})
	public readonly id!: string;

	@Column({name: "slug", unique: true, type: "text"})
	public readonly slug!: string;

	@Column({name: "name", type: "text"})
	public readonly name!: string;
}

export default BrandEntity;
