import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import type {OfferEntity} from "../../offers/OfferEntity.js";

@Entity({name: "data_sources"})
export default class DataSourceEntity {
	@PrimaryGeneratedColumn("uuid", {name: "id"})
	public readonly id!: string;
	@Column({name: "name", type: "text"})
	public readonly name!: string;

	@Column({name: "slug", type: "text"})
	public readonly slug!: string;

	@Column({name: "url", type: "text"})
	public readonly url!: string;

	@OneToMany(() => DataSourceEntity, (dataSource) => dataSource.offers)
	public readonly offers!: OfferEntity[];
}
