import {ApiProperty} from "@nestjs/swagger";
import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "products"})
class ProductEntity {
	@ApiProperty()
	@PrimaryGeneratedColumn("uuid", {name: "id"})
	public readonly id!: string;
	@ApiProperty()
	@Column({name: "name", nullable: true, type: "text"})
	public readonly name!: string | null;

	@ApiProperty()
	@Column({name: "slug", unique: true, type: "text"})
	public readonly slug!: string;

	@ApiProperty()
	@Column({name: "mass", nullable: true, type: "double precision"})
	public readonly mass!: number | null;

	@ApiProperty()
	@Column({name: "volume", nullable: true, type: "double precision"})
	public readonly volume!: number | null;
}

export default ProductEntity;
