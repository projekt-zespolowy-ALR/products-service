import type Brand from "../types/Brand.js";
import type BrandEntity from "./BrandEntity.js";

function deentitifyBrand(brandEntity: BrandEntity): Brand {
	return {
		id: brandEntity.id,
		name: brandEntity.name,
		slug: brandEntity.slug,
	};
}

export default deentitifyBrand;
