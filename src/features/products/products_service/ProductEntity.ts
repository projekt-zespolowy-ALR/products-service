import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import BrandEntity from "../../brands/brands_service/BrandEntity.js";

@Entity({name: "products"})
export default class ProductEntity {
	@PrimaryGeneratedColumn("uuid", {name: "id"})
	public readonly id!: string;
	@Column({name: "slug", type: "text"})
	public readonly slug!: string;

	@Column({name: "mass_kilograms", type: "double precision", nullable: true})
	public readonly massKilograms!: number | null;

	@Column({name: "volume_liters", type: "double precision", nullable: true})
	public readonly volumeLiters!: number | null;

	@Column({name: "name", type: "text"})
	public readonly name!: string;

	@ManyToOne(() => BrandEntity)
	@JoinColumn({referencedColumnName: "id", name: "brand_id"})
	public readonly brand!: BrandEntity;
}
