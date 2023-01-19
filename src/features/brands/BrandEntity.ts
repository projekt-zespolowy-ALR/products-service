import {ApiProperty} from "@nestjs/swagger";
import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "brands"})
class BrandEntity {
	@ApiProperty()
	@PrimaryGeneratedColumn("uuid", {name: "id"})
	public readonly id!: string;

	@ApiProperty()
	@Column({name: "slug", unique: true, type: "text"})
	public readonly slug!: string;

	@ApiProperty()
	@Column({name: "name", type: "text"})
	public readonly name!: string;
}

export default BrandEntity;
