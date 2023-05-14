import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "dataSources"})
export default class DataSourceEntity {
	@PrimaryGeneratedColumn("uuid", {name: "id"})
	public readonly id!: string;
	@Column({name: "name", type: "text"})
	public readonly name!: string;

	@Column({name: "slug", type: "text"})
	public readonly slug!: string;

	@Column({name: "url", type: "text"})
	public readonly url!: string;
}
