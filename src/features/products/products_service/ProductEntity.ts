import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	type Relation,
	JoinTable,
	ManyToMany,
	OneToMany,
	ManyToOne,
	OneToOne,
	JoinColumn,
} from "typeorm";
import BrandEntity from "../../brands/brands_service/BrandEntity.js";
import CategoryEntity from "../../categories/categories_service/CategoryEntity.js";
import IngredientsListEntity from "./IngredientsListEntity.js";
import ProductInCategoryEntity from "./ProductInCategoryEntity.js";

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

	@Column({name: "brand_id", nullable: true, type: "uuid"})
	public readonly brandId!: string | null;

	@Column({name: "ingredients_list_id", nullable: true, type: "uuid"})
	public readonly ingredientsListId!: string | null;

	@OneToMany(() => ProductInCategoryEntity, (productInCategory) => productInCategory.product)
	public readonly inCategories!: readonly Relation<ProductInCategoryEntity>[];

	@OneToMany(() => ProductInDataSourceEntity, (productInDataSource) => productInDataSource.product)
	public readonly inDataSources!: readonly Relation<ProductInDataSourceEntity>[];

	@ManyToOne(() => BrandEntity)
	@JoinColumn({name: "brand_id"})
	public readonly brand!: Relation<BrandEntity> | null;

	@OneToOne(() => IngredientsListEntity, {cascade: true})
	@JoinColumn({name: "ingredients_list_id", referencedColumnName: "id"})
	public readonly ingredientsList!: Relation<IngredientsListEntity> | null;
}

export default ProductEntity;
