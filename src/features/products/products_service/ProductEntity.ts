import BrandEntity from "../../brands/brands_service/BrandEntity.js";

import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	OneToMany,
	type Relation,
} from "typeorm";
import UserFavoriteProductEntity from "../../user_favorite_products/user_favorite_products_service/UserFavoriteProductEntity.js";
import {OfferEntity} from "../../offers/OfferEntity.js";

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

	@ManyToOne(() => BrandEntity, (brand) => brand.products)
	@JoinColumn({referencedColumnName: "id", name: "brand_id"})
	public readonly brand!: Relation<BrandEntity>;

	@Column({name: "brand_id", type: "uuid"})
	public readonly brandId!: string;

	@OneToMany(() => UserFavoriteProductEntity, (userFavoriteProduct) => userFavoriteProduct.product)
	public readonly userFavoriteProducts!: Relation<UserFavoriteProductEntity>[];

	@OneToMany(() => OfferEntity, (offer) => offer.product)
	public readonly offers!: Relation<OfferEntity>[];
}
