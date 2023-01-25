import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	Relation,
	JoinTable,
	ManyToMany,
	OneToMany,
} from "typeorm";
import CategoryEntity from "../../categories/categories_service/CategoryEntity.js";

import ProductInDataSourceEntity from "./ProductInDataSourceEntity.js";

@Entity({name: "products"})
class ProductEntity {
	@PrimaryGeneratedColumn("uuid", {name: "id"})
	public readonly id!: string;

	@Column({name: "name", nullable: true, type: "text"})
	public readonly name!: string | null;

	@Column({name: "slug", unique: true, type: "text"})
	public readonly slug!: string;

	@Column({name: "mass", nullable: true, type: "double precision"})
	public readonly mass!: number | null;

	@Column({name: "volume", nullable: true, type: "double precision"})
	public readonly volume!: number | null;

	@ManyToMany(() => CategoryEntity, (category) => category.products)
	@JoinTable({
		name: "products_in_categories",
		joinColumn: {
			name: "product_id",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "category_id",
			referencedColumnName: "id",
		},
	})
	public readonly categories!: readonly Relation<CategoryEntity>[];

	@OneToMany(
		() => ProductInDataSourceEntity,
		(productInDataSource) => productInDataSource.product,
		{cascade: true}
	)
	public readonly inDataSources!: readonly Relation<ProductInDataSourceEntity>[];
}

export default ProductEntity;
