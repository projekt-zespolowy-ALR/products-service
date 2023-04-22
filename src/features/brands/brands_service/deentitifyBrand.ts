import Brand from "../types/Brand.js";
import type BrandEntity from "./BrandEntity.js";
import {plainToClass} from "class-transformer";

export default function deentitifyBrand(brandEntity: BrandEntity): Brand {
	return plainToClass(Brand, {
		id: brandEntity.id,
		name: brandEntity.name,
		slug: brandEntity.slug,
	});
}
