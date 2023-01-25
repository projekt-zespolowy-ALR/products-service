import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "brands"})
class BrandEntity {
	@PrimaryGeneratedColumn("uuid", {name: "id"})
	public readonly id!: string;

	@Column({name: "slug", unique: true, type: "text", nullable: false})
	public readonly slug!: string;

	@Column({name: "name", type: "text", nullable: false})
	public readonly name!: string;
}

export default BrandEntity;
